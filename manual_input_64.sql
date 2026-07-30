-- 소급 적용: "신설 조문(종전 없음)" current 행의 effective_date를
-- 태그에 명시된 실제 시행일로 정정 (기존 일괄 2022-03-02 → 각 조문 실제 시행일)
-- judgment.tsx의 "현행" 라벨이 이제 effective_date를 그대로 표시하므로
-- 값이 정확해야 라벨-본문 태그 불일치가 생기지 않음.

UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '6.1.9.4' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '6.5.1.1' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2013-09-15' WHERE item_id = '6.5.1.2' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2013-09-15' WHERE item_id = '6.5.2.2.1' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '6.5.2.2.2' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '6.5.6' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '6.5.6.1.1' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '6.5.7.1' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '6.5.7.3' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '6.5.7.4' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '6.5.8.1' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '6.6.1.1' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '6.6.2.1' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '6.6.4.1.3' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '6.6.4.5.8' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '7.1.3' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '7.3.2.1' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '7.5.3.5' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2013-09-15' WHERE item_id = '7.5.3.6' AND introduction_type = 'current';
UPDATE inspection_item_revisions SET effective_date = '2019-03-28' WHERE item_id = '7.5.3.9' AND introduction_type = 'current';
