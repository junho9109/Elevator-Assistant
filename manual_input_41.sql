-- 수동 입력 6.6.5, 6.6.5.1, 6.6.5.1.1, 6.6.5.1.2, 6.6.5.1.3


-- 6.6.5
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.5' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5', '2022-03-02', NULL, 'current', '6.6.5 승강로 외부의 기계류 공간');


-- 6.6.5.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.5.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.1', '2022-03-02', NULL, 'current', '6.6.5.1 기계류 공간');


-- 6.6.5.1.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.5.1.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.1.1', '2022-03-02', NULL, 'current', '6.6.5.1.1 엘리베이터의 기계류는 엘리베이터 전용 공간 내부에 위치되어야 한다. 이 공간에는 엘리베이터 용도 이외의 덕트, 전선 또는 장치 등이 포함되지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.1.1', '2013-09-15', '2022-03-01', 'old', '6.5.1 일반사항
승강로 외부에 있고 구획된 기계실에 위치하지 않은 구동기 공간은 필요로 하는 하중 및 힘에 견디도록 시공되어야 한다.

6.5.2.1 엘리베이터 구동기는 엘리베이터 전용 캐비닛 내부에 위치하여야 한다. 캐비닛에는 엘리베이터 이외 용도의 덕트, 케이블 또는 장치가 포함되지 않아야 한다.');


-- 6.6.5.1.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.5.1.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.1.2', '2022-03-02', NULL, 'current', '6.6.5.1.2 기계류 공간은 구멍이 없는 벽, 바닥, 지붕 및 문으로 구성되어야 한다.
다음과 같은 개구부는 허용된다.
가) 환기구
나) 엘리베이터 운행을 위해 필요한 승강로와 기계류 공간 사이의 개구부
다) 화재 시 가스 및 연기의 배출을 위한 통풍구
상기 개구부에 비-자격자가 접근할 수 있는 경우에는 다음과 같이 보호되어야 한다.
- 위험지역에 접촉을 막는 KS B ISO 13857, 표 5에 따른 보호
- 전기설비에 접촉을 막는 KS C IEC 60529, IP 보호등급 2X 이상');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.1.2', '2013-09-15', '2022-03-01', 'old', '6.5.2.2 구동기 캐비닛은 구멍이 없는 벽, 바닥, 지붕 및 문으로 구획되어야 한다. 다만, 다음과 같은 개구부는 허용될 수 있다.
가) 환기구
나) 엘리베이터 성능을 위한 승강로와 구동기 캐비닛 사이의 필요 개구부
다) 화재 시 가스 및 연기의 배출을 위한 통풍구
권한이 없는 사람이 접근할 때 이러한 개구부는 다음 사항에 적합하여야 한다.
1) 위험한 지역에 접촉을 방지하는 KS B 6947, 표 5에 따른 보호
2) 전기설비의 접촉을 막는 IP 2X 이상의 보호 등급');


-- 6.6.5.1.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.5.1.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.1.3', '2022-03-02', NULL, 'current', '6.6.5.1.3 문은 다음과 같아야 한다.
가) 열린 문을 통해 요구된 작업을 수행할 수 있는 충분한 크기이어야 한다.
나) 공간 내부 방향으로 열리지 않아야 한다.
다) 열쇠로 조작되는 잠금장치가 있어야 하며, 그 잠금장치는 열쇠 없이 다시 닫히고 잠길 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.1.3', '2013-09-15', '2022-03-01', 'old', '6.5.2.3 문은 다음 사항에 적합하여야 한다.
가) 문을 통해 요구된 작업을 수행할 수 있는 충분한 크기를 가져야 한다.
나) 캐비닛 내부 방향으로 열리지 않아야 한다.
다) 열쇠로 조작되는 잠금장치가 있어야 하며, 열쇠 없이 다시 닫히고 잠길 수 있어야 한다.');
