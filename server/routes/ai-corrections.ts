import type { Express } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { pool } from "../db";
import { isAdminIdentity } from "../admin-identity";
import { getEmbedding } from "../embedding";

// ── 정정 카드 루프 ───────────────────────────────────────────────────────
// 아쉬워요 + 이용자 의견(정답 힌트) → AI가 "정정 카드" 초안 작성 → 관리자 1탭 승인
// → 이후 같은 취지의 질문(임베딩 유사도)에서 승인된 정정 내용을 답변 근거 앞에 붙인다.
// 승인 전(draft)에는 어떤 답변에도 영향을 주지 않는다. 모델 자체를 학습시키지는 않으며,
// "검증된 지식을 쌓아 정확히 불러오는" 방식이다.

export const CORRECTION_SIMILARITY = 0.82; // 이 이상일 때만 현재 질문에 붙인다(오적용 방지)
export const MIN_COMMENT_LEN = 8; // 이보다 짧은 의견은 사실 정보가 없다고 보고 초안을 만들지 않는다

let ready = false;
async function ensureTable() {
  if (ready) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_corrections (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL,
      wrong_answer TEXT NOT NULL,
      feedback_id INTEGER,
      user_comment TEXT,
      correction TEXT NOT NULL,
      basis TEXT,
      conditions TEXT,
      status VARCHAR(20) NOT NULL DEFAULT 'draft',
      embedding vector(1536),
      hit_count INTEGER NOT NULL DEFAULT 0,
      last_hit_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      reviewed_at TIMESTAMP
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_ai_corrections_status ON ai_corrections (status)`);
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_corrections_feedback ON ai_corrections (feedback_id) WHERE feedback_id IS NOT NULL`);
  ready = true;
}

const clean = (s: any, max: number) => (typeof s === "string" ? s.replace(/\r/g, "").trim().slice(0, max) : "");

// 클라이언트가 AI에게 보내는 질문 끝에 붙이는 자동 메모([시점 참고]·[현장 용어 참고]·[승강기 형식 참고])를 떼어
// 이용자가 실제로 입력한 질문만 남긴다. 임베딩·정정 카드 저장에 메모가 섞이면 같은 질문이 다르게 보인다.
export function stripClientNotes(q: string): string {
  return (q || "").split(/\n\n\[(?:시점 참고|현장 용어 참고|승강기 형식 참고)/)[0].trim();
}

const DRAFT_SYSTEM = `승강기 검사 앱의 AI 답변에 이용자가 '아쉬워요'를 눌렀다. 이용자 의견에 '정답 또는 정정할 사실'이 들어 있으면 정정 카드로 정리하고, 단순 불만·말투·형식 요청이면 usable을 false로 한다.
규칙:
- 이용자 의견에 없는 사실을 추가하지 않는다. 조문 번호·수치·날짜를 지어내지 않는다. 의견에 있는 조문 번호·수치는 그대로 보존한다.
- correction: 다음 답변에 그대로 반영할 수 있는 단정문 1~4문장. 질문의 핵심 쟁점에 답하는 형태로 쓴다.
- basis: 의견 또는 기존 답변에서 확인되는 근거(조문·표준화명·고시명). 없으면 "이용자 제보(미검증)".
- conditions: 설비 종류(엘리베이터/에스컬레이터), 설치·건축허가 시기, MR/MRL 등 적용 한정 조건. 없으면 빈 문자열.
JSON만 출력: {"usable":true,"correction":"...","basis":"...","conditions":"..."}`;

export interface DraftInput {
  feedbackId?: number | null;
  question: string;
  answer: string;
  reasons?: string[];
  comment: string;
}

// 피드백 한 건으로 정정 카드 초안을 만든다. 만들 수 없거나 만들 필요가 없으면 null.
export async function createCorrectionDraft(input: DraftInput): Promise<number | null> {
  const comment = clean(input.comment, 1500);
  if (comment.length < MIN_COMMENT_LEN) return null;
  input = { ...input, question: stripClientNotes(input.question) };
  if (!process.env.ANTHROPIC_API_KEY) return null;
  await ensureTable();
  if (input.feedbackId) {
    const dup = await pool.query(`SELECT 1 FROM ai_corrections WHERE feedback_id = $1`, [input.feedbackId]);
    if (dup.rowCount) return null;
  }
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const r = await anthropic.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 700,
    system: DRAFT_SYSTEM,
    messages: [{
      role: "user",
      content: `질문: ${clean(input.question, 600)}\n\n기존 답변(요약): ${clean(input.answer, 1200)}\n\n이용자가 고른 이유: ${(input.reasons || []).join(", ") || "(없음)"}\n이용자 의견: ${comment}`,
    }],
  });
  const raw = r.content[0]?.type === "text" ? r.content[0].text : "";
  let parsed: any;
  try { parsed = JSON.parse(raw.replace(/```json|```/g, "").trim()); } catch { return null; }
  if (!parsed?.usable) return null;
  const correction = clean(parsed.correction, 800);
  if (correction.length < 10) return null;
  const emb = await getEmbedding(clean(input.question, 600));
  const vec = emb ? `[${emb.join(",")}]` : null;
  const ins = await pool.query(
    `INSERT INTO ai_corrections (question, wrong_answer, feedback_id, user_comment, correction, basis, conditions, embedding)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::vector)
     ON CONFLICT DO NOTHING RETURNING id`,
    [clean(input.question, 600), clean(input.answer, 4000), input.feedbackId || null, comment, correction, clean(parsed.basis, 300) || "이용자 제보(미검증)", clean(parsed.conditions, 200), vec],
  );
  return ins.rows[0]?.id ?? null;
}

