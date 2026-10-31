// 이메일 인증 가입 + 개인 비밀번호 로그인 (소속 공용 비밀번호 방식을 대체)
//
// 흐름
//  1) POST /api/auth/signup/request  {email}                      → 회사 도메인 확인 후 6자리 코드를 메일로 발송
//  2) POST /api/auth/signup          {email, code, org, name, empId?, password} → 코드 확인 후 계정 생성 + 로그인 토큰
//  3) POST /api/auth/login           {email, password}            → 로그인 토큰
//  4) POST /api/auth/password-reset/request {email}               → 가입된 메일이면 코드 발송(가입 여부는 노출하지 않음)
//  5) POST /api/auth/password-reset  {email, code, password}      → 비밀번호 변경
//  6) GET  /api/auth/verify                                       → 토큰 검증(이메일 정보가 없는 예전 토큰은 거부)
//
// 환경변수
//  MAIL_PROVIDER         smtp 또는 resend (생략 시 SMTP_USER가 있으면 smtp, 아니면 RESEND_API_KEY가 있으면 resend)
//  SMTP_USER, SMTP_PASS  SMTP 로그인 (Gmail이면 계정 주소 + 앱 비밀번호 16자리)
//  SMTP_HOST, SMTP_PORT  기본 smtp.gmail.com / 465
//  RESEND_API_KEY        Resend API 키 (도메인 인증 후 사용)
//  MAIL_FROM             발신 주소 (예: 검사통합검색앱 <noreply@인증된도메인>). SMTP(Gmail)는 생략 가능
//  ※ 발송 설정이 하나도 없으면 인증코드 요청은 503
//  ALLOWED_EMAIL_DOMAINS 가입 허용 도메인, 쉼표 구분 (기본 koelsa.or.kr)
//  ADMIN_EMAILS          관리자 이메일 목록, 쉼표 구분
//  JWT_SECRET            토큰 서명 키
import type { Express } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isAdminIdentity } from "../admin-identity";
import { isDuplicateName, isValidEmployeeId } from "../../client/src/lib/teams";

const CODE_TTL_MIN = 10;
const MAX_CODE_ATTEMPTS = 5;
const RESEND_COOLDOWN_SEC = 60;
const MAX_CODES_PER_HOUR = 5;
const MAX_LOGIN_FAILS = 5;
const LOGIN_LOCK_MIN = 15;
const MIN_PASSWORD_LEN = 8;

function jwtSecret(): string {
  return process.env.JWT_SECRET || "elevator-secret-key";
}

function listEnv(name: string, fallback: string): string[] {
  return (process.env[name] || fallback)
    .split(",")
    .map(s => s.trim().toLowerCase().replace(/^@/, ""))
    .filter(Boolean);
}

export function normalizeEmail(raw: unknown): string {
  return typeof raw === "string" ? raw.trim().toLowerCase() : "";
}

export function normalizeEmpId(raw: unknown): string {
  return typeof raw === "string" ? raw.trim() : "";
}

// ab***@koelsa.or.kr 형태로 일부만 보여준다.
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "";
  const keep = local.slice(0, 2);
  return `${keep}${"*".repeat(Math.max(local.length - keep.length, 3))}@${domain}`;
}

export function isAllowedEmail(email: string): boolean {
  const m = /^[a-z0-9._%+\-]+@([a-z0-9.\-]+)$/.exec(email);
  if (!m || email.length > 200) return false;
  return listEnv("ALLOWED_EMAIL_DOMAINS", "koelsa.or.kr").includes(m[1]);
}

function isAdminEmail(email: string): boolean {
  return listEnv("ADMIN_EMAILS", "").includes(email);
}

function hashCode(email: string, code: string): string {
  return crypto.createHash("sha256").update(`${email}:${code}:${jwtSecret()}`).digest("hex");
}

// ── 메일 발송 (테스트에서 교체 가능) ──
export type MailSender = (to: string, subject: string, text: string) => Promise<void>;

const noMailConfig = (detail = "") => Object.assign(new Error(`메일 발송 설정 없음${detail ? ` (${detail})` : ""}`), { code: "NO_MAIL_CONFIG" });

