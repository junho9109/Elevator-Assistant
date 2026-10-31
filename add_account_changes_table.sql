-- 계정 변경 기록 (소속 변경 · 관리자 변경 · 접속 차단/해제 공통)
-- 실행 전 반드시 백업. 이 표가 없어도 소속 변경 자체는 동작하며, 기록만 남지 않는다.
CREATE TABLE IF NOT EXISTS account_changes (
  id SERIAL PRIMARY KEY,
  emp_id VARCHAR(50) NOT NULL,          -- 대상 사번
  name VARCHAR(50) NOT NULL,            -- 대상 이름
  kind VARCHAR(20) NOT NULL,            -- 'org_change' | 'block' | 'unblock'
  from_value VARCHAR(200),
  to_value VARCHAR(200),
  by_emp_id VARCHAR(50),                -- 변경한 사람(본인 변경이면 대상과 동일)
  by_name VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_account_changes_emp ON account_changes (emp_id, created_at DESC);
