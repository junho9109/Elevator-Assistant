// "물어볼 가치가 있는가" 판단 — 검색 결과가 선택지에 따라 실제로 갈릴 때만 되묻는다.
// 결과가 한 갈래뿐이면 묻지 않고 그대로 답변한다(답변은 어차피 구분해서 안내).
export type NeedResult = {
  type: string;
  title: string;
  content: string;
  score?: number;
  versions?: { type: "current" | "old"; effectiveDate?: string }[];
};

const TOP_N = 5;
const topResults = (rs: NeedResult[]) =>
  [...rs].filter(r => r.type !== "chat").sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, TOP_N);

// 설치연도: 상위 결과에 개정 이력(구 버전)이 있어 연도에 따라 기준이 달라질 때
export function yearDiverges(rs: NeedResult[]): boolean {
  return topResults(rs).some(r => {
    const v = r.versions || [];
    if (v.length < 2) return false;
    const dates = new Set(v.map(x => x.effectiveDate || "").filter(Boolean));
    return v.some(x => x.type === "old") || dates.size >= 2;
  });
}

const KIND_RES: RegExp[] = [/완성\s*검사|설치\s*검사/, /정기\s*검사/, /수시\s*검사/, /정밀\s*안전\s*검사|정밀\s*검사/];
// 검사 종류: 상위 결과 본문에 서로 다른 검사 종류가 2개 이상 언급될 때
export function kindDiverges(rs: NeedResult[]): boolean {
  const text = topResults(rs).map(r => `${r.title} ${(r.content || "").slice(0, 600)}`).join("\n");
  return KIND_RES.filter(re => re.test(text)).length >= 2;
}

const LOC_RES: RegExp[] = [/기계실|기계류\s*공간|풀리실/, /승강로/, /피트/, /카\s*상부|카\s*지붕/, /카\s*(내|안)\b|카\s*내부/, /승강장|출입문/];
// 위치: 상위 결과 제목·본문이 서로 다른 위치 2곳 이상에 걸칠 때
export function locDiverges(rs: NeedResult[]): boolean {
  const text = topResults(rs).map(r => `${r.title} ${(r.content || "").slice(0, 400)}`).join("\n");
  return LOC_RES.filter(re => re.test(text)).length >= 2;
}

// 한 질문에 연달아 묻는 상한(필요성 판단을 통과한 것만 센다)
export const MAX_CLARIFY_STEPS = 2;
