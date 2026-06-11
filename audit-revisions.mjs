// 개정 데이터 전수 감사 스크립트
// 실행:  DATABASE_URL="postgres://..." node audit-revisions.mjs
//   (또는 .env 에 DATABASE_URL 있으면)  node -r dotenv/config audit-revisions.mjs
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) { console.error("❌ DATABASE_URL 환경변수가 필요합니다."); process.exit(1); }
const pool = new pg.Pool({ connectionString: url, ssl: url.includes("neon.tech") || url.includes("railway") ? { rejectUnauthorized: false } : false });

const stripHeader = (s) => (s || "").replace(/^\s*\[[^\]]*\]\s*/, "").trim();
const isPeriodOnly = (s) => s.includes("~") && s
  .replace(/\d{4}\s*[년.\-]\s*\d{1,2}\s*[월.\-]\s*\d{1,2}\s*일?/g, "")
  .replace(/이후|이전|건축허가분|부터|적용|종전|신설|현행/g, "")
  .replace(/[~\-()\s.,]/g, "").length === 0;

function analyze(rows, descOf, dateOf, label) {
  console.log(`\n══════ ${label}: 총 ${rows.length}행 ══════`);
  const c = { bracketHeader: 0, tildeInDesc: 0, tildeAfterStrip: 0, nonIso: 0, emptyDesc: 0, koreanDateLeft: 0 };
  const unhandled = [];
  for (const r of rows) {
    const d = descOf(r) || "";
    const dt = dateOf(r);
    const after = stripHeader(d);
    if (/^\s*\[[^\]]*\]/.test(d)) c.bracketHeader++;
    if (d.includes("~")) c.tildeInDesc++;
    if (after.includes("~") && !isPeriodOnly(after)) { c.tildeAfterStrip++; if (unhandled.length < 15) unhandled.push({ id: r.item_id, d: d.slice(0, 130) }); }
    if (dt && !/^\d{4}-\d{2}-\d{2}$/.test(String(dt))) c.nonIso++;
    if (!d.trim()) c.emptyDesc++;
    if (/\d{4}\s*년/.test(after)) c.koreanDateLeft++;
  }
  console.log(`  [...] 머리말 있는 행: ${c.bracketHeader}  (→ 화면에서 자동 제거됨)`);
  console.log(`  본문에 ~ 포함: ${c.tildeInDesc}`);
  console.log(`  ⚠️ 머리말 제거·순수범위 제외 후에도 ~ 남는 행: ${c.tildeAfterStrip}  (→ 추가 처리 필요)`);
  console.log(`  비-ISO 시행일: ${c.nonIso}`);
  console.log(`  빈 본문: ${c.emptyDesc}`);
  console.log(`  본문(머리말 제외)에 한글날짜 잔존: ${c.koreanDateLeft}  (정상 규정문일 수도 있음)`);
  if (unhandled.length) {
    console.log(`  --- 미처리 ~ 샘플 ---`);
    unhandled.forEach(s => console.log(`   ${s.id} | ${s.d}`));
  }
}

try {
  const rev = await pool.query("SELECT item_id, effective_date, expiry_date, description, introduction_type FROM inspection_item_revisions");
  analyze(rev.rows, r => r.description, r => r.effective_date, "inspection_item_revisions");

  // 수정분(edits)의 standard_dates(JSON 배열의 text/memo)도 점검
  const ed = await pool.query("SELECT item_id, standard_dates FROM inspection_item_edits WHERE standard_dates IS NOT NULL");
  const edRows = [];
  for (const r of ed.rows) {
    try {
      const arr = JSON.parse(r.standard_dates);
      for (const x of (Array.isArray(arr) ? arr : [])) edRows.push({ item_id: r.item_id, description: x.text || x.memo || "", effective_date: x.date });
    } catch {}
  }
  analyze(edRows, r => r.description, r => r.effective_date, "inspection_item_edits.standard_dates (펼침)");
} catch (e) {
  console.error("쿼리 오류:", e.message);
} finally {
  await pool.end();
}
