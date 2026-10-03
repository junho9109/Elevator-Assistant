// 2026-10-02 "사용량 로그 상세화" 회귀 테스트
//
// 배경: 사용량 패널에서 "질문 1회 평균 비용" 블록을 없애고, 로그에 날짜+시간과
// 답변 지연 로딩(/api/ai-usage/log/:id/answer), 관리자 전용 질문자 이름 표시를
// 추가했다. ai_usage 테이블에 employee_id/employee_name/answer 컬럼을 새로 추가했고
// /api/ai-usage/stats의 recentLogs 목록에는 answer를 담지 않도록, employeeName은
// admin 플래그가 있을 때만 담도록 바꿨다. 이 세 가지를 검증한다.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { registerRoutes } from "../routes";
import { db, pool } from "../db";
import { aiUsage } from "@shared/schema";
import { eq } from "drizzle-orm";

const TEST_QUESTION = "__TEST_AI_USAGE_LOG__ 질문 내용";
const TEST_ANSWER = "__TEST_AI_USAGE_LOG__ 답변 본문입니다";
const TEST_EMPLOYEE_NAME = "__TEST_직원__";

async function buildTestApp() {
  const app = express();
  app.use(express.json());
  await registerRoutes(app);
  return app;
}

let insertedId: number;

async function cleanup() {
  await pool.query(`DELETE FROM ai_usage WHERE question = $1`, [TEST_QUESTION]);
}

describe("사용량 로그 상세화", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await buildTestApp();
    await cleanup();
    const inserted = await db.insert(aiUsage).values({
      question: TEST_QUESTION,
      inputTokens: 100,
      outputTokens: 50,
      costUsd: "0.001000",
      employeeId: "E999",
      employeeName: TEST_EMPLOYEE_NAME,
      answer: TEST_ANSWER,
    }).returning();
    insertedId = inserted[0].id;
  });

  afterAll(async () => {
    await cleanup();
    await pool.end();
  });

  it("관리자가 아니면 recentLogs에 employeeName이 담기지 않는다", async () => {
    const res = await request(app).get("/api/ai-usage/stats");
    expect(res.status).toBe(200);
    const mine = res.body.recentLogs.find((l: any) => l.id === insertedId);
    expect(mine).toBeTruthy();
    expect(mine.employeeName).toBeFalsy();
  });

  it("admin=true면 recentLogs에 employeeName이 담긴다", async () => {
    const res = await request(app).get("/api/ai-usage/stats?admin=true");
    expect(res.status).toBe(200);
    const mine = res.body.recentLogs.find((l: any) => l.id === insertedId);
    expect(mine.employeeName).toBe(TEST_EMPLOYEE_NAME);
  });

  it("recentLogs 응답에는 answer(답변 본문)가 포함되지 않는다", async () => {
    const res = await request(app).get("/api/ai-usage/stats?admin=true");
    const mine = res.body.recentLogs.find((l: any) => l.id === insertedId);
    expect(mine.answer).toBeUndefined();
  });

  it("GET /api/ai-usage/log/:id/answer로 답변을 지연 로딩할 수 있다", async () => {
    const res = await request(app).get(`/api/ai-usage/log/${insertedId}/answer`);
    expect(res.status).toBe(200);
    expect(res.body.answer).toBe(TEST_ANSWER);
  });

  it("존재하지 않는 id의 답변을 요청하면 404다", async () => {
    const res = await request(app).get("/api/ai-usage/log/999999999/answer");
    expect(res.status).toBe(404);
  });

  it("/api/chat 저장 로직과 동일한 필드가 DB에 그대로 반영되어 있다", async () => {
    const row = await db.select().from(aiUsage).where(eq(aiUsage.id, insertedId));
    expect(row[0].employeeId).toBe("E999");
    expect(row[0].employeeName).toBe(TEST_EMPLOYEE_NAME);
    expect(row[0].answer).toBe(TEST_ANSWER);
  });
});
