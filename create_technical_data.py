#!/usr/bin/env python3
# 이 스크립트를 WSL에서 실행하세요

with open('client/src/pages/home.tsx', 'r') as f:
    lines = f.readlines()

# 새 파일 내용 구성
new_file = '''import { createPortal } from "react-dom";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import defaultStructureImg from "@assets/structure_1764142259144.png";
import Fuse from "fuse.js";
import { Search, Plus, X, Calendar, Pencil, Trash2, Settings, ImageIcon } from "lucide-react";
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

const emptyForm = { categoryId: "", title: "", standardNumber: "", body: "", permitDate: "", inspectionDate: "", inspectionYear: "", images: [] as string[] };

function DatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const months = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({length: daysInMonth}, (_, i) => i + 1);
  const selectDay = (day: number) => {
    onChange(`${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`);
    setOpen(false);
  };
  return (
    <div className="relative">
      <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-card cursor-pointer" onClick={() => setOpen(!open)}>
        <span className="flex-1 text-sm">{value || "날짜 선택"}</span>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </div>
      {open && (
        <div className="absolute z-50 mt-1 bg-card border rounded-xl shadow-xl p-4 w-72">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => { if (viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); }} className="p-1 hover:bg-muted rounded">◀</button>
            <span className="font-semibold text-sm">{viewYear}년 {months[viewMonth]}</span>
            <button onClick={() => { if (viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); }} className="p-1 hover:bg-muted rounded">▶</button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-1">{["일","월","화","수","목","금","토"].map(d=><div key={d}>{d}</div>)}</div>
          <div className="grid grid-cols-7 text-center text-sm">
            {blanks.map((_,i)=><div key={`b${i}`}/>)}
            {days.map(day=>{
              const dateStr=`${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              return <button key={day} onClick={()=>selectDay(day)} className={`p-1 rounded-full hover:bg-primary/20 ${value===dateStr?"bg-primary text-primary-foreground":""}`}>{day}</button>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TechnicalDataPage() {
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

  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStandard, setEditingStandard] = useState<Standard | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Standard | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editMode, setEditMode] = useState(false);
  const [structureImg, setStructureImg] = useState<string>(defaultStructureImg);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [cardOffsets, setCardOffsets] = useState<Record<number, {cx: number, cy: number}>>({});
  const [draggingCardId, setDraggingCardId] = useState<number | null>(null);
  const [cardDragOffset, setCardDragOffset] = useState({ x: 0, y: 0 });
  const [showAddHotspot, setShowAddHotspot] = useState(false);
  const [newHotspotLabel, setNewHotspotLabel] = useState("");
  const [deleteHotspotConfirm, setDeleteHotspotConfirm] = useState<Hotspot | null>(null);
  const [activeButtonId, setActiveButtonId] = useState<number | null>(null);

  const fuse = useMemo(() => new Fuse(standards, { keys: ["title", "body", "standardNumber"], threshold: 0.4 }), [standards]);

  const displayItems = useMemo(() => {
    if (searchTerm.length > 0) return fuse.search(searchTerm).map(r => r.item);
    if (activeButtonId) {
      const h = hotspots.find(h => h.id === activeButtonId);
      if (h) return standards.filter(s => s.categoryId === h.categoryId);
    }
    return standards;
  }, [standards, searchTerm, activeButtonId, fuse, hotspots]);

  const activeButton = hotspots.find(h => h.id === activeButtonId);

  useEffect(() => {
    fetch("/api/settings/cardOffsets")
      .then(r => r.json())
      .then(d => { if (d.value) setCardOffsets(JSON.parse(d.value)); })
      .catch(() => {});
    fetch("/api/settings/structureImg")
      .then(r => r.json())
      .then(d => { if (d.value) setStructureImg(d.value); })
      .catch(() => {});
  }, []);

'''

# getCardOffset ~ drawCanvas ~ 기타 함수들 (411~692번, 0-indexed: 410~691)
funcs = ''.join(lines[410:692])
new_file += funcs

# handleDeleteHotspot ~ handleDelete (693~735번, 0-indexed: 692~735)
handlers = ''.join(lines[692:736])
new_file += handlers

# 렌더링 시작
new_file += '''
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <div className="sticky top-0 z-40 bg-card border-b border-border px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <ImageIcon className="h-3 w-3 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-xs">기술자료</h1>
              <p className="text-[10px] text-muted-foreground">구조도 & 표준화 자료</p>
            </div>
          </div>
          {editMode && (
            <button onClick={() => setShowAddHotspot(true)} className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-lg">+ 버튼 추가</button>
          )}
          <button onClick={() => setEditMode(e => !e)} className="p-1.5 rounded-lg hover:bg-muted">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

'''

# 기술자료 탭 UI (889~962번, 0-indexed: 888~961) - activeTab 조건 제거
tab_ui_lines = lines[888:963]
tab_ui = ''.join(tab_ui_lines)
# activeTab 조건 래퍼 제거
tab_ui = tab_ui.replace('      {/* ==================== 기술자료 탭 ==================== */}\n', '')
tab_ui = tab_ui.replace('      {activeTab === "map" && (\n', '')
# 마지막 ")}" 제거
last_close = tab_ui.rfind('      )}')
if last_close >= 0:
    tab_ui = tab_ui[:last_close]
new_file += tab_ui

# 모달들 (965~1063번, 0-indexed: 964~1062)
modals = ''.join(lines[964:1063])
new_file += '\n' + modals

# 표준화 상세 팝업 (1098~1125번, 0-indexed: 1097~1125)
standard_popup = ''.join(lines[1097:1126])
new_file += '\n' + standard_popup

new_file += '''
    </div>
  );
}
'''

with open('client/src/pages/technical-data.tsx', 'w') as f:
    f.write(new_file)

print("✅ technical-data.tsx 생성 완료")
print("길이:", len(new_file))
