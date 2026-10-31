-- 연혁 데이터 불일치 정정 (2026-10-26) — 반영 전 반드시 백업(backup_revision_fix_20261026.csv)
-- 각 단계마다 대상 행 수를 확인하고, 하나라도 다르면 전체 롤백합니다.
\set ON_ERROR_STOP on
BEGIN;

-- [0] 안전 확인: 삭제할 행(5730, 5747~5752)에 "확인 요청" 신고가 붙어 있으면 중단(신고가 고아가 되지 않게)
SELECT count(*) AS flags FROM public.revision_flags WHERE revision_id IN (5730,5747,5748,5749,5750,5751,5752) \gset

-- [1] 엘리베이터 7.7.1 추락 위험 중복 행(5747~5752)을 정리: 열쇠구멍 그림 3은 7.8.1 행(7721, 7722)으로 옮긴 뒤 삭제
WITH m AS (
  UPDATE public.inspection_item_revisions t SET attachments=s.attachments, attachments_text=s.attachments_text
  FROM public.inspection_item_revisions s
  WHERE s.equipment_type='엘리베이터' AND t.equipment_type='엘리베이터'
    AND ((s.id=5748 AND t.id=7721) OR (s.id=5749 AND t.id=7722))
    AND s.item_id='7.7.1' AND t.item_id='7.8.1' AND s.attachments IS NOT NULL
  RETURNING 1) SELECT count(*) AS moved FROM m \gset
WITH d AS (DELETE FROM public.inspection_item_revisions WHERE equipment_type='엘리베이터' AND item_id='7.7.1' AND id IN (5747,5748,5749,5750,5751,5752) RETURNING 1) SELECT count(*) AS deleted_dup FROM d \gset

-- [2] 엘리베이터 7.7.1 승강장 조명: 2019 본문(5731)을 구 기준(2019-03-28~2025-03-01)으로, 본문 없는 5730 삭제, 5732에 2013 본문 채움
WITH u AS (UPDATE public.inspection_item_revisions SET introduction_type='old', effective_date='2019-03-28', expiry_date='2025-03-01'
  WHERE id=5731 AND equipment_type='엘리베이터' AND item_id='7.7.1' AND introduction_type='current' RETURNING 1) SELECT count(*) AS fixed_5731 FROM u \gset
WITH d AS (DELETE FROM public.inspection_item_revisions WHERE id=5730 AND equipment_type='엘리베이터' AND item_id='7.7.1' AND COALESCE(description,'')='' RETURNING 1) SELECT count(*) AS deleted_blank FROM d \gset
WITH u AS (UPDATE public.inspection_item_revisions SET description='7.6.1 승강장 조명 승강장에는 카 조명이 없더라도 이용자가 승강장문을 열고 엘리베이터에 탑승할 때 앞을 볼 수 있도록 50 lx 이상(바닥에서 측정)의 자연 또는 인공조명이 있어야 한다.', expiry_date='2019-03-27'
  WHERE id=5732 AND equipment_type='엘리베이터' AND item_id='7.7.1' AND COALESCE(description,'')='' RETURNING 1) SELECT count(*) AS filled_5732 FROM u \gset

-- [3] 엘리베이터 7.6.3 구 기준 종료일 정정 (현행 시작 2019-03-28과 겹침)
WITH u AS (UPDATE public.inspection_item_revisions SET expiry_date='2019-03-27'
  WHERE id=5727 AND equipment_type='엘리베이터' AND item_id='7.6.3' AND expiry_date='2022-03-01' RETURNING 1) SELECT count(*) AS fixed_763 FROM u \gset

-- [4] 본문 끝에 잘못 붙은 "<추가 종전 기준>-----" 구분선 제거 (엘리베이터 1행, 에스컬레이터 7행)
WITH u AS (UPDATE public.inspection_item_revisions SET description=regexp_replace(description, '\s*<추가 종전 기준>-{3,}\s*$', '')
  WHERE ((equipment_type='엘리베이터' AND id IN (6039)) OR (equipment_type='에스컬레이터' AND id IN (9740,9913,10058,10111,10195,10199,10235)))
  AND description ~ '<추가 종전 기준>-{3,}\s*$' RETURNING 1) SELECT count(*) AS stripped FROM u \gset

-- [5] 에스컬레이터 6.2 구 기준 6.2.7: 다음 장 제목이 본문에 섞여 들어간 것 제거 (실제 DB 본문은 줄바꿈으로 나뉘어 있어 공백/줄바꿈 모두 허용)
WITH u AS (UPDATE public.inspection_item_revisions SET description=regexp_replace(description, '\s*7\.\s*옥외용\s*에스컬레이터\s*및\s*무빙워\s*크\s*추가요건\s*|\s*7\.\s*옥외용\s*에스컬레이터\s*및\s*무빙워크\s*추가요건\s*', E'\n')
  WHERE id=10236 AND equipment_type='에스컬레이터' AND item_id='6.2' AND description ~ '7\.\s*옥외용\s*에스컬레이터\s*및\s*무빙워\s*크?\s*추가요건' RETURNING 1) SELECT count(*) AS fixed_62 FROM u \gset

SELECT :flags AS flags, :moved AS moved, :deleted_dup AS deleted_dup, :fixed_5731 AS fixed_5731, :deleted_blank AS deleted_blank, :filled_5732 AS filled_5732, :fixed_763 AS fixed_763, :stripped AS stripped, :fixed_62 AS fixed_62;
\if `[ :flags -eq 0 ] && [ :moved -eq 2 ] && [ :deleted_dup -eq 6 ] && [ :fixed_5731 -eq 1 ] && [ :deleted_blank -eq 1 ] && [ :filled_5732 -eq 1 ] && [ :fixed_763 -eq 1 ] && [ :stripped -eq 8 ] && [ :fixed_62 -eq 1 ] && echo 1 || echo 0`
  COMMIT;
  \echo '완료'
\else
  ROLLBACK;
  \echo '건수가 맞지 않아 취소했습니다(이미 반영되었거나 데이터가 달라졌습니다)'
\endif
