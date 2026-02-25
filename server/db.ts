import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';  // ← 표준 pg 라이브러리 사용
import * as schema from "../shared/schema";  // 스키마 import (경로 맞게 확인)

// DATABASE_URL이 없으면 에러 던지기 (현재 코드 반대로 수정)
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // 로컬 연결을 위해 추가 옵션 (필요 시)
  ssl: false,  // 로컬이라 SSL 필요 없음
});

export const db = drizzle(pool, { schema });
