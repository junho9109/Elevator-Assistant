import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_6LChdHbAT2Bj@ep-solitary-wave-a1hxj0nt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

const RAILWAY = "https://elevator-assistant-production.up.railway.app";

async function diagnoseA_database(client) {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🅰️  DB 분석가: 데이터 무결성 검증");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // 1) 신규 항목 실제로 들어갔는지
  const newItems = await client.query(
    `SELECT item_id, LEFT(text, 30) AS text_snippet, permit_effective_date, equipment_types
     FROM inspection_item_edits
     WHERE item_id LIKE '1.5%' OR item_id LIKE '1.6%' OR item_id LIKE '1.7%'
        OR item_id LIKE '1.8%' OR item_id LIKE '1.9%' OR item_id LIKE '1.10%'
        OR item_id LIKE '1.13%' OR item_id LIKE '1.14%' OR item_id LIKE '1.15%'
     ORDER BY item_id`
  );
  console.log(`\n  inspection_item_edits 신규 항목: ${newItems.rows.length}개`);
  newItems.rows.slice(0, 5).forEach((r) =>
    console.log(`    - ${r.item_id} | ${r.text_snippet}... | eq=${r.equipment_types}`)
  );
  if (newItems.rows.length > 5) console.log(`    ... (${newItems.rows.length - 5}개 더)`);

  // 2) 기존 항목(1.1, 1.2)과 비교 → 컬럼 패턴 차이
  console.log("\n  기존 항목 vs 신규 항목 컬럼 비교:");
  const compareCols = await client.query(`
    SELECT
      'OLD (1.1.x)' AS group,
      COUNT(*) FILTER (WHERE text IS NOT NULL) AS has_text,
      COUNT(*) FILTER (WHERE standard_note IS NOT NULL) AS has_note,
      COUNT(*) FILTER (WHERE equipment_types IS NOT NULL) AS has_eq,
      COUNT(*) FILTER (WHERE permit_effective_date IS NOT NULL) AS has_permit,
      COUNT(*) AS total
    FROM inspection_item_edits WHERE item_id LIKE '1.1%' OR item_id LIKE '1.2%'
    UNION ALL
    SELECT
      'NEW (1.5~1.15)',
      COUNT(*) FILTER (WHERE text IS NOT NULL),
      COUNT(*) FILTER (WHERE standard_note IS NOT NULL),
      COUNT(*) FILTER (WHERE equipment_types IS NOT NULL),
      COUNT(*) FILTER (WHERE permit_effective_date IS NOT NULL),
      COUNT(*)
    FROM inspection_item_edits
    WHERE item_id LIKE '1.5%' OR item_id LIKE '1.6%' OR item_id LIKE '1.7%'
       OR item_id LIKE '1.8%' OR item_id LIKE '1.9%' OR item_id LIKE '1.10%'
       OR item_id LIKE '1.13%' OR item_id LIKE '1.14%' OR item_id LIKE '1.15%'
  `);
  console.table(compareCols.rows);

  // 3) equipment_types 분포
  console.log("\n  equipment_types 분포 (전체):");
  const eq = await client.query(`
    SELECT equipment_types::text AS types, COUNT(*) AS cnt
    FROM inspection_item_edits
    GROUP BY equipment_types::text
    ORDER BY cnt DESC
  `);
  console.table(eq.rows);
}

async function diagnoseB_backend() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🅱️  백엔드 분석가: API 응답 확인");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const endpoints = [
    "/api/inspection-items",
    "/api/items",
    "/api/inspection",
    "/api/inspection/items",
    "/api/inspection-item-edits",
    "/health",
  ];

  for (const ep of endpoints) {
    try {
      const r = await fetch(`${RAILWAY}${ep}`, { method: "GET" });
      const ct = r.headers.get("content-type") || "";
      let preview = "";
      if (ct.includes("json")) {
        const j = await r.json();
        const len = Array.isArray(j) ? j.length : Object.keys(j).length;
        preview = `JSON ${Array.isArray(j) ? "array" : "object"} (${len} entries)`;
        // 신규 항목 포함 여부
        if (Array.isArray(j)) {
          const hasNew = j.some(
            (x) =>
              x.item_id?.startsWith("1.5") ||
              x.item_id?.startsWith("1.7") ||
              x.itemId?.startsWith("1.5")
          );
          preview += hasNew ? "  ✅ 신규항목 포함" : "  ❌ 신규항목 없음";
        }
      } else {
        const t = await r.text();
        preview = `${ct} ${t.slice(0, 50)}`;
      }
      console.log(`  [${r.status}] ${ep} → ${preview}`);
    } catch (e) {
      console.log(`  [ERR] ${ep} → ${e.message}`);
    }
  }
}

