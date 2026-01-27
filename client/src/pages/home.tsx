import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import structureImg from "@assets/structure_1764142259144.png";
import { cn } from "@/lib/utils";
import Fuse from "fuse.js";
import { 
  Info, 
  CheckCircle2,
  Search,
  Plus,
  Pencil,
  Trash2,
  Settings2,
  X,
  Upload,
  RefreshCw,
  Save,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  useDeleteHotspot
} from "@/lib/api";
import type { Standard, Hotspot } from "@shared/schema";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 }
  })
};

interface ImageViewerState {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  zoom: number;
}

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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistance.current = distance;
      lastZoom.current = imageViewer.zoom;
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
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistance.current = null;
  };

  const goToPrev = () => {
    setImageViewer(prev => ({ 
      ...prev, 
      currentIndex: prev.currentIndex > 0 ? prev.currentIndex - 1 : prev.images.length - 1,
      zoom: 1 
    }));
  };

  const goToNext = () => {
    setImageViewer(prev => ({ 
      ...prev, 
      currentIndex: prev.currentIndex < prev.images.length - 1 ? prev.currentIndex + 1 : 0,
      zoom: 1 
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
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close Button */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000000 }}>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); closeImageViewer(); }}
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
            transform: `scale(${imageViewer.zoom})`,
            transition: 'transform 0.1s ease-out',
            pointerEvents: 'none'
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
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              textDecoration: 'none'
            }}
          >
            <ChevronLeft style={{ width: 32, height: 32 }} />
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); goToNext(); }}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              textDecoration: 'none'
            }}
          >
            <ChevronRight style={{ width: 32, height: 32 }} />
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
          onClick={(e) => { e.preventDefault(); setImageViewer(prev => ({ ...prev, zoom: Math.max(0.5, prev.zoom - 0.5) })); }}
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
          onClick={(e) => { e.preventDefault(); setImageViewer(prev => ({ ...prev, zoom: Math.min(5, prev.zoom + 0.5) })); }}
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
        두 손가락으로 확대/축소
      </div>
    </div>
  );
}

