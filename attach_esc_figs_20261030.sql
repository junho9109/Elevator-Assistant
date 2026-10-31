-- 에스컬레이터 연혁 행에 연혁집 v2.0 그림 첨부 (묶음 ①: 본문 그림)
-- 전제: client/public/revision-figures/esc_*.png 배포 완료. 각 UPDATE는 id·item_id·종류·날짜를 모두 확인하고, 같은 그림이 이미 붙어 있으면 건너뜁니다.
\set ON_ERROR_STOP on
BEGIN;

-- F5cur: 그림 5 ― 에스컬레이터(입면도), 주요 치수  (24행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9728 AND item_id = '5.2.2.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9739 AND item_id = '5.2.5' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9747 AND item_id = '5.3.2.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9763 AND item_id = '5.3.2.3' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9794 AND item_id = '5.3.5' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9886 AND item_id = '5.5.2.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9908 AND item_id = '5.5.3.3' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9916 AND item_id = '5.5.4.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9918 AND item_id = '5.5.4.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9936 AND item_id = '5.6.4.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9938 AND item_id = '5.6.4.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9945 AND item_id = '5.7.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9947 AND item_id = '5.7.2.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9965 AND item_id = '5.7.3.2.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9970 AND item_id = '5.7.3.2.3' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9972 AND item_id = '5.7.3.2.4' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9980 AND item_id = '5.7.3.3.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9984 AND item_id = '5.7.3.3.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9757 AND item_id = '5.3.2.2.5' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9766 AND item_id = '5.3.2.3.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9759 AND item_id = '5.3.2.2.7' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9768 AND item_id = '5.3.2.3.4' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9758 AND item_id = '5.3.2.2.6' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 5 ― 에스컬레이터(입면도), 주요 치수", "images": ["esc_fig5_elev_cur.png"], "search": "그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 5 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 트레드 팔레트 벨트 콤 상세도 Y Z$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.54~55')
WHERE id = 9767 AND item_id = '5.3.2.3.3' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig5_elev_cur.png%';

-- F2old: 그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)  (17행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9729 AND item_id = '5.2.2.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9740 AND item_id = '5.2.5' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9748 AND item_id = '5.3.2.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9764 AND item_id = '5.3.2.3' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9795 AND item_id = '5.3.5' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9888 AND item_id = '5.5.2.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9917 AND item_id = '5.5.4.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9773 AND item_id = '5.5.4.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9937 AND item_id = '5.6.4.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9939 AND item_id = '5.6.4.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9946 AND item_id = '5.7.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9948 AND item_id = '5.7.2.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9966 AND item_id = '5.7.3.2.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9971 AND item_id = '5.7.3.2.3' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9973 AND item_id = '5.7.3.2.4' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9981 AND item_id = '5.7.3.3.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 2 - 에스컬레이터(입면도) 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig2_elev_2013.png"], "search": "그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 2 에스컬레이터 입면도 주요 치수 h1 h3 h4 h5 h6 h7 b7 b8 l1 l2 l3 l4 알파 베타 경사각도 스텝 발판 팔레트 벨트 콤$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.56~57')
WHERE id = 9985 AND item_id = '5.7.3.3.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig2_elev_2013.png%';

