-- 오늘(한국시간) AI 질문 전체 — 읽기 전용 조회 (커밋하지 마세요)
-- created_at은 UTC로 저장돼 있으므로 UTC → 한국시간 순서로 변환한다.
\pset pager off
SELECT id,
       to_char(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul', 'HH24:MI') AS 시각,
       employee_name AS 질문자,
       left(regexp_replace(question, E'\n\n\\[(현장 용어|시점 참고).*$', '', 's'), 150) AS 질문
FROM ai_usage
WHERE (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')::date
    = (now() AT TIME ZONE 'Asia/Seoul')::date
ORDER BY id;
