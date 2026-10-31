-- 9) 5.6.1-종전 2행을 5.6.1로 합치기 (조문 번호만 변경, 글자·날짜는 그대로)
CREATE TABLE IF NOT EXISTS inspection_item_revisions_bak_20261028 AS
SELECT * FROM inspection_item_revisions WHERE equipment_type = '엘리베이터' AND item_id IN ('5.6.1', '5.6.1-종전');
UPDATE inspection_item_revisions SET item_id = '5.6.1'
WHERE equipment_type = '엘리베이터' AND item_id = '5.6.1-종전';
SELECT id, item_id, effective_date, expiry_date FROM inspection_item_revisions
WHERE equipment_type = '엘리베이터' AND item_id LIKE '5.6.1%' ORDER BY effective_date DESC;