// 승인된 정정 카드 중 현재 질문과 같은 취지인 것을 찾아 프롬프트 문단으로 만든다. 없으면 "".
export async function findCorrectionSection(embedding: number[] | null): Promise<string> {
  try {
    if (!embedding) return "";
    await ensureTable();
    const vec = `[${embedding.join(",")}]`;
    const rows = await pool.query(
      `SELECT id, question, correction, basis, conditions, 1 - (embedding <=> $1::vector) AS similarity
       FROM ai_corrections WHERE status = 'approved' AND embedding IS NOT NULL
       ORDER BY embedding <=> $1::vector LIMIT 2`,
      [vec],
    );
    const hits = rows.rows.filter((r: any) => Number(r.similarity) >= CORRECTION_SIMILARITY);
    if (hits.length === 0) return "";
    pool.query(`UPDATE ai_corrections SET hit_count = hit_count + 1, last_hit_at = NOW() WHERE id = ANY($1)`, [hits.map((h: any) => h.id)]).catch(() => {});
    return formatCorrectionSection(hits);
  } catch {
    return "";
  }
}

export function formatCorrectionSection(hits: { question: string; correction: string; basis?: string | null; conditions?: string | null }[]): string {
  if (hits.length === 0) return "";
  const body = hits.map((h) =>
    `관련 질문: "${h.question}"\n정정 내용: ${h.correction}\n근거: ${h.basis || "이용자 제보"}${h.conditions ? `\n적용 조건: ${h.conditions}` : ""}`,
  ).join("\n\n");
  return `\n\n[정정 지식 — 관리자 승인됨, 이전 답변에서 이용자가 바로잡은 내용]\n${body}\n※ 현재 질문이 위 관련 질문과 같은 취지이고 적용 조건에 맞을 때만 반영하세요. 반영할 때는 정정 내용을 다른 자료보다 우선해 답하고, 근거 칸에 [정정 지식]이라고 밝히세요. 취지가 다르거나 조건에 맞지 않으면 무시하세요.`;
}

