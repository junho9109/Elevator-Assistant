import { createRoot } from "react-dom/client";
import App from "../../App";
import "./index.css";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";

async function initPushNotifications() {
  if (!Capacitor.isNativePlatform()) return;
  const permission = await PushNotifications.requestPermissions();
  if (permission.receive !== "granted") return;
  await PushNotifications.register();
  PushNotifications.addListener("registration", async (token) => {
    try {
      await fetch("/api/push/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.value, platform: "android" }),
      });
    } catch (e) {}
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

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
