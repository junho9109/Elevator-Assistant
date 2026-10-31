-- 엘리베이터 11.4.5, 11.4.6 구 기준 종료일 정정 (2022-03-01 → 2019-03-27)
-- 안전장치: 행 id·조문·유형·기간이 예상과 같을 때만 수정하고, 건수가 2건이 아니면 전체 롤백합니다.
\set ON_ERROR_STOP on
BEGIN;
WITH u AS (
  UPDATE public.inspection_item_revisions SET expiry_date='2019-03-27'
  WHERE equipment_type='엘리베이터' AND introduction_type='old' AND effective_date='2013-09-15' AND expiry_date='2022-03-01'
    AND ((id=8271 AND item_id='11.4.5') OR (id=8273 AND item_id='11.4.6'))
  RETURNING 1) SELECT count(*) AS fixed FROM u \gset
SELECT :fixed AS fixed;
\if `[ :fixed -eq 2 ] && echo 1 || echo 0`
  COMMIT;
  \echo '완료'
\else
  ROLLBACK;
  \echo '건수가 맞지 않아 취소했습니다(이미 수정되었거나 데이터가 달라졌습니다)'
\endif
