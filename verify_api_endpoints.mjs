// judgment.tsx가 실제 호출하는 정확한 엔드포인트로 검증
const RAILWAY = "https://elevator-assistant-production.up.railway.app";

const ENDPOINTS = [
  "/api/inspection-edits",
  "/api/inspection-base-items",
];

const NEW_PREFIXES = ["1.5", "1.6", "1.7", "1.8", "1.9", "1.10", "1.13", "1.14", "1.15"];

function isNewItem(id) {
  if (!id) return false;
  return NEW_PREFIXES.some((p) => id === p || id.startsWith(p + ".") || id.startsWith(p + "-"));
}

async function checkEndpoint(ep) {
  console.log(`\n━━━ ${ep} ━━━`);
  try {
    const r = await fetch(`${RAILWAY}${ep}`, {
      headers: { Accept: "application/json" },
    });
    const ct = r.headers.get("content-type") || "";
    console.log(`  상태: ${r.status} | Content-Type: ${ct}`);

    if (!ct.includes("json")) {
      const t = await r.text();
      console.log(`  ❌ JSON이 아님 (SPA fallback?). 앞부분: ${t.slice(0, 80)}`);
      console.log(`  → 이 경로가 서버 라우터에 등록 안 됐을 수 있음`);
      return;
    }

    const data = await r.json();
    const arr = Array.isArray(data) ? data : data.items || data.data || [];
    console.log(`  전체 항목 수: ${arr.length}개`);

    // ID 필드명 자동 탐지
    const sample = arr[0] || {};
    const idField = ["item_id", "itemId", "id"].find((k) => k in sample) || "item_id";
    console.log(`  ID 필드명: "${idField}"`);

    // 신규 항목 필터
    const newOnes = arr.filter((x) => isNewItem(x[idField]));
    console.log(`  신규 항목(1.5~1.15) 수: ${newOnes.length}개`);

    if (newOnes.length > 0) {
      console.log(`  ✅ API가 신규 항목 반환 중!`);
      newOnes.slice(0, 5).forEach((x) => {
        const id = x[idField];
        const txt = x.text || x.standard_note || "";
        console.log(`     - ${id}: ${String(txt).slice(0, 30)}...`);
      });
      if (newOnes.length > 5) console.log(`     ... (${newOnes.length - 5}개 더)`);
    } else {
      console.log(`  ❌ API에 신규 항목 없음`);
      console.log(`  → 서버 재배포 필요하거나, 서버가 다른 DB를 봄`);
      // 샘플로 어떤 ID들이 있는지
      const ids = arr.slice(0, 8).map((x) => x[idField]).join(", ");
      console.log(`  현재 반환 중인 ID 샘플: ${ids}`);
    }
  } catch (e) {
    console.log(`  ❌ 요청 실패: ${e.message}`);
  }
}

async function main() {
  console.log("🔍 judgment.tsx 실제 사용 API 검증");
  console.log(`서버: ${RAILWAY}`);

  for (const ep of ENDPOINTS) {
    await checkEndpoint(ep);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 판정");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`
  - 둘 다 ✅  → 앱만 재시작하면 끝 (캐시 무효화)
  - JSON 아님 ❌ → 서버 라우터 미등록 또는 빌드 필요
  - JSON인데 신규항목 0개 ❌ → Railway 재배포 또는 서버 DB 연결 확인
`);
}

main();
