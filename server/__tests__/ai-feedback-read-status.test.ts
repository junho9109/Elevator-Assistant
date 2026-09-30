// 2026-09-29 "AI 피드백 현황 읽음 관리" 기능 회귀 테스트
//
// 배경: 사용자 피드백(좋아요/아쉬워요) 클러스터가 계속 쌓이는데, 관리자가 이미 확인한
// 것과 새로 생기거나 상태가 바뀐 것을 구분할 방법이 없었다. last_reviewed_at 컬럼을
// 추가해 "읽음" 여부를 추적하도록 개선했다 — 이 테스트는 그 판정 로직(신규/갱신 후 재노출/
// 개별 읽음/일괄 읽음)이 의도대로 동작하는지 확인한다.
//
// ai_answer_pool은 정상적으로는 POST /api/ai-feedback(OpenAI 임베딩 호출 필요)을 거쳐
// 채워지지만, 이 테스트는 읽음 판정 로직만 검증하면 되므로 임베딩 없이 행을 직접
// 삽입해 그 경로를 우회한다. itemId류 식별자가 없는 테이블이라 "__TEST_"로 시작하는
// 전용 질문 문자열로 표시해두고 끝나면 직접 정리한다.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { registerRoutes } from "../routes";
import { pool } from "../db";

const TEST_QUESTION = "__TEST_READ_STATUS_QUESTION__";

async function buildTestApp() {
  const app = express();
  app.use(express.json());
  await registerRoutes(app);
  return app;
}

async function cleanup() {
  await pool.query(`DELETE FROM ai_feedback WHERE question = $1`, [TEST_QUESTION]);
  await pool.query(`DELETE FROM ai_answer_pool WHERE question = $1`, [TEST_QUESTION]);
}

describe("AI 피드백 현황 읽음 관리", () => {
  let app: express.Express;
  let poolId: number;

  beforeAll(async () => {
    app = await buildTestApp();
    // 이 테스트는 registerRoutes(app)만 호출하고 server/app.ts의 ensureChatTable()
    // 부트스트랩(서버 실제 기동 시에만 실행됨)은 거치지 않는다. last_reviewed_at
    // 컬럼은 그 부트스트랩에서 추가되므로, 아직 배포 전이거나 로컬에서 단독으로
    // 테스트를 돌리는 환경이면 컬럼이 없어 아래 쿼리들이 500으로 실패한다 — 여기서
    // 멱등하게 한 번 더 보장해 배포 순서와 무관하게 테스트가 항상 성립하게 한다.
    await pool.query(`ALTER TABLE ai_answer_pool ADD COLUMN IF NOT EXISTS last_reviewed_at TIMESTAMP`);
    await cleanup();
    const inserted = await pool.query(
      `INSERT INTO ai_answer_pool (question, answer, thumbs_up, thumbs_down, status) VALUES ($1, $2, 1, 0, 'approved') RETURNING id`,
      [TEST_QUESTION, "테스트 답변"]
    );
    poolId = inserted.rows[0].id;
  });

  afterAll(async () => {
    await cleanup();
    await pool.end();
  });

  it("한 번도 확인 안 한 클러스터는 isUnread=true로 내려온다", async () => {
    const res = await request(app).get(`/api/ai-feedback/clusters?status=approved&limit=100`);
    expect(res.status).toBe(200);
    const row = res.body.clusters.find((c: any) => c.id === poolId);
    expect(row).toBeTruthy();
    expect(row.isUnread).toBe(true);
    expect(res.body.unreadTotal).toBeGreaterThanOrEqual(1);
  });

  it("mark-read 호출 후에는 isUnread=false가 된다", async () => {
    const markRes = await request(app).post(`/api/ai-feedback/clusters/${poolId}/mark-read`);
    expect(markRes.status).toBe(200);

    const res = await request(app).get(`/api/ai-feedback/clusters?status=approved&limit=100`);
    const row = res.body.clusters.find((c: any) => c.id === poolId);
    expect(row.isUnread).toBe(false);
  });

  it("읽은 뒤 새 피드백으로 updated_at이 last_reviewed_at보다 최신이 되면 다시 isUnread=true가 된다", async () => {
    // 아쉬워요가 하나 더 붙어 상태가 바뀌는 상황을 흉내 — updated_at을 "지금"으로 갱신한다.
    // (주의: 여기서 NOW() + interval으로 일부러 미래 시각을 넣으면 안 된다 — 다음 테스트의
    // mark-all-read가 호출하는 NOW()가 그 미래 시각을 아직 따라잡지 못해 last_reviewed_at이
    // 여전히 updated_at보다 과거로 남는 타이밍 버그가 생긴다. 그냥 NOW()면 이후 모든 호출의
    // NOW()가 이 시각보다 항상 뒤이므로 실제 운영 동작과도 일치한다.)
    await pool.query(
      `UPDATE ai_answer_pool SET thumbs_down = thumbs_down + 1, status = 'excluded', updated_at = NOW() WHERE id = $1`,
      [poolId]
    );
    const res = await request(app).get(`/api/ai-feedback/clusters?status=excluded&limit=100`);
    const row = res.body.clusters.find((c: any) => c.id === poolId);
    expect(row).toBeTruthy();
    expect(row.isUnread).toBe(true);
  });

  it("mark-all-read는 남아있는 읽지 않은 항목을 전부 읽음 처리한다", async () => {
    const res = await request(app).post(`/api/ai-feedback/clusters/mark-all-read`);
    expect(res.status).toBe(200);

    const check = await request(app).get(`/api/ai-feedback/clusters?status=excluded&limit=100`);
    const row = check.body.clusters.find((c: any) => c.id === poolId);
    expect(row.isUnread).toBe(false);
  });
});
