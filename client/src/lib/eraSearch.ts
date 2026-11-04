// 고시 원문 검색 — 질문 연도가 있으면 앱에 있는 모든 연도의 고시(generations 폴더)에서 질문 연도 이전 중 가장 가까운 고시를 골라
// 질문 관련 조문을 찾아 "종전 참고"로 AI에 전달한다. 새 고시 파일을 폴더에 추가하면 자동 반영된다(연도 상한 없음).
// 설치 당시 기준과 정확히 같다는 보장은 없으므로 질문 연도와의 차이(gapYears)를 함께 표시한다. 번들 크기를 위해 필요할 때만 불러온다(lazy).
// 조문 연혁 DB(시점별 버전)와는 별개로 함께 쓰인다.
// 순위: eraRank.ts(조문 문맥 색인 + BM25 + 검색어 정리). 빠른 답변은 상위 5개, 정밀 답변은 상위 6개를 전달한다.
// (AI로 후보를 다시 거르는 방식도 측정했으나, 개선된 순위에서는 정확도가 더 오르지 않고 1.5초가 늘어 쓰지 않는다.)
import { pickEraDocs, type EraDoc } from "./eraPick";
import { buildEraIndex, rankEra, cleanEraTerms, flattenItem, nz, type EraEntry } from "./eraRank";

const genModules = import.meta.glob("@/data/generations/*.json") as Record<string, () => Promise<any>>;

export interface EraCtxItem { docTitle: string; effectiveDate: string; ref: string; title: string; content: string; gapYears?: number; }
export interface EraSearchOpts {
  /** 정밀 답변이면 한 조문이라도 더 넣는다(상위 6개). 기본(빠른 답변)은 상위 5개 */
  mode?: "fast" | "precise";
  /** 원 질문 — '유압' 질문인지 판단하는 데 쓴다(검색어에서는 설비종류어를 빼므로) */
  question?: string;
}

const TOP_FAST = 5;
const TOP_PRECISE = 6;

// 문서별 색인은 한 번만 만든다.
const indexCache = new Map<string, EraEntry[]>();
function indexOf(doc: EraDoc): EraEntry[] {
  const key = String(doc.meta?.id || doc.meta?.title);
  let idx = indexCache.get(key);
  if (!idx) { idx = buildEraIndex(doc.items); indexCache.set(key, idx); }
  return idx;
}

// 긴 조문(수천 자)은 앞부분 1200자만 자르면 질문과 무관한 부분이 전달될 수 있어,
// 질문어가 가장 많이 나오는 곳(동률이면 먼저 나오는 곳) 주변 1200자를 잘라 보낸다.
function windowAround(full: string, terms: string[], max = 1200): string {
  if (full.length <= max) return full;
  let bestPos = -1, bestCnt = 0;
  for (const t of terms) {
    const pat = Array.from(t).map(ch => ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s*");
    const all = Array.from(full.matchAll(new RegExp(pat, "gi")));
    if (all.length > bestCnt || (all.length === bestCnt && all.length > 0 && all[0].index! < bestPos)) {
      bestCnt = all.length; bestPos = all[0].index!;
    }
  }
  if (bestPos < 0) return full.slice(0, max);
  const start = Math.max(0, bestPos - 200);
  return (start > 0 ? "…" : "") + full.slice(start, start + max);
}

export async function searchEraDocs(year: number | null | undefined, terms: string[], equipment?: string | null, opts: EraSearchOpts = {}): Promise<EraCtxItem[]> {
  try {
    if (!year || year < 1980 || year > 2100) return [];
    const useTerms = cleanEraTerms(terms);
    if (useTerms.length === 0) return [];
    const docs: EraDoc[] = [];
    for (const load of Object.values(genModules)) {
      const m: any = await load();
      const d = m.default || m;
      const ey = Number(String(d?.meta?.effectiveDate || "").slice(0, 4));
      if (d?.items && ey) docs.push({ meta: d.meta, items: d.items, ey });
    }
    const picked = pickEraDocs(docs, year, equipment);
    if (picked.length === 0) return [];
    // 첨부4·5(기계실 없는 엘리베이터 전용 기준)는 질문에 '기계실 없는'이 들어 있을 때만 본문과 동등하게 취급
    const mrlAsked = useTerms.some(t => t.includes("기계실없는") || t.includes("기계실이없") || t.includes("mrl"));
    // 같은 시행일에 전기식·유압식 문서가 함께 있으면(meta.family) 질문에 '유압'이 있는지에 따라 가중
    // (검색어에서 '유압식'·'전기식'은 빼므로 문서 선택은 여기서만 정해진다 — 원 질문 기준으로 판단)
    const hydraulicAsked = nz((opts.question || "") + " " + terms.join(" ")).includes("유압");
    type Row = EraEntry & { doc: EraDoc; fw: number };
    const rows: Row[] = [];
    for (const doc of picked) {
      const family = doc.meta?.family as string | undefined;
      const fw = family === "유압식" ? (hydraulicAsked ? 1 : 0.6) : family === "전기식" ? (hydraulicAsked ? 0.4 : 1) : 1;
      for (const e of indexOf(doc)) rows.push({ ...e, doc, fw });
    }
    const ranked = rankEra(rows, terms, e => e.fw * (e.id.startsWith("첨부") && !mrlAsked ? 0.4 : 1));
    return ranked.slice(0, opts.mode === "precise" ? TOP_PRECISE : TOP_FAST).map(({ entry }) => ({
      docTitle: entry.doc.meta.title,
      effectiveDate: entry.doc.meta.effectiveDate,
      ref: entry.id,
      title: (entry.id.startsWith("첨부") ? "[기계실 없는 엘리베이터 전용 기준] " : "") + (entry.item.title || entry.id),
      content: windowAround(flattenItem(entry.item), useTerms),
      gapYears: Math.abs(year - entry.doc.ey),
    }));
  } catch {
    return [];
  }
}
