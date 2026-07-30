-- 수동 입력 6.5.5.2.1


-- 6.5.5.2.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.5.2.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.2.1', '2022-03-02', NULL, 'current', '6.5.5.2.1 칸막이는 피트 바닥에서 0.3 m 이내부터 최하층 승강장 바닥에서 위로 2.5 m 이상까지 설치되어야 한다.
칸막이의 폭은 서로 다른 피트 간의 접근을 방지할 수 있는 크기이어야 한다.
6.3.3라)에 따른 위험이 없는 경우의 조건을 충족하는 경우, 칸막이는 피트 바닥에서 0.3 m 이내의 가장 낮은 지점 아래에 있을 필요는 없다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.2.1', '2013-09-15', '2022-03-01', 'old', '5.6.2.1 칸막이는 카, 균형추 또는 평형추 주행로의 가장 낮은 지점에서부터 최하층 승강장 바닥 위로 2.5 m 이상으로 설치되어야 한다. 칸막이의 폭은 5.2.2.2.2의 규정을 만족하는 경우를 제외하고, 서로 다른 피트에서 피트로의 접근을 방지할 수 있어야 한다.');
