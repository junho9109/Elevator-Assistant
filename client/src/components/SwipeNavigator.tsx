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
            onTouchStart={(e) => {
              if (e.touches.length === 2) {
                e.currentTarget.dataset.pinchDist = String(Math.hypot(
                  e.touches[0].clientX - e.touches[1].clientX,
                  e.touches[0].clientY - e.touches[1].clientY
                ));
                e.currentTarget.dataset.pinchScale = e.currentTarget.dataset.pinchScale || "1";
              }
            }}
            onTouchMove={(e) => {
              if (e.touches.length === 2) {
                const prev = parseFloat(e.currentTarget.dataset.pinchDist || "1");
                const curr = Math.hypot(
                  e.touches[0].clientX - e.touches[1].clientX,
                  e.touches[0].clientY - e.touches[1].clientY
                );
                const prevScale = parseFloat(e.currentTarget.dataset.pinchScale || "1");
                const newScale = Math.min(4, Math.max(0.8, prevScale * (curr / prev)));
                e.currentTarget.dataset.pinchScale = String(newScale);
                e.currentTarget.dataset.pinchDist = String(curr);
                const inner = e.currentTarget.firstElementChild as HTMLElement;
                if (inner) inner.style.transform = `scale(${newScale})`;
                if (inner) inner.style.transformOrigin = "center top";
              }
            }}
            onTouchEnd={(e) => {
              if (e.touches.length < 2) {
                const scale = parseFloat(e.currentTarget.dataset.pinchScale || "1");
                if (scale < 1.05) {
                  e.currentTarget.dataset.pinchScale = "1";
                  const inner = e.currentTarget.firstElementChild as HTMLElement;
                  if (inner) { inner.style.transform = "scale(1)"; }
                }
              }
            }}
          >
            <div style={{ minHeight: "100%", transformOrigin: "center top", transition: "transform 0.1s" }}>
              {page}
            </div>
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
