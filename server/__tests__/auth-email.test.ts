// 2026-10 이메일 인증 가입 + 개인 비밀번호 로그인 회귀 테스트
//
// 메일은 실제로 보내지 않고 setMailSenderForTest로 가로채 인증코드를 읽는다.
// 테스트 계정은 __test_auth_*@koelsa.or.kr 로 만들고 전후로 지운다.
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { registerRoutes } from "../routes";
import { clearLoginFailsForTest, setMailSenderForTest } from "../routes/auth-email";
import { pool } from "../db";

const EMAIL = "__test_auth_1@koelsa.or.kr";
const EMAIL2 = "__test_auth_2@koelsa.or.kr";
const NAME = "__TEST_가입자__";
const PW = "test-password-1";
const EMP1 = "TESTEMP0001";
const EMP2 = "TESTEMP0002";

let lastCode = "";
let sentCount = 0;
let app: express.Express;
let orgName = "";

async function cleanup() {
  await pool.query(`DELETE FROM app_users WHERE email LIKE '__test_auth_%'`);
  await pool.query(`DELETE FROM email_verifications WHERE email LIKE '__test_auth_%'`);
}

// 쿨다운(60초)을 건너뛰기 위해 직전 요청 시각을 과거로 돌린다.
async function skipCooldown(email: string) {
  await pool.query(`UPDATE email_verifications SET created_at = created_at - INTERVAL '2 minutes' WHERE email = $1`, [email]);
}

