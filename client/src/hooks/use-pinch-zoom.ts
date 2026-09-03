import { useRef, useState, useEffect } from "react";

export interface PinchZoomPanOptions {
  // 텍스트/버튼/입력폼이 포함된 콘텐츠(예: 항목 상세보기 다이얼로그)에 적용할 때는
  // true로 두면 imgStyle의 pointerEvents/userSelect를 막지 않아 클릭·텍스트 선택이 계속 동작한다.
  // 사진 전용 뷰어처럼 콘텐츠가 <img> 하나뿐일 때는 기본값(false)을 사용해 드래그로 인한
  // 오작동(이미지 드래그·선택)을 막는다.
  interactive?: boolean;
}

// 사진 상세보기 등에서 재사용하는 핀치줌/드래그 이동 훅
// resetDep이 바뀌면(예: 다른 사진으로 전환, 뷰어 닫힘→열림) 확대/이동 상태를 초기화한다.
export function usePinchZoomPan(resetDep: unknown, options: PinchZoomPanOptions = {}) {
  const { interactive = false } = options;
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const lastTouchDistance = useRef<number | null>(null);
  const lastZoom = useRef(1);
  const isPanning = useRef(false);
  const lastPanPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    lastTouchDistance.current = null;
    isPanning.current = false;
  }, [resetDep]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // interactive 모드는 텍스트 스크롤 컨테이너 안에서 동작하므로, 두 손가락 핀치가 시작될 때만
      // 이벤트를 가로채 배경(body) 네이티브 줌으로 전파되지 않게 막는다. 한 손가락(스크롤)은 그대로 통과시킴.
      if (interactive) e.stopPropagation();
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistance.current = distance;
      lastZoom.current = zoom;
      isPanning.current = false;
    } else if (e.touches.length === 1 && zoom > 1) {
      // interactive 모드도 확대된(zoom>1) 상태에서는 한 손가락 드래그를 좌우+상하 팬으로 사용한다.
      // 확대 전(zoom===1)에는 이 분기를 타지 않으므로 기존 세로 스크롤 동작은 그대로 유지된다.
      if (interactive) e.stopPropagation();
      isPanning.current = true;
      lastPanPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      if (interactive) e.stopPropagation();
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = distance / lastTouchDistance.current;
      setZoom(Math.min(5, Math.max(0.5, lastZoom.current * scale)));
    } else if (e.touches.length === 1 && isPanning.current && zoom > 1) {
      // 확대된 상태의 1손가락 이동 — preventDefault로 스크롤 컨테이너의 네이티브 세로 스크롤을 억제해
      // 세로만 움직이고 가로는 안 움직이던(브라우저가 세로 스크롤로 제스처를 선점하던) 문제를 막는다.
      if (interactive && e.cancelable) e.preventDefault();
      e.stopPropagation();
      const deltaX = e.touches[0].clientX - lastPanPos.current.x;
      const deltaY = e.touches[0].clientY - lastPanPos.current.y;
      lastPanPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setPanX(p => p + deltaX);
      setPanY(p => p + deltaY);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (interactive) e.stopPropagation();
    lastTouchDistance.current = null;
    isPanning.current = false;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      isPanning.current = true;
      lastPanPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isPanning.current && zoom > 1) {
      const deltaX = e.clientX - lastPanPos.current.x;
      const deltaY = e.clientY - lastPanPos.current.y;
      lastPanPos.current = { x: e.clientX, y: e.clientY };
      setPanX(p => p + deltaX);
      setPanY(p => p + deltaY);
    }
  };

  const onMouseUp = () => {
    isPanning.current = false;
  };

  const zoomIn = () => setZoom(z => Math.min(5, z + 0.5));
  const zoomOut = () => setZoom(z => {
    const nz = Math.max(0.5, z - 0.5);
    if (nz <= 1) { setPanX(0); setPanY(0); }
    return nz;
  });

  return {
    zoom,
    panX,
    panY,
    imgStyle: {
      transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
      willChange: "transform",
      pointerEvents: "none" as const,
      userSelect: "none" as const,
    },
    // 텍스트/버튼이 포함된 콘텐츠용 — 클릭·텍스트 선택을 막지 않고 scale만 적용.
    // transformOrigin을 top center로 둬 스크롤 컨테이너 상단 기준으로 자연스럽게 확대되게 함.
    contentStyle: {
      transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
      transformOrigin: "top center",
      willChange: "transform",
    },
    containerHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave: onMouseUp,
    },
    zoomIn,
    zoomOut,
    cursor: zoom > 1 ? "grab" : "default",
  };
}
