import type { Express } from "express";
import Anthropic from "@anthropic-ai/sdk";

// ── "자료 범위 밖" 답변 → AI 웹 검색 보강 → 관리자 승인 파이프라인 ──────────
// [2026-09] 사용자 피드백(좋아요/아쉬워요)만으로는 데이터가 느리게 쌓인다는 문제를
// 보완하기 위해 추가. AI가 "이 앱 자료 범위 밖입니다"로 답한 질문을 감지해
// 백그라운드에서 웹 검색으로 참고자료 후보를 찾아두고, 관리자가 직접 원문 링크를
// 확인한 뒤 승인한 것만 이후 답변의 컨텍스트로 쓰인다(자동 반영 없음).
//
// ai_answer_pool(사람이 좋아요/아쉬워요로 검증한 답변)과는 신뢰 수준이 다르므로
// 별도 테이블(ai_research_candidates)에 저장하고, 승인 전에는 어떤 사용자 답변에도
// 노출되지 않는다. 승인된 자료는 답변에 "[참고자료 - 외부검색]"으로 출처를 명확히
// 구분해 인용된다(검사기준/판정지침/기술자료와 혼동되지 않도록).

// 답변 텍스트가 "이 앱 자료로는 답을 찾을 수 없다"는 취지로 끝났는지 감지.
// 오탐(관련 자료가 있는데 이 문구가 우연히 섞인 경우)을 줄이기 위해 여러 표현을
// 함께 보되, 실제 관측된 표현(소음/장애인 공간 허용오차/수시검사 서류 사례)을
// 우선 반영했다.
const OUT_OF_SCOPE_PATTERNS = [
  /자료\s*범위\s*밖/,
  /확인할\s*수\s*없습니다/,
  /찾을\s*수\s*없습니다/,
  /관련\s*법령[·ㆍ]?\s*기관\s*확인이?\s*필요/,
  /이 앱(이 다루는)?\s*자료(에서는)?\s*(확인되지|없습니다|다루지)/,
];

export function isOutOfScopeAnswer(replyText: string): boolean {
  if (!replyText) return false;
  return OUT_OF_SCOPE_PATTERNS.some((re) => re.test(replyText));
}

// 백그라운드 보강 작업 — 사용자 응답과 완전히 분리된 fire-and-forget 함수.
// 절대 사용자 응답 지연에 영향을 주면 안 되므로, 호출부에서 await하지 않는다.
// 실패해도 조용히 로그만 남기고 끝난다(재시도하지 않음 — 다음에 같은 취지의
// 질문이 들어오면 다시 트리거되므로 굳이 재시도 큐를 둘 필요가 없다).
export async function enrichOutOfScopeAnswer(userQuestion: string, originalAnswer: string) {
  try {
    const { pool } = await import("../db");

    // 같은 질문(또는 매우 비슷한 질문)이 이미 검토 대기/승인 상태로 있으면 중복 검색을
    // 피한다 — 완전 일치 기준의 가벼운 체크(임베딩 유사도까지는 과함, 반복 질문은
    // 보통 문구가 거의 같음).
    const existing = await pool.query(
      `SELECT id FROM ai_research_candidates WHERE question = $1 AND status != 'rejected' LIMIT 1`,
      [userQuestion]
    );
    if (existing.rows.length > 0) return;

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: `당신은 승강기 안전검사 관련 공신력 있는 참고자료를 조사하는 리서치 보조원이다.
아래 질문은 "AI 검사가이드" 앱의 자체 자료(검사기준 별표22, 판정지침, 기술자료, 현장메모)에서 답을 찾지 못했다.
웹 검색으로 이 질문에 도움이 될 공신력 있는 자료를 찾아라.

## 검색 범위 (반드시 지킬 것)
- 국가법령정보센터(law.go.kr), 국가표준(KS, e나라표준인증), 정부기관·공단(예: 한국승강기안전공단)의 공식 문서만 신뢰
- 개인 블로그, 출처 불명 커뮤니티 글, 광고성 페이지는 절대 인용하지 않는다
- 위 기준에 맞는 자료를 찾지 못하면 억지로 답을 만들지 말고 "신뢰할 수 있는 자료를 찾지 못했다"고 명시한다

## 답변 형식
1. 찾은 자료의 핵심 내용을 요약(검사원이 현장에서 바로 참고할 수 있도록 명확하게)
2. 이 자료가 왜 신뢰할 만한지(출처 기관/문서명) 짧게 설명
3. 이 자료는 어디까지나 참고용이며, 실제 승강기 검사기준(별표22)이 아니라는 점을 명시

승강기 자체 검사기준을 판정하는 게 아니라, 이 앱 DB에 없는 인접 분야(예: 소음, 진동, 관련 타법령) 정보를 보충하는 역할임을 유지해라.`,
      messages: [{ role: "user", content: `질문: "${userQuestion}"\n\n(참고: 앱이 이 질문에 이미 내놓은 답변 — "${originalAnswer.slice(0, 300)}")` }],
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 3 } as any],
    } as any);

    // 텍스트 블록만 모아 요약으로 사용 (thinking/tool_use 블록 제외)
    const summary = (response.content || [])
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("\n")
      .trim();

    if (!summary || /찾지\s*못했/.test(summary)) {
      // 신뢰할 만한 자료를 못 찾은 경우 후보로 남기지 않는다 — 관리자가 검토할
      // 가치가 없는 "결과 없음" 항목으로 패널을 채우지 않기 위함.
      return;
    }

    // 인용된 출처 URL 추출 (web_search_tool_result 블록의 citations에서)
    const sources: { url: string; title: string }[] = [];
    for (const block of (response.content || []) as any[]) {
      if (block.type === "text" && Array.isArray(block.citations)) {
        for (const c of block.citations) {
          if (c.type === "web_search_result_location" && c.url) {
            if (!sources.find((s) => s.url === c.url)) {
              sources.push({ url: c.url, title: c.title || c.url });
            }
          }
        }
      }
    }

    if (sources.length === 0) {
      // 인용 출처가 하나도 없으면(검색이 실행 안 됐거나 결과가 없었던 경우) 신뢰도가
      // 낮으므로 후보로 등록하지 않는다.
      return;
    }

    await pool.query(
      `INSERT INTO ai_research_candidates (question, original_answer, summary, sources, status)
       VALUES ($1, $2, $3, $4::jsonb, 'pending_review')`,
      [userQuestion, originalAnswer.slice(0, 2000), summary, JSON.stringify(sources)]
    );
  } catch (e) {
    console.error("[외부자료 보강] 실패:", e);
  }
}

