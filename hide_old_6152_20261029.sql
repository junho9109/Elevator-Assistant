-- 6.1.5.2 종전(구 15.4.4 풀리실 정지장치 "정지" 표기)을 화면에서만 숨김.
-- 대상 항목: [1.2.2.1] 사) 콘센트(6.1.5.2나)) · 바) 조명(6.1.5.2가)) — 둘 다 다) 정지장치와 무관.
-- 본문은 검색용 칸(attachments_text)으로 옮겨 보관(검색·AI·DB 조회 유지). 삭제 없음. 여러 번 실행해도 결과 동일.
BEGIN;

CREATE TABLE IF NOT EXISTS inspection_item_revisions_bak11_20261029 AS
SELECT * FROM inspection_item_revisions WHERE item_id = '6.1.5.2' AND equipment_type = '엘리베이터';

-- 실행 전
SELECT id, introduction_type AS 구분, effective_date AS 시행, expiry_date AS 종료, length(description) AS 글자수, left(description,40) AS 내용, left(attachments_text,20) AS 검색칸
FROM inspection_item_revisions WHERE item_id = '6.1.5.2' AND equipment_type = '엘리베이터' ORDER BY id;

UPDATE inspection_item_revisions
SET attachments_text = CASE WHEN COALESCE(attachments_text,'') = '' THEN description ELSE attachments_text END,
    description = ''
WHERE item_id = '6.1.5.2' AND equipment_type = '엘리베이터'
  AND introduction_type = 'old' AND description LIKE '%15.4.4%';

-- 실행 후
SELECT id, introduction_type AS 구분, effective_date AS 시행, expiry_date AS 종료, length(description) AS 글자수, left(description,40) AS 내용, left(attachments_text,20) AS 검색칸
FROM inspection_item_revisions WHERE item_id = '6.1.5.2' AND equipment_type = '엘리베이터' ORDER BY id;

COMMIT;
