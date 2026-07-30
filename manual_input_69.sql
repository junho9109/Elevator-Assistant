-- 수동 입력 7.9.1.1, 7.9.1.2, 7.9.1.3, 7.9.1.4


-- 7.9.1.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.1.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.1', '2022-03-02', NULL, 'current', '7.9.1.1 일반사항
7.8.1에 따른 승강장문 잠금장치는 각각의 승강장문에 있어야 한다. 이 승강장문 잠금장치는 고의적인 남용에 대해 보호되어야 한다.
16.1.4 및 16.1.8에 따른 경우를 제외하고, 닫힌 위치에서는 승강장문을 효과적으로 잠그는 것이 카의 움직임보다 우선되어야 한다. 이 잠금은 15.2에 따른 전기안전장치에 의해 입증되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.1', '2013-09-15', '2022-03-01', 'old', '7.7.3 잠금 및 비상 잠금해제
각 승강장문에는 7.7.1의 규정을 만족하는 잠금장치가 있어야 한다.
이 장치는 고의적인 오용에 대해 보호되어야 한다.

7.7.3.1 잠금
닫힌 위치에서 승강장문의 확실한 잠금이 카의 움직임보다 우선되어야 한다. 다만, 카의 운행을 위한 예비운전은 발생될 수 있다. 잠금은 14.1.2에 적합한 전기안전장치에 의해 입증되어야 한다.');


-- 7.9.1.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.1.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.2', '2022-03-02', NULL, 'current', '7.9.1.2 전기안전장치는 잠금 부품이 7 ㎜ 이상 물리지 않으면 작동되지 않아야 한다.(그림 12 참조)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.2', '2013-09-15', '2022-03-01', 'old', '7.7.3.1.1 잠금 부품이 7 mm 이상 물려지기 전에는 카가 출발되지 않아야 한다. 그림 3 참조');


-- 7.9.1.3
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.1.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.3', '2022-03-02', NULL, 'current', '7.9.1.3 문짝의 잠금 상태를 입증하는 전기안전장치의 부품은 잠금 부품에 의한 어떠한 중간 메커니즘 없이 확실하게 작동되어야 한다.
특별한 경우: 습기 또는 폭발의 위험으로부터 특별한 보호가 요구되는 설비에 사용되는 승강장문 잠금장치의 경우, 기계적인 잠금과 잠금 상태를 입증하는 전기안전장치의 부품 사이의 연결은 고의적으로 승강장문 잠금장치를 파괴함으로써만 중단될 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.3', '2013-09-15', '2022-03-01', 'old', '7.7.3.1.2 문짝의 잠금 상태를 입증하는 전기안전장치의 부품은 잠금 부품에 의해 어떤 중간 메커니즘 없이 확실하게 작동되어야 한다. 이것은 필요한 경우의 조정을 제외하고 잘 못될 수가 없어야 한다.
특별한 사례 : 습기 또는 폭발의 위험에 대비한 특별한 보호가 요구되는 엘리베이터에 사용되는 잠금장치의 경우, 기계적인 잠금과 잠금 상태를 입증하는 전기안전장치 부품 사이의 연계가 확실하다면 잠금장치를 의도적으로 파손할 경우에만 그 연계의 차단이 가능할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.3', '1991-01-14', '2013-09-14', 'old', '4.1.3(11) 승강장 문의 로크 및 스위치는 다음 기준에 적합하여야 한다.
③ 승강장 문의 인터록장치는 로크가 확실히 걸린 후에 도어스위치를 닫고, 반대로 도어스위치가 확실히 열린 후가 아니면 로크는 벗겨지지 않아야 한다. 다만, 상승개폐문 또는 상하개폐문의 경우 카가 정지한 층에 대하여는 그러하지 아니한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.3', NULL, '1991-01-13', 'old', '4.1.3(11) 승강장 문의 로크 및 스위치는 다음 기준에 적합하여야 한다.
③ 승강장 문의 인터록장치는 로크가 확실히 걸린 후에 도어스위치를 닫고, 반대로 도어스위치가 확실히 열린 후가 아니면 로크는 벗겨지지 않아야 한다.');


-- 7.9.1.4
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.1.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.4', '2022-03-02', NULL, 'current', '7.9.1.4 경첩이 달린 승강장문의 경우, 잠금은 닫히는 문의 수직 모서리에 최대한 가까이에서 이뤄져야 하고, 문짝이 처지더라도 유지되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.4', '2013-09-15', '2022-03-01', 'old', '7.7.3.1.3 경첩이 있는 문의 경우, 문이 닫히는 수직방향 모서리에 가능한 가까이에서 잠금이 이뤄져야하고 잠금 상태는 문짝이 처지더라도 유지되어야 한다.');
