import { useState, useRef } from "react";

interface SwipeNavigatorProps {
  pages: React.ReactNode[];
  pageNames: string[];
}

export default function SwipeNavigator({ pages = [], pageNames = [] }: SwipeNavigatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 60 && dy < 80) {
      if (dx > 0 && currentIndex < pages.length - 1) setCurrentIndex(i => i + 1);
      else if (dx < 0 && currentIndex > 0) setCurrentIndex(i => i - 1);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* 페이지 */}
      <div
        className="flex-1 overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {pages.map((page, i) => (
          <div
            key={i}
            className="absolute inset-0 overflow-y-auto transition-opacity duration-200"
            style={{
              opacity: currentIndex === i ? 1 : 0,
              pointerEvents: currentIndex === i ? "auto" : "none",
              zIndex: currentIndex === i ? 1 : 0,
            }}
          >
            {page}
          </div>
        ))}
      </div>

      {/* 하단 탭바 */}
      <div
        className="flex-shrink-0 border-t border-border bg-card/80"
        style={{ backdropFilter: "saturate(180%) blur(20px)", WebkitBackdropFilter: "saturate(180%) blur(20px)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex">
          {pageNames.map((name, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`flex-1 flex flex-col items-center justify-center py-3 transition-all duration-150 ${
                currentIndex === i ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <span className={`text-xs font-medium tracking-tight ${currentIndex === i ? "font-semibold" : ""}`}>
                {name}
              </span>
              {currentIndex === i && (
                <div className="w-4 h-0.5 rounded-full bg-primary mt-1" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
