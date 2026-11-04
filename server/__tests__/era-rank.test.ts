import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { pickEraDocs, type EraDoc } from "../../client/src/lib/eraPick";
import { buildEraIndex, rankEra, cleanEraTerms, ancestorKeys, nz, type EraEntry } from "../../client/src/lib/eraRank";

const root = path.resolve(__dirname, "../..");
const genDir = path.join(root, "client/src/data/generations");
const cases: { q: string; f: { targets: string[]; symptoms: string[]; year: number }; d: "EH" | "S"; gold: string[]; set: string }[] =
  JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/era-rank-cases.json"), "utf-8"));

const real: EraDoc[] = fs.readdirSync(genDir).filter(f => f.endsWith(".json")).map(f => {
  const d = JSON.parse(fs.readFileSync(path.join(genDir, f), "utf-8"));
  return { meta: d.meta, items: d.items, ey: Number(String(d.meta.effectiveDate).slice(0, 4)) };
});

// home.tsx splitKeywords와 같은 단어 쪼개기(조사는 단어 끝에 붙은 것만 제거)
const splitWords = (q: string) => q.replace(/[?？!！.,。]/g, " ").trim().split(/\s+/)
  .map(w => w.replace(/(에서|로부터|까지|은|는|이|가|을|를|의|로|도|만)$/, "")).filter(w => w.length >= 2);

type Row = EraEntry & { fam: string; fw: number };
function rankFor(c: (typeof cases)[number]) {
  const equipment = c.d === "S" ? "에스컬레이터" : "엘리베이터";
  const docs = pickEraDocs(real, c.f.year, equipment);
  const hyd = /유압/.test(c.q);
  const rows: Row[] = [];
  for (const doc of docs) {
    const fam = String(doc.meta.family || "");
    const fw = fam === "유압식" ? (hyd ? 1 : 0.6) : fam === "전기식" ? (hyd ? 0.4 : 1) : 1;
    for (const e of buildEraIndex(doc.items)) rows.push({ ...e, fam, fw });
  }
  const terms = [...splitWords(c.q), ...c.f.targets, ...c.f.symptoms];
  return rankEra(rows, terms, e => e.fw).map(r => ({ id: r.entry.id, fam: r.entry.fam }));
}
const isGold = (r: { id: string; fam: string }, gold: string[]) => gold.some(g => (g.includes("#H") ? g.split("#")[0] === r.id && r.fam === "유압식" : g === r.id));
const posOf = (c: (typeof cases)[number]) => rankFor(c).findIndex(r => isGold(r, c.gold)) + 1;

// 옛 방식(검색어를 제목·본문에 몇 번 나오는지 합산)을 기준선으로 함께 계산한다.
function legacyPos(c: (typeof cases)[number]) {
  const equipment = c.d === "S" ? "에스컬레이터" : "엘리베이터";
  const docs = pickEraDocs(real, c.f.year, equipment);
  const hyd = /유압/.test(c.q);
  const STOP = new Set(["승강기", "엘리베이터", "현장", "설치", "기준", "검사", "경우", "지적", "판정", "조건부", "불합격", "합격"]);
  const T = Array.from(new Set([...splitWords(c.q), ...c.f.targets, ...c.f.symptoms].map(nz).filter(t => t.length >= 2 && !STOP.has(t))));
  const sc: { id: string; fam: string; s: number }[] = [];
  for (const doc of docs) {
    const fam = String(doc.meta.family || "");
    const fw = fam === "유압식" ? (hyd ? 1 : 0.6) : fam === "전기식" ? (hyd ? 0.4 : 1) : 1;
    for (const [id, it] of Object.entries<any>(doc.items)) {
      let full = `${it.title || ""}\n${it.text || ""}`;
      for (const tb of it.tables || []) for (const row of tb.rows || []) full += "\n" + row.map((x: any) => x.t).join(" | ");
      const f = nz(full), t = nz(it.title || "");
      let s = 0;
      for (const w of T) { if (t.includes(w)) s += 3; s += Math.min(f.split(w).length - 1, 3); }
      if (s > 0) sc.push({ id, fam, s: s * fw });
    }
  }
  sc.sort((a, b) => b.s - a.s);
  return sc.findIndex(r => isGold(r, c.gold)) + 1;
}

describe("고시 원문 조문 순위(문맥 색인 + BM25)", () => {
  it("조문번호 → 상위 조문번호", () => {
    expect(ancestorKeys("6.7.1.7")).toEqual(["6", "6.7", "6.7.1"]);
    expect(ancestorKeys("부속서Ⅲ/2.3")).toEqual(["부속서Ⅲ", "부속서Ⅲ/2"]);
    expect(ancestorKeys("7")).toEqual([]);
  });
  it("검색어 정리: 말투·연도·설비종류어를 빼되, 전부 빠지면 최소 정리만 한다", () => {
    expect(cleanEraTerms(["2015년에", "전기식", "유압식 엘리베이터", "잠금해제구간", "이하야", "몇", "기준"])).toEqual(["잠금해제구간"]);
    expect(cleanEraTerms(["무빙워크"])).toEqual(["무빙워크"]);
    expect(cleanEraTerms(["승강기"])).toEqual([]);
  });
  it("상위 장 제목을 색인에 붙여, 본문에 장 제목이 없는 조문도 찾는다(구동기 공간 조명)", () => {
    const e = buildEraIndex(real.find(d => d.meta.id === "2012-14-electric")!.items).find(x => x.id === "6.7.1.7")!;
    expect(e.text).toContain(nz("구동기 공간"));
  });
  it("대표 질문: 잠금해제구간 → 7.7.1이 상위 3위 안, 공칭 폭 → 5.3.2.1이 상위 3위 안", () => {
    const a = cases.find(c => c.q.includes("잠금해제구간"))!;
    expect(posOf(a)).toBeGreaterThan(0);
    expect(posOf(a)).toBeLessThanOrEqual(3);
    const b = cases.find(c => c.q.includes("공칭 폭"))!;
    expect(posOf(b)).toBeLessThanOrEqual(3);
  });
  it("질문 36개: 정답이 상위 3위 안 ≥ 32개, 상위 15위 안 = 36개, 옛 방식보다 낫다", () => {
    const pos = cases.map(posOf);
    const legacy = cases.map(legacyPos);
    const top = (arr: number[], k: number) => arr.filter(p => p > 0 && p <= k).length;
    expect(cases.length).toBe(36);
    expect(top(pos, 3)).toBeGreaterThanOrEqual(32);
    expect(top(pos, 5)).toBeGreaterThanOrEqual(34);   // 빠른 답변은 상위 5개 전달
    expect(top(pos, 6)).toBeGreaterThanOrEqual(35);   // 정밀 답변은 상위 6개 전달
    expect(top(pos, 15)).toBe(36);
    expect(top(pos, 3)).toBeGreaterThan(top(legacy, 3));
    const mrr = (arr: number[]) => arr.reduce((a, p) => a + (p > 0 ? 1 / p : 0), 0) / arr.length;
    expect(mrr(pos)).toBeGreaterThan(mrr(legacy));
    // 개발용(dev)·검증용(new) 어느 쪽도 옛 방식보다 나빠지지 않는다
    for (const set of ["dev", "new"]) {
      const idx = cases.map((c, i) => (c.set === set ? i : -1)).filter(i => i >= 0);
      expect(top(idx.map(i => pos[i]), 3)).toBeGreaterThanOrEqual(top(idx.map(i => legacy[i]), 3));
    }
  });
});
