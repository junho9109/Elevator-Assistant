-- 1.4.4-카 항목의 기호 ")" 누락 수정 — 검사가이드 본문은 DB(inspection_base_items)가 정적 파일보다 우선하므로 DB도 고친다.
BEGIN;

CREATE TABLE IF NOT EXISTS inspection_base_items_bak_ka_20261028 AS
SELECT * FROM inspection_base_items WHERE item_id = '1.4.4-카';

-- 실행 전 (기대: 1행, text가 '카 승강장문의…'로 시작)
SELECT id, item_id, standard_equipment_type, left(text, 30) AS text_앞, left(section_title, 30) AS title_앞
FROM inspection_base_items WHERE item_id = '1.4.4-카';

UPDATE inspection_base_items
SET text = '카) ' || substr(text, length('카 ') + 1),
    section_title = CASE WHEN section_title LIKE '카 승강장문의%' THEN '카) ' || substr(section_title, length('카 ') + 1) ELSE section_title END,
    updated_at = NOW()
WHERE item_id = '1.4.4-카' AND text LIKE '카 승강장문의%';

-- 실행 후 (기대: '카) 승강장문의…')
SELECT id, item_id, standard_equipment_type, left(text, 30) AS text_앞, left(section_title, 30) AS title_앞
FROM inspection_base_items WHERE item_id = '1.4.4-카';

-- 참고(조회만): 항목 기호가 빠진 나머지 항목이 더 있는지 (나)~하) 항목인데 본문이 기호로 시작하지 않는 경우)
SELECT item_id, left(text, 40) AS 본문
FROM inspection_base_items
WHERE standard_equipment_type = '엘리베이터' AND item_id ~ '-[나-힣]$' AND text !~ '^[가-힣]\)'
ORDER BY sort_order;

COMMIT;
