SELECT id, item_id, introduction_type AS 구분, effective_date AS 시행, expiry_date AS 종료, length(description) AS 글자수, left(description,40) AS 내용, (attachments IS NOT NULL) AS 첨부
FROM inspection_item_revisions
WHERE equipment_type = '엘리베이터' AND item_id IN ('6.5.6.1.1','6.5.6.2','6.5.6.3.2','6.5.6.4.2')
ORDER BY item_id, effective_date NULLS FIRST;
