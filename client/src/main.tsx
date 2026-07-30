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
  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    console.log("[FCM] 수신:", notification);
  });
  PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
    window.dispatchEvent(new CustomEvent("navigatePage", { detail: { index: 7 } }));
  });
}

initPushNotifications();

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
