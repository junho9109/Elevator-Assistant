import { type Server } from "node:http";
import path from "node:path"; // 추가

import express, { type Express, type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { seedStandardIndex } from "./seed-standard-index";
import { pool } from "./db";

async function ensureChatTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        user_name VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        reply_to_id INTEGER,
        reply_to_user VARCHAR(50),
        reply_to_content TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS std_item_photos (
        id SERIAL PRIMARY KEY,
        item_key VARCHAR(200) NOT NULL,
        image_data TEXT NOT NULL,
        mime_type VARCHAR(50) DEFAULT 'image/jpeg',
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
  } catch (e) {
    console.error("테이블 생성 실패:", e);
  }
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

app.use(express.json({
  limit: '50mb',
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));

app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// 여기 추가 (사진 복구 핵심)
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use((req, res, next) => {
  const start = Date.now();
  const pathName = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathName.startsWith("/api")) {
      let logLine = `${req.method} ${pathName} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

export default async function runApp(
  setup: (app: Express, server: Server) => Promise<void>,
) {
  await ensureChatTable();
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  await setup(app, server);

  const port = parseInt(process.env.PORT || '3000', 10);

  server.listen(
  {
    port,
    host: "0.0.0.0",
  },
  () => {
    log(`serving on port ${port}`);
    // 서버 시작 후 백그라운드에서 standard_index seed 실행
    seedStandardIndex().catch((e) => console.error("[SEED] 오류:", e));
  }
);
}