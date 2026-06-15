import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import INSPECTION_CONTENT from "@/data/inspection-content.json";
import BYULPYO22 from "@/data/별표22_parsed.json";

type ContentEntry = {
  text?: string;
  title?: string;
  effectiveDate?: string;
  source?: string;
  introductionType?: string;
  revisions?: { effectiveDate: string | null; expiryDate: string | null; description: string; source?: string[] }[];
};

const contentMap = INSPECTION_CONTENT as unknown as Record<string, ContentEntry>;
const byulpyo22Map = BYULPYO22 as unknown as Record<string, ContentEntry>;

// ── 섹션 트리 생성 ──────────────────────────────────────
interface Section {
  id: string;
  title: string;
  children: Section[];
  items: string[]; // 직접 항목 키 (x.y.z-가 형태)
}

function buildTree(): Section[] {
  const keys = Object.keys(contentMap);
  const chapterNums = [...new Set(
    keys.map(k => k.split(/[.\-]/)[0])
  )].filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));

  return chapterNums.map(ch => {
    // 섹션 (ch.x)
    const sectionKeys = keys.filter(k => new RegExp(`^${ch}\\.\\d+$`).test(k));
    const sections: Section[] = sectionKeys
      .sort((a, b) => {
        const [, sa] = a.split('.'); const [, sb] = b.split('.');
        return Number(sa) - Number(sb);
      })
      .map(sec => {
        // 항목 (ch.x.y 이하 또는 ch.x-가나다)
        const itemKeys = keys.filter(k =>
          k !== sec &&
          (k.startsWith(sec + '.') || k.startsWith(sec + '-'))
        );
        // 하위 섹션 (ch.x.y)
        const subSecKeys = keys.filter(k =>
          new RegExp(`^${sec.replace('.', '\\.')}\\.[^.\-]+$`).test(k) &&
          k !== sec
        );
        const subSections: Section[] = subSecKeys.map(sub => ({
          id: sub,
          title: contentMap[sub]?.text?.split('\n')[0]?.trim() || sub,
          children: [],
          items: keys.filter(k => k.startsWith(sub + '-') || k.startsWith(sub + '.')).filter(k => k !== sub),
        }));
        const directItems = itemKeys.filter(k =>
          !subSecKeys.some(sub => k.startsWith(sub))
        );
        return {
          id: sec,
          title: contentMap[sec]?.text?.split('\n')[0]?.trim() || sec,
          children: subSections,
          items: directItems,
        };
      });

    const chapterTitle = contentMap[ch]?.text?.split('\n')[0]?.trim() || `${ch}장`;
    return {
      id: ch,
      title: chapterTitle,
      children: sections,
      items: [],
    };
  });
}

// ── 별표22 트리 생성 ─────────────────────────────────────
function buildByulpyo22Tree(): Section[] {
  const keys = Object.keys(byulpyo22Map);
  const chapterNums = [...new Set(
    keys.map(k => k.split('.')[0])
  )].filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));

  return chapterNums.map(ch => {
    const entry = byulpyo22Map[ch];
    const chTitle = entry?.title || entry?.text?.split('\n')[0] || `${ch}장`;
    const sectionKeys = keys
      .filter(k => new RegExp(`^${ch}\\.\\d+$`).test(k))
      .sort((a, b) => {
        const na = Number(a.split('.')[1]);
        const nb = Number(b.split('.')[1]);
        return na - nb;
      });

    const sections: Section[] = sectionKeys.map(sec => {
      const subKeys = keys.filter(k =>
        new RegExp(`^${sec.replace('.', '\\.')}\\.[^.]+$`).test(k)
      ).sort((a, b) => {
        const na = Number(a.split('.').slice(-1)[0]);
        const nb = Number(b.split('.').slice(-1)[0]);
        return na - nb;
      });
      const subSections: Section[] = subKeys.map(sub => ({
        id: sub,
        title: byulpyo22Map[sub]?.title || byulpyo22Map[sub]?.text?.split('\n')[0] || sub,
        children: [],
        items: keys.filter(k => k.startsWith(sub + '.')),
      }));
      const directItems = keys.filter(k =>
        k.startsWith(sec + '.') && !subKeys.some(sub => k.startsWith(sub + '.')) && !subKeys.includes(k)
      );
      return {
        id: sec,
        title: byulpyo22Map[sec]?.title || byulpyo22Map[sec]?.text?.split('\n')[0] || sec,
        children: subSections,
        items: directItems,
      };
    });

    return {
      id: ch,
      title: chTitle,
      children: sections,
      items: [],
    };
  });
}

