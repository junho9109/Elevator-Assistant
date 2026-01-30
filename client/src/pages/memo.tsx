import { useState, useRef, useEffect, useCallback } from "react";
import { ZoomControl } from "@/components/ZoomControl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Trash2, Image, Edit2, Save, X, Pencil, Square, Circle, ArrowRight, Minus, Undo, Palette, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Stage, Layer, Line, Rect, Ellipse, Arrow, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import type { Memo, MemoPhoto, PhotoAnnotation } from "@shared/schema";

type DrawingTool = "freehand" | "rectangle" | "circle" | "arrow" | "line";

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
      return res.json();
    }
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
      <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-t-lg">
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

      <div className="flex gap-2 p-2 bg-gray-100 rounded-b-lg justify-end">
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
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'}`}
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
        <p className="text-xs text-gray-500 line-clamp-2">{memo.body || "내용 없음"}</p>
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
  const MASTER_PASSWORD = "910919";

  const { data: memos = [], isLoading } = useQuery<Memo[]>({
    queryKey: ["/api/memos", searchQuery],
    queryFn: async () => {
      const url = searchQuery ? `/api/memos?search=${encodeURIComponent(searchQuery)}` : "/api/memos";
      const res = await fetch(url);
      return res.json();
    }
  });

  const selectedMemo = memos.find(m => m.id === selectedMemoId);

  const { data: photos = [] } = useQuery<PhotoWithMeta[]>({
    queryKey: ["/api/memos", selectedMemoId, "photos"],
    queryFn: async () => {
      if (!selectedMemoId) return [];
      const res = await fetch(`/api/memos/${selectedMemoId}/photos`);
      return res.json();
    },
    enabled: !!selectedMemoId
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
      return res.json();
    },
    onSuccess: (newMemo) => {
      queryClient.invalidateQueries({ queryKey: ["/api/memos"] });
      setSelectedMemoId(newMemo.id);
      setIsEditing(true);
      setIsAuthenticated(true);
      toast({ title: "메모가 생성되었습니다" });
    }
  });

  const handleCreateMemo = () => {
    setIsCreatePasswordDialogOpen(true);
    setNewPassword("");
  };

  const confirmCreateMemo = () => {
    if (!newPassword) {
      toast({ title: "비밀번호를 입력해주세요", variant: "destructive" });
      return;
    }
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
    if (passwordInput === MASTER_PASSWORD || passwordInput === memoPassword) {
      setIsAuthenticated(true);
      setIsEditing(true);
      setIsPasswordDialogOpen(false);
      setPasswordInput("");
      toast({ title: passwordInput === MASTER_PASSWORD ? "관리자 권한으로 수정합니다" : "비밀번호 확인 완료" });
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
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memos"] });
      setIsEditing(false);
      toast({ title: "메모가 저장되었습니다" });
    }
  });

  const deleteMemo = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/memos/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memos"] });
      if (selectedMemoId) setSelectedMemoId(null);
      toast({ title: "메모가 삭제되었습니다" });
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
        throw new Error(err.error);
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
      await fetch(`/api/photos/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memos", selectedMemoId, "photos"] });
      toast({ title: "사진이 삭제되었습니다" });
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
      <div ref={zoomContentRef} className="h-full flex flex-col bg-gray-50">
        <div className="bg-white border-b p-3">
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
          <Button onClick={handleCreateMemo} size="sm" data-testid="button-create-memo">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 border-r bg-white overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-2">
              {isLoading ? (
                <p className="text-center text-gray-500 py-4">로딩중...</p>
              ) : memos.length === 0 ? (
                <p className="text-center text-gray-500 py-4">메모가 없습니다</p>
              ) : (
                memos.map(memo => (
                  <MemoCard
                    key={memo.id}
                    memo={memo}
                    isSelected={memo.id === selectedMemoId}
                    onSelect={() => { setSelectedMemoId(memo.id); setIsEditing(false); }}
                    onDelete={() => deleteMemo.mutate(memo.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedMemo ? (
            <>
              <div className="bg-white border-b p-3">
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
                    
                    {photos.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {photos.map(photo => (
                          <div key={photo.id} className="relative group">
                            <img
                              src={`/api/photos/${photo.id}/image`}
                              alt={photo.fileName}
                              className="w-full h-24 object-cover rounded cursor-pointer"
                              onClick={() => setAnnotatingPhotoId(photo.id)}
                              data-testid={`photo-${photo.id}`}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="mr-1"
                                onClick={() => setAnnotatingPhotoId(photo.id)}
                                data-testid={`annotate-photo-${photo.id}`}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deletePhoto.mutate(photo.id)}
                                data-testid={`delete-photo-${photo.id}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">첨부된 사진이 없습니다</p>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
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
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-memo-password">비밀번호</Label>
              <Input
                id="new-memo-password"
                type="password"
                placeholder="메모 비밀번호를 입력하세요"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirmCreateMemo()}
                data-testid="input-new-memo-password"
              />
              <p className="text-xs text-muted-foreground">
                이 비밀번호로 메모를 수정할 수 있습니다
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatePasswordDialogOpen(false)}>취소</Button>
            <Button onClick={confirmCreateMemo} data-testid="button-confirm-create-memo">생성</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 메모 수정 비밀번호 확인 다이얼로그 */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>비밀번호 확인</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="memo-password">비밀번호</Label>
              <Input
                id="memo-password"
                type="password"
                placeholder="메모 비밀번호 또는 관리자 비밀번호"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && verifyPassword()}
                data-testid="input-memo-password"
              />
              <p className="text-xs text-muted-foreground">
                메모 작성자 비밀번호 또는 관리자 비밀번호를 입력하세요
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>취소</Button>
            <Button onClick={verifyPassword} data-testid="button-verify-password">확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
      <ZoomControl contentRef={zoomContentRef} storageKey="memoPageZoom" />
    </>
  );
}
