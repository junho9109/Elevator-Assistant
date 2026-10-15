// push_tokens.employee_id 컬럼 보장 — 프로세스당 1회만 실행한다.
// (예전에는 푸시 등록/전송 요청마다 ALTER TABLE을 실행해서 불필요한 DB 호출이 생겼다.)
// 실패하면 다음 호출에서 다시 시도하도록 캐시를 비운다.
let ready: Promise<void> | null = null;

export function ensurePushTokenColumn(pool: { query: (sql: string) => Promise<unknown> }): Promise<void> {
  if (!ready) {
    ready = pool
      .query(`ALTER TABLE push_tokens ADD COLUMN IF NOT EXISTS employee_id varchar(50)`)
      .then(() => undefined)
      .catch((e) => {
        ready = null;
        throw e;
      });
  }
  return ready;
}
