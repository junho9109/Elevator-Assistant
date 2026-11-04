// 별표22(엘리베이터)·별표24(에스컬레이터) 원본 PDF에서 잘라 붙인 표·그림·수식 이미지와, AI에게 줄 표 글자·수식 판독문.
// 데이터 파일: client/src/data/standard-attachments/byulpyo22.json, byulpyo24.json
//  - items[조문번호] = { tables, figures, eqs }  (조문 본문은 DB가 그대로 소스이고, 여기는 "첨부"만 담는다)
//  - annex[부속서 이름] = { text, pages } (엘리베이터 부속서 Ⅰ~ⅩⅣ 원문. DB에는 일부만 있고 화면에는 숨겨져 있었다)
import b22 from "../data/standard-attachments/byulpyo22.json";
import b24 from "../data/standard-attachments/byulpyo24.json";
import a22 from "../data/standard-attachments/annex22.json";
import a24 from "../data/standard-attachments/annex24.json";

export type AttTable = { caption: string; src: string[]; text: string; page: number; primary: boolean };
export type AttFigure = { caption: string; src: string[]; page: number; primary: boolean };
export type AttEq = { src: string; text?: string | null; page: number };
export type ItemAttachments = { tables: AttTable[]; figures: AttFigure[]; eqs: AttEq[] };
type AttachDoc = { items: Record<string, ItemAttachments> };
// 부속서 항목 — 조문 단위로 나눈 원문 + 표(병합 셀 포함) + 그림·수식 이미지
export type AnnexCell = { t: string; rs?: number; cs?: number };
export type AnnexEntry = {
  title: string; text: string; page: number;
  tables: { caption?: string | null; rows: AnnexCell[][]; page?: number }[];
  figures: { caption: string; src: string; eq?: boolean }[];
};
type AnnexDoc = { order: string[]; items: Record<string, AnnexEntry> };
const ANNEX: Record<string, AnnexDoc> = {
  엘리베이터: a22 as unknown as AnnexDoc,
  에스컬레이터: a24 as unknown as AnnexDoc,
};

const DOCS: Record<string, AttachDoc> = {
  엘리베이터: b22 as unknown as AttachDoc,
  에스컬레이터: b24 as unknown as AttachDoc,
};

// 원본 PDF 링크 — 별표 PDF와 고시(제2022-18호) PDF
export const ORIGINAL_FILES: Record<string, { label: string; href: string }[]> = {
  엘리베이터: [
    { label: "[별표 22] 엘리베이터 안전기준 KC 2050-51:2022 (PDF)", href: "/standards/byulpyo22/byulpyo22.pdf" },
    { label: "행정안전부고시 제2022-18호 승강기안전부품 안전기준 및 승강기 안전기준 (PDF)", href: "/standards/byulpyo22/notice-2022-18.pdf" },
  ],
  에스컬레이터: [
    { label: "[별표 24] 에스컬레이터 안전기준 KC 2050-53:2022 (PDF)", href: "/standards/byulpyo24/byulpyo24.pdf" },
    { label: "행정안전부고시 제2022-18호 승강기안전부품 안전기준 및 승강기 안전기준 (PDF)", href: "/standards/byulpyo24/notice-2022-18.pdf" },
  ],
};

const EMPTY: ItemAttachments = { tables: [], figures: [], eqs: [] };

export function getAttachments(equipmentType: string, itemId: string): ItemAttachments {
  return DOCS[equipmentType]?.items?.[itemId] || EMPTY;
}

export function hasAttachments(equipmentType: string, itemId: string): boolean {
  const a = getAttachments(equipmentType, itemId);
  return a.tables.length + a.figures.length + a.eqs.length > 0;
}

// 부속서 원문(원본 PDF 기준, 조문 단위) — DB의 부속서 항목을 대신해 화면·AI에 쓴다
export function annexOverlay(equipmentType: string): Record<string, AnnexEntry> {
  return ANNEX[equipmentType]?.items || {};
}

// 부속서 항목 하나의 AI용 글자: 본문 + 표(행 단위 " | ") + 그림 제목
export function annexText(e: AnnexEntry, annexId?: string, equipmentType?: string): string {
  const parts = [e.text];
  for (const t of e.tables) {
    const rows = t.rows.map(r => r.map(c => (c.t || "").replace(/\n/g, " ")).join(" | ")).join("\n");
    parts.push(`[${t.caption || "표"}]\n${rows}`);
  }
  const caps = e.figures.filter(f => !f.eq).map(f => f.caption);
  if (caps.length) parts.push(`(그림: ${[...new Set(caps)].join(", ")})`);
  if (annexId && equipmentType) parts.push(...annexFigureTagLines(equipmentType, annexId));
  return parts.join("\n");
}