export function registerAiCorrectionRoutes(app: Express) {
  const adminOk = (req: any) => isAdminIdentity(clean(req.query?.employeeId ?? req.body?.employeeId, 50), clean(req.query?.employeeName ?? req.body?.employeeName, 50));

  // 목록 (관리자) — status: draft | approved | rejected
  app.get("/api/ai-corrections", async (req, res) => {
    try {
      if (!adminOk(req)) return res.status(403).json({ error: "관리자만 조회할 수 있습니다." });
      await ensureTable();
      const status = clean(req.query.status, 20);
      const params: any[] = [];
      let where = "";
      if (["draft", "approved", "rejected"].includes(status)) { where = "WHERE status = $1"; params.push(status); }
      const r = await pool.query(
        `SELECT id, question, wrong_answer, user_comment, correction, basis, conditions, status, hit_count, last_hit_at, created_at, reviewed_at
         FROM ai_corrections ${where} ORDER BY (status = 'draft') DESC, created_at DESC LIMIT 100`,
        params,
      );
      const counts = await pool.query(`SELECT status, COUNT(*)::int AS n FROM ai_corrections GROUP BY status`);
      res.json({ cards: r.rows, counts: Object.fromEntries(counts.rows.map((c: any) => [c.status, c.n])) });
    } catch {
      res.status(500).json({ error: "조회 실패" });
    }
  });

  // 승인 / 거부 / 되돌리기 / 수정 (관리자) — 승인 시 내용을 고쳐서 확정할 수 있다
  app.post("/api/ai-corrections/:id/update", async (req, res) => {
    try {
      if (!adminOk(req)) return res.status(403).json({ error: "관리자만 변경할 수 있습니다." });
      await ensureTable();
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ error: "잘못된 ID" });
      const action = clean(req.body?.action, 10);
      const correction = clean(req.body?.correction, 800);
      const basis = clean(req.body?.basis, 300);
      const conditions = clean(req.body?.conditions, 200);
      if (action === "approve" || action === "edit") {
        if (req.body?.correction !== undefined && correction.length < 10) return res.status(400).json({ error: "정정 내용이 너무 짧습니다." });
        await pool.query(
          `UPDATE ai_corrections SET
             correction = CASE WHEN $2::text <> '' THEN $2::text ELSE correction END,
             basis = CASE WHEN $3::text <> '' THEN $3::text ELSE basis END,
             conditions = CASE WHEN $4::boolean THEN $5::text ELSE conditions END,
             status = CASE WHEN $6::text = 'approve' THEN 'approved' ELSE status END,
             reviewed_at = CASE WHEN $6::text = 'approve' THEN NOW() ELSE reviewed_at END
           WHERE id = $1`,
          [id, correction, basis, req.body?.conditions !== undefined, conditions, action],
        );
      } else if (action === "reject") {
        await pool.query(`UPDATE ai_corrections SET status = 'rejected', reviewed_at = NOW() WHERE id = $1`, [id]);
      } else if (action === "revert") {
        await pool.query(`UPDATE ai_corrections SET status = 'draft', reviewed_at = NULL WHERE id = $1`, [id]);
      } else if (action === "delete") {
        await pool.query(`DELETE FROM ai_corrections WHERE id = $1`, [id]);
      } else return res.status(400).json({ error: "알 수 없는 동작" });
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "처리 실패" });
    }
  });

  // 기존 아쉬워요 의견에서 초안 가져오기 (관리자) — 아직 카드가 없는 의견만, 한 번에 최대 15건
  app.post("/api/ai-corrections/backfill", async (req, res) => {
    try {
      if (!adminOk(req)) return res.status(403).json({ error: "관리자만 실행할 수 있습니다." });
      await ensureTable();
      const rows = await pool.query(
        `SELECT f.id, f.question, f.answer, f.reasons, f.comment FROM ai_feedback f
         WHERE f.rating = -1 AND f.comment IS NOT NULL AND length(btrim(f.comment)) >= $1
           AND NOT EXISTS (SELECT 1 FROM ai_corrections c WHERE c.feedback_id = f.id)
         ORDER BY f.created_at DESC LIMIT 15`,
        [MIN_COMMENT_LEN],
      );
      let created = 0;
      for (const f of rows.rows) {
        try {
          const id = await createCorrectionDraft({ feedbackId: f.id, question: f.question, answer: f.answer, reasons: f.reasons, comment: f.comment });
          if (id) created++;
        } catch (e) {
          console.error("[정정 카드] 초안 생성 실패:", (e as any)?.message);
        }
      }
      res.json({ ok: true, scanned: rows.rows.length, created });
    } catch {
      res.status(500).json({ error: "가져오기 실패" });
    }
  });
}
