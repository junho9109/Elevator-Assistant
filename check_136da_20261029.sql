\echo '== 1) 1.3.6 관련 행 =='
SELECT id, item_id, equipment_type, introduction_type, effective_date, expiry_date, length(description) AS 글자수, left(description,40) AS 내용
FROM inspection_item_revisions
WHERE item_id LIKE '%1.3.6%'
ORDER BY item_id, effective_date NULLS FIRST;

\echo '== 2) 7.6.2.2.1 자) 행 중 문닫힘안전장치/4.1.5 포함 =='
SELECT id, item_id, effective_date, left(description,50) AS 내용
FROM inspection_item_revisions
WHERE item_id LIKE '7.6.2.2.1 자)%' AND (description LIKE '%문닫힘안전장치%' OR description LIKE '%4.1.5%');

\echo '== 3) 가이드 항목 id =='
SELECT * FROM inspection_base_items WHERE item_id LIKE '1.3.6%' LIMIT 5;

\echo '== 4) 7.6.2.2.1 자) 전체 행 =='
SELECT id, item_id, equipment_type, introduction_type, effective_date, expiry_date, length(description) AS 글자수
FROM inspection_item_revisions WHERE item_id LIKE '7.6.2.2.1 자)%' ORDER BY effective_date NULLS FIRST;
