import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Search, X, FileCheck, Pencil, Settings, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import BYULPYO22 from "@/data/별표22_parsed.json";

type Entry = { text?: string; title?: string; source?: string; };
const dataMap = BYULPYO22 as unknown as Record<string, Entry>;

// 연도별 데이터 추가 시: YEARS 배열 복원 + dataMap을 연도별로 분기
// 현재는 현행(2022년, KC2050-51:2022) 단일 데이터 사용

interface Section {
  id: string;
  title: string;
  children: Section[];
  items: string[];
}

function buildTree(): Section[] {
  const keys = Object.keys(dataMap);
  const chapterNums = [...new Set(keys.map(k => k.split(".")[0]))]
    .filter(k => /^\d+$/.test(k))
    .sort((a, b) => Number(a) - Number(b));

  return chapterNums.map(ch => {
    const entry = dataMap[ch];
    const chTitle = entry?.title || entry?.text?.split("\n")[0] || `${ch}장`;

    const sectionKeys = keys
      .filter(k => new RegExp(`^${ch}\\.\\d+$`).test(k))
      .sort((a, b) => Number(a.split(".")[1]) - Number(b.split(".")[1]));

    const sections: Section[] = sectionKeys.map(sec => {
      const subKeys = keys
        .filter(k => new RegExp(`^${sec.replace(".", "\\.")}\\.[^.]+$`).test(k))
        .sort((a, b) => Number(a.split(".").pop()) - Number(b.split(".").pop()!));

      const subSections: Section[] = subKeys.map(sub => ({
        id: sub,
        title: dataMap[sub]?.title || dataMap[sub]?.text?.split("\n")[0] || sub,
        children: [],
        items: keys.filter(k => k.startsWith(sub + ".")),
      }));

      const directItems = keys.filter(k =>
        k.startsWith(sec + ".") &&
        !subKeys.some(sub => k.startsWith(sub + ".")) &&
        !subKeys.includes(k)
      );

      return {
        id: sec,
        title: dataMap[sec]?.title || dataMap[sec]?.text?.split("\n")[0] || sec,
        children: subSections,
        items: directItems,
      };
    });

    return { id: ch, title: chTitle, children: sections, items: [] };
  });
}

