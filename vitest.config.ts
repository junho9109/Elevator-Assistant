import { defineConfig } from "vitest/config";

// 서버 통합 테스트 전용 설정. 프론트(client/) 쪽 컴포넌트 테스트는 다루지 않는다 —
// 지금 목표는 "관리자 write API가 승강기 종류(standardEquipmentType)를 반드시 요구하고,
// 한 종류의 데이터가 다른 종류를 덮어쓰지 않는다"는, 2026-09-29 사고로 드러난 회귀를
// 코드 변경마다 자동으로 잡아내는 것이다.
export default defineConfig({
  test: {
    environment: "node",
    include: ["server/__tests__/**/*.test.ts"],
    testTimeout: 30000,
    // DB 접속이 필요한 통합 테스트라 테스트끼리 서로 다른 커넥션을 만들면 느려지고
    // 풀 고갈 위험도 있어 순차 실행한다.
    fileParallelism: false,
  },
});
