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
  // Neon처럼 유휴 시 컴퓨트가 슬립하는 서버리스 DB는 풀에 대기 중인(idle) 커넥션을
  // 서버 쪽에서 끊어버릴 수 있다. 이 값보다 오래 놀고 있는 커넥션은 우리 쪽에서 먼저
  // 정리해서, 이미 죽은 커넥션을 다시 꺼내 쓰다가 매 쿼리가 실패하는 상황을 줄인다.
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// [중요] pg-pool은 idle 커넥션이 DB 쪽에서 갑자기 끊기면(예: Neon 컴퓨트 슬립/재시작)
// Pool에 'error' 이벤트를 발생시킨다. 리스너가 하나도 없으면 Node가 이를 처리되지 않은
// 예외로 간주해 프로세스가 죽거나, 죽은 커넥션이 풀에 계속 남아 그 이후의 모든 쿼리가
// 똑같이 실패하는 상태로 굳어버릴 수 있다(실제로 이 문제로 전체 API가 500을 내다가
// 재배포로 프로세스를 새로 띄워야만 복구된 사례가 있었음). 여기서 에러를 잡아 로그만
// 남기면, pg가 내부적으로 죽은 클라이언트를 풀에서 제거하고 다음 쿼리부터 새 커넥션을
// 맺어 자동 복구된다.
pool.on('error', (err) => {
  console.error('[DB Pool 에러 — idle 커넥션이 예기치 않게 끊김, 자동 복구 시도]', err);
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
