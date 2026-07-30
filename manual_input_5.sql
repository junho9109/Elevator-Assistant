-- 수동 입력 6.3.1~6.3.2


-- 6.3.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.3.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.1', '2022-03-02', NULL, 'current', '6.3.1 연속되는 상·하 승강장문의 문턱간 거리가 11 m를 초과한 경우에는 다음 중 어느 하나의 조건에 적합해야 한다.
가) 중간에 비상문이 있어야 한다.
나) 서로 인접한 카에 8.6.2에 따른 비상구출문이 각각 있어야 한다.
비고 비상문이 설치된 경우, 건축물에는 비상문으로의 영구적인 접근수단이 제공되어야 하며, 비상문과 승강장문 및 비상문과 비상문의 문턱간 거리는 11 m 이하이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.1', '2013-09-15', '2022-03-01', 'old', '[전기식] 5.2.2.1.2 연속되는 승강장문 문턱사이의 거리가 11 m를 초과할 경우에는 다음 중 어느 하나에 적합하여야 한다.
가) 중간에 비상문이 설치되어야 한다.
나) 14.2.1.4에 따른 전기적 비상운전에 적합하고, 이 수단은 관련된 공간에 있어야 한다.
- 기계실(6.3)
- 구동기 캐비닛(6.5.2)
- 비상 및 작동시험을 위한 운전패널(6.6)
다) 서로 인접한 카에 8.12.3에 따른 비상구출문이 설치되어야 한다.
[유압식] 5.2.2.1.2 연속되는 승강장문 문턱사이의 거리가 11 m를 초과할 경우에는 다음 중 어느 하나에 적합하여야 한다.
가) 중간에 비상문이 설치되어야 한다.
나) 서로 인접한 카에 8.12.3에 따른 비상구출문이 설치되어야 한다.');


-- 6.3.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.3.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.2', '2022-03-02', NULL, 'current', '6.3.2 출입문, 비상문 및 점검문의 치수는 다음과 같아야 한다. 다만, 라)의 경우에는 문을 통해 필요한 유지관리 업무를 수행하는데 충분한 크기이어야 한다.
가) 기계실, 승강로 및 피트 출입문: 높이 1.8 m 이상, 폭 0.7 m 이상 다만, 주택용 엘리베이터의 경우 기계실 출입문은 폭 0.6 m 이상, 높이 0.6 m 이상으로 할 수 있다.
나) 풀리실 출입문: 높이 1.4 m 이상, 폭 0.6 m 이상
다) 비상문: 높이 1.8 m 이상, 폭 0.5 m 이상
라) 점검문: 높이 0.5 m 이하, 폭 0.5 m 이하');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.2', '2013-09-15', '2022-03-01', 'old', '5.2.2.1 승강로의 점검문 및 비상문은 이용자의 안전 또는 유지보수를 위한 용도 외에는 사용되지 않아야 한다. <2019. 3. 28. 삭제>
5.2.2.1.1 점검문은 폭 0.6 m 이상, 높이 1.4 m 이상이어야 한다. 다만, 트랩 방식의 문일 경우에는 폭 0.5 m 이하, 높이 0.5 m 이하이어야 한다. 비상문은 폭 0.35 m 이상, 높이 1.8 m 이상이어야 한다. <2019. 3. 28. 삭제>
6.3.4.1 출입문은 폭 0.7 m 이상, 높이 1.8 m 이상의 금속제 문이어야 하며 기계실 외부로 완전히 열리는 구조이어야 한다. 기계실 내부로는 열리지 않아야 한다.
6.4.7.1 승강로 내부의 작업구역은 승강로 벽을 통해 접근할 수 있어야 한다. 문은 승강장문 또는 다음 사항을 만족하는 문이어야 한다.
가) 폭은 0.6 m 이상, 높이는 1.8 m 이상이어야 한다.
6.4.7.2 승강로 외부의 작업구역에서 승강로 내부의 구동기 공간에 출입은 다음과 같아야 한다.
가) 문을 통해 요구된 작업을 수행할 수 있는 충분한 크기를 가져야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.2', '2003-06-18', '2013-09-14', 'old', '3.1.5(9) 기계실로 가는 복도·계단 및 출입문 등은 다음 각항의 기준에 적합하여야 한다. ③ 출입문은 보수관리 및 방재를 고려하여 잠금장치가 있는 금속제 문을 설치하여야 하고, 유효 개구부의 폭 0.7m 이상, 유효 개구부의 높이 1.8m 이상으로 하여야 하며, 출입문이 외기에 접하는 경우에는 빗물이 침입하지 않는 구조로 하여야 하고, 부식이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.2', '1997-08-18', '2003-06-17', 'old', '3.1.5(9) 기계실로 가는 복도·계단 및 출입문 등은 다음 각항의 기준에 적합하여야 한다. ③ 출입문은 보수관리 및 방재를 고려하여 잠금장치가 있는 금속제 문을 설치하여야 하고, 폭은 0.7m 이상, 높이는 1.8m 이상으로 하여야 하며, 출입문이 외기에 접하는 경우에는 빗물이 침입하지 않는 구조로 하여야 하고, 부식이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.2', NULL, '1997-08-17', 'old', '3.1.5(9) 기계실로 가는 복도, 계단, 출입문 등은 유지관리상 지장이 없어야 한다.” 및 “출입구의 자물쇠의 시건장치는 양호하여야 한다.');
