-- 수동 입력 7.3.2 (신규 제목), 7.3.2.1, 7.3.2.2, 7.3.2.3, 7.3.3 (신규 제목)


-- 7.3.2 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.3.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.2', '2022-03-02', NULL, 'current', '7.3.2 출입문 안내수단');


-- 7.3.2.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.3.2.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.2.1', '2022-03-02', NULL, 'current', '7.3.2.1 승강장문 및 카문은 정상작동 중 이탈, 기계적인 끼임 또는 작동 경로의 끝단에서 벗어나는 것이 방지되도록 설계되어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');


-- 7.3.2.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.3.2.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.2.2', '2022-03-02', NULL, 'current', '7.3.2.2 수평 개폐식 승강장문 및 카문은 상부와 하부에서 안내되어야 한다.
비고 상부 안내수단은 행거롤러를 말하고, 하부 안내수단은 가이드 슈를 말한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.2.2', '2013-09-15', '2022-03-01', 'old', '7.4.2.2 수평 개폐식 승강장문은 상·하부에서 안내되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.2.2', '2005-06-01', '2013-09-14', 'old', '4.1.5(12) 카 문의 가이드 슈가 문턱 틈에 충분히 들어가 있어야 하며, 도어행거의 요동정지의 설치상태는 견고하여야 한다.');


-- 7.3.2.3
DELETE FROM inspection_item_revisions WHERE item_id = '7.3.2.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.2.3', '2022-03-02', NULL, 'current', '7.3.2.3 수직 개폐식 승강장문 및 카문은 양 측면에서 안내되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.2.3', '2013-09-15', '2022-03-01', 'old', '7.4.2.3 수직 개폐식 승강장문은 양 측면에서 안내되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.2.3', '2005-06-01', '2013-09-14', 'old', '4.1.5(12) 카 문의 가이드 슈가 문턱 틈에 충분히 들어가 있어야 하며, 도어행거의 요동정지의 설치상태는 견고하여야 한다.');


-- 7.3.3 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.3.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.3', '2022-03-02', NULL, 'current', '7.3.3 수직 개폐식 문의 현수');
