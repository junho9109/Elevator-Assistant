-- 수동 입력 6.6.3.2.2


-- 6.6.3.2.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.3.2.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.2', '2022-03-02', NULL, 'current', '6.6.3.2.2 작업구역(6.6.3.2.1)간 이동통로의 유효 높이(바닥에서 천장의 가장 낮은 충돌점 사이)는 1.8 m 이상이어야 한다.
작업구역 간 이동통로의 유효 폭은 0.5 m 이상이어야 한다. 다만, 움직이는 부품이나 14.1.1.6에 따른 고온의 표면이 없는 경우에는 0.4 m까지 감소될 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.2', '2013-09-15', '2022-03-01', 'old', '6.3.3.2 6.3.3.1에서 기술된 유효 공간으로 접근하는 통로의 폭은 0.5 m 이상이어야 한다. 다만, 움직이는 부품이 없는 경우에는 0.4 m로 줄일 수 있다.
이동을 위한 공간의 유효 높이는 바닥에서부터 천장의 빔 하부까지 측정하여 1.8 m 이상이어야 한다.');
