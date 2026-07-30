-- 수동 입력 7.4 (신규 제목), 7.4.1, 7.4.2, 7.4.3, 7.5 (신규 제목)


-- 7.4 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.4', '2022-03-02', NULL, 'current', '7.4 승강장문과 카문 사이의 수평 틈새');


-- 7.4.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.4.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.4.1', '2022-03-02', NULL, 'current', '7.4.1 카문의 문턱과 승강장문의 문턱 사이의 수평 거리는 35 ㎜ 이하이어야 한다.(그림 3 참조)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.4.1', '2013-09-15', '2022-03-01', 'old', '카 문턱과 승강장문 문턱 사이의 수평거리는 35 mm 이하이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.4.1', NULL, '2013-09-14', 'old', '3.1.3(5) 승강장 출입구 바닥 앞부분과 카 바닥 앞부분과의 틈의 너비는 4㎝ 이하로 하여야 한다.

4.1.2(10) 승강장 출입구 바닥 앞부분과 카 바닥 앞부분과의 틈의 너비는 4㎝ 이하이어야 한다. 다만, 장애인용 엘리베이터의 경우에는 그러하지 아니하다.');


-- 7.4.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.4.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.4.2', '2022-03-02', NULL, 'current', '7.4.2 승강장문과 카문 전체가 정상 작동하는 동안, 카문의 앞 부분과 승강장문 사이의 수평 거리는 0.12 m 이하이어야 한다.(그림 3 참조)
비고 승강장문 전면에 건축물의 출입문이 추가되어 공간이 발생한 경우, 그 공간 사이에 사람이 갇히지 않도록 조치해야 한다.(6.2.1 및 6.2.3 참조)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.4.2', '2013-09-15', '2022-03-01', 'old', '11.2.3 카문과 닫힌 승강장문 사이의 수평거리 또는 문이 정상 작동하는 동안 문 사이의 접근거리는 0.12 m 이하이어야 한다.');


-- 7.4.3
DELETE FROM inspection_item_revisions WHERE item_id = '7.4.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.4.3', '2022-03-02', NULL, 'current', '7.4.3 다음과 같은 조합인 경우, 그림 8, 그림 9 또는 그림 10과 같이 닫힌 문 사이의 어떤 틈새에도 직경 0.15 m의 구가 있을 가능성이 없어야 한다.
가) 경첩이 있는 승강장문과 접히는 카문의 조합(그림 8 참조)
나) 경첩이 있는 승강장문과 수평 개폐식 카문의 조합(그림 9 참조)
다) 기계적으로 연동되지 않은 수평 개폐식 승강장문과 카문의 조합(그림 10 참조)
비고 그림 10은 “닫힌 카문 및 열린 승강장문의 조합”에도 적용된다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.4.3', '2013-09-15', '2022-03-01', 'old', '11.2 카와 카 출입구를 마주하는 벽 사이의 틈새
다음 사항은 그림 5 및 6에서 설명된다.

11.2.4 경첩이 있는 승강장문과 접히는 카문의 조합인 경우에는 닫힌 문 사이의 어떤 틈새에도 직경 0.15 m의 구가 통과되지 않아야 한다.');


-- 7.5 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.5' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5', '2022-03-02', NULL, 'current', '7.5 승강장문 및 카문의 강도');
