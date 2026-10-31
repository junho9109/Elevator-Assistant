\pset pager off
\echo '== A) 기존 271건: 출처(source)별 건수 =='
SELECT COALESCE(NULLIF(TRIM(source),''),'(출처 없음)') AS 출처, count(*) AS 건수, min(id) AS 최소id, max(id) AS 최대id
FROM std_item_overrides WHERE origin IS NULL GROUP BY 1 ORDER BY min(id);

\echo '== B) 25년/26년/2025/2026 표시가 있는 기존 행 =='
SELECT id, left(title,45) AS 제목, left(COALESCE(source,''),30) AS 출처, left(COALESCE(ref,''),20) AS 조항, updated_at::date AS 수정일
FROM std_item_overrides
WHERE origin IS NULL AND (COALESCE(source,'') ~ '(25|26)년|202[56]' OR COALESCE(title,'') ~ '(25|26)년|202[56]' OR COALESCE(basis,'') ~ '(25|26)년 제|202[56]년 제' OR COALESCE(conclusion,'') ~ '(25|26)년 제|202[56]년 제')
ORDER BY id;

\echo '== C) 대통합에서 가장 늦은 회차(출처 상위) =='
SELECT COALESCE(NULLIF(TRIM(source),''),'(없음)') AS 출처, count(*) AS 건수
FROM std_item_overrides WHERE origin = '대통합' AND COALESCE(source,'') ~ '(25|26)년|202[56]' GROUP BY 1 ORDER BY 1;
