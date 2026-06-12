// 검사가이드 DB 데이터 전체 내보내기 → db-export.json
// 실행:  export DATABASE_URL="postgres://..."   (한 줄 따로, 채팅 노출 방지)
//        node db-export.mjs
import pg from "pg";
import fs from "fs";

const url = process.env.DATABASE_URL;
if (!url) { console.error("❌ DATABASE_URL 환경변수가 필요합니다. (export DATABASE_URL=...)"); process.exit(1); }
const pool = new pg.Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

const tables = [
  "inspection_item_revisions",
  "inspection_item_edits",
  "inspection_base_items",
  "custom_inspection_items",
];

const out = {};
try {
  for (const t of tables) {
    try {
      const { rows } = await pool.query(`SELECT * FROM ${t}`);
      out[t] = rows;
      console.log(`  ${t}: ${rows.length}행`);
    } catch (e) {
      out[t] = [];
      console.log(`  ${t}: 건너뜀 (${e.message})`);
    }
  }
  fs.writeFileSync("db-export.json", JSON.stringify(out, null, 2));
  const size = (fs.statSync("db-export.json").size / 1024).toFixed(0);
  console.log(`\n✅ db-export.json 저장 완료 (${size} KB)`);
  console.log("→ 이제: git add db-export.json && git commit -m \"chore: DB 데이터 내보내기\" && git push origin main");
} catch (e) {
  console.error("오류:", e.message);
} finally {
  await pool.end();
}
