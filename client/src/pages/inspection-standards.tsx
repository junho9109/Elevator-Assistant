import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronRight, Search, X, FileCheck, Calendar } from "lucide-react";
import BYULPYO22 from "@/data/별표22_parsed.json";

type Entry = { text?: string; title?: string; source?: string; };
const dataMap = BYULPYO22 as unknown as Record<string, Entry>;

const YEARS = [
  { year: "2022", label: "2022년 (현행)", std: "KC2050-51:2022" },
  { year: "2020", label: "2020년", std: "KC2050-51:2020" },
  { year: "2018", label: "2018년", std: "KC2050-51:2018" },
  { year: "2015", label: "2015년", std: "KC2050-51:2015" },
];

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
      <span className="text-xs leading-snug">{label.length > 55 ? label.slice(0, 55) + "…" : label}</span>
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
        onClick={() => { hasChildren ? setOpen(o => !o) : onSelect(sec.id); }}
        className={`w-full flex items-center gap-1.5 py-2 pr-3 text-left text-xs transition-colors hover:bg-secondary ${
          isActive || hasDescendant ? "text-primary font-medium" : "text-foreground"
        }`}
        style={{ paddingLeft: pl }}
      >
        {hasChildren
          ? (open ? <ChevronDown size={12} className="shrink-0 text-muted-foreground" /> : <ChevronRight size={12} className="shrink-0 text-muted-foreground" />)
          : <span className="w-3" />}
        <span className="font-mono text-[10px] text-muted-foreground shrink-0">{sec.id}</span>
        <span className="truncate">{sec.title}</span>
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

function Detail({ id, yearStd, onClose }: { id: string; yearStd: string; onClose: () => void }) {
  const e = dataMap[id];
  if (!e) return null;
  const fullText = e.text || "";
  const firstLine = (e.title || fullText.split("\n")[0] || id).trim();
  const body = fullText.includes("\n") ? fullText.split("\n").slice(1).join("\n").trim() : "";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start gap-2 px-4 py-3 border-b border-border shrink-0">
        <div className="flex-1 min-w-0">
          <span className="font-mono text-[10px] text-muted-foreground">[{id}]</span>
          <p className="text-sm font-medium mt-0.5 leading-snug">{firstLine}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors shrink-0"
        >
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {body ? (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">조문 내용</p>
            <p className="text-xs leading-relaxed whitespace-pre-wrap bg-secondary rounded-lg p-3">{body}</p>
          </div>
        ) : (
          <p className="text-xs leading-relaxed whitespace-pre-wrap bg-secondary rounded-lg p-3">{fullText}</p>
        )}
        <p className="text-xs text-muted-foreground border-t border-border pt-3">
          출처: {e.source || `별표22 엘리베이터 안전기준 ${yearStd}`}
        </p>
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
  const [yearOpen, setYearOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);

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

  const handleYearSelect = (yr: typeof YEARS[0]) => {
    setSelectedYear(yr);
    setYearOpen(false);
    // 연도 변경 시 선택 초기화
    setActiveKey(null);
    setQuery("");
    setResults([]);
    setShowSearch(false);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* 헤더 */}
      <div className="shrink-0 bg-card border-b border-border">
        <div className="flex items-center gap-2 px-4 pt-4 pb-3">
          <FileCheck size={18} className="text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-medium leading-tight">검사기준</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{totalCount}개 조문</p>
          </div>
          <button
            onClick={() => { setShowSearch(s => !s); setQuery(""); setResults([]); setYearOpen(false); }}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            {showSearch ? <X size={15} /> : <Search size={15} />}
          </button>
        </div>

        {/* 연도 선택 드롭다운 */}
        <button
          onClick={() => { setYearOpen(o => !o); setShowSearch(false); }}
          className="w-full flex items-center gap-2 px-4 py-2.5 border-t border-border hover:bg-secondary transition-colors"
        >
          <Calendar size={14} className="text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">적용 연도</span>
          <span className="text-xs font-medium text-foreground flex-1 text-left">{selectedYear.label}</span>
          <span className="text-xs text-muted-foreground">{selectedYear.std}</span>
          <ChevronDown size={13} className={`text-muted-foreground transition-transform shrink-0 ${yearOpen ? "rotate-180" : ""}`} />
        </button>

        {yearOpen && (
          <div className="border-t border-border">
            {YEARS.map(yr => (
              <button
                key={yr.year}
                onClick={() => handleYearSelect(yr)}
                className={`w-full flex items-center justify-between px-6 py-2.5 text-left transition-colors border-b border-border last:border-0 ${
                  selectedYear.year === yr.year ? "bg-primary/10" : "hover:bg-secondary"
                }`}
              >
                <div>
                  <span className={`text-xs font-medium ${selectedYear.year === yr.year ? "text-primary" : "text-foreground"}`}>
                    {yr.label}
                  </span>
                  <span className={`text-xs ml-2 ${selectedYear.year === yr.year ? "text-primary/70" : "text-muted-foreground"}`}>
                    {yr.std}
                  </span>
                </div>
                {selectedYear.year === yr.year && (
                  <span className="text-primary text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        )}

        {showSearch && (
          <div className="px-3 pb-2 border-t border-border pt-2">
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="조문 내용 검색…"
              className="w-full text-xs bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-hidden flex">
        {/* 좌측: 트리 또는 검색결과 */}
        <div className={`${activeKey ? "hidden md:flex md:w-72" : "flex-1"} flex-col overflow-y-auto border-r border-border`}>
          {showSearch && results.length > 0 ? (
            <div className="p-2">
              <p className="text-xs text-muted-foreground px-2 py-1.5">{results.length}건 검색됨</p>
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
            <div className="p-1.5">
              {tree.map(ch => <TreeNode key={ch.id} sec={ch} depth={0} activeKey={activeKey} onSelect={setActiveKey} />)}
            </div>
          )}
        </div>

        {/* 우측: 상세 */}
        {activeKey ? (
          <div className="flex-1 overflow-hidden">
            <Detail id={activeKey} yearStd={selectedYear.std} onClose={handleClose} />
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
    </div>
  );
}
