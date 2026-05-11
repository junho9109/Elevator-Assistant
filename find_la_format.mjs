import { neon } from "@neondatabase/serverless";
const sql = neon("postgresql://neondb_owner:npg_6LChdHbAT2Bj@ep-solitary-wave-a1hxj0nt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

// 1. "라)" 항목 찾기 - 개구부 또는 6.6.3.3 포함
const la = await sql`
  SELECT item_id, section_title, permit_effective_date,
         standard_dates, LENGTH(text) as tlen
  FROM inspection_base_items
  WHERE section_title LIKE '%개구부%' 
     OR section_title LIKE '%6.6.3%'
     OR section_title LIKE '%라)%'
     OR section_title LIKE '%다)%'
     OR section_title LIKE '%가)%'`;
console.log("=== 가나다라 관련 항목 ===");
la.forEach(r => {
  console.log(`\n[${r.item_id}] text:${r.tlen}자`);
  console.log(`  section_title: ${r.section_title}`);
  console.log(`  permit: ${r.permit_effective_date}`);
  console.log(`  standard_dates: ${r.standard_dates}`);
});

// 2. standard_dates에 "text" 키가 있는 항목 (객체 형식)
const obj = await sql`
  SELECT item_id, section_title, standard_dates
  FROM inspection_base_items
  WHERE standard_dates LIKE '%"text"%'
     OR standard_dates LIKE '%"content"%'
     OR standard_dates LIKE '%"label"%'
  LIMIT 10`;
console.log("\n=== standard_dates에 텍스트 키가 있는 항목 ===");
obj.forEach(r => {
  console.log(`[${r.item_id}] ${r.section_title}`);
  console.log(`  → ${r.standard_dates?.substring(0,200)}`);
});

// 3. inspectionEdits 테이블에 관련 데이터 있는지
try {
  const edits = await sql`
    SELECT "itemId", "inspectionText", "editedAt"
    FROM inspection_edits
    WHERE "inspectionText" LIKE '%개구부%'
       OR "inspectionText" LIKE '%6.6.3%'
    LIMIT 5`;
  console.log("\n=== inspectionEdits 관련 항목 ===");
  edits.forEach(r => console.log(`[${r.itemId}] ${r.inspectionText?.substring(0,80)}`));
} catch(e) {
  console.log("\ninspection_edits 테이블:", e.message);
}
