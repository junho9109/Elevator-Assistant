/**
 * generations/*.json (검사기준 페이지의 "연도별 개정 원문" 문서)에서
 * 조문별 개정 이력을 추출해 inspection_item_revisions DB용 bulk-seed payload로 변환한다.
 *
 * 배경:
 *   - 검사기준 페이지(inspection-standards.tsx)는 client/src/data/generations/*.json 파일을
 *     연도순으로 자동 인식해 "문서" 드롭다운에 보여준다 (예: 1997-194.json).
 *     이 파일들은 순수 참고용 원문 스캔본 텍스트일 뿐, 검사가이드 페이지와 자동 연동되지 않는다.
 *   - 검사가이드 페이지(judgment.tsx)의 "연혁" 배지는 별도 DB 테이블인
 *     inspection_item_revisions (itemId, equipmentType, effectiveDate, expiryDate,
 *     introductionType, description)를 참조한다. equipmentType 컬럼은 승강기 종류별로
 *     조문번호가 겹쳐도(예: 엘리베이터 6.1 vs 에스컬레이터 6.1) 서로 혼동되지 않도록 분리한다.
 *
 * 이 스크립트가 하는 일:
 *   1) 지정한 연도의 generations/*.json 문서(개정 전)와, 그 다음 연도 문서 또는 현재
 *      검사가이드 데이터(inspection-data-mr.ts, 개정 후)를 조문번호(itemId) 기준으로 비교한다.
 *   2) 텍스트가 달라진 조문만 골라 introductionType="old"(종전 조문) 레코드를 만든다.
 *      effectiveDate/expiryDate는 두 문서의 meta.effectiveDate를 사용한다.
 *   3) --equipmentType 인자로 지정한 값(기본값 "엘리베이터")을 모든 레코드에 부여한다.
 *   4) 결과를 /api/inspection-revisions/bulk-seed 가 받는 형식의 JSON으로 저장한다.
 *      (실제 DB 반영은 이 JSON을 curl로 bulk-seed 엔드포인트에 POST해야 한다 — 검증 없이
 *      자동 반영하지 않는다. 원문 대조 없이 자동 diff만으로 밀어넣는 건 위험하기 때문.)
 *
 * 사용 예 (에스컬레이터 원문이 client/src/data/generations/에 추가된 뒤):
 *   npx tsx scripts/generation-to-revisions.ts \
 *     --old client/src/data/generations/2012-XXX-escalator.json \
 *     --new client/src/data/generations/2022-YYY-escalator.json \
 *     --equipmentType 에스컬레이터 \
 *     --out /tmp/escalator-revisions.json
 *
 * 주의:
 *   - 이 스크립트는 "조문 텍스트가 문자열로 다르면 개정으로 간주"하는 단순 diff이다.
 *     오탈자 수정처럼 실질적 의미가 없는 변경도 걸러지므로, 반드시 --out 결과를 사람이
 *     한 번 검수한 뒤 bulk-seed에 반영할 것을 권장한다 (자동 실행 금지).
 *   - generations/*.json의 조문번호 체계와 검사가이드(inspection-data-mr.ts)의 조문번호
 *     체계가 다를 수 있다 (예: 「에스컬레이터 안전기준」 5.x/6.x/7.x 인용 번호 vs
 *     「승강기 설치검사 및 안전검사에 관한 운영규정」 3.x 체계). --idPrefix 로 필터링하거나,
 *     필요 시 --idMap으로 별도 매핑 파일을 지정해 변환한다.
 */
import * as fs from "fs";
import * as path from "path";

interface GenerationMeta {
  id: string;
  title: string;
  effectiveDate: string;
  source?: string;
  note?: string;
}
interface GenerationEntry {
  title?: string;
  text?: string;
}
interface GenerationDoc {
  meta: GenerationMeta;
  items: Record<string, GenerationEntry>;
}

interface RevisionRecord {
  itemId: string;
  equipmentType: string;
  effectiveDate: string | null;
  expiryDate: string | null;
  introductionType: "old" | "current" | "additional" | "revision";
  description: string;
}

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
      out[key] = val;
    }
  }
  return out;
}

function loadDoc(p: string): GenerationDoc {
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw) as GenerationDoc;
}

// 조문 텍스트를 공백/개행 정규화 후 비교 — 단순 서식 차이는 무시
function normalize(s: string): string {
  return (s || "").replace(/\s+/g, " ").trim();
}

function loadIdMap(p?: string): Record<string, string> {
  if (!p) return {};
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const oldPath = args.old;
  const newPath = args.new;
  const equipmentType = args.equipmentType || "엘리베이터";
  const outPath = args.out || "/tmp/generation-revisions-out.json";
  const idPrefix = args.idPrefix; // 예: "5" 이면 5.x 조문만 대상
  const idMap = loadIdMap(args.idMap); // { "원문조문번호": "검사가이드조문번호" } 선택적 매핑

  if (!oldPath || !newPath) {
    console.error("사용법: npx tsx scripts/generation-to-revisions.ts --old <이전문서.json> --new <이후문서.json> [--equipmentType 에스컬레이터] [--idPrefix 5] [--idMap map.json] [--out out.json]");
    process.exit(1);
  }

  const oldDoc = loadDoc(oldPath);
  const newDoc = loadDoc(newPath);

  const records: RevisionRecord[] = [];
  const oldKeys = Object.keys(oldDoc.items);

  for (const key of oldKeys) {
    if (idPrefix && !key.startsWith(idPrefix)) continue;
    const oldEntry = oldDoc.items[key];
    const newEntry = newDoc.items[key];
    const oldText = normalize(oldEntry.text || "");
    const newText = normalize(newEntry?.text || "");

    // 새 문서에서 사라졌거나(폐지) 텍스트가 달라졌으면(개정) 종전 조문으로 기록
    if (!newEntry || oldText !== newText) {
      const mappedId = idMap[key] || key;
      records.push({
        itemId: mappedId,
        equipmentType,
        effectiveDate: oldDoc.meta.effectiveDate || null,
        expiryDate: newDoc.meta.effectiveDate || null,
        introductionType: "old",
        description: oldEntry.text || oldEntry.title || key,
      });
    }
  }

  const payload = {
    secret: "seed-2009-67",
    revisions: records,
  };

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`총 ${records.length}건의 종전 조문 후보를 ${outPath} 에 저장했습니다.`);
  console.log(`(${oldDoc.meta.title} → ${newDoc.meta.title})`);
  console.log("반드시 사람이 검수한 뒤, 검토를 마친 JSON을 /api/inspection-revisions/bulk-seed 로 POST 하세요.");
}

main();
