import React from "react";
import { createPortal } from "react-dom";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import defaultStructureImg from "@assets/structure_new.jpg";
import Fuse from "fuse.js";
import { Search, Plus, X, Calendar, Pencil, Trash2, Settings, ImageIcon, Send, Bot, User, Zap, Lightbulb, ZoomIn, ZoomOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePinchZoomPan } from "@/hooks/use-pinch-zoom";
import { isSuperAdminLoggedIn } from "@/lib/super-admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useStandards, useHotspots, useCreateStandard, useUpdateStandard, useDeleteStandard, useCreateCategory,
  useCreateHotspot, useUpdateHotspot, useDeleteHotspot,
} from "@/lib/api";
import type { Standard, Hotspot } from "@shared/schema";
import { INSPECTION_DATA_MR } from "@/data/inspection-data-mr";
import JUDGMENT_DATA from "@/data/판정지침_parsed.json";
import ReactMarkdown from "react-markdown";

// ── 판정지침(승강기검사결과 판정지침) — AI검색 [2순위] 컨텍스트용 ──────────
// inspection-standards.tsx가 화면에 보여주는 것과 동일한 원본 데이터.
type JudgmentRow2  = { ref: string; target: string; content: string };
type JudgmentItem2 = { num: string; content: string };
type JudgmentSection2 =
  | { type: "text";  title: string; text: string }
  | { type: "list";  title: string; items: JudgmentItem2[] }
  | { type: "table"; title: string; rows: JudgmentRow2[] };
const JUDGMENT_SECTIONS_AI = JUDGMENT_DATA as unknown as Record<string, JudgmentSection2>;
function judgmentSectionToText(sec: JudgmentSection2): string {
  if (sec.type === "text") return sec.text || "";
  if (sec.type === "list") return (sec.items || []).map(it => `${it.num} ${it.content}`).join("\n");
  if (sec.type === "table") return (sec.rows || []).map(r => `${r.ref} ${r.target}: ${r.content}`).join("\n");
  return "";
}
// STD_DATA JSON 제거 — DB(std_item_overrides) 전용으로 이전 완료
type StdItem = { title: string; ref: string; basis: string; conclusion: string; source: string; typeTag: string; category: string; };
const STD_ITEMS: StdItem[] = []; // DB에서 동적 로드 (useEffect에서 채움)

// STD_ITEMS JSON category → hotspot label 매핑 테이블
// hotspot이 추가/삭제되어도 이 테이블만 업데이트하면 자동 반영
const STD_CATEGORY_MAP: Record<string, string> = {
  "기계실": "기계실",
  "승강로": "승강로",
  "피트": "피트",
  "카상부": "카 상부",
  "카·문": "카 내",
  "카": "카 내",
  "기타": "기타",
  "엘리베이터": "기타",
  "주행성능": "기타",
  "에스컬레이터": "기타",
  "완충기": "기타",
  "덤웨이터": "기타",
  "제동장치": "기타",
  "구동기": "기타",
  "휠체어리프트": "기타",
  "소방구조용": "기타",
  "안전회로": "기타",
  "장애인용": "기타",
  "전기": "기타",
  "과속조절기": "기타",
};

// STD_ITEMS category → hotspot label 정규화
// 매핑 없는 값은 원본 유지 (신규 hotspot 추가 시 자동 대응)
function normalizeCat(cat: string, hotspotLabels: string[]): string {
  // 1순위: 매핑 테이블
  if (STD_CATEGORY_MAP[cat]) return STD_CATEGORY_MAP[cat];
  // 2순위: hotspot label과 공백 제거 후 일치
  const normalized = cat.replace(/[\s·]/g, "");
  const match = hotspotLabels.find(l => l.replace(/[\s·]/g, "") === normalized);
  if (match) return match;
  // 3순위: 원본 유지 (hotspot과 정확히 같은 경우)
  if (hotspotLabels.includes(cat)) return cat;
  // 4순위: 매핑 안 되면 "기타"로
  return hotspotLabels.includes("기타") ? "기타" : cat;
}


// ==================== 유사 검색 ====================

// 유사어·약어·오타 사전 (승강기 검사 도메인 특화)
const SYNONYMS: Record<string, string[]> = {
  // 점형블록 계열
  "점형블록": ["점형블럭", "점자블록", "점자블럭", "점블록", "점자유도블록"],
  "점형블럭": ["점형블록"],
  // 과속조절기·조속기
  "과속조절기": ["조속기", "스피드거버너", "거버너"],
  "조속기": ["과속조절기", "거버너"],
  // 추락방지안전장치·비상정지
  "추락방지안전장치": ["비상정지장치", "세이프티", "세이프티기어", "비상제동"],
  "비상정지장치": ["추락방지안전장치", "세이프티기어"],
  // 개문출발방지장치
  "개문출발방지장치": ["ucmp", "개문출발", "문열림출발방지"],
  "ucmp": ["개문출발방지장치", "개문출발"],
  // 상승과속방지장치
  "상승과속방지장치": ["ucm", "로프브레이크", "카브레이크", "이중브레이크"],
  // 기계실 없는
  "기계실없는": ["mrl", "머신룸리스"],
  "mrl": ["기계실없는", "머신룸리스"],
  "mr": ["기계실있는"],
  // 완충기
  "완충기": ["버퍼", "쿠션", "충격완화"],
  // 에이프런
  "에이프런": ["에프런", "apron"],
  // 비상통화장치
  "비상통화장치": ["비상호출", "인터폰", "비상벨", "비상통화"],
  // 승강장문
  "승강장문": ["홀도어", "층문", "hall door", "승강장도어"],
  "홀도어": ["승강장문", "hall door"],
  // 카문
  "카문": ["카도어", "car door", "카 도어"],
  "카도어": ["카문"],
  // 권상기
  "권상기": ["호이스팅머신", "구동기", "traction machine"],
  "구동기": ["권상기", "호이스팅머신"],
  // 주행안내레일
  "주행안내레일": ["가이드레일", "레일", "guide rail"],
  "가이드레일": ["주행안내레일", "레일"],
  // 균형추
  "균형추": ["카운터웨이트", "counter weight"],
  "카운터웨이트": ["균형추"],
  // 과속조절기로프
  "과속조절기로프": ["조속기로프", "거버너로프"],
  // 피트
  "피트": ["pit", "엘리베이터피트"],
  // 검사 종류
  "수시검사": ["임시검사", "특별검사"],
  "정밀안전검사": ["정밀검사", "정안검"],
  "정기검사": ["정기안전검사"],
  // 리모델링
  "리모델링": ["교체설치", "개조", "교체공사"],
  "교체설치": ["리모델링"],
  // 스커트가드
  "스커트가드": ["치마판", "스커트"],
  // 비상구출문
  "비상구출문": ["비상구출해치", "탈출해치", "비상해치"],
  // 도어록
  "잠금장치": ["도어록", "인터록", "interlock"],
  "인터록": ["잠금장치", "interlock"],
  // 보호난간
  "보호난간": ["안전난간", "가드레일"],
  // 장애인용
  "장애인용": ["배리어프리", "barrier free", "휠체어"],
  // 소방구조용
  "소방구조용": ["소방엘리베이터", "소방용"],
  // 자동구출운전
  "자동구출운전": ["arg", "자동구출", "ard"],
  // 오버밸런스
  "오버밸런스": ["균형량", "ob율", "ob"],
  // 파이널리미트스위치
  "파이널리미트스위치": ["최종제한스위치", "final limit"],
};

// 키워드 확장 (유사어 포함한 검색어 목록 반환)
// ⑦ 질문에서 핵심 명사 추출 (조사·부사 제거)
function extractKeyTerms(question: string): string[] {
  const stopWords = ['이야','이에요','뭐야','뭔가요','어때','어떻게','언제','얼마','몇','부터','까지','이상','이하','미만','초과','있어','없어','해야','안돼','돼','인가요','인지','하는','경우','때','위한','대한','관련','기준','확인','검사','해줘','알려줘','설명','무엇','어디','왜','어느','가요','나요','인가','요'];
  const norm = question.replace(/[?？!！.,。]/g, ' ').trim();
  // 2글자 이상 명사 추출 (조사 제거)
  const terms = norm.split(/\s+/)
    .map(w => w.replace(/[은는이가을를의에서로부터까지도만]/g, ''))
    .filter(w => w.length >= 2 && !stopWords.includes(w));
  return [...new Set(terms)];
}

// 주/보조 키워드 분리 — 주 키워드(명사): 검색 필터, 보조 키워드(동사/형용사): 의도 파악
function splitKeywords(question: string): { primary: string[]; secondary: string[] } {
  const timingWords = ['적용','시행','언제','부터','이후','시기','일자','날짜','기준','건축허가','의무'];
  const criteriaWords = ['기준','판정','방법','확인','검사','치수','수치','이상','이하','미만','초과'];
  const judgeWords = ['합격','불합격','시정','적합','부적합','지적'];

  const norm = question.replace(/[?？!！.,。]/g, ' ').trim();
  const words = norm.split(/\s+/).map(w => w.replace(/[은는이가을를의에서로부터까지도만]/g, '')).filter(w => w.length >= 2);

  const secondary: string[] = [];
  const primary: string[] = [];

  for (const w of words) {
    if (timingWords.includes(w) || criteriaWords.includes(w) || judgeWords.includes(w)) {
      secondary.push(w);
    } else {
      primary.push(w);
    }
  }
  // primary가 없으면 전체를 primary로
  return {
    primary: primary.length > 0 ? [...new Set(primary)] : [...new Set(words)],
    secondary: [...new Set(secondary)],
  };
}

// ⑥ 질문 의도 분류
type QueryIntent = 'timing' | 'criteria' | 'comparison' | 'judgment' | 'general';
function detectIntent(question: string): QueryIntent {
  const q = question;
  if (/언제부터|적용시기|몇년|건축허가|이후|부터\s*적용/.test(q)) return 'timing';
  if (/차이|비교|vs|versus|다른점|같은점/.test(q)) return 'comparison';
  if (/합격|불합격|판정|시정|적합|부적합/.test(q)) return 'judgment';
  if (/기준|수치|치수|높이|폭|길이|거리|이상|이하|미만|초과/.test(q)) return 'criteria';
  return 'general';
}

function expandKeywords(kw: string): string[] {
  const base = kw.toLowerCase().replace(/\s+/g, '');
  const expanded = new Set<string>([base, kw.toLowerCase()]);

  for (const [key, synonyms] of Object.entries(SYNONYMS)) {
    const keyNorm = key.toLowerCase().replace(/\s+/g, '');
    if (base.includes(keyNorm) || keyNorm.includes(base)) {
      expanded.add(keyNorm);
      synonyms.forEach(s => {
        expanded.add(s.toLowerCase().replace(/\s+/g, ''));
        expanded.add(s.toLowerCase());
      });
    }
    synonyms.forEach(s => {
      const sNorm = s.toLowerCase().replace(/\s+/g, '');
      if (base.includes(sNorm) || sNorm.includes(base)) {
        expanded.add(keyNorm);
        synonyms.forEach(s2 => expanded.add(s2.toLowerCase().replace(/\s+/g, '')));
      }
    });
  }
  return [...expanded].filter(k => k.length >= 2);
}

// n-gram 유사도 (2글자 단위)
function ngramSimilarity(a: string, b: string): number {
  const ngrams = (s: string) => {
    const set = new Set<string>();
    const norm = s.replace(/\s+/g, '');
    for (let i = 0; i < norm.length - 1; i++) set.add(norm.slice(i, i + 2));
    return set;
  };
  const sa = ngrams(a), sb = ngrams(b);
  if (sa.size === 0 || sb.size === 0) return 0;
  let inter = 0;
  sa.forEach(g => { if (sb.has(g)) inter++; });
  return (2 * inter) / (sa.size + sb.size);
}

// ② 제목/본문 위치별 점수 차별화 + ③ 임계값 + ④ 챕터 근접도
function scoreMatch(
  text: string,
  keywords: string[],
  originalKw: string,
  titleText?: string,        // 제목 별도 전달
  chapterKey?: string,       // 조문 번호 (챕터 근접도용)
  intent?: QueryIntent,      // ⑥ 의도
  allTerms?: string[]        // ⑦ 멀티 키워드 교집합용
): number {
  const normText = text.toLowerCase().replace(/\s+/g, '');
  const normTitle = (titleText || '').toLowerCase().replace(/\s+/g, '');
  const normOrig = originalKw.toLowerCase().replace(/\s+/g, '');

  let score = 0;

  // ② 제목 완전 일치 → 최고 점수
  if (normTitle && normTitle.includes(normOrig)) {
    score = 160;
  }
  // 본문 앞부분(300자 이내) 포함
  else if (normText.slice(0, 300).includes(normOrig)) {
    score = 100;
  }
  // 본문 뒷부분 포함
  else if (normText.includes(normOrig)) {
    score = 70;
  }
  // 유사어 포함
  else {
    for (const kw of keywords) {
      if (kw !== normOrig) {
        if (normTitle && normTitle.includes(kw)) { score = 130; break; }
        if (normText.slice(0, 300).includes(kw)) { score = Math.max(score, 80); }
        else if (normText.includes(kw)) { score = Math.max(score, 55); }
      }
    }
    // n-gram 폴백
    if (score === 0) {
      const sim = ngramSimilarity(normOrig, normText.slice(0, 200));
      if (sim >= 0.6) score = Math.round(sim * 60);
    }
  }

  if (score === 0) return 0;

  // ③ 임계값: 50 미만은 제외
  if (score < 50) return 0;

  // ★ 키워드 일치율 보너스 — 질문 핵심어가 많이 포함될수록 높은 점수
  if (allTerms && allTerms.length > 0) {
    const matchedCount = allTerms.filter(term =>
      normText.includes(term.toLowerCase().replace(/\s+/g, '')) ||
      (normTitle && normTitle.includes(term.toLowerCase().replace(/\s+/g, '')))
    ).length;
    const matchRatio = matchedCount / allTerms.length;
    // 일치율 × 80점 추가 (복합어 우선)
    const ratioBonus = Math.round(matchRatio * 80);
    score += ratioBonus;
  }

  // ⑦ 멀티 키워드 교집합 보너스 — 여러 핵심어가 모두 포함되면 +40
  if (allTerms && allTerms.length > 1) {
    const matchCount = allTerms.filter(t =>
      normText.includes(t.toLowerCase().replace(/\s+/g, ''))
    ).length;
    if (matchCount === allTerms.length) score += 40;
    else if (matchCount >= 2) score += 20;
  }

  // ⑥ 의도별 보너스
  if (intent === 'timing') {
    // 날짜/건축허가 패턴이 있으면 가산점 강화 — 명확한 날짜(YY.M.D 등) 포함 시 특히 크게
    if (/\d{2,4}[.\-]\d{1,2}[.\-]\d{1,2}/.test(normText)) score += 80; // 구체적 날짜(예: 19.3.28)
    else if (/\d{4}년|건축허가|이후|부터적용|\d{4}\.\d{1,2}/.test(normText)) score += 40;
    // "불가/폐지/금지" 등 확정적 단어와 날짜가 함께 있으면 추가 가산
    if (/설치\s*불가|사용\s*불가|금지|폐지/.test(normText) && /\d{2,4}[.\-]\d{1,2}/.test(normText)) score += 50;
  } else if (intent === 'criteria') {
    // 수치 패턴 있으면 +20
    if (/\d+m|\d+mm|\d+%|이상|이하|미만|초과/.test(normText)) score += 20;
  } else if (intent === 'judgment') {
    if (/합격|불합격|시정|적합|부적합/.test(normText)) score += 20;
  }

  // ④ 챕터 근접도: 같은 상위 챕터면 +15
  // (챕터 번호는 외부에서 전달받아 사용 — searchAllData에서 주입)

  return score;
}


type Message = { role: "user" | "assistant"; content: string; time: string; searchResults?: SearchResult[]; calcCard?: string; elevatorData?: any; safetyPoints?: any[]; isElevatorQuery?: boolean; mode?: "fast" | "precise"; elapsedMs?: number; };
type ArticleVersion = { type: "current" | "old"; effectiveDate?: string; expiryDate?: string; description: string; };
type SearchResult = { type: "standard" | "inspection" | "judgment" | "chat" | "article"; title: string; content: string; query: string; score?: number; priority?: number; versions?: ArticleVersion[]; chatMeta?: { id: number; userName: string; createdAt: string; replyToUser?: string | null; replyToContent?: string | null; hasImage?: boolean; }; };

// ==================== 검색결과 아코디언 ====================
type CatGroup = { key: string; label: string; color: string; bg: string; dot: string; items: SearchResult[] };

