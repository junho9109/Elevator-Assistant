-- 수동 입력 6.6.3.1


-- 6.6.3.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.3.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.1', '2022-03-02', NULL, 'current', '6.6.3.1 승강로에 있는 권상도르래
권상도르래는 다음과 같은 경우 승강로에 설치될 수 있다.
가) 기계실에서 점검 등 유지관리 업무가 수행될 수 있는 경우
나) 기계실과 승강로 사이의 개구부가 업무 수행자 등 자격자의 추락 또는 작업 공구의 낙하 위험이 없도록 가능한 작은 경우');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.1', '2013-09-15', '2022-03-01', 'old', '6.3.1.2 권상 도르래는 다음과 같을 경우 승강로에 설치될 수 있다.
가) 유지보수 및 점검이 기계실에서부터 수행될 수 있는 경우
나) 기계실과 승강로 사이의 개구부가 가능한 작은 경우');
