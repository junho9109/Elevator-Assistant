// 운영규정 2건(안전운행 및 관리 / 설치검사 및 안전검사) 등록 검증:
// ① JSON 구조(트리가 끊기지 않는지·표·그림 경로) ② 종전 기준 검색에 섞이지 않는지 ③ 질문 → 항목 순위 ④ 관련 없는 질문에는 검색하지 않는지
import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { rankRegulationDocs, regulationKinds, isRegulationQuestion, type RegDoc } from "../../client/src/lib/regulationSearch";
import { pickEraDocs } from "../../client/src/lib/eraPick";

const root = path.resolve(__dirname, "../..");
const genDir = path.join(root, "client/src/data/generations");
const load = (id: string): RegDoc => JSON.parse(fs.readFileSync(path.join(genDir, `${id}.json`), "utf8"));
const OP = load("2026-1-operation");
const IN = load("2026-58-install");

describe("운영규정 JSON 구조", () => {
  for (const [name, doc] of [["안전운행", OP], ["설치검사", IN]] as const) {
    it(`${name}: 메타·원본 PDF·쪽 이미지 경로가 실제 파일과 맞는다`, () => {
      expect(doc.meta.kind).toBe("regulation");
      expect(doc.meta.effectiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const href = doc.meta.originalFile.href as string;
      expect(fs.existsSync(path.join(root, "client/public", href))).toBe(true);
      for (const it of Object.values(doc.items) as any[]) {
        for (const f of it.figures || []) expect(fs.existsSync(path.join(root, "client/public", f.src))).toBe(true);
      }
    });
    it(`${name}: 모든 항목의 상위 번호가 있어 트리에서 끊기지 않는다`, () => {
      const keys = Object.keys(doc.items);
      for (const k of keys) {
        const p = k.split(".");
        for (let i = 1; i < p.length; i++) expect(keys).toContain(p.slice(0, i).join("."));
      }
    });
    it(`${name}: 제목이 비어 있는 항목이 없다`, () => {
      for (const [k, it] of Object.entries(doc.items) as [string, any][]) expect(String(it.title || "").trim(), k).not.toBe("");
    });
  }
  it("안전운행: 별표 3 점검항목이 종류별로 모두 들어 있다(429개 + 상위 번호)", () => {
    const leaves = Object.keys(OP.items).filter(k => k.startsWith("별표3.") && (OP.items[k].tables || []).length > 0);
    expect(leaves.length).toBeGreaterThanOrEqual(300);
    // PDF에서 번호만 남고 누락되었던 항목(쪽 경계에 걸친 칸) 복구 확인
    for (const n of ["1.1.2.1", "2.1.1.4", "2.1.3.4", "2.2.5", "5.4.2.3", "5.7.10", "6.1.4"]) expect(OP.items[`별표3.${n}`], n).toBeTruthy();
  });
  it("설치검사: 별표 1·2가 6개 종류 모두 있다", () => {
    for (const root_ of ["별표1", "별표2"]) for (let g = 1; g <= 6; g++) expect(IN.items[`${root_}.${g}`], `${root_}.${g}`).toBeTruthy();
  });
});

describe("종전 기준 검색과 분리", () => {
  it("운영규정(kind=regulation)은 연도별 종전 기준으로 고르지 않는다", () => {
    const docs = [OP, IN].map(d => ({ meta: d.meta, items: d.items, ey: Number(d.meta.effectiveDate.slice(0, 4)) }));
    expect(pickEraDocs(docs as any, 2026)).toEqual([]);
    expect(pickEraDocs(docs as any, 2010)).toEqual([]);
  });
});

describe("질문 → 규정 선택(다른 질문에는 검색하지 않음)", () => {
  it("규정 고유 용어가 있으면 해당 규정을 고른다", () => {
    expect(regulationKinds("자체점검 결과 주의관찰은 언제 긴급수리로 바꾸나요")).toEqual({ operation: true, install: false });
    expect(regulationKinds("승강기 안전관리자 교육주기가 어떻게 돼?")).toEqual({ operation: true, install: false });
    expect(regulationKinds("정기검사기준에서 완충기 확인 항목")).toEqual({ operation: false, install: true });
    expect(regulationKinds("안전성 평가 신청서 수수료")).toEqual({ operation: false, install: true });
    expect(regulationKinds("운영규정에서 알려줘")).toEqual({ operation: true, install: true });
  });
  it("평소 질문(검사기준·판정·연혁)은 규정 검색을 하지 않는다", () => {
    for (const q of ["2005년 설치 엘리베이터 과속조절기 로프 지름 기준", "카 내 조도는 몇 럭스 이상이어야 하나", "완충기 행정거리 지적사항 판정", "승강기 폐지 신고 절차", "비상통화장치 음성 통화 기준"])
      expect(isRegulationQuestion(q), q).toBe(false);
  });
});

describe("질문 → 항목 순위", () => {
  const top = (docs: RegDoc[], terms: string[], n = 3) => rankRegulationDocs(docs, terms, { mode: "precise" }).slice(0, n).map(r => r.ref);
  it("자체점검 판정(주의관찰·긴급수리)은 별표 3의 7절", () => {
    expect(top([OP], ["자체점검", "주의관찰", "긴급수리", "연속", "4개월"])).toContain("별표3.7");
  });
  it("승강기번호 부여는 별표 5", () => {
    expect(top([OP], ["승강기번호", "지역코드", "일련번호"])).toContain("별표5");
  });
  it("교육주기는 별표 1 / 제7조", () => {
    const r = top([OP], ["교육주기", "승강기관리교육", "3년"], 5);
    expect(r.some(k => k === "별표1" || k.endsWith("제7조"))).toBe(true);
  });
  it("자체점검 주기(점검주기) 질문에 별표 3 점검항목이 올라온다", () => {
    const r = top([OP], ["주개폐기", "자체점검", "점검방법"], 5);
    expect(r.some(k => k.startsWith("별표3."))).toBe(true);
  });
  it("검사특례 신청은 별지 3 또는 제16조", () => {
    const r = top([IN], ["검사특례", "신청"], 5);
    expect(r.some(k => k === "별지3" || k.endsWith("제16조"))).toBe(true);
  });
  it("정밀안전검사 검사장비 항목은 별표 4", () => {
    expect(top([IN], ["정밀안전검사", "검사장비", "브레이크", "제동력"], 5)).toContain("별표4");
  });
  it("설치검사기준의 과속조절기 항목이 올라온다", () => {
    const r = rankRegulationDocs([IN], ["과속조절기", "작동속도", "확인"], { mode: "precise" });
    expect(r.length).toBeGreaterThan(0);
    expect(r[0].content).toContain("과속조절기");
  });
  it("정기검사를 물으면 별표 2 항목이, 설치검사를 물으면 별표 1 항목이 앞선다", () => {
    const terms = ["완충기", "행정거리"];
    const reg = rankRegulationDocs([IN], terms, { mode: "precise", question: "정기검사기준 완충기 행정거리" })[0].ref;
    const inst = rankRegulationDocs([IN], terms, { mode: "precise", question: "설치검사기준 완충기 행정거리" })[0].ref;
    expect(reg.startsWith("별표2")).toBe(true);
    expect(inst.startsWith("별표1")).toBe(true);
  });
  it("그림이 붙은 항목은 그림 태그가 붙는다", () => {
    const r = rankRegulationDocs([OP], ["승강기번호", "표지", "부착위치"], { mode: "precise" });
    expect(r.some(x => x.content.includes("[[그림:g/2026-1-operation/"))).toBe(true);
  });
});
