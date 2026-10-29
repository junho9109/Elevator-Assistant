// 종전 기준 검색(관리자 테스트) — 설치연도가 오래된 질문에서, 앱에 있는 세대별 고시(1997·1998 등)에서
// 질문 관련 조문을 찾아 "종전 참고"로 AI에 전달한다. 설치 당시 기준과 정확히 같다는 보장은 없으므로
// 가장 가까운 시기의 고시임을 함께 표시한다. 번들 크기를 위해 필요할 때만 불러온다(lazy).
const genModules = import.meta.glob("@/data/generations/*.json") as Record<string, () => Promise<any>>;

export interface EraCtxItem { docTitle: string; effectiveDate: string; ref: string; title: string; content: string; }

const STOP = new Set(["승강기", "엘리베이터", "현장", "설치", "기준", "검사", "경우", "지적", "판정", "조건부", "불합격", "합격"]);
const nz = (x: string) => (x || "").toLowerCase().replace(/\s+/g, "");

function flatten(item: any): string {
  let t = `${item.title || ""}\n${item.text || ""}`;
  for (const tb of item.tables || []) {
    for (const row of tb.rows || []) t += "\n" + row.map((c: any) => c.t).join(" | ");
  }
  return t;
}

export async function searchEraDocs(year: number | null | undefined, terms: string[]): Promise<EraCtxItem[]> {
  try {
    if (!year || year < 1980 || year > 2008) return [];
    const useTerms = Array.from(new Set(terms.map(t => nz(t)).filter(t => t.length >= 2 && !STOP.has(t))));
    if (useTerms.length === 0) return [];
    const docs: any[] = [];
    for (const load of Object.values(genModules)) {
      const m: any = await load();
      const d = m.default || m;
      const ey = Number(String(d?.meta?.effectiveDate || "").slice(0, 4));
      if (d?.items && ey && ey <= 2008) docs.push({ meta: d.meta, items: d.items, ey });
    }
    if (docs.length === 0) return [];
    docs.sort((a, b) => a.ey - b.ey);
    const le = docs.filter(d => d.ey <= year);
    const doc = le.length > 0 ? le[le.length - 1] : docs[0];
    const scored: { id: string; item: any; score: number }[] = [];
    for (const [id, item] of Object.entries<any>(doc.items)) {
      const full = nz(flatten(item));
      const title = nz(item.title || "");
      let score = 0;
      for (const t of useTerms) {
        if (title.includes(t)) score += 3;
        const cnt = full.split(t).length - 1;
        score += Math.min(cnt, 3);
      }
      if (score > 0) scored.push({ id, item, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map(({ id, item }) => ({
      docTitle: doc.meta.title,
      effectiveDate: doc.meta.effectiveDate,
      ref: id,
      title: item.title || id,
      content: flatten(item).slice(0, 1200),
    }));
  } catch {
    return [];
  }
}
