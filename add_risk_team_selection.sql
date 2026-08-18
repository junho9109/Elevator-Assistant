-- 위험성평가 팀별 예시/선택 구조 추가
-- 1) risk_hazard_items에 team(팀), is_template(관리자 예시 여부) 컬럼 추가
--    기존 행은 team=NULL(미분류), is_template=false로 채워져 새 "선택됨" 목록에는 자동으로 나타나지 않는다.
ALTER TABLE risk_hazard_items ADD COLUMN IF NOT EXISTS team varchar(50);
ALTER TABLE risk_hazard_items ADD COLUMN IF NOT EXISTS is_template boolean NOT NULL DEFAULT false;

-- 2) 항목별 선택 기록 테이블 (항목 1개 = 선택자 1명만 가능하도록 유니크 인덱스)
CREATE TABLE IF NOT EXISTS risk_item_selections (
  id serial PRIMARY KEY,
  hazard_item_id integer NOT NULL REFERENCES risk_hazard_items(id) ON DELETE CASCADE,
  employee_id varchar(50) NOT NULL,
  employee_name varchar(50) NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS risk_item_selections_hazard_item_id_key ON risk_item_selections(hazard_item_id);
