-- 접속 차단용 칸 추가 (실행 전 반드시 백업)
-- 이 칸이 없으면 로그인은 지금처럼 동작하고, 관리자가 "접속 차단"을 누르면 안내 오류가 나온다.
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS blocked_reason TEXT;
