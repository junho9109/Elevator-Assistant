import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// props 타입 정의 (이게 핵심 해결!)
interface SwipeNavigatorProps {
  pages: React.ReactNode[];
  pageNames: string[];
}

export default function SwipeNavigator({ pages, pageNames }: SwipeNavigatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNav, setShowNav] = useState(true); // 네비게이션 표시 상태

  // 2초 후 네비게이션 자동 숨김
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNav(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 터치 스와이프 기능 (타입 명시 추가)
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

  return (
    <div className="relative min-h-screen" onTouchStart={handleTouchStart}>
      {/* 네비게이션 영역 (2초 후 숨김) */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          showNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="bg-white shadow-md border-b p-3">
          <div className="flex justify-center gap-6 text-sm font-medium">
            {pageNames.map((name: string, i: number) => (
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

      {/* 숨겨진 상태에서 다시 보기 버튼 */}
      {!showNav && (
        <button
          onClick={() => setShowNav(true)}
          className="fixed top-2 left-1/2 -translate-x-1/2 z-50 bg-white shadow-lg border border-gray-200 hover:border-blue-400 text-blue-600 px-4 py-2 rounded-full transition-all hover:scale-105 flex items-center gap-2 text-sm"
          title="네비게이션 다시 보기"
        >
          <ChevronDown className="h-4 w-4 rotate-180" />
          네비게이션 열기
        </button>
      )}

      {/* 현재 페이지 콘텐츠 */}
      <div className="pt-16">{pages[currentIndex]}</div>
    </div>
  );
}