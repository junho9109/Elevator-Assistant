-- 수동 입력 7.3.3.1, 7.3.3.2, 7.3.3.3, 7.3.3.4


-- 7.3.3.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.3.3.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.3.1', '2022-03-02', NULL, 'current', '7.3.3.1 수직 개폐식 승강장문 및 카문의 문짝은 2개의 독립된 현수 부품에 의해 고정되어야 한다.');


-- 7.3.3.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.3.3.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.3.2', '2022-03-02', NULL, 'current', '7.3.3.2 현수 로프·체인 및 벨트의 안전율은 8 이상으로 설계되어야 한다.');


-- 7.3.3.3
DELETE FROM inspection_item_revisions WHERE item_id = '7.3.3.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.3.3', '2022-03-02', NULL, 'current', '7.3.3.3 현수 로프 풀리의 피치 직경은 로프 직경의 25배 이상이어야 한다.');


-- 7.3.3.4
DELETE FROM inspection_item_revisions WHERE item_id = '7.3.3.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.3.4', '2022-03-02', NULL, 'current', '7.3.3.4 현수 로프/체인은 풀리 홈 또는 스프로킷에서 이탈되지 않도록 보호되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.3.3.4', '2013-09-15', '2022-03-01', 'old', '7.4.3 수직 개폐식 문의 현수
7.4.3.1 수직 개폐식 문의 문짝은 2개의 독립된 현수부품에 고정되어야 한다.
7.4.3.2 현수 로프, 체인 및 벨트의 안전율은 8 이상이어야 한다.
7.4.3.3 현수 로프 풀리의 피치 직경은 로프 직경의 25배 이상이어야 한다.
7.4.3.4 현수 로프 및 체인은 풀리 홈 또는 스프라켓으로부터 이탈되지 않도록 보호되어야 한다.');
