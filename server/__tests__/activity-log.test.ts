// 2026-10-13 "자료 조회 기록" 회귀 테스트
//
// 배경: AI 질문 없이 자료만 조회하는 이용자가 있는지 관리자가 파악할 수 있도록, 탭 이동과
// 주요 항목 열람을 activity_log에 남기고 사용량 패널에서 이용자별로 보여준다.
// - 저장(POST)은 로그인 정보가 없거나 허용되지 않은 화면명이면 조용히 무시해야 한다.
// - 같은 사람이 같은 화면·항목을 30초 안에 반복해서 열면 한 건만 남아야 한다.
// - 조회(GET)는 관리자에게만 응답해야 하고, AI 질문이 0건인 사람이 "조회만"으로 분류돼야 한다.
// - 90일이 지난 기록은 purgeOldActivityLog()가 지우고 최근 기록은 남겨야 한다.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { registerRoutes } from "../routes";
import { purgeOldActivityLog } from "../app";
import { pool } from "../db";

const EMP_ID = "__TEST_ACT_EMP__";
const EMP_NAME = "__TEST_조회자__";
const EMP_ID_OLD = "__TEST_ACT_OLD__";

async function buildTestApp() {
  const app = express();
  app.use(express.json());
  await registerRoutes(app);
  return app;
}

async function cleanup() {
  await pool.query(`DELETE FROM activity_log WHERE employee_id IN ($1, $2)`, [EMP_ID, EMP_ID_OLD]);
  await pool.query(`DELETE FROM ai_question_log WHERE employee_id = $1`, [EMP_ID]);
}

describe("자료 조회 기록", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await buildTestApp();
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
    await pool.end();
  });

  it("로그인 정보(employeeId) 없이 보내면 저장하지 않는다", async () => {
    const res = await request(app).post("/api/activity-log").send({ page: "검사기준", detail: "x" });
    expect(res.status).toBe(204);
    const r = await pool.query(`SELECT 1 FROM activity_log WHERE detail = 'x' AND employee_id IS NULL`);
    expect(r.rows.length).toBe(0);
  });

  it("허용되지 않은 화면명이면 저장하지 않는다", async () => {
    const res = await request(app).post("/api/activity-log").send({ employeeId: EMP_ID, page: "없는화면" });
    expect(res.status).toBe(204);
    const r = await pool.query(`SELECT 1 FROM activity_log WHERE employee_id = $1`, [EMP_ID]);
    expect(r.rows.length).toBe(0);
  });

  it("정상 요청은 저장된다", async () => {
    const res = await request(app).post("/api/activity-log").send({
      employeeId: EMP_ID, employeeName: EMP_NAME, team: "테스트팀", page: "검사기준", detail: "별표24 · 5.12.3.8",
    });
    expect(res.status).toBe(204);
    const r = await pool.query(`SELECT * FROM activity_log WHERE employee_id = $1`, [EMP_ID]);
    expect(r.rows.length).toBe(1);
    expect(r.rows[0].page).toBe("검사기준");
    expect(r.rows[0].detail).toBe("별표24 · 5.12.3.8");
  });

  it("같은 화면·항목을 30초 안에 다시 열면 한 건만 남는다", async () => {
    await request(app).post("/api/activity-log").send({
      employeeId: EMP_ID, employeeName: EMP_NAME, page: "검사기준", detail: "별표24 · 5.12.3.8",
    });
    const r = await pool.query(`SELECT 1 FROM activity_log WHERE employee_id = $1 AND detail = '별표24 · 5.12.3.8'`, [EMP_ID]);
    expect(r.rows.length).toBe(1);
  });

  it("다른 항목은 별도로 저장된다", async () => {
    await request(app).post("/api/activity-log").send({
      employeeId: EMP_ID, employeeName: EMP_NAME, page: "검사가이드", detail: "에스컬레이터 · 3.3.2",
    });
    const r = await pool.query(`SELECT 1 FROM activity_log WHERE employee_id = $1`, [EMP_ID]);
    expect(r.rows.length).toBe(2);
  });

  it("관리자가 아니면 활동 통계와 이용자별 조회 내역은 403이다", async () => {
    const a = await request(app).get("/api/activity-stats");
    expect(a.status).toBe(403);
    const b = await request(app).get(`/api/activity-log/user/${EMP_ID}`);
    expect(b.status).toBe(403);
  });

  it("AI 질문이 없는 이용자는 활동 통계에서 '조회만'으로 집계된다", async () => {
    const res = await request(app).get("/api/activity-stats?admin=true");
    expect(res.status).toBe(200);
    const me = res.body.users.find((u: any) => u.employee_id === EMP_ID);
    expect(me).toBeTruthy();
    expect(me.question_count).toBe(0);
    expect(me.view_count).toBe(2);
    expect(res.body.summary.browseOnly).toBeGreaterThanOrEqual(1);
  });

  it("AI 질문을 하면 같은 사람의 AI질문 수가 합쳐진다", async () => {
    await pool.query(
      `INSERT INTO ai_question_log (employee_id, employee_name, team, question, mode) VALUES ($1, $2, $3, $4, $5)`,
      [EMP_ID, EMP_NAME, "테스트팀", "__TEST_ACT__ 질문", "fast"]
    );
    const res = await request(app).get("/api/activity-stats?admin=true");
    const me = res.body.users.find((u: any) => u.employee_id === EMP_ID);
    expect(me.question_count).toBe(1);
    expect(me.view_count).toBe(2);
  });

  it("이용자별 조회 내역을 최신순으로 돌려준다", async () => {
    const res = await request(app).get(`/api/activity-log/user/${EMP_ID}?admin=true&limit=10`);
    expect(res.status).toBe(200);
    expect(res.body.entries.length).toBe(2);
    expect(res.body.entries[0].page).toBe("검사가이드");
  });

  it("90일이 지난 기록만 삭제된다", async () => {
    await pool.query(
      `INSERT INTO activity_log (employee_id, employee_name, page, detail, created_at)
       VALUES ($1, 'old', '메모', 'old-entry', NOW() - INTERVAL '91 days'),
              ($1, 'old', '메모', 'recent-entry', NOW() - INTERVAL '89 days')`,
      [EMP_ID_OLD]
    );
    await purgeOldActivityLog();
    const r = await pool.query(`SELECT detail FROM activity_log WHERE employee_id = $1`, [EMP_ID_OLD]);
    expect(r.rows.map((x: any) => x.detail)).toEqual(["recent-entry"]);
  });
});
