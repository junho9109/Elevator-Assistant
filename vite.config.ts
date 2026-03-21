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
          `;
        }
      },
    },
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "~App": path.resolve(import.meta.dirname, "App.tsx"),
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

  root: path.resolve(import.meta.dirname, "client"),
});