// ── 별표22 항목 카드 ─────────────────────────────────────
function Byulpyo22Card({ itemKey, isActive, onClick }: { itemKey: string; isActive: boolean; onClick: () => void }) {
  const entry = byulpyo22Map[itemKey];
  const text = entry?.text || "";
  const firstLine = (entry?.title || text.split('\n')[0] || itemKey).trim();
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-foreground"
      }`}
    >
      <span className="font-mono text-[10px] opacity-60 mr-1">[{itemKey}]</span>
      <span className="leading-relaxed">{firstLine.length > 60 ? firstLine.slice(0, 60) + "…" : firstLine}</span>
    </button>
  );
}

// ── 별표22 상세 패널 ─────────────────────────────────────
function Byulpyo22Detail({ itemKey, onClose }: { itemKey: string; onClose: () => void }) {
  const entry = byulpyo22Map[itemKey];
  if (!entry) return null;
  const fullText = entry.text || "";
  const firstLine = (entry.title || fullText.split('\n')[0] || itemKey).trim();
  const body = fullText.split('\n').slice(1).join('\n').trim();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div>
          <span className="font-mono text-[10px] text-muted-foreground">[{itemKey}]</span>
          <p className="text-sm font-semibold mt-0.5 leading-snug">{firstLine}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg ml-2 shrink-0">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {body && (
          <div>
            <p className="text-[10px] font-bold text-muted-foreground tracking-wide mb-1.5">조문 내용</p>
            <p className="text-xs leading-relaxed text-foreground whitespace-pre-wrap bg-secondary rounded-lg p-3">{body}</p>
          </div>
        )}
        <div className="pt-1 border-t border-border">
          <p className="text-[10px] text-muted-foreground">{entry.source || "별표22 엘리베이터 안전기준 KC2050-51:2022"}</p>
        </div>
      </div>
    </div>
  );
}


function ItemCard({ itemKey, isActive, onClick }: { itemKey: string; isActive: boolean; onClick: () => void }) {
  const entry = contentMap[itemKey];
  const text = entry?.text || "";
  const firstLine = text.split('\n')[0]?.trim() || itemKey;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-secondary text-foreground"
      }`}
    >
      <span className="font-mono text-[10px] opacity-60 mr-1">[{itemKey}]</span>
      <span className="leading-relaxed">{firstLine.length > 60 ? firstLine.slice(0, 60) + "…" : firstLine}</span>
    </button>
  );
}

