// 로그인 이름이 "노준호"면 각 페이지의 비밀번호 관리자모드를 자동으로 해제해준다.
// 서버 role(admin/user)과는 별개로, 각 페이지가 자체적으로 갖고 있던
// isAdminMode(비밀번호 910919로 여는 로컬 관리자모드)는 이제 전역 스위치 하나로 통일되어 있다.
// 전역 스위치는 AI검색 페이지(홈) 헤더에 있으며, 여기서 켜고 끈 상태가 모든 페이지에 즉시 반영된다.
const SUPER_ADMIN_NAME = "노준호";
const GLOBAL_ADMIN_KEY = "globalAdminMode";
export const GLOBAL_ADMIN_MODE_EVENT = "global-admin-mode-changed";

export function isSuperAdminLoggedIn(): boolean {
  try {
    const raw = localStorage.getItem("loginInfo");
    if (!raw) return false;
    const info = JSON.parse(raw);
    return typeof info?.name === "string" && info.name.trim() === SUPER_ADMIN_NAME;
  } catch {
    return false;
  }
}

// 전역 관리자모드 현재값 조회. 아직 한 번도 설정된 적 없으면(localStorage에 값 없음)
// "노준호" 계정에 한해 기본값을 켜짐으로 시작한다.
export function getGlobalAdminMode(): boolean {
  try {
    const raw = localStorage.getItem(GLOBAL_ADMIN_KEY);
    if (raw !== null) return raw === "true";
    return isSuperAdminLoggedIn();
  } catch {
    return false;
  }
}

// 전역 관리자모드를 켜거나 끈다. 현재 열려 있는 모든 페이지(같은 탭 내)에
// GLOBAL_ADMIN_MODE_EVENT 커스텀 이벤트로 즉시 반영되고, localStorage에 저장되어
// 다른 페이지로 이동하거나 새로고침해도 유지된다.
export function setGlobalAdminMode(value: boolean): void {
  try {
    localStorage.setItem(GLOBAL_ADMIN_KEY, value ? "true" : "false");
  } catch {
    // localStorage 접근 불가 시에도 이벤트는 그대로 발행
  }
  window.dispatchEvent(new CustomEvent(GLOBAL_ADMIN_MODE_EVENT, { detail: value }));
}
