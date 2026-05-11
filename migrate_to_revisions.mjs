/**
 * inspection_base_items.standard_dates → inspection_item_revisions 테이블 이전
 * 
 * 스키마: inspection_item_revisions
 *   item_id (varchar 50)
 *   revision_date (varchar 20)  ← standard_dates[i].date
 *   description (text)          ← standard_dates[i].memo
 *   effective_date (varchar 20) ← 해당 개정일 (=revision_date)
 *   expiry_date (varchar 20)    ← 다음 개정일 또는 permit_effective_date
 *   introduction_type (varchar) ← "revision"
 */
import { neon } from "@neondatabase/serverless";
const sql = neon("postgresql://neondb_owner:npg_6LChdHbAT2Bj@ep-solitary-wave-a1hxj0nt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

// 1. 기존 inspection_item_revisions에서 이미 있는 item_id 확인
const existing = await sql`SELECT DISTINCT item_id FROM inspection_item_revisions`;
const existingIds = new Set(existing.map(r => r.item_id));
console.log(`이미 revisions 있는 항목: ${existingIds.size}개`);

// 2. inspection_base_items에서 standard_dates가 있는 항목 읽기
const baseItems = await sql`
  SELECT item_id, permit_effective_date, standard_dates
  FROM inspection_base_items
  WHERE standard_dates IS NOT NULL 
    AND standard_dates != '[]'
    AND standard_dates LIKE '%"date"%'
  ORDER BY sort_order`;

console.log(`\n처리 대상 항목: ${baseItems.length}개`);

let ok = 0, skip = 0, fail = 0;

for (const item of baseItems) {
  // 이미 revisions 있으면 SKIP
  if (existingIds.has(item.item_id)) {
    skip++;
    continue;
  }

  let revisions;
  try {
    revisions = JSON.parse(item.standard_dates);
    if (!Array.isArray(revisions) || revisions.length === 0) { skip++; continue; }
  } catch { skip++; continue; }

  // 날짜 정렬 (오래된→최신)
  const sorted = revisions
    .filter(r => r.date)
    .sort((a, b) => a.date.localeCompare(b.date));

  for (let i = 0; i < sorted.length; i++) {
    const rev = sorted[i];
    const nextDate = sorted[i + 1]?.date || item.permit_effective_date || null;

    try {
      await sql`
        INSERT INTO inspection_item_revisions
          (item_id, revision_date, description, effective_date, expiry_date, introduction_type)
        VALUES (
          ${item.item_id},
          ${rev.date},
          ${rev.memo || ""},
          ${rev.date},
          ${nextDate},
          ${"revision"}
        )`;
      ok++;
    } catch (e) {
      console.log(`  ❌ ${item.item_id} (${rev.date}): ${e.message}`);
      fail++;
    }
  }

  if (ok % 20 === 0 && ok > 0) process.stdout.write(`  ✅ ${ok}개 완료...\r`);
}

console.log(`\n✅ 삽입: ${ok}개 | ⏭ SKIP: ${skip}개 | ❌ 오류: ${fail}개`);

// 3. 결과 검증
const sample = await sql`
  SELECT r.item_id, r.revision_date, r.expiry_date, LEFT(r.description, 50) as desc
  FROM inspection_item_revisions r
  WHERE r.item_id IN ('5.9','7.1.1','8.1.1','10.3.1','5.6.1.1')
  ORDER BY r.item_id, r.revision_date`;

console.log("\n=== 삽입 결과 샘플 ===");
sample.forEach(r =>
  console.log(`[${r.item_id}] ${r.revision_date}~${r.expiry_date||'현재'} | ${r.desc}`)
);
