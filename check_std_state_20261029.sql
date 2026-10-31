\pset pager off
\echo '== 1) 구분(origin)별 건수 / 수동수정 / 수정일 범위 =='
SELECT COALESCE(origin,'(없음=기존)') AS 구분, count(*) AS 건수,
       count(*) FILTER (WHERE manually_edited) AS 수동수정,
       min(updated_at)::date AS 가장오래, max(updated_at)::date AS 가장최근,
       min(id) AS 최소id, max(id) AS 최대id
FROM std_item_overrides GROUP BY origin ORDER BY 1;

\echo '== 2) 남긴 쪽 13건(대통합) 등록 여부: pdf_page 기준 =='
SELECT p.pg AS 쪽, count(s.id) AS 대통합_등록건수
FROM (VALUES (527),(546),(551),(558),(580),(600),(619),(620),(621),(622),(623),(648),(649)) AS p(pg)
LEFT JOIN std_item_overrides s ON s.pdf_page = p.pg AND s.origin = '대통합'
GROUP BY p.pg ORDER BY p.pg;

\echo '== 3) 같은 제목이 기존/대통합 양쪽에 있는 경우(삭제 시 주의) =='
SELECT count(*) AS 제목중복건수
FROM std_item_overrides o JOIN std_item_overrides n ON n.title = o.title
WHERE o.origin IS NULL AND n.origin = '대통합';

\echo '== 4) 기존(origin 없음) 행의 사진 연결 건수 / 새 항목으로 복사되지 않은 사진 =='
SELECT count(DISTINCT o.title) AS 사진있는_기존항목,
       count(DISTINCT o.title) FILTER (WHERE NOT EXISTS (
          SELECT 1 FROM std_item_photos x JOIN std_item_overrides n ON n.title = x.item_key AND n.origin = '대통합'
          WHERE x.image_data = p.image_data)) AS 새항목에_없는_사진항목
FROM std_item_overrides o JOIN std_item_photos p ON p.item_key = o.title
WHERE o.origin IS NULL;

\echo '== 5) 기존 행 중 최근(2026-08-15 이후) 입력/수정분 =='
SELECT id, left(title,50) AS 제목, updated_at::date AS 수정일, manually_edited AS 수동
FROM std_item_overrides WHERE origin IS NULL AND updated_at >= '2026-08-15' ORDER BY updated_at DESC LIMIT 40;
