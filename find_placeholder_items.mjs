/**
 * find_placeholder_items.mjs
 * PDF에 없는 가짜 플레이스홀더 텍스트가 남아있는 항목 진단.
 * v3 INSERT 시 만들어진 모든 플레이스홀더 패턴 검색.
 */
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_6LChdHbAT2Bj@ep-solitary-wave-a1hxj0nt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

// PDF엔 절대 등장하지 않는 플레이스홀더 패턴
const PLACEHOLDERS = [
  "[구기준",
  "현행 별표22와 동일 요건",
  "구 별표19",
  "구 별표20",
  "구 별표 19",
  "구 별표 20",
  "구 기준 번호로 적용",
  "구 기준 적용",
  "별표22와 동일",
  "동일 요건 적용",
  "현행과 동일 요건",
];

async function main() {
  const client = await pool.connect();
  try {
    console.log("🔍 플레이스홀더 흔적 항목 진단 중...\n");

    // 모든 inspection_item_edits 조회 후 코드에서 검사
    const { rows } = await client.query(
      `SELECT item_id, text, standard_note, standard_dates
       FROM inspection_item_edits
       WHERE standard_dates IS NOT NULL OR standard_note IS NOT NULL
       ORDER BY item_id`
    );

    const hits = [];
    for (const row of rows) {
      const sd = row.standard_dates || "";
      const sn = row.standard_note || "";
      const matched = [];
      for (const p of PLACEHOLDERS) {
        if (sd.includes(p) || sn.includes(p)) matched.push(p);
      }
      // standard_note 가 text 와 동일한 경우도 (v3 INSERT 버그)
      if (sn && row.text && sn.trim() === row.text.trim()) {
        matched.push("standard_note=text");
      }
      if (matched.length) {
        hits.push({ row, matched });
      }
    }

    console.log(`📊 전체 ${rows.length}개 검사 → 플레이스홀더 발견: ${hits.length}개\n`);

    if (hits.length === 0) {
      console.log("✅ 플레이스홀더가 남아있는 항목 없음. DB가 깨끗합니다.");
      return;
    }

    console.log("─".repeat(80));
    for (const { row, matched } of hits) {
      console.log(`\n▶ ${row.item_id}`);
      console.log(`  text: ${(row.text || "").slice(0, 75)}`);
      console.log(`  플레이스홀더 패턴: [${matched.join(", ")}]`);
      // standard_note 일부
      if (row.standard_note) {
        console.log(`  standard_note (앞 90자): ${row.standard_note.slice(0, 90)}`);
      }
      // standard_dates memo 일부
      try {
        const d = JSON.parse(row.standard_dates || "[]");
        if (Array.isArray(d) && d.length) {
          console.log(`  standard_dates 첫 entry memo: ${(d[0].memo || "").slice(0, 90)}`);
        }
      } catch {}
    }
    console.log("\n" + "─".repeat(80));

    // CSV 저장
    const csvLines = ["item_id,patterns,text_preview"];
    for (const { row, matched } of hits) {
      csvLines.push(
        [
          row.item_id,
          `"${matched.join("|")}"`,
          `"${(row.text || "").slice(0, 80).replace(/"/g, '""')}"`,
        ].join(",")
      );
    }
    const fs = await import("fs");
    fs.writeFileSync("./placeholder_items.csv", "\uFEFF" + csvLines.join("\n"), "utf-8");

    console.log(`\n✅ 발견된 ${hits.length}개 항목을 placeholder_items.csv 로 저장`);
    console.log(`\n다음: 이 항목들을 빌더로 재처리할 수 있도록 별도 스크립트를 만들어 드립니다.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("오류:", e.message);
  process.exit(1);
});