// 발송 방식: MAIL_PROVIDER=smtp | resend. 지정하지 않으면 SMTP_USER가 있으면 smtp,
// 아니면 RESEND_API_KEY가 있으면 resend. 나중에 회사 도메인을 Resend에 인증하면
// 환경변수만 MAIL_PROVIDER=resend 로 바꾸면 된다(코드 수정 불필요).
function mailProvider(): "smtp" | "resend" | null {
  const forced = (process.env.MAIL_PROVIDER || "").trim().toLowerCase();
  if (forced === "smtp" || forced === "resend") return forced;
  if (process.env.SMTP_USER) return "smtp";
  if (process.env.RESEND_API_KEY) return "resend";
  return null;
}

let smtpTransporter: any = null;
const smtpSender: MailSender = async (to, subject, text) => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) throw noMailConfig(`SMTP_USER ${user ? "있음" : "없음"}, SMTP_PASS ${pass ? "있음" : "없음"}`);
  if (!smtpTransporter) {
    const nodemailer = await import("nodemailer");
    const port = parseInt(process.env.SMTP_PORT || "465", 10);
    smtpTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }
  await smtpTransporter.sendMail({
    // Gmail은 발신 주소를 로그인 계정으로 고정하므로 기본값도 계정 주소를 쓴다.
    from: process.env.MAIL_FROM || `검사통합검색앱 <${user}>`,
    to,
    subject,
    text,
  });
};

const resendSender: MailSender = async (to, subject, text) => {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw noMailConfig();
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || "onboarding@resend.dev",
      to: [to],
      subject,
      text,
    }),
  });
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    throw new Error(`메일 발송 실패 ${r.status} ${body.slice(0, 200)}`);
  }
};

const defaultSender: MailSender = async (to, subject, text) => {
  const p = mailProvider();
  if (p === "smtp") return smtpSender(to, subject, text);
  if (p === "resend") return resendSender(to, subject, text);
  // 값은 절대 출력하지 않고, 비슷한 이름의 변수가 있는지(오타 확인용) 이름만 보여준다.
  const similar = Object.keys(process.env).filter(k => /smtp|stmp|mail|resend|pass|gmail/i.test(k));
  throw noMailConfig(`SMTP_USER, RESEND_API_KEY 환경변수가 서버에 전달되지 않음. 비슷한 이름의 변수: ${similar.length ? similar.join(", ") : "없음"}`);
};

let mailSender: MailSender = defaultSender;
export function setMailSenderForTest(fn: MailSender | null) {
  mailSender = fn || defaultSender;
}

// ── 테이블 (서버 기동 시 ensureChatTable과 별개로, 첫 요청 때 한 번 보장) ──
let tablesReady: Promise<void> | null = null;
async function ensureAuthTables(): Promise<void> {
  if (!tablesReady) {
    tablesReady = (async () => {
      const { pool } = await import("../db");
      await pool.query(`
        CREATE TABLE IF NOT EXISTS app_users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(200) NOT NULL UNIQUE,
          org VARCHAR(100) NOT NULL,
          name VARCHAR(50) NOT NULL,
          emp_id VARCHAR(50),
          password_hash TEXT NOT NULL,
          is_admin BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          last_login_at TIMESTAMP
        )
      `);
      // 사번은 사람 한 명을 가리키므로 중복 가입을 막는다(사번이 없는 예전 행은 제외).
      await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS ux_app_users_emp_id ON app_users (emp_id) WHERE emp_id IS NOT NULL`);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS email_verifications (
          id SERIAL PRIMARY KEY,
          email VARCHAR(200) NOT NULL,
          purpose VARCHAR(10) NOT NULL,
          code_hash VARCHAR(64) NOT NULL,
          attempts INTEGER NOT NULL DEFAULT 0,
          used BOOLEAN NOT NULL DEFAULT FALSE,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications (email, purpose, created_at DESC)`);
    })().catch(e => { tablesReady = null; throw e; });
  }
  return tablesReady;
}

