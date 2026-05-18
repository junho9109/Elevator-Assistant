import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_6LChdHbAT2Bj@ep-solitary-wave-a1hxj0nt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

// 사용자가 "좋은 예시"로 언급한 항목들의 검색 키워드
const KEYWORDS = [
  "주 개폐기 차단",          // 14.5.5
  "신속하게 접근",            // 14.5.2
  "기계류 공간의 접근",       // 6.2.4, 6.2.5
  "접근통로",                 // 6.2.1, 6.2.3
  "고장처리 및 승객구출",     // 6.6.2.3 (Image 2)
  "비상운전 및 작동시험을 위한 패널", // Image 2 인근
];

async function main() {
  const client = await pool.connect();
  try {
    for (const kw of KEYWORDS) {
      console.log(`\n${"━".repeat(70)}`);
      console.log(`🔍 키워드: "${kw}"`);
      console.log("━".repeat(70));

      const { rows } = await client.query(
        `SELECT item_id, text, standard_note, standard_dates,
                permit_effective_date, effective_date, expiry_date,
                introduction_type, custom_warning, equipment_types
         FROM inspection_item_edits
         WHERE text LIKE $1 OR standard_note LIKE $1
         LIMIT 3`,
        [`%${kw}%`]
      );

      if (rows.length === 0) {
        console.log("  (검색 결과 없음)");
        continue;
      }

      for (const r of rows) {
        console.log(`\n  ▶ item_id: ${r.item_id}`);
        console.log(`    text:`);
        console.log(`      ${r.text}`);
        console.log(`    standard_note:`);
        console.log(`      ${r.standard_note ?? "(null)"}`);
        console.log(`    permit_effective_date: ${r.permit_effective_date}`);
        console.log(`    effective_date: ${r.effective_date}`);
        console.log(`    expiry_date: ${r.expiry_date ?? "(null)"}`);
        console.log(`    introduction_type: ${r.introduction_type ?? "(null)"}`);
        console.log(`    custom_warning: ${r.custom_warning ?? "(null)"}`);
        console.log(`    standard_dates:`);
        const sd = r.standard_dates;
        if (Array.isArray(sd) && sd.length > 0) {
          sd.forEach((entry, i) => {
            console.log(`      [${i}] date: ${entry.date}`);
            console.log(`          memo: ${entry.memo}`);
          });
        } else {
          console.log(`      ${JSON.stringify(sd)}`);
        }
      }
    }

    // 추가: inspection_item_revisions에서 좋은 예시의 개정이력도 조회
    console.log(`\n\n${"═".repeat(70)}`);
    console.log("📚 inspection_item_revisions — 좋은 예시 항목의 개정이력");
    console.log("═".repeat(70));

    const goodIds = await client.query(
      `SELECT DISTINCT item_id FROM inspection_item_edits
       WHERE text LIKE '%주 개폐기%' OR text LIKE '%기계류 공간의 접근%'
          OR text LIKE '%접근통로%' OR text LIKE '%고장처리 및 승객구출%'`
    );
    for (const { item_id } of goodIds.rows) {
      const revs = await client.query(
        `SELECT * FROM inspection_item_revisions WHERE item_id = $1
         ORDER BY revision_date DESC`,
        [item_id]
      );
      console.log(`\n  ▶ ${item_id} — 개정이력 ${revs.rows.length}개`);
      revs.rows.forEach((rev, i) => {
        console.log(`    개정${i + 1}: revision_date=${rev.revision_date} | effective=${rev.effective_date} | expiry=${rev.expiry_date ?? "(null)"} | type=${rev.introduction_type ?? "(null)"}`);
        console.log(`            description: ${(rev.description ?? "").slice(0, 120)}`);
      });
    }

    // 컬럼 전체 스키마 확인
    console.log(`\n\n${"═".repeat(70)}`);
    console.log("🗂️  테이블 스키마");
    console.log("═".repeat(70));
    for (const tbl of ["inspection_item_edits", "inspection_item_revisions"]) {
      const cols = await client.query(
        `SELECT column_name, data_type, is_nullable
         FROM information_schema.columns
         WHERE table_name = $1 ORDER BY ordinal_position`,
        [tbl]
      );
      console.log(`\n  ${tbl}:`);
      cols.rows.forEach((c) =>
        console.log(`    ${c.column_name} (${c.data_type}, nullable=${c.is_nullable})`)
      );
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("오류:", e.message);
  process.exit(1);
});
