-- 수동 입력 7.6.2.4, 7.6.3, 7.7 (신규 제목), 7.7.1, 7.7.2 (신규 제목)


-- 7.6.2.4
DELETE FROM inspection_item_revisions WHERE item_id = '7.6.2.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2.4', '2022-03-02', NULL, 'current', '7.6.2.4 다른 형식의 문
동력 작동의 다른 형식의 문(경첩이 달린 문 등)이 개폐될 때, 사람이 부딪힐 위험이 있는 곳에는 동력 작동 개폐식 문에 대한 것과 유사한 예방조치가 취해져야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2.4', '2013-09-15', '2022-03-01', 'old', '7.5.2.3 다른 형식의 문
다른 형식의 문(동력 작동 회전문이 사용되는 경우 등)이 개폐될 때 사람이 부딪힐 위험이 있는 곳에는 동력 작동 개폐식에서 기술된 것과 유사한 예방조치가 취해져야 한다.');


-- 7.6.3
DELETE FROM inspection_item_revisions WHERE item_id = '7.6.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.3', '2019-03-28', NULL, 'current', '7.6.3 닫힌 문의 재-개방
카문이 자동 동력 작동식인 경우, 카 내부의 문 열림 버튼(◁｜▷)은 카가 승강장에 있을 때 문을 다시 열 수 있어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.3', '2005-06-01', '2019-03-27', 'old', '3.1.6(20) 엘리베이터가 정지한 상태에서 출입문의 닫힘 동작에 우선하여 카 내에서 문을 열 수 있도록 하는 장치');


-- 7.7 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.7' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.7', '2022-03-02', NULL, 'current', '7.7 승강장 조명 및 <<카 있음>> 신호 표시');


-- 7.7.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.7.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.7.1', '2025-03-02', NULL, 'current', '7.7.1 승강장 조명
승강장문 근처의 승강장에 있는 자연조명 또는 인공조명은 카 조명이 꺼지더라도 이용자가 엘리베이터에 탑승하기 위해 승강장문이 열릴 때 미리 앞을 볼 수 있도록 바닥에서 50 ㏓ 이상이어야 한다. 다만, 자동차용 엘리베이터의 승강장에 있는 조명은 바닥에서 150 ㏓ 이상이어야 한다.
<2025년 3월 2일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.7.1', '2019-03-28', '2025-03-01', 'old', '7.7.1 승강장 조명
승강장문 근처의 승강장에 있는 자연조명 또는 인공조명은 카 조명이 꺼지더라도 이용자가 엘리베이터에 탑승하기 위해 승강장문이 열릴 때 미리 앞을 볼 수 있도록 바닥에서 50 ㏓ 이상이어야 한다,');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.7.1', '2013-09-15', '2019-03-27', 'old', '7.6.1 승강장 조명
승강장에는 카 조명이 없더라도 이용자가 승강장문을 열고 엘리베이터에 탑승할 때 앞을 볼 수 있도록 50 lx 이상(바닥에서 측정)의 자연 또는 인공조명이 있어야 한다.');


-- 7.7.2 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.7.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.7.2', '2022-03-02', NULL, 'current', '7.7.2 <<카 있음>> 신호 표시');
