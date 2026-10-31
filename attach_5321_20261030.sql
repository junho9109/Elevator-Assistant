-- 에스컬레이터 5.3.2.1 (공칭폭 z1) 현행 연혁에 연혁집 v2.0 p.60 그림 8 첨부
-- 전제: client/public/revision-figures/5.3.2.1_current_cur_f8_0.png 배포 완료
\set ON_ERROR_STOP on
BEGIN;

UPDATE inspection_item_revisions SET
  attachments = $q$[{"kind": "figure", "caption": "그림 8 ― 스텝, 주요 치수 (z1 공칭폭 0.58 m에서 1.1 m)", "images": ["5.3.2.1_current_cur_f8_0.png"], "search": "그림 8 스텝 주요 치수 공칭폭 z1 x1 y1 스텝 트레드 표면 스텝 라이저 표면 0.58 m 1.1 m 디딤판 폭"}]$q$::jsonb,
  attachments_text = $q$그림 8 스텝 주요 치수 공칭폭 z1 x1 y1 스텝 트레드 표면 스텝 라이저 표면 0.58 m 1.1 m 디딤판 폭$q$,
  source = '연혁집 v2.0 p.60'
WHERE id = 9744 AND item_id = '5.3.2.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND attachments IS NULL;

-- 1행 갱신이어야 합니다. 아니면 ROLLBACK 하세요.
COMMIT;
SELECT id, item_id, source, attachments_text FROM inspection_item_revisions WHERE id = 9744;
