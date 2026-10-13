// 자료 조회 기록 — AI 질문 없이 자료만 조회하는 이용자를 관리자가 파악할 수 있도록
// 탭 이동과 주요 항목 열람을 서버(/api/activity-log)에 남긴다.
//
// 기록 실패가 화면 동작에 영향을 주면 안 되므로 응답을 기다리지 않고(fire-and-forget)
// 모든 오류를 삼킨다. 로그인 정보(localStorage loginInfo)가 없으면 아무것도 보내지 않는다.

export type ActivityPage =
  | "AI검색" | "표준화&기술자료" | "검사가이드" | "검사기준"
  | "정밀안전검사" | "메모" | "안전보건" | "채팅";

export function trackActivity(page: string, detail?: string) {
  try {
    const saved = JSON.parse(localStorage.getItem("loginInfo") || "{}");
    const employeeId = saved.empId || saved.name;
    if (!employeeId) return;
    fetch("/api/activity-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        employeeId,
        employeeName: saved.name || undefined,
        team: saved.org || undefined,
        page,
        detail: detail ? detail.slice(0, 200) : undefined,
      }),
    }).catch(() => {});
  } catch {
    // 조회 기록은 부가 기능 — 실패해도 무시
  }
}
