-- 고시 제98-75호와 날짜·본문이 일치하는 연혁 2건의 출처 채우기 (백업 후 실행, 다른 칸은 건드리지 않음)
UPDATE inspection_item_revisions SET source = '고시 제98-75호 부칙'
WHERE equipment_type = '엘리베이터' AND (
  (item_id = '13.2.2.2.7' AND effective_date = '1995-06-07') OR
  (item_id = '7.6.2.2.1'  AND effective_date = '1995-06-07')
);
SELECT item_id, effective_date, source FROM inspection_item_revisions WHERE source IS NOT NULL;
