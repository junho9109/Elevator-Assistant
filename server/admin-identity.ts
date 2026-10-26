// 관리자(노준호) 식별 — 로그인이 사번 기반으로 바뀌면서 클라이언트가 보내는 employeeId는
// 사번(20160730)이다. 예전 값(910919)도 호환을 위해 함께 허용한다.
// 사번을 추가/변경해야 하면 환경변수 ADMIN_EMP_IDS(쉼표 구분)로 덮어쓸 수 있다.
export const ADMIN_NAME = "노준호";
export const ADMIN_EMP_IDS: string[] = (process.env.ADMIN_EMP_IDS || "20160730,910919")
  .split(",").map(s => s.trim()).filter(Boolean);

export function isAdminIdentity(employeeId?: string, employeeName?: string): boolean {
  return !!employeeId && ADMIN_EMP_IDS.includes(employeeId) && employeeName === ADMIN_NAME;
}
