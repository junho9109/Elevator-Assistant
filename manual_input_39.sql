-- 수동 입력 6.6.4.4.3, 6.6.4.5.1, 6.6.4.5.2, 6.6.4.5.3, 6.6.4.5.4


-- 6.6.4.4.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.4.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.4.3', '2022-03-02', NULL, 'current', '6.6.4.4.3 비상운전 및 작동시험을 위해 필요한 장치는 6.6.6에 따라 승강로 외부에서 비상운전 및 작동시험이 수행될 수 있도록 배치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.4.3', '2013-09-15', '2022-03-01', 'old', '6.4.4.3 비상운전 및 작동시험(브레이크, 권상능력, 비상정지장치, 완충기 또는 카의 상승과속방지수단의 시험)을 위해 필요한 장치는 6.6에 따라 승강로 외부에서 비상운전 및 작동시험이 가능하도록 배치되어야 한다.');


-- 6.6.4.5.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.5.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.1', '2022-03-02', NULL, 'current', '6.6.4.5 플랫폼 위의 작업구역

6.6.4.5.1 플랫폼 위에서 기계류의 점검 등 유지관리 업무를 수행하는 경우, 그 플랫폼은 다음과 같아야 한다.
가) 영구적으로 설치되어야 한다.
나) 카 또는 균형추/평형추의 주행로에 있는 경우에는 집어넣을 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.1', '2013-09-15', '2022-03-01', 'old', '6.4.5.1 구동기의 유지보수 또는 점검을 플랫폼에서 수행하는 경우, 다음 사항에 적합하여야 한다.
가) 플랫폼은 영구적으로 설치되어야 하고,
나) 플랫폼이 카 또는 균형추의 주행로에 있는 경우에는 집어넣을 수 있어야 한다.');


-- 6.6.4.5.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.5.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.2', '2022-03-02', NULL, 'current', '6.6.4.5.2 카, 균형추 또는 평형추의 주행로 내부에 위치한 플랫폼에서 기계류의 점검 등 유지관리 업무를 수행하는 경우에는 다음 중 어느 하나에 적합해야 한다.
가) 카는 6.6.4.3.1가) 및 나)에 따른 기계적 장치를 사용하여 정지상태가 유지되어야 한다.
나) 카를 움직일 필요가 있는 경우, 카의 움직임은 멈춤 쐐기에 의해 다음과 같이 카의 주행로가 제한되어야 한다.
1) 정격속도의 카가 플랫폼을 향해 아래로 운행되는 경우, 플랫폼 위로 2 m 이상에서 카를 정지시켜야 한다.
2) 정격속도의 카가 플랫폼을 향해 위로 운행되는 경우, 6.5.7.2에 적합하도록 플랫폼 아래에서 카를 정지시켜야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.2', '2013-09-15', '2022-03-01', 'old', '6.4.5.2 카, 균형추 또는 평형추의 주행로에 위치한 플랫폼에서 구동기의 유지보수 또는 점검이 수행되는 경우에는 다음과 같아야 한다.
가) 카는 6.4.3.1의 가) 및 나)에 적합한 기계적인 장치를 사용하여 정지되어야 한다.
나) 카를 움직일 필요가 있는 경우에는 움직이는 멈춤 쇄기에 의해 아래와 같이 카의 주행로가 제한되어야 한다.
1) 카가 플랫폼을 향해 아랫방향으로 운행되는 경우, 플랫폼 위로 2 m 이상 정지
2) 카가 플랫폼을 향해 위 방향으로 운행되는 경우, 5.7.1.1의 나), 다) 및 라)에 적합하게 플랫폼 아래에 정지');


