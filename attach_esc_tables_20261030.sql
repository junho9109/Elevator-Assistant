-- 에스컬레이터 연혁 행에 연혁집 v2.0 표 6~10 첨부 (묶음 ②: 본문 표)
-- 전제: client/public/revision-figures/esc_tbl*.png 배포 완료.
\set ON_ERROR_STOP on
BEGIN;

-- 표 6 - 보호장치 및 기능 (3행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "table", "caption": "표 6 - 보호장치 및 기능", "images": ["esc_tbl6_protect_cur.png"], "search": "표 6 보호장치 및 기능 전기 고장에 대한 보호 전동기 보호 안전장치 보호 정전기에 대한 보호 5.12.1.2 5.12.1.3 5.12.1.4 5.12.1.5 고장 잠금"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$표 6 보호장치 및 기능 전기 고장에 대한 보호 전동기 보호 안전장치 보호 정전기에 대한 보호 5.12.1.2 5.12.1.3 5.12.1.4 5.12.1.5 고장 잠금$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.72')
WHERE id = 10062 AND item_id = '5.12.1.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2019-03-28'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_tbl6_protect_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "table", "caption": "표 6 - 보호장치 및 기능", "images": ["esc_tbl6_protect_cur.png"], "search": "표 6 보호장치 및 기능 전기 고장에 대한 보호 전동기 보호 안전장치 보호 정전기에 대한 보호 5.12.1.2 5.12.1.3 5.12.1.4 5.12.1.5 고장 잠금"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$표 6 보호장치 및 기능 전기 고장에 대한 보호 전동기 보호 안전장치 보호 정전기에 대한 보호 5.12.1.2 5.12.1.3 5.12.1.4 5.12.1.5 고장 잠금$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.72')
WHERE id = 10152 AND item_id = '5.12.2.8' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2022-03-02'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_tbl6_protect_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "table", "caption": "표 6 - 보호장치 및 기능", "images": ["esc_tbl6_protect_cur.png"], "search": "표 6 보호장치 및 기능 전기 고장에 대한 보호 전동기 보호 안전장치 보호 정전기에 대한 보호 5.12.1.2 5.12.1.3 5.12.1.4 5.12.1.5 고장 잠금"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$표 6 보호장치 및 기능 전기 고장에 대한 보호 전동기 보호 안전장치 보호 정전기에 대한 보호 5.12.1.2 5.12.1.3 5.12.1.4 5.12.1.5 고장 잠금$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.72')
WHERE id = 10198 AND item_id = '5.12.3.9' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2022-03-02'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_tbl6_protect_cur.png%';

