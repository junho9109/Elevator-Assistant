-- 8.10.4 연혁 보완 2차(보정판): 1차 SQL의 조건(내용이 안내 한 줄일 때만 수정)을 빼고,
-- 8.10.4의 "2013-09-15 이후" 행이 어떤 상태이든(내용이 달라졌거나 행이 없어도) 원문으로 맞춘다. 여러 번 실행해도 결과는 같다.
BEGIN;

CREATE TABLE IF NOT EXISTS inspection_item_revisions_bak6_20261029 AS
SELECT * FROM inspection_item_revisions WHERE item_id = '8.10.4' AND equipment_type = '엘리베이터';

-- 실행 전: 8.10.4의 모든 행
SELECT id, introduction_type, effective_date, expiry_date, length(description) AS 글자수, left(description, 30) AS 내용, left(attachments_text, 30) AS 검색칸
FROM inspection_item_revisions WHERE item_id = '8.10.4' AND equipment_type = '엘리베이터' ORDER BY effective_date NULLS FIRST, id;

-- 2013-09-15 이후 행: 있으면 수정
UPDATE inspection_item_revisions
SET description = $q$8.17.4 정상 조명전원이 차단될 경우에는 2 lx 이상의 조도로 1시간 동안 전원이 공급될 수 있는 자동 재충전 예비전원공급
장치가 있어야 하며, 이 조명은 정상 조명전원이 차단되면 자동으로 즉시 점등되어야 한다. 측정은 다음과 같은 곳에서
이루어져야 한다.
 가) 호출버튼 및 비상통화장치 표시
 나) 램프중심부로부터 2m 떨어진 수직면상
14.2.3.2 이 장치는 8.17.4에서 요구된 비상 조명 전원공급 장치 또는 동등한 전원공급 장치로부터 전원이 공급되어야 한다.
 비고 일반전화 네트워크에 연결된 경우에는 14.2.3.2가 적용되지 않는다.$q$,
    attachments_text = COALESCE(NULLIF(attachments_text, ''), '8.17.4, 14.2.3.2 시행')
WHERE item_id = '8.10.4' AND equipment_type = '엘리베이터' AND introduction_type = 'old'
  AND effective_date = '2013-09-15';

-- 없으면 새로 추가
INSERT INTO inspection_item_revisions (item_id, equipment_type, effective_date, expiry_date, introduction_type, description, attachments_text)
SELECT '8.10.4', '엘리베이터', '2013-09-15', '2022-03-01', 'old', $q$8.17.4 정상 조명전원이 차단될 경우에는 2 lx 이상의 조도로 1시간 동안 전원이 공급될 수 있는 자동 재충전 예비전원공급
장치가 있어야 하며, 이 조명은 정상 조명전원이 차단되면 자동으로 즉시 점등되어야 한다. 측정은 다음과 같은 곳에서
이루어져야 한다.
 가) 호출버튼 및 비상통화장치 표시
 나) 램프중심부로부터 2m 떨어진 수직면상
14.2.3.2 이 장치는 8.17.4에서 요구된 비상 조명 전원공급 장치 또는 동등한 전원공급 장치로부터 전원이 공급되어야 한다.
 비고 일반전화 네트워크에 연결된 경우에는 14.2.3.2가 적용되지 않는다.$q$, '8.17.4, 14.2.3.2 시행'
WHERE NOT EXISTS (SELECT 1 FROM inspection_item_revisions WHERE item_id = '8.10.4' AND equipment_type = '엘리베이터' AND introduction_type = 'old' AND effective_date = '2013-09-15');

-- 2013-09-15 이전 행: 없으면 추가
INSERT INTO inspection_item_revisions (item_id, equipment_type, effective_date, expiry_date, introduction_type, description)
SELECT '8.10.4', '엘리베이터', NULL, '2013-09-14', 'old', $q$3.1.6(13) 정전시에 램프중심부로부터 2m 떨어진 수직면상에서 측정하여 1Lux 이상의 조도를 확보할 수 있는 예비조명장치.
다만, 자동차용 엘리베이터와 카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 아니하다.
4.1.2(11) 정전시에 램프중심부로부터 2m 떨어진 수직면상의 조도를 1Lux 이상으로 비출 수 있는 예비조명장치의 작동상태는
양호하여야 한다. 다만, 자동차용 엘리베이터와 카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 아니하다.$q$
WHERE NOT EXISTS (SELECT 1 FROM inspection_item_revisions WHERE item_id = '8.10.4' AND equipment_type = '엘리베이터' AND introduction_type = 'old' AND effective_date IS NULL);

-- 실행 후 (기대: 현행 / 2013-09-15 이후(본문 채워짐) / 2013-09-14 이전 — 3행)
SELECT id, introduction_type, effective_date, expiry_date, length(description) AS 글자수, left(description, 30) AS 내용, left(attachments_text, 30) AS 검색칸
FROM inspection_item_revisions WHERE item_id = '8.10.4' AND equipment_type = '엘리베이터' ORDER BY effective_date NULLS FIRST, id;

COMMIT;
