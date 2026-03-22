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
  // 추가: ZoomControl에서 참조할 Ref 선언
  const zoomContentRef = useRef<HTMLDivElement>(null);

  const [activeButtonId, setActiveButtonId] = useState<number | null>(null);
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
    if (activeButtonId) return standards.filter(s => s.hotspotId === activeButtonId);
    return standards;
  }, [standards, searchTerm, isSearching, activeButtonId, fuse]);

  const activeButton = hotspots.find(h => h.id === activeButtonId);

  // Canvas로 구조도 + 버튼 직접 그리기
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

        // 버튼 배경 (원형)
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 42, 0, Math.PI * 2);
        ctx.fillStyle = activeButtonId === hotspot.id ? "#2563eb" : "#1e2937";
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
        ctx.fill();
        ctx.restore();

        // 버튼 테두리
        ctx.beginPath();
        ctx.arc(x, y, 42, 0, Math.PI * 2);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.stroke();

        // 버튼 라벨
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 15px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(hotspot.label, x, y);
      });
    };
  }, [hotspots, activeButtonId]);

  // Canvas 클릭 이벤트 (버튼 클릭 감지)
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
      if (distance < 50) {
        setActiveButtonId(hotspot.id);
      }
    });
  };

  if (!hotspots || hotspots.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* 줌 기능이 적용될 영역에 ref={zoomContentRef} 연결 */}
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

        {/* Canvas 기반 구조도 + 버튼 통합 */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 mb-8">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-pointer"
            onClick={handleCanvasClick}
          />
        </div>

        {/* 선택된 버튼의 표준화 목록 */}
        {activeButton && (
          <div className="p-6 bg-white rounded-xl shadow border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">
              {activeButton.label} 기준 목록
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

            <div className="grid gap-6 md:grid-cols-2">
              {displayItems.length === 0 ? (
                <p className="text-center text-gray-500 py-10">기준이 없습니다</p>
              ) : (
                displayItems.map(standard => (
                  <div key={standard.id} className="bg-gray-50 rounded-lg p-5 hover:bg-gray-100 transition-colors">
                    <h3 className="font-semibold text-lg mb-2">{standard.title}</h3>
                    {standard.standardNumber && <Badge variant="outline" className="mb-3">{standard.standardNumber}</Badge>}
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {standard.body}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* 정의된 ref를 ZoomControl에 전달 */}
      <ZoomControl contentRef={zoomContentRef} storageKey="homePageZoom" />
    </div>
  );
}
