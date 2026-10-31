-- 6.5.6.1.1 / 6.5.6.2 / 6.5.6.3.2 / 6.5.6.4.2 의 "종전기준 없음" 안내 행을 화면에서만 숨김.
-- 본문은 검색용 칸(attachments_text)으로 옮겨 보관(검색·AI·DB 조회 유지). 삭제 없음. 여러 번 실행해도 결과 동일.
BEGIN;

CREATE TABLE IF NOT EXISTS inspection_item_revisions_bak8_20261029 AS
SELECT * FROM inspection_item_revisions
WHERE equipment_type = '엘리베이터' AND item_id IN ('6.5.6.1.1','6.5.6.2','6.5.6.3.2','6.5.6.4.2');

-- 실행 전
SELECT id, item_id, introduction_type AS 구분, effective_date AS 시행, expiry_date AS 종료, length(description) AS 글자수, left(description,40) AS 내용
FROM inspection_item_revisions
WHERE equipment_type = '엘리베이터' AND item_id IN ('6.5.6.1.1','6.5.6.2','6.5.6.3.2','6.5.6.4.2')
ORDER BY item_id, effective_date NULLS FIRST;

UPDATE inspection_item_revisions
SET attachments_text = CASE WHEN COALESCE(attachments_text,'') = '' THEN description ELSE attachments_text END,
    description = ''
WHERE equipment_type = '엘리베이터'
  AND item_id IN ('6.5.6.1.1','6.5.6.2','6.5.6.3.2','6.5.6.4.2')
  AND description LIKE '%종전기준 없음%';

-- 실행 후
SELECT id, item_id, introduction_type AS 구분, effective_date AS 시행, expiry_date AS 종료, length(description) AS 글자수, left(description,40) AS 내용, left(attachments_text,30) AS 검색칸
FROM inspection_item_revisions
WHERE equipment_type = '엘리베이터' AND item_id IN ('6.5.6.1.1','6.5.6.2','6.5.6.3.2','6.5.6.4.2')
ORDER BY item_id, effective_date NULLS FIRST;

COMMIT;
