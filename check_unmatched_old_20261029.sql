\pset pager off
SELECT id, left(title,50) AS 제목, '[' || COALESCE(source,'NULL') || ']' AS 출처, length(source) AS 길이, updated_at::date AS 수정일
FROM std_item_overrides
WHERE origin IS NULL AND id <= 834
  AND NOT (COALESCE(source,'') ~ '^\((1[6-9]|2[0-4])년' AND NOT (COALESCE(source,'') ~ '(25|26)년'));
