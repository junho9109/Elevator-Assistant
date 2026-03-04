import fs from "node:fs";
import { type Server } from "node:http";
import path from "node:path";

import express, { type Express } from "express";

import runApp from "./app";

export async function serveStatic(app: Express, server: Server) {
  // ★★★ 여기 수정: dist/public으로 변경 ★★★
  const distPath = path.resolve(import.meta.dirname, "../dist/public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}. Run 'npm run build' first.`,
    );
  }

  // 정적 파일 서빙 (Vite 빌드 결과물)
  app.use(express.static(distPath));

  // SPA 라우팅: 모든 경로를 index.html로 리다이렉트
  app.get("*", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("index.html not found in dist/public");
    }
  });
}

(async () => {
  await runApp(serveStatic);
})();