function SearchCatAccordion({ cat, onSelect }: { cat: CatGroup; onSelect: (r: SearchResult) => void }) {
  const [open, setOpen] = React.useState(false);
  const scoreLabel = (s?: number) => s === 100 ? "정확" : s !== undefined && s >= 85 ? "유사어" : s !== undefined ? "유추" : null;
  const scoreBg   = (s?: number) => s === 100 ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
    : s !== undefined && s >= 85 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
    : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left bg-card hover:bg-muted/40 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.dot }} />
        <span className="text-xs font-medium text-foreground flex-1">{cat.label}</span>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md" style={{ background: cat.bg, color: cat.color }}>{cat.items.length}건</span>
        <svg className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="border-t border-border divide-y divide-border">
          {cat.items.map((r, i) => (
            <button key={i} className="w-full text-left px-3 py-2 hover:bg-muted/30 transition-colors" onClick={() => onSelect(r)}>
              <div className="flex items-center gap-1.5 mb-0.5">
                {scoreLabel(r.score) && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${scoreBg(r.score)}`}>{scoreLabel(r.score)}</span>
                )}
                {r.type === "chat" && r.chatMeta?.hasImage && <span className="text-[11px] text-purple-500">📷</span>}
              </div>
              <div className="text-xs font-medium text-foreground leading-snug">{r.title}</div>
              {r.type === "chat" && r.chatMeta && (
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  <span className="text-purple-500 font-medium">{r.chatMeta.userName}</span>
                  {r.chatMeta.replyToUser && <span> → {r.chatMeta.replyToUser}에 답변</span>}
                </div>
              )}
              {r.content && r.type !== "chat" && (
                <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1 leading-snug">{r.content}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 키워드로 표준화+검사기준 검색
function searchAllData(keyword: string, standards: any[], stdOverrides?: any[], liveInspectionContent?: Record<string, { text?: string; effectiveDate?: string; revisions?: any[] }>): SearchResult[] {
  const kw = keyword.toLowerCase().trim();
  if (!kw || kw.length < 2) return [];

  const kwList = expandKeywords(kw);
  const intent = detectIntent(keyword);            // ⑥ 의도 분류
  const allTerms = extractKeyTerms(keyword);       // ⑦ 핵심어 추출

  const scored: { result: SearchResult; score: number }[] = [];

  // 질문 자체에 타입을 명시했는지 감지 — "OOO 검사기준 뭐야" vs "OOO 표준화 뭐야"
  const asksInspection = /검사\s*기준|안전\s*기준|별표\s*22/.test(keyword);
  const asksStandard = /표준화|검사업무표준화/.test(keyword);

  // ② 제목과 본문을 분리해서 점수 계산
  const addResult = (r: SearchResult, titleText: string, bodyText: string) => {
    let score = scoreMatch(bodyText, kwList, kw, titleText, undefined, intent, allTerms);
    // 세부 소항목(1.2.1.4-마 같은 가/나/다 항목)은 적용시기 질문에서 패널티
    if (intent === "timing" && /[가나다라마바사아자차카타파하]-?$/.test(r.query || "")) {
      score = Math.max(0, score - 60);
    }
    // 질문이 특정 타입을 명시하면 해당 타입에 강한 가산점, 반대 타입엔 감점
    if (r.type === "inspection") {
      if (asksInspection && !asksStandard) score += 90;
      else if (asksStandard && !asksInspection) score -= 40;
    } else if (r.type === "standard") {
      if (asksStandard && !asksInspection) score += 90;
      else if (asksInspection && !asksStandard) score -= 40;
    }
    if (score >= 50) scored.push({ result: r, score }); // ③ 임계값 50 미만 제외
  };

  // 표준화 검색 (DB standards)
  standards.forEach(s => {
    addResult({
      type: "standard",
      title: s.title,
      content: s.body ? s.body.slice(0, 100) + (s.body.length > 100 ? "..." : "") : "",
      query: s.title
    }, s.title || "", `${s.body || ""}`);
  });

  // 표준화 검색 — DB(stdOverrides)가 충분하면 DB 전용, 아니면 JSON+DB 병합
  const dbItems = stdOverrides || [];
  if (dbItems.length >= 83) {
    // DB SEED 완료 — DB만 사용
    dbItems.forEach((ov: any) => {
      const title = ov.override_title || ov.overrideTitle || ov.title;
      const conclusion = ov.conclusion || "";
      const basis = ov.basis || "";
      const ref = ov.ref || "";
      addResult({
        type: "standard",
        title: ov.title,
        content: conclusion ? conclusion.slice(0, 300) + (conclusion.length > 300 ? "..." : "") : basis.slice(0, 300),
        query: ov.title
      }, title, `${ref} ${basis} ${conclusion}`);
    });
  } else {
    // DB SEED 전 — JSON + DB 오버라이드 병합
    STD_ITEMS.forEach(s => {
      const ov = dbItems.find((o: any) => o.title === s.title);
      const conclusion = ov?.conclusion || s.conclusion || "";
      const basis = ov?.basis || s.basis || "";
      const ref = ov?.ref || s.ref || "";
      const title = ov?.overrideTitle || s.title;
      addResult({
        type: "standard",
        title: s.title,
        content: conclusion ? conclusion.slice(0, 300) + (conclusion.length > 300 ? "..." : "") : basis.slice(0, 300),
        query: s.title
      }, title, `${ref} ${basis} ${conclusion}`);
    });
    // DB 전용 신규 항목
    const stdTitles = new Set(STD_ITEMS.map(s => s.title));
    dbItems.filter((ov: any) => !stdTitles.has(ov.title)).forEach((ov: any) => {
      const title = ov.override_title || ov.overrideTitle || ov.title;
      const conclusion = ov.conclusion || "";
      const basis = ov.basis || "";
      const ref = ov.ref || "";
      addResult({
        type: "standard",
        title: ov.title,
        content: conclusion ? conclusion.slice(0, 300) + (conclusion.length > 300 ? "..." : "") : basis.slice(0, 300),
        query: ov.title
      }, title, `${ref} ${basis} ${conclusion}`);
    });
  }

  // 표준화 신규 추가 항목 검색 (STD_ITEMS에 없고 std_item_overrides에만 있는 항목)
  if (stdOverrides && stdOverrides.length > 0) {
    const stdTitles = new Set(STD_ITEMS.map(s => s.title));
    stdOverrides.forEach((ov: any) => {
      if (!stdTitles.has(ov.title)) {
        addResult({
          type: "standard",
          title: ov.title,
          content: ov.conclusion ? ov.conclusion.slice(0, 300) : (ov.basis || "").slice(0, 300),
          query: ov.title
        }, ov.overrideTitle || ov.title, `${ov.ref || ""} ${ov.basis || ""} ${ov.conclusion || ""}`);
      }
    });
  }

  // 검사기준 검색 — DB(inspection_base_items) 데이터만 사용 (정적 파일 폴백 없음)
  const contentEntries = Object.entries(liveInspectionContent || {});
  contentEntries.forEach(([id, val]) => {
    const text = val.text || "";
    if (text.length < 10) return;
    if (text.includes("연혁집") || text.includes("부속서\n")) return;
    const title = `[${id}] ${text.slice(0, 60).replace(/\n/g, " ")}`;
    addResult({
      type: "inspection",
      title,
      content: text.replace(/\n/g, " "),
      query: id,
    }, title, text);
  });

  // 검사가이드 안전검사기준 검색
  const searchJudgment = (sections: any[]) => {
    sections.forEach(sec => {
      if (sec.items) {
        sec.items.forEach((item: any) => {
          const titleT = item.text ? item.text.slice(0, 50).replace(/\n/g, " ") : item.id;
          const bodyT = `${item.id || ""} ${item.text || ""} ${item.standard || ""}`;
          addResult({
            type: "judgment",
            title: titleT,
            content: item.text || "",
            query: item.id || "",
          }, titleT, bodyT);
        });
      }
      if (sec.subsections) searchJudgment(sec.subsections);
    });
  };
  searchJudgment(INSPECTION_DATA_MR);

  // INSPECTION_DATA_MR 섹션 제목 검색
  const searchSection = (sections: any[]) => {
    sections.forEach(sec => {
      const titleT = sec.title || "";
      addResult({
        type: "inspection",
        title: titleT,
        content: `검사기준 섹션: ${sec.title}`,
        query: sec.id || sec.title,
      }, titleT, titleT);
      if (sec.subsections) searchSection(sec.subsections);
    });
  };
  searchSection(INSPECTION_DATA_MR);

  // 점수 내림차순 정렬
  scored.sort((a, b) => b.score - a.score);

  // 중복 제거 후 점수순 병합
  const allDeduped: SearchResult[] = [];
  const seenAll = new Set<string>();
  for (const { result, score } of scored) {
    const key = `${result.type}:${result.title.slice(0, 30)}`;
    if (!seenAll.has(key)) {
      seenAll.add(key);
      allDeduped.push({ ...result, score });
    }
  }

  return allDeduped;
}

function getRuleBasedAnswer(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("정밀안전검사") || q.includes("정밀 안전")) {
    return "";
  }

  if (q.includes("과속조절기") || q.includes("조속기")) {
    return "";
  }

  if (q.includes("피트") || q.includes("pit")) {
    return "";
  }

  if (q.includes("승강장문") || q.includes("문잠금") || q.includes("잠금장치")) {
    return "";
  }

  if (q.includes("추락방지") || q.includes("안전장치") || q.includes("비상정지")) {
    return "";
  }

  if (q.includes("오늘") || q.includes("체크리스트") || q.includes("점검")) {
    const today = new Date();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dateStr = `${today.getMonth()+1}월 ${today.getDate()}일 (${days[today.getDay()]})`;
    return "";
  }

  if (q.includes("안전대") || q.includes("안전모") || q.includes("보호구") || q.includes("ppe")) {
    return "";
  }

  if (q.includes("cpr") || q.includes("심폐소생") || q.includes("응급")) {
    return "";
  }

  if (q.includes("기계실") || q.includes("권상기") || q.includes("브레이크")) {
    return "";
  }

  if (q.includes("ucmp") || q.includes("개문출발") || q.includes("문출발")) {
    return "";
  }

  if (q.includes("통계") || q.includes("사고 현황") || q.includes("최신 사고")) {
    return "";
  }

  if (q.includes("연령") || q.includes("나이") || q.includes("고령")) {
    return "";
  }

  if (q.includes("개정") || q.includes("최근 기준") || q.includes("변경")) {
    return "";
  }

  // 기본 답변
  return "";
}

function formatTime(): string {
  const now = new Date();
  return "";
}

// ==================== DatePicker ====================
function DatePicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  const [pickMode, setPickMode] = useState<"day" | "year">("day"); // 연도 그리드로 빠르게 이동
  const [viewYear, setViewYear] = useState(() => value ? parseInt(value.split("-")[0]) : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => value ? parseInt(value.split("-")[1]) - 1 : new Date().getMonth());
  const [yearGridStart, setYearGridStart] = useState(() => (value ? parseInt(value.split("-")[0]) : new Date().getFullYear()) - 5);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const months = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  const yearGrid = Array.from({ length: 12 }, (_, i) => yearGridStart + i);
  const selectDay = (day: number) => {
    onChange(`${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`);
    setShow(false);
  };
  const openYearGrid = () => { setYearGridStart(viewYear - 5); setPickMode("year"); };
  const selectYear = (y: number) => { setViewYear(y); setPickMode("day"); };
  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:border-primary bg-card" onClick={() => { setShow(!show); setPickMode("day"); }}>
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className={`text-sm ${value ? "text-foreground" : "text-muted-foreground"}`}>{value || "날짜 선택"}</span>
        {value && <button className="ml-auto text-muted-foreground" onClick={e => { e.stopPropagation(); onChange(""); }}><X className="h-3 w-3" /></button>}
      </div>
      {show && pickMode === "day" && (
        <div className="absolute z-50 mt-1 bg-card border rounded-xl shadow-xl p-4 w-72">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-0.5">
              <button onClick={() => setViewYear(y=>y-1)} className="p-1 hover:bg-muted rounded text-xs" title="1년 전">◀◀</button>
              <button onClick={() => { if (viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); }} className="p-1 hover:bg-muted rounded" title="1개월 전">◀</button>
            </div>
            <button onClick={openYearGrid} className="font-semibold text-sm px-2 py-0.5 rounded hover:bg-muted" title="연도 빠른 이동">{viewYear}년 {months[viewMonth]}</button>
            <div className="flex items-center gap-0.5">
              <button onClick={() => { if (viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); }} className="p-1 hover:bg-muted rounded" title="1개월 후">▶</button>
              <button onClick={() => setViewYear(y=>y+1)} className="p-1 hover:bg-muted rounded text-xs" title="1년 후">▶▶</button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-1">{["일","월","화","수","목","금","토"].map(d=><div key={d}>{d}</div>)}</div>
          <div className="grid grid-cols-7 text-center text-sm">
            {blanks.map(i=><div key={`b${i}`}/>)}
            {days.map(day=>{
              const dateStr=`${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              return <button key={day} onClick={()=>selectDay(day)} className={`p-1 rounded-full hover:bg-primary/20 ${value===dateStr?"bg-primary text-primary-foreground":""}`}>{day}</button>;
            })}
          </div>
        </div>
      )}
      {show && pickMode === "year" && (
        <div className="absolute z-50 mt-1 bg-card border rounded-xl shadow-xl p-4 w-72">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setYearGridStart(y=>y-12)} className="p-1 hover:bg-muted rounded" title="이전 12년">◀</button>
            <span className="font-semibold text-sm">{yearGridStart}년 ~ {yearGridStart+11}년</span>
            <button onClick={() => setYearGridStart(y=>y+12)} className="p-1 hover:bg-muted rounded" title="다음 12년">▶</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {yearGrid.map(y => (
              <button key={y} onClick={() => selectYear(y)} className={`py-2 rounded-lg text-sm hover:bg-primary/20 ${y===viewYear?"bg-primary text-primary-foreground":"bg-muted/50"}`}>{y}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const emptyForm = { categoryId: "", title: "", standardNumber: "", body: "", basis: "", conclusion: "", source: "", permitDate: "", inspectionDate: "", inspectionYear: "", installInspectionDate: "", images: [] as string[] };

// ── 리치 텍스트 에디터 (글자색 지원) ──
const COLOR_PALETTE = [
  { color: "#A32D2D", label: "빨강 (주의/부적합)", cls: "bg-red-700" },
  { color: "#0C447C", label: "파랑 (검사기준)", cls: "bg-blue-800" },
  { color: "#854F0B", label: "주황 (적용시기)", cls: "bg-orange-700" },
  { color: "#1A6B2A", label: "초록 (적합/승인)", cls: "bg-green-700" },
  { color: "#5F5E5A", label: "회색 (보조설명)", cls: "bg-gray-500" },
];

function RichTextEditor({ value, onChange, placeholder, minHeight = "80px" }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: string;
}) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const savedSel = React.useRef<Range | null>(null);

  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const saveSel = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedSel.current = sel.getRangeAt(0).cloneRange();
  };

  const restoreSel = () => {
    const sel = window.getSelection();
    if (sel && savedSel.current) {
      sel.removeAllRanges();
      sel.addRange(savedSel.current);
    }
  };

  const applyColor = (color: string) => {
    editorRef.current?.focus();
    restoreSel();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand("foreColor", false, color);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const removeColor = () => {
    editorRef.current?.focus();
    restoreSel();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    document.execCommand("removeFormat", false);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/50">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted/40 border-b border-border">
        <span className="text-[10px] text-muted-foreground shrink-0">색상</span>
        {COLOR_PALETTE.map(c => (
          <button key={c.color} type="button" title={c.label}
            onMouseDown={e => { e.preventDefault(); saveSel(); applyColor(c.color); }}
            className={`w-4 h-4 rounded-full ${c.cls} border border-white/50 hover:scale-125 transition-transform shrink-0`}
          />
        ))}
        <button type="button" title="색상 제거"
          onMouseDown={e => { e.preventDefault(); saveSel(); removeColor(); }}
          className="w-4 h-4 rounded-full bg-card border border-border text-[8px] font-bold text-muted-foreground hover:scale-125 transition-transform flex items-center justify-center shrink-0"
        >✕</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => { if (editorRef.current) onChange(editorRef.current.innerHTML); }}
        onMouseUp={saveSel}
        onKeyUp={saveSel}
        className="w-full px-3 py-2 text-sm bg-card outline-none"
        style={{ minHeight, whiteSpace: "pre-wrap" }}
        data-ph={placeholder}
      />
      <style>{`[contenteditable][data-ph]:empty::before{content:attr(data-ph);color:#9CA3AF;pointer-events:none;}`}</style>
    </div>
  );
}


// ==================== 표준화 항목 이미지 섹션 ====================
function StdPhotoSection({ itemKey }: { itemKey: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<{ id: number; mimeType: string; createdAt: string }[]>([]);
  const [viewer, setViewer] = useState<{ open: boolean; idx: number }>({ open: false, idx: 0 });
  const viewerZoom = usePinchZoomPan(viewer.open ? viewer.idx : "closed");
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [uploading, setUploading] = useState(false);

  const encodedKey = encodeURIComponent(itemKey);

  const loadPhotos = useCallback(async () => {
    try {
      const r = await fetch(`/api/std-photos/${encodedKey}`);
      if (r.ok) setPhotos(await r.json());
    } catch {}
  }, [encodedKey]);

  useEffect(() => { loadPhotos(); }, [loadPhotos]);

  const compressImage = (file: File): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > 1200) { height = Math.round(height * 1200 / width); width = 1200; }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        canvas.toBlob(b => b ? resolve(b) : reject(), 'image/jpeg', 0.82);
      };
      img.onerror = reject;
      img.src = url;
    });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileRef.current) fileRef.current.value = "";
    if (photos.length >= 10) return;
    setUploading(true);
    try {
      const blob = await compressImage(file).catch(() => file as unknown as Blob);
      const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
      const fd = new FormData();
      fd.append('image', compressed);
      const r = await fetch(`/api/std-photos/${encodedKey}`, { method: 'POST', body: fd });
      if (r.ok) await loadPhotos();
    } catch {}
    setUploading(false);
  };

  const handleDelete = async () => {
    if (pw !== "910919") { setPwErr(true); return; }
    if (deleteTarget === null) return;
    try {
      await fetch(`/api/std-photos/${deleteTarget}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      setDeleteTarget(null);
      setPw(""); setPwErr(false);
      await loadPhotos();
      setViewer({ open: false, idx: 0 });
    } catch {}
  };

  const imgUrl = (id: number) => `/api/std-photos/${encodedKey}/${id}/image`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-muted-foreground tracking-wide">첨부 이미지</p>
        <p className="text-xs text-muted-foreground">{photos.length} / 10</p>
      </div>

      {photos.length === 0 && !uploading ? (
        <label className="flex items-center justify-center gap-2 w-full py-2.5 border border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span className="text-[11px] text-muted-foreground">사진 추가 (최대 10장)</span>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      ) : (
        <div className="flex flex-wrap gap-2">
          {photos.map((p, i) => (
            <div key={p.id} className="w-24 h-24 rounded-xl overflow-hidden border border-border cursor-pointer shrink-0"
              onClick={() => setViewer({ open: true, idx: i })}>
              <img src={imgUrl(p.id)} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
          {photos.length < 10 && (
            <label className="w-24 h-24 rounded-xl border border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-secondary transition-colors shrink-0">
              {uploading
                ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span className="text-[11px] text-muted-foreground">추가</span></>
              }
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
            </label>
          )}
        </div>
      )}

      {/* 이미지 뷰어 */}
      {viewer.open && photos.length > 0 && (
        <div data-no-page-pinch="true" className="fixed inset-0 z-50 bg-black/90 flex flex-col" onClick={() => setViewer({ open: false, idx: 0 })}>
          <div className="flex items-center justify-between px-4 py-3 shrink-0" onClick={e => e.stopPropagation()}>
            <span className="text-white text-xs">{viewer.idx + 1} / {photos.length}</span>
            <div className="flex items-center gap-3">
              <button className="text-red-400 text-xs px-2.5 py-1 border border-red-400/40 rounded-lg"
                onClick={() => { setDeleteTarget(photos[viewer.idx].id); setPw(""); setPwErr(false); }}>삭제</button>
              <button onClick={() => setViewer({ open: false, idx: 0 })} className="text-white/70 text-lg">✕</button>
            </div>
          </div>
          <div
            className="flex-1 flex items-center justify-center px-4 overflow-hidden"
            style={{ touchAction: "none", cursor: viewerZoom.cursor }}
            onClick={e => e.stopPropagation()}
            {...viewerZoom.containerHandlers}
          >
            <img
              src={imgUrl(photos[viewer.idx].id)}
              alt=""
              draggable={false}
              className="max-w-full max-h-full object-contain rounded-xl"
              style={viewerZoom.imgStyle}
            />
          </div>
          <div className="flex items-center justify-center gap-3 shrink-0 pb-1" onClick={e => e.stopPropagation()}>
            <button onClick={viewerZoom.zoomOut} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
              <ZoomOut size={18} />
            </button>
            <span className="text-white/70 text-[11px] min-w-[40px] text-center">{Math.round(viewerZoom.zoom * 100)}%</span>
            <button onClick={viewerZoom.zoomIn} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
              <ZoomIn size={18} />
            </button>
          </div>
          <div className="flex gap-2 px-4 py-3 overflow-x-auto shrink-0" onClick={e => e.stopPropagation()}>
            {photos.map((p, i) => (
              <div key={p.id}
                className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 cursor-pointer border-2 ${i === viewer.idx ? 'border-white' : 'border-transparent'}`}
                onClick={() => setViewer(v => ({ ...v, idx: i }))}>
                <img src={imgUrl(p.id)} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 삭제 비밀번호 모달 */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-6" onClick={() => { setDeleteTarget(null); setPw(""); setPwErr(false); }}>
          <div className="bg-card border border-border rounded-2xl p-5 w-full max-w-xs space-y-3" onClick={e => e.stopPropagation()}>
            <p className="text-sm font-medium">사진 삭제</p>
            <p className="text-xs text-muted-foreground">삭제하려면 비밀번호를 입력하세요.</p>
            <input
              type="password" placeholder="비밀번호" value={pw} autoFocus
              onChange={e => { setPw(e.target.value); setPwErr(false); }}
              onKeyDown={e => e.key === 'Enter' && handleDelete()}
              className={`w-full text-sm bg-secondary border rounded-xl px-3 py-2.5 outline-none ${pwErr ? 'border-red-400' : 'border-border'}`}
            />
            {pwErr && <p className="text-[11px] text-red-500">비밀번호가 올바르지 않습니다.</p>}
            <div className="flex gap-2 pt-1">
              <button onClick={() => { setDeleteTarget(null); setPw(""); setPwErr(false); }}
                className="flex-1 py-2 rounded-xl border border-border text-sm text-muted-foreground">취소</button>
              <button onClick={handleDelete}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-medium">삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 메인 ====================
// ── AI 답변 피드백 버튼 ───────────────────────────────────────
const FEEDBACK_SECTIONS = ["판정 기준", "관련 조문", "관련 표준화", "검사 시 유의사항", "계산 과정", "전체 답변"];
const FEEDBACK_REASONS_POS = ["조문 근거가 정확함", "판정 기준이 명확함", "실무에 바로 도움됨", "종전/현행 차이 설명이 명확함", "계산 과정이 이해하기 쉬움", "간결하고 핵심만 담음"];
const FEEDBACK_REASONS_NEG = ["조문 근거가 틀리거나 부정확함", "판정 기준이 잘못됨", "불필요한 내용이 많음", "설명이 이해하기 어려움", "질문과 관련 없는 답변"];

function FeedbackModal({ rating, onSubmit, onSkip, onClose }: { rating: 1 | -1; onSubmit: (sections: string[], reasons: string[], comment: string) => void; onSkip: () => void; onClose: () => void }) {
  const [sections, setSections] = React.useState<string[]>([]);
  const [reasons, setReasons] = React.useState<string[]>([]);
  const [comment, setComment] = React.useState("");
  const reasonList = rating === 1 ? FEEDBACK_REASONS_POS : FEEDBACK_REASONS_NEG;
  const isNeg = rating === -1;

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99999, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "var(--card, white)", borderRadius: "16px 16px 0 0", width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto", padding: 18 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">{rating === 1 ? "👍" : "👎"}</span>
          <span className="text-[13px] font-bold text-foreground">{rating === 1 ? "어떤 점이 좋았나요?" : "어떤 점이 아쉬웠나요?"}</span>
        </div>

        <div className="mb-4">
          <p className="text-[11px] font-bold text-foreground mb-2">1. 어느 부분이 {rating === 1 ? "좋았나요" : "아쉬웠나요"}? <span className="font-normal text-muted-foreground">(복수 선택)</span></p>
          <div className="flex flex-wrap gap-1.5">
            {FEEDBACK_SECTIONS.map(s => (
              <button
                key={s}
                onClick={() => toggle(sections, setSections, s)}
                className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors ${
                  sections.includes(s)
                    ? isNeg ? "bg-red-50 border-red-300 text-red-700 font-semibold" : "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                    : "border-border text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-[11px] font-bold text-foreground mb-2">2. 어떤 점이 {rating === 1 ? "좋았나요" : "아쉬웠나요"}? <span className="font-normal text-muted-foreground">(복수 선택)</span></p>
          <div className="flex flex-wrap gap-1.5">
            {reasonList.map(r => (
              <button
                key={r}
                onClick={() => toggle(reasons, setReasons, r)}
                className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors ${
                  reasons.includes(r)
                    ? isNeg ? "bg-red-50 border-red-300 text-red-700 font-semibold" : "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                    : "border-border text-muted-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-[11px] font-bold text-foreground mb-2">기타 의견 <span className="font-normal text-muted-foreground">(선택)</span></p>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={2}
            placeholder={isNeg ? "어떤 점이 틀렸는지 구체적으로 적어주시면 큰 도움이 됩니다" : "추가로 남기고 싶은 의견이 있다면 적어주세요"}
            className="w-full border border-border rounded-xl px-3 py-2 text-[11px] bg-background outline-none resize-none"
          />
        </div>

        <button
          onClick={() => onSubmit(sections, reasons, comment)}
          className={`w-full text-white rounded-xl py-2.5 text-[12px] font-semibold mb-2 ${isNeg ? "bg-red-700" : "bg-[#1e3a5f]"}`}
        >
          제출
        </button>
        <button onClick={onSkip} className="w-full text-muted-foreground text-[11px] py-2">
          건너뛰고 {rating === 1 ? "좋아요" : "싫어요"}만 남기기
        </button>
      </div>
    </div>
  );
}

function FeedbackButtons({ question, answer }: { question: string; answer: string }) {
  const [rated, setRated] = React.useState<1 | -1 | null>(null);
  const [modalRating, setModalRating] = React.useState<1 | -1 | null>(null);
  const [loading, setLoading] = React.useState(false);

  const submitFeedback = async (rating: 1 | -1, sections: string[] = [], reasons: string[] = [], comment: string = "") => {
    if (rated || loading) return;
    setLoading(true);
    try {
      await fetch("/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, rating, sections, reasons, comment }),
      });
      setRated(rating);
      setModalRating(null);
    } catch (e) {}
    setLoading(false);
  };

  if (rated) {
    return (
      <div className="rounded-2xl px-3.5 py-2.5 mt-1" style={{ background: "linear-gradient(135deg,#fafbff,#f5f7ff)", border: "1px solid #e0e7ff" }}>
        <p className="text-[11px] font-semibold text-indigo-700">
          {rated === 1 ? "👍 피드백 감사합니다! 답변 개선에 활용할게요" : "👎 피드백 감사합니다. 더 나은 답변을 위해 노력할게요"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl px-3.5 py-2.5 mt-1" style={{ background: "linear-gradient(135deg,#fafbff,#f5f7ff)", border: "1px solid #e0e7ff" }}>
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-sm">✨</span>
          <p className="text-[11px] font-semibold text-indigo-700">답변이 도움이 되었나요? AI 답변 품질 개선에 활용됩니다</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => setModalRating(1)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-bold text-white rounded-xl py-2.5 disabled:opacity-50"
            style={{ background: "#3b82f6" }}
          >
            👍 좋아요
          </button>
          <button
            onClick={() => setModalRating(-1)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-bold text-white rounded-xl py-2.5 disabled:opacity-50"
            style={{ background: "#6b7280" }}
          >
            👎 아쉬워요
          </button>
        </div>
      </div>
      {modalRating && createPortal(
        <FeedbackModal
          rating={modalRating}
          onSubmit={(sections, reasons, comment) => submitFeedback(modalRating, sections, reasons, comment)}
          onSkip={() => submitFeedback(modalRating)}
          onClose={() => setModalRating(null)}
        />,
        document.body
      )}
    </>
  );
}

// ── 안전 포인트 상세 모달 ─────────────────────────────────────
function SafetyPointModal({ pt, onClose }: { pt: any; onClose: () => void }) {
  const isNew = pt.point_type === 'new';
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:99999, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:"var(--card, white)", borderRadius:"16px 16px 0 0", width:"100%", maxWidth:480, maxHeight:"80vh", overflowY:"auto", padding:16 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={"text-[9px] font-bold px-2 py-0.5 rounded-full " + (isNew ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700")}>{isNew ? "신설/강화" : "조문"}</span>
            <span className="text-[11px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{pt.item_id}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground text-lg px-2">✕</button>
        </div>
        <div className="space-y-3">
          {isNew ? (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">신설/강화</span>
                {pt.effective_date && <span className="text-[9px] text-muted-foreground">{pt.effective_date} 시행</span>}
              </div>
              <p className="text-[9px] text-blue-600 mb-2">설치 이후 강화된 기준 — 소급 적용 여부 확인 필요</p>
              <p className="text-[11px] text-foreground leading-relaxed whitespace-pre-wrap">{pt.old_desc}</p>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">종전</span>
                {pt.effective_date && <span className="text-[9px] text-muted-foreground">{String(pt.effective_date)}{pt.expiry_date ? ` ~ ${pt.expiry_date}` : ""}</span>}
              </div>
              <p className="text-[11px] text-foreground leading-relaxed whitespace-pre-wrap">{pt.old_desc}</p>
            </div>
          )}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">현행</span>
              <span className="text-[9px] text-muted-foreground">2022.3.2 시행</span>
            </div>
            <p className="text-[11px] text-foreground leading-relaxed whitespace-pre-wrap">{pt.cur_desc}</p>
          </div>
          {pt.warn && (
            <div className={"rounded-xl border p-3 " + (pt.warn.startsWith("⚠️") ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100")}>
              <p className={"text-[11px] leading-relaxed " + (pt.warn.startsWith("⚠️") ? "text-red-800" : "text-green-800")}>{pt.warn}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 승강기 기본정보 + 안전 포인트 카드 ──────────────────────────
function ElevatorInfoCard({ elevatorData, safetyPoints }: { elevatorData: any; safetyPoints: any[] }) {
  const [selectedPt, setSelectedPt] = React.useState<any>(null);
  const fmt = (d: number | string) => {
    const s = String(d);
    return s.length === 8 ? `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}` : s;
  };
  const installDate = fmt(elevatorData.installationDe || elevatorData.frstInstallationDe || "");

  return (
    <div className="mt-2 space-y-2 w-full max-w-sm text-xs">
      {/* 기본정보 카드 */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="bg-[#1e3a5f] text-white px-3 py-2.5">
          <p className="font-bold text-[12px]">{elevatorData.buldNm || "-"}</p>
          <p className="text-[10px] opacity-70">{elevatorData.address1} {elevatorData.address2 || ""}</p>
        </div>
        <div className="grid grid-cols-2">
          {[
            ["종류", `${elevatorData.elvtrKindNm || "-"}`],
            ["형식", `${elevatorData.elvtrForm || "-"} ${elevatorData.elvtrDetailForm || ""}`],
            ["정격속도", `${elevatorData.ratedSpeed || "-"} m/s`],
            ["적재하중", `${elevatorData.liveLoad || "-"} kg`],
            ["정원", `${elevatorData.ratedCap || "-"}명`],
            ["운행층수", `${elevatorData.shuttleFloorCnt || "-"}층`],
          ].map(([label, value], i) => (
            <div key={i} className={`px-3 py-2 border-b border-border ${i % 2 === 0 ? "border-r" : ""}`}>
              <p className="text-[9px] text-muted-foreground">{label}</p>
              <p className="text-[11px] font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800">
          <div>
            <p className="text-[10px] font-semibold text-blue-700 dark:text-blue-400">📅 설치일자</p>
            <p className="text-[9px] text-blue-500">건축허가일 근사값으로 사용</p>
          </div>
          <p className="text-[13px] font-bold text-blue-700 dark:text-blue-400">{installDate}</p>
        </div>
      </div>

      {/* 안전 포인트 */}
      {safetyPoints.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-[11px] font-bold text-foreground">🔍 오늘의 안전 포인트</p>
            {safetyPoints[0]?.point_type === 'new'
              ? <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">{installDate.slice(0,4)}년 이후 신설/강화 기준</span>
              : <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">{installDate.slice(0,4)}년 설치 기준</span>
            }
          </div>
          {selectedPt && createPortal(<SafetyPointModal pt={selectedPt} onClose={() => setSelectedPt(null)} />, document.body)}
          {safetyPoints.map((pt: any, i: number) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden mb-2 cursor-pointer" onClick={() => setSelectedPt(pt)}>
              <div className="flex items-center gap-2 px-3 pt-2.5 pb-1">
                <span className="text-[9px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{i + 1}</span>
                <span className="text-[9px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{pt.item_id}</span>
              </div>
              <div className="px-3 pb-1.5 space-y-1.5">
                <div className="flex gap-2 items-start">
                  <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">종전</span>
                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{pt.old_desc}</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">현행</span>
                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{pt.cur_desc}</p>
                </div>
              </div>
              {pt.warn && (
                <div className={"mx-3 mb-2.5 rounded-lg px-2.5 py-2 border " + (pt.warn.startsWith("⚠️") ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100")}>
                  <p className={"text-[10px] " + (pt.warn.startsWith("⚠️") ? "text-red-800" : "text-green-800")}>{pt.warn}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 균형추 최대 여유거리 계산 카드 ──────────────────────────────
function CounterWeightCalcCard() {
  const [targetStd, setTargetStd] = React.useState(0.5);
  const [targetLabel, setTargetLabel] = React.useState("가) 일반 부품");
  const [measured, setMeasured] = React.useState("");
  const [buffer, setBuffer] = React.useState("");
  const [speed, setSpeed] = React.useState("");
  const [result, setResult] = React.useState<{value: number; formula: string; pass: boolean} | null>(null);

  const targets = [
    { label: "가) 일반 부품", std: 0.5 },
    { label: "나) 가이드슈/롤러", std: 0.1 },
    { label: "다-1) 난간 안쪽", std: 0.3 },
    { label: "다-2) 난간 바깥쪽", std: 0.5 },
  ];

  const calculate = () => {
    const m = parseFloat(measured);
    const b = parseFloat(buffer);
    const s = parseFloat(speed);
    if (isNaN(m) || isNaN(b) || isNaN(s)) return;
    const bufM = b / 1000;
    const speedTerm = 0.035 * s * s;
    const val = m - targetStd - bufM - speedTerm;
    setResult({
      value: val,
      formula: `${m} − ${targetStd} − ${bufM.toFixed(3)} − (0.035 × ${s}²) = ${val.toFixed(3)} m`,
      pass: val >= 0,
    });
  };

  return (
    <div className="mt-2 rounded-xl border border-border overflow-hidden text-xs w-full max-w-sm">
      <div className="bg-blue-700 text-white px-3 py-2">
        <p className="font-bold text-[11px]">🔧 균형추 최대 여유거리 계산</p>
        <p className="text-[10px] opacity-80">공식: 측정값 − 기준값 − 완충기 행정 − (0.035 × 속도²)</p>
      </div>
      <div className="p-3 border-b border-border">
        <p className="text-[10px] font-bold text-muted-foreground mb-2">① 측정 대상</p>
        <div className="grid grid-cols-2 gap-1.5">
          {targets.map(tgt => (
            <button key={tgt.label} onClick={() => { setTargetStd(tgt.std); setTargetLabel(tgt.label); setResult(null); }}
              className={"rounded-lg border-2 p-2 text-left transition-colors " + (targetStd === tgt.std && targetLabel === tgt.label ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-border")}>
              <p className={"font-semibold text-[10px] " + (targetStd === tgt.std && targetLabel === tgt.label ? "text-blue-700 dark:text-blue-300" : "text-foreground")}>{tgt.label}</p>
              <p className="text-[9px] text-muted-foreground">기준값: {tgt.std} m</p>
            </button>
          ))}
        </div>
      </div>
      <div className="p-3 border-b border-border flex flex-col gap-2">
        <p className="text-[10px] font-bold text-muted-foreground">② 측정값 입력</p>
        {[
          { label: "현장 측정값", unit: "m", val: measured, set: setMeasured },
          { label: "완충기 행정", unit: "mm", val: buffer, set: setBuffer },
          { label: "정격속도", unit: "m/s", val: speed, set: setSpeed },
        ].map(row => (
          <div key={row.label} className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground w-20 flex-shrink-0">{row.label}</span>
            <input type="number" value={row.val} onChange={e => { row.set(e.target.value); setResult(null); }}
              className="flex-1 border border-border rounded-lg px-2 py-1.5 text-[12px] bg-background outline-none focus:border-blue-500" placeholder="0" />
            <span className="text-[10px] text-muted-foreground w-6">{row.unit}</span>
          </div>
        ))}
      </div>
      <div className="p-3">
        <button onClick={calculate} className="w-full bg-blue-600 text-white rounded-lg py-2 text-[12px] font-semibold">계산하기</button>
        {result && (
          <div className="mt-3 bg-muted/40 rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground mb-1">계산 과정</p>
            <p className="font-mono text-[10px] text-foreground mb-2">{result.formula}</p>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-foreground">{result.value.toFixed(3)} m</span>
              <span className={"text-[11px] font-bold px-3 py-1 rounded-full " + (result.pass ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>
                {result.pass ? "✅ 적합" : "❌ 부적합"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home({ defaultTab = "chat", role = "user", onLogout }: { defaultTab?: "chat" | "map"; role?: string; onLogout?: () => void }) {
  // [제거됨 — 2026-08-16] 예전엔 여기서 /api/standards(레거시 standards 테이블) + /api/std-overrides를
  // 병합해 모듈 전역 배열 STD_ITEMS를 채웠음. std_item_overrides가 표준화 자료의 단일 진실 소스가 된 뒤로는
  // 이 로직이 버그였음: STD_ITEMS는 컴포넌트 상태가 아닌 모듈 전역 mutable 배열이라 populate돼도
  // 리렌더를 트리거하지 않다가, 저장 후 refetchStdOverrides()로 allStdItems useMemo가 재계산되는
  // 순간에야 그 사이 비동기로 채워진 레거시 standards 데이터가 한꺼번에 화면에 노출됐다
  // ("저장하면 예전 항목이 보이고 새로고침하면 사라짐" 버그의 원인). STD_ITEMS는 이제 항상 빈 배열로 유지하고,
  // allStdItems는 std_item_overrides(DB)만 사용한다.
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: standards = [] } = useStandards();
  const { data: hotspots = [] } = useHotspots();

  // hotspots 위치 캐싱 (앱 시작 시 즉시 로드)
  useEffect(() => {
    if (hotspots.length > 0) {
      localStorage.setItem("hotspots_cache", JSON.stringify(hotspots));
      localStorage.setItem("hotspots_cache_ts", String(Date.now()));
    }
  }, [hotspots]);
  // 검사기준 DB 로드 (inspection-content.json 대체 — 정적 파일 사용 안 함)
  const { data: inspectionBaseItems } = useQuery({
    queryKey: ["/api/inspection-base-items"],
    queryFn: () => fetch("/api/inspection-base-items").then(r => r.json()),
    staleTime: 1000 * 60 * 10,
  });
  // 관리자 수정본(inspection_item_edits) — 있으면 base_items보다 우선 (judgment.tsx와 동일한 DB 우선 원칙)
  const { data: inspectionItemEdits } = useQuery({
    queryKey: ["/api/inspection-edits"],
    queryFn: () => fetch("/api/inspection-edits").then(r => r.json()),
    staleTime: 1000 * 60 * 10,
  });
  const INSPECTION_CONTENT = useMemo(() => {
    const editMap: Record<string, any> = Object.fromEntries(
      (inspectionItemEdits || []).map((e: any) => [e.itemId, e])
    );
    return Object.fromEntries(
      (inspectionBaseItems || []).map((item: any) => {
        const edit = editMap[item.itemId];
        const standardDatesRaw = edit?.standardDates || item.standardDates;
        return [
          item.itemId,
          {
            text: edit?.text || item.text || "",
            effectiveDate: edit?.effectiveDate || item.effectiveDate,
            customWarning: edit?.customWarning,
            standardNote: edit?.standardNote,
            revisions: standardDatesRaw
              ? (() => { try { return JSON.parse(standardDatesRaw); } catch { return []; } })()
              : []
          }
        ];
      })
    );
  }, [inspectionBaseItems, inspectionItemEdits]);

  const { data: stdOverrides, refetch: refetchStdOverrides } = useQuery<any[]>({
    queryKey: ["/api/std-overrides"],
    queryFn: () => fetch("/api/std-overrides", { cache: "no-store" }).then(r => r.json()),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
  // allStdItems — std_item_overrides(DB)가 단일 진실 소스. 레거시 STD_ITEMS/standards 폴백은 제거됨(2026-08-16).
  const allStdItems = useMemo(() => {
    const hotspotLabels = hotspots.map(h => h.label);
    const dbItems = stdOverrides || [];
    return dbItems.map((ov: any) => ({
      title: ov.title,           // 검색/매칭 키
      displayTitle: ov.overrideTitle || ov.title,  // 화면 표시용
      _key: ov.title,
      ref: ov.ref || "",
      basis: ov.basis || "",
      conclusion: ov.conclusion || "",
      source: ov.source || "",
      typeTag: ov.typeTag || "",
      category: normalizeCat(ov.category || "기타", hotspotLabels),
      manuallyEdited: ov.manuallyEdited || false,
    }));
  }, [stdOverrides, hotspots]);
  const createStandard = useCreateStandard();
  const updateStandard = useUpdateStandard();
  const deleteStandard = useDeleteStandard();
  const createCategory = useCreateCategory();
  const createHotspot = useCreateHotspot();
  const updateHotspot = useUpdateHotspot();
  const deleteHotspot = useDeleteHotspot();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomContentRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // 탭
  const [activeTab, setActiveTab] = useState<"chat" | "map">(defaultTab as "chat" | "map");
  const [selectedSearchResult, setSelectedSearchResult] = useState<SearchResult | null>(null);

  // 채팅
  const [showUsage, setShowUsage] = useState(false);
  const [usageStats, setUsageStats] = useState<any>(null);
  const [usageLoading, setUsageLoading] = useState(false);

  const fetchUsageStats = async () => {
    setUsageLoading(true);
    try {
      const r = await fetch("/api/ai-usage/stats");
      if (r.ok) setUsageStats(await r.json());
    } catch {}
    setUsageLoading(false);
  };

  // AI 검색 답변 모드 (빠른 답변 / 정밀 답변) — 기본값 빠른 답변, 선택값은 기기에 저장
  const [chatMode, setChatMode] = useState<"fast" | "precise">(() => {
    try {
      const saved = localStorage.getItem("aiChatMode");
      return saved === "precise" ? "precise" : "fast";
    } catch { return "fast"; }
  });
  const selectChatMode = (m: "fast" | "precise") => {
    setChatMode(m);
    try { localStorage.setItem("aiChatMode", m); } catch {}
  };

  // 업데이트 내역
  const [showChangelog, setShowChangelog] = useState(false);
  const [changelog, setChangelog] = useState<any[] | null>(null);
  const [changelogLoading, setChangelogLoading] = useState(false);

  const fetchChangelog = async () => {
    setChangelogLoading(true);
    try {
      const r = await fetch("/api/changelog");
      if (r.ok) setChangelog(await r.json());
    } catch {}
    setChangelogLoading(false);
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `안녕하세요! 승강기 안전검사 AI 어시스턴트입니다.\n\n검사기준, 판정 방법, 표준화 내용 등 궁금한 것을 자유롭게 물어보세요.\n\n예시)\n"0032-876 승강기 정보 조회해줘"\n"피트 정지장치 검사기준에 대해 알려줘"\n"접이식 난간대 표준화에 대해 알려줘"\n"균형추 최대 여유거리 구해줘"`,
      time: formatTime()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [accidentStats, setAccidentStats] = useState<{yearly: any[], age: any[]}>({ yearly: [], age: [] });
  const [statsLoaded, setStatsLoaded] = useState(false);

  // 구조도/표준화
  const [activeButtonId, setActiveButtonId] = useState<number | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);
  // 표준화 탭 상태
  const [stdCategory, setStdCategory] = useState("전체");
  const [stdSelected, setStdSelected] = useState<StdItem | null>(null);
  const [stdSearch, setStdSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStandard, setEditingStandard] = useState<Standard | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Standard | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isAdminMode, setIsAdminMode] = useState(() => isSuperAdminLoggedIn());
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [structureImg, setStructureImg] = useState<string>(defaultStructureImg);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // 카드 오프셋 (핫스팟 id → 카드 중심의 캔버스 % 위치)
  const [cardOffsets, setCardOffsets] = useState<Record<number, {cx: number, cy: number}>>({});
  const [stdComments, setStdComments] = useState<Record<string, any[]>>({});
  const [stdCommentInput, setStdCommentInput] = useState<Record<string, string>>({});
  const [stdDeleteConfirm, setStdDeleteConfirm] = useState<number | null>(null);;
  const [stdItemDeleteConfirm, setStdItemDeleteConfirm] = useState<{ key: string; displayTitle: string } | null>(null);
  const cardOffsetsRef = useRef<Record<number, {cx: number, cy: number}>>({});
  const [cardOffsetsLoaded, setCardOffsetsLoaded] = useState(false);
  const pinDragPosRef = useRef<{id: number, x: number, y: number} | null>(null);
  const [draggingCardId, setDraggingCardId] = useState<number | null>(null);
  const [cardDragOffset, setCardDragOffset] = useState({ x: 0, y: 0 });
  const [showAddHotspot, setShowAddHotspot] = useState(false);
  const [newHotspotLabel, setNewHotspotLabel] = useState("");
  const [deleteHotspotConfirm, setDeleteHotspotConfirm] = useState<Hotspot | null>(null);

  useEffect(() => { cardOffsetsRef.current = cardOffsets; }, [cardOffsets]);

  const fuse = useMemo(() => new Fuse(standards, { keys: ["title", "body", "standardNumber"], threshold: 0.4 }), [standards]);

  const displayItems = useMemo(() => {
    if (searchTerm.length > 0) return fuse.search(searchTerm).map(r => r.item);
    if (activeButtonId) {
      const h = hotspots.find(h => h.id === activeButtonId);
      if (h) return standards.filter(s => s.categoryId === h.categoryId);
    }
    return standards;
  }, [standards, searchTerm, activeButtonId, fuse, hotspots]);

  const activeButton = hotspots.find(h => h.id === activeButtonId);

  // 공공데이터 통계 로드 - 서버 요약 API 사용
  useEffect(() => {
    fetch("/api/stats-summary")
      .then(r => r.json())
      .then(data => {
        setStatsLoaded(true);
        // accidentStats도 업데이트 (질문 답변용)
        if (data.year) {
          setAccidentStats({
            yearly: [{ wrttimeid: data.year, safe_acci_smry: data.total, safe_acci_only_passenger: data.passenger, safe_acci_only_freight: data.freight, safe_acci_escalator: data.escalator, expcas_death: data.deaths, expcas_serious_injury: data.serious }],
            age: []
          });
        }
      })
      .catch(() => { setStatsLoaded(true); });
  }, []);


  // 서버에서 설정 로드
  useEffect(() => {
    fetch("/api/settings/cardOffsets")
      .then(r => r.json())
      .then(d => {
        if (d.value) {
          const parsed = JSON.parse(d.value);
          cardOffsetsRef.current = parsed;
          setCardOffsets(parsed);
        }
        setCardOffsetsLoaded(true);
      })
      .catch(() => { setCardOffsetsLoaded(true); });
    fetch("/api/settings/structureImg")
      .then(r => r.json())
      .then(d => { if (d.value) setStructureImg(d.value); })
      .catch(() => {});
  }, []);

  // 채팅 스크롤 - 첫 렌더링 제외
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 메시지 전송
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text, time: formatTime() };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // 사고 통계 질문 처리 (기존 로직 유지)
    const q = text.toLowerCase();
    if ((q.includes("사고") || q.includes("통계") || q.includes("연도별")) && accidentStats.yearly.length > 0) {
      const latest = accidentStats.yearly[accidentStats.yearly.length - 1];
      const prev = accidentStats.yearly[accidentStats.yearly.length - 2];
      if (latest) {
        const answer = `공공데이터 기준 최신 승강기 안전사고 통계\n\n${latest.wrttimeid || latest.year || latest.stdr_year}년 현황\n• 승객용 엘리베이터: ${latest.pasngr_elvtr_acc_cnt || "-"}건\n• 화물용 엘리베이터: ${latest.freight_elvtr_acc_cnt || "-"}건\n• 에스컬레이터: ${latest.escalator_acc_cnt || "-"}건\n• 합계: ${latest.tot_acc_cnt || "-"}건${prev ? `\n\n전년(${prev.wrttimeid || prev.year || prev.stdr_year}년) 대비 추이를 확인하시려면 검사가이드 페이지를 참고하세요.` : ""}\n\n출처: 행정안전부 통계연보`;
        setMessages(prev => [...prev, { role: "assistant", content: answer, time: formatTime() }]);
        setIsTyping(false);
        return;
      }
    }
    if ((q.includes("연령") || q.includes("나이") || q.includes("고령")) && accidentStats.age.length > 0) {
      const latest = accidentStats.age[accidentStats.age.length - 1];
      const tot = parseInt(latest.tot);
      const child = parseInt(latest.old14_lss);
      const adult = parseInt(latest.old15_mor_old64_lss);
      const elder = parseInt(latest.old65_mor);
      const answer = `행정안전부 연령별 사고 통계 (${latest.wrttimeid}년)\n\n• 14세 이하: ${child}명 (${Math.round(child/tot*100)}%)\n• 15~64세: ${adult}명 (${Math.round(adult/tot*100)}%)\n• 65세 이상: ${elder}명 (${Math.round(elder/tot*100)}%)\n• 합계: ${tot}명\n\n출처: 행정안전부 통계연보`;
      setMessages(prev => [...prev, { role: "assistant", content: answer, time: formatTime() }]);
      setIsTyping(false);
      return;
    }

    // ⑩ Query Rewriting — 서버 API를 통해 Haiku로 최적 검색어 생성 (CORS 방지)
    let searchQueries: string[] = [text];
    try {
      const qrRes = await fetch("/api/query-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text })
      });
      if (qrRes.ok) {
        const qrData = await qrRes.json();
        if (Array.isArray(qrData.queries) && qrData.queries.length > 0) {
          searchQueries = [text, ...qrData.queries.filter((q: string) => q !== text)];
        }
      }
    } catch {}

    // ⑦ 멀티 쿼리 검색 — 각 검색어로 검색 후 교집합 우선
    let results = searchAllData(text, standards, stdOverrides, INSPECTION_CONTENT);
    if (searchQueries.length > 1) {
      const multiResults: Map<string, { result: SearchResult; hitCount: number; maxScore: number }> = new Map();
      for (const q of searchQueries) {
        const r = searchAllData(q, standards, stdOverrides, INSPECTION_CONTENT);
        r.forEach(item => {
          const key = `${item.type}:${item.title.slice(0, 30)}`;
          const existing = multiResults.get(key);
          if (existing) {
            existing.hitCount++;
            existing.maxScore = Math.max(existing.maxScore, item.score || 0);
          } else {
            multiResults.set(key, { result: item, hitCount: 1, maxScore: item.score || 0 });
          }
        });
      }
      // 여러 쿼리에 모두 나온 항목 우선 (교집합), 점수 보정
      const merged = [...multiResults.values()]
        .map(({ result, hitCount, maxScore }) => ({
          ...result,
          score: maxScore + (hitCount > 1 ? 40 * (hitCount - 1) : 0)
        }))
        .sort((a, b) => (b.score || 0) - (a.score || 0));
      if (merged.length > 0) results = merged;
    }

    // ── 채팅 메시지 검색 (별도 보관 — UI 표시용)
    let chatResults: SearchResult[] = [];
    try {
      const chatRes = await fetch(`/api/chat-messages?search=${encodeURIComponent(text)}&limit=20`);
      if (chatRes.ok) {
        const chatMsgs = await chatRes.json();
        chatResults = chatMsgs.map((m: any) => ({
          type: "chat" as const,
          title: m.content.slice(0, 50).replace(/\n/g, " "),
          content: m.content.slice(0, 150),
          query: String(m.id),
          score: 50,
          chatMeta: {
            id: m.id,
            userName: m.userName,
            createdAt: m.createdAt,
            replyToUser: m.replyToUser,
            replyToContent: m.replyToContent,
            hasImage: false,
          },
        }));
        // UI 검색 결과에는 채팅도 포함 (표시용)
        results = [...results, ...chatResults];
      }
    } catch {}

    // 카드 표시 제한:
    // 1) score 기준 정렬
    // 2) 타입별 최대 1개 (정확도 높은 것 1개씩)
    // 3) 전체 최대 3개
    const limitedResults = results.length > 0 ? (() => {
      const sorted = [...results].sort((a, b) => (b.score || 0) - (a.score || 0));
      const typeSeen = new Set<string>();
      const out: typeof sorted = [];
      for (const r of sorted) {
        if (typeSeen.has(r.type)) continue;
        typeSeen.add(r.type);
        out.push(r);
        if (out.length >= 3) break;
      }
      return out;
    })() : [];
    const searchResults = limitedResults.length > 0 ? limitedResults : undefined;

    // AI API 호출
    try {
      // 대화 히스토리 구성 (최근 8개)
      const historyMsgs = messages
        .slice(-8)
        .filter(m => m.role === "user" || m.role === "assistant")
        .map(m => ({ role: m.role as "user" | "assistant", content: m.content }));
      historyMsgs.push({ role: "user", content: text });

      // ── 우선순위별 컨텍스트 구성 ──

      // ② 주/보조 키워드 분리 + 핵심 개념 하드 필터
      const { primary: primaryTerms, secondary: secondaryTerms } = splitKeywords(text);
      const coreTerms = primaryTerms; // Rerank용 핵심어

      const hardFiltered = primaryTerms.length > 0
        ? results.filter(r => {
            const combined = (r.title + " " + r.content).toLowerCase();
            // 주 키워드 중 하나라도 포함된 항목만 통과 (보조 키워드는 의도 파악용)
            return primaryTerms.some(term => combined.includes(term.toLowerCase()));
          })
        : results;

      // ③ score 임계값 상향 — 130 미만 제외 (관련성 낮은 카드 제거)
      const filteredResults = hardFiltered.filter(r => (r.score || 0) >= 130);
      let contextResults = filteredResults.length > 0 ? filteredResults : hardFiltered.slice(0, 4);

      // ★ Rerank — Sonnet으로 정밀 관련성 판단 (Haiku→Sonnet 업그레이드)
      try {
        const candidates = contextResults.slice(0, 15).map((r, i) => ({
          id: String(i),
          title: r.title,
          content: r.content.slice(0, 400), // 150→400자 확대 — 본문 뒷부분의 핵심 정보(날짜/결론) 누락 방지
          type: r.type,
        }));
        const rrRes = await fetch("/api/rerank", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: text, candidates, coreTerms: primaryTerms, secondaryTerms }),
        });
        if (rrRes.ok) {
          const { ranked } = await rrRes.json();
          if (Array.isArray(ranked) && ranked.length > 0) {
            const rankedTitles = new Set(ranked.map((r: any) => r.title));
            const rest = contextResults.filter(r => !rankedTitles.has(r.title));
            contextResults = [
              ...ranked.map((r: any) => ({ ...r, score: (r.score || 0) + 100 })),
              ...rest,
            ];
          }
        }
      } catch {}

      // 1) 검사기준(별표22) — 최대 2개 (score 높은 순), 항목당 600자
      const stdResults = contextResults.filter(r => r.type !== "chat" && r.type !== "standard" && r.source !== "standards_db");
      const inspCtx = stdResults.slice(0, 2).map(r => {
        // 날짜 데이터 포함 — inspection-content.json의 effectiveDate/revisions
        const inspEntry = (INSPECTION_CONTENT as any)[r.query || ""];
        const effectiveDate = inspEntry?.effectiveDate
          ? `적용일: ${inspEntry.effectiveDate.replace(/-/g, ".")} 이후 건축허가분` : "";
        const revisionNote = inspEntry?.revisions?.[0]?.description || "";
        const dateInfo = effectiveDate || revisionNote ? `
[적용시기] ${effectiveDate || revisionNote}` : "";
        return {
          priority: "검사기준",
          title: r.title,
          ref: r.query || "",
          content: r.content.slice(0, 600) + dateInfo,
        };
      }).filter(c => c.content);

      // 2) 기술자료(표준화) — 최대 1개 (Rerank 후 최상위만), 항목당 500자
      // + 검사기준 조문번호로 표준화 교차검색 (ref 역참조)
      const inspRefNums = inspCtx.map(c => c.ref).filter(Boolean);
      const crossRefItems = inspRefNums.length > 0
        ? allStdItems.filter(s =>
            inspRefNums.some(ref => (s.ref||"").includes(ref.replace(/\[.*?\]\s*/, '').trim()))
          ).map(s => ({ type: "standard" as const, title: s.title, content: (s.conclusion||"").slice(0, 100), query: s.title, score: 180 }))
        : [];
      const techResults = [
        ...contextResults.filter(r => r.type === "standard"),
        ...crossRefItems.filter(cr => !contextResults.find(r => r.title === cr.title)),
      ];
      const techCtx = techResults.slice(0, 3).map(r => {
        const std = STD_ITEMS.find(s => s.title === r.title);
        const ov = stdOverrides?.find((o: any) => o.title === r.title);
        const title = ov?.overrideTitle || std?.title || ov?.title || r.title;
        // DB 오버라이드 우선 — 최신 수정값 반영
        const ref   = ov?.ref   || std?.ref   || "";
        const basis = (ov?.basis || std?.basis || "").slice(0, 300);
        const conclusionRaw = ov?.conclusion || std?.conclusion || "";
        return {
          priority: "기술자료(표준화)",
          title,
          ref,
          basis,
          conclusion: conclusionRaw.length > 10 ? conclusionRaw.slice(0, 600) : "",
          source: ov?.source || std?.source || "",
          // 건축허가일/검사기준적용일/검사일 — std_item_overrides에만 있는 필드(레거시 STD_ITEMS엔 없음)
          permitDate: (ov as any)?.permitDate || "",
          inspectionDate: (ov as any)?.inspectionDate || "",
          inspectionYear: (ov as any)?.inspectionYear || "",
          installInspectionDate: (ov as any)?.installInspectionDate || "",
        };
      }).filter(c => c.basis || c.conclusion);

      // 2.5) 판정지침(승강기검사결과 판정지침) — 키워드 매칭 최대 2개, 항목당 600자
      const verdictScored = Object.values(JUDGMENT_SECTIONS_AI).map(sec => {
        const bodyText = judgmentSectionToText(sec);
        const combined = (sec.title + " " + bodyText).toLowerCase();
        let score = 0;
        primaryTerms.forEach(t => { if (t && combined.includes(t.toLowerCase())) score += 40; });
        secondaryTerms.forEach(t => { if (t && combined.includes(t.toLowerCase())) score += 10; });
        return { title: sec.title, bodyText, score };
      }).filter(e => e.score >= 40).sort((a, b) => b.score - a.score);
      const verdictCtx = verdictScored.slice(0, 2).map(e => ({
        priority: "판정지침",
        title: e.title,
        content: e.bodyText.slice(0, 600),
      })).filter(c => c.content);

      // 3) 채팅 참고 — 최대 2개, 항목당 150자 (실무 참고용)
      const chatCtx = chatResults.slice(0, 2).map(r => ({
        priority: "채팅참고(현장의견)",
        content: r.content.slice(0, 150),
        note: "공식 기준 아님 — 현장 검사원 대화 참고용",
      })).filter(c => c.content);

      // 정밀안전검사 RULES — 질문 키워드와 관련된 항목만 추출
      const PRECISION_RULES_SUMMARY = [
        { situation: "공사 지연 (부품 설치)", judgment: "조건부합격 2+2개월", basis: "제13조제3항제1호" },
        { situation: "안전성평가 미완료", judgment: "조건부합격 2+2개월", basis: "제13조제3항제1호" },
        { situation: "재난 발생 출입차단", judgment: "최대 1년 이내 안전검사", basis: "제13조제3항제2호" },
        { situation: "단계적 이행 1단계", judgment: "최대 1년6개월 (주기별 분기)", basis: "제13조제3항제2호" },
        { situation: "단계적 이행 2단계 전체교체/재개발/이동편의", judgment: "추가 1년", basis: "제13조제3항제2호" },
        { situation: "단계적 이행 2단계 부분교체", judgment: "추가 6개월+6개월", basis: "제13조제3항제2호" },
        { situation: "단계적 이행 2단계 이사장 인정", judgment: "추가 6개월", basis: "제13조제3항제2호" },
        { situation: "공동주택 서면동의 3년 유예", judgment: "조건부합격 3년 (입주민 2/3↑)", basis: "부칙 제3조제3항" },
        { situation: "대수선 없이 이행 불가", judgment: "적용제외 처리", basis: "부칙 제2조제4항" },
      ];
      const qLower = text.toLowerCase();
      const precisionKeywords = ["정밀", "이행기간", "조건부합격", "단계적", "재난", "공사지연", "유예", "대수선", "안전성평가"];
      const hasPrecisionQ = precisionKeywords.some(k => qLower.includes(k));
      const precisionCtx = hasPrecisionQ ? PRECISION_RULES_SUMMARY : [];

      const context = { inspCtx, techCtx, verdictCtx, chatCtx, precisionCtx };

      // AI가 실제로 참고한 항목을 SearchResult로 변환 (카드 표시용)
      const contextUsed: SearchResult[] = [
        // 1순위: 검사기준 컨텍스트 항목
        ...inspCtx.map(c => ({
          type: "inspection" as const,
          title: c.title,
          content: c.content.slice(0, 150),
          query: c.ref,
          score: 200,
          priority: 1,
        })),
        // 2순위: 표준화 컨텍스트 항목
        ...techCtx.map(c => ({
          type: "standard" as const,
          title: c.title,
          content: c.conclusion ? c.conclusion.slice(0, 150) : c.basis.slice(0, 150),
          query: c.ref,
          score: 190,
          priority: 2,
        })),
        // 3순위: 채팅 참고 항목
        ...chatResults.slice(0, 2).map(r => ({
          ...r,
          score: 100,
          priority: 3,
        })),
      ];

      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyMsgs, context, mode: chatMode }),
      });

      if (!resp.ok) throw new Error("서버 오류");
      const data = await resp.json();

      // ── 에이전트가 실제 사용한 자료를 카드로 변환 ──────────────
      const usedSources: { type: string; title: string; ref: string }[] = data.usedSources || [];

      const sourceCards: SearchResult[] = usedSources.map(s => {
        if (s.type === "inspection") {
          // 검사기준 — s.ref/s.title에서 정확한 조문번호(예: "1.9.1") 추출 후 정확히 매칭
          const refText = `${s.ref || ""} ${s.title || ""}`;
          const numMatch = refText.match(/(?<![\d.])(?:[1-9]|1[0-7])(?:\.\d+){1,5}/);
          const itemNo = numMatch ? numMatch[0] : "";
          // 1순위: key(조문번호)가 정확히 일치하는 항목
          let entry = itemNo ? Object.entries(INSPECTION_CONTENT).find(([k]) => k === itemNo) : undefined;
          // 2순위: key가 itemNo로 시작하는 항목(하위 조문 등)
          if (!entry && itemNo) {
            entry = Object.entries(INSPECTION_CONTENT).find(([k]) => k.startsWith(itemNo + "-") || k === itemNo);
          }
          return {
            type: "inspection" as const,
            title: s.title,
            content: (entry?.[1] as any)?.text?.slice(0, 300) || s.title,
            query: entry?.[0] || itemNo || s.ref,
            score: 200,
            priority: 1,
          };
        }
        if (s.type === "standard") {
          // 표준화 — 2단계 검증
          // 1차: AI가 인용한 s.title(=source 값, 예 "2016년 제3차 표준화")과 DB source가 일치하는 후보군 추출
          const sourcePool = [...(stdOverrides || []), ...STD_ITEMS];
          const candidates = sourcePool.filter((o: any) =>
            o.source && (s.title.includes(o.source) || o.source.includes(s.title))
          );
          // 2차: 후보가 여러 개면 AI 답변 본문(data.reply)에 해당 항목의 실제 결론/기준 문구가
          // 실제로 등장하는지 확인해서 정확한 1개로 좁힌다 (동일 차수 표준화 내 중복 방지)
          let ov: any = candidates[0];
          if (candidates.length > 1) {
            const replyText: string = data.reply || "";
            const matched = candidates.find((c: any) => {
              const snippet = (c.conclusion || c.basis || "").slice(0, 30).trim();
              return snippet.length > 5 && replyText.includes(snippet);
            });
            if (matched) ov = matched;
          }
          const realTitle = ov?.overrideTitle || ov?.title || s.title;
          return {
            type: "standard" as const,
            title: realTitle,
            content: ov?.conclusion || ov?.basis || s.title,
            query: realTitle,
            score: 200,
            priority: 2,
          };
        }
        return { type: s.type as any, title: s.title, content: s.title, query: s.title, score: 200 };
      }).filter(Boolean);

      // 조문 카드 (서버에서 받은 article 데이터)
      const articleCards: SearchResult[] = (data.articleCards || []).map((a: any) => ({
        type: "article" as const,
        title: `[별표22] ${a.itemId}`,
        content: (a.versions?.find((v: any) => v.type === "current")?.description || "").slice(0, 80),
        query: a.itemId,
        score: 300,
        priority: 0,
        versions: a.versions,
      }));

      // usedSources 카드 없으면 기존 키워드 검색 카드 사용 (타입별 1개, 최대 3개)
      let displayCards: SearchResult[];
      if (sourceCards.length > 0 || articleCards.length > 0) {
        displayCards = [...articleCards, ...sourceCards].slice(0, 5);
      } else {
        const contextTitles = new Set(contextUsed.map(r => r.title));
        const extraResults = results.filter(r => !contextTitles.has(r.title)).slice(0, 6);
        const finalResults = [...contextUsed, ...extraResults];
        const scored = finalResults.filter(r => (r.score || 0) >= 130);
        const typeSeen = new Set<string>();
        displayCards = scored
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .filter(r => { if (typeSeen.has(r.type)) return false; typeSeen.add(r.type); return true; })
          .slice(0, 3);
      }

      // CALCULATE 유형이라도 전용 카드(calcCard)가 없는 경우엔 텍스트 답변을 그대로 보여준다.
      // (전용 카드가 있는 경우만 카드가 안내를 대신하므로 본문 텍스트를 비운다)
      const hasCalcCard = data.type === "CALCULATE" && !!data.calcCard;
      setMessages(prev => [...prev, {
        role: "assistant",
        content: hasCalcCard ? "" : data.reply,
        time: formatTime(),
        searchResults: hasCalcCard ? undefined : (displayCards.length > 0 ? displayCards : undefined),
        calcCard: data.type === "CALCULATE" ? data.calcCard : undefined,
        elevatorData: data.elevatorData || null,
        safetyPoints: data.safetyPoints || [],
        isElevatorQuery: data.isElevatorQuery || false,
        mode: data.mode,
        elapsedMs: data.elapsedMs,
      }]);
    } catch (err: any) {
      console.error("Chat fetch error:", err);
      // AI 실패 시 기존 키워드 검색 결과로 폴백
      const fallback = searchResults
        ? `"${text}"에 대한 검색 결과 ${results.length}건입니다. 아래 항목을 눌러 확인하세요.`
        : `"${text}"에 대한 검색 결과가 없습니다. 다른 키워드로 검색해보세요.`;
      setMessages(prev => [...prev, {
        role: "assistant",
        content: fallback,
        time: formatTime(),
        searchResults,
      }]);
    }
    setIsTyping(false);
  }, [accidentStats, standards, messages, chatMode]);

  // 리더라인 설정 (카드 오프셋 저장값 우선, 없으면 자동 계산)
  const getCardOffset = useCallback((hotspot: Hotspot, canvasW: number, canvasH: number) => {
    const x = (parseFloat(hotspot.left) / 100) * canvasW;
    const y = (parseFloat(hotspot.top) / 100) * canvasH;
    const cardW = 144;
    const cardH = 52;

    let cardCX: number, cardCY: number;

    const offsetKey = String(hotspot.id);
    if ((cardOffsets as any)[offsetKey]) {
      cardCX = ((cardOffsets as any)[offsetKey].cx / 100) * canvasW;
      cardCY = ((cardOffsets as any)[offsetKey].cy / 100) * canvasH;
    } else {
      // 자동 계산
      const lineLen = 55;
      const goLeft = x > canvasW * 0.55;
      const goUp = y > canvasH * 0.6;
      const dx = goLeft ? -lineLen : lineLen;
      const dy = goUp ? -lineLen * 0.6 : lineLen * 0.6;
      cardCX = x + dx + (goLeft ? -cardW / 2 : cardW / 2);
      cardCY = y + dy;
    }

    const cardX = cardCX - cardW / 2;
    const cardY = cardCY - cardH / 2;
    return { cardX, cardY, cardW, cardH, cardCX, cardCY };
  }, [cardOffsets]);

  // Canvas 그리기 (리더라인 + 카드형 태그)
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.src = structureImg;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      hotspots.forEach((hotspot) => {
        const x = (parseFloat(hotspot.left) / 100) * canvas.width;
        const y = (parseFloat(hotspot.top) / 100) * canvas.height;
        const isActive = activeButtonId === hotspot.id;
        const { cardX, cardY, cardW, cardH, cardCX, cardCY } = getCardOffset(hotspot, canvas.width, canvas.height);

        // 활성화 시 부품 하이라이트 (은은한 원형 글로우)
        if (isActive) {
          ctx.save();
          const grd = ctx.createRadialGradient(x, y, 0, x, y, 35);
          grd.addColorStop(0, "rgba(37,99,235,0.18)");
          grd.addColorStop(1, "rgba(37,99,235,0)");
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(x, y, 35, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 앵커 점 - 드래그 중이면 현재 위치로 덮어쓰기
        const dragPos = pinDragPosRef.current;
        const isDraggingThis = dragPos && dragPos.id === hotspot.id;
        const drawX = isDraggingThis ? dragPos.x : x;
        const drawY = isDraggingThis ? dragPos.y : y;
        ctx.save();
        ctx.beginPath();
        ctx.arc(drawX, drawY, isAdminMode ? 10 : 8, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? "#2563eb" : isAdminMode ? "#ea580c" : "#475569";
        ctx.shadowColor = isActive ? "rgba(37,99,235,0.5)" : "rgba(0,0,0,0.3)";
        ctx.shadowBlur = isActive ? 8 : 4;
        ctx.fill();
        ctx.restore();

        // 리더라인 (앵커 → 카드 중심)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(drawX, drawY);
        ctx.lineTo(cardCX, drawY);
        ctx.lineTo(cardCX, cardCY);
        ctx.strokeStyle = isActive ? "rgba(37,99,235,0.7)" : isAdminMode ? "rgba(234,88,12,0.6)" : "rgba(71,85,105,0.45)";
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.setLineDash(isActive ? [] : [4, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // 카드 배경
        const r = 6;
        ctx.save();
        ctx.shadowColor = isActive ? "rgba(37,99,235,0.25)" : "rgba(0,0,0,0.12)";
        ctx.shadowBlur = isActive ? 10 : 5;
        ctx.shadowOffsetY = 2;
        ctx.beginPath();
        ctx.moveTo(cardX + r, cardY);
        ctx.lineTo(cardX + cardW - r, cardY);
        ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r);
        ctx.lineTo(cardX + cardW, cardY + cardH - r);
        ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH);
        ctx.lineTo(cardX + r, cardY + cardH);
        ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r);
        ctx.lineTo(cardX, cardY + r);
        ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY);
        ctx.closePath();
        ctx.fillStyle = isActive ? "#2563eb" : isAdminMode ? "#ea580c" : "rgba(255,255,255,0.92)";
        ctx.fill();

        // 카드 테두리
        ctx.strokeStyle = isActive ? "#1d4ed8" : isAdminMode ? "#c2410c" : "rgba(203,213,225,0.8)";
        ctx.lineWidth = isActive ? 0 : 0.8;
        ctx.stroke();
        ctx.restore();

        // 카드 텍스트
        ctx.save();
        ctx.fillStyle = isActive ? "#ffffff" : isAdminMode ? "#ffffff" : "#1e293b";
        ctx.font = `${isActive ? "600" : "500"} 10px -apple-system, 'Pretendard', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(hotspot.label, cardX + cardW / 2, cardY + cardH / 2);
        ctx.restore();
      });
    };
  }, [hotspots, activeButtonId, structureImg, isAdminMode, cardOffsets, cardOffsetsLoaded]);

  useEffect(() => { if (activeTab === "map" && cardOffsetsLoaded) drawCanvas(); }, [drawCanvas, activeTab, cardOffsetsLoaded]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setStructureImg(result);
      fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "structureImg", value: result })
      }).catch(() => {});
      toast({ title: "구조도 이미지가 변경되었습니다." });
    };
    reader.readAsDataURL(file);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, px: 0, py: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    return { x: (px / canvas.width) * 100, y: (py / canvas.height) * 100, px, py };
  };

  // 터치 이벤트 → 마우스 이벤트 변환 헬퍼
  const getTouchCanvasCoords = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, px: 0, py: 0 };
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = (touch.clientX - rect.left) * scaleX;
    const py = (touch.clientY - rect.top) * scaleY;
    return { x: (px / canvas.width) * 100, y: (py / canvas.height) * 100, px, py };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isAdminMode) return;
    e.preventDefault();
    const { px, py } = getTouchCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 카드 드래그 감지
    for (const hotspot of hotspots) {
      const { cardX, cardY, cardW, cardH, cardCX, cardCY } = getCardOffset(hotspot, canvas.width, canvas.height);
      if (px >= cardX && px <= cardX + cardW && py >= cardY && py <= cardY + cardH) {
        setDraggingCardId(hotspot.id);
        setCardDragOffset({ x: px - cardCX, y: py - cardCY });
        return;
      }
    }

    // 핀(앵커) 드래그 감지
    hotspots.forEach(hotspot => {
      const btnX = (parseFloat(hotspot.left) / 100) * canvas.width;
      const btnY = (parseFloat(hotspot.top) / 100) * canvas.height;
      if (Math.hypot(px - btnX, py - btnY) < 50) {
        setDraggingId(hotspot.id);
        setDragOffset({ x: px - btnX, y: py - btnY });
      }
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isAdminMode) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const px = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const py = (touch.clientY - rect.top) * (canvas.height / rect.height);

    // 카드 드래그 - 실시간 업데이트
    if (draggingCardId !== null) {
      const newCX = px - cardDragOffset.x;
      const newCY = py - cardDragOffset.y;
      const touchHotspot = hotspots.find(h => h.id === draggingCardId);
      const touchKey = String(draggingCardId);
      const newOffsets = {
        ...cardOffsets,
        [touchKey]: {
          cx: (newCX / canvas.width) * 100,
          cy: (newCY / canvas.height) * 100,
        }
      };
      setCardOffsets(newOffsets);
      // 실시간 캔버스 재드로우
      setTimeout(() => drawCanvas(), 0);
      return;
    }

    // 핀 드래그 - 실시간 캔버스 업데이트
    if (draggingId !== null) {
      const x = Math.max(20, Math.min(canvas.width - 20, px - dragOffset.x));
      const y = Math.max(20, Math.min(canvas.height - 20, py - dragOffset.y));
      drawCanvas();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(234,88,12,0.9)";
      ctx.fill();
      ctx.strokeStyle = "#fed7aa";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isAdminMode) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const px = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const py = (touch.clientY - rect.top) * (canvas.height / rect.height);

    // 카드 위치 저장
    if (draggingCardId !== null) {
      fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "cardOffsets", value: JSON.stringify(cardOffsetsRef.current) })
      }).catch(() => {});
      setDraggingCardId(null);
      return;
    }

    // 핀 위치 저장
    if (draggingId !== null) {
      const x = Math.max(20, Math.min(canvas.width - 20, px - dragOffset.x));
      const y = Math.max(20, Math.min(canvas.height - 20, py - dragOffset.y));
      const newLeft = (x / canvas.width) * 100;
      const newTop = (y / canvas.height) * 100;
      const hotspot = hotspots.find(h => h.id === draggingId);
      if (hotspot) {
        updateHotspot.mutate({ id: draggingId, hotspot: { left: String(newLeft.toFixed(2)), top: String(newTop.toFixed(2)) } });
      }
      setDraggingId(null);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingId !== null) return;
    const { px, py } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    hotspots.forEach(hotspot => {
      const x = (parseFloat(hotspot.left) / 100) * canvas.width;
      const y = (parseFloat(hotspot.top) / 100) * canvas.height;
      const { cardX, cardY, cardW, cardH } = getCardOffset(hotspot, canvas.width, canvas.height);
      // 앵커점 또는 카드 영역 클릭 감지
      const hitAnchor = Math.hypot(px - x, py - y) < 40;
      const hitCard = px >= cardX && px <= cardX + cardW && py >= cardY && py <= cardY + cardH;
      if ((hitAnchor || hitCard) && !isAdminMode) {
        setActiveButtonId(hotspot.id);
        // 구조도 핀 클릭 시에도 하단 탭 버튼과 동일하게 표준화 목록을 해당 분류로 필터링
        setStdCategory(hotspot.label);
        setStdSelected(null);
      }
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isAdminMode) return;
    const { px, py } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 카드 드래그 감지 (앵커보다 먼저 체크)
    for (const hotspot of hotspots) {
      const { cardX, cardY, cardW, cardH, cardCX, cardCY } = getCardOffset(hotspot, canvas.width, canvas.height);
      if (px >= cardX && px <= cardX + cardW && py >= cardY && py <= cardY + cardH) {
        setDraggingCardId(hotspot.id);
        setCardDragOffset({ x: px - cardCX, y: py - cardCY });
        return;
      }
    }

    hotspots.forEach(hotspot => {
      const btnX = (parseFloat(hotspot.left) / 100) * canvas.width;
      const btnY = (parseFloat(hotspot.top) / 100) * canvas.height;
      if (Math.hypot(px - btnX, py - btnY) < 50) {
        setDraggingId(hotspot.id);
        setDragOffset({ x: px - btnX, y: py - btnY });
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isAdminMode) return;

    // 카드 드래그 이동
    if (draggingCardId !== null) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const px = (e.clientX - rect.left) * (canvas.width / rect.width);
      const py = (e.clientY - rect.top) * (canvas.height / rect.height);
      const newCX = px - cardDragOffset.x;
      const newCY = py - cardDragOffset.y;
      const draggingHotspot = hotspots.find(h => h.id === draggingCardId);
      const draggingKey = String(draggingCardId);
      const newOffsets = {
        ...cardOffsetsRef.current,
        [draggingKey]: {
          cx: (newCX / canvas.width) * 100,
          cy: (newCY / canvas.height) * 100,
        }
      };
      cardOffsetsRef.current = newOffsets;
      setCardOffsets(newOffsets);
      // 즉시 캔버스 재드로우 (ref 기반)
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.src = structureImg;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          hotspots.forEach(h => {
            const hx = (parseFloat(h.left)/100)*canvas.width;
            const hy = (parseFloat(h.top)/100)*canvas.height;
            const co = cardOffsetsRef.current[h.id];
            const cardCX = co ? (co.cx/100)*canvas.width : hx + 80;
            const cardCY = co ? (co.cy/100)*canvas.height : hy;
            const cardW = 144, cardH = 52;
            const cardX = cardCX - cardW/2, cardY = cardCY - cardH/2;
            ctx.fillStyle = h.id === draggingCardId ? "#ea580c" : "rgba(255,255,255,0.92)";
            ctx.strokeStyle = "#cbd5e1";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardW, cardH, 6);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = h.id === draggingCardId ? "#fff" : "#1e293b";
            ctx.font = "500 20px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(h.label, cardCX, cardCY);
            ctx.beginPath();
            ctx.arc(hx, hy, 8, 0, Math.PI*2);
            ctx.fillStyle = "#ea580c";
            ctx.fill();
          });
        };
      }
      return;
    }

    if (draggingId === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (canvas.width / rect.width) - dragOffset.x;
    const py = (e.clientY - rect.top) * (canvas.height / rect.height) - dragOffset.y;
    const clampedX = Math.max(20, Math.min(canvas.width - 20, px));
    const clampedY = Math.max(20, Math.min(canvas.height - 20, py));
    pinDragPosRef.current = { id: draggingId, x: clampedX, y: clampedY };
    drawCanvas();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const x = Math.max(20, Math.min(canvas.width-20, px));
    const y = Math.max(20, Math.min(canvas.height-20, py));
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(234,88,12,0.9)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.strokeStyle = "#fed7aa";
    ctx.lineWidth = 2;
    ctx.stroke();
    const hotspot = hotspots.find(h => h.id === draggingId);
    if (hotspot) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 8px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(hotspot.label, x, y);
    }
  };

  const handleMouseUp = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isAdminMode) return;

    // 카드 드래그 종료 - 서버 저장
    if (draggingCardId !== null) {
      fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "cardOffsets", value: JSON.stringify(cardOffsetsRef.current) })
      }).catch(() => {});
      setDraggingCardId(null);
      return;
    }

    if (draggingId === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (canvas.width / rect.width) - dragOffset.x;
    const py = (e.clientY - rect.top) * (canvas.height / rect.height) - dragOffset.y;
    const newLeft = Math.max(2, Math.min(98, (px / canvas.width) * 100));
    const newTop = Math.max(2, Math.min(98, (py / canvas.height) * 100));
    const hotspot = hotspots.find(h => h.id === draggingId);
    if (hotspot) {
      try {
        await updateHotspot.mutateAsync({ id: draggingId, hotspot: { left: String(newLeft.toFixed(2)), top: String(newTop.toFixed(2)) } });
        toast({ title: "핀 위치가 저장되었습니다." });
      } catch { toast({ title: "위치 저장 실패", variant: "destructive" }); }
    }
    pinDragPosRef.current = null;
    setDraggingId(null);
    drawCanvas();
  };

  const handleAddHotspot = async () => {
    if (!newHotspotLabel.trim()) { toast({ title: "버튼 이름을 입력해주세요.", variant: "destructive" }); return; }
    try {
      const newCategory = await createCategory.mutateAsync({ key: `hotspot_${Date.now()}`, title: newHotspotLabel, description: newHotspotLabel });
      await createHotspot.mutateAsync({ label: newHotspotLabel, top: "50%", left: "50%", categoryId: newCategory.id });
      toast({ title: `"${newHotspotLabel}" 버튼이 추가되었습니다.` });
      setNewHotspotLabel(""); setShowAddHotspot(false);
    } catch { toast({ title: "버튼 추가 실패", variant: "destructive" }); }
  };

  const handleDeleteHotspot = async () => {
    if (!deleteHotspotConfirm) return;
    try {
      await deleteHotspot.mutateAsync(deleteHotspotConfirm.id);
      toast({ title: "버튼이 삭제되었습니다." }); setDeleteHotspotConfirm(null);
    } catch { toast({ title: "삭제 실패", variant: "destructive" }); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (form.images.length + files.length > 10) { toast({ title: "최대 10장", variant: "destructive" }); return; }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(prev => ({ ...prev, images: [...prev.images, ev.target?.result as string] }));
      reader.readAsDataURL(file);
    });
  };

  const openAddModal = () => { setEditingStandard(null); setForm(emptyForm); setShowAddModal(true); };
  const openEditModal = (standard: Standard) => {
    setEditingStandard(standard);
    const ov = stdOverrides?.find((o: any) => o.title === standard.title);
    setForm({
      // form.categoryId는 hotspot.id 기준 (드롭다운 value와 일치)
      // STD_ITEMS/std_item_overrides 기반 가상 항목(id=-1)은 standard.categoryId가 항상 null이라
      // 대신 문자열 분류명(standard.category, 예: "기계실"/"카 내")으로 hotspot을 역매칭한다.
      categoryId: (() => {
        if (standard.categoryId) {
          const h = hotspots.find(h => h.categoryId === standard.categoryId);
          return h ? String(h.id) : String(standard.categoryId);
        }
        const catLabel = (standard as any).category;
        if (catLabel) {
          const h = hotspots.find(h => h.label === catLabel);
          if (h) return String(h.id);
        }
        return "";
      })(),
      // 표준화명: overrideTitle 우선 → 없으면 원본 title
      title: standard.title,
      overrideTitle: ov?.overrideTitle || "",
      // 항목 번호: ov.ref 우선 → 없으면 원본 standardNumber/ref
      standardNumber: ov?.ref || standard.standardNumber || (standard as any).ref || "",
      body: standard.body,
      basis: ov?.basis || (standard as any).basis || "",
      conclusion: ov?.conclusion || (standard as any).conclusion || "",
      // 출처: ov.source 우선 → 없으면 원본 source
      source: ov?.source || (standard as any).source || "",
      typeTag: ov?.typeTag || (standard as any).typeTag || "",
      // 분류: ov.category 우선 → 없으면 원본 category
      category: ov?.category || (standard as any).category || "",
      // 건축허가일/기준적용일/검사일: STD_ITEMS 기반 가상 항목(id=-1)은 standard.xxx가 항상 null이라
      // std_item_overrides에 저장된 ov.xxx를 우선 사용한다 (기존엔 이게 없어서 재수정할 때마다 비어보였음)
      permitDate: (ov as any)?.permitDate || standard.permitDate || "",
      inspectionDate: (ov as any)?.inspectionDate || standard.inspectionDate || "",
      inspectionYear: (ov as any)?.inspectionYear || standard.inspectionYear || "",
      installInspectionDate: (ov as any)?.installInspectionDate || (standard as any).installInspectionDate || "",
      images: standard.imageUrls || [],
    });
    setSelectedStandard(null); setShowAddModal(true);
  };

  const handleSubmit = async () => {
    // 표준화명(제목)도 필수가 아니라 선택 입력 — 다만 std-overrides는 title을 키로 쓰므로
    // 완전히 비어있으면 저장 자체가 불가능해서, 비어있을 때만 식별용 placeholder를 채운다.
    // (setForm은 비동기라 이 함수 안에서 바로 못 읽으므로 로컬 변수로 따로 들고 다닌다)
    const effectiveTitle = form.title.trim() || `표준화-${Date.now()}`;
    if (effectiveTitle !== form.title) setForm(prev => ({ ...prev, title: effectiveTitle }));
    try {
      if (editingStandard) {
        // STD_ITEMS 전용(id=-1)이 아닌 경우만 standards 테이블 업데이트
        if (editingStandard.id !== -1) {
          const data = {
            categoryId: ((form as any).hotspotCategoryId && !isNaN(parseInt((form as any).hotspotCategoryId))) ? parseInt((form as any).hotspotCategoryId) : null,
            title: form.title, standardNumber: form.standardNumber || null,
            body: form.body || form.basis || form.conclusion || editingStandard.body || " ",
            permitDate: form.permitDate || null, inspectionDate: form.inspectionDate || null,
            inspectionYear: form.inspectionYear || null,
            imageUrls: form.images.length > 0 ? form.images : null, hotspotId: null, inspectionRound: null,
          };
          try { await updateStandard.mutateAsync({ id: editingStandard.id, standard: data }); }
          catch (e) { console.warn("[standards 업데이트 실패, 오버라이드만 저장]", e); }
        }
        // 오버라이드 저장 (basis, conclusion, source 등 확장 필드) — 핵심
        const ovRes = await fetch(`/api/std-overrides/${encodeURIComponent(editingStandard.title)}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            overrideTitle: (form as any).overrideTitle || "",
            basis: form.basis || "", conclusion: form.conclusion || "",
            source: form.source || "", ref: form.standardNumber || "",
            typeTag: (form as any).typeTag || "", category: (form as any).category || "",
            permitDate: form.permitDate || "", inspectionDate: form.inspectionDate || "", inspectionYear: form.inspectionYear || "", installInspectionDate: form.installInspectionDate || "",
          }),
        });
        if (!ovRes.ok) {
          const errText = await ovRes.text().catch(() => "");
          console.error("[오버라이드 저장 실패]", ovRes.status, errText);
          throw new Error(`오버라이드 저장 실패 (${ovRes.status})`);
        }
        const savedRow = await ovRes.json();
        console.log("[오버라이드 저장 성공]", savedRow);
        // 강제 즉시 refetch — 캐시 무효화만으론 안 될 경우 대비
        await refetchStdOverrides();
        toast({ title: "수정되었습니다." });
      } else {
        const data = {
          categoryId: ((form as any).hotspotCategoryId && !isNaN(parseInt((form as any).hotspotCategoryId))) ? parseInt((form as any).hotspotCategoryId) : null,
          title: effectiveTitle, standardNumber: form.standardNumber || null,
          body: form.basis || form.conclusion || " ",
          permitDate: form.permitDate || null, inspectionDate: form.inspectionDate || null,
          inspectionYear: form.inspectionYear || null,
          imageUrls: form.images.length > 0 ? form.images : null, hotspotId: null, inspectionRound: null,
        };
        // standards(레거시) 테이블은 inspectionYear가 varchar(4)라 "검사일"에 실제 날짜(YYYY-MM-DD, 10자)를
        // 넣으면 Zod 검증에서 too_big 오류로 거부된다. 표시/저장의 단일 진실 소스는 std_item_overrides이므로
        // 레거시 테이블 저장은 실패해도 무시하고 계속 진행한다(수정 경로와 동일한 처리).
        try { await createStandard.mutateAsync(data); }
        catch (e) { console.warn("[standards 생성 실패, 오버라이드만 저장]", e); }
        // 신규 생성 시에도 확장 필드(basis/conclusion/source 등)를 오버라이드로 저장
        await fetch(`/api/std-overrides/${encodeURIComponent(effectiveTitle)}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            overrideTitle: "", basis: form.basis || "", conclusion: form.conclusion || "",
            source: form.source || "", ref: form.standardNumber || "",
            typeTag: form.typeTag || "", category: form.category || "",
            permitDate: form.permitDate || "", inspectionDate: form.inspectionDate || "", inspectionYear: form.inspectionYear || "", installInspectionDate: form.installInspectionDate || "",
          }),
        });
        await refetchStdOverrides();
        toast({ title: "추가되었습니다." });
      }
      setShowAddModal(false); setEditingStandard(null); setForm(emptyForm);
    } catch (e) {
      console.error("[handleSubmit 오류]", e);
      toast({ title: "저장 실패", description: String(e), variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteStandard.mutateAsync(deleteConfirm.id);
      toast({ title: "삭제되었습니다." }); setDeleteConfirm(null); setSelectedStandard(null);
    } catch { toast({ title: "삭제 실패", variant: "destructive" }); }
  };

  const handleDeleteStdItem = async () => {
    if (!stdItemDeleteConfirm) return;
    try {
      const res = await fetch(`/api/std-overrides/${encodeURIComponent(stdItemDeleteConfirm.key)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      toast({ title: "삭제되었습니다." });
      setStdItemDeleteConfirm(null);
      setStdSelected(null);
      refetchStdOverrides();
    } catch {
      toast({ title: "삭제 실패", variant: "destructive" });
    }
  };

  // ==================== 렌더링 ====================
  return (
    <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",flexDirection:"column",backgroundColor:"var(--background)"}}>

      {/* 헤더 */}
      <div className="sticky top-0 z-40 bg-card border-b border-border px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              {defaultTab === "chat" ? <Bot className="h-3 w-3 text-primary-foreground" /> : <ImageIcon className="h-3 w-3 text-primary-foreground" />}
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">{defaultTab === "chat" ? "AI 검색" : "기술자료"}</h1>
              
            </div>
          </div>
          {defaultTab === "chat" && (
            <div className="flex items-center gap-2">
              {role === "admin" && (
                <button
                  onClick={() => { setShowUsage(s => !s); if (!showUsage) fetchUsageStats(); }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-medium"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  사용량
                </button>
              )}
              <button
                onClick={() => { setShowChangelog(s => !s); if (!showChangelog) fetchChangelog(); }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-medium"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>
                업데이트 내역
              </button>
              <button
                onClick={() => { if (onLogout) onLogout(); }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 업데이트 내역 */}
      {showChangelog && (
        <div className="border-b border-border bg-card shrink-0 overflow-y-auto" style={{maxHeight: "70vh"}}>
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-blue-50 dark:bg-blue-900/20">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300 flex-1">업데이트 내역</span>
            <button onClick={() => setShowChangelog(false)} className="w-6 h-6 flex items-center justify-center rounded border border-blue-200 dark:border-blue-700"><X className="h-3 w-3" /></button>
          </div>
          {changelogLoading ? (
            <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">불러오는 중…</div>
          ) : changelog && changelog.length > 0 ? (
            <div className="p-3 flex flex-col gap-4">
              {Object.entries(
                changelog.reduce((acc: Record<string, any[]>, item: any) => {
                  const key = new Date(item.commitDate).toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
                  (acc[key] = acc[key] || []).push(item);
                  return acc;
                }, {})
              ).map(([date, items]: [string, any[]]) => (
                <div key={date}>
                  <p className="text-[11px] text-muted-foreground mb-1.5">{date}</p>
                  <div className="flex flex-col gap-2">
                    {items.map((item: any) => (
                      <div key={item.id} className="flex gap-2 items-start">
                        <span className="text-blue-500 mt-0.5">·</span>
                        <p className="text-[13px] leading-relaxed flex-1">{item.displayText}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground">아직 업데이트 내역이 없습니다</div>
          )}
        </div>
      )}

      {/* AI 사용량 대시보드 */}
      {showUsage && (
        <div className="border-b border-border bg-card shrink-0 overflow-y-auto" style={{maxHeight: "70vh"}}>
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-blue-50 dark:bg-blue-900/20">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300 flex-1">AI 사용량 현황</span>
            <span className="text-xs text-blue-600 dark:text-blue-400">이번 달</span>
            <button onClick={() => setShowUsage(false)} className="w-6 h-6 flex items-center justify-center rounded border border-blue-200 dark:border-blue-700"><X className="h-3 w-3" /></button>
          </div>
          {usageLoading ? (
            <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">불러오는 중…</div>
          ) : usageStats ? (
            <div className="p-3 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "총 질문 수", val: `${usageStats.totalQuestions}건`, sub: "" },
                  { label: "예상 비용", val: `$${parseFloat(usageStats.totalCost).toFixed(3)}`, sub: `약 ${Math.round(parseFloat(usageStats.totalCost) * 1450)}원` },
                  { label: "입력 토큰", val: `${(usageStats.totalInput / 1000).toFixed(1)}K`, sub: `$${(usageStats.totalInput * 3 / 1_000_000).toFixed(3)}` },
                  { label: "출력 토큰", val: `${(usageStats.totalOutput / 1000).toFixed(1)}K`, sub: `$${(usageStats.totalOutput * 15 / 1_000_000).toFixed(3)}` },
                ].map((s, i) => (
                  <div key={i} className="bg-secondary rounded-lg p-2.5">
                    <p className="text-[10px] text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-base font-medium">{s.val}</p>
                    {s.sub && <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>}
                  </div>
                ))}
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-muted-foreground">최근 7일 비용</span>
                  <span className="text-[10px] font-medium text-blue-600">${parseFloat(usageStats.totalCost).toFixed(3)} 합계</span>
                </div>
                <div className="flex items-end gap-1" style={{height: 56}}>
                  {Object.entries(usageStats.daily || {}).map(([date, d]: [string, any]) => {
                    const allCosts = Object.values(usageStats.daily || {}).map((x: any) => x.cost);
                    const maxCost = Math.max(...allCosts as number[], 0.001);
                    const hTotal = Math.round((d.cost / maxCost) * 44);
                    const hOut = Math.round((d.output / (d.input + d.output + 0.001)) * hTotal);
                    const hInp = hTotal - hOut;
                    const dayLabel = ["일","월","화","수","목","금","토"][new Date(date).getDay()];
                    return (
                      <div key={date} className="flex flex-col items-center gap-0.5 flex-1">
                        <div className="flex flex-col items-center w-full">
                          <div className="w-full rounded-t" style={{height: hOut, background: "#185FA5", borderRadius: "3px 3px 0 0"}}></div>
                          <div className="w-full" style={{height: hInp, background: "#B5D4F4"}}></div>
                        </div>
                        <span className="text-[9px] text-muted-foreground">{dayLabel}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-3 mt-1.5">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{background:"#185FA5"}}></div><span className="text-[9px] text-muted-foreground">출력</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{background:"#B5D4F4"}}></div><span className="text-[9px] text-muted-foreground">입력</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <div className="flex-1">
                  <p className="text-xs text-blue-800 dark:text-blue-300">질문 1회 평균 비용</p>
                  <p className="text-[10px] text-blue-600">입력 ~800tok + 출력 ~500tok 기준</p>
                </div>
                <span className="text-sm font-medium text-blue-700">
                  {usageStats.totalQuestions > 0 ? `$${(parseFloat(usageStats.totalCost) / usageStats.totalQuestions).toFixed(4)}` : "-"}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground mb-1.5">최근 질문 로그</p>
                <div className="border border-border rounded-lg overflow-hidden">
                  {(usageStats.recentLogs || []).slice(0, 5).map((log: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 border-b border-border last:border-0">
                      <span className="text-[9px] text-muted-foreground min-w-[48px]">
                        {new Date(log.createdAt).toLocaleTimeString("ko-KR", {hour: "2-digit", minute: "2-digit"})}
                      </span>
                      <span className="text-[10px] flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{log.question}</span>
                      <span className="text-[9px] text-muted-foreground">{(log.inputTokens + log.outputTokens).toLocaleString()}tok</span>
                      <span className="text-[10px] font-medium text-blue-600 min-w-[36px] text-right">${parseFloat(log.costUsd).toFixed(4)}</span>
                    </div>
                  ))}
                  {(usageStats.recentLogs || []).length === 0 && (
                    <div className="px-3 py-4 text-center text-xs text-muted-foreground">아직 기록이 없습니다</div>
                  )}
                </div>
              </div>
              <a
                href="/api/ai-feedback/export"
                download
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-medium"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                이용자 좋아요/아쉬워요 피드백 CSV 다운로드
              </a>
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground">데이터를 불러올 수 없습니다</div>
          )}
        </div>
      )}

      {/* ==================== 채팅 탭 ==================== */}
      {defaultTab === "chat" && (
        <div className="flex-1 flex flex-col w-full">

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                )}
                <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1.5`}>
                  {msg.content && (
                  <div className={`rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm whitespace-pre-line"
                      : "bg-card border border-border rounded-tl-sm"
                  }`}>
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          h1: ({children}) => <p className="font-bold text-base mb-1">{children}</p>,
                          h2: ({children}) => <p className="font-bold text-sm mt-2 mb-1">{children}</p>,
                          h3: ({children}) => <p className="font-semibold text-sm mt-1.5 mb-0.5">{children}</p>,
                          strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                          ul: ({children}) => <ul className="list-disc pl-4 my-1 space-y-0.5">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal pl-4 my-1 space-y-0.5">{children}</ol>,
                          li: ({children}) => <li className="text-sm">{children}</li>,
                          p: ({children}) => <p className="mb-1 last:mb-0">{children}</p>,
                          table: ({children}) => <div className="overflow-x-auto my-1.5"><table className="text-xs border-collapse w-full">{children}</table></div>,
                          th: ({children}) => <th className="border border-border px-2 py-1 bg-muted font-semibold text-left">{children}</th>,
                          td: ({children}) => <td className="border border-border px-2 py-1">{children}</td>,
                          code: ({children}) => <code className="bg-muted px-1 rounded text-xs font-mono">{children}</code>,
                          hr: () => <hr className="border-border my-2" />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content.split('\n').map((line, i) => (
                        <span key={i}>{i > 0 && <br />}{line}</span>
                      ))
                    )}
                  </div>
                )}
                  {msg.elevatorData && (
                    <ElevatorInfoCard elevatorData={msg.elevatorData} safetyPoints={msg.safetyPoints || []} />
                  )}
                  {msg.calcCard === "COUNTER_WEIGHT" && (
                    <CounterWeightCalcCard />
                  )}
                  <div className="flex items-center gap-1.5 px-1 mt-1">
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                    {msg.role === "assistant" && msg.mode && (
                      <span className="text-[10px] text-muted-foreground">
                        · {msg.mode === "precise" ? "정밀 답변" : "빠른 답변"}
                        {typeof msg.elapsedMs === "number" && ` · ${(msg.elapsedMs / 1000).toFixed(1)}초`}
                      </span>
                    )}
                  </div>
                  {msg.role === "assistant" && msg.content && i > 0 && messages[i-1]?.role === "user" && (
                    <div className="w-full">
                      <FeedbackButtons question={messages[i-1].content} answer={msg.content} />
                    </div>
                  )}
                  {msg.searchResults && msg.searchResults.length > 0 && !msg.isElevatorQuery && (() => {
                    const TYPE_LABEL: Record<string, string> = {
                      inspection: "검사기준", standard: "기술자료",
                      judgment: "검사가이드", chat: "채팅", article: "조문 원문"
                    };
                    const PRIORITY_STYLE: Record<number, { bg: string; text: string; label: string }> = {
                      1: { bg: "#4B7BF5", text: "white", label: "1순위" },
                      2: { bg: "#22C55E", text: "white", label: "2순위" },
                      3: { bg: "#F59E0B", text: "white", label: "3순위" },
                    };
                    const sorted = [...msg.searchResults].sort((a, b) => (a.priority || 9) - (b.priority || 9));
                    return (
                      <div className="mt-2 flex flex-col gap-1.5">
                        <p className="text-[10px] text-muted-foreground font-medium px-0.5">참고 자료</p>
                        {sorted.map((r: SearchResult, i: number) => {
                          const pStyle = PRIORITY_STYLE[r.priority || (i + 1)] || { bg: "#9CA3AF", text: "white", label: `${i+1}순위` };
                          return (
                            <button
                              key={i}
                              className="w-full text-left bg-card border border-border rounded-xl overflow-hidden hover:bg-muted/30 active:bg-muted/50 transition-colors"
                              onClick={() => {
                                setSelectedSearchResult(r);
                              }}
                            >
                              <div className="flex items-center gap-1.5 px-3 pt-2 pb-1">
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: pStyle.bg, color: pStyle.text }}>{pStyle.label}</span>
                                <span className="text-[10px] text-muted-foreground">{TYPE_LABEL[r.type] || r.type}</span>
                              </div>
                              <div className="px-3 pb-1.5">
                                <p className="text-[11px] font-semibold text-foreground leading-snug mb-0.5">{r.title}</p>
                                {r.content && r.type !== "chat" && (
                                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{r.content}</p>
                                )}
                                {r.type === "chat" && r.chatMeta && (
                                  <p className="text-[10px] text-muted-foreground">
                                    <span className="text-purple-500 font-medium">{r.chatMeta.userName}</span>
                                    {r.chatMeta.replyToUser && <span> → {r.chatMeta.replyToUser}</span>}
                                  </p>
                                )}
                              </div>
                              {/* 딥링크 목적지 표시 */}
                              <div className="flex items-center justify-between px-3 pb-2">
                                {r.query && r.type !== "chat" && (
                                  <span className="text-[9px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800">
                                    {r.query}
                                  </span>
                                )}
                                <span className="text-[10px] text-blue-500 dark:text-blue-400 flex items-center gap-0.5 ml-auto">
                                  {"상세보기"}
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {/* 타이핑 인디케이터 */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay:"0ms"}}/>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay:"150ms"}}/>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay:"300ms"}}/>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력창 */}
          <div className="px-4 py-3 border-t border-border bg-card shrink-0">
            <div className="flex gap-1.5 mb-2">
              <button
                onClick={() => selectChatMode("fast")}
                className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg border transition-colors ${
                  chatMode === "fast"
                    ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700"
                    : "border-border"
                }`}
              >
                <span className={`flex items-center gap-1 text-xs font-medium ${chatMode === "fast" ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`}>
                  <Zap className="h-3 w-3" />빠른 답변
                </span>
                <span className={`text-[10px] ${chatMode === "fast" ? "text-blue-500 dark:text-blue-400" : "text-muted-foreground"}`}>평소처럼 빠르게</span>
              </button>
              <button
                onClick={() => selectChatMode("precise")}
                className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg border transition-colors ${
                  chatMode === "precise"
                    ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700"
                    : "border-border"
                }`}
              >
                <span className={`flex items-center gap-1 text-xs font-medium ${chatMode === "precise" ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`}>
                  <Lightbulb className="h-3 w-3" />정밀 답변
                </span>
                <span className={`text-[10px] ${chatMode === "precise" ? "text-blue-500 dark:text-blue-400" : "text-muted-foreground"}`}>더 꼼꼼하게, 조금 느려요</span>
              </button>
            </div>
            <div className="flex gap-2">
              <input
                ref={chatInputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(inputText)}
                placeholder="궁금한 것을 물어보세요..."
                className="flex-1 bg-secondary rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 모달들 ==================== */}

      
      {/* 삭제 확인 */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-semibold mb-2">삭제 확인</h2>
            <p className="text-sm text-muted-foreground mb-6">"{deleteConfirm.title}"을 삭제하시겠습니까?</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>취소</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete}>삭제</Button>
            </div>
          </div>
        </div>
      )}

      {/* 버튼 추가 */}
      {showAddHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowAddHotspot(false)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-semibold mb-4">버튼 추가</h2>
            <Input placeholder="예: 기계실" value={newHotspotLabel} onChange={e => setNewHotspotLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddHotspot()} className="mb-2" />
            <p className="text-xs text-muted-foreground mb-4">추가 후 드래그해서 위치 조정하세요.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddHotspot(false)}>취소</Button>
              <Button className="flex-1" onClick={handleAddHotspot}>추가</Button>
            </div>
          </div>
        </div>
      )}

      {/* 버튼 삭제 확인 */}
      {deleteHotspotConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteHotspotConfirm(null)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-semibold mb-2">버튼 삭제</h2>
            <p className="text-sm text-muted-foreground mb-6">"{deleteHotspotConfirm.label}" 버튼을 삭제하시겠습니까?</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteHotspotConfirm(null)}>취소</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDeleteHotspot}>삭제</Button>
            </div>
          </div>
        </div>
      )}

      {/* 표준화 항목 삭제 확인 */}
      {stdItemDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setStdItemDeleteConfirm(null)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-semibold mb-2">표준화 삭제</h2>
            <p className="text-sm text-muted-foreground mb-6">"{stdItemDeleteConfirm.displayTitle}"을 삭제하시겠습니까?</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStdItemDeleteConfirm(null)}>취소</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDeleteStdItem}>삭제</Button>
            </div>
          </div>
        </div>
      )}

      {/* 추가/수정 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h2 className="font-semibold">{editingStandard ? "표준화 수정" : "표준화 추가"}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">분류</label>
                <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50" value={form.categoryId} onChange={e => { const h = hotspots.find(h => String(h.id) === e.target.value); setForm(prev => ({ ...prev, categoryId: e.target.value, hotspotCategoryId: h?.categoryId ? String(h.categoryId) : "", category: h?.label || "" })); }}>
                  <option value="">전체</option>
                  {hotspots.map(h => <option key={h.id} value={String(h.id)}>{h.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">표준화명</label>
                {editingStandard ? (
                  // 수정 모드: overrideTitle 수정 (원본 title 키는 유지, 표시 이름만 변경)
                  <Input placeholder={form.title || "표준화명 입력"} value={form.overrideTitle} onChange={e => setForm(prev => ({ ...prev, overrideTitle: e.target.value }))} />
                ) : (
                  <Input placeholder="표준화명 입력" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">항목 번호</label>
                <Input placeholder="예: 6.3.2" value={form.standardNumber} onChange={e => setForm(prev => ({ ...prev, standardNumber: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">현안 및 근거 조항</label>
                <RichTextEditor value={form.basis} onChange={v => setForm(prev => ({ ...prev, basis: v }))} placeholder="현안 사항 및 근거 조항" minHeight="80px" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">검사방법 표준화 결정</label>
                <RichTextEditor value={form.conclusion} onChange={v => setForm(prev => ({ ...prev, conclusion: v }))} placeholder="표준화 결정 내용" minHeight="100px" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">출처 (회차)</label>
                <input className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card" value={form.source} onChange={e => setForm(prev => ({ ...prev, source: e.target.value }))} placeholder="예: 2026년 제1차 표준화" />
              </div>

              <DatePicker label="건축허가일" value={form.permitDate} onChange={v => setForm(prev => ({ ...prev, permitDate: v }))} />
              <DatePicker label="검사기준적용일" value={form.inspectionDate} onChange={v => setForm(prev => ({ ...prev, inspectionDate: v }))} />
              <DatePicker label="검사일" value={form.inspectionYear} onChange={v => setForm(prev => ({ ...prev, inspectionYear: v }))} />
              <DatePicker label="설치검사일" value={form.installInspectionDate} onChange={v => setForm(prev => ({ ...prev, installInspectionDate: v }))} />
              <div>
                <label className="block text-sm font-medium mb-1">사진 (최대 10장)</label>
                <input type="file" accept="image/*" multiple className="w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary" onChange={handleImageUpload} />
                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative">
                        <img src={img} alt="" className="w-full h-20 object-cover rounded-xl border border-border" />
                        <button className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs" onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>취소</Button>
                <Button className="flex-1" onClick={handleSubmit}>저장</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ==================== 기술자료 탭 ==================== */}
      {defaultTab === "map" && (
        <div className="flex-1 overflow-y-auto" ref={zoomContentRef}>
          <div className="p-3 space-y-3">

            {/* 편집 모드 툴바 */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">구조도 & 기술자료</h2>
              <div className="flex gap-2">
                <Button
                  variant={isAdminMode ? "default" : "outline"}
                  size="icon"
                  onClick={() => {
                    if (isAdminMode) {
                      setIsAdminMode(false);
                    } else {
                      setIsPasswordDialogOpen(true);
                    }
                  }}
                  className={`shrink-0 shadow-sm hover:shadow-md transition-all ${isAdminMode ? "bg-red-500 hover:bg-red-600" : ""}`}
                  title={isAdminMode ? "관리자 모드 종료" : "관리자 모드 진입"}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                {isAdminMode && (
                  <Button size="sm" onClick={openAddModal}>
                    <Plus className="h-4 w-4 mr-1" />추가
                  </Button>
                )}
              </div>
            </div>

            {isAdminMode && (
              <div className="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-xl flex flex-wrap gap-2 items-center text-sm">
                <span className="text-orange-700 dark:text-orange-300 font-medium">✏️ 버튼을 드래그해서 이동</span>
                <label className="flex items-center gap-1 cursor-pointer bg-white dark:bg-card border border-orange-300 rounded-lg px-2 py-1 text-xs text-orange-700 dark:text-orange-300 hover:bg-orange-50">
                  <ImageIcon className="h-3 w-3" />구조도 변경
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                <Button size="sm" variant="outline" className="text-xs h-7 border-orange-300 text-orange-700" onClick={() => setShowAddHotspot(true)}>
                  <Plus className="h-3 w-3 mr-1" />버튼 추가
                </Button>
                {hotspots.map(h => (
                  <Button key={h.id} size="sm" variant="outline" className="text-xs h-7 border-red-300 text-red-600" onClick={() => setDeleteHotspotConfirm(h)}>
                    <Trash2 className="h-3 w-3 mr-1" />{h.label}
                  </Button>
                ))}
              </div>
            )}

            {/* 구조도 */}
            <div className="relative w-full aspect-[2/3] sm:aspect-[3/4] md:aspect-[9/8] rounded-2xl overflow-hidden shadow-lg border border-border">
              <canvas ref={canvasRef} className={`w-full h-full ${isAdminMode ? "cursor-move" : "cursor-pointer"}`}
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp} onMouseLeave={async () => {
                  if (draggingId !== null) {
                    const canvas = canvasRef.current;
                    if (canvas && pinDragPosRef.current) {
                      const newLeft = (pinDragPosRef.current.x / canvas.width) * 100;
                      const newTop = (pinDragPosRef.current.y / canvas.height) * 100;
                      updateHotspot.mutate({ id: draggingId, hotspot: { left: String(newLeft.toFixed(2)), top: String(newTop.toFixed(2)) } });
                    }
                    pinDragPosRef.current = null;
                    setDraggingId(null);
                  }
                  if (draggingCardId !== null) {
                    fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "cardOffsets", value: JSON.stringify(cardOffsetsRef.current) }) }).catch(() => {});
                    setDraggingCardId(null);
                  }
                }}
                onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
                style={{touchAction: isAdminMode ? "none" : "auto"}} />
            </div>

            {/* 표준화 목록 + 상세 */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-sm mb-2">표준화 자료 ({allStdItems.length}건)</h3>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="검색..." value={stdSearch} onChange={e => { setStdSearch(e.target.value); setStdSelected(null); }} className="pl-9 h-8 text-xs bg-secondary border-0" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {/* 탭: hotspot 순서 기준, 항목 있는 것만 표시, hotspot 변동 시 자동 반영 */}
                  {[
                    { key: "전체", cnt: allStdItems.length },
                    ...hotspots.map(h => ({ key: h.label, cnt: allStdItems.filter(x => x.category === h.label).length }))
                  ].filter(({ key, cnt }) => key === "전체" || cnt > 0).map(({ key, cnt }) => (
                    <button key={key} onClick={() => { setStdCategory(key); setStdSelected(null); }}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${stdCategory === key ? "bg-foreground text-background border-foreground" : "bg-background border-border text-muted-foreground hover:bg-muted"}`}>
                      {key} <span className="opacity-60">{cnt}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-border max-h-[480px] overflow-y-auto">
                {(() => {
                  // 검색어를 공백 기준으로 토큰화해서, 각 토큰이 (제목/표시제목/조항/결론/근거) 중
                  // 어디에든 하나씩만 있으면 매칭되도록 한다. (예: "승강기 번호" → "승강기"와 "번호"가
                  // 같은 필드에 붙어있지 않아도, 서로 다른 필드에 흩어져 있어도 매칭됨)
                  // 다만 "설치"처럼 흔한 단어가 섞이면 매칭이 너무 넓어지므로, 검색어 문구가
                  // 그대로(공백까지 붙어) 등장하는 항목을 우선순위로 위쪽에 정렬한다.
                  const stdTokens = stdSearch.trim().toLowerCase().split(/\s+/).filter(Boolean);
                  const stdPhrase = stdTokens.join(" ");
                  const filtered = allStdItems
                    .filter(x => stdCategory === "전체" || x.category === stdCategory)
                    .map(x => ({ item: x, haystack: [x.title, (x as any).displayTitle, x.ref, x.conclusion, x.basis].join(" ").toLowerCase() }))
                    .filter(({ haystack }) => stdTokens.length === 0 || stdTokens.every(t => haystack.includes(t)))
                    .sort((a, b) => {
                      if (!stdPhrase) return 0;
                      const aExact = a.haystack.includes(stdPhrase) ? 0 : 1;
                      const bExact = b.haystack.includes(stdPhrase) ? 0 : 1;
                      return aExact - bExact;
                    })
                    .map(({ item }) => item);
                  if (filtered.length === 0) return <p className="text-center text-muted-foreground py-8 text-sm">검색 결과 없음</p>;
                  return filtered.map((item, idx) => {
                    const headerOv = stdOverrides?.find((o: any) => o.title === (item._key || item.title));
                    return (
                    <div key={idx}>
                      <div onClick={() => setStdSelected(stdSelected === item ? null : item)}
                        className={`p-3 cursor-pointer transition-colors ${stdSelected === item ? "bg-blue-500/5" : "hover:bg-muted/50"}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className="text-sm font-medium leading-snug text-foreground line-clamp-2">{(item as any).displayTitle || item.title}</div>
                              {((item as any).manuallyEdited || headerOv?.manuallyEdited) && (
                                <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">수정됨</span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground">{headerOv?.source || item.source}</div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 mt-0.5">
                            {isAdminMode && (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  // STD_ITEMS(item) 전체 필드를 가상 Standard로 구성 — DB standards는 무관
                                  const virtualStd = {
                                    id: -1,
                                    title: item.title,
                                    body: item.basis || item.conclusion || " ",
                                    standardNumber: item.ref || "",
                                    basis: item.basis || "",
                                    conclusion: item.conclusion || "",
                                    source: item.source || "",
                                    typeTag: item.typeTag || "",
                                    category: item.category || "",
                                    categoryId: null,
                                    imageUrls: null,
                                    permitDate: null,
                                    inspectionDate: null,
                                    inspectionYear: null,
                                    installInspectionDate: null,
                                    hotspotId: null,
                                    inspectionRound: null,
                                    createdAt: new Date().toISOString(),
                                  } as any;
                                  openEditModal(virtualStd);
                                }}
                                className="w-6 h-6 rounded-md flex items-center justify-center bg-orange-50 hover:bg-orange-100 border border-orange-200"
                                title="수정"
                              >
                                <Pencil className="h-3 w-3 text-orange-600" />
                              </button>
                            )}
                            {isAdminMode && (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setStdItemDeleteConfirm({ key: (item as any)._key || item.title, displayTitle: (item as any).displayTitle || item.title });
                                }}
                                className="w-6 h-6 rounded-md flex items-center justify-center bg-red-50 hover:bg-red-100 border border-red-200"
                                title="삭제"
                              >
                                <Trash2 className="h-3 w-3 text-red-600" />
                              </button>
                            )}
                            <span className="text-muted-foreground text-xs">{stdSelected === item ? "▲" : "▽"}</span>
                          </div>
                        </div>
                      </div>
                      {stdSelected === item && (() => {
                        const ov = stdOverrides?.find((o: any) => o.title === item.title);
                        const dispRef = ov?.ref || item.ref;
                        const fmtText = (s: string) => (s || '').replace(/\u2023\s*/g, '\n\u2023 ').replace(/\u25B8\s*/g, '\n\u25B8 ').replace(/\u2605\s*/g, '\n\u2605 ').replace(/\u203B\s*/g, '\n\u203B ').replace(/\n{3,}/g, '\n\n').trim();
                        const dispBasis = fmtText(ov?.basis || item.basis);
                        const dispConclusion = fmtText(ov?.conclusion || item.conclusion);
                        const dispDates = [
                          { label: "건축허가일", value: (ov as any)?.permitDate },
                          { label: "검사기준적용일", value: (ov as any)?.inspectionDate },
                          { label: "검사일", value: (ov as any)?.inspectionYear },
                          { label: "설치검사일", value: (ov as any)?.installInspectionDate },
                        ].filter(d => d.value);
                        return (
                        <div className="px-3 pb-3 pt-1 bg-blue-500/5 border-t border-blue-200/30 space-y-2.5">
                          {(dispRef || dispBasis) && (
                            <div className="space-y-1.5">
                              <p className="text-xs font-bold text-muted-foreground tracking-wide">검사기준 내용</p>
                              {dispRef && <p className="text-[11px] font-semibold text-blue-600">{dispRef}</p>}
                              {dispBasis && <p className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-wrap bg-card rounded-lg p-2" dangerouslySetInnerHTML={{ __html: dispBasis }} />}
                            </div>
                          )}
                          {dispConclusion && (
                            <div className="space-y-1.5">
                              <p className="text-xs font-bold text-muted-foreground tracking-wide">표준화</p>
                              <p className="text-[11px] text-foreground leading-relaxed border-l-2 border-amber-400 pl-2 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: dispConclusion }} />
                            </div>
                          )}
                          {dispDates.length > 0 && (
                            <p className="text-[11px] font-medium text-red-700 bg-red-50 rounded-lg px-2 py-1.5 inline-block">
                              {dispDates.map(d => `${d.label} ${d.value} 이후`).join(" · ")}
                            </p>
                          )}
                          <StdPhotoSection itemKey={item.title} />
                          <StdCommentSection
                            title={item.title}
                            isAdminMode={isAdminMode}
                            stdComments={stdComments}
                            setStdComments={setStdComments}
                            stdCommentInput={stdCommentInput}
                            setStdCommentInput={setStdCommentInput}
                            stdDeleteConfirm={stdDeleteConfirm}
                            setStdDeleteConfirm={setStdDeleteConfirm}
                          />
                          {isAdminMode && (
                            <div className="pt-1.5 border-t border-border/50 flex items-center justify-end gap-3">
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setStdItemDeleteConfirm({ key: (item as any)._key || item.title, displayTitle: (item as any).displayTitle || item.title });
                                }}
                                className="text-[10px] text-red-600 underline shrink-0"
                              >
                                🗑️ 삭제
                              </button>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  const virtualStd = {
                                    id: -1, title: item.title, body: item.basis || item.conclusion || " ",
                                    standardNumber: item.ref || "",
                                    basis: item.basis || "", conclusion: item.conclusion || "",
                                    source: item.source || "", typeTag: item.typeTag || "", category: item.category || "",
                                    categoryId: null, imageUrls: null,
                                    permitDate: null, inspectionDate: null, inspectionYear: null, installInspectionDate: null,
                                    hotspotId: null, inspectionRound: null, createdAt: new Date().toISOString(),
                                  } as any;
                                  openEditModal(virtualStd);
                                }}
                                className="text-[10px] text-blue-600 underline shrink-0"
                              >
                                ✏️ 수정
                              </button>
                            </div>
                          )}
                        </div>
                        );
                      })()}
                    </div>
                  );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 검색결과 팝업 */}
      {selectedSearchResult && createPortal(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:9999,backgroundColor:"rgba(0,0,0,0.65)"}} onClick={() => setSelectedSearchResult(null)}>
          <div style={{position:"fixed",bottom:0,left:0,right:0,maxHeight:"85vh",overflowY:"auto",zIndex:10000,borderRadius:"20px 20px 0 0"}} className="bg-card" onClick={e => e.stopPropagation()}>

            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${
                  selectedSearchResult.type === "standard"
                    ? "bg-blue-50 text-blue-700"
                    : selectedSearchResult.type === "judgment"
                    ? "bg-green-50 text-green-700"
                    : selectedSearchResult.type === "article"
                    ? "bg-indigo-50 text-indigo-700"
                    : "bg-amber-50 text-amber-700"
                }`}>
                  {selectedSearchResult.type === "standard" ? "기술자료" : selectedSearchResult.type === "judgment" ? "검사가이드" : selectedSearchResult.type === "article" ? "📋 조문 원문" : "검사기준"}
                </span>
              </div>
              <button onClick={() => setSelectedSearchResult(null)} className="w-7 h-7 rounded-full flex items-center justify-center bg-secondary text-muted-foreground hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {selectedSearchResult.type === "article" ? (() => {
                const versions = selectedSearchResult.versions || [];
                return (
                  <>
                    <h2 className="text-sm font-semibold text-foreground mb-3">{selectedSearchResult.title}</h2>
                    <div className="space-y-3">
                      {versions.map((v, i) => (
                        <div key={i} className={`rounded-xl p-3 border ${v.type === "current" ? "bg-blue-50/50 border-blue-100" : "bg-amber-50/30 border-amber-100"}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${v.type === "current" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                              {v.type === "current" ? "현행" : "종전"}
                            </span>
                            {v.effectiveDate && (
                              <span className="text-[9px] text-muted-foreground">
                                {v.effectiveDate}{v.expiryDate ? ` ~ ${v.expiryDate}` : ""}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-foreground leading-relaxed whitespace-pre-wrap">{v.description}</p>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })() : selectedSearchResult.type === "standard" ? (() => {
                // STD_ITEMS 또는 stdOverrides(DB, camelCase)에서 데이터 찾기 — title/query 둘 다로 매칭
                const _st = selectedSearchResult.title;
                const _sq = selectedSearchResult.query;
                const stdFromItems = STD_ITEMS.find(x => x.title === _st || x.title === _sq) || null;
                const stdFromDB = stdOverrides?.find((x: any) =>
                  x.title === _st || x.title === _sq ||
                  (x.overrideTitle && (x.overrideTitle === _st || x.overrideTitle === _sq))
                ) || null;
                const std = stdFromDB
                  ? {
                      title: stdFromDB.overrideTitle || stdFromDB.title,
                      ref: stdFromDB.ref || stdFromItems?.ref || "",
                      basis: stdFromDB.basis || stdFromItems?.basis || "",
                      conclusion: stdFromDB.conclusion || stdFromItems?.conclusion || "",
                      source: stdFromDB.source || stdFromItems?.source || "",
                      typeTag: stdFromDB.typeTag || stdFromItems?.typeTag || "",
                      category: stdFromDB.category || stdFromItems?.category || "",
                    }
                  : stdFromItems
                  ? stdFromItems
                  : null;
                return (
                  <>
                    {/* 제목 */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <div>
                        <h2 className="text-sm font-medium text-foreground leading-snug">{selectedSearchResult.title}</h2>
                        {std?.source && <p className="text-xs text-muted-foreground mt-0.5">{std.source}</p>}
                      </div>
                    </div>
                    {/* 검사기준 참조 */}
                    {std?.ref && (
                      <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-[10px] font-medium text-blue-600 mb-1">검사기준 참조</p>
                        <p className="text-xs text-blue-800 leading-relaxed">{std.ref}</p>
                      </div>
                    )}
                    {/* 검사기준 내용 */}
                    {std?.basis && (
                      <div className="bg-secondary rounded-xl p-3">
                        <p className="text-[10px] font-medium text-muted-foreground mb-1.5">기준 내용</p>
                        <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: std.basis }} />
                      </div>
                    )}
                    {/* 표준화 결론 */}
                    {std?.conclusion && (
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground mb-1.5">표준화 결론</p>
                        <div className="border-l-2 border-blue-400 pl-3">
                          <p className="text-xs text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: std.conclusion }} />
                        </div>
                      </div>
                    )}
                    {!std && <p className="text-xs leading-relaxed text-foreground whitespace-pre-wrap">{selectedSearchResult.content}</p>}
                    <div className="pt-1 border-t border-border">
                      <p className="text-[10px] font-medium text-blue-600">[기술자료] {std?.source || "표준화 자료"}</p>
                    </div>
                  </>
                );
              })() : selectedSearchResult.type === "judgment" ? (() => {
                return (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27500A" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                      </div>
                      <div>
                        <h2 className="text-sm font-medium text-foreground leading-snug">{selectedSearchResult.title}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">항목 {selectedSearchResult.query}</p>
                      </div>
                    </div>
                    {selectedSearchResult.content && (
                      <div className="bg-secondary rounded-xl p-3">
                        <p className="text-[10px] font-medium text-muted-foreground mb-1.5">검사 기준 내용</p>
                        <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{selectedSearchResult.content}</p>
                      </div>
                    )}
                    <button
                      className="w-full text-xs bg-green-600 text-white rounded-xl py-2.5 font-medium hover:bg-green-700"
                      onClick={() => {
                        setSelectedSearchResult(null);
                        sessionStorage.setItem("pendingJudgmentItem", selectedSearchResult.query);
                        window.dispatchEvent(new CustomEvent("navigatePage", { detail: { index: 2 } }));
                      }}
                    >
                      검사가이드에서 보기 →
                    </button>
                  </>
                );
              })() : (() => {
                const itemId = selectedSearchResult.query;
                const entry = (INSPECTION_CONTENT as unknown as Record<string, {text?: string; effectiveDate?: string; revisions?: any[]}>)[itemId];
                const revisions = entry?.revisions || [];
                const effectiveDate = entry?.effectiveDate;
                const fullText = entry?.text || selectedSearchResult.content;
                return (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#854F0B" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-muted-foreground">[{itemId}]</p>
                        <h2 className="text-sm font-medium text-foreground leading-snug mt-0.5">
                          {fullText.split('\n')[0]?.trim() || itemId}

                        </h2>
                      </div>
                    </div>
                    {/* 적용일 강조 표시 */}
                    {(effectiveDate || revisions.length > 0) && (
                      <div className="bg-amber-50 rounded-xl p-3">
                        <p className="text-[10px] font-medium text-amber-700 mb-1.5">적용 시기</p>
                        {effectiveDate && (
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
                            <p className="text-xs font-medium text-amber-800">{effectiveDate.replace(/-/g, ".")} 이후 건축허가분부터 적용</p>
                          </div>
                        )}
                        {revisions.slice(-2).reverse().map((rev: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0"></div>
                            <p className="text-xs text-amber-700">{rev.effectiveDate || rev.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* 기준 내용 */}
                    {fullText && (
                      <div className="bg-secondary rounded-xl p-3">
                        <p className="text-[10px] font-medium text-muted-foreground mb-1.5">기준 내용</p>
                        <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{fullText.slice(0, 400)}{fullText.length > 400 ? "..." : ""}</p>
                      </div>
                    )}
                    <div className="pt-1 border-t border-border">
                      <p className="text-[10px] font-medium text-amber-600">[검사기준] {itemId}</p>
                    </div>
                  </>
                );
              })()}
            </div>
            {/* 하단 안전 여백 */}
            <div className="h-4"></div>
          </div>
        </div>,
        document.body
      )}

      {/* 관리자 모드 비밀번호 다이얼로그 */}
      {isPasswordDialogOpen && createPortal(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:9999,backgroundColor:"rgba(0,0,0,0.6)"}} onClick={() => setIsPasswordDialogOpen(false)}>
          <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"calc(100% - 64px)",maxWidth:"320px",zIndex:10000}} className="bg-card rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()} onFocus={e => e.stopPropagation()}>
            <h2 className="font-semibold text-base mb-4">관리자 모드</h2>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  if (adminPassword === "910919") {
                    setIsAdminMode(true);
                    setIsPasswordDialogOpen(false);
                    setAdminPassword("");
                  } else {
                    alert("비밀번호가 틀렸습니다.");
                    setAdminPassword("");
                  }
                }
              }}
              className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background mb-4 outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="flex gap-2">
              <button onClick={() => { setIsPasswordDialogOpen(false); setAdminPassword(""); }} className="flex-1 py-2 rounded-xl border border-border text-sm">취소</button>
              <button
                onClick={() => {
                  if (adminPassword === "910919") {
                    setIsAdminMode(true);
                    setIsPasswordDialogOpen(false);
                    setAdminPassword("");
                  } else {
                    alert("비밀번호가 틀렸습니다.");
                    setAdminPassword("");
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm"
              >확인</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 표준화 상세 */}
      {selectedStandard && createPortal(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:9999,backgroundColor:"rgba(0,0,0,0.6)"}} onClick={() => setSelectedStandard(null)}>
          <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"calc(100% - 32px)",maxWidth:"512px",maxHeight:"85vh",overflowY:"auto",zIndex:10000}} className="bg-card rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} onFocus={e => e.stopPropagation()}>
            <div className="flex justify-between items-start p-5 border-b border-border">
              <h2 className="text-lg font-semibold pr-4">{stdOverrides?.find((o: any) => o.title === selectedStandard.title)?.overrideTitle || selectedStandard.title}</h2>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEditModal(selectedStandard)} className="text-primary hover:text-primary/80 p-1"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => { setDeleteConfirm(selectedStandard); setSelectedStandard(null); }} className="text-destructive hover:text-destructive/80 p-1"><Trash2 className="h-4 w-4" /></button>
                <button onClick={() => setSelectedStandard(null)} className="text-muted-foreground hover:text-foreground p-1"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {selectedStandard.standardNumber && <Badge variant="outline">{selectedStandard.standardNumber}</Badge>}
              {selectedStandard.permitDate && <div className="flex gap-2 text-sm"><span className="text-muted-foreground">건축허가일:</span><span>{selectedStandard.permitDate}</span></div>}
              {selectedStandard.inspectionDate && <div className="flex gap-2 text-sm"><span className="text-muted-foreground">검사기준적용일:</span><span>{selectedStandard.inspectionDate}</span></div>}
              {selectedStandard.inspectionYear && <div className="flex gap-2 text-sm"><span className="text-muted-foreground">검사일:</span><span>{selectedStandard.inspectionYear}</span></div>}
              <div><p className="text-sm text-muted-foreground mb-1">내용</p><p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedStandard.body}</p></div>
              {selectedStandard.imageUrls && selectedStandard.imageUrls.length > 0 && (
                <div><p className="text-sm text-muted-foreground mb-2">이미지 ({selectedStandard.imageUrls.length}장)</p>
                  <div className="grid grid-cols-2 gap-2">{selectedStandard.imageUrls.map((url, i) => <img key={i} src={url} alt="" className="rounded-xl w-full object-cover border border-border" />)}</div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

// ── 기술자료 댓글 섹션 컴포넌트 ──────────────────────────────────────
function StdCommentSection({ title, isAdminMode, stdComments, setStdComments, stdCommentInput, setStdCommentInput, stdDeleteConfirm, setStdDeleteConfirm }: {
  title: string;
  isAdminMode: boolean;
  stdComments: Record<string, any[]>;
  setStdComments: React.Dispatch<React.SetStateAction<Record<string, any[]>>>;
  stdCommentInput: Record<string, string>;
  setStdCommentInput: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  stdDeleteConfirm: number | null;
  setStdDeleteConfirm: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const comments = stdComments[title] || [];
  const input = stdCommentInput[title] || "";
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (loaded) return;
    setLoaded(true);
    fetch(`/api/std-comments/${encodeURIComponent(title)}`)
      .then(r => r.json())
      .then(data => setStdComments(prev => ({ ...prev, [title]: data })))
      .catch(() => {});
  }, [title]);

  const addComment = async () => {
    if (!input.trim()) return;
    const res = await fetch(`/api/std-comments/${encodeURIComponent(title)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim() }),
    });
    if (res.ok) {
      const newC = await res.json();
      setStdComments(prev => ({ ...prev, [title]: [...(prev[title] || []), newC] }));
      setStdCommentInput(prev => ({ ...prev, [title]: "" }));
    }
  };

  const deleteComment = async (id: number) => {
    await fetch(`/api/std-comments/${id}`, { method: "DELETE" });
    setStdComments(prev => ({ ...prev, [title]: (prev[title] || []).filter((c: any) => c.id !== id) }));
    setStdDeleteConfirm(null);
  };

  const fmtDate = (s: string) => {
    const d = new Date(s);
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
  };

  return (
    <div className="border-t border-border/50 pt-2.5 space-y-2">
      <p className="text-xs font-semibold text-muted-foreground">
        댓글 {comments.length > 0 ? `${comments.length}개` : ""}
      </p>
      {comments.length > 0 && (
        <div className="space-y-1.5">
          {comments.map((c: any) => (
            <div key={c.id} className="bg-card border border-border rounded-lg px-3 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">{fmtDate(c.createdAt)}</span>
                <button
                  onClick={() => setStdDeleteConfirm(c.id)}
                  className="text-[10px] text-red-500 hover:text-red-700 transition-colors"
                >삭제</button>
              </div>
              <p className="text-xs text-foreground leading-relaxed">{c.content}</p>
              {stdDeleteConfirm === c.id && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-xs text-red-700 dark:text-red-300 mb-2">이 댓글을 삭제하시겠습니까?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="flex-1 text-xs py-1 rounded-lg bg-red-500 text-white"
                    >삭제</button>
                    <button
                      onClick={() => setStdDeleteConfirm(null)}
                      className="flex-1 text-xs py-1 rounded-lg border border-border text-muted-foreground"
                    >취소</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setStdCommentInput(prev => ({ ...prev, [title]: e.target.value }))}
          onKeyDown={e => { if (e.key === "Enter") addComment(); }}
          placeholder="댓글 입력..."
          className="flex-1 text-xs px-3 py-1.5 border border-border rounded-lg bg-card text-foreground outline-none focus:ring-1 focus:ring-primary/50"
        />
        <button
          onClick={addComment}
          className="text-xs px-3 py-1.5 border border-border rounded-lg bg-card text-foreground hover:bg-muted transition-colors"
        >등록</button>
      </div>
    </div>
  );
}
