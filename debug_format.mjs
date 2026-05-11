/**
 * 에이전트1(DB분석) + 에이전트2(형식비교) 진단 스크립트
 * - 작동하는 항목 vs 업데이트한 항목의 실제 저장 형식 비교
 */
import { neon } from "@neondatabase/serverless";
const sql = neon("postgresql://neondb_owner:npg_6LChdHbAT2Bj@ep-solitary-wave-a1hxj0nt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

console.log("═".repeat(70));
console.log("에이전트1: 작동하는 항목(수동입력) standard_dates 실제 형식");
console.log("═".repeat(70));

const working = await sql`
  SELECT item_id, permit_effective_date,
         standard_dates,
         pg_typeof(standard_dates) as col_type
  FROM inspection_base_items
  WHERE item_id IN ('5.2','5.2.1','7.2.3.6','9.10','14.2.2.1')
  ORDER BY item_id`;

working.forEach(r => {
  console.log(`\n[${r.item_id}] permit: ${r.permit_effective_date}`);
  console.log(`  DB 컬럼 타입: ${r.col_type}`);
  console.log(`  JS typeof: ${typeof r.standard_dates}`);
  console.log(`  isArray: ${Array.isArray(r.standard_dates)}`);
  const raw = JSON.stringify(r.standard_dates);
  console.log(`  RAW (처음 300자): ${raw?.substring(0,300)}`);
  if (Array.isArray(r.standard_dates) && r.standard_dates.length > 0) {
    console.log(`  첫 번째 요소 type: ${typeof r.standard_dates[0]}`);
    console.log(`  첫 번째 요소: ${JSON.stringify(r.standard_dates[0])}`);
  }
});

console.log("\n" + "═".repeat(70));
console.log("에이전트2: 업데이트한 항목 형식");
console.log("═".repeat(70));

const updated = await sql`
  SELECT item_id, permit_effective_date,
         standard_dates,
         pg_typeof(standard_dates) as col_type
  FROM inspection_base_items
  WHERE item_id IN ('5.9','7.1.1','8.1.1','10.3.1','12.6')
  ORDER BY item_id`;

updated.forEach(r => {
  console.log(`\n[${r.item_id}] permit: ${r.permit_effective_date}`);
  console.log(`  DB 컬럼 타입: ${r.col_type}`);
  console.log(`  JS typeof: ${typeof r.standard_dates}`);
  console.log(`  isArray: ${Array.isArray(r.standard_dates)}`);
  const raw = JSON.stringify(r.standard_dates);
  console.log(`  RAW (처음 300자): ${raw?.substring(0,300)}`);
  if (Array.isArray(r.standard_dates) && r.standard_dates.length > 0) {
    console.log(`  첫 번째 요소 type: ${typeof r.standard_dates[0]}`);
    console.log(`  첫 번째 요소: ${JSON.stringify(r.standard_dates[0])}`);
  }
});

console.log("\n" + "═".repeat(70));
console.log("에이전트3: schema.ts 컬럼 타입 확인용 - inspection_base_items 컬럼 정보");
console.log("═".repeat(70));

const cols = await sql`
  SELECT column_name, data_type, udt_name
  FROM information_schema.columns
  WHERE table_name = 'inspection_base_items'
  ORDER BY ordinal_position`;
cols.forEach(c => console.log(`  ${c.column_name.padEnd(25)} | ${c.data_type} | ${c.udt_name}`));