export function registerResearchCandidateRoutes(app: Express) {
  // 관리자 모드: 외부자료 후보 목록 조회
  app.get("/api/ai-research-candidates", async (req, res) => {
    try {
      const { pool } = await import("../db");
      const status = typeof req.query.status === "string" ? req.query.status : undefined;
      const validStatuses = ["pending_review", "approved", "rejected"];
      const whereClause = status && validStatuses.includes(status) ? `WHERE status = $1` : "";
      const params: any[] = status && validStatuses.includes(status) ? [status] : [];

      const rows = await pool.query(
        `SELECT id, question, original_answer, summary, sources, status, created_at, reviewed_at
         FROM ai_research_candidates
         ${whereClause}
         ORDER BY created_at DESC
         LIMIT 100`,
        params
      );
      res.json({ candidates: rows.rows });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "외부자료 후보 조회 실패" });
    }
  });

  // 관리자 모드: 승인 — 이후 /api/chat 컨텍스트에 "참고자료 - 외부검색"으로 반영됨
  app.post("/api/ai-research-candidates/:id/approve", async (req, res) => {
    try {
      const { pool } = await import("../db");
      const id = parseInt(req.params.id, 10);
      if (!Number.isFinite(id)) return res.status(400).json({ error: "잘못된 id" });
      const result = await pool.query(
        `UPDATE ai_research_candidates SET status = 'approved', reviewed_at = NOW() WHERE id = $1 RETURNING id`,
        [id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "후보를 찾을 수 없습니다" });
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "승인 처리 실패" });
    }
  });

  // 관리자 모드: 반려 — 컨텍스트에 반영되지 않고 목록에는 반려 상태로 남음
  app.post("/api/ai-research-candidates/:id/reject", async (req, res) => {
    try {
      const { pool } = await import("../db");
      const id = parseInt(req.params.id, 10);
      if (!Number.isFinite(id)) return res.status(400).json({ error: "잘못된 id" });
      const result = await pool.query(
        `UPDATE ai_research_candidates SET status = 'rejected', reviewed_at = NOW() WHERE id = $1 RETURNING id`,
        [id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "후보를 찾을 수 없습니다" });
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "반려 처리 실패" });
    }
  });
}
