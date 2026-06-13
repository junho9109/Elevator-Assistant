import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, ChevronLeft, Check, Settings2, Save, Pencil, Plus, Trash2, Image, MessageSquare, X, Upload, ZoomIn, ZoomOut, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ZoomControl } from "@/components/ZoomControl";
import { INSPECTION_DATA_MR, InspectionItem, InspectionSection } from "@/data/inspection-data-mr";
import INSPECTION_CONTENT from "@/data/inspection-content.json";
type ContentEntry = {
  text?: string;
  effectiveDate?: string;
  introductionType?: string;
  equipmentTypes?: string[];
  customWarning?: string;
  standardNote?: string;
  revisions?: { effectiveDate: string | null; expiryDate: string | null; introductionType: string | null; description: string }[];
};
const contentMap: Record<string, ContentEntry> = INSPECTION_CONTENT as Record<string, ContentEntry>;
import type { InspectionItemEdit, CustomInspectionItem } from "@shared/schema";

// Image Viewer State
interface ImageViewerState {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  zoom: number;
  panX: number;
  panY: number;
}

// Image Viewer Component
function ImageViewerComponent({ 
  imageViewer, 
  setImageViewer, 
  closeImageViewer 
}: { 
  imageViewer: ImageViewerState;
  setImageViewer: React.Dispatch<React.SetStateAction<ImageViewerState>>;
  closeImageViewer: () => void;
}) {
  const lastTouchDistance = useRef<number | null>(null);
  const lastZoom = useRef<number>(1);
  const isPanning = useRef(false);
  const lastPanPos = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistance.current = distance;
      lastZoom.current = imageViewer.zoom;
      isPanning.current = false;
    } else if (e.touches.length === 1 && imageViewer.zoom > 1) {
      isPanning.current = true;
      lastPanPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = distance / lastTouchDistance.current;
      const newZoom = Math.min(5, Math.max(0.5, lastZoom.current * scale));
      setImageViewer(prev => ({ ...prev, zoom: newZoom }));
    } else if (e.touches.length === 1 && isPanning.current && imageViewer.zoom > 1) {
      const deltaX = e.touches[0].clientX - lastPanPos.current.x;
      const deltaY = e.touches[0].clientY - lastPanPos.current.y;
      lastPanPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setImageViewer(prev => ({
        ...prev,
        panX: prev.panX + deltaX,
        panY: prev.panY + deltaY
      }));
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistance.current = null;
    isPanning.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (imageViewer.zoom > 1) {
      isPanning.current = true;
      lastPanPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning.current && imageViewer.zoom > 1) {
      const deltaX = e.clientX - lastPanPos.current.x;
      const deltaY = e.clientY - lastPanPos.current.y;
      lastPanPos.current = { x: e.clientX, y: e.clientY };
      setImageViewer(prev => ({
        ...prev,
        panX: prev.panX + deltaX,
        panY: prev.panY + deltaY
      }));
    }
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  const goToPrev = () => {
    setImageViewer(prev => ({ 
      ...prev, 
      currentIndex: prev.currentIndex > 0 ? prev.currentIndex - 1 : prev.images.length - 1,
      zoom: 1,
      panX: 0,
      panY: 0
    }));
  };

  const goToNext = () => {
    setImageViewer(prev => ({ 
      ...prev, 
      currentIndex: prev.currentIndex < prev.images.length - 1 ? prev.currentIndex + 1 : 0,
      zoom: 1,
      panX: 0,
      panY: 0
    }));
  };

  return (
    <div 
      id="image-viewer-portal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.95)',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        touchAction: 'none',
        cursor: imageViewer.zoom > 1 ? 'grab' : 'default',
      }}
      onClick={(e) => { e.stopPropagation(); }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e); }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Close Button */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000000 }}>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); closeImageViewer(); }}
          style={{
            width: 56, height: 56, borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          <X style={{ width: 28, height: 28 }} />
        </a>
      </div>

      {/* Image */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'hidden',
        padding: 16
      }}>
        <img 
          src={imageViewer.images[imageViewer.currentIndex]} 
          alt="확대 이미지"
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%', 
            objectFit: 'contain',
            transform: `scale(${imageViewer.zoom}) translate(${imageViewer.panX / imageViewer.zoom}px, ${imageViewer.panY / imageViewer.zoom}px)`,
            willChange: 'transform',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
          draggable={false}
        />
      </div>

      {/* Navigation */}
      {imageViewer.images.length > 1 && (
        <>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); goToPrev(); }}
            style={{
              position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
              width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            <ChevronLeft style={{ width: 24, height: 24 }} />
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); goToNext(); }}
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            <ChevronRight style={{ width: 24, height: 24 }} />
          </a>
        </>
      )}

      {/* Info & Zoom Controls */}
      <div style={{ 
        position: 'absolute', 
        bottom: 16, 
        left: 0, 
        right: 0, 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12
      }}>
        <a
          href="#"
          onClick={(e) => { 
            e.preventDefault(); 
            e.stopPropagation();
            setImageViewer(prev => {
              const newZoom = Math.max(0.5, prev.zoom - 0.5);
              return { ...prev, zoom: newZoom, panX: newZoom <= 1 ? 0 : prev.panX, panY: newZoom <= 1 ? 0 : prev.panY };
            }); 
          }}
          style={{
            width: 44, height: 44, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            textDecoration: 'none'
          }}
        >
          <ZoomOut style={{ width: 22, height: 22 }} />
        </a>
        <span style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '6px 16px', borderRadius: 9999, fontSize: 14 }}>
          {imageViewer.currentIndex + 1} / {imageViewer.images.length} · {Math.round(imageViewer.zoom * 100)}%
        </span>
        <a
          href="#"
          onClick={(e) => { 
            e.preventDefault(); 
            e.stopPropagation();
            setImageViewer(prev => ({ ...prev, zoom: Math.min(5, prev.zoom + 0.5) })); 
          }}
          style={{
            width: 44, height: 44, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            textDecoration: 'none'
          }}
        >
          <ZoomIn style={{ width: 22, height: 22 }} />
        </a>
      </div>

      {/* Pinch Hint */}
      <div style={{ 
        position: 'absolute', 
        top: 16, 
        left: 16, 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        color: 'white', 
        padding: '6px 12px', 
        borderRadius: 8,
        fontSize: 12
      }}>
        {imageViewer.zoom > 1 ? '드래그하여 이동' : '핀치/버튼으로 확대'}
      </div>
    </div>
  );
}

