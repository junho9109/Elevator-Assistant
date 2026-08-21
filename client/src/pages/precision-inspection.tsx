import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, ClipboardList, AlertTriangle, CheckCircle2, Info, ListChecks, LayoutGrid, Building2, Building, Settings, Lock, Pencil, X, RotateCcw } from "lucide-react";
import { getGlobalAdminMode, GLOBAL_ADMIN_MODE_EVENT } from "@/lib/super-admin";

// ── 날짜 계산 유틸 ──
function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}
function formatDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일`;
}
function monthsDiff(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}
function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

const ADMIN_PASSWORD = "910919";
const NOTICE_DATE_KEY = "precisionInspectionNoticeDate";

// ══════════════════════════════════════════════════════════════
// 규정 데이터 — 2026년 개정고시 "정밀안전검사 관련 승강기 부품 보완
// 이행기간 연장" 전면 반영 (근거: 「승강기 설치검사 및 안전검사에
// 관한 운영규정」 제11조의2·제11조의3, 검사운영실-5944)
//
// ※ 필요서류 · 업무처리 절차 세부 문구는 원본 고시 문서 확인 후
//   보완이 필요할 수 있습니다.
// ══════════════════════════════════════════════════════════════

// 네 번째 정밀안전검사 시 설치계약 상태별 판정 — 공동주택 계열과
// 일반건축물 계열(단계적 이행) 모두 동일하게 적용됨
const FOURTH_INSPECTION_JUDGMENTS: Record<string, any> = {
  contracted: {
    label: "설치계약 완료 (착수 전)",
    judgment: "조건부 합격 (2개월 부여)",
    extensionMonths: 2,
    requiredDocs: [
      { title: "설치계약서", detail: "부품(장치) 설치 공사 계약 완료를 증빙하는 계약서 제출" },
    ],
    note: "2개월 이내 설치를 완료하지 못하면 불합격으로 판정될 수 있습니다.",
    warning: null,
  },
  in_progress: {
    label: "설치공사 착수 중 (미완료)",
    judgment: "조건부 합격 (2개월 + 추가 2개월, 총 4개월)",
    extensionMonths: 4,
    requiredDocs: [
      { title: "설치계약서", detail: "부품(장치) 설치 공사 계약 완료를 증빙하는 계약서 제출" },
      { title: "공사 진행 확인자료", detail: "착수 중임을 증빙하는 자료 (공정률, 현장사진 등)" },
    ],
    note: "최초 2개월 조건부 합격 후, 착수 중임이 확인되면 추가 2개월(총 4개월)이 부여됩니다.",
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
};

// 1. 공동주택 · 집합건축물 적용현장
const SECTION1: Record<"current" | "amended", any> = {
  current: {
    versionLabel: "현행",
    applicablePeriod: "고시 발령 후 3개월 이전까지 유효",
    requiredDocs: [
      { title: "서면동의서", detail: "입주자 등(구분소유자) 3분의 2 이상 동의" },
    ],
    docsFootnote: "※ 현행 규정으로 이미 3년 연장을 받은 경우, 개정 시행 후 연장조건 서류(설치 이행계획서·안내 경고문 부착 증명자료)를 추가로 제출하지 않아도 됩니다.",
    basis: "검사운영실-5944(2021.12.15.) · 「승강기 설치검사 및 안전검사에 관한 운영규정」 제11조의2",
    processSteps: [
      "① 관리주체: 서면동의서 제출 (입주자 등 3분의 2 이상 동의)",
      "② 검사기관: 네 번째 정밀안전검사 시 조건부 합격(2개월) 부여 후 최종판정",
    ],
    note: "고시 발령 후 3개월 이후에는 설치계약 미계약 시 검사일 판정이 조건부 합격 → 불합격으로 변경됨을 관리주체에게 반드시 안내해야 합니다.",
    warning: null,
  },
  amended: {
    versionLabel: "개정",
    applicablePeriod: "고시 발령 후 3개월 이후 의무 적용",
    requiredDocs: [
      { title: "서면동의서", detail: "입주자 등(구분소유자) 3분의 2 이상 동의" },
      { title: "설치 이행계획서", detail: "이행완료 예정일과 이행계획 상세내용 기재, 대표자 서명 또는 직인 필수" },
      { title: "안내 경고문 부착 증명자료", detail: "승강기 내·외부에 부착한 안내 경고문 증빙자료 제출" },
    ],
    basis: "「승강기 설치검사 및 안전검사에 관한 운영규정」 제11조의2·제11조의3 (2026년 개정고시)",
    note: "검사판정 변경 내용(조건부→불합격 등)이 발생하면 관리주체에게 반드시 안내해야 합니다.",
  },
};

// 2. 단계적 이행기간(1단계·2단계) 적용현장 — 일반건축물
const SECTION2: Record<"current" | "amended", any> = {
  current: {
    versionLabel: "현행",
    applicablePeriod: "고시 발령 전",
    requiredDocs: [
      { title: "단계별 이행계획서 등", detail: "1단계(1년 6개월) → 2단계(1년) 순차 연장" },
    ],
    basis: "검사운영실-5944(2021.12.15.)",
    processSteps: [
      "① 관리주체: 단계별 이행계획서 등 제출",
      "② 검사기관: 1단계(1년 6개월) 부여 후 미조치 시 2단계(1년) 추가 연장",
      "③ 대체 정밀안전검사 시: 미설치 상태면 이행계획의 남은 기간 기준으로 조건부 합격 처리",
    ],
    note: "1, 2단계의 2차례 처리절차는 개정 후 세 번째 정밀안전검사 시 처리하여 네 번째 정밀안전검사로 한 번에 연장하는 방식으로 간소화되었습니다. 고시 시행 전 2단계 연장을 받은 현장은 대체 정밀안전검사 실시 후 네 번째 정밀안전검사도 실시해야 합니다. (2단계 연장 시행 전 현장은 서류 전부 제출 시 대체 정밀안전검사를 정기검사로 진행 가능) 고시 시행 전 현장의 개정 결과처리는 도래하는 검사(확인검사 포함) 결과처리 시 적용됩니다.",
    warning: null,
  },
  amended: {
    versionLabel: "개정",
    applicablePeriod: "고시 발령 후 즉시",
    requiredDocs: [
      { title: "서면동의서", detail: "입주자 등(구분소유자) 3분의 2 이상 동의" },
      { title: "설치 이행계획서", detail: "종전 계획서와 별도로 신규 계획서를 제출받아야 함" },
      { title: "안내 경고문 부착 증명자료", detail: "승강기 내·외부에 부착한 안내 경고문 증빙자료 제출" },
    ],
    basis: "「승강기 설치검사 및 안전검사에 관한 운영규정」 제11조의2·제11조의3 (2026년 개정고시)",
    note: "1, 2단계의 2차례 처리절차를 1차례로 간소화(세 번째 정밀안전검사 시 연장조건 서류 제출 시 합격 처리하여 네 번째 정밀안전검사로 연장합니다.) 고시 시행 전 2단계 연장을 받은 현장은 대체 정밀안전검사 실시 후 네 번째 정밀안전검사도 실시해야 합니다.",
  },
};

// 2-개정 세부상황(단계적 이행기간 진행 중인 현장의 현재 단계)
const SECTION2_DETAIL_SITUATIONS = [
  {
    value: "stage1_before_regular",
    icon: "①",
    title: "1단계 적용 중 — 세 번째 정밀검사 후, 정기검사 전",
    sub: "정기검사 시 처리",
    judgment: "정기검사 시, 공동주택·집합건축물과 동일한 처리절차로 업무처리",
    inspectionType: "정기검사",
    requiredDocs: [
      { title: "서면동의서", detail: "입주자 등(구분소유자) 3분의 2 이상 동의" },
      { title: "설치 이행계획서", detail: "종전 계획서와 별도로 신규 계획서를 제출받아야 함" },
      { title: "안내 경고문 부착 증명자료", detail: "승강기 내·외부에 부착한 안내 경고문 증빙자료 제출" },
    ],
    processSteps: [
      "① 관리주체: 서면동의서 + 설치 이행계획서(신규) + 안내 경고문 부착 증명자료 제출",
      "② 검사기관: 정기검사 시 공동주택·집합건축물 적용현장과 동일한 절차로 처리",
    ],
  },
  {
    value: "stage1_conditional",
    icon: "②",
    title: "1단계 적용 중 — 정기검사 후 조건부 진행 중",
    sub: "조건부 기간 내 처리",
    judgment: "조건부 기간 내 서류 제출 시 조건부 합격",
    inspectionType: "조건부 기간 내",
    requiredDocs: [
      { title: "서면동의서", detail: "입주자 등(구분소유자) 3분의 2 이상 동의" },
      { title: "설치 이행계획서", detail: "종전 계획서와 별도로 신규 계획서를 제출받아야 함" },
      { title: "안내 경고문 부착 증명자료", detail: "승강기 내·외부에 부착한 안내 경고문 증빙자료 제출" },
    ],
    processSteps: [
      "① 관리주체: 조건부 기간 내 서면동의서 + 설치 이행계획서(신규) + 안내 경고문 부착 증명자료 제출",
      "② 검사기관: 서류 확인 후 조건 후 합격 처리",
    ],
  },
  {
    value: "stage2_before_alt",
    icon: "③",
    title: "2단계 적용 중 — 대체 정밀안전검사 실시 전",
    sub: "대체 정밀안전검사 실시 후 처리",
    judgment: "대체 정밀안전검사 실시 후 서류 제출 시 합격 (네 번째 정밀안전검사도 실시)",
    inspectionType: "대체 정밀안전검사",
    requiredDocs: [
      { title: "서면동의서", detail: "입주자 등(구분소유자) 3분의 2 이상 동의" },
      { title: "설치 이행계획서", detail: "종전 계획서와 별도로 신규 계획서를 제출받아야 함" },
      { title: "안내 경고문 부착 증명자료", detail: "승강기 내·외부에 부착한 안내 경고문 증빙자료 제출" },
    ],
    processSteps: [
      "① 검사기관: 안내문 생성 및 발송 완료 (접수완료 포함)",
      "② 검사기관: 대체 정밀안전검사 실시",
      "③ 관리주체: 서면동의서 + 설치 이행계획서(신규) + 안내 경고문 부착 증명자료 제출",
      "④ 검사기관: 서류 확인 후 합격 처리",
      "⑤ 네 번째 정밀안전검사도 실시해야 함",
    ],
  },
  {
    value: "stage2_conditional",
    icon: "④",
    title: "2단계 적용 중 — 대체 정밀안전검사 실시 후 조건부 진행 중",
    sub: "조건부 기간 내 처리",
    judgment: "조건부 기간 내 서류 제출 시 조건부 합격 (네 번째 정밀안전검사도 실시)",
    inspectionType: "조건부 기간 내",
    requiredDocs: [
      { title: "서면동의서", detail: "입주자 등(구분소유자) 3분의 2 이상 동의" },
      { title: "설치 이행계획서", detail: "종전 계획서와 별도로 신규 계획서를 제출받아야 함" },
      { title: "안내 경고문 부착 증명자료", detail: "승강기 내·외부에 부착한 안내 경고문 증빙자료 제출" },
    ],
    processSteps: [
      "① 관리주체: 조건부 기간 내 서면동의서 + 설치 이행계획서(신규) + 안내 경고문 부착 증명자료 제출",
      "② 검사기관: 서류 확인 후 조건부 합격 처리",
      "③ 네 번째 정밀안전검사도 실시해야 함",
    ],
  },
  {
    value: "fourth_inspection",
    icon: "④",
    title: "네 번째 정밀안전검사 판정",
    sub: "설치계약 상태에 따라 판정",
  },
];

function buildFourthResult(status: string, base: Date | null, basis: string, applicablePeriod?: string) {
  const branch = FOURTH_INSPECTION_JUDGMENTS[status];
  const contextNote = "설치검사에 합격한 날부터 24년이 지나 실시하는 네 번째 정밀안전검사 시 부여되는 이행기간입니다.";
  return {
    inspectionType: "네 번째 정밀안전검사",
    judgment: branch.judgment,
    basis,
    applicablePeriod,
    requiredDocs: branch.requiredDocs,
    processSteps: [
      "① 검사기관: 네 번째 정밀안전검사 실시",
      `② 관리주체: 설치계약 상태 확인 — ${branch.label}`,
      `③ 검사기관: ${branch.judgment}`,
    ],
    note: branch.note ? `${contextNote} ${branch.note}` : contextNote,
    warning: branch.warning,
    dates: (base && branch.extensionMonths) ? { deadline: addMonths(base, branch.extensionMonths) } : null,
    base,
  };
}

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
        <span className={`text-sm ${value ? "text-foreground font-medium" : "text-muted-foreground"}`}>{value ? value.replace(/-/g, ". ") : "날짜 선택"}</span>
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

// ── 결과 블록 (공통) ──
function ResultBlock({ result }: { result: any }) {
  return (
    <div className="space-y-3">
      {/* 0. 적용시점 */}
      {result.applicablePeriod && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">적용시점</span>
          <span className="text-xs font-semibold text-foreground">{result.applicablePeriod}</span>
        </div>
      )}

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
        {result.docsFootnote && (
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{result.docsFootnote}</p>
        )}
      </div>

      {/* 2. 업무처리 절차 */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">업무처리 절차</span>
        </div>
        {result.base && result.dates && (
          <div className="bg-muted/30 rounded-lg p-3 mb-3 space-y-1.5">
            <p className="text-xs text-muted-foreground">📅 기준일: <span className="font-semibold text-foreground">{formatDate(result.base)}</span></p>
            <div className="border-t border-border pt-1.5">
              <p className="text-xs text-muted-foreground">🏁 이행(만료) 기한</p>
              <p className="text-base font-bold text-primary">{formatDate(result.dates.deadline)}</p>
              <p className="text-xs text-muted-foreground">기준일로부터 {monthsDiff(result.base, result.dates.deadline)}개월 후</p>
            </div>
          </div>
        )}
        <div className="space-y-1.5">
          {(result.processSteps || []).map((step: string, i: number) => (
            <p key={i} className="text-xs leading-relaxed text-foreground pl-1">{step}</p>
          ))}
        </div>
      </div>

      {/* 3. 비고 */}
      {result.note && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-amber-500">비고</span>
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

      <p className="text-xs text-muted-foreground text-center pb-4">
        출처: 한국승강기안전공단 검사총괄실 · 「승강기 설치검사 및 안전검사에 관한 운영규정」 제11조의2·제11조의3 (2026년 개정고시)
      </p>
    </div>
  );
}

// ── 메인 ──
export default function PrecisionInspectionPage() {
  const [mode, setMode] = useState<"guide" | "card">("guide");
  const [buildingType, setBuildingType] = useState<"" | "apartment" | "general">("");
  const [version, setVersion] = useState<"" | "current" | "amended">("");
  const [inspectionCount, setInspectionCount] = useState("");
  const [section2Situation, setSection2Situation] = useState("");
  const [contractStatus, setContractStatus] = useState("");
  const [cardDate, setCardDate] = useState(""); // 현장진단 모드 전용: 세 번째 정밀안전검사 실시일

  // 관리자 모드(전역 스위치, AI검색 페이지에서 켜고 끔) + 고시 발령일
  const [isAdminMode, setIsAdminMode] = useState(() => getGlobalAdminMode());
  useEffect(() => {
    const handler = (e: Event) => setIsAdminMode((e as CustomEvent<boolean>).detail);
    window.addEventListener(GLOBAL_ADMIN_MODE_EVENT, handler);
    return () => window.removeEventListener(GLOBAL_ADMIN_MODE_EVENT, handler);
  }, []);
  const [showNoticeEditor, setShowNoticeEditor] = useState(false);
  const [noticeDateOverride, setNoticeDateOverride] = useState<string | null>(() => {
    try { return localStorage.getItem(NOTICE_DATE_KEY); } catch { return null; }
  });
  const [noticeDateDraft, setNoticeDateDraft] = useState("");
  const noticeDate = noticeDateOverride || todayStr();

  const saveNoticeDate = (v: string) => {
    try { localStorage.setItem(NOTICE_DATE_KEY, v); } catch {}
    setNoticeDateOverride(v);
    setShowNoticeEditor(false);
  };
  const resetNoticeDate = () => {
    try { localStorage.removeItem(NOTICE_DATE_KEY); } catch {}
    setNoticeDateOverride(null);
    setShowNoticeEditor(false);
  };

  const resetAll = () => {
    setBuildingType(""); setVersion(""); setInspectionCount(""); setSection2Situation("");
    setContractStatus(""); setCardDate("");
  };

  const isSection1 = buildingType === "apartment";
  const isSection2 = buildingType === "general";
  const needsInspectionCount = isSection1 && version === "amended";
  const needsSection2Situation = isSection2 && version === "amended";
  const needsContractStatus =
    (needsInspectionCount && inspectionCount === "fourth") ||
    (needsSection2Situation && section2Situation === "fourth_inspection");

  const selectionsReady =
    !!buildingType && !!version &&
    (!needsInspectionCount || !!inspectionCount) &&
    (!needsSection2Situation || !!section2Situation) &&
    (!needsContractStatus || !!contractStatus);

  // ── 결과 계산 (dateStr === null이면 날짜 없이 안내용 결과) ──
  const getResult = (dateStr: string | null): any => {
    if (!buildingType || !version) return { error: "건축물 유형과 현행/개정 구분을 선택해주세요." };
    const base = dateStr ? new Date(dateStr) : null;
    const sectionData = isSection1 ? SECTION1 : SECTION2;
    const versionData = sectionData[version];

    if (version === "current") {
      return {
        inspectionType: isSection1 ? "네 번째 정밀안전검사" : "2단계 연장 이후 대체 정밀안전검사",
        judgment: isSection1 ? "조건부 합격(2개월) 후 최종판정" : "미설치 시 조건부 합격 (이행계획의 남은 기간 기준 조건부 일자 부여)",
        basis: versionData.basis,
        applicablePeriod: versionData.applicablePeriod,
        requiredDocs: versionData.requiredDocs,
        docsFootnote: versionData.docsFootnote || null,
        processSteps: versionData.processSteps,
        note: versionData.note,
        warning: versionData.warning || null,
        dates: base ? { deadline: addMonths(base, 2) } : null,
        base,
      };
    }

    // 개정
    if (isSection1) {
      if (!inspectionCount) return { error: "검사 회차(세 번째 · 네 번째)를 선택해주세요." };
      if (inspectionCount === "fourth") {
        if (!contractStatus) return { error: "네 번째 정밀안전검사의 설치계약 상태를 선택해주세요." };
        return buildFourthResult(contractStatus, base, versionData.basis, versionData.applicablePeriod);
      }
      return {
        inspectionType: "세 번째 정밀안전검사",
        judgment: "조건부 합격 → 3년 연장 (네 번째 정밀안전검사 시 재판정)",
        basis: versionData.basis,
        applicablePeriod: versionData.applicablePeriod,
        requiredDocs: versionData.requiredDocs,
        processSteps: [
          "① 관리주체: 서면동의서(2/3 이상) + 설치 이행계획서 + 안내 경고문 부착 증명자료 제출",
          "② 검사기관: 동의율 및 서류 검토",
          "③ 검사기관: 조건부 합격 처리 + 세 번째 정밀안전검사일 기준 네 번째 정밀안전검사까지 3년 연장 부여",
        ],
        note: versionData.note,
        warning: null,
        dates: base ? { deadline: addMonths(base, 36) } : null,
        base,
      };
    } else {
      if (!section2Situation) return { error: "현재 진행 상황을 선택해주세요." };
      if (section2Situation === "fourth_inspection") {
        if (!contractStatus) return { error: "네 번째 정밀안전검사의 설치계약 상태를 선택해주세요." };
        return buildFourthResult(contractStatus, base, versionData.basis, versionData.applicablePeriod);
      }
      const sit = SECTION2_DETAIL_SITUATIONS.find(s => s.value === section2Situation);
      if (!sit) return { error: "현재 진행 상황을 다시 선택해주세요." };
      return {
        inspectionType: sit.inspectionType,
        judgment: sit.judgment,
        basis: versionData.basis,
        applicablePeriod: versionData.applicablePeriod,
        requiredDocs: sit.requiredDocs,
        processSteps: sit.processSteps,
        note: versionData.note,
        warning: null,
        dates: null,
        base,
      };
    }
  };

  const guideResult = selectionsReady ? getResult(null) : null;
  const cardResult = (selectionsReady && cardDate) ? getResult(cardDate) : null;

  const versionOptions: { value: "current" | "amended"; label: string; sub: string }[] = isSection1
    ? [
        { value: "current", label: "현행", sub: SECTION1.current.applicablePeriod },
        { value: "amended", label: "개정", sub: SECTION1.amended.applicablePeriod },
      ]
    : [
        { value: "current", label: "현행", sub: SECTION2.current.applicablePeriod },
        { value: "amended", label: "개정", sub: SECTION2.amended.applicablePeriod },
      ];

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="bg-card border-b border-border overflow-hidden sticky top-0 z-10">
        <div className="p-3 bg-muted/30">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                정
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold tracking-tight">정밀안전검사</h1>
                <p className="text-xs text-muted-foreground truncate">부품보완 이행기간 연장 · 필요서류 · 업무처리 안내</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-muted-foreground">고시 발령일</span>
            <span className="text-[11px] font-semibold text-foreground bg-muted rounded-full px-2 py-0.5">{noticeDate}{!noticeDateOverride && " (오늘 날짜 예시)"}</span>
            {isAdminMode && (
              <button
                onClick={() => { setNoticeDateDraft(noticeDate); setShowNoticeEditor(true); }}
                className="text-[11px] text-primary flex items-center gap-0.5"
              >
                <Pencil className="h-3 w-3" />수정
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">

        {/* 모드 전환 탭 */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 bg-muted rounded-xl p-1 flex-1">
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
          <button onClick={resetAll} className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center flex-shrink-0" title="처음부터 다시">
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* 공통사항 배너 */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 space-y-1">
          <p className="text-xs font-semibold text-blue-500 flex items-center gap-1"><Info className="h-3.5 w-3.5"/>공통사항</p>
          <p className="text-xs text-foreground">• 조건부 항목 중 7대(엘리베이터) · 5대(에스컬레이터) 안전장치 보완내용이 조건부항목에 있는 현장에만 해당됩니다.</p>
          <p className="text-xs text-foreground">• 기존 단계적 이행기간 부여(1단계·2단계 업무)는 고시 시행일로 종료되며, 모든 현장의 부품보완 이행기간은 세 번째 이후 네 번째 정밀안전검사까지(3년 연장)로 적용됩니다.</p>
          <p className="text-xs text-muted-foreground">근거: 「승강기 설치검사 및 안전검사에 관한 운영규정」 제11조의2·제11조의3 (2026년 개정고시)</p>
        </div>

        {mode === "guide" && (
        <>
        {/* Step 1: 건축물 유형 */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">1</span>
            <span className="text-sm font-semibold">건축물 유형</span>
          </div>
          <Select value={buildingType} onValueChange={v => { setBuildingType(v as any); setVersion(""); setInspectionCount(""); setSection2Situation(""); setContractStatus(""); }}>
            <SelectTrigger className="text-sm"><SelectValue placeholder="유형을 선택하세요" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">공동주택 · 집합건축물</SelectItem>
              <SelectItem value="general">일반건축물 (단계적 이행기간 적용현장)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Step 2: 현행/개정 */}
        {buildingType && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">2</span>
              <span className="text-sm font-semibold">현행 · 개정 구분</span>
            </div>
            <Select value={version} onValueChange={v => { setVersion(v as any); setInspectionCount(""); setSection2Situation(""); setContractStatus(""); }}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="적용 규정을 선택하세요" /></SelectTrigger>
              <SelectContent>
                {versionOptions.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label} — {o.sub}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Step 3: 검사 회차 (공동주택 · 개정) */}
        {needsInspectionCount && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">3</span>
              <span className="text-sm font-semibold">검사 회차</span>
            </div>
            <Select value={inspectionCount} onValueChange={v => { setInspectionCount(v); setContractStatus(""); }}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="검사 회차 선택" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="third">세 번째 정밀안전검사</SelectItem>
                <SelectItem value="fourth">네 번째 정밀안전검사</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Step 3: 현재 진행 상황 (일반건축물 · 개정) */}
        {needsSection2Situation && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">3</span>
              <span className="text-sm font-semibold">현재 진행 상황</span>
            </div>
            <Select value={section2Situation} onValueChange={v => { setSection2Situation(v); setContractStatus(""); }}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="진행 상황 선택" /></SelectTrigger>
              <SelectContent>
                {SECTION2_DETAIL_SITUATIONS.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.icon} {s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Step 4: 설치계약 상태 (네 번째 정밀안전검사) */}
        {needsContractStatus && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">4</span>
              <span className="text-sm font-semibold">설치계약 상태</span>
            </div>
            <Select value={contractStatus} onValueChange={v => setContractStatus(v)}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="설치계약 상태 선택" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="contracted">설치계약 완료 (착수 전)</SelectItem>
                <SelectItem value="in_progress">설치공사 착수 중 (미완료)</SelectItem>
                <SelectItem value="not_contracted">설치계약 미체결</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {guideResult && !guideResult.error && <ResultBlock result={guideResult} />}
        </>
        )}

        {mode === "card" && (
        <>
        {/* 0. 세 번째 정밀안전검사 실시일 */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">1</span>
            <span className="text-sm font-semibold">세 번째 정밀안전검사 실시일</span>
          </div>
          <DatePicker label="검사일자" value={cardDate} onChange={setCardDate} />
        </div>

        {/* 1. 건축물 유형 카드 */}
        {cardDate && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">2</span>
              <p className="text-xs text-muted-foreground">건축물 유형을 눌러 선택하세요</p>
            </div>
            <button
              onClick={() => { setBuildingType("apartment"); setVersion(""); setInspectionCount(""); setSection2Situation(""); setContractStatus(""); }}
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
              onClick={() => { setBuildingType("general"); setVersion(""); setInspectionCount(""); setSection2Situation(""); setContractStatus(""); }}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${buildingType === "general" ? "border-primary bg-primary/5" : "border-border bg-card"}`}
            >
              <Building className="h-6 w-6 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold">일반건축물</p>
                <p className="text-xs text-muted-foreground mt-0.5">단계적 이행기간(1단계·2단계) 적용현장</p>
              </div>
              {buildingType === "general" && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
            </button>
          </div>
        )}

        {/* 2. 현행/개정 카드 */}
        {cardDate && buildingType && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">3</span>
              <p className="text-xs text-muted-foreground">적용 규정을 눌러 선택하세요</p>
            </div>
            {versionOptions.map(o => (
              <button
                key={o.value}
                onClick={() => { setVersion(o.value); setInspectionCount(""); setSection2Situation(""); setContractStatus(""); }}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${version === o.value ? "border-primary bg-primary/5" : "border-border bg-card"}`}
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold">{o.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{o.sub}</p>
                </div>
                {version === o.value && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
              </button>
            ))}
          </div>
        )}

        {/* 3. 검사 회차 (공동주택 · 개정) */}
        {cardDate && needsInspectionCount && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">4</span>
              <p className="text-xs text-muted-foreground">검사 회차를 눌러 선택하세요</p>
            </div>
            <button
              onClick={() => { setInspectionCount("third"); setContractStatus(""); }}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${inspectionCount === "third" ? "border-primary bg-primary/5" : "border-border bg-card"}`}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold">세 번째 정밀안전검사</p>
                <p className="text-xs text-muted-foreground mt-0.5">부품보완 이행기간 3년 연장 적용</p>
              </div>
              {inspectionCount === "third" && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
            </button>
            <button
              onClick={() => { setInspectionCount("fourth"); setContractStatus(""); }}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${inspectionCount === "fourth" ? "border-primary bg-primary/5" : "border-border bg-card"}`}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold">네 번째 정밀안전검사</p>
                <p className="text-xs text-muted-foreground mt-0.5">설치계약 상태에 따라 판정</p>
              </div>
              {inspectionCount === "fourth" && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
            </button>
          </div>
        )}

        {/* 3. 현재 진행 상황 (일반건축물 · 개정) */}
        {cardDate && needsSection2Situation && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">4</span>
              <p className="text-xs text-muted-foreground">현재 진행 상황을 눌러 선택하세요</p>
            </div>
            {SECTION2_DETAIL_SITUATIONS.map(s => (
              <button
                key={s.value}
                onClick={() => { setSection2Situation(s.value); setContractStatus(""); }}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${section2Situation === s.value ? "border-primary bg-primary/5" : "border-border bg-card"}`}
              >
                <span className="text-lg font-bold text-primary flex-shrink-0 w-5 text-center">{s.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                </div>
                {section2Situation === s.value && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
              </button>
            ))}
          </div>
        )}

        {/* 4. 설치계약 상태 */}
        {cardDate && needsContractStatus && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">5</span>
              <p className="text-xs text-muted-foreground">설치계약 상태를 눌러 선택하세요</p>
            </div>
            {[
              { v: "contracted", l: "설치계약 완료 (착수 전)", sub: "조건부 합격 · 2개월 부여" },
              { v: "in_progress", l: "설치공사 착수 중 (미완료)", sub: "조건부 합격 · 총 4개월 부여" },
              { v: "not_contracted", l: "설치계약 미체결", sub: "불합격" },
            ].map(c => (
              <button
                key={c.v}
                onClick={() => setContractStatus(c.v)}
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

        {cardResult && !cardResult.error && <ResultBlock result={cardResult} />}
        </>
        )}
      </div>

      {/* 고시 발령일 수정 모달 (관리자) */}
      {showNoticeEditor && createPortal(
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowNoticeEditor(false)}>
          <div className="bg-card rounded-2xl p-6 w-full max-w-xs flex flex-col gap-4" onClick={ev => ev.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">고시 발령일 수정</h3>
              <button onClick={() => setShowNoticeEditor(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <p className="text-xs text-muted-foreground">현장진단(승강기번호 조회) 기능에서 검사이력 기준일로 사용될 고시 발령일입니다.</p>
            <input
              type="date" value={noticeDateDraft} onChange={e => setNoticeDateDraft(e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-secondary"
            />
            <div className="flex gap-2">
              <button onClick={resetNoticeDate} className="flex-1 py-2 text-xs border border-border rounded-xl hover:bg-secondary">오늘 날짜로 초기화</button>
              <button onClick={() => noticeDateDraft && saveNoticeDate(noticeDateDraft)} className="flex-1 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl">저장</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