// ── 로그인 실패 잠금 (서버 메모리, 재시작하면 초기화) ──
const loginFails = new Map<string, { count: number; lockedUntil: number }>();
function isLocked(email: string): boolean {
  const f = loginFails.get(email);
  return !!f && f.lockedUntil > Date.now();
}
function recordFail(email: string) {
  const f = loginFails.get(email) || { count: 0, lockedUntil: 0 };
  if (f.lockedUntil && f.lockedUntil <= Date.now()) { f.count = 0; f.lockedUntil = 0; }
  f.count += 1;
  if (f.count >= MAX_LOGIN_FAILS) f.lockedUntil = Date.now() + LOGIN_LOCK_MIN * 60_000;
  loginFails.set(email, f);
}
export function clearLoginFailsForTest() { loginFails.clear(); }

function issueToken(u: { email: string; org: string; name: string; emp_id: string | null }, role: string): string {
  return jwt.sign(
    { email: u.email, org: u.org, name: u.name, empId: u.emp_id || "", role },
    jwtSecret(),
    { expiresIn: "30d" }
  );
}

function roleOf(u: { email: string; is_admin: boolean }): string {
  return u.is_admin || isAdminEmail(u.email) ? "admin" : "user";
}

// 코드 발송 공통 처리. 반환: null=성공, 아니면 {status, error}
async function sendCode(email: string, purpose: "signup" | "reset"): Promise<{ status: number; error: string } | null> {
  const { pool } = await import("../db");
  const recent = await pool.query(
    `SELECT EXTRACT(EPOCH FROM (NOW() - created_at))::float AS age_sec FROM email_verifications
      WHERE email = $1 AND purpose = $2 ORDER BY created_at DESC LIMIT 1`,
    [email, purpose]
  );
  if (recent.rows.length > 0) {
    // 경과 시간을 DB 안에서 계산해 서버/DB 시간대 차이의 영향을 받지 않게 한다.
    if (recent.rows[0].age_sec < RESEND_COOLDOWN_SEC) {
      return { status: 429, error: `인증코드는 ${RESEND_COOLDOWN_SEC}초 후에 다시 요청할 수 있습니다.` };
    }
  }
  const hourly = await pool.query(
    `SELECT COUNT(*)::int AS n FROM email_verifications
      WHERE email = $1 AND created_at > NOW() - INTERVAL '1 hour'`,
    [email]
  );
  if (hourly.rows[0].n >= MAX_CODES_PER_HOUR) {
    return { status: 429, error: "인증코드 요청이 너무 많습니다. 잠시 후 다시 시도하세요." };
  }

  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
  const inserted = await pool.query(
    `INSERT INTO email_verifications (email, purpose, code_hash, expires_at)
     VALUES ($1, $2, $3, NOW() + ($4 || ' minutes')::interval) RETURNING id`,
    [email, purpose, hashCode(email, code), String(CODE_TTL_MIN)]
  );
  const id = inserted.rows[0].id;
  try {
    const title = purpose === "signup" ? "[검사통합검색앱] 가입 인증코드" : "[검사통합검색앱] 비밀번호 재설정 인증코드";
    await mailSender(
      email,
      title,
      `인증코드: ${code}\n\n${CODE_TTL_MIN}분 안에 앱에 입력해 주세요.\n본인이 요청하지 않았다면 이 메일을 무시하세요.`
    );
  } catch (e: any) {
    await pool.query(`DELETE FROM email_verifications WHERE id = $1`, [id]);
    console.error("[이메일 인증] 발송 실패:", e?.message || e);
    if (e?.code === "NO_MAIL_CONFIG") return { status: 503, error: "메일 발송이 아직 설정되지 않았습니다. 관리자에게 문의하세요." };
    return { status: 502, error: "메일 발송에 실패했습니다. 잠시 후 다시 시도하세요." };
  }
  return null;
}

