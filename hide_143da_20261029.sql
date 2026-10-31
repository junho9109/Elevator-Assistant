-- 1.4.3-다 항목 자체 연혁 중 틈새와 무관한 2건(id 349, 350)을 화면에서만 숨김.
-- 본문은 검색용 칸(attachments_text)으로 옮겨 보관(검색·AI·DB 조회는 유지). 삭제 없음.
BEGIN;

CREATE TABLE IF NOT EXISTS inspection_item_revisions_bak7_20261029 AS
SELECT * FROM inspection_item_revisions WHERE id IN (349, 350);

-- 실행 전
SELECT id, item_id, introduction_type, effective_date, expiry_date, length(description) AS 글자수, left(description, 30) AS 내용, left(attachments_text, 30) AS 검색칸
FROM inspection_item_revisions WHERE id IN (349, 350) ORDER BY id;

UPDATE inspection_item_revisions
SET attachments_text = CASE WHEN COALESCE(attachments_text, '') = '' THEN description ELSE attachments_text END,
    description = ''
WHERE id IN (349, 350) AND item_id = '1.4.3-다' AND description <> '';

-- 실행 후
SELECT id, item_id, introduction_type, effective_date, expiry_date, length(description) AS 글자수, left(attachments_text, 30) AS 검색칸
FROM inspection_item_revisions WHERE id IN (349, 350) ORDER BY id;

COMMIT;
