-- 수동 입력 6.6.4.5.5, 6.6.4.5.6, 6.6.4.5.7, 6.6.4.5.8, 6.6.4.6


-- 6.6.4.5.5
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.5.5' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.5', '2022-03-02', NULL, 'current', '6.6.4.5.5 6.6.4.5.2 나)의 경우 움직이는 멈춤 쐐기는 플랫폼이 내려질 때 자동으로 작동되어야 한다. 움직이는 멈춤 쐐기에는 다음과 같은 장치가 있어야 한다.
가) 12에 따른 완충기
나) 멈춤 쐐기가 완전히 집어넣어진 위치에 있는 경우에만 카의 움직임을 허용하는 15.2에 따른 전기안전장치
다) 멈춤 쐐기가 완전히 연장된 위치에 있는 경우에만 내려진 플랫폼과 함께 카의 움직임을 허용하는 15.2에 따른 전기안전장치');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.5', '2013-09-15', '2022-03-01', 'old', '6.4.5.5 6.4.5.2나)의 경우, 움직이는 멈춤 쇄기는 플랫폼이 내려질 때 자동으로 작동되어야 한다. 멈춤 쇄기에는 다음과 같은 장치가 설치되어야 한다.
가) 10.3 및 10.4에 적합한 완충기
나) 멈춤 쇄기가 완전히 집어넣은 위치에 있는 경우, 카의 움직임을 허용하는 14.1.2에 적합한 전기안전장치
다) 멈춤 쇄기가 완전히 뻗은 위치에 있는 경우, 내려간 플랫폼과 함께 카의 움직임을 허용하는 14.1.2에 적합한 전기안전장치');


-- 6.6.4.5.6
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.5.6' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.6', '2022-03-02', NULL, 'current', '6.6.4.5.6 플랫폼에서 카를 움직일 필요가 있는 경우에는 그 플랫폼에서 16.1.5에 따른 점검운전 조작반의 사용이 가능해야 한다.
움직이는 멈춤 쐐기가 작동 위치에 있을 때, 전기적으로 구동시키는 카의 움직임은 점검운전 조작반에 의해서만 가능해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.6', '2013-09-15', '2022-03-01', 'old', '6.4.5.6 플랫폼에서 카를 움직일 필요가 있는 경우, 14.2.1.3에 따른 점검운전 제어장치는 플랫폼에서 이용 가능하여야 한다.
움직이는 멈춤 쇄기가 작동하는 위치에 있을 때, 카의 전기적인 움직임은 점검운전 제어장치에서만 가능하여야 한다.');


-- 6.6.4.5.7
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.5.7' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.7', '2022-03-02', NULL, 'current', '6.6.4.5.7 비상운전 및 작동시험을 위해 필요한 장치는 6.6.6에 따라 승강로 외부에서 비상운전 및 작동시험이 수행될 수 있도록 배치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.7', '2013-09-15', '2022-03-01', 'old', '[전기식]
6.4.5.7 비상운전 및 작동시험(브레이크 시험, 권상 시험, 비상정지장치 시험, 완충기 시험 또는 카의 상승과속방지수단의 시험 같은)을 위해 필요한 장치는 6.6에 따라 승강로 외부에서 비상운전 및 작동시험이 가능하도록 배치되어야 한다.

[유압식]
6.4.5.7 비상운전 및 작동시험(비상정지장치 시험, 완충기 시험, 럽처밸브 시험, 압력 시험 등과 같은)을 위해 필요한 장치는 6.6에 따라 승강로 외부에서 비상운전 및 작동시험이 가능하도록 배치되어야 한다.');


-- 6.6.4.5.8
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.5.8' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.8', '2022-03-02', NULL, 'current', '6.6.4.5.8 최대 허용 하중이 플랫폼에 표시되어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');


-- 6.6.4.6
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.6' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.6', '2022-03-02', NULL, 'current', '6.6.4.6 승강로 외부의 작업구역
기계류가 승강로에 있고, 승강로 외부에서 점검 등 유지관리 업무가 수행되는 경우, 6.6.3.2.1 및 6.6.3.2.2에 따른 작업구역은 승강로 외부에 있을 수 있다.
이러한 설비에 접근은 6.3에 따른 점검문을 통해서만 가능해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.6', '2013-09-15', '2022-03-01', 'old', '6.4.6 승강로 외부의 작업구역
6.1과 달리 구동기는 승강로에 있고 승강로 외부에서 유지보수 또는 점검을 수행하는 경우, 6.3.3.1 및 6.3.3.2에 따른 작업구역은 승강로 외부에 있을 수 있다. 이 설비는 6.4.7.2에 적합한 문에 의해서만 접근이 가능하여야 한다.');