// 코드 확인. 성공하면 해당 행을 사용 처리하고 true.
async function consumeCode(email: string, purpose: "signup" | "reset", code: string): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const { pool } = await import("../db");
  const rows = await pool.query(
    `SELECT id, code_hash, attempts, expires_at > NOW() AS alive
       FROM email_verifications
      WHERE email = $1 AND purpose = $2 AND used = FALSE
      ORDER BY created_at DESC LIMIT 1`,
    [email, purpose]
  );
  const row = rows.rows[0];
  if (!row || !row.alive) return { ok: false, status: 400, error: "인증코드가 없거나 만료되었습니다. 코드를 다시 요청하세요." };
  if (row.attempts >= MAX_CODE_ATTEMPTS) return { ok: false, status: 429, error: "인증코드 입력 횟수를 초과했습니다. 코드를 다시 요청하세요." };
  const given = Buffer.from(hashCode(email, String(code || "").trim()));
  const real = Buffer.from(row.code_hash);
  if (given.length !== real.length || !crypto.timingSafeEqual(given, real)) {
    await pool.query(`UPDATE email_verifications SET attempts = attempts + 1 WHERE id = $1`, [row.id]);
    return { ok: false, status: 400, error: "인증코드가 올바르지 않습니다." };
  }
  await pool.query(`UPDATE email_verifications SET used = TRUE WHERE id = $1`, [row.id]);
  return { ok: true };
}

function passwordError(pw: unknown): string | null {
  if (typeof pw !== "string" || pw.length < MIN_PASSWORD_LEN) return `비밀번호는 ${MIN_PASSWORD_LEN}자 이상이어야 합니다.`;
  if (pw.length > 72) return "비밀번호는 72자 이하여야 합니다.";
  return null;
}

