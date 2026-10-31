-- 판정지침 PDF(2016.12.23) 기준 수정 3건 — 조건이 맞는 행만 바뀌도록 가드를 걸었습니다.
-- 각 UPDATE는 1행이어야 합니다. 아니면 ROLLBACK 하세요.
\set ON_ERROR_STOP on
BEGIN;

-- 1) 덤웨이터 10.5.2.1: "상부 또는 하부" -> "상부" (PDF p.19)
UPDATE insp_std_overrides SET text = jsonb_set(text::jsonb, '{rows,30,content}',
  to_jsonb(E'• 상부 파이널 리미트 스위치 미작동(기능 상실)\n- 리미트 스위치 모두 작동 안 될 경우'::text))::text
WHERE item_key = '판정지침_별표2_덤웨이터'
  AND (text::jsonb #>> '{rows,30,ref}') = '10.5.2.1'
  AND (text::jsonb #>> '{rows,30,content}') LIKE '%상부 또는 하부%';

-- 2) 전기식 문닫힘안전장치 수평 개폐식(7.5.2.1.1.3): "카 및 승강장…"만 (PDF p.9~10)
UPDATE insp_std_overrides SET text = jsonb_set(text::jsonb, '{rows,14,content}',
  to_jsonb(E'• 문닫힘안전장치 미작동(기능 상실)\n- 카 및 승강장에 모두 설치된 경우 모두 미작동 시'::text))::text
WHERE item_key = '판정지침_별표2_전기식'
  AND (text::jsonb #>> '{rows,14,ref}') = '7.5.2.1.1.3, 8.7.2.1.1.3'
  AND (text::jsonb #>> '{rows,14,content}') LIKE '%카 문 양쪽%';

-- 3) 전기식 문닫힘안전장치 수직 개폐식(7.5.2.2): "카 문 양쪽…"만 (PDF p.6)
UPDATE insp_std_overrides SET text = jsonb_set(text::jsonb, '{rows,15,content}',
  to_jsonb(E'• 문닫힘안전장치 미작동(기능 상실)\n- 카 문 양쪽 모두 설치된 경우 모두 미작동 시'::text))::text
WHERE item_key = '판정지침_별표2_전기식'
  AND (text::jsonb #>> '{rows,15,ref}') = '7.5.2.2, 8.7.2.2'
  AND (text::jsonb #>> '{rows,15,content}') LIKE '%카 및 승강장%';

COMMIT;
SELECT item_key, text::jsonb #>> '{rows,30,content}' AS 덤웨이터_10_5_2_1 FROM insp_std_overrides WHERE item_key='판정지침_별표2_덤웨이터';
SELECT item_key, text::jsonb #>> '{rows,14,content}' AS 수평, text::jsonb #>> '{rows,15,content}' AS 수직 FROM insp_std_overrides WHERE item_key='판정지침_별표2_전기식';
