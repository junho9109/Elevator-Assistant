import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Search, X, FileCheck, Pencil, Settings, Lock, Plus, Info, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import JUDGMENT_DATA from "@/data/판정지침_parsed.json";
import VALID_BYULPYO22_IDS from "@/data/별표22_유효항목.json";
import { usePinchZoomPan } from "@/hooks/use-pinch-zoom";
import { isSuperAdminLoggedIn } from "@/lib/super-admin";

type Entry = { text?: string; title?: string; source?: string; };

// ── 현행(별표22) 데이터 — DB(inspection_base_items)가 단일 진실 소스 ──────
// 정적 JSON을 빌드에 번들링하지 않고, 화면 진입 시 API로 조회한다.
// 관리자 수정도 이 DB 행을 직접 UPDATE하므로 별도 override 레이어가 없다.
//
// DB에는 별표22 조문 외에도(고장배제 표 등 다른 문서에서 잘못 인덱싱된 행 포함)
// 976개 정식 조문번호와 겹치지 않는 잡음 행(예: 엉뚱한 내용의 "1.1")이 섞여있을 수 있어,
// 정식 조문번호 목록(별표22_유효항목.json)에 있는 것만 화면에 표시한다.
const VALID_IDS = new Set(VALID_BYULPYO22_IDS as string[]);

function stripIdPrefix(itemId: string, raw: string): string {
  const t = (raw || "").trim();
  if (t.startsWith(itemId + " ")) return t.slice(itemId.length + 1);
  if (t === itemId) return "";
  return t;
}

function baseItemsToMap(rows: any[]): Record<string, Entry> {
  const map: Record<string, Entry> = {};
  (rows || []).forEach((row: any) => {
    if (row.isActive === false || row.isActive === "false") return;
    const isAdminAdded = row.isAdminAdded === true || row.isAdminAdded === "true";
    if (!VALID_IDS.has(row.itemId) && !isAdminAdded) return;
    const rawText = (row.text && row.text.trim()) ? row.text : (row.sectionTitle || row.itemId);
    const body = stripIdPrefix(row.itemId, rawText);
    map[row.itemId] = {
      text: body ? `${row.itemId} ${body}` : row.itemId,
      title: body.split("\n")[0] || row.itemId,
      source: "별표22 엘리베이터 안전기준 KC2050-51:2022",
    };
  });
  return map;
}

// ── 연도별(세대별) 개정 문서 자동 로드 ──────────────────────────────────
// client/src/data/generations/ 폴더에 {연도}-{고시번호}.json 형식의 파일을 넣으면
// 별도 코드 수정 없이 "문서" 드롭다운에 별표22/판정지침과 나란히 하나씩 추가된다.
// 각 파일 형식: { meta: { id, title, effectiveDate, source, note }, items: { [key]: { title, text } } }
type GenerationMeta = { id: string; title: string; effectiveDate: string; source?: string; note?: string };
type GenerationDoc = { meta: GenerationMeta; items: Record<string, Entry> };

const generationModules = import.meta.glob("@/data/generations/*.json", { eager: true }) as Record<string, { default?: GenerationDoc } & GenerationDoc>;
const GENERATIONS: GenerationDoc[] = Object.values(generationModules)
  .map((m) => (("default" in m && m.default) ? m.default : (m as unknown as GenerationDoc)))
  .filter((g) => g?.meta?.effectiveDate)
  .sort((a, b) => a.meta.effectiveDate.localeCompare(b.meta.effectiveDate));

type JudgmentRow   = { ref: string; target: string; content: string };
type JudgmentItem  = { num: string; content: string };
type JudgmentSection =
  | { type: "text";  title: string; text: string }
  | { type: "list";  title: string; items: JudgmentItem[] }
  | { type: "table"; title: string; rows: JudgmentRow[] };
const JUDGMENT_SECTIONS = JUDGMENT_DATA as unknown as Record<string, JudgmentSection>;

// 문서 드롭다운 목록 — 별표22 / 판정지침 다음에, generations 폴더에 있는 세대별
// 고시(1997, 2009, 2012...)가 연도 오름차순으로 하나씩 별도 문서 항목으로 자동 추가된다.
const GEN_DOC_PREFIX = "gen:";
const DOCUMENTS = [
  { id: "byulpyo22", label: "별표22 검사기준 (KC2050-51:2022)" },
  { id: "judgment2016", label: "판정지침 2016.12.23" },
  ...GENERATIONS.map(g => ({
    id: `${GEN_DOC_PREFIX}${g.meta.id}`,
    label: `${g.meta.effectiveDate.slice(0, 4)} · ${g.meta.title}`,
  })),
];
type DocId = string;

interface Section {
  id: string;
  title: string;
  children: Section[];
  items: string[];
}

// prefix 바로 아래 한 단계(dot 하나 더)만 딸린 키들을 찾아 재귀적으로 자식 트리를 만든다.
// 예: prefix="6.5.6" → "6.5.6.1", "6.5.6.2"... 를 자식으로, 그 안에서 다시 "6.5.6.1.1" 등을 손자로 재귀 처리
// → 몇 단계든(6.5.6.1.1 처럼 4단계 이상) 항상 부모 밑에 접히는 구조로 표시된다.
function buildChildren(prefix: string, keys: string[], map: Record<string, Entry>): Section[] {
  const directKeys = keys.filter(k => {
    if (!k.startsWith(prefix + ".")) return false;
    const rest = k.slice(prefix.length + 1);
    return rest.length > 0 && !rest.includes(".");
  });
  directKeys.sort((a, b) => {
    const av = a.split(".").pop()!;
    const bv = b.split(".").pop()!;
    const an = Number(av), bn = Number(bv);
    if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn;
    return av.localeCompare(bv, undefined, { numeric: true });
  });
  return directKeys.map(k => ({
    id: k,
    title: shortLabel(map[k]?.title || map[k]?.text?.split("\n")[0] || k),
    children: buildChildren(k, keys, map),
    items: [],
  }));
}

// 좌측 목록 전용 — 조문번호 뒤에 붙는 제목/첫 문장은 20자까지만 표시
function shortLabel(s: string): string {
  const t = (s || "").trim();
  return t.length > 20 ? t.slice(0, 20) + "…" : t;
}

