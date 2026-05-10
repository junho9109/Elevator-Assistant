/**
 * DB 항목 전체 진단 - text 길이, standard_dates, permit_effective_date 상태 확인
 */
import { neon } from "@neondatabase/serverless";
const sql = neon("postgresql://neondb_owner:npg_6LChdHbAT2Bj@ep-solitary-wave-a1hxj0nt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

const rows = await sql`
  SELECT 
    item_id,
    section_title,
    LENGTH(text) AS text_len,
    TRIM(COALESCE(text,'')) AS text_trim_preview,
    permit_effective_date,
    standard_dates,
    sort_order
  FROM inspection_base_items
  ORDER BY sort_order
`;

console.log(`\n전체 항목 수: ${rows.length}\n`);
console.log("item_id".padEnd(18) + "text길이".padEnd(8) + "permit_date".padEnd(14) + "std_dates".padEnd(10) + "section_title");
console.log("─".repeat(100));

for (const r of rows) {
  const tlen = r.text_len ?? 0;
  const pdate = r.permit_effective_date ?? "없음";
  const sdates = r.standard_dates ? (r.standard_dates.length > 5 ? "있음" : "빈배열") : "없음";
  // 비어있거나 짧은 항목 강조
  const flag = (tlen < 10 || pdate === "없음" || sdates === "없음" || sdates === "빈배열") ? " ← ⚠️" : "";
  console.log(
    String(r.item_id).padEnd(18) +
    String(tlen).padEnd(8) +
    String(pdate).padEnd(14) +
    sdates.padEnd(10) +
    (r.section_title || "").substring(0,40) + flag
  );
}

// 요약
const needsFill = rows.filter(r => 
  (r.text_len ?? 0) < 10 || 
  !r.permit_effective_date || 
  !r.standard_dates || 
  r.standard_dates === '[]' ||
  r.standard_dates === 'null'
);
console.log(`\n⚠️  채우기가 필요한 항목: ${needsFill.length}개`);
needsFill.forEach(r => console.log(`  → ${r.item_id} | text:${r.text_len??0}자 | date:${r.permit_effective_date??'없음'} | ${(r.section_title||'').substring(0,50)}`));
