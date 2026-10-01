// 2026-10-01 "연혁 확인 요청(신고)" 기능 회귀 테스트
//
// 배경: 관리자가 수작업으로 매핑한 연혁(inspection_item_revisions) 중 일부는
// 틀린 조문에 연결되거나 내용이 어색할 수 있다. 관리자뿐 아니라 현장 이용자도
// "이 연혁 이상해요"라고 신고할 수 있게 revision_flags 테이블과 3개 엔드포인트
// (신고 생성/목록 조회/처리완료)를 추가했다. 신고는 비밀번호 없이 누구나 할 수
// 있어야 하고(데이터를 바꾸지 않으므로), 생성된 신고가 목록에 올바르게 뜨고,
// 처리완료 처리 후 resolved 필터가 정확히 갈리는지 확인한다.
// 2026-10-01 추가: 실수로 빈 깃발 신고가 접수되지 않도록 note(신고 사유)가
// 비어있으면(미입력 또는 공백) 서버가 400으로 거부하도록 변경 — 그 검증도 포함한다.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { registerRoutes } from "../routes";
import { pool } from "../db";

const TEST_ITEM_ID = "__TEST_REVISION_FLAG__";
const CORRECT_PW = "910919";

async function buildTestApp() {
  const app = express();
  app.use(express.json());
  await registerRoutes(app);
  return app;
}

let revisionId: number;

async function cleanup() {
  await pool.query(`DELETE FROM revision_flags WHERE item_id = $1`, [TEST_ITEM_ID]);
  await pool.query(`DELETE FROM inspection_item_revisions WHERE item_id = $1`, [TEST_ITEM_ID]);
}

describe("연혁 확인 요청(신고)", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await buildTestApp();
    await cleanup();
    const createRes = await request(app)
      .post("/api/inspection-revisions")
      .send({ itemId: TEST_ITEM_ID, equipmentType: "에스컬레이터", description: "신고 테스트용 연혁", password: CORRECT_PW });
    revisionId = createRes.body.id;
  });

  afterAll(async () => {
    await cleanup();
    await pool.end();
  });

  it("비밀번호 없이 신고하면 201로 접수된다", async () => {
    const res = await request(app)
      .post(`/api/inspection-revisions/${revisionId}/flag`)
      .send({ note: "이 조문 아닌 것 같아요", employeeId: "E001", employeeName: "홍길동" });
    expect(res.status).toBe(201);
    expect(typeof res.body.id).toBe("number");
  });

  it("존재하지 않는 연혁 id로 신고하면 404다", async () => {
    const res = await request(app)
      .post(`/api/inspection-revisions/999999999/flag`)
      .send({ note: "테스트" });
    expect(res.status).toBe(404);
  });

  it("note 없이 신고하면 400이고 접수되지 않는다", async () => {
    const res = await request(app)
      .post(`/api/inspection-revisions/${revisionId}/flag`)
      .send({});
    expect(res.status).toBe(400);
  });

  it("공백만 있는 note로 신고하면 400이다", async () => {
    const res = await request(app)
      .post(`/api/inspection-revisions/${revisionId}/flag`)
      .send({ note: "   " });
    expect(res.status).toBe(400);
  });

  it("두번째 정상 신고도 201로 접수된다", async () => {
    const res = await request(app)
      .post(`/api/inspection-revisions/${revisionId}/flag`)
      .send({ note: "날짜가 잘못된 것 같습니다" });
    expect(res.status).toBe(201);
  });

  it("미처리 목록(resolved=false)에서 방금 등록한 신고 2건이 조회된다", async () => {
    const res = await request(app).get("/api/revision-flags?resolved=false");
    expect(res.status).toBe(200);
    const mine = res.body.flags.filter((f: any) => f.item_id === TEST_ITEM_ID);
    expect(mine.length).toBe(2);
    expect(mine[0].equipment_type).toBe("에스컬레이터");
  });

  let flagIdToResolve: number;

  it("처리완료 처리하면 미처리 목록에서 빠지고 처리됨 목록에 나타난다", async () => {
    const before = await request(app).get("/api/revision-flags?resolved=false");
    const target = before.body.flags.find((f: any) => f.item_id === TEST_ITEM_ID);
    flagIdToResolve = target.id;

    const resolveRes = await request(app).post(`/api/revision-flags/${flagIdToResolve}/resolve`);
    expect(resolveRes.status).toBe(200);

    const afterUnresolved = await request(app).get("/api/revision-flags?resolved=false");
    expect(afterUnresolved.body.flags.some((f: any) => f.id === flagIdToResolve)).toBe(false);

    const afterResolved = await request(app).get("/api/revision-flags?resolved=true");
    expect(afterResolved.body.flags.some((f: any) => f.id === flagIdToResolve)).toBe(true);
  });

  it("존재하지 않는 신고를 처리완료 처리하면 404다", async () => {
    const res = await request(app).post(`/api/revision-flags/999999999/resolve`);
    expect(res.status).toBe(404);
  });
});
