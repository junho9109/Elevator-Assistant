import { type Server } from "node:http";
import path from "node:path"; // 추가

import express, { type Express, type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { seedStandardIndex, seedStdItems } from "./seed-standard-index";
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
    // AI검색 좋아요/아쉬워요 피드백 + 답변 풀 테이블 (기존에 부트스트랩이 누락되어 있었음)
    try {
      await pool.query(`CREATE EXTENSION IF NOT EXISTS vector`);
    } catch (e) {
      console.error("vector 확장 활성화 실패:", e);
    }
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_feedback (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        rating INTEGER NOT NULL,
        sections TEXT[] DEFAULT '{}',
        reasons TEXT[] DEFAULT '{}',
        comment TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_answer_pool (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        thumbs_up INTEGER DEFAULT 0 NOT NULL,
        thumbs_down INTEGER DEFAULT 0 NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' NOT NULL,
        embedding vector(1536),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
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
    // [비활성화] 서버 재시작 시 자동 seed — DB가 이미 실시간 편집되는 단일 진실 소스가 된 뒤로는
    // 위험한 동작이 됨: 관리자가 정리/삭제로 행 수를 임계치(90%/83개) 밑으로 줄이면,
    // 다음 배포(=서버 재시작)에서 정적 JSON 스냅샷이 통째로 재시딩되어 방금 지운 옛 데이터가
    // 되살아난다. (2026-08-16 표준화 자료 정리 직후 재배포로 실제 발생.)
    // seedStandardIndex().catch((e) => console.error("[SEED] 오류:", e));
    // seedStdItems().catch((e) => console.error("[SEED] std_items 오류:", e));
  }
);
}