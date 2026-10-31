-- 1) 대통합 반영용 칸 추가 (이미 있으면 건너뜀)
ALTER TABLE std_item_overrides ADD COLUMN IF NOT EXISTS figures text;
ALTER TABLE std_item_overrides ADD COLUMN IF NOT EXISTS rev_note text;
ALTER TABLE std_item_overrides ADD COLUMN IF NOT EXISTS rev_text text;
ALTER TABLE std_item_overrides ADD COLUMN IF NOT EXISTS pdf_page integer;
ALTER TABLE std_item_overrides ADD COLUMN IF NOT EXISTS seq integer;
ALTER TABLE std_item_overrides ADD COLUMN IF NOT EXISTS origin varchar(20);
