-- 최근 5일 이내 등록/수정된 std_item_overrides만 삭제
-- ⚠️ 먼저 check_std_overrides_dates.sql 결과로 "최근 5일 이내" 건수와 날짜 분포가
--    실제로 새로 입력하려는 범위와 일치하는지 확인한 뒤 실행하세요. 되돌릴 수 없습니다.

-- 삭제 전 최종 확인: 몇 건이 지워질지 미리 확인
SELECT count(*) AS 삭제될_건수, title
FROM std_item_overrides
WHERE updated_at >= NOW() - INTERVAL '5 days'
GROUP BY title;

-- 실제 삭제 (위 SELECT 결과를 확인한 뒤 이 아래 줄의 주석을 지우고 실행하세요)
-- DELETE FROM std_item_overrides WHERE updated_at >= NOW() - INTERVAL '5 days';
