import { describe, it, expect } from "vitest";
import { yearDiverges, kindDiverges, locDiverges, MAX_CLARIFY_STEPS } from "../../client/src/lib/clarifyNeed";

const r = (title: string, content: string, extra: any = {}) => ({ type: "inspection", title, content, score: 200, ...extra });

describe("yearDiverges", () => {
  it("개정 이력이 없으면 묻지 않는다", () => {
    expect(yearDiverges([r("9.8 자동구출", "본문", { versions: [{ type: "current", effectiveDate: "2022-01-01" }] })])).toBe(false);
    expect(yearDiverges([r("9.8 자동구출", "본문")])).toBe(false);
  });
  it("구 버전이 있으면 묻는다", () => {
    expect(yearDiverges([r("5.3", "본문", { versions: [{ type: "current", effectiveDate: "2022-01-01" }, { type: "old", effectiveDate: "2013-01-01" }] })])).toBe(true);
  });
  it("상위 5개 밖(점수 낮은) 결과의 이력은 무시한다", () => {
    const low = r("x", "y", { score: 1, versions: [{ type: "old" }, { type: "current" }] });
    const highs = Array.from({ length: 5 }, (_, i) => r("h" + i, "c", { score: 300 - i }));
    expect(yearDiverges([...highs, low])).toBe(false);
  });
  it("chat 결과는 보지 않는다", () => {
    expect(yearDiverges([{ type: "chat", title: "", content: "", score: 999, versions: [{ type: "old" }, { type: "current" }] }])).toBe(false);
  });
});

describe("kindDiverges", () => {
  it("한 종류만 언급되면 묻지 않는다", () => {
    expect(kindDiverges([r("t", "정기검사에서 확인한다")])).toBe(false);
  });
  it("두 종류 이상 언급되면 묻는다", () => {
    expect(kindDiverges([r("t", "완성검사에서는 A, 정기검사에서는 B")])).toBe(true);
  });
});

describe("locDiverges", () => {
  it("한 위치만이면 묻지 않는다", () => {
    expect(locDiverges([r("피트 조명", "피트 내 조도는 50lx")])).toBe(false);
  });
  it("여러 위치에 걸치면 묻는다", () => {
    expect(locDiverges([r("조명", "기계실 200lx, 승강로 50lx, 피트 50lx")])).toBe(true);
  });
});

it("상한은 2", () => expect(MAX_CLARIFY_STEPS).toBe(2));
