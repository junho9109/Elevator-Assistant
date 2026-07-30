-- 수동 입력 6.1.4~6.1.8.8


-- 6.1.4.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.4.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.4.1', '2022-03-02', NULL, 'current', '6.1.4.1 승강로에는 모든 출입문이 닫혔을 때 승강로 전 구간에 걸쳐 영구적으로 설치된 다음의 구분에 따른 조도 이상을 밝히는 전기조명이 있어야 한다. 가) 카 지붕에서 수직 위로 1 m 떨어진 곳: 50 lx 나) 피트 바닥에서 수직 위로 1 m 떨어진 곳: 50 lx 다) 위 가) 및 나)에 따른 장소 이외의 장소: 20 lx 조명장치의 전원공급은 14.7.1에 적합해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.4.1', '2013-09-15', '2022-03-01', 'old', '5.9 승강로 조명 승강로에는 모든 문이 닫혀있을 때 카 지붕 및 피트 바닥 위로 1 m 위치에서 조도 50 lx 이상의 영구적으로 설치된 전기조명이 있어야 한다. 이 조명은 승강로의 천장 및 피트바닥에서 약 0.5 m에 중간전구(들)와 함께 각각 1개의 전구로 구성되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.4.1', NULL, '2013-09-14', 'old', '4.1.3(21) 카 위에는 점검 및 보수관리에 지장이 없도록 작업등의 설치상태는 견고하고, 작동상태는 양호하여야 한다.');

-- 6.1.4.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.4.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.4.2', '2022-03-02', NULL, 'current', '6.1.4.2 기계실·기계류 공간 및 풀리실에는 다음의 구분에 따른 조도 이상을 밝히는 영구적으로 설치된 전기조명이 있어야 하며, 전원공급은 14.7.1에 적합해야 한다. 가) 작업공간의 바닥 면: 200 lx 나) 작업공간 간 이동 공간의 바닥 면: 50 lx');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.4.2', '2013-09-15', '2022-03-01', 'old', '6.3.7 조명 및 콘센트 기계실에는 바닥 면에서 200 lx 이상을 비출 수 있는 영구적으로 설치된 전기 조명이 있어야 한다. 6.4.9 작업구역 및 구동기 공간은 바닥 면에 200 lx 이상을 비출 수 있는 영구적으로 설치된 전기 조명이 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.4.2', '1997-08-18', '2013-09-14', 'old', '3.1.5(6)① 조명스위치는 출입구 가까이에 설치하고, 조명전원은 엘리베이터의 제어전원과 별도로 분리하여야 하며, 조도는 기기가 배치된 바닥면에서 100Lux 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.4.2', NULL, '1997-08-17', 'old', '3.1.5(6) 관리, 검사에 지장이 없도록 조명 및 환기는 적절하고, 실온은 원칙적으로 40℃ 이하를 유지하도록 하여야 한다.');

-- 6.1.5.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.5.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.5.1', '2022-03-02', NULL, 'current', '6.1.5.1 피트에는 다음과 같은 장치가 있어야 한다. 가) 16.1.11에 적합하고, 피트 출입문 및 피트 바닥에서 잘 보이고 접근 가능한 정지장치 나) 16.1.5에 적합하고 피난 공간에서 0.3 m 떨어진 범위 이내에서 조작할 수 있는 영구적으로 설치된 점검운전 조작반 다) 콘센트(14.7.2) 라) 피트 출입문 안쪽 문틀에서 수평으로 최대 0.75 m 이내 및 피트 출입층 바닥 위로 최소 1 m 위치에 설치된 승강로 조명(6.1.4.1)의 점멸수단 <2022년 3월 2일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.5.1', '2019-03-28', '2022-03-01', 'old', '6.1.5.1 (2019년 적용) 피트에는 다음과 같은 장치가 있어야 한다. 가) 정지장치(피트 깊이 1.6m 미만: 상부 1개, 1.6m 이상: 상하부 2개) 나) 점검운전 조작반 다) 콘센트(14.7.2) 라) 승강로 조명(6.1.4.1)의 점멸수단');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.5.1', '2013-09-15', '2019-03-27', 'old', '5.7.3.4 피트에는 다음과 같은 장치가 있어야 한다. 가) 14.2.2 및 15.7의 규정에 적합하고 피트 출입문 및 피트 바닥에서 조작할 수 있는 정지장치 나) 콘센트(13.6.2) 다) 피트 출입문을 열고 쉽게 조작할 수 있는 승강로 조명(5.9)을 점멸할 수 있는 수단');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.5.1', '1997-01-01', '2013-09-14', 'old', '4.1.4(16) 작업등 및 피트 정지스위치의 설치상태는 견고하고, 작동상태는 양호하여야 한다.');

