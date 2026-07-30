-- 수동 입력 7.6 (신규 제목), 7.6.1, 7.6.2 (신규 제목), 7.6.2.1, 7.6.2.2 (신규 제목)


-- 7.6 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.6' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6', '2022-03-02', NULL, 'current', '7.6 문 작동에 관한 보호');


-- 7.6.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.6.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.1', '2022-03-02', NULL, 'current', '7.6.1 일반사항
문 및 문 주위는 사람의 신체 일부, 옷 또는 기타 물건이 끼여 발생하는 손상 또는 부상의 위험을 최소화하는 방법으로 설계되어야 한다.
자동 동력 작동식 문의 표면(승강장문의 경우에는 승강장 측, 카문의 경우에는 카 내부 측)은 문이 작동하는 동안 전단(剪斷)의 위험을 방지하기 위해 3 ㎜를 초과하는 함몰 또는 돌출 부분이 없어야 한다.
이러한 함몰 또는 돌출 부분의 모서리는 문의 열림 방향으로 모따기(chamfer)되어야 한다. 다만, 7.9.3에 따른 비상잠금해제를 사용하기 위한 부분은 예외로 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.1', '2013-09-15', '2022-03-01', 'old', '7.5.1 일반사항
문 및 문 주위는 인체의 일부, 옷 또는 기타 물체가 끼여 발생하는 손상 또는 부상의 위험을 최소화시키는 방법으로 설계되어야 한다.
자동 동력 작동식 문의 외부표면은 작동하는 동안 전단의 위험을 방지하기 위해 3 mm를 초과하여 함몰되거나 돌출되지 않아야 한다. 이러한 문의 모서리는 열림 동작 방향으로 둥글게 처리되어야 한다. 다만, 부속서 Ⅱ에서 규정한 잠금해제장치를 사용하기 위한 부분은 적용되지 않는다.

8.7.1 일반사항
문 및 문 주위는 인체의 일부, 옷 또는 기타 물체가 끼여 발생하는 손상 또는 부상의 위험을 최소화시키는 방법으로 설계되어야 한다.
작동하는 동안 전단의 위험을 방지하기 위해, 자동 동력 작동식 문의 외부표면은 3 mm를 초과하여 함몰되거나 돌출되지 않아야 한다. 이러한 문의 모서리는 열림 동작 방향으로 둥글게 처리되어야 한다. 다만, 8.6.1에 따른 구멍이 있는 문에는 적용하지 않는다.');


-- 7.6.2 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.6.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2', '2022-03-02', NULL, 'current', '7.6.2 동력 작동식 문');


-- 7.6.2.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.6.2.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2.1', '2022-03-02', NULL, 'current', '7.6.2.1 일반사항
승강장문과 카문이 연동되어 동시에 작동되는 경우, 7.6.2의 요구사항은 결합된 메커니즘에 대해 유효하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2.1', '2013-09-15', '2022-03-01', 'old', '7.5.2 동력 작동식 문
동력 작동식 문은 사람이 문짝과 충돌하여 입게 되는 유해한 결과를 최소로 줄일 수 있게 설계되어야 한다. 이 목적을 위해 다음 사항을 만족하여야 한다.

8.7.2 동력 작동식 문
동력 작동식 문은 사람이 문짝과 충돌하여 입게 되는 유해한 결과를 최소로 줄일 수 있도록 설계되어야 한다. 이 목적을 위해 다음 규정에 적합하여야 한다.
카문과 승강장문이 연동되어 동시에 작동하는 경우, 다음 규정은 결합된 문의 메커니즘에 대해 유효하다.');


-- 7.6.2.2 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.6.2.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2.2', '2022-03-02', NULL, 'current', '7.6.2.2 수평 개폐식 문');