-- F7cur: 그림 7 ― 오용 방지장치 (에스컬레이터/무빙워크 단면 주요 치수 b1~b5, h1~h3)  (12행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 7 ― 오용 방지장치 (에스컬레이터/무빙워크 단면 주요 치수 b1~b5, h1~h3)", "images": ["esc_fig7_misuse_cur.png"], "search": "그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.59')
WHERE id = 9739 AND item_id = '5.2.5' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig7_misuse_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 7 ― 오용 방지장치 (에스컬레이터/무빙워크 단면 주요 치수 b1~b5, h1~h3)", "images": ["esc_fig7_misuse_cur.png"], "search": "그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.59')
WHERE id = 9886 AND item_id = '5.5.2.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig7_misuse_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 7 ― 오용 방지장치 (에스컬레이터/무빙워크 단면 주요 치수 b1~b5, h1~h3)", "images": ["esc_fig7_misuse_cur.png"], "search": "그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.59')
WHERE id = 9896 AND item_id = '5.5.2.6' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig7_misuse_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 7 ― 오용 방지장치 (에스컬레이터/무빙워크 단면 주요 치수 b1~b5, h1~h3)", "images": ["esc_fig7_misuse_cur.png"], "search": "그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.59')
WHERE id = 9898 AND item_id = '5.5.2.6.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig7_misuse_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 7 ― 오용 방지장치 (에스컬레이터/무빙워크 단면 주요 치수 b1~b5, h1~h3)", "images": ["esc_fig7_misuse_cur.png"], "search": "그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.59')
WHERE id = 9900 AND item_id = '5.5.2.6.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig7_misuse_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 7 ― 오용 방지장치 (에스컬레이터/무빙워크 단면 주요 치수 b1~b5, h1~h3)", "images": ["esc_fig7_misuse_cur.png"], "search": "그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.59')
WHERE id = 9905 AND item_id = '5.5.3.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig7_misuse_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 7 ― 오용 방지장치 (에스컬레이터/무빙워크 단면 주요 치수 b1~b5, h1~h3)", "images": ["esc_fig7_misuse_cur.png"], "search": "그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.59')
WHERE id = 9780 AND item_id = '5.5.5.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig7_misuse_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 7 ― 오용 방지장치 (에스컬레이터/무빙워크 단면 주요 치수 b1~b5, h1~h3)", "images": ["esc_fig7_misuse_cur.png"], "search": "그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.59')
WHERE id = 9928 AND item_id = '5.6.2.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig7_misuse_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 7 ― 오용 방지장치 (에스컬레이터/무빙워크 단면 주요 치수 b1~b5, h1~h3)", "images": ["esc_fig7_misuse_cur.png"], "search": "그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.59')
WHERE id = 9930 AND item_id = '5.6.2.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig7_misuse_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 7 ― 오용 방지장치 (에스컬레이터/무빙워크 단면 주요 치수 b1~b5, h1~h3)", "images": ["esc_fig7_misuse_cur.png"], "search": "그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.59')
WHERE id = 9932 AND item_id = '5.6.2.3' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig7_misuse_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 7 ― 오용 방지장치 (에스컬레이터/무빙워크 단면 주요 치수 b1~b5, h1~h3)", "images": ["esc_fig7_misuse_cur.png"], "search": "그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.59')
WHERE id = 9934 AND item_id = '5.6.3' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig7_misuse_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 7 ― 오용 방지장치 (에스컬레이터/무빙워크 단면 주요 치수 b1~b5, h1~h3)", "images": ["esc_fig7_misuse_cur.png"], "search": "그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 7 오용 방지장치 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 b18 h1 h2 h3 스커트 내부패널 외부패널 난간데크 하부 내측데크 하부 외측데크 핸드레일 틈새$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.59')
WHERE id = 9936 AND item_id = '5.6.4.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig7_misuse_cur.png%';

