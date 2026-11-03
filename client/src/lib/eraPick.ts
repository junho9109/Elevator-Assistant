// 종전 기준 검색에서 쓸 고시 문서를 고르는 순수 로직(테스트 가능하도록 eraSearch.ts에서 분리).

export interface EraDoc { meta: any; items: Record<string, any>; ey: number }

// 질문 연도에 가장 가까운 고시를 고른다(연도 상한 없음 — generations 폴더에 추가되는 모든 연도의 고시가 자동 대상).
// · 업무 절차 문서(meta.kind === "procedure")는 제외한다.
// · 특정 설비 전용 문서(meta.equipment)는 질문의 설비와 같을 때만 쓴다.
// · 질문 연도 이전(<=) 문서 중 가장 최근 것을 쓰고, 없으면 가장 오래된 문서를 쓴다.
export function pickEraDoc(docs: EraDoc[], year: number, equipment?: string | null): EraDoc | null {
  if (!year || year < 1980 || year > 2100) return null;
  const usable = docs
    .filter(d => d.meta?.kind !== "procedure")
    .filter(d => !d.meta?.equipment || !equipment || d.meta.equipment === equipment)
    .sort((a, b) => a.ey - b.ey);
  if (usable.length === 0) return null;
  const le = usable.filter(d => d.ey <= year);
  return le.length > 0 ? le[le.length - 1] : usable[0];
}
