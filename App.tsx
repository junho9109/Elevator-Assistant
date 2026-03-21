import { Switch, Route } from "wouter";
import { queryClient } from './client/src/lib/queryClient';
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import JudgmentPage from "@/pages/judgment";
import PrecisionInspectionPage from "@/pages/precision-inspection";
import MemoPage from "@/pages/memo";
import NotFound from "@/pages/not-found";
import SwipeNavigator from "@/components/SwipeNavigator";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import * as Updates from 'expo-updates';  // 추가
import { useToast } from "@/hooks/use-toast";

function MainApp() {
  return (
    <SwipeNavigator
      pages={[
        <Home key="home" />,
        <JudgmentPage key="judgment" />,
        <PrecisionInspectionPage key="precision" />,
        <MemoPage key="memo" />
      ]}
      pageNames={[
        "기술자료조회",
        "판정결과(도우미)",
        "정밀안전검사",
        "메모"
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { toast } = useToast();

  const handleRefresh = async () => {
    // 1. React Query 캐시 무시
    queryClient.invalidateQueries({ queryKey: ["standards"] });
    queryClient.invalidateQueries({ queryKey: ["hotspots"] });

    // 2. Expo OTA 강제 체크
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
        toast({
          title: "업데이트 완료",
          description: "최신 버전으로 새로고침되었습니다."
        });
      } else {
        toast({
          title: "이미 최신 버전입니다"
        });
      }
    } catch (err) {
      console.error(err);
      // fallback
      const url = new URL(window.location.href);
      url.searchParams.set('v', Date.now().toString());
      window.location.href = url.toString();
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />

        {/* 플로팅 강제 OTA 새로고침 버튼 */}
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-400 transition-all hover:scale-110"
          onClick={handleRefresh}
          title="OTA 업데이트 강제 체크 + 새로고침"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;