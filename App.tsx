import { Switch, Route } from "wouter";
import { queryClient } from './client/src/lib/queryClient';
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
