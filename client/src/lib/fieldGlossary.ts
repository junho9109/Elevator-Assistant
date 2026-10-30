// 현장 질문 사전 (참고 힌트) — 카카오톡 현장 대화 분석 기반 초안. 정답/근거가 아니며, 검색어 "추가"와 AI 참고 힌트로만 쓴다.
// 관리자 테스트 스위치(facetSearch)가 켜진 경우에만 적용된다.
export interface GlossaryEntry {
  id: string;
  pattern: RegExp;      // 현장 표현
  queries: string[];    // 기준·표준화 용어(추가 검색어)
  hint: string;         // AI 참고 힌트(근거 아님)
  // 같은 표현이라도 위치·세부 대상에 따라 기준이 갈리는 경우의 되묻기 선택지(관리자 테스트).
  // words: 질문에 이미 이 세부 대상이 들어 있으면 되묻지 않는다. ask: 선택 시 질문에 덧붙일 말.
  branchTitle?: string;
  branches?: { label: string; ask: string; words: RegExp }[];
}
export const FIELD_GLOSSARY: GlossaryEntry[] = [
  { id: "기어드", pattern: /기어\s*리스|기어드|자체\s*시험\s*성적서/, queries: ["브레이크 시스템", "자체시험성적서", "성능확인"], hint: "'기어리스/기어드'는 브레이크 시스템 개선 성능확인(2026.11.01 적용 표준화)의 구분 용어이며, 기어리스는 KTL 안전인증 현장이면 성능확인으로 갈음, 기어드는 안전성평가서·자체시험성적서·현장시험 중 선택하는 경우를 묻는 경우가 많다." },
  { id: "카크기", pattern: /카\s*폭|카\s*깊이|카\s*가로|카\s*세로|카\s*크기|유효\s*바닥\s*면적/, queries: ["카 크기", "장애인용 엘리베이터 카 크기", "유효 바닥면적", "리모델링 카 크기"], hint: "'카폭/카깊이'는 카 크기(유효 바닥면적) 기준을 뜻한다. 장애인용 엘리베이터이거나 기존 건축물·교체·수시검사이면 장애인용 엘리베이터 카 크기 표준화(19년 제4차 리모델링, 23년 제4차 기 설치 교체 등)와 신축 여부 구분이 쓰이는 경우가 많다." },
  { id: "카상부", pattern: /카\s*상부/, queries: ["카 상부 점검운전", "보호난간", "수동운전"], hint: "'카상부'는 보통 카 상부 점검운전·보호난간(난간 스위치, 이격)·상부 틈새를 묻는 경우가 많다.", branchTitle: "카 상부의 어떤 내용을 찾으시나요?", branches: [
    { label: "점검운전·조작반", ask: "카 상부 점검운전 조작반", words: /점검|조작|운전|정지\s*장치|콘센트/ },
    { label: "보호난간·난간 스위치", ask: "카 상부 보호난간", words: /난간/ },
    { label: "상부 틈새·여유 거리", ask: "카 상부 틈새(여유 거리)", words: /틈새|여유|거리|런바이/ },
    { label: "조명·기타 설비", ask: "카 상부 설비", words: /조명|설비|인터폰|통화/ },
  ] },
  { id: "건물측", pattern: /건물\s*측/, queries: ["비상통화장치", "주개폐기"], hint: "'건물측'은 비상통화장치의 건물 측 연결, 또는 건물 측 주개폐기·차단기를 뜻하는 경우가 많다." },
  { id: "인터폰", pattern: /인터폰/, queries: ["비상통화장치", "비상통화장치 피트", "비상통화장치 카 상부"], hint: "'인터폰'은 비상통화장치를 뜻하며, 피트·카 상부·기계실(소방 시)·건물 측 중 어디인지 구분이 필요한 경우가 많다.", branchTitle: "\"인터폰\"은 어느 쪽을 말씀하시나요? 위치에 따라 기준이 달라요.", branches: [
    { label: "피트", ask: "피트 비상통화장치", words: /피트/ },
    { label: "카 상부", ask: "카 상부 비상통화장치", words: /카\s*상부|카\s*위|구출구/ },
    { label: "카 내", ask: "카 내 비상통화장치", words: /카\s*내|카\s*안|조작반/ },
    { label: "기계실(소방 시 통화)", ask: "기계실 비상통화장치(소방운전 시 통화 연결)", words: /기계실|소방/ },
    { label: "건물 측(외부) 연결", ask: "비상통화장치 건물 측(외부) 연결", words: /건물|외부|방재|관리/ },
  ] },
  { id: "과부하", pattern: /오버로드|과부하/, queries: ["과부하감지장치", "무효화"], hint: "'오버로드/과부하'는 과부하감지장치의 설정·무효화(점퍼) 판정을 묻는 경우가 많다." },
  { id: "무효화", pattern: /점퍼|무효화|점퍼잭/, queries: ["안전장치 무효화", "비상운전", "불합격 무효화"], hint: "'점퍼/무효화'는 안전장치(문 접점, 과부하 등) 무효화의 판정, 또는 ERO·점퍼잭 대체 시기를 묻는 경우가 많다." },
  { id: "문닫힘", pattern: /멀티빔|접촉식|세이프티\s*바|세이프티바/, queries: ["문닫힘안전장치", "문닫힘안전장치 표준화"], hint: "'멀티빔/접촉식/세이프티바'는 문닫힘안전장치의 일부 기능 불량 시 판정과 신법·구법(적용 시기) 구분을 묻는 경우가 많다." },
  { id: "로프브레이크", pattern: /로프\s*브레이크|rg\s*잭|7\s*대\s*(안전장치|항목)/i, queries: ["개문출발방지장치", "상승과속방지장치", "안전성평가"], hint: "'로프브레이크/7대 안전장치'는 개문출발·상승과속 방지 수단의 작동·복귀·서류(안전성평가서)를 묻는 경우가 많다." },
  { id: "런바이", pattern: /런바이|최대\s*런바/, queries: ["오버헤드", "상부 틈새", "완충기 행정"], hint: "'런바이'는 카·균형추의 오버헤드/상부 틈새 계산과 지적 기준을 묻는 경우가 많다." },
  { id: "피트사다리", pattern: /사다리/, queries: ["승강로 사다리", "피트 출입", "승강장문 비상개방"], hint: "'사다리'는 피트 사다리 설치·접이식·개방끈/개방고리(비상개방 수단)를 묻는 경우가 많다.", branchTitle: "어느 사다리를 말씀하시나요?", branches: [
    { label: "피트 사다리", ask: "피트 사다리", words: /피트/ },
    { label: "승강로 내부 사다리(카 상부 이동)", ask: "승강로 내부 사다리", words: /승강로|카\s*상부|이동/ },
  ] },
  { id: "ARD", pattern: /\bard\b|자동구출/i, queries: ["자동구출운전", "정전 시 구출"], hint: "'ARD'는 정전 시 자동구출운전의 동작(문 열림·재닫힘, 조명 분리)을 묻는 경우가 많다." },
  { id: "소방", pattern: /소방|[12]\s*차\s*소방/, queries: ["소방운전", "소방구조용 엘리베이터"], hint: "'소방'은 1·2단계 소방운전의 동작 방식과 적용 시기(구법/신법), 스위치·스티커 위치를 묻는 경우가 많다." },
  { id: "비상가이드", pattern: /비상\s*가이드|이탈방지/, queries: ["비상가이드", "승강장문 이탈방지"], hint: "'비상가이드/이탈방지'는 하부 비상가이드·문 이탈방지장치의 적용 시기(허가일)를 묻는 경우가 많다." },
  { id: "도어락", pattern: /도어\s*락|패셔/, queries: ["카도어 인터록", "카도어 잠금장치"], hint: "'도어락/패셔플레이트'는 카도어 잠김장치의 필수 시기와 대체 가능 여부를 묻는 경우가 많다." },
  { id: "비상등", pattern: /비상등|조도/, queries: ["비상조명", "조명 스위치"], hint: "'비상등/조도'는 비상조명·기계류 공간 조도(lux), 제어반 조명 스위치를 묻는 경우가 많다.", branchTitle: "조도(밝기)는 어디에서 측정한 값인가요? 위치에 따라 기준이 달라요.", branches: [
    { label: "기계실·기계류 공간 작업공간", ask: "기계실 작업공간 조도", words: /기계실|기계류|작업\s*공간|풀리실/ },
    { label: "작업공간 간 이동 통로", ask: "작업공간 간 이동 공간 조도", words: /이동|통로/ },
    { label: "승강로·피트", ask: "승강로·피트 조명 조도", words: /승강로|피트/ },
    { label: "카 내·승강장", ask: "카 내·승강장 조도", words: /카\s*내|카\s*안|승강장/ },
  ] },
];
// 자가 학습으로 활성화된 항목(서버 /api/field-glossary/active) — 기본 사전에 "추가"로만 합쳐진다.
let LEARNED: GlossaryEntry[] = [];
const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s*");
export function setLearnedGlossary(list: { id: number; term: string; stdTerms: string[] }[]) {
  LEARNED = (list || []).filter(x => x.term && x.stdTerms?.length).map(x => ({
    id: "learned-" + x.id,
    pattern: new RegExp(esc(x.term), "i"),
    queries: x.stdTerms,
    hint: `'${x.term}'은(는) 사용자들이 재질문하면서 ${x.stdTerms.map(t => `'${t}'`).join(", ")}(으)로 바꿔 물은 표현이다(자동 학습, 참고용).`,
  }));
}
export function matchGlossary(text: string): GlossaryEntry[] {
  return [...FIELD_GLOSSARY, ...LEARNED].filter(e => e.pattern.test(text || ""));
}
export function glossaryQueries(entries: GlossaryEntry[]): string[] {
  return Array.from(new Set(entries.flatMap(e => e.queries)));
}
export function glossaryHintNote(entries: GlossaryEntry[]): string {
  if (!entries.length) return "";
  return `\n\n[현장 용어 참고(사전, 근거 아님)] ${entries.map(e => e.hint).join(" ")} 이는 현장 대화에서 자주 나타나는 경향일 뿐이므로, 질문 맥락과 다르면 무시하세요. 답변의 근거는 반드시 검사기준·판정지침·표준화에서만 인용하고, 어느 쪽(위치·상황)인지 갈리면 구분해서 각각 답하세요.`;
}

// 위치 되묻기 — 첫 번째로 걸린 갈림길 항목 중, 질문에 세부 대상이 아직 없는 것의 선택지를 만든다. 없으면 null.
export function findBranchPrompt(text: string, entries: GlossaryEntry[]): { title: string; options: { label: string; ask: string }[] } | null {
  for (const e of entries) {
    if (!e.branches || e.branches.length < 2) continue;
    if (e.branches.some(b => b.words.test(text || ""))) continue;
    return { title: e.branchTitle || "어느 쪽을 말씀하시나요?", options: e.branches.map(b => ({ label: b.label, ask: b.ask })) };
  }
  return null;
}