-- 6.6.4.5.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.5.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.3', '2022-03-02', NULL, 'current', '6.6.4.5.3 플랫폼은 다음과 같아야 한다.
가) 어떤 위치에서라도 0.2 m × 0.2 m의 면적에 1,000 N으로 각각 계산된 두 사람의 무게를 영구적인 변형 없이 견딜 수 있어야 한다.
플랫폼이 무거운 설비의 양중 등을 위한 목적으로 사용된 경우에는 그 설비의 무게에 맞춰 플랫폼의 크기가 고려되어야 하고, 그 플랫폼은 설계된 하중 및 힘을 견딜 수 있는 기계적인 강도(6.1.7 참조)가 있어야 하며, 최대 허용 하중이 그 플랫폼에 표시되어야 한다.
나) 8.7.4에 따른 난간이 있어야 한다.
다) 다음과 같은 조건을 입증하는 수단이 있어야 한다.
1) 플랫폼 바닥과 출입층 사이의 발판 높이는 0.5 m 이하이어야 한다.
2) 플랫폼과 출입문의 문턱 사이의 틈새를 통해 0.15 m의 구(球)가 통과되어서는 안 된다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.3', '2013-09-15', '2022-03-01', 'old', '6.4.5.3 플랫폼은 다음과 같아야 한다.
가) 어떤 지점에서 0.2 m × 0.2 m의 면적에 1,000 N으로 각각 계산한 두 사람 이상의 무게를 영구적인 변형 없이 견딜 수 있어야 한다.
나) 8.13.3의 규정에 적합한 보호난간이 설치되어야 한다.
다) 아래와 같은 조건을 입증할 수 있는 수단이 설치되어야 한다.
1) 플랫폼 바닥과 출입문 바닥 사이의 발판 높이는 0.5 m를 초과하지 않아야 한다.
2) 플랫폼과 출입문의 문턱사이의 틈새를 통해 지름 0.15 m의 구가 통과되지 않아야 한다.
3) 승강로 아래로 추락을 방지하는 추가적인 대비가 없다면, 완전히 열린 승강장문 문짝과 플랫폼 가장자리 사이를 수평으로 측정한 틈새는 0.15 m를 초과하지 않아야 한다.

15.4.6 최대 허용하중은 플랫폼에 표기되어야 한다.(6.4.5.3 참조)');


-- 6.6.4.5.4
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.5.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.4', '2022-03-02', NULL, 'current', '6.6.4.5.4 집어넣을 수 있는 플랫폼은 6.6.4.5.3 외에 다음 사항이 추가되어야 한다.
가) 완전히 집어넣어진 위치를 확인하는 15.2에 따른 전기안전장치가 있어야 한다.
나) 작업 위치로 플랫폼을 밀어 넣거나, 작업 위치에서 플랫폼을 제거하는 수단이 있어야 한다. 이런 작동은 피트 또는 점검자 등 자격자만이 접근할 수 있는 승강로 외부에 위치한 수단에 의해서만 가능해야 한다. 플랫폼의 수동 작동을 위해 필요한 힘은 250 N을 초과하지 않아야 한다.
다) 승강장문을 통하지 않고 플랫폼에 출입하는 경우, 다음 중 어느 하나에 적합해야 한다.
1) 플랫폼에 출입하는 문은 그 플랫폼이 작업 위치에 있지 않을 때에는 열리지 않아야 한다.
2) 승강로 아래로 사람이 추락하는 것을 방지하는 수단이 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.4', '2013-09-15', '2022-03-01', 'old', '6.4.5.4 6.4.5.3에 추가하여, 집어넣을 수 있는 플랫폼은 다음과 같아야 한다.
가) 완전히 집어넣은 위치를 확인하는 14.1.2에 적합한 전기안전장치가 설치되어야 한다.
나) 작업위치에서 집어넣거나 뺄 수 있는 수단이 있어야 한다. 이 수단은 피트에서 접근 할 수 있거나 승강로 외부에 위치한 수단에 의해 작동되어야 하며 권한이 있는 사람만 접근 가능하여야 한다. 승강장문을 통해 플랫폼에 접근할 수 없는 경우, 출입문은 플랫폼이 작업위치에 있지 않을 때 열리지 않아야 한다. 또는 다른 방법으로 사람이 승강로 아래로 추락하는 것을 방지하는 수단이 설치되어야 한다.');
