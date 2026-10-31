\pset pager off
SELECT id, introduction_type AS 구분, effective_date AS 시행, expiry_date AS 종료, description
FROM inspection_item_revisions
WHERE equipment_type = '엘리베이터' AND item_id = '6.5.7.2' AND id IN (7447, 7448, 7449, 7450)
ORDER BY id;
