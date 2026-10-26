// 정밀안전검사 페이지 데이터 — 「정밀안전검사 관련 승강기 부품 보완 이행기간 연장」 붙임 PDF 기준.
// 셀 내용은 원문 PDF의 글자색(span style)을 그대로 유지한 정적 HTML 문자열입니다 (사용자 입력 아님).

export type CmpRow = [string, string, string | null];

export const APT_ROWS: CmpRow[] = [
 [
  "적용시점",
  "• 고시 발령 후 <span style=\"color:#ff0000\">3개월 이전까지 유효</span>",
  "• 고시 발령 후 <span style=\"color:#ff0000\">3개월 이후 의무 적용</span>"
 ],
 [
  "제출서류",
  "• 서면동의서<br><span style=\"color:#ff0000\">※ 현행으로 3년 연장한 경우 추가 제</span><br><span style=\"color:#ff0000\">출서류(3종)를 제출안해도 됨</span>",
  "• 서면동의서<br>• 설치 이행계획서<br>• 안내 경고문 부착 증명자료"
 ],
 [
  "검사판정<br>(네번째 정밀 시)",
  "• 조건부 합격(2개월) 후 최종판정",
  "• (설치 미계약) 검사일에 <span style=\"color:#ff0000\">“불합격”</span><br>• (설치 계약완료) 조건부 합격(2개월)<br>→ (착수 중) 추가 2개월 부여"
 ],
 [
  "비고",
  "• &lt;고시 발령 후 3개월 이후&gt; <span style=\"color:#ff0000\">설치계약 미계약 시</span> 검사판정 변경<br>- 검사일에 판정이 (조건부→불합격)으로 변경됨을 관리주체에게 안내 필요",
  null
 ]
];

export const GEN_ROWS: CmpRow[] = [
 [
  "적용시점",
  "-",
  "• 고시 발령 후 <span style=\"color:#ff0000\">즉시</span>"
 ],
 [
  "제출서류",
  "• 단계별 이행계획서 등<br><span style=\"color:#ff0000\">※ 1단계(1년6개월) → 2단계(1년) 연장</span>",
  "• 서면동의서<br>• 설치 이행계획서<br><span style=\"color:#ff0000\">※ 종전 계획서와 별도로 신규 계획서</span><br><span style=\"color:#ff0000\">제출받아야 함</span><br>• 안내 경고문 부착 증명자료"
 ],
 [
  "검사판정<br>(2단계 후<br><span style=\"color:#ff0000\">대체정밀 시</span> )",
  "• 미설치 시 <span style=\"color:#ff0000\">“조건부합격”</span><br><span style=\"color:#ff0000\">※ 이행계획의 남은 기간의 조건부 일자 부여</span>",
  "• 제출서류(3종) 받고 합격<br><span style=\"color:#ff0000\">※ 네 번째 정밀안전검사도 받아야 함</span>"
 ],
 [
  "검사판정<br>(네번째 정밀 시)",
  "-",
  "• (설치 미계약) 검사일에 <span style=\"color:#ff0000\">“불합격”</span><br>• (설치 계약완료) 조건부 합격(2개월)<br>→ (착수 중) 추가 2개월 부여"
 ],
 [
  "비고",
  "• 1, 2단계의 2차례 처리절차를 1차례로 간소화<br>(세 번째 정밀안전검사 시 처리하여 네 번째 정밀안전검사로 연장)<br>• 고시 시행 전 2단계 연장한 현장은 대체정밀 실시 후 네 번째 정밀안전<br>검사도 실시하여야 함<br><span style=\"color:#0000ff\">※ 2단계 연장 시행전인 현장은 대체정밀을 정기검사로 진행가능(서류 전부제출 시)</span><br>• (고시 시행전 현장) 개정된 결과처리는 <span style=\"color:#ff0000\">도래하는 근접한 검사(확인검사</span><br><span style=\"color:#ff0000\">포함) 검사 결과처리 시 적용</span>",
  null
 ]
];

// 일반건축물 개정 — 검사 진행현황별 업무처리 세부설명 (1단계 / 2단계 표)
export interface SituationRow { no: string; status: string; result: string; note: string | null }
export const S1_ROWS: SituationRow[] = [
 {
  "no": "[①]",
  "status": "<span style=\"color:#0000ff\">세 번째 정밀검사 후</span><br><span style=\"color:#ff0000\">정기검사 전</span>",
  "result": "<span style=\"color:#0000ff\">정기검사</span> 시 →<br><span style=\"color:#ff0000\">(공동주택) 처리절차</span> 와 <span style=\"color:#0000ff\">동일하게</span> 업무처리",
  "note": null
 },
 {
  "no": "[②]",
  "status": "<span style=\"color:#ff0000\">정기검사 후</span><br><span style=\"color:#0000ff\">조건부 진행중</span>",
  "result": "<span style=\"color:#ff0000\">조건부 기간 내</span> →<br>제출서류(3종) 받고 <span style=\"color:#0000ff\">조건후합격</span>",
  "note": null
 }
];
export const S2_ROWS: SituationRow[] = [
 {
  "no": "[③]",
  "status": "<span style=\"color:#0000ff\">(대체)정밀검사</span> 실시 이전 현장<br><span style=\"color:#ff0000\">※ 안내문 생성 및 발송완료</span><br><span style=\"color:#ff0000\">(접수완료 포함)</span>",
  "result": "<span style=\"color:#ff0000\">(대체)정밀 검사실시 후</span> →<br>제출서류(3종) 받고 <span style=\"color:#0000ff\">합격</span>",
  "note": "<span style=\"color:#ff0000\">네 번째</span><br><span style=\"color:#ff0000\">정밀</span> 검사도<br>받아야 함"
 },
 {
  "no": "[④]",
  "status": "<span style=\"color:#0000ff\">(대체)정밀검사</span> 실시 후<br><span style=\"color:#ff0000\">조건부 진행중</span> 인 현장",
  "result": "<span style=\"color:#ff0000\">조건부 기간 내</span> →<br>제출서류(3종) 받고 <span style=\"color:#0000ff\">조건후합격</span>",
  "note": "<span style=\"color:#ff0000\">네 번째</span><br><span style=\"color:#ff0000\">정밀</span> 검사도<br>받아야 함"
 }
];
