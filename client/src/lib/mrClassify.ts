// MR(기계실 있음) / MRL(기계실 없음) 판별. 질문 문장만 보고 확정·가정·되묻기·무관 중 하나를 돌려준다.
// 판별 순서는 위에서 아래이며 먼저 걸린 규칙을 따른다.
// 원칙: 확신이 낮으면 가정하지 않고 되묻는다(틀린 가정보다 한 번 더 묻는 편이 낫다).
export type MrKind = "MR" | "MRL" | "UNKNOWN";
export interface MrResult {
  kind: MrKind;
  assumed: boolean;   // 기계실 언급만으로 MR로 가정한 경우 → 답변 첫 줄에 기준 표기
  ask: boolean;       // 되묻기 필요
  conflict: boolean;  // MRL인데 기계실을 묻는 모순 → 승강로 내 구동기·제어반 공간 기준으로 안내
  lowConfidence: boolean; // 부정어가 근처에 있으나 규칙으로 확정 못 해 되묻는 경우(오판 사례 수집 대상)
  reason: string;
}

const nz = (s: string) => (s || "").toLowerCase().replace(/\s+/g, "");

// 오타·구어·발음 표기 보정 (공백 제거 후 적용)
function normalize(s: string): string {
  return nz(s)
    .replace(/기게실|기겨실|기계씰|기계싈|기계쉴/g, "기계실")
    .replace(/엠알엘|엠아르엘|엠알일|m\.r\.l/g, "mrl")
    .replace(/엠알(?!엘)|엠아르|m\.r\./g, "mr")
    .replace(/머신룸/g, "머신룸");
}

// 부정어: 표준어·구어·사투리·오타 ("없", "업는", "읎", "엄는", "않", "아니", "아님")
const NEG = "(?:없|업는|업어|업다|업고|업음|읎|엄는|않|아니|아님)";

// MR/MRL에 따라 답이 달라지는 주제 (문·카 내부·표지 등 공통 주제는 제외)
// 목록은 실제 질문 로그를 보고 이 배열에 단어만 추가하면 된다.
// [2026-11] 실제 이용자 질문 24개(좋아요·아쉬워요 기록)로 점검해 과다 되묻기를 줄였다:
//  '난간·피트·비상정지·구출·인버터·브레이크'는 MR/MRL과 무관한 질문(접이식 난간대, 피트 정지장치,
//  비상정지장치, 자동구출운전, 덤웨이터 인버터 등)에서도 걸려 단독 단어로는 뺐다.
export const MR_TOPIC_WORDS = [
  // 구동·제어 기기와 위치
  "구동기", "권상기", "제어반", "조속기", "전동기", "감속기",
  // 전원·배선
  "주개폐기", "메인스위치", "분전반", "비상전원",
  // 점검·구출 작업
  "점검운전", "점검스위치", "수동구출", "수동운전", "비상운전", "비상구출", "수동핸들",
  // 공간·치수
  "상부공간", "승강로상부", "작업공간", "작업구역", "안전공간", "대피공간", "기계류",
  // 피트 안 설비(피트 자체가 아니라 '피트 안의 무엇'을 물을 때만) — 실제 피드백에서 MR/MRL 구분 요청이 나온 주제
  "피트(내|안|의)?(인터폰|비상통화|통화장치|조명|콘센트|환기|작업공간|피난공간|점검)",
];
// 약한 단어: 카 내부·승강장 등 공통 맥락이 함께 있으면 되묻지 않는다("카 내 조명" 등).
const WEAK_TOPIC = /조명|조도|콘센트|환기/;
const COMMON_CTX = /카내|카바닥|카문|카벽|카천장|승강장|도어|인터록|조작반|표시기/;
const TOPIC = new RegExp(MR_TOPIC_WORDS.join("|"));
const hasTopic = (q: string) => TOPIC.test(q) || (WEAK_TOPIC.test(q) && !COMMON_CTX.test(q));

// "기계실 없는 건 필요 없고", "기계실 없는 건 아니고" 등 MRL을 제외·부정하는 어순.
// '없는' 바로 뒤에 명사(것·거·건·엘리베이터…)가 오고, 이어서 제외 표현이 나올 때만 제외로 본다.
// ("기계실 없는데 환기는 필요없나요?"의 '없는데'는 해당하지 않으므로 MRL로 남는다.)
const EXCLUDE_AFTER = new RegExp(`기계실(이)?${NEG}는?(것|거|건|걸|엘리베이터|승강기|형|타입|쪽|놈)(은|는|이|가|을|를)?.{0,10}(말고|아닌|아니|아님|제외|빼고|필요없|상관없|해당없|해당안|해당되지|무관|관심없)`);
// "기계실 있는 일반 승강기 기준이고 기계실 없는 건…" 처럼 기계실 '있는' 쪽을 앞세운 어순
const HAS_ROOM_FIRST = new RegExp(`(기계실(이)?있는|일반(엘리베이터|승강기)?).{0,14}기계실(이)?${NEG}는?(것|거|건|걸|엘리베이터|승강기|형|타입|쪽)`);
// 기계실 바로 뒤(조사·강조 부사만 허용)에 부정어 → MRL
const DIRECT_NEG = new RegExp(`기계실(이|은|가|도|는|에는)?(따로|별도로?|아예|전혀|애초에|원래|그냥|하나도)*${NEG}`);
// 기계실과 부정어가 가까이 있으나 직접 연결은 아님 ("기계실 조명이 없는데…")
const NEAR_NEG = new RegExp(`기계실.{0,12}${NEG}|${NEG}.{0,12}기계실`);
// 직전 답변을 정정하는 말머리 ("아니", "그거 말고")
const CORRECTION = /^(아니|아뇨|아닌데|그거말고|그게아니고|그게아니라|틀렸)/;