export function registerAuthEmailRoutes(app: Express) {
  app.post("/api/auth/signup/request", async (req, res) => {
    try {
      await ensureAuthTables();
      const email = normalizeEmail(req.body?.email);
      if (!isAllowedEmail(email)) {
        const domains = listEnv("ALLOWED_EMAIL_DOMAINS", "koelsa.or.kr").map(d => "@" + d).join(", ");
        return res.status(400).json({ error: `${domains} 메일 주소만 가입할 수 있습니다.` });
      }
      const { pool } = await import("../db");
      const exists = await pool.query(`SELECT 1 FROM app_users WHERE email = $1`, [email]);
      if (exists.rows.length > 0) return res.status(409).json({ error: "이미 가입된 이메일입니다. 로그인하세요." });
      const err = await sendCode(email, "signup");
      if (err) return res.status(err.status).json({ error: err.error });
      res.json({ ok: true, expiresInMinutes: CODE_TTL_MIN });
    } catch (e) {
      console.error("[signup/request]", e);
      res.status(500).json({ error: "서버 오류" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      await ensureAuthTables();
      const email = normalizeEmail(req.body?.email);
      const org = typeof req.body?.org === "string" ? req.body.org.trim() : "";
      const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
      const empId = typeof req.body?.empId === "string" ? req.body.empId.trim() : "";
      const password = req.body?.password;
      if (!isAllowedEmail(email)) return res.status(400).json({ error: "가입할 수 없는 이메일입니다." });
      if (!org || !name) return res.status(400).json({ error: "소속과 이름을 입력하세요." });
      if (name.length > 50) return res.status(400).json({ error: "이름이 너무 깁니다." });
      const pwErr = passwordError(password);
      if (pwErr) return res.status(400).json({ error: pwErr });
      // 사번은 모든 가입자에게 필수 — 이름이 같은 사람이 나중에 생겨도 로그에서 구분할 수 있게 한다.
      if (!/^[0-9A-Za-z]{4,20}$/.test(empId)) {
        return res.status(400).json({ error: "사번을 입력하세요. (숫자/영문 4~20자)" });
      }
      // 동명이인으로 등록된 이름은 등록된 사번과도 일치해야 한다.
      if (isDuplicateName(name) && !isValidEmployeeId(name, empId)) {
        return res.status(400).json({ error: "동명이인이 있습니다. 올바른 사번을 입력하세요." });
      }

      const { pool } = await import("../db");
      const orgRow = await pool.query(`SELECT 1 FROM organizations WHERE name = $1`, [org]);
      if (orgRow.rows.length === 0) return res.status(400).json({ error: "존재하지 않는 소속입니다." });
      const exists = await pool.query(`SELECT 1 FROM app_users WHERE email = $1`, [email]);
      if (exists.rows.length > 0) return res.status(409).json({ error: "이미 가입된 이메일입니다. 로그인하세요." });
      const sameEmpId = await pool.query(`SELECT 1 FROM app_users WHERE emp_id = $1`, [empId]);
      if (sameEmpId.rows.length > 0) {
        return res.status(409).json({ error: "이미 가입된 사번입니다. 본인 계정이면 로그인하고, 아니면 관리자에게 문의하세요." });
      }

      const codeResult = await consumeCode(email, "signup", req.body?.code);
      if (!codeResult.ok) return res.status(codeResult.status).json({ error: codeResult.error });

      const hash = await bcrypt.hash(password as string, 10);
      const isAdmin = isAdminEmail(email);
      const ins = await pool.query(
        `INSERT INTO app_users (email, org, name, emp_id, password_hash, is_admin, last_login_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING email, org, name, emp_id`,
        [email, org, name, empId, hash, isAdmin]
      );
      const u = ins.rows[0];
      const role = isAdmin ? "admin" : "user";
      res.status(201).json({ token: issueToken(u, role), org: u.org, role, name: u.name, empId: u.emp_id || "", email: u.email });
    } catch (e: any) {
      if (e?.code === "23505") {
        const dupEmpId = String(e?.constraint || "").includes("emp_id");
        return res.status(409).json({ error: dupEmpId ? "이미 가입된 사번입니다. 관리자에게 문의하세요." : "이미 가입된 이메일입니다. 로그인하세요." });
      }
      console.error("[signup]", e);
      res.status(500).json({ error: "서버 오류" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      await ensureAuthTables();
      const empId = normalizeEmpId(req.body?.empId);
      const password = req.body?.password;
      // 로그인 화면에서 고른 소속 — 비밀번호 확인 후 가입 때 등록한 소속과 비교한다.
      // (소속 선택이 없는 예전 클라이언트 호환을 위해 값이 없으면 비교를 건너뜀)
      const orgInput = typeof req.body?.org === "string" ? req.body.org.trim() : "";
      if (!empId || typeof password !== "string" || !password) {
        return res.status(400).json({ error: "사번과 비밀번호를 입력하세요." });
      }
      const lockKey = `emp:${empId}`;
      if (isLocked(lockKey)) {
        return res.status(429).json({ error: `로그인 시도가 너무 많습니다. ${LOGIN_LOCK_MIN}분 후 다시 시도하세요.` });
      }
      const { pool } = await import("../db");
      const rows = await pool.query(`SELECT * FROM app_users WHERE emp_id = $1`, [empId]);
      const u = rows.rows[0];
      // 계정이 없어도 같은 비용의 비교를 해서 응답 시간으로 가입 여부가 드러나지 않게 한다.
      const ok = await bcrypt.compare(password, u?.password_hash || "$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi");
      if (!u || !ok) {
        recordFail(lockKey);
        return res.status(401).json({ error: "사번 또는 비밀번호가 올바르지 않습니다." });
      }
      if (u.is_blocked) {
        return res.status(403).json({ error: "사용이 제한된 계정입니다. 관리자에게 문의하세요.", blocked: true });
      }
      if (orgInput && orgInput !== u.org) {
        return res.status(403).json({ error: "선택한 소속이 가입 시 등록한 소속과 다릅니다." });
      }
      loginFails.delete(lockKey);
      await pool.query(`UPDATE app_users SET last_login_at = NOW() WHERE id = $1`, [u.id]);
      const role = roleOf(u);
      res.json({ token: issueToken(u, role), org: u.org, role, name: u.name, empId: u.emp_id || "", email: u.email });
    } catch (e) {
      console.error("[login]", e);
      res.status(500).json({ error: "서버 오류" });
    }
  });

  app.post("/api/auth/password-reset/request", async (req, res) => {
    try {
      await ensureAuthTables();
      const empId = normalizeEmpId(req.body?.empId);
      if (!empId) return res.status(400).json({ error: "사번을 입력하세요." });
      const { pool } = await import("../db");
      const rows = await pool.query(`SELECT email FROM app_users WHERE emp_id = $1`, [empId]);
      let maskedEmail = "";
      if (rows.rows.length > 0) {
        const email = rows.rows[0].email as string;
        const err = await sendCode(email, "reset");
        if (err) return res.status(err.status).json({ error: err.error });
        maskedEmail = maskEmail(email);
      }
      // 가입 여부와 관계없이 같은 형태로 응답 (가입된 경우에만 가려진 이메일이 들어간다)
      res.json({ ok: true, expiresInMinutes: CODE_TTL_MIN, maskedEmail });
    } catch (e) {
      console.error("[reset/request]", e);
      res.status(500).json({ error: "서버 오류" });
    }
  });

  app.post("/api/auth/password-reset", async (req, res) => {
    try {
      await ensureAuthTables();
      const empId = normalizeEmpId(req.body?.empId);
      const pwErr = passwordError(req.body?.password);
      if (!empId) return res.status(400).json({ error: "사번을 입력하세요." });
      if (pwErr) return res.status(400).json({ error: pwErr });
      const { pool } = await import("../db");
      const exists = await pool.query(`SELECT id, email FROM app_users WHERE emp_id = $1`, [empId]);
      if (exists.rows.length === 0) return res.status(400).json({ error: "인증코드가 없거나 만료되었습니다. 코드를 다시 요청하세요." });
      const email = exists.rows[0].email as string;
      const codeResult = await consumeCode(email, "reset", req.body?.code);
      if (!codeResult.ok) return res.status(codeResult.status).json({ error: codeResult.error });
      const hash = await bcrypt.hash(req.body.password as string, 10);
      await pool.query(`UPDATE app_users SET password_hash = $1 WHERE id = $2`, [hash, exists.rows[0].id]);
      loginFails.delete(`emp:${empId}`);
      res.json({ ok: true });
    } catch (e) {
      console.error("[reset]", e);
      res.status(500).json({ error: "서버 오류" });
    }
  });

  // 본인 소속 변경 — 로그인 토큰 + 비밀번호 재확인. 변경 기록(account_changes)은 있으면 남기고,
  // 표가 아직 없어도 변경 자체는 성공한다(기록 실패는 서버 로그에만 남김).
  app.post("/api/auth/change-org", async (req, res) => {
    try {
      await ensureAuthTables();
      const auth = req.headers.authorization;
      if (!auth) return res.status(401).json({ error: "다시 로그인해 주세요." });
      let decoded: any;
      try { decoded = jwt.verify(auth.replace("Bearer ", ""), jwtSecret()); } catch { return res.status(401).json({ error: "다시 로그인해 주세요." }); }
      if (!decoded?.email) return res.status(401).json({ error: "다시 로그인해 주세요." });
      const newOrg = typeof req.body?.org === "string" ? req.body.org.trim() : "";
      const password = req.body?.password;
      if (!newOrg) return res.status(400).json({ error: "변경할 소속을 선택해 주세요." });
      if (typeof password !== "string" || !password) return res.status(400).json({ error: "비밀번호를 입력하세요." });
      const { pool } = await import("../db");
      const rows = await pool.query(`SELECT * FROM app_users WHERE email = $1`, [decoded.email]);
      const u = rows.rows[0];
      if (!u) return res.status(401).json({ error: "계정을 찾을 수 없습니다." });
      if (u.is_blocked) return res.status(403).json({ error: "사용이 제한된 계정입니다. 관리자에게 문의하세요.", blocked: true });
      const lockKey = `emp:${u.emp_id || u.email}`;
      if (isLocked(lockKey)) {
        return res.status(429).json({ error: `시도가 너무 많습니다. ${LOGIN_LOCK_MIN}분 후 다시 시도하세요.` });
      }
      const ok = await bcrypt.compare(password, u.password_hash);
      if (!ok) {
        recordFail(lockKey);
        return res.status(401).json({ error: "비밀번호가 올바르지 않습니다." });
      }
      loginFails.delete(lockKey);
      if (newOrg === u.org) return res.status(400).json({ error: "현재 소속과 같습니다. 변경할 소속을 선택해 주세요." });
      const orgRow = await pool.query(`SELECT 1 FROM organizations WHERE name = $1`, [newOrg]);
      if (orgRow.rows.length === 0) return res.status(400).json({ error: "존재하지 않는 소속입니다." });
      const oldOrg = u.org;
      await pool.query(`UPDATE app_users SET org = $1 WHERE id = $2`, [newOrg, u.id]);
      try {
        await pool.query(
          `INSERT INTO account_changes (emp_id, name, kind, from_value, to_value, by_emp_id, by_name) VALUES ($1, $2, 'org_change', $3, $4, $1, $2)`,
          [u.emp_id || "", u.name, oldOrg, newOrg]
        );
      } catch (e) {
        console.warn("[change-org] 변경 기록 저장 실패(표 없음?):", (e as any)?.message);
      }
      const updated = { ...u, org: newOrg };
      res.json({ ok: true, org: newOrg, previousOrg: oldOrg, token: issueToken(updated, roleOf(updated)) });
    } catch (e) {
      console.error("[change-org]", e);
      res.status(500).json({ error: "서버 오류" });
    }
  });

  // ── 관리자 전용: 사용자 관리(목록 · 소속 변경 · 접속 차단/해제 · 변경 기록) ──
  // 토큰의 사번·이름이 관리자(노준호)인 경우에만 허용한다(클라이언트가 보내는 admin 플래그는 믿지 않음).
  async function requireAdmin(req: any, res: any): Promise<any | null> {
    await ensureAuthTables();
    const auth = req.headers.authorization;
    if (!auth) { res.status(401).json({ error: "다시 로그인해 주세요." }); return null; }
    let decoded: any;
    try { decoded = jwt.verify(auth.replace("Bearer ", ""), jwtSecret()); } catch { res.status(401).json({ error: "다시 로그인해 주세요." }); return null; }
    if (!decoded?.email || !isAdminIdentity(decoded.empId, decoded.name)) {
      res.status(403).json({ error: "관리자만 사용할 수 있습니다." });
      return null;
    }
    return decoded;
  }
  const isProtectedAdmin = (u: any) => isAdminIdentity(u.emp_id || "", u.name);
  async function logChange(pool: any, u: any, kind: string, from: string | null, to: string | null, by: any) {
    try {
      await pool.query(
        `INSERT INTO account_changes (emp_id, name, kind, from_value, to_value, by_emp_id, by_name) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [u.emp_id || "", u.name, kind, from, to, by.empId || "", by.name || ""]
      );
    } catch (e) {
      console.warn("[account_changes] 기록 저장 실패(표 없음?):", (e as any)?.message);
    }
  }
  const blockedColumnsMissing = (e: any) => /is_blocked|blocked_reason/.test(String(e?.message || ""));

  app.get("/api/admin/users", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res); if (!admin) return;
      const { pool } = await import("../db");
      const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
      const params: any[] = [];
      let where = "";
      if (q) { params.push(`%${q}%`); where = `WHERE name ILIKE $1 OR emp_id ILIKE $1 OR org ILIKE $1`; }
      const rows = await pool.query(`SELECT * FROM app_users ${where} ORDER BY org, name LIMIT 500`, params);
      res.json(rows.rows.map((u: any) => ({
        id: u.id, name: u.name, empId: u.emp_id || "", org: u.org, email: u.email,
        blocked: !!u.is_blocked, blockedReason: u.blocked_reason || "",
        lastLoginAt: u.last_login_at, isAdmin: isProtectedAdmin(u),
      })));
    } catch (e) {
      console.error("[admin/users]", e);
      res.status(500).json({ error: "서버 오류" });
    }
  });

  app.post("/api/admin/users/:id/org", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res); if (!admin) return;
      const id = parseInt(req.params.id, 10);
      const newOrg = typeof req.body?.org === "string" ? req.body.org.trim() : "";
      if (!id || !newOrg) return res.status(400).json({ error: "대상과 소속을 선택해 주세요." });
      const { pool } = await import("../db");
      const rows = await pool.query(`SELECT * FROM app_users WHERE id = $1`, [id]);
      const u = rows.rows[0];
      if (!u) return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
      if (u.org === newOrg) return res.status(400).json({ error: "현재 소속과 같습니다." });
      const orgRow = await pool.query(`SELECT 1 FROM organizations WHERE name = $1`, [newOrg]);
      if (orgRow.rows.length === 0) return res.status(400).json({ error: "존재하지 않는 소속입니다." });
      await pool.query(`UPDATE app_users SET org = $1 WHERE id = $2`, [newOrg, id]);
      await logChange(pool, u, "org_change", u.org, newOrg, admin);
      res.json({ ok: true, org: newOrg, previousOrg: u.org });
    } catch (e) {
      console.error("[admin/users/org]", e);
      res.status(500).json({ error: "서버 오류" });
    }
  });

  app.post("/api/admin/users/:id/block", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res); if (!admin) return;
      const id = parseInt(req.params.id, 10);
      const reason = typeof req.body?.reason === "string" ? req.body.reason.trim().slice(0, 200) : "";
      const { pool } = await import("../db");
      const rows = await pool.query(`SELECT * FROM app_users WHERE id = $1`, [id]);
      const u = rows.rows[0];
      if (!u) return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
      if (isProtectedAdmin(u)) return res.status(400).json({ error: "관리자 계정은 차단할 수 없습니다." });
      try {
        await pool.query(`UPDATE app_users SET is_blocked = TRUE, blocked_reason = $1 WHERE id = $2`, [reason || null, id]);
      } catch (e) {
        if (blockedColumnsMissing(e)) return res.status(500).json({ error: "DB에 차단 칸이 없습니다. add_user_block_columns.sql을 먼저 실행해 주세요." });
        throw e;
      }
      await logChange(pool, u, "block", null, reason || null, admin);
      res.json({ ok: true });
    } catch (e) {
      console.error("[admin/users/block]", e);
      res.status(500).json({ error: "서버 오류" });
    }
  });

  app.post("/api/admin/users/:id/unblock", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res); if (!admin) return;
      const id = parseInt(req.params.id, 10);
      const { pool } = await import("../db");
      const rows = await pool.query(`SELECT * FROM app_users WHERE id = $1`, [id]);
      const u = rows.rows[0];
      if (!u) return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
      try {
        await pool.query(`UPDATE app_users SET is_blocked = FALSE, blocked_reason = NULL WHERE id = $1`, [id]);
      } catch (e) {
        if (blockedColumnsMissing(e)) return res.status(500).json({ error: "DB에 차단 칸이 없습니다. add_user_block_columns.sql을 먼저 실행해 주세요." });
        throw e;
      }
      await logChange(pool, u, "unblock", null, null, admin);
      res.json({ ok: true });
    } catch (e) {
      console.error("[admin/users/unblock]", e);
      res.status(500).json({ error: "서버 오류" });
    }
  });

  app.get("/api/admin/account-changes", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res); if (!admin) return;
      const { pool } = await import("../db");
      try {
        const rows = await pool.query(`SELECT * FROM account_changes ORDER BY created_at DESC LIMIT 50`);
        res.json(rows.rows.map((r: any) => ({
          id: r.id, empId: r.emp_id, name: r.name, kind: r.kind, from: r.from_value, to: r.to_value,
          byEmpId: r.by_emp_id, byName: r.by_name, createdAt: r.created_at,
        })));
      } catch {
        res.json([]); // 기록 표가 아직 없으면 빈 목록
      }
    } catch (e) {
      console.error("[admin/account-changes]", e);
      res.status(500).json({ error: "서버 오류" });
    }
  });

  app.get("/api/auth/verify", async (req, res) => {
    try {
      await ensureAuthTables();
      const auth = req.headers.authorization;
      if (!auth) return res.status(401).json({ error: "인증 필요" });
      const decoded = jwt.verify(auth.replace("Bearer ", ""), jwtSecret()) as any;
      // 이메일 가입 이전에 발급된 토큰(소속 공용 비밀번호 방식)은 더 이상 인정하지 않는다.
      if (!decoded?.email) return res.status(401).json({ error: "다시 로그인해 주세요." });
      const { pool } = await import("../db");
      const rows = await pool.query(`SELECT * FROM app_users WHERE email = $1`, [decoded.email]);
      const u = rows.rows[0];
      if (!u) return res.status(401).json({ error: "계정을 찾을 수 없습니다." });
      if (u.is_blocked) return res.status(403).json({ error: "사용이 제한된 계정입니다. 관리자에게 문의하세요.", blocked: true });
      res.json({ email: u.email, org: u.org, name: u.name, empId: u.emp_id || "", role: roleOf(u) });
    } catch (e) {
      res.status(401).json({ error: "토큰 만료 또는 유효하지 않음" });
    }
  });
}
