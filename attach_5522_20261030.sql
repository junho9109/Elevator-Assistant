-- 에스컬레이터 5.5.2.2 연혁에 연혁집 v2.0 p.58 그림 첨부 (현행: 그림 6 / 종전 2013-09-15: 그림 4)
-- 전제: client/public/revision-figures/5.5.2.2_current_cur_f6_0.png, 5.5.2.2_old_2013-09-15_f4_0.png 배포 완료
\set ON_ERROR_STOP on
BEGIN;

UPDATE inspection_item_revisions SET
  attachments = $q$[{"kind": "figure", "caption": "그림 6 ― 에스컬레이터/무빙워크(단면도), 주요 치수", "images": ["5.5.2.2_current_cur_f6_0.png"], "search": "그림 6 에스컬레이터/무빙워크 단면도 주요 치수 기어오름 방지장치 접근금지 장치 미끄럼 방지장치 삼각부 막는 조치 b13 b14 b15 b16 b17 h5 h9 h10 h11 l5 b10"}]$q$::jsonb,
  attachments_text = $q$그림 6 에스컬레이터/무빙워크 단면도 주요 치수 기어오름 방지장치 접근금지 장치 미끄럼 방지장치 삼각부 막는 조치 b13 b14 b15 b16 b17 h5 h9 h10 h11 l5 b10$q$,
  source = '연혁집 v2.0 p.58'
WHERE id = 9889 AND item_id = '5.5.2.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND attachments IS NULL;

UPDATE inspection_item_revisions SET
  attachments = $q$[{"kind": "figure", "caption": "그림 4 ― 오용 방지장치 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["5.5.2.2_old_2013-09-15_f4_0.png"], "search": "그림 4 오용 방지장치 기어오름 방지장치 접근금지 장치 미끄럼 방지장치 수직 디플렉터 b13 b14 b15 b16 b17 h5 h9 h10 h11 l5"}]$q$::jsonb,
  attachments_text = $q$그림 4 오용 방지장치 기어오름 방지장치 접근금지 장치 미끄럼 방지장치 수직 디플렉터 b13 b14 b15 b16 b17 h5 h9 h10 h11 l5$q$,
  source = '연혁집 v2.0 p.58'
WHERE id = 9890 AND item_id = '5.5.2.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15' AND attachments IS NULL;

SELECT id, introduction_type, effective_date, source, attachments->0->>'caption' AS cap, attachments->0->'images' AS imgs
FROM inspection_item_revisions WHERE item_id='5.5.2.2' ORDER BY id;
COMMIT;
