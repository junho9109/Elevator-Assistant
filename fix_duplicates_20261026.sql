-- 엘리베이터 완전 중복 행 정리 (2026-10-26): 조항·유형·기간·본문(공백 제외)이 모두 같은 행은 가장 작은 id 하나만 남기고 삭제
-- 반영 전 백업: backup_dup_fix_20261026.csv (남길 행 7개 + 지울 행 8개)
-- 안전장치: 지울 행이 남길 행과 완전히 같고, 첨부(그림·표)가 없고, "확인 요청" 신고가 없을 때만 삭제. 건수가 다르면 전체 롤백.
\set ON_ERROR_STOP on
BEGIN;
CREATE TEMP TABLE _pair (keep_id int, del_id int) ON COMMIT DROP;
INSERT INTO _pair VALUES (5290,5301),(5654,5657),(5654,5686),(5703,5706),(5704,5707),(6018,6025),(6020,6027),(6021,6028);
SELECT count(*) AS flags FROM public.revision_flags WHERE revision_id IN (5301,5657,5686,5706,5707,6025,6027,6028) \gset
WITH d AS (
  DELETE FROM public.inspection_item_revisions x USING _pair p, public.inspection_item_revisions k
  WHERE x.id = p.del_id AND k.id = p.keep_id
    AND x.equipment_type='엘리베이터' AND k.equipment_type='엘리베이터'
    AND x.item_id = k.item_id AND x.introduction_type = k.introduction_type
    AND x.effective_date IS NOT DISTINCT FROM k.effective_date AND x.expiry_date IS NOT DISTINCT FROM k.expiry_date
    AND regexp_replace(COALESCE(x.description,''), '\s', '', 'g') = regexp_replace(COALESCE(k.description,''), '\s', '', 'g')
    AND x.attachments IS NULL
  RETURNING 1) SELECT count(*) AS deleted FROM d \gset
SELECT :flags AS flags, :deleted AS deleted;
\if `[ :flags -eq 0 ] && [ :deleted -eq 8 ] && echo 1 || echo 0`
  COMMIT;
  \echo '완료'
\else
  ROLLBACK;
  \echo '건수가 맞지 않아 취소했습니다(이미 정리되었거나 데이터가 달라졌습니다)'
\endif
