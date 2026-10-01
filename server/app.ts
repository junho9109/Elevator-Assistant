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
    // 관리자 패널(클러스터 현황 조회)이 status로 필터링하고 updated_at으로 정렬하므로,
    // 데이터가 누적돼도 조회가 느려지지 않도록 인덱스를 미리 걸어둠
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_ai_answer_pool_status ON ai_answer_pool (status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_ai_answer_pool_updated_at ON ai_answer_pool (updated_at DESC)`);

    // [2026-09] "자료 범위 밖" 답변 → AI 웹 검색 보강 → 관리자 승인 파이프라인용 테이블.
    // ai_answer_pool(사람 피드백 기반)과 신뢰 수준이 다른 별도 테이블로 분리해,
    // 관리자가 "사람이 검증한 것"과 "AI가 찾아온 미검증 외부자료"를 명확히 구분해서 본다.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_research_candidates (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        original_answer TEXT NOT NULL,
        summary TEXT NOT NULL,
        sources JSONB DEFAULT '[]' NOT NULL,
        status VARCHAR(20) DEFAULT 'pending_review' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        reviewed_at TIMESTAMP
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_ai_research_candidates_status ON ai_research_candidates (status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_ai_research_candidates_created_at ON ai_research_candidates (created_at DESC)`);

    // [2026-09] 사용자별 질문/피드백 통계용. 로그인 정보(사번/이름/소속)가 있는 사용자만
    // 채워지고, 로그인 안 한 익명 사용자는 employee_id가 NULL로 남는다(강제하지 않음 —
    // 기존 사용 흐름을 막지 않기 위함).
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_question_log (
        id SERIAL PRIMARY KEY,
        employee_id VARCHAR(50),
        employee_name VARCHAR(50),
        team VARCHAR(100),
        question TEXT NOT NULL,
        mode VARCHAR(20),
        is_elevator_query BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_ai_question_log_employee_id ON ai_question_log (employee_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_ai_question_log_created_at ON ai_question_log (created_at DESC)`);

    // ai_feedback(좋아요/아쉬워요)에도 동일한 취지로 사용자 컬럼 추가.
    // 기존 배포에 이미 테이블이 있으므로 ALTER로 컬럼만 보강한다(멱등).
    await pool.query(`ALTER TABLE ai_feedback ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50)`);
    await pool.query(`ALTER TABLE ai_feedback ADD COLUMN IF NOT EXISTS employee_name VARCHAR(50)`);
    await pool.query(`ALTER TABLE ai_feedback ADD COLUMN IF NOT EXISTS team VARCHAR(100)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_ai_feedback_employee_id ON ai_feedback (employee_id)`);

    // [2026-09] 기술자료(표준화가 아닌 자유형식 자료 — 소음, 기종별 특성 등)를
    // 표준화(std_item_overrides)와 완전히 분리된 데이터소스로 관리하기 위한 테이블.
    // title에는 std_item_overrides가 놓쳤던 unique 제약을 명시해 중복 저장을 막는다.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS technical_materials (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL UNIQUE,
        category TEXT,
        body TEXT NOT NULL,
        source TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_technical_materials_category ON technical_materials (category)`);

    // 기술자료 이미지 — std_item_photos와 동일 패턴(item_key로 technical_materials.title과 매칭)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tech_material_photos (
        id SERIAL PRIMARY KEY,
        item_key VARCHAR(200) NOT NULL,
        image_data TEXT NOT NULL,
        mime_type VARCHAR(50) DEFAULT 'image/jpeg',
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    // [2026-09-29] inspection_base_items 변경 이력(감사 로그). 같은 날 발생한 사고(엘리베이터
    // 부속서Ⅱ가 standardEquipmentType 기본값 처리 버그로 에스컬레이터 내용에 덮어써짐) 재발 시
    // PDF 재추출 없이 바로 이전 값으로 되돌릴 수 있도록, update/upsert 직전 스냅샷을 여기 적재한다.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inspection_base_items_history (
        id SERIAL PRIMARY KEY,
        base_item_id INTEGER NOT NULL,
        item_id VARCHAR(50) NOT NULL,
        standard_equipment_type VARCHAR(20) NOT NULL,
        section_title VARCHAR(200),
        text TEXT NOT NULL,
        change_type VARCHAR(10) NOT NULL,
        changed_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_inspection_base_items_history_lookup ON inspection_base_items_history (item_id, standard_equipment_type, changed_at DESC)`);

    // [2026-09-29] AI 피드백 현황 "읽음" 관리 — 클러스터가 쌓여도 관리자가 새로 생기거나
    // 상태가 바뀐 것만 빠르게 구분할 수 있도록 마지막으로 확인한 시각을 기록한다.
    // NULL이면 "한 번도 확인 안 함". updated_at이 이 값보다 최신이면(좋아요/아쉬워요가
    // 새로 붙어 상태가 바뀐 경우 포함) 다시 "읽지 않음"으로 뜬다. 기존 행에는 영향 없는
    // 순수 추가 컬럼이라 되돌릴 때도 DROP COLUMN 한 줄이면 충분하다.
    await pool.query(`ALTER TABLE ai_answer_pool ADD COLUMN IF NOT EXISTS last_reviewed_at TIMESTAMP`);

    // [2026-10-01] 연혁 "확인 요청" 신고 — 검사기준 연혁(특히 과거 문서에서 사람이 수동으로
    // 매핑한 항목)은 실제 현장 전문가가 봤을 때 "이 매핑이 이상하다"고 느낄 수 있다.
    // 관리자뿐 아니라 일반 이용자도 특정 연혁 항목을 신고할 수 있게 하고, 관리자가
    // "AI 학습 관리" 화면에서 모아서 검토 후 처리(resolved)한다. 비밀번호 검증 없이
    // 누구나 생성 가능(단순 신고일 뿐 데이터를 직접 바꾸지 않으므로 위험이 없다).
    await pool.query(`
      CREATE TABLE IF NOT EXISTS revision_flags (
        id SERIAL PRIMARY KEY,
        revision_id INTEGER NOT NULL,
        item_id VARCHAR(50) NOT NULL,
        equipment_type VARCHAR(20) NOT NULL,
        note TEXT,
        employee_id VARCHAR(50),
        employee_name VARCHAR(50),
        resolved BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        resolved_at TIMESTAMP
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_revision_flags_resolved ON revision_flags (resolved)`);

    // 2026-10 "법령개정" — 메모 페이지 안에서 관리자가 고시 전문을 붙여넣어 등록하고
    // 이용자는 목록에서 골라 읽기만 하는 용도. 검사기준(별표22/24)과는 별개로, 수수료
    // 고시처럼 조문 트리가 필요 없는 짧은 고시문을 통째로 저장한다.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS law_notices (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        notice_number VARCHAR(100),
        effective_date DATE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_law_notices_effective_date ON law_notices (effective_date DESC NULLS LAST)`);
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