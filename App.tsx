import { Switch, Route } from "wouter";
import { queryClient } from './client/src/lib/queryClient';
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import LoginPage from "@/pages/login";
import Home from "@/pages/home";
import JudgmentPage from "@/pages/judgment";
import InspectionStandardsPage from "@/pages/inspection-standards";
import PrecisionInspectionPage from "@/pages/precision-inspection";
import MemoPage from "@/pages/memo";
import SafetyPage from "@/pages/safety";
import TechnicalDataPage from "@/pages/technical-data";
import ChatPage from "@/pages/chat";
import NotFound from "@/pages/not-found";
import SwipeNavigator from "@/components/SwipeNavigator";

function MainApp() {
  return (
    <SwipeNavigator
      pages={[
        <Home key="home" />,
        <TechnicalDataPage key="technical" />,
        <JudgmentPage key="judgment" />,
        <InspectionStandardsPage key="inspection-standards" />,
        <PrecisionInspectionPage key="precision" />,
        <MemoPage key="memo" />,
        <SafetyPage key="safety" />,
        <ChatPage key="chat" />,
      ]}
      pageNames={[
        "AI검색",
        "기술자료",
        "검사가이드",
        "검사기준",
        "정밀안전검사",
        "메모",
        "안전보건",
        "채팅",
      ]}
    />
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainApp} />
      <Route path="/judgment" component={JudgmentPage} />
      <Route path="/precision" component={PrecisionInspectionPage} />
      <Route path="/memo" component={MemoPage} />
      <Route path="/safety" component={SafetyPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

// 인앱 푸시 알림 토스트
function InAppNotificationToast() {
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setToast(e.detail);
      setTimeout(() => setToast(null), 4000);
    };
    window.addEventListener("inAppNotification", handler as EventListener);
    return () => window.removeEventListener("inAppNotification", handler as EventListener);
  }, []);
  if (!toast) return null;
  return (
    <div
      onClick={() => { setToast(null); window.dispatchEvent(new CustomEvent("navigatePage", { detail: { index: 7 } })); }}
      style={{ position:"fixed", top:16, left:16, right:16, zIndex:99999, background:"#1f2937", color:"white", borderRadius:14, padding:"12px 16px", boxShadow:"0 4px 20px rgba(0,0,0,0.3)", display:"flex", alignItems:"flex-start", gap:10 }}
    >
      <span style={{ fontSize:20 }}>💬</span>
      <div>
        <p style={{ fontSize:13, fontWeight:700, marginBottom:2 }}>{toast.title}</p>
        <p style={{ fontSize:12, opacity:0.8 }}>{toast.body}</p>
      </div>
    </div>
  );
}

function App() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("loginInfo") || "{}");
    if (saved.autoLogin && saved.token) {
      fetch("/api/auth/verify", { headers: { Authorization: `Bearer ${saved.token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setAuthToken(saved.token); })
        .catch(() => {})
        .finally(() => setIsChecking(false));
    } else {
      setIsChecking(false);
    }
  }, []);

  if (isChecking) return null;

  if (!authToken) {
    return (
      <QueryClientProvider client={queryClient}>
        <LoginPage onLogin={(token) => setAuthToken(token)} />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <InAppNotificationToast />
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
