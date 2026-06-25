import React from "react";
import { createPortal } from "react-dom";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import defaultStructureImg from "@assets/structure_new.jpg";
import Fuse from "fuse.js";
import { Search, Plus, X, Calendar, Pencil, Trash2, Settings, ImageIcon, Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useStandards, useHotspots, useCreateStandard, useUpdateStandard, useDeleteStandard, useCreateCategory,
  useCreateHotspot, useUpdateHotspot, useDeleteHotspot,
} from "@/lib/api";
import type { Standard, Hotspot } from "@shared/schema";
import { INSPECTION_DATA_MR } from "@/data/inspection-data-mr";
import INSPECTION_CONTENT from "@/data/inspection-content.json";
import ReactMarkdown from "react-markdown";
import STD_DATA from "@/data/표준화_parsed.json";
type StdItem = { title: string; ref: string; basis: string; conclusion: string; source: string; typeTag: string; category: string; };
const STD_ITEMS = STD_DATA as StdItem[];
const STD_CATEGORIES = ["전체", "기계실", "피트", "승강로", "카상부", "카·문", "에스컬레이터", "주행성능", "제동장치", "완충기", "과속조절기", "덤웨이터", "휠체어리프트", "안전회로", "기타"];

// ==================== 유사 검색 ====================

// 유사어·약어·오타 사전 (승강기 검사 도메인 특화)
const SYNONYMS: Record<string, string[]> = {
  // 점형블록 계열
  "점형블록": ["점형블럭", "점자블록", "점자블럭", "점블록", "점자유도블록"],
  "점형블럭": ["점형블록"],
  // 과속조절기·조속기
  "과속조절기": ["조속기", "스피드거버너", "거버너"],
  "조속기": ["과속조절기", "거버너"],
  // 추락방지안전장치·비상정지
  "추락방지안전장치": ["비상정지장치", "세이프티", "세이프티기어", "비상제동"],
  "비상정지장치": ["추락방지안전장치", "세이프티기어"],
  // 개문출발방지장치
  "개문출발방지장치": ["ucmp", "개문출발", "문열림출발방지"],
  "ucmp": ["개문출발방지장치", "개문출발"],
  // 상승과속방지장치
  "상승과속방지장치": ["ucm", "로프브레이크", "카브레이크", "이중브레이크"],
  // 기계실 없는
  "기계실없는": ["mrl", "머신룸리스"],
  "mrl": ["기계실없는", "머신룸리스"],
  "mr": ["기계실있는"],
  // 완충기
  "완충기": ["버퍼", "쿠션", "충격완화"],
  // 에이프런
  "에이프런": ["에프런", "apron"],
  // 비상통화장치
  "비상통화장치": ["비상호출", "인터폰", "비상벨", "비상통화"],
  // 승강장문
  "승강장문": ["홀도어", "층문", "hall door", "승강장도어"],
  "홀도어": ["승강장문", "hall door"],
  // 카문
  "카문": ["카도어", "car door", "카 도어"],
  "카도어": ["카문"],
  // 권상기
  "권상기": ["호이스팅머신", "구동기", "traction machine"],
  "구동기": ["권상기", "호이스팅머신"],
  // 주행안내레일
  "주행안내레일": ["가이드레일", "레일", "guide rail"],
  "가이드레일": ["주행안내레일", "레일"],
  // 균형추
  "균형추": ["카운터웨이트", "counter weight"],
  "카운터웨이트": ["균형추"],
  // 과속조절기로프
  "과속조절기로프": ["조속기로프", "거버너로프"],
  // 피트
  "피트": ["pit", "엘리베이터피트"],
  // 검사 종류
  "수시검사": ["임시검사", "특별검사"],
  "정밀안전검사": ["정밀검사", "정안검"],
  "정기검사": ["정기안전검사"],
  // 리모델링
  "리모델링": ["교체설치", "개조", "교체공사"],
  "교체설치": ["리모델링"],
  // 스커트가드
  "스커트가드": ["치마판", "스커트"],
  // 비상구출문
  "비상구출문": ["비상구출해치", "탈출해치", "비상해치"],
  // 도어록
  "잠금장치": ["도어록", "인터록", "interlock"],
  "인터록": ["잠금장치", "interlock"],
  // 보호난간
  "보호난간": ["안전난간", "가드레일"],
  // 장애인용
  "장애인용": ["배리어프리", "barrier free", "휠체어"],
  // 소방구조용
  "소방구조용": ["소방엘리베이터", "소방용"],
  // 자동구출운전
  "자동구출운전": ["arg", "자동구출", "ard"],
  // 오버밸런스
  "오버밸런스": ["균형량", "ob율", "ob"],
  // 파이널리미트스위치
  "파이널리미트스위치": ["최종제한스위치", "final limit"],
};

// 키워드 확장 (유사어 포함한 검색어 목록 반환)
function expandKeywords(kw: string): string[] {
  const base = kw.toLowerCase().replace(/\s+/g, '');
  const expanded = new Set<string>([base, kw.toLowerCase()]);

  // 유사어 사전에서 직접 매핑
  for (const [key, synonyms] of Object.entries(SYNONYMS)) {
    const keyNorm = key.toLowerCase().replace(/\s+/g, '');
    if (base.includes(keyNorm) || keyNorm.includes(base)) {
      expanded.add(keyNorm);
      synonyms.forEach(s => {
        expanded.add(s.toLowerCase().replace(/\s+/g, ''));
        expanded.add(s.toLowerCase());
      });
    }
    // 유사어가 입력어와 일치하는 경우 역방향
    synonyms.forEach(s => {
      const sNorm = s.toLowerCase().replace(/\s+/g, '');
      if (base.includes(sNorm) || sNorm.includes(base)) {
        expanded.add(keyNorm);
        synonyms.forEach(s2 => {
          expanded.add(s2.toLowerCase().replace(/\s+/g, ''));
        });
      }
    });
  }
  return [...expanded].filter(k => k.length >= 2);
}

// n-gram 유사도 (2글자 단위)
function ngramSimilarity(a: string, b: string): number {
  const ngrams = (s: string) => {
    const set = new Set<string>();
    const norm = s.replace(/\s+/g, '');
    for (let i = 0; i < norm.length - 1; i++) set.add(norm.slice(i, i + 2));
    return set;
  };
  const sa = ngrams(a), sb = ngrams(b);
  if (sa.size === 0 || sb.size === 0) return 0;
  let inter = 0;
  sa.forEach(g => { if (sb.has(g)) inter++; });
  return (2 * inter) / (sa.size + sb.size);
}

// 정확도 점수 계산
function scoreMatch(text: string, keywords: string[], originalKw: string): number {
  const normText = text.toLowerCase().replace(/\s+/g, '');
  const normOrig = originalKw.toLowerCase().replace(/\s+/g, '');

  // 1순위: 원본 키워드 완전 포함
  if (normText.includes(normOrig)) return 100;

  // 2순위: 유사어 완전 포함
  for (const kw of keywords) {
    if (kw !== normOrig && normText.includes(kw)) return 85;
  }

  // 3순위: n-gram 유사도 (0.6 이상)
  const sim = ngramSimilarity(normOrig, normText.slice(0, 200));
  if (sim >= 0.6) return Math.round(sim * 70);

  return 0;
}


type Message = { role: "user" | "assistant"; content: string; time: string; searchResults?: SearchResult[]; };
type SearchResult = { type: "standard" | "inspection" | "judgment" | "chat"; title: string; content: string; query: string; score?: number; chatMeta?: { id: number; userName: string; createdAt: string; replyToUser?: string | null; replyToContent?: string | null; hasImage?: boolean; }; };

// ==================== 검색결과 아코디언 ====================
type CatGroup = { key: string; label: string; color: string; bg: string; dot: string; items: SearchResult[] };

