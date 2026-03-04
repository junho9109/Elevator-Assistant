import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.junho.elevatorassistant',
  appName: '엘리베이터 도우미',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    hostname: 'your-app-domain.com'  // 나중에 배포할 도메인
  },
  plugins: {
    LiveUpdates: {
      enabled: true,
      appId: 'your-live-updates-app-id',  // 아래에서 발급받음
      channel: 'production'  // 또는 'staging' 등
    }
  }
};

export default config;