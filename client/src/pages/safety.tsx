import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X, Calendar, ChevronDown, ChevronUp, Shield, AlertTriangle, ClipboardCheck, Trash2 } from "lucide-react";

type PpeItem = { id: number; name: string; issuedDate: string | null; expiryDate: string | null; standard: string | null; howToWear: string | null; createdAt: string; };
type NearMiss = { id: number; date: string; disasterType: string; workType: string; description: string; imageUrls: string[] | null; createdAt: string; };
type RiskMethod = "checklist" | "freq_severity";
type RiskHazardItem = {
  id: number; method: RiskMethod; workCategory: string; subWork: string | null; content: string;
  discoveryPath: string | null; fieldInfo: string | null; imageUrls: string[] | null; branchId: string;
  registeredById: string; registeredByName: string; createdAt: string;
};
type RiskAssessment = {
  id: number; hazardItemId: number; branchId: string; employeeId: string; employeeName: string;
  level: string | null; hadAccidentExperience: boolean | null; severity: number | null;
  currentSafetyMeasure: string | null; reductionPlan: string | null;
  implementStatus: string | null; implementDate: string | null; implementOwner: string | null; actionResult: string | null;
  createdAt: string; updatedAt: string;
};

function getDaysUntilExpiry(expiryDate: string | null): number {
  if (!expiryDate) return 999;
  return Math.floor((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
}

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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 cursor-pointer hover:border-primary bg-card" onClick={() => setShow(!show)}>
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className={value ? "text-gray-900 text-sm" : "text-gray-400 text-sm"}>{value || "날짜 선택"}</span>
        {value && <button className="ml-auto text-gray-400" onClick={e => { e.stopPropagation(); onChange(""); }}><X className="h-3 w-3" /></button>}
      </div>
      {show && (
        <div className="absolute z-50 mt-1 bg-card border border-border rounded-xl shadow-xl p-4 w-72">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => { if (viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); }} className="p-1 hover:bg-muted rounded">◀</button>
            <span className="font-semibold text-sm">{viewYear}년 {months[viewMonth]}</span>
            <button onClick={() => { if (viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); }} className="p-1 hover:bg-muted rounded">▶</button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">{["일","월","화","수","목","금","토"].map(d=><div key={d}>{d}</div>)}</div>
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

const PPE_DEFAULTS = [
  { name: "안전모", standard: "KS G 6062 / EN 397", howToWear: "1. 머리 크기에 맞게 내피를 조절합니다.\n2. 챙이 앞을 향하도록 착용합니다.\n3. 턱끈을 조여 흔들리지 않도록 합니다.\n4. 충격을 받은 안전모는 즉시 교체합니다." },
  { name: "안전화", standard: "KS F 4412 / S1P 등급 이상", howToWear: "1. 발 사이즈에 맞는 제품을 선택합니다.\n2. 끈을 단단히 묶어 발이 흔들리지 않도록 합니다.\n3. 밑창이 마모된 경우 교체합니다." },
  { name: "안전대(안전벨트)", standard: "KS G 6008 / EN 361", howToWear: "1. 전신하네스 형태로 착용합니다.\n2. 어깨·가슴·허리·다리 버클을 모두 체결합니다.\n3. 랜야드를 앵커포인트에 연결합니다." },
  { name: "안전장갑", standard: "KS G 6006 / EN 388", howToWear: "1. 손 크기에 맞는 제품을 선택합니다.\n2. 손목 부분이 소매 위에 오도록 착용합니다." },
  { name: "방진마스크", standard: "KS G 6056 / 1등급 이상", howToWear: "1. 코와 입을 완전히 덮도록 착용합니다.\n2. 코 부분 철선을 눌러 밀착합니다.\n3. 고무줄을 귀 또는 머리 뒤에 걸어 고정합니다." },
];

const DISASTER_TYPES = ["떨어짐","끼임","부딪힘","감전","넘어짐","맞음","화재/폭발","절단/베임","기타"];
const WORK_TYPES = ["점검","설치","보수","청소","운반","기타"];

const RISK_WORK_CATEGORIES: Record<RiskMethod, string[]> = {
  checklist: ["사무", "출장", "비상상황(화재, 재난 등)"],
  freq_severity: ["엘리베이터", "에스컬레이터", "소형화물용 엘리베이터", "수직형 휠체어리프트", "경사형 휠체어리프트", "기타"],
};
const DISCOVERY_PATHS = ["순회점검", "현장업무", "아차사고", "청취조사", "기타"];
const DEFAULT_BRANCH = "서울강서지사";

const CHECKLIST_LEVEL_INFO: Record<string, string> = {
  "상": "매우 높음(사고 발생 시 사망 또는 90일 이상의 휴업 예상)(허용 불가능)",
  "중": "보통(사고 발생 시 3일 이상 90일 미만의 휴업 예상)(허용 불가능)",
  "하": "매우 낮음(3일 미만의 휴업 또는 작업 수행에 영향을 미치지 않는 부상 또는 질병이 예상되는 위험)(허용 가능)",
};
const SEVERITY_INFO: Record<number, string> = {
  4: "최대(사고 발생 시 사망 또는 90일 이상의 휴업)",
  3: "대(사고 발생 시 3일 이상 90일 미만의 휴업)",
  2: "중(3일 미만의 휴업 또는 작업 수행에 영향을 미치지 않는 부상 또는 질병)",
  1: "소(치료가 필요 없거나, 인적 손실이 없음 ※ 아차사고)",
};

export default function SafetyPage({ org = "", name = "", role = "user" }: { org?: string; name?: string; role?: string }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<"ppe"|"guide"|"nearmiss"|"risk">("ppe");
  // 앱 로그인(소속/이름)을 그대로 재사용 — 별도 로그인 불필요
  const empId = name;
  const empName = name;
  const branchName = org || DEFAULT_BRANCH;
  const ready = !!(org && name);
  const isAdmin = role === "admin";
  const [showAddPPE, setShowAddPPE] = useState(false);
  const [riskMethod, setRiskMethod] = useState<RiskMethod>("checklist");
  const [showAddRisk, setShowAddRisk] = useState(false);
  const [expandedRisk, setExpandedRisk] = useState<number|null>(null);
  const [riskDeleteConfirm, setRiskDeleteConfirm] = useState<number|null>(null);
  const [riskForm, setRiskForm] = useState({ workCategory: RISK_WORK_CATEGORIES.checklist[0], subWork: "", content: "", discoveryPath: DISCOVERY_PATHS[0], fieldInfo: "", images: [] as string[] });
  const [assessForm, setAssessForm] = useState<Record<number, { level: string; hadAccidentExperience: boolean; severity: number; currentSafetyMeasure: string; reductionPlan: string; implementStatus: string; implementDate: string; implementOwner: string }>>({});
  const [selectedDef, setSelectedDef] = useState(PPE_DEFAULTS[0]);
  const [ppeForm, setPpeForm] = useState({ name: PPE_DEFAULTS[0].name, issuedDate: "", expiryDate: "", standard: PPE_DEFAULTS[0].standard, howToWear: PPE_DEFAULTS[0].howToWear });
  const [expandedPPE, setExpandedPPE] = useState<number|null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string|null>(null);
  const [showAddNM, setShowAddNM] = useState(false);
  const [nmForm, setNmForm] = useState({ date:"", disasterType: DISASTER_TYPES[0], workType: WORK_TYPES[0], description:"", images:[] as string[] });
  const [expandedNM, setExpandedNM] = useState<number|null>(null);

  const { data: ppeList = [] } = useQuery<PpeItem[]>({
    queryKey: ["/api/ppe", empId, empName],
    queryFn: async () => {
      const r = await fetch(`/api/ppe?employeeId=${encodeURIComponent(empId)}&employeeName=${encodeURIComponent(empName)}&admin=${isAdmin}`);
      return r.json();
    },
    enabled: ready,
  });
  const { data: nearMisses = [] } = useQuery<NearMiss[]>({ queryKey: ["/api/near-misses"], queryFn: async () => { const r = await fetch("/api/near-misses"); return r.json(); } });

  const { data: riskItems = [] } = useQuery<RiskHazardItem[]>({
    queryKey: ["/api/risk-hazard-items", branchName],
    queryFn: async () => { const r = await fetch(`/api/risk-hazard-items?branchId=${encodeURIComponent(branchName)}`); return r.json(); },
    enabled: ready,
  });
  const { data: riskAssessmentsData = [] } = useQuery<RiskAssessment[]>({
    queryKey: ["/api/risk-assessments", branchName],
    queryFn: async () => { const r = await fetch(`/api/risk-assessments?branchId=${encodeURIComponent(branchName)}`); return r.json(); },
    enabled: ready,
  });

  const createPpe = useMutation({ mutationFn: async (data: any) => { const r = await fetch("/api/ppe", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({...data, employeeId: empId, employeeName: empName}) }); if(!r.ok) throw new Error(); return r.json(); }, onSuccess: () => { qc.invalidateQueries({queryKey:["/api/ppe"]}); toast({title:"보호구가 등록되었습니다."}); setShowAddPPE(false); } });
  const deletePpe = useMutation({ mutationFn: async (id: number) => { await fetch(`/api/ppe/${id}`, {method:"DELETE"}); }, onSuccess: () => { qc.invalidateQueries({queryKey:["/api/ppe"]}); toast({title:"삭제되었습니다."}); } });
  const createNM = useMutation({ mutationFn: async (data: any) => { const r = await fetch("/api/near-misses", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(data) }); if(!r.ok) throw new Error(); return r.json(); }, onSuccess: () => { qc.invalidateQueries({queryKey:["/api/near-misses"]}); toast({title:"아차사고가 등록되었습니다."}); setShowAddNM(false); } });
  const deleteNM = useMutation({ mutationFn: async (id: number) => { await fetch(`/api/near-misses/${id}`, {method:"DELETE"}); }, onSuccess: () => { qc.invalidateQueries({queryKey:["/api/near-misses"]}); toast({title:"삭제되었습니다."}); } });

  const createRiskItem = useMutation({
    mutationFn: async (data: any) => {
      const r = await fetch("/api/risk-hazard-items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error(); return r.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/risk-hazard-items"] }); qc.invalidateQueries({ queryKey: ["/api/risk-branches"] }); toast({ title: "유해위험요인이 등록되었습니다." }); setShowAddRisk(false); },
  });
  const deleteRiskItem = useMutation({
    mutationFn: async (id: number) => { await fetch(`/api/risk-hazard-items/${id}?employeeId=${encodeURIComponent(empId)}&employeeName=${encodeURIComponent(empName)}&admin=${isAdmin}`, { method: "DELETE" }); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/risk-hazard-items"] }); qc.invalidateQueries({ queryKey: ["/api/risk-assessments"] }); toast({ title: "삭제되었습니다." }); setRiskDeleteConfirm(null); },
  });
  const saveAssessment = useMutation({
    mutationFn: async (data: any) => {
      const r = await fetch("/api/risk-assessments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error(); return r.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/risk-assessments"] }); toast({ title: "평가가 저장되었습니다." }); },
  });

  const handleNMImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files||[]);
    if(nmForm.images.length+files.length>5){toast({title:"최대 5장",variant:"destructive"});return;}
    files.forEach(f=>{const r=new FileReader();r.onload=ev=>setNmForm(p=>({...p,images:[...p.images,ev.target?.result as string]}));r.readAsDataURL(f);});
  };

  const handleRiskImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (riskForm.images.length + files.length > 5) { toast({ title: "최대 5장", variant: "destructive" }); return; }
    files.forEach(f => { const r = new FileReader(); r.onload = ev => setRiskForm(p => ({ ...p, images: [...p.images, ev.target?.result as string] })); r.readAsDataURL(f); });
  };

  const riskItemsForMethod = useMemo(() => riskItems.filter(i => i.method === riskMethod), [riskItems, riskMethod]);

  const assessmentsByItem = useMemo(() => {
    const map = new Map<number, RiskAssessment[]>();
    for (const a of riskAssessmentsData) {
      if (!map.has(a.hazardItemId)) map.set(a.hazardItemId, []);
      map.get(a.hazardItemId)!.push(a);
    }
    return map;
  }, [riskAssessmentsData]);

  const myAssessment = (itemId: number) => assessmentsByItem.get(itemId)?.find(a => a.employeeId === empId);

  function computeAggregate(itemId: number, method: RiskMethod) {
    const list = assessmentsByItem.get(itemId) || [];
    if (list.length === 0) return null;
    if (method === "checklist") {
      const counts: Record<string, number> = {};
      list.forEach(a => { if (a.level) counts[a.level] = (counts[a.level] || 0) + 1; });
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      return top ? { level: top[0] } : null;
    }
    const withExp = list.filter(a => a.hadAccidentExperience !== null);
    const withSev = list.filter(a => a.severity != null);
    if (withExp.length === 0 && withSev.length === 0) return null;
    const experienced = withExp.filter(a => a.hadAccidentExperience).length;
    const possibility = withExp.length > 0 ? Math.round((experienced / withExp.length) * 5 * 10) / 10 : 0;
    const avgSeverity = withSev.length > 0 ? Math.round((withSev.reduce((s, a) => s + (a.severity || 0), 0) / withSev.length) * 10) / 10 : 0;
    const risk = Math.round(possibility * avgSeverity * 10) / 10;
    return { possibility, avgSeverity, risk, participants: list.length };
  }

  const sortedRiskItems = useMemo(() => {
    return [...riskItemsForMethod].sort((a, b) => {
      const aMine = myAssessment(a.id) ? 1 : 0;
      const bMine = myAssessment(b.id) ? 1 : 0;
      if (aMine !== bMine) return aMine - bMine; // 미평가(0) 먼저
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [riskItemsForMethod, assessmentsByItem, empId]);

  function getAssessForm(itemId: number) {
    return assessForm[itemId] || { level: "중", hadAccidentExperience: false, severity: 2, currentSafetyMeasure: "", reductionPlan: "", implementStatus: "완료", implementDate: "", implementOwner: "" };
  }
  function setItemAssessForm(itemId: number, patch: Partial<ReturnType<typeof getAssessForm>>) {
    setAssessForm(p => ({ ...p, [itemId]: { ...getAssessForm(itemId), ...p[itemId], ...patch } }));
  }
  function submitAssessment(item: RiskHazardItem) {
    const f = getAssessForm(item.id);
    const payload: any = { hazardItemId: item.id, branchId: branchName, employeeId: empId, employeeName: empName, implementStatus: f.implementStatus, implementDate: f.implementDate || null, implementOwner: f.implementOwner || null };
    if (item.method === "checklist") {
      payload.level = f.level;
      payload.reductionPlan = f.reductionPlan || null;
    } else {
      payload.hadAccidentExperience = f.hadAccidentExperience;
      payload.severity = f.severity;
      payload.currentSafetyMeasure = f.currentSafetyMeasure || null;
      payload.reductionPlan = f.reductionPlan || null;
    }
    saveAssessment.mutate(payload);
  }

  const guides = [
    { id:"cpr", title:"심폐소생술 (CPR)", icon:"❤️", video:"https://www.youtube.com/embed/2ZIdOeTZRMk", content:`【심폐소생술 전 확인사항】

1️⃣ 현장 안전 확인
• 환자에게 접근 전 현장이 안전한지 판단

2️⃣ 반응 확인
• 어깨를 가볍게 두드리며 반응 확인
• 반응 없으면 심정지 의심

3️⃣ 119 신고 + 심장충격기 요청
• 주변인 지목하여 각각 역할 부여
• 혼자라면 스피커폰으로 119 신고 후 즉시 시작

4️⃣ 호흡 확인
• 신고 후 즉시 호흡 체크

【올바른 가슴압박】

• 환자를 편평하고 단단한 바닥에 눕힘
• 가슴뼈 아래쪽 1/2 지점에 손꿈치(손바닥 두툼한 부위) 위치
• 다른 손을 포개고 깍지 → 손꿈치만 닿도록
• 어깨·팔꿈치·손꿈치 수직 유지
• 압박 깊이: 5cm (최대 6cm 초과 금지)
• 압박 후 완전히 힘 빼기
• 속도: 분당 100~120회, 30회 반복

【심장충격기 (AED) 사용법】

• 심장충격기 사용 시 생존율 4배 증가
• 패드 부착: 오른쪽 빗장뼈 아래 + 왼쪽 젖꼭지 아래
• 패드 부착 중에도 가슴압박 중단 금지
• 분석 중 → 모두 환자에게서 떨어지기
• 충전 중에도 가슴압박 계속
• 제세동 후 즉시 가슴압박 재개
• 2분마다 교대하며 구급대원 올 때까지 반복

출처: 보건복지부·질병관리본부·소방청·대한심폐소생협회` },
    { id:"fall", title:"추락 사고 응급처치", icon:"🚨", content:`【추락 사고 처치】\n\n⚠️ 척추 손상 의심 시 절대 이동 금지\n\n1️⃣ 현장 안전 확인 후 119 신고\n2️⃣ 의식·호흡 확인\n3️⃣ 의식 없고 호흡 없으면 → CPR 실시\n4️⃣ 출혈 시 → 깨끗한 천으로 압박지혈\n5️⃣ 골절 의심 시 → 부목으로 고정` },
    { id:"electric", title:"감전 사고 응급처치", icon:"⚡", content:`【감전 사고 처치】\n\n⚠️ 직접 접촉 금지! 2차 감전 위험\n\n1️⃣ 전원 차단 (주개폐기 OFF)\n2️⃣ 119 신고\n3️⃣ 절연 도구로 환자 분리\n4️⃣ 의식·호흡 확인\n5️⃣ 호흡 없으면 → CPR 실시\n6️⃣ 화상 부위 → 냉수로 15~20분 냉각` },
    { id:"cut", title:"절상/열상 응급처치", icon:"🩹", content:`【절상/열상 처치】\n\n1️⃣ 장갑 착용 후 처치\n2️⃣ 깨끗한 천·거즈로 상처 압박\n3️⃣ 5~10분간 지속 압박\n4️⃣ 출혈 심하면 → 심장보다 높이\n5️⃣ 지혈 후 → 소독제 처리\n\n⚠️ 이물질이 박힌 경우 제거하지 말 것` },
    { id:"fire", title:"화재 발생 시 대처", icon:"🔥", content:`【화재 대처】\n\n1️⃣ "불이야!" 외치기\n2️⃣ 119 신고\n3️⃣ 초기 소화 판단\n\n【소화기 PASS】\nP - 안전핀 뽑기\nA - 노즐 불쪽으로\nS - 레버 꽉 쥐기\nS - 빗자루처럼 쓸기\n\n4️⃣ 대피 시 젖은 수건으로 코·입 막기\n5️⃣ 엘리베이터 금지 → 계단 이용` },
  ];

  return (
    <div className="min-h-screen bg-background p-3">
      <div className="w-full">
        <h1 className="text-lg font-bold tracking-tight mb-6 flex items-center gap-2"><Shield className="h-6 w-6 text-blue-600"/>안전보건</h1>
        <div className="flex gap-2 mb-6 bg-card rounded-xl p-1 shadow-sm border border-border">
          {[{key:"ppe",label:"🦺 보호구"},{key:"guide",label:"🩺 응급처치"},{key:"nearmiss",label:"⚠️ 아차사고"},{key:"risk",label:"📋 위험성평가"}].map(tab=>(
            <button key={tab.key} onClick={()=>setActiveTab(tab.key as any)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${activeTab===tab.key?"bg-primary text-primary-foreground":"text-muted-foreground hover:bg-muted"}`}>{tab.label}</button>
          ))}
        </div>

        {(activeTab==="ppe"||activeTab==="risk") && !ready && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-2 text-center">
              <Shield className="h-10 w-10 text-muted-foreground opacity-40 mb-2"/>
              <p className="text-sm text-muted-foreground">소속·이름 정보를 불러오지 못했습니다.</p>
              <p className="text-xs text-muted-foreground">앱을 로그아웃 후 다시 로그인해 주세요.</p>
            </div>
        )}

        {activeTab==="ppe" && ready && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">{isAdmin ? "전체 보호구 목록" : `${empName}님의 보호구`}</p>
              <Button size="sm" onClick={()=>setShowAddPPE(true)}><Plus className="h-4 w-4 mr-1"/>등록</Button>
            </div>
            {ppeList.length===0 && <div className="text-center py-12 text-gray-400"><Shield className="h-12 w-12 mx-auto mb-3 opacity-30"/><p>등록된 보호구가 없습니다.</p></div>}
            {ppeList.map(ppe=>{
              const days=getDaysUntilExpiry(ppe.expiryDate);
              const isExpired=days<0; const isSoon=days<=30;
              return (
                <div key={ppe.id} className={`bg-card rounded-xl shadow-sm border border-border overflow-hidden ${isExpired?"border-red-400":isSoon?"border-orange-400":""}`}>
                  <div className="flex items-center justify-between p-4 cursor-pointer" onClick={()=>setExpandedPPE(expandedPPE===ppe.id?null:ppe.id)}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{ppe.name}</span>
                  {isAdmin && (ppe as any).employeeName && <span className="text-xs text-muted-foreground ml-2">({(ppe as any).employeeName})</span>}
                        {isExpired&&<Badge variant="destructive" className="text-xs">만료됨</Badge>}
                        {!isExpired&&isSoon&&<Badge className="text-xs bg-orange-500">D-{days}</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">지급일: {ppe.issuedDate||"-"} | 만료일: {ppe.expiryDate||"-"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={e=>{e.stopPropagation();deletePpe.mutate(ppe.id);}} className="text-red-400 hover:text-red-600 p-1"><X className="h-4 w-4"/></button>
                      {expandedPPE===ppe.id?<ChevronUp className="h-4 w-4 text-gray-400"/>:<ChevronDown className="h-4 w-4 text-gray-400"/>}
                    </div>
                  </div>
                  {expandedPPE===ppe.id&&(
                    <div className="px-4 pb-4 border-t border-border pt-3 bg-muted/30 space-y-2">
                      <div className="text-sm"><span className="font-medium text-muted-foreground">기준:</span> {ppe.standard}</div>
                      <div className="text-sm"><span className="font-medium text-muted-foreground">착용 방법:</span><p className="whitespace-pre-line mt-1 text-gray-700">{ppe.howToWear}</p></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab==="guide" && (
          <div className="space-y-4">
            {guides.map(g=>(
              <div key={g.id} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer" onClick={()=>setExpandedGuide(expandedGuide===g.id?null:g.id)}>
                  <div className="flex items-center gap-3"><span className="text-2xl">{g.icon}</span><span className="font-semibold">{g.title}</span></div>
                  {expandedGuide===g.id?<ChevronUp className="h-4 w-4 text-gray-400"/>:<ChevronDown className="h-4 w-4 text-gray-400"/>}
                </div>
                {expandedGuide===g.id&&(
                  <div className="border-t bg-gray-50">
                    {(g as any).video && (
                      <div className="px-4 pt-4">
                        <p className="text-xs font-medium text-gray-500 mb-2">📹 교육 영상 (보건복지부·소방청)</p>
                        <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{paddingTop:"56.25%"}}>
                          <iframe
                            src={(g as any).video}
                            className="absolute inset-0 w-full h-full"
                            allow="autoplay"
                            allowFullScreen
                            title="심폐소생술 교육 영상"
                          />
                        </div>
                      </div>
                    )}
                    <div className="px-4 pb-4 pt-3">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{g.content}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab==="nearmiss" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">아차사고를 기록하고 관리합니다.</p>
              <Button size="sm" onClick={()=>setShowAddNM(true)}><Plus className="h-4 w-4 mr-1"/>등록</Button>
            </div>
            {nearMisses.length===0&&<div className="text-center py-12 text-gray-400"><AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-30"/><p>등록된 아차사고가 없습니다.</p></div>}
            {nearMisses.map(nm=>(
              <div key={nm.id} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer" onClick={()=>setExpandedNM(expandedNM===nm.id?null:nm.id)}>
                  <div>
                    <div className="flex items-center gap-2"><Badge variant="outline" className="text-xs">{nm.disasterType}</Badge><Badge variant="outline" className="text-xs">{nm.workType}</Badge></div>
                    <p className="text-sm text-gray-500 mt-1">{nm.date} | {nm.description.slice(0,30)}{nm.description.length>30?"...":""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={e=>{e.stopPropagation();deleteNM.mutate(nm.id);}} className="text-red-400 hover:text-red-600 p-1"><X className="h-4 w-4"/></button>
                    {expandedNM===nm.id?<ChevronUp className="h-4 w-4 text-gray-400"/>:<ChevronDown className="h-4 w-4 text-gray-400"/>}
                  </div>
                </div>
                {expandedNM===nm.id&&(
                  <div className="px-4 pb-4 border-t border-border pt-3 bg-muted/30 space-y-3">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{nm.description}</p>
                    {nm.imageUrls&&nm.imageUrls.length>0&&<div className="grid grid-cols-3 gap-2">{nm.imageUrls.map((img,i)=><img key={i} src={img} alt={`사진 ${i+1}`} className="rounded-lg w-full h-20 object-cover border"/>)}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab==="risk" && ready && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">{branchName} · {empName}님</p>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>setRiskMethod("checklist")} className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-medium border ${riskMethod==="checklist"?"bg-primary text-primary-foreground border-primary":"bg-card text-muted-foreground border-border"}`}>사무 · 체크리스트법</button>
              <button onClick={()=>setRiskMethod("freq_severity")} className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-medium border ${riskMethod==="freq_severity"?"bg-primary text-primary-foreground border-primary":"bg-card text-muted-foreground border-border"}`}>승강기검사 · 빈도강도법</button>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">유해위험요인 {riskItemsForMethod.length}건 · 미평가 {riskItemsForMethod.filter(i=>!myAssessment(i.id)).length}건</p>
              <Button size="sm" onClick={()=>{ setRiskForm({ workCategory: RISK_WORK_CATEGORIES[riskMethod][0], subWork:"", content:"", discoveryPath: DISCOVERY_PATHS[0], fieldInfo:"", images:[] }); setShowAddRisk(true); }}><Plus className="h-4 w-4 mr-1"/>유해위험요인 등록</Button>
            </div>
            {sortedRiskItems.length===0 && <div className="text-center py-12 text-gray-400"><ClipboardCheck className="h-12 w-12 mx-auto mb-3 opacity-30"/><p>등록된 유해위험요인이 없습니다.</p></div>}
            {sortedRiskItems.map(item=>{
              const mine = myAssessment(item.id);
              const agg = computeAggregate(item.id, item.method);
              const f = getAssessForm(item.id);
              const liveAgg = item.method === "freq_severity"
                ? (() => {
                    const list = assessmentsByItem.get(item.id) || [];
                    const others = list.filter(a => a.employeeId !== empId);
                    const expCount = others.filter(a=>a.hadAccidentExperience).length + (f.hadAccidentExperience?1:0);
                    const totalCount = others.length + 1;
                    const possibility = Math.round((expCount/totalCount)*5*10)/10;
                    const sevList = [...others.filter(a=>a.severity!=null).map(a=>a.severity as number), f.severity];
                    const avgSeverity = Math.round((sevList.reduce((s,v)=>s+v,0)/sevList.length)*10)/10;
                    return { possibility, avgSeverity, risk: Math.round(possibility*avgSeverity*10)/10 };
                  })()
                : null;
              return (
                <div key={item.id} className={`bg-card rounded-xl shadow-sm border overflow-hidden ${mine?"border-border":"border-orange-400"}`}>
                  <div className="flex items-center justify-between p-4 cursor-pointer" onClick={()=>setExpandedRisk(expandedRisk===item.id?null:item.id)}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="outline" className="text-xs">{item.workCategory}{item.subWork?` · ${item.subWork}`:""}</Badge>
                        {mine ? (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-green-100 text-green-700">
                            평가완료{item.method==="checklist" ? (mine.level?` · ${mine.level}`:"") : (agg?` · 위험성 ${agg.risk}`:"")}
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-orange-100 text-orange-700">미평가</span>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate">{item.content}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">등록: {item.registeredByName} · {new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {(isAdmin || item.registeredById===empId) && (
                        <button onClick={e=>{e.stopPropagation();setRiskDeleteConfirm(item.id);}} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="h-4 w-4"/></button>
                      )}
                      {expandedRisk===item.id?<ChevronUp className="h-4 w-4 text-gray-400"/>:<ChevronDown className="h-4 w-4 text-gray-400"/>}
                    </div>
                  </div>
                  {expandedRisk===item.id && (
                    <div className="px-4 pb-4 border-t border-border pt-3 bg-muted/30 space-y-3">
                      {item.fieldInfo && <p className="text-xs text-muted-foreground">현장정보: {item.fieldInfo}</p>}
                      {item.imageUrls && item.imageUrls.length>0 && <div className="grid grid-cols-3 gap-2">{item.imageUrls.map((img,i)=><img key={i} src={img} alt="" className="rounded-lg w-full h-20 object-cover border"/>)}</div>}

                      <p className="text-xs font-medium text-muted-foreground pt-1">내 평가 입력 ({empName})</p>

                      {item.method === "checklist" ? (
                        <>
                          <div className="flex gap-2">
                            {["상","중","하"].map(lv=>(
                              <button key={lv} onClick={()=>setItemAssessForm(item.id,{level:lv})} className={`flex-1 text-sm py-2 rounded-lg border ${f.level===lv?(lv==="상"?"bg-red-500 text-white border-red-500":lv==="중"?"bg-orange-500 text-white border-orange-500":"bg-green-600 text-white border-green-600"):"bg-card border-border"}`}>{lv}</button>
                            ))}
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{CHECKLIST_LEVEL_INFO[f.level]}</p>
                          <textarea placeholder="감소대책 (선택)" value={f.reductionPlan} onChange={e=>setItemAssessForm(item.id,{reductionPlan:e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card min-h-[60px]"/>
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-muted-foreground">최근 1년 내 이 위험요인으로 사고(아차사고 포함)를 경험하셨나요?</p>
                          <div className="flex gap-2">
                            <button onClick={()=>setItemAssessForm(item.id,{hadAccidentExperience:true})} className={`flex-1 text-sm py-2 rounded-lg border ${f.hadAccidentExperience?"bg-primary text-primary-foreground border-primary":"bg-card border-border"}`}>예</button>
                            <button onClick={()=>setItemAssessForm(item.id,{hadAccidentExperience:false})} className={`flex-1 text-sm py-2 rounded-lg border ${!f.hadAccidentExperience?"bg-primary text-primary-foreground border-primary":"bg-card border-border"}`}>아니오</button>
                          </div>
                          <p className="text-xs text-muted-foreground">중대성 (1 소 ~ 4 최대)</p>
                          <div className="flex gap-2">
                            {[1,2,3,4].map(s=>(
                              <button key={s} onClick={()=>setItemAssessForm(item.id,{severity:s})} className={`flex-1 text-sm py-2 rounded-lg border ${f.severity===s?"bg-primary text-primary-foreground border-primary":"bg-card border-border"}`}>{s}</button>
                            ))}
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{SEVERITY_INFO[f.severity]}</p>
                          {liveAgg && (
                            <div className="flex items-baseline gap-2 text-xs">
                              <span className="text-muted-foreground">지사 실시간 위험성(가능성{liveAgg.possibility}×중대성{liveAgg.avgSeverity})</span>
                              <span className={`font-semibold ${liveAgg.risk>=9?"text-red-600":"text-green-700"}`}>{liveAgg.risk}</span>
                            </div>
                          )}
                          <textarea placeholder="현재 안전보건조치" value={f.currentSafetyMeasure} onChange={e=>setItemAssessForm(item.id,{currentSafetyMeasure:e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card min-h-[50px]"/>
                          {liveAgg && liveAgg.risk>=9 && (
                            <textarea placeholder="감소대책 (위험성 9 이상 → 작성 필요)" value={f.reductionPlan} onChange={e=>setItemAssessForm(item.id,{reductionPlan:e.target.value})} className="w-full border border-orange-400 rounded-xl px-3 py-2 text-sm bg-card min-h-[60px]"/>
                          )}
                        </>
                      )}
                      <Button className="w-full" size="sm" onClick={()=>submitAssessment(item)} disabled={saveAssessment.isPending}>{saveAssessment.isPending?"저장 중...":"평가 저장"}</Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddPPE&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={()=>setShowAddPPE(false)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-border" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-border"><h2 className="text-xl font-bold">보호구 등록</h2><button onClick={()=>setShowAddPPE(false)} className="text-gray-400"><X className="h-5 w-5"/></button></div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">보호구 선택</label>
                <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50" value={selectedDef.name} onChange={e=>{const d=PPE_DEFAULTS.find(p=>p.name===e.target.value)||PPE_DEFAULTS[0];setSelectedDef(d);setPpeForm(p=>({...p,name:d.name,standard:d.standard,howToWear:d.howToWear}));}}>
                  {PPE_DEFAULTS.map(p=><option key={p.name}>{p.name}</option>)}
                </select>
              </div>
              <DatePicker label="지급일" value={ppeForm.issuedDate} onChange={v=>setPpeForm(p=>({...p,issuedDate:v}))}/>
              <DatePicker label="인증만료일" value={ppeForm.expiryDate} onChange={v=>setPpeForm(p=>({...p,expiryDate:v}))}/>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">기준</label><Input value={ppeForm.standard} onChange={e=>setPpeForm(p=>({...p,standard:e.target.value}))}/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">착용 방법</label><textarea className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-primary/50" value={ppeForm.howToWear} onChange={e=>setPpeForm(p=>({...p,howToWear:e.target.value}))}/></div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={()=>setShowAddPPE(false)}>취소</Button>
                <Button className="flex-1" onClick={()=>createPpe.mutate(ppeForm)} disabled={createPpe.isPending}>{createPpe.isPending?"저장 중...":"저장"}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddNM&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={()=>setShowAddNM(false)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-border" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-border"><h2 className="text-xl font-bold">아차사고 등록</h2><button onClick={()=>setShowAddNM(false)} className="text-gray-400"><X className="h-5 w-5"/></button></div>
            <div className="p-5 space-y-4">
              <DatePicker label="발생일" value={nmForm.date} onChange={v=>setNmForm(p=>({...p,date:v}))}/>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">재해 유형</label><select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50" value={nmForm.disasterType} onChange={e=>setNmForm(p=>({...p,disasterType:e.target.value}))}>{DISASTER_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">작업 유형</label><select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50" value={nmForm.workType} onChange={e=>setNmForm(p=>({...p,workType:e.target.value}))}>{WORK_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">사고 내용 *</label><textarea className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="어떤 상황이었는지 자세히 기술해주세요" value={nmForm.description} onChange={e=>setNmForm(p=>({...p,description:e.target.value}))}/></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사진 첨부 (최대 5장)</label>
                <input type="file" accept="image/*" multiple className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700" onChange={handleNMImage}/>
                {nmForm.images.length>0&&<div className="grid grid-cols-3 gap-2 mt-3">{nmForm.images.map((img,i)=><div key={i} className="relative"><img src={img} alt="" className="w-full h-20 object-cover rounded-lg border"/><button className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs" onClick={()=>setNmForm(p=>({...p,images:p.images.filter((_,idx)=>idx!==i)}))}>×</button></div>)}</div>}
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={()=>setShowAddNM(false)}>취소</Button>
                <Button className="flex-1" onClick={()=>createNM.mutate({...nmForm,imageUrls:nmForm.images.length>0?nmForm.images:null})} disabled={createNM.isPending}>{createNM.isPending?"저장 중...":"저장"}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddRisk&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={()=>setShowAddRisk(false)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-border" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-border"><h2 className="text-xl font-bold">유해위험요인 등록</h2><button onClick={()=>setShowAddRisk(false)} className="text-gray-400"><X className="h-5 w-5"/></button></div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-muted-foreground -mt-2">{riskMethod==="checklist" ? "사무 · 체크리스트법" : "승강기검사 · 빈도강도법"}에 등록됩니다.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">업무 구분</label>
                <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50" value={riskForm.workCategory} onChange={e=>setRiskForm(p=>({...p,workCategory:e.target.value}))}>
                  {RISK_WORK_CATEGORIES[riskMethod].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">세부 업무 (선택)</label><Input value={riskForm.subWork} onChange={e=>setRiskForm(p=>({...p,subWork:e.target.value}))} placeholder="예: 현장 이동, 카 내 검사 등"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">유해위험요인 *</label><textarea className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card min-h-[90px] resize-y focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="어떤 위험이 있는지 구체적으로 기술해주세요" value={riskForm.content} onChange={e=>setRiskForm(p=>({...p,content:e.target.value}))}/></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">발굴 경로</label>
                <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50" value={riskForm.discoveryPath} onChange={e=>setRiskForm(p=>({...p,discoveryPath:e.target.value}))}>
                  {DISCOVERY_PATHS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">현장 추가정보 (선택)</label><Input value={riskForm.fieldInfo} onChange={e=>setRiskForm(p=>({...p,fieldInfo:e.target.value}))} placeholder="예: 승강기 고유번호, 관리번호 등"/></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사진 첨부 (최대 5장)</label>
                <input type="file" accept="image/*" multiple className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700" onChange={handleRiskImage}/>
                {riskForm.images.length>0&&<div className="grid grid-cols-3 gap-2 mt-3">{riskForm.images.map((img,i)=><div key={i} className="relative"><img src={img} alt="" className="w-full h-20 object-cover rounded-lg border"/><button className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs" onClick={()=>setRiskForm(p=>({...p,images:p.images.filter((_,idx)=>idx!==i)}))}>×</button></div>)}</div>}
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={()=>setShowAddRisk(false)}>취소</Button>
                <Button className="flex-1" disabled={!riskForm.content.trim()||createRiskItem.isPending} onClick={()=>createRiskItem.mutate({
                  method: riskMethod,
                  workCategory: riskForm.workCategory,
                  subWork: riskForm.subWork || null,
                  content: riskForm.content,
                  discoveryPath: riskForm.discoveryPath,
                  fieldInfo: riskForm.fieldInfo || null,
                  imageUrls: riskForm.images.length>0 ? riskForm.images : null,
                  branchId: branchName,
                  registeredById: empId,
                  registeredByName: empName,
                })}>{createRiskItem.isPending?"저장 중...":"저장"}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {riskDeleteConfirm!==null&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={()=>setRiskDeleteConfirm(null)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full border border-border p-5" onClick={e=>e.stopPropagation()}>
            <p className="text-sm font-medium mb-1">유해위험요인을 삭제할까요?</p>
            <p className="text-xs text-muted-foreground mb-4">이 항목에 대한 모든 평가 기록도 함께 삭제됩니다.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={()=>setRiskDeleteConfirm(null)}>취소</Button>
              <Button variant="destructive" className="flex-1" onClick={()=>deleteRiskItem.mutate(riskDeleteConfirm)} disabled={deleteRiskItem.isPending}>{deleteRiskItem.isPending?"삭제 중...":"삭제"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
