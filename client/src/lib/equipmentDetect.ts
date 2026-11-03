// 설비종류(엘리베이터/에스컬레이터) 판별과 "되물을지" 판단.
// 질문에 각 설비에서만 쓰이는 고유 용어가 있는지로 판별한다. 되묻는 것은 '정말 양쪽에 공통인 개념'일 때만이다 —
// 예전에는 고유 용어가 목록에 없다는 이유만으로 되물어, 자동구출운전·문닫힘안전장치·인터록처럼
// 엘리베이터에만 있는 장치에도 "엘리베이터와 에스컬레이터 중 어느 쪽인가요?"를 물었다.
export type EquipmentDetection = "엘리베이터" | "에스컬레이터" | "ambiguous";

// 비교는 공백을 모두 뗀 소문자로 한다("카 내", "카내" 모두 일치).
const compact = (s: string) => (s || "").toLowerCase().replace(/\s+/g, "");

export const ESCALATOR_ONLY_TERMS = [
  "에스컬레이터", "에스컬", "무빙워크", "스텝", "디딤판", "콤", "팔레트", "트레드",
  "핸드레일", "스커트", "뉴얼", "데크", "트러스", "인레트", "디플렉터", "삼각부",
  "테이크아웃", "빗살", "구동체인", "보조브레이크", "경사도", "승객컨베이어",
];

export const ELEVATOR_ONLY_TERMS = [
  "엘리베이터", "카상부", "권상기", "완충기", "가이드레일", "조속기",
  "카문", "승강장문", "균형추", "피트", "승강로", "로프", "권동", "카도어", "완충장치",
  // 자동구출·소방·피난 등 엘리베이터에만 있는 운전·용도
  "자동구출", "구출운전", "피난운전", "소방운전", "소방구조", "피난용", "비상용",
  "전기적비상운전", "비상구출",
  // 문·카 내부·승강장 (에스컬레이터에는 없음)
  "승강장", "문닫힘", "도어", "인터록", "카내", "카바닥", "카벽", "카천장", "카지붕", "카조작반", "카조명", "카틀",
  "상부틈새", "비상등", "비상통화", "인터폰", "점형블록",
  // 하중·보호장치
  "과부하감지", "정격하중", "적재하중", "오버밸런스", "균형체인", "이동케이블", "상승과속", "과속방지", "추락방지",
  "세이프티", "멀티빔", "헤더", "접이식",
  // 종류·형식
  "유압", "덤웨이터", "화물용", "장애인용", "침대용", "mrl", "머신룸리스", "기계실없는",
];

// 양쪽에 모두 있는 개념(비상정지장치·브레이크·속도 허용오차·조명 등).
// 고유 용어가 없고 이런 말만 있을 때가 '진짜로 애매한' 경우라서 이때만 되묻는다.
const SHARED_CONCEPTS = [
  "비상정지", "브레이크", "제동", "속도", "허용오차", "조명", "조도", "소음", "접지", "절연", "전동기",
  "구동기", "구동", "제어반", "감속기", "기계류", "기계실", "표지", "경고", "정지스위치", "안전스위치", "주개폐기",
  "전원", "정전", "콘센트", "방화", "환기", "온도", "손잡이", "난간", "에이프런", "점검운전", "인증서",
];
const SHARED_RE = new RegExp(SHARED_CONCEPTS.join("|"));
const MR_WORD_RE = /(?<![a-z])mr(?![a-z])/; // 단독 "MR"(기계실 있는 엘리베이터)

export function detectEquipmentType(text: string): EquipmentDetection {
  const t = compact(text);
  const hasEsc = ESCALATOR_ONLY_TERMS.some(term => t.includes(term));
  const hasEle = ELEVATOR_ONLY_TERMS.some(term => t.includes(term)) || MR_WORD_RE.test(t);
  if (hasEsc && !hasEle) return "에스컬레이터";
  if (hasEle && !hasEsc) return "엘리베이터";
  return "ambiguous";
}

// 판별이 애매할 때, 정말 사용자에게 되물을 만한가?
// - 양쪽 설비를 모두 말한 질문("엘리베이터와 에스컬레이터 차이")은 되묻지 않는다.
// - 고유 용어도 공통 개념도 없는 질문(예: "승객 안전 기준")은 되묻지 않고 기존처럼 두 문서를 함께 찾는다.
export function shouldAskEquipment(text: string, detected: EquipmentDetection): boolean {
  if (detected !== "ambiguous") return false;
  const t = compact(text);
  const hasEsc = ESCALATOR_ONLY_TERMS.some(term => t.includes(term));
  const hasEle = ELEVATOR_ONLY_TERMS.some(term => t.includes(term)) || MR_WORD_RE.test(t);
  if (hasEsc && hasEle) return false;
  return SHARED_RE.test(t);
}
