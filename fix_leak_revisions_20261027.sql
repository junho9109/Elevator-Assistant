-- 누수 항목 연혁 정리 (실행 전 반드시 DB 백업)
-- 1) 삭제 대상 행을 별도 표에 보관
CREATE TABLE IF NOT EXISTS inspection_item_revisions_backup_20261027 AS
  SELECT * FROM inspection_item_revisions WHERE item_id IN ('1.2.1.6-가','1.2.1.6-나');

-- 2) 가이드 항목 번호로 직접 붙은 옛 연혁 6행 삭제 (연혁집과 다른 시작일/종료일 없음)
DELETE FROM inspection_item_revisions
 WHERE item_id IN ('1.2.1.6-가','1.2.1.6-나');

-- 3) 6.1.9.3 종전(2013.9.14. 이전) 문구를 연혁집 원문으로 정정
UPDATE inspection_item_revisions
   SET description = '4.1.4(1) 피트에 설치된 스위치류·인장장치류 및 완충기 등이 누수·습기 또는 먼지 등으로 기능을 상실하지 않도록 누수가 없이 청결하여야 하고, 화재의 위험이 없도록 휴지·헝겊걸레 또는 기름받이에서 넘친 기름 등이 없어야 한다.'
 WHERE item_id = '6.1.9.3' AND effective_date IS NULL AND expiry_date = '2013-09-14';
