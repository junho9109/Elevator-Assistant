import { describe, it, expect } from "vitest";
import { scoreMatch, extractKeyTerms, detectIntent, expandKeywords } from "../../client/src/pages/home";
import { withPhotoNote } from "../../client/src/lib/photoNotes";

// 앱 검색(searchAllData)이 표준화 항목에 점수를 매기는 것과 같은 호출 방식으로 점수를 계산한다.
function score(question: string, title: string, bodyText: string) {
  const kw = question.toLowerCase().trim();
  return scoreMatch(bodyText, expandKeywords(kw), kw, title, undefined, detectIntent(question), extractKeyTerms(question));
}
describe("사진 판독 글이 검색 점수에 반영된다", () => {
  const cases: [string, string][] = [
    ["플랫벨트 교체 기준 알려줘", "플랫벨트의 마모 및 파손상태에 대한 기준 적용"],
    ["플랫벨트 균열 몇 개면 교체야", "플랫벨트의 마모 및 파손상태에 대한 기준 적용"],
    ["스커트 디플렉터 수평거리 측정값", "스커트디플렉터 측정치 입력"],
    ["절연저항 SELV 몇 MΩ", "절연저항 측정값 입력"],
    ["싱글랩 도르래 로프 벗어남 중간 고정장치", "구동기 도르래 로프 벗어남 보호수단"],
  ];
  for (const [q, title] of cases) {
    it(`${q}`, () => {
      const before = score(q, title, " ");                               // 본문 비어 있음(이전 상태)
      const after = score(q, title, withPhotoNote(" ", title));
      console.log(q, "| 이전", before, "→ 지금", after);
      expect(after).toBeGreaterThanOrEqual(50);
      expect(after).toBeGreaterThanOrEqual(before);
    });
  }
  it("관련 없는 질문에 사진 항목이 새로 검색되지 않는다", () => {
    for (const q of ["승강장문 비상개방 기준 알려줘", "접지저항 측정값 기준은?", "보호난간 높이 기준 알려줘", "비상통화장치 기준 알려줘", "과부하감지장치 기준"]) {
      for (const title of ["플랫벨트의 마모 및 파손상태에 대한 기준 적용", "절연저항 측정값 입력", "승강장문 유효 폭 제한 (카 출입구 측면 폭 +50mm 이내)", "균형추 칸막이 폭 입력"]) {
        const after = score(q, title, withPhotoNote(" ", title));
        const before = score(q, title, " ");
        console.log(q, "×", title.slice(0, 14), "| 이전", before, "→ 지금", after);
        if (before < 50) expect(after).toBeLessThan(50); // 이전에 검색되지 않던 관련 없는 항목이 새로 올라오지 않는다
      }
    }
  });

  it("본문이 있는 항목은 점수가 이전과 똑같다(영향 없음)", () => {
    const body = "승강장문 유효 폭은 카 출입구 폭 양쪽 50mm 이내로 제한한다. 이 기준은 표준화에 따라 적용한다.";
    for (const q of ["승강장문 비상개방 기준 알려줘", "승강장문 유효 폭 기준"]) {
      expect(score(q, "승강장문 유효 폭 제한", withPhotoNote(body, "승강장문 유효 폭 제한 (카 출입구 측면 폭 +50mm 이내)"))).toBe(score(q, "승강장문 유효 폭 제한", body));
    }
  });
});
