-- 6.5.7.2 표·그림 연결 바로잡기 (연혁집 PDF 54~58쪽 = 책 44~48쪽 확인)
--  * 현행(7445)            : 그림 5 + 기호 설명 추가 (이미지 파일은 코드와 함께 배포)
--  * 7447 (1992-07-01~2013-09-14 = "2013-09-15 전" 종전, 3.1.3(7)) : 표 1 두 개 유지 (PDF 56쪽과 동일)
--  * 7448 (1992-06-30 이전 = "1992-07-01 전" 종전)       : 앞서 붙인 표 1 제거 (PDF 해당 블록에는 표가 없고 "표 1에서"로만 인용)
--  * 7449 (1993-09-03 이후 추가 종전)                     : 앞서 붙인 표 7 제거 (PDF에서 표 7은 이 블록이 아님)
--  * 7450 (1993-09-03 전까지 추가 종전)                   : 표 7 연결 (PDF 57~58쪽)
BEGIN;
CREATE TABLE IF NOT EXISTS inspection_item_revisions_bak10_20261029 AS
SELECT * FROM inspection_item_revisions WHERE item_id='6.5.7.2' AND equipment_type='엘리베이터';

SELECT id, introduction_type AS 구분, effective_date AS 시행, expiry_date AS 종료, CASE WHEN attachments IS NULL THEN 0 ELSE jsonb_array_length(attachments) END AS 첨부수
FROM inspection_item_revisions WHERE item_id='6.5.7.2' AND equipment_type='엘리베이터' ORDER BY id;

UPDATE inspection_item_revisions SET attachments = $j$[{"kind": "figure", "notes": "", "table": null, "images": ["6.5.7.2_current_cur_f1_0.png"], "search": "그림 5 카 지붕에 고정된 부품과 승강로 천장에 고정된 가장 낮은 부품 사이의 최소 거리 기호 설명 A 유효 거리 ≥ 0.50 m[6.5.7.2가)] B 유효 거리 ≥ 0.50 m[6.5.7.2가)] C 유효 거리 ≥ 0.50 m[6.5.7.2다)2)] D 유효 거리 ≥ 0.30 m[6.5.7.2다)1)] E 유효 거리 ≤ 0.40 m[6.5.7.2다)1)] F 카 지붕에서 가장 높은 부분 G 카 H 피난공간 X 피난공간 높이(표 2)"}]$j$::jsonb,
  attachments_text = $s$그림 5 카 지붕에 고정된 부품과 승강로 천장에 고정된 가장 낮은 부품 사이의 최소 거리 기호 설명 A 유효 거리 ≥ 0.50 m[6.5.7.2가)] B 유효 거리 ≥ 0.50 m[6.5.7.2가)] C 유효 거리 ≥ 0.50 m[6.5.7.2다)2)] D 유효 거리 ≥ 0.30 m[6.5.7.2다)1)] E 유효 거리 ≤ 0.40 m[6.5.7.2다)1)] F 카 지붕에서 가장 높은 부분 G 카 H 피난공간 X 피난공간 높이(표 2)$s$
WHERE id = 7445 AND item_id='6.5.7.2' AND equipment_type='엘리베이터';

UPDATE inspection_item_revisions SET attachments = NULL, attachments_text = NULL
WHERE id IN (7448, 7449) AND item_id='6.5.7.2' AND equipment_type='엘리베이터';

UPDATE inspection_item_revisions SET attachments = $j$[{"kind": "table", "caption": "표 7 최소거리 (4.1.4(5)) 교류승강기, 직류승강기", "table": {"rows": [[{"c": 0, "r": 0, "t": "정격속도(m/min)", "cs": 2, "rs": 2}, {"c": 2, "r": 0, "t": "최 소 거 리(㎜)", "cs": 2, "rs": 1}, {"c": 4, "r": 0, "t": "최 대 거 리(㎜)", "cs": 2, "rs": 1}], [{"c": 2, "r": 1, "t": "교류1단속도\n제어방식\n또는\n저항제어방식", "cs": 1, "rs": 1}, {"c": 3, "r": 1, "t": "그외의\n제어방식", "cs": 1, "rs": 1}, {"c": 4, "r": 1, "t": "카 측", "cs": 1, "rs": 1}, {"c": 5, "r": 1, "t": "균형추측", "cs": 1, "rs": 1}], [{"c": 0, "r": 2, "t": "스프링\n완충기", "cs": 1, "rs": 4}, {"c": 1, "r": 2, "t": "7.5 이하", "cs": 1, "rs": 1}, {"c": 2, "r": 2, "t": "75", "cs": 1, "rs": 1}, {"c": 3, "r": 2, "t": "150", "cs": 1, "rs": 4}, {"c": 4, "r": 2, "t": "600", "cs": 1, "rs": 5}, {"c": 5, "r": 2, "t": "900", "cs": 1, "rs": 5}], [{"c": 1, "r": 3, "t": "7.5 초과 15 이하", "cs": 1, "rs": 1}, {"c": 2, "r": 3, "t": "150", "cs": 1, "rs": 1}], [{"c": 1, "r": 4, "t": "15 초과 30 이하", "cs": 1, "rs": 1}, {"c": 2, "r": 4, "t": "225", "cs": 1, "rs": 1}], [{"c": 1, "r": 5, "t": "30 초과", "cs": 1, "rs": 1}, {"c": 2, "r": 5, "t": "300", "cs": 1, "rs": 1}], [{"c": 0, "r": 6, "t": "유입완충기", "cs": 2, "rs": 1}, {"c": 2, "r": 6, "t": "규정하지 않음", "cs": 2, "rs": 1}]], "ncols": 6}, "images": [], "search": "표 7 최소거리 (4.1.4(5)) 교류승강기, 직류승강기 정격속도(m/min) 최 소 거 리(㎜) 최 대 거 리(㎜) 교류1단속도 제어방식 또는 저항제어방식 그외의 제어방식 카 측 균형추측 스프링 완충기 7.5 이하 75 150 600 900 7.5 초과 15 이하 150 15 초과 30 이하 225 30 초과 300 유입완충기 규정하지 않음"}]$j$::jsonb,
  attachments_text = $s$표 7 최소거리 (4.1.4(5)) 교류승강기, 직류승강기 정격속도(m/min) 최 소 거 리(㎜) 최 대 거 리(㎜) 교류1단속도 제어방식 또는 저항제어방식 그외의 제어방식 카 측 균형추측 스프링 완충기 7.5 이하 75 150 600 900 7.5 초과 15 이하 150 15 초과 30 이하 225 30 초과 300 유입완충기 규정하지 않음$s$
WHERE id = 7450 AND item_id='6.5.7.2' AND equipment_type='엘리베이터';

SELECT id, introduction_type AS 구분, effective_date AS 시행, expiry_date AS 종료, CASE WHEN attachments IS NULL THEN 0 ELSE jsonb_array_length(attachments) END AS 첨부수
FROM inspection_item_revisions WHERE item_id='6.5.7.2' AND equipment_type='엘리베이터' ORDER BY id;
COMMIT;