// Photo List Component - shows photos one by one with vertical scroll
function PhotoList({ 
  photos, 
  isAdminMode, 
  onDeletePhoto,
  onReplacePhoto,
  onMoveUp,
  onMoveDown,
  onOpenViewer 
}: { 
  photos: any[];
  isAdminMode: boolean;
  onDeletePhoto: (photoId: number) => void;
  onReplacePhoto: (photoId: number, file: File) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onOpenViewer: (index: number) => void;
}) {
  const replaceInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  if (photos.length === 0) return null;

  return (
    <div className="space-y-4">
      {photos.map((photo: any, index: number) => (
        <div key={photo.id} className="relative group">
          <img
            src={photo.imageData}
            alt={photo.fileName}
            className="w-full h-auto max-h-80 object-contain rounded-lg border bg-muted cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onOpenViewer(index)}
          />
          <div className="text-center text-xs text-muted-foreground mt-1">
            {index + 1} / {photos.length}
          </div>
          {isAdminMode && (
            <>
              {/* Left side: reorder buttons */}
              {photos.length > 1 && (
                <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveUp(index);
                    }}
                    disabled={index === 0}
                    className="p-1.5 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="위로 이동"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveDown(index);
                    }}
                    disabled={index === photos.length - 1}
                    className="p-1.5 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="아래로 이동"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              )}
              {/* Right side: edit/delete buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <input
                  ref={(el) => { replaceInputRefs.current[photo.id] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onReplacePhoto(photo.id, file);
                    }
                    e.target.value = "";
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    replaceInputRefs.current[photo.id]?.click();
                  }}
                  className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  title="사진 변경"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePhoto(photo.id);
                  }}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="삭제"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

interface RevisionEntry {
  id?: number;
  revisionDate: string;
  description: string;
}
interface CustomItemEdit {
  id: string;
  text?: string;
  permitEffectiveDate?: string;   // 건축허가일 이후 적용일 (= P, 현행 시행일)
  firstIntroducedDate?: string;   // [v2] 최초 도입일 (= F, 해당없음 컷오프)
  enforcementType?: string;       // [v3] 'general' | 'retroactive' | 'immediate' (기본 general)
  standardEffectiveDate?: string; // 설치검사일(검사기준 적용일) 이후 적용일
  standardDatesWithMemo?: {date: string; memo: string; label?: string}[]; // 날짜+메모
  revisions?: RevisionEntry[];    // 개정 이력 (최대 10개)
  customWarning?: string;
  standardNote?: string;  // 검사기준 칸
  equipmentTypes?: string[];  // 적용 승강기 종류
  fixedResult?: ResultType;
  // 하위호환
  effectiveDate?: string;
  expiryDate?: string;
  introductionType?: "new" | "revision";
}

type ResultType = "적합" | "부적합" | "시정권고" | "해당없음" | "종전";

type EquipmentType = "엘리베이터" | "에스컬레이터" | "덤웨이터" | "휠체어리프트";
type ElevatorSubType = "전기식(MR)" | "전기식(MRL)" | "유압식" | "경사형";
type EscalatorSubType = "에스컬레이터" | "무빙워크";
type WheelchairLiftSubType = "수직형" | "경사형";

const EQUIPMENT_SUBTYPES: Record<EquipmentType, string[]> = {
  "엘리베이터": ["전기식(MR)", "전기식(MRL)", "유압식", "경사형"],
  "에스컬레이터": ["에스컬레이터", "무빙워크"],
  "덤웨이터": [],
  "휠체어리프트": ["수직형", "경사형"]
};

export default function JudgmentPage() {
  const { toast } = useToast();
  const zoomContentRef = useRef<HTMLDivElement>(null);
  const [equipmentType, setEquipmentType] = useState<EquipmentType>("엘리베이터");
  const [subType, setSubType] = useState<string>("전기식(MR)");
  const [inspectionDate, setInspectionDate] = useState("");
  const [permitDate, setPermitDate] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [installType, setInstallType] = useState<"" | "전면교체" | "수시교체">("");
  const [standardDate] = useState("2017-01-28");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  // [v5] results: 다중 선택 지원 (ResultType[] 배열로)
  const [results, setResults] = useState<Record<string, ResultType[]>>(() => {
    const saved = localStorage.getItem("judgmentResults");
    if (!saved) return {};
    try {
      const parsed = JSON.parse(saved);
      // 기존 데이터 마이그레이션: 단일 값 → 배열
      const migrated: Record<string, ResultType[]> = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (Array.isArray(v)) {
          migrated[k] = v as ResultType[];
        } else if (typeof v === 'string') {
          migrated[k] = [v as ResultType];
        }
      }
      return migrated;
    } catch {
      return {};
    }
  });
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  
  const [customEdits, setCustomEdits] = useState<Record<string, CustomItemEdit>>({});
  const [editingItem, setEditingItem] = useState<InspectionItem | null>(null);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<CustomItemEdit>({ id: "" });
  const [revisionsCache, setRevisionsCache] = useState<Record<string, any[]>>({});

  const [customItems, setCustomItems] = useState<(InspectionItem & { sectionId?: string })[]>([]);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [addItemForm, setAddItemForm] = useState({
    sectionId: "",
    text: "",
    effectiveDate: "",
    introductionType: "" as "" | "new" | "revision",
    permitEffectiveDate: "",
    standardEffectiveDate: "",
    standardDates: [] as string[],
    revisions: [] as RevisionEntry[]
  });

  // Item detail dialog state (photos & comments)
  const [detailItem, setDetailItem] = useState<InspectionItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState({ author: "", content: "" });
  const [revisions, setRevisions] = useState<{id?:number; effectiveDate:string; expiryDate:string; introductionType:string; description:string}[]>([]);
  const [revisionsLoading, setRevisionsLoading] = useState(false);
  // 관리자 개정 편집용 (inspection_item_revisions 직접 편집)
  const [editRevisions, setEditRevisions] = useState<{id?: number; effectiveDate: string; expiryDate: string; description: string}[]>([]);
  const editRevisionsSnapshot = useRef<{id: number; effectiveDate: string; expiryDate: string; description: string}[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  const pendingScrollId = useRef<string | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      const itemId = e.detail?.itemId;
      if (!itemId) return;
      setHighlightedItemId(itemId);
      pendingScrollId.current = itemId;
      // 해당 항목이 속한 섹션 모두 펼치기
      setExpandedSections(prev => {
        const newSet = new Set(prev);
        // itemId가 "5.1.1" 형태면 "5", "5.1" 등 부모 섹션 모두 펼침
        const parts = itemId.split(".");
        for (let i = 1; i <= parts.length; i++) {
          newSet.add(parts.slice(0, i).join("."));
        }
        // 전체 섹션도 펼치기
        const allIds = collectAllSectionIds(INSPECTION_DATA_MR);
        allIds.forEach(id => newSet.add(id));
        return newSet;
      });
      // 섹션 펼친 후 렌더링 완료되면 스크롤
      let retries = 0;
      const scrollLoop = setInterval(() => {
        const el = document.getElementById(`item-${itemId}`);
        const page = document.getElementById("swipe-page-1");
        if (el && page) {
          const elTop = el.getBoundingClientRect().top;
          const pageTop = page.getBoundingClientRect().top;
          page.scrollTo({ top: page.scrollTop + elTop - pageTop - 100, behavior: "smooth" });
          clearInterval(scrollLoop);
        } else if (retries++ > 30) {
          clearInterval(scrollLoop);
        }
      }, 100);
      // 4초 후 하이라이트 제거
      setTimeout(() => setHighlightedItemId(null), 4000);
    };
    window.addEventListener("highlightInspectionItem", handler);
    return () => window.removeEventListener("highlightInspectionItem", handler);
  }, []);

  // 챗봇에서 항목 상세보기 열기 이벤트 수신
  useEffect(() => {
    const handler = (e: any) => {
      const itemId = e.detail?.itemId;
      if (!itemId) return;
      // 모든 섹션에서 해당 항목 찾기
      const findItem = (sections: any[]): any => {
        for (const sec of sections) {
          if (sec.items) {
            const found = sec.items.find((it: any) => it.id === itemId);
            if (found) return found;
          }
          if (sec.subsections) {
            const found = findItem(sec.subsections);
            if (found) return found;
          }
        }
        return null;
      };
      const item = findItem(INSPECTION_DATA_MR);
      if (item) {
        handleOpenDetail(item);  // 항목별 개정 데이터(inspection_item_revisions)까지 정확히 로드
      }
    };
    window.addEventListener("openInspectionDetail", handler);
    return () => window.removeEventListener("openInspectionDetail", handler);
  }, []);
  const detailScrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ y: 0, scrollTop: 0 });

  // Image viewer state
  const [imageViewer, setImageViewer] = useState<ImageViewerState>({
    isOpen: false,
    images: [],
    currentIndex: 0,
    zoom: 1,
    panX: 0,
    panY: 0
  });

  const openImageViewer = (images: string[], startIndex: number = 0) => {
    setImageViewer({
      isOpen: true,
      images,
      currentIndex: startIndex,
      zoom: 1,
      panX: 0,
      panY: 0
    });
  };

  const closeImageViewer = () => {
    setImageViewer(prev => ({ ...prev, isOpen: false, panX: 0, panY: 0 }));
  };

  // Drag to scroll handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!detailScrollRef.current) return;
    isDragging.current = true;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStart.current = {
      y: clientY,
      scrollTop: detailScrollRef.current.scrollTop
    };
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !detailScrollRef.current) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const delta = dragStart.current.y - clientY;
    detailScrollRef.current.scrollTop = dragStart.current.scrollTop + delta;
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  // Fetch photos for selected item
  const { data: itemPhotos = [], isLoading: isPhotosLoading } = useQuery<any[]>({
    queryKey: ["/api/judgment-items", detailItem?.id, "photos"],
    queryFn: async () => {
      if (!detailItem) return [];
      const res = await fetch(`/api/judgment-items/${detailItem.id}/photos`);
      return res.json();
    },
    enabled: !!detailItem
  });

  // Fetch comments for selected item
  const { data: itemComments = [] } = useQuery<any[]>({
    queryKey: ["/api/judgment-items", detailItem?.id, "comments"],
    queryFn: async () => {
      if (!detailItem) return [];
      const res = await fetch(`/api/judgment-items/${detailItem.id}/comments`);
      return res.json();
    },
    enabled: !!detailItem
  });

  // [통합] serverEdits useQuery 제거됨 — inspection-content.json 사용

  // inspection-content.json 에서 직접 customEdits 구성
  useEffect(() => {
    const map: Record<string, CustomItemEdit> = {};
    for (const [id, c] of Object.entries(contentMap)) {
      const entry = c as ContentEntry;
      const revDates = (entry.revisions || [])
        .map(r => r.effectiveDate || "")
        .filter(Boolean)
        .sort((a, b) => b.localeCompare(a));
      const datesWithMemo = (entry.revisions || [])
        .sort((a, b) => (b.effectiveDate || "").localeCompare(a.effectiveDate || ""))
        .map(r => ({ date: r.effectiveDate || "", memo: r.description || "", label: "" }));
      map[id] = {
        id,
        text: entry.text || undefined,
        effectiveDate: entry.effectiveDate || undefined,
        introductionType: entry.introductionType as "new" | "revision" | undefined,
        customWarning: entry.customWarning || undefined,
        standardNote: (entry as any).standardNote || undefined,
        equipmentTypes: entry.equipmentTypes || [],
        permitEffectiveDate: entry.effectiveDate || undefined,
        enforcementType: 'general',
        standardDates: revDates,
        standardDatesWithMemo: datesWithMemo,
      };
    }
    setCustomEdits(map);
    localStorage.removeItem("judgmentCustomEdits");
  }, []);

  // Fetch custom inspection items from server
  const { data: serverCustomItems = [] } = useQuery<CustomInspectionItem[]>({
    queryKey: ["/api/custom-items"],
    queryFn: async () => {
      const res = await fetch("/api/custom-items");
      if (!res.ok) throw new Error("Failed to fetch custom items");
      return res.json();
    }
  });

  // 각 항목별 댓글 수 캐시
  const [itemCommentCounts, setItemCommentCounts] = useState<Record<string, number>>({});

  // 페이지 로드 시 전체 댓글 수 불러오기
  useEffect(() => {
    fetch("/api/judgment-items/comment-counts")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && typeof data === "object") {
          setItemCommentCounts(data);
        }
      })
      .catch(() => {});
  }, []);
  const [editSectionExpanded, setEditSectionExpanded] = useState(false);

  // [통합] baseItemMap — inspection-content.json 기반 (서버 fetch 없음)
  const baseItemMap = useMemo(() => {
    const map: Record<string, any> = {};
    for (const [id, c] of Object.entries(contentMap)) {
      const entry = c as ContentEntry;
      const revDates = (entry.revisions || [])
        .map(r => r.effectiveDate)
        .filter(Boolean)
        .sort((a, b) => (b || "").localeCompare(a || ""));
      map[id] = {
        itemId: id,
        text: entry.text,
        permitEffectiveDate: entry.effectiveDate,
        standardDates: JSON.stringify(revDates),
        equipmentTypes: JSON.stringify(entry.equipmentTypes || []),
      };
    }
    return map;
  }, []);

  // Sync custom items from server - use JSON stringified value as dependency to prevent infinite loops
  const serverCustomItemsJson = JSON.stringify(serverCustomItems);
  useEffect(() => {
    const parsedItems: CustomInspectionItem[] = JSON.parse(serverCustomItemsJson);
    const items = parsedItems.map(item => ({
      id: item.itemId,
      text: item.text,
      result: null as "적합" | "부적합" | "시정권고" | "해당없음" | "종전" | null,
      effectiveDate: item.effectiveDate || undefined,
      introductionType: item.introductionType as "new" | "revision" | undefined,
      sectionId: item.sectionId,
    }));
    setCustomItems(items);
    localStorage.removeItem("judgmentCustomItems");
  }, [serverCustomItemsJson]);

  // Mutation to add custom item to server
  const addCustomItem = useMutation({
    mutationFn: async (item: { itemId: string; sectionId: string; text: string; effectiveDate?: string; introductionType?: string }) => {
      const res = await fetch("/api/custom-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      if (!res.ok) throw new Error("Failed to add custom item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/custom-items"] });
    }
  });

  // Mutation to delete custom item from server
  const deleteCustomItem = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch(`/api/custom-items/${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete custom item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/custom-items"] });
    }
  });

  // Mutation to save inspection item edit to server
  // [통합] 관리자 저장 → inspection-content.json PC 직접 편집으로 이전 (API 저장 폐기)
  const saveInspectionEdit = { mutate: (_data: any, _opts?: any) => { _opts?.onSuccess?.(); } };

  const uploadPhoto = useMutation({
    mutationFn: async (file: File) => {
      if (!detailItem) throw new Error("No item selected");
      const formData = new FormData();
      formData.append("photo", file);
      const res = await fetch(`/api/judgment-items/${detailItem.id}/photos`, {
        method: "POST",
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/judgment-items", detailItem?.id, "photos"] });
      toast({ title: "사진이 업로드되었습니다" });
    },
    onError: (err: any) => {
      toast({ title: err.message || "사진 업로드 실패", variant: "destructive" });
    }
  });

  const deletePhoto = useMutation({
    mutationFn: async (photoId: number) => {
      await fetch(`/api/judgment-photos/${photoId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/judgment-items", detailItem?.id, "photos"] });
      toast({ title: "사진이 삭제되었습니다" });
    }
  });

  const replacePhoto = useMutation({
    mutationFn: async ({ photoId, file }: { photoId: number; file: File }) => {
      if (!detailItem) throw new Error("No item selected");
      await fetch(`/api/judgment-photos/${photoId}`, { method: "DELETE" });
      const formData = new FormData();
      formData.append("photo", file);
      const res = await fetch(`/api/judgment-items/${detailItem.id}/photos`, {
        method: "POST",
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/judgment-items", detailItem?.id, "photos"] });
      toast({ title: "사진이 변경되었습니다" });
    },
    onError: (err: any) => {
      toast({ title: err.message || "사진 변경 실패", variant: "destructive" });
    }
  });

  const reorderPhotos = useMutation({
    mutationFn: async (photoIds: number[]) => {
      if (!detailItem) throw new Error("No item selected");
      await fetch(`/api/judgment-items/${detailItem.id}/photos/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoIds })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/judgment-items", detailItem?.id, "photos"] });
    }
  });

  const handleMovePhotoUp = (index: number) => {
    if (index <= 0) return;
    const newOrder = [...itemPhotos];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    reorderPhotos.mutate(newOrder.map((p: any) => p.id));
  };

  const handleMovePhotoDown = (index: number) => {
    if (index >= itemPhotos.length - 1) return;
    const newOrder = [...itemPhotos];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    reorderPhotos.mutate(newOrder.map((p: any) => p.id));
  };

  const createComment = useMutation({
    mutationFn: async () => {
      if (!detailItem) throw new Error("No item selected");
      const res = await fetch(`/api/judgment-items/${detailItem.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/judgment-items", detailItem?.id, "comments"] });
      setNewComment({ author: "", content: "" });
      toast({ title: "댓글이 등록되었습니다" });
    }
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: number) => {
      await fetch(`/api/judgment-comments/${commentId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/judgment-items", detailItem?.id, "comments"] });
      toast({ title: "댓글이 삭제되었습니다" });
    }
  });

  const handleOpenDetail = (item: InspectionItem) => {
    setDetailItem(item);
    setIsDetailDialogOpen(true);
    // [통합] inspection-content.json 에서 직접 읽기
    const entry = contentMap[item.id] as ContentEntry | undefined;
    const revData = (entry?.revisions || []).map(r => ({
      id: undefined, item_id: item.id,
      effective_date: r.effectiveDate, expiry_date: r.expiryDate,
      introduction_type: r.introductionType, description: r.description,
    }));
    setRevisions(revData);
    setRevisionsCache(prev => ({...prev, [item.id]: revData}));
    setRevisionsLoading(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (itemPhotos.length >= 10) {
      toast({ title: "최대 10장까지 업로드 가능합니다", variant: "destructive" });
      return;
    }
    uploadPhoto.mutate(files[0]);
    e.target.value = "";
  };

  // Note: customItems and customEdits are now stored on server, not localStorage

  useEffect(() => {
    localStorage.setItem("judgmentResults", JSON.stringify(results));
  }, [results]);

  const handleAdminModeClick = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      toast({
        title: "관리자 모드 종료",
        description: "관리자 모드가 비활성화되었습니다.",
      });
    } else {
      setIsPasswordDialogOpen(true);
    }
  };

  const handlePasswordSubmit = () => {
    if (adminPassword === "910919") {
      setIsPasswordDialogOpen(false);
      setAdminPassword("");
      setIsAdminMode(true);
      toast({
        title: "관리자 모드 진입",
        description: "관리자 모드가 활성화되었습니다.",
      });
    } else {
      toast({
        title: "비밀번호 오류",
        description: "비밀번호가 올바르지 않습니다.",
        variant: "destructive",
      });
    }
  };

  const handleSaveConfirm = () => {
    const resultCount = Object.keys(results).length;
    const editCount = Object.keys(customEdits).length;
    toast({
      title: "저장 상태 확인",
      description: `현재 ${resultCount}개 항목의 판정 결과와 ${editCount}개 항목의 수정사항이 저장되었습니다.`,
    });
  };

  const handleOpenEditItem = (item: InspectionItem) => {
    if (!isAdminMode) return;
    const existingEdit = customEdits[item.id];
    setEditingItem(item);
    const dates: string[] = (() => {
      if ((existingEdit as any)?.standardDates?.length > 0) return (existingEdit as any).standardDates;
      const dbItem = baseItemMap[item.id];
      if (dbItem?.standardDates) {
        try {
          const parsed = JSON.parse(dbItem.standardDates);
          if (parsed.length > 0) return parsed;
        } catch {}
      }
      if (item.effectiveDate) return [item.effectiveDate];
      return [];
    })();
    setEditForm({
      id: item.id,
      text: existingEdit?.text ?? item.text,
      effectiveDate: existingEdit?.effectiveDate ?? item.effectiveDate ?? "",
      expiryDate: existingEdit?.expiryDate ?? item.expiryDate ?? "",
      introductionType: existingEdit?.introductionType ?? item.introductionType,
      permitEffectiveDate: (existingEdit as any)?.permitEffectiveDate ?? baseItemMap[item.id]?.permitEffectiveDate ?? "",
      standardEffectiveDate: (existingEdit as any)?.standardEffectiveDate ?? "",
      standardDates: dates,
      standardDatesWithMemo: (() => {
        // 저장된 편집값에 memo가 있으면 그대로, 없으면 빈 memo로
        const saved = (existingEdit as any)?.standardDatesWithMemo;
        if (saved?.length > 0) return saved;
        return dates.map(d => ({ date: d, memo: "" }));
      })(),
      revisions: [] as RevisionEntry[],
      customWarning: existingEdit?.customWarning ?? "",
      standardNote: (existingEdit as any)?.standardNote ?? "",
      equipmentTypes: (existingEdit as any)?.equipmentTypes ?? [],
      fixedResult: existingEdit?.fixedResult ?? (() => {
        // [v5] results[item.id]는 이제 배열. 단일 fixedResult로 변환
        const r = results[item.id];
        if (Array.isArray(r)) return r[0];
        return r as ResultType | undefined;
      })(),
    });
    // 통합 다이얼로그: detailItem도 설정해서 사진/댓글도 같이 표시
    setDetailItem(item);
    setIsDetailDialogOpen(true);
    // [통합] 개정 이력 편집용 — inspection-content.json 에서 직접 읽기
    const cEntry = contentMap[item.id] as ContentEntry | undefined;
    const editArr = (cEntry?.revisions || []).map(r => ({
      effectiveDate: r.effectiveDate || "",
      expiryDate: r.expiryDate || "",
      description: r.description || "",
    }));
    setEditRevisions(editArr);
    editRevisionsSnapshot.current = [];
  };

  const handleSaveItemEdit = () => {
    if (!editingItem) return;
    // 개정 편집 내용을 standardDates/standardDatesWithMemo에도 동기화 (판정 getItemStatus·상세표시용)
    const revForSync = [...editRevisions]
      .filter(r => r.effectiveDate || r.description)
      .sort((a, b) => (a.effectiveDate || "").localeCompare(b.effectiveDate || ""));
    const syncedForm = {
      ...editForm,
      standardDates: revForSync.map(r => r.effectiveDate || ""),
      standardDatesWithMemo: revForSync.map((r, i) => ({ date: r.effectiveDate || "", memo: r.description || "", label: `개정 ${i + 1}` })),
    };
    setCustomEdits(prev => ({
      ...prev,
      [editingItem.id]: syncedForm
    }));
    if (editForm.fixedResult) {
      setResults(prev => ({
        ...prev,
        [editingItem.id]: [editForm.fixedResult!]  // [v5] 배열로
      }));
    }
    
    // Save to server for all users (admin only)
    if (isAdminMode) {
      saveInspectionEdit.mutate(syncedForm, {
        onSuccess: () => {
          toast({
            title: "항목 수정 완료",
            description: "검사 항목이 저장되었습니다. 모든 사용자에게 반영됩니다.",
          });
        },
        onError: () => {
          toast({
            title: "저장 실패",
            description: "서버 저장에 실패했습니다. 다시 시도해주세요.",
            variant: "destructive",
          });
        }
      });
    } else {
      toast({
        title: "항목 수정 완료",
        description: "검사 항목이 수정되었습니다.",
      });
    }
    
    // [통합] 개정 이력 변경 → inspection-content.json PC 직접 편집으로 이전 (API 저장 폐기)
    
    setIsEditItemDialogOpen(false);
    setEditingItem(null);
  };

  const handleAddItem = () => {
    if (!addItemForm.sectionId || !addItemForm.text) {
      toast({
        title: "입력 오류",
        description: "섹션과 검사 내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    const newId = `custom-${Date.now()}`;
    
    // Save to server for all users (admin only)
    addCustomItem.mutate({
      itemId: newId,
      sectionId: addItemForm.sectionId,
      text: addItemForm.text,
      effectiveDate: addItemForm.effectiveDate || undefined,
      introductionType: addItemForm.introductionType || undefined,
    }, {
      onSuccess: () => {
        toast({
          title: "항목 추가 완료",
          description: "새 검사 항목이 추가되었습니다. 모든 사용자에게 반영됩니다.",
        });
      },
      onError: () => {
        toast({
          title: "추가 실패",
          description: "항목 추가에 실패했습니다. 다시 시도해주세요.",
          variant: "destructive",
        });
      }
    });
    
    setIsAddItemDialogOpen(false);
    setAddItemForm({ sectionId: "", text: "", effectiveDate: "", introductionType: "", permitEffectiveDate: "", standardEffectiveDate: "", standardDates: [], revisions: [] });
  };

  const handleDeleteCustomItem = (itemId: string) => {
    deleteCustomItem.mutate(itemId, {
      onSuccess: () => {
        setResults(prev => {
          const newResults = { ...prev };
          delete newResults[itemId];
          return newResults;
        });
        toast({
          title: "항목 삭제",
          description: "검사 항목이 삭제되었습니다. 모든 사용자에게 반영됩니다.",
        });
      },
      onError: () => {
        toast({
          title: "삭제 실패",
          description: "항목 삭제에 실패했습니다. 다시 시도해주세요.",
          variant: "destructive",
        });
      }
    });
  };

  // ═══════════════════════════════════════════════════════════════════
  // [패치 5] getItemWithEdits - permit_effective_date 우선 사용
  // ═══════════════════════════════════════════════════════════════════
  const getItemWithEdits = (item: InspectionItem): InspectionItem => {
    const edit = customEdits[item.id];
    if (!edit) return item;
    return {
      ...item,
      text: edit.text ?? item.text,
      // permit_effective_date 우선 → effective_date → 기본값
      effectiveDate: edit.permitEffectiveDate || edit.effectiveDate || item.effectiveDate,
      expiryDate: edit.expiryDate || item.expiryDate,
      introductionType: edit.introductionType ?? item.introductionType,
    };
  };

  const handleEquipmentTypeChange = (type: EquipmentType) => {
    setEquipmentType(type);
    const subtypes = EQUIPMENT_SUBTYPES[type];
    if (subtypes.length > 0) {
      setSubType(subtypes[0]);
    } else {
      setSubType("");
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // [v4 변경 1] referenceDate - 항상 검사기준 적용일(D2) 기준
  // ═══════════════════════════════════════════════════════════════════
  // 사용자 룰 (확정):
  //   D1 = D2 (신규/전면교체): T = D1 (= D2 = 같은 날짜)
  //   D1 ≠ D2 (수시교체): T = D2 (검사기준 적용일 기준)
  //   결론: 모든 경우 T = D2
  // installType은 UI 정보 표시용으로 유지 (판정에는 사용 안 함)
  const referenceDate = useMemo(() => {
    if (inspectionDate) return new Date(inspectionDate);
    if (permitDate) return new Date(permitDate);
    return null;
  }, [inspectionDate, permitDate]);

  // 기준일 체계 안내 텍스트
  const referenceDateInfo = useMemo(() => {
    if (!referenceDate && !completionDate) return null;
    const items = [];
    if (permitDate) items.push(`건축허가일: ${permitDate}`);
    if (inspectionDate) items.push(`검사기준 적용일: ${inspectionDate}`);
    if (completionDate) {
      const comp = new Date(completionDate);
      const cutoff = new Date("2012-03-14");
      items.push(`완성검사일: ${completionDate}${comp <= cutoff ? " (종전기준 적용)" : ""}`);
    }
    return items;
  }, [permitDate, inspectionDate, completionDate, referenceDate]);

  // 현재 선택된 승강기 종류 필터키
  const currentFilterKey = useMemo(() => {
    if (subType) return `${equipmentType}-${subType}`;
    return equipmentType;
  }, [equipmentType, subType]);

  // 선택 종류 → 정기검사기준 섹션번호 (별표2: 1.엘리베이터 / 2.경사형 / 3.에스컬레이터 / 4.덤웨이터 / 5.수직형휠체어 / 6.경사형휠체어)
  const sectionPrefix = useMemo(() => {
    if (equipmentType === "엘리베이터") return subType === "경사형" ? "2" : "1";
    if (equipmentType === "에스컬레이터") return "3";
    if (equipmentType === "덤웨이터") return "4";
    if (equipmentType === "휠체어리프트") return subType === "경사형" ? "6" : "5";
    return "1";
  }, [equipmentType, subType]);

  // 현재 종류에 해당하는 최상위 섹션만 표시 (예: 경사형 선택 시 2.x만)
  const visibleSections = useMemo(
    () => INSPECTION_DATA_MR.filter(s => s.id.split(".")[0] === sectionPrefix),
    [sectionPrefix]
  );

  // 항목이 현재 승강기 종류에 해당하는지 확인
  const isItemApplicable = useCallback((itemId: string): boolean => {
    const edit = customEdits[itemId];
    const types: string[] = (edit as any)?.equipmentTypes || [];
    if (types.length === 0) return true; // 미지정이면 모두 표시
    return types.some(t => {
      if (t === currentFilterKey) return true;
      if (subType && t === subType) return true; // 바 태그(예: 에스컬레이터/무빙워크) 매칭
      // 대분류만 체크 (예: "엘리베이터" 선택 시 "엘리베이터-전기식(MR)"도 포함)
      if (t.startsWith(equipmentType + "-") && !subType) return true;
      if (t === equipmentType && !subType) return true;
      return false;
    });
  }, [customEdits, currentFilterKey, equipmentType, subType]);

  // ═══════════════════════════════════════════════════════════════════
  // [v4 변경 2] getItemStatus - 새 3단계 룰
  // ═══════════════════════════════════════════════════════════════════
  // P = effectiveDate (= 가장 오래된 날짜 = 최초 도입일)
  // L = standard_dates 중 가장 최근 개정일 (현행 본문 시행일)
  //
  // retroactive (소급): 시점 무관 항상 "applicable"
  // T < P            : "not-applicable" (조문 도입 전, 해당없음 고정)
  // P ≤ T < L        : "previous" (옛 기준 시기, 종전 가능 안내)
  // T ≥ L            : "applicable" (현행 시기, 직접 평가)
  const getItemStatus = (item: InspectionItem): "applicable" | "previous" | "not-applicable" => {
    if (!referenceDate) return "applicable";
    
    const edit = customEdits[item.id];
    
    // [v3] retroactive 항목: 시점 무관 항상 검사 대상
    const enforcementType = (edit as any)?.enforcementType;
    if (enforcementType === 'retroactive') {
      return "applicable";
    }
    
    // expiryDate: 만료된 항목
    if (item.expiryDate) {
      const expiryDate = new Date(item.expiryDate);
      if (referenceDate > expiryDate) return "not-applicable";
    }
    
    // [v4] P (가장 오래된 날짜) 비교
    if (!item.effectiveDate) return "applicable";
    const P = new Date(item.effectiveDate);
    
    if (referenceDate < P) {
      return "not-applicable";  // 조문 도입 전
    }
    
    // [v4] 최근 개정일 L 계산 (standard_dates 중 가장 최근)
    const standardDates: string[] = (edit as any)?.standardDates || [];
    let L = P;  // 기본값 (개정 이력 없으면 P = L)
    for (const dateStr of standardDates) {
      const d = new Date(dateStr);
      if (d > L) L = d;
    }
    
    // P ≤ T < L: 옛 기준 시기 (종전 가능)
    if (referenceDate < L) {
      return "previous";
    }
    
    // T ≥ L: 현행 시기
    return "applicable";
  };

  // ═══════════════════════════════════════════════════════════════════
  // [v5] getAutoResults - 안내된 옵션 모두 자동 선택 (배열 반환)
  // ═══════════════════════════════════════════════════════════════════
  // 사용자 룰: 상태별로 안내 옵션을 모두 자동 선택
  //   not-applicable          → ["해당없음"]
  //   previous                → ["종전","적합","부적합","시정권고","해당없음"]
  //   applicable + retroactive → ["적합","부적합","시정권고","해당없음"]
  //   applicable + 일반         → ["적합","부적합","시정권고"]
  const getAutoResults = (item: InspectionItem): ResultType[] => {
    const status = getItemStatus(item);
    if (status === "not-applicable") return ["해당없음"];
    
    const edit = customEdits[item.id];
    const enforcementType = (edit as any)?.enforcementType;
    
    if (status === "previous") {
      return ["종전", "적합", "부적합", "시정권고", "해당없음"];
    }
    if (status === "applicable") {
      if (enforcementType === "retroactive") {
        return ["적합", "부적합", "시정권고", "해당없음"];
      }
      return ["적합", "부적합", "시정권고"];
    }
    return [];
  };
  
  // 하위 호환 (단일 결과 기대하는 곳에서 사용 - 첫 번째 자동 결과 반환)
  const getAutoResult = (item: InspectionItem): ResultType | null => {
    const auto = getAutoResults(item);
    return auto.length === 1 ? auto[0] : null;
  };

  const collectAllItems = useCallback((sections: InspectionSection[]): InspectionItem[] => {
    const items: InspectionItem[] = [];
    const processSection = (section: InspectionSection) => {
      if (section.items) {
        items.push(...section.items);
      }
      if (section.subsections) {
        section.subsections.forEach(processSection);
      }
    };
    sections.forEach(processSection);
    // 커스텀 항목도 추가
    items.push(...customItems);
    return items;
  }, [customItems]);

  const collectAllSectionIds = useCallback((sections: InspectionSection[]): string[] => {
    const ids: string[] = [];
    const processSection = (section: InspectionSection) => {
      ids.push(section.id);
      if (section.subsections) {
        section.subsections.forEach(processSection);
      }
    };
    sections.forEach(processSection);
    return ids;
  }, []);

  const expandAll = () => {
    const allIds = collectAllSectionIds(INSPECTION_DATA_MR);
    setExpandedSections(new Set(allIds));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  // ═══════════════════════════════════════════════════════════════════
  // [v5.2] 검사기준 적용일 변경 감지 - results 자동 초기화 (토스트 제거)
  // ═══════════════════════════════════════════════════════════════════
  // 사용자가 검사기준 적용일을 변경하면 모든 검사 항목의 결과를 초기화하여
  // 자동 안내된 옵션이 새 시점에 맞춰 표시되도록 함
  const prevInspectionDateRef = useRef<string | null>(null);
  
  useEffect(() => {
    // 첫 마운트: 초기값 기록만 하고 초기화 안 함 (localStorage 데이터 보존)
    if (prevInspectionDateRef.current === null) {
      prevInspectionDateRef.current = inspectionDate;
      return;
    }
    
    // 검사기준 적용일 변경 → 모든 검사 항목 결과 초기화
    if (prevInspectionDateRef.current !== inspectionDate) {
      prevInspectionDateRef.current = inspectionDate;
      setResults({});  // 모든 항목 자동 안내된 옵션으로 재표시
    }
  }, [inspectionDate]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // [v5.2] toggleResult: 다중 선택 + 첫 클릭 시 자동 선택을 기본값으로 복사
  // 사용자가 처음 클릭하면 results에 autoResults를 먼저 복사한 후 그 옵션을 토글
  // → 자동 선택된 다른 옵션들이 유지되면서 클릭한 옵션만 토글됨
  const toggleResult = (itemId: string, result: ResultType, autoResults: ResultType[]) => {
    setResults(prev => {
      let current = prev[itemId];
      
      // 첫 클릭: results에 항목이 없으면 autoResults를 기본값으로 복사
      if (current === undefined) {
        current = [...autoResults];
      }
      
      // 토글: 이미 선택되어 있으면 해제, 미선택이면 추가
      const newArr = current.includes(result)
        ? current.filter(r => r !== result)
        : [...current, result];
      return { ...prev, [itemId]: newArr };
    });
  };
  
  // 하위 호환을 위한 setResult (단일 선택 강제)
  const setResult = (itemId: string, result: ResultType) => {
    setResults(prev => ({ ...prev, [itemId]: [result] }));
  };

  // ═══════════════════════════════════════════════════════════════════
  // [v5] renderResultButton - 다중 선택 UI
  // ═══════════════════════════════════════════════════════════════════
  // 사용자 룰: 안내된 옵션 모두 자동 선택, 검사원이 클릭으로 토글
  // - 다중 선택 가능 (체크박스 동작)
  // - 자동 선택 시 안내된 모든 옵션이 미리 선택됨
  // - 검사원이 잘못된 옵션 클릭하여 해제 가능
  const renderResultButton = (itemId: string, resultType: ResultType, status: "applicable" | "previous" | "not-applicable", autoResults: ResultType[]) => {
    const userResults = results[itemId];
    const hasUserChoice = userResults !== undefined;
    const isSelected = hasUserChoice 
      ? (userResults || []).includes(resultType)
      : autoResults.includes(resultType);
    const isAutoSelected = !hasUserChoice && autoResults.includes(resultType);
    const isDisabled = (status === "not-applicable" && resultType !== "해당없음");
    
    const baseClasses = "px-1.5 py-0.5 text-[10px] rounded border transition-all min-w-[32px] leading-tight";
    
    if (isSelected) {
      return (
        <button
          className={cn(
            baseClasses, 
            isAutoSelected 
              ? "bg-amber-500 text-white border-amber-500 ring-2 ring-amber-300" 
              : "bg-primary text-primary-foreground border-primary"
          )}
          onClick={() => !isDisabled && toggleResult(itemId, resultType, autoResults)}
          data-testid={`result-${itemId}-${resultType}`}
        >
          {resultType}
        </button>
      );
    }
    
    return (
      <button
        className={cn(
          baseClasses,
          isDisabled 
            ? "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-50" 
            : "bg-background hover:bg-accent border-border"
        )}
        onClick={() => !isDisabled && toggleResult(itemId, resultType, autoResults)}
        disabled={isDisabled}
        data-testid={`result-${itemId}-${resultType}`}
      >
        {resultType}
      </button>
    );
  };

  const renderItem = (originalItem: InspectionItem) => {
    const item = getItemWithEdits(originalItem);
    const status = getItemStatus(item);
    const autoResults = getAutoResults(item);  // [v5] 다중 선택용 배열
    const hasCustomEdit = !!customEdits[item.id];
    
    return (
      <div 
        key={item.id} 
        className={cn(
          "border-b border-border last:border-b-0",
          false
        )}
      >
        <div className="flex items-start gap-2 p-3">
          <div className="flex items-center justify-center w-5 h-5 mt-0.5 shrink-0">
            {isAdminMode ? (
              <button
                onClick={() => handleOpenEditItem(item)}
                className="p-1 hover:bg-accent rounded transition-colors"
                data-testid={`edit-item-${item.id}`}
              >
                <Pencil className="w-4 h-4 text-primary" />
              </button>
            ) : (
              <Check className="w-4 h-4 text-primary" />
            )}
          </div>
          <div 
            className="flex-1 text-xs leading-relaxed cursor-pointer hover:text-primary"
            onClick={() => handleOpenDetail(item)}
          >
            {item.text}
            {hasCustomEdit && (
              <span className="ml-2 text-xs text-muted-foreground font-medium">(수정됨)</span>
            )}
            {itemCommentCounts[item.id] > 0 && (
              <span className="ml-1 text-xs font-medium text-orange-500">(댓글 {itemCommentCounts[item.id]})</span>
            )}
          </div>
          <button
            onClick={() => handleOpenDetail(item)}
            className="p-1 hover:bg-accent rounded transition-colors shrink-0"
            title="사진/댓글 보기"
            data-testid={`detail-item-${item.id}`}
          >
            <Image className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <div className="flex gap-0.5 shrink-0">
            {renderResultButton(item.id, "적합", status, autoResults)}
            {renderResultButton(item.id, "부적합", status, autoResults)}
            {renderResultButton(item.id, "시정권고", status, autoResults)}
            {renderResultButton(item.id, "해당없음", status, autoResults)}
            {renderResultButton(item.id, "종전", status, autoResults)}
          </div>
          {isAdminMode && item.id.startsWith("custom-") && (
            <button
              onClick={() => handleDeleteCustomItem(item.id)}
              className="p-1 hover:bg-red-100 rounded transition-colors ml-2"
              data-testid={`delete-item-${item.id}`}
              title="삭제"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          )}
        </div>
        {/* ═══════════════════════════════════════════════════════════════
            [v4 변경 4] 안내문구 — 4개 상태 통일된 형식
            ═══════════════════════════════════════════════════════════════
            모든 상태가 동일한 형식:
              ※ [기준 시점 설명]
                 [상황 설명]
                 [가능한 옵션 안내]
            
            버튼은 모든 상태에서 유지, 안내문구만 동적                      */}
        {status === "not-applicable" && referenceDate && (
          <div className="px-4 pb-2 text-xs text-gray-600 ml-10">
            ※ 이 검사기준은 <strong>{item.effectiveDate || "도입일 이전"}</strong>부터 도입된 항목입니다.
            <br />
            입력하신 검사기준 적용일({referenceDate.toISOString().split('T')[0]})에는 적용되지 않아 「해당없음」으로 자동 처리됩니다.
          </div>
        )}
        {status === "previous" && referenceDate && (() => {
          const standardDates: string[] = (customEdits[item.id] as any)?.standardDates || [];
          let latestDate = item.effectiveDate || '';
          for (const d of standardDates) {
            if (d > latestDate) latestDate = d;
          }
          return (
            <div className="px-4 pb-2 text-xs text-amber-600 ml-10">
              ※ 이 검사기준은 <strong>{item.effectiveDate}</strong>부터 도입되어 <strong>{latestDate}</strong>에 개정되었습니다.
              <br />
              입력하신 검사기준 적용일({referenceDate.toISOString().split('T')[0]})에는 옛 본문이 적용됩니다.
              <br />
              현장 상태를 확인하여 직접 판정해주세요:
              <br />
              · 옛 본문에 부합 → 「종전」
              <br />
              · 현행 기준({latestDate}~)에 이미 부합 → 「적합」
              <br />
              · 미흡 → 「부적합」 / 「시정권고」
              <br />
              · 해당 설비 없음 → 「해당없음」
            </div>
          );
        })()}
        {/* [v3] retroactive 항목: 소급적용 안내 */}
        {status === "applicable" && referenceDate && 
         (customEdits[item.id] as any)?.enforcementType === 'retroactive' && (
          <div className="px-4 pb-2 text-xs text-red-600 ml-10">
            ⚠️ <strong>소급적용 항목</strong>: 이 검사기준은 건축허가일·검사기준 적용일과 무관하게 <strong>항상 검사 대상</strong>입니다.
            <br />
            (근거: 승강기 검사기준 부칙 제2조 ① 단서)
            <br />
            현장 상태를 확인하여 직접 판정해주세요:
            <br />
            · 현행 기준 충족 → 「적합」
            <br />
            · 미흡 → 「부적합」 / 「시정권고」
            <br />
            · 해당 설비 없음 → 「해당없음」
          </div>
        )}
        {/* [v4] applicable + 일반: 종전/해당없음 안내 제외 (현행 적용 시점이므로) */}
        {status === "applicable" && referenceDate && 
         (customEdits[item.id] as any)?.enforcementType !== 'retroactive' && (() => {
          const standardDates: string[] = (customEdits[item.id] as any)?.standardDates || [];
          let latestDate = item.effectiveDate || '';
          for (const d of standardDates) {
            if (d > latestDate) latestDate = d;
          }
          return (
            <div className="px-4 pb-2 text-xs text-blue-600 ml-10">
              ※ 이 검사기준은 <strong>{latestDate || item.effectiveDate}</strong>부터 현행 적용되는 기준입니다.
              <br />
              현장 상태를 확인하여 직접 판정해주세요:
              <br />
              · 현행 기준 부합 → 「적합」
              <br />
              · 미흡 → 「부적합」 / 「시정권고」
            </div>
          );
        })()}
        {customEdits[item.id]?.customWarning && (
          <div className="px-4 pb-2 text-xs text-blue-600 ml-10 font-medium bg-blue-50 rounded mx-4 p-2 whitespace-pre-wrap">
            ※ {customEdits[item.id].customWarning}
          </div>
        )}
      </div>
    );
  };

  const getCustomItemsForSection = (sectionId: string) => {
    return customItems.filter(item => (item as any).sectionId === sectionId);
  };

  // 섹션에 현재 선택 종류로 표시할 내용이 있는지 (재귀)
  const sectionHasVisibleContent = (section: InspectionSection): boolean => {
    if ((section.items || []).some(i => isItemApplicable(i.id))) return true;
    if (getCustomItemsForSection(section.id).length > 0) return true;
    return (section.subsections || []).some(sub => sectionHasVisibleContent(sub));
  };

  const renderSection = (section: InspectionSection, depth: number = 0) => {
    const isExpanded = expandedSections.has(section.id);
    const sectionCustomItems = getCustomItemsForSection(section.id);
    const visibleItems = (section.items || []).filter(item => isItemApplicable(item.id));
    const visibleSubs = (section.subsections || []).filter(sub => sectionHasVisibleContent(sub));
    if (visibleItems.length === 0 && visibleSubs.length === 0 && sectionCustomItems.length === 0) return null; // 현재 종류로 표시할 항목 없으면 섹션 숨김
    const hasContent = (section.items && section.items.length > 0) || 
                       (section.subsections && section.subsections.length > 0) ||
                       sectionCustomItems.length > 0;
    
    return (
      <div key={section.id} className={cn("border-b border-border")}>
        <button
          className={cn(
            "w-full flex items-center gap-2 p-3 text-left hover:bg-accent/50 transition-colors",
            depth === 0 && "font-semibold text-primary",
            depth === 1 && "pl-6 text-sm text-muted-foreground",
            depth === 2 && "pl-10 text-sm text-blue-600"
          )}
          onClick={() => hasContent && toggleSection(section.id)}
          data-testid={`section-${section.id}`}
        >
          {hasContent ? (
            isExpanded ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />
          ) : (
            <div className="w-4 h-4 shrink-0" />
          )}
          <span>{section.title}</span>
          {sectionCustomItems.length > 0 && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
              +{sectionCustomItems.length}
            </span>
          )}
        </button>
        
        {isExpanded && (
          <div className={cn(depth > 0 && "bg-background")}>
            {visibleSubs.map(sub => renderSection(sub, depth + 1))}
            {visibleItems.map(item => renderItem(item))}
            {sectionCustomItems.map(item => (
              <div key={item.id} className="bg-blue-50 border-l-4 border-l-blue-500">
                {renderItem(item)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div ref={zoomContentRef} className="min-h-screen bg-background font-sans text-foreground">
        <div className="bg-card border-b border-border overflow-hidden">
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  E
                </div>
                <h1 className="text-lg font-bold tracking-tight">검사가이드</h1>
              </div>
            <div className="flex items-center gap-2">
              {isAdminMode && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsAddItemDialogOpen(true)}
                    className="shrink-0 shadow-sm hover:shadow-md transition-all"
                    data-testid="button-add-item"
                    title="항목 추가"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSaveConfirm}
                    className="shrink-0 shadow-sm hover:shadow-md transition-all"
                    data-testid="button-save-judgment"
                    title="저장 확인"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button
                variant={isAdminMode ? "default" : "outline"}
                size="icon"
                onClick={handleAdminModeClick}
                className={cn(
                  "shrink-0 shadow-sm hover:shadow-md transition-all",
                  isAdminMode && "bg-red-500 hover:bg-red-600"
                )}
                data-testid="button-admin-mode-judgment"
                title={isAdminMode ? "관리자 모드 종료" : "관리자 모드 진입"}
              >
                <Settings2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            승강기 종류와 날짜를 입력하면 검사기준 적용 여부를 자동으로 판정합니다.
          </p>

          {/* 승강기 종류 선택 */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">승강기 종류</Label>
              <Select
                value={equipmentType}
                onValueChange={(value) => handleEquipmentTypeChange(value as EquipmentType)}
              >
                <SelectTrigger className="text-xs h-9" data-testid="select-equipment-type">
                  <SelectValue placeholder="종류 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="엘리베이터">엘리베이터</SelectItem>
                  <SelectItem value="에스컬레이터">에스컬레이터</SelectItem>
                  <SelectItem value="덤웨이터">덤웨이터</SelectItem>
                  <SelectItem value="휠체어리프트">휠체어리프트</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {EQUIPMENT_SUBTYPES[equipmentType]?.length > 0 && (
              <div className="space-y-1">
                <Label className="text-xs font-semibold">세부 종류</Label>
                <Select value={subType} onValueChange={setSubType}>
                  <SelectTrigger className="text-xs h-9" data-testid="select-sub-type">
                    <SelectValue placeholder="세부 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_SUBTYPES[equipmentType].map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* 날짜 입력 */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">건축허가일자</Label>
              <Input
                id="permitDate"
                type="date"
                value={permitDate}
                onChange={(e) => { setPermitDate(e.target.value); setInstallType(""); }}
                data-testid="input-permit-date"
                className="text-xs h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">검사기준 적용일</Label>
              <Input
                id="inspectionDate"
                type="date"
                value={inspectionDate}
                onChange={(e) => { setInspectionDate(e.target.value); setInstallType(""); }}
                data-testid="input-inspection-date"
                className="text-xs h-9"
              />
            </div>
          </div>

          {/* 건축허가일과 검사기준적용일이 다를 때 교체 유형 선택 */}
          {permitDate && inspectionDate && permitDate !== inspectionDate && (
            <div className="mb-2 space-y-1">
              <Label className="text-xs font-semibold">교체 구분</Label>
              <Select value={installType} onValueChange={(v) => setInstallType(v as "전면교체" | "수시교체")}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="교체 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전면교체">전면교체 (승강기 전체 교체)</SelectItem>
                  <SelectItem value="수시교체">수시교체 (부품 일부 교체·개조)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">건축허가일과 검사기준 적용일이 다른 경우 선택하세요</p>
            </div>
          )}

          {/* 기준일 안내 */}
          {(permitDate || inspectionDate) && (
            <div className="p-2.5 bg-blue-500/10 rounded-lg border border-blue-500/20 text-xs space-y-0.5 mb-2">
              {permitDate && <p className="text-foreground">건축허가일: <strong>{permitDate}</strong></p>}
              {inspectionDate && <p className="text-foreground">검사기준 적용일: <strong>{inspectionDate}</strong></p>}
              {installType && <p className="text-primary font-medium">교체 구분: {installType}</p>}
              <p className="text-[10px] text-blue-500 mt-1">
                {permitDate && inspectionDate && permitDate !== inspectionDate
                  ? `${permitDate > inspectionDate ? permitDate : inspectionDate} 기준으로 판정됩니다.`
                  : "입력된 날짜 기준으로 검사항목 적용 여부가 판정됩니다."}
              </p>
            </div>
          )}
        </div>

        <div className="overflow-hidden">
          <div className="flex items-center justify-end gap-1.5 p-1.5 bg-card border-b border-border">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={expandAll}
              data-testid="button-expand-all"
            >
              전체 펼치기
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={collapseAll}
              data-testid="button-collapse-all"
            >
              전체 접기
            </Button>
          </div>
          <div className="bg-muted/50 border-b border-border">
            <div className="flex items-center">
              <div className="flex-1 p-3 font-semibold text-center border-r border-border">검사기준</div>
              <div className="w-9 p-2 text-[10px] font-semibold text-center border-r border-border">적합</div>
              <div className="w-9 p-2 text-[10px] font-semibold text-center border-r border-border">부적합</div>
              <div className="w-9 p-2 text-[10px] font-semibold text-center border-r border-border">시정<br/>권고</div>
              <div className="w-9 p-2 text-[10px] font-semibold text-center border-r border-border">해당<br/>없음</div>
              <div className="w-9 p-2 text-[10px] font-semibold text-center">종전</div>
            </div>
          </div>
          
          <div className="max-h-[600px] overflow-y-auto">
            {visibleSections.map(section => renderSection(section))}
          </div>
        </div>
      </div>

      {/* Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>관리자 모드</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password-judgment">비밀번호 입력</Label>
              <Input
                id="admin-password-judgment"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
                data-testid="input-admin-password-judgment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>취소</Button>
            <Button onClick={handlePasswordSubmit} data-testid="button-submit-password-judgment">확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}


      {/* 항목 추가 다이얼로그 */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>검사 항목 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-item-section">추가할 섹션 *</Label>
              <Select
                value={addItemForm.sectionId}
                onValueChange={(value) => setAddItemForm(prev => ({ ...prev, sectionId: value }))}
              >
                <SelectTrigger id="add-item-section" data-testid="select-add-item-section">
                  <SelectValue placeholder="섹션 선택" />
                </SelectTrigger>
                <SelectContent>
                  {collectAllSectionIds(INSPECTION_DATA_MR).map((sectionId) => (
                    <SelectItem key={sectionId} value={sectionId}>{sectionId}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-item-text">검사 내용 *</Label>
              <Textarea
                id="add-item-text"
                value={addItemForm.text}
                onChange={(e) => setAddItemForm(prev => ({ ...prev, text: e.target.value }))}
                placeholder="검사 항목 내용을 입력하세요"
                rows={3}
                data-testid="input-add-item-text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-item-effective-date">적용일 (선택)</Label>
              <Input
                id="add-item-effective-date"
                type="date"
                value={addItemForm.effectiveDate}
                onChange={(e) => setAddItemForm(prev => ({ ...prev, effectiveDate: e.target.value }))}
                data-testid="input-add-item-effective-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-item-intro-type">도입유형 (선택)</Label>
              <Select
                value={addItemForm.introductionType}
                onValueChange={(value) => setAddItemForm(prev => ({ 
                  ...prev, 
                  introductionType: value as "" | "new" | "revision" 
                }))}
              >
                <SelectTrigger id="add-item-intro-type" data-testid="select-add-item-intro-type">
                  <SelectValue placeholder="선택 안함" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">신규</SelectItem>
                  <SelectItem value="revision">개정</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>취소</Button>
            <Button onClick={handleAddItem} data-testid="button-confirm-add-item">추가</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 항목 상세보기 다이얼로그 (사진/댓글) */}
      <Dialog open={isDetailDialogOpen} onOpenChange={(open) => {
          setIsDetailDialogOpen(open);
          if (!open) setEditSectionExpanded(false);
        }}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onOpenAutoFocus={e => e.preventDefault()}>
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-base">
              항목 상세보기
            </DialogTitle>
          </DialogHeader>
          {detailItem && (
            <div className="flex-1 overflow-y-auto flex flex-col">
              {/* 관리자 편집 섹션 */}
              {isAdminMode && editingItem?.id === detailItem.id && (
                <div className="border border-primary/30 rounded-xl bg-primary/5 mb-4">
                  <button
                    className="w-full flex items-center justify-between p-4 text-left"
                    onClick={() => setEditSectionExpanded(prev => !prev)}
                  >
                    <h3 className="font-semibold text-sm text-primary">✏️ 항목 수정</h3>
                    <span className="text-xs text-primary">{editSectionExpanded ? "▲ 접기" : "▼ 펼치기"}</span>
                  </button>
                  {editSectionExpanded && <div className="px-4 pb-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">검사 내용</label>
                    <Textarea
                      value={editForm.text || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, text: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">검사기준</label>
                    <Textarea
                      value={(editForm as any).standardNote || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, standardNote: e.target.value } as any))}
                      placeholder="검사기준 내용 입력 (예: 엘리베이터 안전기준 14.5.5)"
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">입력 시 항목 하단에 회색으로 표시됩니다</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">적용 승강기 종류 (복수 선택 가능)</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "엘리베이터-전기식(MR)", "엘리베이터-전기식(MRL)", "엘리베이터-유압식", "엘리베이터-경사형",
                        "에스컬레이터", "무빙워크", "덤웨이터", "휠체어리프트-수직형", "휠체어리프트-경사형"
                      ].map(type => {
                        const selected = ((editForm as any).equipmentTypes || []).includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              const cur: string[] = (editForm as any).equipmentTypes || [];
                              const next = selected ? cur.filter(t => t !== type) : [...cur, type];
                              setEditForm(prev => ({ ...prev, equipmentTypes: next } as any));
                            }}
                            className={`text-xs px-2 py-1 rounded-full border transition-colors ${selected ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">선택 안 하면 전체 종류에 표시됩니다</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">건축허가일자 이후 적용</label>
                    <Input
                      type="date"
                      value={editForm.permitEffectiveDate || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, permitEffectiveDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-muted-foreground">검사기준 적용일 (개정)</label>
                      <Button type="button" variant="outline" size="sm"
                        onClick={() => setEditRevisions(prev => [...prev, { effectiveDate: "", expiryDate: "", description: "" }])}
                        disabled={editRevisions.length >= 20}
                      >+ 개정 추가</Button>
                    </div>
                    {editRevisions.map((rev, idx) => (
                      <div key={rev.id ?? `new-${idx}`} className="border border-amber-400/40 rounded-lg p-3 bg-amber-500/5 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-amber-600">개정 {idx + 1}</span>
                          <Button type="button" variant="ghost" size="sm"
                            onClick={() => setEditRevisions(prev => prev.filter((_, i) => i !== idx))}
                            className="text-destructive px-2 ml-auto"
                          >✕</Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="text-[10px] text-muted-foreground">시행일</label>
                            <Input type="date" value={rev.effectiveDate}
                              onChange={(e) => setEditRevisions(prev => prev.map((r, i) => i === idx ? { ...r, effectiveDate: e.target.value } : r))} />
                          </div>
                          <div className="flex-1">
                            <label className="text-[10px] text-muted-foreground">만료일 (다음 개정 전까지)</label>
                            <Input type="date" value={rev.expiryDate}
                              onChange={(e) => setEditRevisions(prev => prev.map((r, i) => i === idx ? { ...r, expiryDate: e.target.value } : r))} />
                          </div>
                        </div>
                        <Textarea value={rev.description} rows={3}
                          placeholder="개정 본문 (해당 시기 적용 기준)"
                          onChange={(e) => setEditRevisions(prev => prev.map((r, i) => i === idx ? { ...r, description: e.target.value } : r))}
                          className="text-xs" />
                      </div>
                    ))}
                    {editRevisions.length === 0 && (
                      <p className="text-xs text-muted-foreground">개정 추가 버튼으로 이 항목의 개정 이력을 입력/수정하세요. (저장 시 현행 DB에 반영)</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">판정 결과 고정</label>
                    <div className="flex gap-2 flex-wrap">
                      {(["적합","부적합","시정권고","해당없음","종전"] as ResultType[]).map(r => (
                        <Button key={r} type="button" size="sm"
                          variant={editForm.fixedResult === r ? "default" : "outline"}
                          onClick={() => setEditForm(prev => ({ ...prev, fixedResult: prev.fixedResult === r ? undefined : r }))}
                        >{r}</Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">※ 안내문구 (선택사항)</label>
                    <Textarea
                      value={editForm.customWarning || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, customWarning: e.target.value }))}
                      placeholder="이 항목에 표시할 특별 안내문구"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    {customEdits[editForm.id] && (
                      <Button variant="destructive" size="sm" onClick={() => {
                        setCustomEdits(prev => { const n = {...prev}; delete n[editForm.id]; return n; });
                        toast({ title: "수정 초기화", description: "원본 데이터로 복원되었습니다." });
                      }}>초기화</Button>
                    )}
                    <Button size="sm" onClick={handleSaveItemEdit}>저장</Button>
                  </div>
                  </div>}
                </div>
              )}
              <div className="p-3 bg-muted rounded-lg text-sm mb-4">
                <p className="leading-relaxed">{detailItem.text}</p>
                {(customEdits[detailItem.id] as any)?.standardNote && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground font-medium mb-1">📋 검사기준</p>
                    <p className="text-xs text-foreground whitespace-pre-wrap max-h-24 overflow-y-auto">{(customEdits[detailItem.id] as any).standardNote}</p>
                  </div>
                )}
              </div>
              
              <div 
                ref={detailScrollRef}
                className="flex-1 overflow-y-auto cursor-grab active:cursor-grabbing select-none"
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              >
                <div className="space-y-6 pr-4">
                  {/* 검사기준 적용일 (개정) 섹션 */}
                  {(() => {
                    const itemEdit = customEdits[detailItem.id];
                    const dbItem = baseItemMap[detailItem.id];
                    // 개정 이력은 항목 id로 키된 캐시에서 읽어 항목 전환 시에도 정확히 표시 (공유 상태 revisions 미사용)
                    const detailRevisions = revisionsCache[detailItem.id] || [];
                    // customEdits 우선, 없으면 DB(standardDates) 사용
                    const datesWithMemo: {date: string; memo: string; label?: string}[] = (() => {
                      if ((itemEdit as any)?.standardDatesWithMemo?.length > 0) return (itemEdit as any).standardDatesWithMemo;
                      if (dbItem?.standardDates) {
                        try {
                          const parsed = JSON.parse(dbItem.standardDates);
                          if (parsed.length > 0) return parsed
                            .filter((r: any) => !r.pending)  // 피난용 등 보관중 항목 제외
                            .map((r: any, i: number) => ({
                            date: r.date || r,
                            memo: r.text || '',
                            label: `개정 ${i + 1} (${detailItem.id})`,
                            raw_label: r.raw_label || '',
                            is_old: r.is_old
                          }));
                        } catch {}
                      }
                      return [];
                    })();
                    const dates: string[] = (itemEdit as any)?.standardDates || [];
                    const permitDate = (itemEdit as any)?.permitEffectiveDate || dbItem?.permitEffectiveDate;
                    const hasData = datesWithMemo.length > 0 || dates.length > 0 || permitDate || detailRevisions.length > 0;
                    if (!hasData) return null;
                    return (
                      <div className="border border-border rounded-xl p-4 bg-muted/20">
                        <h3 className="font-medium text-sm mb-3">📅 검사기준 적용일 (개정)</h3>
                        {(() => {
                          let list: {date: string; description: string; key: string}[] = [];
                          if (datesWithMemo.length > 0) {
                            list = datesWithMemo.map((e: any, i: number) => ({ date: e.date || "", description: e.memo || "", key: `dm-${i}` }));
                          } else if (detailRevisions.length > 0) {
                            list = detailRevisions.map((r: any, i: number) => ({ date: r.effectiveDate || "", description: r.description || "", key: `dr-${r.id ?? i}` }));
                          } else if (dates.length > 0) {
                            list = dates.map((d: string, i: number) => ({ date: d, description: "", key: `d-${i}` }));
                          }
                          // 개정이 없고 항목 시행일만 있는 경우(예: 신설 항목) 시행일을 단일 항목으로 표시
                          if (list.length === 0 && permitDate) {
                            list = [{ date: permitDate, description: "", key: "permit" }];
                          }
                          if (list.length === 0) return null;
                          const sorted = [...list].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
                          let applicableIdx = -1;
                          if (referenceDate) {
                            let bestDate = "";
                            sorted.forEach((r, i) => {
                              if (r.date && new Date(r.date) <= referenceDate && r.date > bestDate) { applicableIdx = i; bestDate = r.date; }
                            });
                          }
                          const enforce = (customEdits[detailItem.id] as any)?.enforcementType ?? (detailItem as any).enforcementType;
                          const fmtPeriod = (date: string) => {
                            if (!date) return "시행일 미입력";
                            const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                            const k = m ? `${m[1]}년 ${parseInt(m[2], 10)}월 ${parseInt(m[3], 10)}일` : date;
                            return enforce === "retroactive" ? `${k} 이후 소급 적용` : `${k} 이후 건축허가분부터 적용`;
                          };
                          const isPeriodOnly = (s: string) => {
                            const stripped = s
                              .replace(/\d{4}\s*[년.\-]\s*\d{1,2}\s*[월.\-]\s*\d{1,2}\s*일?/g, "")
                              .replace(/이후|이전|건축허가분|부터|적용|종전|신설|현행/g, "")
                              .replace(/[~\-()\s.,]/g, "");
                            return s.includes("~") && stripped.length === 0;
                          };
                          return (
                            <div className="space-y-2">
                              {sorted.map((r, idx) => (
                                <div key={r.key} className={cn("border rounded-lg p-3", idx === applicableIdx ? "border-amber-400/50 bg-amber-500/5" : "border-border bg-card")}>
                                  <div className="flex items-center gap-2 mb-1">
                                    {idx === applicableIdx && (
                                      <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">적용 기준</span>
                                    )}
                                    <span className="text-xs font-medium text-muted-foreground">{fmtPeriod(r.date)}</span>
                                  </div>
                                  {(() => {
                                    const desc = (r.description || "").replace(/^\s*\[[^\]]*\]\s*/, "").trim();
                                    if (!desc || isPeriodOnly(desc)) return null;
                                    return <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed mt-1">{desc}</p>;
                                  })()}
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })()}
              {/* 사진 섹션 */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        등록된 사진 ({itemPhotos.length}/10)
                      </h3>
                      {isAdminMode && itemPhotos.length < 10 && (
                        <>
                          <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoUpload}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => photoInputRef.current?.click()}
                            data-testid="button-upload-photo"
                          >
                            <Upload className="w-4 h-4 mr-1" />
                            사진 추가
                          </Button>
                        </>
                      )}
                    </div>
                    {isPhotosLoading ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        <div className="animate-pulse">사진을 불러오는 중입니다...</div>
                      </div>
                    ) : itemPhotos.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        등록된 사진이 없습니다
                        {isAdminMode && <p className="text-xs mt-1">관리자 모드에서 사진을 추가할 수 있습니다</p>}
                      </div>
                    ) : (
                      <PhotoList 
                        photos={itemPhotos}
                        isAdminMode={isAdminMode}
                        onDeletePhoto={(photoId) => deletePhoto.mutate(photoId)}
                        onReplacePhoto={(photoId, file) => replacePhoto.mutate({ photoId, file })}
                        onMoveUp={handleMovePhotoUp}
                        onMoveDown={handleMovePhotoDown}
                        onOpenViewer={(index) => {
                          const allImages = itemPhotos.map((p: any) => p.imageData);
                          openImageViewer(allImages, index);
                        }}
                      />
                    )}
                  </div>

                  {/* 댓글 섹션 */}
                  <div>
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <MessageSquare className="w-4 h-4" />
                      댓글 ({itemComments.length})
                    </h3>
                    
                    {/* 댓글 작성 폼 - 누구나 입력 가능 */}
                    <div className="space-y-2 mb-4 p-3 bg-muted rounded-lg">
                      <div className="flex gap-2">
                        <Input
                          placeholder="작성자"
                          value={newComment.author}
                          onChange={(e) => setNewComment(prev => ({ ...prev, author: e.target.value }))}
                          className="w-24 bg-card"
                          data-testid="input-comment-author"
                        />
                        <Input
                          placeholder="댓글 내용"
                          value={newComment.content}
                          onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                          className="flex-1 bg-card"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newComment.author && newComment.content) {
                              createComment.mutate();
                            }
                          }}
                          data-testid="input-comment-content"
                        />
                        <Button
                          size="sm"
                          onClick={() => createComment.mutate()}
                          disabled={!newComment.author || !newComment.content}
                          data-testid="button-submit-comment"
                        >
                          등록
                        </Button>
                      </div>
                    </div>

                    {itemComments.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground text-sm">
                        등록된 댓글이 없습니다
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {itemComments.map((comment: any) => (
                          <div key={comment.id} className="p-3 bg-card border rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{comment.author}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                                </span>
                                {isAdminMode && (
                                  <button
                                    onClick={() => deleteComment.mutate(comment.id)}
                                    className="p-1 hover:bg-red-100 rounded transition-colors"
                                    title="삭제"
                                  >
                                    <Trash2 className="w-3 h-3 text-red-500" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>


      {/* Image Viewer Portal */}
      {imageViewer.isOpen && createPortal(
        <ImageViewerComponent
          imageViewer={imageViewer}
          setImageViewer={setImageViewer}
          closeImageViewer={closeImageViewer}
        />,
        document.body
      )}
    </>
  );
}
