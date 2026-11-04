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
export function annexText(e: AnnexEntry): string {
  const parts = [e.text];
  for (const t of e.tables) {
    const rows = t.rows.map(r => r.map(c => (c.t || "").replace(/\n/g, " ")).join(" | ")).join("\n");
    parts.push(`[${t.caption || "표"}]\n${rows}`);
  }
  const caps = e.figures.filter(f => !f.eq).map(f => f.caption);
  if (caps.length) parts.push(`(그림: ${[...new Set(caps)].join(", ")})`);
  return parts.join("\n");
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
  return joined.length > maxChars ? joined.slice(0, maxChars) + "…" : joined;
}
