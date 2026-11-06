// 운영규정(행정안전부고시) 원문 검색 — generations 폴더에서 meta.kind === "regulation"인 문서
// (승강기 안전운행 및 관리에 관한 운영규정, 승강기 설치검사 및 안전검사에 관한 운영규정)를 대상으로 한다.
// · 질문 연도로 고르는 "종전 기준 검색"(eraPick)에는 넣지 않는다(현행 규정이라 연혁 문서가 아님).
// · 질문에 해당 규정의 고유 용어가 있을 때만 검색한다(isRegulationQuestion) — 다른 질문의 답변에 섞이지 않게 하기 위함.
// · 순위: eraRank.ts(상위 항목 제목을 앞에 붙인 문맥 색인 + BM25)를 그대로 쓴다.
import { buildEraIndex, rankEra, cleanEraTerms, flattenItem, nz, type EraEntry } from "./eraRank";

export interface RegDoc { meta: any; items: Record<string, any> }
export interface RegCtxItem { docTitle: string; effectiveDate: string; ref: string; title: string; content: string }
export interface RegSearchOpts {
  mode?: "fast" | "precise";
  /** 원 질문 — "정기검사"를 물었으면 별표 2, "설치검사"면 별표 1 항목에 가중을 준다 */
  question?: string;
}

const TOP_FAST = 5;
const TOP_PRECISE = 6;

// 질문 안의 고유 용어(공백 제거·소문자 기준)로 어느 규정을 볼지 정한다.
const OPERATION_RE = /안전운행|안전관리자|관리교육|교육주기|수료증|수강신청|비상구출운전|피난용승강기|자체점검|주의관찰|긴급수리|수리일지|고장.?수리|승강기번호|번호표지|안전이용.?(안내|표지)|엘리베이터안전이용|유지관리.{0,6}(계약|도급)|표준계약|하도급|공동도급/;
const INSTALL_RE = /설치검사기준|정기검사기준|수시검사기준|정밀안전검사기준|정밀검사기준|안전성평가|검사특례|설치검사및안전검사|검사성적서|정밀안전검사.{0,6}(항목|장비)/;

export function regulationKinds(question: string): { operation: boolean; install: boolean } {
  const q = nz(question);
  const operation = OPERATION_RE.test(q);
  const install = INSTALL_RE.test(q);
  // "운영규정"이라고만 하고 어느 쪽인지 알 수 없으면 두 규정을 모두 본다.
  if (/운영규정/.test(q) && !operation && !install) return { operation: true, install: true };
  return { operation, install };
}
export const isRegulationQuestion = (question: string): boolean => {
  const k = regulationKinds(question);
  return k.operation || k.install;
};

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

function figureTags(docId: string | undefined, ref: string, item: any): string {
  const figs: any[] = item?.figures || [];
  if (!docId || figs.length === 0) return "";
  return "\n" + figs.slice(0, 4).map((f, i) => `[[그림:g/${docId}/${ref}/${i}]] (그림) ${f.caption || "그림"}`).join("\n");
}

// 문서별 색인은 한 번만 만든다.
const indexCache = new Map<string, EraEntry[]>();
function indexOf(doc: RegDoc): EraEntry[] {
  const key = String(doc.meta?.id);
  let idx = indexCache.get(key);
  if (!idx) { idx = buildEraIndex(doc.items); indexCache.set(key, idx); }
  return idx;
}

function groupLabel(doc: RegDoc, id: string): string {
  const p = id.split(".");
  const annex = doc.items[p[0]]?.title?.match(/^\[(별표 \d+)\]/)?.[1] || p[0];
  const grp = doc.items[`${p[0]}.${p[1]}`]?.title;
  return grp ? `[${annex} · ${grp}] ` : `[${annex}] `;
}

/** 순수 함수(테스트용): 고른 규정 문서들에서 질문 관련 항목을 순위대로 돌려준다. */
export function rankRegulationDocs(docs: RegDoc[], terms: string[], opts: RegSearchOpts = {}): RegCtxItem[] {
  const useTerms = cleanEraTerms(terms);
  if (useTerms.length === 0 || docs.length === 0) return [];
  type Row = EraEntry & { doc: RegDoc };
  const rows: Row[] = [];
  // 묶음 항목(noIndex: 종류별 표 전체)은 너무 길어 순위를 흐리므로 색인에서 뺀다 — 세부 번호 항목(hidden)이 대신 검색된다.
  for (const doc of docs) for (const e of indexOf(doc)) if (!e.item?.noIndex) rows.push({ ...e, doc });
  const q = nz(opts.question || "");
  const annexOf: [RegExp, string][] = [[/정기검사/, "별표2"], [/설치검사/, "별표1"], [/수시검사/, "별표3"], [/정밀안전검사|정밀검사/, "별표4"]];
  const boosted = annexOf.filter(([re]) => re.test(q)).map(([, k]) => k);
  const ranked = rankEra(rows, terms, e => {
    if (boosted.length === 0 || !e.doc.meta?.id?.includes("install")) return 1;
    const top = e.id.split(".")[0];
    return boosted.includes(top) ? 2 : /^별표\d$/.test(top) ? 0.45 : 1;
  });
  return ranked.slice(0, opts.mode === "precise" ? TOP_PRECISE : TOP_FAST).map(({ entry }) => ({
    docTitle: entry.doc.meta.title,
    effectiveDate: entry.doc.meta.effectiveDate,
    ref: entry.id,
    // 세부 번호 항목은 화면 목록에 없으므로, 어느 별표·종류의 항목인지 제목 앞에 붙여 알려 준다.
    title: (entry.item.hidden ? groupLabel(entry.doc, entry.id) : "") + (entry.item.title || entry.id),
    content: windowAround(flattenItem(entry.item), useTerms) + figureTags(entry.doc.meta?.id, entry.id, entry.item),
  }));
}

const genModules = import.meta.glob("@/data/generations/*.json") as Record<string, () => Promise<any>>;

export async function searchRegulations(question: string, terms: string[], opts: RegSearchOpts = {}): Promise<RegCtxItem[]> {
  try {
    const kinds = regulationKinds(question);
    if (!kinds.operation && !kinds.install) return [];
    const docs: RegDoc[] = [];
    for (const load of Object.values(genModules)) {
      const m: any = await load();
      const d = m.default || m;
      if (d?.meta?.kind !== "regulation" || !d.items) continue;
      const isOp = /안전운행/.test(d.meta.title || "");
      if ((isOp && kinds.operation) || (!isOp && kinds.install)) docs.push({ meta: d.meta, items: d.items });
    }
    return rankRegulationDocs(docs, [...terms, ...question.split(/\s+/)], { ...opts, question });
  } catch {
    return [];
  }
}
