import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { ZoomControl } from "@/components/ZoomControl";
import defaultStructureImg from "@assets/structure_1764142259144.png";
import Fuse from "fuse.js";
import { Search, RefreshCw, Plus, X, Calendar, Pencil, Trash2, Settings, Move, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import {
  useStandards, useHotspots, useCreateStandard, useUpdateStandard, useDeleteStandard,
  useCreateHotspot, useUpdateHotspot, useDeleteHotspot,
} from "@/lib/api";
import type { Standard, Hotspot } from "@shared/schema";

function DatePicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  const [viewYear, setViewYear] = useState(() => value ? parseInt(value.split("-")[0]) : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => value ? parseInt(value.split("-")[1]) - 1 : new Date().getMonth());
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const months = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  const selectDay = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}-${m}-${d}`);
    setShow(false);
  };
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:border-blue-400 bg-white" onClick={() => setShow(!show)}>
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className={value ? "text-gray-900" : "text-gray-400"}>{value || "날짜 선택"}</span>
        {value && <button className="ml-auto text-gray-400 hover:text-gray-600" onClick={e => { e.stopPropagation(); onChange(""); }}><X className="h-3 w-3" /></button>}
      </div>
      {show && (
        <div className="absolute z-50 mt-1 bg-white border rounded-xl shadow-xl p-4 w-72">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); } else setViewMonth(m => m-1); }} className="p-1 hover:bg-gray-100 rounded">◀</button>
            <span className="font-semibold">{viewYear}년 {months[viewMonth]}</span>
            <button onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1); } else setViewMonth(m => m+1); }} className="p-1 hover:bg-gray-100 rounded">▶</button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
            {["일","월","화","수","목","금","토"].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 text-center text-sm">
            {blanks.map(i => <div key={`b${i}`} />)}
            {days.map(day => {
              const m = String(viewMonth+1).padStart(2,"0");
              const d = String(day).padStart(2,"0");
              const dateStr = `${viewYear}-${m}-${d}`;
              const isSelected = value === dateStr;
              return <button key={day} onClick={() => selectDay(day)} className={`p-1 rounded-full hover:bg-blue-100 ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""}`}>{day}</button>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const emptyForm = { categoryId: "", title: "", standardNumber: "", body: "", permitDate: "", inspectionDate: "", inspectionYear: "", images: [] as string[] };

export default function Home() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: standards = [] } = useStandards();
  const { data: hotspots = [] } = useHotspots();
  const createStandard = useCreateStandard();
  const updateStandard = useUpdateStandard();
  const deleteStandard = useDeleteStandard();
  const createHotspot = useCreateHotspot();
  const updateHotspot = useUpdateHotspot();
  const deleteHotspot = useDeleteHotspot();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomContentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeButtonId, setActiveButtonId] = useState<number | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStandard, setEditingStandard] = useState<Standard | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Standard | null>(null);
  const [form, setForm] = useState(emptyForm);

  // 편집 모드
  const [editMode, setEditMode] = useState(false);
  const [structureImg, setStructureImg] = useState<string>(() => localStorage.getItem("structureImg") || defaultStructureImg);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAddHotspot, setShowAddHotspot] = useState(false);
  const [newHotspotLabel, setNewHotspotLabel] = useState("");
  const [deleteHotspotConfirm, setDeleteHotspotConfirm] = useState<Hotspot | null>(null);

  const fuse = useMemo(() => new Fuse(standards, { keys: ["title", "body", "standardNumber"], threshold: 0.4 }), [standards]);

  const displayItems = useMemo(() => {
    if (searchTerm.length > 0) return fuse.search(searchTerm).map(r => r.item);
    if (activeButtonId) {
      const activeHotspot = hotspots.find(h => h.id === activeButtonId);
      if (activeHotspot) return standards.filter(s => s.categoryId === activeHotspot.categoryId);
    }
    return standards;
  }, [standards, searchTerm, activeButtonId, fuse, hotspots]);

  const activeButton = hotspots.find(h => h.id === activeButtonId);

  // Canvas 그리기
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
        ctx.fillStyle = isActive ? "#2563eb" : editMode ? "rgba(234,88,12,0.85)" : "rgba(30,41,55,0.85)";
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;
        ctx.fill();
        ctx.restore();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = isActive ? "#93c5fd" : editMode ? "#fed7aa" : "#ffffff";
        ctx.lineWidth = isActive ? 3 : 1.5;
        ctx.stroke();
        if (editMode) {
          ctx.beginPath();
          ctx.moveTo(x - 5, y);
          ctx.lineTo(x + 5, y);
          ctx.moveTo(x, y - 5);
          ctx.lineTo(x, y + 5);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = editMode ? "top" : "middle";
        ctx.fillText(hotspot.label, x, editMode ? y + 4 : y);
      });
    };
  }, [hotspots, activeButtonId, structureImg, editMode]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  // 이미지 변경
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setStructureImg(result);
      localStorage.setItem("structureImg", result);
      toast({ title: "구조도 이미지가 변경되었습니다." });
    };
    reader.readAsDataURL(file);
  };

  // 캔버스에서 좌표 계산
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, px: 0, py: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const px = (clientX - rect.left) * scaleX;
    const py = (clientY - rect.top) * scaleY;
    return { x: (px / canvas.width) * 100, y: (py / canvas.height) * 100, px, py };
  };

  // 캔버스 클릭
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingId !== null) return;
    const { x, y, px, py } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    let clicked = false;
    hotspots.forEach(hotspot => {
      const btnX = (parseFloat(hotspot.left) / 100) * canvas.width;
      const btnY = (parseFloat(hotspot.top) / 100) * canvas.height;
      if (Math.hypot(px - btnX, py - btnY) < 25) {
        clicked = true;
        if (!editMode) setActiveButtonId(hotspot.id);
      }
    });
  };

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!editMode) return;
    const { px, py } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    hotspots.forEach(hotspot => {
      const btnX = (parseFloat(hotspot.left) / 100) * canvas.width;
      const btnY = (parseFloat(hotspot.top) / 100) * canvas.height;
      if (Math.hypot(px - btnX, py - btnY) < 25) {
        setDraggingId(hotspot.id);
        setDragOffset({ x: px - btnX, y: py - btnY });
      }
    });
  };

  // 드래그 이동
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!editMode || draggingId === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = (e.clientX - rect.left) * scaleX - dragOffset.x;
    const py = (e.clientY - rect.top) * scaleY - dragOffset.y;
    const newLeft = Math.max(0, Math.min(100, (px / canvas.width) * 100));
    const newTop = Math.max(0, Math.min(100, (py / canvas.height) * 100));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // 임시로 화면만 업데이트 (DB 저장은 mouseup에서)
    drawCanvas();
    const img = new Image();
    img.src = structureImg;
    img.onload = () => {
      const x = (newLeft / 100) * canvas.width;
      const y = (newTop / 100) * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(234,88,12,0.9)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.strokeStyle = "#fed7aa";
      ctx.lineWidth = 2;
      ctx.stroke();
      const hotspot = hotspots.find(h => h.id === draggingId);
      if (hotspot) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(hotspot.label, x, y + 4);
      }
    };
  };

  // 드래그 종료
  const handleMouseUp = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!editMode || draggingId === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = (e.clientX - rect.left) * scaleX - dragOffset.x;
    const py = (e.clientY - rect.top) * scaleY - dragOffset.y;
    const newLeft = Math.max(2, Math.min(98, (px / canvas.width) * 100));
    const newTop = Math.max(2, Math.min(98, (py / canvas.height) * 100));
    try {
      await updateHotspot.mutateAsync({
        id: draggingId,
        hotspot: { left: `${newLeft.toFixed(1)}%`, top: `${newTop.toFixed(1)}%` }
      });
    } catch {
      toast({ title: "위치 저장 실패", variant: "destructive" });
    }
    setDraggingId(null);
  };

  // 핫스팟 추가
  const handleAddHotspot = async () => {
    if (!newHotspotLabel.trim()) { toast({ title: "버튼 이름을 입력해주세요.", variant: "destructive" }); return; }
    try {
      await createHotspot.mutateAsync({ label: newHotspotLabel, top: "50%", left: "50%", categoryId: null });
      toast({ title: `"${newHotspotLabel}" 버튼이 추가되었습니다.` });
      setNewHotspotLabel("");
      setShowAddHotspot(false);
    } catch {
      toast({ title: "버튼 추가 실패", variant: "destructive" });
    }
  };

  // 핫스팟 삭제
  const handleDeleteHotspot = async () => {
    if (!deleteHotspotConfirm) return;
    try {
      await deleteHotspot.mutateAsync(deleteHotspotConfirm.id);
      toast({ title: "버튼이 삭제되었습니다." });
      setDeleteHotspotConfirm(null);
    } catch {
      toast({ title: "삭제 실패", variant: "destructive" });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (form.images.length + files.length > 10) { toast({ title: "사진은 최대 10장까지 첨부 가능합니다.", variant: "destructive" }); return; }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(prev => ({ ...prev, images: [...prev.images, ev.target?.result as string] }));
      reader.readAsDataURL(file);
    });
  };

  const openAddModal = () => { setEditingStandard(null); setForm(emptyForm); setShowAddModal(true); };
  const openEditModal = (standard: Standard) => {
    setEditingStandard(standard);
    setForm({ categoryId: standard.categoryId ? String(standard.categoryId) : "", title: standard.title, standardNumber: standard.standardNumber || "", body: standard.body, permitDate: standard.permitDate || "", inspectionDate: standard.inspectionDate || "", inspectionYear: standard.inspectionYear || "", images: standard.imageUrls || [] });
    setSelectedStandard(null);
    setShowAddModal(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast({ title: "표준화명을 입력해주세요.", variant: "destructive" }); return; }
    if (!form.body.trim()) { toast({ title: "내용을 입력해주세요.", variant: "destructive" }); return; }
    const data = { categoryId: form.categoryId ? parseInt(form.categoryId) : null, title: form.title, standardNumber: form.standardNumber || null, body: form.body, permitDate: form.permitDate || null, inspectionDate: form.inspectionDate || null, inspectionYear: form.inspectionYear || null, imageUrls: form.images.length > 0 ? form.images : null, hotspotId: null, inspectionRound: null };
    try {
      if (editingStandard) { await updateStandard.mutateAsync({ id: editingStandard.id, standard: data }); toast({ title: "수정되었습니다." }); }
      else { await createStandard.mutateAsync(data); toast({ title: "추가되었습니다." }); }
      setShowAddModal(false); setEditingStandard(null); setForm(emptyForm);
    } catch { toast({ title: "저장 실패", variant: "destructive" }); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteStandard.mutateAsync(deleteConfirm.id);
      toast({ title: "삭제되었습니다." });
      setDeleteConfirm(null); setSelectedStandard(null);
    } catch { toast({ title: "삭제 실패", variant: "destructive" }); }
  };

  if (!hotspots || hotspots.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto" ref={zoomContentRef}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">기술자료조회</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => { queryClient.invalidateQueries({ queryKey: ["standards"] }); queryClient.invalidateQueries({ queryKey: ["hotspots"] }); }}>
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button variant={editMode ? "default" : "outline"} size="icon" onClick={() => setEditMode(!editMode)} title="편집 모드">
              <Settings className="h-5 w-5" />
            </Button>
            <Button size="icon" onClick={openAddModal}>
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* 편집 모드 툴바 */}
        {editMode && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex flex-wrap gap-3 items-center">
            <span className="text-orange-700 font-medium text-sm">✏️ 편집 모드 — 버튼을 드래그해서 이동하세요</span>
            <label className="flex items-center gap-2 cursor-pointer bg-white border border-orange-300 rounded-lg px-3 py-1.5 text-sm text-orange-700 hover:bg-orange-50">
              <ImageIcon className="h-4 w-4" />
              구조도 변경
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            <Button size="sm" variant="outline" className="border-orange-300 text-orange-700" onClick={() => setShowAddHotspot(true)}>
              <Plus className="h-4 w-4 mr-1" /> 버튼 추가
            </Button>
            {hotspots.map(h => (
              <Button key={h.id} size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => setDeleteHotspotConfirm(h)}>
                <Trash2 className="h-3 w-3 mr-1" /> {h.label} 삭제
              </Button>
            ))}
          </div>
        )}

        <div className="relative w-full aspect-[2/3] sm:aspect-[3/4] md:aspect-[9/8] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 mb-8" ref={containerRef}>
          <canvas
            ref={canvasRef}
            className={`w-full h-full ${editMode ? "cursor-move" : "cursor-pointer"}`}
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { if (draggingId !== null) setDraggingId(null); }}
          />
        </div>

        <div className="p-6 bg-white rounded-xl shadow border border-gray-200">
          <h2 className="text-2xl font-bold mb-6">
            {activeButton ? `${activeButton.label} 기준 목록` : "전체 기준 목록"}
          </h2>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="기준 검색..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {displayItems.length === 0 ? (
              <p className="text-center text-gray-500 py-10">기준이 없습니다</p>
            ) : (
              displayItems.map(standard => (
                <div key={standard.id} className="bg-gray-50 rounded-lg p-4 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors cursor-pointer" onClick={() => setSelectedStandard(standard)}>
                  <h3 className="font-semibold text-base mb-1">{standard.title}</h3>
                  {standard.standardNumber && <Badge variant="outline" className="mb-2 text-xs">{standard.standardNumber}</Badge>}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{standard.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 상세 팝업 */}
      {selectedStandard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedStandard(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start p-6 border-b">
              <h2 className="text-xl font-bold pr-4">{selectedStandard.title}</h2>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEditModal(selectedStandard)} className="text-blue-500 hover:text-blue-700"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => { setDeleteConfirm(selectedStandard); setSelectedStandard(null); }} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                <button onClick={() => setSelectedStandard(null)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {selectedStandard.standardNumber && <Badge variant="outline">{selectedStandard.standardNumber}</Badge>}
              {selectedStandard.permitDate && <div className="flex gap-2 text-sm"><span className="text-gray-500 font-medium">건축허가일:</span><span>{selectedStandard.permitDate}</span></div>}
              {selectedStandard.inspectionDate && <div className="flex gap-2 text-sm"><span className="text-gray-500 font-medium">검사기준적용일:</span><span>{selectedStandard.inspectionDate}</span></div>}
              {selectedStandard.inspectionYear && <div className="flex gap-2 text-sm"><span className="text-gray-500 font-medium">검사일:</span><span>{selectedStandard.inspectionYear}</span></div>}
              <div><p className="text-sm font-medium text-gray-500 mb-1">내용</p><p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selectedStandard.body}</p></div>
              {selectedStandard.imageUrls && selectedStandard.imageUrls.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">이미지 ({selectedStandard.imageUrls.length}장)</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedStandard.imageUrls.map((url, i) => <img key={i} src={url} alt={`이미지 ${i+1}`} className="rounded-lg w-full object-cover border" />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 표준화 삭제 확인 */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-2">삭제 확인</h2>
            <p className="text-gray-600 text-sm mb-6"><span className="font-semibold text-gray-900">"{deleteConfirm.title}"</span>을 삭제하시겠습니까?</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>취소</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={deleteStandard.isPending}>{deleteStandard.isPending ? "삭제 중..." : "삭제"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* 버튼 추가 팝업 */}
      {showAddHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowAddHotspot(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">버튼 추가</h2>
            <label className="block text-sm font-medium text-gray-700 mb-1">버튼 이름</label>
            <Input placeholder="예: 기계실" value={newHotspotLabel} onChange={e => setNewHotspotLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddHotspot()} className="mb-4" />
            <p className="text-xs text-gray-500 mb-4">추가 후 구조도에서 드래그해서 위치를 조정하세요.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddHotspot(false)}>취소</Button>
              <Button className="flex-1" onClick={handleAddHotspot} disabled={createHotspot.isPending}>{createHotspot.isPending ? "추가 중..." : "추가"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* 버튼 삭제 확인 */}
      {deleteHotspotConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteHotspotConfirm(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-2">버튼 삭제</h2>
            <p className="text-gray-600 text-sm mb-6"><span className="font-semibold">"{deleteHotspotConfirm.label}"</span> 버튼을 삭제하시겠습니까?</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteHotspotConfirm(null)}>취소</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDeleteHotspot} disabled={deleteHotspot.isPending}>{deleteHotspot.isPending ? "삭제 중..." : "삭제"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* 추가/수정 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{editingStandard ? "표준화 수정" : "표준화 추가"}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">분류 (버튼 선택)</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.categoryId} onChange={e => setForm(prev => ({ ...prev, categoryId: e.target.value }))}>
                  <option value="">전체 (분류 없음)</option>
                  {hotspots.map(h => <option key={h.id} value={h.categoryId ?? ""}>{h.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">표준화명 *</label>
                <Input placeholder="표준화명 입력" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">항목 번호</label>
                <Input placeholder="예: 6.3.2" value={form.standardNumber} onChange={e => setForm(prev => ({ ...prev, standardNumber: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용 *</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px] resize-y" placeholder="내용 입력" value={form.body} onChange={e => setForm(prev => ({ ...prev, body: e.target.value }))} />
              </div>
              <DatePicker label="건축허가일" value={form.permitDate} onChange={v => setForm(prev => ({ ...prev, permitDate: v }))} />
              <DatePicker label="검사기준적용일" value={form.inspectionDate} onChange={v => setForm(prev => ({ ...prev, inspectionDate: v }))} />
              <DatePicker label="검사일" value={form.inspectionYear} onChange={v => setForm(prev => ({ ...prev, inspectionYear: v }))} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사진 첨부 (최대 10장)</label>
                <input type="file" accept="image/*" multiple className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={handleImageUpload} />
                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative">
                        <img src={img} alt={`첨부 ${i+1}`} className="w-full h-20 object-cover rounded-lg border" />
                        <button className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs" onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>취소</Button>
                <Button className="flex-1" onClick={handleSubmit} disabled={createStandard.isPending || updateStandard.isPending}>
                  {createStandard.isPending || updateStandard.isPending ? "저장 중..." : "저장"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ZoomControl contentRef={zoomContentRef} storageKey="homePageZoom" />
    </div>
  );
}
