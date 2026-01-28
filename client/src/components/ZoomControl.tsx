import { useState, useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZoomControlProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  minZoom?: number;
  maxZoom?: number;
  step?: number;
  storageKey?: string;
}

export function ZoomControl({
  contentRef,
  minZoom = 0.5,
  maxZoom = 2,
  step = 0.1,
  storageKey = "pageZoom"
}: ZoomControlProps) {
  const [zoom, setZoom] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? parseFloat(saved) : 1;
  });

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.transform = `scale(${zoom})`;
      contentRef.current.style.transformOrigin = "top center";
    }
    localStorage.setItem(storageKey, zoom.toString());
  }, [zoom, contentRef, storageKey]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(maxZoom, Math.round((prev + step) * 10) / 10));
  }, [maxZoom, step]);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(minZoom, Math.round((prev - step) * 10) / 10));
  }, [minZoom, step]);

  const handleReset = useCallback(() => {
    setZoom(1);
  }, []);

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 flex items-center gap-1 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg px-2 py-1"
      data-testid="zoom-control"
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={handleZoomOut}
        disabled={zoom <= minZoom}
        data-testid="button-zoom-out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <button
        onClick={handleReset}
        className="min-w-[48px] text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors px-1"
        data-testid="button-zoom-reset"
      >
        {Math.round(zoom * 100)}%
      </button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={handleZoomIn}
        disabled={zoom >= maxZoom}
        data-testid="button-zoom-in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
}
