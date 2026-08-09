-- 6.6 잘못된 내용("7 승강장문 및 카문")을 올바른 제목으로 수정
UPDATE public.inspection_base_items SET text = '6.6 기계실·기계류 공간 및 풀리실', section_title = '6.6 기계실·기계류 공간 및 풀리실', updated_at = now() WHERE item_id = '6.6';

-- 6 "풀리 실" 띄어쓰기 오류 수정 → "풀리실"
UPDATE public.inspection_base_items SET text = '6 승강로, 기계실, 풀리실', section_title = '6 승강로, 기계실, 풀리실', updated_at = now() WHERE item_id = '6';
