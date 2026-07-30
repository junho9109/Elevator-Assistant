-- 수동 입력 6.6.3.2.3, 6.6.3.2.4, 6.6.3.2.5, 6.6.3.3, 6.6.4.1.1


-- 6.6.3.2.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.3.2.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.3', '2022-03-02', NULL, 'current', '6.6.3.2.3 보호되지 않은 회전부품 위로 0.3 m 이상의 유효 수직거리가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.3', '2013-09-15', '2022-03-01', 'old', '6.3.3.3 구동기의 회전부품 위로 0.3 m 이상의 유효 수직거리가 있어야 한다.');


-- 6.6.3.2.4
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.3.2.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.4', '2022-03-02', NULL, 'current', '6.6.3.2.4 기계실 바닥에 0.5 m를 초과하는 단차가 있는 경우, 6.2.5에 따른 고정된 사다리 또는 보호난간이 있는 계단이나 발판이 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.4', '2013-09-15', '2022-03-01', 'old', '6.3.3.4 기계실 바닥에 0.5 m를 초과하는 단차가 있을 경우에는 보호난간이 있는 계단 또는 발판이 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.4', '2003-06-18', '2013-09-14', 'old', '3.1.5(9) 기계실로 가는 복도·계단 및 출입문 등은 다음 각항의 기준에 적합하여야 한다.
② 계단은 불연재료로 설치하여야 하고, 발판·난간 및 경사가 있어야 하며, 계단의 폭은 0.7m 이상이어야 한다. 다만, 위의 조건을 만족하는 사다리(원형사다리 포함)는 계단으로 간주할 수 있으며, 기계실 바닥까지의 높이가 1.5m 미만인 경우에는 수직사다리를 설치할 수 있다. 또한, 기계실 바닥의 높이차가 45㎝를 초과하는 경우에도 계단 또는 사다리를 설치하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.4', '1997-08-18', '2003-06-17', 'old', '3.1.5(9) 기계실로 가는 복도·계단 및 출입문 등은 다음 각항의 기준에 적합하여야 한다.
② 계단은 불연재료로 설치하여야 하고, 발판·난간 및 경사가 있어야 한다. 다만, 위의 조건을 만족하는 사다리(원형사다리 포함)는 계단으로 간주할 수 있으며, 기계실 바닥까지의 높이가 1.5m 미만인 경우에는 수직사다리를 설치할 수 있다. 또한, 기계실 바닥의 높이차가 45㎝를 초과하는 경우에도 계단 또는 사다리를 설치하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.4', NULL, '1997-08-17', 'old', '3.1.5(9) 기계실로 가는 복도, 계단, 출입문 등은 유지관리상 지장이 없어야 한다. 및 출입구의 자물쇠의 시건장치는 양호하여야 한다.');


-- 6.6.3.2.5
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.3.2.5' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.5', '2022-03-02', NULL, 'current', '6.6.3.2.5 작업구역 및 작업구역 간 이동통로 바닥에 깊이 0.05 m 이상, 폭 0.05 m에서 0.5 m 사이의 함몰이 있거나 덕트가 있는 경우, 그 함몰부분 및 덕트는 덮개 등으로 보호되어야 한다.
폭이 0.5 m를 초과하는 함몰이 있는 경우에는 단차가 발생한 것으로 간주하고, 6.6.3.2.4를 적용한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.5', '2015-05-13', '2022-03-01', 'old', '6.3.3.5 기계실 작업구역의 바닥 또는 작업구역 간 이동 통로의 바닥에 폭이 0.05 m 이상이고 0.5 m 미만이며, 깊이가 0.05 m를 초과하는 함몰이 있거나 덕트가 있는 경우, 그 함몰부분 및 덕트는 방호되어야 한다.
폭이 0.5 m를 초과하는 함몰은 6.3.3.4에 따른 단차로 고려되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.5', '2013-09-15', '2015-05-12', 'old', '6.3.3.5 기계실 바닥에 폭 0.5 m, 깊이 0.5 m를 초과하는 함몰 또는 덕트가 있는 경우, 함몰부분 및 덕트는 방호되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.5', NULL, '2013-09-14', 'old', '(유압식 제외)
4.1.1(1) 기계실의 구조 및 설비
① 주로프·조속기로프 및 층상선택기의 스티일테이프 등은 기계실 바닥의 관통부분과 접촉되지 않아야 하고, 엘리베이터 관련 설비 이외의 것이 기계실 바닥을 관통하여서는 아니된다.');


-- 6.6.3.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.3.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.3', '2022-03-02', NULL, 'current', '6.6.3.3 그 밖의 개구부
슬라브 및 기계실 바닥의 개구부 크기는 그 목적을 위해 최소화 되어야 한다.
승강로 위에 있는 개구부(전기 케이블을 위한 개구부 포함)를 통해 물건이 떨어지는 위험이 없도록 금속이나 플라스틱으로 된 덮개가 사용되어야 하며, 그 덮개는 슬라브 또는 마감된 바닥 위로 50 ㎜ 이상 돌출되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.3', '2013-09-15', '2022-03-01', 'old', '6.3.5 기타 개구부
슬라브 및 바닥의 구멍은 그 목적을 위해 치수를 최소로 줄여야 한다. 승강로 위에 위치한 개구부를 통해 전선을 포함한 물건이 떨어지는 위험이 없도록 금속 또는 플라스틱으로 된 덮개가 사용되어야 하며, 이러한 덮개는 슬라브 또는 마감된 바닥 위로 50 mm 이상 돌출되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.3', NULL, '2013-09-14', 'old', '[로프식]
4.1.1(1) 기계실의 구조 및 설비
① 주로프·조속기로프 및 층상선택기의 스티일테이프 등은 기계실 바닥의 관통부분과 접촉되지 않아야 하고, 엘리베이터 관련 설비 이외의 것이 기계실 바닥을 관통하여서는 아니된다.');


-- 6.6.4.1.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.1.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.1.1', '2022-03-02', NULL, 'current', '6.6.4 승강로 내부의 기계류 공간
6.6.4.1 일반사항

6.6.4.1.1 건축물의 외벽에 반-밀폐식 승강로가 구획된 경우, 기계류는 환경적인 영향에 대비하여 적절하게 보호되어야 한다.
비고 기계류는 눈·비 및 먼지 등에 의한 안전 및 성능에 영향을 받지 않도록 IP 등급 등 특별한 예방조치가 마련되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.1.1', '2013-09-15', '2022-03-01', 'old', '6.4.1.2 건축물 외부에 부분적으로 둘러싸인 승강로 즉, 반-밀폐식 승강로의 경우, 구동기는 환경적인 영향에 대비하여 적절하게 보호되어야 한다.');
