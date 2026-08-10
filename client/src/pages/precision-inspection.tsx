import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar, FileText, ClipboardList, AlertTriangle, CheckCircle2, Info, ListChecks, LayoutGrid, ArrowLeft, Building2, Building } from "lucide-react";

// ── 날짜 계산 유틸 ──
function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function formatDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일`;
}
function monthsDiff(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

// ── 규칙 데이터 ──
// 2026년 개정고시 "정밀안전검사 관련 승강기 부품 보완 이행기간 연장" 반영
// (기존 apartment_3year / staged_phase1 / staged_phase2는 폐지되어 parts_extension_3year로 통합됨)
const RULES: Record<string, any> = {
  parts_extension_3year: {
    label: "부품보완 이행기간 연장 (세 번째 → 네 번째 정밀안전검사)",
    inspectionType: "세 번째 정밀안전검사",
    judgment: "조건부합격 → 3년 연장 (네 번째 정밀안전검사 시 재판정)",
    extensionMonths: 36,
    basis: "「승강기 설치검사 및 안전검사에 관한 운영규정」 제11조의2·제11조의3",
    requiredDocs: [
      { title: "서면동의서", detail: "입주자 등(구분소유자) 3분의 2 이상 동의 — 공동주택·집합건축물·그 외 건축물 공통 적용" },
      { title: "승강기 안전부품 설치 이행계획서", detail: "이행완료 예정일(설치검사 후 24년 경과 네 번째 정밀안전검사일까지)과 이행계획 상세내용 기재, 대표자 서명 또는 직인 필수" },
      { title: "승강기 내·외부 안내 경고문 부착 증명자료", detail: "미설치 안전장치 사용 시 주의사항을 안내하는 경고문을 승강기 내·외부에 부착 후 증빙자료 제출" },
    ],
    adminProcess: [
      "① 관리주체: 서면동의서(2/3↑) + 설치 이행계획서 + 안내 경고문 부착 증명자료 제출",
      "② 검사기관: 동의율 및 서류 검토",
      "③ 검사기관: 조건부합격 처리 + 세 번째 정밀안전검사일 기준 네 번째 정밀안전검사까지 3년 연장 부여",
      "④ 관리주체: 검사판정 변경(조건부→불합격 등) 발생 시 안내 수령",
    ],
    note: "고시 발령 후 3개월까지는 서면동의서만 제출해도 유효하며, 3개월 이후에는 3종 서류 모두 의무 제출입니다. 기존 단계적 이행(1단계·2단계) 방식은 고시 시행일로 종료되어 이 항목으로 대체되었습니다.",
    warning: null,
    // 네 번째 정밀안전검사 시 설치계약 상태별 판정 분기
    fourthInspectionJudgments: {
      contracted: {
        label: "설치계약 완료 (착수 전)",
        judgment: "조건부합격 (2개월 부여)",
        extensionMonths: 2,
        requiredDocs: [
          { title: "설치계약서", detail: "부품(장치) 설치 공사 계약 완료를 증빙하는 계약서 제출" },
        ],
        note: "2개월 이내 설치 미완료 시 불합격으로 판정될 수 있습니다.",
        warning: null,
      },
      in_progress: {
        label: "설치공사 착수 중 (미완료)",
        judgment: "조건부합격 (2개월 + 추가 2개월, 총 4개월)",
        extensionMonths: 4,
        requiredDocs: [
          { title: "설치계약서", detail: "부품(장치) 설치 공사 계약 완료를 증빙하는 계약서 제출" },
          { title: "공사 진행 확인자료", detail: "착수 중임을 증빙하는 자료 (공정률, 현장사진 등)" },
        ],
        note: "최초 2개월 조건부합격 후, 착수 중임이 확인되면 추가 2개월(총 4개월)이 부여됩니다.",
        warning: null,
      },
      not_contracted: {
        label: "설치계약 미체결",
        judgment: "불합격",
        extensionMonths: null,
        requiredDocs: [],
        note: null,
        warning: "설치계약이 체결되지 않은 경우 검사일 기준 즉시 불합격 처리됩니다. 관리주체에게 반드시 안내해야 합니다.",
      },
    },
  },
  construction_delay: {
    label: "공사 지연 (부품 설치 공사 중·예정)",
    inspectionType: "세 번째 정밀안전검사",
    judgment: "조건부합격 → 2개월 + 추가 2개월 (총 4개월)",
    extensionMonths: 2,
    initialMonths: 2,
    basis: "검사규정 제13조제3항제1호",
    requiredDocs: [
      { title: "보완연장신청서", detail: "연장기간 2개월 기재" },
      { title: "부품설치 관련 공사계약서", detail: "계약 완료 후 신청 가능" },
    ],
    adminProcess: [
      "① 최초 검사: 조건부합격 2개월 부여",
      "② 관리주체: 이행기간 내 연장 신청 (공사계약서 첨부)",
      "③ 검사기관: 서류 검토 후 추가 2개월 연장 (총 4개월)",
    ],
    note: "4개월 내 설치 완료 가능한 경우에 한정. 4개월 내 완료가 어려우면 부품보완 이행기간 연장(서면동의서 등 3종 제출) 항목으로 처리",
    warning: null,
  },
  safety_evaluation: {
    label: "안전성평가 미완료",
    inspectionType: "안전검사",
    judgment: "조건부합격 → 2개월 + 추가 2개월 (총 4개월)",
    extensionMonths: 2,
    initialMonths: 2,
    basis: "검사규정 제13조제3항제1호",
    requiredDocs: [
      { title: "보완연장신청서", detail: "연장기간 2개월 기재" },
      { title: "안전성평가 신청서 (접수증)", detail: "연구개발실 게시판 접수이력 확인 필수" },
    ],
    adminProcess: [
      "① 최초 검사: 조건부합격 2개월 부여",
      "② 관리주체: 안전성평가 신청 후 이행기간 연장 신청",
      "③ 검사기관: 연구개발실 게시판에서 접수이력 확인",
      "④ 검사기관: 확인 후 추가 2개월 연장 (총 4개월)",
    ],
    note: "안전성평가 접수 확인 후에만 연장 가능",
    warning: null,
  },
  disaster: {
    label: "재난 발생 (작업자 출입 차단)",
    inspectionType: "안전검사",
    judgment: "조건부합격 → 차기안전검사 판정",
    extensionMonths: null,
    basis: "검사규정 제13조제3항제2호",
    requiredDocs: [
      { title: "보완연장신청서", detail: "차기안전검사 시까지 기재" },
      { title: "자체개선계획서", detail: "안전관리자 일상점검 결과 기록·관리 계획" },
      { title: "재난 근거 공문서", detail: "격리시설 지정서, 건물 폐쇄 명령서 등" },
    ],
    adminProcess: [
      "① 최초 검사: 조건부합격 2개월 부여",
      "② 관리주체: 재난 근거서류 + 자체개선계획서 제출",
      "③ 검사기관: 서류 검토 후 차기안전검사 판정으로 연장",
      "④ 검사기관: 전산 입력 유지 (이행완료 전까지)",
      "⑤ 검사기관: 재난 해소 시 즉시 부적합사항 조치 시정권고",
      "⑥ 주기별 최종 확인 — 6개월: 1년내 매 안전검사 / 1년: 차기 안전검사 / 2년: 1년내 확인검사",
    ],
    note: "출입 가능하면 연장 불가. 확인검사 불필요, 차기 안전검사에서 조건부사항 확인",
    warning: "재난 해소 후 즉시 부적합사항 조치 필수",
  },
  major_repair: {
    label: "대수선 없이 이행 불가 (적용제외)",
    inspectionType: "정밀안전검사",
    judgment: "적용제외 처리 (조건부합격 아님)",
    extensionMonths: null,
    basis: "검사규정 부칙 제2조제4항",
    applicableTarget: "소형 포지티브 엘리베이터, 사업장 특례 화물용 엘리베이터 등 승강로 협소 현장",
    requiredDocs: [
      { title: "유지관리계약서", detail: "월 2회 이상 점검 계약 필수" },
      { title: "자체개선계획서", detail: "자체점검 추가실시, 일상점검 기록·관리 계획" },
      { title: "대수선 관련 증빙서류", detail: "2개 이상 제조·수입업체의 검토의견서 필수" },
    ],
    adminProcess: [
      "① 관리주체: 적용제외 서류 일체 제출",
      "② 검사기관: 서류 검토 및 검토의견서 작성",
      "③ 검사기관: 해당 부품에 한하여 설치 제외 후 검사 판정",
      "④ 검사기관: 분기별 행정안전부 보고 (적용제외 승강기 목록)",
    ],
    note: "이후 안전검사 시 자체개선계획 이행여부 확인 불요. 단, 자체점검 추가실시 및 일상점검 수행 지속 권고",
    warning: null,
  },
};

// ── DatePicker ──
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
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 cursor-pointer hover:border-primary bg-card" onClick={() => setShow(!show)}>
        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className={`text-sm ${value ? "text-foreground font-medium" : "text-muted-foreground"}`}>{value ? value.replace(/-/g, ". ") : "검사일자 선택"}</span>
      </div>
      {show && (
        <div className="absolute z-50 mt-1 bg-card border border-border rounded-xl shadow-xl p-4 w-72 left-0">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => { if (viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); }} className="p-1.5 hover:bg-muted rounded-lg text-sm">◀</button>
            <span className="font-semibold text-sm">{viewYear}년 {months[viewMonth]}</span>
            <button onClick={() => { if (viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); }} className="p-1.5 hover:bg-muted rounded-lg text-sm">▶</button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-2">{["일","월","화","수","목","금","토"].map(d=><div key={d}>{d}</div>)}</div>
          <div className="grid grid-cols-7 text-center text-xs">
            {blanks.map(i=><div key={`b${i}`}/>)}
            {days.map(day=>{
              const dateStr=`${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              return <button key={day} onClick={()=>selectDay(day)} className={`p-1.5 rounded-full hover:bg-primary/20 ${value===dateStr?"bg-primary text-primary-foreground":"text-foreground"}`}>{day}</button>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── 메인 ──
export default function PrecisionInspectionPage() {
  const [mode, setMode] = useState<"guide" | "card">("guide");
  const [cardStep, setCardStep] = useState(0);
  const [buildingType, setBuildingType] = useState("");
  const [inspectionCount, setInspectionCount] = useState("");
  const [contractStatus, setContractStatus] = useState("");
  const [situation, setSituation] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const resetAll = () => {
    setBuildingType(""); setInspectionCount(""); setContractStatus("");
    setSituation(""); setInspectionDate(""); setResult(null); setError("");
    setCardStep(0);
  };

  const needsInspectionCount = situation === "parts_extension_3year";
  const needsContractStatus = needsInspectionCount && inspectionCount === "fourth";

  const SITUATIONS_COMMON = [
    { value: "parts_extension_3year", icon: "📝", title: "부품보완 이행기간 연장", sub: "서면동의서·이행계획서·경고문 → 3년 연장" },
  ];
  const SITUATIONS_GENERAL_EXTRA = [
    { value: "construction_delay", icon: "🔧", title: "공사 지연", sub: "부품 설치 공사 중·예정" },
    { value: "safety_evaluation", icon: "📋", title: "안전성평가 미완료", sub: "접수했으나 완료 안 됨" },
    { value: "disaster", icon: "⚠️", title: "재난 발생", sub: "작업자 출입 차단" },
    { value: "major_repair", icon: "🚧", title: "대수선 없이 이행 불가", sub: "적용제외 처리" },
  ];
  const situationOptions = isApartmentType(buildingType) ? SITUATIONS_COMMON : [...SITUATIONS_COMMON, ...SITUATIONS_GENERAL_EXTRA];

  const cardSelectBuildingType = (v: string) => {
    setBuildingType(v); setSituation(""); setInspectionCount(""); setContractStatus(""); setResult(null); setError("");
    setCardStep(1);
  };
  const cardSelectSituation = (v: string) => {
    setSituation(v); setInspectionCount(""); setContractStatus(""); setResult(null); setError("");
    setCardStep(v === "parts_extension_3year" ? 2 : 3);
  };
  const cardSelectInspectionCount = (v: string) => {
    setInspectionCount(v); setContractStatus("");
    if (v !== "fourth") setCardStep(3);
  };
  const cardGoBack = () => {
    if (cardStep === 0) return;
    if (cardStep === 1) { setSituation(""); setCardStep(0); return; }
    if (cardStep === 2) { setInspectionCount(""); setContractStatus(""); setCardStep(1); return; }
    if (cardStep === 3) {
      if (needsInspectionCount) { setCardStep(2); }
      else { setSituation(""); setCardStep(1); }
      return;
    }
  };

  const calcDeadline = (rule: any, baseDate: Date) => {
    if (!rule.extensionMonths) return null;
    const deadline = addMonths(baseDate, rule.extensionMonths + (rule.initialMonths || 0));
    return { deadline };
  };

  const handleCalculate = () => {
    setError("");
    setResult(null);
    if (!buildingType || !situation || !inspectionDate) {
      setError("건축물 유형, 연장 사유, 검사일자를 모두 입력해주세요.");
      return;
    }
    const rule = RULES[situation];
    if (!rule) { setError("해당 사유의 규정을 찾을 수 없습니다."); return; }

    if (needsInspectionCount && !inspectionCount) {
      setError("검사 회차(세 번째 · 네 번째)를 선택해주세요.");
      return;
    }
    if (needsContractStatus && !contractStatus) {
      setError("네 번째 정밀안전검사의 설치계약 상태를 선택해주세요.");
      return;
    }

    const base = new Date(inspectionDate);

    // 네 번째 정밀안전검사 — 설치계약 상태별 분기 판정
    if (needsContractStatus) {
      const branch = rule.fourthInspectionJudgments[contractStatus];
      const dates = branch.extensionMonths ? { deadline: addMonths(base, branch.extensionMonths) } : null;
      setResult({
        inspectionType: "네 번째 정밀안전검사",
        judgment: branch.judgment,
        basis: rule.basis,
        requiredDocs: branch.requiredDocs,
        adminProcess: [
          "① 검사기관: 네 번째 정밀안전검사 실시",
          `② 관리주체: 설치계약 상태 확인 — ${branch.label}`,
          `③ 검사기관: ${branch.judgment}`,
        ],
        note: branch.note,
        warning: branch.warning,
        dates,
        base,
        initialMonths: 0,
      });
      return;
    }

    const dates = calcDeadline(rule, base);
    setResult({ ...rule, dates, base });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="bg-card border-b border-border overflow-hidden sticky top-0 z-10">
        <div className="p-3 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              정
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">정밀안전검사</h1>
              <p className="text-xs text-muted-foreground">조건부합격 이행기간 연장 · 필요서류 · 행정처리 안내</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">

        {/* 모드 전환 탭 */}
        <div className="flex gap-1.5 bg-muted rounded-xl p-1">
          <button
            onClick={() => { setMode("guide"); resetAll(); }}
            className={`flex-1 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors ${mode === "guide" ? "bg-card font-semibold text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            <ListChecks className="h-3.5 w-3.5" />단계별 안내
          </button>
          <button
            onClick={() => { setMode("card"); resetAll(); }}
            className={`flex-1 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors ${mode === "card" ? "bg-card font-semibold text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />현장 진단
          </button>
        </div>

        {mode === "guide" && (
        <>
        {/* 공통사항 배너 */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 space-y-1">
          <p className="text-xs font-semibold text-blue-500 flex items-center gap-1"><Info className="h-3.5 w-3.5"/>공통사항</p>
          <p className="text-xs text-foreground">• 검사 시 연장 서류 모두 제출 시 → 최초 2개월 없이 바로 조건부기간 부여 가능</p>
          <p className="text-xs text-foreground">• 승강기민원24 보완연장신청 메뉴 신청 시 → 신청서 추가 불필요</p>
          <p className="text-xs text-muted-foreground">근거: 검사규정 제13조제3항 · 제11조의2·제11조의3 (2026년 개정고시)</p>
        </div>

        {/* Step 1: 건축물 유형 */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">1</span>
            <span className="text-sm font-semibold">건축물 유형</span>
          </div>
          <Select value={buildingType} onValueChange={v => { setBuildingType(v); setSituation(""); setInspectionCount(""); setContractStatus(""); setResult(null); setError(""); }}>
            <SelectTrigger className="text-sm"><SelectValue placeholder="유형을 선택하세요" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">공동주택 (아파트 등)</SelectItem>
              <SelectItem value="collective">집합건축물 (오피스텔 등)</SelectItem>
              <SelectItem value="general">일반건축물 (그 외 건축물)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Step 2: 연장 사유 */}
        {buildingType && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">2</span>
              <span className="text-sm font-semibold">연장 사유</span>
            </div>
            <Select value={situation} onValueChange={v => { setSituation(v); setInspectionCount(""); setContractStatus(""); setResult(null); setError(""); }}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="해당 사유를 선택하세요" /></SelectTrigger>
              <SelectContent>
                {situationOptions.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.title} — {s.sub}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Step 3: 검사 회차 (부품보완 이행기간 연장 항목일 때만) */}
        {needsInspectionCount && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">3</span>
              <span className="text-sm font-semibold">검사 회차</span>
            </div>
            <Select value={inspectionCount} onValueChange={v => { setInspectionCount(v); setContractStatus(""); setResult(null); setError(""); }}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="검사 회차 선택" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="third">세 번째 정밀안전검사</SelectItem>
                <SelectItem value="fourth">네 번째 정밀안전검사</SelectItem>
              </SelectContent>
            </Select>
            {needsContractStatus && (
              <Select value={contractStatus} onValueChange={v => { setContractStatus(v); setResult(null); setError(""); }}>
                <SelectTrigger className="text-sm mt-2"><SelectValue placeholder="설치계약 상태 선택" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="contracted">설치계약 완료 (착수 전)</SelectItem>
                  <SelectItem value="in_progress">설치공사 착수 중 (미완료)</SelectItem>
                  <SelectItem value="not_contracted">설치계약 미체결</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Step 4: 검사일자 */}
        {situation && (!needsInspectionCount || inspectionCount) && (!needsContractStatus || contractStatus) && (
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">{needsInspectionCount ? 4 : 3}</span>
              <span className="text-sm font-semibold">검사일자 입력</span>
            </div>
            <DatePicker label="정밀안전검사 실시일" value={inspectionDate} onChange={setInspectionDate} />
          </div>
        )}

        {/* 계산 버튼 */}
        {situation && inspectionDate && (!needsInspectionCount || inspectionCount) && (!needsContractStatus || contractStatus) && (
          <Button className="w-full font-semibold" onClick={handleCalculate}>
            이행기간 및 필요서류 확인
          </Button>
        )}

        {/* 에러 */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-xs text-destructive whitespace-pre-line">{error}</p>
          </div>
        )}
        </>
        )}

        {mode === "card" && (
        <>
        {/* 카드 진행 표시 + 뒤로가기 */}
        <div className="flex items-center gap-2">
          <button
            onClick={cardGoBack}
            disabled={cardStep === 0}
            className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center flex-shrink-0 disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-1.5 flex-1">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`h-1 rounded-full flex-1 ${i <= cardStep ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground flex-shrink-0">{cardStep + 1} / 4</span>
        </div>

        {/* 0단계: 건축물 유형 카드 */}
        {cardStep === 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground px-1">건축물 유형을 눌러 선택하세요</p>
            <button
              onClick={() => cardSelectBuildingType("apartment")}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${buildingType === "apartment" ? "border-primary bg-primary/5" : "border-border bg-card"}`}
            >
              <Building2 className="h-6 w-6 text-primary flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold">공동주택 · 집합건축물</p>
                <p className="text-xs text-muted-foreground mt-0.5">아파트, 오피스텔 등</p>
              </div>
              {buildingType === "apartment" && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
            </button>
            <button
              onClick={() => cardSelectBuildingType("general")}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${buildingType === "general" ? "border-primary bg-primary/5" : "border-border bg-card"}`}
            >
              <Building className="h-6 w-6 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold">일반건축물</p>
                <p className="text-xs text-muted-foreground mt-0.5">그 외 모든 건축물</p>
              </div>
              {buildingType === "general" && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
            </button>
          </div>
        )}

        {/* 1단계: 현장 상황(연장 사유) 카드 */}
        {cardStep === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground px-1">현장 상황을 눌러 선택하세요</p>
            {situationOptions.map(s => (
              <button
                key={s.value}
                onClick={() => cardSelectSituation(s.value)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${situation === s.value ? "border-primary bg-primary/5" : "border-border bg-card"}`}
              >
                <span className="text-xl flex-shrink-0">{s.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                </div>
                {situation === s.value && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
              </button>
            ))}
          </div>
        )}

        {/* 2단계: 검사 회차 (+ 설치계약 상태) 카드 */}
        {cardStep === 2 && needsInspectionCount && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground px-1">검사 회차를 눌러 선택하세요</p>
            <button
              onClick={() => cardSelectInspectionCount("third")}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${inspectionCount === "third" ? "border-primary bg-primary/5" : "border-border bg-card"}`}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold">세 번째 정밀안전검사</p>
                <p className="text-xs text-muted-foreground mt-0.5">부품보완 이행기간 3년 연장 적용</p>
              </div>
              {inspectionCount === "third" && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
            </button>
            <button
              onClick={() => cardSelectInspectionCount("fourth")}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${inspectionCount === "fourth" ? "border-primary bg-primary/5" : "border-border bg-card"}`}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold">네 번째 정밀안전검사</p>
                <p className="text-xs text-muted-foreground mt-0.5">설치계약 상태에 따라 판정</p>
              </div>
              {inspectionCount === "fourth" && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
            </button>

            {inspectionCount === "fourth" && (
              <div className="pt-2 space-y-2">
                <p className="text-xs text-muted-foreground px-1">설치계약 상태를 눌러 선택하세요</p>
                {[
                  { v: "contracted", l: "설치계약 완료 (착수 전)", sub: "조건부합격 · 2개월 부여" },
                  { v: "in_progress", l: "설치공사 착수 중 (미완료)", sub: "조건부합격 · 총 4개월 부여" },
                  { v: "not_contracted", l: "설치계약 미체결", sub: "불합격" },
                ].map(c => (
                  <button
                    key={c.v}
                    onClick={() => { setContractStatus(c.v); setResult(null); setError(""); setCardStep(3); }}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${contractStatus === c.v ? "border-primary bg-primary/5" : "border-border bg-card"}`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{c.l}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
                    </div>
                    {contractStatus === c.v && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3단계: 검사일자 + 계산 */}
        {cardStep === 3 && (
          <div className="space-y-3">
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs font-semibold mb-3">정밀안전검사 실시일</p>
              <DatePicker label="검사일자" value={inspectionDate} onChange={setInspectionDate} />
            </div>
            {inspectionDate && (
              <Button className="w-full font-semibold" onClick={handleCalculate}>
                이행기간 및 필요서류 확인
              </Button>
            )}
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-xs text-destructive whitespace-pre-line">{error}</p>
              </div>
            )}
          </div>
        )}
        </>
        )}

        {/* 결과 */}
        {result && (
          <div className="space-y-3">

            {/* 1. 필요서류 */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">필요 서류</span>
              </div>
              {result.requiredDocs.length === 0 ? (
                <p className="text-xs text-muted-foreground">해당 없음</p>
              ) : (
                <div className="space-y-2">
                  {result.requiredDocs.map((doc: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 bg-muted/30 rounded-lg p-2.5">
                      <span className="text-primary text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{doc.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{doc.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {result.applicableTarget && (
                <div className="mt-2 bg-blue-500/10 rounded-lg p-2">
                  <p className="text-xs text-blue-500">적용 대상: {result.applicableTarget}</p>
                </div>
              )}
            </div>

            {/* 2. 이행기간 + 행정절차 */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">이행기간 및 행정 처리 절차</span>
              </div>
              {/* 날짜 계산 */}
              {result.dates && (
                <div className="bg-muted/30 rounded-lg p-3 mb-3 space-y-1.5">
                  <p className="text-xs text-muted-foreground">📅 검사일: <span className="font-semibold text-foreground">{formatDate(result.base)}</span></p>
                  {result.initialMonths > 0 && (
                    <p className="text-xs text-muted-foreground">⏱ 최초 조건부합격 만료: <span className="font-semibold text-foreground">{formatDate(addMonths(result.base, result.initialMonths))}</span> (+{result.initialMonths}개월)</p>
                  )}
                  <div className="border-t border-border pt-1.5">
                    <p className="text-xs text-muted-foreground">🏁 최종 이행 마감일</p>
                    <p className="text-base font-bold text-primary">{formatDate(result.dates.deadline)}</p>
                    <p className="text-xs text-muted-foreground">검사일로부터 {monthsDiff(result.base, result.dates.deadline)}개월 후</p>
                  </div>
                </div>
              )}
              {!result.dates && (
                <div className="bg-amber-500/10 rounded-lg p-3 mb-3">
                  <p className="text-xs text-amber-500 font-medium">📅 검사일: {formatDate(result.base)}</p>
                  <p className="text-xs text-amber-500 mt-1">이행기간은 상황에 따라 결정됩니다 (아래 절차 참고)</p>
                </div>
              )}
              {/* 행정절차 */}
              <div className="space-y-1.5">
                {result.adminProcess.map((step: string, i: number) => (
                  <p key={i} className="text-xs leading-relaxed text-foreground pl-1">{step}</p>
                ))}
              </div>
            </div>

            {/* 3. 주의사항 */}
            {result.note && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-500">주의사항</span>
                </div>
                <p className="text-xs text-foreground">{result.note}</p>
              </div>
            )}
            {result.warning && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                  <span className="text-xs font-semibold text-destructive">경고</span>
                </div>
                <p className="text-xs text-foreground">{result.warning}</p>
              </div>
            )}

            {/* 4. 판정 결과 (맨 아래) */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-primary">판정 결과 요약</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">적용 검사: <span className="text-foreground font-medium">{result.inspectionType}</span></p>
                <p className="text-xs text-muted-foreground">판정 유형: <span className="text-foreground font-medium">{result.judgment}</span></p>
                <p className="text-xs text-muted-foreground">근거 법령: <span className="text-foreground font-medium">{result.basis}</span></p>
              </div>
            </div>

            {/* 출처 */}
            <p className="text-xs text-muted-foreground text-center pb-4">
              출처: 한국승강기안전공단 검사총괄실 · 검사규정 제13조제3항, 제11조의2·제11조의3 (2026년 개정고시)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function isApartmentType(buildingType: string) {
  return buildingType === "apartment" || buildingType === "collective";
}
