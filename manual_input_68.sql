-- 수동 입력 7.8.2, 7.9 (신규 제목), 7.9.1 (신규 제목)


-- 7.8.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.8.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.8.2', '2022-03-02', NULL, 'current', '7.8.2 전단에 대한 보호
16.1.4 및 16.1.8에 따른 경우를 제외하고, 승강장문 또는 여러 개의 문짝이 있는 승강장문의 어떤 문짝이 열리면, 엘리베이터가 출발하거나 계속 움직일 가능성은 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.8.2', '2013-09-15', '2022-03-01', 'old', '7.7.2.1 엘리베이터가 정상적으로 운행하는 중에 7.7.2.2를 제외하고 승강장문 또는 여러 문짝이 있는 승강장문의 어떤 문짝이 열린 경우에는 엘리베이터가 출발하거나 계속 움직일 가능성은 없어야 한다. 다만, 카의 운행을 위한 예비 운전은 가능할 수 있다.

7.7.2.2 문이 열린 상태로 운행되는 경우는 다음과 같은 구간에서 허용된다.
가) 14.2.1.2의 규정을 만족하는 경우, 해당 층에서 착상 또는 재-착상이 허용되는 잠금해제구간
나) 8.4.3, 8.14 및 14.2.1.5의 규정 및 다음 사항을 만족하는 경우, 카에 타고 내리는 것(또는 하역작업)이 허용되는 승강장 바닥 위로 최대 1.65m 높이까지 연장된 구간
1) 승강장문 헤더와 카 바닥 사이의 유효높이가 2m 이상이어야 하고,
2) 카가 이 구간에 있을지라도, 특별한 조작 없이 승강장문을 완전히 닫을 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.8.2', NULL, '2013-09-14', 'old', '3.1.6(1) 카 및 승강로의 모든 출입문이 닫혀 있지 않으면 카가 움직이지 않는 장치

4.1.3(11) 승강장 문의 로크 및 스위치는 다음 기준에 적합하여야 한다.
② 승강장 문이 열려 있거나 닫혀 있지 않은 경우에는 엘리베이터가 움직이지 않도록 하는 도어스위치의 작동상태는 양호하여야 한다.');


-- 7.9 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.9' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9', '2022-03-02', NULL, 'current', '7.9 승강장문 및 카문의 잠금, 비상잠금해제');


-- 7.9.1 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1', '2022-03-02', NULL, 'current', '7.9.1 승강장문 잠금장치');