async function diagnoseC_frontend() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🅲  프론트엔드 분석가: 정적 파일 의존도");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`
  → 직접 확인 필요:
  1. client/src/data/inspection-data-mr.ts 에 '1.5.1.1-가' 같은 신규 ID가 포함됐는지
     grep -n "1.5.1.1-가\\|1.5.4-가\\|1.6.1-가" client/src/data/inspection-data-mr.ts

  2. 앱 컴포넌트가 DB API를 호출하는지, 정적 import만 쓰는지
     grep -rn "inspection-data-mr\\|/api/inspection" client/src/

  3. DB 데이터를 정적 데이터에 MERGE하는 로직이 있는지
     grep -rn "mergeWithEdits\\|applyEdits\\|merge.*edits" client/src/
`);
}

async function diagnoseD_cache() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🅳  캐시/배포 분석가: 응답 헤더 확인");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  try {
    const r = await fetch(`${RAILWAY}/api/inspection-items`, { method: "HEAD" });
    console.log(`  Cache-Control: ${r.headers.get("cache-control") || "(없음)"}`);
    console.log(`  ETag: ${r.headers.get("etag") || "(없음)"}`);
    console.log(`  Last-Modified: ${r.headers.get("last-modified") || "(없음)"}`);
    console.log(`  CF-Cache-Status: ${r.headers.get("cf-cache-status") || "(없음)"}`);
  } catch (e) {
    console.log(`  헤더 확인 실패: ${e.message}`);
  }

  console.log(`
  → 직접 확인:
  1. Railway 대시보드 → 최근 deploy 시점이 INSERT 후인지
  2. 앱(Capacitor) 강제 종료 후 재실행
  3. 앱 캐시 삭제 (Android: 앱 정보 → 저장공간 → 캐시 지우기)
`);
}

async function diagnoseE_schema(client) {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🅴  스키마 분석가: equipment_types 필터 매칭");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // 기존 가~라 항목들의 equipment_types
  const existing = await client.query(`
    SELECT DISTINCT equipment_types::text
    FROM inspection_item_edits
    WHERE item_id IN ('1.2.2.1-가', '1.2.2.1-나', '1.3.1-가', '1.4.1-가')
  `);
  console.log("  기존 사용자 입력 항목의 equipment_types:");
  existing.rows.forEach((r) => console.log(`    ${r.equipment_types}`));

  // 신규 항목
  const newOnes = await client.query(`
    SELECT DISTINCT equipment_types::text
    FROM inspection_item_edits
    WHERE item_id IN ('1.5.1.1-가', '1.6.1-가', '1.7.1-가')
  `);
  console.log("  신규 INSERT 항목의 equipment_types:");
  newOnes.rows.forEach((r) => console.log(`    ${r.equipment_types}`));

  console.log(`
  → 만약 둘이 다르면, 앱의 필터링에 걸려서 안 보이는 것.
    가장 흔한 케이스: 앱은 ["traction","hydraulic","mr"] 같은 다중 매칭을 기대하는데
    우리가 ["traction"]만 넣어서 hydraulic 모드에서 누락됨.
`);
}

async function main() {
  const client = await pool.connect();
  try {
    await diagnoseA_database(client);
    await diagnoseB_backend();
    await diagnoseC_frontend();
    await diagnoseD_cache();
    await diagnoseE_schema(client);

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 결과 보고 후 다음 단계 결정");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("진단 중 오류:", e);
  process.exit(1);
});
