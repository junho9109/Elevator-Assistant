import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerRootComponent } from 'expo';
import * as Updates from 'expo-updates';

/**
 * Expo Updates 로직
 * 앱이 시작될 때 새로운 업데이트가 있는지 체크하고, 
 * 업데이트가 있다면 즉시 다운로드 후 앱을 재시작하여 적용합니다.
 */
async function onFetchUpdateAsync() {
  if (__DEV__) {
    // 개발 환경(Expo Go 등)에서는 OTA 체크를 건너뜁니다.
    return;
  }

  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    // 업데이트 서비스에 연결할 수 없는 경우 에러를 기록합니다.
    console.error(`Error fetching latest Expo update: ${error}`);
  }
}

// 업데이트 체크 실행
onFetchUpdateAsync();

/**
 * React DOM 렌더링 및 Expo 앱 등록
 * registerRootComponent는 Expo 환경에서 앱의 진입점을 정의합니다.
 */
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}

registerRootComponent(App);