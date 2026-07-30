-- 수동 입력 6.5.5.2


-- 6.5.5.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.5.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.2', '2022-03-02', NULL, 'current', '6.5.5.2 여러 대의 엘리베이터가 있는 승강로에는 서로 다른 엘리베이터의 움직이는 부품들 사이에 칸막이가 있어야 한다.
칸막이에 구멍이 있는 경우에는 KS B ISO 13857, 표4에 따라야 한다.
칸막이의 기계적 강도는 5 ㎠ 면적의 원형 또는 정사각형 모양의 어느 지점마다 수직으로 300 N의 힘을 균등하게 분산하여 가할 때 움직이는 부품들에 충돌되지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.2', '2013-09-15', '2022-03-01', 'old', '5.6.2 2대 이상의 엘리베이터가 있는 승강로에는 서로 다른 엘리베이터의 움직이는 부품 사이에 칸막이가 설치되어야 한다. 칸막이에 구멍이 있는 경우에는 KS B 6947, 4.5.1에 따라야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.2', '1997-08-18', '2013-09-14', 'old', '3.1.3(13) 동일 승강로에 2대 이상의 엘리베이터를 설치한 경우에 속도가 다르거나 정지층이 달라 피트 바닥의 높이차가 0.6m 이상일 때에는 그 사이에 높이 1.1m 이상의 추락방지용 난간을 견고하게 설치하여야 한다.');
