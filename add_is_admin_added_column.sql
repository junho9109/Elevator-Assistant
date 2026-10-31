-- 검사기준 페이지 "조문 추가" 관리자 기능을 위한 컬럼 추가
ALTER TABLE public.inspection_base_items
  ADD COLUMN IF NOT EXISTS is_admin_added varchar(5) DEFAULT 'false';
