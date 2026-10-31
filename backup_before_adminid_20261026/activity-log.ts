import type { Express } from "express";

// ── 자료 조회 기록 API ──────────────────────────────────────────────
// [2026-10] AI 질문 없이 자료만 조회하는 이용자가 있는지 파악하기 위한 활동 로그.
// 클라이언트가 하단 탭을 옮기거나 주요 항목(검사기준 조문, 검사가이드 항목, 기술자료,
// 법령개정)을 열 때 가볍게 POST하고, 관리자 사용량 패널이 AI 질문 로그(ai_question_log)와
// 합쳐서 이용자별로 보여준다. 보관기간은 90일(app.ts의 purgeOldActivityLog).
//
// 쓰기(POST)는 실패해도 화면에 영향이 없어야 하므로 클라이언트가 fire-and-forget으로 보낸다.
// 읽기(GET)는 이용자 개인별 열람 내역이므로 관리자에게만 응답한다 — 판정은 다른 관리자 전용
// GET들과 같은 방식(클라이언트가 보내는 admin 플래그 + 노준호 계정 더블체크)이다.

const ALLOWED_PAGES = new Set([
  "AI검색", "표준화&기술자료", "검사가이드", "검사기준", "정밀안전검사", "메모", "안전보건", "채팅",
]);

function isAdminRequest(req: any): boolean {
  const { admin, employeeId, employeeName } = req.query as { admin?: string; employeeId?: string; employeeName?: string };
  return admin === "true" || (employeeId === "910919" && employeeName === "노준호");
}

export function registerActivityLogRoutes(app: Express) {
  // 조회 기록 저장 — 로그인 정보가 없으면(익명) 저장하지 않는다.
  app.post("/api/activity-log", async (req, res) => {
    try {
      const { employeeId, employeeName, team, page, detail } = req.body as {
        employeeId?: string; employeeName?: string; team?: string; page?: string; detail?: string;
      };
      if (!employeeId || !page || !ALLOWED_PAGES.has(page)) return res.status(204).end();
      const { pool } = await import("../db");
      // 같은 사람이 같은 화면·항목을 30초 안에 다시 연 경우(탭 왔다갔다, 리렌더)는 한 번만 기록한다.
      await pool.query(
        // 파라미터를 SELECT 목록과 비교식에서 함께 쓰면 PostgreSQL이 타입을 서로 다르게 추론해
        // "inconsistent types deduced for parameter" 오류가 나므로 모두 ::text로 명시한다.
        `INSERT INTO activity_log (employee_id, employee_name, team, page, detail)
         SELECT $1::text, $2::text, $3::text, $4::text, $5::text
         WHERE NOT EXISTS (
           SELECT 1 FROM activity_log
           WHERE employee_id = $1::text AND page = $4::text AND COALESCE(detail, '') = COALESCE($5::text, '')
             AND created_at > NOW() - INTERVAL '30 seconds'
         )`,
        [
          String(employeeId).slice(0, 50),
          employeeName ? String(employeeName).slice(0, 50) : null,
          team ? String(team).slice(0, 50) : null,
          page,
          detail ? String(detail).slice(0, 200) : null,
        ]
      );
      res.status(204).end();
    } catch (e) {
      // 조회 기록 실패가 사용자 흐름에 영향을 주면 안 되므로 응답은 정상(204)으로 하되,
      // 원인 파악을 위해 서버 로그에는 남긴다(예전에는 완전히 삼켜서 저장 실패를 몰랐다).
      console.error("[조회기록] 저장 실패:", (e as any)?.message || e);
      res.status(204).end();
    }
  });

  // 관리자: 이번 달 이용자별 활동 요약 (AI 질문 수 + 조회 수 + 마지막 활동)
  app.get("/api/activity-stats", async (req, res) => {
    if (!isAdminRequest(req)) return res.status(403).json({ error: "관리자만 볼 수 있습니다" });
    try {
      const { pool } = await import("../db");
      const rows = await pool.query(`
        WITH v AS (
          SELECT employee_id, MAX(employee_name) AS employee_name, MAX(team) AS team,
                 COUNT(*) AS view_count, MAX(created_at) AS last_view
          FROM activity_log
          WHERE created_at >= date_trunc('month', NOW()) AND employee_id IS NOT NULL AND employee_id != ''
          GROUP BY employee_id
        ),
        q AS (
          SELECT employee_id, MAX(employee_name) AS employee_name, MAX(team) AS team,
                 COUNT(*) AS question_count, MAX(created_at) AS last_question
          FROM ai_question_log
          WHERE created_at >= date_trunc('month', NOW()) AND employee_id IS NOT NULL AND employee_id != ''
          GROUP BY employee_id
        )
        SELECT COALESCE(v.employee_id, q.employee_id) AS employee_id,
               COALESCE(q.employee_name, v.employee_name) AS employee_name,
               COALESCE(q.team, v.team) AS team,
               COALESCE(q.question_count, 0)::int AS question_count,
               COALESCE(v.view_count, 0)::int AS view_count,
               GREATEST(v.last_view, q.last_question) AS last_active
        FROM v FULL OUTER JOIN q ON v.employee_id = q.employee_id
        ORDER BY last_active DESC NULLS LAST
        LIMIT 300
      `);
      const users = rows.rows;
      const summary = {
        visitors: users.length,
        aiUsers: users.filter((u: any) => u.question_count > 0).length,
        browseOnly: users.filter((u: any) => u.question_count === 0).length,
      };
      res.json({ summary, users });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "활동 통계 조회 실패" });
    }
  });

  // 관리자: 특정 이용자의 최근 조회 내역
  app.get("/api/activity-log/user/:employeeId", async (req, res) => {
    if (!isAdminRequest(req)) return res.status(403).json({ error: "관리자만 볼 수 있습니다" });
    try {
      const { pool } = await import("../db");
      const limit = Math.min(Math.max(parseInt(String(req.query.limit || "10"), 10) || 10, 1), 50);
      const rows = await pool.query(
        `SELECT page, detail, created_at FROM activity_log
         WHERE employee_id = $1 ORDER BY created_at DESC LIMIT $2`,
        [req.params.employeeId, limit]
      );
      res.json({ entries: rows.rows });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "조회 내역 조회 실패" });
    }
  });
}
