-- 2026-07-13 이전(2026-06-30 ~ 2026-07-07)에 등록/수정된 std_item_overrides만 삭제
-- 2026-07-13 데이터(90건)와 최근 신규 입력분(2026-08-15~16, 22건)은 남긴다.
-- ⚠️ 되돌릴 수 없습니다. 아래 SELECT로 삭제될 건수/제목을 먼저 확인하세요.

-- 삭제 전 최종 확인
SELECT count(*) AS 삭제될_건수
FROM std_item_overrides
WHERE updated_at < '2026-07-13';

SELECT title, updated_at
FROM std_item_overrides
WHERE updated_at < '2026-07-13'
ORDER BY updated_at;

-- 실제 삭제 (위 SELECT 결과를 확인한 뒤 이 아래 줄의 주석을 지우고 실행하세요)
-- DELETE FROM std_item_overrides WHERE updated_at < '2026-07-13';
