-- 수동 입력 7.15 (신규 제목), 7.15.1, 7.15.1.1, 7.15.2, 7.15.3, 7.15.4, 7.16 (7장 마지막 조문)


-- 7.15 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.15' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.15', '2022-03-02', NULL, 'current', '7.15 카문의 개방');


-- 7.15.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.15.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.15.1', '2022-03-02', NULL, 'current', '7.15.1 엘리베이터가 어떤 이유로 인해 잠금해제구간(7.8.1)에서 정지하고 있고 도어 개폐장치가 닫히는 힘을 가하지 않을 때, 기계적으로 연동된 승강장문 및 카문은 다음과 같은 위치에서 손으로 승강장문 및 카문을 열 수 있어야 하고, 그 힘은 300 N을 초과하지 않아야 한다.
가) 승강장문이 비상잠금해제 삼각열쇠에 의해 잠금이 해제되었거나 카문에 의해 해제된 이후의 승강장
나) 카 내부
<2022년 3월 2일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.15.1', '2019-03-28', '2022-03-01', 'old', '7.15.1 엘리베이터가 어떤 이유로 인해 잠금해제구간(7.8.1)에서 정지한다면, 다음과 같은 위치에서 손으로 승강장문 및 카문을 열 수 있어야 하고, 그 힘은 300 N을 초과하지 않아야 한다.
가) 승강장문이 비상잠금해제 삼각열쇠에 의해 잠금이 해제되었거나 카문에 의해 해제된 이후의 승강장
나) 카 내부');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.15.1', '2013-09-15', '2019-03-27', 'old', '8.11.1 엘리베이터가 어떤 이유로 승강장 근처에서 정지한 경우, 승객이 카에서 빠져나오기 위해 다음과 같이 행동한다면 카는 정지되고 도어개폐장치의 전원은 차단되어야 한다.
가) 승강장에서 손으로 카문을 열거나 부분적으로 열기 위해
나) 카 내에서 손으로 승강장문과 함께 카문(카문과 승강장문이 연동될 경우)을 열거나 부분적으로 열기 위해

8.11.2 8.11.1에 규정된 카문의 개방은 잠금해제구간에서만 가능하여야 한다.
문을 개방하는데 필요한 힘은 300 N을 초과하지 않아야 한다.
11.2.1다)에 의해 적용받는 카문에 잠금장치가 있는 엘리베이터의 경우, 카 내에서 카문의 개방은 카가 잠금해제구간에 있을 때에만 가능하여야 한다.');


-- 7.15.1.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.15.1.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.15.1.1', '2022-03-02', NULL, 'current', '7.15.1.1 엘리베이터가 어떤 이유로 인해 잠금해제구간(7.8.1)에서 정지하고 있을 때, 기계적으로 연동되지 않은 승강장문 및 카문의 전원이 투입되지 않은 상황에서 카 내 승객의 구출은 외부에서 이루어져야 한다.
<2022년 3월 2일 이후 건축허가분부터 적용>');


-- 7.15.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.15.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.15.2', '2022-03-02', NULL, 'current', '7.15.2 카 내부에 있는 사람에 의한 카문의 개방을 제한하기 위하여 다음과 같은 수단이 제공되어야 한다.
가) 카가 운행 중 일때, 카문의 개방은 50 N 이상의 힘이 요구되어야 한다.
나) 카가 7.8.1에 따른 잠금해제구간 밖에 있을 때, 카문은 1,000 N의 힘으로 50 ㎜ 이상 열리지 않아야 하며, 자동 동력 작동 상태에서도 문은 열리지 않아야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.15.2', '2013-09-15', '2022-03-01', 'old', '8.11.3 정격속도 1 ㎧를 초과하여 운행 중인 엘리베이터 카문의 개방은 50 N 이상의 힘이 요구되어야 한다. 다만, 잠금해제구간에서는 제외한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.15.2', NULL, '2013-09-14', 'old', '4.1.3(2) 카 도어스위치 및 도어개폐장치의 설치상태는 견고하고, 각 부분의 연결 및 작동상태는 양호하여야 한다.');


-- 7.15.3
DELETE FROM inspection_item_revisions WHERE item_id = '7.15.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.15.3', '2019-03-28', NULL, 'current', '7.15.3 적어도 10.7.5에 따른 거리 이내에서 카가 정지하면 현장에서 영구적으로 이용할 수 있는 비상잠금해제 삼각열쇠 이외의 도구가 없어도 카문과 상응하는 승강장문을 열면 카문을 열 수 있어야 한다.
7.9.2에 따라 카문 잠금장치가 설치된 카문의 경우에도 동일하다.
<2019년 3월 28일 이후 건축허가분부터 적용>');


-- 7.15.4
DELETE FROM inspection_item_revisions WHERE item_id = '7.15.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.15.4', '2022-03-02', NULL, 'current', '7.15.4 6.5.3.1다)에 따라 카문 잠금장치가 있는 엘리베이터의 경우, 카 내부에서 카문의 개방은 카가 잠금해제구간에 있을 때에만 가능해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.15.4', '2013-09-15', '2022-03-01', 'old', '8.11.2 8.11.1에 규정된 카문의 개방은 잠금해제구간에서만 가능하여야 한다.
문을 개방하는데 필요한 힘은 300 N을 초과하지 않아야 한다.
11.2.1다)에 의해 적용받는 카문에 잠금장치가 있는 엘리베이터의 경우, 카 내에서 카문의 개방은 카가 잠금해제구간에 있을 때에만 가능하여야 한다.');


-- 7.16
DELETE FROM inspection_item_revisions WHERE item_id = '7.16' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.16', '2025-03-02', NULL, 'current', '7.16 자동차 진입방지장치
자동차용 엘리베이터에는 카가 도착하지 않은 층의 자동차 진입을 자동으로 방지하는 장치(이하 "자동차 진입방지장치"라 한다)를 설치하여야 하며, 자동차 진입방지장치는 다음을 만족하여야 한다.
가) 시속 5킬로미터의 주행속도로 진입하는 중량 2,200 kg의 자동차가 자동차 진입방지장치를 넘어가지 않고, 이에 따른 충격에 견디는 강도를 가질 것
나) 카가 도착한 층에서 승강장 문이 자동으로 열린 경우, 자동차 진입방지장치가 자동차의 운행을 방해하지 않을 것
다) 자동차 진입방지장치의 기능과 강도는 공인기관의 시험에 합격한 제품일 것
비고 자동차의 중량은 「기계식주차장치의 안전기준 및 검사기준 등에 관한 규정」 제9조(자동차의 중량) 대형 기계식주차장 기준을 따름
<2025년 3월 2일 이후 건축허가분부터 적용>');
