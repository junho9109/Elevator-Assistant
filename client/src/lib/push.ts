import { isDuplicateName } from "@/lib/teams";

// 푸시 토큰은 앱을 켤 때(로그인 전)에 발급되므로, 그 시점에는 누구의 기기인지 모른다.
// 토큰을 보관해 두었다가 로그인이 확정될 때 이름과 함께 다시 서버에 등록한다.
// (이전에는 로그인 전 값만 보내서 사용자 지정 알림이 대상 기기를 못 찾는 경우가 있었다.)
export function savePushToken(token: string) {
  try { localStorage.setItem("pushToken", token); } catch {}
}

export async function registerPushToken() {
  try {
    const token = localStorage.getItem("pushToken");
    if (!token) return;
    const saved = JSON.parse(localStorage.getItem("loginInfo") || "{}");
    const rawName = (saved.name || "").trim();
    const empId = (saved.empId || "").trim();
    // 화면에서 쓰는 이름 표기와 같게 맞춘다(동명이인 명단만 "이름(사번)")
    const employeeId = rawName ? (isDuplicateName(rawName) && empId ? `${rawName}(${empId})` : rawName) : undefined;
    await fetch("/api/push/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, platform: "android", employeeId }),
    });
  } catch {}
}
