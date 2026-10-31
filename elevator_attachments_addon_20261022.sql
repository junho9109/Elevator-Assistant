-- 엘리베이터 6.4.1·6.4.2·6.4.3 경고문(상자) 이미지 첨부 — 기존 본문은 바꾸지 않음
-- 대상 3건일 때만 반영, 아니면 롤백
\set ON_ERROR_STOP on
BEGIN;
ALTER TABLE public.inspection_item_revisions ADD COLUMN IF NOT EXISTS attachments jsonb;
ALTER TABLE public.inspection_item_revisions ADD COLUMN IF NOT EXISTS attachments_text text;
CREATE TEMP TABLE _upd (item_id text, typ text, eff text, att jsonb) ON COMMIT DROP;
INSERT INTO _upd VALUES ('6.4.1','current','2022-03-02','[{"kind": "figure", "caption": "", "images": ["e641box_0.png"], "table": null, "notes": "", "search": ""}]'::jsonb);
INSERT INTO _upd VALUES ('6.4.2','current','2022-03-02','[{"kind": "figure", "caption": "", "images": ["e642box_0.png"], "table": null, "notes": "", "search": ""}]'::jsonb);
INSERT INTO _upd VALUES ('6.4.3','current','2022-03-02','[{"kind": "figure", "caption": "", "images": ["e643box_0.png"], "table": null, "notes": "", "search": ""}]'::jsonb);
WITH u AS (UPDATE public.inspection_item_revisions r SET attachments=x.att FROM _upd x WHERE r.equipment_type='엘리베이터' AND r.item_id=x.item_id AND r.introduction_type=x.typ AND r.effective_date=x.eff RETURNING 1) SELECT count(*) AS updated FROM u \gset
SELECT :updated AS updated_rows;
\if `[ :updated -eq 3 ] && echo 1 || echo 0`
  COMMIT;
  \echo '완료'
\else
  ROLLBACK;
  \echo '건수가 맞지 않아 취소했습니다'
\endif
