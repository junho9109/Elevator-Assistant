import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar, FileText, ClipboardList, AlertTriangle, CheckCircle2, Info } from "lucide-react";

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
const RULES: Record<string, any> = {
  apartment_3year: {
    label: "공동주택·집합건축물 3년 유예",
    inspectionType: "세 번째 정밀안전검사",
    judgment: "조건부합격 → 3년 유예",
    extensionMonths: 36,
    basis: "검사규정 부칙 제3조제3항",
    requiredDocs: [
      { title: "서면동의서", detail: "입주민 2/3 이상 동의 필요" },
      { title: "건축물대장 (표제부)", detail: "건물 개요 확인용" },
      { title: "건축물대장 (전유부)", detail: "전유부분 현황 확인용" },
    ],
    adminProcess: [
      "① 관리주체: 서면동의서(2/3↑) + 건축물대장(표제부·전유부) 제출",
      "② 검사기관: 동의율 확인 및 서류 검토",
      "③ 검사기관: 조건부합격 처리 + 3년 유예 부여",
    ],
    note: "네 번째 정밀안전검사에서는 추가 연장 불가",
    warning: null,
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
    note: "4개월 내 설치 완료 가능한 경우에 한정. 더 긴 연장 필요 시 단계적 이행(1단계)으로 처리",
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
  staged_phase1: {
    label: "단계적 이행 1단계 (1년 6개월)",
    inspectionType: "세 번째 정밀안전검사",
    judgment: "조건부합격 → 1년 6개월 이내 안전/확인검사",
    extensionMonths: 18,
    basis: "검사규정 제13조제3항제2호",
    requiredDocs: [
      { title: "보완연장신청서", detail: "1년6개월 이내 차기 안전/확인검사 시까지 기재" },
      { title: "검사주기 조정신청서", detail: "수시검사 수검분에 해당하는 경우" },
      { title: "이행계획서", detail: "단계별 설치 일정 포함" },
    ],
    adminProcess: [
      "① 최초 검사: 조건부합격 2개월 부여",
      "② 관리주체: 이행계획서 + 보완연장신청서 제출",
      "③ 검사기관: 서류 검토 후 1단계 연장 승인",
      "④ 검사기관: 세 번째 정밀안전검사일 기준 1년6개월 이내 안전/확인검사에서 최종 확인",
    ],
    note: "1단계 만료 후 추가 연장 필요 시 2단계 신청 가능",
    warning: null,
  },
  staged_phase2: {
    label: "단계적 이행 2단계 (추가 6개월~1년)",
    inspectionType: "1단계 완료 후 추가 연장",
    judgment: "조건부합격 → 1단계 만료일 기준 6개월/1년 이내 안전/확인검사",
    extensionMonths: null,
    basis: "검사규정 제13조제3항제2호",
    requiredDocs: [
      { title: "보완연장신청서", detail: "연장기간 기재" },
      { title: "이행계획서", detail: "2단계 설치 일정" },
      { title: "사유별 추가서류", detail: "전체교체: 없음 / 부분교체: 이행확인서 / 재개발재건축: 관리처분계획인가 고시 / 이동편의: 건축물대장 / 이사장 인정: 협의" },
    ],
    adminProcess: [
      "① 관리주체: 1단계 완료 후 2단계 연장 신청",
      "② 검사기관: 사유별 추가서류 검토",
      "③ 검사기관: 1단계 만료일 기준 6개월 또는 1년 이내로 연장 승인",
      "④ 검사기관: 분기별 자체점검 추가 실시 안내",
      "⑤ 차기안전검사 판정 시 전산 정밀체크 필수",
    ],
    note: "차기안전검사 판정 시 전산 정밀체크 필수. 분기별 자체점검 의무",
    warning: null,
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
  const [buildingType, setBuildingType] = useState("");
  const [inspectionCount, setInspectionCount] = useState("");
  const [cycle, setCycle] = useState("");
  const [situation, setSituation] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const isApartment = buildingType === "apartment" || buildingType === "collective";
  const isGeneral = buildingType === "general";

  const calcDeadline = (rule: any, baseDate: Date) => {
    if (!rule.extensionMonths) return null;
    const initial = addMonths(baseDate, rule.initialMonths || 0);
    const deadline = addMonths(baseDate, rule.extensionMonths + (rule.initialMonths || 0));
    return { initial, deadline };
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
    if (isApartment && inspectionCount === "fourth") {
      setError("⚠️ 네 번째 정밀안전검사에서는 추가 연장이 불가능합니다.");
      return;
    }
    const base = new Date(inspectionDate);
    const dates = calcDeadline(rule, base);
    setResult({ ...rule, dates, base });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10">
        <h1 className="text-base font-bold">정밀안전검사 이행기간 안내</h1>
        <p className="text-xs text-muted-foreground mt-0.5">조건부합격 이행기간 연장 · 필요서류 · 행정처리 안내</p>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">

        {/* 공통사항 배너 */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 space-y-1">
          <p className="text-xs font-semibold text-blue-500 flex items-center gap-1"><Info className="h-3.5 w-3.5"/>공통사항</p>
          <p className="text-xs text-foreground">• 검사 시 연장 서류 모두 제출 시 → 최초 2개월 없이 바로 조건부기간 부여 가능</p>
          <p className="text-xs text-foreground">• 승강기민원24 보완연장신청 메뉴 신청 시 → 신청서 추가 불필요</p>
          <p className="text-xs text-muted-foreground">근거: 검사규정 제13조제3항</p>
        </div>

        {/* Step 1: 건축물 유형 */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">1</span>
            <span className="text-sm font-semibold">건축물 유형</span>
          </div>
          <Select value={buildingType} onValueChange={v => { setBuildingType(v); setSituation(""); setResult(null); setError(""); }}>
            <SelectTrigger className="text-sm"><SelectValue placeholder="유형을 선택하세요" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">공동주택 (아파트 등)</SelectItem>
              <SelectItem value="collective">집합건축물 (오피스텔 등)</SelectItem>
              <SelectItem value="general">일반건축물</SelectItem>
            </SelectContent>
          </Select>
          {isApartment && (
            <Select value={inspectionCount} onValueChange={setInspectionCount}>
              <SelectTrigger className="text-sm mt-2"><SelectValue placeholder="검사 회차 선택" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="third">세 번째 정밀안전검사</SelectItem>
                <SelectItem value="fourth">네 번째 정밀안전검사 (추가연장 불가)</SelectItem>
              </SelectContent>
            </Select>
          )}
          {isGeneral && (
            <Select value={cycle} onValueChange={setCycle}>
              <SelectTrigger className="text-sm mt-2"><SelectValue placeholder="검사 주기 선택" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="6m">6개월 주기</SelectItem>
                <SelectItem value="1y">1년 주기</SelectItem>
                <SelectItem value="2y">2년 주기</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Step 2: 연장 사유 */}
        {buildingType && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">2</span>
              <span className="text-sm font-semibold">연장 사유</span>
            </div>
            <Select value={situation} onValueChange={v => { setSituation(v); setResult(null); setError(""); }}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="해당 사유를 선택하세요" /></SelectTrigger>
              <SelectContent>
                {isApartment ? (
                  <SelectItem value="apartment_3year">서면동의서 제출 (2/3 이상 동의 → 3년 유예)</SelectItem>
                ) : (
                  <>
                    <SelectItem value="construction_delay">공사 지연 (부품 설치 공사 중·예정)</SelectItem>
                    <SelectItem value="safety_evaluation">안전성평가 미완료</SelectItem>
                    <SelectItem value="disaster">재난 발생 (작업자 출입 차단)</SelectItem>
                    <SelectItem value="staged_phase1">단계적 이행 1단계 (1년 6개월)</SelectItem>
                    <SelectItem value="staged_phase2">단계적 이행 2단계 (6개월~1년 추가)</SelectItem>
                    <SelectItem value="major_repair">대수선 없이 이행 불가 (적용제외)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Step 3: 검사일자 */}
        {situation && (
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">3</span>
              <span className="text-sm font-semibold">검사일자 입력</span>
            </div>
            <DatePicker label="정밀안전검사 실시일" value={inspectionDate} onChange={setInspectionDate} />
          </div>
        )}

        {/* 계산 버튼 */}
        {situation && inspectionDate && (
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

        {/* 결과 */}
        {result && (
          <div className="space-y-3">

            {/* 판정 요약 카드 */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-primary">판정 결과</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">적용 검사: <span className="text-foreground font-medium">{result.inspectionType}</span></p>
              <p className="text-xs text-muted-foreground mb-3">판정 유형: <span className="text-foreground font-medium">{result.judgment}</span></p>

              {/* 날짜 계산 결과 */}
              {result.dates && (
                <div className="bg-card rounded-xl p-3 space-y-2 border border-border">
                  <p className="text-xs text-muted-foreground">📅 검사일: <span className="font-semibold text-foreground">{formatDate(result.base)}</span></p>
                  {result.initialMonths > 0 && (
                    <p className="text-xs text-muted-foreground">
                      최초 조건부합격: <span className="font-semibold text-foreground">{formatDate(addMonths(result.base, result.initialMonths))}</span>
                      <span className="text-muted-foreground ml-1">({result.initialMonths}개월 후)</span>
                    </p>
                  )}
                  <div className="border-t border-border pt-2">
                    <p className="text-xs text-muted-foreground">최종 이행 마감일</p>
                    <p className="text-lg font-bold text-primary">{formatDate(result.dates.deadline)}</p>
                    <p className="text-xs text-muted-foreground">
                      검사일로부터 {result.extensionMonths + (result.initialMonths||0)}개월 후
                      ({monthsDiff(result.base, result.dates.deadline)}개월)
                    </p>
                  </div>
                </div>
              )}

              {/* 날짜 계산 불가 (재난, 2단계 등) */}
              {!result.dates && (
                <div className="bg-card rounded-xl p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">📅 검사일: <span className="font-semibold text-foreground">{formatDate(result.base)}</span></p>
                  <p className="text-xs text-amber-500 font-medium">이행기간: 상황에 따라 결정 (아래 행정절차 참고)</p>
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-2">근거: {result.basis}</p>
            </div>

            {/* 필요서류 */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">필요 서류</span>
              </div>
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
              {result.applicableTarget && (
                <div className="mt-2 bg-blue-500/10 rounded-lg p-2">
                  <p className="text-xs text-blue-500">적용 대상: {result.applicableTarget}</p>
                </div>
              )}
            </div>

            {/* 행정 처리 절차 */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">행정 처리 절차</span>
              </div>
              <div className="space-y-2">
                {result.adminProcess.map((step: string, i: number) => (
                  <p key={i} className="text-xs leading-relaxed text-foreground pl-1">{step}</p>
                ))}
              </div>
            </div>

            {/* 주의사항 */}
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

            {/* 출처 */}
            <p className="text-[10px] text-muted-foreground text-center pb-4">
              출처: 한국승강기안전공단 검사총괄실 · 검사규정 제13조제3항 (2026.02.27)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
