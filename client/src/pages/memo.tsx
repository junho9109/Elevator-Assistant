import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Trash2, Image, Edit2, Save, X, Pencil, Square, Circle, ArrowRight, Minus, Undo, Palette, Lock, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Stage, Layer, Line, Rect, Ellipse, Arrow, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import type { Memo, MemoPhoto, PhotoAnnotation } from "@shared/schema";

type DrawingTool = "freehand" | "rectangle" | "circle" | "arrow" | "line";

interface ImageViewerState {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  zoom: number;
  panX: number;
  panY: number;
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
        핀치로 확대/축소 · 드래그로 이동
      </div>
    </div>
  );
}

interface PhotoWithMeta {
  id: number;
  memoId: number;
  fileName: string;
  mimeType: string;
  hasImage: boolean;
  createdAt: string;
}

interface DrawingShape {
  tool: DrawingTool;
  color: string;
  strokeWidth: number;
  points: number[];
}

function PhotoCanvas({ 
  photoId, 
  onClose,
  onSave 
}: { 
  photoId: number; 
  onClose: () => void;
  onSave: (annotations: DrawingShape[]) => void;
}) {
  const [image] = useImage(`/api/photos/${photoId}/image`);
  const [tool, setTool] = useState<DrawingTool>("freehand");
  const [color, setColor] = useState("#ff0000");
  const [strokeWidth] = useState(3);
  const [shapes, setShapes] = useState<DrawingShape[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState<DrawingShape | null>(null);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 300, height: 400 });

  const { data: existingAnnotations } = useQuery<PhotoAnnotation[]>({
    queryKey: ["/api/photos", photoId, "annotations"],
    queryFn: async () => {
      const res = await fetch(`/api/photos/${photoId}/annotations`);
      if (!res.ok) throw new Error("Annotations load failed");
      return res.json();
    },
    enabled: !!photoId,
  });

  useEffect(() => {
    if (existingAnnotations) {
      const loadedShapes = existingAnnotations.map(a => ({
        tool: a.tool as DrawingTool,
        color: a.color,
        strokeWidth: a.strokeWidth || 3,
        points: JSON.parse(a.points)
      }));
      setShapes(loadedShapes);
    }
  }, [existingAnnotations]);

  useEffect(() => {
    if (containerRef.current && image) {
      const containerWidth = containerRef.current.clientWidth - 20;
      const containerHeight = window.innerHeight * 0.6;
      const imageRatio = image.width / image.height;
      const containerRatio = containerWidth / containerHeight;
      
      let width, height;
      if (imageRatio > containerRatio) {
        width = containerWidth;
        height = containerWidth / imageRatio;
      } else {
        height = containerHeight;
        width = containerHeight * imageRatio;
      }
      setStageSize({ width, height });
    }
  }, [image]);

  const handleMouseDown = (e: any) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setCurrentShape({
      tool,
      color,
      strokeWidth,
      points: [pos.x, pos.y]
    });
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !currentShape) return;
    const pos = e.target.getStage().getPointerPosition();
    
    if (tool === "freehand") {
      setCurrentShape({
        ...currentShape,
        points: [...currentShape.points, pos.x, pos.y]
      });
    } else {
      setCurrentShape({
        ...currentShape,
        points: [currentShape.points[0], currentShape.points[1], pos.x, pos.y]
      });
    }
  };

  const handleMouseUp = () => {
    if (currentShape && currentShape.points.length >= 2) {
      setShapes([...shapes, currentShape]);
    }
    setIsDrawing(false);
    setCurrentShape(null);
  };

  const handleUndo = () => {
    setShapes(shapes.slice(0, -1));
  };

  const handleSave = () => {
    onSave(shapes);
  };

  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#000000", "#ffffff"];

  const renderShape = (shape: DrawingShape, index: number) => {
    const key = `shape-${index}`;
    const commonProps = { stroke: shape.color, strokeWidth: shape.strokeWidth };

    switch (shape.tool) {
      case "freehand":
        return <Line key={key} points={shape.points} {...commonProps} lineCap="round" lineJoin="round" />;
      case "line":
        return <Line key={key} points={shape.points} {...commonProps} />;
      case "arrow":
        return <Arrow key={key} points={shape.points} {...commonProps} pointerLength={10} pointerWidth={10} />;
      case "rectangle":
        const [rx, ry, rx2, ry2] = shape.points;
        return <Rect key={key} x={Math.min(rx, rx2)} y={Math.min(ry, ry2)} 
          width={Math.abs(rx2 - rx)} height={Math.abs(ry2 - ry)} {...commonProps} />;
      case "circle":
        const [cx, cy, cx2, cy2] = shape.points;
        const radiusX = Math.abs(cx2 - cx) / 2;
        const radiusY = Math.abs(cy2 - cy) / 2;
        return <Ellipse key={key} x={(cx + cx2) / 2} y={(cy + cy2) / 2} 
          radiusX={radiusX} radiusY={radiusY} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-t-lg">
        <Button variant={tool === "freehand" ? "default" : "outline"} size="sm" onClick={() => setTool("freehand")} data-testid="tool-freehand">
          <Pencil className="w-4 h-4" />
        </Button>
        <Button variant={tool === "rectangle" ? "default" : "outline"} size="sm" onClick={() => setTool("rectangle")} data-testid="tool-rectangle">
          <Square className="w-4 h-4" />
        </Button>
        <Button variant={tool === "circle" ? "default" : "outline"} size="sm" onClick={() => setTool("circle")} data-testid="tool-circle">
          <Circle className="w-4 h-4" />
        </Button>
        <Button variant={tool === "arrow" ? "default" : "outline"} size="sm" onClick={() => setTool("arrow")} data-testid="tool-arrow">
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant={tool === "line" ? "default" : "outline"} size="sm" onClick={() => setTool("line")} data-testid="tool-line">
          <Minus className="w-4 h-4" />
        </Button>
        <div className="flex gap-1 ml-2">
          {colors.map(c => (
            <button
              key={c}
              className={`w-6 h-6 rounded border-2 ${color === c ? 'border-gray-800' : 'border-gray-300'}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              data-testid={`color-${c.replace('#', '')}`}
            />
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={handleUndo} disabled={shapes.length === 0} data-testid="button-undo">
          <Undo className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto bg-gray-200 flex items-center justify-center p-2">
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          style={{ background: '#fff', borderRadius: 8 }}
        >
          <Layer>
            {image && <KonvaImage image={image} width={stageSize.width} height={stageSize.height} />}
            {shapes.map((shape, i) => renderShape(shape, i))}
            {currentShape && renderShape(currentShape, -1)}
          </Layer>
        </Stage>
      </div>

      <div className="flex gap-2 p-2 bg-muted/50 rounded-b-lg justify-end">
        <Button variant="outline" onClick={onClose} data-testid="button-cancel-annotation">
          <X className="w-4 h-4 mr-1" /> 취소
        </Button>
        <Button onClick={handleSave} data-testid="button-save-annotation">
          <Save className="w-4 h-4 mr-1" /> 저장
        </Button>
      </div>
    </div>
  );
}

interface PhotoWithMeta {
  id: number;
  memoId: number;
  fileName: string;
  mimeType: string;
  hasImage: boolean;
  createdAt: string;
}

interface DrawingShape {
  tool: DrawingTool;
  color: string;
  strokeWidth: number;
  points: number[];
}

function MemoCard({ 
  memo, 
  onSelect, 
  onDelete, 
  isSelected 
}: { 
  memo: Memo; 
  onSelect: () => void; 
  onDelete: () => void;
  isSelected: boolean;
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500' : 'hover:bg-background'}`}
      onClick={onSelect}
      data-testid={`memo-card-${memo.id}`}
    >
      <CardHeader className="p-3 pb-1">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium truncate">
            {memo.title || "제목 없음"}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            data-testid={`delete-memo-${memo.id}`}
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xs text-muted-foreground line-clamp-2">{memo.body || "내용 없음"}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(memo.createdAt).toLocaleDateString('ko-KR')}
        </p>
      </CardContent>
    </Card>
  );
}

export default function MemoPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const zoomContentRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemoId, setSelectedMemoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [annotatingPhotoId, setAnnotatingPhotoId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 비밀번호 관련 상태
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isCreatePasswordDialogOpen, setIsCreatePasswordDialogOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingDeleteMemoId, setPendingDeleteMemoId] = useState<number | null>(null);
  const [deletePasswordInput, setDeletePasswordInput] = useState("");
  const [isDeletePasswordDialogOpen, setIsDeletePasswordDialogOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [newComment, setNewComment] = useState({ author: "", content: "" });
  const [showDetail, setShowDetail] = useState(false);
  const [isAdminPasswordDialogOpen, setIsAdminPasswordDialogOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [imageViewer, setImageViewer] = useState<ImageViewerState>({
    isOpen: false,
    images: [],
    currentIndex: 0,
    zoom: 1,
    panX: 0,
    panY: 0
  });
  const MASTER_PASSWORD = "910919";

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

  const { data: memosRaw, isLoading, error } = useQuery<Memo[]>({
    queryKey: ['memos'],
    queryFn: async () => {
      const res = await fetch('/api/memos');
      if (!res.ok) {
        throw new Error('메모 불러오기 실패');
      }
      return res.json();
    },
    staleTime: 0, // 항상 최신 데이터 가져오기
    refetchOnWindowFocus: true, // 포커스 시 재요청
  });

  // 배열 안전 처리
  const memosArray: Memo[] = Array.isArray(memosRaw) ? memosRaw : [];

  const selectedMemo = memosArray.find(m => m.id === selectedMemoId) ?? null;

  const { data: photos = [] } = useQuery<PhotoWithMeta[]>({
    queryKey: ["/api/memos", selectedMemoId, "photos"],
    queryFn: async () => {
      if (!selectedMemoId) return [];
      const res = await fetch(`/api/memos/${selectedMemoId}/photos`);
      if (!res.ok) throw new Error("Photos load failed");
      return res.json();
    },
    enabled: !!selectedMemoId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (selectedMemo) {
      setEditTitle(selectedMemo.title || "");
      setEditBody(selectedMemo.body || "");
    }
    setIsAuthenticated(false);
  }, [selectedMemo]);

  const createMemo = useMutation({
    mutationFn: async (password: string) => {
      const res = await fetch("/api/memos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "새 메모", body: "", password })
      });
      if (!res.ok) throw new Error("메모 생성 실패");
      return res.json();
    },
    onSuccess: (newMemo) => {
      queryClient.invalidateQueries({ queryKey: ["memos"] });
      setSelectedMemoId(newMemo.id);
      setIsEditing(true);
      setIsAuthenticated(true);
      toast({ title: "메모가 생성되었습니다" });
    },
    onError: (err) => {
      toast({ title: "메모 생성 실패", variant: "destructive" });
    }
  });

  const handleCreateMemo = () => {
    setNewPassword("");
    setIsCreatePasswordDialogOpen(true);
  };

  const confirmCreateMemo = () => {
    createMemo.mutate(newPassword);
    setIsCreatePasswordDialogOpen(false);
    setNewPassword("");
  };

  const handleEditClick = () => {
    if (!selectedMemo) return;
    if (isAuthenticated) {
      setIsEditing(true);
      return;
    }
    setPasswordInput("");
    setIsPasswordDialogOpen(true);
  };

  const verifyPassword = () => {
    if (!selectedMemo) return;
    const memoPassword = (selectedMemo as any).password;
    if (passwordInput === MASTER_PASSWORD || (memoPassword && passwordInput === memoPassword)) {
      setIsAuthenticated(true);
      setIsEditing(true);
      setIsPasswordDialogOpen(false);
      setPasswordInput("");
      toast({ title: passwordInput === MASTER_PASSWORD ? "관리자 권한으로 수정합니다" : "비밀번호 확인 완료" });
    } else {
      toast({ title: "비밀번호가 틀렸습니다", variant: "destructive" });
    }
  };

  const handleDeleteMemo = (memoId: number, memo: Memo) => {
    if (isAdminMode) {
      deleteMemo.mutate(memoId);
      return;
    }
    const memoPassword = (memo as any).password;
    if (!memoPassword) {
      toast({ title: "관리자만 삭제할 수 있습니다", variant: "destructive" });
      return;
    }
    setPendingDeleteMemoId(memoId);
    setDeletePasswordInput("");
    setIsDeletePasswordDialogOpen(true);
  };

  const verifyDeletePassword = () => {
    const memoToDelete = memosArray.find(m => m.id === pendingDeleteMemoId);
    if (!memoToDelete || !pendingDeleteMemoId) return;
    const memoPassword = (memoToDelete as any).password;
    if (deletePasswordInput === MASTER_PASSWORD || deletePasswordInput === memoPassword) {
      deleteMemo.mutate(pendingDeleteMemoId);
      setIsDeletePasswordDialogOpen(false);
      setPendingDeleteMemoId(null);
      setDeletePasswordInput("");
    } else {
      toast({ title: "비밀번호가 틀렸습니다", variant: "destructive" });
    }
  };

  const handleAdminModeToggle = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      toast({ title: "관리자 모드 해제" });
    } else {
      setAdminPasswordInput("");
      setIsAdminPasswordDialogOpen(true);
    }
  };

  const verifyAdminPassword = () => {
    if (adminPasswordInput === MASTER_PASSWORD) {
      setIsAdminMode(true);
      setIsAdminPasswordDialogOpen(false);
      setAdminPasswordInput("");
      toast({ title: "관리자 모드 활성화" });
    } else {
      toast({ title: "비밀번호가 틀렸습니다", variant: "destructive" });
    }
  };

  const updateMemo = useMutation({
    mutationFn: async () => {
      if (!selectedMemoId) return;
      const res = await fetch(`/api/memos/${selectedMemoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, body: editBody })
      });
      if (!res.ok) throw new Error("메모 수정 실패");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memos"] });
      setIsEditing(false);
      toast({ title: "메모가 저장되었습니다" });
    },
    onError: () => {
      toast({ title: "메모 수정 실패", variant: "destructive" });
    }
  });

  const deleteMemo = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/memos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("메모 삭제 실패");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memos"] });
      if (selectedMemoId) setSelectedMemoId(null);
      toast({ title: "메모가 삭제되었습니다" });
    },
    onError: () => {
      toast({ title: "메모 삭제 실패", variant: "destructive" });
    }
  });

  const uploadPhoto = useMutation({
    mutationFn: async (file: File) => {
      if (!selectedMemoId) return;
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`/api/memos/${selectedMemoId}/photos`, {
        method: "POST",
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "사진 업로드 실패");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memos", selectedMemoId, "photos"] });
      toast({ title: "사진이 업로드되었습니다" });
    },
    onError: (err: Error) => {
      toast({ title: "업로드 실패", description: err.message, variant: "destructive" });
    }
  });

  const deletePhoto = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("사진 삭제 실패");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memos", selectedMemoId, "photos"] });
      toast({ title: "사진이 삭제되었습니다" });
    },
    onError: () => {
      toast({ title: "사진 삭제 실패", variant: "destructive" });
    }
  });

  const saveAnnotations = useMutation({
    mutationFn: async ({ photoId, shapes }: { photoId: number; shapes: DrawingShape[] }) => {
      await fetch(`/api/photos/${photoId}/annotations`, { method: "DELETE" });
      for (const shape of shapes) {
        await fetch(`/api/photos/${photoId}/annotations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool: shape.tool,
            color: shape.color,
            strokeWidth: shape.strokeWidth,
            points: JSON.stringify(shape.points)
          })
        });
      }
    },
    onSuccess: () => {
      setAnnotatingPhotoId(null);
      toast({ title: "그리기가 저장되었습니다" });
    },
    onError: () => {
      toast({ title: "그리기 저장 실패", variant: "destructive" });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadPhoto.mutate(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <div ref={zoomContentRef} className="h-full flex flex-col bg-background">
        <div className="bg-card border-b p-3">
          <h1 className="text-lg font-bold tracking-tight mb-2">메모</h1>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="메모 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                data-testid="input-memo-search"
              />
            </div>
            <Button
              onClick={handleAdminModeToggle}
              variant={isAdminMode ? "default" : "outline"}
              size="sm"
              data-testid="button-admin-mode"
            >
              <Lock className="w-4 h-4 mr-1" />
              {isAdminMode ? "관리자" : "관리"}
            </Button>
            <Button onClick={handleCreateMemo} size="sm" data-testid="button-create-memo">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/3 border-r bg-card overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-2">
                {isLoading ? (
                  <p className="text-center text-muted-foreground py-4">로딩중...</p>
                ) : error ? (
                  <p className="text-center text-red-500 py-4">
                    메모 불러오기 실패: {(error as Error).message}
                  </p>
                ) : memosArray.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">메모가 없습니다</p>
                ) : (
                  memosArray.map(memo => (
                    <MemoCard
                      key={memo.id}
                      memo={memo}
                      isSelected={memo.id === selectedMemoId}
                      onSelect={() => { setSelectedMemoId(memo.id); setIsEditing(false); }}
                      onDelete={() => handleDeleteMemo(memo.id, memo)}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedMemo ? (
              <>
                <div className="bg-card border-b p-3">
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="제목"
                          className="flex-1"
                          data-testid="input-memo-title"
                        />
                        <Button size="sm" onClick={() => updateMemo.mutate()} data-testid="button-save-memo">
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} data-testid="button-cancel-edit">
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <h2 className="flex-1 font-medium">{selectedMemo.title || "제목 없음"}</h2>
                        <Button size="sm" variant="outline" onClick={handleEditClick} data-testid="button-edit-memo">
                          <Lock className="w-3 h-3 mr-1" />
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="p-3 space-y-4">
                    {isEditing ? (
                      <Textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        placeholder="내용을 입력하세요..."
                        className="min-h-[200px]"
                        data-testid="textarea-memo-body"
                      />
                    ) : (
                      <div className="whitespace-pre-wrap text-sm" data-testid="text-memo-body">
                        {selectedMemo.body || "내용 없음"}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm">첨부 사진 ({photos.length}/5)</h3>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          data-testid="input-photo-upload"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={photos.length >= 5}
                          data-testid="button-add-photo"
                        >
                          <Image className="w-4 h-4 mr-1" /> 사진 추가
                        </Button>
                      </div>
                      
                      {isPhotosLoading ? (
                        <div className="text-center py-4 text-muted-foreground text-sm animate-pulse">사진을 불러오는 중입니다...</div>
                      ) : photos.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {photos.map((photo, index) => (
                            <div key={photo.id} className="relative group">
                              <img
                                src={`/api/photos/${photo.id}/image`}
                                alt={photo.fileName}
                                className="w-full h-24 object-cover rounded cursor-pointer"
                                onClick={() => {
                                  const allImages = photos.map(p => `/api/photos/${p.id}/image`);
                                  openImageViewer(allImages, index);
                                }}
                                data-testid={`photo-${photo.id}`}
                              />
                              {isAuthenticated && (
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="mr-1"
                                    onClick={(e) => { e.stopPropagation(); setAnnotatingPhotoId(photo.id); }}
                                    data-testid={`annotate-photo-${photo.id}`}
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                  {isAdminMode && (
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={(e) => { e.stopPropagation(); deletePhoto.mutate(photo.id); }}
                                      data-testid={`delete-photo-${photo.id}`}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">첨부된 사진이 없습니다</p>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              {/* 댓글 섹션 */}
              <div className="border-t border-border p-3 shrink-0">
                <h3 className="font-medium text-sm mb-2">💬 댓글 ({memoComments.length})</h3>
                <div className="flex gap-2 mb-2">
                  <input
                    placeholder="작성자"
                    value={newComment.author}
                    onChange={e => setNewComment(p => ({ ...p, author: e.target.value }))}
                    className="w-20 text-xs border border-border rounded-lg px-2 py-1.5 bg-background outline-none"
                  />
                  <input
                    placeholder="댓글 내용"
                    value={newComment.content}
                    onChange={e => setNewComment(p => ({ ...p, content: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && createMemoComment()}
                    className="flex-1 text-xs border border-border rounded-lg px-2 py-1.5 bg-background outline-none"
                  />
                  <button
                    onClick={createMemoComment}
                    disabled={!newComment.author || !newComment.content}
                    className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg disabled:opacity-40"
                  >등록</button>
                </div>
                {memoComments.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-1">등록된 댓글이 없습니다</p>
                ) : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {memoComments.map((c: any) => (
                      <div key={c.id} className="flex items-start justify-between p-2 bg-muted rounded-lg">
                        <div>
                          <span className="text-xs font-medium">{c.author}</span>
                          <span className="text-xs text-muted-foreground ml-2">{new Date(c.createdAt).toLocaleDateString("ko-KR")}</span>
                          <p className="text-xs mt-0.5">{c.content}</p>
                        </div>
                        {isAdminMode && (
                          <button onClick={() => deleteMemoComment(c.id)} className="text-red-400 text-xs ml-2 shrink-0">✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                메모를 선택하거나 새로 만드세요
              </div>
            )}
          </div>
        </div>

        <Dialog open={annotatingPhotoId !== null} onOpenChange={(open) => !open && setAnnotatingPhotoId(null)}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>사진 편집</DialogTitle>
            </DialogHeader>
            {annotatingPhotoId && (
              <PhotoCanvas
                photoId={annotatingPhotoId}
                onClose={() => setAnnotatingPhotoId(null)}
                onSave={(shapes) => saveAnnotations.mutate({ photoId: annotatingPhotoId, shapes })}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* 메모 생성 비밀번호 다이얼로그 */}
        <Dialog open={isCreatePasswordDialogOpen} onOpenChange={setIsCreatePasswordDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>새 메모 비밀번호 설정</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <p className="text-sm text-muted-foreground">비밀번호를 설정하면 수정/삭제 시 필요합니다. (선택사항)</p>
              <input
                type="password"
                placeholder="비밀번호 (선택)"
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && confirmCreateMemo()}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatePasswordDialogOpen(false)}>취소</Button>
              <Button onClick={confirmCreateMemo}>만들기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 메모 수정 비밀번호 다이얼로그 */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>비밀번호 확인</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <input
                type="password"
                placeholder="비밀번호 입력"
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && verifyPassword()}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>취소</Button>
              <Button onClick={verifyPassword}>확인</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 메모 삭제 비밀번호 다이얼로그 */}
        <Dialog open={isDeletePasswordDialogOpen} onOpenChange={setIsDeletePasswordDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>삭제 확인</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <p className="text-sm text-muted-foreground">삭제하려면 비밀번호를 입력하세요.</p>
              <input
                type="password"
                placeholder="비밀번호 입력"
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={deletePasswordInput}
                onChange={e => setDeletePasswordInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && verifyDeletePassword()}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeletePasswordDialogOpen(false)}>취소</Button>
              <Button variant="destructive" onClick={verifyDeletePassword}>삭제</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 관리자 비밀번호 다이얼로그 */}
        <Dialog open={isAdminPasswordDialogOpen} onOpenChange={setIsAdminPasswordDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>관리자 모드</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <input
                type="password"
                placeholder="관리자 비밀번호 입력"
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={adminPasswordInput}
                onChange={e => setAdminPasswordInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && verifyAdminPassword()}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAdminPasswordDialogOpen(false)}>취소</Button>
              <Button onClick={verifyAdminPassword}>확인</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        
        
        {imageViewer.isOpen && (
          <ImageViewerComponent
            imageViewer={imageViewer}
            setImageViewer={setImageViewer}
            closeImageViewer={closeImageViewer}
          />
        )}
      </div>
    </>
  );
}