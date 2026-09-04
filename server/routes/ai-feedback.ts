import type { Express } from "express";

// ── Firebase Admin SDK 초기화 (부정 피드백 누적 시 관리자 FCM 알림용) ──
// routes.ts의 기존 초기화(2210줄 근처)와 동일한 패턴 — admin.apps.length로 중복
// initializeApp을 막는 idempotent 방식이라, 여기서 독립적으로 한 번 더 두어도 안전하다.
let firebaseAdmin: any = null;
(async () => {
  try {
    const admin = await import("firebase-admin");
    if (!admin.default.apps.length) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_ADMINSDK || "{}");
      admin.default.initializeApp({
        credential: admin.default.credential.cert(serviceAccount),
      });
    }
    firebaseAdmin = admin.default;
  } catch (e) {
    console.error("[FCM] Firebase Admin 초기화 실패 (ai-feedback):", e);
  }
})();

// ── AI 답변 피드백 API ──────────────────────────────────────────
// [2026-09] routes.ts(4000줄 근처)에 몰려있던 AI 피드백 관리 관련 엔드포인트
// (좋아요/아쉬워요 저장, 질문 임베딩 클러스터링, 관리자 모니터링 패널용 조회/제외)를
// 이 파일로 분리했다. registerRoutes()에서 registerAiFeedbackRoutes(app)로 마운트한다.
// 기존 로직/쿼리/응답 형식은 전혀 바꾸지 않고 그대로 옮겼다 — 순수 파일 분리.

