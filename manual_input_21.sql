-- 수동 입력 6.5.6.1.1~6.5.6.1.4 (표 1 내용은 사용자가 별도 첨부 예정)


-- 6.5.6.1.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6.1.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.1.1', '2022-03-02', NULL, 'current', '6.5.6 카, 균형추 및 평형추의 주행구간 <2019년 3월 28일 이후 건축허가분부터 적용>
6.5.6.1 카, 균형추 및 평형추의 끝단 위치
6.5.6.1.1 표 1에 따른 카, 균형추 및 평형추의 끝단 위치는 6.5.6에 따른 주행구간, 6.5.7 및 6.5.8에 따른 피난 공간 및 틈새에 관한 기준이 고려되어야 한다.');


-- 6.5.6.1.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6.1.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.1.2', '2022-03-02', NULL, 'current', '6.5.6.1.2 권상 구동 엘리베이터의 구동기 감속이 16.1.3에 따라 감지되는 경우, 표 1의 0.035·v² 값을 카 또는 균형추가 완충기에 닿을 때의 속도를 고려하여 줄일 수 있다. (12.2.2.2 참조)');


-- 6.5.6.1.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6.1.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.1.3', '2022-03-02', NULL, 'current', '6.5.6.1.3 튀어오름 방지장치(제동 또는 록다운 장치)에 장착된 인장 도르래가 있는 보상 로프가 설치된 권상 구동 엘리베이터의 경우, 표 1의 0.035·v² 값을 도르래의 이동 가능한 거리(사용된 로프에 따라)에 카 주행거리의 1/500을 더한 값(로프의 탄성을 고려하여 0.2 m 이상)으로 계산을 대신할 수 있다.');


-- 6.5.6.1.4
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6.1.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.1.4', '2022-03-02', NULL, 'current', '6.5.6.1.4 직접 유압식 엘리베이터의 경우에는 표 1의 0.035·v² 값을 고려할 필요가 없다.');