// 임의의 맵(현행 dataMap이든 특정 연도의 items든)에서 트리를 생성한다.
function buildTreeFromMap(map: Record<string, Entry>): Section[] {
  const keys = Object.keys(map);
  const topKeys = [...new Set(keys.map(k => k.split(".")[0]))];
  const numericTop = topKeys.filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
  const otherTop = topKeys.filter(k => !/^\d+$/.test(k));
  const chapterKeys = [...numericTop, ...otherTop];

  return chapterKeys.map(ch => {
    const entry = map[ch];
    const chTitle = shortLabel(entry?.title || entry?.text?.split("\n")[0] || ch);
    return { id: ch, title: chTitle, children: buildChildren(ch, keys, map), items: [] };
  });
}

function ItemBtn({ id, map, isActive, onClick }: { id: string; map: Record<string, Entry>; isActive: boolean; onClick: () => void }) {
  const e = map[id];
  const label = (e?.title || e?.text?.split("\n")[0] || id).trim();
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 text-left px-3 py-2 transition-colors ${
        isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary text-foreground"
      }`}
    >
      <span className="font-mono text-[10px] text-muted-foreground shrink-0 min-w-[36px]">{id}</span>
      <span className="text-xs leading-relaxed truncate flex-1 min-w-0">{shortLabel(label)}</span>
    </button>
  );
}

function TreeNode({ sec, map, depth, activeKey, onSelect, onInteract }: {
  sec: Section; map: Record<string, Entry>; depth: number; activeKey: string | null; onSelect: (k: string) => void; onInteract?: () => void;
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
      <div
        onClick={() => { onSelect(sec.id); onInteract?.(); }}
        className={`w-full flex items-center gap-2 py-2.5 pr-3 text-left text-xs leading-relaxed transition-colors hover:bg-secondary cursor-pointer ${
          isActive || hasDescendant ? "text-primary font-medium" : "text-foreground"
        }`}
        style={{ paddingLeft: pl }}
      >
        {hasChildren
          ? (
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(o => !o); onInteract?.(); }}
              className="shrink-0 p-0.5 -m-0.5"
              aria-label={open ? "하위 항목 접기" : "하위 항목 펼치기"}
            >
              {open ? <ChevronDown size={12} className="text-muted-foreground" /> : <ChevronRight size={12} className="text-muted-foreground" />}
            </button>
          )
          : <span className="w-3" />}
        <span className="font-mono text-[10px] text-muted-foreground shrink-0">{sec.id}</span>
        <span className="truncate text-xs leading-relaxed flex-1 min-w-0">{sec.title}</span>
      </div>
      {open && (
        <div className="border-l border-border ml-4">
          {sec.children.map(c => <TreeNode key={c.id} sec={c} map={map} depth={depth + 1} activeKey={activeKey} onSelect={onSelect} onInteract={onInteract} />)}
          {sec.items.map(k => (
            <div key={k} style={{ paddingLeft: (depth + 1) * 12 }}>
              <ItemBtn id={k} map={map} isActive={activeKey === k} onClick={() => { onSelect(k); onInteract?.(); }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 현행(byulpyo22) 상세 — 관리자 수정 기능 포함 (DB 직접 수정) ────────
type InspPhoto = { id: number; displayOrder: number; mimeType: string; createdAt: string };

function Detail({ id, map, yearStd, onClose, isAdminMode, onEdit }: {
  id: string; map: Record<string, Entry>; yearStd: string; onClose: () => void;
  isAdminMode: boolean; onEdit: () => void;
}) {
  const e = map[id];
  const photoQc = useQueryClient();

  const { data: photos = [] } = useQuery<InspPhoto[]>({
    queryKey: ["/api/inspection-photos", id],
    queryFn: async () => { const r = await fetch(`/api/inspection-photos/${encodeURIComponent(id)}`); return r.json(); },
  });

  const uploadPhoto = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("image", file);
      const r = await fetch(`/api/inspection-photos/${encodeURIComponent(id)}`, { method: "POST", body: fd });
      if (!r.ok) throw new Error("업로드 실패");
      return r.json();
    },
    onSuccess: () => photoQc.invalidateQueries({ queryKey: ["/api/inspection-photos", id] }),
  });
  const deletePhoto = useMutation({
    mutationFn: async (photoId: number) => { await fetch(`/api/inspection-photos/${photoId}`, { method: "DELETE" }); },
    onSuccess: () => photoQc.invalidateQueries({ queryKey: ["/api/inspection-photos", id] }),
  });
  const handlePhotoSelect = (fl: FileList | null) => {
    if (!fl) return;
    Array.from(fl).slice(0, Math.max(0, 10 - photos.length)).forEach(f => uploadPhoto.mutate(f));
  };
  const [photoViewer, setPhotoViewer] = useState<{ open: boolean; idx: number }>({ open: false, idx: 0 });
  const photoZoom = usePinchZoomPan(photoViewer.open ? photoViewer.idx : "closed");
  const photoUrl = (photoId: number) => `/api/inspection-photos/${encodeURIComponent(id)}/${photoId}/image`;

  if (!e) return (
    <div className="flex flex-col flex-1 min-h-0 items-center justify-center gap-3 p-6 text-center">
      <FileCheck size={32} className="opacity-20" />
      <p className="text-xs text-muted-foreground">조문 데이터를 불러올 수 없습니다.</p>
      <p className="font-mono text-[10px] text-muted-foreground">[{id}]</p>
      <button onClick={onClose} className="text-xs text-primary underline">닫기</button>
    </div>
  );

  const displayText = e.text || "";
  const displaySource = e.source || `별표22 엘리베이터 안전기준 ${yearStd}`;
  const firstLine = (e.title || displayText.split("\n")[0] || id).trim();
  // 본문에는 제목(첫 줄)도 그대로 포함 — 조문번호 접두사만 제외
  const body = (displayText.startsWith(id + " ") ? displayText.slice(id.length + 1) : displayText).trim();

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-start gap-2 px-4 py-3 border-b border-border shrink-0">
        <div className="flex-1 min-w-0">
          <span className="font-mono text-[10px] text-muted-foreground">[{id}]</span>
          <p className="text-sm font-medium mt-0.5 leading-snug line-clamp-2 min-h-[2.375rem]">{firstLine}</p>
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
        {(photos.length > 0 || isAdminMode) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">사진{photos.length > 0 ? ` (${photos.length}장)` : ""}</p>
              {isAdminMode && photos.length < 10 && (
                <label className="text-[11px] text-primary cursor-pointer">
                  + 추가
                  <input
                    type="file" accept="image/*" multiple className="hidden"
                    onChange={ev => { handlePhotoSelect(ev.target.files); ev.target.value = ""; }}
                  />
                </label>
              )}
            </div>
            {photos.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">등록된 사진이 없습니다.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {photos.map((p, i) => (
                  <div key={p.id} className="relative w-24 h-24 shrink-0 cursor-pointer" onClick={() => setPhotoViewer({ open: true, idx: i })}>
                    <img src={photoUrl(p.id)} alt="" className="w-full h-full object-cover rounded-lg border border-border" />
                    {isAdminMode && (
                      <button onClick={ev => { ev.stopPropagation(); deletePhoto.mutate(p.id); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 사진 전체화면 뷰어 — body에 직접 렌더링 (SwipeNavigator의 pinch-zoom transform 컨테이너를 벗어나야 태블릿에서 fixed 위치가 정상 동작함) */}
        {photoViewer.open && photos.length > 0 && createPortal(
          <div data-no-page-pinch="true" className="fixed inset-0 z-50 bg-black/90 flex flex-col" onClick={() => setPhotoViewer({ open: false, idx: 0 })}>
            <div className="flex items-center justify-between px-4 py-3 shrink-0" onClick={ev => ev.stopPropagation()}>
              <span className="text-white text-xs">{photoViewer.idx + 1} / {photos.length}</span>
              <div className="flex items-center gap-3">
                {isAdminMode && (
                  <button
                    className="text-red-400 text-xs px-2.5 py-1 border border-red-400/40 rounded-lg"
                    onClick={() => {
                      const target = photos[photoViewer.idx];
                      deletePhoto.mutate(target.id);
                      setPhotoViewer(v => ({ open: photos.length > 1, idx: Math.max(0, v.idx - 1) }));
                    }}
                  >삭제</button>
                )}
                <button onClick={() => setPhotoViewer({ open: false, idx: 0 })} className="text-white/70 text-lg">✕</button>
              </div>
            </div>
            <div
              className="flex-1 flex items-center justify-center px-4 overflow-hidden"
              style={{ touchAction: "none", cursor: photoZoom.cursor }}
              onClick={ev => ev.stopPropagation()}
              {...photoZoom.containerHandlers}
            >
              <img
                src={photoUrl(photos[photoViewer.idx].id)}
                alt=""
                draggable={false}
                className="max-w-full max-h-full object-contain rounded-xl"
                style={photoZoom.imgStyle}
              />
            </div>
            <div className="flex items-center justify-center gap-3 shrink-0 pb-1" onClick={ev => ev.stopPropagation()}>
              <button onClick={photoZoom.zoomOut} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                <ZoomOut size={18} />
              </button>
              <span className="text-white/70 text-[11px] min-w-[40px] text-center">{Math.round(photoZoom.zoom * 100)}%</span>
              <button onClick={photoZoom.zoomIn} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                <ZoomIn size={18} />
              </button>
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 px-4 py-3 overflow-x-auto shrink-0" onClick={ev => ev.stopPropagation()}>
                {photos.map((p, i) => (
                  <div
                    key={p.id}
                    className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 cursor-pointer border-2 ${i === photoViewer.idx ? "border-white" : "border-transparent"}`}
                    onClick={() => setPhotoViewer(v => ({ ...v, idx: i }))}
                  >
                    <img src={photoUrl(p.id)} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>,
          document.body
        )}
        <p className="text-xs text-muted-foreground border-t border-border pt-3 leading-relaxed">📌 {displaySource}</p>
      </div>
    </div>
  );
}

