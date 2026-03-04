import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// props 타입 + 기본값 + 안전장치
interface SwipeNavigatorProps {
  pages?: React.ReactNode[];      // optional + 기본값 아래에서 처리
  pageNames?: string[];           // optional + 기본값 아래에서 처리
}

export default function SwipeNavigator(props: SwipeNavigatorProps) {
  // props가 없거나 undefined일 때 기본값 강제 적용
  const pages = props.pages ?? [];
  const pageNames = props.pageNames ?? ["페이지 로딩 중..."]; // 최소 1개라도 보이게

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowNav(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const startX = e.touches[0].clientX;

    const handleTouchEnd = (e2: TouchEvent) => {
      const endX = e2.changedTouches[0].clientX;
      const diff = startX - endX;

      if (diff > 50 && currentIndex < pages.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (diff < -50 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }

      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchend", handleTouchEnd);
  };

  // 에러 방지: pageNames가 배열인지 최종 확인
  const safePageNames = Array.isArray(pageNames) ? pageNames : ["로딩 중"];

  return (
    <div className="relative min-h-screen" onTouchStart={handleTouchStart}>
      {/* 네비게이션 */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          showNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="bg-white shadow-md border-b p-3">
          <div className="flex justify-center gap-6 text-sm font-medium">
            {safePageNames.map((name, i) => (
              <button
                key={i}
                className={`pb-1 px-3 ${
                  i === currentIndex
                    ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setCurrentIndex(i)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 다시 보기 버튼 */}
      {!showNav && (
        <button
          onClick={() => setShowNav(true)}
          className="fixed top-2 left-1/2 -translate-x-1/2 z-50 bg-white shadow-lg border border-gray-200 hover:border-blue-400 text-blue-600 px-4 py-2 rounded-full transition-all hover:scale-105 flex items-center gap-2 text-sm"
        >
          <ChevronDown className="h-4 w-4 rotate-180" />
          네비게이션 열기
        </button>
      )}

      {/* 페이지 콘텐츠 */}
      <div className="pt-16">
        {pages[currentIndex] || <div className="p-8 text-center text-gray-500">페이지 로딩 중...</div>}
      </div>
    </div>
  );
}