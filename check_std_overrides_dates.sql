-- 확인용: std_item_overrides가 언제 등록/수정됐는지 날짜별로 집계
-- 최근 5일에 몰려있는 건수와, 그 이전(예전 일괄 등록분)이 얼마나 오래됐는지 확인용
SELECT
  DATE(updated_at) AS 등록수정일,
  count(*) AS 건수,
  (DATE(updated_at) >= CURRENT_DATE - INTERVAL '5 days') AS 최근5일이내
FROM std_item_overrides
GROUP BY DATE(updated_at)
ORDER BY 등록수정일 DESC;

-- 요약: 최근 5일 이내 vs 그 이전
SELECT
  (updated_at >= NOW() - INTERVAL '5 days') AS 최근5일이내,
  count(*) AS 건수,
  MIN(updated_at) AS 가장_오래된_시각,
  MAX(updated_at) AS 가장_최근_시각
FROM std_item_overrides
GROUP BY (updated_at >= NOW() - INTERVAL '5 days');
