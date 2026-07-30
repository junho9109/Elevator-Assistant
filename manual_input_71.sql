-- 수동 입력 7.9.3 (신규 제목 + 종전 5단계), 7.9.3.1~7.9.3.5, 7.9.4 (신규 제목), 7.9.4.1~7.9.4.3


-- 7.9.3 (신규 제목, 소관 조항 통합 종전 이력 포함)
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3', '2022-03-02', NULL, 'current', '7.9.3 비상잠금해제');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3', '2015-05-13', '2022-03-01', 'old', '7.7.3.2 비상 잠금 해제
각 승강장문은 밖에서 열쇠로 잠금이 해제될 수 있어야 한다. 이 열쇠는 부속서 Ⅱ에서 규정한 열쇠구멍에 맞는 것이어야 한다. 이 열쇠는 책임 있는 사람에게만 주어져야 한다. 이 열쇠에는 확실하게 다시 잠기지 않아 발생할 수 있는 사고를 예방하기 위해 필수 주의사항이 문자로 상세하게 설명된 지침이 있어야 한다. 비상 잠금해제 후에, 승강장문은 닫힘과 함께 다시 잠금장치가 작동하여 잠겨야 한다. 승강장문이 카문에 의해 작동되는 경우, 카가 잠금해제구간 밖에 있을 때에는 어떤 이유라도 승강장문을 자동으로 닫히게 보장하는 장치(추 또는 스프링)가 있어야 한다.

7.7.3.2.6 비상잠금 해제 열쇠는 책임 있는 사람에게만 주어져야 한다. 이 열쇠에는 확실하게 잠기지 않아 발생할 수 있는 사고를 예방하기 위해 필수 주의사항이 문자로 상세하게 설명된 지침이 부착되거나 표기되어야 한다.

15.11 승강장문을 여는 열쇠
승강장 문을 여는 비상열쇠는 이 열쇠를 사용함에 있어 생길 수 있는 위험에 주의하고 문이 닫힌 후에는 문이 잠겼는지 확인할 필요가 있다는 문구와 그림이 부착된 라벨이 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3', '2013-09-15', '2015-05-12', 'old', '7.7.3.2 비상 잠금 해제
각 승강장문은 밖에서 열쇠로 잠금이 해제될 수 있어야 한다. 이 열쇠는 부속서 Ⅱ에서 규정한 열쇠구멍에 맞는 것이어야 한다. 이 열쇠는 책임 있는 사람에게만 주어져야 한다. 이 열쇠에는 확실하게 다시 잠기지 않아 발생할 수 있는 사고를 예방하기 위해 필수 주의사항이 문자로 상세하게 설명된 지침이 있어야 한다. 비상 잠금해제 후에, 승강장문은 닫힘과 함께 다시 잠금장치가 작동하여 잠겨야 한다. 승강장문이 카문에 의해 작동되는 경우, 카가 잠금해제구간 밖에 있을 때에는 어떤 이유라도 승강장문을 자동으로 닫히게 보장하는 장치(추 또는 스프링)가 있어야 한다.

15.11 승강장문을 여는 열쇠
승강장 문을 여는 비상열쇠는 이 열쇠를 사용함에 있어 생길 수 있는 위험에 주의하고 문이 닫힌 후에는 문이 잠겼는지 확인할 필요가 있다는 문구와 그림이 부착된 라벨이 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3', '2008-11-07', '2013-09-14', 'old', '3.1.6(2) 카가 정지하고 있지 않은 층에서는 특수한 키를 사용하지 않으면 밖에서 승강로의 출입문을 열 수 없도록 하는 장치를 설치하여야 하며, 승강장 출입문을 개방하기 위한 장치는 그림 3에 규정된 삼각형의 잠금해제장치의 규격에 적합하여야 한다. 또한, 특수한 키에는 사용상의 위험과 승강장문이 닫힌 후 문의 잠금여부를 확인해야 하는 등의 주의사항이 표시되어야 한다.

