import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import BYULPYO22 from "@/data/별표22_parsed.json";

type Entry = { text?: string; title?: string; source?: string; };
const dataMap = BYULPYO22 as unknown as Record<string, Entry>;

// ── 트리 구조 ────────────────────────────────────────────
interface Section {
  id: string;
  title: string;
  children: Section[];
  items: string[];
}

function buildTree(): Section[] {
  const keys = Object.keys(dataMap);
  const chapterNums = [...new Set(keys.map(k => k.split('.')[0]))]
    .filter(k => /^\d+$/.test(k))
    .sort((a, b) => Number(a) - Number(b));

  return chapterNums.map(ch => {
    const entry = dataMap[ch];
    const chTitle = entry?.title || entry?.text?.split('\n')[0] || `${ch}장`;

    const sectionKeys = keys
      .filter(k => new RegExp(`^${ch}\\.\\d+$`).test(k))
      .sort((a, b) => Number(a.split('.')[1]) - Number(b.split('.')[1]));

    const sections: Section[] = sectionKeys.map(sec => {
      const subKeys = keys
        .filter(k => new RegExp(`^${sec.replace('.', '\\.')}\\.[^.]+$`).test(k))
        .sort((a, b) => Number(a.split('.').pop()) - Number(b.split('.').pop()!));

      const subSections: Section[] = subKeys.map(sub => ({
        id: sub,
        title: dataMap[sub]?.title || dataMap[sub]?.text?.split('\n')[0] || sub,
        children: [],
        items: keys.filter(k => k.startsWith(sub + '.')),
      }));

      const directItems = keys.filter(k =>
        k.startsWith(sec + '.') &&
        !subKeys.some(sub => k.startsWith(sub + '.')) &&
        !subKeys.includes(k)
      );

      return {
        id: sec,
        title: dataMap[sec]?.title || dataMap[sec]?.text?.split('\n')[0] || sec,
        children: subSections,
        items: directItems,
      };
    });

    return { id: ch, title: chTitle, children: sections, items: [] };
  });
}

// ── 항목 버튼 ────────────────────────────────────────────
function ItemBtn({ id, isActive, onClick }: { id: string; isActive: boolean; onClick: () => void }) {
  const e = dataMap[id];
  const label = (e?.title || e?.text?.split('\n')[0] || id).trim();
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-foreground"
      }`}
    >
      <span className="font-mono text-xs opacity-60 mr-1">[{id}]</span>
      <span>{label.length > 60 ? label.slice(0, 60) + "…" : label}</span>
    </button>
  );
}

// ── 트리 노드 ────────────────────────────────────────────
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
        className={`w-full flex items-center gap-1.5 py-2 pr-3 text-left text-xs rounded-lg transition-colors hover:bg-secondary ${
          isActive || hasDescendant ? "text-primary font-medium" : "text-foreground"
        }`}
        style={{ paddingLeft: pl }}
      >
        {hasChildren
          ? (open ? <ChevronDown size={12} className="shrink-0 opacity-60" /> : <ChevronRight size={12} className="shrink-0 opacity-60" />)
          : <span className="w-3" />}
        <span className="font-mono text-xs text-muted-foreground mr-1 shrink-0">[{sec.id}]</span>
        <span className="truncate">{sec.title}</span>
      </button>
      {open && (
        <div>
          {sec.children.map(c => <TreeNode key={c.id} sec={c} depth={depth + 1} activeKey={activeKey} onSelect={onSelect} />)}
          {sec.items.map(k => (
            <div key={k} style={{ paddingLeft: pl + 12 }} className="pr-2 py-0.5">
              <ItemBtn id={k} isActive={activeKey === k} onClick={() => onSelect(k)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 상세 패널 ────────────────────────────────────────────
function Detail({ id, onClose }: { id: string; onClose: () => void }) {
  const e = dataMap[id];
  if (!e) return null;
  const fullText = e.text || "";
  const firstLine = (e.title || fullText.split('\n')[0] || id).trim();
  const body = fullText.includes('\n') ? fullText.split('\n').slice(1).join('\n').trim() : "";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between px-4 py-3 border-b border-border shrink-0 gap-2">
        <div className="flex-1 min-w-0">
          <span className="font-mono text-xs text-muted-foreground">[{id}]</span>
          <p className="text-sm font-semibold mt-0.5 leading-snug">{firstLine}</p>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-lg shrink-0 mt-0.5">
          <X size={15} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {body ? (
          <div>
            <p className="text-xs font-bold text-muted-foreground tracking-wide mb-2">조문 내용</p>
            <p className="text-xs leading-relaxed whitespace-pre-wrap bg-secondary rounded-lg p-3">{body}</p>
          </div>
        ) : (
          <p className="text-xs leading-relaxed whitespace-pre-wrap bg-secondary rounded-lg p-3">{fullText}</p>
        )}
        <p className="text-xs text-muted-foreground border-t border-border pt-3">
          출처: {e.source || "별표22 엘리베이터 안전기준 (KC2050-51:2022)"}
        </p>
      </div>
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────
export default function InspectionStandardsPage() {
  const tree = useMemo(() => buildTree(), []);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  // AI검색 연동
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

  return (
    <div className="flex flex-col h-full bg-background">
      {/* 헤더 */}
      <div className="px-4 pt-4 pb-3 border-b border-border shrink-0 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold">검사기준</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              별표22 엘리베이터 안전기준 KC2050-51:2022 · {Object.keys(dataMap).length}개 조문
            </p>
          </div>
          <button
            onClick={() => { setShowSearch(s => !s); setQuery(""); setResults([]); }}
            className="p-2 hover:bg-secondary rounded-lg"
          >
            {showSearch ? <X size={18} /> : <Search size={18} />}
          </button>
        </div>
        {showSearch && (
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="조문 내용 검색…"
            className="mt-2 w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        )}
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-hidden flex">
        {/* 좌측: 트리 또는 검색결과 */}
        <div className={`${activeKey ? "hidden md:flex w-72" : "flex-1"} flex-col overflow-y-auto border-r border-border`}>
          {showSearch && results.length > 0 ? (
            <div className="p-2 space-y-1">
              <p className="text-xs text-muted-foreground px-2 py-1">{results.length}건</p>
              {results.map(k => (
                <div key={k} className="px-1">
                  <ItemBtn id={k} isActive={activeKey === k} onClick={() => { setActiveKey(k); setShowSearch(false); setQuery(""); }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {tree.map(ch => <TreeNode key={ch.id} sec={ch} depth={0} activeKey={activeKey} onSelect={setActiveKey} />)}
            </div>
          )}
        </div>

        {/* 우측: 상세 */}
        {activeKey
          ? <div className="flex-1 overflow-hidden"><Detail id={activeKey} onClose={() => setActiveKey(null)} /></div>
          : <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground text-sm">항목을 선택하세요</div>
        }
      </div>
    </div>
  );
}
