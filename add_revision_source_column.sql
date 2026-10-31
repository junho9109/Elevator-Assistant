-- 연혁 출처 칸 추가 (백업 후 실행). 빈 값 허용, 기존 데이터 영향 없음.
ALTER TABLE inspection_item_revisions ADD COLUMN IF NOT EXISTS source varchar(100);