4.1.5(14) 카가 정지하고 있지 않은 층에서 승강로의 출입문을 열수 있는 특수한 키에는 사용상의 위험과 승강장문이 닫힌 후 문의 잠금여부를 확인해야 하는 등의 주의사항이 표시되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3', '2008-09-10', '2008-11-06', 'old', '3.1.6(2) 카가 정지하고 있지 않은 층에서는 특수한 키를 사용하지 않으면 밖에서 승강로의 출입문을 열 수 없도록 하는 장치를 설치하여야 하며, 승강장 출입문을 개방하기 위한 장치는 그림 4에 규정된 삼각형의 잠금해제장치의 규격에 적합하여야 한다. 또한, 특수한 키에는 사용상의 위험과 승강장문이 닫힌 후 문의 잠금여부를 확인해야 하는 등의 주의사항이 표시되어야 한다.

4.1.5(14) 카가 정지하고 있지 않은 층에서 승강로의 출입문을 열수 있는 특수한 키에는 사용상의 위험과 승강장문이 닫힌 후 문의 잠금여부를 확인해야 하는 등의 주의사항이 표시되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3', NULL, '2008-09-09', 'old', '3.1.6(2) 카가 정지하고 있지 않은 층에서는 특수한 키를 사용하지 않으면 밖에서 승강로의 출입문을 열 수 없도록 하는 장치');


-- 7.9.3.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.3.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3.1', '2022-03-02', NULL, 'current', '7.9.3.1 각 승강장문은 그림 13에 따른 구멍에 적합한 비상잠금해제 삼각열쇠를 사용하여 외부에서 잠금 해제될 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3.1', '2015-05-13', '2022-03-01', 'old', '7.7.3.2.1 각 승강장문은 승강로 밖(승강장)에서 열쇠로 잠금이 해제되어야 한다. 이 열쇠는 별표 1의 부속서 Ⅱ에서 규정한 열쇠구멍에 맞는 것이어 한다.');


-- 7.9.3.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.3.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3.2', '2022-03-02', NULL, 'current', '7.9.3.2 비상잠금해제 삼각열쇠 구멍은 승강장문의 문짝 또는 문틀에 있어야 하고, 문짝 및 문틀의 수직면에 있는 경우 승강장 바닥 위로 높이 2 m 이하에 위치되어야 한다.
잠금해제 삼각열쇠 구멍이 문틀에 있고 수평면에 대해 아랫방향으로 향하는 경우, 그 구멍의 최대 높이는 승강장 바닥에서 2.7 m 이하이어야 하고 비상잠금해제 삼각열쇠의 길이는 해당 승강장문의 높이에서 2 m를 뺀 수치 이상이어야 한다.
비상해제 삼각열쇠의 길이가 0.2 m를 초과한 경우에는 특수 도구로 간주되며, 그 비상 해제 삼각열쇠는 해당 엘리베이터가 설치된 장소에 비치되어 자격자가 즉시 이용할 수 있게 해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3.2', '2015-05-13', '2022-03-01', 'old', '7.7.3.2.2 잠금해제 열쇠구멍은 승강장 바닥에서부터 수직으로 2.0 m를 초과하지 않은 승강장문의 문짝이나 문틀에 위치되어야 한다.
비상잠금 해제는 의자, 사다리 등 오를 수 있는 수단의 사용 없이 가능하여야 한다.');


-- 7.9.3.3
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.3.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3.3', '2022-03-02', NULL, 'current', '7.9.3.3 비상잠금해제 후, 승강장문 잠금장치는 승강장문이 닫혀있는 상태에서는 잠금해제 위치를 유지할 수 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3.3', '2015-05-13', '2022-03-01', 'old', '7.7.3.2.3 비상잠금 해제이후, 잠금장치는 승강장문의 닫힘과 함께 다시 작동하여 잠겨야 한다.');


