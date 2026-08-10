-- 검사기준(별표22) 조문 본문에 여러 장 이미지 첨부 기능

CREATE TABLE IF NOT EXISTS public.inspection_item_photos (
  id SERIAL PRIMARY KEY,
  item_id VARCHAR(50) NOT NULL,
  image_data TEXT NOT NULL,
  mime_type VARCHAR(50) DEFAULT 'image/jpeg',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inspection_item_photos_item ON public.inspection_item_photos(item_id);
