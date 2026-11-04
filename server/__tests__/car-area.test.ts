import { describe, it, expect } from "vitest";
import { maxAreaPassenger, maxAreaFreight, minAreaByCapacity, minAreaByCapacityOld, capacityOld, capacityCurrent, carAreaNote } from "../../client/src/lib/carArea";

describe("카 유효면적 표 5·6·7 계산", () => {
  it("표 5: 표에 있는 값·보간·초과", () => {
    expect(maxAreaPassenger(1000)!.value).toBe(2.4);
    expect(maxAreaPassenger(1150)!.value).toBe(2.7);          // 2.65 + 25/75 × 0.15
    expect(maxAreaPassenger(2500)!.value).toBe(5);
    expect(maxAreaPassenger(2600)!.value).toBe(5.16);         // 100 kg 추가마다 0.16
    expect(maxAreaPassenger(50)).toBeNull();
  });
  it("표 6(화물용): 6,000 kg = 22.64 ㎡ (원문 계산 예시와 일치)", () => {
    expect(maxAreaFreight(6000)!.value).toBe(22.64);
    expect(maxAreaFreight(1600)!.value).toBe(5.04);
  });
  it("표 7: 정원별 최소 면적, 20인승 초과", () => {
    expect(minAreaByCapacity(11)!.value).toBe(1.87);
    expect(minAreaByCapacity(21)!.value).toBe(3.245);
  });
  it("질문 해석: 숫자가 있으면 계산, 없으면 표 위치만, 무관한 질문은 끼어들지 않음", () => {
    expect(carAreaNote("정격하중 1,150kg 엘리베이터 카 최대 유효면적은?")).toContain("2.7 ㎡");
    expect(carAreaNote("카의 용량에 따른 유효바닥면적 (카 내)")).toContain("8.2.1.1");
    expect(carAreaNote("13인승 카 면적")).toContain("2.15");
    expect(carAreaNote("화물용 6000kg 카 유효면적")).toContain("22.64");
    expect(carAreaNote("피트 사다리 설치 기준")).toBe("");
  });
  it("종전 고시: 정원 ÷65, 표 1.2, 20인승 초과 0.10", () => {
    expect(capacityOld(1000)).toBe(15);
    expect(minAreaByCapacityOld(8)!.value).toBe(1.26);
    expect(minAreaByCapacityOld(22)!.value).toBe(2.91);
    expect(capacityCurrent(1000).n).toBe(13);
  });
  it("연도가 있으면 종전 값도 함께, 없으면 현행만", () => {
    const withYear = carAreaNote("정격하중 1000kg 카 정원과 최소 면적", 2010);
    expect(withYear).toContain("종전");
    expect(withYear).toContain("15인");
    expect(withYear).toContain("2.11");
    expect(withYear).toContain("13인");
    expect(carAreaNote("정격하중 1000kg 카 정원", null)).not.toContain("종전:");
    expect(carAreaNote("2022년 이후 설치 정격하중 1000kg 카 정원", 2023)).not.toContain("종전:");
  });
});
