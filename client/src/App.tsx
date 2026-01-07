import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import JudgmentPage from "@/pages/judgment";
import PrecisionInspectionPage from "@/pages/precision-inspection";
import MemoPage from "@/pages/memo";
import NotFound from "@/pages/not-found";
import SwipeNavigator from "@/components/SwipeNavigator";

function MainApp() {
  return (
    <SwipeNavigator 
      pages={[<Home key="home" />, <JudgmentPage key="judgment" />, <PrecisionInspectionPage key="precision" />, <MemoPage key="memo" />]}
      pageNames={["기술자료조회", "판정결과(예시)", "정밀안전검사", "메모"]}
    />
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainApp} />
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
