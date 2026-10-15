// 2026-10 정리/보강 회귀 테스트: 위험 엔드포인트 보호 + 중복 라우트 제거 후에도 정상 동작
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { registerRoutes } from "../routes";
import { pool } from "../db";

let app: express.Express;
const savedAdminPw = process.env.ADMIN_PASSWORD;
const savedSeed = process.env.SEED_SECRET;

describe("보안 보강 / 정리 회귀", () => {
  beforeAll(async () => {
    process.env.ADMIN_PASSWORD = "test-admin-pw-for-vitest";
    delete process.env.SEED_SECRET;
    app = express();
    app.use(express.json());
    await registerRoutes(app);
  });

  afterAll(async () => {
    if (savedAdminPw === undefined) delete process.env.ADMIN_PASSWORD; else process.env.ADMIN_PASSWORD = savedAdminPw;
    if (savedSeed !== undefined) process.env.SEED_SECRET = savedSeed;
    await pool.end();
  });

  it("settings: 허용되지 않은 키는 400, 허용 키 형식이 아니어도 400", async () => {
    const bad = await request(app).post("/api/settings").send({ key: "아무키", value: "x" });
    expect(bad.status).toBe(400);
    const notString = await request(app).post("/api/settings").send({ key: "cardOffsets", value: { a: 1 } });
    expect(notString.status).toBe(400);
  });

  it("push/send: 관리자 비밀번호 헤더가 없거나 틀리면 403", async () => {
    const none = await request(app).post("/api/push/send").send({ title: "t", body: "b" });
    expect(none.status).toBe(403);
    const wrong = await request(app).post("/api/push/send").set("x-admin-password", "nope").send({ title: "t", body: "b" });
    expect(wrong.status).toBe(403);
  });

  it("bulk-seed: SEED_SECRET이 없으면 예전 하드코딩 값으로도 거부", async () => {
    const r = await request(app).post("/api/inspection-revisions/bulk-seed").send({ secret: "seed-2009-67", revisions: [] });
    expect(r.status).toBe(403);
  });

  it("중복 제거한 라우트가 그대로 응답한다 (organizations, ppe, near-misses)", async () => {
    const orgs = await request(app).get("/api/auth/organizations");
    expect(orgs.status).toBe(200);
    expect(Array.isArray(orgs.body)).toBe(true);
    const ppe = await request(app).get("/api/ppe?admin=true");
    expect(ppe.status).toBe(200);
    const nm = await request(app).get("/api/near-misses?admin=true");
    expect(nm.status).toBe(200);
  });

  it("관리자 비밀번호 확인: 맞으면 성공, 5번 틀리면 이후 429", async () => {
    const ok = await request(app).post("/api/admin/verify-password").send({ password: "test-admin-pw-for-vitest" });
    expect(ok.status).toBe(200);
    for (let i = 0; i < 5; i++) {
      const r = await request(app).post("/api/admin/verify-password").send({ password: "wrong" });
      expect(r.status).toBe(401);
    }
    const locked = await request(app).post("/api/admin/verify-password").send({ password: "test-admin-pw-for-vitest" });
    expect(locked.status).toBe(429);
  });
});
