import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { getAttachments, attachmentContext, annexOverlay, ORIGINAL_FILES } from "../../client/src/lib/standardAttachments";

const root = path.resolve(__dirname, "../..");
const pub = (p: string) => path.join(root, "client/public", p);
const valid22 = new Set<string>(JSON.parse(fs.readFileSync(path.join(root, "client/src/data/별표22_유효항목.json"), "utf-8")));
const attDir = path.join(root, "client/src/data/standard-attachments");
const docs: Record<string, any> = {
  엘리베이터: JSON.parse(fs.readFileSync(path.join(attDir, "byulpyo22.json"), "utf-8")),
  에스컬레이터: JSON.parse(fs.readFileSync(path.join(attDir, "byulpyo24.json"), "utf-8")),
};

describe("별표22·24 원본 표·그림·수식 첨부", () => {
  it("첨부 이미지 파일이 모두 실제로 있다", () => {
    for (const [eq, d] of Object.entries(docs)) {
      let n = 0;
      for (const [, a] of Object.entries<any>(d.items)) {
        for (const t of a.tables) for (const s of t.src) { expect(fs.existsSync(pub(s)), `${eq} ${s}`).toBe(true); n++; }
        for (const f of a.figures) for (const s of f.src) { expect(fs.existsSync(pub(s)), `${eq} ${s}`).toBe(true); n++; }
        for (const e of a.eqs) { expect(fs.existsSync(pub(e.src)), `${eq} ${e.src}`).toBe(true); n++; }
      }
      expect(n).toBeGreaterThan(40);
    }
  });
  it("엘리베이터 첨부 대상 조문은 화면에 보이는 조문(또는 부속서 원문)이다", () => {
    const annex = new Set(Object.keys(docs.엘리베이터.annex));
    for (const id of Object.keys(docs.엘리베이터.items)) expect(valid22.has(id) || annex.has(id), id).toBe(true);
  });
  it("에스컬레이터 첨부 대상 조문번호 형식이 올바르다", () => {
    for (const id of Object.keys(docs.에스컬레이터.items)) expect(/^(\d+(\.\d+)*|부속서 [Ⅰ-Ⅹ]+)$/.test(id), id).toBe(true);
  });
  it("카 유효면적 표 5·6·7이 8.2의 조문에 붙고 AI 자료에 글자로 들어간다", () => {
    const t5 = getAttachments("엘리베이터", "8.2.1.1").tables.map(t => t.caption).join("|");
    expect(t5).toContain("표 5");
    const ctx = attachmentContext("엘리베이터", "8.2.1.1");
    expect(ctx).toContain("0.37");     // 정격하중 100 kg
    expect(ctx).toContain("5.00");     // 정격하중 2,500 kg
    const t6 = attachmentContext("엘리베이터", "8.2.2.2");
    expect(t6).toContain("1,600 가) | 5.04");
    expect(t6).toContain("22.64");
    expect(attachmentContext("엘리베이터", "8.2.3.1")).toContain("정원");
    expect(attachmentContext("엘리베이터", "8.2.3.1")).toContain("1.87");   // 11인승
  });
  it("에스컬레이터 표 2~5(제동부하·정지거리)가 붙는다", () => {
    const all = Object.values<any>(docs.에스컬레이터.items).flatMap(a => a.tables.map((t: any) => t.caption)).join("|");
    for (const k of ["표 2", "표 3", "표 4", "표 5"]) expect(all).toContain(k);
  });
  it("수식 판독문이 AI 자료에 들어간다(6.1.8.8 F=3·gn·(P+Q)/n)", () => {
    expect(attachmentContext("엘리베이터", "6.1.8.8")).toContain("(P + Q) / n");
  });
  it("엘리베이터 부속서 14개 원문이 있고 이미지가 붙는다", () => {
    const a = annexOverlay("엘리베이터");
    expect(Object.keys(a).length).toBe(14);
    expect(a["부속서 Ⅸ"].text).toContain("권상평가");
    expect(getAttachments("엘리베이터", "부속서 Ⅸ").figures.length).toBeGreaterThanOrEqual(5);
    expect(getAttachments("엘리베이터", "부속서 ⅩⅢ").tables.length).toBe(7);
  });
  it("원본 PDF 링크 파일이 있다(별표 + 고시 제2022-18호)", () => {
    for (const eq of ["엘리베이터", "에스컬레이터"]) {
      expect(ORIGINAL_FILES[eq].length).toBe(2);
      for (const f of ORIGINAL_FILES[eq]) expect(fs.existsSync(pub(f.href)), f.href).toBe(true);
    }
  });
});
