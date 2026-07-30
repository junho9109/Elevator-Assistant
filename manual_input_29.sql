-- 수동 입력 6.6.1.1


-- 6.6.1.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.1.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.1.1', '2022-03-02', NULL, 'current', '6.6.1.1 기계실·기계류 공간 및 풀리실 내에 설치되는 돌출물은 안전상 지장이 없어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');
