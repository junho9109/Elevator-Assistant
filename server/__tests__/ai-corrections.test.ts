import { describe, it, expect, vi, beforeEach } from "vitest";

// DB·LLM·임베딩을 모두 가짜로 바꿔, 정정 카드 규칙(초안 생성 조건·유사도 문턱·프롬프트 문단)만 검증한다.
const queries: { sql: string; params: any[] }[] = [];
let nextRows: any[][] = [];
vi.mock("../db", () => ({
  pool: {
    query: vi.fn(async (sql: string, params: any[] = []) => {
      queries.push({ sql, params });
      const rows = nextRows.length > 0 && /SELECT|INSERT/i.test(sql) && !/CREATE|1 FROM/i.test(sql) ? nextRows.shift()! : [];
      return { rows, rowCount: rows.length };
    }),
  },
}));
vi.mock("../embedding", () => ({ getEmbedding: vi.fn(async () => [0.1, 0.2, 0.3]) }));
let llmOutput = "";
vi.mock("@anthropic-ai/sdk", () => ({
  default: class { messages = { create: vi.fn(async () => ({ content: [{ type: "text", text: llmOutput }] })) }; },
}));

process.env.ANTHROPIC_API_KEY = "test";
const mod = await import("../routes/ai-corrections");

beforeEach(() => { queries.length = 0; nextRows = []; llmOutput = ""; });

describe("stripClientNotes", () => {
  it("클라이언트가 붙인 자동 메모를 떼고 이용자 질문만 남긴다", () => {
    const q = "2014년 설치인데 피트 인터폰 없으면 지적이야?\n\n[시점 참고(자동 계산)] 질문에 설치/적용 연도 2014년이 있습니다.\n\n[승강기 형식 참고] MR";
    expect(mod.stripClientNotes(q)).toBe("2014년 설치인데 피트 인터폰 없으면 지적이야?");
  });
  it("메모가 없으면 그대로", () => {
    expect(mod.stripClientNotes("접이식 난간대 언제부터야?")).toBe("접이식 난간대 언제부터야?");
  });
});

describe("createCorrectionDraft", () => {
  it("의견이 너무 짧으면 초안을 만들지 않는다", async () => {
    expect(await mod.createCorrectionDraft({ question: "q", answer: "a", comment: "별로" })).toBeNull();
    expect(queries.length).toBe(0);
  });
  it("AI가 usable=false(단순 불만)로 판단하면 저장하지 않는다", async () => {
    llmOutput = JSON.stringify({ usable: false });
    expect(await mod.createCorrectionDraft({ feedbackId: 1, question: "q", answer: "a", comment: "답변이 너무 길어요 줄여주세요" })).toBeNull();
    expect(queries.some(q => /INSERT INTO ai_corrections/.test(q.sql))).toBe(false);
  });
  it("정답 의견이 있으면 draft로 저장하고 질문에서 자동 메모를 뗀다", async () => {
    llmOutput = JSON.stringify({ usable: true, correction: "에스컬레이터 공칭속도 허용오차는 ±5%이다.", basis: "별표24 5.4.1.2.1", conditions: "에스컬레이터" });
    nextRows = [[{ id: 7 }]]; // INSERT ... RETURNING id
    const id = await mod.createCorrectionDraft({
      feedbackId: 3, question: "스텝 속도 허용오차는?\n\n[시점 참고(자동 계산)] 메모", answer: "없음", comment: "공칭속도의 ±5% 허용입니다",
    });
    expect(id).toBe(7);
    const ins = queries.find(q => /INSERT INTO ai_corrections/.test(q.sql))!;
    expect(ins.params[0]).toBe("스텝 속도 허용오차는?");
    expect(ins.sql).not.toMatch(/'approved'/); // 승인 전에는 답변에 쓰이지 않는다(status 기본값 draft)
  });
  it("이미 카드가 있는 피드백이면 다시 만들지 않는다", async () => {
    // 중복 확인 쿼리(SELECT 1 FROM ...)가 행을 돌려주는 상황
    const { pool } = await import("../db");
    // 테이블 준비(ensureTable)는 앞선 테스트에서 이미 끝났으므로 첫 쿼리가 곧 중복 확인이다.
    (pool.query as any).mockImplementationOnce(async () => ({ rows: [{ "?column?": 1 }], rowCount: 1 }));
    llmOutput = JSON.stringify({ usable: true, correction: "정정 내용입니다 열 글자 넘게", basis: "x" });
    const id = await mod.createCorrectionDraft({ feedbackId: 99, question: "q", answer: "a", comment: "충분히 긴 의견입니다" });
    expect(id).toBeNull();
    expect(queries.some(q => /INSERT INTO ai_corrections/.test(q.sql))).toBe(false); // 중복이면 저장 시도 자체를 하지 않는다
  });
});

describe("findCorrectionSection", () => {
  it("임베딩이 없으면 빈 문자열", async () => {
    expect(await mod.findCorrectionSection(null)).toBe("");
  });
  it("유사도가 문턱 미만이면 붙이지 않는다", async () => {
    nextRows = [[{ id: 1, question: "q", correction: "c", basis: "b", conditions: "", similarity: 0.7 }]];
    expect(await mod.findCorrectionSection([0.1])).toBe("");
  });
  it("문턱 이상이면 승인된 정정 내용을 프롬프트 문단으로 만든다", async () => {
    nextRows = [[{ id: 1, question: "스텝 속도 허용오차는?", correction: "공칭속도의 ±5%이다.", basis: "별표24 5.4.1.2.1", conditions: "에스컬레이터", similarity: 0.9 }]];
    const s = await mod.findCorrectionSection([0.1]);
    expect(s).toContain("[정정 지식 — 관리자 승인됨");
    expect(s).toContain("공칭속도의 ±5%이다.");
    expect(s).toContain("적용 조건: 에스컬레이터");
    expect(queries.some(q => /hit_count = hit_count \+ 1/.test(q.sql))).toBe(true);
  });
  it("검색 쿼리는 승인(approved) 카드만 대상으로 한다", async () => {
    nextRows = [[]];
    await mod.findCorrectionSection([0.1]);
    const sel = queries.find(q => /FROM ai_corrections WHERE status = 'approved'/.test(q.sql));
    expect(sel).toBeTruthy();
  });
});

describe("formatCorrectionSection", () => {
  it("비어 있으면 빈 문자열", () => { expect(mod.formatCorrectionSection([])).toBe(""); });
});
