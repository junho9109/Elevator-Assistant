-- 위험성평가 기능: 유해위험요인 등록 테이블 + 개인별 평가입력 테이블

CREATE TABLE IF NOT EXISTS public.risk_hazard_items (
  id SERIAL PRIMARY KEY,
  method VARCHAR(20) NOT NULL,
  work_category TEXT NOT NULL,
  sub_work TEXT,
  content TEXT NOT NULL,
  discovery_path TEXT,
  field_info TEXT,
  image_urls TEXT[],
  branch_id VARCHAR(50) NOT NULL,
  registered_by_id VARCHAR(20) NOT NULL,
  registered_by_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.risk_assessments (
  id SERIAL PRIMARY KEY,
  hazard_item_id INTEGER NOT NULL,
  branch_id VARCHAR(50) NOT NULL,
  employee_id VARCHAR(20) NOT NULL,
  employee_name VARCHAR(50) NOT NULL,
  level VARCHAR(10),
  had_accident_experience BOOLEAN,
  severity INTEGER,
  current_safety_measure TEXT,
  reduction_plan TEXT,
  implement_status VARCHAR(10),
  implement_date VARCHAR(10),
  implement_owner VARCHAR(50),
  action_result TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_risk_hazard_items_branch ON public.risk_hazard_items(branch_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_item ON public.risk_assessments(hazard_item_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_branch ON public.risk_assessments(branch_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_risk_assessments_item_employee ON public.risk_assessments(hazard_item_id, employee_id);

-- 기초 예시 3건: 사무 (체크리스트법)
INSERT INTO public.risk_hazard_items (method, work_category, sub_work, content, discovery_path, branch_id, registered_by_id, registered_by_name)
VALUES
('checklist', '사무', '사무', '사무실 내 이동 시 미끄러지거나 넘어지는 위험을 예방하기 위하여 바닥을 청결한 상태로 유지하고 있는가?', '기초 예시', '서울강서지사', '000000', '시스템(기초예시)'),
('checklist', '사무', '사무', '사무실 내 컴퓨터 등의 돌출된 부분이나 가구 등의 날카로운 모서리에 부딪힐 위험이 있는가?', '기초 예시', '서울강서지사', '000000', '시스템(기초예시)'),
('checklist', '사무', '사무', '사무실 내 출입 시 출입문의 열리는 방향에 대해 인식할 수 있도록 안내표지가 되어 있는가?', '기초 예시', '서울강서지사', '000000', '시스템(기초예시)');

-- 기초 예시 3건: 승강기 검사 (빈도강도법)
INSERT INTO public.risk_hazard_items (method, work_category, sub_work, content, discovery_path, branch_id, registered_by_id, registered_by_name)
VALUES
('freq_severity', '엘리베이터', '현장 이동', '이동 중에 바닥의 요철부, 계단 등을 보지 못하고 걸려 넘어지면서 발목이 접질리는 위험', '기초 예시', '서울강서지사', '000000', '시스템(기초예시)'),
('freq_severity', '엘리베이터', '현장 이동', '눈·비가 섞여있는 미끄러운 부분을 밟아 넘어지는 위험', '기초 예시', '서울강서지사', '000000', '시스템(기초예시)'),
('freq_severity', '엘리베이터', '카 내(승강장) 검사', '갑작스러운 문 열림으로 인한 손, 발 등의 신체 끼임 위험', '기초 예시', '서울강서지사', '000000', '시스템(기초예시)');
