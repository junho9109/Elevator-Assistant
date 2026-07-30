-- 수동 입력 6.5.1.1~6.5.1.3


-- 6.5.1.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.1.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.1', '2022-03-02', NULL, 'current', '6.5.1.1 승강로에는 1대 이상의 엘리베이터 카가 있을 수 있다. <2019년 3월 28일 이후 건축허가분부터 적용>');


-- 6.5.1.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.1.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.2', '2022-03-02', NULL, 'current', '6.5.1.2 엘리베이터의 균형추 또는 평형추는 카와 동일한 승강로에 있어야 한다. <2013년 9월 15일 이후 건축허가분부터 적용>');


-- 6.5.1.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.1.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.3', '2022-03-02', NULL, 'current', '6.5.1.3 승강로 내에 설치되는 돌출물은 안전상 지장이 없어야 한다. <2013년 9월 15일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.3', NULL, '2013-09-14', 'old', '3.1.3(9) 승강로 내에 설치되는 돌출물은 엘리베이터의 운행 및 안전상 지장이 없어야 한다.
4.1.3(17) 승강로 내 설치되는 돌출물은 엘리베이터의 운행 및 안전상 지장이 없어야 한다.');
