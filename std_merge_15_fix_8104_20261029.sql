-- 8.10.4 연혁 보완 (1.4.2-다 카 지붕 비상등): 연혁집 원문의 종전 기준 문장을 채운다. 문장은 원문 그대로.
--  - id 6063 (2013-09-15 이후): 본문을 8.17.4 · 14.2.3.2 원문으로 채우고, 기존 안내 문구 "8.17.4, 14.2.3.2 시행"은
--    화면에 나오지 않는 검색용 칸(attachments_text)으로 옮겨 보관한다(앱 검색·AI 검색·DB 조회에서 계속 검색됨).
--  - 새 행 (2013-09-15 이전): 3.1.6(13), 4.1.2(11) 원문 추가.
-- 8.17.4의 기존 연혁은 변경하지 않는다. 롤백은 맨 아래 참고.
BEGIN;

CREATE TABLE IF NOT EXISTS inspection_item_revisions_bak5_20261028 AS
SELECT * FROM inspection_item_revisions WHERE id = 6063 AND equipment_type = '엘리베이터';

-- 실행 전 (기대: 6063, 8.10.4, old, 2013-09-15~2022-03-01, 내용 '8.17.4, 14.2.3.2 시행')
SELECT id, item_id, introduction_type, effective_date, expiry_date, description, attachments_text
FROM inspection_item_revisions WHERE id = 6063;

UPDATE inspection_item_revisions
SET description = $q$8.17.4 정상 조명전원이 차단될 경우에는 2 lx 이상의 조도로 1시간 동안 전원이 공급될 수 있는 자동 재충전 예비전원공급
장치가 있어야 하며, 이 조명은 정상 조명전원이 차단되면 자동으로 즉시 점등되어야 한다. 측정은 다음과 같은 곳에서
이루어져야 한다.
 가) 호출버튼 및 비상통화장치 표시
 나) 램프중심부로부터 2m 떨어진 수직면상
14.2.3.2 이 장치는 8.17.4에서 요구된 비상 조명 전원공급 장치 또는 동등한 전원공급 장치로부터 전원이 공급되어야 한다.
 비고 일반전화 네트워크에 연결된 경우에는 14.2.3.2가 적용되지 않는다.$q$,
    attachments_text = '8.17.4, 14.2.3.2 시행'
WHERE id = 6063 AND item_id = '8.10.4' AND equipment_type = '엘리베이터'
  AND TRIM(description) = '8.17.4, 14.2.3.2 시행';

INSERT INTO inspection_item_revisions (item_id, equipment_type, effective_date, expiry_date, introduction_type, description)
SELECT '8.10.4', '엘리베이터', NULL, '2013-09-14', 'old', $q$3.1.6(13) 정전시에 램프중심부로부터 2m 떨어진 수직면상에서 측정하여 1Lux 이상의 조도를 확보할 수 있는 예비조명장치.
다만, 자동차용 엘리베이터와 카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 아니하다.
4.1.2(11) 정전시에 램프중심부로부터 2m 떨어진 수직면상의 조도를 1Lux 이상으로 비출 수 있는 예비조명장치의 작동상태는
양호하여야 한다. 다만, 자동차용 엘리베이터와 카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 아니하다.$q$
WHERE NOT EXISTS (
  SELECT 1 FROM inspection_item_revisions
  WHERE item_id = '8.10.4' AND equipment_type = '엘리베이터' AND introduction_type = 'old' AND expiry_date = '2013-09-14'
);

-- 실행 후 (기대: 8.10.4에 3행 — 현행 / 2013-09-15 이후(본문 채워짐, 검색칸에 안내 문구) / 2013-09-14 이전)
SELECT id, item_id, introduction_type, effective_date, expiry_date, left(description, 40) AS 내용, attachments_text AS 검색칸
FROM inspection_item_revisions WHERE item_id = '8.10.4' AND equipment_type = '엘리베이터' ORDER BY effective_date NULLS FIRST;

COMMIT;

-- 롤백(필요 시에만):
-- UPDATE inspection_item_revisions r SET description = b.description, attachments_text = b.attachments_text FROM inspection_item_revisions_bak5_20261028 b WHERE r.id = b.id;
-- DELETE FROM inspection_item_revisions WHERE item_id = '8.10.4' AND equipment_type = '엘리베이터' AND introduction_type = 'old' AND expiry_date = '2013-09-14';
