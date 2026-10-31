-- 새로 넣은 부속서 Ⅲ·Ⅴ 행의 본문에서 "[그림 …]" 캡션 줄을 뺍니다.
-- (기존 그림 행처럼 그림 캡션은 첨부(attachments)에만 두어, AI가 캡션을 글로 옮겨 적지 않고 첨부 표시로 그림을 보여 주게 함)
\set ON_ERROR_STOP on
BEGIN;

UPDATE inspection_item_revisions
SET description = btrim(regexp_replace(description, E'(^|\\n)\\[ ?그림[^\\n]*', '', 'g'), E'\n ')
WHERE id IN (10320, 10321, 10322, 10323)
  AND equipment_type = '에스컬레이터'
  AND item_id IN ('부속서 Ⅲ', '부속서 Ⅴ')
  AND description ~ E'(^|\\n)\\[ ?그림';

COMMIT;
SELECT id, item_id, introduction_type, effective_date, description FROM inspection_item_revisions WHERE id IN (10320, 10321, 10322, 10323) ORDER BY id;
