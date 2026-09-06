import type { Express } from "express";

// ── 사용자별 질문/피드백 통계 API ──────────────────────────────────
// [2026-09] "누가 몇 번 질문했는지", "누가 좋아요/아쉬워요를 남겼는지"를 관리자가
// 확인할 수 있도록 추가. ai_question_log(질문 로그)와 ai_feedback(좋아요/아쉬워요)을
// employee_id 기준으로 집계한다.
//
// 주의: 좋아요/아쉬워요를 누르지 않는 사용자도 많으므로(질문/답변이 마음에 들면
// 오히려 반응을 안 남기는 경향), 이 통계만으로 "만족도"를 단정하지 않는다 —
// 질문 횟수 대비 피드백 비율(참여율) 정도로 해석하는 것이 안전하다.

export function registerUserStatsRoutes(app: Express) {
  // 관리자 모드: 사용자별 질문 수 + 좋아요/아쉬워요 수 집계
  app.get("/api/user-stats", async (req, res) => {
    try {
      const { pool } = await import("../db");

      const rows = await pool.query(`
        WITH q AS (
          SELECT employee_id, employee_name, team, COUNT(*) AS question_count,
                 MAX(created_at) AS last_question_at
          FROM ai_question_log
          WHERE employee_id IS NOT NULL AND employee_id != ''
          GROUP BY employee_id, employee_name, team
        ),
        f AS (
          SELECT employee_id,
                 COUNT(*) FILTER (WHERE rating = 1) AS thumbs_up_count,
                 COUNT(*) FILTER (WHERE rating = -1) AS thumbs_down_count
          FROM ai_feedback
          WHERE employee_id IS NOT NULL AND employee_id != ''
          GROUP BY employee_id
        )
        SELECT
          COALESCE(q.employee_id, f.employee_id) AS employee_id,
          q.employee_name,
          q.team,
          COALESCE(q.question_count, 0) AS question_count,
          COALESCE(f.thumbs_up_count, 0) AS thumbs_up_count,
          COALESCE(f.thumbs_down_count, 0) AS thumbs_down_count,
          q.last_question_at
        FROM q
        FULL OUTER JOIN f ON q.employee_id = f.employee_id
        ORDER BY question_count DESC NULLS LAST
      `);

      // 익명(로그인 정보 없이 보낸) 질문/피드백 개수도 참고용으로 함께 반환
      const anon = await pool.query(`
        SELECT
          (SELECT COUNT(*) FROM ai_question_log WHERE employee_id IS NULL OR employee_id = '') AS anon_question_count,
          (SELECT COUNT(*) FROM ai_feedback WHERE employee_id IS NULL OR employee_id = '') AS anon_feedback_count
      `);

      res.json({ users: rows.rows, anonymous: anon.rows[0] });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "사용자 통계 조회 실패" });
    }
  });

  // [TEMP-2026-09] 기능 검증 중 남긴 테스트 데이터(TEST001) 정리용 임시 엔드포인트.
  // 실행 후 바로 코드에서 제거할 예정 — 상시 운영 API 아님.
  app.post("/api/_temp/cleanup-test-user-stats", async (req, res) => {
    try {
      const { pool } = await import("../db");
      const q = await pool.query(`DELETE FROM ai_question_log WHERE employee_id = 'TEST001' RETURNING id`);
      const f = await pool.query(`DELETE FROM ai_feedback WHERE employee_id = 'TEST001' RETURNING id`);
      res.json({ deletedQuestionLogs: q.rows.length, deletedFeedback: f.rows.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "정리 실패" });
    }
  });
}
