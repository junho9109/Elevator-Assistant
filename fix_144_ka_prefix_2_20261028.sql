-- 1.4.4-카 기호 ")" 누락 수정 2차 — 화면 본문은 관리자 수정 테이블(inspection_item_edits)이 가장 우선이므로 여기도 고친다.
BEGIN;

CREATE TABLE IF NOT EXISTS inspection_item_edits_bak_ka_20261028 AS
SELECT * FROM inspection_item_edits WHERE item_id = '1.4.4-카';

-- 실행 전 (기대: 1행, text가 '카 승강장문의…'로 시작)
SELECT id, item_id, left(text, 30) AS text_앞 FROM inspection_item_edits WHERE item_id = '1.4.4-카';

UPDATE inspection_item_edits
SET text = '카) ' || substr(text, length('카 ') + 1)
WHERE item_id = '1.4.4-카' AND text LIKE '카 승강장문의%';

-- 실행 후 (기대: '카) 승강장문의…')
SELECT id, item_id, left(text, 30) AS text_앞 FROM inspection_item_edits WHERE item_id = '1.4.4-카';

COMMIT;
