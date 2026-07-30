-- 수동 입력 6.6.4.1.2, 6.6.4.1.3, 6.6.4.2.1, 6.6.4.2.2, 6.6.4.3.1


-- 6.6.4.1.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.1.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.1.2', '2022-03-02', NULL, 'current', '6.6.4.1.2 승강로 내부의 작업구역 간 이동 통로의 유효 높이는 1.8 m 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.1.2', '2013-09-15', '2022-03-01', 'old', '6.4.1.3 승강로 내부의 작업구역에서 다른 작업구역으로 이동하는 공간의 유효 높이는 1.8 m 이상이어야 한다.');


-- 6.6.4.1.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.1.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.1.3', '2022-03-02', NULL, 'current', '6.6.4.1.3 다음과 같은 설비에는 조작에 필요한 모든 설명이 포함된 안내문이 승강로의 적절한 위치에 부착되어야 한다.
가) 접이식 플랫폼(6.6.4.5) 및 이동식 멈춤 쐐기[6.6.4.5.2나)]
나) 수동으로 작동되는 기계 장치(6.6.4.3.1, 6.6.4.4.1)
<2019년 3월 28일 이후 건축허가분부터 적용>');


-- 6.6.4.2.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.2.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.2.1', '2022-03-02', NULL, 'current', '6.6.4.2.1 작업구역은 승강로 내부 설비의 작업이 쉽고 안전하도록 다음과 같이 충분한 크기이어야 한다.
특히, 작업구역의 유효 높이는 2.1 m 이상이어야 하고, 유효 수평공간은 다음과 같아야 한다.
가) 제어반 및 캐비닛 전면의 유효 수평공간은 다음과 같아야 한다.
1) 깊이는 외함 표면에서 측정하여 0.7 m 이상이어야 한다.
2) 폭은 다음 구분에 따른 수치 이상이어야 한다.
- 제어반 폭이 0.5 m 미만인 경우: 0.5 m
- 제어반 폭이 0.5 m 이상인 경우: 제어반 폭
나) 움직이는 부품의 점검 및 유지관리 업무 수행이 필요한 곳에 0.5 m × 0.6 m 이상의 작업구역이 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.2.1', '2015-05-13', '2022-03-01', 'old', '6.4.2.1 승강로 내부의 구동기 작업구역의 치수는 설비의 작업이 쉽고 안전하도록 충분하여야 한다. 특히, 작업구역의 유효 높이는 2 m 이상이어야 하고 다음 사항에 적합하여야 한다.
가) 유지보수 및 점검을 위한 유효 수평면적은 0.5 m × 0.6 m 이상이어야 한다.
나) 제어 패널 및 캐비닛 앞의 유효 수평공간은 아래와 같아야 한다.
1) 폭은 0.5 m 또는 제어 패널 및 캐비닛의 전체 폭 중에서 큰 값 이상
2) 깊이는 외함의 표면에서 측정하여 0.7 m 이상');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.2.1', '2013-09-15', '2015-05-12', 'old', '6.4.2.1 승강로 내부의 구동기 작업구역의 치수는 설비의 작업이 쉽고 안전하도록 충분하여야 한다. 특히, 작업구역의 유효 높이는 2 m 이상이어야 하고 다음 사항에 적합하여야 한다.
가) 유지보수 및 점검을 위한 유효 수평면적은 0.5 m × 0.6 m 이상이어야 한다.
나) 제어 패널 및 캐비닛 앞의 유효 수평면적은 아래와 같아야 한다.
1) 폭은 0.5 m 또는 제어 패널 및 캐비닛의 전체 폭 중에서 큰 값 이상
2) 깊이는 외함의 표면에서 측정하여 0.7 m 이상');


-- 6.6.4.2.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.2.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.2.2', '2022-03-02', NULL, 'current', '6.6.4.2.2 보호되지 않은 회전부품 위로 0.3 m 이상의 유효 수직거리가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.2.2', '2013-09-15', '2022-03-01', 'old', '6.4.2.2 구동기의 보호되지 않은 회전 부품 위로 0.3 m 이상의 유효 수직거리가 있어야 한다. 수직거리가 0.3 m 미만일 경우에는 9.7.1가)에 따라 보호되어야 한다. 또한, 5.7.1.1 또는 5.7.2.2에 적합하여야 한다.');


-- 6.6.4.3.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.3.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.3.1', '2022-03-02', NULL, 'current', '6.6.4.3 카 내부 또는 카 지붕 위의 작업구역

6.6.4.3.1 카 내부 또는 카 지붕에서 기계류의 점검 등 유지관리 업무를 수행하는 경우, 그 업무 수행으로 문열림출발 등 통제되지 않거나 예측되지 않은 카의 움직임이 사람을 위험하게 만들 수 있다면 다음과 같이 그 위험을 방지해야 한다.
가) 카의 위험한 움직임은 기계적인 장치에 의해 보호되어야 한다.
나) 기계적인 장치가 작동된 경우, 카의 모든 움직임은 15.2에 따른 전기안전장치에 의해 방지되어야 한다.
다) 기계적인 장치가 작동 위치에 있고 힘이 가해져 해제되지 않을 때, 점검자 등 자격자가 다음 중 어느 하나의 방법을 통해 승강로 밖으로 나올 수 있어야 한다. 또한, 탈출 절차에 관한 설명이「승강기 안전관리법 시행규칙」 제9조제5호에 따른 유지관리 매뉴얼에 포함되어야 한다.
1) 카문의 상부틀/구동부 위로 0.5 m × 0.7 m 이상 열린 승강장문
2) 8.6에 따른 카 지붕의 비상구출문
이 경우 카 안으로 안전하게 내려갈 수 있는 손잡이가 있는 발판 또는 사다리가 있어야 한다.
3) 6.3에 따른 비상문');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.3.1', '2013-09-15', '2022-03-01', 'old', '6.4.3.1 구동기의 유지보수 또는 점검을 카 내부 또는 카 지붕에서 수행하는 경우 및 유지보수 또는 점검의 결과로 제어되지 않거나 예상하지 못한 카의 움직임이 사람을 위험하게 만들 수 있는 경우에는 다음 사항에 적합하여야 한다.
가) 기계적인 장치에 의해 카의 위험스러운 움직임은 보호되어야 한다.
나) 기계적인 장치가 작동위치에 있는 경우에는 14.1.2에 적합한 전기안전장치에 의해 카의 모든 움직임이 보호되어야 한다.
다) 이 장치가 작동하고 있을 때 안전하게 유지보수 또는 점검을 수행할 수 있어야 한다.');