function SearchCatAccordion({ cat, onSelect }: { cat: CatGroup; onSelect: (r: SearchResult) => void }) {
  const [open, setOpen] = React.useState(false);
  const scoreLabel = (s?: number) => s === 100 ? "정확" : s !== undefined && s >= 85 ? "유사어" : s !== undefined ? "유추" : null;
  const scoreBg   = (s?: number) => s === 100 ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
    : s !== undefined && s >= 85 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
    : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left bg-card hover:bg-muted/40 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.dot }} />
        <span className="text-xs font-medium text-foreground flex-1">{cat.label}</span>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md" style={{ background: cat.bg, color: cat.color }}>{cat.items.length}건</span>
        <svg className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="border-t border-border divide-y divide-border">
          {cat.items.map((r, i) => (
            <button key={i} className="w-full text-left px-3 py-2 hover:bg-muted/30 transition-colors" onClick={() => onSelect(r)}>
              <div className="flex items-center gap-1.5 mb-0.5">
                {scoreLabel(r.score) && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${scoreBg(r.score)}`}>{scoreLabel(r.score)}</span>
                )}
                {r.type === "chat" && r.chatMeta?.hasImage && <span className="text-[11px] text-purple-500">📷</span>}
              </div>
              <div className="text-xs font-medium text-foreground leading-snug">{r.title}</div>
              {r.type === "chat" && r.chatMeta && (
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  <span className="text-purple-500 font-medium">{r.chatMeta.userName}</span>
                  {r.chatMeta.replyToUser && <span> → {r.chatMeta.replyToUser}에 답변</span>}
                </div>
              )}
              {r.content && r.type !== "chat" && (
                <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1 leading-snug">{r.content}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 키워드로 표준화+검사기준 검색
function searchAllData(keyword: string, standards: any[]): SearchResult[] {
  const kw = keyword.toLowerCase().trim();
  if (!kw || kw.length < 2) return [];

  // 키워드 확장 (유사어·약어 포함)
  const kwList = expandKeywords(kw);

  const scored: { result: SearchResult; score: number }[] = [];

  const addResult = (r: SearchResult, searchText: string) => {
    const score = scoreMatch(searchText, kwList, kw);
    if (score > 0) scored.push({ result: r, score });
  };

  // 표준화 검색 (DB standards)
  standards.forEach(s => {
    const searchText = `${s.title || ""} ${s.body || ""}`;
    addResult({
      type: "standard",
      title: s.title,
      content: s.body ? s.body.slice(0, 100) + (s.body.length > 100 ? "..." : "") : "",
      query: s.title
    }, searchText);
  });

  // 표준화 파싱 데이터 검색
  STD_ITEMS.forEach(s => {
    const searchText = `${s.title} ${s.ref} ${s.basis} ${s.conclusion}`;
    addResult({
      type: "standard",
      title: s.title,
      content: s.conclusion ? s.conclusion.slice(0, 100) + (s.conclusion.length > 100 ? "..." : "") : s.basis.slice(0, 100),
      query: s.title
    }, searchText);
  });

  // 검사기준 검색 (inspection-content.json)
  const contentEntries = Object.entries(INSPECTION_CONTENT as unknown as Record<string, {text?: string; effectiveDate?: string; revisions?: any[]}>);
  contentEntries.forEach(([id, val]) => {
    const text = val.text || "";
    if (text.length < 10) return;
    if (text.includes("연혁집") || text.includes("부속서\n")) return;
    addResult({
      type: "inspection",
      title: `[${id}] ${text.slice(0, 60).replace(/\n/g, " ")}`,
      content: text.replace(/\n/g, " "),
      query: id,
    }, text);
  });

  // 검사가이드 안전검사기준 검색
  const searchJudgment = (sections: any[]) => {
    sections.forEach(sec => {
      if (sec.items) {
        sec.items.forEach((item: any) => {
          const itemText = `${item.id || ""} ${item.text || ""} ${item.standard || ""}`;
          addResult({
            type: "judgment",
            title: item.text ? item.text.slice(0, 50).replace(/\n/g, " ") : item.id,
            content: item.text || "",
            query: item.id || "",
          }, itemText);
        });
      }
      if (sec.subsections) searchJudgment(sec.subsections);
    });
  };
  searchJudgment(INSPECTION_DATA_MR);

  // INSPECTION_DATA_MR 섹션 제목 검색
  const searchSection = (sections: any[]) => {
    sections.forEach(sec => {
      addResult({
        type: "inspection",
        title: sec.title || "",
        content: `검사기준 섹션: ${sec.title}`,
        query: sec.id || sec.title,
      }, sec.title || "");
      if (sec.subsections) searchSection(sec.subsections);
    });
  };
  searchSection(INSPECTION_DATA_MR);

  // 점수 내림차순 정렬 + 타입별 중복 제거
  scored.sort((a, b) => b.score - a.score);

  const seenStd = new Set<string>();
  const seenJud = new Set<string>();
  const dedupedStd: SearchResult[] = [];
  const dedupedJud: SearchResult[] = [];
  const dedupedIns: SearchResult[] = [];

  for (const { result } of scored) {
    if (result.type === "standard") {
      const key = result.title.slice(0, 30);
      if (!seenStd.has(key)) { seenStd.add(key); dedupedStd.push(result); }
    } else if (result.type === "judgment") {
      if (!seenJud.has(result.query)) { seenJud.add(result.query); dedupedJud.push(result); }
    } else {
      dedupedIns.push(result);
    }
  }

  // 채팅 메시지 검색 (비동기지만 캐시된 결과 사용)
  // → chatSearchCache는 Home 컴포넌트에서 주입

  // 점수순 전체 병합 (타입별이 아닌 점수 순서 유지)
  const allDeduped: SearchResult[] = [];
  const seenAll = new Set<string>();
  for (const { result, score } of scored) {
    const key = `${result.type}:${result.title.slice(0, 30)}`;
    if (!seenAll.has(key)) {
      seenAll.add(key);
      allDeduped.push({ ...result, score });
    }
  }

  return allDeduped;
}

function getRuleBasedAnswer(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("정밀안전검사") || q.includes("정밀 안전")) {
    return "";
  }

  if (q.includes("과속조절기") || q.includes("조속기")) {
    return "";
  }

  if (q.includes("피트") || q.includes("pit")) {
    return "";
  }

  if (q.includes("승강장문") || q.includes("문잠금") || q.includes("잠금장치")) {
    return "";
  }

  if (q.includes("추락방지") || q.includes("안전장치") || q.includes("비상정지")) {
    return "";
  }

  if (q.includes("오늘") || q.includes("체크리스트") || q.includes("점검")) {
    const today = new Date();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dateStr = `${today.getMonth()+1}월 ${today.getDate()}일 (${days[today.getDay()]})`;
    return "";
  }

  if (q.includes("안전대") || q.includes("안전모") || q.includes("보호구") || q.includes("ppe")) {
    return "";
  }

  if (q.includes("cpr") || q.includes("심폐소생") || q.includes("응급")) {
    return "";
  }

  if (q.includes("기계실") || q.includes("권상기") || q.includes("브레이크")) {
    return "";
  }

  if (q.includes("ucmp") || q.includes("개문출발") || q.includes("문출발")) {
    return "";
  }

  if (q.includes("통계") || q.includes("사고 현황") || q.includes("최신 사고")) {
    return "";
  }

  if (q.includes("연령") || q.includes("나이") || q.includes("고령")) {
    return "";
  }

  if (q.includes("개정") || q.includes("최근 기준") || q.includes("변경")) {
    return "";
  }

  // 기본 답변
  return "";
}

function formatTime(): string {
  const now = new Date();
  return "";
}

// ==================== DatePicker ====================
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
    onChange(`${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`);
    setShow(false);
  };
  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:border-primary bg-card" onClick={() => setShow(!show)}>
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className={`text-sm ${value ? "text-foreground" : "text-muted-foreground"}`}>{value || "날짜 선택"}</span>
        {value && <button className="ml-auto text-muted-foreground" onClick={e => { e.stopPropagation(); onChange(""); }}><X className="h-3 w-3" /></button>}
      </div>
      {show && (
        <div className="absolute z-50 mt-1 bg-card border rounded-xl shadow-xl p-4 w-72">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => { if (viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); }} className="p-1 hover:bg-muted rounded">◀</button>
            <span className="font-semibold text-sm">{viewYear}년 {months[viewMonth]}</span>
            <button onClick={() => { if (viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); }} className="p-1 hover:bg-muted rounded">▶</button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-1">{["일","월","화","수","목","금","토"].map(d=><div key={d}>{d}</div>)}</div>
          <div className="grid grid-cols-7 text-center text-sm">
            {blanks.map(i=><div key={`b${i}`}/>)}
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

const emptyForm = { categoryId: "", title: "", standardNumber: "", body: "", basis: "", conclusion: "", source: "", permitDate: "", inspectionDate: "", inspectionYear: "", images: [] as string[] };

// ==================== 표준화 항목 이미지 섹션 ====================
function StdPhotoSection({ itemKey }: { itemKey: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<{ id: number; mimeType: string; createdAt: string }[]>([]);
  const [viewer, setViewer] = useState<{ open: boolean; idx: number }>({ open: false, idx: 0 });
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [uploading, setUploading] = useState(false);

  const encodedKey = encodeURIComponent(itemKey);

  const loadPhotos = useCallback(async () => {
    try {
      const r = await fetch(`/api/std-photos/${encodedKey}`);
      if (r.ok) setPhotos(await r.json());
    } catch {}
  }, [encodedKey]);

  useEffect(() => { loadPhotos(); }, [loadPhotos]);

  const compressImage = (file: File): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > 1200) { height = Math.round(height * 1200 / width); width = 1200; }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        canvas.toBlob(b => b ? resolve(b) : reject(), 'image/jpeg', 0.82);
      };
      img.onerror = reject;
      img.src = url;
    });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileRef.current) fileRef.current.value = "";
    if (photos.length >= 10) return;
    setUploading(true);
    try {
      const blob = await compressImage(file).catch(() => file as unknown as Blob);
      const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
      const fd = new FormData();
      fd.append('image', compressed);
      const r = await fetch(`/api/std-photos/${encodedKey}`, { method: 'POST', body: fd });
      if (r.ok) await loadPhotos();
    } catch {}
    setUploading(false);
  };

  const handleDelete = async () => {
    if (pw !== "910919") { setPwErr(true); return; }
    if (deleteTarget === null) return;
    try {
      await fetch(`/api/std-photos/${deleteTarget}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      setDeleteTarget(null);
      setPw(""); setPwErr(false);
      await loadPhotos();
      setViewer({ open: false, idx: 0 });
    } catch {}
  };

  const imgUrl = (id: number) => `/api/std-photos/${encodedKey}/${id}/image`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-muted-foreground tracking-wide">첨부 이미지</p>
        <p className="text-xs text-muted-foreground">{photos.length} / 10</p>
      </div>

      {photos.length === 0 && !uploading ? (
        <label className="flex items-center justify-center gap-2 w-full py-2.5 border border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span className="text-[11px] text-muted-foreground">사진 추가 (최대 10장)</span>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {photos.map((p, i) => (
            <div key={p.id} className="w-16 h-16 rounded-xl overflow-hidden border border-border cursor-pointer shrink-0"
              onClick={() => setViewer({ open: true, idx: i })}>
              <img src={imgUrl(p.id)} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
          {photos.length < 10 && (
            <label className="w-16 h-16 rounded-xl border border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-secondary transition-colors shrink-0">
              {uploading
                ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span className="text-[11px] text-muted-foreground">추가</span></>
              }
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
            </label>
          )}
        </div>
      )}

      {/* 이미지 뷰어 */}
      {viewer.open && photos.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col" onClick={() => setViewer({ open: false, idx: 0 })}>
          <div className="flex items-center justify-between px-4 py-3 shrink-0" onClick={e => e.stopPropagation()}>
            <span className="text-white text-xs">{viewer.idx + 1} / {photos.length}</span>
            <div className="flex items-center gap-3">
              <button className="text-red-400 text-xs px-2.5 py-1 border border-red-400/40 rounded-lg"
                onClick={() => { setDeleteTarget(photos[viewer.idx].id); setPw(""); setPwErr(false); }}>삭제</button>
              <button onClick={() => setViewer({ open: false, idx: 0 })} className="text-white/70 text-lg">✕</button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center px-4" onClick={e => e.stopPropagation()}>
            <img src={imgUrl(photos[viewer.idx].id)} alt="" className="max-w-full max-h-full object-contain rounded-xl" />
          </div>
          <div className="flex gap-2 px-4 py-3 overflow-x-auto shrink-0" onClick={e => e.stopPropagation()}>
            {photos.map((p, i) => (
              <div key={p.id}
                className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 cursor-pointer border-2 ${i === viewer.idx ? 'border-white' : 'border-transparent'}`}
                onClick={() => setViewer(v => ({ ...v, idx: i }))}>
                <img src={imgUrl(p.id)} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 삭제 비밀번호 모달 */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-6" onClick={() => { setDeleteTarget(null); setPw(""); setPwErr(false); }}>
          <div className="bg-card border border-border rounded-2xl p-5 w-full max-w-xs space-y-3" onClick={e => e.stopPropagation()}>
            <p className="text-sm font-medium">사진 삭제</p>
            <p className="text-xs text-muted-foreground">삭제하려면 비밀번호를 입력하세요.</p>
            <input
              type="password" placeholder="비밀번호" value={pw} autoFocus
              onChange={e => { setPw(e.target.value); setPwErr(false); }}
              onKeyDown={e => e.key === 'Enter' && handleDelete()}
              className={`w-full text-sm bg-secondary border rounded-xl px-3 py-2.5 outline-none ${pwErr ? 'border-red-400' : 'border-border'}`}
            />
            {pwErr && <p className="text-[11px] text-red-500">비밀번호가 올바르지 않습니다.</p>}
            <div className="flex gap-2 pt-1">
              <button onClick={() => { setDeleteTarget(null); setPw(""); setPwErr(false); }}
                className="flex-1 py-2 rounded-xl border border-border text-sm text-muted-foreground">취소</button>
              <button onClick={handleDelete}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-medium">삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 메인 ====================
export default function Home({ defaultTab = "chat" }: { defaultTab?: "chat" | "map" }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: standards = [] } = useStandards();
  const { data: hotspots = [] } = useHotspots();

  // hotspots 위치 캐싱 (앱 시작 시 즉시 로드)
  useEffect(() => {
    if (hotspots.length > 0) {
      localStorage.setItem("hotspots_cache", JSON.stringify(hotspots));
      localStorage.setItem("hotspots_cache_ts", String(Date.now()));
    }
  }, [hotspots]);
  const { data: stdOverrides } = useQuery<any[]>({
    queryKey: ["/api/std-overrides"],
    queryFn: () => fetch("/api/std-overrides").then(r => r.json()),
    staleTime: 0,
  });
  const createStandard = useCreateStandard();
  const updateStandard = useUpdateStandard();
  const deleteStandard = useDeleteStandard();
  const createCategory = useCreateCategory();
  const createHotspot = useCreateHotspot();
  const updateHotspot = useUpdateHotspot();
  const deleteHotspot = useDeleteHotspot();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomContentRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // 탭
  const [activeTab, setActiveTab] = useState<"chat" | "map">(defaultTab as "chat" | "map");
  const [selectedSearchResult, setSelectedSearchResult] = useState<SearchResult | null>(null);

  // 채팅
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `안녕하세요! 승강기 안전검사 AI 어시스턴트입니다.\n\n검사기준, 판정 방법, 표준화 내용 등 궁금한 것을 자유롭게 물어보세요.\n\n예시) "비상통화장치가 작동 안 할 때 판정은?", "균형추 칸막이 설치 기준", "스커트디플렉터 소급적용"`,
      time: formatTime()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [accidentStats, setAccidentStats] = useState<{yearly: any[], age: any[]}>({ yearly: [], age: [] });
  const [statsLoaded, setStatsLoaded] = useState(false);

  // 구조도/표준화
  const [activeButtonId, setActiveButtonId] = useState<number | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);
  // 표준화 탭 상태
  const [stdCategory, setStdCategory] = useState("전체");
  const [stdSelected, setStdSelected] = useState<StdItem | null>(null);
  const [stdSearch, setStdSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStandard, setEditingStandard] = useState<Standard | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Standard | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [structureImg, setStructureImg] = useState<string>(defaultStructureImg);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // 카드 오프셋 (핫스팟 id → 카드 중심의 캔버스 % 위치)
  const [cardOffsets, setCardOffsets] = useState<Record<number, {cx: number, cy: number}>>({});
  const cardOffsetsRef = useRef<Record<number, {cx: number, cy: number}>>({});
  const [cardOffsetsLoaded, setCardOffsetsLoaded] = useState(false);
  const pinDragPosRef = useRef<{id: number, x: number, y: number} | null>(null);
  const [draggingCardId, setDraggingCardId] = useState<number | null>(null);
  const [cardDragOffset, setCardDragOffset] = useState({ x: 0, y: 0 });
  const [showAddHotspot, setShowAddHotspot] = useState(false);
  const [newHotspotLabel, setNewHotspotLabel] = useState("");
  const [deleteHotspotConfirm, setDeleteHotspotConfirm] = useState<Hotspot | null>(null);

  useEffect(() => { cardOffsetsRef.current = cardOffsets; }, [cardOffsets]);

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

  // 공공데이터 통계 로드 - 서버 요약 API 사용
  useEffect(() => {
    fetch("/api/stats-summary")
      .then(r => r.json())
      .then(data => {
        setStatsLoaded(true);
        // accidentStats도 업데이트 (질문 답변용)
        if (data.year) {
          setAccidentStats({
            yearly: [{ wrttimeid: data.year, safe_acci_smry: data.total, safe_acci_only_passenger: data.passenger, safe_acci_only_freight: data.freight, safe_acci_escalator: data.escalator, expcas_death: data.deaths, expcas_serious_injury: data.serious }],
            age: []
          });
        }
      })
      .catch(() => { setStatsLoaded(true); });
  }, []);


  // 서버에서 설정 로드
  useEffect(() => {
    fetch("/api/settings/cardOffsets")
      .then(r => r.json())
      .then(d => {
        if (d.value) {
          const parsed = JSON.parse(d.value);
          cardOffsetsRef.current = parsed;
          setCardOffsets(parsed);
        }
        setCardOffsetsLoaded(true);
      })
      .catch(() => { setCardOffsetsLoaded(true); });
    fetch("/api/settings/structureImg")
      .then(r => r.json())
      .then(d => { if (d.value) setStructureImg(d.value); })
      .catch(() => {});
  }, []);

  // 채팅 스크롤 - 첫 렌더링 제외
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 메시지 전송
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text, time: formatTime() };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // 사고 통계 질문 처리 (기존 로직 유지)
    const q = text.toLowerCase();
    if ((q.includes("사고") || q.includes("통계") || q.includes("연도별")) && accidentStats.yearly.length > 0) {
      const latest = accidentStats.yearly[accidentStats.yearly.length - 1];
      const prev = accidentStats.yearly[accidentStats.yearly.length - 2];
      if (latest) {
        const answer = `공공데이터 기준 최신 승강기 안전사고 통계\n\n${latest.wrttimeid || latest.year || latest.stdr_year}년 현황\n• 승객용 엘리베이터: ${latest.pasngr_elvtr_acc_cnt || "-"}건\n• 화물용 엘리베이터: ${latest.freight_elvtr_acc_cnt || "-"}건\n• 에스컬레이터: ${latest.escalator_acc_cnt || "-"}건\n• 합계: ${latest.tot_acc_cnt || "-"}건${prev ? `\n\n전년(${prev.wrttimeid || prev.year || prev.stdr_year}년) 대비 추이를 확인하시려면 검사가이드 페이지를 참고하세요.` : ""}\n\n출처: 행정안전부 통계연보`;
        setMessages(prev => [...prev, { role: "assistant", content: answer, time: formatTime() }]);
        setIsTyping(false);
        return;
      }
    }
    if ((q.includes("연령") || q.includes("나이") || q.includes("고령")) && accidentStats.age.length > 0) {
      const latest = accidentStats.age[accidentStats.age.length - 1];
      const tot = parseInt(latest.tot);
      const child = parseInt(latest.old14_lss);
      const adult = parseInt(latest.old15_mor_old64_lss);
      const elder = parseInt(latest.old65_mor);
      const answer = `행정안전부 연령별 사고 통계 (${latest.wrttimeid}년)\n\n• 14세 이하: ${child}명 (${Math.round(child/tot*100)}%)\n• 15~64세: ${adult}명 (${Math.round(adult/tot*100)}%)\n• 65세 이상: ${elder}명 (${Math.round(elder/tot*100)}%)\n• 합계: ${tot}명\n\n출처: 행정안전부 통계연보`;
      setMessages(prev => [...prev, { role: "assistant", content: answer, time: formatTime() }]);
      setIsTyping(false);
      return;
    }

    // 관련 표준화 자료 검색 — 키워드를 분해해서 더 넓게 검색
    const keywords = text.replace(/[?？]/g, "").split(/\s+/).filter(k => k.length >= 2);
    let results = searchAllData(text, standards);
    // 단일 키워드 검색으로 결과가 없으면 분해된 키워드로 재검색
    if (results.length === 0 && keywords.length > 1) {
      for (const kw of keywords) {
        const r = searchAllData(kw, standards);
        results.push(...r);
      }
      // 중복 제거
      const seen = new Set<string>();
      results = results.filter(r => {
        if (seen.has(r.title)) return false;
        seen.add(r.title);
        return true;
      });
    }

    // 채팅 메시지 검색 병합
    try {
      const chatRes = await fetch(`/api/chat-messages?search=${encodeURIComponent(text)}&limit=20`);
      if (chatRes.ok) {
        const chatMsgs = await chatRes.json();
        const chatResults: SearchResult[] = chatMsgs.map((m: any) => ({
          type: "chat" as const,
          title: m.content.slice(0, 50).replace(/\n/g, " "),
          content: m.content.slice(0, 100),
          query: String(m.id),
          score: 100,
          chatMeta: {
            id: m.id,
            userName: m.userName,
            createdAt: m.createdAt,
            replyToUser: m.replyToUser,
            replyToContent: m.replyToContent,
            hasImage: false,
          },
        }));
        results = [...results, ...chatResults];
      }
    } catch {}

    const searchResults = results.length > 0 ? results : undefined;

    // AI API 호출
    try {
      // 대화 히스토리 구성 (최근 10개)
      const historyMsgs = messages
        .slice(-10)
        .filter(m => m.role === "user" || m.role === "assistant")
        .map(m => ({ role: m.role as "user" | "assistant", content: m.content }));
      historyMsgs.push({ role: "user", content: text });

      // 관련 자료 컨텍스트 — 깨끗한 데이터만 전달
      const context = results.slice(0, 6).map(r => {
        const std = STD_ITEMS.find(s => s.title === r.title);
        if (std) {
          // 결론이 너무 짧거나 깨진 경우 제외
          const cleanConc = std.conclusion.length > 10 ? std.conclusion.slice(0, 300) : "";
          const cleanBasis = std.basis.slice(0, 200);
          return { title: std.title, ref: std.ref, basis: cleanBasis, conclusion: cleanConc, source: std.source };
        }
        // 검사기준 항목
        return { title: r.title, ref: r.query, basis: r.content.slice(0, 200), conclusion: "", source: "검사기준" };
      }).filter(c => c.title && (c.basis || c.conclusion));

      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyMsgs, context }),
      });

      if (!resp.ok) throw new Error("서버 오류");
      const data = await resp.json();

      // AI 답변 결과 — 표준화+검사기준 둘 다 포함, 최대 10개
      let finalResults = results;
      if (finalResults.length === 0 && data.reply) {
        const replyKeywords = data.reply.match(/[\uAC00-\uD7A3]{2,6}/g) || [];
        const uniqueKws = [...new Set(replyKeywords)].slice(0, 5);
        for (const kw of uniqueKws) {
          const r = searchAllData(kw, standards);
          finalResults.push(...r);
        }
        const seen = new Set<string>();
        finalResults = finalResults.filter(r => {
          if (seen.has(r.title)) return false;
          seen.add(r.title);
          return true;
        }).slice(0, 10);
      }

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply,
        time: formatTime(),
        searchResults: finalResults.length > 0 ? finalResults : undefined,
      }]);
    } catch (err: any) {
      console.error("Chat fetch error:", err);
      // AI 실패 시 기존 키워드 검색 결과로 폴백
      const fallback = searchResults
        ? `"${text}"에 대한 검색 결과 ${results.length}건입니다. 아래 항목을 눌러 확인하세요.`
        : `"${text}"에 대한 검색 결과가 없습니다. 다른 키워드로 검색해보세요.`;
      setMessages(prev => [...prev, {
        role: "assistant",
        content: fallback,
        time: formatTime(),
        searchResults,
      }]);
    }
    setIsTyping(false);
  }, [accidentStats, standards, messages]);

  // 리더라인 설정 (카드 오프셋 저장값 우선, 없으면 자동 계산)
  const getCardOffset = useCallback((hotspot: Hotspot, canvasW: number, canvasH: number) => {
    const x = (parseFloat(hotspot.left) / 100) * canvasW;
    const y = (parseFloat(hotspot.top) / 100) * canvasH;
    const cardW = 144;
    const cardH = 52;

    let cardCX: number, cardCY: number;

    const offsetKey = String(hotspot.id);
    if ((cardOffsets as any)[offsetKey]) {
      cardCX = ((cardOffsets as any)[offsetKey].cx / 100) * canvasW;
      cardCY = ((cardOffsets as any)[offsetKey].cy / 100) * canvasH;
    } else {
      // 자동 계산
      const lineLen = 55;
      const goLeft = x > canvasW * 0.55;
      const goUp = y > canvasH * 0.6;
      const dx = goLeft ? -lineLen : lineLen;
      const dy = goUp ? -lineLen * 0.6 : lineLen * 0.6;
      cardCX = x + dx + (goLeft ? -cardW / 2 : cardW / 2);
      cardCY = y + dy;
    }

    const cardX = cardCX - cardW / 2;
    const cardY = cardCY - cardH / 2;
    return { cardX, cardY, cardW, cardH, cardCX, cardCY };
  }, [cardOffsets]);

  // Canvas 그리기 (리더라인 + 카드형 태그)
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
        const { cardX, cardY, cardW, cardH, cardCX, cardCY } = getCardOffset(hotspot, canvas.width, canvas.height);

        // 활성화 시 부품 하이라이트 (은은한 원형 글로우)
        if (isActive) {
          ctx.save();
          const grd = ctx.createRadialGradient(x, y, 0, x, y, 35);
          grd.addColorStop(0, "rgba(37,99,235,0.18)");
          grd.addColorStop(1, "rgba(37,99,235,0)");
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(x, y, 35, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 앵커 점 - 드래그 중이면 현재 위치로 덮어쓰기
        const dragPos = pinDragPosRef.current;
        const isDraggingThis = dragPos && dragPos.id === hotspot.id;
        const drawX = isDraggingThis ? dragPos.x : x;
        const drawY = isDraggingThis ? dragPos.y : y;
        ctx.save();
        ctx.beginPath();
        ctx.arc(drawX, drawY, isAdminMode ? 10 : 8, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? "#2563eb" : isAdminMode ? "#ea580c" : "#475569";
        ctx.shadowColor = isActive ? "rgba(37,99,235,0.5)" : "rgba(0,0,0,0.3)";
        ctx.shadowBlur = isActive ? 8 : 4;
        ctx.fill();
        ctx.restore();

        // 리더라인 (앵커 → 카드 중심)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(drawX, drawY);
        ctx.lineTo(cardCX, drawY);
        ctx.lineTo(cardCX, cardCY);
        ctx.strokeStyle = isActive ? "rgba(37,99,235,0.7)" : isAdminMode ? "rgba(234,88,12,0.6)" : "rgba(71,85,105,0.45)";
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.setLineDash(isActive ? [] : [4, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // 카드 배경
        const r = 6;
        ctx.save();
        ctx.shadowColor = isActive ? "rgba(37,99,235,0.25)" : "rgba(0,0,0,0.12)";
        ctx.shadowBlur = isActive ? 10 : 5;
        ctx.shadowOffsetY = 2;
        ctx.beginPath();
        ctx.moveTo(cardX + r, cardY);
        ctx.lineTo(cardX + cardW - r, cardY);
        ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r);
        ctx.lineTo(cardX + cardW, cardY + cardH - r);
        ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH);
        ctx.lineTo(cardX + r, cardY + cardH);
        ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r);
        ctx.lineTo(cardX, cardY + r);
        ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY);
        ctx.closePath();
        ctx.fillStyle = isActive ? "#2563eb" : isAdminMode ? "#ea580c" : "rgba(255,255,255,0.92)";
        ctx.fill();

        // 카드 테두리
        ctx.strokeStyle = isActive ? "#1d4ed8" : isAdminMode ? "#c2410c" : "rgba(203,213,225,0.8)";
        ctx.lineWidth = isActive ? 0 : 0.8;
        ctx.stroke();
        ctx.restore();

        // 카드 텍스트
        ctx.save();
        ctx.fillStyle = isActive ? "#ffffff" : isAdminMode ? "#ffffff" : "#1e293b";
        ctx.font = `${isActive ? "600" : "500"} 10px -apple-system, 'Pretendard', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(hotspot.label, cardX + cardW / 2, cardY + cardH / 2);
        ctx.restore();
      });
    };
  }, [hotspots, activeButtonId, structureImg, isAdminMode, cardOffsets, cardOffsetsLoaded]);

  useEffect(() => { if (activeTab === "map" && cardOffsetsLoaded) drawCanvas(); }, [drawCanvas, activeTab, cardOffsetsLoaded]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setStructureImg(result);
      fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "structureImg", value: result })
      }).catch(() => {});
      toast({ title: "구조도 이미지가 변경되었습니다." });
    };
    reader.readAsDataURL(file);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, px: 0, py: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    return { x: (px / canvas.width) * 100, y: (py / canvas.height) * 100, px, py };
  };

  // 터치 이벤트 → 마우스 이벤트 변환 헬퍼
  const getTouchCanvasCoords = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, px: 0, py: 0 };
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = (touch.clientX - rect.left) * scaleX;
    const py = (touch.clientY - rect.top) * scaleY;
    return { x: (px / canvas.width) * 100, y: (py / canvas.height) * 100, px, py };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isAdminMode) return;
    e.preventDefault();
    const { px, py } = getTouchCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 카드 드래그 감지
    for (const hotspot of hotspots) {
      const { cardX, cardY, cardW, cardH, cardCX, cardCY } = getCardOffset(hotspot, canvas.width, canvas.height);
      if (px >= cardX && px <= cardX + cardW && py >= cardY && py <= cardY + cardH) {
        setDraggingCardId(hotspot.id);
        setCardDragOffset({ x: px - cardCX, y: py - cardCY });
        return;
      }
    }

    // 핀(앵커) 드래그 감지
    hotspots.forEach(hotspot => {
      const btnX = (parseFloat(hotspot.left) / 100) * canvas.width;
      const btnY = (parseFloat(hotspot.top) / 100) * canvas.height;
      if (Math.hypot(px - btnX, py - btnY) < 50) {
        setDraggingId(hotspot.id);
        setDragOffset({ x: px - btnX, y: py - btnY });
      }
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isAdminMode) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const px = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const py = (touch.clientY - rect.top) * (canvas.height / rect.height);

    // 카드 드래그 - 실시간 업데이트
    if (draggingCardId !== null) {
      const newCX = px - cardDragOffset.x;
      const newCY = py - cardDragOffset.y;
      const touchHotspot = hotspots.find(h => h.id === draggingCardId);
      const touchKey = String(draggingCardId);
      const newOffsets = {
        ...cardOffsets,
        [touchKey]: {
          cx: (newCX / canvas.width) * 100,
          cy: (newCY / canvas.height) * 100,
        }
      };
      setCardOffsets(newOffsets);
      // 실시간 캔버스 재드로우
      setTimeout(() => drawCanvas(), 0);
      return;
    }

    // 핀 드래그 - 실시간 캔버스 업데이트
    if (draggingId !== null) {
      const x = Math.max(20, Math.min(canvas.width - 20, px - dragOffset.x));
      const y = Math.max(20, Math.min(canvas.height - 20, py - dragOffset.y));
      drawCanvas();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(234,88,12,0.9)";
      ctx.fill();
      ctx.strokeStyle = "#fed7aa";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isAdminMode) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const px = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const py = (touch.clientY - rect.top) * (canvas.height / rect.height);

    // 카드 위치 저장
    if (draggingCardId !== null) {
      fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "cardOffsets", value: JSON.stringify(cardOffsetsRef.current) })
      }).catch(() => {});
      setDraggingCardId(null);
      return;
    }

    // 핀 위치 저장
    if (draggingId !== null) {
      const x = Math.max(20, Math.min(canvas.width - 20, px - dragOffset.x));
      const y = Math.max(20, Math.min(canvas.height - 20, py - dragOffset.y));
      const newLeft = (x / canvas.width) * 100;
      const newTop = (y / canvas.height) * 100;
      const hotspot = hotspots.find(h => h.id === draggingId);
      if (hotspot) {
        updateHotspot.mutate({ id: draggingId, hotspot: { left: String(newLeft.toFixed(2)), top: String(newTop.toFixed(2)) } });
      }
      setDraggingId(null);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingId !== null) return;
    const { px, py } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    hotspots.forEach(hotspot => {
      const x = (parseFloat(hotspot.left) / 100) * canvas.width;
      const y = (parseFloat(hotspot.top) / 100) * canvas.height;
      const { cardX, cardY, cardW, cardH } = getCardOffset(hotspot, canvas.width, canvas.height);
      // 앵커점 또는 카드 영역 클릭 감지
      const hitAnchor = Math.hypot(px - x, py - y) < 40;
      const hitCard = px >= cardX && px <= cardX + cardW && py >= cardY && py <= cardY + cardH;
      if ((hitAnchor || hitCard) && !isAdminMode) setActiveButtonId(hotspot.id);
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isAdminMode) return;
    const { px, py } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 카드 드래그 감지 (앵커보다 먼저 체크)
    for (const hotspot of hotspots) {
      const { cardX, cardY, cardW, cardH, cardCX, cardCY } = getCardOffset(hotspot, canvas.width, canvas.height);
      if (px >= cardX && px <= cardX + cardW && py >= cardY && py <= cardY + cardH) {
        setDraggingCardId(hotspot.id);
        setCardDragOffset({ x: px - cardCX, y: py - cardCY });
        return;
      }
    }

    hotspots.forEach(hotspot => {
      const btnX = (parseFloat(hotspot.left) / 100) * canvas.width;
      const btnY = (parseFloat(hotspot.top) / 100) * canvas.height;
      if (Math.hypot(px - btnX, py - btnY) < 50) {
        setDraggingId(hotspot.id);
        setDragOffset({ x: px - btnX, y: py - btnY });
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isAdminMode) return;

    // 카드 드래그 이동
    if (draggingCardId !== null) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const px = (e.clientX - rect.left) * (canvas.width / rect.width);
      const py = (e.clientY - rect.top) * (canvas.height / rect.height);
      const newCX = px - cardDragOffset.x;
      const newCY = py - cardDragOffset.y;
      const draggingHotspot = hotspots.find(h => h.id === draggingCardId);
      const draggingKey = String(draggingCardId);
      const newOffsets = {
        ...cardOffsetsRef.current,
        [draggingKey]: {
          cx: (newCX / canvas.width) * 100,
          cy: (newCY / canvas.height) * 100,
        }
      };
      cardOffsetsRef.current = newOffsets;
      setCardOffsets(newOffsets);
      // 즉시 캔버스 재드로우 (ref 기반)
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.src = structureImg;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          hotspots.forEach(h => {
            const hx = (parseFloat(h.left)/100)*canvas.width;
            const hy = (parseFloat(h.top)/100)*canvas.height;
            const co = cardOffsetsRef.current[h.id];
            const cardCX = co ? (co.cx/100)*canvas.width : hx + 80;
            const cardCY = co ? (co.cy/100)*canvas.height : hy;
            const cardW = 144, cardH = 52;
            const cardX = cardCX - cardW/2, cardY = cardCY - cardH/2;
            ctx.fillStyle = h.id === draggingCardId ? "#ea580c" : "rgba(255,255,255,0.92)";
            ctx.strokeStyle = "#cbd5e1";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardW, cardH, 6);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = h.id === draggingCardId ? "#fff" : "#1e293b";
            ctx.font = "500 20px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(h.label, cardCX, cardCY);
            ctx.beginPath();
            ctx.arc(hx, hy, 8, 0, Math.PI*2);
            ctx.fillStyle = "#ea580c";
            ctx.fill();
          });
        };
      }
      return;
    }

    if (draggingId === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (canvas.width / rect.width) - dragOffset.x;
    const py = (e.clientY - rect.top) * (canvas.height / rect.height) - dragOffset.y;
    const clampedX = Math.max(20, Math.min(canvas.width - 20, px));
    const clampedY = Math.max(20, Math.min(canvas.height - 20, py));
    pinDragPosRef.current = { id: draggingId, x: clampedX, y: clampedY };
    drawCanvas();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const x = Math.max(20, Math.min(canvas.width-20, px));
    const y = Math.max(20, Math.min(canvas.height-20, py));
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
      ctx.textBaseline = "middle";
      ctx.fillText(hotspot.label, x, y);
    }
  };

  const handleMouseUp = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isAdminMode) return;

    // 카드 드래그 종료 - 서버 저장
    if (draggingCardId !== null) {
      fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "cardOffsets", value: JSON.stringify(cardOffsetsRef.current) })
      }).catch(() => {});
      setDraggingCardId(null);
      return;
    }

    if (draggingId === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (canvas.width / rect.width) - dragOffset.x;
    const py = (e.clientY - rect.top) * (canvas.height / rect.height) - dragOffset.y;
    const newLeft = Math.max(2, Math.min(98, (px / canvas.width) * 100));
    const newTop = Math.max(2, Math.min(98, (py / canvas.height) * 100));
    const hotspot = hotspots.find(h => h.id === draggingId);
    if (hotspot) {
      try {
        await updateHotspot.mutateAsync({ id: draggingId, hotspot: { left: String(newLeft.toFixed(2)), top: String(newTop.toFixed(2)) } });
        toast({ title: "핀 위치가 저장되었습니다." });
      } catch { toast({ title: "위치 저장 실패", variant: "destructive" }); }
    }
    pinDragPosRef.current = null;
    setDraggingId(null);
    drawCanvas();
  };

  const handleAddHotspot = async () => {
    if (!newHotspotLabel.trim()) { toast({ title: "버튼 이름을 입력해주세요.", variant: "destructive" }); return; }
    try {
      const newCategory = await createCategory.mutateAsync({ key: `hotspot_${Date.now()}`, title: newHotspotLabel, description: newHotspotLabel });
      await createHotspot.mutateAsync({ label: newHotspotLabel, top: "50%", left: "50%", categoryId: newCategory.id });
      toast({ title: `"${newHotspotLabel}" 버튼이 추가되었습니다.` });
      setNewHotspotLabel(""); setShowAddHotspot(false);
    } catch { toast({ title: "버튼 추가 실패", variant: "destructive" }); }
  };

  const handleDeleteHotspot = async () => {
    if (!deleteHotspotConfirm) return;
    try {
      await deleteHotspot.mutateAsync(deleteHotspotConfirm.id);
      toast({ title: "버튼이 삭제되었습니다." }); setDeleteHotspotConfirm(null);
    } catch { toast({ title: "삭제 실패", variant: "destructive" }); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (form.images.length + files.length > 10) { toast({ title: "최대 10장", variant: "destructive" }); return; }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(prev => ({ ...prev, images: [...prev.images, ev.target?.result as string] }));
      reader.readAsDataURL(file);
    });
  };

  const openAddModal = () => { setEditingStandard(null); setForm(emptyForm); setShowAddModal(true); };
  const openEditModal = (standard: Standard) => {
    setEditingStandard(standard);
    const ov = stdOverrides?.find((o: any) => o.title === standard.title);
    setForm({ categoryId: standard.categoryId ? String(standard.categoryId) : "", title: standard.title, standardNumber: standard.standardNumber || "", body: standard.body, basis: ov?.basis || (standard as any).basis || "", conclusion: ov?.conclusion || (standard as any).conclusion || "", source: ov?.source || (standard as any).source || "", permitDate: standard.permitDate || "", inspectionDate: standard.inspectionDate || "", inspectionYear: standard.inspectionYear || "", images: standard.imageUrls || [] });
    setSelectedStandard(null); setShowAddModal(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast({ title: "표준화명을 입력해주세요.", variant: "destructive" }); return; }
    if (!form.body.trim()) { toast({ title: "내용을 입력해주세요.", variant: "destructive" }); return; }
    const data = { categoryId: form.categoryId ? parseInt(form.categoryId) : null, title: form.title, standardNumber: form.standardNumber || null, body: form.body, permitDate: form.permitDate || null, inspectionDate: form.inspectionDate || null, inspectionYear: form.inspectionYear || null, imageUrls: form.images.length > 0 ? form.images : null, hotspotId: null, inspectionRound: null };
    try {
      if (editingStandard) {
        await updateStandard.mutateAsync({ id: editingStandard.id, standard: data });
        // basis/conclusion/source 오버라이드 저장
        if (form.basis || form.conclusion || form.source) {
          await fetch(`/api/std-overrides/${encodeURIComponent(editingStandard.title)}`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ basis: form.basis, conclusion: form.conclusion, source: form.source, ref: form.standardNumber }),
          });
          queryClient.invalidateQueries({ queryKey: ["/api/std-overrides"] });
        }
        toast({ title: "수정되었습니다." });
      }
      else { await createStandard.mutateAsync(data); toast({ title: "추가되었습니다." }); }
      setShowAddModal(false); setEditingStandard(null); setForm(emptyForm);
    } catch { toast({ title: "저장 실패", variant: "destructive" }); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteStandard.mutateAsync(deleteConfirm.id);
      toast({ title: "삭제되었습니다." }); setDeleteConfirm(null); setSelectedStandard(null);
    } catch { toast({ title: "삭제 실패", variant: "destructive" }); }
  };

  // ==================== 렌더링 ====================
  return (
    <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",flexDirection:"column",backgroundColor:"var(--background)"}}>

      {/* 헤더 */}
      <div className="sticky top-0 z-40 bg-card border-b border-border px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              {defaultTab === "chat" ? <Bot className="h-3 w-3 text-primary-foreground" /> : <ImageIcon className="h-3 w-3 text-primary-foreground" />}
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">{defaultTab === "chat" ? "AI 검색" : "기술자료"}</h1>
              
            </div>
          </div>

        </div>
      </div>



      {/* ==================== 채팅 탭 ==================== */}
      {defaultTab === "chat" && (
        <div className="flex-1 flex flex-col w-full">

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                )}
                <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1.5`}>
                  {msg.content && (
                  <div className={`rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm whitespace-pre-line"
                      : "bg-card border border-border rounded-tl-sm"
                  }`}>
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          h1: ({children}) => <p className="font-bold text-base mb-1">{children}</p>,
                          h2: ({children}) => <p className="font-bold text-sm mt-2 mb-1">{children}</p>,
                          h3: ({children}) => <p className="font-semibold text-sm mt-1.5 mb-0.5">{children}</p>,
                          strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                          ul: ({children}) => <ul className="list-disc pl-4 my-1 space-y-0.5">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal pl-4 my-1 space-y-0.5">{children}</ol>,
                          li: ({children}) => <li className="text-sm">{children}</li>,
                          p: ({children}) => <p className="mb-1 last:mb-0">{children}</p>,
                          table: ({children}) => <div className="overflow-x-auto my-1.5"><table className="text-xs border-collapse w-full">{children}</table></div>,
                          th: ({children}) => <th className="border border-border px-2 py-1 bg-muted font-semibold text-left">{children}</th>,
                          td: ({children}) => <td className="border border-border px-2 py-1">{children}</td>,
                          code: ({children}) => <code className="bg-muted px-1 rounded text-xs font-mono">{children}</code>,
                          hr: () => <hr className="border-border my-2" />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content.split('\n').map((line, i) => (
                        <span key={i}>{i > 0 && <br />}{line}</span>
                      ))
                    )}
                  </div>
                )}
                  <span className="text-xs text-muted-foreground px-1 mt-1">{msg.time}</span>
                  {msg.searchResults && msg.searchResults.length > 0 && (() => {
                    const cats: { key: string; label: string; color: string; bg: string; dot: string; items: SearchResult[] }[] = [
                      { key: "standard", label: "표준화", color: "#185FA5", bg: "#E6F1FB", dot: "#378ADD", items: [] },
                      { key: "judgment", label: "검사기준", color: "#0F6E56", bg: "#E1F5EE", dot: "#1D9E75", items: [] },
                      { key: "inspection", label: "검사가이드", color: "#854F0B", bg: "#FAEEDA", dot: "#BA7517", items: [] },
                      { key: "chat", label: "채팅", color: "#533AB7", bg: "#EEEDFE", dot: "#7F77DD", items: [] },
                    ];
                    msg.searchResults.forEach((r: SearchResult) => {
                      const cat = cats.find(c => c.key === r.type) ?? cats[2];
                      cat.items.push(r);
                    });
                    const filled = cats.filter(c => c.items.length > 0);
                    return (
                      <div className="mt-2 flex flex-col gap-2">
                        {filled.map(cat => (
                          <SearchCatAccordion key={cat.key} cat={cat} onSelect={(r: SearchResult) => {
                            if (r.type === "chat") {
                              window.dispatchEvent(new CustomEvent("navigatePage", { detail: { index: 7 } }));
                              setTimeout(() => window.dispatchEvent(new CustomEvent("scrollToChatMsg", { detail: { id: r.chatMeta?.id } })), 300);
                            } else {
                              setSelectedSearchResult(r);
                            }
                          }} />
                        ))}
                      </div>
                    );
                  })()}
                </div>
                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {/* 타이핑 인디케이터 */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay:"0ms"}}/>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay:"150ms"}}/>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay:"300ms"}}/>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력창 */}
          <div className="px-4 py-3 border-t border-border bg-card shrink-0">
            <div className="flex gap-2">
              <input
                ref={chatInputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(inputText)}
                placeholder="궁금한 것을 물어보세요..."
                className="flex-1 bg-secondary rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 모달들 ==================== */}

      
      {/* 삭제 확인 */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-semibold mb-2">삭제 확인</h2>
            <p className="text-sm text-muted-foreground mb-6">"{deleteConfirm.title}"을 삭제하시겠습니까?</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>취소</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete}>삭제</Button>
            </div>
          </div>
        </div>
      )}

      {/* 버튼 추가 */}
      {showAddHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowAddHotspot(false)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-semibold mb-4">버튼 추가</h2>
            <Input placeholder="예: 기계실" value={newHotspotLabel} onChange={e => setNewHotspotLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddHotspot()} className="mb-2" />
            <p className="text-xs text-muted-foreground mb-4">추가 후 드래그해서 위치 조정하세요.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddHotspot(false)}>취소</Button>
              <Button className="flex-1" onClick={handleAddHotspot}>추가</Button>
            </div>
          </div>
        </div>
      )}

      {/* 버튼 삭제 확인 */}
      {deleteHotspotConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteHotspotConfirm(null)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-semibold mb-2">버튼 삭제</h2>
            <p className="text-sm text-muted-foreground mb-6">"{deleteHotspotConfirm.label}" 버튼을 삭제하시겠습니까?</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteHotspotConfirm(null)}>취소</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDeleteHotspot}>삭제</Button>
            </div>
          </div>
        </div>
      )}

      {/* 추가/수정 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h2 className="font-semibold">{editingStandard ? "표준화 수정" : "표준화 추가"}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">분류</label>
                <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50" value={form.categoryId} onChange={e => setForm(prev => ({ ...prev, categoryId: e.target.value }))}>
                  <option value="">전체</option>
                  {hotspots.map(h => <option key={h.id} value={h.categoryId ?? ""}>{h.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">표준화명 *</label>
                <Input placeholder="표준화명 입력" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">항목 번호</label>
                <Input placeholder="예: 6.3.2" value={form.standardNumber} onChange={e => setForm(prev => ({ ...prev, standardNumber: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">내용 *</label>
                <textarea className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-y" value={form.body} onChange={e => setForm(prev => ({ ...prev, body: e.target.value }))} />
                {editingStandard && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">현안 및 근거 조항 (basis)</label>
                      <textarea className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px] resize-y" value={form.basis} onChange={e => setForm(prev => ({ ...prev, basis: e.target.value }))} placeholder="현안 사항 및 근거 조항" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">검사방법 표준화 결정 (conclusion)</label>
                      <textarea className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px] resize-y" value={form.conclusion} onChange={e => setForm(prev => ({ ...prev, conclusion: e.target.value }))} placeholder="표준화 결정 내용" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">출처 (회차)</label>
                      <input className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card" value={form.source} onChange={e => setForm(prev => ({ ...prev, source: e.target.value }))} placeholder="예: 2025년 제1차 표준화" />
                    </div>
                  </>
                )}
                {editingStandard && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">현안 및 근거 조항 (basis)</label>
                      <textarea className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px] resize-y" value={form.basis} onChange={e => setForm(prev => ({ ...prev, basis: e.target.value }))} placeholder="현안 사항 및 근거 조항" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">검사방법 표준화 결정 (conclusion)</label>
                      <textarea className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px] resize-y" value={form.conclusion} onChange={e => setForm(prev => ({ ...prev, conclusion: e.target.value }))} placeholder="표준화 결정 내용" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">출처 (회차)</label>
                      <input className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card" value={form.source} onChange={e => setForm(prev => ({ ...prev, source: e.target.value }))} placeholder="예: 2025년 제1차 표준화" />
                    </div>
                  </>
                )}
              </div>
              <DatePicker label="건축허가일" value={form.permitDate} onChange={v => setForm(prev => ({ ...prev, permitDate: v }))} />
              <DatePicker label="검사기준적용일" value={form.inspectionDate} onChange={v => setForm(prev => ({ ...prev, inspectionDate: v }))} />
              <DatePicker label="검사일" value={form.inspectionYear} onChange={v => setForm(prev => ({ ...prev, inspectionYear: v }))} />
              <div>
                <label className="block text-sm font-medium mb-1">사진 (최대 10장)</label>
                <input type="file" accept="image/*" multiple className="w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary" onChange={handleImageUpload} />
                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative">
                        <img src={img} alt="" className="w-full h-20 object-cover rounded-xl border border-border" />
                        <button className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs" onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>취소</Button>
                <Button className="flex-1" onClick={handleSubmit}>저장</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ==================== 기술자료 탭 ==================== */}
      {defaultTab === "map" && (
        <div className="flex-1 overflow-y-auto" ref={zoomContentRef}>
          <div className="p-3 space-y-3">

            {/* 편집 모드 툴바 */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">구조도 & 기술자료</h2>
              <div className="flex gap-2">
                <Button
                  variant={isAdminMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (isAdminMode) {
                      setIsAdminMode(false);
                    } else {
                      setIsPasswordDialogOpen(true);
                    }
                  }}
                >
                  <Settings className="h-4 w-4 mr-1" />{isAdminMode ? "편집 중" : "편집"}
                </Button>
                {isAdminMode && (
                  <Button size="sm" onClick={openAddModal}>
                    <Plus className="h-4 w-4 mr-1" />추가
                  </Button>
                )}
              </div>
            </div>

            {isAdminMode && (
              <div className="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-xl flex flex-wrap gap-2 items-center text-sm">
                <span className="text-orange-700 dark:text-orange-300 font-medium">✏️ 버튼을 드래그해서 이동</span>
                <label className="flex items-center gap-1 cursor-pointer bg-white dark:bg-card border border-orange-300 rounded-lg px-2 py-1 text-xs text-orange-700 dark:text-orange-300 hover:bg-orange-50">
                  <ImageIcon className="h-3 w-3" />구조도 변경
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                <Button size="sm" variant="outline" className="text-xs h-7 border-orange-300 text-orange-700" onClick={() => setShowAddHotspot(true)}>
                  <Plus className="h-3 w-3 mr-1" />버튼 추가
                </Button>
                {hotspots.map(h => (
                  <Button key={h.id} size="sm" variant="outline" className="text-xs h-7 border-red-300 text-red-600" onClick={() => setDeleteHotspotConfirm(h)}>
                    <Trash2 className="h-3 w-3 mr-1" />{h.label}
                  </Button>
                ))}
              </div>
            )}

            {/* 구조도 */}
            <div className="relative w-full aspect-[2/3] sm:aspect-[3/4] md:aspect-[9/8] rounded-2xl overflow-hidden shadow-lg border border-border">
              <canvas ref={canvasRef} className={`w-full h-full ${isAdminMode ? "cursor-move" : "cursor-pointer"}`}
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp} onMouseLeave={async () => {
                  if (draggingId !== null) {
                    const canvas = canvasRef.current;
                    if (canvas && pinDragPosRef.current) {
                      const newLeft = (pinDragPosRef.current.x / canvas.width) * 100;
                      const newTop = (pinDragPosRef.current.y / canvas.height) * 100;
                      updateHotspot.mutate({ id: draggingId, hotspot: { left: String(newLeft.toFixed(2)), top: String(newTop.toFixed(2)) } });
                    }
                    pinDragPosRef.current = null;
                    setDraggingId(null);
                  }
                  if (draggingCardId !== null) {
                    fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "cardOffsets", value: JSON.stringify(cardOffsetsRef.current) }) }).catch(() => {});
                    setDraggingCardId(null);
                  }
                }}
                onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
                style={{touchAction: isAdminMode ? "none" : "auto"}} />
            </div>

            {/* 표준화 목록 + 상세 */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-sm mb-2">표준화 자료 ({STD_ITEMS.length}건)</h3>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="검색..." value={stdSearch} onChange={e => { setStdSearch(e.target.value); setStdSelected(null); }} className="pl-9 h-8 text-xs bg-secondary border-0" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {STD_CATEGORIES.map(cat => {
                    const cnt = cat === "전체" ? STD_ITEMS.length : STD_ITEMS.filter(x => x.category === cat).length;
                    if (cnt === 0) return null;
                    return (
                      <button key={cat} onClick={() => { setStdCategory(cat); setStdSelected(null); }}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${stdCategory === cat ? "bg-foreground text-background border-foreground" : "bg-background border-border text-muted-foreground hover:bg-muted"}`}>
                        {cat} <span className="opacity-60">{cnt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="divide-y divide-border max-h-[480px] overflow-y-auto">
                {(() => {
                  const filtered = STD_ITEMS.filter(x =>
                    (stdCategory === "전체" || x.category === stdCategory) &&
                    (!stdSearch || x.title.includes(stdSearch) || x.ref.includes(stdSearch) || x.conclusion.includes(stdSearch))
                  );
                  if (filtered.length === 0) return <p className="text-center text-muted-foreground py-8 text-sm">검색 결과 없음</p>;
                  return filtered.map((item, idx) => (
                    <div key={idx}>
                      <div onClick={() => setStdSelected(stdSelected === item ? null : item)}
                        className={`p-3 cursor-pointer transition-colors ${stdSelected === item ? "bg-blue-500/5" : "hover:bg-muted/50"}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium leading-snug text-foreground mb-1 line-clamp-2">{item.title}</div>
                            <div className="text-[11px] text-muted-foreground">{item.source} · {item.typeTag}</div>
                          </div>
                          <span className="text-muted-foreground shrink-0 mt-0.5 text-xs">{stdSelected === item ? "▲" : "▽"}</span>
                        </div>
                      </div>
                      {stdSelected === item && (
                        <div className="px-3 pb-3 pt-1 bg-blue-500/5 border-t border-blue-200/30 space-y-2.5">
                          {(item.ref || item.basis) && (
                            <div className="space-y-1.5">
                              <p className="text-xs font-bold text-muted-foreground tracking-wide">검사기준 내용</p>
                              {item.ref && <p className="text-[11px] font-semibold text-blue-600">{item.ref}</p>}
                              {item.basis && <p className="text-[11px] text-muted-foreground leading-relaxed bg-card rounded-lg p-2">{item.basis}</p>}
                            </div>
                          )}
                          {item.conclusion && (
                            <div className="space-y-1.5">
                              <p className="text-xs font-bold text-muted-foreground tracking-wide">표준화</p>
                              <p className="text-[11px] text-foreground leading-relaxed border-l-2 border-amber-400 pl-2">{item.conclusion}</p>
                            </div>
                          )}
                          <StdPhotoSection itemKey={item.title} />
                          <div className="pt-1.5 border-t border-border/50">
                            <p className="text-xs text-muted-foreground">출처 · {item.source}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 모달들 ==================== */}

      
      {/* 삭제 확인 */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-semibold mb-2">삭제 확인</h2>
            <p className="text-sm text-muted-foreground mb-6">"{deleteConfirm.title}"을 삭제하시겠습니까?</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>취소</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete}>삭제</Button>
            </div>
          </div>
        </div>
      )}

      {/* 버튼 추가 */}
      {showAddHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowAddHotspot(false)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-semibold mb-4">버튼 추가</h2>
            <Input placeholder="예: 기계실" value={newHotspotLabel} onChange={e => setNewHotspotLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddHotspot()} className="mb-2" />
            <p className="text-xs text-muted-foreground mb-4">추가 후 드래그해서 위치 조정하세요.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddHotspot(false)}>취소</Button>
              <Button className="flex-1" onClick={handleAddHotspot}>추가</Button>
            </div>
          </div>
        </div>
      )}

      {/* 버튼 삭제 확인 */}
      {deleteHotspotConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteHotspotConfirm(null)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-semibold mb-2">버튼 삭제</h2>
            <p className="text-sm text-muted-foreground mb-6">"{deleteHotspotConfirm.label}" 버튼을 삭제하시겠습니까?</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteHotspotConfirm(null)}>취소</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDeleteHotspot}>삭제</Button>
            </div>
          </div>
        </div>
      )}

      {/* 추가/수정 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h2 className="font-semibold">{editingStandard ? "표준화 수정" : "표준화 추가"}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">분류</label>
                <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50" value={form.categoryId} onChange={e => setForm(prev => ({ ...prev, categoryId: e.target.value }))}>
                  <option value="">전체</option>
                  {hotspots.map(h => <option key={h.id} value={h.categoryId ?? ""}>{h.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">표준화명 *</label>
                <Input placeholder="표준화명 입력" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">항목 번호</label>
                <Input placeholder="예: 6.3.2" value={form.standardNumber} onChange={e => setForm(prev => ({ ...prev, standardNumber: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">내용 *</label>
                <textarea className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-y" value={form.body} onChange={e => setForm(prev => ({ ...prev, body: e.target.value }))} />
              </div>
              <DatePicker label="건축허가일" value={form.permitDate} onChange={v => setForm(prev => ({ ...prev, permitDate: v }))} />
              <DatePicker label="검사기준적용일" value={form.inspectionDate} onChange={v => setForm(prev => ({ ...prev, inspectionDate: v }))} />
              <DatePicker label="검사일" value={form.inspectionYear} onChange={v => setForm(prev => ({ ...prev, inspectionYear: v }))} />
              <div>
                <label className="block text-sm font-medium mb-1">사진 (최대 10장)</label>
                <input type="file" accept="image/*" multiple className="w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary" onChange={handleImageUpload} />
                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative">
                        <img src={img} alt="" className="w-full h-20 object-cover rounded-xl border border-border" />
                        <button className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs" onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>취소</Button>
                <Button className="flex-1" onClick={handleSubmit}>저장</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 검색결과 팝업 */}
      {selectedSearchResult && createPortal(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:9999,backgroundColor:"rgba(0,0,0,0.6)"}} onClick={() => setSelectedSearchResult(null)}>
          <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"calc(100% - 32px)",maxWidth:"512px",maxHeight:"85vh",overflowY:"auto",zIndex:10000}} className="bg-card rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} onFocus={e => e.stopPropagation()}>
            <div className="flex justify-between items-start p-4 border-b border-border">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${
                selectedSearchResult.type === "standard" ? "bg-blue-500"
                : selectedSearchResult.type === "judgment" ? "bg-green-500"
                : "bg-amber-500"
              }`}>
                {selectedSearchResult.type === "standard" ? "표준화" : selectedSearchResult.type === "judgment" ? "안전검사기준" : "검사기준"}
              </span>
              <button onClick={() => setSelectedSearchResult(null)} className="text-muted-foreground hover:text-foreground p-1 shrink-0"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-4 space-y-3">
              {selectedSearchResult.type === "standard" ? (() => {
                const std = STD_ITEMS.find(x => x.title === selectedSearchResult.title) || null;
                return (
                  <>
                    <h2 className="text-sm font-semibold leading-snug">{selectedSearchResult.title}</h2>
                    {std && (std.ref || std.basis) && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-muted-foreground tracking-wide">검사기준 내용</p>
                        {std.ref && <p className="text-xs font-semibold text-blue-600">{std.ref}</p>}
                        {std.basis && <p className="text-xs text-muted-foreground leading-relaxed bg-secondary rounded-lg p-2.5">{std.basis}</p>}
                      </div>
                    )}
                    {std?.conclusion && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-muted-foreground tracking-wide">표준화</p>
                        <p className="text-xs text-foreground leading-relaxed border-l-2 border-amber-400 pl-2.5">{std.conclusion}</p>
                      </div>
                    )}
                    {!std && <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedSearchResult.content}</p>}
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-0.5">출처</p>
                      <p className="text-xs font-medium text-muted-foreground">{std?.source || ""}</p>
                    </div>
                  </>
                );
              })() : selectedSearchResult.type === "judgment" ? (() => {
                // 검사가이드 항목 팝업
                return (
                  <>
                    <h2 className="text-sm font-semibold leading-snug pr-4">{selectedSearchResult.title}</h2>
                    {selectedSearchResult.content && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-muted-foreground tracking-wide">안전검사기준 내용</p>
                        <p className="text-xs text-muted-foreground leading-relaxed bg-secondary rounded-lg p-2.5 whitespace-pre-wrap">{selectedSearchResult.content}</p>
                      </div>
                    )}
                    <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground">항목 ID: {selectedSearchResult.query}</p>
                      <button
                        className="text-xs bg-green-600 text-white rounded-lg px-3 py-1.5 hover:bg-green-700 shrink-0"
                        onClick={() => {
                          setSelectedSearchResult(null);
                          sessionStorage.setItem("pendingJudgmentItem", selectedSearchResult.query);
                          window.dispatchEvent(new CustomEvent("navigatePage", { detail: { index: 2 } }));
                        }}
                      >
                        검사가이드에서 보기 →
                      </button>
                    </div>
                  </>
                );
              })() : (() => {
                // inspection-content.json에서 해당 항목 전체 데이터 조회
                const itemId = selectedSearchResult.query;
                const entry = (INSPECTION_CONTENT as unknown as Record<string, {text?: string; revisions?: any[]}>)[itemId];
                const revisions = entry?.revisions || [];
                const latestRev = revisions[revisions.length - 1];
                const fullText = entry?.text || selectedSearchResult.content;
                return (
                  <>
                    {/* 제목: 첫 문장만 표시 */}
                    <h2 className="text-sm font-semibold leading-snug pr-4">
                      <span className="text-xs font-mono text-muted-foreground mr-1">[{itemId}]</span>
                      {fullText.split(/[.\n]/)[0]?.trim() || itemId}
                    </h2>
                    {fullText && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-muted-foreground tracking-wide">검사기준 내용</p>
                        <p className="text-xs text-muted-foreground leading-relaxed bg-secondary rounded-lg p-2.5 whitespace-pre-wrap">{fullText}</p>
                      </div>
                    )}
                    {latestRev && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-muted-foreground tracking-wide">적용일</p>
                        <p className="text-xs text-foreground border-l-2 border-amber-400 pl-2.5">{latestRev.effectiveDate} 이후 건축허가분부터 적용</p>
                      </div>
                    )}
                    <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground">항목 ID: {itemId}</p>
                      <button
                        className="text-xs bg-primary text-primary-foreground rounded-lg px-3 py-1.5 hover:bg-primary/90 shrink-0"
                        onClick={() => {
                          setSelectedSearchResult(null);
                          // 검사기준 페이지(index 3)로 이동
                          sessionStorage.setItem("pendingInspectionDetail", itemId);
                          window.dispatchEvent(new CustomEvent("navigatePage", { detail: { index: 3 } }));
                        }}
                      >
                        검사가이드에서 보기 →
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 관리자 모드 비밀번호 다이얼로그 */}
      {isPasswordDialogOpen && createPortal(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:9999,backgroundColor:"rgba(0,0,0,0.6)"}} onClick={() => setIsPasswordDialogOpen(false)}>
          <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"calc(100% - 64px)",maxWidth:"320px",zIndex:10000}} className="bg-card rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()} onFocus={e => e.stopPropagation()}>
            <h2 className="font-semibold text-base mb-4">관리자 모드</h2>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  if (adminPassword === "910919") {
                    setIsAdminMode(true);
                    setIsPasswordDialogOpen(false);
                    setAdminPassword("");
                  } else {
                    alert("비밀번호가 틀렸습니다.");
                    setAdminPassword("");
                  }
                }
              }}
              className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background mb-4 outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="flex gap-2">
              <button onClick={() => { setIsPasswordDialogOpen(false); setAdminPassword(""); }} className="flex-1 py-2 rounded-xl border border-border text-sm">취소</button>
              <button
                onClick={() => {
                  if (adminPassword === "910919") {
                    setIsAdminMode(true);
                    setIsPasswordDialogOpen(false);
                    setAdminPassword("");
                  } else {
                    alert("비밀번호가 틀렸습니다.");
                    setAdminPassword("");
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm"
              >확인</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 표준화 상세 */}
      {selectedStandard && createPortal(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:9999,backgroundColor:"rgba(0,0,0,0.6)"}} onClick={() => setSelectedStandard(null)}>
          <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"calc(100% - 32px)",maxWidth:"512px",maxHeight:"85vh",overflowY:"auto",zIndex:10000}} className="bg-card rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} onFocus={e => e.stopPropagation()}>
            <div className="flex justify-between items-start p-5 border-b border-border">
              <h2 className="text-lg font-semibold pr-4">{selectedStandard.title}</h2>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEditModal(selectedStandard)} className="text-primary hover:text-primary/80 p-1"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => { setDeleteConfirm(selectedStandard); setSelectedStandard(null); }} className="text-destructive hover:text-destructive/80 p-1"><Trash2 className="h-4 w-4" /></button>
                <button onClick={() => setSelectedStandard(null)} className="text-muted-foreground hover:text-foreground p-1"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {selectedStandard.standardNumber && <Badge variant="outline">{selectedStandard.standardNumber}</Badge>}
              {selectedStandard.permitDate && <div className="flex gap-2 text-sm"><span className="text-muted-foreground">건축허가일:</span><span>{selectedStandard.permitDate}</span></div>}
              {selectedStandard.inspectionDate && <div className="flex gap-2 text-sm"><span className="text-muted-foreground">검사기준적용일:</span><span>{selectedStandard.inspectionDate}</span></div>}
              {selectedStandard.inspectionYear && <div className="flex gap-2 text-sm"><span className="text-muted-foreground">검사일:</span><span>{selectedStandard.inspectionYear}</span></div>}
              <div><p className="text-sm text-muted-foreground mb-1">내용</p><p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedStandard.body}</p></div>
              {selectedStandard.imageUrls && selectedStandard.imageUrls.length > 0 && (
                <div><p className="text-sm text-muted-foreground mb-2">이미지 ({selectedStandard.imageUrls.length}장)</p>
                  <div className="grid grid-cols-2 gap-2">{selectedStandard.imageUrls.map((url, i) => <img key={i} src={url} alt="" className="rounded-xl w-full object-cover border border-border" />)}</div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
