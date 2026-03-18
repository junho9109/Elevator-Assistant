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
    tailwindcss(), // Tailwind v4 Vite 플러그인
    metaImagesPlugin(),
    // 빌드 시 TurboModuleRegistry를 강제로 주입하는 플러그인 (Expo 에러 방지)
    {
      name: 'resolve-react-native-shim',
      enforce: 'pre',
      resolveId(id) {
        if (id === 'react-native') {
          return 'virtual:react-native-shim';
        }
      },
      load(id) {
        if (id === 'virtual:react-native-shim') {
          return `
            export * from 'react-native-web';
            export const TurboModuleRegistry = {
              get: () => null,
              getEnforcing: () => null,
            };
            export default { 
              TurboModuleRegistry: { get: () => null, getEnforcing: () => null } 
            };
          `;
        }
      }
    },
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
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
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
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
});