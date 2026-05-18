import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_6LChdHbAT2Bj@ep-solitary-wave-a1hxj0nt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

const EFFECTIVE = "2019-03-28";
const STD_DATES = JSON.stringify([
  { date: "2013-09-15", memo: "[구기준 2013.9.15~2019.3.28] 현행과 동일 요건 적용" },
]);
const EQUIPMENT_TYPES = JSON.stringify([
  "엘리베이터-전기식(MR)",
  "엘리베이터-전기식(MRL)",
  "엘리베이터-유압식",
]);

const SECTIONS = [
  { item_id: "1.5",     section_id: "1.5",     parent_section_id: null,    section_title: "매다는 장치, 보상수단, 제동 및 권상", sort_order: 500 },
  { item_id: "1.5.1",   section_id: "1.5.1",   parent_section_id: "1.5",   section_title: "매다는 장치", sort_order: 510 },
  { item_id: "1.5.1.1", section_id: "1.5.1.1", parent_section_id: "1.5.1", section_title: "로프", sort_order: 511 },
  { item_id: "1.5.1.2", section_id: "1.5.1.2", parent_section_id: "1.5.1", section_title: "로프 단말처리", sort_order: 512 },
  { item_id: "1.5.2",   section_id: "1.5.2",   parent_section_id: "1.5",   section_title: "로프/체인 이완감지장치", sort_order: 520 },
  { item_id: "1.5.3",   section_id: "1.5.3",   parent_section_id: "1.5",   section_title: "보상수단 및 추가적인 보호조치", sort_order: 530 },
  { item_id: "1.5.4",   section_id: "1.5.4",   parent_section_id: "1.5",   section_title: "권상/제동", sort_order: 540 },
  { item_id: "1.6",     section_id: "1.6",     parent_section_id: null,    section_title: "안전회로", sort_order: 600 },
  { item_id: "1.6.1",   section_id: "1.6.1",   parent_section_id: "1.6",   section_title: "안전접점 및 회로", sort_order: 610 },
  { item_id: "1.7",     section_id: "1.7",     parent_section_id: null,    section_title: "카 및 균형추의 추락방지안전장치와 과속에 대한 보호", sort_order: 700 },
  { item_id: "1.7.1",   section_id: "1.7.1",   parent_section_id: "1.7",   section_title: "카 추락방지안전장치", sort_order: 710 },
  { item_id: "1.7.2",   section_id: "1.7.2",   parent_section_id: "1.7",   section_title: "카측 과속조절기", sort_order: 720 },
  { item_id: "1.7.7",   section_id: "1.7.7",   parent_section_id: "1.7",   section_title: "카의 상승과속방지장치", sort_order: 770 },
  { item_id: "1.7.8",   section_id: "1.7.8",   parent_section_id: "1.7",   section_title: "카의 문열림출발방지장치", sort_order: 780 },
  { item_id: "1.8",     section_id: "1.8",     parent_section_id: null,    section_title: "주행성능 측정", sort_order: 800 },
  { item_id: "1.8.1",   section_id: "1.8.1",   parent_section_id: "1.8",   section_title: "일반적인 주행시험", sort_order: 810 },
  { item_id: "1.9",     section_id: "1.9",     parent_section_id: null,    section_title: "전기적 보호", sort_order: 900 },
  { item_id: "1.9.1",   section_id: "1.9.1",   parent_section_id: "1.9",   section_title: "접지에 의한 절연저항", sort_order: 910 },
  { item_id: "1.9.2",   section_id: "1.9.2",   parent_section_id: "1.9",   section_title: "전기배선", sort_order: 920 },
  { item_id: "1.10",    section_id: "1.10",    parent_section_id: null,    section_title: "장애인용 엘리베이터 추가 요건", sort_order: 1000 },
  { item_id: "1.10.1",  section_id: "1.10.1",  parent_section_id: "1.10",  section_title: "승강장의 공간", sort_order: 1010 },
  { item_id: "1.10.2",  section_id: "1.10.2",  parent_section_id: "1.10",  section_title: "조작설비", sort_order: 1020 },
  { item_id: "1.10.3",  section_id: "1.10.3",  parent_section_id: "1.10",  section_title: "기타 설비", sort_order: 1030 },
  { item_id: "1.13",    section_id: "1.13",    parent_section_id: null,    section_title: "엘리베이터를 구성하는 승강기부품의 상태", sort_order: 1300 },
  { item_id: "1.14",    section_id: "1.14",    parent_section_id: null,    section_title: "그 밖의 표시 등", sort_order: 1400 },
  { item_id: "1.15",    section_id: "1.15",    parent_section_id: null,    section_title: "자체점검의 확인", sort_order: 1500 },
];

