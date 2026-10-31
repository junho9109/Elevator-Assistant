-- 연도 없이 "(제1차)", "(제10차)"만 표시된 대통합 항목 43건의 출처를 원본 머리글 이름으로 바꿈.
--   (제1차)  27건 (대통합 PDF 203~212쪽) → (제1차 기술서류 업무 표준화)
--   (제10차) 16건 (대통합 PDF 116~121쪽) → (제10차 신뢰도 제고를 위한 검사업무 표준화_기술자문 간담회(4차))
-- 연도는 원본에 없어 추측하지 않는다. 쪽 범위·건수가 다르면 롤백.
\set ON_ERROR_STOP on
BEGIN;

CREATE TABLE IF NOT EXISTS std_item_overrides_srcfix_bak_20261029 AS
SELECT * FROM std_item_overrides WHERE origin = '대통합' AND source IN ('(제1차)','(제10차)');

\echo '--- 실행 전 ---'
SELECT source AS 출처, count(*) AS 건수, min(pdf_page) AS 최소쪽, max(pdf_page) AS 최대쪽
FROM std_item_overrides WHERE origin = '대통합' AND source IN ('(제1차)','(제10차)') GROUP BY source ORDER BY 1;

DO $chk$
DECLARE a int; b int; ca int; cb int;
BEGIN
  SELECT count(*) INTO a FROM std_item_overrides WHERE origin='대통합' AND source='(제1차)';
  SELECT count(*) INTO b FROM std_item_overrides WHERE origin='대통합' AND source='(제10차)';
  SELECT count(*) INTO ca FROM std_item_overrides WHERE origin='대통합' AND source='(제1차)' AND pdf_page BETWEEN 203 AND 212;
  SELECT count(*) INTO cb FROM std_item_overrides WHERE origin='대통합' AND source='(제10차)' AND pdf_page BETWEEN 116 AND 121;
  IF a <> 27 OR ca <> 27 THEN RAISE EXCEPTION '검사1 실패: (제1차) % 건 / 203~212쪽 % 건 (각 27건이어야 함)', a, ca; END IF;
  IF b <> 16 OR cb <> 16 THEN RAISE EXCEPTION '검사2 실패: (제10차) % 건 / 116~121쪽 % 건 (각 16건이어야 함)', b, cb; END IF;
  RAISE NOTICE '검사 통과: (제1차) 27건, (제10차) 16건';
END
$chk$;

UPDATE std_item_overrides SET source = '(제1차 기술서류 업무 표준화)'
WHERE origin = '대통합' AND source = '(제1차)' AND pdf_page BETWEEN 203 AND 212;
UPDATE std_item_overrides SET source = '(제10차 신뢰도 제고를 위한 검사업무 표준화_기술자문 간담회(4차))'
WHERE origin = '대통합' AND source = '(제10차)' AND pdf_page BETWEEN 116 AND 121;

\echo '--- 실행 후 ---'
SELECT source AS 출처, count(*) AS 건수 FROM std_item_overrides
WHERE origin = '대통합' AND (source LIKE '(제1차%' OR source LIKE '(제10차%') GROUP BY source ORDER BY 1;
SELECT count(*) AS 대통합_전체_건수 FROM std_item_overrides WHERE origin = '대통합';

COMMIT;
