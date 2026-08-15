import { useState, useRef } from "react";

interface SwipeNavigatorProps {
  pages: React.ReactNode[];
  pageNames: string[];
}

export default function SwipeNavigator({ pages = [], pageNames = [] }: SwipeNavigatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 외부에서 페이지 전환 가능하도록 전역 이벤트 등록
  useState(() => {
    const handler = (e: any) => {
      if (typeof e.detail?.index === "number") setCurrentIndex(e.detail.index);
    };
    window.addEventListener("navigatePage", handler);
    return () => window.removeEventListener("navigatePage", handler);
  });
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {};
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {};

  return (
    <div className="flex flex-col bg-background" style={{height: "100dvh"}}>
      {/* 상단 safe-area 패딩 */}
      <div style={{height: "env(safe-area-inset-top)", backgroundColor: "var(--color-card)"}} />

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
            data-page-index={i}
            id={`swipe-page-${i}`}
            style={{
              opacity: currentIndex === i ? 1 : 0,
              pointerEvents: currentIndex === i ? "auto" : "none",
              zIndex: currentIndex === i ? 1 : 0,
            }}
            onTouchStart={(e) => {
              // 사진 상세보기 등 자체 핀치줌을 쓰는 모달이 열려있으면 페이지 전체 핀치줌은 무시한다
              if ((e.target as HTMLElement).closest('[data-no-page-pinch]')) return;
              if (e.touches.length === 2) {
                e.currentTarget.dataset.pinchDist = String(Math.hypot(
                  e.touches[0].clientX - e.touches[1].clientX,
                  e.touches[0].clientY - e.touches[1].clientY
                ));
                e.currentTarget.dataset.pinchScale = e.currentTarget.dataset.pinchScale || "1";
              }
            }}
            onTouchMove={(e) => {
              if ((e.target as HTMLElement).closest('[data-no-page-pinch]')) return;
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
              if ((e.target as HTMLElement).closest('[data-no-page-pinch]')) return;
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
              className={`flex-1 flex flex-col items-center justify-center py-2.5 transition-all duration-150 ${
                currentIndex === i ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <span className={`text-[10px] font-medium tracking-tight whitespace-nowrap ${currentIndex === i ? "font-semibold" : ""}`}>
                {name}
              </span>
              {currentIndex === i && (
                <div className="w-4 h-0.5 rounded-full bg-primary mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
