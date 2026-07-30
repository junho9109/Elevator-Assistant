-- 수동 입력 6.5.6.2~6.5.6.4.2


-- 6.5.6.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.2', '2022-03-02', NULL, 'current', '6.5.6.2 권상 구동 엘리베이터의 주행안내 레일 길이
주행안내 레일 길이는 카 또는 균형추가 6.5.6.1에 따른 최고 위치에 있을 때 가이드 슈/롤러 위로 각각 0.1 m 이상 연장되어야 한다.');


-- 6.5.6.3.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6.3.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.3.1', '2022-03-02', NULL, 'current', '6.5.6.3 포지티브 구동 엘리베이터의 주행안내 레일 길이
6.5.6.3.1 카가 상승방향으로 상부 완충기에 충돌하기 전까지 안내되는 카의 주행거리는 최상층 승강장 바닥에서부터 위로 0.5 m 이상이어야 하며, 카는 완충기 행정의 한계까지 주행되어야 한다.
주택용 엘리베이터의 경우에는 0.25 m 이상으로 완화 적용할 수 있다.');


-- 6.5.6.3.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6.3.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.3.2', '2022-03-02', NULL, 'current', '6.5.6.3.2 평형추가 있는 경우, 평형추 주행안내 레일의 길이는 평형추가 6.5.6.1에 따른 최고 위치에 있을 때 그 가이드 슈/롤러 위로 0.3 m 이상 안내되어야 한다.
다만, 주택용 엘리베이터의 경우에는 0.15 m 이상으로 완화 적용할 수 있다.');


-- 6.5.6.4.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6.4.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.4.1', '2022-03-02', NULL, 'current', '6.5.6.4 유압식 엘리베이터의 주행안내 레일 길이
6.5.6.4.1 카 주행안내 레일의 길이는 카가 6.5.6.1에 따른 최고 위치에 있을 때 그 가이드 슈/롤러 위로 0.1 m 이상 안내되어야 한다.');


-- 6.5.6.4.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6.4.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.4.2', '2022-03-02', NULL, 'current', '6.5.6.4.2 평형추가 있는 경우, 평형추 주행안내 레일의 길이는 평형추가 6.5.6.1에 따른 최고 위치에 있을 때 가이드 슈/롤러 위로 0.1 m 이상 안내되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.4.2', '2013-09-15', '2022-03-01', 'old', '5.7.2.4 평형추가 설치된 경우, 완전히 압축된 잭의 완충정지장치에 의해 결정되는 카의 가장 높은 위치에 카가 있을 때 평형추의 가이드 길이는 0.1 + 0.035 V² (m) 이상이어야 한다.');