// OpenAI 임베딩 생성 헬퍼 (네트워크가 막혀있는 등의 상황에서 무한 대기하지 않도록 8초 타임아웃)
async function getEmbedding(text: string): Promise<number[] | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const resp = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text.slice(0, 8000),
      }),
      signal: controller.signal,
    });
    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      console.error(`[임베딩] OpenAI 응답 오류 status=${resp.status}:`, errText.slice(0, 300));
      return null;
    }
    const data = await resp.json();
    return data?.data?.[0]?.embedding || null;
  } catch (e) {
    console.error("[임베딩] 생성 실패:", e);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// 질문 임베딩 유사도로 answer_pool 클러스터링 — POST /api/ai-feedback 및 재구축(rebuild) 양쪽에서 공유
// (질문 문자열이나 답변 문자열이 토씨 하나라도 다르면 별개로 취급하던 기존 방식은
//  LLM 답변이 매번 표현이 달라지는 특성상 사실상 절대 3표 문턱에 도달하지 못했음.
//  → 질문을 임베딩해 기존 클러스터들과 코사인 유사도를 비교, 표현이 달라도
//  같은 취지의 질문이면 같은 클러스터로 묶어 좋아요/아쉬워요를 누적한다)
const CLUSTER_SIMILARITY_THRESHOLD = 0.88;
async function applyFeedbackToPool(pool: any, question: string, answer: string, rating: number) {
  const questionEmbedding = await getEmbedding(question);
  return applyFeedbackToPoolWithEmbedding(pool, question, answer, rating, questionEmbedding);
}
// 임베딩을 미리 계산해둔 경우(재구축 시 여러 건을 병렬로 임베딩 후 순차 반영할 때) 사용하는 버전
async function applyFeedbackToPoolWithEmbedding(pool: any, question: string, answer: string, rating: number, questionEmbedding: number[] | null) {
  if (!questionEmbedding) {
    console.error("[피드백 클러스터링] OpenAI 임베딩 생성 실패 — 이 피드백은 독립 클러스터로 저장됩니다 (OPENAI_API_KEY 확인 필요)");
  }

  let matched: { id: number; thumbs_up: number; thumbs_down: number; status: string } | null = null;
  if (questionEmbedding) {
    const vecStr = `[${questionEmbedding.join(",")}]`;
    const nearest = await pool.query(
      `SELECT id, thumbs_up, thumbs_down, status, 1 - (embedding <=> $1::vector) as similarity
       FROM ai_answer_pool WHERE embedding IS NOT NULL
       ORDER BY embedding <=> $1::vector LIMIT 1`,
      [vecStr]
    );
    if (nearest.rows.length > 0 && nearest.rows[0].similarity >= CLUSTER_SIMILARITY_THRESHOLD) {
      matched = nearest.rows[0];
    }
  }
  const previousStatus = matched ? matched.status : 'pending';

  let thumbsUp = 0, thumbsDown = 0, poolId;
  if (matched) {
    poolId = matched.id;
    thumbsUp = matched.thumbs_up + (rating === 1 ? 1 : 0);
    thumbsDown = matched.thumbs_down + (rating === -1 ? 1 : 0);
    // 좋아요를 받은 경우 클러스터 대표 답변을 이번 답변으로 갱신 (참고 자료가 계속 최신 상태 유지)
    if (rating === 1) {
      await pool.query(
        `UPDATE ai_answer_pool SET thumbs_up = $1, thumbs_down = $2, answer = $3, updated_at = NOW() WHERE id = $4`,
        [thumbsUp, thumbsDown, answer, poolId]
      );
    } else {
      await pool.query(
        `UPDATE ai_answer_pool SET thumbs_up = $1, thumbs_down = $2, updated_at = NOW() WHERE id = $3`,
        [thumbsUp, thumbsDown, poolId]
      );
    }
  } else {
    // 유사한 기존 클러스터가 없으면 새 클러스터 생성 (임베딩 생성 실패 시 embedding은 NULL로 저장 — 추후 매칭 대상에서만 제외되고 pending으로는 유지)
    thumbsUp = rating === 1 ? 1 : 0;
    thumbsDown = rating === -1 ? 1 : 0;
    const vecStr = questionEmbedding ? `[${questionEmbedding.join(",")}]` : null;
    const inserted = await pool.query(
      `INSERT INTO ai_answer_pool (question, answer, thumbs_up, thumbs_down, embedding) VALUES ($1, $2, $3, $4, $5::vector) RETURNING id`,
      [question, answer, thumbsUp, thumbsDown, vecStr]
    );
    poolId = inserted.rows[0].id;
  }

  // 상태 자동 분류: 고정 3표 문턱 대신 순 점수(좋아요-아쉬워요)로 판단 —
  // 사용자 수가 적어 같은 취지의 질문에 3명이 좋아요를 누르는 일이 드물기 때문에,
  // 첫 좋아요부터 바로 승인하고 이후 아쉬워요가 더 쌓이면 즉시 재검토(제외)되도록 함
  let newStatus: 'pending' | 'approved' | 'excluded' = 'pending';
  if (thumbsUp > thumbsDown) newStatus = 'approved';
  else if (thumbsDown > thumbsUp) newStatus = 'excluded';
  await pool.query(`UPDATE ai_answer_pool SET status = $1 WHERE id = $2`, [newStatus, poolId]);

  const statusChangedToExcluded = previousStatus !== 'excluded' && newStatus === 'excluded';
  return { poolId, thumbsUp, thumbsDown, newStatus, matchedExisting: !!matched, statusChangedToExcluded };
}

export function registerAiFeedbackRoutes(app: Express) {
  // 유사 질문 검색 — approved 답변 중 가장 유사한 것 반환
  app.post("/api/ai-similar-answers", async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) return res.json([]);
      const embedding = await getEmbedding(question);
      if (!embedding) return res.json([]);

      const { pool } = await import("../db");
      const vecStr = `[${embedding.join(",")}]`;
      const rows = await pool.query(
        `SELECT question, answer, thumbs_up,
                1 - (embedding <=> $1::vector) as similarity
         FROM ai_answer_pool
         WHERE status = 'approved' AND embedding IS NOT NULL
         ORDER BY embedding <=> $1::vector
         LIMIT 2`,
        [vecStr]
      );
      // 유사도 0.82 이상만 반환 (너무 다른 질문 배제)
      const filtered = rows.rows.filter((r: any) => r.similarity >= 0.82);
      res.json(filtered);
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/ai-feedback", async (req, res) => {
    try {
      const { question, answer, rating, sections, reasons, comment } = req.body;
      if (!question || !answer || ![1, -1].includes(rating)) {
        return res.status(400).json({ error: "잘못된 요청" });
      }
      const { pool } = await import("../db");

      // 1) 피드백 로그 저장 (섹션/이유/기타의견 포함)
      await pool.query(
        `INSERT INTO ai_feedback (question, answer, rating, sections, reasons, comment) VALUES ($1, $2, $3, $4, $5, $6)`,
        [question, answer, rating, sections || [], reasons || [], comment || null]
      );

      // 2) answer_pool 업데이트 — 질문 임베딩 유사도로 클러스터링해서 누적 (공유 헬퍼 사용)
      const { thumbsUp, thumbsDown, newStatus, statusChangedToExcluded } = await applyFeedbackToPool(pool, question, answer, rating);

      // 3) 클러스터가 새로 제외(excluded) 상태로 전환되는 순간 관리자(노준호, 사번 910919)에게만 FCM 알림
      //    — 예전엔 push_tokens 전체(전 직원)에게 보내고 있었음. AI 피드백 관리는 관리자 업무이므로 한정.
      if (statusChangedToExcluded) {
        try {
          if (firebaseAdmin) {
            await pool.query(`ALTER TABLE push_tokens ADD COLUMN IF NOT EXISTS employee_id varchar(50)`);
            const tokenRows = await pool.query(`SELECT token FROM push_tokens WHERE employee_id = $1`, ["910919"]);
            const tokens = tokenRows.rows.map((r: any) => r.token).filter(Boolean);
            await Promise.allSettled(
              tokens.map((token: string) =>
                firebaseAdmin.messaging().send({
                  token,
                  notification: {
                    title: "⚠️ AI 답변 부정 피드백 누적",
                    body: `질문: ${question.slice(0, 50)}`,
                  },
                  android: { priority: "high" },
                })
              )
            );
          }
        } catch (e) {}
      }

      res.json({ ok: true, thumbsUp, thumbsDown, status: newStatus });
    } catch (e) {
      res.status(500).json({ error: "피드백 저장 실패" });
    }
  });

  // 관리자 모드: 이용자들이 남긴 좋아요/아쉬워요 피드백 전체를 CSV로 다운로드
  app.get("/api/ai-feedback/export", async (req, res) => {
    try {
      const { pool } = await import("../db");
      const rows = await pool.query(
        `SELECT id, question, answer, rating, sections, reasons, comment, created_at
         FROM ai_feedback ORDER BY created_at DESC`
      );

      const escapeCsv = (v: any) => {
        if (v === null || v === undefined) return "";
        const s = Array.isArray(v) ? v.join("; ") : String(v);
        return `"${s.replace(/"/g, '""')}"`;
      };

      const header = ["id", "일시", "평가", "질문", "답변", "선택항목", "이유", "기타의견"];
      const lines = [header.map(escapeCsv).join(",")];
      for (const r of rows.rows) {
        lines.push([
          r.id,
          r.created_at ? new Date(r.created_at).toISOString().slice(0, 19).replace("T", " ") : "",
          r.rating === 1 ? "좋아요" : r.rating === -1 ? "아쉬워요" : r.rating,
          r.question,
          r.answer,
          r.sections,
          r.reasons,
          r.comment,
        ].map(escapeCsv).join(","));
      }
      const csv = "﻿" + lines.join("\r\n"); // BOM: 엑셀 한글 깨짐 방지

      const filename = `ai_feedback_${new Date().toISOString().slice(0, 10)}.csv`;
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(csv);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "피드백 내보내기 실패" });
    }
  });

  // 관리자 모드: AI 답변 클러스터 현황 (읽기 전용 모니터링) — 좋아요/아쉬워요로 자동 분류된
  // 상태(approved/pending/excluded)를 그대로 보여줌. status 필터 + limit/offset 페이지네이션으로
  // 데이터가 쌓여도 패널이 항상 빠르게 열리도록 함.
  app.get("/api/ai-feedback/clusters", async (req, res) => {
    try {
      const { pool } = await import("../db");
      const status = typeof req.query.status === "string" ? req.query.status : undefined;
      const limit = Math.min(parseInt(String(req.query.limit ?? "50"), 10) || 50, 100);
      const offset = Math.max(parseInt(String(req.query.offset ?? "0"), 10) || 0, 0);

      const validStatuses = ["pending", "approved", "excluded"];
      const whereClause = status && validStatuses.includes(status) ? `WHERE status = $1` : "";
      const params: any[] = status && validStatuses.includes(status) ? [status] : [];

      const countResult = await pool.query(
        `SELECT COUNT(*)::int as total FROM ai_answer_pool ${whereClause}`,
        params
      );
      const total = countResult.rows[0]?.total ?? 0;

      const clusterRows = await pool.query(
        `SELECT id, question, answer, thumbs_up, thumbs_down, status, created_at, updated_at
         FROM ai_answer_pool
         ${whereClause}
         ORDER BY updated_at DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limit, offset]
      );

      // 각 클러스터에 달린 최근 코멘트(사유 태그 포함)를 질문 텍스트로 매칭해 조인
      // (ai_feedback은 poolId를 직접 저장하지 않으므로 question 일치로 근사 매칭)
      const clusters = await Promise.all(
        clusterRows.rows.map(async (c: any) => {
          const feedbackRows = await pool.query(
            `SELECT rating, reasons, comment, created_at
             FROM ai_feedback
             WHERE question = $1
             ORDER BY created_at DESC
             LIMIT 5`,
            [c.question]
          );
          return { ...c, recentFeedback: feedbackRows.rows };
        })
      );

      res.json({ clusters, total, limit, offset });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "클러스터 조회 실패" });
    }
  });

  // 관리자 모드: 명백히 틀린 답변을 즉시 참고 목록에서 제외 (예외적 강제 조치 — 자동 학습과 별개)
  app.post("/api/ai-feedback/clusters/:id/exclude", async (req, res) => {
    try {
      const { pool } = await import("../db");
      const id = parseInt(req.params.id, 10);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "잘못된 id" });
      }
      const result = await pool.query(
        `UPDATE ai_answer_pool SET status = 'excluded', updated_at = NOW() WHERE id = $1 RETURNING id`,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "클러스터를 찾을 수 없습니다" });
      }
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "제외 처리 실패" });
    }
  });
}
