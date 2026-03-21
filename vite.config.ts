import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    tailwindcss(),
    metaImagesPlugin(),

    // Expo 관련 shim (필요 시 유지, 현재는 주석 처리 가능)
    // {
    //   name: 'resolve-react-native-shim',
    //   enforce: 'pre',
    //   resolveId(id) {
    //     if (id === 'react-native') {
    //       return 'virtual:react-native-shim';
    //     }
    //   },
    //   load(id) {
    //     if (id === 'virtual:react-native-shim') {
    //       return `
    //         export * from 'react-native-web';
    //         export const TurboModuleRegistry = {
    //           get: () => null,
    //           getEnforcing: () => null,
    //         };
    //       `;
    //     }
    //   },
    // },
  ],

  resolve: {
    alias: {
      // 기존 alias 유지 (shadcn-ui 등에서 사용)
      "@": path.resolve(import.meta.dirname, "client", "src"),

      // 추가: 루트에 있는 App.tsx를 바로 참조 가능하게
      "~App": path.resolve(import.meta.dirname, "App.tsx"),

      // 기존 alias 유지
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
      define: {
        global: "window",
      },
    },
  },

  // 빌드 설정
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  // 개발 서버 설정
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
    hmr: {
      host: "localhost",
      port: 3000,
      protocol: "ws",
      clientPort: 3000,
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },

  // 루트 디렉토리 설정 (client 폴더가 실제 웹 루트)
  root: path.resolve(import.meta.dirname, "client"),
});