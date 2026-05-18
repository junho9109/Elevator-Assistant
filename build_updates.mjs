/**
 * build_updates.mjs
 * 우리가 잘못 INSERT한 항목들의 standard_note / standard_dates 를
 * 연혁집 PDF 인덱스(standard_index.json) 기반으로 재생성한다.
 *
 * 사용법:
 *   node build_updates.mjs            → dry-run (미리보기만, DB 변경 없음)
 *   node build_updates.mjs --apply    → 실제 UPDATE 실행
 */
import pg from "pg";
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const CLEAR_EMPTY = process.argv.includes("--clear-empty");
const idx = JSON.parse(fs.readFileSync("./standard_index.json", "utf-8"));

const { Pool } = pg;
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_6LChdHbAT2Bj@ep-solitary-wave-a1hxj0nt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

// ───────────────────────── 유틸 ─────────────────────────

// PDF 본문 → 문장단위 줄바꿈 + 들여쓰기 제거 (사용자 정답 포맷에 맞춤)
function reflow(text) {
  if (!text) return "";
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length);
  const out = [];
  const newBlock =
    /^(가|나|다|라|마|바|사|아|자|차|카|타|파|하)\)|^[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮]|^\d+\)|^비고\b|^다만\b|^\[(전기식|유압식|로프식|유압|권상|포지티브 구동|포지티브)\]|^\d+(\.\d+)+\s/;
  for (const line of lines) {
    if (out.length === 0) {
      out.push(line);
      continue;
    }
    const prev = out[out.length - 1];
    // 이전 줄이 문장 종결로 끝나는가
    const prevEnds = /[.\:)]$|다$|음$|함$|것$/.test(prev);
    if (newBlock.test(line) || prevEnds) {
      out.push(line);
    } else {
      out[out.length - 1] = prev + " " + line;
    }
  }
  return out.join("\n");
}

// 조문번호 비교 (정렬용)
function artCmp(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x !== y) return x - y;
  }
  return 0;
}

// 항목 text에서 인용 조문번호 추출
function extractArticles(text) {
  const arts = [];
  // 「엘리베이터 안전기준」 뒤의 번호들 (및 / , / · 로 연결)
  const re = /「엘리베이터\s*안전기준」\s*([\d.]+(?:\s*[,및·]\s*[\d.]+)*)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    m[1].split(/\s*[,및·]\s*/).forEach((s) => {
      s = s.trim().replace(/\.$/, "");
      if (/^\d+(\.\d+)*$/.test(s)) arts.push(s);
    });
  }
  // 부속서
  for (const am of text.matchAll(/부속서\s*([ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]+)/g)) {
    arts.push("부속서 " + am[1]);
  }
  return [...new Set(arts)];
}

// 인용 조문번호 → 인덱스에서 매칭되는 조문 키들 (자기 + 하위)
function matchArticleKeys(artNo) {
  if (artNo.startsWith("부속서")) {
    return idx[artNo] ? [artNo] : [];
  }
  const keys = Object.keys(idx).filter(
    (k) => k === artNo || k.startsWith(artNo + ".")
  );
  return keys.sort(artCmp);
}

// standard_note 생성: 매칭된 모든 조문의 현행 본문을 빈 줄로 결합
function buildStandardNote(citedList) {
  const blocks = [];
  for (const cited of citedList) {
    for (const key of cited.matchedKeys) {
      const data = idx[key];
      if (data && data.current) {
        blocks.push(reflow(data.current));
      }
    }
  }
  return blocks.join("\n\n");
}

// standard_dates 생성: 개정이력 + label
function buildStandardDates(citedList) {
  const perCited = [];
  let totalRev = 0;
  for (const cited of citedList) {
    const revs = [];
    for (const key of cited.matchedKeys) {
      const data = idx[key];
      if (!data) continue;
      for (const r of data.revisions) {
        revs.push({ date: r.date, memo: reflow(r.text) });
      }
    }
    // 날짜 최신순
    revs.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    perCited.push({ artNo: cited.artNo, revs });
    totalRev += revs.length;
  }
  // 단일 인용조문 + 개정 1개 이하 → label 생략 (사용자 1.2.1.4-라 패턴)
  const useLabel = !(citedList.length === 1 && totalRev <= 1);
  const result = [];
  for (const pc of perCited) {
    pc.revs.forEach((r, i) => {
      const e = { date: r.date, memo: r.memo };
      if (useLabel) e.label = `개정 ${i + 1} (${pc.artNo})`;
      result.push(e);
    });
  }
  return result;
}

// ───────────────────────── 메인 ─────────────────────────

