-- 기존 표준화(수동 입력 271건) 중 대통합(25년 제3차까지)에 포함되는 16~24년 267건 삭제.
-- 남김: id 835~838 (2026년 자료 + 회차 미표시/24년 제4차 추가 → 대통합 포함 여부 불명이라 보존)
-- 안전장치: 백업 → 대상 지정 → 검사 7회(하나라도 어긋나면 전체 롤백) → 삭제 → 사후 검사 3회
\set ON_ERROR_STOP on
BEGIN;

-- [1] 백업 (기존 271건 전체 + 그 제목의 사진). 삭제 전에 반드시 만들어 둔다.
CREATE TABLE IF NOT EXISTS std_item_overrides_old_bak_20261029 AS
SELECT * FROM std_item_overrides WHERE origin IS NULL;
CREATE TABLE IF NOT EXISTS std_item_photos_old_bak_20261029 AS
SELECT p.* FROM std_item_photos p WHERE p.item_key IN (SELECT title FROM std_item_overrides WHERE origin IS NULL);

-- [2] 삭제 대상 지정: 대통합이 아니고(origin 없음), id 834 이하, 출처가 16~24년 회차로 시작하고 25/26년 표시가 없는 것
CREATE TEMP TABLE del_target AS
SELECT id, title FROM std_item_overrides
WHERE origin IS NULL
  AND id <= 834
  AND source ~ '^\s*\((1[6-9]|2[0-4])년'
  AND source !~ '(25|26)년';

\echo '--- 삭제 전 현황 ---'
SELECT COALESCE(origin,'(기존)') AS 구분, count(*) AS 건수 FROM std_item_overrides GROUP BY origin ORDER BY 1;
SELECT count(*) AS 삭제대상건수, min(id) AS 최소id, max(id) AS 최대id FROM del_target;

-- [3] 검사 (7회). 하나라도 어긋나면 예외 → 전체 롤백(아무것도 삭제되지 않음)
DO $chk$
DECLARE
  n_target int; n_bak int; n_new int; n_min_new int;
  c1 int; c2 int; c3 int; c4 int; c5 int; c6 int; c7 int;
BEGIN
  SELECT count(*) INTO n_target FROM del_target;
  SELECT count(*) INTO n_bak FROM std_item_overrides_old_bak_20261029;
  SELECT count(*), min(id) INTO n_new, n_min_new FROM std_item_overrides WHERE origin = '대통합';

  -- 검사1: 대상 건수가 예상(267)과 같은가
  IF n_target <> 267 THEN RAISE EXCEPTION '검사1 실패: 삭제대상 % 건 (예상 267)', n_target; END IF;
  -- 검사2: 백업이 기존 전체 건수와 같은가
  IF n_bak < 271 THEN RAISE EXCEPTION '검사2 실패: 백업 % 건 (기존 271건 이상이어야 함)', n_bak; END IF;
  -- 검사3: 대상 중 origin이 대통합인 행(id 기준)이 0건인가
  SELECT count(*) INTO c3 FROM std_item_overrides s JOIN del_target d ON d.id = s.id WHERE s.origin IS NOT NULL;
  IF c3 <> 0 THEN RAISE EXCEPTION '검사3 실패: 대상에 origin 있는 행 % 건', c3; END IF;
  -- 검사4: 대상의 최대 id가 대통합 최소 id보다 작은가(id 범위가 겹치지 않는가)
  SELECT count(*) INTO c4 FROM del_target WHERE id >= n_min_new;
  IF c4 <> 0 THEN RAISE EXCEPTION '검사4 실패: 대통합 id 범위(%) 이상인 대상 % 건', n_min_new, c4; END IF;
  -- 검사5: 대상 제목이 대통합 제목과 같은 것이 0건인가
  SELECT count(*) INTO c5 FROM del_target d JOIN std_item_overrides n ON n.title = d.title AND n.origin = '대통합';
  IF c5 <> 0 THEN RAISE EXCEPTION '검사5 실패: 대통합과 제목이 같은 대상 % 건', c5; END IF;
  -- 검사6: 대상에 25/26년 출처, 대통합 전용 칸(pdf_page, seq)이 있는 행이 0건인가
  SELECT count(*) INTO c6 FROM std_item_overrides s JOIN del_target d ON d.id = s.id
   WHERE s.pdf_page IS NOT NULL OR s.seq IS NOT NULL OR COALESCE(s.source,'') ~ '(25|26)년' OR s.id >= 835;
  IF c6 <> 0 THEN RAISE EXCEPTION '검사6 실패: 보존 대상(25/26년·835번 이상·대통합 칸 보유)이 삭제대상에 % 건', c6; END IF;
  -- 검사7: 보존 예정 4건(835~838)이 대상에 없고 지금 존재하는가
  SELECT count(*) INTO c7 FROM std_item_overrides WHERE id BETWEEN 835 AND 838 AND origin IS NULL;
  SELECT count(*) INTO c1 FROM del_target WHERE id BETWEEN 835 AND 838;
  IF c1 <> 0 OR c7 <> 4 THEN RAISE EXCEPTION '검사7 실패: 835~838 대상포함 % 건 / 존재 % 건', c1, c7; END IF;
  -- 대통합 건수 기록(삭제 후 비교용)
  CREATE TEMP TABLE chk_before AS SELECT n_new AS new_cnt;
  RAISE NOTICE '검사 7회 통과: 삭제대상 % 건, 대통합 % 건 보존 확인', n_target, n_new;
END
$chk$;

-- [4] 삭제
DELETE FROM std_item_overrides s USING del_target d
WHERE s.id = d.id AND s.origin IS NULL;

-- [5] 사후 검사 (3회) — 어긋나면 롤백
DO $post$
DECLARE n_new int; n_old int; n_keep int; n_before int;
BEGIN
  SELECT new_cnt INTO n_before FROM chk_before;
  SELECT count(*) INTO n_new FROM std_item_overrides WHERE origin = '대통합';
  SELECT count(*) INTO n_old FROM std_item_overrides WHERE origin IS NULL;
  SELECT count(*) INTO n_keep FROM std_item_overrides WHERE origin IS NULL AND id BETWEEN 835 AND 838;
  IF n_new <> n_before THEN RAISE EXCEPTION '사후1 실패: 대통합 % → % 건으로 변함', n_before, n_new; END IF;
  IF n_old <> 4 OR n_keep <> 4 THEN RAISE EXCEPTION '사후2 실패: 남은 기존 % 건 / 보존 % 건 (각 4건이어야 함)', n_old, n_keep; END IF;
  IF (SELECT count(*) FROM std_item_overrides_old_bak_20261029) < 271 THEN RAISE EXCEPTION '사후3 실패: 백업 테이블 건수 이상'; END IF;
  RAISE NOTICE '사후 검사 3회 통과';
END
$post$;

\echo '--- 삭제 후 현황 ---'
SELECT COALESCE(origin,'(기존)') AS 구분, count(*) AS 건수 FROM std_item_overrides GROUP BY origin ORDER BY 1;
SELECT id, left(title,40) AS 제목, left(source,30) AS 출처 FROM std_item_overrides WHERE origin IS NULL ORDER BY id;

COMMIT;
