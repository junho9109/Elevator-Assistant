-- 1.5.3 보상수단 연혁 정리: 2013-09-15~2015-05-12 구간의 조문 번호가 서로 바뀌어 있던 3건을 바로잡는다.
-- 백업 테이블 inspection_item_revisions_bak3_20261028 에 대상 행을 먼저 복사한다.
BEGIN;

CREATE TABLE IF NOT EXISTS inspection_item_revisions_bak3_20261028 AS
SELECT * FROM inspection_item_revisions
WHERE id IN (8015, 8016, 8019) AND equipment_type = '엘리베이터';

-- 실행 전 상태 확인 (기대: 8015=9.6.1, 8016=9.6.1, 8019=9.6.2)
SELECT id, item_id, effective_date, expiry_date, left(description, 40) AS 내용
FROM inspection_item_revisions
WHERE id IN (8015, 8016, 8019) AND equipment_type = '엘리베이터' ORDER BY id;

-- 8019 튀어오름방지장치: 9.6.2 -> 9.6.1
UPDATE inspection_item_revisions SET item_id = '9.6.1'
WHERE id = 8019 AND equipment_type = '엘리베이터' AND item_id = '9.6.2';

-- 8015 균형로프(인장 풀리 등), 8016 4.1.4(11) 균형로프·체인 설치상태: 9.6.1 -> 9.6.2
UPDATE inspection_item_revisions SET item_id = '9.6.2'
WHERE id IN (8015, 8016) AND equipment_type = '엘리베이터' AND item_id = '9.6.1';

-- 실행 후 상태 확인 (기대: 9.6.1 = 8013,8014,8019 / 9.6.2 = 8017,8018,8015,8016)
SELECT item_id, id, introduction_type, effective_date, expiry_date, left(description, 30) AS 내용
FROM inspection_item_revisions
WHERE equipment_type = '엘리베이터' AND item_id IN ('9.6.1', '9.6.2') ORDER BY item_id, effective_date DESC NULLS LAST, id;

COMMIT;
