// 종전 기준 검색에서 쓸 고시 문서를 고르는 순수 로직(테스트 가능하도록 eraSearch.ts에서 분리).

export interface EraDoc { meta: any; items: Record<string, any>; ey: number }

const latestGroup = (pool: EraDoc[], year: number): EraDoc[] => {
  const le = pool.filter(d => d.ey <= year);
  if (le.length === 0) {
    // 질문 연도보다 앞선 문서가 없으면 가장 오래된 시행일의 문서(들)
    const first = pool[0];
    return pool.filter(d => d.meta.effectiveDate === first.meta.effectiveDate);
  }
  const latest = le[le.length - 1].meta.effectiveDate;
  const group = le.filter(d => d.meta.effectiveDate === latest);
  // 경계 연도: 질문 연도 중간(1월 1일이 아닌 날)에 시행된 문서면, 그 직전 시행 문서도 함께 본다.
  // (연도만 알 때 시행일 이전 설치분은 직전 기준일 수 있기 때문 — 예: 2013-09-15 시행 → 2013년 질문은 2009 고시도 함께)
  if (group[0].ey === year && !String(latest).endsWith("-01-01")) {
    const prev = le.filter(d => d.meta.effectiveDate < latest);
    if (prev.length > 0) {
      const pd = prev[prev.length - 1].meta.effectiveDate;
      group.push(...prev.filter(d => d.meta.effectiveDate === pd));
    }
  }
  return group;
};

// 질문 연도에 가까운 고시를 고른다(연도 상한 없음 — generations 폴더에 있는 모든 연도의 고시가 대상).
// · 업무 절차 문서(meta.kind === "procedure")는 제외한다.
// · 특정 설비 전용 문서(meta.equipment)는 질문의 설비와 같을 때만 쓴다(설비를 모르면 설비별로 각각 고른다).
// · 질문 연도 이전(<=) 문서 중 가장 최근 시행일을 고르고, 같은 시행일 문서(예: 전기식·유압식)는 모두 돌려준다. 없으면 가장 오래된 문서.
export function pickEraDocs(docs: EraDoc[], year: number, equipment?: string | null): EraDoc[] {
  if (!year || year < 1980 || year > 2100) return [];
  const usable = docs
    .filter(d => d.meta?.kind !== "procedure")
    .sort((a, b) => String(a.meta.effectiveDate).localeCompare(String(b.meta.effectiveDate)));
  if (usable.length === 0) return [];
  const equipments = equipment
    ? [equipment]
    : Array.from(new Set(usable.map(d => d.meta?.equipment).filter(Boolean))) as string[];
  const pools = equipments.length > 0
    ? equipments.map(e => usable.filter(d => !d.meta.equipment || d.meta.equipment === e))
    : [usable.filter(d => !d.meta.equipment)];
  const out: EraDoc[] = [];
  for (const pool of pools) {
    if (pool.length === 0) continue;
    for (const d of latestGroup(pool, year)) if (!out.includes(d)) out.push(d);
  }
  return out;
}

// 하위 호환: 가장 먼저 고른 문서 한 개
export function pickEraDoc(docs: EraDoc[], year: number, equipment?: string | null): EraDoc | null {
  return pickEraDocs(docs, year, equipment)[0] ?? null;
}
