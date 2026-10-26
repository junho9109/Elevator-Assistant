import { registerPlugin } from "@capacitor/core";

// 안드로이드 알림창·빠른 설정 타일에서 입력한 질문을 가져오는 네이티브 플러그인 (NativeAskPlugin.java)
export interface NativeAskPlugin {
  /** 대기 중인 질문을 가져오고 비운다. 없으면 text가 빈 문자열. */
  getPending(): Promise<{ text: string }>;
  /** 앱이 떠 있는 상태에서 새 질문이 들어오면 호출된다 (이후 getPending으로 가져온다). */
  addListener(eventName: "ask", listener: () => void): Promise<{ remove: () => Promise<void> }>;
}

export const NativeAsk = registerPlugin<NativeAskPlugin>("NativeAsk");
