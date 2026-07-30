-- 수동 입력 6.5.7.3, 6.5.7.4


-- 6.5.7.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.7.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.7.3', '2022-03-02', NULL, 'current', '6.5.7.3 카 지붕 또는 카 지붕의 설비 위에 어떤 하나의 연속되는 구역이 유효 면적 0.12 ㎡ 이상이고 가장 작은 변의 길이가 0.25 m 이상인 경우, 그 구역은 사람이 서 있을 수 있는 장소로 본다.
카가 6.5.6.1에 따른 최고 위치에 있을 때, 그 구역 위로 승강로 천장의 가장 낮은 부분(천장 아래에 있는 빔과 부품을 포함) 사이의 수직 틈새는 6.5.7.1에 따른 관련 피난 공간의 높이 이상이어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');


-- 6.5.7.4
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.7.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.7.4', '2022-03-02', NULL, 'current', '6.5.7.4 유압식 엘리베이터의 경우, 승강로 천장의 가장 낮은 부분과 상승방향으로 주행하는 램-헤드 조립체의 가장 높은 부분 사이의 유효 수직거리는 0.1 m 이상이어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');
