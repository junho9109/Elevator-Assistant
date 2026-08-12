-- "업데이트 내역" 기능을 위한 테이블: 깃허브 커밋을 AI가 이용자용 문구로 정리해 캐싱합니다.
CREATE TABLE IF NOT EXISTS public.changelog_cache (
  id SERIAL PRIMARY KEY,
  sha VARCHAR(40) NOT NULL UNIQUE,
  commit_date TIMESTAMP NOT NULL,
  raw_message TEXT NOT NULL,
  display_text TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