// ── 과거 연도(세대별) 문서 상세 — 읽기전용, 그 연도 문서 그대로 표시 ────
function GenerationDetail({ id, gen, onClose }: { id: string; gen: GenerationDoc; onClose: () => void }) {
  const e = gen.items[id];

  if (!e) return (
    <div className="flex flex-col flex-1 min-h-0 items-center justify-center gap-3 p-6 text-center">
      <FileCheck size={32} className="opacity-20" />
      <p className="text-xs text-muted-foreground">조문 데이터를 불러올 수 없습니다.</p>
      <p className="font-mono text-[10px] text-muted-foreground">[{id}]</p>
      <button onClick={onClose} className="text-xs text-primary underline">닫기</button>
    </div>
  );

  const displayText = e.text || "";
  const firstLine = (e.title || displayText.split("\n")[0] || id).trim();
  // 본문에는 제목(첫 줄)도 그대로 포함 — 조문번호 접두사만 제외
  const body = (displayText.startsWith(id + " ") ? displayText.slice(id.length + 1) : displayText).trim();

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-start gap-2 px-4 py-3 border-b border-border shrink-0">
        <div className="flex-1 min-w-0">
          <span className="font-mono text-[10px] text-muted-foreground">[{id}]</span>
          <span className="ml-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">종전 · {gen.meta.effectiveDate}</span>
          <p className="text-sm font-medium mt-0.5 leading-snug line-clamp-2 min-h-[2.375rem]">{firstLine}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors shrink-0">
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">조문 내용</p>
          <p className="text-xs leading-relaxed whitespace-pre-wrap bg-muted/40 border border-border rounded-xl p-3">{body || displayText}</p>
        </div>
        <p className="text-xs text-muted-foreground border-t border-border pt-3 leading-relaxed">📌 {gen.meta.title} · {gen.meta.source || gen.meta.effectiveDate}</p>
      </div>
    </div>
  );
}

type SearchHit = { docId: DocId; scopeLabel: string; itemId: string; title: string; snippet: string; sectionKey?: string };

function makeSnippet(text: string, q: string, pad = 28): string {
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text.slice(0, pad * 2) + (text.length > pad * 2 ? "…" : "");
  const start = Math.max(0, idx - pad);
  const end = Math.min(text.length, idx + q.length + pad);
  return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
}

