// 2026-10-01 "법령개정" 기능 회귀 테스트
//
// 배경: 메모 페이지 안에 "법령개정" 탭을 추가해, 관리자가 고시 전문(제목/고시번호/
// 시행일/본문)을 통째로 붙여넣어 등록하고 일반 이용자는 목록에서 골라 읽기만 하는
// 구조를 만들었다. 쓰기(등록/수정/삭제)는 연혁 CRUD와 같은 관리자 비밀번호 검증
// (checkRevisionPassword, "910919")을 재사용했으므로, 비밀번호 없이는 쓰기가 막히고
// 읽기(목록/단건 조회)는 누구나 가능한지 확인한다. 제목/본문이 비어있으면 400으로
// 거부되는지도 함께 검증한다.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { registerRoutes } from "../routes";
import { pool } from "../db";

const TEST_TITLE = "__TEST_LAW_NOTICE__ 승강기 안전관리업무 수수료에 관한 고시 일부개정";
const CORRECT_PW = "910919";

async function buildTestApp() {
  const app = express();
  app.use(express.json());
  await registerRoutes(app);
  return app;
}

let createdId: number;

async function cleanup() {
  await pool.query(`DELETE FROM law_notices WHERE title = $1`, [TEST_TITLE]);
}

describe("법령개정 CRUD", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await buildTestApp();
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
    await pool.end();
  });

  it("비밀번호 없이 POST하면 403이고 생성되지 않는다", async () => {
    const res = await request(app)
      .post("/api/law-notices")
      .send({ title: TEST_TITLE, noticeNumber: "행정안전부고시 제2026-59호", effectiveDate: "2026-10-01", content: "본문" });
    expect(res.status).toBe(403);
    const check = await pool.query(`SELECT * FROM law_notices WHERE title = $1`, [TEST_TITLE]);
    expect(check.rows.length).toBe(0);
  });

  it("올바른 비밀번호라도 제목이나 본문이 비어있으면 400이다", async () => {
    const res = await request(app)
      .post("/api/law-notices")
      .send({ title: "", content: "본문", password: CORRECT_PW });
    expect(res.status).toBe(400);
  });

  it("올바른 비밀번호로 POST하면 201로 생성된다", async () => {
    const res = await request(app)
      .post("/api/law-notices")
      .send({ title: TEST_TITLE, noticeNumber: "행정안전부고시 제2026-59호", effectiveDate: "2026-10-01", content: "제1조 본문 내용", password: CORRECT_PW });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(TEST_TITLE);
    createdId = res.body.id;
  });

  it("비밀번호 없이도 목록 조회는 가능하다", async () => {
    const res = await request(app).get("/api/law-notices");
    expect(res.status).toBe(200);
    expect(res.body.some((l: any) => l.id === createdId)).toBe(true);
  });

  it("비밀번호 없이도 단건 조회는 가능하고 본문이 포함된다", async () => {
    const res = await request(app).get(`/api/law-notices/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.content).toBe("제1조 본문 내용");
  });

  it("비밀번호 없이 PUT하면 403이고 수정되지 않는다", async () => {
    const res = await request(app)
      .put(`/api/law-notices/${createdId}`)
      .send({ title: TEST_TITLE, content: "수정된 내용" });
    expect(res.status).toBe(403);
  });

  it("올바른 비밀번호로 PUT하면 수정된다", async () => {
    const res = await request(app)
      .put(`/api/law-notices/${createdId}`)
      .send({ title: TEST_TITLE, noticeNumber: "행정안전부고시 제2026-59호", effectiveDate: "2026-10-01", content: "수정된 내용", password: CORRECT_PW });
    expect(res.status).toBe(200);
    expect(res.body.content).toBe("수정된 내용");
  });

  it("비밀번호 없이 DELETE하면 403이고 삭제되지 않는다", async () => {
    const res = await request(app).delete(`/api/law-notices/${createdId}`);
    expect(res.status).toBe(403);
    const check = await pool.query(`SELECT * FROM law_notices WHERE id = $1`, [createdId]);
    expect(check.rows.length).toBe(1);
  });

  it("올바른 비밀번호로 DELETE하면 204로 삭제된다", async () => {
    const res = await request(app)
      .delete(`/api/law-notices/${createdId}`)
      .send({ password: CORRECT_PW });
    expect(res.status).toBe(204);
    const check = await pool.query(`SELECT * FROM law_notices WHERE id = $1`, [createdId]);
    expect(check.rows.length).toBe(0);
  });

  it("존재하지 않는 id를 조회하면 404다", async () => {
    const res = await request(app).get(`/api/law-notices/999999999`);
    expect(res.status).toBe(404);
  });
});
