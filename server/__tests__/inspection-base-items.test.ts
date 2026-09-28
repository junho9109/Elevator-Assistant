// 2026-09-29 사고 회귀 테스트
//
// 사고 요약: PUT /api/inspection-base-items/:itemId 가 standardEquipmentType을
// 요청 "본문(body)"으로만 받는데, 호출부가 쿼리 파라미터로 보내는 바람에 서버가 조용히
// 기본값("엘리베이터")으로 처리 — 그 결과 에스컬레이터용으로 의도한 내용이 엘리베이터의
// 기존 조문(부속서 Ⅱ)을 덮어써버렸다. itemId는 문서(별표22/별표24 등)마다 독립적으로
// 채번되어 서로 겹칠 수 있으므로, standardEquipmentType 없이는 어떤 문서를 고치는 건지
// 특정할 수 없다.
//
// 이 테스트는 실제 Express 라우트(server/routes.ts)와 실제 DB(DATABASE_URL)를 대상으로
// 돌아가는 통합 테스트다. 별도 테스트 DB가 아직 없어 운영 DB에 접속하지만, 오염을 막기 위해
// itemId/standardEquipmentType 모두 "__TEST_"로 시작하는 전용 값만 사용하고, 끝나면 직접
// 정리(clean up)한다. 실행: npm test (DATABASE_URL이 설정된 환경에서)
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { registerRoutes } from "../routes";
import { pool } from "../db";

const TEST_ITEM_ID = "__TEST_SAFETY_ITEM__";
const TYPE_A = "__TEST_TYPE_A__";
const TYPE_B = "__TEST_TYPE_B__";

async function buildTestApp() {
  const app = express();
  app.use(express.json());
  await registerRoutes(app);
  return app;
}

async function cleanup() {
  await pool.query(
    `DELETE FROM inspection_base_items_history WHERE item_id = $1 AND standard_equipment_type IN ($2, $3)`,
    [TEST_ITEM_ID, TYPE_A, TYPE_B],
  );
  await pool.query(
    `DELETE FROM inspection_base_items WHERE item_id = $1 AND standard_equipment_type IN ($2, $3)`,
    [TEST_ITEM_ID, TYPE_A, TYPE_B],
  );
}

describe("inspection-base-items 안전장치", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await buildTestApp();
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
    await pool.end();
  });

  it("standardEquipmentType 없이 POST하면 400을 반환하고 아무것도 만들지 않는다", async () => {
    const res = await request(app)
      .post("/api/inspection-base-items")
      .send({ itemId: TEST_ITEM_ID, text: "본문" });
    expect(res.status).toBe(400);
  });

  it("standardEquipmentType 없이 PUT하면 400을 반환한다", async () => {
    const res = await request(app)
      .put(`/api/inspection-base-items/${encodeURIComponent(TEST_ITEM_ID)}`)
      .send({ text: "수정본" });
    expect(res.status).toBe(400);
  });

  it("같은 itemId라도 standardEquipmentType이 다르면 서로 독립적으로 저장·수정된다 (2026-09-29 사고 재현 방지)", async () => {
    // 두 "문서"에 동일한 itemId로 각각 생성
    const createA = await request(app)
      .post("/api/inspection-base-items")
      .send({ itemId: TEST_ITEM_ID, text: "A문서 원본", standardEquipmentType: TYPE_A });
    expect(createA.status).toBe(201);

    const createB = await request(app)
      .post("/api/inspection-base-items")
      .send({ itemId: TEST_ITEM_ID, text: "B문서 원본", standardEquipmentType: TYPE_B });
    expect(createB.status).toBe(201);

    // A만 수정
    const updateA = await request(app)
      .put(`/api/inspection-base-items/${encodeURIComponent(TEST_ITEM_ID)}`)
      .send({ text: "A문서 수정본", standardEquipmentType: TYPE_A });
    expect(updateA.status).toBe(200);

    // A는 바뀌고, B는 원본 그대로여야 한다 — 사고 당시 이 부분이 깨졌었다.
    const getA = await request(app).get(
      `/api/inspection-base-items/${encodeURIComponent(TEST_ITEM_ID)}?standardEquipmentType=${TYPE_A}`,
    );
    const getB = await request(app).get(
      `/api/inspection-base-items/${encodeURIComponent(TEST_ITEM_ID)}?standardEquipmentType=${TYPE_B}`,
    );
    expect(getA.body.text).toBe("A문서 수정본");
    expect(getB.body.text).toBe("B문서 원본");
  });

  it("수정 직전 값이 이력 테이블에 남아 되돌리기(restore)가 가능하다", async () => {
    const history = await request(app).get(
      `/api/inspection-base-items/${encodeURIComponent(TEST_ITEM_ID)}/history?standardEquipmentType=${TYPE_A}`,
    );
    expect(history.status).toBe(200);
    expect(history.body.length).toBeGreaterThan(0);
    expect(history.body[0].text).toBe("A문서 원본"); // 수정 "직전" 값

    const restore = await request(app).post(
      `/api/inspection-base-items/history/${history.body[0].id}/restore`,
    );
    expect(restore.status).toBe(200);
    expect(restore.body.text).toBe("A문서 원본");

    const getA = await request(app).get(
      `/api/inspection-base-items/${encodeURIComponent(TEST_ITEM_ID)}?standardEquipmentType=${TYPE_A}`,
    );
    expect(getA.body.text).toBe("A문서 원본");
  });
});
