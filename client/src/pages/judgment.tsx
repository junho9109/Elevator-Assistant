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
  permitEffectiveDate?: string;   // 건축허가일 이후 적용일
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
  const [results, setResults] = useState<Record<string, ResultType>>(() => {
    const saved = localStorage.getItem("judgmentResults");
    return saved ? JSON.parse(saved) : {};
  });
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  
  const [customEdits, setCustomEdits] = useState<Record<string, CustomItemEdit>>({});
  const [editingItem, setEditingItem] = useState<InspectionItem | null>(null);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<CustomItemEdit>({ id: "" });

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
        setDetailItem(item);
        setIsDetailDialogOpen(true);
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
  const { data: itemPhotos = [] } = useQuery<any[]>({
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

  // Fetch inspection item edits from server (for syncing across all users)
  const { data: serverEdits = [], isError: serverEditsError } = useQuery<InspectionItemEdit[]>({
    queryKey: ["/api/inspection-edits"],
    queryFn: async () => {
      const res = await fetch("/api/inspection-edits");
      if (!res.ok) throw new Error("Failed to fetch inspection edits");
      return res.json();
    }
  });

  // Server edits are authoritative - replace local state when server data loads
  const serverEditsJson = JSON.stringify(serverEdits);
  useEffect(() => {
    if (serverEditsError) {
      return;
    }
    
    const parsedEdits: InspectionItemEdit[] = JSON.parse(serverEditsJson);
    // Build map from server edits (server is source of truth)
    const serverEditsMap: Record<string, CustomItemEdit> = {};
    for (const edit of parsedEdits) {
      const parsedDates = (() => {
        try { return JSON.parse((edit as any).standardDates || "[]"); } catch { return []; }
      })();
      const datesWithMemo = parsedDates.map((d: any) => typeof d === "object" ? d : { date: d, memo: "" });
      const datesOnly = datesWithMemo.map((d: any) => d.date);
      serverEditsMap[edit.itemId] = {
        id: edit.itemId,
        text: edit.text || undefined,
        effectiveDate: edit.effectiveDate || undefined,
        expiryDate: edit.expiryDate || undefined,
        introductionType: edit.introductionType as "new" | "revision" | undefined,
        customWarning: edit.customWarning || undefined,
        standardNote: (edit as any).standardNote || undefined,
        equipmentTypes: (() => { try { return JSON.parse((edit as any).equipmentTypes || "[]"); } catch { return []; } })(),
        permitEffectiveDate: (edit as any).permitEffectiveDate || undefined,
        standardDates: datesOnly,
        standardDatesWithMemo: datesWithMemo,
      };
    }
    // Server edits take precedence over local edits
    setCustomEdits(serverEditsMap);
    // Clear localStorage to prevent stale data
    localStorage.removeItem("judgmentCustomEdits");
  }, [serverEditsJson, serverEditsError]);

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

  // 검사기준 DB 데이터 조회
  const { data: baseItems = [] } = useQuery<any[]>({
    queryKey: ["/api/inspection-base-items"],
    queryFn: async () => {
      const res = await fetch("/api/inspection-base-items");
      if (!res.ok) throw new Error("Failed to fetch base items");
      return res.json();
    },
    staleTime: 1000 * 60 * 60, // 1시간 캐시
  });

  // baseItems를 itemId로 빠르게 조회할 수 있는 맵
  const baseItemMap = useMemo(() => {
    const map: Record<string, any> = {};
    baseItems.forEach(item => { map[item.itemId] = item; });
    return map;
  }, [baseItems]);

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
  const saveInspectionEdit = useMutation({
    mutationFn: async (edit: CustomItemEdit) => {
      const res = await fetch(`/api/inspection-edits/${edit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: edit.text || null,
          effectiveDate: edit.permitEffectiveDate || edit.standardEffectiveDate || edit.effectiveDate || null,
          expiryDate: edit.expiryDate || null,
          introductionType: edit.introductionType || null,
          permitEffectiveDate: (edit as any).permitEffectiveDate || null,
          standardEffectiveDate: (edit as any).standardDates?.[0] || (edit as any).standardEffectiveDate || null,
          standardDates: JSON.stringify((edit as any).standardDatesWithMemo?.length > 0
            ? (edit as any).standardDatesWithMemo
            : ((edit as any).standardDates || []).map((d: string) => ({ date: d, memo: "" }))),
          customWarning: edit.customWarning || null,
          standardNote: (edit as any).standardNote || null,
          equipmentTypes: JSON.stringify((edit as any).equipmentTypes || []),
        })
      });
      if (!res.ok) throw new Error("Failed to save edit");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inspection-edits"] });
    }
  });

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
    // 개정 이력 로드
    setRevisionsLoading(true);
    fetch(`/api/inspection-revisions/${item.id}`)
      .then(r => r.json())
      .then(data => {
        const revData = Array.isArray(data) ? data : [];
        setRevisions(revData);
        // 캐시에도 저장 (일반 모드 표시용)
        setRevisionsCache(prev => ({...prev, [item.id]: revData}));
        setRevisionsLoading(false);
      })
      .catch(() => { setRevisions([]); setRevisionsLoading(false); });
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
      fixedResult: existingEdit?.fixedResult ?? results[item.id],
    });
    // 통합 다이얼로그: detailItem도 설정해서 사진/댓글도 같이 표시
    setDetailItem(item);
    setIsDetailDialogOpen(true);
  };

  const handleSaveItemEdit = () => {
    if (!editingItem) return;
    setCustomEdits(prev => ({
      ...prev,
      [editingItem.id]: editForm
    }));
    if (editForm.fixedResult) {
      setResults(prev => ({
        ...prev,
        [editingItem.id]: editForm.fixedResult!
      }));
    }
    
    // Save to server for all users (admin only)
    if (isAdminMode) {
      saveInspectionEdit.mutate(editForm, {
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
    setAddItemForm({ sectionId: "", text: "", effectiveDate: "", introductionType: "" });
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

  const getItemWithEdits = (item: InspectionItem): InspectionItem => {
    const edit = customEdits[item.id];
    if (!edit) return item;
    return {
      ...item,
      text: edit.text ?? item.text,
      effectiveDate: edit.effectiveDate || item.effectiveDate,
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

  const referenceDate = useMemo(() => {
    // 기준일 우선순위: 검사기준 적용일 > 건축허가일
    // (승강기 안전검사기준 2016-143호 부칙 제2조: 건축허가분부터 적용)
    if (permitDate && inspectionDate) {
      const permit = new Date(permitDate);
      const inspection = new Date(inspectionDate);
      return permit > inspection ? permit : inspection;
    }
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

  // 항목이 현재 승강기 종류에 해당하는지 확인
  const isItemApplicable = useCallback((itemId: string): boolean => {
    const edit = customEdits[itemId];
    const types: string[] = (edit as any)?.equipmentTypes || [];
    if (types.length === 0) return true; // 미지정이면 모두 표시
    return types.some(t => {
      if (t === currentFilterKey) return true;
      // 대분류만 체크 (예: "엘리베이터" 선택 시 "엘리베이터-전기식(MR)"도 포함)
      if (t.startsWith(equipmentType + "-") && !subType) return true;
      if (t === equipmentType && !subType) return true;
      return false;
    });
  }, [customEdits, currentFilterKey, equipmentType, subType]);

  const getItemStatus = (item: InspectionItem): "applicable" | "previous" | "not-applicable" => {
    if (!referenceDate) return "applicable";
    
    // expiryDate: 이 날짜 이후에는 더 이상 적용되지 않음 (만료됨)
    if (item.expiryDate) {
      const expiryDate = new Date(item.expiryDate);
      if (referenceDate > expiryDate) return "not-applicable";
    }
    
    // effectiveDate: 이 날짜부터 적용됨
    // referenceDate >= effectiveDate면 검사 대상 (applicable)
    // referenceDate < effectiveDate면:
    //   - "new" 타입: 아직 도입 전이므로 해당없음
    //   - "revision" 타입: 개정 전 기준 적용 (종전)
    if (item.effectiveDate) {
      const effectiveDate = new Date(item.effectiveDate);
      if (referenceDate < effectiveDate) {
        if (item.introductionType === "new") {
          return "not-applicable";
        }
        return "previous";
      }
    }
    
    return "applicable";
  };

  const getAutoResult = (item: InspectionItem): ResultType | null => {
    const status = getItemStatus(item);
    if (status === "previous") return "종전";
    if (status === "not-applicable") return "해당없음";
    return null;
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

  useEffect(() => {
    if (!referenceDate) return;
    
    const allItems = collectAllItems(INSPECTION_DATA_MR);
    const newResults: Record<string, ResultType> = {};
    let hasChanges = false;
    
    allItems.forEach(originalItem => {
      const item = getItemWithEdits(originalItem);
      const autoResult = getAutoResult(item);
      const currentResult = results[item.id];
      
      if (autoResult) {
        // 자동 적용 결과가 있는 경우 (해당없음 또는 종전)
        if (currentResult !== autoResult) {
          newResults[item.id] = autoResult;
          hasChanges = true;
        } else {
          newResults[item.id] = currentResult;
        }
      } else {
        // 검사 대상 (applicable)인 경우
        // 이전에 자동 적용된 결과(해당없음/종전)는 제거하고, 사용자 선택 결과만 유지
        if (currentResult === "해당없음" || currentResult === "종전") {
          // 자동 적용된 결과였으므로 제거
          hasChanges = true;
        } else if (currentResult) {
          // 사용자가 선택한 결과(적합/부적합/시정권고)는 유지
          newResults[item.id] = currentResult;
        }
      }
    });
    
    if (hasChanges) {
      setResults(newResults);
    }
  }, [referenceDate, collectAllItems, customEdits]);

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

  const setResult = (itemId: string, result: ResultType) => {
    setResults(prev => ({
      ...prev,
      [itemId]: result
    }));
  };

  const renderResultButton = (itemId: string, resultType: ResultType, status: "applicable" | "previous" | "not-applicable", autoResult: ResultType | null) => {
    const isSelected = results[itemId] === resultType;
    const isAutoSelected = autoResult === resultType && !results[itemId];
    const isDisabled = (status === "previous" && resultType !== "종전") || 
                       (status === "not-applicable" && resultType !== "해당없음");
    
    const baseClasses = "px-1.5 py-0.5 text-[10px] rounded border transition-all min-w-[32px] leading-tight";
    
    if (isSelected || isAutoSelected) {
      return (
        <button
          className={cn(
            baseClasses, 
            isAutoSelected 
              ? "bg-amber-500 text-white border-amber-500 ring-2 ring-amber-300" 
              : "bg-primary text-primary-foreground border-primary"
          )}
          onClick={() => setResult(itemId, resultType)}
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
        onClick={() => !isDisabled && setResult(itemId, resultType)}
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
    const autoResult = getAutoResult(item);
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
            {renderResultButton(item.id, "적합", status, autoResult)}
            {renderResultButton(item.id, "부적합", status, autoResult)}
            {renderResultButton(item.id, "시정권고", status, autoResult)}
            {renderResultButton(item.id, "해당없음", status, autoResult)}
            {renderResultButton(item.id, "종전", status, autoResult)}
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
        {status === "previous" && referenceDate && (
          <div className="px-4 pb-2 text-xs text-amber-600 ml-10">
            ※ 이 항목은 {item.effectiveDate} 이후 적용되는 기준입니다. 입력하신 날짜({referenceDate.toISOString().split('T')[0]}) 기준으로 「종전」 기준이 자동 적용됩니다.
            <br />
            단, 현장 상태가 개정된 현행 기준을 이미 충족하고 있는 경우에는 건축허가일자 또는 검사적용 기준일과 관계없이 [적합]으로 판정할 수 있습니다.
          </div>
        )}
        {status === "not-applicable" && referenceDate && (
          <div className="px-4 pb-2 text-xs text-gray-600 ml-10">
            ※ 이 항목은 건축허가일(검사기준 적용일) 기준으로 이후에 개정되어 해당없음을 적용합니다.
          </div>
        )}
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

  const renderSection = (section: InspectionSection, depth: number = 0) => {
    const isExpanded = expandedSections.has(section.id);
    const sectionCustomItems = getCustomItemsForSection(section.id);
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
            {section.subsections?.map(sub => renderSection(sub, depth + 1))}
            {section.items?.map(item => renderItem(item))}
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
            {INSPECTION_DATA_MR.map(section => renderSection(section))}
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
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
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
                        onClick={() => setEditForm(prev => ({
                          ...prev,
                          standardDatesWithMemo: [...(prev.standardDatesWithMemo || []), { date: "", memo: "" }],
                          standardDates: [...(prev.standardDates || []), ""]
                        }))}
                        disabled={(editForm.standardDatesWithMemo || []).length >= 20}
                      >+ 추가</Button>
                    </div>
                    {(editForm.standardDatesWithMemo || []).map((entry, idx) => (
                      <div key={idx} className="border border-border rounded-lg p-3 bg-card space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Input
                            placeholder={`개정 ${idx + 1}`}
                            value={entry.label || ""}
                            onChange={(e) => {
                              const arr = [...(editForm.standardDatesWithMemo || [])];
                              arr[idx] = { ...arr[idx], label: e.target.value };
                              setEditForm(prev => ({ ...prev, standardDatesWithMemo: arr }));
                            }}
                            className="flex-1 text-xs font-semibold"
                          />
                          <Button type="button" variant="ghost" size="sm"
                            onClick={() => {
                              const arr = (editForm.standardDatesWithMemo || []).filter((_, i) => i !== idx);
                              setEditForm(prev => ({ ...prev, standardDatesWithMemo: arr, standardDates: arr.map(a => a.date) }));
                            }}
                            className="text-destructive px-2"
                          >✕</Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="date"
                            value={entry.date}
                            onChange={(e) => {
                              const arr = [...(editForm.standardDatesWithMemo || [])];
                              arr[idx] = { ...arr[idx], date: e.target.value };
                              const dates = arr.map(a => a.date);
                              setEditForm(prev => ({ ...prev, standardDatesWithMemo: arr, standardDates: dates }));
                            }}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="mt-1">→</span>
                          <Textarea
                            value={entry.memo}
                            onChange={(e) => {
                              const arr = [...(editForm.standardDatesWithMemo || [])];
                              arr[idx] = { ...arr[idx], memo: e.target.value };
                              setEditForm(prev => ({ ...prev, standardDatesWithMemo: arr }));
                            }}
                            placeholder="적용 내용, 종전 기준 등 메모 (복사/붙여넣기 가능)"
                            rows={3}
                            className="flex-1 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                    {(editForm.standardDatesWithMemo || []).length === 0 && (
                      <p className="text-xs text-muted-foreground">추가 버튼을 눌러 검사기준 적용일을 추가하세요.</p>
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
                    const datesWithMemo: {date: string; memo: string}[] = (itemEdit as any)?.standardDatesWithMemo || [];
                    const dates: string[] = (itemEdit as any)?.standardDates || [];
                    const permitDate = (itemEdit as any)?.permitEffectiveDate || baseItemMap[detailItem.id]?.permitEffectiveDate;
                    const hasData = datesWithMemo.length > 0 || dates.length > 0 || permitDate;
                    if (!hasData) return null;
                    return (
                      <div className="border border-border rounded-xl p-4 bg-muted/20">
                        <h3 className="font-medium text-sm mb-3">📅 검사기준 적용일 (개정)</h3>
                        {permitDate && (
                          <div className="mb-2 px-3 py-2 bg-blue-500/10 rounded-lg">
                            <span className="text-xs font-medium text-blue-600">건축허가일자 이후 적용: </span>
                            <span className="text-xs text-foreground">{permitDate}</span>
                          </div>
                        )}
                        {datesWithMemo.length > 0 ? (
                          <div className="space-y-2">
                            {datesWithMemo.map((entry, idx) => (
                              <div key={idx} className="border border-border rounded-lg p-3 bg-card">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">{entry.label || `개정 ${idx + 1}`}</span>
                                  <span className="text-xs font-medium">{entry.date}</span>
                                </div>
                                {entry.memo && (
                                  <div className="flex gap-1 mt-1">
                                    <span className="text-xs text-muted-foreground mt-0.5">→</span>
                                    <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">{entry.memo}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : dates.length > 0 ? (
                          <div className="space-y-1">
                            {dates.map((date, idx) => (
                              <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg">
                                <span className="text-xs font-semibold text-amber-600">{date.label || `개정 ${idx + 1}`}</span>
                                <span className="text-xs">{date}</span>
                              </div>
                            ))}
                          </div>
                        ) : null}
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
                    {itemPhotos.length === 0 ? (
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
