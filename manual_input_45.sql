-- 수동 입력 6.6.7.1, 6.6.7.1.1, 6.6.7.1.2


-- 6.6.7.1 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.7.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.7.1', '2022-03-02', NULL, 'current', '6.6.7.1 풀리실의 크기 등 치수');


-- 6.6.7.1.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.7.1.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.7.1.1', '2022-03-02', NULL, 'current', '6.6.7.1.1 풀리실은 자격자가 모든 설비에 쉽고 안전하게 접근할 수 있도록 다음과 같이 충분한 크기이어야 한다.
가) 움직일 수 있는 유효 높이는 1.5 m 이상이어야 한다.
이 움직일 수 있는 유효 높이는 접근 구역의 바닥에서부터 가장 낮은 충돌 지점의 아래 부분까지 측정한다.
나) 움직이는 부품의 점검 및 유지관리 업무 수행이 필요한 곳에 0.5 m × 0.6 m 이상의 유효 수평 면적이 있어야 한다.
이 수평 유효 면적에 접근하는 통로의 유효 폭은 0.5 m 이상이어야 한다. 다만, 움직이는 부품이나 14.1.1.6에 따른 고온의 표면이 없는 경우에는 0.4 m까지 감소될 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.7.1.1', '2013-09-15', '2022-03-01', 'old', '6.7.1.2.2 천장 아래의 높이는 1.5 m 이상이어야 한다.

[전기식]
6.7.1.2.1 풀리실의 크기는 유지보수 점검자가 모든 설비에 쉽고 안전한 출입을 위하여 충분하여야 하며 다음 사항에 적합하여야 한다.
가) 움직이는 부품의 유지보수 및 점검을 위한 유효 수평면적은 0.5 m × 0.6 m 이상이어야 한다.
나) 유효 공간으로의 접근 통로의 폭은 0.5 m 이상이어야 한다. 다만, 움직이는 부품이 없는 경우에는 0.4 m로 줄일 수 있다.

[유압식]
6.7.1.2.1 풀리실의 크기는 유지보수 점검자가 모든 설비에 쉽고 안전한 출입을 위하여 충분하여야 하며 다음 사항에 적합하여야 한다.
가) 수동 비상운전 수단(12.9.1)이 필요할 경우, 움직이는 부품의 유지보수 및 점검을 위한 유효 수평면적은 0.5 m × 0.6 m 이상이어야 한다.
나) 6.7.1.2.2에 기술된 유효 공간으로의 접근 통로는 0.5 m 이상이어야 한다. 다만, 움직이는 부품이 없는 경우에는 0.4 m로 줄일 수 있다.
이동을 위한 유효 높이는 접근공간의 바닥에서부터 천장의 빔 하부까지 측정한다.');


-- 6.6.7.1.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.7.1.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.7.1.2', '2022-03-02', NULL, 'current', '6.6.7.1.2 보호되지 않은 회전부품 위에서 0.3 m 이상의 유효 수직거리가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.7.1.2', '2013-09-15', '2022-03-01', 'old', '6.7.1.2.3 풀리 위로 0.3 m 이상의 유효 공간이 있어야 한다.');
