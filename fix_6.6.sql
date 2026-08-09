-- 6.6 잘못된 내용("7 승강장문 및 카문")을 올바른 제목으로 수정
UPDATE public.inspection_base_items SET text = '6.6 기계실·기계류 공간 및 풀리실', section_title = '6.6 기계실·기계류 공간 및 풀리실', updated_at = now() WHERE item_id = '6.6';

-- 6 "풀리 실" 띄어쓰기 오류 수정 → "풀리실"
UPDATE public.inspection_base_items SET text = '6 승강로, 기계실, 풀리실', section_title = '6 승강로, 기계실, 풀리실', updated_at = now() WHERE item_id = '6';

-- 6.2 / 6.3 제목 수정 (표 체크마크 잔재 제거 및 오타 수정)
UPDATE public.inspection_base_items SET text = '6.2 승강로, 기계실·기계류 공간 및 풀리실 접근 및 출입', section_title = '6.2 승강로, 기계실·기계류 공간 및 풀리실 접근 및 출입', updated_at = now() WHERE item_id = '6.2';
UPDATE public.inspection_base_items SET text = '6.3 출입문 및 비상문 – 점검문', section_title = '6.3 출입문 및 비상문 – 점검문', updated_at = now() WHERE item_id = '6.3';

-- 7.x 섹션 제목 수정 (표 체크마크 잔재 제거 및 문구 정정)
UPDATE public.inspection_base_items SET text = '7.2 출입문의 높이 및 폭', section_title = '7.2 출입문의 높이 및 폭', updated_at = now() WHERE item_id = '7.2';
UPDATE public.inspection_base_items SET text = '7.4 승강장문과 카문 사이의 수평 틈새', section_title = '7.4 승강장문과 카문 사이의 수평 틈새', updated_at = now() WHERE item_id = '7.4';
UPDATE public.inspection_base_items SET text = '7.5 승강장문 및 카문의 강도', section_title = '7.5 승강장문 및 카문의 강도', updated_at = now() WHERE item_id = '7.5';
UPDATE public.inspection_base_items SET text = '7.6 문 작동에 관한 보호', section_title = '7.6 문 작동에 관한 보호', updated_at = now() WHERE item_id = '7.6';
UPDATE public.inspection_base_items SET text = '7.7 승강장 조명 및 <<카 있음>> 신호 표시', section_title = '7.7 승강장 조명 및 <<카 있음>> 신호 표시', updated_at = now() WHERE item_id = '7.7';
UPDATE public.inspection_base_items SET text = '7.8 닫히고 잠긴 승강장문의 확인', section_title = '7.8 닫히고 잠긴 승강장문의 확인', updated_at = now() WHERE item_id = '7.8';
UPDATE public.inspection_base_items SET text = '7.9 승장장문 및 카문의 잠금, 비상잠금해제', section_title = '7.9 승장장문 및 카문의 잠금, 비상잠금해제', updated_at = now() WHERE item_id = '7.9';
UPDATE public.inspection_base_items SET text = '7.11 여러 문짝이 기계적으로 연결된 개폐식 승강장문', section_title = '7.11 여러 문짝이 기계적으로 연결된 개폐식 승강장문', updated_at = now() WHERE item_id = '7.11';
UPDATE public.inspection_base_items SET text = '7.13 카문의 닫힘을 입증하는 전기안전장치', section_title = '7.13 카문의 닫힘을 입증하는 전기안전장치', updated_at = now() WHERE item_id = '7.13';
UPDATE public.inspection_base_items SET text = '7.15 카문의 개방', section_title = '7.15 카문의 개방', updated_at = now() WHERE item_id = '7.15';
