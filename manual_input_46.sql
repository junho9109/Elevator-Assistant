-- 수동 입력 6.6.7.2 (6장 마지막 조문)


-- 6.6.7.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.7.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.7.2', '2022-03-02', NULL, 'current', '6.6.7.2 그 밖의 개구부
슬라브 및 풀리실 바닥의 개구부 크기는 그 목적을 위해 최소화 되어야 한다.
승강로 위에 있는 개구부(전기 케이블을 위한 개구부 포함)를 통해 물건이 떨어지는 위험이 없도록 금속이나 플라스틱으로 된 덮개가 사용되어야 하며, 그 덮개는 슬라브 또는 마감된 바닥 위로 50 ㎜ 이상 돌출되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.7.2', '2013-09-15', '2022-03-01', 'old', '6.7.1.4 기타 개구부
슬라브 및 풀리실 바닥의 구멍은 그 목적을 위해 최소의 크기로 줄여야 한다.
승강로 위에 위치한 개구부를 통해 전선을 포함한 물건이 떨어지는 위험이 없도록 금속이나 플라스틱으로 된 덮개가 사용되어야 하며 그 덮개는 슬라브 또는 마감된 바닥 위로 50 mm 이상 돌출되어야 한다.');
