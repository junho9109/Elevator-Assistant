-- 수동 입력 7.2 (신규 제목), 7.2.1, 7.2.2, 7.3 (신규 제목), 7.3.1


-- 7.2 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.2', '2022-03-02', NULL, 'current', '7.2 출입문의 높이 및 폭');


-- 7.2.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.2.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.2.1', '2022-03-02', NULL, 'current', '7.2.1 높이
승강장문 및 카문의 출입구 유효 높이는 2 m 이상이어야 한다. 다만, 주택용 엘리베이터의 경우에는 1.8 m 이상으로 할 수 있으며, 자동차용 엘리베이터의 경우에는 제외한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.2.1', '2013-09-15', '2022-03-01', 'old', '7.3.1 높이
승강장문의 유효 출입구 높이는 2 m 이상이어야 한다. 다만, 자동차용 엘리베이터는 제외한다.

8.1.2 카 출입구의 유효 높이는 2 m 이상이어야 한다. 다만, 자동차용 엘리베이터는 제외한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.2.1', '2005-06-01', '2013-09-14', 'old', '3.1.2(6) 카 및 승강장 문은 다음 각항의 기준에 적합하여야 한다.
① 카 및 승강장 문의 유효 출입구의 높이는 2.0m이상이어야 한다. 다만, 화물용 및 자동차용은 제외한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.2.1', '2003-06-18', '2005-05-31', 'old', '3.1.2(6) 카 내부치수 및 도어치수는 KS B ISO 4190-1 부속서에 따른다. 다만 카 내부치수는 KS B ISO 4190-1 부속서 또는 용도 및 적재하중을 고려한 최적 카 내부치수와 면적대비시 5% 이내의 증가는 허용할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.2.1', '1997-08-18', '2003-06-17', 'old', '3.1.2(6) “카 내부치수 및 도어치수는 KS B 6830(승용엘리베이터와 승강로의 치수)에 따른다. 다만 카 내부치수는 KS S 6830 또는 용도 및 적재하중을 고려한 최적 카 내부치수와 면적대비시 5% 이내의 증가는 허용할 수 있다.”');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.2.1', NULL, '1997-08-17', 'old', '3.1.2(6) 카 내부의 치수 및 도어치수는 KS B 6830(승용엘리베이터와 승강로의 치수)에 따른다.”');


-- 7.2.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.2.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.2.2', '2022-03-02', NULL, 'current', '7.2.2 폭
승강장문의 출입구 유효 폭은 카 출입구 폭 이상으로 하되, 카 출입구 폭보다 50 ㎜를 초과하지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.2.2', '2013-09-15', '2022-03-01', 'old', '7.3.2 폭
승강장문의 유효 출입구 폭은 카 출입구의 폭 이상으로 하되, 양쪽 측면 모두 카 출입구 측면의 폭보다 50 mm를 초과하지 않아야 한다.');


-- 7.3 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3', '2022-03-02', NULL, 'current', '7.3 문턱, 가이드 및 문의 현수');


-- 7.3.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.3.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.1', '2022-03-02', NULL, 'current', '7.3.1 문턱
모든 승강장 및 카 출입구에는 카 내부에 들어가는 하중을 견디도록 충분한 강도(11.2.3.6 참조)의 문턱이 있어야 한다.
비고 물청소나 스프링클러의 작동 등으로 물이 승강로에 들어가지 않도록 각 승강장문 문턱 앞의 바닥은 약간 경사지게 마감하는 것이 바람직하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.1', '2013-09-15', '2022-03-01', 'old', '7.4.1 문턱
모든 승강장의 출입구에는 카에 들어가는 하중을 견디도록 충분한 강도의 문턱이 있어야 한다.
비고 물청소, 스프링클러의 작동 등으로 물이 승강로에 들어가지 않도록 각 승강장 문턱 앞의 바닥을 약간 경사지도록 마감하는 것이 좋다.

8.6.6 문턱, 가이드 및 문의 현수
카문과 관련하여 7.4의 규정이 준수되어야 한다.');
