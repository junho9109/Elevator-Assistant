import { useState, useRef, useEffect, useMemo } from "react";
import { ZoomControl } from "@/components/ZoomControl";
import { createPortal } from "react-dom";
import structureImg from "@assets/structure_1764142259144.png";
import { cn } from "@/lib/utils";
import Fuse from "fuse.js";
import {
  Search,
  RefreshCw,
  Settings2,
  Plus,
  Pencil,
  Trash2,
  Save,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import {
  useStandards,
  useHotspots,
  useCreateStandard,
  useUpdateStandard,
  useDeleteStandard,
  useCreateHotspot,
  useUpdateHotspot,
  useDeleteHotspot,
  useComments,
  useCreateComment,
  useDeleteComment
} from "@/lib/api";
import type { Standard, Hotspot } from "@shared/schema";

export default function Home() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: standards = [] } = useStandards();
  const { data: hotspots = [] } = useHotspots();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomContentRef = useRef<HTMLDivElement>(null);

  const [activeButtonId, setActiveButtonId] = useState<number | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const isSearching = searchTerm.length > 0;

  const fuse = useMemo(() => {
    return new Fuse(standards, {
      keys: ["title", "body", "standardNumber"],
      threshold: 0.4
    });
  }, [standards]);

  const displayItems = useMemo(() => {
    if (isSearching) return fuse.search(searchTerm).map(r => r.item);
    if (activeButtonId) {
      const activeHotspot = hotspots.find(h => h.id === activeButtonId);
      if (activeHotspot) return standards.filter(s => s.categoryId === activeHotspot.categoryId);
    }
    return standards;
  }, [standards, searchTerm, isSearching, activeButtonId, fuse, hotspots]);

  const activeButton = hotspots.find(h => h.id === activeButtonId);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || hotspots.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = structureImg;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      hotspots.forEach((hotspot) => {
        const x = (parseFloat(hotspot.left) / 100) * canvas.width;
        const y = (parseFloat(hotspot.top) / 100) * canvas.height;

        const isActive = activeButtonId === hotspot.id;
        const radius = 20;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? "#2563eb" : "rgba(30,41,55,0.85)";
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = isActive ? "#93c5fd" : "#ffffff";
        ctx.lineWidth = isActive ? 3 : 1.5;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(hotspot.label, x, y);
      });
    };
  }, [hotspots, activeButtonId]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    hotspots.forEach(hotspot => {
      const btnX = (parseFloat(hotspot.left) / 100) * canvas.width;
      const btnY = (parseFloat(hotspot.top) / 100) * canvas.height;
      const distance = Math.hypot(clickX - btnX, clickY - btnY);
      if (distance < 25) {
        setActiveButtonId(hotspot.id);
      }
    });
  };

  if (!hotspots || hotspots.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto" ref={zoomContentRef}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">기술자료조회</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["standards"] });
              queryClient.invalidateQueries({ queryKey: ["hotspots"] });
            }}
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 mb-8">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-pointer"
            onClick={handleCanvasClick}
          />
        </div>

        <div className="p-6 bg-white rounded-xl shadow border border-gray-200">
          <h2 className="text-2xl font-bold mb-6">
            {activeButton ? `${activeButton.label} 기준 목록` : "전체 기준 목록"}
          </h2>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="기준 검색..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {displayItems.length === 0 ? (
              <p className="text-center text-gray-500 py-10">기준이 없습니다</p>
            ) : (
              displayItems.map(standard => (
                <div
                  key={standard.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors cursor-pointer"
                  onClick={() => setSelectedStandard(standard)}
                >
                  <h3 className="font-semibold text-base mb-1">{standard.title}</h3>
                  {standard.standardNumber && (
                    <Badge variant="outline" className="mb-2 text-xs">{standard.standardNumber}</Badge>
                  )}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {standard.body}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedStandard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelectedStandard(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-6 border-b">
              <h2 className="text-xl font-bold pr-4">{selectedStandard.title}</h2>
              <button
                onClick={() => setSelectedStandard(null)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedStandard.standardNumber && (
                <Badge variant="outline">{selectedStandard.standardNumber}</Badge>
              )}
              {selectedStandard.permitDate && (
                <div className="flex gap-2 text-sm">
                  <span className="text-gray-500 font-medium">건축허가일:</span>
                  <span>{selectedStandard.permitDate}</span>
                </div>
              )}
              {selectedStandard.inspectionDate && (
                <div className="flex gap-2 text-sm">
                  <span className="text-gray-500 font-medium">검사기준적용일:</span>
                  <span>{selectedStandard.inspectionDate}</span>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">내용</p>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedStandard.body}
                </p>
              </div>
              {selectedStandard.imageUrls && selectedStandard.imageUrls.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    이미지 ({selectedStandard.imageUrls.length}장)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedStandard.imageUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`이미지 ${i + 1}`}
                        className="rounded-lg w-full object-cover border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ZoomControl contentRef={zoomContentRef} storageKey="homePageZoom" />
    </div>
  );
}