const mk = (id, sec, text, sort) => ({
  item_id: id, section_id: sec, text, standard_note: text, sort_order: sort,
});

const ITEMS = [
  mk("1.5.1.1-가", "1.5.1.1", "로프의 마모 및 파단이 부속서 Ⅳ에 따라 적합한지 확인한다.", 5111),
  mk("1.5.1.1-나", "1.5.1.1", "로프(벨트)의 본수가 제원에 부합하는지 확인한다.", 5112),
  mk("1.5.1.2-가", "1.5.1.2", "로프의 끝부분은「엘리베이터 안전기준」9.2.3.1 및 9.2.3.2에 따라 고정되어 있는지 확인한다.", 5121),
  mk("1.5.1.2-나", "1.5.1.2", "로프 간 장력이「엘리베이터 안전기준」9.5.1에 따라 균등한지 확인한다.", 5122),
  mk("1.5.2-가",   "1.5.2",   "로프 또는 체인 이완감지장치가「엘리베이터 안전기준」9.5.3에 따라 보호되는지 확인한다.", 5201),
  mk("1.5.3-다",   "1.5.3",   "보상 체인이 설치된 경우 견고하게 고정되고 바닥에 닿지 않는지 확인한다.", 5303),
  mk("1.5.4-가",   "1.5.4",   "무부하의 정격속도로 상승운행 중 비상정지 시켜 로프와 도르래간 과도한 미끄러짐 없이 정지되는지 확인한다.", 5401),
  mk("1.5.4-나",   "1.5.4",   "권상도르래의 언더컷 잔여량이 1 mm 이상, 주 로프가닥끼리의 높이차가 2 mm 이하인지 확인한다.", 5402),
  mk("1.6.1-가",   "1.6.1",   "파이널 리미트 스위치가「엘리베이터 안전기준」16.2에 따라 작동되는지 확인한다.", 6101),
  mk("1.6.1-나",   "1.6.1",   "정지장치가「엘리베이터 안전기준」16.1.11에 따른 장소에 있고 작동상태가 적합한지 확인한다.", 6102),
  mk("1.6.1-다",   "1.6.1",   "기계적으로 직접 연결되지 않은 승강장 문짝의 경우「엘리베이터 안전기준」7.11.2에 따른 전기안전장치의 작동상태가 적합한지 확인한다.", 6103),
  mk("1.6.1-라",   "1.6.1",   "로프 또는 체인이 비정상적으로 늘어난 경우,「엘리베이터 안전기준」9.5.3에 따라 이완감지장치의 작동상태가 적합한지 확인한다.", 6104),
  mk("1.6.1-마",   "1.6.1",   "완충기 행정을 감소하기 위한 전기적 강제감속 시스템이 있는 경우「엘리베이터 안전기준」16.1.3에 따라 최상층 및 최하층에 도착하기 전에 감속되는지 확인한다.", 6105),
  mk("1.6.1-바",   "1.6.1",   "전기안전장치가「엘리베이터 안전기준」15.2에 따라 작동될 경우 카의 움직임이 방지되는지 확인한다.", 6106),
  mk("1.7.1-가",   "1.7.1",   "과속조절기 작동 시「엘리베이터 안전기준」10.2.2.1.6가)에 따라 추락방지안전장치가 작동되고, 하강방향으로 움직이는 카를 정지시키는지 확인한다.", 7101),
  mk("1.7.1-나",   "1.7.1",   "추락방지안전장치 작동 시 카의 수평도가「엘리베이터 안전기준」8.3.2.1에 따라 5 %를 초과하지 않는지 확인한다.", 7102),
  mk("1.7.1-다",   "1.7.1",   "위의 가) 검사 후, 정상 운행에 지장이 없는지 확인한다.", 7103),
  mk("1.7.1-라",   "1.7.1",   "추락방지안전장치 작동 시「엘리베이터 안전기준」10.2.1.5에 따라 전기안전장치가 작동하는지 확인한다.", 7104),
  mk("1.7.2-가",   "1.7.2",   "과속조절기의 전기안전장치 작동 시「엘리베이터 안전기준」10.2.2.1.6가)에 따라 엘리베이터가 정지하는지 확인한다.", 7201),
  mk("1.7.2-나",   "1.7.2",   "과속조절기가 조정 가능한 경우,「엘리베이터 안전기준」10.2.2.1.5에 따라 봉인되어 있는지 확인한다.", 7202),
  mk("1.7.2-다",   "1.7.2",   "로프의 마모 및 파단이「엘리베이터 안전기준」부속서 Ⅳ에 따라 적합한지 확인한다.", 7203),
  mk("1.7.7-가",   "1.7.7",   "카의 상승과속방지장치가「엘리베이터 안전기준」10.6.5에 따라 작동 시 전기안전장치에 의해 카가 정지되는지 확인한다.", 7701),
  mk("1.7.7-나",   "1.7.7",   "검사 후,「엘리베이터 안전기준」10.6.8에 따라 정상 운행에 지장이 없는지 확인한다.", 7702),
  mk("1.7.8-가",   "1.7.8",   "무부하 상승 시 문열림출발이 감지되면「엘리베이터 안전기준」10.7.5에 따른 보호거리 내에서 카가 정지되는지 확인한다.", 7801),
  mk("1.8.1-가",   "1.8.1",   "카가 주행하는 중간 지점에서 카의 속도와 모터의 전류를 측정하고 기록하시오.", 8101),
  mk("1.8.1-나",   "1.8.1",   "권상구동 엘리베이터의 경우,「엘리베이터 안전기준」13.2.4에 따라 주행구간의 중간에서 측정한 속도가 정격속도의 92~105 % 이내인지 확인한다.", 8102),
  mk("1.8.1-라",   "1.8.1",   "착상정확도가「엘리베이터 안전기준」16.1.1.4에 따라 모든 승강장에서 ±10 mm 이내인지 확인한다.", 8104),
  mk("1.9.1-가",   "1.9.1",   "전동기의 절연저항이「엘리베이터 안전기준」14.1.3.1에 따라 1 MΩ 이상인지 확인한다.", 9101),
  mk("1.9.1-나",   "1.9.1",   "조명장치의 절연저항이「엘리베이터 안전기준」14.1.3.1에 따라 1 MΩ 이상인지 확인한다.", 9102),
  mk("1.9.2-가",   "1.9.2",   "이동케이블을 포함한 전기배선에 늘어짐 및 손상 등이 없는지 확인한다.", 9201),
  mk("1.9.2-나",   "1.9.2",   "바이패스 장치가「엘리베이터 안전기준」16.1.8에 따라 식별 가능하고, 작동상태가 명확히 표시되는지 확인한다.", 9202),
  mk("1.10.1-가",  "1.10.1",  "「엘리베이터 안전기준」17.1.2.1에 따라 승강장 전면의 활동공간이 있는지 확인한다.", 10101),
  mk("1.10.1-나",  "1.10.1",  "승강장 바닥과 카 바닥의 틈새가「엘리베이터 안전기준」17.1.2.2에 따라 적합한지 확인한다.", 10102),
  mk("1.10.2-가",  "1.10.2",  "호출버튼, 조작반 및 통화장치 등 조작설비가「엘리베이터 안전기준」17.1.4.1에 따라 작동하는지 확인한다.", 10201),
  mk("1.10.2-나",  "1.10.2",  "시각장애인 등이 감지할 수 있도록 조작반, 통화장치 등에「엘리베이터 안전기준」17.1.4.3 및 17.1.4.4에 따라 점자표시가 있는지 확인한다.", 10202),
  mk("1.10.3-가",  "1.10.3",  "카 내 수평손잡이가「엘리베이터 안전기준」17.1.5.1에 따라 견고하게 고정되어 있는지 확인한다.", 10301),
  mk("1.10.3-나",  "1.10.3",  "거울이 설치된 경우,「엘리베이터 안전기준」17.1.5.2에 따라 견고하게 고정되어 있는지 확인한다.", 10302),
  mk("1.10.3-다",  "1.10.3",  "승강장 점멸등 및 음성신호장치, 카 내 표시장치가「엘리베이터 안전기준」17.1.5.3에 따라 동작하는지 확인한다.", 10303),
  mk("1.10.3-라",  "1.10.3",  "호출버튼 또는 등록버튼에 의하여 카가 승강장문에 도착하면「엘리베이터 안전기준」17.1.5.5에 따라 10초 이상 열린 상태로 대기하는지 확인한다.", 10304),
  mk("1.10.3-마",  "1.10.3",  "승강장의 점형블럭이「엘리베이터 안전기준」17.1.5.6에 따라 부착되어 있는지 확인한다.", 10305),
  mk("1.10.3-바",  "1.10.3",  "카 내부의 층수 버튼을 누르면 점멸등 표시 및 음성안내가「엘리베이터 안전기준」17.1.5.7에 따라 동작되는지 확인한다.", 10306),
  mk("1.10.3-사",  "1.10.3",  "카 내 조명이「엘리베이터 안전기준」17.1.5.8에 따라 적합한지 확인한다.", 10307),
  mk("1.13-가",    "1.13",    "엘리베이터를 구성하는 모든 승강기부품은 심한 마모 또는 부식이 없는지 확인하고, 그 승강기부품의 설치 상태 및 작동상태가 양호한지 확인한다.", 13001),
  mk("1.14-가",    "1.14",    "1.1~1.13에서 규정한 표시 등을 제외한 모든 라벨, 주의사항, 표시, 작동 지침 및 승강기번호 표지가 훼손되지 않고 견고하게 부착되어 있는지 확인한다.", 14001),
  mk("1.15-가",    "1.15",    "엘리베이터에 대한 자체점검이 실시되고 있는지 확인한다.", 15001),
];

