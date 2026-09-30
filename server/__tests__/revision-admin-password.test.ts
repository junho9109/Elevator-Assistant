// 2026-09-30 "연혁 관리자 CRUD에 비밀번호 검증 추가" 회귀 테스트
//
// 배경: 검사가이드의 조문별 "연혁"(inspection_item_revisions)을 관리자 모드에서 직접
// 추가/이동/삭제할 수 있게 되면서, 서버가 요청 바디의 password를 검증하지 않으면
// 관리자 모드 버튼을 숨기는 것만으로는 아무나 devtools/curl로 우회해 법적 안전기준
// 연혁을 조작할 수 있다는 문제가 있었다. routes.ts에 추가한 checkRevisionPassword()가
// POST/PUT/DELETE 세 경로 모두에서 실제로 막아주는지 확인한다.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { registerRoutes } from "../routes";
import { pool } from "../db";

const TEST_ITEM_ID = "__TEST_REVISION_PW__";
const TEST_MOVED_ITEM_ID = "__TEST_REVISION_PW_MOVED__";
const CORRECT_PW = "910919";

async function buildTestApp() {
  const app = express();
  app.use(express.json());
  await registerRoutes(app);
  return app;
}

async function cleanup() {
  await pool.query(
    `DELETE FROM inspection_item_revisions WHERE item_id IN ($1, $2)`,
    [TEST_ITEM_ID, TEST_MOVED_ITEM_ID]
  );
}

describe("연혁 CRUD 비밀번호 검증", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await buildTestApp();
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
    await pool.end();
  });

  it("비밀번호 없이 POST하면 403이고 DB에 생성되지 않는다", async () => {
    const res = await request(app)
      .post("/api/inspection-revisions")
      .send({ itemId: TEST_ITEM_ID, equipmentType: "엘리베이터", description: "테스트" });
    expect(res.status).toBe(403);
    const check = await pool.query(`SELECT * FROM inspection_item_revisions WHERE item_id = $1`, [TEST_ITEM_ID]);
    expect(check.rows.length).toBe(0);
  });

  it("틀린 비밀번호로 POST하면 403이다", async () => {
    const res = await request(app)
      .post("/api/inspection-revisions")
      .send({ itemId: TEST_ITEM_ID, equipmentType: "엘리베이터", description: "테스트", password: "wrong" });
    expect(res.status).toBe(403);
  });

  let createdId: number;

  it("올바른 비밀번호로 POST하면 201로 생성된다", async () => {
    const res = await request(app)
      .post("/api/inspection-revisions")
      .send({ itemId: TEST_ITEM_ID, equipmentType: "엘리베이터", description: "테스트", password: CORRECT_PW });
    expect(res.status).toBe(201);
    expect(res.body.itemId).toBe(TEST_ITEM_ID);
    createdId = res.body.id;
  });

  it("비밀번호 없이 PUT(이동)하면 403이고 itemId가 바뀌지 않는다", async () => {
    const res = await request(app)
      .put(`/api/inspection-revisions/${createdId}`)
      .send({ itemId: TEST_MOVED_ITEM_ID });
    expect(res.status).toBe(403);
    const check = await pool.query(`SELECT item_id FROM inspection_item_revisions WHERE id = $1`, [createdId]);
    expect(check.rows[0].item_id).toBe(TEST_ITEM_ID);
  });

  it("올바른 비밀번호로 PUT하면 다른 조문(itemId)으로 이동된다", async () => {
    const res = await request(app)
      .put(`/api/inspection-revisions/${createdId}`)
      .send({ itemId: TEST_MOVED_ITEM_ID, password: CORRECT_PW });
    expect(res.status).toBe(200);
    expect(res.body.itemId).toBe(TEST_MOVED_ITEM_ID);
  });

  it("비밀번호 없이 DELETE하면 403이고 삭제되지 않는다", async () => {
    const res = await request(app).delete(`/api/inspection-revisions/${createdId}`);
    expect(res.status).toBe(403);
    const check = await pool.query(`SELECT * FROM inspection_item_revisions WHERE id = $1`, [createdId]);
    expect(check.rows.length).toBe(1);
  });

  it("올바른 비밀번호로 DELETE하면 204로 삭제된다", async () => {
    const res = await request(app)
      .delete(`/api/inspection-revisions/${createdId}`)
      .send({ password: CORRECT_PW });
    expect(res.status).toBe(204);
    const check = await pool.query(`SELECT * FROM inspection_item_revisions WHERE id = $1`, [createdId]);
    expect(check.rows.length).toBe(0);
  });
});
