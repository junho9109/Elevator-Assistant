import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.junho.elevatorassistant',
  appName: '엘리베이터 도우미',
  webDir: 'dist/public',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: true,  // 개발 중에만 true (배포 시 false로 변경)
    // hostname: 'your-app-domain.com'  ← 이 줄 주석 처리하거나 삭제
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
  // OTA 관련 설정 (Capgo 또는 EAS 사용 중이라면)
  // updates: {
  //   url: 'https://u.expo.dev/여기-프로젝트-ID',
  //   fallbackToCacheTimeout: 0,
  // },
};

export default config;