// ─── 기존 섹션 헤더 패턴 학습 (자동) ──────────────
async function studyExistingPattern(client) {
  const r = await client.query(`
    SELECT item_id, section_title, text, permit_effective_date,
           standard_dates::text AS std,
           equipment_types::text AS eq
    FROM inspection_base_items
    WHERE item_id IN ('1.2', '1.3', '1.4', '1.4.1', '1.4.2')
    ORDER BY item_id
  `);
  console.log("\n📚 기존 섹션 헤더 패턴 (학습용):");
  r.rows.forEach(row => {
    console.log(`  ${row.item_id} | title="${row.section_title}" | text="${row.text?.slice(0, 30) ?? "(null)"}" | permit=${row.permit_effective_date ?? "(null)"} | eq=${row.eq ?? "(null)"}`);
  });
  return r.rows;
}

async function upsertBaseItem(client, row, isSection) {
  // 🔴 핵심 수정: 섹션 헤더의 경우 text에 section_title 복사
  const textValue = isSection ? row.section_title : row.text;

  await client.query(
    `INSERT INTO inspection_base_items
       (item_id, section_id, section_title, parent_section_id, text,
        sort_order, permit_effective_date, standard_dates, equipment_types)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (item_id) DO UPDATE SET
       section_id = EXCLUDED.section_id,
       section_title = EXCLUDED.section_title,
       parent_section_id = EXCLUDED.parent_section_id,
       text = EXCLUDED.text,
       sort_order = EXCLUDED.sort_order,
       permit_effective_date = EXCLUDED.permit_effective_date,
       standard_dates = EXCLUDED.standard_dates,
       equipment_types = EXCLUDED.equipment_types`,
    [
      row.item_id,
      row.section_id,
      isSection ? row.section_title : null,
      row.parent_section_id ?? null,
      textValue,
      row.sort_order,
      isSection ? null : EFFECTIVE,
      isSection ? null : STD_DATES,
      EQUIPMENT_TYPES,
    ]
  );
}

