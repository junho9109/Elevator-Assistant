// 폐지 업무 절차 문서를 필요할 때만 불러온다(번들 분리). 순수 로직은 closureGuide.ts.
import { closureDocToCtx, type ClosureCtxItem } from "./closureGuide";

const genModules = import.meta.glob("@/data/generations/closure-guide.json") as Record<string, () => Promise<any>>;

export async function loadClosureCtx(): Promise<ClosureCtxItem[]> {
  try {
    for (const load of Object.values(genModules)) {
      const m: any = await load();
      return closureDocToCtx(m.default || m);
    }
  } catch {}
  return [];
}
