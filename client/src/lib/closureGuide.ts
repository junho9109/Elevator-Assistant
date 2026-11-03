// 폐지·휴지·검사연기 질문 — 업무 절차 문서(generations/closure-guide.json)와 근거 표준화를 AI에 전달한다.
// · 절차 문서: 질문에 폐지·철거·휴지·검사연기가 있을 때만 전달(연도별 종전 기준 검색과는 별개).
// · 근거 표준화: "폐지 후 신규(재)설치" 질문이면 '교체 설치검사' 표준화를 강제로 포함해 근거를 갖춘다.

const SUBJECT = "(?:승강기|엘리베이터|에스컬레이터|무빙워크|휠체어리프트|리프트|덤웨이터)";

// 폐지·휴지·검사연기 업무 질문인가? — '철거'는 승강기 철거를 뜻할 때만(카 내 구조물 철거 같은 질문은 제외).
const CLOSURE_RE = new RegExp(
  [
    "폐지",
    "휴지",
    "검사\\s*연기",
    "연기\\s*(?:신청|사유)",
    "영구\\s*(?:폐쇄|막음)",
    `${SUBJECT}.{0,8}철거`,
    `철거.{0,8}${SUBJECT}`,
    "철거\\s*(?:신고|신청|인정|사유|조건)",
  ].join("|"),
);

// 폐지 후 다시(새로) 설치하는 질문인가?
const REINSTALL_RE = /재설치|신규\s*설치|새로\s*설치|다시\s*설치|새\s*승강기|교체\s*설치|신설|재사용/;

export const isClosureQuestion = (text: string): boolean => CLOSURE_RE.test(text || "");
export const isReinstallAfterClosure = (text: string): boolean => isClosureQuestion(text) && REINSTALL_RE.test(text || "");

// 폐지 후 신규(교체) 설치 질문에 근거로 붙이는 표준화 — 제목으로 찾는다(DB id는 바뀔 수 있음).
export const CLOSURE_EVIDENCE_TITLES: RegExp[] = [
  /^교체\s*설치검사\s*시\s*종전검사기준\s*적용/,
  /^교체\s*설치검사\s*카\s*크기\s*적용/,
  /^건축물의\s*구조\s*변경없이\s*현행\s*안전기준\s*적용이\s*어려운/,
  /^교체\s*설치현장의\s*카\s*상부\s*보호난간/,
  /^교체\s*설치\s*시\s*안전기준\s*적용기준\s*\[기계실\s*이동통로/,
  /^검사원간\s*판정\s*상이함\s*\(1,2,3/,
];

export interface StdLike { title: string; ref?: string; basis?: string; conclusion?: string; source?: string }

// 표준화 목록에서 근거 항목을 찾아 techCtx 모양으로 만든다(결정문은 길어도 자르지 않고 1500자까지).
export function pickClosureEvidence(allStd: StdLike[]): any[] {
  const out: any[] = [];
  for (const re of CLOSURE_EVIDENCE_TITLES) {
    const s = allStd.find(x => re.test(x.title || ""));
    if (!s) continue;
    out.push({
      priority: "기술자료(표준화)",
      title: s.title,
      ref: s.ref || "",
      basis: (s.basis || "").slice(0, 500),
      conclusion: (s.conclusion || "").slice(0, 1500),
      source: s.source || "",
      permitDate: "",
      inspectionDate: "",
      inspectionYear: "",
      installInspectionDate: "",
    });
  }
  return out;
}

// 근거 항목을 맨 앞에 두고, 기존 항목은 제목이 겹치지 않는 것만 이어 붙인다(최대 max개).
export function mergeClosureEvidence<T extends { title: string }>(base: T[], evidence: T[], max = 9): T[] {
  const seen = new Set(evidence.map(e => e.title));
  return [...evidence, ...base.filter(b => !seen.has(b.title))].slice(0, max);
}

export interface ClosureCtxItem { ref: string; title: string; content: string }

// AI에 보내지 않는 항목: 9(표준화 요약 — 표준화 원문을 techCtx로 따로 보냄)
const AI_SKIP_KEYS = new Set(["9"]);

function flatten(item: any): string {
  let t = String(item?.text || "");
  for (const tb of item?.tables || []) {
    for (const row of tb.rows || []) t += "\n" + row.map((c: any) => String(c.t).replace(/\n/g, " ")).join(" | ");
  }
  return t;
}

// 절차 문서 → AI 전달용 항목 목록(항목 번호 순).
export function closureDocToCtx(doc: any): ClosureCtxItem[] {
  if (!doc?.items) return [];
  return Object.entries<any>(doc.items)
    .filter(([k]) => !AI_SKIP_KEYS.has(k))
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([k, item]) => ({ ref: k, title: String(item.title || k), content: flatten(item) }));
}

