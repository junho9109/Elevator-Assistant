import { createRoot } from "react-dom/client";
import App from "../../App";
import "./index.css";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";
import { savePushToken, registerPushToken } from "@/lib/push";
import { startPresence } from "@/lib/presence";

async function initPushNotifications() {
  if (!Capacitor.isNativePlatform()) return;
  const permission = await PushNotifications.requestPermissions();
  if (permission.receive !== "granted") return;
  await PushNotifications.register();
  PushNotifications.addListener("registration", async (token) => {
    // 토큰을 보관하고 현재 로그인 정보로 등록(로그인 전이면 이름 없이 등록되고, 로그인 때 다시 등록된다)
    savePushToken(token.value);
    await registerPushToken();
  });
  // 포그라운드 알림 — 인앱 토스트 이벤트 발생
  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    window.dispatchEvent(new CustomEvent("inAppNotification", {
      detail: {
        title: notification.title || "새 메시지",
        body: notification.body || "",
      }
    }));
  });
  // 알림 클릭 — 채팅 페이지로 이동
  PushNotifications.addListener("pushNotificationActionPerformed", () => {
    window.dispatchEvent(new CustomEvent("navigatePage", { detail: { index: 7 } }));
  });
}

initPushNotifications();
startPresence();

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