async function upsertItemEdit(client, row) {
  await client.query(
    `INSERT INTO inspection_item_edits
       (item_id, text, effective_date, expiry_date, introduction_type,
        permit_effective_date, standard_dates, standard_note, equipment_types)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (item_id) DO UPDATE SET
       text = EXCLUDED.text,
       effective_date = EXCLUDED.effective_date,
       permit_effective_date = EXCLUDED.permit_effective_date,
       standard_dates = EXCLUDED.standard_dates,
       standard_note = EXCLUDED.standard_note,
       equipment_types = EXCLUDED.equipment_types`,
    [row.item_id, row.text, EFFECTIVE, null, "current", EFFECTIVE, STD_DATES, row.standard_note, EQUIPMENT_TYPES]
  );
}

async function main() {
  const client = await pool.connect();
  console.log("📋 v3 시작 — NULL 제약 해결 + 한국어 equipment_types");
  try {
    // 1. 기존 패턴 먼저 학습 (트랜잭션 밖)
    await studyExistingPattern(client);

    await client.query("BEGIN");

    console.log("\n━━━ 섹션 헤더 INSERT (text = section_title) ━━━");
    let sCnt = 0;
    for (const sec of SECTIONS) {
      try {
        await upsertBaseItem(client, sec, true);
        sCnt++;
      } catch (e) {
        console.error(`  ❌ ${sec.item_id} 실패:`, e.message);
        throw e;
      }
    }
    console.log(`  ✓ ${sCnt}개 섹션 헤더 처리`);

    console.log("\n━━━ 검사 항목 INSERT (inspection_base_items) ━━━");
    let bCnt = 0;
    for (const item of ITEMS) {
      const row = { ...item, section_title: null, parent_section_id: item.section_id };
      try {
        await upsertBaseItem(client, row, false);
        bCnt++;
      } catch (e) {
        console.error(`  ❌ ${item.item_id} 실패:`, e.message);
        throw e;
      }
    }
    console.log(`  ✓ ${bCnt}개 base item 처리`);

    console.log("\n━━━ 검사 항목 INSERT (inspection_item_edits) ━━━");
    let eCnt = 0;
    for (const item of ITEMS) {
      try {
        await upsertItemEdit(client, item);
        eCnt++;
      } catch (e) {
        console.error(`  ❌ ${item.item_id} 실패:`, e.message);
        throw e;
      }
    }
    console.log(`  ✓ ${eCnt}개 item edit 처리`);

    await client.query("COMMIT");

    // 사후 검증
    const verify = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM inspection_item_edits
         WHERE item_id LIKE '1.5%' OR item_id LIKE '1.6%' OR item_id LIKE '1.7%'
            OR item_id LIKE '1.8%' OR item_id LIKE '1.9%' OR item_id LIKE '1.10%'
            OR item_id LIKE '1.13%' OR item_id LIKE '1.14%' OR item_id LIKE '1.15%') AS edits_count,
        (SELECT COUNT(*) FROM inspection_base_items
         WHERE item_id LIKE '1.5%' OR item_id LIKE '1.6%' OR item_id LIKE '1.7%'
            OR item_id LIKE '1.8%' OR item_id LIKE '1.9%' OR item_id LIKE '1.10%'
            OR item_id LIKE '1.13%' OR item_id LIKE '1.14%' OR item_id LIKE '1.15%') AS base_count
    `);

    console.log(`\n✅ COMMIT 완료`);
    console.log(`  🔍 검증:`);
    console.log(`    inspection_item_edits 신규 항목 = ${verify.rows[0].edits_count}개 (기대: ${ITEMS.length})`);
    console.log(`    inspection_base_items 신규 항목 = ${verify.rows[0].base_count}개 (기대: ${SECTIONS.length + ITEMS.length})`);

    if (verify.rows[0].edits_count === String(ITEMS.length)) {
      console.log("\n  🎉 모든 데이터 정상 반영!");
    }
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("\n❌ ROLLBACK:", err.message);
    if (err.detail) console.error("  Detail:", err.detail);
    if (err.column) console.error("  Column:", err.column);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(() => process.exit(1));