export default function InspectionStandardsPage({ isActive }: { isActive?: boolean }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [showTreeHint, setShowTreeHint] = useState(true);
  // 이 페이지는 다른 페이지로 이동해도 unmount되지 않고 화면에서만 숨겨지므로(SwipeNavigator),
  // 이 페이지로 "다시 들어올 때"(isActive: false → true)마다 안내문구를 다시 띄운다.
  useEffect(() => {
    if (!isActive) return;
    setShowTreeHint(true);
    const t = setTimeout(() => setShowTreeHint(false), 10000);
    return () => clearTimeout(t);
  }, [isActive]);
  const [query, setQuery] = useState("");
  const [searchHits, setSearchHits] = useState<SearchHit[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const CURRENT_STD = "KC2050-51:2022";  // 현행 기준
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(() => isSuperAdminLoggedIn());
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemId, setNewItemId] = useState("");
  const [newItemAfter, setNewItemAfter] = useState("");
  const [newItemText, setNewItemText] = useState("");
  const [addItemError, setAddItemError] = useState("");
  const [addItemConflict, setAddItemConflict] = useState<{ itemId: string; text: string } | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocId>("byulpyo22");
  const [judgmentJumpKey, setJudgmentJumpKey] = useState<string | null>(null);
  const [pwInput, setPwInput] = useState("");
  const [showPw, setShowPw] = useState(false);
  const queryClient = useQueryClient();

  // 현행(별표22) 조문 — DB에서 직접 조회, 별도 override 없이 이 값이 곧 화면에 뜨는 값
  const { data: baseItemsRaw } = useQuery<any[]>({
    queryKey: ["/api/inspection-base-items"],
    queryFn: () => fetch("/api/inspection-base-items").then(r => r.json()),
    staleTime: 0,
  });
  const dataMap = useMemo(() => baseItemsToMap(baseItemsRaw || []), [baseItemsRaw]);

  const handleSaveEdit = async () => {
    if (!editKey) return;
    const body = editText.trim();
    const combinedText = `${editKey} ${body}`;
    const title = body.split("\n")[0] || editKey;
    await fetch(`/api/inspection-base-items/${encodeURIComponent(editKey)}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: combinedText, sectionTitle: title }),
    });
    queryClient.invalidateQueries({ queryKey: ["/api/inspection-base-items"] });
    setEditKey(null);
  };

  const handleAddItem = async () => {
    setAddItemError(""); setAddItemConflict(null);
    const itemId = newItemId.trim();
    const body = newItemText.trim();
    if (!itemId) { setAddItemError("조문 번호를 입력해주세요."); return; }
    if (!body) { setAddItemError("조문 내용을 입력해주세요."); return; }
    const combinedText = `${itemId} ${body}`;
    const title = body.split("\n")[0] || itemId;
    const res = await fetch("/api/inspection-base-items", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId, text: combinedText, sectionTitle: title,
        parentSectionId: itemId.includes(".") ? itemId.slice(0, itemId.lastIndexOf(".")) : null,
        afterItemId: newItemAfter.trim() || undefined,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setAddItemError(err.error || "추가에 실패했습니다.");
      // 409(이미 DB에 있는 itemId) — 화면엔 안 보이던 기존 내용을 함께 보여줘서
      // "덮어쓰고 등록"(화면 노출)할지 판단할 수 있게 한다.
      if (res.status === 409 && err.existing) {
        setAddItemConflict({ itemId: err.existing.itemId, text: err.existing.text || "" });
      }
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["/api/inspection-base-items"] });
    setShowAddItem(false);
    setNewItemId(""); setNewItemAfter(""); setNewItemText(""); setAddItemError(""); setAddItemConflict(null);
    setActiveKey(itemId);
  };

  // 이미 DB에 있던(화면엔 숨겨져 있던) 행을 지금 입력한 내용으로 덮어쓰고 화면에 노출시킨다.
  const handleAdoptExisting = async () => {
    if (!addItemConflict) return;
    const itemId = addItemConflict.itemId;
    const body = newItemText.trim();
    if (!body) { setAddItemError("조문 내용을 입력해주세요."); return; }
    const combinedText = `${itemId} ${body}`;
    const title = body.split("\n")[0] || itemId;
    const res = await fetch(`/api/inspection-base-items/${encodeURIComponent(itemId)}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: combinedText, sectionTitle: title, adopt: true }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setAddItemError(err.error || "덮어쓰기에 실패했습니다.");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["/api/inspection-base-items"] });
    setShowAddItem(false);
    setNewItemId(""); setNewItemAfter(""); setNewItemText(""); setAddItemError(""); setAddItemConflict(null);
    setActiveKey(itemId);
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

  // 현재 선택된 문서가 세대별(연도별) 역사 문서인지 판별
  const activeGeneration = useMemo(
    () => (selectedDoc.startsWith(GEN_DOC_PREFIX)
      ? GENERATIONS.find(g => `${GEN_DOC_PREFIX}${g.meta.id}` === selectedDoc) || null
      : null),
    [selectedDoc]
  );
  const activeMap = activeGeneration ? activeGeneration.items : dataMap;
  const activeTree = useMemo(() => buildTreeFromMap(activeMap), [activeMap]);
  const activeTotalCount = Object.keys(activeMap).length;

  // 검색 — 현행 + 로드된 모든 세대(연도) 문서를 로컬에서 통합 검색
  useEffect(() => {
    const q = query.trim();
    if (!q) { setSearchHits([]); return; }
    const kw = q.toLowerCase();
    const hits: SearchHit[] = [];

    Object.entries(dataMap).forEach(([k, v]) => {
      const hay = `${v.title || ""}\n${v.text || ""}`;
      if (hay.toLowerCase().includes(kw)) {
        hits.push({ docId: "byulpyo22", scopeLabel: "현행", itemId: k, title: v.title || v.text?.split("\n")[0] || k, snippet: makeSnippet(v.text || "", q) });
      }
    });
    GENERATIONS.forEach(g => {
      const yr = g.meta.effectiveDate.slice(0, 4);
      Object.entries(g.items).forEach(([k, v]) => {
        const hay = `${v.title || ""}\n${v.text || ""}`;
        if (hay.toLowerCase().includes(kw)) {
          hits.push({ docId: `${GEN_DOC_PREFIX}${g.meta.id}`, scopeLabel: `${yr}년`, itemId: k, title: v.title || v.text?.split("\n")[0] || k, snippet: makeSnippet(v.text || "", q) });
        }
      });
    });

    // 판정지침(본문/별표1/별표2/별표3) — 이전에는 검색 대상에서 빠져 있었음
    Object.entries(JUDGMENT_SECTIONS).forEach(([key, sec]) => {
      const secLabel = (sec.title || key).replace(/\[별표\d+\]\s*/, "");
      if (sec.type === "text") {
        const hay = `${sec.title || ""}\n${sec.text || ""}`;
        if (hay.toLowerCase().includes(kw)) {
          hits.push({ docId: "judgment2016", scopeLabel: "판정지침", itemId: key, title: secLabel, snippet: makeSnippet(sec.text || "", q), sectionKey: key });
        }
      } else if (sec.type === "list") {
        sec.items.forEach(it => {
          const hay = `${it.num || ""}\n${it.content || ""}`;
          if (hay.toLowerCase().includes(kw)) {
            hits.push({ docId: "judgment2016", scopeLabel: "판정지침", itemId: it.num, title: `${secLabel} · ${it.num}`.trim(), snippet: makeSnippet(it.content || "", q), sectionKey: key });
          }
        });
      } else if (sec.type === "table") {
        sec.rows.forEach(r => {
          const hay = `${r.ref || ""}\n${r.target || ""}\n${r.content || ""}`;
          if (hay.toLowerCase().includes(kw)) {
            hits.push({ docId: "judgment2016", scopeLabel: "판정지침", itemId: r.ref, title: `${secLabel} · ${r.target || ""}`.trim(), snippet: makeSnippet(r.content || "", q), sectionKey: key });
          }
        });
      }
    });

    setSearchHits(hits.slice(0, 200));
  }, [query, dataMap]);

  const handleClose = () => {
    // 검색 중이었다면 검색 상태(검색창·검색 결과)는 유지 — 태블릿처럼 상세보기가 좌측 패널을
    // 가리는 화면 폭에서도 닫기 후 검색 결과 목록으로 그대로 돌아올 수 있도록 함
    setActiveKey(null);
  };


  return (
    <div className="absolute inset-0 flex flex-col bg-background overflow-hidden">
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
                <p className="text-xs text-muted-foreground">
                  {selectedDoc === "judgment2016"
                    ? "판정지침"
                    : `${activeGeneration ? activeGeneration.meta.title : "현행 · 별표22"} · ${activeTotalCount}개 조문`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdminMode && selectedDoc === "byulpyo22" && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => { setShowAddItem(true); setNewItemId(""); setNewItemAfter(activeKey || ""); setNewItemText(""); setAddItemError(""); setAddItemConflict(null); }}
                  className="shrink-0 shadow-sm hover:shadow-md transition-all border-amber-400 bg-amber-50 dark:bg-amber-900/20"
                  title="조문 추가"
                >
                  <Plus className="h-4 w-4 text-amber-600" />
                </Button>
              )}
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
                onClick={() => { setShowSearch(s => !s); setQuery(""); setSearchHits([]); setActiveKey(null); }}
                className="shrink-0 shadow-sm hover:shadow-md transition-all"
                title={showSearch ? "검색 닫기" : "검색"}
              >
                {showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* 문서 선택 드롭다운 */}
        <div className="flex items-center gap-2 px-4 py-2 border-t border-border">
          <span className="text-xs text-muted-foreground shrink-0">문서</span>
          <select
            value={selectedDoc}
            onChange={e => { setSelectedDoc(e.target.value as DocId); setActiveKey(null); setQuery(""); setSearchHits([]); }}
            className="flex-1 text-xs bg-card border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {DOCUMENTS.map(d => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
        </div>

        {showSearch && (
          <div className="px-3 pb-2 border-t border-border pt-2">
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="조문 내용 검색… (현행 + 모든 연도 + 판정지침 대상)"
              className="w-full text-xs bg-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
            />
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-hidden flex min-h-0">
        {selectedDoc === "judgment2016" && !(showSearch && query.trim()) && (
          <JudgmentDocView isAdminMode={isAdminMode} jumpToKey={judgmentJumpKey} onJumpApplied={() => setJudgmentJumpKey(null)} />
        )}
        <div className={(selectedDoc !== "judgment2016" || (showSearch && query.trim())) ? "contents" : "hidden"}>
        {/* 좌측: 트리 또는 검색결과 */}
        <div className={`${activeKey ? "hidden md:flex md:w-72" : "flex-1"} flex-col overflow-y-auto border-r border-border`}>
          {showSearch && query.trim() ? (
            searchHits.length > 0 ? (
              <div className="p-2 space-y-1.5">
                <p className="text-xs text-muted-foreground px-2 py-1.5 font-medium">
                  "{query.trim()}" 검색 결과 · {searchHits.length}건 (현행 + 전체 연도 + 판정지침)
                </p>
                {searchHits.map((h, i) => {
                  const isActiveHit = h.docId !== "judgment2016" && activeKey === h.itemId && selectedDoc === h.docId;
                  return (
                  <button
                    key={`${h.docId}-${h.itemId}-${i}`}
                    onClick={() => {
                      if (h.docId === "judgment2016") {
                        // 판정지침은 항목이 아니라 문서(별표) 단위로 상세를 여는 구조라
                        // JudgmentDocView 쪽으로 넘어가서 해당 문서를 직접 열어준다.
                        setJudgmentJumpKey(h.sectionKey || h.itemId);
                        setSelectedDoc("judgment2016");
                        setShowSearch(false);
                        setQuery("");
                        setSearchHits([]);
                      } else {
                        setSelectedDoc(h.docId);
                        setActiveKey(h.itemId);
                      }
                    }}
                    className={`w-full text-left border rounded-xl px-3 py-2.5 transition-colors ${
                      isActiveHit ? "border-primary bg-primary/10" : "border-border hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] shrink-0 rounded-full px-1.5 py-0.5 ${
                        h.docId === "byulpyo22" ? "bg-primary/10 text-primary"
                        : h.docId === "judgment2016" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                        : "bg-muted text-muted-foreground border border-border"
                      }`}>{h.scopeLabel}</span>
                      <span className="font-mono text-[10px] text-primary font-medium">{h.itemId}</span>
                      <span className="text-xs text-muted-foreground flex-1 truncate">{h.title}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{h.snippet}</p>
                  </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground py-12">
                <Search size={32} className="mb-2 opacity-30" />
                <p className="text-xs">검색 결과 없음</p>
              </div>
            )
          ) : (
            <div className="p-2">
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  showTreeHint ? "max-h-10 opacity-100 mb-1.5" : "max-h-0 opacity-0 -translate-y-1 mb-0"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] text-primary bg-primary/10 rounded-lg px-2.5 py-2">
                  <Info size={13} className="shrink-0" />
                  <span><b>화살표</b>를 누르면 하위 조문이 펼쳐지고, <b>조문 글자</b>를 누르면 상세보기가 열려요</span>
                </div>
              </div>
              {activeTree.map(ch => (
                <TreeNode
                  key={ch.id}
                  sec={ch}
                  map={activeMap}
                  depth={0}
                  activeKey={activeKey}
                  onSelect={setActiveKey}
                  onInteract={() => setShowTreeHint(false)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 우측: 상세 */}
        {activeKey ? (
          <div className="flex-1 flex flex-col min-h-0">
            {activeGeneration ? (
              <GenerationDetail id={activeKey} gen={activeGeneration} onClose={handleClose} />
            ) : (
              <Detail
                id={activeKey}
                map={dataMap}
                yearStd={CURRENT_STD}
                onClose={handleClose}
                isAdminMode={isAdminMode}
                onEdit={() => {
                  const e = dataMap[activeKey];
                  const fullText = e?.text || "";
                  const stripped = fullText.startsWith(activeKey + " ") ? fullText.slice(activeKey.length + 1) : fullText;
                  setEditText(stripped);
                  setEditKey(activeKey);
                }}
              />
            )}
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
            <label className="text-xs text-muted-foreground">본문 (첫 줄이 좌측 목록에 조문번호 [{editKey}] 뒤 제목으로 표시됩니다 · 20자까지만 노출)</label>
            <textarea className="w-full border border-border rounded-xl px-3 py-2 text-xs bg-secondary resize-none min-h-[180px]" value={editText} onChange={e => setEditText(e.target.value)} placeholder="예: 기계실·기계류 공간 및 풀리실" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditKey(null)} className="flex-1 py-2 text-sm border border-border rounded-xl">취소</button>
            <button onClick={handleSaveEdit} className="flex-1 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl">DB 저장</button>
          </div>
        </div>
      </div>
    )}

    {/* 검사기준 조문 추가 모달 */}
    {showAddItem && (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
        <div className="bg-card w-full rounded-t-2xl p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center gap-2">
            <Plus size={15} className="text-amber-500" />
            <span className="text-sm font-medium flex-1">검사기준 조문 추가</span>
            <button onClick={() => { setShowAddItem(false); setAddItemConflict(null); }} className="w-7 h-7 flex items-center justify-center border border-border rounded-lg"><X size={13} /></button>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">조문 번호 (예: 16.3.3)</label>
            <input className="w-full border border-border rounded-xl px-3 py-2 text-xs bg-secondary" value={newItemId} onChange={e => { setNewItemId(e.target.value); setAddItemConflict(null); setAddItemError(""); }} placeholder="16.3.3" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">이 조문 번호 다음에 추가 (선택 — 비우면 맨 뒤에 추가)</label>
            <input className="w-full border border-border rounded-xl px-3 py-2 text-xs bg-secondary" value={newItemAfter} onChange={e => setNewItemAfter(e.target.value)} placeholder="16.3.2" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">조문 내용 (첫 줄이 좌측 목록에 조문번호 뒤 제목으로 표시됩니다)</label>
            <textarea className="w-full border border-border rounded-xl px-3 py-2 text-xs bg-secondary resize-none min-h-[180px]" value={newItemText} onChange={e => setNewItemText(e.target.value)} placeholder="조문 내용을 입력하세요" />
          </div>
          {addItemError && <p className="text-xs text-destructive">{addItemError}</p>}
          {addItemConflict && (
            <div className="p-3 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-900/20 space-y-2">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                DB에 이미 [{addItemConflict.itemId}] 행이 있습니다 (화면엔 숨겨져 있었을 수 있습니다). 기존 내용:
              </p>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap bg-card border border-border rounded-lg p-2 max-h-32 overflow-y-auto">
                {addItemConflict.text || "(내용 없음)"}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                위 "조문 내용" 칸에 입력한 내용으로 이 행을 덮어쓰고 화면에 노출시키려면 아래 버튼을 누르세요.
              </p>
              <button onClick={handleAdoptExisting} className="w-full py-2 text-xs font-medium bg-amber-500 text-white rounded-lg">이 내용으로 덮어쓰고 등록</button>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => { setShowAddItem(false); setAddItemConflict(null); }} className="flex-1 py-2 text-sm border border-border rounded-xl">취소</button>
            <button onClick={handleAddItem} className="flex-1 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl">DB에 추가</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
// ── 판정지침 뷰 컴포넌트 ──────────────────────────────────────────────
function JudgmentDocView({ isAdminMode, jumpToKey, onJumpApplied }: { isAdminMode: boolean; jumpToKey?: string | null; onJumpApplied?: () => void }) {
  const [sel, setSel] = useState<string | null>(null);

  // 검색 결과에서 특정 항목으로 이동해왔을 때 — 해당 문서를 곧바로 선택 상태로 연다.
  useEffect(() => {
    if (!jumpToKey) return;
    setSel(jumpToKey);
    onJumpApplied?.();
  }, [jumpToKey]);
  const [overrides, setOverrides] = useState<Record<string, { title?: string; text?: string; items?: JudgmentItem[]; rows?: JudgmentRow[] }>>({});
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");
  const [editItems, setEditItems] = useState<JudgmentItem[]>([]);
  const [editRows, setEditRows] = useState<JudgmentRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [customKeys, setCustomKeys] = useState<string[]>([]);

  // 오버라이드 로드
  useEffect(() => {
    fetch("/api/insp-std-overrides")
      .then(r => r.json())
      .then((rows: any[]) => {
        const map: Record<string, { title?: string; text?: string; items?: JudgmentItem[]; rows?: JudgmentRow[] }> = {};
        const customs: string[] = [];
        rows.forEach((row: any) => {
          if (row.itemKey?.startsWith("판정지침_")) {
            const key = row.itemKey.replace("판정지침_", "");
            const data = (() => { try { return JSON.parse(row.text || "{}"); } catch { return { text: row.text }; } })();
            map[key] = data;
            if (!JUDGMENT_SECTIONS[key]) customs.push(key);
          }
        });
        setOverrides(map);
        setCustomKeys(customs);
      }).catch(() => {});
  }, []);

  const entries = Object.entries(JUDGMENT_SECTIONS);
  const allKeys = [...new Set([...entries.map(([k]) => k), ...customKeys])];

  const groups = [
    { label: "본문", keys: allKeys.filter(k => k === "본문") },
    { label: "별표1 — 착수전 불합격", keys: allKeys.filter(k => k === "별표1") },
    { label: "별표2 — 완성·정기·수시검사", keys: allKeys.filter(k => k.startsWith("별표2_")) },
    { label: "별표3 — 정밀안전검사", keys: allKeys.filter(k => k.startsWith("별표3_")) },
    ...(customKeys.filter(k => !["본문","별표1"].includes(k) && !k.startsWith("별표2_") && !k.startsWith("별표3_")).length > 0
      ? [{ label: "추가 항목", keys: customKeys.filter(k => !["본문","별표1"].includes(k) && !k.startsWith("별표2_") && !k.startsWith("별표3_")) }]
      : []),
  ];

  const getTitle = (key: string) => overrides[key]?.title || JUDGMENT_SECTIONS[key]?.title || key;
  const getSection = (key: string): JudgmentSection | null => {
    const base = JUDGMENT_SECTIONS[key];
    const ov = overrides[key];
    // "text" 타입만 편집 UI가 있으므로, 저장된 수정 내용(overrides)이 있으면 화면 표시에도 반영한다.
    // (예전에는 base 원본만 그대로 반환해 편집 후 저장해도 화면에는 수정 전 내용이 계속 보였음)
    if (base?.type === "text" && ov?.text) {
      return { ...base, text: ov.text };
    }
    if (base?.type === "list" && ov?.items) {
      return { ...base, items: ov.items };
    }
    if (base?.type === "table" && ov?.rows) {
      return { ...base, rows: ov.rows };
    }
    if (!base) {
      // 관리자가 새로 추가한 항목(base 원본이 없음)은 override 자체가 곧 본문
      return ov?.text ? { type: "text", title: ov.title || key, text: ov.text } : null;
    }
    return base;
  };
  const hasOverride = (key: string) => !!overrides[key];

  const saveOverride = async (key: string, title: string, text?: string, items?: JudgmentItem[], rows?: JudgmentRow[]) => {
    setSaving(true);
    try {
      const payload: { title: string; text?: string; items?: JudgmentItem[]; rows?: JudgmentRow[] } =
        rows ? { title, rows } : items ? { title, items } : { title, text };
      await fetch(`/api/insp-std-overrides/${encodeURIComponent("판정지침_" + key)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: JSON.stringify(payload), source: "판정지침_수정" }),
      });
      setOverrides(prev => ({ ...prev, [key]: rows ? { title, rows } : items ? { title, items } : { title, text } }));
      setEditMode(false);
    } catch {}
    setSaving(false);
  };

  const deleteOverride = async (key: string) => {
    if (!confirm("이 항목의 수정 내용을 초기화하시겠습니까?")) return;
    setSaving(true);
    try {
      await fetch(`/api/insp-std-overrides/${encodeURIComponent("판정지침_" + key)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "", source: "" }),
      });
      setOverrides(prev => { const n = { ...prev }; delete n[key]; return n; });
      if (customKeys.includes(key)) {
        setCustomKeys(prev => prev.filter(k => k !== key));
        setSel(null);
      }
    } catch {}
    setSaving(false);
  };

  const openEdit = (key: string) => {
    const base = JUDGMENT_SECTIONS[key];
    if (base?.type === "list") {
      const ov = overrides[key];
      setEditItems(ov?.items ? ov.items.map(it => ({ ...it })) : base.items.map(it => ({ ...it })));
    } else if (base?.type === "table") {
      const ov = overrides[key];
      setEditRows(ov?.rows ? ov.rows.map(r => ({ ...r })) : base.rows.map(r => ({ ...r })));
    } else {
      const baseText = base?.type === "text" ? base.text : "";
      setEditText(overrides[key]?.text || baseText);
    }
    setEditTitle(getTitle(key));
    setEditMode(true);
  };

  const saveNewItem = async () => {
    if (!newKey.trim() || !newTitle.trim()) return;
    const key = newKey.trim();
    await saveOverride(key, newTitle.trim(), newText.trim());
    if (!JUDGMENT_SECTIONS[key]) setCustomKeys(prev => [...prev, key]);
    setAddMode(false);
    setNewKey(""); setNewTitle(""); setNewText("");
    setSel(key);
  };

  const cur = sel ? getSection(sel) : null;
  const curTitle = sel ? getTitle(sel) : "";

  return (
    <div className="flex-1 overflow-hidden flex min-h-0 w-full">
      {/* 좌측 목록 */}
      <div className={`${cur ? "hidden md:flex md:w-72" : "flex-1"} flex-col overflow-y-auto border-r border-border`}>
        {isAdminMode && (
          <div className="p-2 border-b border-border">
            <button onClick={() => setAddMode(true)}
              className="w-full text-xs py-1.5 px-3 rounded-lg border border-dashed border-primary text-primary hover:bg-primary/5 transition-colors">
              + 새 항목 추가
            </button>
          </div>
        )}
        <div className="p-2">
          {groups.map(g => g.keys.length === 0 ? null : (
            <div key={g.label} className="mb-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide px-2 py-1.5">{g.label}</p>
              {g.keys.map(key => {
                const label = getTitle(key).replace(/\[별표\d+\]\s*/, "").replace(/\s*—.*$/, "").trim();
                const modified = hasOverride(key);
                return (
                  <button key={key} onClick={() => { setSel(key); setEditMode(false); }}
                    className={`w-full text-left text-xs leading-relaxed px-3 py-2.5 rounded-lg transition-colors mb-0.5 ${
                      sel === key ? "bg-primary text-primary-foreground font-medium" : "hover:bg-secondary text-foreground"
                    }`}>
                    {label}
                    {modified && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">수정됨</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 우측 상세 */}
      {cur ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* 상세 헤더 */}
          <div className="flex items-start gap-2 px-4 py-3 border-b border-border shrink-0">
            <div className="flex-1 min-w-0">
              {editMode
                ? <input className="w-full text-sm font-medium border border-border rounded-lg px-2 py-1 bg-card" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                : <p className="text-sm font-medium leading-snug">{curTitle}</p>
              }
              <p className="text-[10px] text-muted-foreground mt-0.5">📌 승강기 검사결과 판정지침 (2016.12.23 제정)</p>
            </div>
            <div className="flex gap-1 shrink-0">
              {isAdminMode && !editMode && (
                <>
                  <button onClick={() => openEdit(sel!)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 transition-colors">
                    <Pencil size={13} className="text-amber-600" />
                  </button>
                  <button onClick={() => deleteOverride(sel!)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-colors">
                    <X size={13} className="text-red-500" />
                  </button>
                </>
              )}
              {editMode && (
                <>
                  <button onClick={() => cur?.type === "list" ? saveOverride(sel!, editTitle, undefined, editItems) : cur?.type === "table" ? saveOverride(sel!, editTitle, undefined, undefined, editRows) : saveOverride(sel!, editTitle, editText)} disabled={saving}
                    className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-50">
                    {saving ? "저장중..." : "저장"}
                  </button>
                  <button onClick={() => setEditMode(false)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-border">취소</button>
                </>
              )}
              {!editMode && (
                <button onClick={() => setSel(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* 상세 내용 */}
          <div className="flex-1 overflow-y-auto p-4">
            {cur?.type === "text" && editMode
              ? <textarea
                  className="w-full h-full min-h-[300px] text-xs leading-relaxed bg-muted/40 border border-border rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
              : cur?.type === "text"
                ? <p className="text-xs leading-relaxed whitespace-pre-wrap bg-muted/40 border border-border rounded-xl p-3">{cur.text}</p>
              : cur?.type === "list" && editMode
                ? <div className="space-y-2">
                    {editItems.map((item, i) => (
                      <div key={i} className="bg-muted/40 border border-border rounded-xl p-3 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">번호</span>
                          <input
                            className="w-16 text-xs font-semibold text-primary border border-border rounded-lg px-2 py-1 bg-card"
                            value={item.num}
                            onChange={e => setEditItems(prev => prev.map((it, idx) => idx === i ? { ...it, num: e.target.value } : it))}
                          />
                          <button
                            onClick={() => setEditItems(prev => prev.filter((_, idx) => idx !== i))}
                            className="ml-auto text-[10px] px-2 py-1 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            항목 삭제
                          </button>
                        </div>
                        <textarea
                          className="w-full text-xs leading-relaxed border border-border rounded-lg p-2 bg-card resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                          rows={3}
                          value={item.content}
                          onChange={e => setEditItems(prev => prev.map((it, idx) => idx === i ? { ...it, content: e.target.value } : it))}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => setEditItems(prev => [...prev, { num: String(prev.length + 1), content: "" }])}
                      className="w-full text-xs py-2 rounded-lg border border-dashed border-primary text-primary hover:bg-primary/5 transition-colors">
                      + 항목 추가
                    </button>
                  </div>
              : cur?.type === "list"
                ? <div className="space-y-2">
                    {cur.items.map((item, i) => (
                      <div key={i} className="bg-muted/40 border border-border rounded-xl p-3">
                        <p className="text-xs font-semibold text-primary mb-1">{item.num}.</p>
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{item.content}</p>
                      </div>
                    ))}
                  </div>
              : cur?.type === "table" && editMode
                ? <div className="space-y-2">
                    {editRows.map((row, i) => (
                      <div key={i} className="bg-muted/40 border border-border rounded-xl p-3 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            className="w-24 text-[11px] font-semibold text-primary border border-border rounded-lg px-2 py-1 bg-card"
                            placeholder="검사항목"
                            value={row.ref}
                            onChange={e => setEditRows(prev => prev.map((r, idx) => idx === i ? { ...r, ref: e.target.value } : r))}
                          />
                          <input
                            className="flex-1 text-[11px] border border-border rounded-lg px-2 py-1 bg-card"
                            placeholder="검사대상"
                            value={row.target}
                            onChange={e => setEditRows(prev => prev.map((r, idx) => idx === i ? { ...r, target: e.target.value } : r))}
                          />
                          <button
                            onClick={() => setEditRows(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-[10px] px-2 py-1 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0">
                            행 삭제
                          </button>
                        </div>
                        <textarea
                          className="w-full text-xs leading-relaxed border border-border rounded-lg p-2 bg-card resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                          rows={3}
                          placeholder="불합격 내용"
                          value={row.content}
                          onChange={e => setEditRows(prev => prev.map((r, idx) => idx === i ? { ...r, content: e.target.value } : r))}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => setEditRows(prev => [...prev, { ref: "", target: "", content: "" }])}
                      className="w-full text-xs py-2 rounded-lg border border-dashed border-primary text-primary hover:bg-primary/5 transition-colors">
                      + 행 추가
                    </button>
                  </div>
              : cur?.type === "table"
                ? <div className="overflow-x-auto -mx-1">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-muted/60">
                          <th className="border border-border px-2 py-2 text-left text-muted-foreground font-medium" style={{minWidth:"70px",width:"70px"}}>검사항목</th>
                          <th className="border border-border px-2 py-2 text-left text-muted-foreground font-medium" style={{minWidth:"90px",width:"90px"}}>검사대상</th>
                          <th className="border border-border px-2 py-2 text-left text-muted-foreground font-medium">불합격 내용</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cur.rows.map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                            <td className="border border-border px-2 py-2 text-primary font-semibold align-top text-[11px] leading-relaxed">{row.ref}</td>
                            <td className="border border-border px-2 py-2 align-top leading-relaxed">{row.target}</td>
                            <td className="border border-border px-2 py-2 leading-relaxed whitespace-pre-wrap align-top">{row.content}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              : null
            }
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3 p-6">
          <FileCheck size={32} className="opacity-20" />
          <p className="text-xs text-center leading-relaxed">좌측 목록에서 항목을 선택하세요</p>
        </div>
      )}

      {/* 새 항목 추가 모달 */}
      {addMode && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-5 w-full max-w-sm flex flex-col gap-3">
            <p className="text-sm font-semibold">새 항목 추가</p>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">항목 키 (예: 별표2_경사형리프트2)</label>
              <input className="text-xs border border-border rounded-lg px-3 py-2 bg-card" value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="고유 키 입력" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">제목</label>
              <input className="text-xs border border-border rounded-lg px-3 py-2 bg-card" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="항목 제목" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">내용</label>
              <textarea className="text-xs border border-border rounded-lg px-3 py-2 bg-card min-h-[120px] resize-none" value={newText} onChange={e => setNewText(e.target.value)} placeholder="항목 내용" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setAddMode(false)} className="flex-1 py-2 text-xs border border-border rounded-xl">취소</button>
              <button onClick={saveNewItem} disabled={!newKey || !newTitle || saving}
                className="flex-1 py-2 text-xs bg-primary text-primary-foreground rounded-xl disabled:opacity-50">
                {saving ? "저장중..." : "추가"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
