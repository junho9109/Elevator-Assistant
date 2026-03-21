import { createRoot } from "react-dom/client";
import App from "../../App";
import "./index.css";
import { registerRootComponent } from 'expo';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';

/**
 * Expo OTA 업데이트 체크 함수
 * 개발 환경에서는 체크를 건너뛰고,
 * 프로덕션 환경에서 앱 시작 시 업데이트를 확인 & 적용합니다.
 */
async function checkForUpdates() {
  // 개발 환경(Vite dev server)에서는 OTA 체크 생략
  if (process.env.NODE_ENV === 'development') {
    console.log('[Expo Updates] 개발 환경 - OTA 체크 생략');
    return;
  }

  try {
    console.log('[Expo Updates] 업데이트 확인 중...');
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      console.log('[Expo Updates] 새 업데이트 발견 - 다운로드 중...');
      await Updates.fetchUpdateAsync();
      console.log('[Expo Updates] 다운로드 완료 - 앱 재시작');
      await Updates.reloadAsync();
    } else {
      console.log('[Expo Updates] 최신 버전입니다');
    }
  } catch (error) {
    console.error('[Expo Updates] 업데이트 체크 실패:', error);
  }
}

// 앱 시작 시 OTA 체크 실행 (한 번만)
useEffect(() => {
  checkForUpdates();
}, []);

/**
 * React DOM 렌더링
 * 일반 웹 브라우저 또는 Capacitor WebView에서 사용
 */
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}

/**
 * Expo registerRootComponent
 * Expo 네이티브 환경(Expo Go, EAS 빌드)에서 앱 진입점 등록
 */
registerRootComponent(App);