import { describe, it, expect } from "vitest";
import { detectEquipmentType, shouldAskEquipment } from "../../client/src/lib/equipmentDetect";

// 실제 이용자 질문(좋아요·아쉬워요 기록)과 현장에서 자주 쓰는 질문으로,
// "엘리베이터/에스컬레이터를 되묻는 경우"를 점검한다. 되묻는 것은 양쪽에 공통인 개념일 때뿐이다.
const NO_ASK_ELEVATOR = [
  "자동구출운전 장치 검사기준",
  "자동구출운전은 몇 초안에 작동해야해?",
  "문닫힘안전장치 검사기준",
  "문닫힘안전장치 접촉식만 작동하면 조건부야?",
  "인터록 불합격 기준이 뭐야",
  "과부하감지장치 작동 기준 알려줘",
  "카 내 조도 기준 알려줘",
  "접이식 난간대 설치불가 언제부터야?",
  "피트 정지장치 관련 표준화",
  "유압식 승강기 속도검사 기준",
  "덤웨이터 인버터 수시검사 서류",
  "권동식 승강기는 오버밸런스율이 없어?",
  "승강장문 헤더 위 전선 방수 기준",
  "장애인용 전면 활동 공간 1.4m 허용오차는?",
  "비상통화장치 연결 검사기준",
  "피트내 인터폰 설치의무",
  "소방운전 검사기준",
  "피난용 엘리베이터 검사기준",
  "조속기 작동속도 기준",
  "MR 승강기 구동기 검사기준",
  "mrl 피트 인터폰 의무",
  "카 벽 유리 손잡이 설치 검사기준",
];
const NO_ASK_ESCALATOR = [
  "에스컬레이터 스텝 속도 0.42m/s의 허용오차는?",
  "핸드레일 속도는 스텝 속도에서 얼마까지 허용?",
  "에스컬레이터 보조브레이크 적용 시기",
  "무빙워크 경사도 검사기준",
  "디딤판 처짐 기준",
];
const ASK = [
  "비상 정지 장치 검사 기준",
  "비상정지장치에 대해 알려줘",
  "브레이크 검사기준",
  "속도 허용오차 검사기준",
  "조명 검사기준 알려줘",
  "소음에 대한 검사기준 알려줘",
  "접지 검사기준",
  "구동기 검사기준",
];
const NO_ASK_UNSPECIFIC = [
  "승객 안전 기준",
  "검사기준 알려줘",
  "표준화 기술자료 찾아줘",
  "엘리베이터와 에스컬레이터 비상정지장치 차이",
];

describe("설비 되묻기 — 고유 용어가 있으면 묻지 않는다", () => {
  for (const q of NO_ASK_ELEVATOR) {
    it(`엘리베이터: ${q}`, () => {
      const d = detectEquipmentType(q);
      expect(d).toBe("엘리베이터");
      expect(shouldAskEquipment(q, d)).toBe(false);
    });
  }
  for (const q of NO_ASK_ESCALATOR) {
    it(`에스컬레이터: ${q}`, () => {
      const d = detectEquipmentType(q);
      expect(d).toBe("에스컬레이터");
      expect(shouldAskEquipment(q, d)).toBe(false);
    });
  }
});

describe("설비 되묻기 — 양쪽 공통 개념이면 묻는다", () => {
  for (const q of ASK) {
    it(q, () => {
      const d = detectEquipmentType(q);
      expect(d).toBe("ambiguous");
      expect(shouldAskEquipment(q, d)).toBe(true);
    });
  }
});

describe("설비 되묻기 — 단서도 공통 개념도 없으면 묻지 않는다", () => {
  for (const q of NO_ASK_UNSPECIFIC) {
    it(q, () => {
      expect(shouldAskEquipment(q, detectEquipmentType(q))).toBe(false);
    });
  }
});

describe("과다 되묻기 비율", () => {
  it("실제 질문 49개 중 설비를 되묻는 것은 공통 개념 질문뿐이다", () => {
    const all = [...NO_ASK_ELEVATOR, ...NO_ASK_ESCALATOR, ...NO_ASK_UNSPECIFIC];
    const asked = all.filter(q => shouldAskEquipment(q, detectEquipmentType(q)));
    expect(asked).toEqual([]);
  });
});