-- 표 7 - 안전 제어 시스템 구현을 위한 요구조건 (1행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "table", "caption": "표 7 - 안전 제어 시스템 구현을 위한 요구조건", "images": ["esc_tbl7_safetycontrol_cur.png"], "search": "표 7 안전 제어 시스템 구현을 위한 요구조건 안전장치의 기능 감시 전원공급 작동 수단 감지해야 할 사항 고장 잠금 기능 전기적 차단 시퀀스 감지 5.12.2.2 5.12.2.3 5.12.2.4 5.12.2.5 5.12.2.6 5.12.2.7 5.12.2.8 5.12.2.9"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$표 7 안전 제어 시스템 구현을 위한 요구조건 안전장치의 기능 감시 전원공급 작동 수단 감지해야 할 사항 고장 잠금 기능 전기적 차단 시퀀스 감지 5.12.2.2 5.12.2.3 5.12.2.4 5.12.2.5 5.12.2.6 5.12.2.7 5.12.2.8 5.12.2.9$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.74')
WHERE id = 10082 AND item_id = '5.12.2.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2019-03-28'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_tbl7_safetycontrol_cur.png%';

-- 표 8 - 안전장치가 감지해야 할 사항 (4행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "table", "caption": "표 8 - 안전장치가 감지해야 할 사항", "images": ["esc_tbl8_detect_cur.png"], "search": "표 8 안전장치가 감지해야 할 사항 과속 감지 역전 감지 보조 브레이크 미작동 디딤판 구동 부품 파손 늘어남 인장장치 움직임 콤 끼임 손잡이 입구 끼임 스텝 팔레트 처짐 누락 브레이크 미작동 손잡이 속도 편차 점검용 덮개 비상정지장치 수동핸들 이동식 진입방지대 5.12.2.7.2 5.12.2.7.19 고장 잠금 점검모드 가능여부 SIL"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$표 8 안전장치가 감지해야 할 사항 과속 감지 역전 감지 보조 브레이크 미작동 디딤판 구동 부품 파손 늘어남 인장장치 움직임 콤 끼임 손잡이 입구 끼임 스텝 팔레트 처짐 누락 브레이크 미작동 손잡이 속도 편차 점검용 덮개 비상정지장치 수동핸들 이동식 진입방지대 5.12.2.7.2 5.12.2.7.19 고장 잠금 점검모드 가능여부 SIL$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.79~80')
WHERE id = 10083 AND item_id = '5.12.2.2' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2022-03-02'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_tbl8_detect_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "table", "caption": "표 8 - 안전장치가 감지해야 할 사항", "images": ["esc_tbl8_detect_cur.png"], "search": "표 8 안전장치가 감지해야 할 사항 과속 감지 역전 감지 보조 브레이크 미작동 디딤판 구동 부품 파손 늘어남 인장장치 움직임 콤 끼임 손잡이 입구 끼임 스텝 팔레트 처짐 누락 브레이크 미작동 손잡이 속도 편차 점검용 덮개 비상정지장치 수동핸들 이동식 진입방지대 5.12.2.7.2 5.12.2.7.19 고장 잠금 점검모드 가능여부 SIL"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$표 8 안전장치가 감지해야 할 사항 과속 감지 역전 감지 보조 브레이크 미작동 디딤판 구동 부품 파손 늘어남 인장장치 움직임 콤 끼임 손잡이 입구 끼임 스텝 팔레트 처짐 누락 브레이크 미작동 손잡이 속도 편차 점검용 덮개 비상정지장치 수동핸들 이동식 진입방지대 5.12.2.7.2 5.12.2.7.19 고장 잠금 점검모드 가능여부 SIL$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.79~80')
WHERE id = 10152 AND item_id = '5.12.2.8' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2022-03-02'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_tbl8_detect_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "table", "caption": "표 8 - 안전장치가 감지해야 할 사항", "images": ["esc_tbl8_detect_cur.png"], "search": "표 8 안전장치가 감지해야 할 사항 과속 감지 역전 감지 보조 브레이크 미작동 디딤판 구동 부품 파손 늘어남 인장장치 움직임 콤 끼임 손잡이 입구 끼임 스텝 팔레트 처짐 누락 브레이크 미작동 손잡이 속도 편차 점검용 덮개 비상정지장치 수동핸들 이동식 진입방지대 5.12.2.7.2 5.12.2.7.19 고장 잠금 점검모드 가능여부 SIL"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$표 8 안전장치가 감지해야 할 사항 과속 감지 역전 감지 보조 브레이크 미작동 디딤판 구동 부품 파손 늘어남 인장장치 움직임 콤 끼임 손잡이 입구 끼임 스텝 팔레트 처짐 누락 브레이크 미작동 손잡이 속도 편차 점검용 덮개 비상정지장치 수동핸들 이동식 진입방지대 5.12.2.7.2 5.12.2.7.19 고장 잠금 점검모드 가능여부 SIL$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.79~80')
WHERE id = 10198 AND item_id = '5.12.3.9' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2022-03-02'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_tbl8_detect_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "table", "caption": "표 8 - 안전장치가 감지해야 할 사항", "images": ["esc_tbl8_detect_cur.png"], "search": "표 8 안전장치가 감지해야 할 사항 과속 감지 역전 감지 보조 브레이크 미작동 디딤판 구동 부품 파손 늘어남 인장장치 움직임 콤 끼임 손잡이 입구 끼임 스텝 팔레트 처짐 누락 브레이크 미작동 손잡이 속도 편차 점검용 덮개 비상정지장치 수동핸들 이동식 진입방지대 5.12.2.7.2 5.12.2.7.19 고장 잠금 점검모드 가능여부 SIL"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$표 8 안전장치가 감지해야 할 사항 과속 감지 역전 감지 보조 브레이크 미작동 디딤판 구동 부품 파손 늘어남 인장장치 움직임 콤 끼임 손잡이 입구 끼임 스텝 팔레트 처짐 누락 브레이크 미작동 손잡이 속도 편차 점검용 덮개 비상정지장치 수동핸들 이동식 진입방지대 5.12.2.7.2 5.12.2.7.19 고장 잠금 점검모드 가능여부 SIL$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.79~80')
WHERE id = 10216 AND item_id = '5.12.3.13.4' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2022-03-02'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_tbl8_detect_cur.png%';