// ── 상세 패널 ────────────────────────────────────────────
function DetailPanel({ itemKey, onClose }: { itemKey: string; onClose: () => void }) {
  const entry = contentMap[itemKey];
  if (!entry) return null;
  const revisions = entry.revisions || [];
  const latestRev = revisions[revisions.length - 1];

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <span className="font-mono text-xs text-muted-foreground">[{itemKey}]</span>
        <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg">
          <X size={16} />
        </button>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 검사기준 본문 */}
        {entry.text && (
          <div>
            <p className="text-[10px] font-bold text-muted-foreground tracking-wide mb-1.5">검사기준</p>
            <p className="text-xs leading-relaxed text-foreground whitespace-pre-wrap bg-secondary rounded-lg p-3">
              {entry.text}
            </p>
          </div>
        )}

        {/* 적용일 */}
        {latestRev?.effectiveDate && (
          <div>
            <p className="text-[10px] font-bold text-muted-foreground tracking-wide mb-1.5">적용일</p>
            <p className="text-xs text-foreground border-l-2 border-amber-400 pl-3">
              {latestRev.effectiveDate} 이후 건축허가분부터 적용
            </p>
          </div>
        )}

        {/* 개정 이력 */}
        {revisions.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-muted-foreground tracking-wide mb-1.5">
              개정 이력 ({revisions.length}건)
            </p>
            <div className="space-y-2">
              {revisions.map((r, i) => (
                <div key={i} className="text-xs border border-border rounded-lg p-2.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">{r.effectiveDate || "미상"}</span>
                    {r.introductionType && (
                      <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">{r.introductionType}</span>
                    )}
                  </div>
                  {r.description && (
                    <p className="text-foreground leading-relaxed">{r.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 섹션 트리 노드 ───────────────────────────────────────
function SectionNode({
  section, depth, activeKey, onSelect,
}: {
  section: Section; depth: number; activeKey: string | null; onSelect: (key: string) => void;
}) {
  const hasActive = activeKey ? (
    section.items.includes(activeKey) ||
    section.children.some(c => c.items.includes(activeKey) || c.children.some(cc => cc.items.includes(activeKey)))
  ) : false;
  const [open, setOpen] = useState(hasActive);

  useEffect(() => { if (hasActive) setOpen(true); }, [hasActive]);

  const hasChildren = section.children.length > 0 || section.items.length > 0;
  const indent = depth * 12;

  return (
    <div>
      <button
        onClick={() => hasChildren && setOpen(o => !o)}
        className={`w-full flex items-center gap-1.5 px-3 py-2 text-left text-xs transition-colors hover:bg-secondary rounded-lg ${hasActive ? "text-primary font-medium" : "text-foreground"}`}
        style={{ paddingLeft: `${indent + 12}px` }}
      >
        {hasChildren ? (
          open ? <ChevronDown size={12} className="shrink-0 opacity-60" /> : <ChevronRight size={12} className="shrink-0 opacity-60" />
        ) : <span className="w-3" />}
        <span className="font-mono text-[10px] text-muted-foreground mr-1 shrink-0">[{section.id}]</span>
        <span className="truncate leading-snug">{section.title}</span>
      </button>

      {open && (
        <div>
          {section.children.map(child => (
            <SectionNode key={child.id} section={child} depth={depth + 1} activeKey={activeKey} onSelect={onSelect} />
          ))}
          {section.items.map(key => (
            <div key={key} style={{ paddingLeft: `${indent + 24}px` }} className="pr-2 py-0.5">
              <ItemCard itemKey={key} isActive={activeKey === key} onClick={() => onSelect(key)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 별표22 섹션 트리 노드 ────────────────────────────────
function Byulpyo22Node({
  section, depth, activeKey, onSelect,
}: {
  section: Section; depth: number; activeKey: string | null; onSelect: (key: string) => void;
}) {
  const hasActive = activeKey ? (
    section.items.includes(activeKey) ||
    section.children.some(c => c.items.includes(activeKey) || c.id === activeKey)
  ) : false;
  const [open, setOpen] = useState(hasActive);
  useEffect(() => { if (hasActive) setOpen(true); }, [hasActive]);
  const hasChildren = section.children.length > 0 || section.items.length > 0;
  const indent = depth * 12;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setOpen(o => !o);
          if (!hasChildren) onSelect(section.id);
        }}
        className={`w-full flex items-center gap-1.5 px-3 py-2 text-left text-xs transition-colors hover:bg-secondary rounded-lg ${hasActive || activeKey === section.id ? "text-primary font-medium" : "text-foreground"}`}
        style={{ paddingLeft: `${indent + 12}px` }}
      >
        {hasChildren ? (
          open ? <ChevronDown size={12} className="shrink-0 opacity-60" /> : <ChevronRight size={12} className="shrink-0 opacity-60" />
        ) : <span className="w-3" />}
        <span className="font-mono text-[10px] text-muted-foreground mr-1 shrink-0">[{section.id}]</span>
        <span className="truncate leading-snug">{section.title}</span>
      </button>
      {open && (
        <div>
          {section.children.map(child => (
            <Byulpyo22Node key={child.id} section={child} depth={depth + 1} activeKey={activeKey} onSelect={onSelect} />
          ))}
          {section.items.map(key => (
            <div key={key} style={{ paddingLeft: `${indent + 24}px` }} className="pr-2 py-0.5">
              <Byulpyo22Card itemKey={key} isActive={activeKey === key} onClick={() => onSelect(key)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────
export default function InspectionStandardsPage() {
  const tree = useMemo(() => buildTree(), []);
  const tree22 = useMemo(() => buildByulpyo22Tree(), []);
  const [activeTab, setActiveTab] = useState<"content" | "byulpyo22">("content");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const currentMap = activeTab === "content" ? contentMap : byulpyo22Map;
  const currentTree = activeTab === "content" ? tree : tree22;
  const totalCount = Object.keys(currentMap).length;

  // AI검색에서 넘어온 항목 처리
  useEffect(() => {
    const checkPending = () => {
      const pendingId = sessionStorage.getItem("pendingInspectionDetail");
      if (!pendingId) return;
      sessionStorage.removeItem("pendingInspectionDetail");
      // 어느 탭에 있는지 확인
      if (byulpyo22Map[pendingId]) {
        setActiveTab("byulpyo22");
      } else {
        setActiveTab("content");
      }
      setActiveKey(pendingId);
    };
    checkPending();
    const handler = () => setTimeout(checkPending, 150);
    window.addEventListener("navigatePage", handler);
    return () => window.removeEventListener("navigatePage", handler);
  }, []);

  // 탭 변경 시 초기화
  useEffect(() => {
    setActiveKey(null);
    setSearchQuery("");
    setSearchResults([]);
    setShowSearch(false);
  }, [activeTab]);

  // 검색
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const kw = searchQuery.toLowerCase();
    const hits = Object.entries(currentMap)
      .filter(([, v]) => (v.text || "").toLowerCase().includes(kw))
      .map(([k]) => k)
      .slice(0, 30);
    setSearchResults(hits);
  }, [searchQuery, activeTab]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* 헤더 */}
      <div className="px-4 pt-4 pb-0 border-b border-border shrink-0 bg-card">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-base font-bold">검사기준</h1>
          <button
            onClick={() => { setShowSearch(s => !s); setSearchQuery(""); setSearchResults([]); }}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {showSearch ? <X size={18} /> : <Search size={18} />}
          </button>
        </div>

        {/* 탭 */}
        <div className="flex gap-0">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === "content"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            안전기준 고시
            <span className="ml-1 text-[10px] opacity-60">({Object.keys(contentMap).length})</span>
          </button>
          <button
            onClick={() => setActiveTab("byulpyo22")}
            className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === "byulpyo22"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            별표22 안전기준
            <span className="ml-1 text-[10px] opacity-60">({Object.keys(byulpyo22Map).length})</span>
          </button>
        </div>

        {/* 검색창 */}
        {showSearch && (
          <div className="py-2">
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="조문 내용 검색…"
              className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-hidden flex">
        {/* 트리 / 검색결과 */}
        <div className={`${activeKey ? "hidden md:flex w-72" : "flex-1"} flex-col overflow-y-auto border-r border-border`}>
          {showSearch && searchResults.length > 0 ? (
            <div className="p-2 space-y-1">
              <p className="text-[10px] text-muted-foreground px-2 py-1">{searchResults.length}건 검색됨</p>
              {searchResults.map(key => (
                <div key={key} className="px-1">
                  {activeTab === "content" ? (
                    <ItemCard itemKey={key} isActive={activeKey === key} onClick={() => { setActiveKey(key); setShowSearch(false); setSearchQuery(""); }} />
                  ) : (
                    <Byulpyo22Card itemKey={key} isActive={activeKey === key} onClick={() => { setActiveKey(key); setShowSearch(false); setSearchQuery(""); }} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {currentTree.map(chapter => (
                activeTab === "content" ? (
                  <SectionNode key={chapter.id} section={chapter} depth={0} activeKey={activeKey} onSelect={setActiveKey} />
                ) : (
                  <Byulpyo22Node key={chapter.id} section={chapter} depth={0} activeKey={activeKey} onSelect={setActiveKey} />
                )
              ))}
            </div>
          )}
        </div>

        {/* 상세 패널 */}
        {activeKey && (
          <div className="flex-1 overflow-hidden">
            {activeTab === "content" ? (
              <DetailPanel itemKey={activeKey} onClose={() => setActiveKey(null)} />
            ) : (
              <Byulpyo22Detail itemKey={activeKey} onClose={() => setActiveKey(null)} />
            )}
          </div>
        )}

        {!activeKey && !showSearch && (
          <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground text-sm">
            항목을 선택하세요
          </div>
        )}
      </div>
    </div>
  );
}
