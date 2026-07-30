-- 수동 입력 6.5.5.2.2


-- 6.5.5.2.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.5.2.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.2.2', '2022-03-02', NULL, 'current', '6.5.5.2.2 칸막이는 보호난간의 내측 모서리와 인접한 엘리베이터의 움직이는 부품(카, 균형추 또는 평형추) 사이의 수평거리가 0.5 m 미만인 경우에는 승강로 전체 높이까지 연장되어야 한다.
칸막이의 폭은 움직이는 부품의 폭에 양쪽 모두 각각 0.1 m를 더한 값 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.2.2', '2013-09-15', '2022-03-01', 'old', '5.6.2.2 칸막이는 카 지붕의 모서리와 인접한 엘리베이터의 움직이는 부품(카, 균형추 또는 평형추) 사이의 수평거리가 0.5 m 미만인 경우에는 승강로 전체 높이까지 설치되어야 한다.
칸막이의 폭은 움직이는 부품의 폭에 양쪽 모두 각각 0.1 m를 더한 값 이상이어야 한다.');
