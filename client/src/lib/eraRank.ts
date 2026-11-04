// 고시 원문 조문 순위 매기기(순수 함수 — 브라우저·테스트 공용).
// 예전 방식(검색어가 제목·본문에 몇 번 나오는지 단순 합산)은 긴 조문과 일반어에 점수가 쏠려
// 정답 조문(예: 잠금해제구간 → 7.7.1)이 상위 3위 밖으로 밀리는 일이 있었다.
// 개선: ① 조문 문맥 색인(상위 장·절 제목을 조문 앞에 붙여 색인) ② BM25(희귀한 검색어·짧은 조문에 가중, 긴 조문 감점)
//       ③ 질문 말투·설비종류어 정리(설비종류는 family 가중치가 따로 처리) — 참고: Anthropic "Contextual Retrieval", BM25.

export const nz = (x: string) => (x || "").toLowerCase().replace(/\s+/g, "");

const STOP = new Set(["승강기", "엘리베이터", "현장", "설치", "기준", "검사", "경우", "지적", "판정", "조건부", "불합격", "합격"]);
// 질문 말투·일반어(질문 연도 포함). 조문 본문에 흔하거나 의미 없는 어미라 순위를 흐린다.
const NOISE = /^(\d{4}년.*|몇|얼마|어떻게|어떤|뭐야|알려줘|이상이어야|이하야|이상이야|이하여야|이하여야해|해야|돼|되나|있어야|설치해|설치한|설치|경우에|기준|기준이|기준은|기준을|조건|방법|관계)$/;
// 설비종류어: 어떤 문서(전기식/유압식/에스컬레이터)를 볼지는 family 가중치가 정하므로 검색어에서는 뺀다.
const FAMILY = /^(유압식|전기식|유압|유압식엘리베이터|전기식엘리베이터|엘리베이터|무빙워크)$/;

export function cleanEraTerms(terms: string[]): string[] {
  const all = Array.from(new Set(terms.map(nz).filter(t => t.length >= 2)));
  const kept = all.filter(t => !STOP.has(t) && !NOISE.test(t) && !FAMILY.test(t));
  // 전부 걸러지면(예: '무빙워크'만 물은 질문) 최소한의 정리만 적용해 검색 자체는 되게 한다.
  return kept.length > 0 ? kept : all.filter(t => !STOP.has(t) && !NOISE.test(t));
}

export function flattenItem(item: any): string {
  let t = `${item.title || ""}\n${item.text || ""}`;
  for (const tb of item.tables || []) {
    for (const row of tb.rows || []) t += "\n" + row.map((c: any) => c.t).join(" | ");
  }
  return t;
}

// 조문번호 → 상위 조문번호들. "6.7.1.7" → ["6","6.7","6.7.1"], "부속서Ⅲ/2.3" → ["부속서Ⅲ","부속서Ⅲ/2"]
export function ancestorKeys(id: string): string[] {
  const slash = id.indexOf("/");
  if (slash >= 0) {
    const pre = id.slice(0, slash);
    const parts = id.slice(slash + 1).split(".");
    return [pre, ...parts.slice(0, -1).map((_, i) => `${pre}/${parts.slice(0, i + 1).join(".")}`)];
  }
  const parts = id.split(".");
  return parts.slice(0, -1).map((_, i) => parts.slice(0, i + 1).join("."));
}

export interface EraEntry {
  id: string;
  title: string;      // 정규화된 조문 제목
  text: string;       // 정규화된 [상위 조문 제목들 + 제목 + 본문 + 표]
  item: any;
}

// 문서 하나의 색인(조문 문맥 색인). 문서당 한 번만 만들면 된다.
export function buildEraIndex(items: Record<string, any>): EraEntry[] {
  return Object.entries(items).map(([id, item]) => {
    const anc = ancestorKeys(id).map(k => items[k]?.title || "").filter(Boolean).join(" ");
    return { id, title: nz(item.title || ""), text: nz(anc + " " + flattenItem(item)), item };
  });
}

const count = (hay: string, needle: string) => hay.split(needle).length - 1;

// BM25(k1=1.2, b=0.75) + 제목 일치 가점(3). weightOf: 항목별 곱셈 가중치(문서 종류·첨부 감점 등).
export function rankEra<T extends EraEntry>(entries: T[], rawTerms: string[], weightOf: (e: T) => number = () => 1): { entry: T; score: number }[] {
  const terms = cleanEraTerms(rawTerms);
  if (terms.length === 0 || entries.length === 0) return [];
  const N = entries.length;
  const avg = entries.reduce((a, e) => a + e.text.length, 0) / N;
  const df: Record<string, number> = {};
  for (const t of terms) df[t] = entries.filter(e => e.text.includes(t)).length;
  const out: { entry: T; score: number }[] = [];
  for (const e of entries) {
    let s = 0;
    for (const t of terms) {
      if (!df[t]) continue;
      const idf = Math.log(1 + (N - df[t] + 0.5) / (df[t] + 0.5));
      const tf = count(e.text, t) + (e.title.includes(t) ? 3 : 0);
      s += (idf * tf * 2.2) / (tf + 1.2 * (0.25 + (0.75 * e.text.length) / avg));
    }
    s *= weightOf(e);
    if (s > 0) out.push({ entry: e, score: s });
  }
  return out.sort((a, b) => b.score - a.score);
}
