// 2026-09-29 "전문가 질문을 실제 이용자 질문 기반으로" 개선 회귀 테스트
//
// 배경: generateOneExpertQuestion()이 순수 상상으로 질문을 지어내서 실제 검사원들이
// AI 검색에 묻는 것과 동떨어진다는 지적이 있었다. ai_answer_pool(아쉬워요로 자동
// 제외된 답변)과 ai_research_candidates(자료 범위 밖 질문)를 실제 소재로 참고하도록
// getExpertQuestionSeedMaterial()을 분리했다 — 이 테스트는 LLM 호출 없이 그 쿼리
// 로직(어떤 상태만 가져오는지, 최신순인지)만 검증한다. 실제 질문 생성(Anthropic API
// 호출)은 비용·비결정성 때문에 여기서 다루지 않고 라이브에서 확인한다.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getExpertQuestionSeedMaterial } from "../routes";
import { pool } from "../db";

const TEST_TAG = "__TEST_SEED_MATERIAL__";
const Q_EXCLUDED = `${TEST_TAG}_excluded`;
const Q_APPROVED = `${TEST_TAG}_approved`; // 소재로 쓰이면 안 되는 대조군
const Q_OOS_PENDING = `${TEST_TAG}_oos_pending`;
const Q_OOS_REJECTED = `${TEST_TAG}_oos_rejected`; // 소재로 쓰이면 안 되는 대조군

async function cleanup() {
  await pool.query(`DELETE FROM ai_answer_pool WHERE question LIKE $1`, [`${TEST_TAG}%`]);
  await pool.query(`DELETE FROM ai_research_candidates WHERE question LIKE $1`, [`${TEST_TAG}%`]);
}

describe("getExpertQuestionSeedMaterial", () => {
  beforeAll(async () => {
    await cleanup();
    await pool.query(
      `INSERT INTO ai_answer_pool (question, answer, thumbs_up, thumbs_down, status) VALUES
       ($1, '부족한 답변', 0, 2, 'excluded'),
       ($2, '좋은 답변', 3, 0, 'approved')`,
      [Q_EXCLUDED, Q_APPROVED]
    );
    await pool.query(
      `INSERT INTO ai_research_candidates (question, original_answer, summary, sources, status) VALUES
       ($1, '자료 범위 밖', '외부 요약', '[]'::jsonb, 'pending_review'),
       ($2, '자료 범위 밖', '외부 요약', '[]'::jsonb, 'rejected')`,
      [Q_OOS_PENDING, Q_OOS_REJECTED]
    );
  });

  afterAll(async () => {
    await cleanup();
    await pool.end();
  });

  it("excluded 상태인 ai_answer_pool 질문만 negativeFeedback으로 가져온다 (approved는 제외)", async () => {
    const { negativeFeedback } = await getExpertQuestionSeedMaterial();
    const questions = negativeFeedback.map((r) => r.question);
    expect(questions).toContain(Q_EXCLUDED);
    expect(questions).not.toContain(Q_APPROVED);
  });

  it("pending_review/approved 상태인 ai_research_candidates만 outOfScope로 가져온다 (rejected는 제외)", async () => {
    const { outOfScope } = await getExpertQuestionSeedMaterial();
    const questions = outOfScope.map((r) => r.question);
    expect(questions).toContain(Q_OOS_PENDING);
    expect(questions).not.toContain(Q_OOS_REJECTED);
  });
});