-- 6.1.5.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.5.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.5.2', '2022-03-02', NULL, 'current', '6.1.5.2 기계실·기계류 공간 및 풀리실에는 다음과 같은 장치가 있어야 한다. 가) 출입문의 가까운 곳에 적절한 높이로 설치되어 승강기 안전관리 기술자 등 관련 자격을 갖춘 사람만이 접근할 수 있는 조명스위치 나) 작업구역마다 적절한 위치에 설치된 1개 이상의 콘센트(14.7.2) 다) 16.1.11에 적합하고, 각 접근 지점의 가까운 곳에 설치된 풀리실 내의 정지장치');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.5.2', '2013-09-15', '2022-03-01', 'old', '15.4.4 풀리실의 정지장치 또는 근처에 "정지" 라는 글자가 표기되어야 한다.');

-- 6.1.6
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.6' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.6', '2022-03-02', NULL, 'current', '6.1.6 비상 구출 승강로에 갇힌 사람이 빠져나올 방법이 없는 경우, 이러한 위험이 존재하는 장소(피트, 승강로 내부 작업구역, 카 상부 등)에는 피난공간에서 조작할 수 있는 16.3에 적합한 비상통화장치가 설치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.6', '2013-09-15', '2022-03-01', 'old', '5.10 비상통화장치 승강로에서 작업하는 사람이 갇히게 되어 카 또는 승강로를 통해서 빠져나올 방법이 없는 경우, 이러한 위험이 존재하는 장소에는 비상통화장치가 설치되어야 한다.');

-- 6.1.7
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.7' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.7', '2022-03-02', NULL, 'current', '6.1.7 설비의 취급(양중용 지지대 및 고리) 무거운 설비를 편리한 위치에서 양중할 수 있는 금속 지지대 또는 고리가 기계실·기계류 공간 또는 승강로의 천장에 1개 이상 설치되어야 하며, 허용 하중이 표시되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.7', '2013-09-15', '2022-03-01', 'old', '6.3.8 양중용 금속 지지대 또는 고리는 무거운 설비를 편리한 위치에서 양중할 수 있도록 기계실 내의 천장 또는 보의 알맞은 위치에 1개 이상 있어야 한다. 6.4.10 금속 지지대 또는 고리가 구동기 공간의 알맞은 위치에 1개 이상 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.7', '1997-08-18', '2013-09-14', 'old', '3.1.5(5) 기계실 천장에는 기기를 양정하기 위한 고리 등을 설치하여야 한다.');

-- 6.1.8.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.8.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.1', '2022-03-02', NULL, 'current', '6.1.8.1 승강로, 기계실·기계류 공간 및 풀리실은 관련 법령에 적합한 구조이어야 하고, 구동기에 의한 하중, 추락방지안전장치 작동 순간의 주행안내 레일, 카의 편심하중, 완충기의 작용, 튀어오름방지장치의 작용, 카의 출입 또는 하역 등으로 인한 부하를 지지할 수 있는 구조이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.1', '2013-09-15', '2022-03-01', 'old', '5.3 승강로의 벽, 바닥 및 천장 승강로 구조는 건축 관련 법령에 적합하여야 하고, 최소한 구동기에 의한 하중, 비상정지장치 작동 순간의 가이드 레일, 카 내의 편심하중, 완충기의 작용, 튀어오름 방지장치의 작용, 카에 출입 또는 하역 등으로 인한 부하를 지지할 수 있어야 한다.');

-- 6.1.8.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.8.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.2', '2022-03-02', NULL, 'current', '6.1.8.2 승강로 벽은 0.3 m × 0.3 m 면적의 원형이나 사각의 단면에 1,000 N의 힘을 균등하게 분산하여 벽의 어느 지점에 가할 때 다음과 같은 기계적 강도를 가져야 한다. 가) 1 mm를 초과하는 영구적인 변형이 없어야 한다. 나) 15 mm를 초과하는 탄성 변형이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.2', '2015-05-13', '2022-03-01', 'old', '5.3.1.1 0.3 m × 0.3 m 면적의 원형이나 사각의 단면에 1,000 N의 힘을 균등하게 분산하여 벽의 어느 지점에 수직으로 가할 때, 가) 1 mm를 초과하는 영구변형이 없어야 한다. 나) 15 mm를 초과하는 탄성변형이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.2', '2013-09-15', '2015-05-12', 'old', '5.3.1.1 5 cm² 면적의 원형이나 사각의 단면에 300 N의 힘을 균등하게 분산하여 벽의 어느 지점에 수직으로 가할 때, 가) 영구적인 변형이 없어야 한다. 나) 15 mm를 초과하는 탄성변형이 없어야 한다.');

