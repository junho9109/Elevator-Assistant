-- 엘리베이터 연혁 추가분2: 7.7.1 그림3, 8.7.3 그림15·16, 8.7.4 그림17 (본문은 바꾸지 않음)
-- 대상 행이 정확히 4건일 때만 반영하고, 아니면 전체 롤백합니다.
\set ON_ERROR_STOP on
BEGIN;
ALTER TABLE public.inspection_item_revisions ADD COLUMN IF NOT EXISTS attachments jsonb;
ALTER TABLE public.inspection_item_revisions ADD COLUMN IF NOT EXISTS attachments_text text;
CREATE TEMP TABLE _upd (item_id text, typ text, eff text, exp text, att jsonb, atxt text) ON COMMIT DROP;
INSERT INTO _upd VALUES ('7.7.1','old','2008-11-07','2022-03-01','[{"kind": "figure", "caption": "그림 3 열쇠구멍(unlocking triangle) (치수는 밀리미터)", "images": ["e771_fig3.png"], "table": null, "notes": "", "search": "그림 3 열쇠구멍(unlocking triangle) 치수는 밀리미터(mm)"}]'::jsonb,'그림 3 열쇠구멍(unlocking triangle) 치수는 밀리미터(mm)');
INSERT INTO _upd VALUES ('7.7.1','old','2008-09-10','2008-11-06','[{"kind": "figure", "caption": "그림 3 열쇠구멍(unlocking triangle) (치수는 밀리미터)", "images": ["e771_fig3.png"], "table": null, "notes": "", "search": "그림 3 열쇠구멍(unlocking triangle) 치수는 밀리미터(mm)"}]'::jsonb,'그림 3 열쇠구멍(unlocking triangle) 치수는 밀리미터(mm)');
INSERT INTO _upd VALUES ('8.7.3','current','2019-03-28',NULL,'[{"kind": "figure", "caption": "그림 15 추락 보호 부품의 예(전기식 엘리베이터)", "images": ["e873_fig15.png"], "table": null, "notes": "", "search": "그림 15 추락 보호 부품의 예(전기식 엘리베이터) 승강로 벽 카 지붕 가장자리 로프 벨트 주행안내 레일 보호난간 0,30 m"}, {"kind": "figure", "caption": "그림 16 추락 보호 부품의 예(유압식 엘리베이터)", "images": ["e873_fig16.png"], "table": null, "notes": "", "search": "그림 16 추락 보호 부품의 예(유압식 엘리베이터) 승강로 벽 카 지붕 가장자리 램 주행안내 레일 보호난간 0,30 m"}]'::jsonb,'그림 15 추락 보호 부품의 예(전기식 엘리베이터) 승강로 벽 카 지붕 가장자리 로프 벨트 주행안내 레일 보호난간 0,30 m
그림 16 추락 보호 부품의 예(유압식 엘리베이터) 승강로 벽 카 지붕 가장자리 램 주행안내 레일 보호난간 0,30 m');
INSERT INTO _upd VALUES ('8.7.4','current','2022-03-02',NULL,'[{"kind": "figure", "caption": "그림 17 카 지붕 보호난간 – 높이", "images": ["e874_fig17.png"], "table": null, "notes": "", "search": "그림 17 카 지붕 보호난간 높이 보호난간 불필요 발보호판 높이 0.1 m 이상 0.7 m 이상의 보호난간 필요 1.1 m 이상의 보호난간 필요"}]'::jsonb,'그림 17 카 지붕 보호난간 높이 보호난간 불필요 발보호판 높이 0.1 m 이상 0.7 m 이상의 보호난간 필요 1.1 m 이상의 보호난간 필요');
WITH u AS (UPDATE public.inspection_item_revisions r SET attachments=x.att, attachments_text=x.atxt
  FROM _upd x WHERE r.equipment_type='엘리베이터' AND r.item_id=x.item_id AND r.introduction_type=x.typ
  AND COALESCE(r.effective_date,'')=COALESCE(x.eff,'') AND COALESCE(r.expiry_date,'')=COALESCE(x.exp,'') RETURNING 1) SELECT count(*) AS updated FROM u \gset
SELECT :updated AS updated_rows;
\if `[ :updated -eq 4 ] && echo 1 || echo 0`
  COMMIT;
  \echo '완료'
\else
  ROLLBACK;
  \echo '건수가 맞지 않아 취소했습니다'
\endif
