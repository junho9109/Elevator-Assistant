-- std_item_overrides 테이블에 설치검사일 컬럼 추가
ALTER TABLE std_item_overrides ADD COLUMN IF NOT EXISTS install_inspection_date varchar(20);
