import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import INSPECTION_CONTENT from "@/data/inspection-content.json";

type ContentEntry = {
  text?: string;
  effectiveDate?: string;
  introductionType?: string;
  revisions?: { effectiveDate: string | null; expiryDate: string | null; description: string; source?: string[] }[];
};

const contentMap = INSPECTION_CONTENT as unknown as Record<string, ContentEntry>;

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

// ── 항목 카드 ────────────────────────────────────────────
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

// ── 메인 페이지 ──────────────────────────────────────────
export default function InspectionStandardsPage() {
  const tree = useMemo(() => buildTree(), []);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  // AI검색에서 넘어온 항목 처리
  useEffect(() => {
    const checkPending = () => {
      const pendingId = sessionStorage.getItem("pendingInspectionDetail");
      if (!pendingId) return;
      sessionStorage.removeItem("pendingInspectionDetail");
      setActiveKey(pendingId);
    };
    checkPending();
    const handler = () => setTimeout(checkPending, 150);
    window.addEventListener("navigatePage", handler);
    return () => window.removeEventListener("navigatePage", handler);
  }, []);

  // 검색
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const kw = searchQuery.toLowerCase();
    const hits = Object.entries(contentMap)
      .filter(([, v]) => (v.text || "").toLowerCase().includes(kw))
      .map(([k]) => k)
      .slice(0, 30);
    setSearchResults(hits);
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* 헤더 */}
      <div className="px-4 pt-4 pb-2 border-b border-border shrink-0 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold">검사기준</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">엘리베이터 안전기준 고시 · {Object.keys(contentMap).length}개 항목</p>
          </div>
          <button
            onClick={() => { setShowSearch(s => !s); setSearchQuery(""); setSearchResults([]); }}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {showSearch ? <X size={18} /> : <Search size={18} />}
          </button>
        </div>

        {/* 검색창 */}
        {showSearch && (
          <div className="mt-2">
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
                  <ItemCard
                    itemKey={key}
                    isActive={activeKey === key}
                    onClick={() => { setActiveKey(key); setShowSearch(false); setSearchQuery(""); }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {tree.map(chapter => (
                <SectionNode key={chapter.id} section={chapter} depth={0} activeKey={activeKey} onSelect={setActiveKey} />
              ))}
            </div>
          )}
        </div>

        {/* 상세 패널 */}
        {activeKey && (
          <div className="flex-1 overflow-hidden">
            <DetailPanel itemKey={activeKey} onClose={() => setActiveKey(null)} />
          </div>
        )}

        {/* 빈 상태 */}
        {!activeKey && !showSearch && (
          <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground text-sm">
            항목을 선택하세요
          </div>
        )}
      </div>
    </div>
  );
}
