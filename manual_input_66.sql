-- 수동 입력 7.7.2.2, 7.8 (신규 제목)


-- 7.7.2.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.7.2.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.7.2.2', '2019-03-28', NULL, 'current', '7.7.2.2 카문이 자동이 아니고 카가 승강장에서 정지하고 있을 때 열린 상태가 유지되지 않는 경우, 승강장문에 7.7.2.1 가)에 따른 전망창이 있으면 카문에도 승강장문의 전망창과 맞는 전망창이 있어야 한다.
7.7.2.1 가)에 따른 카측 전망창은 카가 승강장 층에 있을 때 승강장문 전망창과 시각적으로 일치하도록 카문에 배치되어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');


-- 7.8 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.8' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.8', '2022-03-02', NULL, 'current', '7.8 닫히고 잠긴 승강장문의 확인');
