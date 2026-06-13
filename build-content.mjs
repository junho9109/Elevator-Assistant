// inspection-content.json 생성 스크립트
// 실행: node build-content.mjs
// db-export.json + inspection-data-mr.ts → inspection-content.json
import fs from "fs";

const db = JSON.parse(fs.readFileSync("db-export.json", "utf8"));
const raw = fs.readFileSync("client/src/data/inspection-data-mr.ts", "utf8");

// ─── 1. INSPECTION_DATA_MR 에서 모든 항목 id·text·effectiveDate 추출 ───
const eq = raw.indexOf("=", raw.indexOf("INSPECTION_DATA_MR"));
let body = raw.slice(eq + 1).trim();
if (body.endsWith(";")) body = body.slice(0, -1);
const tree = eval("(" + body + ")");
const staticItems = {};
function walkTree(node) {
  if (node.items) node.items.forEach(it => {
    staticItems[it.id] = { text: it.text, effectiveDate: it.effectiveDate || null, introductionType: it.introductionType || null };
  });
  if (node.subsections) node.subsections.forEach(walkTree);
}
tree.forEach(walkTree);
console.log(`정적 항목(inspection-data-mr.ts): ${Object.keys(staticItems).length}개`);

// ─── 2. base_items 인덱스 ───
const baseMap = {};
for (const r of db.inspection_base_items) {
  baseMap[r.item_id] = r;
}
console.log(`base_items: ${Object.keys(baseMap).length}개`);

// ─── 3. edits 인덱스 ───
const editMap = {};
for (const r of db.inspection_item_edits) {
  editMap[r.item_id] = r;
}
console.log(`edits: ${Object.keys(editMap).length}개`);

// ─── 4. revisions 인덱스 (item_id → 배열, 최신→오래된 정렬) ───
const revMap = {};
for (const r of db.inspection_item_revisions) {
  if (!revMap[r.item_id]) revMap[r.item_id] = [];
  revMap[r.item_id].push(r);
}
for (const id of Object.keys(revMap)) {
  revMap[id].sort((a, b) => (b.effective_date || "").localeCompare(a.effective_date || ""));
}
console.log(`revisions 있는 항목: ${Object.keys(revMap).length}개`);

// ─── 5. [...] 머리말 제거 유틸 ───
const stripHeader = s => (s || "").replace(/^\s*\[[^\]]*\]\s*/, "").trim();

// ─── 6. 모든 항목 id 합집합 ───
const allIds = new Set([
  ...Object.keys(staticItems),
  ...Object.keys(baseMap).filter(id => id.includes("-") || /^\d+\.\d/.test(id)),
  ...Object.keys(editMap),
  ...Object.keys(revMap),
]);
console.log(`전체 항목 합집합: ${allIds.size}개`);

// ─── 7. 병합 ───
const content = {};
for (const id of [...allIds].sort()) {
  const stat = staticItems[id] || {};
  const base = baseMap[id] || {};
  const edit = editMap[id] || {};
  const revs = revMap[id] || [];

  // 본문: edits > static > base 우선순위
  const text = edit.text || stat.text || base.text || "";

  // 시행일: edits.permit_effective_date > edits.effective_date > base.permit_effective_date > static.effectiveDate
  const effectiveDate =
    edit.permit_effective_date ||
    edit.effective_date ||
    base.permit_effective_date ||
    stat.effectiveDate ||
    null;

  // 적용종류: edits > base
  let equipmentTypes = [];
  try { equipmentTypes = JSON.parse(edit.equipment_types || base.equipment_types || "[]"); } catch {}

  // 개정 이력: inspection_item_revisions 우선 (완전한 데이터)
  // base.standard_dates 는 날짜만 있어 보완용
  let revisions = revs.map(r => ({
    effectiveDate: r.effective_date || null,
    expiryDate: r.expiry_date || null,
    introductionType: r.introduction_type || null,
    description: stripHeader(r.description || ""),
  }));

  // revisions 없으면 base.standard_dates 날짜 목록으로 보강
  if (revisions.length === 0 && base.standard_dates) {
    try {
      const dates = JSON.parse(base.standard_dates);
      revisions = dates
        .filter(d => typeof d === "string" && d)
        .sort((a, b) => b.localeCompare(a))
        .map((d, i, arr) => ({
          effectiveDate: d,
          expiryDate: i < arr.length - 1 ? arr[i + 1] : null,
          introductionType: i === arr.length - 1 ? "new" : "revision",
          description: "",
        }));
    } catch {}
  }

  // introductionType: edits > static > 개정 없으면 null
  const introductionType = edit.introduction_type || stat.introductionType || null;

  // 경고: edit.custom_warning
  const customWarning = edit.custom_warning || null;

  content[id] = {
    text,
    effectiveDate,
    introductionType,
    equipmentTypes: equipmentTypes.length ? equipmentTypes : undefined,
    customWarning: customWarning || undefined,
    revisions: revisions.length ? revisions : undefined,
  };

  // undefined 필드 제거
  for (const k of Object.keys(content[id])) {
    if (content[id][k] === undefined) delete content[id][k];
  }
}

// ─── 8. 저장 ───
const out = JSON.stringify(content, null, 2);
fs.writeFileSync("client/src/data/inspection-content.json", out);
const size = (Buffer.byteLength(out) / 1024).toFixed(0);
console.log(`\n✅ inspection-content.json 저장 완료 (${size} KB, ${Object.keys(content).length}개 항목)`);

// ─── 9. 검증 샘플 ───
const samples = ["1.2.1.2-가", "1.2.1.4-마", "8.7.4", "1.2.1.3-나"];
console.log("\n=== 샘플 검증 ===");
for (const id of samples) {
  const c = content[id];
  if (!c) { console.log(`  ${id}: 없음`); continue; }
  console.log(`  ${id}:`);
  console.log(`    effectiveDate: ${c.effectiveDate}`);
  console.log(`    equipmentTypes: ${JSON.stringify(c.equipmentTypes)}`);
  console.log(`    revisions: ${c.revisions?.length ?? 0}개`);
  if (c.revisions?.[0]) console.log(`    최신개정: ${c.revisions[0].effectiveDate} → ${c.revisions[0].description?.slice(0,50)}`);
}
