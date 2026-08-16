/**
 * [비활성화됨 — app.ts에서 더 이상 호출하지 않음, 2026-08-16]
 * standard_index.json → inspection_base_items 일괄 저장 / 표준화_parsed.json → std_item_overrides 일괄 저장
 * 과거엔 서버 시작 시 자동 실행됐으나, DB(inspection_base_items/std_item_overrides)가
 * 실시간으로 관리자가 편집·삭제하는 단일 진실 소스가 된 이후로는 위험함:
 * 관리자가 데이터를 정리해서 행 수가 임계치(90%/83개) 밑으로 내려가면, 다음 서버
 * 재시작(=배포)에서 정적 JSON 스냅샷이 통째로 재시딩되어 방금 지운 옛 데이터가 되살아난다.
 * (2026-08-16 표준화 자료 정리 직후 재배포로 실제 발생한 문제.)
 * 다시 켜지 마세요 — 필요하면 아래 함수를 직접 한 번 실행하는 별도 스크립트로 쓰세요.
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

// ── 표준화 원본 356개 → std_item_overrides SEED ──────────────────────
export async function seedStdItems() {
  try {
    const { db } = await import("./db");
    const { stdItemOverrides } = await import("../shared/schema");
    const { sql } = await import("drizzle-orm");

    const existing = await db.select({ count: sql<number>`count(*)` }).from(stdItemOverrides);
    const cnt = Number(existing[0]?.count || 0);

    if (cnt >= 83) {
      console.log(`[SEED] std_item_overrides: ${cnt}개 존재 — 원본 SEED 스킵`);
      return;
    }

    // 원본 JSON import
    const STD_DATA = (await import("../client/src/data/표준화_parsed.json", { assert: { type: "json" } })).default as any[];
    let inserted = 0;

    for (const it of STD_DATA) {
      try {
        await db.execute(sql`
          INSERT INTO std_item_overrides (title, "overrideTitle", ref, basis, conclusion, source, "typeTag", category, "updatedAt")
          VALUES (${it.title}, '', ${it.ref||''}, ${it.basis||''}, ${it.conclusion||''}, ${it.source||''}, ${it.typeTag||''}, ${it.category||''}, NOW())
          ON CONFLICT (title) DO NOTHING
        `);
        inserted++;
      } catch {}
    }
    console.log(`[SEED] std_item_overrides: 원본 ${inserted}개 삽입 완료`);
  } catch (e) {
    console.error("[SEED] std_items 오류:", e);
  }
}