-- 7.9.3.4
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.3.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3.4', '2022-03-02', NULL, 'current', '7.9.3.4 승강장문이 카문에 의해 작동되는 경우, 카가 잠금해제구간 밖에 있을 때 어떤 이유로 승강장문이 열리더라도 승강장문의 닫힘 및 잠김을 보장하는 장치(무게추 또는 스프링 등)가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3.4', '2015-05-13', '2022-03-01', 'old', '7.7.3.2.4 승강장문이 카문에 의해 작동되는 경우, 카가 잠금해제구간 밖에 있을 때에는 어떤 이유라도 승강장문을 자동으로 닫히게 보장하는 장치(추 또는 스프링)가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3.4', '1997-08-18', '2015-05-12', 'old', '3.1.6(14) 승강장 문이 카 문과의 연동에 의해 열리는 방식에서는 자동적으로 승강장의 문이 닫히는 쪽으로 힘을 작용시키는 장치

4.1.3(27) 승강장 문이 카 문과의 연동에 의하여 열리는 방식인 경우에 도어클로저의 설치상태는 견고하고, 작동상태는 양호하여야 한다.');


-- 7.9.3.5
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.3.5' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3.5', '2022-03-02', NULL, 'current', '7.9.3.5 승강장문을 통해서만 피트에 출입할 수 있는 경우, 승강장문 잠금장치는 6.2.4에 따른 사다리로부터 높이 1.8 m 이내 및 수평거리 0.8 m 이내에서 안전하게 닿을 수 있어야 하거나, 피트에 있는 사람이 승강장문의 잠금을 해제할 수 있는 장치가 영구적으로 설치되어 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.3.5', '2015-05-13', '2022-03-01', 'old', '7.7.3.2.5 승강장문을 통해 피트에 출입하는 경우에는 피트에 있는 사람이 5.7.3.2에 따른 사다리를 통해 수직거리 1.8 m와 수평거리 0.8 m 이내에서 승강장문 잠금장치에 안전하게 접근하여 직접 또는 어떤 수단에 의해 승강장문을 개방할 수 있어야 한다.');


-- 7.9.4 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.4', '2022-03-02', NULL, 'current', '7.9.4 승강장문의 닫힘을 입증하는 전기안전장치');


-- 7.9.4.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.4.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.4.1', '2022-03-02', NULL, 'current', '7.9.4.1 승강장문의 닫힘을 입증하는 15.2에 따른 전기안전장치는 각각의 승강장문에 있어야 하고, 7.8.2에 따른 기준에 적합해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.4.1', '2013-09-15', '2022-03-01', 'old', '7.7.4.1 각 승강장문에는 7.7.2에 의한 규정을 만족하고 닫힘 상태를 입증하기 위해 14.1.2에 적합한 전기안전장치가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.4.1', NULL, '2013-09-14', 'old', '3.1.6(1) 카 및 승강로의 모든 출입문이 닫혀 있지 않으면 카가 움직이지 않는 장치

4.1.3(11) 승강장 문의 로크 및 스위치는 다음 기준에 적합하여야 한다.
② 승강장 문이 열려 있거나 닫혀 있지 않은 경우에는 엘리베이터가 움직이지 않도록 하는 도어스위치의 작동상태는 양호하여야 한다.');


-- 7.9.4.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.4.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.4.2', '2022-03-02', NULL, 'current', '7.9.4.2 카문과 연동하는 수평 개폐식 승강장문의 경우, 승강장문의 닫힘을 입증하는 전기안전장치는 승강장문 닫힘이 실제 유효한 경우 잠금 상태를 입증하는 전기안전장치로써 공용으로 사용될 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.4.2', '2013-09-15', '2022-03-01', 'old', '7.7.4.2 카문과 연결된 수평 개폐식 승강장문의 경우, 이 장치가 승강장문의 확실한 닫힘을 입증할 수 있다면 잠금 상태를 입증하는 장치와 함께 공용으로 사용될 수 있다.');


-- 7.9.4.3
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.4.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.4.3', '2022-03-02', NULL, 'current', '7.9.4.3 경첩이 달린 승강장문의 경우, 승강장문의 닫힘을 입증하는 전기안전장치는 승강장문의 닫히는 모서리 근처 또는 문의 닫힘 상태를 입증하는 기계적인 장치에 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.4.3', '2013-09-15', '2022-03-01', 'old', '7.7.4.3 경첩이 있는 문의 경우, 이 장치는 승장장문의 닫히는 모서리 근처 또는 승강장문의 닫힘 상태를 입증하는 기계적 장치에 있어야 한다.');
