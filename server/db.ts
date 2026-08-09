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
  ssl: process.env.DATABASE_URL?.includes('neon.tech')
    ? { rejectUnauthorized: false }
    : false,
});

// Neon pooler(-pooler 엔드포인트)를 거치면 ALTER ROLE ... SET search_path 기본값이
// 세션에 반영되지 않는 경우가 있어, 커넥션마다 명시적으로 search_path를 지정한다.
pool.on('connect', (client) => {
  client.query('SET search_path TO public').catch((err) => {
    console.error('search_path 설정 실패:', err);
  });
});

export const db = drizzle(pool, { schema });
export { pool };