-- 표 9 - 전기적 차단 시퀀스 감지에 대한 요구조건 (4행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "table", "caption": "표 9 - 전기적 차단 시퀀스 감지에 대한 요구조건", "images": ["esc_tbl9_sequence_cur.png"], "search": "표 9 전기적 차단 시퀀스 감지에 대한 요구조건 전기적 차단 시퀀스의 시간 감지 5.12.2.9.2 고장 잠금 점검 모드 가능여부"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$표 9 전기적 차단 시퀀스 감지에 대한 요구조건 전기적 차단 시퀀스의 시간 감지 5.12.2.9.2 고장 잠금 점검 모드 가능여부$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.88')
WHERE id = 10154 AND item_id = '5.12.2.9.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2019-03-28'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_tbl9_sequence_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "table", "caption": "표 9 - 전기적 차단 시퀀스 감지에 대한 요구조건", "images": ["esc_tbl9_sequence_cur.png"], "search": "표 9 전기적 차단 시퀀스 감지에 대한 요구조건 전기적 차단 시퀀스의 시간 감지 5.12.2.9.2 고장 잠금 점검 모드 가능여부"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$표 9 전기적 차단 시퀀스 감지에 대한 요구조건 전기적 차단 시퀀스의 시간 감지 5.12.2.9.2 고장 잠금 점검 모드 가능여부$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.88')
WHERE id = 10152 AND item_id = '5.12.2.8' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2022-03-02'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_tbl9_sequence_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "table", "caption": "표 9 - 전기적 차단 시퀀스 감지에 대한 요구조건", "images": ["esc_tbl9_sequence_cur.png"], "search": "표 9 전기적 차단 시퀀스 감지에 대한 요구조건 전기적 차단 시퀀스의 시간 감지 5.12.2.9.2 고장 잠금 점검 모드 가능여부"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$표 9 전기적 차단 시퀀스 감지에 대한 요구조건 전기적 차단 시퀀스의 시간 감지 5.12.2.9.2 고장 잠금 점검 모드 가능여부$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.88')
WHERE id = 10198 AND item_id = '5.12.3.9' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2022-03-02'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_tbl9_sequence_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "table", "caption": "표 9 - 전기적 차단 시퀀스 감지에 대한 요구조건", "images": ["esc_tbl9_sequence_cur.png"], "search": "표 9 전기적 차단 시퀀스 감지에 대한 요구조건 전기적 차단 시퀀스의 시간 감지 5.12.2.9.2 고장 잠금 점검 모드 가능여부"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$표 9 전기적 차단 시퀀스 감지에 대한 요구조건 전기적 차단 시퀀스의 시간 감지 5.12.2.9.2 고장 잠금 점검 모드 가능여부$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.88')
WHERE id = 10216 AND item_id = '5.12.3.13.4' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2022-03-02'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_tbl9_sequence_cur.png%';

-- 표 10 - 제어장치 및 기능 (2행)
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "table", "caption": "표 10 - 제어장치 및 기능", "images": ["esc_tbl10_control_cur.png"], "search": "표 10 제어장치 및 기능 사용 및 기동 수동 조작 자동 운전 미리 정해진 방향 양방향 모드 정지 운전자에 의한 정지 비상정지장치 보호 안전장치 허용된 정지거리 초과 시 기동 방지 운행 방향의 의도된 역전 자동 재기동 점검운전 제어 5.12.3.2 5.12.3.13"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$표 10 제어장치 및 기능 사용 및 기동 수동 조작 자동 운전 미리 정해진 방향 양방향 모드 정지 운전자에 의한 정지 비상정지장치 보호 안전장치 허용된 정지거리 초과 시 기동 방지 운행 방향의 의도된 역전 자동 재기동 점검운전 제어 5.12.3.2 5.12.3.13$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.89')
WHERE id = 10158 AND item_id = '5.12.3.1' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2022-03-02'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_tbl10_control_cur.png%';
UPDATE inspection_item_revisions SET
  attachments = COALESCE(attachments, '[]'::jsonb) || $q$[{"kind": "table", "caption": "표 10 - 제어장치 및 기능", "images": ["esc_tbl10_control_cur.png"], "search": "표 10 제어장치 및 기능 사용 및 기동 수동 조작 자동 운전 미리 정해진 방향 양방향 모드 정지 운전자에 의한 정지 비상정지장치 보호 안전장치 허용된 정지거리 초과 시 기동 방지 운행 방향의 의도된 역전 자동 재기동 점검운전 제어 5.12.3.2 5.12.3.13"}]$q$::jsonb,
  attachments_text = COALESCE(attachments_text || ' ', '') || $q$표 10 제어장치 및 기능 사용 및 기동 수동 조작 자동 운전 미리 정해진 방향 양방향 모드 정지 운전자에 의한 정지 비상정지장치 보호 안전장치 허용된 정지거리 초과 시 기동 방지 운행 방향의 의도된 역전 자동 재기동 점검운전 제어 5.12.3.2 5.12.3.13$q$,
  source = COALESCE(NULLIF(source, ''), '연혁집 v2.0 p.89')
WHERE id = 10152 AND item_id = '5.12.2.8' AND equipment_type = '에스컬레이터' AND introduction_type = 'current' AND effective_date = '2022-03-02'
  AND COALESCE(attachments::text, '') NOT LIKE '%esc_tbl10_control_cur.png%';

-- 기대 결과: UPDATE 총 14개, 각각 UPDATE 1.
COMMIT;
SELECT id, item_id, introduction_type, effective_date, jsonb_array_length(attachments) AS n, attachments::text LIKE '%esc\_tbl%' AS has_tbl FROM inspection_item_revisions WHERE equipment_type='에스컬레이터' AND attachments::text LIKE '%esc\_tbl%' ORDER BY item_id, id;