-- 6.1.8.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.8.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.3', '2022-03-02', NULL, 'current', '6.1.8.3 평면·성형 유리판은 KS L 2004에 적합한 접합유리로 만들어져야 한다. 유리판 및 그 고정설비는 0.3 m × 0.3 m 면적의 원형이나 사각의 단면에 벽 내부 및 외부의 어느 지점마다 정적인 힘 1,000 N에 대하여 영구 변형 없이 견딜 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.3', '2013-09-15', '2022-03-01', 'old', '5.3.1.2 일반적으로 사람이 접근 가능한 승강로 벽이 평면 또는 성형 유리판인 경우, KS L 2004에 적합하거나 동등 이상의 접합유리이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.3', '2009-11-24', '2013-09-14', 'old', '3.1.3(2) 승강로의 벽 또는 울 및 출입문은 불연재료 또는 내화구조로 만들거나 씌워야 한다. 유리 사용 시 망유리·강화유리·접합유리 및 복층유리(16mm 이상)와 동등 이상의 것을 사용하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.3', '2008-11-07', '2009-11-23', 'old', '3.1.3(2) 승강로의 벽 또는 울 및 출입문은 불연재료로 만들거나 씌워야 한다.');

-- 6.1.8.4
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.8.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.4', '2022-03-02', NULL, 'current', '6.1.8.4 피트 바닥은 매달린 주행안내 레일을 제외하고 각 주행안내 레일의 하부에 작용하는 힘을 지지할 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.4', '2013-09-15', '2022-03-01', 'old', '5.3.2.1 피트 바닥은 매달린 가이드 레일을 제외하고 각 가이드 레일의 하부에 작용하는 힘 즉, 가이드 레일의 중량과 비상 정지장치가 작동하는 순간의 반작용력을 더한 힘(N)을 지지할 수 있어야 한다.');

-- 6.1.8.5
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.8.5' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.5', '2022-03-02', NULL, 'current', '6.1.8.5 피트 바닥은 전 부하 상태의 카가 완충기에 작용하였을 때 카 완충기 지지대 아래에 부과되는 정하중의 4배를 지지할 수 있어야 한다. F = 4·gn·(P+Q)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.5', '2013-09-15', '2022-03-01', 'old', '5.3.2.2 피트 바닥은 전 부하 상태의 카가 완충기에 작용하였을 때 완충기 지지대 아래에 부과되는 정하중의 4배를 지지할 수 있어야 한다. 4·gn·(P+Q)');

-- 6.1.8.6
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.8.6' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.6', '2022-03-02', NULL, 'current', '6.1.8.6 피트 바닥은 균형추가 완충기에 작용하였을 때 균형추 완충기 지지대 아래에 부과되는 정하중의 4배를 지지할 수 있어야 한다. F = 4·gn·(P+q·Q)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.6', '2013-09-15', '2022-03-01', 'old', '5.3.2.3 피트 바닥은 균형추 또는 평형추의 무게에 의해 균형추 완충기 지지대 또는 평형추 주행구간 아래에 부과되는 정하중의 4배를 지지할 수 있어야 한다.');

-- 6.1.8.7
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.8.7' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.7', '2022-03-02', NULL, 'current', '6.1.8.7 유압식 엘리베이터의 경우, 피트 바닥은 각 잭의 바로 아래에 부과되는 하중 및 힘(N)을 지지할 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.7', '2013-09-15', '2022-03-01', 'old', '5.3.2.4 피트 바닥은 각 잭의 바로 아래에 부과되는 하중 및 힘(N)을 지지할 수 있어야 한다.');

-- 6.1.8.8
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.8.8' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.8', '2022-03-02', NULL, 'current', '6.1.8.8 유압식 엘리베이터의 경우, 멈춤쇠 장치가 작동하는 동안 고정된 정지위치에 부과되는 전체 수직력은 다음 공식에 따라 계산될 수 있다. 가) 에너지 축적형 완충기: F={3·gn·(P+Q)}/n 나) 에너지 분산형 완충기: F={2·gn·(P+Q)}/n');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.8', '2013-09-15', '2022-03-01', 'old', '5.3.4 멈춤 쇠(pawl) 장치가 작동하는 동안 수직력의 평가 가) 에너지 축적형 스프링 완충기: F={3gn(P+Q)}/n 나) 에너지 분산형 스프링 완충기: F={2gn(P+Q)}/n');