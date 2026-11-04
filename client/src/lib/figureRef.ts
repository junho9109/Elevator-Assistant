// 답변 속 "[[그림:키]]" 표시를 실제 이미지 정보로 바꾼다. 별표22·24(조문·부속서)는 번들에 들어 있어 바로, 종전 고시(g/…)는 필요할 때만 불러온다.
import { resolveStaticFigure, type StaticFig } from "./standardAttachments";

const genModules = import.meta.glob("@/data/generations/*.json") as Record<string, () => Promise<any>>;
let genCache: Promise<any[]> | null = null;
function loadGenerations(): Promise<any[]> {
  if (!genCache) genCache = Promise.all(Object.values(genModules).map(l => l().then(m => m.default || m)));
  return genCache;
}

export async function resolveFigure(key: string): Promise<StaticFig | null> {
  const st = resolveStaticFigure(key);
  if (st) return st;
  const m = key.match(/^g\/([^/]+)\/(.+)\/(\d+)$/);
  if (!m) return null;
  const docs = await loadGenerations();
  const doc = docs.find(d => d?.meta?.id === m[1]);
  const f = doc?.items?.[m[2]]?.figures?.[Number(m[3])];
  return f?.src ? { caption: f.caption || "", srcs: [f.src] } : null;
}