-- F3old: 그림 3 - 에스컬레이터/무빙워크(단면도), 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)  (13행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 3 - 에스컬레이터/무빙워크(단면도), 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig3_section_2013.png"], "search": "그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 9888 AND item_id = '5.5.2.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig3_section_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 3 - 에스컬레이터/무빙워크(단면도), 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig3_section_2013.png"], "search": "그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 9897 AND item_id = '5.5.2.6' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig3_section_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 3 - 에스컬레이터/무빙워크(단면도), 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig3_section_2013.png"], "search": "그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 9899 AND item_id = '5.5.2.6.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig3_section_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 3 - 에스컬레이터/무빙워크(단면도), 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig3_section_2013.png"], "search": "그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 9901 AND item_id = '5.5.2.6.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig3_section_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 3 - 에스컬레이터/무빙워크(단면도), 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig3_section_2013.png"], "search": "그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 9903 AND item_id = '5.5.3.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig3_section_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 3 - 에스컬레이터/무빙워크(단면도), 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig3_section_2013.png"], "search": "그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 9906 AND item_id = '5.5.3.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig3_section_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 3 - 에스컬레이터/무빙워크(단면도), 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig3_section_2013.png"], "search": "그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 9789 AND item_id = '5.5.5.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig3_section_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 3 - 에스컬레이터/무빙워크(단면도), 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig3_section_2013.png"], "search": "그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 9929 AND item_id = '5.6.2.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig3_section_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 3 - 에스컬레이터/무빙워크(단면도), 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig3_section_2013.png"], "search": "그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 9931 AND item_id = '5.6.2.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig3_section_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 3 - 에스컬레이터/무빙워크(단면도), 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig3_section_2013.png"], "search": "그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 9933 AND item_id = '5.6.2.3' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig3_section_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 3 - 에스컬레이터/무빙워크(단면도), 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig3_section_2013.png"], "search": "그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 9935 AND item_id = '5.6.3' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig3_section_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 3 - 에스컬레이터/무빙워크(단면도), 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig3_section_2013.png"], "search": "그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 9937 AND item_id = '5.6.4.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig3_section_2013.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 3 - 에스컬레이터/무빙워크(단면도), 주요 치수 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig3_section_2013.png"], "search": "그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 3 에스컬레이터 무빙워크 단면도 주요 치수 b1 b2 b3 b4 b5 b6 b12 h1 h2 h3 스커트 사이의 거리 Z2 Z1$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 10245 AND item_id = '7.2.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig3_section_2013.png%';

-- F8cur: 그림 8 ― 스텝, 주요 치수 (z1 공칭폭 0.58 m에서 1.1 m)  (3행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 8 ― 스텝, 주요 치수 (z1 공칭폭 0.58 m에서 1.1 m)", "images": ["5.3.2.1_current_cur_f8_0.png"], "search": "그림 8 스텝 주요 치수 공칭폭 z1 x1 y1 스텝 트레드 표면 스텝 라이저 표면 0.58 m 1.1 m 디딤판 폭"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 8 스텝 주요 치수 공칭폭 z1 x1 y1 스텝 트레드 표면 스텝 라이저 표면 0.58 m 1.1 m 디딤판 폭$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 9747 AND item_id = '5.3.2.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%5.3.2.1_current_cur_f8_0.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 8 ― 스텝, 주요 치수 (z1 공칭폭 0.58 m에서 1.1 m)", "images": ["5.3.2.1_current_cur_f8_0.png"], "search": "그림 8 스텝 주요 치수 공칭폭 z1 x1 y1 스텝 트레드 표면 스텝 라이저 표면 0.58 m 1.1 m 디딤판 폭"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 8 스텝 주요 치수 공칭폭 z1 x1 y1 스텝 트레드 표면 스텝 라이저 표면 0.58 m 1.1 m 디딤판 폭$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 9749 AND item_id = '5.3.2.2.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%5.3.2.1_current_cur_f8_0.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 8 ― 스텝, 주요 치수 (z1 공칭폭 0.58 m에서 1.1 m)", "images": ["5.3.2.1_current_cur_f8_0.png"], "search": "그림 8 스텝 주요 치수 공칭폭 z1 x1 y1 스텝 트레드 표면 스텝 라이저 표면 0.58 m 1.1 m 디딤판 폭"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 8 스텝 주요 치수 공칭폭 z1 x1 y1 스텝 트레드 표면 스텝 라이저 표면 0.58 m 1.1 m 디딤판 폭$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.60')
WHERE id = 9752 AND item_id = '5.3.2.2.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%5.3.2.1_current_cur_f8_0.png%';

-- F9cur: 그림 9 ― 팔레트, 상하부 승강장 및 천이구간에서 틈새 및 맞물림 깊이 (맞물리는 홈이 없는 무빙워크의 팔레트 형식)  (1행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 9 ― 팔레트, 상하부 승강장 및 천이구간에서 틈새 및 맞물림 깊이 (맞물리는 홈이 없는 무빙워크의 팔레트 형식)", "images": ["esc_fig9_pallet_cur.png"], "search": "그림 9 팔레트 상하부 승강장 천이구간 틈새 맞물림 깊이 맞물리는 홈이 없는 무빙워크 팔레트 형식 상세도 S T 6 mm"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 9 팔레트 상하부 승강장 천이구간 틈새 맞물림 깊이 맞물리는 홈이 없는 무빙워크 팔레트 형식 상세도 S T 6 mm$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.61')
WHERE id = 9794 AND item_id = '5.3.5' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig9_pallet_cur.png%';

-- F10cur: 그림 10 ― 팔레트, 상하부 승강장 및 천이구간에서 틈새 및 맞물림 깊이 (맞물리는 홈이 있는 무빙워크의 팔레트 형식)  (1행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 10 ― 팔레트, 상하부 승강장 및 천이구간에서 틈새 및 맞물림 깊이 (맞물리는 홈이 있는 무빙워크의 팔레트 형식)", "images": ["esc_fig10_pallet_cur.png"], "search": "그림 10 팔레트 상하부 승강장 천이구간 틈새 맞물림 깊이 맞물리는 홈이 있는 무빙워크 팔레트 형식 상세도 U V 6 mm 8 mm"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 10 팔레트 상하부 승강장 천이구간 틈새 맞물림 깊이 맞물리는 홈이 있는 무빙워크 팔레트 형식 상세도 U V 6 mm 8 mm$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.62')
WHERE id = 9794 AND item_id = '5.3.5' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig10_pallet_cur.png%';

-- F6old: 그림 6 - 팔레트, 상하부 승강장 및 천이구간에서 틈새 및 맞물림 깊이 (맞물린 전후 끝부분 없는 무빙워크의 팔레트 형식) (2013년 9월 15일 이후의 건축허가분부터 적용)  (1행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 6 - 팔레트, 상하부 승강장 및 천이구간에서 틈새 및 맞물림 깊이 (맞물린 전후 끝부분 없는 무빙워크의 팔레트 형식) (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig6_pallet_2013.png"], "search": "그림 6 팔레트 상하부 승강장 천이구간 틈새 맞물림 깊이 맞물린 전후 끝부분 없는 무빙워크 팔레트 형식 상세도 S T 6 max"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 6 팔레트 상하부 승강장 천이구간 틈새 맞물림 깊이 맞물린 전후 끝부분 없는 무빙워크 팔레트 형식 상세도 S T 6 max$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.63')
WHERE id = 9795 AND item_id = '5.3.5' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig6_pallet_2013.png%';

-- F7old: 그림 7 - 팔레트, 상하부 승강장 및 변이 곡선에서 틈새 및 맞물림 깊이 (맞물린 전후 끝부분이 있는 무빙워크의 팔레트 형식) (2013년 9월 15일 이후의 건축허가분부터 적용)  (1행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 7 - 팔레트, 상하부 승강장 및 변이 곡선에서 틈새 및 맞물림 깊이 (맞물린 전후 끝부분이 있는 무빙워크의 팔레트 형식) (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig7_pallet_2013.png"], "search": "그림 7 팔레트 상하부 승강장 변이 곡선 틈새 맞물림 깊이 맞물린 전후 끝부분이 있는 무빙워크 팔레트 형식 상세도 U V 6 max 8 max"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 7 팔레트 상하부 승강장 변이 곡선 틈새 맞물림 깊이 맞물린 전후 끝부분이 있는 무빙워크 팔레트 형식 상세도 U V 6 max 8 max$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.63')
WHERE id = 9795 AND item_id = '5.3.5' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig7_pallet_2013.png%';

-- F11cur: 그림 11 ― 벨트(단면도), 단일 힘  (1행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 11 ― 벨트(단면도), 단일 힘", "images": ["esc_fig11_belt_cur.png"], "search": "그림 11 벨트 단면도 단일 힘 750 N z3 지지롤러 사이의 가로 거리"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 11 벨트 단면도 단일 힘 750 N z3 지지롤러 사이의 가로 거리$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.64')
WHERE id = 9781 AND item_id = '5.3.3.2.4' AND equipment_type = '에스컬레이터' AND introduction_type = 'current'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig11_belt_cur.png%';

-- F8old: 그림 8 - 벨트(단면도), 단독 힘 (2013년 9월 15일 이후의 건축허가분부터 적용)  (1행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "figure", "caption": "그림 8 - 벨트(단면도), 단독 힘 (2013년 9월 15일 이후의 건축허가분부터 적용)", "images": ["esc_fig8_belt_2013.png"], "search": "그림 8 벨트 단면도 단독 힘 750 N z3 지지롤러 사이의 가로 거리"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$그림 8 벨트 단면도 단독 힘 750 N z3 지지롤러 사이의 가로 거리$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.64')
WHERE id = 9782 AND item_id = '5.3.3.2.4' AND equipment_type = '에스컬레이터' AND introduction_type = 'old' AND effective_date = '2013-09-15'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_fig8_belt_2013.png%';

-- 기대 결과: 위 UPDATE는 총 75개, 각각 UPDATE 1 이어야 합니다. 0이 있으면 이미 붙어 있거나 조건이 다른 행입니다(알려 주세요).
COMMIT;
SELECT id, item_id, introduction_type, effective_date, attachments->0->>'caption' AS first_cap, jsonb_array_length(attachments) AS n FROM inspection_item_revisions WHERE equipment_type='에스컬레이터' AND (attachments::text LIKE '%esc\_fig%' OR attachments::text LIKE '%5.3.2.1_current_cur_f8_0%') ORDER BY item_id, id;
