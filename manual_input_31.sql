-- 수동 입력 6.6.2.1, 6.6.2.2


-- 6.6.2.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.2.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.2.1', '2022-03-02', NULL, 'current', '6.6.2.1 주 개폐기와 조명 스위치를 쉽게 식별할 수 있는 안내표지가 있어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');


-- 6.6.2.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.2.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.2.2', '2022-03-02', NULL, 'current', '6.6.2.2 주 개폐기가 차단된 후에도 전기가 통하는 부품(엘리베이터 간 상호연결, 조명 등)이 있는 경우에는 감전 등 위험을 알리는 안내표지가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.2.2', '2013-09-15', '2022-03-01', 'old', '15.4.2 주 개폐기 및 조명 스위치를 쉽게 식별할 수 있는 표시가 있어야 한다.
주 개폐기 개방 후에 전기가 통하는 어떤 부품(엘리베이터 간 상호결선, 조명 등)이 있는 경우에는 이 위험을 알리는 표시가 있어야 한다.');
