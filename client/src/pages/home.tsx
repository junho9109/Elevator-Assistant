import { useState, useRef, useEffect, useMemo } from "react";
import { ZoomControl } from "@/components/ZoomControl";
import structureImg from "@assets/structure_1764142259144.png";
import Fuse from "fuse.js";
import { Search, RefreshCw, Plus, X, Calendar, Pencil, Trash2 } from "lucide-react";
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
} from "@/lib/api";
import type { Standard } from "@shared/schema";

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
              return (
                <button key={day} onClick={() => selectDay(day)} className={`p-1 rounded-full hover:bg-blue-100 ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""}`}>{day}</button>
              );
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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomContentRef = useRef<HTMLDivElement>(null);

  const [activeButtonId, setActiveButtonId] = useState<number | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStandard, setEditingStandard] = useState<Standard | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Standard | null>(null);
  const [form, setForm] = useState(emptyForm);

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
      if (Math.hypot(clickX - btnX, clickY - btnY) < 25) setActiveButtonId(hotspot.id);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (form.images.length + files.length > 10) {
      toast({ title: "사진은 최대 10장까지 첨부 가능합니다.", variant: "destructive" });
      return;
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(prev => ({ ...prev, images: [...prev.images, ev.target?.result as string] }));
      reader.readAsDataURL(file);
    });
  };

  const openAddModal = () => {
    setEditingStandard(null);
    setForm(emptyForm);
    setShowAddModal(true);
  };

  const openEditModal = (standard: Standard) => {
    setEditingStandard(standard);
    setForm({
      categoryId: standard.categoryId ? String(standard.categoryId) : "",
      title: standard.title,
      standardNumber: standard.standardNumber || "",
      body: standard.body,
      permitDate: standard.permitDate || "",
      inspectionDate: standard.inspectionDate || "",
      inspectionYear: standard.inspectionYear || "",
      images: standard.imageUrls || [],
    });
    setSelectedStandard(null);
    setShowAddModal(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast({ title: "표준화명을 입력해주세요.", variant: "destructive" }); return; }
    if (!form.body.trim()) { toast({ title: "내용을 입력해주세요.", variant: "destructive" }); return; }
    const data = {
      categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      title: form.title,
      standardNumber: form.standardNumber || null,
      body: form.body,
      permitDate: form.permitDate || null,
      inspectionDate: form.inspectionDate || null,
      inspectionYear: form.inspectionYear || null,
      imageUrls: form.images.length > 0 ? form.images : null,
      hotspotId: null,
      inspectionRound: null,
    };
    try {
      if (editingStandard) {
        await updateStandard.mutateAsync({ id: editingStandard.id, standard: data });
        toast({ title: "수정되었습니다." });
      } else {
        await createStandard.mutateAsync(data);
        toast({ title: "추가되었습니다." });
      }
      setShowAddModal(false);
      setEditingStandard(null);
      setForm(emptyForm);
    } catch {
      toast({ title: "저장 실패", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteStandard.mutateAsync(deleteConfirm.id);
      toast({ title: "삭제되었습니다." });
      setDeleteConfirm(null);
      setSelectedStandard(null);
    } catch {
      toast({ title: "삭제 실패", variant: "destructive" });
    }
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
            <Button size="icon" onClick={openAddModal}>
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative w-full aspect-[2/3] sm:aspect-[3/4] md:aspect-[9/8] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 mb-8">
          <canvas ref={canvasRef} className="w-full h-full cursor-pointer" onClick={handleCanvasClick} />
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
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">내용</p>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selectedStandard.body}</p>
              </div>
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

      {/* 삭제 확인 팝업 */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-2">삭제 확인</h2>
            <p className="text-gray-600 text-sm mb-6">
              <span className="font-semibold text-gray-900">"{deleteConfirm.title}"</span>을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>취소</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={deleteStandard.isPending}>
                {deleteStandard.isPending ? "삭제 중..." : "삭제"}
              </Button>
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