async function main() {
  const client = await pool.connect();
  try {
    // 우리가 잘못 INSERT한 항목 식별 (v2 - 플레이스홀더 패턴 확장):
    //  - standard_note 가 text 와 동일 (v3 INSERT 버그)
    //  - 또는 standard_dates 에 PDF에 없는 가짜 텍스트 포함
    const { rows } = await client.query(
      `SELECT item_id, text, standard_note, standard_dates
       FROM inspection_item_edits
       WHERE (
         standard_note = text
         OR standard_dates LIKE '%[구기준%'
         OR standard_dates LIKE '%구 별표19%'
         OR standard_dates LIKE '%구 별표20%'
         OR standard_dates LIKE '%현행 별표22와 동일 요건%'
         OR standard_dates LIKE '%구 기준 번호로 적용%'
         OR standard_dates LIKE '%별표22와 동일 요건%'
       )
       ORDER BY item_id`
    );

    console.log(`\n${"═".repeat(72)}`);
    console.log(`🎯 대상 항목: ${rows.length}개`);
    console.log(`   모드: ${APPLY ? "🔴 APPLY (실제 UPDATE)" : "🟢 DRY-RUN (미리보기)"}`);
    console.log("═".repeat(72));

    const updates = [];
    const unmatched = [];

    for (const row of rows) {
      const arts = extractArticles(row.text);
      const citedList = arts.map((a) => ({
        artNo: a,
        matchedKeys: matchArticleKeys(a),
      }));

      const missing = citedList.filter((c) => c.matchedKeys.length === 0);
      const note = buildStandardNote(citedList);
      const dates = buildStandardDates(citedList);

      console.log(`\n▶ ${row.item_id}`);
      console.log(`  text: ${row.text.slice(0, 78)}`);
      console.log(`  인용조문: [${arts.join(", ")}]`);
      console.log(
        `  매칭: ${citedList
          .map((c) => `${c.artNo}→${c.matchedKeys.length}개`)
          .join(", ")}`
      );
      if (missing.length) {
        console.log(`  ⚠️  매칭실패: [${missing.map((m) => m.artNo).join(", ")}]`);
        unmatched.push({ item_id: row.item_id, missing: missing.map((m) => m.artNo) });
      }
      console.log(`  → standard_note: ${note.length}자, standard_dates: ${dates.length}개 개정`);
      if (dates.length) {
        console.log(
          `     개정일자: [${dates.map((d) => d.date + (d.label ? ` ${d.label}` : "")).join(" | ")}]`
        );
      }

      if (note) {
        updates.push({
          item_id: row.item_id,
          standard_note: note,
          standard_dates: JSON.stringify(dates),
          kind: "matched",
        });
        // 본문 과다 경고
        if (note.length > 3000 || dates.length > 10) {
          console.log(`  ⚠️ 본문 과다: ${note.length}자, 개정 ${dates.length}개 → 검토 권장`);
        }
      } else if (CLEAR_EMPTY) {
        // 인용없음 또는 전체 매칭실패 → 클리어
        updates.push({
          item_id: row.item_id,
          standard_note: "",
          standard_dates: "[]",
          kind: arts.length === 0 ? "no-citation" : "match-failed",
        });
      }
    }

    console.log(`\n${"═".repeat(72)}`);
    console.log(`📊 요약`);
    console.log(`  처리 대상: ${rows.length}개`);
    const byKind = updates.reduce((m, u) => ((m[u.kind] = (m[u.kind] || 0) + 1), m), {});
    console.log(`  UPDATE 준비됨: ${updates.length}개`);
    console.log(`    - 매칭 성공: ${byKind.matched || 0}개`);
    if (CLEAR_EMPTY) {
      console.log(`    - 인용 없음 (클리어): ${byKind["no-citation"] || 0}개`);
      console.log(`    - 매칭 실패 (클리어): ${byKind["match-failed"] || 0}개`);
    } else {
      console.log(`  스킵: ${rows.length - updates.length}개 (인용 없음 또는 매칭 실패; --clear-empty 로 클리어 가능)`);
    }
    console.log(`  매칭 실패 포함 항목: ${unmatched.length}개 → 수동 검토 필요`);
    if (unmatched.length) {
      unmatched.forEach((u) =>
        console.log(`    - ${u.item_id}: [${u.missing.join(", ")}]`)
      );
    }
    console.log("═".repeat(72));

    if (APPLY) {
      console.log("\n🔴 UPDATE 실행 중...");
      await client.query("BEGIN");
      let cnt = 0;
      for (const u of updates) {
        await client.query(
          `UPDATE inspection_item_edits
           SET standard_note = $1, standard_dates = $2,
               permit_effective_date = '2019-03-28',
               effective_date = '2019-03-28',
               updated_at = NOW()
           WHERE item_id = $3`,
          [u.standard_note, u.standard_dates, u.item_id]
        );
        cnt++;
      }
      await client.query("COMMIT");
      console.log(`✅ ${cnt}개 항목 UPDATE 완료`);
    } else {
      console.log("\n🟢 DRY-RUN 완료. 실제 적용하려면: node build_updates.mjs --apply");
      // 미리보기 샘플 1개 전체 출력
      if (updates.length) {
        const s = updates.find((u) => u.item_id.includes("1.5.1.1")) || updates[0];
        console.log(`\n── 미리보기 샘플: ${s.item_id} ──`);
        console.log("[standard_note]");
        console.log(s.standard_note);
        console.log("\n[standard_dates]");
        const sd = JSON.parse(s.standard_dates);
        sd.forEach((d) => {
          console.log(`  {date: ${d.date}${d.label ? `, label: "${d.label}"` : ""}}`);
          console.log(`   memo: ${d.memo.slice(0, 100)}...`);
        });
      }
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
