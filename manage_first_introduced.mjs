/**
 * manage_first_introduced.mjs
 *
 * `first_introduced_date` (검사 항목이 최초 도입된 날짜) 컬럼 관리.
 *   - 건축허가일 < first_introduced_date  →  "해당없음"
 *   - 건축허가일 >= permit_effective_date →  "적합" (현행 기준)
 *   - 그 외 → standard_dates 매칭 → "종전(개정 N)"
 *
 * 사용법:
 *   node manage_first_introduced.mjs migrate
 *       → inspection_item_edits / inspection_base_items 에 컬럼 추가
 *   node manage_first_introduced.mjs propose
 *       → 추천값 계산 + first_introduced.csv 생성 (사용자 검토용)
 *   node manage_first_introduced.mjs apply first_introduced.csv
 *       → CSV 기반 일괄 UPDATE
 */
import pg from "pg";
import fs from "fs";

const { Pool } = pg;
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_6LChdHbAT2Bj@ep-solitary-wave-a1hxj0nt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

// ────────────── 유틸 ──────────────
function recommendedFor(row) {
  // standard_dates 에서 가장 오래된 date
  try {
    const d = JSON.parse(row.standard_dates || "[]");
    if (Array.isArray(d) && d.length > 0) {
      const valid = d.filter((x) => x.date);
      if (valid.length) {
        return valid.reduce((a, b) => (a.date < b.date ? a : b)).date;
      }
    }
  } catch {}
  // 개정 없지만 현행 본문 있음 → 2019-03-28 (현행 시행일)
  if (row.standard_note && row.standard_note.length > 0) {
    return row.permit_effective_date || "2019-03-28";
  }
  return null; // 인용 없음 → 사용자 입력 필수
}

function parseCsvLine(line) {
  const cells = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuote && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQuote = !inQuote;
    } else if (c === "," && !inQuote) {
      cells.push(cur);
      cur = "";
    } else cur += c;
  }
  cells.push(cur);
  return cells;
}

