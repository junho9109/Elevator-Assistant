-- 수동 입력 6.6.1.2


-- 6.6.1.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.1.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.1.2', '2022-03-02', NULL, 'current', '6.6.1.2 기계실·기계류 공간 및 풀리실은 누수가 없어야 하며, 청결상태가 유지되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.1.2', '2017-01-28', '2022-03-01', 'old', '6.1.2 구동기 공간 및 풀리 공간은 청결상태가 유지되어야 한다.');
