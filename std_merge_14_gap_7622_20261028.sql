-- 1.4.3-다(어린이 손끼임 틈새)용: 7.6.2.2.1 연혁 중 자) 틈새 관련 부분만 "7.6.2.2.1 자)"로 새로 추가 (원문 그대로 잘라 옮김).
-- 기존 7.6.2.2.1 연혁은 변경하지 않는다(다른 항목은 계속 전체가 보임). 되돌리려면 맨 아래 롤백 SQL.
BEGIN;

INSERT INTO inspection_item_revisions (item_id, equipment_type, effective_date, expiry_date, introduction_type, description)
SELECT '7.6.2.2.1 자)', '엘리베이터', '2022-03-02', NULL, 'current', $q$7.6.2.2.1 자동 동력 작동식 문
자) 어린이의 손이 틈새에 끼이거나 말려 들어가는 위험을 방지하기 위해 다음 중 어느 하나 이상을 적용해야 한다.
1) 문턱 위로 최소 1.6 m까지의 문짝 간 틈새 또는 문짝과 문틀 사이의 틈새는 5 mm(유리문 4 mm) 이하이어야 한다. 또한 관련 부품이 마모된 경우에는 6 mm(유리문 5 mm) 까지 허용한다.
움푹 들어간 부분은 1 mm를 초과하지 않아야 하고, 6 mm(유리문 5 mm)의 틈새에 포함되어야 하며, 문짝에 인접한 문틀의 외측 모서리의 최대 반경은 6 mm(유리문 5 mm) 이하이어야 한다.
상기 조건을 만족하기 위해 유연한 재질로 보완하는 것은 허용된다.
2) 문턱 위로 최소 1.6 m까지의 구간에 손가락이 있는 것을 감지하고 열림 방향의 문 움직임을 정지시키는 손가락감지수단
3) 7.7.2에 따른 크기보다 큰 유리로 된 문의 경우, 이용자에게 노출되는 측면(승강장문의 경우에는 승강장 측, 카문의 경우에는 카 내부 측)은 반투명 유리 또는 반투명 재질을 사용하여 높이 1.1 m 이상 불투명하게 처리하고 위 1) 또는 2)를 선택하거나 중복하여 적용한다.$q$
WHERE NOT EXISTS (SELECT 1 FROM inspection_item_revisions WHERE item_id='7.6.2.2.1 자)' AND equipment_type='엘리베이터' AND introduction_type='current' AND COALESCE(effective_date,'')=COALESCE('2022-03-02',''));

INSERT INTO inspection_item_revisions (item_id, equipment_type, effective_date, expiry_date, introduction_type, description)
SELECT '7.6.2.2.1 자)', '엘리베이터', '2017-01-28', '2022-03-01', 'old', $q$7.1.3(8.6.3.2) 자동 동력작동 수평 개폐식 승강장문(카문)에는 어린이의 손이 틈새에 끼이거나 끌려 들어가는 위험을 방지하기 위해 다음과 같은 수단 중 하나 이상이 조치되어야 한다.
가) 7.1.2 전단에 따른 틈새 중 문짝과 문설주 사이의 틈새를 5 mm 이하로 설치
나) 손가락 감지수단
다) 틈새 보완(고무 등 부드럽고 유연한 재질)
라) 기타 동등이상의 수단

7.2.3.6(8.6.7.5) 7.6.2에서 설명하는 크기보다 큰 유리로 된 자동 동력작동 수평 개폐식 문은 어린이의 손이 끌러가는 위험을 방지하기 위해 다음과 같은 위험을 최소화 시키는 수단이 하나 이상 있어야 한다.
가) 손과 유리 사이의 마찰계수 감소
나) 1.1 m 높이까지 유리를 불투명하게 처리
다) <삭제>
라) <삭제>$q$
WHERE NOT EXISTS (SELECT 1 FROM inspection_item_revisions WHERE item_id='7.6.2.2.1 자)' AND equipment_type='엘리베이터' AND introduction_type='old' AND COALESCE(effective_date,'')=COALESCE('2017-01-28',''));

INSERT INTO inspection_item_revisions (item_id, equipment_type, effective_date, expiry_date, introduction_type, description)
SELECT '7.6.2.2.1 자)', '엘리베이터', '2013-09-15', '2017-01-27', 'old', $q$7.2.3.6(8.6.7.5) 7.6.2에서 설명하는 크기보다 큰 유리로 된 자동 동력작동 수평 개폐식 문은 어린이의 손이 끌러가는 위험을 방지하기 위해 다음과 같은 위험을 최소화 시키는 수단이 하나 이상 있어야 한다.
가) 손과 유리 사이의 마찰계수 감소
나) 1.1 m 높이까지 유리를 불투명하게 처리
다) 손가락 감지
라) 기타 동등이상의 수단$q$
WHERE NOT EXISTS (SELECT 1 FROM inspection_item_revisions WHERE item_id='7.6.2.2.1 자)' AND equipment_type='엘리베이터' AND introduction_type='old' AND COALESCE(effective_date,'')=COALESCE('2013-09-15',''));

-- 확인 (기대: 3행)
SELECT id, item_id, introduction_type, effective_date, expiry_date, length(description) AS 글자수 FROM inspection_item_revisions WHERE item_id='7.6.2.2.1 자)' ORDER BY effective_date DESC;

COMMIT;

-- 롤백(필요 시에만): DELETE FROM inspection_item_revisions WHERE item_id='7.6.2.2.1 자)' AND equipment_type='엘리베이터';