-- 단위 추출 과정에서 오기입된 특수문자 일괄 수정
-- ㎝→cm, ㎏→kg, ㎠→cm², ㎡→m²

-- inspection_base_items (검사기준 본문)
UPDATE inspection_base_items SET text = REPLACE(REPLACE(REPLACE(REPLACE(text, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE text LIKE '%㎝%' OR text LIKE '%㎏%' OR text LIKE '%㎠%' OR text LIKE '%㎡%';
UPDATE inspection_base_items SET section_title = REPLACE(REPLACE(REPLACE(REPLACE(section_title, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE section_title LIKE '%㎝%' OR section_title LIKE '%㎏%' OR section_title LIKE '%㎠%' OR section_title LIKE '%㎡%';
UPDATE inspection_base_items SET standard_dates = REPLACE(REPLACE(REPLACE(REPLACE(standard_dates, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE standard_dates LIKE '%㎝%' OR standard_dates LIKE '%㎏%' OR standard_dates LIKE '%㎠%' OR standard_dates LIKE '%㎡%';

-- inspection_item_edits (관리자 수정본)
UPDATE inspection_item_edits SET text = REPLACE(REPLACE(REPLACE(REPLACE(text, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE text LIKE '%㎝%' OR text LIKE '%㎏%' OR text LIKE '%㎠%' OR text LIKE '%㎡%';
UPDATE inspection_item_edits SET custom_warning = REPLACE(REPLACE(REPLACE(REPLACE(custom_warning, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE custom_warning LIKE '%㎝%' OR custom_warning LIKE '%㎏%' OR custom_warning LIKE '%㎠%' OR custom_warning LIKE '%㎡%';
UPDATE inspection_item_edits SET standard_dates = REPLACE(REPLACE(REPLACE(REPLACE(standard_dates, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE standard_dates LIKE '%㎝%' OR standard_dates LIKE '%㎏%' OR standard_dates LIKE '%㎠%' OR standard_dates LIKE '%㎡%';
UPDATE inspection_item_edits SET standard_note = REPLACE(REPLACE(REPLACE(REPLACE(standard_note, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE standard_note LIKE '%㎝%' OR standard_note LIKE '%㎏%' OR standard_note LIKE '%㎠%' OR standard_note LIKE '%㎡%';

-- inspection_item_revisions (조문 개정 이력)
UPDATE inspection_item_revisions SET description = REPLACE(REPLACE(REPLACE(REPLACE(description, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE description LIKE '%㎝%' OR description LIKE '%㎏%' OR description LIKE '%㎠%' OR description LIKE '%㎡%';

-- custom_inspection_items (관리자 조문 추가)
UPDATE custom_inspection_items SET text = REPLACE(REPLACE(REPLACE(REPLACE(text, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE text LIKE '%㎝%' OR text LIKE '%㎏%' OR text LIKE '%㎠%' OR text LIKE '%㎡%';

-- std_item_overrides (표준화 항목)
UPDATE std_item_overrides SET title = REPLACE(REPLACE(REPLACE(REPLACE(title, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE title LIKE '%㎝%' OR title LIKE '%㎏%' OR title LIKE '%㎠%' OR title LIKE '%㎡%';
UPDATE std_item_overrides SET override_title = REPLACE(REPLACE(REPLACE(REPLACE(override_title, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE override_title LIKE '%㎝%' OR override_title LIKE '%㎏%' OR override_title LIKE '%㎠%' OR override_title LIKE '%㎡%';
UPDATE std_item_overrides SET basis = REPLACE(REPLACE(REPLACE(REPLACE(basis, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE basis LIKE '%㎝%' OR basis LIKE '%㎏%' OR basis LIKE '%㎠%' OR basis LIKE '%㎡%';
UPDATE std_item_overrides SET conclusion = REPLACE(REPLACE(REPLACE(REPLACE(conclusion, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE conclusion LIKE '%㎝%' OR conclusion LIKE '%㎏%' OR conclusion LIKE '%㎠%' OR conclusion LIKE '%㎡%';
UPDATE std_item_overrides SET source = REPLACE(REPLACE(REPLACE(REPLACE(source, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE source LIKE '%㎝%' OR source LIKE '%㎏%' OR source LIKE '%㎠%' OR source LIKE '%㎡%';
UPDATE std_item_overrides SET ref = REPLACE(REPLACE(REPLACE(REPLACE(ref, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE ref LIKE '%㎝%' OR ref LIKE '%㎏%' OR ref LIKE '%㎠%' OR ref LIKE '%㎡%';
UPDATE std_item_overrides SET type_tag = REPLACE(REPLACE(REPLACE(REPLACE(type_tag, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE type_tag LIKE '%㎝%' OR type_tag LIKE '%㎏%' OR type_tag LIKE '%㎠%' OR type_tag LIKE '%㎡%';
UPDATE std_item_overrides SET category = REPLACE(REPLACE(REPLACE(REPLACE(category, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE category LIKE '%㎝%' OR category LIKE '%㎏%' OR category LIKE '%㎠%' OR category LIKE '%㎡%';

-- insp_std_overrides (검사기준 항목 오버라이드)
UPDATE insp_std_overrides SET text = REPLACE(REPLACE(REPLACE(REPLACE(text, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE text LIKE '%㎝%' OR text LIKE '%㎏%' OR text LIKE '%㎠%' OR text LIKE '%㎡%';
UPDATE insp_std_overrides SET source = REPLACE(REPLACE(REPLACE(REPLACE(source, '㎝','cm'), '㎏','kg'), '㎠','cm²'), '㎡','m²')
  WHERE source LIKE '%㎝%' OR source LIKE '%㎏%' OR source LIKE '%㎠%' OR source LIKE '%㎡%';

-- 확인: 남은 개수 (전부 0이어야 정상)
SELECT
  (SELECT count(*) FROM inspection_base_items WHERE text ~ '[㎝㎏㎠㎡]' OR section_title ~ '[㎝㎏㎠㎡]' OR standard_dates ~ '[㎝㎏㎠㎡]') AS base_items_left,
  (SELECT count(*) FROM inspection_item_edits WHERE text ~ '[㎝㎏㎠㎡]' OR custom_warning ~ '[㎝㎏㎠㎡]' OR standard_dates ~ '[㎝㎏㎠㎡]' OR standard_note ~ '[㎝㎏㎠㎡]') AS edits_left,
  (SELECT count(*) FROM inspection_item_revisions WHERE description ~ '[㎝㎏㎠㎡]') AS revisions_left,
  (SELECT count(*) FROM custom_inspection_items WHERE text ~ '[㎝㎏㎠㎡]') AS custom_items_left,
  (SELECT count(*) FROM std_item_overrides WHERE title ~ '[㎝㎏㎠㎡]' OR override_title ~ '[㎝㎏㎠㎡]' OR basis ~ '[㎝㎏㎠㎡]' OR conclusion ~ '[㎝㎏㎠㎡]' OR source ~ '[㎝㎏㎠㎡]' OR ref ~ '[㎝㎏㎠㎡]' OR type_tag ~ '[㎝㎏㎠㎡]' OR category ~ '[㎝㎏㎠㎡]') AS std_overrides_left,
  (SELECT count(*) FROM insp_std_overrides WHERE text ~ '[㎝㎏㎠㎡]' OR source ~ '[㎝㎏㎠㎡]') AS insp_std_overrides_left;