// ── 답변에 그림을 직접 띄우기 ──────────────────────────────────────────────
// AI에게 "[[그림:키]] (그림) 제목" 줄을 컨텍스트로 주면, AI가 필요할 때 그 표시를 답변에 그대로 쓰고 화면이 실제 이미지로 바꿔 그린다.
// 키: s22|s24 / 조문번호 / f{n}(그림)·t{n}(표 이미지)   ·   a22|a24 / 부속서 번호 / f{n}   ·   g / 고시id / 조문키 / {n}(종전 고시 그림)
export type StaticFig = { caption: string; srcs: string[] };
const DOC_CODE: Record<string, string> = { 엘리베이터: "22", 에스컬레이터: "24" };

export function figureTagLines(equipmentType: string, itemId: string, max = 4): string[] {
  const code = DOC_CODE[equipmentType]; const a = getAttachments(equipmentType, itemId);
  if (!code) return [];
  const out: string[] = [];
  a.figures.forEach((f, i) => out.push(`[[그림:s${code}/${itemId}/f${i}]] (그림) ${f.caption}`));
  a.tables.forEach((t, i) => { if (t.src?.length) out.push(`[[그림:s${code}/${itemId}/t${i}]] (표 이미지) ${t.caption}`); });
  return out.slice(0, max);
}
export function annexFigureTagLines(equipmentType: string, annexId: string, max = 4): string[] {
  const code = DOC_CODE[equipmentType]; const e = ANNEX[equipmentType]?.items?.[annexId];
  if (!code || !e) return [];
  const out: string[] = [];
  e.figures.forEach((f, i) => { if (!f.eq) out.push(`[[그림:a${code}/${annexId}/f${i}]] (그림) ${f.caption}`); });
  return out.slice(0, max);
}
/** 정적 그림 키 → 이미지(별표22·24 조문·부속서). 종전 고시 그림(g/…)은 figureRef.ts에서 따로 읽는다. */
export function resolveStaticFigure(key: string): StaticFig | null {
  const m = key.match(/^([sa])(22|24)\/(.+)\/([ft])(\d+)$/);
  if (!m) return null;
  const eq = m[2] === "22" ? "엘리베이터" : "에스컬레이터"; const n = Number(m[5]);
  if (m[1] === "s") {
    const a = getAttachments(eq, m[3]);
    if (m[4] === "f") { const f = a.figures[n]; return f ? { caption: f.caption, srcs: f.src } : null; }
    const t = a.tables[n]; return t ? { caption: t.caption, srcs: t.src } : null;
  }
  const f = ANNEX[eq]?.items?.[m[3]]?.figures?.[n];
  return m[4] === "f" && f ? { caption: f.caption, srcs: [f.src] } : null;
}

// AI에게 줄 첨부 설명: 표는 원문 글자 그대로, 그림은 제목만, 수식은 원문 이미지에서 판독한 글자.
export function attachmentContext(equipmentType: string, itemId: string, maxChars = 2800): string {
  const a = getAttachments(equipmentType, itemId);
  if (a.tables.length + a.figures.length + a.eqs.length === 0) return "";
  const parts: string[] = [];
  for (const t of a.tables) {
    parts.push(`[원문 ${t.caption}]\n${t.text}`.trim());
  }
  for (const f of a.figures) parts.push(`[원문 ${f.caption}] (그림은 검사기준 화면에서 이미지로 볼 수 있음)`);
  const eqs = a.eqs.filter(e => e.text).map(e => e.text as string);
  if (eqs.length > 0) parts.push(`[원문 수식·기호 포함 문장(원본 쪽 이미지에서 판독)]\n${eqs.join("\n")}`);
  const joined = parts.join("\n\n");
  const body = joined.length > maxChars ? joined.slice(0, maxChars) + "…" : joined;
  // 그림 표시 줄은 본문이 잘려도 남도록 따로 붙인다
  const tags = figureTagLines(equipmentType, itemId);
  return tags.length ? body + "\n" + tags.join("\n") : body;
}
