/**
 * standard_index.json → inspection_base_items 일괄 저장
 * 서버 시작 시 자동 실행 (기존 데이터 보호 포함)
 */
import { readFileSync } from "fs";
import { join } from "path";
import { storage } from "./storage";

function cleanText(curr: string): string {
  if (!curr) return "";
  const lines = curr.split("\n");
  const cleaned = lines.filter(
    (line) => !/^[0-9부속서].*[·]{3,}.*[0-9]+\s*$/.test(line.trim())
  );
  return cleaned.join("\n").trim();
}

function getParentId(itemId: string): string | null {
  if (itemId.startsWith("부속서")) return null;
  const parts = itemId.split(".");
  if (parts.length <= 1) return null;
  return parts.slice(0, -1).join(".");
}

function getSectionTitle(itemId: string, curr: string): string {
  if (!curr) return itemId;
  const firstLine = curr.split("\n")[0].trim();
  const m = firstLine.match(/^([\S\s]+?)\s*[·]{3,}/);
  if (m) return m[1].trim().slice(0, 200);
  return firstLine.slice(0, 200);
}

export async function seedStandardIndex(): Promise<void> {
  try {
    // 이미 데이터가 있는지 확인
    const existing = await storage.getInspectionBaseItems();
    const existingCount = existing.length;

    // standard_index.json 로드
    const indexPath = join(process.cwd(), "standard_index.json");
    const raw = readFileSync(indexPath, "utf-8");
    const data: Record<string, any> = JSON.parse(raw);
    const entries = Object.entries(data);

    console.log(`[SEED] standard_index: ${entries.length}개 항목, DB 현재: ${existingCount}개`);

    if (existingCount >= entries.length * 0.9) {
      console.log(`[SEED] 이미 충분한 데이터 존재 (${existingCount}개) — SEED 스킵`);
      return;
    }
    console.log(`[SEED] inspection_base_items 저장 시작...`);

    const items = entries.map(([itemId, v], i) => {
      const curr = v.current || "";
      const text = cleanText(curr);
      const parentSectionId = getParentId(itemId);
      const sectionTitle = getSectionTitle(itemId, curr);
      const permitEffectiveDate = v.effective_date || null;
      const sectionId = itemId.startsWith("부속서")
        ? "부속서"
        : itemId.split(".")[0];

      const revisions: any[] = v.revisions || [];
      const standardDates = revisions.map((r: any) => ({
        date: r.date || "",
        text: r.text || "",
        label: r.raw_label || "",
        is_old: r.is_old || false,
      }));

      return {
        itemId,
        sectionId,
        sectionTitle,
        parentSectionId,
        text,
        sortOrder: i,
        permitEffectiveDate,
        standardDates: JSON.stringify(standardDates),
      };
    });

    const { inserted, updated } = await storage.bulkUpsertInspectionBaseItems(items);
    console.log(`[SEED] 완료: 삽입 ${inserted}개, 업데이트 ${updated}개`);

    // inspection_item_edits의 standardDatesWithMemo를 초기화
    // (inspection_base_items.standard_dates로 이전 완료된 항목)
    await storage.clearStandardDatesFromEdits();
    console.log(`[SEED] inspection_item_edits.standardDatesWithMemo 초기화 완료`);
  } catch (err) {
    console.error("[SEED] standard_index 저장 오류:", err);
    // seed 실패해도 서버는 계속 실행
  }
}
