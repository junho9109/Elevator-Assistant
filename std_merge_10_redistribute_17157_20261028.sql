-- 10) 17.1.5.7에 몰려 있던 장애인용 엘리베이터 종전 연혁 33행을 해당 조문으로 재배치 (조문 번호만 변경, 8896은 문장별로 둘로 나눔)
CREATE TABLE IF NOT EXISTS inspection_item_revisions_bak2_20261028 AS
SELECT * FROM inspection_item_revisions WHERE equipment_type = '엘리베이터' AND item_id = '17.1.5.7';

-- 8896: 16.1.2 문장을 새 행으로 복사해 17.1.5.4에 두고, 원래 행은 16.1.1 문장만 남겨 17.1.1.2로
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description, created_at, revision_date, equipment_type, attachments, attachments_text, source)
SELECT '17.1.5.4', effective_date, expiry_date, introduction_type, $q$16.1.2 장애인용 엘리베이터는 호출버튼 또는 등록버튼에 의하여 카가 정지하면 10초 이상 문이 열린 채로 대기하여야 한다.$q$, created_at, revision_date, equipment_type, attachments, attachments_text, source
FROM inspection_item_revisions WHERE id = 8896 AND item_id = '17.1.5.7' AND equipment_type = '엘리베이터';
UPDATE inspection_item_revisions SET item_id = '17.1.1.2', description = $q$16.1.1 「장애인·노인·임산부 등의 편의증진보장에 관한 법률」, 「교통약자의 이동편의 증진법」등 개별법령에서 규정하고 있는 시설기준을 충족하여야 한다.$q$
WHERE id = 8896 AND item_id = '17.1.5.7' AND equipment_type = '엘리베이터';

-- 나머지 행: 조문 번호만 변경
UPDATE inspection_item_revisions SET item_id = '17.1.1.1'
WHERE equipment_type = '엘리베이터' AND item_id = '17.1.5.7' AND id IN (8898, 8908);
UPDATE inspection_item_revisions SET item_id = '17.1.1.2'
WHERE equipment_type = '엘리베이터' AND item_id = '17.1.5.7' AND id IN (8897);
UPDATE inspection_item_revisions SET item_id = '17.1.2.2'
WHERE equipment_type = '엘리베이터' AND item_id = '17.1.5.7' AND id IN (8907);
UPDATE inspection_item_revisions SET item_id = '17.1.3.1'
WHERE equipment_type = '엘리베이터' AND item_id = '17.1.5.7' AND id IN (8909, 8910, 8911);
UPDATE inspection_item_revisions SET item_id = '17.1.3.2'
WHERE equipment_type = '엘리베이터' AND item_id = '17.1.5.7' AND id IN (8905, 8906);
UPDATE inspection_item_revisions SET item_id = '17.1.4.1'
WHERE equipment_type = '엘리베이터' AND item_id = '17.1.5.7' AND id IN (8899, 8900, 8901);
UPDATE inspection_item_revisions SET item_id = '17.1.4.2'
WHERE equipment_type = '엘리베이터' AND item_id = '17.1.5.7' AND id IN (8902, 8903, 8904);
UPDATE inspection_item_revisions SET item_id = '17.1.4.4'
WHERE equipment_type = '엘리베이터' AND item_id = '17.1.5.7' AND id IN (8921, 8922, 8924, 8925);
UPDATE inspection_item_revisions SET item_id = '17.1.5.1'
WHERE equipment_type = '엘리베이터' AND item_id = '17.1.5.7' AND id IN (8915, 8914, 8916);
UPDATE inspection_item_revisions SET item_id = '17.1.5.2'
WHERE equipment_type = '엘리베이터' AND item_id = '17.1.5.7' AND id IN (8913, 8912);
UPDATE inspection_item_revisions SET item_id = '17.1.5.3'
WHERE equipment_type = '엘리베이터' AND item_id = '17.1.5.7' AND id IN (8917, 8918);
UPDATE inspection_item_revisions SET item_id = '17.1.5.4'
WHERE equipment_type = '엘리베이터' AND item_id = '17.1.5.7' AND id IN (8923, 8926);
UPDATE inspection_item_revisions SET item_id = '17.1.5.5'
WHERE equipment_type = '엘리베이터' AND item_id = '17.1.5.7' AND id IN (8919, 8920, 8927, 8928);

-- 확인: 17.1.5.7에는 현행 1행만 남아야 함
SELECT item_id, count(*) FROM inspection_item_revisions
WHERE equipment_type = '엘리베이터' AND item_id LIKE '17.1.%' GROUP BY 1 ORDER BY 1;
