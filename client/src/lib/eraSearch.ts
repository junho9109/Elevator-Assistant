// 고시 원문 검색 — 질문 연도가 있으면 앱에 있는 모든 연도의 고시(generations 폴더)에서 질문 연도 이전 중 가장 가까운 고시를 골라
// 질문 관련 조문을 찾아 "종전 참고"로 AI에 전달한다. 새 고시 파일을 폴더에 추가하면 자동 반영된다(연도 상한 없음).
// 설치 당시 기준과 정확히 같다는 보장은 없으므로 질문 연도와의 차이(gapYears)를 함께 표시한다. 번들 크기를 위해 필요할 때만 불러온다(lazy).
// 조문 연혁 DB(시점별 버전)와는 별개로 함께 쓰인다.
import { pickEraDocs, type EraDoc } from "./eraPick";

const genModules = import.meta.glob("@/data/generations/*.json") as Record<string, () => Promise<any>>;

export interface EraCtxItem { docTitle: string; effectiveDate: string; ref: string; title: string; content: string; gapYears?: number; }

const STOP = new Set(["승강기", "엘리베이터", "현장", "설치", "기준", "검사", "경우", "지적", "판정", "조건부", "불합격", "합격"]);
const nz = (x: string) => (x || "").toLowerCase().replace(/\s+/g, "");

function flatten(item: any): string {
  let t = `${item.title || ""}\n${item.text || ""}`;
  for (const tb of item.tables || []) {
    for (const row of tb.rows || []) t += "\n" + row.map((c: any) => c.t).join(" | ");
  }
  return t;
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

export async function searchEraDocs(year: number | null | undefined, terms: string[], equipment?: string | null): Promise<EraCtxItem[]> {
  try {
    if (!year || year < 1980 || year > 2100) return [];
    const useTerms = Array.from(new Set(terms.map(t => nz(t)).filter(t => t.length >= 2 && !STOP.has(t))));
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
    const hydraulicAsked = useTerms.some(t => t.includes("유압"));
    const scored: { id: string; item: any; score: number; doc: EraDoc }[] = [];
    for (const doc of picked) {
      const family = doc.meta?.family as string | undefined;
      const familyWeight = family === "유압식" ? (hydraulicAsked ? 1 : 0.6) : family === "전기식" ? (hydraulicAsked ? 0.4 : 1) : 1;
      for (const [id, item] of Object.entries<any>(doc.items)) {
        const full = nz(flatten(item));
        const title = nz(item.title || "");
        let score = 0;
        for (const t of useTerms) {
          if (title.includes(t)) score += 3;
          const cnt = full.split(t).length - 1;
          score += Math.min(cnt, 3);
        }
        const isAppendix = id.startsWith("첨부");
        if (isAppendix && !mrlAsked) score = Math.floor(score * 0.4);
        score *= familyWeight;
        if (score > 0) scored.push({ id, item, score, doc });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map(({ id, item, doc }) => ({
      docTitle: doc.meta.title,
      effectiveDate: doc.meta.effectiveDate,
      ref: id,
      title: (id.startsWith("첨부") ? "[기계실 없는 엘리베이터 전용 기준] " : "") + (item.title || id),
      content: windowAround(flatten(item), useTerms),
      gapYears: Math.abs(year - doc.ey),
    }));
  } catch {
    return [];
  }
}
