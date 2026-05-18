/**
 * recalculate_permit_dates.mjs
 *
 * 모든 inspection_item_edits 항목의 permit_effective_date 를
 * 인용 조문들의 effective_date 중 가장 늦은 날짜로 재계산.
 *
 * 사용법:
 *   node recalculate_permit_dates.mjs            → dry-run (변경 항목 표시)
 *   node recalculate_permit_dates.mjs --apply    → 실제 UPDATE
 */
import pg from "pg";
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const idx = JSON.parse(fs.readFileSync("./standard_index.json", "utf-8"));

const { Pool } = pg;
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_6LChdHbAT2Bj@ep-solitary-wave-a1hxj0nt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

// ─── 인용 조문 추출 (빌더와 동일) ───
function extractArticles(text) {
  if (!text) return [];
  const arts = [];
  const re = /「엘리베이터\s*안전기준」\s*([\d.]+(?:\s*[,및·]\s*[\d.]+)*)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    m[1].split(/\s*[,및·]\s*/).forEach((s) => {
      s = s.trim().replace(/\.$/, "");
      if (/^\d+(\.\d+)*$/.test(s)) arts.push(s);
    });
  }
  for (const am of text.matchAll(/부속서\s*([ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]+)/g)) {
    arts.push("부속서 " + am[1]);
  }
  return [...new Set(arts)];
}

function artCmp(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  }
  return 0;
}

function matchArticleKeys(artNo) {
  if (artNo.startsWith("부속서")) return idx[artNo] ? [artNo] : [];
  return Object.keys(idx)
    .filter((k) => k === artNo || k.startsWith(artNo + "."))
    .sort(artCmp);
}

// ─── permit_effective_date 계산 ───
// 인용 조문들의 effective_date 중 가장 늦은 날짜
// 인용 없거나 매칭 실패면 fallback 2019-03-28
function computePermitDate(text) {
  const arts = extractArticles(text);
  if (arts.length === 0) {
    return { date: "2019-03-28", reason: "인용 없음 (기본값)", details: [] };
  }
  const details = [];
  let maxDate = "1900-01-01";
  let sourceArt = null;
  for (const a of arts) {
    const keys = matchArticleKeys(a);
    if (keys.length === 0) {
      details.push({ art: a, effective_date: null, note: "매칭실패" });
      continue;
    }
    for (const k of keys) {
      const ed = idx[k].effective_date || "2019-03-28";
      details.push({ art: a, key: k, effective_date: ed });
      if (ed > maxDate) {
        maxDate = ed;
        sourceArt = `${a} (${k})`;
      }
    }
  }
  if (maxDate === "1900-01-01") {
    return { date: "2019-03-28", reason: "매칭 실패 (기본값)", details };
  }
  return { date: maxDate, reason: `from ${sourceArt}`, details };
}

// ─── 메인 ───
async function main() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT item_id, text, permit_effective_date, effective_date
       FROM inspection_item_edits
       WHERE text IS NOT NULL
       ORDER BY item_id`
    );

    console.log(`\n${"═".repeat(72)}`);
    console.log(`🎯 대상 항목: ${rows.length}개`);
    console.log(`   모드: ${APPLY ? "🔴 APPLY (실제 UPDATE)" : "🟢 DRY-RUN (미리보기)"}`);
    console.log("═".repeat(72));

    const changes = [];
    const unchanged = [];
    const summary = { same: 0, changed: 0, fromOldToNew: {} };

    for (const row of rows) {
      const result = computePermitDate(row.text);
      const old = row.permit_effective_date || "(없음)";
      const isChange = old !== result.date;

      if (isChange) {
        changes.push({ row, result, old });
        summary.changed++;
        const key = `${old} → ${result.date}`;
        summary.fromOldToNew[key] = (summary.fromOldToNew[key] || 0) + 1;
      } else {
        unchanged.push({ row, result });
        summary.same++;
      }
    }

    // 변경되는 항목들 자세히
    if (changes.length) {
      console.log(`\n🔄 변경되는 항목 (${changes.length}개)`);
      console.log("─".repeat(80));
      for (const { row, result, old } of changes) {
        console.log(`\n▶ ${row.item_id}`);
        console.log(`  text: ${row.text.slice(0, 70)}`);
        console.log(`  ${old}  →  ${result.date}  (${result.reason})`);
        if (result.details.length <= 8) {
          for (const d of result.details) {
            if (d.effective_date)
              console.log(`    └ ${d.art} → ${d.key}: ${d.effective_date}`);
            else console.log(`    └ ${d.art}: ${d.note}`);
          }
        }
      }
    }

    console.log(`\n${"═".repeat(72)}`);
    console.log(`📊 요약`);
    console.log(`  전체: ${rows.length}개`);
    console.log(`  유지: ${summary.same}개`);
    console.log(`  변경: ${summary.changed}개`);
    if (Object.keys(summary.fromOldToNew).length) {
      console.log(`\n  변경 패턴:`);
      for (const [k, v] of Object.entries(summary.fromOldToNew)) {
        console.log(`    ${k}: ${v}개`);
      }
    }
    console.log("═".repeat(72));

    if (APPLY && changes.length) {
      console.log("\n🔴 UPDATE 실행 중...");
      await client.query("BEGIN");
      let cnt = 0;
      for (const { row, result } of changes) {
        await client.query(
          `UPDATE inspection_item_edits
           SET permit_effective_date = $1,
               effective_date = $1,
               updated_at = NOW()
           WHERE item_id = $2`,
          [result.date, row.item_id]
        );
        cnt++;
      }
      await client.query("COMMIT");
      console.log(`✅ ${cnt}개 항목 UPDATE 완료`);
    } else if (!APPLY && changes.length) {
      console.log("\n🟢 DRY-RUN 완료. 실제 적용: node recalculate_permit_dates.mjs --apply");
    } else if (changes.length === 0) {
      console.log("\n✅ 변경할 항목 없음. DB가 이미 정확합니다.");
    }
  } catch (e) {
    if (APPLY) await client.query("ROLLBACK").catch(() => {});
    console.error("❌ 오류:", e.message);
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
