-- 수동 입력 6.5.1.4~6.5.1.5


-- 6.5.1.4
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.1.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.4', '2022-03-02', NULL, 'current', '6.5.1.4 승강로 내에는 각 층을 나타내는 표기가 있어야 한다. <2013년 9월 15일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.4', NULL, '2013-09-14', 'old', '4.1.3(22) 승강로 내에는 각층을 나타내는 표기가 되어 있어야 한다.');


-- 6.5.1.5
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.1.5' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.5', '2022-03-02', NULL, 'current', '6.5.1.5 승강로는 누수가 없고 청결상태가 유지되는 구조이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.5', '2017-01-28', '2022-03-01', 'old', '5.1.5 승강로는 누수가 없는 구조이어야 한다.
5.1.6 승강로는 청결상태가 유지되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.5', '2013-09-15', '2017-01-27', 'old', '5.1.5 승강로는 누수가 없는 구조이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.5', NULL, '2013-09-14', 'old', '4.1.1(1)⑩ 기계실은 누수가 없이 청결하여야 한다.
4.1.3(25) 승강로는 누수가 없이 청결하여야 한다.');
