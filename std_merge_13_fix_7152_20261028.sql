-- 7.15.2 연혁 정리 (B안): 현행에 나) 추가, 가장 오래된 종전에 섞여 있던 나) 제거 + 종료일 보정.
-- "(가 종전)" 구분은 화면에 표시되지 않는 revision_date 칸에 '가) 종전'으로 남겨 둔다(화면 미사용 칸).
BEGIN;

CREATE TABLE IF NOT EXISTS inspection_item_revisions_bak4_20261028 AS
SELECT * FROM inspection_item_revisions
WHERE id IN (5876, 5877, 5878) AND equipment_type = '엘리베이터';

-- 실행 전 (기대: 5876 current / 5877 old 2013-09-15~2022-03-01 / 5878 old 종료일 2013-09-15)
SELECT id, item_id, introduction_type, effective_date, expiry_date, revision_date, left(description, 40) AS 내용
FROM inspection_item_revisions WHERE id IN (5876, 5877, 5878) ORDER BY id;

-- 1) 현행 7.15.2: 끝에 나) 문장과 시행 표기 추가 (이미 들어 있으면 건너뜀)
UPDATE inspection_item_revisions
SET description = rtrim(description) || E'\n  나) 카가 7.8.1에 따른 잠금해제구간 밖에 있을 때, 카문은 1,000 N의 힘으로 50 mm 이상 열리지 않아야 하며, 자동 동력 작동 상태에서도 문은 열리지 않아야 한다.\n  <2019년 3월 28일 이후 건축허가분부터 적용>'
WHERE id = 5876 AND item_id = '7.15.2' AND equipment_type = '엘리베이터'
  AND description NOT LIKE '%나) 카가 7.8.1%';

-- 2) 종전 2013-09-15 이후(8.11.3): 가) 종전 표시를 데이터에만 남김
UPDATE inspection_item_revisions SET revision_date = '가) 종전'
WHERE id = 5877 AND item_id = '7.15.2' AND equipment_type = '엘리베이터';

-- 3) 가장 오래된 종전(4.1.3(2)): 섞여 있던 나) 문장과 2019 표기를 제거, 종료일 2013-09-15 -> 2013-09-14, 가) 종전 표시를 데이터에만 남김
UPDATE inspection_item_revisions
SET description = rtrim(regexp_replace(description, '\s*나\) 카가 7\.8\.1.*$', '')),
    expiry_date = '2013-09-14',
    revision_date = '가) 종전'
WHERE id = 5878 AND item_id = '7.15.2' AND equipment_type = '엘리베이터'
  AND description LIKE '%나) 카가 7.8.1%';

-- 실행 후 확인 (기대: 5876 끝에 나) 추가 / 5878은 4.1.3(2)만, 종료일 2013-09-14 / 5877·5878 revision_date = '가) 종전')
SELECT id, item_id, introduction_type, effective_date, expiry_date, revision_date, description
FROM inspection_item_revisions WHERE id IN (5876, 5877, 5878) ORDER BY id;

COMMIT;
