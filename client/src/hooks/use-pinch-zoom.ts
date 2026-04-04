import { useRef, useCallback } from "react";

export function usePinchZoom(containerRef: React.RefObject<HTMLElement | null>) {
  const lastDist = useRef<number | null>(null);
  const scale = useRef(1);
  const origin = useRef({ x: 0, y: 0 });

  const getDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastDist.current = getDistance(e.touches);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        origin.current = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top,
        };
      }
    }
  }, [containerRef]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastDist.current !== null) {
      const el = containerRef.current;
      if (!el) return;
      const newDist = getDistance(e.touches);
      const ratio = newDist / lastDist.current;
      scale.current = Math.min(4, Math.max(0.5, scale.current * ratio));
      el.style.transformOrigin = `${origin.current.x}px ${origin.current.y}px`;
      el.style.transform = `scale(${scale.current})`;
      lastDist.current = newDist;
    }
  }, [containerRef]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      lastDist.current = null;
      if (scale.current < 1.05) {
        const el = containerRef.current;
        if (el) {
          scale.current = 1;
          el.style.transform = "scale(1)";
        }
      }
    }
  }, [containerRef]);

  return { onTouchStart, onTouchMove, onTouchEnd };
}
