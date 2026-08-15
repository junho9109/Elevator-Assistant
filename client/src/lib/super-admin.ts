// 로그인 이름이 "노준호"면 각 페이지의 비밀번호 관리자모드를 자동으로 해제해준다.
// 서버 role(admin/user)과는 별개로, 각 페이지가 자체적으로 갖고 있는
// isAdminMode(비밀번호 910919로 여는 로컬 관리자모드)를 초기값부터 true로 만든다.
const SUPER_ADMIN_NAME = "노준호";

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
