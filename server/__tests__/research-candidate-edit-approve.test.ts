// 2026-10-01 "외부자료 후보 — 수정 후 승인" 회귀 테스트
//
// 배경: 통합 관리자 화면("AI 학습 관리") 설계에서 외부자료 후보만 전문가지식/피드백과
// 달리 "반려/수정 후 승인/승인" 세 가지 버튼을 갖기로 했다. 이 중 "수정 후 승인"은
// 새로 추가한 PUT /api/ai-research-candidates/:id 엔드포인트로, 관리자가 AI가 찾아온
// 웹 검색 요약을 고친 뒤 그 자리에서 바로 승인(status='approved')까지 한 번에 처리한다.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { registerRoutes } from "../routes";
import { pool } from "../db";

const TEST_QUESTION = "__TEST_RESEARCH_EDIT_APPROVE__";

async function buildTestApp() {
  const app = express();
  app.use(express.json());
  await registerRoutes(app);
  return app;
}

async function cleanup() {
  await pool.query(`DELETE FROM ai_research_candidates WHERE question = $1`, [TEST_QUESTION]);
}

describe("외부자료 후보 수정 후 승인", () => {
  let app: express.Express;
  let candidateId: number;

  beforeAll(async () => {
    app = await buildTestApp();
    await cleanup();
    const inserted = await pool.query(
      `INSERT INTO ai_research_candidates (question, original_answer, summary, sources, status)
       VALUES ($1, '자료 범위 밖', '원본 요약(오탈자 있음)', '[]'::jsonb, 'pending_review') RETURNING id`,
      [TEST_QUESTION]
    );
    candidateId = inserted.rows[0].id;
  });

  afterAll(async () => {
    await cleanup();
    await pool.end();
  });

  it("summary 없이 PUT하면 400이고 상태가 그대로다", async () => {
    const res = await request(app).put(`/api/ai-research-candidates/${candidateId}`).send({});
    expect(res.status).toBe(400);
    const check = await pool.query(`SELECT status, summary FROM ai_research_candidates WHERE id = $1`, [candidateId]);
    expect(check.rows[0].status).toBe("pending_review");
    expect(check.rows[0].summary).toBe("원본 요약(오탈자 있음)");
  });

  it("summary와 함께 PUT하면 내용이 바뀌고 status가 approved로 바뀐다", async () => {
    const res = await request(app)
      .put(`/api/ai-research-candidates/${candidateId}`)
      .send({ summary: "수정된 요약(오탈자 수정됨)" });
    expect(res.status).toBe(200);
    const check = await pool.query(`SELECT status, summary, reviewed_at FROM ai_research_candidates WHERE id = $1`, [candidateId]);
    expect(check.rows[0].status).toBe("approved");
    expect(check.rows[0].summary).toBe("수정된 요약(오탈자 수정됨)");
    expect(check.rows[0].reviewed_at).toBeTruthy();
  });

  it("존재하지 않는 id면 404다", async () => {
    const res = await request(app).put(`/api/ai-research-candidates/999999999`).send({ summary: "x" });
    expect(res.status).toBe(404);
  });
});
