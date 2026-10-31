-- 엘리베이터 부속서 Ⅳ(로프의 마모 및 파손상태) 현행 연혁에 와이어로프 구조 사진 추가 (소선·스트랜드·심)
-- 전제: client/public/revision-figures/annex4_rope_structure.jpg 배포 완료
\set ON_ERROR_STOP on
BEGIN;

UPDATE inspection_item_revisions SET
  attachments = attachments || $q$[{"kind": "figure", "caption": "와이어로프 구조 사진 (소선·스트랜드·심(Core))", "images": ["annex4_rope_structure.jpg"], "search": "와이어로프 구조 사진 스트랜드 소선 심 core 꼬임 로프 구성"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text, '') || E'\n와이어로프 구조 사진 스트랜드 소선 심 core 꼬임 로프 구성'
WHERE id = 10312 AND item_id = '부속서 Ⅳ' AND equipment_type = '엘리베이터' AND introduction_type = 'current'
  AND attachments::text NOT LIKE '%annex4_rope_structure%';

-- 1행 갱신이어야 합니다. 아니면 ROLLBACK 하세요.
COMMIT;
SELECT id, item_id, jsonb_array_length(attachments) AS 첨부수 FROM inspection_item_revisions WHERE id = 10312;
