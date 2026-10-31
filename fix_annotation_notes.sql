-- 소급 반영: PDF ➥ 태그줄에 붙어있던 주석(유압식 제외 등)이 누락된 항목 수정
-- 1~179번 파일 전체를 재검토한 결과, 실제로 누락된 건 3건 + additional 행 정리 1건 확인됨.
-- (6.6.3.2.5, 10.2.2.1.1, 7.5.3.2는 처음엔 누락으로 의심했으나 파일 전체를 다시 읽어보니 이미 정상 반영되어 있어 제외)


-- 6.1.7 (manual_input_2.sql): 1997-08-18~2013-09-14 tier에 "[3.1.5(5) 유압식 제외]" 주석 추가
UPDATE inspection_item_revisions
SET description = '[3.1.5(5) 유압식 제외]
' || description
WHERE item_id = '6.1.7' AND effective_date = '1997-08-18' AND expiry_date = '2013-09-14' AND introduction_type = 'old';


-- 13.2.5.4 (manual_input_128.sql): NULL~2013-09-14 tier에 "[4.1.1(3) 유압식 제외]" 주석 추가
UPDATE inspection_item_revisions
SET description = '[4.1.1(3) 유압식 제외]
' || description
WHERE item_id = '13.2.5.4' AND effective_date IS NULL AND expiry_date = '2013-09-14' AND introduction_type = 'old';


-- 17.2.12.1 (manual_input_179.sql): 1999-09-03~2013-09-14 tier에 "[4.1.2(6), 4.1.6 유압식 제외]" 주석 추가
UPDATE inspection_item_revisions
SET description = '[4.1.2(6), 4.1.6 유압식 제외]
' || description
WHERE item_id = '17.2.12.1' AND effective_date = '1999-09-03' AND expiry_date = '2013-09-14' AND introduction_type = 'old';


-- 10.6 (manual_input_98.sql): additional 행(유령 타임라인)을 삭제하고, 해당 주석을 2000-07-01 old tier 첫 줄에 병합
DELETE FROM inspection_item_revisions
WHERE item_id = '10.6' AND effective_date = '1993-09-03' AND expiry_date IS NULL AND introduction_type = 'additional';

UPDATE inspection_item_revisions
SET description = '[3.1.6(16) 유압식 제외]
' || description
WHERE item_id = '10.6' AND effective_date = '2000-07-01' AND expiry_date = '2003-06-17' AND introduction_type = 'old';


-- 검증: 각 변경이 정확히 반영되었는지 확인
SELECT item_id, effective_date, expiry_date, introduction_type, LEFT(description, 40) AS preview
FROM inspection_item_revisions
WHERE (item_id = '6.1.7' AND effective_date = '1997-08-18')
   OR (item_id = '13.2.5.4' AND expiry_date = '2013-09-14' AND effective_date IS NULL)
   OR (item_id = '17.2.12.1' AND effective_date = '1999-09-03')
   OR (item_id = '10.6')
ORDER BY item_id, effective_date;