function csvEscape(v) {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

// ────────────── migrate ──────────────
async function migrate() {
  const client = await pool.connect();
  try {
    console.log("🔧 마이그레이션 실행...");
    await client.query(
      `ALTER TABLE inspection_item_edits ADD COLUMN IF NOT EXISTS first_introduced_date VARCHAR`
    );
    console.log("  ✅ inspection_item_edits.first_introduced_date 추가됨");
    await client.query(
      `ALTER TABLE inspection_base_items ADD COLUMN IF NOT EXISTS first_introduced_date VARCHAR`
    );
    console.log("  ✅ inspection_base_items.first_introduced_date 추가됨");
    console.log("\n다음: node manage_first_introduced.mjs propose");
  } finally {
    client.release();
  }
}

// ────────────── propose ──────────────
async function propose() {
  const client = await pool.connect();
  try {
    // 인용 조문이 있을 만한 모든 검사 항목 (편집 테이블 기준)
    const { rows } = await client.query(
      `SELECT item_id, text, standard_note, standard_dates,
              permit_effective_date, first_introduced_date
       FROM inspection_item_edits
       WHERE text IS NOT NULL
       ORDER BY string_to_array(regexp_replace(item_id, '-.*$', ''), '.')::int[]`
    );

    const csvLines = [
      [
        "item_id",
        "추천_도입일",
        "현재_DB값",
        "수정값(여기에_입력)",
        "인용조문_수",
        "가장_오래된_개정",
        "text_미리보기",
      ]
        .map(csvEscape)
        .join(","),
    ];

    const summary = { withRevisions: 0, currentOnly: 0, blank: 0, total: rows.length };

    console.log(`\n📊 추천 first_introduced_date — ${rows.length}개 항목`);
    console.log("─".repeat(95));
    console.log(
      "  item_id".padEnd(15) +
        "추천".padEnd(13) +
        "현재".padEnd(13) +
        "개정수  ".padEnd(8) +
        "text 미리보기"
    );
    console.log("─".repeat(95));

    for (const row of rows) {
      const rec = recommendedFor(row);
      let revCount = 0;
      let oldest = "";
      try {
        const d = JSON.parse(row.standard_dates || "[]");
        revCount = Array.isArray(d) ? d.length : 0;
        if (revCount > 0) {
          const valid = d.filter((x) => x.date);
          if (valid.length) oldest = valid.reduce((a, b) => (a.date < b.date ? a : b)).date;
        }
      } catch {}

      if (revCount > 0) summary.withRevisions++;
      else if (row.standard_note) summary.currentOnly++;
      else summary.blank++;

      const recStr = rec || "(수동입력필요)";
      const curStr = row.first_introduced_date || "(미설정)";
      const preview = (row.text || "").slice(0, 45).replace(/\n/g, " ");

      console.log(
        `  ${row.item_id.padEnd(13)} ${recStr.padEnd(12)} ${curStr.padEnd(12)} ${String(revCount).padStart(4)}    ${preview}`
      );

      csvLines.push(
        [
          row.item_id,
          rec || "",
          row.first_introduced_date || "",
          "", // 사용자 수정란 — 비워두면 추천값 사용
          revCount,
          oldest,
          (row.text || "").slice(0, 80),
        ]
          .map(csvEscape)
          .join(",")
      );
    }

    console.log("─".repeat(95));
    console.log(
      `\n  요약: 개정있음 ${summary.withRevisions}개 | 현행만 ${summary.currentOnly}개 | 비어있음 ${summary.blank}개`
    );

    const csvContent = "\uFEFF" + csvLines.join("\n");
    fs.writeFileSync("./first_introduced.csv", csvContent, "utf-8");

    console.log("\n✅ CSV 저장됨: first_introduced.csv (UTF-8 with BOM, Excel 호환)");
    console.log("\n📋 다음 단계:");
    console.log("  1. first_introduced.csv 를 Excel/Numbers 로 열기");
    console.log("  2. '수정값' 컬럼에 원하는 날짜 입력 (예: 2013-09-15)");
    console.log("     - 비워두면 '추천' 값이 적용됨");
    console.log("     - 'null' 입력 시 NULL 처리 (해당없음 판정 비활성)");
    console.log("  3. 저장 후: node manage_first_introduced.mjs apply first_introduced.csv");
  } finally {
    client.release();
  }
}

// ────────────── apply ──────────────
async function apply(csvFile) {
  if (!fs.existsSync(csvFile)) {
    console.error(`❌ 파일 없음: ${csvFile}`);
    return;
  }
  const txt = fs.readFileSync(csvFile, "utf-8").replace(/^\uFEFF/, "");
  const lines = txt.trim().split(/\r?\n/);
  const header = parseCsvLine(lines[0]);
  const idx = {
    item_id: header.indexOf("item_id"),
    rec: header.indexOf("추천_도입일"),
    override: header.indexOf("수정값(여기에_입력)"),
  };
  if (idx.item_id < 0 || idx.rec < 0 || idx.override < 0) {
    console.error("❌ CSV 헤더 불일치. propose 명령으로 다시 생성하세요.");
    return;
  }

  const client = await pool.connect();
  try {
    let updated = 0,
      cleared = 0,
      skipped = 0,
      manual = 0;
    await client.query("BEGIN");
    for (let i = 1; i < lines.length; i++) {
      const cells = parseCsvLine(lines[i]);
      const item_id = cells[idx.item_id];
      if (!item_id) continue;
      const rec = cells[idx.rec].trim();
      const ov = cells[idx.override].trim();

      let value;
      if (ov === "null") {
        value = null;
        cleared++;
      } else if (ov) {
        value = ov;
        manual++;
      } else if (rec) {
        value = rec;
        updated++;
      } else {
        skipped++;
        continue;
      }
      // 날짜 형식 가벼운 검증
      if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        console.warn(`  ⚠️ ${item_id}: 잘못된 날짜 형식 "${value}" — 건너뜀`);
        skipped++;
        continue;
      }
      await client.query(
        `UPDATE inspection_item_edits SET first_introduced_date = $1, updated_at = NOW() WHERE item_id = $2`,
        [value, item_id]
      );
    }
    await client.query("COMMIT");
    console.log(`\n✅ first_introduced_date 적용 완료`);
    console.log(`   추천값 적용: ${updated}개`);
    console.log(`   사용자 수정값: ${manual}개`);
    console.log(`   NULL 설정: ${cleared}개`);
    console.log(`   건너뜀: ${skipped}개`);
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

// ────────────── 라우터 ──────────────
async function main() {
  const cmd = process.argv[2];
  if (cmd === "migrate") await migrate();
  else if (cmd === "propose") await propose();
  else if (cmd === "apply") {
    if (!process.argv[3]) {
      console.error("사용: node manage_first_introduced.mjs apply <csv파일>");
      return;
    }
    await apply(process.argv[3]);
  } else {
    console.log("사용법:");
    console.log("  node manage_first_introduced.mjs migrate");
    console.log("      → DB 컬럼 추가 (양쪽 테이블)");
    console.log("  node manage_first_introduced.mjs propose");
    console.log("      → 추천값 계산 + first_introduced.csv 생성");
    console.log("  node manage_first_introduced.mjs apply first_introduced.csv");
    console.log("      → CSV 일괄 적용 (수정값 우선, 없으면 추천값)");
  }
  await pool.end();
}

main().catch((e) => {
  console.error("오류:", e.message);
  process.exit(1);
});
