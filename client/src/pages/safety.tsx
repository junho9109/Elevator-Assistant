import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X, Calendar, ChevronDown, ChevronUp, Shield, AlertTriangle } from "lucide-react";

type PpeItem = { id: number; name: string; issuedDate: string | null; expiryDate: string | null; standard: string | null; howToWear: string | null; createdAt: string; };
type NearMiss = { id: number; date: string; disasterType: string; workType: string; description: string; imageUrls: string[] | null; createdAt: string; };

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
      <div className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:border-blue-400 bg-white" onClick={() => setShow(!show)}>
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className={value ? "text-gray-900 text-sm" : "text-gray-400 text-sm"}>{value || "날짜 선택"}</span>
        {value && <button className="ml-auto text-gray-400" onClick={e => { e.stopPropagation(); onChange(""); }}><X className="h-3 w-3" /></button>}
      </div>
      {show && (
        <div className="absolute z-50 mt-1 bg-white border rounded-xl shadow-xl p-4 w-72">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => { if (viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); }} className="p-1 hover:bg-gray-100 rounded">◀</button>
            <span className="font-semibold text-sm">{viewYear}년 {months[viewMonth]}</span>
            <button onClick={() => { if (viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); }} className="p-1 hover:bg-gray-100 rounded">▶</button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">{["일","월","화","수","목","금","토"].map(d=><div key={d}>{d}</div>)}</div>
          <div className="grid grid-cols-7 text-center text-sm">
            {blanks.map(i=><div key={`b${i}`}/>)}
            {days.map(day=>{
              const dateStr=`${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              return <button key={day} onClick={()=>selectDay(day)} className={`p-1 rounded-full hover:bg-blue-100 ${value===dateStr?"bg-blue-500 text-white":""}`}>{day}</button>;
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

export default function SafetyPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<"ppe"|"guide"|"nearmiss">("ppe");
  const [showAddPPE, setShowAddPPE] = useState(false);
  const [selectedDef, setSelectedDef] = useState(PPE_DEFAULTS[0]);
  const [ppeForm, setPpeForm] = useState({ name: PPE_DEFAULTS[0].name, issuedDate: "", expiryDate: "", standard: PPE_DEFAULTS[0].standard, howToWear: PPE_DEFAULTS[0].howToWear });
  const [expandedPPE, setExpandedPPE] = useState<number|null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string|null>(null);
  const [showAddNM, setShowAddNM] = useState(false);
  const [nmForm, setNmForm] = useState({ date:"", disasterType: DISASTER_TYPES[0], workType: WORK_TYPES[0], description:"", images:[] as string[] });
  const [expandedNM, setExpandedNM] = useState<number|null>(null);

  const { data: ppeList = [] } = useQuery<PpeItem[]>({ queryKey: ["/api/ppe"], queryFn: async () => { const r = await fetch("/api/ppe"); return r.json(); } });
  const { data: nearMisses = [] } = useQuery<NearMiss[]>({ queryKey: ["/api/near-misses"], queryFn: async () => { const r = await fetch("/api/near-misses"); return r.json(); } });

  const createPpe = useMutation({ mutationFn: async (data: any) => { const r = await fetch("/api/ppe", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(data) }); if(!r.ok) throw new Error(); return r.json(); }, onSuccess: () => { qc.invalidateQueries({queryKey:["/api/ppe"]}); toast({title:"보호구가 등록되었습니다."}); setShowAddPPE(false); } });
  const deletePpe = useMutation({ mutationFn: async (id: number) => { await fetch(`/api/ppe/${id}`, {method:"DELETE"}); }, onSuccess: () => { qc.invalidateQueries({queryKey:["/api/ppe"]}); toast({title:"삭제되었습니다."}); } });
  const createNM = useMutation({ mutationFn: async (data: any) => { const r = await fetch("/api/near-misses", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(data) }); if(!r.ok) throw new Error(); return r.json(); }, onSuccess: () => { qc.invalidateQueries({queryKey:["/api/near-misses"]}); toast({title:"아차사고가 등록되었습니다."}); setShowAddNM(false); } });
  const deleteNM = useMutation({ mutationFn: async (id: number) => { await fetch(`/api/near-misses/${id}`, {method:"DELETE"}); }, onSuccess: () => { qc.invalidateQueries({queryKey:["/api/near-misses"]}); toast({title:"삭제되었습니다."}); } });

  const handleNMImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files||[]);
    if(nmForm.images.length+files.length>5){toast({title:"최대 5장",variant:"destructive"});return;}
    files.forEach(f=>{const r=new FileReader();r.onload=ev=>setNmForm(p=>({...p,images:[...p.images,ev.target?.result as string]}));r.readAsDataURL(f);});
  };

  const guides = [
    { id:"cpr", title:"심폐소생술 (CPR)", icon:"❤️", content:`【성인 CPR 순서】\n\n1️⃣ 반응 확인\n• 어깨를 두드리며 "괜찮으세요?" 확인\n• 반응 없으면 즉시 119 신고\n\n2️⃣ 기도 확보\n• 머리를 뒤로 젖히고 턱을 들어올림\n\n3️⃣ 가슴압박 30회\n• 양손을 겹쳐 가슴 중앙에 위치\n• 압박 깊이: 5~6cm\n• 속도: 분당 100~120회\n\n4️⃣ 인공호흡 2회\n• 코를 막고 입을 완전히 덮어 1초간\n\n5️⃣ 30:2 비율로 반복` },
    { id:"fall", title:"추락 사고 응급처치", icon:"🚨", content:`【추락 사고 처치】\n\n⚠️ 척추 손상 의심 시 절대 이동 금지\n\n1️⃣ 현장 안전 확인 후 119 신고\n2️⃣ 의식·호흡 확인\n3️⃣ 의식 없고 호흡 없으면 → CPR 실시\n4️⃣ 출혈 시 → 깨끗한 천으로 압박지혈\n5️⃣ 골절 의심 시 → 부목으로 고정` },
    { id:"electric", title:"감전 사고 응급처치", icon:"⚡", content:`【감전 사고 처치】\n\n⚠️ 직접 접촉 금지! 2차 감전 위험\n\n1️⃣ 전원 차단 (주개폐기 OFF)\n2️⃣ 119 신고\n3️⃣ 절연 도구로 환자 분리\n4️⃣ 의식·호흡 확인\n5️⃣ 호흡 없으면 → CPR 실시\n6️⃣ 화상 부위 → 냉수로 15~20분 냉각` },
    { id:"cut", title:"절상/열상 응급처치", icon:"🩹", content:`【절상/열상 처치】\n\n1️⃣ 장갑 착용 후 처치\n2️⃣ 깨끗한 천·거즈로 상처 압박\n3️⃣ 5~10분간 지속 압박\n4️⃣ 출혈 심하면 → 심장보다 높이\n5️⃣ 지혈 후 → 소독제 처리\n\n⚠️ 이물질이 박힌 경우 제거하지 말 것` },
    { id:"fire", title:"화재 발생 시 대처", icon:"🔥", content:`【화재 대처】\n\n1️⃣ "불이야!" 외치기\n2️⃣ 119 신고\n3️⃣ 초기 소화 판단\n\n【소화기 PASS】\nP - 안전핀 뽑기\nA - 노즐 불쪽으로\nS - 레버 꽉 쥐기\nS - 빗자루처럼 쓸기\n\n4️⃣ 대피 시 젖은 수건으로 코·입 막기\n5️⃣ 엘리베이터 금지 → 계단 이용` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Shield className="h-6 w-6 text-blue-600"/>안전보건관리</h1>
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow border">
          {[{key:"ppe",label:"🦺 보호구"},{key:"guide",label:"🩺 응급처치"},{key:"nearmiss",label:"⚠️ 아차사고"}].map(tab=>(
            <button key={tab.key} onClick={()=>setActiveTab(tab.key as any)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${activeTab===tab.key?"bg-blue-600 text-white":"text-gray-600 hover:bg-gray-100"}`}>{tab.label}</button>
          ))}
        </div>

        {activeTab==="ppe" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">보호구 지급일 및 인증만료일을 관리합니다.</p>
              <Button size="sm" onClick={()=>setShowAddPPE(true)}><Plus className="h-4 w-4 mr-1"/>등록</Button>
            </div>
            {ppeList.length===0 && <div className="text-center py-12 text-gray-400"><Shield className="h-12 w-12 mx-auto mb-3 opacity-30"/><p>등록된 보호구가 없습니다.</p></div>}
            {ppeList.map(ppe=>{
              const days=getDaysUntilExpiry(ppe.expiryDate);
              const isExpired=days<0; const isSoon=days<=30;
              return (
                <div key={ppe.id} className={`bg-white rounded-xl shadow border overflow-hidden ${isExpired?"border-red-400":isSoon?"border-orange-400":""}`}>
                  <div className="flex items-center justify-between p-4 cursor-pointer" onClick={()=>setExpandedPPE(expandedPPE===ppe.id?null:ppe.id)}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{ppe.name}</span>
                        {isExpired&&<Badge variant="destructive" className="text-xs">만료됨</Badge>}
                        {!isExpired&&isSoon&&<Badge className="text-xs bg-orange-500">D-{days}</Badge>}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">지급일: {ppe.issuedDate||"-"} | 만료일: {ppe.expiryDate||"-"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={e=>{e.stopPropagation();deletePpe.mutate(ppe.id);}} className="text-red-400 hover:text-red-600 p-1"><X className="h-4 w-4"/></button>
                      {expandedPPE===ppe.id?<ChevronUp className="h-4 w-4 text-gray-400"/>:<ChevronDown className="h-4 w-4 text-gray-400"/>}
                    </div>
                  </div>
                  {expandedPPE===ppe.id&&(
                    <div className="px-4 pb-4 border-t pt-3 bg-gray-50 space-y-2">
                      <div className="text-sm"><span className="font-medium text-gray-600">기준:</span> {ppe.standard}</div>
                      <div className="text-sm"><span className="font-medium text-gray-600">착용 방법:</span><p className="whitespace-pre-line mt-1 text-gray-700">{ppe.howToWear}</p></div>
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
              <div key={g.id} className="bg-white rounded-xl shadow border overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer" onClick={()=>setExpandedGuide(expandedGuide===g.id?null:g.id)}>
                  <div className="flex items-center gap-3"><span className="text-2xl">{g.icon}</span><span className="font-semibold">{g.title}</span></div>
                  {expandedGuide===g.id?<ChevronUp className="h-4 w-4 text-gray-400"/>:<ChevronDown className="h-4 w-4 text-gray-400"/>}
                </div>
                {expandedGuide===g.id&&<div className="px-4 pb-4 border-t pt-3 bg-gray-50"><pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{g.content}</pre></div>}
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
              <div key={nm.id} className="bg-white rounded-xl shadow border overflow-hidden">
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
                  <div className="px-4 pb-4 border-t pt-3 bg-gray-50 space-y-3">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{nm.description}</p>
                    {nm.imageUrls&&nm.imageUrls.length>0&&<div className="grid grid-cols-3 gap-2">{nm.imageUrls.map((img,i)=><img key={i} src={img} alt={`사진 ${i+1}`} className="rounded-lg w-full h-20 object-cover border"/>)}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddPPE&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={()=>setShowAddPPE(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b"><h2 className="text-xl font-bold">보호구 등록</h2><button onClick={()=>setShowAddPPE(false)} className="text-gray-400"><X className="h-5 w-5"/></button></div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">보호구 선택</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm" value={selectedDef.name} onChange={e=>{const d=PPE_DEFAULTS.find(p=>p.name===e.target.value)||PPE_DEFAULTS[0];setSelectedDef(d);setPpeForm(p=>({...p,name:d.name,standard:d.standard,howToWear:d.howToWear}));}}>
                  {PPE_DEFAULTS.map(p=><option key={p.name}>{p.name}</option>)}
                </select>
              </div>
              <DatePicker label="지급일" value={ppeForm.issuedDate} onChange={v=>setPpeForm(p=>({...p,issuedDate:v}))}/>
              <DatePicker label="인증만료일" value={ppeForm.expiryDate} onChange={v=>setPpeForm(p=>({...p,expiryDate:v}))}/>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">기준</label><Input value={ppeForm.standard} onChange={e=>setPpeForm(p=>({...p,standard:e.target.value}))}/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">착용 방법</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm min-h-[100px] resize-y" value={ppeForm.howToWear} onChange={e=>setPpeForm(p=>({...p,howToWear:e.target.value}))}/></div>
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
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b"><h2 className="text-xl font-bold">아차사고 등록</h2><button onClick={()=>setShowAddNM(false)} className="text-gray-400"><X className="h-5 w-5"/></button></div>
            <div className="p-6 space-y-4">
              <DatePicker label="발생일" value={nmForm.date} onChange={v=>setNmForm(p=>({...p,date:v}))}/>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">재해 유형</label><select className="w-full border rounded-lg px-3 py-2 text-sm" value={nmForm.disasterType} onChange={e=>setNmForm(p=>({...p,disasterType:e.target.value}))}>{DISASTER_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">작업 유형</label><select className="w-full border rounded-lg px-3 py-2 text-sm" value={nmForm.workType} onChange={e=>setNmForm(p=>({...p,workType:e.target.value}))}>{WORK_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">사고 내용 *</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm min-h-[100px] resize-y" placeholder="어떤 상황이었는지 자세히 기술해주세요" value={nmForm.description} onChange={e=>setNmForm(p=>({...p,description:e.target.value}))}/></div>
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
    </div>
  );
}
