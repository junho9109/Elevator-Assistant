import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

createRoot(document.getElementById("root")!).render(<App />);

// 플로팅 새로고침 버튼 (캐시 무시)
<Button
  variant="outline"
  size="icon"
  className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-400 transition-all hover:scale-110"
  onClick={() => {
    // 캐시 무시 + 새로고침
    const url = new URL(window.location.href);
    url.searchParams.set('v', Date.now().toString());
    window.location.href = url.toString();
  }}
  title="새로고침 (최신 버전 가져오기)"
>
  <RefreshCw className="h-5 w-5" />
</Button>