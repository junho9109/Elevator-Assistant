/**
 * permit_effective_date 2013-09-15 → 2019-03-28 일괄 수정
 * + standard_dates 앞에 2013-09-15 개정이력 추가
 * + inspection_item_revisions에 2013-09-15 행 삽입
 *
 * 보존 대상: '2015-05-13', '2017-01-28', '2019-03-28', '2022-03-02'
 */
import { neon } from "@neondatabase/serverless";
const sql = neon("postgresql://neondb_owner:npg_6LChdHbAT2Bj@ep-solitary-wave-a1hxj0nt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

const NOTE_2013 = "[2013년 9월 15일 ~ 2019년 3월 28일 이전 건축허가분 종전기준 (구 별표19)]\n현행 별표22와 동일 요건이 구 기준 번호로 적용됨. 검사 시 구 별표19 해당 조항 참조.";

// ──────────────────────────────────────────
// STEP 1: 영향 범위 미리 확인
// ──────────────────────────────────────────
const editItems = await sql`
  SELECT item_id, standard_dates FROM inspection_item_edits
  WHERE permit_effective_date = '2013-09-15'
  ORDER BY item_id`;

const baseItems = await sql`
  SELECT item_id, standard_dates FROM inspection_base_items
  WHERE permit_effective_date = '2013-09-15'
  ORDER BY sort_order`;

console.log(`\n📋 처리 대상`);
console.log(`  inspection_item_edits: ${editItems.length}개`);
console.log(`  inspection_base_items: ${baseItems.length}개`);
console.log(`  합계: ${editItems.length + baseItems.length}개\n`);

// ──────────────────────────────────────────
// STEP 2: inspection_item_edits 수정
// ──────────────────────────────────────────
console.log("━".repeat(60));
console.log("STEP 2: inspection_item_edits 수정");
console.log("━".repeat(60));

let editOk = 0, editSkip = 0;
for (const row of editItems) {
  let dates = [];
  try { dates = JSON.parse(row.standard_dates || "[]"); } catch {}

  // 이미 2013-09-15 있으면 날짜만 변경
  const has2013 = dates.some(d => d.date === "2013-09-15");
  if (!has2013) {
    dates.unshift({ date: "2013-09-15", memo: NOTE_2013 });
  }

  await sql`
    UPDATE inspection_item_edits
    SET permit_effective_date = '2019-03-28',
        standard_dates        = ${JSON.stringify(dates)}
    WHERE item_id = ${row.item_id}`;

  console.log(`  ✅ ${row.item_id} (2013 entry ${has2013 ? "이미있음" : "추가"})`);
  editOk++;
}
console.log(`  → ${editOk}개 완료\n`);

// ──────────────────────────────────────────
// STEP 3: inspection_base_items 수정
// ──────────────────────────────────────────
console.log("━".repeat(60));
console.log("STEP 3: inspection_base_items 수정");
console.log("━".repeat(60));

let baseOk = 0;
for (const row of baseItems) {
  let dates = [];
  try { dates = JSON.parse(row.standard_dates || "[]"); } catch {}

  const has2013 = dates.some(d => d.date === "2013-09-15");
  if (!has2013) {
    dates.unshift({ date: "2013-09-15", memo: NOTE_2013 });
  }

  await sql`
    UPDATE inspection_base_items
    SET permit_effective_date = '2019-03-28',
        standard_dates        = ${JSON.stringify(dates)}
    WHERE item_id = ${row.item_id}`;
  baseOk++;
}
console.log(`  → ${baseOk}개 완료\n`);

// ──────────────────────────────────────────
// STEP 4: inspection_item_revisions 에 2013-09-15 행 추가
// ──────────────────────────────────────────
console.log("━".repeat(60));
console.log("STEP 4: inspection_item_revisions 2013-09-15 행 삽입");
console.log("━".repeat(60));

const allItemIds = [
  ...editItems.map(r => r.item_id),
  ...baseItems.map(r => r.item_id)
];

let revOk = 0, revSkip = 0;
for (const itemId of allItemIds) {
  // 이미 있는지 확인
  const existing = await sql`
    SELECT id FROM inspection_item_revisions
    WHERE item_id = ${itemId} AND revision_date = '2013-09-15'
    LIMIT 1`;

  if (existing.length > 0) { revSkip++; continue; }

  await sql`
    INSERT INTO inspection_item_revisions
      (item_id, revision_date, description, effective_date, expiry_date, introduction_type)
    VALUES (
      ${itemId}, '2013-09-15', ${NOTE_2013},
      '2013-09-15', '2019-03-28', 'revision'
    )`;
  revOk++;
}
console.log(`  → 삽입: ${revOk}개 | SKIP(이미있음): ${revSkip}개\n`);

// ──────────────────────────────────────────
// STEP 5: 검증
// ──────────────────────────────────────────
console.log("━".repeat(60));
console.log("STEP 5: 검증");
console.log("━".repeat(60));

const remaining = await sql`
  SELECT COUNT(*) as c FROM inspection_item_edits
  WHERE permit_effective_date = '2013-09-15'`;
const remainingBase = await sql`
  SELECT COUNT(*) as c FROM inspection_base_items
  WHERE permit_effective_date = '2013-09-15'`;

console.log(`  inspection_item_edits 잔여 2013 항목: ${remaining[0].c}개 (0이어야 정상)`);
console.log(`  inspection_base_items 잔여 2013 항목: ${remainingBase[0].c}개 (0이어야 정상)`);

// 분포 확인
const dist = await sql`
  SELECT permit_effective_date, COUNT(*) as c
  FROM inspection_item_edits
  GROUP BY permit_effective_date ORDER BY permit_effective_date`;
console.log("\n  inspection_item_edits permit 날짜 분포:");
dist.forEach(r => console.log(`    ${r.permit_effective_date || "(null)"}: ${r.c}개`));

console.log("\n🎉 완료!");
