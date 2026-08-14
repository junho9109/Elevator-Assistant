-- ㎧(단위 추출 과정에서 오기입된 특수문자) → m/s 일괄 수정
-- 주의: ㎨(m/s², 가속도)는 건드리지 않음. ㎧(m/s, 속도)만 치환.

-- inspection_base_items (검사기준 본문)
UPDATE inspection_base_items SET text = REPLACE(text, '㎧', 'm/s') WHERE text LIKE '%㎧%';
UPDATE inspection_base_items SET section_title = REPLACE(section_title, '㎧', 'm/s') WHERE section_title LIKE '%㎧%';
UPDATE inspection_base_items SET standard_dates = REPLACE(standard_dates, '㎧', 'm/s') WHERE standard_dates LIKE '%㎧%';

-- inspection_item_edits (관리자 수정본)
UPDATE inspection_item_edits SET text = REPLACE(text, '㎧', 'm/s') WHERE text LIKE '%㎧%';
UPDATE inspection_item_edits SET custom_warning = REPLACE(custom_warning, '㎧', 'm/s') WHERE custom_warning LIKE '%㎧%';
UPDATE inspection_item_edits SET standard_dates = REPLACE(standard_dates, '㎧', 'm/s') WHERE standard_dates LIKE '%㎧%';
UPDATE inspection_item_edits SET standard_note = REPLACE(standard_note, '㎧', 'm/s') WHERE standard_note LIKE '%㎧%';

-- inspection_item_revisions (조문 개정 이력)
UPDATE inspection_item_revisions SET description = REPLACE(description, '㎧', 'm/s') WHERE description LIKE '%㎧%';

-- custom_inspection_items (관리자 조문 추가)
UPDATE custom_inspection_items SET text = REPLACE(text, '㎧', 'm/s') WHERE text LIKE '%㎧%';

-- std_item_overrides (표준화 항목)
UPDATE std_item_overrides SET title = REPLACE(title, '㎧', 'm/s') WHERE title LIKE '%㎧%';
UPDATE std_item_overrides SET override_title = REPLACE(override_title, '㎧', 'm/s') WHERE override_title LIKE '%㎧%';
UPDATE std_item_overrides SET basis = REPLACE(basis, '㎧', 'm/s') WHERE basis LIKE '%㎧%';
UPDATE std_item_overrides SET conclusion = REPLACE(conclusion, '㎧', 'm/s') WHERE conclusion LIKE '%㎧%';
UPDATE std_item_overrides SET source = REPLACE(source, '㎧', 'm/s') WHERE source LIKE '%㎧%';
UPDATE std_item_overrides SET ref = REPLACE(ref, '㎧', 'm/s') WHERE ref LIKE '%㎧%';
UPDATE std_item_overrides SET type_tag = REPLACE(type_tag, '㎧', 'm/s') WHERE type_tag LIKE '%㎧%';
UPDATE std_item_overrides SET category = REPLACE(category, '㎧', 'm/s') WHERE category LIKE '%㎧%';

-- insp_std_overrides (검사기준 항목 오버라이드)
UPDATE insp_std_overrides SET text = REPLACE(text, '㎧', 'm/s') WHERE text LIKE '%㎧%';
UPDATE insp_std_overrides SET source = REPLACE(source, '㎧', 'm/s') WHERE source LIKE '%㎧%';

-- 확인: 남은 ㎧ 개수 (전부 0이어야 정상)
SELECT
  (SELECT count(*) FROM inspection_base_items WHERE text LIKE '%㎧%' OR section_title LIKE '%㎧%' OR standard_dates LIKE '%㎧%') AS base_items_left,
  (SELECT count(*) FROM inspection_item_edits WHERE text LIKE '%㎧%' OR custom_warning LIKE '%㎧%' OR standard_dates LIKE '%㎧%' OR standard_note LIKE '%㎧%') AS edits_left,
  (SELECT count(*) FROM inspection_item_revisions WHERE description LIKE '%㎧%') AS revisions_left,
  (SELECT count(*) FROM custom_inspection_items WHERE text LIKE '%㎧%') AS custom_items_left,
  (SELECT count(*) FROM std_item_overrides WHERE title LIKE '%㎧%' OR override_title LIKE '%㎧%' OR basis LIKE '%㎧%' OR conclusion LIKE '%㎧%' OR source LIKE '%㎧%' OR ref LIKE '%㎧%' OR type_tag LIKE '%㎧%' OR category LIKE '%㎧%') AS std_overrides_left,
  (SELECT count(*) FROM insp_std_overrides WHERE text LIKE '%㎧%' OR source LIKE '%㎧%') AS insp_std_overrides_left;
