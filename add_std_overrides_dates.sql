-- std_item_overrides에 건축허가일/기준적용일/검사일 컬럼 추가
-- (지금까지 표준화 수정 화면에서 이 세 날짜를 입력해도 저장할 컬럼이 없어서
--  실제로는 저장되지 않고, 다시 수정을 열 때마다 비어있는 것처럼 보였음)

ALTER TABLE std_item_overrides ADD COLUMN IF NOT EXISTS permit_date varchar(20);
ALTER TABLE std_item_overrides ADD COLUMN IF NOT EXISTS inspection_date varchar(20);
ALTER TABLE std_item_overrides ADD COLUMN IF NOT EXISTS inspection_year varchar(20);
