// 2026-10-01 "지식 검수 승인 → RAG 컨텍스트 연결" 회귀 테스트
//
// 배경: /api/chat의 expertAnswerTask는 라우트 핸들러 내부 IIFE라 직접 호출(unit test)할
// 수 없고, 실제 LLM 호출까지 거치는 전체 플로우는 결정적이지 않아 여기서 다루지 않는다
// (라이브에서 직접 질문해 확인). 대신 그 안에 박혀있는 SQL 조건(status='승인',
// answer_type != 'skip', answer_text IS NOT NULL, 키워드 ILIKE)을 그대로 재현해, 승인된
// 전문가 답변만 걸러지고 건너뜀/대기/반려 상태는 섞이지 않는지 쿼리 로직 자체를 검증한다.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { pool } from "../db";

const TAG = "__TEST_EXPERT_RAG__";
const Q_APPROVED = `${TAG}_approved 디딤판체인 관련 질문`;
const Q_PENDING = `${TAG}_pending 디딤판체인 관련 질문`;
const Q_SKIP = `${TAG}_skip 디딤판체인 관련 질문`;

async function cleanup() {
  await pool.query(`DELETE FROM expert_answers WHERE question_content LIKE $1`, [`${TAG}%`]);
}

async function insertAnswer(questionContent: string, status: string, answerType: string, answerText: string | null) {
  await pool.query(
    `INSERT INTO expert_answers (question_id, question_content, employee_id, employee_name, answer_type, answer_text, status)
     VALUES (0, $1, '__test__', '테스트', $2, $3, $4)`,
    [questionContent, answerType, answerText, status]
  );
}

describe("expert_answers RAG 조회 쿼리 로직", () => {
  beforeAll(async () => {
    await cleanup();
    await insertAnswer(Q_APPROVED, "승인", "custom", "디딤판체인은 정기적으로 장력을 점검해야 한다.");
    await insertAnswer(Q_PENDING, "대기", "custom", "검수 전 답변");
    await insertAnswer(Q_SKIP, "승인", "skip", null);
  });

  afterAll(async () => {
    await cleanup();
    await pool.end();
  });

  it("status='승인'이고 answer_type이 skip이 아니며 키워드가 일치하는 행만 조회된다", async () => {
    const rows = await pool.query(
      `SELECT question_content, answer_text FROM expert_answers
       WHERE status = '승인' AND answer_type != 'skip' AND answer_text IS NOT NULL AND question_content ILIKE $1`,
      [`%디딤판체인%`]
    );
    const contents = rows.rows.map((r: any) => r.question_content);
    expect(contents).toContain(Q_APPROVED);
    expect(contents).not.toContain(Q_PENDING);
    expect(contents).not.toContain(Q_SKIP);
  });
});
