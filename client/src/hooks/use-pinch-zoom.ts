import { useRef, useState, useEffect } from "react";

// 사진 상세보기 등에서 재사용하는 핀치줌/드래그 이동 훅
// resetDep이 바뀌면(예: 다른 사진으로 전환, 뷰어 닫힘→열림) 확대/이동 상태를 초기화한다.
export function usePinchZoomPan(resetDep: unknown) {
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
    e.stopPropagation();
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistance.current = distance;
      lastZoom.current = zoom;
      isPanning.current = false;
    } else if (e.touches.length === 1 && zoom > 1) {
      isPanning.current = true;
      lastPanPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = distance / lastTouchDistance.current;
      setZoom(Math.min(5, Math.max(0.5, lastZoom.current * scale)));
    } else if (e.touches.length === 1 && isPanning.current && zoom > 1) {
      const deltaX = e.touches[0].clientX - lastPanPos.current.x;
      const deltaY = e.touches[0].clientY - lastPanPos.current.y;
      lastPanPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setPanX(p => p + deltaX);
      setPanY(p => p + deltaY);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
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