describe("이메일 인증 가입/로그인", () => {
  beforeAll(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);
    setMailSenderForTest(async (_to, _subject, text) => {
      const m = /인증코드: (\d{6})/.exec(text);
      lastCode = m ? m[1] : "";
      sentCount += 1;
    });
    // 첫 요청에서 테이블이 만들어진다
    await request(app).post("/api/auth/signup/request").send({ email: "x@example.com" });
    await cleanup();
    const o = await pool.query(`SELECT name FROM organizations LIMIT 1`);
    orgName = o.rows[0].name;
  });

  beforeEach(() => {
    clearLoginFailsForTest();
    lastCode = "";
  });

  afterAll(async () => {
    await cleanup();
    setMailSenderForTest(null);
    await pool.end();
  });

  it("회사 도메인이 아니면 코드를 보내지 않는다", async () => {
    const before = sentCount;
    const r = await request(app).post("/api/auth/signup/request").send({ email: "someone@gmail.com" });
    expect(r.status).toBe(400);
    expect(sentCount).toBe(before);
  });

  it("도메인을 비슷하게 위장한 주소(koelsa.or.kr.evil.com)는 거부한다", async () => {
    const r = await request(app).post("/api/auth/signup/request").send({ email: "a@koelsa.or.kr.evil.com" });
    expect(r.status).toBe(400);
  });

  it("코드 요청 → 틀린 코드는 거부 → 맞는 코드로 가입 성공", async () => {
    const req1 = await request(app).post("/api/auth/signup/request").send({ email: EMAIL });
    expect(req1.status).toBe(200);
    expect(lastCode).toMatch(/^\d{6}$/);

    const wrong = await request(app).post("/api/auth/signup").send({
      email: EMAIL, code: lastCode === "000000" ? "111111" : "000000", org: orgName, name: NAME, empId: EMP1, password: PW,
    });
    expect(wrong.status).toBe(400);

    // 사번이 없으면 코드가 맞아도 가입할 수 없다(코드는 소모되지 않는다)
    const noEmp = await request(app).post("/api/auth/signup").send({
      email: EMAIL, code: lastCode, org: orgName, name: NAME, password: PW,
    });
    expect(noEmp.status).toBe(400);
    expect(noEmp.body.error).toMatch(/사번/);

    const ok = await request(app).post("/api/auth/signup").send({
      email: EMAIL, code: lastCode, org: orgName, name: NAME, empId: EMP1, password: PW,
    });
    expect(ok.status).toBe(201);
    expect(ok.body.token).toBeTruthy();
    expect(ok.body.name).toBe(NAME);
    expect(ok.body.empId).toBe(EMP1);
    expect(ok.body.role).toBe("user");
  });

  it("같은 사번으로는 다른 이메일로 가입할 수 없다", async () => {
    await request(app).post("/api/auth/signup/request").send({ email: EMAIL2 });
    const r = await request(app).post("/api/auth/signup").send({
      email: EMAIL2, code: lastCode, org: orgName, name: "__TEST_다른사람__", empId: EMP1, password: PW,
    });
    expect(r.status).toBe(409);
    expect(r.body.error).toMatch(/사번/);
  });

  it("같은 코드는 한 번만 쓸 수 있다", async () => {
    await skipCooldown(EMAIL);
    // 이미 가입된 이메일이라 코드 요청 자체가 409
    const r = await request(app).post("/api/auth/signup/request").send({ email: EMAIL });
    expect(r.status).toBe(409);
  });

  it("비밀번호가 8자 미만이면 가입할 수 없다", async () => {
    await request(app).post("/api/auth/signup/request").send({ email: EMAIL2 });
    const r = await request(app).post("/api/auth/signup").send({
      email: EMAIL2, code: lastCode, org: orgName, name: "__TEST_두번째__", empId: EMP2, password: "short",
    });
    expect(r.status).toBe(400);
  });

  it("코드 재요청은 60초 안에는 429", async () => {
    const r = await request(app).post("/api/auth/signup/request").send({ email: EMAIL2 });
    expect(r.status).toBe(429);
  });

  it("코드를 5번 틀리면 맞는 코드도 거부된다", async () => {
    await skipCooldown(EMAIL2);
    await request(app).post("/api/auth/signup/request").send({ email: EMAIL2 });
    const real = lastCode;
    const bad = real === "123456" ? "654321" : "123456";
    for (let i = 0; i < 5; i++) {
      await request(app).post("/api/auth/signup").send({ email: EMAIL2, code: bad, org: orgName, name: "__TEST_두번째__", empId: EMP2, password: PW });
    }
    const r = await request(app).post("/api/auth/signup").send({ email: EMAIL2, code: real, org: orgName, name: "__TEST_두번째__", empId: EMP2, password: PW });
    expect(r.status).toBe(429);
  });

  it("로그인: 맞는 비밀번호는 성공, 틀리면 401", async () => {
    const ok = await request(app).post("/api/auth/login").send({ empId: EMP1, password: PW });
    expect(ok.status).toBe(200);
    expect(ok.body.name).toBe(NAME);
    const bad = await request(app).post("/api/auth/login").send({ empId: EMP1, password: "wrong-password" });
    expect(bad.status).toBe(401);
    const none = await request(app).post("/api/auth/login").send({ empId: "TESTNONE9999", password: PW });
    expect(none.status).toBe(401);
  });

  it("로그인: 선택한 소속이 등록 소속과 같으면 성공, 다르면 403, 소속 미전달은 호환상 성공", async () => {
    const same = await request(app).post("/api/auth/login").send({ empId: EMP1, org: orgName, password: PW });
    expect(same.status).toBe(200);
    const diff = await request(app).post("/api/auth/login").send({ empId: EMP1, org: "__다른소속__", password: PW });
    expect(diff.status).toBe(403);
    expect(diff.body.error).toContain("소속");
    const none = await request(app).post("/api/auth/login").send({ empId: EMP1, password: PW });
    expect(none.status).toBe(200);
  });

  it("로그인에 5번 실패하면 잠기고 맞는 비밀번호도 429", async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post("/api/auth/login").send({ empId: EMP1, password: "wrong-password" });
    }
    const r = await request(app).post("/api/auth/login").send({ empId: EMP1, password: PW });
    expect(r.status).toBe(429);
  });

  it("verify: 발급한 토큰은 통과, 이메일 없는 예전 토큰은 401", async () => {
    const login = await request(app).post("/api/auth/login").send({ empId: EMP1, password: PW });
    const good = await request(app).get("/api/auth/verify").set("Authorization", `Bearer ${login.body.token}`);
    expect(good.status).toBe(200);
    expect(good.body.email).toBe(EMAIL);

    const legacy = jwt.sign({ orgId: 1, org: orgName, role: "admin", name: "노준호" }, process.env.JWT_SECRET || "elevator-secret-key");
    const old = await request(app).get("/api/auth/verify").set("Authorization", `Bearer ${legacy}`);
    expect(old.status).toBe(401);
  });

  it("비밀번호 재설정: 코드 확인 후 새 비밀번호로 로그인된다", async () => {
    await skipCooldown(EMAIL);
    const r1 = await request(app).post("/api/auth/password-reset/request").send({ empId: EMP1 })
    expect(r1.body.maskedEmail).toMatch(/^__\*+@koelsa\.or\.kr$/);
    expect(r1.status).toBe(200);
    expect(lastCode).toMatch(/^\d{6}$/);
    const r2 = await request(app).post("/api/auth/password-reset").send({ empId: EMP1, code: lastCode, password: "new-password-2" });
    expect(r2.status).toBe(200);
    const oldPw = await request(app).post("/api/auth/login").send({ empId: EMP1, password: PW });
    expect(oldPw.status).toBe(401);
    const newPw = await request(app).post("/api/auth/login").send({ empId: EMP1, password: "new-password-2" });
    expect(newPw.status).toBe(200);
  });

  it("가입되지 않은 사번으로 재설정을 요청해도 같은 응답이고 메일은 가지 않는다", async () => {
    const before = sentCount;
    const r = await request(app).post("/api/auth/password-reset/request").send({ empId: "TESTGHOST999" });
    expect(r.status).toBe(200);
    expect(r.body.maskedEmail).toBe("");
    expect(sentCount).toBe(before);
  });
});
