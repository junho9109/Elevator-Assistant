-- 검사가이드 1.10.3(기타 설비) 라~사 항목의 「엘리베이터 안전기준」참조 번호 +1 오프셋 버그 수정
-- (17.1.5.4 호출버튼부터 17.1.5.5로 밀려 인용되고, 사 항목은 존재하지 않는 17.1.5.8을 인용하던 문제)
-- standard_index.json / inspection-content.json은 이미 로컬에서 수정 완료. 이 SQL은 이미 시딩된 라이브 DB의
-- inspection_base_items.text 컬럼을 동일하게 맞추기 위한 것.

UPDATE inspection_base_items
SET text = '라) 호출버튼 또는 등록버튼에 의하여 카가 승강장문에 도착하면「엘리베이터 안전기준」17.1.5.4에 따라 10초 이상 열린 상태로 대기하는지 확인한다.'
WHERE item_id = '1.10.3-라';

UPDATE inspection_base_items
SET text = '마) 승강장의 점형블럭이「엘리베이터 안전기준」17.1.5.5에 따라 부착되어 있는지 확인한다.'
WHERE item_id = '1.10.3-마';

UPDATE inspection_base_items
SET text = '바) 카 내부의 층수 버튼을 누르면 점멸등 표시 및 음성안내가「엘리베이터 안전기준」17.1.5.6에 따라 동작되는지 확인한다.'
WHERE item_id = '1.10.3-바';

UPDATE inspection_base_items
SET text = '사) 카 내 조명이「엘리베이터 안전기준」17.1.5.7에 따라 적합한지 확인한다.'
WHERE item_id = '1.10.3-사';
