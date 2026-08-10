
-- 17.1/17.2 본문에 붙은 불필요한 줄바꿈 제거 (제목이 빈칸으로 표시되던 버그)
UPDATE public.inspection_base_items SET text = '17.1 장애인용 엘리베이터에 대한 추가요건', section_title = '17.1 장애인용 엘리베이터에 대한 추가요건', updated_at = now() WHERE item_id = '17.1';
UPDATE public.inspection_base_items SET text = '17.2 소방구조용 엘리베이터에 대한 추가요건', section_title = '17.2 소방구조용 엘리베이터에 대한 추가요건', updated_at = now() WHERE item_id = '17.2';
