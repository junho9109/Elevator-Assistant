-- 6.6 잘못된 내용("7 승강장문 및 카문")을 올바른 제목으로 수정
UPDATE public.inspection_base_items SET text = '6.6 기계실·기계류 공간 및 풀리실', section_title = '6.6 기계실·기계류 공간 및 풀리실', updated_at = now() WHERE item_id = '6.6';

-- 6 "풀리 실" 띄어쓰기 오류 수정 → "풀리실"
UPDATE public.inspection_base_items SET text = '6 승강로, 기계실, 풀리실', section_title = '6 승강로, 기계실, 풀리실', updated_at = now() WHERE item_id = '6';

-- 6.2 / 6.3 제목 수정 (표 체크마크 잔재 제거 및 오타 수정)
UPDATE public.inspection_base_items SET text = '6.2 승강로, 기계실·기계류 공간 및 풀리실 접근 및 출입', section_title = '6.2 승강로, 기계실·기계류 공간 및 풀리실 접근 및 출입', updated_at = now() WHERE item_id = '6.2';
UPDATE public.inspection_base_items SET text = '6.3 출입문 및 비상문 – 점검문', section_title = '6.3 출입문 및 비상문 – 점검문', updated_at = now() WHERE item_id = '6.3';
