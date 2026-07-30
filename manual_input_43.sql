-- 수동 입력 6.6.5.2, 6.6.6, 6.6.6.1, 6.6.6.2, 6.6.6.3


-- 6.6.5.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.5.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.2', '2022-03-02', NULL, 'current', '6.6.5.2 작업구역
기계류 공간 전면의 작업구역은 6.6.4.2에 따른 치수에 적합해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.2', '2013-09-15', '2022-03-01', 'old', '6.5.3 작업구역
구동기 캐비닛 전면의 작업구역 치수는 6.4.2의 규정에 적합하여야 한다.

6.5.4 환기
구동기 캐비닛은 적절하게 환기되어야 한다. 구동기의 전기설비는 성능에 지장이 없도록 먼지, 유해한 연기 및 습도로부터 보호되어야 한다.');


-- 6.6.6 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.6' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6', '2022-03-02', NULL, 'current', '6.6.6 비상운전 및 작동시험을 위한 장치');


-- 6.6.6.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.6.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6.1', '2022-03-02', NULL, 'current', '6.6.6.1 6.6.4.3, 6.6.4.4 및 6.6.4.5의 경우 비상운전 및 작동시험에 필요한 장치는 엘리베이터의 모든 비상운전 및 작동시험(권상능력, 추락방지안전장치, 완충기, 상승과속방지수단, 문열림출발방지수단, 럽처밸브, 유량제한기, 멈춤쇠 장치, 완충형 정지수단 및 압력장치)을 승강로 외부에서 수행하기에 적합한 패널에 제공되어야 한다.
이 패널에는 점검자 등 자격자만 접근할 수 있어야 한다.
비상운전 및 작동시험을 위한 장치가 기계류 공간 내에 보호되지 않는 경우 다음과 같은 적절한 덮개로 둘러쌓아야 한다.
가) 승강로 내부 방향으로 열리지 않아야 한다.
나) 열쇠로 조작되는 잠금장치가 있어야 하며, 그 잠금장치는 열쇠 없이 다시 닫히고 잠길 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6.1', '2013-09-15', '2022-03-01', 'old', '6.6.1 6.4.3, 6.4.4 및 6.4.5의 경우, 비상운전 및 작동시험을 위한 필요장치는 승강로 외부에서 모든 비상운전 및 엘리베이터의 필요한 작동시험을 수행하기 위해 적합한 패널에 있어야 한다. 이 패널에는 권한이 있는 사람만이 접근할 수 있어야 한다. 또한, 이것은 유지보수 절차 상 카의 움직임이 요구되고 승강로 내부에 있는 작업구역에서 안전하게 작업을 수행할 수 없을 경우 유지보수를 위한 수단에 적용한다.
비상운전 및 작동시험 장치가 구동기 캐비닛 내부에서 보호되지 못할 경우, 이 장치는 다음과 같은 적절한 덮개로 둘러싸여야 한다.
가) 승강로 내부 방향으로 열리지 않아야 한다.
나) 열쇠로 조작되는 잠금장치가 있어야 하며, 열쇠 없이 다시 닫히고 잠길 수 있어야 한다.');


-- 6.6.6.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.6.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6.2', '2022-03-02', NULL, 'current', '6.6.6.2 패널에는 다음과 같은 장치 또는 설비가 있어야 한다.
가) 16.3.2에 따른 비상통화장치와 함께 13.2.2.2.7 및 13.2.3 또는 13.3.9에 따른 비상운전을 위한 작동장치
나) 작동시험을 수행하기 위한 제어 설비
다) 다음과 같은 내용을 표시하는 구동기의 방향 감시장치 또는 표시장치
1) 카 움직임의 방향
2) 잠금해제구간의 도착
3) 카의 속도');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6.2', '2013-09-15', '2022-03-01', 'old', '[전기식]
6.6.2 패널에는 다음 사항을 만족하는 장치 또는 설비가 있어야 한다.
가) 14.2.3.4에 적합한 내부통화 시스템과 함께, 12.5에 따른 비상운전
나) 작동시험을 수행할 수 있는 제어설비(6.4.3.2, 6.4.4.3, 6.4.5.7)
다) 아래와 같은 내용을 나타내는 구동기의 방향 감시 또는 표시장치
- 카의 운행 방향
- 잠금해제구간의 도착
- 엘리베이터 카 속도

[유압식]
6.6.2 패널에는 다음 사항을 만족하는 장치 또는 설비가 있어야 한다.
가) 14.2.3.4에 적합한 내부통화 시스템과 함께, 12.9에 따른 비상운전
나) 작동시험을 수행할 수 있는 제어설비(6.4.3.2, 6.4.4.3, 6.4.5.7)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6.2', '2003-06-18', '2013-09-14', 'old', '4.1.1(3)⑧ 2005년 6일 1일 이후 건축허가분부터 유압식 동일 적용
4.1.1(3) 전동기·제동기 및 권상기
⑧ 정상운전모드에서 착상구간 범위 내에서 카 도어 또는 승강장문 중 어느곳에서나 도어스위치 접점이 쇼트되거나 인위적으로 단락된 경우 이를 감지하여 강제로 승강기 운행을 정지하여야 한다.
<건축법시행령 제5조제4항제3호에 해당하는 다중이용건축물의 승강기는 2000년 10월 1일 이후 건축허가분부터 적용>');


-- 6.6.6.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.6.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6.3', '2022-03-02', NULL, 'current', '6.6.6.3 패널에 있는 장치에서 측정하여 조도 200 ㏓ 이상으로 비추는 전기조명이 영구적으로 설치되어야 한다.
패널 자체 또는 근처에 있는 스위치로 패널의 조명을 점멸해야 한다.
이 조명의 전원공급은 14.7.1에 따른다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6.3', '2013-09-15', '2022-03-01', 'old', '6.6.3 패널에 설치되어 있는 장치를 50 lx 이상으로 비출 수 있는 영구적인 전기 조명이 설치되어야 한다.
패널 위 또는 근처에 설치된 스위치는 패널의 조명을 점멸할 수 있어야 한다.
이 조명의 전원공급은 13.6.1에 적합하여야 한다.');
