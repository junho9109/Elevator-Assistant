-- 중복 데이터 정리
-- current: item_id별 id가 가장 작은 1개만 유지
DELETE FROM inspection_item_revisions
WHERE id NOT IN (
  SELECT MIN(id) FROM inspection_item_revisions
  WHERE (item_id LIKE '6.%' OR item_id LIKE '7.%' OR item_id LIKE '8.%')
    AND introduction_type = 'current'
  GROUP BY item_id
)
AND (item_id LIKE '6.%' OR item_id LIKE '7.%' OR item_id LIKE '8.%')
AND introduction_type = 'current';

-- old: item_id별 effective_date 기준 최대 5개만 유지 (가장 최근 5개)
DELETE FROM inspection_item_revisions
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY item_id ORDER BY effective_date DESC NULLS LAST) as rn
    FROM inspection_item_revisions
    WHERE (item_id LIKE '6.%' OR item_id LIKE '7.%' OR item_id LIKE '8.%')
      AND introduction_type = 'old'
  ) ranked
  WHERE rn > 5
);
