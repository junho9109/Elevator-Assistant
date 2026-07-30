-- 수동 입력 6.4.2~6.4.3


-- 6.4.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.4.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.2', '2022-03-02', NULL, 'current', '6.4.2 점검문 및 비상문이 있는 경우, 승강로 외부의 점검문 및 비상문 외부에는 다음과 같은 경고문이 표기되어야 한다.
엘리베이터 승강로 – 위험
관계자 외 접근 금지');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.2', '2013-09-15', '2022-03-01', 'old', '15.5.1 점검문 또는 출입문(승강장문 제외) 근처 승강로 외부에는 “엘리베이터 승강로 - 위험, 관계자외 접근금지”와 같은 경고문이 표기되어야 한다.');


-- 6.4.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.4.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.3', '2022-03-02', NULL, 'current', '6.4.3 엘리베이터 승강장문 전면 바닥에는 다음과 같은 주의문이 표기되어야 한다.
문이 열리면 승강기안의 바닥을 확인한 후 탑승하기 바랍니다.
비고 표지의 규격과 부착방법 및 부착위치에 관한 세부기준은 행정안전부장관이 별도 고시하는 「승강기 안전운행 및 관리에 관한 운영규정」 별표 4에 따른다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.3', '2013-09-15', '2022-03-01', 'additional', '15.5.4 다음과 같은 경우 필요한 모든 운전지침이 있는 경고문이 승강로의 적절한 위치에 표기되어야 한다.
- 집어넣을 수 있는 플랫폼(6.4.5) 및 움직일 수 있는 멈춤 쇄기 [(6.4.5.2나)]
- 수동 작동 기계장치 (6.4.3.1 및 6.4.4.1)');
