import type { Express } from "express";
import crypto from "crypto";
import Anthropic from "@anthropic-ai/sdk";
import { pool } from "../db";
import { isAdminIdentity } from "../admin-identity";

// ── 현장 질문 사전 자가 학습 ─────────────────────────────────────────────
// 같은 사용자가 짧은 시간 안에 "표현만 바꿔서 다시 질문"하면, 첫 질문의 현장 표현 → 둘째 질문의 기준 용어
// 짝을 후보로 쌓는다. 첫 질문이 👎(아쉬워요)를 받았으면 가중치를 높인다.
// 서로 다른 사용자 3명 이상·누적 4점 이상이면 자동 활성화되고, 관리자가 언제든 끄거나 삭제할 수 있다.
// 사전은 검색어 "추가"와 AI 참고 힌트(근거 아님)로만 쓰이며, 원문 질문은 저장하지 않는다(용어 짝만 저장).

let ready = false;
async function ensureTable() {
  if (ready) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS field_glossary (
      id SERIAL PRIMARY KEY,
      term TEXT NOT NULL UNIQUE,
      std_terms TEXT[] NOT NULL DEFAULT '{}',
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      evidence NUMERIC NOT NULL DEFAULT 0,
      reask_count INTEGER NOT NULL DEFAULT 0,
      neg_count INTEGER NOT NULL DEFAULT 0,
      user_hashes TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  ready = true;
}

const clean = (s: any, max: number) => (typeof s === "string" ? s.replace(/\s+/g, " ").trim().slice(0, max) : "");

export function registerFieldGlossaryRoutes(app: Express) {
  // 재질문 신호 수집 — 즉시 응답하고 학습은 백그라운드에서 처리
  app.post("/api/field-glossary/signal", async (req, res) => {
    res.json({ ok: true });
    try {
      const prev = clean(req.body?.prev, 300);
      const next = clean(req.body?.next, 300);
      const empId = clean(req.body?.employeeId, 50);
      if (prev.length < 4 || next.length < 4 || prev === next) return;
      await ensureTable();
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const r = await anthropic.messages.create({
        model: "claude-haiku-5-5",
        max_tokens: 400,
        system: '승강기 검사 앱 사용자가 연달아 한 두 질문이다. 둘째 질문이 첫 질문과 "같은 내용을 표현만 바꿔 다시 묻는 것"일 때만, 첫 질문의 현장 표현(구어·은어·약어, 2~8자)이 둘째 질문에서 어떤 기준/표준 용어로 바뀌었는지 짝을 뽑아라. 연도·숫자·일반어·조사만 바뀐 경우, 다른 주제의 질문이면 빈 배열. JSON만: {"pairs":[{"term":"인터폰","std":["비상통화장치"]}]} (최대 3쌍, std는 최대 3개). 첫 질문에도 둘째 질문에도 같은 말이 있으면 그 말은 term이 될 수 없다.',
        messages: [{ role: "user", content: `첫 질문: ${prev}\n둘째 질문: ${next}` }],
      });
      const raw = r.content[0].type === "text" ? r.content[0].text : "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      const pairs: { term: string; std: string[] }[] = Array.isArray(parsed?.pairs) ? parsed.pairs.slice(0, 3) : [];
      if (pairs.length === 0) return;
      const neg = (await pool.query(`SELECT 1 FROM ai_feedback WHERE question = $1 AND rating = -1 AND created_at > NOW() - INTERVAL '2 days' LIMIT 1`, [prev])).rowCount! > 0;
      const w = neg ? 2 : 1;
      const uh = empId ? crypto.createHash("sha256").update(empId).digest("hex").slice(0, 12) : "anon";
      for (const p of pairs) {
        const term = clean(p.term, 20);
        const std = (Array.isArray(p.std) ? p.std : []).map((x) => clean(x, 30)).filter((x) => x.length >= 2).slice(0, 3);
        if (term.length < 2 || std.length === 0) continue;
        if (next.replace(/\s+/g, "").includes(term.replace(/\s+/g, ""))) continue;
        if (!prev.replace(/\s+/g, "").includes(term.replace(/\s+/g, ""))) continue;
        await pool.query(
          `INSERT INTO field_glossary (term, std_terms, evidence, reask_count, neg_count, user_hashes)
           VALUES ($1, $2, $3, 1, $4, ARRAY[$5])
           ON CONFLICT (term) DO UPDATE SET
             std_terms = (SELECT ARRAY(SELECT DISTINCT x FROM unnest(field_glossary.std_terms || EXCLUDED.std_terms) x LIMIT 6)),
             evidence = field_glossary.evidence + $3,
             reask_count = field_glossary.reask_count + 1,
             neg_count = field_glossary.neg_count + $4,
             user_hashes = (SELECT ARRAY(SELECT DISTINCT x FROM unnest(field_glossary.user_hashes || $5::text) x)),
             updated_at = NOW()`,
          [term, std, w, neg ? 1 : 0, uh],
        );
      }
      // 자동 활성화: 서로 다른 사용자 3명 이상 + 누적 4점 이상 (관리자가 거부/비활성한 항목은 제외)
      await pool.query(`UPDATE field_glossary SET status = 'active', updated_at = NOW() WHERE status = 'pending' AND evidence >= 4 AND cardinality(user_hashes) >= 3`);
    } catch (e) {
      console.error("[field-glossary] 학습 실패:", (e as any)?.message);
    }
  });

  // 활성 항목 — 클라이언트가 검색어/힌트 확장에 사용
  app.get("/api/field-glossary/active", async (_req, res) => {
    try {
      await ensureTable();
      const r = await pool.query(`SELECT id, term, std_terms FROM field_glossary WHERE status = 'active' ORDER BY evidence DESC LIMIT 200`);
      res.json(r.rows.map((x) => ({ id: x.id, term: x.term, stdTerms: x.std_terms })));
    } catch {
      res.json([]);
    }
  });

  // 관리자 목록
  app.get("/api/field-glossary/admin", async (req, res) => {
    try {
      if (!isAdminIdentity(clean(req.query.employeeId, 50), clean(req.query.employeeName, 50))) return res.status(403).json({ error: "관리자만 조회할 수 있습니다." });
      await ensureTable();
      const r = await pool.query(`SELECT id, term, std_terms, status, evidence, reask_count, neg_count, cardinality(user_hashes) AS users, updated_at FROM field_glossary ORDER BY (status='pending') DESC, evidence DESC LIMIT 300`);
      res.json(r.rows.map((x) => ({ id: x.id, term: x.term, stdTerms: x.std_terms, status: x.status, evidence: Number(x.evidence), reask: x.reask_count, neg: x.neg_count, users: Number(x.users), updatedAt: x.updated_at })));
    } catch (e) {
      res.status(500).json({ error: "조회 실패" });
    }
  });

  // 관리자: 활성/보류/거부/삭제, 기준 용어 수정
  app.post("/api/field-glossary/:id/update", async (req, res) => {
    try {
      if (!isAdminIdentity(clean(req.body?.employeeId, 50), clean(req.body?.employeeName, 50))) return res.status(403).json({ error: "관리자만 변경할 수 있습니다." });
      await ensureTable();
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ error: "잘못된 ID" });
      const action = clean(req.body?.action, 10);
      if (action === "delete") {
        await pool.query(`DELETE FROM field_glossary WHERE id = $1`, [id]);
      } else if (["active", "pending", "rejected"].includes(action)) {
        await pool.query(`UPDATE field_glossary SET status = $2, updated_at = NOW() WHERE id = $1`, [id, action]);
      } else if (action === "edit") {
        const std = (Array.isArray(req.body?.stdTerms) ? req.body.stdTerms : []).map((x: any) => clean(x, 30)).filter((x: string) => x.length >= 2).slice(0, 6);
        if (std.length === 0) return res.status(400).json({ error: "기준 용어가 비어 있습니다." });
        await pool.query(`UPDATE field_glossary SET std_terms = $2, updated_at = NOW() WHERE id = $1`, [id, std]);
      } else return res.status(400).json({ error: "알 수 없는 동작" });
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "처리 실패" });
    }
  });
}
