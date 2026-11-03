import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import {
  isClosureQuestion, isReinstallAfterClosure, pickClosureEvidence, mergeClosureEvidence, closureDocToCtx,
} from "../../client/src/lib/closureGuide";
import { pickEraDoc, type EraDoc } from "../../client/src/lib/eraPick";

const genDir = path.resolve(__dirname, "../../client/src/data/generations");
const readGen = (f: string) => JSON.parse(fs.readFileSync(path.join(genDir, f), "utf-8"));

describe("폐지·휴지·검사연기 질문 판별", () => {
  const yes = [
    "승강기 폐지 신청 절차가 어떻게 돼?",
    "엘리베이터 철거하려면 어떤 서류가 필요해?",
    "휴지 신청할 때 제출서류",
    "검사연기 사유가 뭐야",
    "철거가 어려우면 영구 폐쇄로 인정돼?",
    "에스컬레이터 철거 인정기준",
    "폐지 후 같은 건물에 신규 설치하면 어떤 기준 적용해?",
  ];
  const no = [
    "카 내 구조물 철거 기준 알려줘",
    "정기검사 기준 알려줘",
    "미철거 시 판정이 어떻게 돼?",
    "비상정지장치 검사 기준",
  ];
  for (const q of yes) it(`폐지 질문: ${q}`, () => expect(isClosureQuestion(q)).toBe(true));
  for (const q of no) it(`폐지 아님: ${q}`, () => expect(isClosureQuestion(q)).toBe(false));

  it("폐지 후 신규 설치 질문만 근거(표준화) 대상", () => {
    expect(isReinstallAfterClosure("폐지 후 같은 건물에 신규 설치하면 어떤 기준 적용해?")).toBe(true);
    expect(isReinstallAfterClosure("승강기 폐지하고 다시 설치하려는데 증속하면?")).toBe(true);
    expect(isReinstallAfterClosure("승강기 폐지 신청 절차")).toBe(false);
    expect(isReinstallAfterClosure("신규 설치 검사 기준")).toBe(false);
  });
});

describe("근거 표준화 선택·병합", () => {
  const std = [
    { title: "비상정지장치 기준", conclusion: "x" },
    { title: "교체 설치검사 시 종전검사기준 적용 관련", conclusion: "c1".repeat(900), basis: "b", source: "(21년 제3차)" },
    { title: "교체 설치검사 카 크기 적용 관련", conclusion: "c2", source: "(22년 제1차)" },
    { title: "건축물의 구조 변경없이 현행 안전기준 적용이 어려운 승강기의 리모델링하는 경우, 인증받은 승강기 설치 시 종전검사기준 적용 가능 여부", conclusion: "c3" },
    { title: "검사원간 판정 상이함 (1,2,3 적용 혼란 있음)", conclusion: "c4" },
    { title: "교체 설치검사 시 승강장문 문턱지지대의 재사용 관련", conclusion: "무관" },
  ];
  it("지정한 제목의 표준화만 골라 순서대로 만든다", () => {
    const ev = pickClosureEvidence(std);
    expect(ev.map(e => e.title)).toEqual([
      "교체 설치검사 시 종전검사기준 적용 관련",
      "교체 설치검사 카 크기 적용 관련",
      expect.stringContaining("건축물의 구조 변경없이"),
      "검사원간 판정 상이함 (1,2,3 적용 혼란 있음)",
    ]);
    expect(ev[0].conclusion.length).toBe(1500);
    expect(ev[0].priority).toBe("기술자료(표준화)");
  });
  it("없는 항목은 건너뛰고 오류 없이 빈 배열", () => {
    expect(pickClosureEvidence([])).toEqual([]);
  });
  it("근거를 맨 앞에 두고 중복 제목은 한 번만, 최대 개수 제한", () => {
    const base = [{ title: "A" }, { title: "B" }, { title: "교체 설치검사 카 크기 적용 관련" }];
    const ev = [{ title: "교체 설치검사 카 크기 적용 관련" }, { title: "E2" }];
    expect(mergeClosureEvidence(base, ev).map(x => x.title)).toEqual(["교체 설치검사 카 크기 적용 관련", "E2", "A", "B"]);
    expect(mergeClosureEvidence(base, ev, 3)).toHaveLength(3);
  });
});

