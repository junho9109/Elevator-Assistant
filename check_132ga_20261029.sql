SELECT id, item_id, introduction_type AS 구분, effective_date AS 시행, expiry_date AS 종료,
       length(description) AS 글자수, left(description,40) AS 내용,
       CASE WHEN attachments IS NULL THEN '-' ELSE jsonb_array_length(attachments)::text END AS 첨부수,
       left(attachments::text,60) AS 첨부요약
FROM inspection_item_revisions
WHERE equipment_type = '엘리베이터' AND item_id IN ('6.5.7.1','6.5.7.2')
ORDER BY item_id, effective_date NULLS FIRST;