export function classifyMrMrl(question: string): MrResult {
  const q = normalize(question);
  const r = (kind: MrKind, reason: string, o: Partial<MrResult> = {}): MrResult =>
    ({ kind, assumed: false, ask: false, conflict: false, lowConfidence: false, reason, ...o });

  const mentionsRoom = /기계실/.test(q);

  // 0. 직전 답변 정정 말머리 → 가정을 믿지 말고 되묻기
  if (CORRECTION.test(q)) return r("UNKNOWN", "정정 말머리", { ask: true });
  // 1. 명시적 MRL
  if (/mrl|머신룸리스|machineroomless|기계실리스/.test(q)) {
    return r("MRL", "명시적 MRL", { conflict: /기계실/.test(q.replace(/기계실리스/g, "")) && !DIRECT_NEG.test(q) });
  }
  // 2. 명시적 MR (MRL 등 다른 영문이 붙지 않은 단독 MR)
  if (/(?<![a-z])mr(?![a-z])/.test(q)) return r("MR", "명시적 MR");
  // 3. "기계실 없는 엘리베이터 말고/아닌/제외" → 제외 대상이므로 MR
  if (EXCLUDE_AFTER.test(q) || HAS_ROOM_FIRST.test(q)) return r("MR", "MRL 제외 요청");
  // 4. 부정과 번복이 섞임 → 판별 불가
  if (new RegExp(`기계실.{0,6}(${NEG}는?줄|${NEG}다고|${NEG}는?것같|${NEG}는?걸로)`).test(q)) {
    return r("UNKNOWN", "부정·번복 혼재", { ask: true });
  }
  // 5. 기계실 존재 여부 자체가 질문
  if (/기계실(이|은)?(있는지|있나|있는가|있어|있는데맞|없는지|유무|여부)/.test(q)) {
    return r("UNKNOWN", "존재 여부 질문", { ask: true });
  }
  // 6. "기계실 없…" 직접 부정형 → MRL
  if (DIRECT_NEG.test(q)) return r("MRL", "기계실 부정형");
  // 7. 부정어가 근처에 있으나 직접 연결이 아님 → 규칙으로 확정하지 않고 되묻기
  if (NEAR_NEG.test(q)) return r("UNKNOWN", "부정어 근접·확신 낮음", { ask: true, lowConfidence: true });
  // 8. 기계실 긍정 언급 → MR 가정
  if (mentionsRoom) return r("MR", "기계실 언급", { assumed: true });
  // 9. 단서 없음: 주제가 형식에 따라 달라지면 되묻기
  if (hasTopic(q)) return r("UNKNOWN", "단서 없음·형식 의존 주제", { ask: true });
  return r("UNKNOWN", "형식 무관 주제");
}

// 같은 대화에서 이미 정해진 형식(prev)을 이어받는다.
// - 이번 질문에 명시적 단서가 있으면 그 단서가 우선(형식 변경)
// - 단서가 없어 되묻게 되는 경우에는 prev를 유지해 다시 묻지 않는다
export function resolveMrMrl(question: string, prev: MrKind | null | undefined): MrResult & { switched: boolean; carried: boolean } {
  const cur = classifyMrMrl(question);
  const explicit = cur.kind !== "UNKNOWN" && !cur.assumed;
  if (prev && prev !== "UNKNOWN") {
    if (explicit && cur.kind !== prev) return { ...cur, switched: true, carried: false };
    if (cur.kind === "UNKNOWN" && cur.reason === "단서 없음·형식 의존 주제") {
      return { ...cur, kind: prev, ask: false, reason: "이전 선택 유지", switched: false, carried: true };
    }
    // 이전에 MRL로 정했는데 '기계실'을 묻는 경우: MRL 유지 + 모순 안내
    if (cur.assumed && cur.kind !== prev) return { ...cur, kind: prev, assumed: false, conflict: prev === "MRL", reason: "이전 선택 유지", switched: false, carried: true };
  }
  return { ...cur, switched: false, carried: false };
}