describe("승강기 폐지 업무 절차 문서(closure-guide.json)", () => {
  const doc = readGen("closure-guide.json");
  const allText = JSON.stringify(doc.items);

  it("드롭다운 제목과 절차 문서 표시", () => {
    expect(doc.meta.title).toBe("승강기 폐지 업무 절차");
    expect(doc.meta.kind).toBe("procedure");
    expect(doc.meta.effectiveDate).toBeTruthy();
  });
  it("2018-22호 고시는 포함하지 않는다", () => {
    expect(allText).not.toContain("2018-22");
    expect(allText).not.toContain("제2018-22호");
  });
  it("원본 작성 사례의 개인·현장 정보는 수록하지 않는다", () => {
    for (const s of ["강서구민회관", "김용연", "성배경", "1901-305", "3664-6064", "우장산로"]) expect(allText).not.toContain(s);
  });
  it("핵심 근거 내용이 들어 있다", () => {
    expect(allText).toContain("승강기민원24");
    expect(allText).toContain("한국승강기안전공단");
    expect(allText).toContain("제57조");
    expect(allText).toContain("별지 제26호서식");
    expect(allText).toContain("권상기(파워유닛) 및 제어반 제거");
    expect(allText).toContain("영구 폐쇄");
  });
  it("AI 전달 항목: 표준화 요약(9)은 빼고, 자료에 없는 사항(10)은 포함", () => {
    const ctx = closureDocToCtx(doc);
    expect(ctx.map(c => c.ref)).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "10"]);
    expect(ctx.find(c => c.ref === "6")!.content).toContain("신청서 + 사유서");
    expect(ctx.find(c => c.ref === "10")!.content).toContain("재사용");
  });
  it("표준화 요약(9)의 근거 제목은 앱 표준화 제목과 일치한다", () => {
    const t9 = doc.items["9"].text as string;
    for (const s of ["교체 설치검사 시 종전검사기준 적용 관련", "교체 설치검사 카 크기 적용 관련", "교체 설치현장의 카 상부 보호난간 적용 기준", "검사원간 판정 상이함"]) expect(t9).toContain(s);
  });
});

describe("종전 기준 검색 — 연도 제한 없이 가장 가까운 고시", () => {
  const mk = (id: string, date: string, extra: any = {}): EraDoc => ({ meta: { id, effectiveDate: date, ...extra }, items: { a: {} }, ey: Number(date.slice(0, 4)) });
  const docs = [
    mk("1997-194", "1997-08-18"), mk("1998-75", "1998-05-09"), mk("2009-67", "2009-11-24"),
    mk("2022-esc", "2022-03-02", { equipment: "에스컬레이터" }),
    mk("closure-guide", "2026-11-03", { kind: "procedure" }),
  ];
  const id = (y: number, eq?: string | null) => pickEraDoc(docs, y, eq)?.meta.id ?? null;

  it("2010·2013년 엘리베이터 질문은 가장 가까운 이전 고시(2009)를 쓴다", () => {
    expect(id(2010, "엘리베이터")).toBe("2009-67");
    expect(id(2013, "엘리베이터")).toBe("2009-67");
  });
  it("연도 상한 없음: 2014년 이후도 가장 가까운 이전 고시를 쓰고, 새 고시가 추가되면 자동 반영", () => {
    expect(id(2015, "엘리베이터")).toBe("2009-67");
    expect(id(2021, "엘리베이터")).toBe("2009-67");
    const withNew = [...docs, mk("2018-22", "2018-03-23")];
    expect(pickEraDoc(withNew, 2017, "엘리베이터")?.meta.id).toBe("2009-67");
    expect(pickEraDoc(withNew, 2018, "엘리베이터")?.meta.id).toBe("2018-22");
    expect(pickEraDoc(withNew, 2025, "엘리베이터")?.meta.id).toBe("2018-22");
  });
  it("가장 이른 문서보다 앞선 연도는 가장 오래된 문서", () => {
    expect(id(1990)).toBe("1997-194");
  });
  it("연도에 맞는 시기 구분", () => {
    expect(id(1997)).toBe("1997-194");
    expect(id(1999)).toBe("1998-75");
  });
  it("설비별: 에스컬레이터 전용 고시는 에스컬레이터 질문에서만", () => {
    expect(id(2022, "에스컬레이터")).toBe("2022-esc");
    expect(id(2025, "에스컬레이터")).toBe("2022-esc");
    expect(id(2025, "엘리베이터")).toBe("2009-67");
  });
  it("업무 절차 문서와 다른 설비 전용 문서는 쓰지 않는다", () => {
    expect(id(2030, "엘리베이터")).toBe("2009-67");
    expect(pickEraDoc(docs.filter(d => d.meta.id !== "2009-67"), 2012, "엘리베이터")?.meta.id).toBe("1998-75");
    expect(pickEraDoc([docs[3]], 2012, "엘리베이터")).toBeNull();
  });
  it("연도가 없거나 이상하면 null", () => {
    expect(pickEraDoc(docs, 0)).toBeNull();
    expect(pickEraDoc(docs, 1900)).toBeNull();
  });
  it("실제 generations 파일: 절차 문서는 제외, 에스컬레이터 문서는 설비 표시", () => {
    const real: EraDoc[] = fs.readdirSync(genDir).filter(f => f.endsWith(".json")).map(f => {
      const d = readGen(f); return { meta: d.meta, items: d.items, ey: Number(String(d.meta.effectiveDate).slice(0, 4)) };
    });
    expect(real.find(d => d.meta.id === "2022-kc2050-53-escalator")!.meta.equipment).toBe("에스컬레이터");
    expect(real.find(d => d.meta.id === "closure-guide")!.meta.kind).toBe("procedure");
    for (const y of [1995, 2000, 2010, 2013, 2015, 2025]) {
      const picked = pickEraDoc(real, y, "엘리베이터");
      expect(picked).not.toBeNull();
      expect(picked!.meta.id).not.toBe("closure-guide");
      expect(picked!.meta.id).not.toBe("2022-kc2050-53-escalator");
    }
  });
});
