-- 수동 입력 7.5.1, 7.5.2 (신규 제목), 7.5.2.1, 7.5.2.2, 7.5.3 (신규 제목)


-- 7.5.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.5.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.1', '2022-03-02', NULL, 'current', '7.5.1 일반사항
승강장문 및 카문을 구성하는 부품들은 환경적인 조건에서 설계된 수명 동안 적절한 강도가 유지되는 재질로 만들어져야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.1', '2013-09-15', '2022-03-01', 'old', '7.2.1 승강장문 및 문틀은 시간이 경과되어도 변형되지 않는 방법으로 설치되어야 한다. 승강장문 및 문틀은 이 기준을 만족하기 위해 금속으로 하는 것을 권장한다.');


-- 7.5.2 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.5.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.2', '2022-03-02', NULL, 'current', '7.5.2 방화 등급');


-- 7.5.2.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.5.2.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.2.1', '2022-03-02', NULL, 'current', '7.5.2.1 「건축법」 등 관계 법령에 따라 승강장문에 방화 등급이 요구되는 경우, 관련 규정에 적합한 승강장문이 설치되어야 한다.
비고 국토교통부 고시 또는 승강기안전부품 안전기준 별표 10을 참조한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.2.1', '2013-09-15', '2022-03-01', 'old', '7.2.2 방화 등급
건축법령에서 방화등급이 요구되는 경우에는 관련 규정에 적합한 승강장문이 설치되어야 한다.');


-- 7.5.2.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.5.2.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.2.2', '2022-03-02', NULL, 'current', '7.5.2.2 승강장문(방화문)에는 보기 쉬운 곳에 쉽게 지워지지 않는 방법으로 별표 10에 따른 표시사항이 표시되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.2.2', '2013-09-15', '2022-03-01', 'old', '15.18 승강장문 조립체 충격시험
승강장문 조립체에는 다음과 같은 사항이 표시된 명판이 부착되어야 한다.
가) 제조업체명
나) 안전인증 또는 안전성 평가 승인 표시
다) 승강장문 가이드 슈 묻힘 깊이');


-- 7.5.3 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.5.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.3', '2022-03-02', NULL, 'current', '7.5.3 기계적 강도');
