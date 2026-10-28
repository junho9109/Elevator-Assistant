// 접속 신호 + 서버 업데이트 안내.
// - 60초마다 /api/presence로 "접속 중" 신호를 보낸다(로그인한 경우만, 화면이 보일 때만).
// - 15초마다 /api/app-version을 확인한다.
//   · 연속 2회 실패하면 "서버 업데이트 중" 배너를 띄우고 5초마다 재시도, 복구되면 배너를 지운다.
//   · 복구 후 버전이 처음 본 값과 다르면 "새 버전으로 업데이트" 안내 후 자동 새로고침한다.
// 모든 오류는 삼킨다 — 부가 기능이 화면 동작에 영향을 주면 안 된다.
import { getLastActivityPage } from "@/lib/activity";

const BANNER_ID = "server-status-banner";
let initialVersion: string | null = null;
let failCount = 0;
let down = false;
let reloading = false;
let timer: number | undefined;

function showBanner(text: string, sub: string, color: string) {
  let el = document.getElementById(BANNER_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = BANNER_ID;
    el.setAttribute("style", "position:fixed;left:0;right:0;top:0;z-index:2147483647;color:#fff;padding:10px 14px;font-size:13px;line-height:1.5;box-shadow:0 2px 8px rgba(0,0,0,.3);font-family:inherit;pointer-events:none");
    document.body.appendChild(el);
  }
  el.style.background = color;
  el.innerHTML = `<b></b><br><span style="opacity:.95"></span>`;
  (el.querySelector("b") as HTMLElement).textContent = text;
  (el.querySelector("span") as HTMLElement).textContent = sub;
}
function hideBanner() {
  document.getElementById(BANNER_ID)?.remove();
}

function sendPresence() {
  try {
    if (document.visibilityState === "hidden") return;
    const saved = JSON.parse(localStorage.getItem("loginInfo") || "{}");
    const employeeId = saved.empId || saved.name;
    if (!employeeId) return;
    fetch("/api/presence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ employeeId, employeeName: saved.name || undefined, team: saved.org || undefined, page: getLastActivityPage() || undefined }),
    }).catch(() => {});
  } catch {}
}

async function checkVersion() {
  if (reloading) return;
  let ok = false;
  let version: string | null = null;
  try {
    const ctrl = new AbortController();
    const t = window.setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch("/api/app-version?_=" + Date.now(), { cache: "no-store", signal: ctrl.signal });
    window.clearTimeout(t);
    if (r.ok) {
      const j = await r.json();
      if (j && typeof j.version === "string") { ok = true; version = j.version; }
    }
  } catch {}

  if (!ok) {
    failCount += 1;
    if (failCount >= 2 && !down) {
      down = true;
      showBanner("서버 업데이트 중입니다.", "잠시 후 자동으로 다시 접속합니다.", "#b45309");
    }
    schedule(down ? 5000 : 15000);
    return;
  }

  failCount = 0;
  if (initialVersion === null) initialVersion = version;
  if (down) { down = false; hideBanner(); }
  if (version !== initialVersion) {
    reloading = true;
    showBanner("새 버전으로 업데이트합니다.", "잠시 후 화면이 자동으로 새로고침됩니다.", "#1d4ed8");
    window.setTimeout(() => window.location.reload(), 2500);
    return;
  }
  schedule(15000);
}

function schedule(ms: number) {
  if (timer) window.clearTimeout(timer);
  timer = window.setTimeout(checkVersion, ms);
}

export function startPresence() {
  try {
    sendPresence();
    window.setInterval(sendPresence, 60_000);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") { sendPresence(); schedule(500); }
    });
    checkVersion();
  } catch {}
}
