-- 수동 입력 7 (신규 제목), 7.1 (신규 제목), 7.1.1


-- 7 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7', '2022-03-02', NULL, 'current', '7 승강장문 및 카문');


-- 7.1 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.1', '2022-03-02', NULL, 'current', '7.1 일반사항');


-- 7.1.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.1.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.1.1', '2022-03-02', NULL, 'current', '7.1.1 카에 정상적으로 출입할 수 있는 승강로 개구부에는 승강장문이 제공되어야 하고, 카에 출입은 카문을 통해야 한다. 다만, 2개 이상의 카문이 있는 경우, 어떠한 경우라도 2개의 문이 동시에 열리지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.1.1', '2013-09-15', '2022-03-01', 'old', '8.5.1 카 출입구에는 문이 설치되어야 한다.

8.5.2 카에는 2개 이상의 출입구가 설치될 수 있으나 2개 이상의 문이 동시에 열려 통로로 사용되는 구조가 아니어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.1.1', '2004-12-01', '2013-09-14', 'old', '4.1.2(14) 시행 / 4.1.2(14) 2004년 12일 1일 이후 건축허가분부터 유압식 동일 적용

3.1.2(3) 사람이나 물건이 균형추, 승강로 벽 등 카 바깥부분에 닿을 염려가 없는 구조로 된 벽 또는 울 및 출입문을 설치하여야 한다. 다만, 자동차용 엘리베이터의 경우에는 출입문의 설치는 제외하나 자동차가 카 밖으로 벗어날 경우에 엘리베이터의 운행을 정지시키는 장치가 설치되어 있어야 한다.

3.1.2(5) 카에는 2개 이상의 출입구를 설치할 수 있으나, 2개의 문이 동시에 열려 통로로 사용되는 구조이어서는 아니된다.

3.1.3(4) 1개층에 대한 출입구는 카 1대에 대하여 2개의 출입구를 설치할 수 있으나 2개의 문이 동시에 열려 통로로 사용되는 구조이어서는 아니된다.

4.1.2(14) 카 문 또는 승강장 문이 2개 이상 설치된 경우 2개 이상의 문이 동시에 열려 통로로 사용되어서는 아니 된다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.1.1', '1999-09-03', '2004-11-30', 'old', '3.1.2(5), 3.1.3(4) 시행

3.1.2(3) 사람이나 물건이 균형추, 승강로 벽 등 카 바깥부분에 닿을 염려가 없는 구조로 된 벽 또는 울 및 출입문을 설치하여야 한다. 다만, 자동차용 엘리베이터의 경우에는 출입문의 설치는 제외하나 자동차가 카 밖으로 벗어날 경우에 엘리베이터의 운행을 정지시키는 장치가 설치되어 있어야 한다.

3.1.2(5) 카에는 2개의 출입구를 설치할 수 있으나, 2개의 문이 동시에 열려 통로로 사용되는 구조이어서는 아니된다.

3.1.3(4) 1개층에 대한 출입구는 카 1대에 대하여 2개의 출입구를 설치할 수 있으나 2개의 문이 동시에 열려 통로로 사용되는 구조이어서는 아니된다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.1.1', NULL, '1999-09-02', 'old', '3.1.2(3) 사람이나 물건이 균형추, 승강로 벽 등 카 바깥부분에 닿을 염려가 없는 구조로 된 벽 또는 울 및 출입문을 설치하여야 한다. 다만, 자동차용 엘리베이터의 경우에는 출입문의 설치는 제외하나 자동차가 카 밖으로 벗어날 경우에 엘리베이터의 운행을 정지시키는 장치가 설치되어 있어야 한다.

3.1.2(5) 카에는 1개의 출입구만을 설치하여야 한다. 다만, 침대용·화물용 및 자동차용 엘리베이터의 경우에는 2개의 출입구를 설치할 수 있으나, 2개의 문이 동시에 열려 통로로 사용되는 구조이어서는 아니된다.

3.1.3(4) 1개층에 대한 출입구는 카 1대에 대하여 2개 이상 설치하지 않아야 한다. 다만, 침대용·화물용 및 자동차용 엘리베이터의 경우에는 2개의 출입구를 설치할 수 있으나 2개의 문이 동시에 열려 통로로 사용되는 구조이어서는 아니된다.');
