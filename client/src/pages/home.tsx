import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import defaultStructureImg from "@assets/structure_1764142259144.png";
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

// ==================== 규칙 기반 AI 비서 ====================
type Message = { role: "user" | "assistant"; content: string; time: string; };

const QUICK_QUESTIONS = [
  "오늘 안전 체크리스트",
  "UCMP 기준 알려줘",
  "피트 안전 기준",
  "과속조절기 점검 방법",
  "최근 개정 기준 요약",
  "승강장문 잠금 기준",
];

function getRuleBasedAnswer(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("정밀안전검사") || q.includes("정밀 안전")) {
    return `📋 **정밀안전검사란?**\n\n엘리베이터 설치 후 일정 기간이 지나면 의무적으로 받아야 하는 심층 검사입니다.\n\n**검사 주기**\n• 설치 후 15년 이상: 3년마다\n• 3회 이상 정밀검사 후: 조건에 따라 연장 가능\n\n**검사 항목**\n• 기계실/구동기/제어반\n• 승강로/승강장문\n• 카 내부/카 상부\n• 피트 및 완충기\n• 안전회로 전반\n\n판정결과 페이지에서 자세한 체크리스트를 확인하세요! ✅`;
  }

  if (q.includes("과속조절기") || q.includes("조속기")) {
    return `⚙️ **과속조절기 점검 방법**\n\n**점검 항목**\n1. 과속조절기 전기안전장치 작동 확인\n2. 로프 마모·파단 상태 확인\n3. 봉인 상태 확인 (조정 가능형)\n4. 추락방지안전장치 연동 확인\n\n**판정 기준**\n• 전기안전장치 작동 시 엘리베이터 정지 → 적합\n• 로프 마모가 기준 초과 → 교체 필요\n• 봉인 훼손 시 → 부적합\n\n관련 기준: KS B 6932`;
  }

  if (q.includes("피트") || q.includes("pit")) {
    return `🔧 **피트 안전 기준**\n\n**피트 출입 안전**\n• 깊이 2.5m 초과 시 출입문 설치 필수\n• 사다리: 알루미늄/부식방지 철재\n• 발판 폭 280mm, 깊이 25~30mm\n\n**피트 내 장치**\n• 정지장치: 피트 바닥 및 출입문에서 손 닿는 위치\n• 깊이 1.6m 초과 시 상/하부 2개소 설치\n• 점검운전 조작반: 피난공간 0.3m 이내\n\n**피트 환경**\n• 누수 없고 청결 유지 필수\n• 배수설비 원칙적 불가 (소방용 제외)`;
  }

  if (q.includes("승강장문") || q.includes("문잠금") || q.includes("잠금장치")) {
    return `🚪 **승강장문 잠금장치 기준**\n\n**기본 요건**\n• 잠금장치 덮개는 투명 재질\n• 카가 잠금해제구간 밖에 있을 때 문 열림 방지\n• 비상잠금해제: 삼각열쇠로 외부 해제 가능\n\n**전기안전장치**\n• 문 닫힘·잠금 상태 전기적 확인 필수\n• 접점 개방 시 카 즉시 정지\n\n**틈새 기준**\n• 문짝 간 틈새: 테이퍼 게이지로 측정\n• 승강장문 측면 폭: 카 출입구보다 50mm 초과 금지`;
  }

  if (q.includes("추락방지") || q.includes("안전장치") || q.includes("비상정지")) {
    return `🛡️ **카 추락방지안전장치**\n\n**작동 원리**\n과속조절기 작동 → 추락방지안전장치 작동 → 카 하강 정지\n\n**점검 기준**\n• 작동 시 카 수평도: 5% 이하\n• 전기안전장치 연동 확인\n• 작동 후 정상 운행 복귀 확인\n\n**관련 기준**\n• KS B 6930\n• 엘리베이터 안전기준 10.2.2.1.6`;
  }

  if (q.includes("오늘") || q.includes("체크리스트") || q.includes("점검")) {
    const today = new Date();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dateStr = `${today.getMonth()+1}월 ${today.getDate()}일 (${days[today.getDay()]})`;
    return `📅 **${dateStr} 안전 체크리스트**\n\n**작업 전 필수 확인**\n☐ 개인보호구(안전모, 안전화, 안전대) 착용\n☐ 주개폐기 위치 및 상태 확인\n☐ 피트 출입 전 정지장치 작동\n☐ 카 상부 작업 시 점검운전 스위치 ON\n\n**정기 점검 항목**\n☐ 승강장문 잠금장치 작동 확인\n☐ 비상통화장치 통화 테스트\n☐ 과속조절기 봉인 상태 확인\n☐ 완충기 상태 및 오일 레벨\n\n안전한 하루 되세요! 💪`;
  }

  if (q.includes("안전대") || q.includes("안전모") || q.includes("보호구") || q.includes("ppe")) {
    return `🦺 **개인보호구(PPE) 안내**\n\n**필수 착용 보호구**\n• 안전모: KS G 6062 / EN 397\n• 안전화: KS F 4412 / S1P 이상\n• 안전대: KS G 6008 / EN 361\n\n**착용 주의사항**\n• 충격받은 안전모는 즉시 교체\n• 안전대 전신하네스 모든 버클 체결\n• 랜야드 앵커포인트 연결 확인\n\n안전보건관리 페이지에서 보호구 만료일을 관리하세요! ⚠️`;
  }

  if (q.includes("cpr") || q.includes("심폐소생") || q.includes("응급")) {
    return `❤️ **심폐소생술(CPR) 요약**\n\n1️⃣ 반응 확인 → 119 신고\n2️⃣ 기도 확보 (머리 뒤로, 턱 올림)\n3️⃣ 가슴압박 30회\n   • 깊이 5~6cm\n   • 속도 100~120회/분\n4️⃣ 인공호흡 2회\n5️⃣ 30:2 반복\n\n⚡ AED 도착 시 즉시 사용!\n\n자세한 내용은 안전보건관리 → 응급처치 페이지를 확인하세요.`;
  }

  if (q.includes("기계실") || q.includes("권상기") || q.includes("브레이크")) {
    return `⚙️ **기계실 주요 점검 항목**\n\n**권상기/구동기**\n• 권상기 고정 상태 (철골/내력벽 위)\n• 전자-기계 브레이크 작동\n• 오버밸런스(균형량) 확인\n\n**제어반**\n• 주개폐기 차단 시 운동 방지\n• 조명: 작업부 200lx, 비상운전 50lx\n• 콘센트 1개 이상\n\n**자동구출운전**\n• 정전 시 카 층 이동 확인\n• 비상발전기 연동 상태`;
  }

  if (q.includes("ucmp") || q.includes("개문출발") || q.includes("문출발")) {
    return `개문출발방지장치 (UCMP)\n\n작동 원리\n카가 층에 정지하지 않은 상태에서 승강장문이 열리면 즉시 카를 정지시키는 장치입니다.\n\n점검 기준\n• 이중브레이크와 로프브레이크 동시 작동 금지\n• 정밀안전검사 시 100% 및 무부하 조건 모두 시험\n• 기존 승강기 추가 설치 시 안전성 평가 대상\n\n2025 개정\n기존 설치 승강기까지 의무 확대 적용 중입니다. 미설치 시 조건부합격 또는 사용중지 처분 가능합니다.`;
  }

  if (q.includes("개정") || q.includes("최근 기준") || q.includes("변경")) {
    return `2025년 주요 개정 기준 요약\n\n안전장치\n• UCMP 기존 승강기 의무화 확대\n• 카 비상조명 작동시간: 1시간 → 2시간\n• 자동구출운전 확인 방법 구체화\n\n환경 기준\n• 피트 조명: 10lx → 20lx 강화\n• 기계실 에어컨 자가증발식 허용 (조건부)\n\n구조 기준\n• 피트 사다리 발판 규격 명확화\n• 승강로 유리벽 접합유리 기준 강화\n\n검사 시 위 항목을 우선적으로 확인하시기 바랍니다.`;
  }

  // 기본 답변
  return `답변 가능한 주제\n\n• 정밀안전검사 절차 및 기준\n• UCMP / 추락방지 장치\n• 피트 / 승강장문 기준\n• 2025년 개정 기준 요약\n• 오늘의 안전 체크리스트\n• 응급처치 / CPR\n• 개인보호구 (PPE)\n• 기계실 점검 항목\n\n빠른 질문을 눌러보거나 직접 입력해보세요.`;
}

function formatTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // 탭
  const [activeTab, setActiveTab] = useState<"chat" | "map">("chat");

  // 채팅
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `엘리베이터 안전 비서입니다.\n\n오늘의 주요 안전 정보를 확인하세요.`,
      time: formatTime()
    },
    {
      role: "assistant",
      content: `최근 빈도 높은 사고 유형 (2024~2025)\n\n1위  승강장문 열림 주행 — 문닫힘 안전장치 불량\n2위  피트 추락 — 최하층 정지장치 미작동\n3위  카 상부 끼임 — 점검운전 중 안전스위치 미사용\n\n위 3가지는 정기검사 시 집중 점검 항목입니다.`,
      time: formatTime()
    },
    {
      role: "assistant",
      content: `2025년 주요 개정 기준\n\n• 개문출발방지장치(UCMP) 기존 승강기 의무화 확대\n• 피트 조명 기준 강화: 피트 전 구간 10lx → 20lx\n• 카 비상조명 작동시간 연장: 1시간 → 2시간\n• 자동구출운전 작동 확인 방법 구체화\n\n검사 시 해당 항목 반드시 확인하세요.`,
      time: formatTime()
    },
    {
      role: "assistant",
      content: `궁금한 기준이나 점검 방법을 질문하거나, 아래 빠른 질문을 눌러보세요.`,
      time: formatTime()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // 구조도/표준화
  const [activeButtonId, setActiveButtonId] = useState<number | null>(null);
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
  // 카드 오프셋 (핫스팟 id → 카드 중심의 캔버스 % 위치)
  const [cardOffsets, setCardOffsets] = useState<Record<number, {cx: number, cy: number}>>({});
  const [draggingCardId, setDraggingCardId] = useState<number | null>(null);
  const [cardDragOffset, setCardDragOffset] = useState({ x: 0, y: 0 });
  const [showAddHotspot, setShowAddHotspot] = useState(false);
  const [newHotspotLabel, setNewHotspotLabel] = useState("");
  const [deleteHotspotConfirm, setDeleteHotspotConfirm] = useState<Hotspot | null>(null);

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

  // 채팅 스크롤
  useEffect(() => {
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
      const answer = getRuleBasedAnswer(text);
      setMessages(prev => [...prev, { role: "assistant", content: answer, time: formatTime() }]);
      setIsTyping(false);
    }, 600);
  }, []);

  // 리더라인 설정 (카드 오프셋 저장값 우선, 없으면 자동 계산)
  const getCardOffset = useCallback((hotspot: Hotspot, canvasW: number, canvasH: number) => {
    const x = (parseFloat(hotspot.left) / 100) * canvasW;
    const y = (parseFloat(hotspot.top) / 100) * canvasH;
    const cardW = 72;
    const cardH = 26;

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
        ctx.arc(x, y, editMode ? 5 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? "#2563eb" : editMode ? "#ea580c" : "#475569";
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
        ctx.strokeStyle = isActive ? "rgba(37,99,235,0.7)" : editMode ? "rgba(234,88,12,0.6)" : "rgba(71,85,105,0.45)";
        ctx.lineWidth = isActive ? 1.5 : 1;
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
        ctx.fillStyle = isActive ? "#2563eb" : editMode ? "#ea580c" : "rgba(255,255,255,0.92)";
        ctx.fill();

        // 카드 테두리
        ctx.strokeStyle = isActive ? "#1d4ed8" : editMode ? "#c2410c" : "rgba(203,213,225,0.8)";
        ctx.lineWidth = isActive ? 0 : 0.8;
        ctx.stroke();
        ctx.restore();

        // 카드 텍스트
        ctx.save();
        ctx.fillStyle = isActive ? "#ffffff" : editMode ? "#ffffff" : "#1e293b";
        ctx.font = `${isActive ? "600" : "500"} 10px -apple-system, 'Pretendard', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(hotspot.label, cardX + cardW / 2, cardY + cardH / 2);
        ctx.restore();
      });
    };
  }, [hotspots, activeButtonId, structureImg, editMode]);

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
      const hitAnchor = Math.hypot(px - x, py - y) < 20;
      const hitCard = px >= cardX && px <= cardX + cardW && py >= cardY && py <= cardY + cardH;
      if ((hitAnchor || hitCard) && !editMode) setActiveButtonId(hotspot.id);
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!editMode) return;
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
      if (Math.hypot(px - btnX, py - btnY) < 25) {
        setDraggingId(hotspot.id);
        setDragOffset({ x: px - btnX, y: py - btnY });
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!editMode) return;

    // 카드 드래그 이동
    if (draggingCardId !== null) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const px = (e.clientX - rect.left) * (canvas.width / rect.width);
      const py = (e.clientY - rect.top) * (canvas.height / rect.height);
      const newCX = px - cardDragOffset.x;
      const newCY = py - cardDragOffset.y;
      setCardOffsets(prev => ({
        ...prev,
        [draggingCardId]: {
          cx: (newCX / canvas.width) * 100,
          cy: (newCY / canvas.height) * 100,
        }
      }));
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
    if (!editMode) return;

    // 카드 드래그 종료 - 서버 저장
    if (draggingCardId !== null) {
      fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "cardOffsets", value: JSON.stringify(cardOffsets) })
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
    try {
      await updateHotspot.mutateAsync({ id: draggingId, hotspot: { left: `${newLeft.toFixed(1)}%`, top: `${newTop.toFixed(1)}%` } });
    } catch { toast({ title: "위치 저장 실패", variant: "destructive" }); }
    setDraggingId(null);
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
    <div className="min-h-screen bg-background flex flex-col">

      {/* 헤더 */}
      <div className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-sm">엘리베이터 안전 비서</h1>
              <p className="text-xs text-muted-foreground">규칙 기반 안내 시스템</p>
            </div>
          </div>

        </div>
      </div>

      {/* 탭 */}
      <div className="bg-card border-b border-border px-4">
        <div className="max-w-2xl mx-auto flex">
          {[{key:"chat",label:"비서"},{key:"map",label:"기술자료"}].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab===tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== 채팅 탭 ==================== */}
      {activeTab === "chat" && (
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                )}
                <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div className={`rounded-2xl px-4 py-3.5 text-sm leading-loose whitespace-pre-line ${
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
                  <span className="text-xs text-muted-foreground px-1 mt-1">{msg.time}</span>
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
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
          <div className="px-4 py-2 border-t border-border bg-card">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {QUICK_QUESTIONS.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)} className="flex-shrink-0 text-xs bg-secondary text-secondary-foreground rounded-full px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* 입력창 */}
          <div className="px-4 py-3 border-t border-border bg-card">
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

      {/* ==================== 기술자료 탭 ==================== */}
      {activeTab === "map" && (
        <div className="flex-1 overflow-y-auto" ref={zoomContentRef}>
          <div className="max-w-4xl mx-auto p-4 space-y-4">

            {/* 편집 모드 툴바 */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">구조도 & 기술자료</h2>
              <div className="flex gap-2">
                <Button variant={editMode ? "default" : "outline"} size="sm" onClick={() => setEditMode(!editMode)}>
                  <Settings className="h-4 w-4 mr-1" />{editMode ? "편집 중" : "편집"}
                </Button>
                <Button size="sm" onClick={openAddModal}>
                  <Plus className="h-4 w-4 mr-1" />추가
                </Button>
              </div>
            </div>

            {editMode && (
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
              <canvas ref={canvasRef} className={`w-full h-full ${editMode ? "cursor-move" : "cursor-pointer"}`}
                onClick={handleCanvasClick} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp} onMouseLeave={() => { if (draggingId !== null) setDraggingId(null); if (draggingCardId !== null) { fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "cardOffsets", value: JSON.stringify(cardOffsets) }) }).catch(() => {}); setDraggingCardId(null); } }} />
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

      {/* 표준화 상세 */}
      {selectedStandard && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4" onClick={() => setSelectedStandard(null)}>
          <div className="bg-card rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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
        </div>
      )}

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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-card rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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
    </div>
  );
}