function ItemBtn({ id, isActive, onClick }: { id: string; isActive: boolean; onClick: () => void }) {
  const e = dataMap[id];
  const label = (e?.title || e?.text?.split("\n")[0] || id).trim();
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 text-left px-3 py-2 transition-colors ${
        isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary text-foreground"
      }`}
    >
      <span className="font-mono text-[10px] text-muted-foreground shrink-0 min-w-[36px]">{id}</span>
      <span className="text-xs leading-relaxed">{label.length > 60 ? label.slice(0, 60) + "…" : label}</span>
    </button>
  );
}

function TreeNode({ sec, depth, activeKey, onSelect }: {
  sec: Section; depth: number; activeKey: string | null; onSelect: (k: string) => void;
}) {
  const isActive = activeKey === sec.id;
  const hasDescendant = activeKey
    ? sec.items.includes(activeKey) || sec.children.some(c => c.id === activeKey || c.items.includes(activeKey))
    : false;
  const [open, setOpen] = useState(hasDescendant || isActive);
  useEffect(() => { if (hasDescendant || isActive) setOpen(true); }, [hasDescendant, isActive]);

  const hasChildren = sec.children.length > 0 || sec.items.length > 0;
  const pl = depth * 12 + 12;

  return (
    <div>
      <button
        onClick={() => { if (hasChildren) { setOpen(o => !o); } else { onSelect(sec.id); } }}
        className={`w-full flex items-center gap-2 py-2.5 pr-3 text-left text-xs leading-relaxed transition-colors hover:bg-secondary ${
          isActive || hasDescendant ? "text-primary font-medium" : "text-foreground"
        }`}
        style={{ paddingLeft: pl }}
      >
        {hasChildren
          ? (open ? <ChevronDown size={12} className="shrink-0 text-muted-foreground" /> : <ChevronRight size={12} className="shrink-0 text-muted-foreground" />)
          : <span className="w-3" />}
        <span className="font-mono text-[10px] text-muted-foreground shrink-0">{sec.id}</span>
        <span className="truncate text-xs leading-relaxed">{sec.title}</span>
      </button>
      {open && (
        <div className="border-l border-border ml-4">
          {sec.children.map(c => <TreeNode key={c.id} sec={c} depth={depth + 1} activeKey={activeKey} onSelect={onSelect} />)}
          {sec.items.map(k => (
            <div key={k} style={{ paddingLeft: (depth + 1) * 12 }}>
              <ItemBtn id={k} isActive={activeKey === k} onClick={() => onSelect(k)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ id, yearStd, onClose, isAdminMode, override, onEdit }: {
  id: string; yearStd: string; onClose: () => void;
  isAdminMode: boolean; override?: any; onEdit: () => void;
}) {
  const e = dataMap[id];
  if (!e) return (
    <div className="flex flex-col flex-1 min-h-0 items-center justify-center gap-3 p-6 text-center">
      <FileCheck size={32} className="opacity-20" />
      <p className="text-xs text-muted-foreground">조문 데이터를 불러올 수 없습니다.</p>
      <p className="font-mono text-[10px] text-muted-foreground">[{id}]</p>
      <button onClick={onClose} className="text-xs text-primary underline">닫기</button>
    </div>
  );
  const displayText = override?.text || e.text || "";
  const firstLine = (e.title || displayText.split("\n")[0] || id).trim();
  const body = displayText.includes("\n") ? displayText.split("\n").slice(1).join("\n").trim() : displayText;
  const displaySource = override?.source || e.source || `별표22 엘리베이터 안전기준 ${yearStd}`;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-start gap-2 px-4 py-3 border-b border-border shrink-0">
        <div className="flex-1 min-w-0">
          <span className="font-mono text-[10px] text-muted-foreground">[{id}]</span>
          {override && <span className="ml-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">수정됨</span>}
          <p className="text-sm font-medium mt-0.5 leading-snug">{firstLine}</p>
        </div>
        {isAdminMode && (
          <button onClick={onEdit} className="w-8 h-8 flex items-center justify-center rounded-lg border border-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 transition-colors shrink-0">
            <Pencil size={13} className="text-amber-600" />
          </button>
        )}
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors shrink-0">
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">조문 내용</p>
          <p className="text-xs leading-relaxed whitespace-pre-wrap bg-muted/40 border border-border rounded-xl p-3">{body || displayText}</p>
        </div>
        <p className="text-xs text-muted-foreground border-t border-border pt-3 leading-relaxed">📌 {displaySource}</p>
      </div>
    </div>
  );
}

export default function InspectionStandardsPage() {
  const tree = useMemo(() => buildTree(), []);
  const totalCount = Object.keys(dataMap).length;

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const CURRENT_STD = "KC2050-51:2022";  // 현행 기준
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editSource, setEditSource] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [showPw, setShowPw] = useState(false);
  const queryClient = useQueryClient();

  const { data: inspOverrides } = useQuery<any[]>({
    queryKey: ["/api/insp-std-overrides"],
    queryFn: () => fetch("/api/insp-std-overrides").then(r => r.json()),
    staleTime: 0,
  });

  const getOverride = (id: string) => inspOverrides?.find((o: any) => o.itemKey === id);

  const handleSaveOverride = async () => {
    if (!editKey) return;
    await fetch(`/api/insp-std-overrides/${encodeURIComponent(editKey)}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editText, source: editSource }),
    });
    queryClient.invalidateQueries({ queryKey: ["/api/insp-std-overrides"] });
    setEditKey(null);
  };

  // AI 검색 연동
  useEffect(() => {
    const check = () => {
      const id = sessionStorage.getItem("pendingInspectionDetail");
      if (!id) return;
      sessionStorage.removeItem("pendingInspectionDetail");
      setActiveKey(id);
    };
    check();
    const h = () => setTimeout(check, 150);
    window.addEventListener("navigatePage", h);
    return () => window.removeEventListener("navigatePage", h);
  }, []);

  // 검색
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const kw = query.toLowerCase();
    setResults(
      Object.entries(dataMap)
        .filter(([, v]) => (v.text || "").toLowerCase().includes(kw))
        .map(([k]) => k)
        .slice(0, 40)
    );
  }, [query]);

  const handleClose = () => {
    setActiveKey(null);
    // 검색 상태 초기화 — 원래 화면(트리)으로 복귀
    setShowSearch(false);
    setQuery("");
    setResults([]);
  };


  return (
    <div className="flex flex-col h-full bg-background">
      {/* 헤더 */}
      <div className="shrink-0 bg-card border-b border-border">
        <div className="p-3 bg-muted/30 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                기
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">검사기준</h1>
                <p className="text-xs text-muted-foreground">{totalCount}개 조문</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isAdminMode ? "default" : "outline"}
                size="icon"
                onClick={() => {
                  if (isAdminMode) { setIsAdminMode(false); }
                  else { setShowPw(true); }
                }}
                className={`shrink-0 shadow-sm hover:shadow-md transition-all ${isAdminMode ? "bg-red-500 hover:bg-red-600" : ""}`}
                title={isAdminMode ? "관리자 모드 종료" : "관리자 모드 진입"}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => { setShowSearch(s => !s); setQuery(""); setResults([]); }}
                className="shrink-0 shadow-sm hover:shadow-md transition-all"
                title={showSearch ? "검색 닫기" : "검색"}
              >
                {showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* 현행 기준 표시 */}
        <div className="flex items-center gap-2 px-4 py-2 border-t border-border">
          <span className="text-xs text-muted-foreground shrink-0">적용 기준</span>
          <span className="text-xs font-medium text-foreground">2022년 현행 ({CURRENT_STD})</span>
        </div>

        {showSearch && (
          <div className="px-3 pb-2 border-t border-border pt-2">
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="조문 내용 검색…"
              className="w-full text-xs bg-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
            />
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-hidden flex min-h-0">
        {/* 좌측: 트리 또는 검색결과 */}
        <div className={`${activeKey ? "hidden md:flex md:w-72" : "flex-1"} flex-col overflow-y-auto border-r border-border`}>
          {showSearch && results.length > 0 ? (
            <div className="p-2">
              <p className="text-xs text-muted-foreground px-2 py-1.5 font-medium">{results.length}건 검색됨</p>
              {results.map(k => (
                <ItemBtn key={k} id={k} isActive={activeKey === k} onClick={() => { setActiveKey(k); setShowSearch(false); setQuery(""); }} />
              ))}
            </div>
          ) : showSearch && query.trim() && results.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground py-12">
              <Search size={32} className="mb-2 opacity-30" />
              <p className="text-xs">검색 결과 없음</p>
            </div>
          ) : (
            <div className="p-2">
              {tree.map(ch => <TreeNode key={ch.id} sec={ch} depth={0} activeKey={activeKey} onSelect={setActiveKey} />)}
            </div>
          )}
        </div>

        {/* 우측: 상세 */}
        {activeKey ? (
          <div className="flex-1 flex flex-col min-h-0">
            <Detail
              id={activeKey}
              yearStd={CURRENT_STD}
              onClose={handleClose}
              isAdminMode={isAdminMode}
              override={getOverride(activeKey)}
              onEdit={() => {
                const ov = getOverride(activeKey);
                const e = dataMap[activeKey];
                setEditText(ov?.text || e?.text || "");
                setEditSource(ov?.source || e?.source || "");
                setEditKey(activeKey);
              }}
            />
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileCheck size={36} className="mx-auto mb-2 opacity-20" />
              <p className="text-xs">항목을 선택하세요</p>
            </div>
          </div>
        )}
      </div>

    {/* 비밀번호 다이얼로그 */}
    {showPw && (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl p-6 w-full max-w-xs flex flex-col gap-4 text-center">
          <Lock size={28} className="mx-auto text-amber-500" />
          <h3 className="text-sm font-medium">수정 권한 확인</h3>
          <p className="text-xs text-muted-foreground">관리자 비밀번호를 입력하세요</p>
          <input
            type="password" value={pwInput} onChange={e => setPwInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") {
              if (pwInput === "910919") { setIsAdminMode(true); setShowPw(false); setPwInput(""); }
              else { alert("비밀번호가 틀렸습니다."); setPwInput(""); }
            }}}
            className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-secondary text-center tracking-widest"
            placeholder="••••••"
          />
          <div className="flex gap-2">
            <button onClick={() => { setShowPw(false); setPwInput(""); }} className="flex-1 py-2 text-sm border border-border rounded-xl hover:bg-secondary">취소</button>
            <button onClick={() => {
              if (pwInput === "910919") { setIsAdminMode(true); setShowPw(false); setPwInput(""); }
              else { alert("비밀번호가 틀렸습니다."); setPwInput(""); }
            }} className="flex-2 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl flex-1">확인</button>
          </div>
        </div>
      </div>
    )}

    {/* 검사기준 수정 모달 */}
    {editKey && (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
        <div className="bg-card w-full rounded-t-2xl p-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center gap-2">
            <Pencil size={15} className="text-amber-500" />
            <span className="text-sm font-medium flex-1">검사기준 수정 [{editKey}]</span>
            <button onClick={() => setEditKey(null)} className="w-7 h-7 flex items-center justify-center border border-border rounded-lg"><X size={13} /></button>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">조문 내용</label>
            <textarea className="w-full border border-border rounded-xl px-3 py-2 text-xs bg-secondary resize-none min-h-[140px]" value={editText} onChange={e => setEditText(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">출처</label>
            <input className="w-full border border-border rounded-xl px-3 py-2 text-xs bg-secondary" value={editSource} onChange={e => setEditSource(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditKey(null)} className="flex-1 py-2 text-sm border border-border rounded-xl">취소</button>
            <button onClick={handleSaveOverride} className="flex-1 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl">DB 저장</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}