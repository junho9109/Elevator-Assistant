import { createPortal } from "react-dom";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import defaultStructureImg from "@assets/structure_new.jpg";
import Fuse from "fuse.js";
import { Search, Plus, X, Calendar, Pencil, Trash2, Settings, ImageIcon, Send, Bot, User } from "lucide-react";
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
import { INSPECTION_DATA_MR } from "@/data/inspection-data-mr";

// ==================== 규칙 기반 AI 챗봇 ====================
type Message = { role: "user" | "assistant"; content: string; time: string; searchResults?: SearchResult[]; };
type SearchResult = { type: "standard" | "inspection"; title: string; content: string; query: string; };

const QUICK_QUESTIONS = [
  "오늘 안전 체크리스트",
  "최신 사고 통계",
  "연령별 사고 현황",
];

// 키워드로 표준화+검사기준 검색
function searchAllData(keyword: string, standards: any[]): SearchResult[] {
  const kw = keyword.toLowerCase().trim();
  if (!kw || kw.length < 2) return [];
  const results: SearchResult[] = [];

  // 표준화 검색
  standards.forEach(s => {
    if ((s.title || "").toLowerCase().includes(kw) || (s.body || "").toLowerCase().includes(kw)) {
      results.push({
        type: "standard",
        title: s.title,
        content: s.body ? s.body.slice(0, 100) + (s.body.length > 100 ? "..." : "") : "",
        query: s.title
      });
    }
  });

  // 검사기준 검색 (INSPECTION_DATA_MR)
  const searchSection = (sections: any[]) => {
    sections.forEach(sec => {
      if (sec.items) {
        sec.items.forEach((item: any) => {
          if ((item.text || "").toLowerCase().includes(kw) || (item.id || "").toLowerCase().includes(kw)) {
            results.push({
              type: "inspection",
              title: `[${item.id}] ${sec.title || ""}`,
              content: item.text || "",
              query: item.id
            });
          }
        });
      }
      if (sec.subsections) searchSection(sec.subsections);
    });
  };
  searchSection(INSPECTION_DATA_MR);

  return results.slice(0, 10); // 최대 10개
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

const emptyForm = { categoryId: "", title: "", standardNumber: "", body: "", permitDate: "", inspectionDate: "", inspectionYear: "", images: [] as string[] };

// ==================== 메인 ====================
export default function Home({ defaultTab = "chat" }: { defaultTab?: "chat" | "map" }) {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // 탭
  const [activeTab, setActiveTab] = useState<"chat" | "map">(defaultTab as "chat" | "map");
  const [selectedSearchResult, setSelectedSearchResult] = useState<SearchResult | null>(null);

  // 채팅
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `엘리베이터 통합 챗봇입니다.\n\n키워드를 입력하세요. 예시) 비상통화장치, 잠금장치`,
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
      .then(d => { if (d.value) setCardOffsets(JSON.parse(d.value)); })
      .catch(() => {});
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
  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text, time: formatTime() };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);
    setTimeout(() => {
      let answer = getRuleBasedAnswer(text);
      let searchResults: SearchResult[] | undefined;

      // 키워드 검색: 항상 표준화+검사기준에서 검색해서 관련 항목 표시
      const results = searchAllData(text, standards);
      if (results.length > 0) {
        searchResults = results;
        // 규칙 기반 답변이 없으면 검색 결과 안내 메시지
        if (!answer) {
          answer = `"${text}"에 대한 검색 결과 ${results.length}건입니다. 아래 항목을 눌러 자세한 내용을 확인하세요.`;
        } else {
          // 규칙 기반 답변이 있어도 관련 자료 함께 표시
          answer += `

📎 관련 자료 ${results.length}건을 찾았습니다. 아래를 눌러 확인하세요.`;
        }
      } else if (!answer) {
        answer = `"${text}"에 대한 검색 결과가 없습니다. 다른 키워드로 검색해보세요.`;
      }
      // 사고 통계 질문 시 실시간 데이터 반영
      const q = text.toLowerCase();
      if ((q.includes("사고") || q.includes("통계") || q.includes("연도별")) && accidentStats.yearly.length > 0) {
        const latest = accidentStats.yearly[accidentStats.yearly.length - 1];
        const prev = accidentStats.yearly[accidentStats.yearly.length - 2];
        if (latest) {
          answer = `공공데이터 기준 최신 승강기 안전사고 통계

${latest.wrttimeid || latest.year || latest.stdr_year}년 현황
• 승객용 엘리베이터: ${latest.pasngr_elvtr_acc_cnt || latest.passengerElevatorAccidentCount || latest.safe_acci_only_passenger || "-"}건
• 화물용 엘리베이터: ${latest.freight_elvtr_acc_cnt || latest.freightElevatorAccidentCount || "-"}건
• 에스컬레이터: ${latest.escalator_acc_cnt || latest.escalatorAccidentCount || latest.safe_acci_escalator || "-"}건
• 합계: ${latest.tot_acc_cnt || latest.totalAccidentCount || latest.safe_acci_smry || "-"}건${prev ? `

전년(${prev.wrttimeid || prev.year || prev.stdr_year}년) 대비 추이를 확인하시려면 검사가이드 페이지를 참고하세요.` : ""}

출처: 행정안전부 통계연보`;
        }
      }
      if ((q.includes("연령") || q.includes("나이") || q.includes("고령")) && accidentStats.age.length > 0) {
        const ageData = accidentStats.age;
        const latest = ageData[ageData.length - 1];
        const year = latest.wrttimeid;
        const tot = parseInt(latest.tot);
        const child = parseInt(latest.old14_lss);
        const adult = parseInt(latest.old15_mor_old64_lss);
        const elder = parseInt(latest.old65_mor);
        const childPct = Math.round(child/tot*100);
        const adultPct = Math.round(adult/tot*100);
        const elderPct = Math.round(elder/tot*100);
        answer = `행정안전부 연령별 사고 통계 (${year}년)\n\n• 14세 이하: ${child}명 (${childPct}%)\n• 15~64세: ${adult}명 (${adultPct}%)\n• 65세 이상: ${elder}명 (${elderPct}%)\n• 합계: ${tot}명\n\n고령자(65세 이상) 비율이 ${elderPct}%로 가장 높습니다.\n점검 시 고령자 이용 구간 안전장치를 집중 확인하세요.\n\n출처: 행정안전부 통계연보`;
      }
      setMessages(prev => [...prev, { role: "assistant", content: answer, time: formatTime(), searchResults }]);
      setIsTyping(false);
    }, 600);
  }, [accidentStats, standards]);

  // 리더라인 설정 (카드 오프셋 저장값 우선, 없으면 자동 계산)
  const getCardOffset = useCallback((hotspot: Hotspot, canvasW: number, canvasH: number) => {
    const x = (parseFloat(hotspot.left) / 100) * canvasW;
    const y = (parseFloat(hotspot.top) / 100) * canvasH;
    const cardW = 144;
    const cardH = 52;

    let cardCX: number, cardCY: number;

    if (cardOffsets[hotspot.id]) {
      // 저장된 카드 위치 사용
      cardCX = (cardOffsets[hotspot.id].cx / 100) * canvasW;
      cardCY = (cardOffsets[hotspot.id].cy / 100) * canvasH;
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

        // 앵커 점 (부품 위치 표시)
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, isAdminMode ? 10 : 8, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? "#2563eb" : isAdminMode ? "#ea580c" : "#475569";
        ctx.shadowColor = isActive ? "rgba(37,99,235,0.5)" : "rgba(0,0,0,0.3)";
        ctx.shadowBlur = isActive ? 8 : 4;
        ctx.fill();
        ctx.restore();

        // 리더라인 (앵커 → 카드 중심)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(cardCX, y);
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
  }, [hotspots, activeButtonId, structureImg, isAdminMode]);

  useEffect(() => { if (activeTab === "map") drawCanvas(); }, [drawCanvas, activeTab]);

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
      const newOffsets = {
        ...cardOffsets,
        [draggingCardId]: {
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
        updateHotspot.mutate({ id: draggingId, left: String(newLeft), top: String(newTop), label: hotspot.label, categoryId: hotspot.categoryId });
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
      const newOffsets = {
        ...cardOffsetsRef.current,
        [draggingCardId]: {
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
        await updateHotspot.mutateAsync({ id: draggingId, left: String(newLeft.toFixed(2)), top: String(newTop.toFixed(2)), label: hotspot.label, categoryId: hotspot.categoryId });
        toast({ title: "핀 위치가 저장되었습니다." });
      } catch { toast({ title: "위치 저장 실패", variant: "destructive" }); }
    }
    setDraggingId(null);
    drawCanvas();
  };

  const handleAddHotspot = async () => {
    if (!newHotspotLabel.trim()) { toast({ title: "버튼 이름을 입력해주세요.", variant: "destructive" }); return; }
    try {
      await createHotspot.mutateAsync({ label: newHotspotLabel, top: "50%", left: "50%", categoryId: null });
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
    setForm({ categoryId: standard.categoryId ? String(standard.categoryId) : "", title: standard.title, standardNumber: standard.standardNumber || "", body: standard.body, permitDate: standard.permitDate || "", inspectionDate: standard.inspectionDate || "", inspectionYear: standard.inspectionYear || "", images: standard.imageUrls || [] });
    setSelectedStandard(null); setShowAddModal(true);
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
              <h1 className="font-semibold text-xs">{defaultTab === "chat" ? "엘리베이터 안전 챗봇" : "기술자료"}</h1>
              <p className="text-[10px] text-muted-foreground">{defaultTab === "chat" ? "규칙 기반 안내 시스템" : "구조도 & 표준화 자료"}</p>
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
                  <div className={`rounded-2xl px-3 py-2.5 text-sm leading-snug whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-card border border-border rounded-tl-sm"
                  }`}>
                    {msg.content.split('\n').map((line, i) => {
                    const isBold = /^[0-9]+(위|\.) /.test(line) || /^•/.test(line);
                    return (
                      <span key={i}>
                        {i > 0 && <br />}
                        {isBold ? <span className="font-medium">{line}</span> : line}
                      </span>
                    );
                  })}
                  </div>
                )}
                  <span className="text-xs text-muted-foreground px-1 mt-1">{msg.time}</span>
                  {msg.searchResults && msg.searchResults.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {msg.searchResults.map((r: SearchResult, ri: number) => (
                        <button
                          key={ri}
                          onClick={() => setSelectedSearchResult(r)}
                          className={`text-xs px-3 py-2 rounded-xl border text-left hover:opacity-80 transition-opacity ${
                            r.type === "standard"
                              ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30"
                              : "border-amber-400 bg-amber-50 dark:bg-amber-950/30"
                          }`}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${
                              r.type === "standard" ? "bg-blue-500" : "bg-amber-500"
                            }`}>
                              {r.type === "standard" ? "표준화" : "검사기준"}
                            </span>
                          </div>
                          <div className="font-medium text-foreground text-xs leading-tight">{r.title}</div>
                          {r.content && (
                            <div className="text-muted-foreground text-[10px] mt-0.5 leading-tight line-clamp-2">{r.content}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
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

          {/* 빠른 질문 */}
          <div className="px-4 py-2 border-t border-border bg-card shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {QUICK_QUESTIONS.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)} className="flex-shrink-0 text-xs bg-secondary text-secondary-foreground rounded-full px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors">
                  {q}
                </button>
              ))}
            </div>
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
                onMouseUp={handleMouseUp} onMouseLeave={() => { if (draggingId !== null) setDraggingId(null); if (draggingCardId !== null) { fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "cardOffsets", value: JSON.stringify(cardOffsetsRef.current) }) }).catch(() => {}); setDraggingCardId(null); } }}
                onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
                style={{touchAction: isAdminMode ? "none" : "auto"}} />
            </div>

            {/* 표준화 목록 */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold mb-3">
                  {activeButton ? `${activeButton.label} 기준 목록` : "전체 기준 목록"}
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="기준 검색..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-secondary border-0" />
                </div>
              </div>
              <div className="divide-y divide-border">
                {displayItems.length === 0 ? (
                  <p className="text-center text-muted-foreground py-10 text-sm">기준이 없습니다</p>
                ) : (
                  displayItems.map(standard => (
                    <div key={standard.id} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setSelectedStandard(standard)}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm mb-1 truncate">{standard.title}</h4>
                          {standard.standardNumber && <Badge variant="outline" className="text-xs mb-1">{standard.standardNumber}</Badge>}
                          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{standard.body}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
            <div className="flex justify-between items-start p-5 border-b border-border">
              <div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${selectedSearchResult.type === "standard" ? "bg-blue-500" : "bg-amber-500"}`}>
                  {selectedSearchResult.type === "standard" ? "표준화" : "검사기준"}
                </span>
                <h2 className="text-base font-semibold mt-2 pr-4">{selectedSearchResult.title}</h2>
              </div>
              <button onClick={() => setSelectedSearchResult(null)} className="text-muted-foreground hover:text-foreground p-1 shrink-0"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedSearchResult.content}</p>
              {selectedSearchResult.type === "inspection" && (
                <button
                  className="w-full mt-3 text-sm bg-primary text-primary-foreground rounded-xl py-2.5 hover:bg-primary/90"
                  onClick={() => {
                    const targetId = selectedSearchResult.query;
                    setSelectedSearchResult(null);
                    // 상세보기 팝업 열기 이벤트
                    window.dispatchEvent(new CustomEvent("openInspectionDetail", { detail: { itemId: targetId } }));
                  }}
                >
                  항목 상세보기 →
                </button>
              )}
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
