import { neon } from "@neondatabase/serverless";
const sql = neon("postgresql://neondb_owner:npg_6LChdHbAT2Bj@ep-solitary-wave-a1hxj0nt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

// 1. 영향 항목 수 먼저 확인
const preview = await sql`
  SELECT COUNT(*) as cnt FROM inspection_base_items
  WHERE standard_dates LIKE '%"text":%'`;
console.log(`"text" 키를 가진 항목 수: ${preview[0].cnt}개`);

// 2. REPLACE로 "text": → "memo": 일괄 변환
const result = await sql`
  UPDATE inspection_base_items
  SET standard_dates = REPLACE(standard_dates, '"text":', '"memo":')
  WHERE standard_dates LIKE '%"text":%'
  RETURNING item_id, section_title`;

console.log(`\n✅ ${result.length}개 항목 수정 완료:`);
result.forEach(r => console.log(`  ${r.item_id} | ${(r.section_title||'').substring(0,40)}`));

// 3. 검증
const check = await sql`
  SELECT item_id, standard_dates FROM inspection_base_items
  WHERE item_id IN ('5.9','7.1.1','8.1.1','10.3.1')`;
console.log("\n=== 수정 결과 검증 ===");
check.forEach(r => console.log(`[${r.item_id}] ${r.standard_dates?.substring(0,120)}`));