export default function Home() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: standards = [], isLoading: standardsLoading, isFetching: standardsFetching } = useStandards();
  const { data: hotspots = [], isLoading: hotspotsLoading, isFetching: hotspotsFetching } = useHotspots();
  const isRefreshing = standardsFetching || hotspotsFetching;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["standards"] });
    queryClient.invalidateQueries({ queryKey: ["hotspots"] });
    toast({
      title: "데이터 갱신됨",
      description: "서버에서 최신 데이터를 불러왔습니다.",
    });
  };

  const handleAdminModeClick = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      setIsEditMode(false);
      toast({
        title: "관리자 모드 종료",
        description: "관리자 모드가 종료되었습니다.",
      });
    } else {
      setAdminPassword("");
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

  const handleSaveConfirm = async () => {
    try {
      await queryClient.refetchQueries({ queryKey: ["standards"] });
      await queryClient.refetchQueries({ queryKey: ["hotspots"] });
      
      const currentStandards = queryClient.getQueryData(["standards"]) as Standard[] || [];
      const currentHotspots = queryClient.getQueryData(["hotspots"]) as Hotspot[] || [];
      
      toast({
        title: "저장 상태 확인 완료",
        description: `서버에 저장된 데이터: 표준화 ${currentStandards.length}건, 버튼 ${currentHotspots.length}개`,
      });
    } catch {
      toast({
        title: "저장 상태 확인 실패",
        description: "서버와 연결할 수 없습니다.",
        variant: "destructive",
      });
    }
  };

  const createStandard = useCreateStandard();
  const updateStandard = useUpdateStandard();
  const deleteStandard = useDeleteStandard();
  const createHotspot = useCreateHotspot();
  const updateHotspot = useUpdateHotspot();
  const deleteHotspot = useDeleteHotspot();

  const [activeButtonId, setActiveButtonId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [isAddStandardOpen, setIsAddStandardOpen] = useState(false);
  const [isViewStandardOpen, setIsViewStandardOpen] = useState(false);
  const [isEditStandardOpen, setIsEditStandardOpen] = useState(false);
  const [isButtonDialogOpen, setIsButtonDialogOpen] = useState(false);
  
  const [editingButtonId, setEditingButtonId] = useState<number | null>(null);
  const [pendingButtonPos, setPendingButtonPos] = useState<{top: string, left: string} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  const [newItem, setNewItem] = useState({
    title: "",
    standardNumber: "",
    body: "",
    imageUrls: [] as string[],
    inspectionDate: "",
    permitDate: "",
    inspectionYear: "",
    inspectionRound: "",
    hotspotId: null as number | null
  });

  const [editingItem, setEditingItem] = useState<Standard | null>(null);
  
  const [buttonForm, setButtonForm] = useState({
    label: ""
  });

  const [imageViewer, setImageViewer] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
    zoom: number;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
    zoom: 1
  });

  const openImageViewer = (images: string[], startIndex: number = 0) => {
    setImageViewer({
      isOpen: true,
      images,
      currentIndex: startIndex,
      zoom: 1
    });
  };

  const closeImageViewer = () => {
    setImageViewer(prev => ({ ...prev, isOpen: false }));
    setTimeout(() => setIsViewStandardOpen(true), 100);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hotspots.length > 0 && activeButtonId === null) {
      setActiveButtonId(hotspots[0].id);
    }
  }, [hotspots, activeButtonId]);

  const handleButtonClick = (buttonId: number) => {
    setActiveButtonId(buttonId);
    setSearchTerm(""); 
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const maxImages = 5;
    const currentCount = isEdit ? (editingItem?.imageUrls?.length || 0) : newItem.imageUrls.length;
    const remainingSlots = maxImages - currentCount;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    
    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit && editingItem) {
          setEditingItem(prev => {
            if (!prev) return prev;
            const existingUrls = prev.imageUrls || [];
            if (existingUrls.length >= maxImages) return prev;
            return { ...prev, imageUrls: [...existingUrls, reader.result as string] };
          });
        } else {
          setNewItem(prev => {
            if (prev.imageUrls.length >= maxImages) return prev;
            return { ...prev, imageUrls: [...prev.imageUrls, reader.result as string] };
          });
        }
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = "";
  };

  const handleAddStandard = () => {
    if (!newItem.title || !newItem.body || !newItem.hotspotId) return;

    createStandard.mutate({
      title: newItem.title,
      standardNumber: newItem.standardNumber || null,
      body: newItem.body,
      imageUrls: newItem.imageUrls.length > 0 ? newItem.imageUrls : null,
      permitDate: newItem.permitDate || null,
      inspectionDate: newItem.inspectionDate || null,
      inspectionYear: newItem.inspectionYear || null,
      inspectionRound: newItem.inspectionRound || null,
      categoryId: null,
      hotspotId: newItem.hotspotId,
    }, {
      onSuccess: () => {
        setIsAddStandardOpen(false);
        setNewItem({ 
          title: "", 
          standardNumber: "", 
          body: "", 
          imageUrls: [],
          inspectionDate: "",
          permitDate: "",
          inspectionYear: "",
          inspectionRound: "",
          hotspotId: null
        });
        toast({
          title: "표준화 추가 완료",
          description: "새 표준화가 서버에 저장되었습니다.",
        });
      }
    });
  };

  const handleOpenViewStandard = (standard: Standard) => {
    setEditingItem({ ...standard });
    setIsViewStandardOpen(true);
  };

  const handleSwitchToEditMode = () => {
    setIsViewStandardOpen(false);
    setIsEditStandardOpen(true);
  };

  const handleUpdateStandard = () => {
    if (!editingItem || !editingItem.title || !editingItem.body || !editingItem.hotspotId) return;

    const itemId = editingItem.id;
    const updatedData = {
      title: editingItem.title,
      standardNumber: editingItem.standardNumber || null,
      body: editingItem.body,
      imageUrls: editingItem.imageUrls && editingItem.imageUrls.length > 0 ? editingItem.imageUrls : null,
      permitDate: editingItem.permitDate || null,
      inspectionDate: editingItem.inspectionDate || null,
      inspectionYear: editingItem.inspectionYear || null,
      inspectionRound: editingItem.inspectionRound || null,
      hotspotId: editingItem.hotspotId,
    };
    
    updateStandard.mutate({
      id: itemId,
      standard: updatedData
    }, {
      onSuccess: (updated) => {
        setIsEditStandardOpen(false);
        setEditingItem(updated);
        setIsViewStandardOpen(true);
        toast({
          title: "표준화 수정 완료",
          description: "변경사항이 저장되었습니다.",
        });
      }
    });
  };

  const handleDeleteStandard = () => {
    if (!editingItem) return;
    
    const confirmDelete = window.confirm("정말 이 항목을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    deleteStandard.mutate(editingItem.id, {
      onSuccess: () => {
        setIsEditStandardOpen(false);
        setEditingItem(null);
        toast({
          title: "표준화 삭제 완료",
          description: "항목이 서버에서 삭제되었습니다.",
        });
      }
    });
  };

  const handleEditButtonClick = (hotspot: Hotspot, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingButtonId(hotspot.id);
    setButtonForm({ label: hotspot.label });
    setPendingButtonPos(null);
    setIsButtonDialogOpen(true);
  };

  const handleSaveButton = () => {
    if (!buttonForm.label) {
      return;
    }

    if (editingButtonId) {
      updateHotspot.mutate({
        id: editingButtonId,
        hotspot: {
          label: buttonForm.label
        }
      }, {
        onSuccess: () => {
          setIsButtonDialogOpen(false);
          setButtonForm({ label: "" });
          setEditingButtonId(null);
          toast({
            title: "버튼 수정 완료",
            description: "버튼이 서버에 저장되었습니다.",
          });
        }
      });
    } else if (pendingButtonPos) {
      createHotspot.mutate({
        label: buttonForm.label,
        top: pendingButtonPos.top,
        left: pendingButtonPos.left,
        categoryId: null
      }, {
        onSuccess: () => {
          setIsButtonDialogOpen(false);
          setButtonForm({ label: "" });
          setPendingButtonPos(null);
          toast({
            title: "버튼 추가 완료",
            description: "새 버튼이 서버에 저장되었습니다.",
          });
        },
        onError: () => {
          toast({
            title: "버튼 생성 실패",
            description: "버튼을 생성할 수 없습니다.",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleDragEnd = (id: number, info: any) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = info.point.x - rect.left;
    const y = info.point.y - rect.top;

    const leftVal = (x / rect.width) * 100;
    const topVal = (y / rect.height) * 100;
    
    const clampedLeft = Math.max(0, Math.min(100, leftVal)).toFixed(1);
    const clampedTop = Math.max(0, Math.min(100, topVal)).toFixed(1);

    updateHotspot.mutate({
      id,
      hotspot: {
        left: `${clampedLeft}%`,
        top: `${clampedTop}%`
      }
    }, {
      onSuccess: () => {
        toast({
          title: "버튼 위치 저장됨",
          description: "버튼 위치가 서버에 저장되었습니다.",
        });
      },
      onError: () => {
        toast({
          title: "위치 저장 실패",
          description: "버튼 위치를 저장하지 못했습니다.",
          variant: "destructive",
        });
      }
    });
  };

  const handleDeleteButton = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("정말 이 버튼을 삭제하시겠습니까?");
    if (!confirmDelete) return;
    
    deleteHotspot.mutate(id, {
      onSuccess: () => {
        toast({
          title: "버튼 삭제 완료",
          description: "버튼이 서버에서 삭제되었습니다.",
        });
      }
    });
  };

  const isSearching = searchTerm.length > 0;

  const fuse = useMemo(() => {
    return new Fuse(standards, {
      keys: [
        { name: "title", weight: 0.5 },
        { name: "body", weight: 0.35 },
        { name: "standardNumber", weight: 0.15 }
      ],
      threshold: 0.4,
      distance: 150,
      ignoreLocation: true,
      minMatchCharLength: 1,
      includeScore: true,
      findAllMatches: true,
    });
  }, [standards]);

  const displayItems = useMemo(() => {
    if (isSearching) {
      const keywords = searchTerm
        .split(/[\s,]+/)
        .map(k => k.trim())
        .filter(k => k.length >= 1);
      
      if (keywords.length === 0) {
        return standards;
      }

      if (keywords.length === 1) {
        const results = fuse.search(searchTerm);
        return results.map(result => result.item);
      }

      const scoreMap = new Map<number, { item: Standard; totalScore: number; matchCount: number }>();
      
      keywords.forEach(keyword => {
        const results = fuse.search(keyword);
        results.forEach(result => {
          const existing = scoreMap.get(result.item.id);
          if (existing) {
            existing.totalScore += (1 - (result.score || 0));
            existing.matchCount += 1;
          } else {
            scoreMap.set(result.item.id, {
              item: result.item,
              totalScore: 1 - (result.score || 0),
              matchCount: 1
            });
          }
        });
      });

      const sortedResults = Array.from(scoreMap.values())
        .sort((a, b) => {
          if (b.matchCount !== a.matchCount) {
            return b.matchCount - a.matchCount;
          }
          return b.totalScore - a.totalScore;
        })
        .map(r => r.item);

      return sortedResults;
    } else if (activeButtonId) {
      return standards.filter(standard => standard.hotspotId === activeButtonId);
    } else {
      return standards;
    }
  }, [standards, searchTerm, isSearching, activeButtonId, fuse]);

  const activeButton = hotspots.find(h => h.id === activeButtonId);

  if (standardsLoading || hotspotsLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans text-foreground">
      <div className="mx-auto max-w-7xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[800px]">
          
          {/* Left Panel: Structure & Navigation */}
          <div className="lg:col-span-5 bg-slate-50/50 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-border flex flex-col">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20">
                    E
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">기술자료조회</h1>
                </div>
                <div className="flex items-center gap-2">
                  {isAdminMode && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSaveConfirm}
                      className="shrink-0 shadow-sm hover:shadow-md transition-all"
                      data-testid="button-save"
                      title="저장 확인"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant={isAdminMode ? "default" : "outline"}
                    size="icon"
                    onClick={handleAdminModeClick}
                    className={cn(
                      "shrink-0 shadow-sm hover:shadow-md transition-all",
                      isAdminMode && "bg-red-500 hover:bg-red-600"
                    )}
                    data-testid="button-admin-mode"
                    title={isAdminMode ? "관리자 모드 종료" : "관리자 모드 진입"}
                  >
                    <Settings2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="shrink-0 shadow-sm hover:shadow-md transition-all"
                    data-testid="button-refresh"
                    title="서버에서 다시 불러오기"
                  >
                    <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground text-sm pl-[52px]">
                버튼을 눌러 관련 표준화를 확인하세요
              </p>
            </div>

            {/* Edit Mode Toggle - Admin Only */}
            {isAdminMode && (
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-center justify-between bg-red-50 p-3 rounded-xl border border-red-200 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                    <Settings2 className="w-4 h-4 text-red-400" />
                    <span>구조도 편집 모드</span>
                  </div>
                  <Switch 
                    checked={isEditMode}
                    onCheckedChange={setIsEditMode}
                    data-testid="switch-edit-mode"
                  />
                </div>
                {isEditMode && (
                  <Button
                    onClick={() => {
                      setPendingButtonPos({ top: "50%", left: "50%" });
                      setEditingButtonId(null);
                      setButtonForm({ label: "" });
                      setIsButtonDialogOpen(true);
                    }}
                    className="w-full"
                    data-testid="button-add-new"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    새 버튼 추가
                  </Button>
                )}
              </div>
            )}

            {/* Interactive Structure Diagram */}
            <div 
              ref={containerRef}
              className={cn(
                "relative w-full aspect-[3/4] bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-inner mb-6 group select-none",
                isEditMode && "ring-2 ring-offset-2 ring-primary/50"
              )}
            >
              <img 
                src={structureImg} 
                alt="Elevator Structure" 
                className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              />
              
              {/* Buttons (formerly Hotspots) */}
              {/* Drop position grid - shown when dragging in edit mode */}
              {isEditMode && isDragging && (
                <div className="absolute inset-0 pointer-events-none z-5">
                  {Array.from({ length: 50 }, (_, row) => (
                    Array.from({ length: 40 }, (_, col) => {
                      const top = 2 + (row * 96 / 49);
                      const left = 2 + (col * 96 / 39);
                      return (
                        <div
                          key={`grid-${row}-${col}`}
                          className="absolute w-1.5 h-1.5 rounded-full bg-blue-400/60 transform -translate-x-1/2 -translate-y-1/2"
                          style={{ 
                            top: `${top}%`, 
                            left: `${left}%`
                          }}
                        />
                      );
                    })
                  )).flat()}
                </div>
              )}

              {hotspots.map(hotspot => (
                <motion.div
                  key={`${hotspot.id}-${hotspot.top}-${hotspot.left}`}
                  drag={isEditMode}
                  dragMomentum={false}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={(_, info) => {
                    setIsDragging(false);
                    handleDragEnd(hotspot.id, info);
                  }}
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 z-10",
                    isEditMode ? "cursor-move" : "cursor-pointer"
                  )}
                  style={{ top: hotspot.top, left: hotspot.left }}
                  onClick={() => !isEditMode && handleButtonClick(hotspot.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid={`button-${hotspot.id}`}
                >
                  <div className={cn(
                    "relative px-3 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm border-2 transition-all duration-300",
                    activeButtonId === hotspot.id
                      ? "bg-primary text-primary-foreground border-white scale-110"
                      : "bg-slate-900/70 text-white border-slate-700 hover:bg-primary/90 hover:border-white"
                  )}>
                    {hotspot.label}
                    {isEditMode && (
                      <div className="absolute -top-2 -right-2 flex gap-1">
                        <button
                          onClick={(e) => handleEditButtonClick(hotspot, e)}
                          className="w-5 h-5 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-md"
                          data-testid={`edit-button-${hotspot.id}`}
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteButton(hotspot.id, e)}
                          className="w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md"
                          data-testid={`delete-button-${hotspot.id}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
            </div>

            {/* Search Input */}
            <div className="mt-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input 
                  placeholder="검사 기준 검색 (예: 조명, 틈새)..." 
                  className="pl-9 bg-white border-slate-200 focus-visible:ring-primary h-11 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search"
                />
              </div>

              {isSearching && (
                <p className="text-xs text-slate-500 mt-2 pl-1 flex items-center gap-1.5">
                  <Info className="w-3 h-3" />
                  "{searchTerm}" 검색 결과: {displayItems.length}건
                </p>
              )}
            </div>
          </div>

          {/* Right Panel: Content Details */}
          <div className="lg:col-span-7 p-6 lg:p-10 bg-white flex flex-col">
            {/* Header & Actions */}
            <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-100">
              <div className="flex-1">
                {isSearching ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                      검색 결과
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-mono font-medium tracking-wide">
                        SEARCH
                      </span>
                    </h2>
                    <p className="text-slate-500 mt-2">
                       "{searchTerm}" 검색 결과입니다.
                    </p>
                  </motion.div>
                ) : (
                  <div>
                    {activeButton ? (
                      <>
                        <motion.h2 
                          key={activeButton.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-3xl font-bold text-slate-900 flex items-center gap-3"
                        >
                          {activeButton.label}
                        </motion.h2>
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-slate-500 mt-2 leading-relaxed max-w-2xl"
                        >
                          표준화 기준 목록
                        </motion.p>
                      </>
                    ) : (
                      <div className="text-slate-400 italic">버튼을 선택하세요</div>
                    )}
                  </div>
                )}
              </div>

              {/* Add Standard Button - Admin Only */}
              {isAdminMode && (
              <Dialog open={isAddStandardOpen} onOpenChange={(open) => {
                if (open && activeButtonId) {
                  setNewItem(prev => ({ ...prev, hotspotId: activeButtonId }));
                }
                setIsAddStandardOpen(open);
              }}>
                  <DialogTrigger asChild>
                    <Button className="shrink-0 gap-2 shadow-md hover:shadow-lg transition-all bg-red-500 hover:bg-red-600" data-testid="button-add-standard">
                      <Plus className="w-4 h-4" />
                      표준화 추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>새 표준화 기준 추가</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="hotspot">분류 (버튼 선택)</Label>
                      <Select
                        value={newItem.hotspotId?.toString() || ""}
                        onValueChange={(value) => setNewItem({...newItem, hotspotId: value ? parseInt(value) : null})}
                      >
                        <SelectTrigger data-testid="select-hotspot">
                          <SelectValue placeholder="버튼을 선택하세요..." />
                        </SelectTrigger>
                        <SelectContent>
                          {hotspots.map((hotspot) => (
                            <SelectItem key={hotspot.id} value={hotspot.id.toString()}>
                              {hotspot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="title">항목명 (Title)</Label>
                      <Input 
                        id="title" 
                        placeholder="예: 비상통화장치 작동시험" 
                        value={newItem.title}
                        onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                        data-testid="input-standard-title"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="std">기준 번호</Label>
                        <Input 
                          id="std" 
                          placeholder="예: 14.2.3" 
                          value={newItem.standardNumber}
                          onChange={(e) => setNewItem({...newItem, standardNumber: e.target.value})}
                          data-testid="input-standard-number"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="permitDate">건축허가일 (선택)</Label>
                        <Input 
                          id="permitDate" 
                          type="date"
                          value={newItem.permitDate}
                          onChange={(e) => setNewItem({...newItem, permitDate: e.target.value})}
                          data-testid="input-permit-date"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="inspectionDate">검사기준적용일 (선택)</Label>
                      <Input 
                        id="inspectionDate" 
                        type="date"
                        value={newItem.inspectionDate}
                        onChange={(e) => setNewItem({...newItem, inspectionDate: e.target.value})}
                        data-testid="input-inspection-date"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="inspectionYear">검사년도</Label>
                        <Select
                          value={newItem.inspectionYear}
                          onValueChange={(value) => setNewItem({...newItem, inspectionYear: value})}
                        >
                          <SelectTrigger data-testid="select-inspection-year">
                            <SelectValue placeholder="년도 선택..." />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = new Date().getFullYear() - i;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}년
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="inspectionRound">검사차수</Label>
                        <Select
                          value={newItem.inspectionRound}
                          onValueChange={(value) => setNewItem({...newItem, inspectionRound: value})}
                        >
                          <SelectTrigger data-testid="select-inspection-round">
                            <SelectValue placeholder="차수 선택..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1차</SelectItem>
                            <SelectItem value="2">2차</SelectItem>
                            <SelectItem value="3">3차</SelectItem>
                            <SelectItem value="4">4차</SelectItem>
                            <SelectItem value="5">5차</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="body">세부 내용</Label>
                      <Textarea 
                        id="body" 
                        placeholder="검사 기준 상세 내용을 입력하세요..." 
                        className="h-24 resize-none"
                        value={newItem.body}
                        onChange={(e) => setNewItem({...newItem, body: e.target.value})}
                        data-testid="input-standard-body"
                      />
                    </div>
                    
                    {/* Image Upload Field */}
                    <div className="grid gap-2">
                      <Label htmlFor="image">사진 첨부 (최대 5장)</Label>
                      <div className="flex items-center gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={newItem.imageUrls.length >= 5}
                          className="w-full border-dashed border-2 h-12 text-slate-500 hover:text-primary hover:border-primary hover:bg-blue-50 disabled:opacity-50"
                          data-testid="button-upload-image"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {newItem.imageUrls.length > 0 ? `사진 추가 (${newItem.imageUrls.length}/5)` : "이미지 업로드"}
                        </Button>
                        <input 
                          ref={fileInputRef}
                          id="image" 
                          type="file" 
                          accept="image/*" 
                          multiple
                          className="hidden"
                          onChange={(e) => handleFileChange(e, false)}
                        />
                      </div>
                      {newItem.imageUrls.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {newItem.imageUrls.map((url, index) => (
                            <div 
                              key={index} 
                              className="relative aspect-square bg-slate-100 rounded-md overflow-hidden border border-slate-200 cursor-grab active:cursor-grabbing"
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', index.toString());
                                e.currentTarget.style.opacity = '0.5';
                              }}
                              onDragEnd={(e) => {
                                e.currentTarget.style.opacity = '1';
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.currentTarget.style.borderColor = '#3b82f6';
                              }}
                              onDragLeave={(e) => {
                                e.currentTarget.style.borderColor = '';
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.style.borderColor = '';
                                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                                const toIndex = index;
                                if (fromIndex !== toIndex) {
                                  const newUrls = [...newItem.imageUrls];
                                  const [moved] = newUrls.splice(fromIndex, 1);
                                  newUrls.splice(toIndex, 0, moved);
                                  setNewItem(prev => ({ ...prev, imageUrls: newUrls }));
                                }
                              }}
                            >
                              <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover pointer-events-none" />
                              <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                                {index + 1}
                              </div>
                              <Button
                                size="icon"
                                variant="destructive"
                                className="absolute top-1 right-1 h-5 w-5 rounded-full"
                                onClick={() => setNewItem(prev => ({ 
                                  ...prev, 
                                  imageUrls: prev.imageUrls.filter((_, i) => i !== index) 
                                }))}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddStandardOpen(false)}>취소</Button>
                    <Button 
                      onClick={handleAddStandard} 
                      disabled={!newItem.title || !newItem.body || !newItem.hotspotId}
                      data-testid="button-submit-standard"
                    >
                      추가하기
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSearching ? "search" : activeButtonId}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                  }}
                  className="grid gap-4"
                >
                  {displayItems.map((standard, index) => (
                    <motion.div
                      key={`${standard.id}-${index}`}
                      variants={cardVariants}
                      custom={index}
                      layout
                      onClick={() => handleOpenViewStandard(standard)}
                      className="group p-5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300 relative cursor-pointer hover:shadow-md"
                      data-testid={`standard-card-${standard.id}`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3 pr-8">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <h3 className="font-semibold text-slate-900 text-lg leading-snug">
                            {standard.title}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-500 text-xs font-mono font-bold shadow-sm group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                            {standard.standardNumber || "N/A"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="pl-8 border-l-2 border-slate-200 group-hover:border-blue-200 transition-colors">
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">
                          {standard.body}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* View Standard Dialog */}
      <Dialog open={isViewStandardOpen} onOpenChange={setIsViewStandardOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center justify-between pr-8">
              <span>{editingItem?.title}</span>
              <Badge variant="outline" className="font-mono">
                {editingItem?.standardNumber || "N/A"}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2" style={{ maxHeight: 'calc(90vh - 140px)' }}>
            {editingItem?.imageUrls && editingItem.imageUrls.length > 0 && (
              <div className="space-y-3">
                {editingItem.imageUrls.map((url, index) => (
                  <a 
                    key={index}
                    href="#"
                    className="block rounded-lg overflow-hidden border border-slate-200 bg-white"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsViewStandardOpen(false);
                      setTimeout(() => openImageViewer(editingItem.imageUrls!, index), 150);
                    }}
                    data-testid={`image-${index}`}
                  >
                    <img 
                      src={url} 
                      alt={`${editingItem.title} ${index + 1}`} 
                      className="w-full object-contain"
                      style={{ maxHeight: '40vh' }}
                    />
                  </a>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-slate-500 text-xs">세부 내용</Label>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {editingItem?.body}
              </p>
            </div>
            {(editingItem?.inspectionYear || editingItem?.inspectionRound) && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                {editingItem?.inspectionYear && (
                  <div className="space-y-1">
                    <Label className="text-slate-500 text-xs">검사년도</Label>
                    <p className="text-slate-700 text-sm font-mono">{editingItem.inspectionYear}년</p>
                  </div>
                )}
                {editingItem?.inspectionRound && (
                  <div className="space-y-1">
                    <Label className="text-slate-500 text-xs">검사차수</Label>
                    <p className="text-slate-700 text-sm font-mono">{editingItem.inspectionRound}차</p>
                  </div>
                )}
              </div>
            )}
            {(editingItem?.permitDate || editingItem?.inspectionDate) && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                {editingItem?.permitDate && (
                  <div className="space-y-1">
                    <Label className="text-slate-500 text-xs">건축허가일</Label>
                    <p className="text-slate-700 text-sm font-mono">{editingItem.permitDate}</p>
                  </div>
                )}
                {editingItem?.inspectionDate && (
                  <div className="space-y-1">
                    <Label className="text-slate-500 text-xs">검사기준적용일</Label>
                    <p className="text-slate-700 text-sm font-mono">{editingItem.inspectionDate}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => setIsViewStandardOpen(false)}>닫기</Button>
            <Button onClick={handleSwitchToEditMode} data-testid="button-edit-from-view">
              <Pencil className="w-4 h-4 mr-2" />
              수정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Standard Dialog */}
      <Dialog open={isEditStandardOpen} onOpenChange={setIsEditStandardOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>표준화 기준 수정</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="flex-1 overflow-y-auto grid gap-4 py-4 pr-2" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              <div className="grid gap-2">
                <Label htmlFor="edit-hotspot">분류 (버튼 선택)</Label>
                <Select
                  value={editingItem.hotspotId?.toString() || ""}
                  onValueChange={(value) => setEditingItem({...editingItem, hotspotId: value ? parseInt(value) : null})}
                >
                  <SelectTrigger data-testid="select-edit-hotspot">
                    <SelectValue placeholder="버튼을 선택하세요..." />
                  </SelectTrigger>
                  <SelectContent>
                    {hotspots.map((hotspot) => (
                      <SelectItem key={hotspot.id} value={hotspot.id.toString()}>
                        {hotspot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-title">항목명</Label>
                <Input 
                  id="edit-title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  data-testid="input-edit-title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-std">기준 번호</Label>
                  <Input 
                    id="edit-std"
                    value={editingItem.standardNumber || ""}
                    onChange={(e) => setEditingItem({...editingItem, standardNumber: e.target.value})}
                    data-testid="input-edit-std"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-permitDate">건축허가일</Label>
                  <Input 
                    id="edit-permitDate"
                    type="date"
                    value={editingItem.permitDate || ""}
                    onChange={(e) => setEditingItem({...editingItem, permitDate: e.target.value})}
                    data-testid="input-edit-permit-date"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-inspectionDate">검사기준적용일</Label>
                <Input 
                  id="edit-inspectionDate"
                  type="date"
                  value={editingItem.inspectionDate || ""}
                  onChange={(e) => setEditingItem({...editingItem, inspectionDate: e.target.value})}
                  data-testid="input-edit-inspection-date"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-inspectionYear">검사년도</Label>
                  <Select
                    value={editingItem.inspectionYear || ""}
                    onValueChange={(value) => setEditingItem({...editingItem, inspectionYear: value})}
                  >
                    <SelectTrigger data-testid="select-edit-inspection-year">
                      <SelectValue placeholder="년도 선택..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}년
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-inspectionRound">검사차수</Label>
                  <Select
                    value={editingItem.inspectionRound || ""}
                    onValueChange={(value) => setEditingItem({...editingItem, inspectionRound: value})}
                  >
                    <SelectTrigger data-testid="select-edit-inspection-round">
                      <SelectValue placeholder="차수 선택..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1차</SelectItem>
                      <SelectItem value="2">2차</SelectItem>
                      <SelectItem value="3">3차</SelectItem>
                      <SelectItem value="4">4차</SelectItem>
                      <SelectItem value="5">5차</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-body">세부 내용</Label>
                <Textarea 
                  id="edit-body"
                  className="h-24 resize-none"
                  value={editingItem.body}
                  onChange={(e) => setEditingItem({...editingItem, body: e.target.value})}
                  data-testid="input-edit-body"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">사진 (최대 5장)</Label>
                <div className="flex items-center gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => editFileInputRef.current?.click()}
                    disabled={(editingItem.imageUrls?.length || 0) >= 5}
                    className="w-full border-dashed border-2 h-12 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {(editingItem.imageUrls?.length || 0) > 0 
                      ? `사진 추가 (${editingItem.imageUrls?.length || 0}/5)` 
                      : "이미지 업로드"}
                  </Button>
                  <input 
                    ref={editFileInputRef}
                    type="file" 
                    accept="image/*" 
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileChange(e, true)}
                  />
                </div>
                {editingItem.imageUrls && editingItem.imageUrls.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {editingItem.imageUrls.map((url, index) => (
                      <div 
                        key={index} 
                        className="relative aspect-square bg-slate-100 rounded-md overflow-hidden border border-slate-200 cursor-grab active:cursor-grabbing"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', index.toString());
                          e.currentTarget.style.opacity = '0.5';
                        }}
                        onDragEnd={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.style.borderColor = '#3b82f6';
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.style.borderColor = '';
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.style.borderColor = '';
                          const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                          const toIndex = index;
                          if (fromIndex !== toIndex && editingItem.imageUrls) {
                            const newUrls = [...editingItem.imageUrls];
                            const [moved] = newUrls.splice(fromIndex, 1);
                            newUrls.splice(toIndex, 0, moved);
                            setEditingItem({ ...editingItem, imageUrls: newUrls });
                          }
                        }}
                      >
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover pointer-events-none" />
                        <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                          {index + 1}
                        </div>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-5 w-5 rounded-full"
                          onClick={() => setEditingItem({
                            ...editingItem, 
                            imageUrls: editingItem.imageUrls?.filter((_, i) => i !== index) || null
                          })}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="flex-shrink-0">
            <Button variant="destructive" onClick={handleDeleteStandard} data-testid="button-delete-standard">
              <Trash2 className="w-4 h-4 mr-2" />
              삭제
            </Button>
            <Button variant="outline" onClick={() => setIsEditStandardOpen(false)}>취소</Button>
            <Button 
              onClick={handleUpdateStandard} 
              disabled={!editingItem?.title || !editingItem?.body || !editingItem?.hotspotId}
              data-testid="button-update-standard"
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Button Dialog (formerly Hotspot Dialog) */}
      <Dialog open={isButtonDialogOpen} onOpenChange={setIsButtonDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingButtonId ? "버튼 수정" : "새 버튼 추가"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>버튼 이름</Label>
              <Input 
                placeholder="예: 기계실"
                value={buttonForm.label}
                onChange={(e) => setButtonForm({...buttonForm, label: e.target.value})}
                data-testid="input-button-label"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsButtonDialogOpen(false)}>취소</Button>
            <Button onClick={handleSaveButton} data-testid="button-save-button">저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Dialog for Admin Mode */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>관리자 모드 진입</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>비밀번호</Label>
              <Input 
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePasswordSubmit();
                  }
                }}
                data-testid="input-admin-password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>취소</Button>
            <Button onClick={handlePasswordSubmit} data-testid="button-confirm-password">확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Viewer - Portal to body */}
      {imageViewer.isOpen && createPortal(
        <ImageViewerComponent 
          imageViewer={imageViewer}
          setImageViewer={setImageViewer}
          closeImageViewer={closeImageViewer}
        />,
        document.body
      )}

    </div>
  );
}
