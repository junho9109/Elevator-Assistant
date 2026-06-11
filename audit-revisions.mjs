// 개정 데이터 전수 감사 (보강판)
// 실행:  DATABASE_URL="postgres://..." node audit-revisions.mjs
import pg from "pg";
const url = process.env.DATABASE_URL;
if (!url) { console.error("❌ DATABASE_URL 필요"); process.exit(1); }
const pool = new pg.Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

const stripHeader = (s) => (s || "").replace(/^\s*\[[^\]]*\]\s*/, "").trim();
const isPeriodOnly = (s) => s.includes("~") && s
  .replace(/\d{4}\s*[년.\-]\s*\d{1,2}\s*[월.\-]\s*\d{1,2}\s*일?/g, "")
  .replace(/이후|이전|건축허가분|부터|적용|종전|신설|현행/g, "")
  .replace(/[~\-()\s.,]/g, "").length === 0;
const dateRangeRe = /(\d{4}\s*년\s*\d{1,2}\s*월\s*\d{1,2}\s*일|\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}\s*년\s*\d{1,2}\s*월\s*\d{1,2}\s*일|\d{4}-\d{2}-\d{2})/;

try {
  const { rows } = await pool.query("SELECT item_id, effective_date, description FROM inspection_item_revisions ORDER BY item_id");
  console.log(`총 ${rows.length}행\n`);

  console.log("══════ ① 머리말 제거 후에도 '~' 남는 행 (전체 본문) ══════");
  let dateRangeCnt = 0, measureCnt = 0;
  for (const r of rows) {
    const after = stripHeader(r.description || "");
    if (after.includes("~") && !isPeriodOnly(after)) {
      const isDate = dateRangeRe.test(after);
      if (isDate) dateRangeCnt++; else measureCnt++;
      console.log(`\n[${r.item_id}]  분류: ${isDate ? "🔴 날짜범위(처리필요)" : "🟢 측정/기타(정상)"}`);
      console.log("  머리말제거후:", after.replace(/\n/g, " / ").slice(0, 260));
    }
  }
  console.log(`\n  → 날짜범위(문제): ${dateRangeCnt}개 / 측정·기타(정상): ${measureCnt}개`);

  console.log("\n══════ ② [...] 머리말이 2개 이상인 행 ══════");
  let multi = 0;
  for (const r of rows) {
    const n = ((r.description || "").match(/\[[^\]]*\]/g) || []).length;
    if (n >= 2) {
      multi++;
      if (multi <= 12) console.log(`  [${r.item_id}] 대괄호 ${n}개: ${(r.description||"").replace(/\n/g," / ").slice(0,160)}`);
    }
  }
  console.log(`  → 대괄호 2개 이상: ${multi}개`);

  console.log("\n══════ ③ 머리말 없이 본문이 날짜/기간으로 시작하는 행 ══════");
  let plain = 0;
  for (const r of rows) {
    const d = (r.description || "").trim();
    if (/^\[/.test(d)) continue;
    if (/^(\d{4}\s*년|\d{4}-\d{2}-\d{2}|\d{4}\.\d{1,2}|이후|이전|종전|신설)/.test(d)) {
      plain++;
      if (plain <= 12) console.log(`  [${r.item_id}] ${d.replace(/\n/g," / ").slice(0,140)}`);
    }
  }
  console.log(`  → 평문 기간 시작 후보: ${plain}개`);
} catch (e) {
  console.error("오류:", e.message);
} finally {
  await pool.end();
}
