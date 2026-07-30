-- 제목-본문 병합 항목 분리 정리
-- 신규 제목 조문 15개 + 하위 조문 8개 제목 제거(본문만 재저장)


-- 6.5.6 (신규)
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6', '2022-03-02', NULL, 'current', '6.5.6 카, 균형추 및 평형추의 주행구간
<2019년 3월 28일 이후 건축허가분부터 적용>');

-- 6.5.6.1 (신규)
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.1', '2022-03-02', NULL, 'current', '6.5.6.1 카, 균형추 및 평형추의 끝단 위치');

-- 6.5.6.1.1 (제목 분리, 본문만 재저장)
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6.1.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.1.1', '2022-03-02', NULL, 'current', '6.5.6.1.1 표 1에 따른 카, 균형추 및 평형추의 끝단 위치는 6.5.6에 따른 주행구간, 6.5.7 및 6.5.8에 따른 피난 공간 및 틈새에 관한 기준이 고려되어야 한다.');


-- 6.5.6.3 (신규)
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.3', '2022-03-02', NULL, 'current', '6.5.6.3 포지티브 구동 엘리베이터의 주행안내 레일 길이');

-- 6.5.6.3.1 (제목 분리, 본문만 재저장)
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6.3.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.3.1', '2022-03-02', NULL, 'current', '6.5.6.3.1 카가 상승방향으로 상부 완충기에 충돌하기 전까지 안내되는 카의 주행거리는 최상층 승강장 바닥에서부터 위로 0.5 m 이상이어야 하며, 카는 완충기 행정의 한계까지 주행되어야 한다.
주택용 엘리베이터의 경우에는 0.25 m 이상으로 완화 적용할 수 있다.');


-- 6.5.6.4 (신규)
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.4', '2022-03-02', NULL, 'current', '6.5.6.4 유압식 엘리베이터의 주행안내 레일 길이');

-- 6.5.6.4.1 (제목 분리, 본문만 재저장)
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.6.4.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.4.1', '2022-03-02', NULL, 'current', '6.5.6.4.1 카 주행안내 레일의 길이는 카가 6.5.6.1에 따른 최고 위치에 있을 때 그 가이드 슈/롤러 위로 0.1 m 이상 안내되어야 한다.');


-- 6.5.7 (신규)
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.7' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.7', '2022-03-02', NULL, 'current', '6.5.7 카 지붕의 피난공간 및 틈새');


-- 6.5.8 (신규)
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.8' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.8', '2022-03-02', NULL, 'current', '6.5.8 피트의 피난공간 및 틈새');


-- 6.6 (신규)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6', '2022-03-02', NULL, 'current', '6.6 기계실·기계류 공간 및 풀리실');


-- 6.6.3 (신규)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3', '2022-03-02', NULL, 'current', '6.6.3 기계실');


-- 6.6.3.2 (신규)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.3.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2', '2022-03-02', NULL, 'current', '6.6.3.2 기계실의 크기 등 치수');

-- 6.6.3.2.1 (제목 분리, 본문 + 종전 4단계는 그대로 재저장)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.3.2.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.1', '2022-03-02', NULL, 'current', '6.6.3.2.1 기계실은 설비의 작업이 쉽고 안전하도록 다음과 같이 충분한 크기이어야 한다.
특히, 작업구역의 유효 높이는 2.1 m 이상이어야 하고, 유효 수평면적은 다음과 같아야 한다.
가) 제어반 및 캐비닛 전면의 유효 수평면적은 다음과 같아야 한다.
1) 깊이는 외함 표면에서 측정하여 0.7 m 이상이어야 한다.
2) 폭은 다음 구분에 따른 수치 이상이어야 한다.
- 제어반 폭이 0.5 m 미만인 경우: 0.5 m
- 제어반 폭이 0.5 m 이상인 경우: 제어반 폭
나) 움직이는 부품의 점검 및 유지관리 업무 수행이 필요한 곳에 0.5 m × 0.6 m 이상의 작업구역이 있어야 한다. 수동 비상운전(13.2.3.1)이 필요할 경우에도 동일하게 적용한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.1', '2013-09-15', '2022-03-01', 'old', '6.3.3.1 기계실 크기는 설비, 특히 전기설비의 작업이 쉽고 안전하도록 충분하여야 한다.
작업구역에서 유효 높이는 2 m 이상이어야 하고 다음 사항에 적합하여야 한다.
가) 제어 패널 및 캐비닛 전면의 유효 수평면적은 아래와 같아야 한다.
1) 폭은 0.5 m 또는 제어 패널·캐비닛의 전체 폭 중에서 큰 값 이상
2) 깊이는 외함의 표면에서 측정하여 0.7 m 이상
나) 수동 비상운전 수단(12.5.1)이 필요하다면, 움직이는 부품의 유지보수 및 점검을 위한 유효 수평면적은 0.5 m × 0.6 m 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.1', '1999-01-14', '2013-09-14', 'old', '[로프식]
3.1.5(1) 주요한 기기로부터 기둥이나 벽까지의 수평거리는 30㎝ 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 없는 경우에는 그러하지 아니하다.
3.1.5(3) 바닥면부터 천장 또는 보의 하부까지의 수직거리는 2m 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 없는 경우에는 그러하지 아니하다.

[유압식]
3.2.5(1) 주요한 기기로부터 기둥이나 벽까지의 수평거리는 50㎝ 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 없는 경우에는 그러하지 아니하다.
3.2.5(2) 바닥에서부터 천장이나 보의 하단까지의 수직거리는 2m 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 없는 경우에는 그러하지 아니하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.1', '1997-08-18', '1999-01-13', 'old', '[로프식]
3.1.5(1) 주요한 기기로부터 기둥이나 벽까지의 수평거리는 30㎝ 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 없는 경우에는 그러하지 아니하다.
3.1.5(3) 바닥면부터 천장 또는 보의 하부까지의 수직거리는 2m 이상으로 하여야 한다.

[유압식]
3.2.5(1) 주요한 기기로부터 기둥이나 벽까지의 수평거리는 50㎝ 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 없는 경우에는 그러하지 아니하다.
3.2.5(2) 바닥에서부터 천장이나 보의 하단까지의 수직거리는 2m 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 없는 경우에는 그러하지 아니하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.1', NULL, '1997-08-17', 'old', '[로프식]
3.1.5(1) 주요한 기기로부터 기둥이나 벽까지의 수평거리는 30㎝ 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 없는 경우에는 그러하지 아니하다.

[유압식]
3.2.5(1) 주요한 기기로부터 기둥이나 벽까지의 수평거리는 50㎝ 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 없는 경우에는 그러하지 아니하다.
3.2.5(2) 바닥에서부터 천장이나 보의 하단까지의 수직거리는 2m 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 없는 경우에는 그러하지 아니하다.');


-- 6.6.4 (신규)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4', '2022-03-02', NULL, 'current', '6.6.4 승강로 내부의 기계류 공간');

-- 6.6.4.1 (신규)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.1', '2022-03-02', NULL, 'current', '6.6.4.1 일반사항');

-- 6.6.4.1.1 (제목 분리, 본문 + 종전 재저장)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.1.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.1.1', '2022-03-02', NULL, 'current', '6.6.4.1.1 건축물의 외벽에 반-밀폐식 승강로가 구획된 경우, 기계류는 환경적인 영향에 대비하여 적절하게 보호되어야 한다.
비고 기계류는 눈·비 및 먼지 등에 의한 안전 및 성능에 영향을 받지 않도록 IP 등급 등 특별한 예방조치가 마련되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.1.1', '2013-09-15', '2022-03-01', 'old', '6.4.1.2 건축물 외부에 부분적으로 둘러싸인 승강로 즉, 반-밀폐식 승강로의 경우, 구동기는 환경적인 영향에 대비하여 적절하게 보호되어야 한다.');


-- 6.6.4.2 (신규)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.2', '2022-03-02', NULL, 'current', '6.6.4.2 승강로 내부 작업구역의 치수');


-- 6.6.4.3 (신규)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.3', '2022-03-02', NULL, 'current', '6.6.4.3 카 내부 또는 카 지붕 위의 작업구역');

-- 6.6.4.3.1 (제목 분리, 본문 + 종전 재저장)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.3.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.3.1', '2022-03-02', NULL, 'current', '6.6.4.3.1 카 내부 또는 카 지붕에서 기계류의 점검 등 유지관리 업무를 수행하는 경우, 그 업무 수행으로 문열림출발 등 통제되지 않거나 예측되지 않은 카의 움직임이 사람을 위험하게 만들 수 있다면 다음과 같이 그 위험을 방지해야 한다.
가) 카의 위험한 움직임은 기계적인 장치에 의해 보호되어야 한다.
나) 기계적인 장치가 작동된 경우, 카의 모든 움직임은 15.2에 따른 전기안전장치에 의해 방지되어야 한다.
다) 기계적인 장치가 작동 위치에 있고 힘이 가해져 해제되지 않을 때, 점검자 등 자격자가 다음 중 어느 하나의 방법을 통해 승강로 밖으로 나올 수 있어야 한다. 또한, 탈출 절차에 관한 설명이「승강기 안전관리법 시행규칙」 제9조제5호에 따른 유지관리 매뉴얼에 포함되어야 한다.
1) 카문의 상부틀/구동부 위로 0.5 m × 0.7 m 이상 열린 승강장문
2) 8.6에 따른 카 지붕의 비상구출문
이 경우 카 안으로 안전하게 내려갈 수 있는 손잡이가 있는 발판 또는 사다리가 있어야 한다.
3) 6.3에 따른 비상문');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.3.1', '2013-09-15', '2022-03-01', 'old', '6.4.3.1 구동기의 유지보수 또는 점검을 카 내부 또는 카 지붕에서 수행하는 경우 및 유지보수 또는 점검의 결과로 제어되지 않거나 예상하지 못한 카의 움직임이 사람을 위험하게 만들 수 있는 경우에는 다음 사항에 적합하여야 한다.
가) 기계적인 장치에 의해 카의 위험스러운 움직임은 보호되어야 한다.
나) 기계적인 장치가 작동위치에 있는 경우에는 14.1.2에 적합한 전기안전장치에 의해 카의 모든 움직임이 보호되어야 한다.
다) 이 장치가 작동하고 있을 때 안전하게 유지보수 또는 점검을 수행할 수 있어야 한다.');


-- 6.6.4.4 (신규)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.4', '2022-03-02', NULL, 'current', '6.6.4.4 피트 내부의 작업구역');

-- 6.6.4.4.1 (제목 분리, 본문 + 종전 재저장)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.4.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.4.1', '2022-03-02', NULL, 'current', '6.6.4.4.1 피트에서 기계류의 점검 등 유지관리 업무를 수행하는 경우, 그 업무 수행으로 문열림출발 등 통제되지 않거나 예측되지 않은 카의 움직임이 사람을 위험하게 만들 수 없도록 다음 사항에 적합해야 한다.
가) 6.5.8.2가)의 1) 및 2)에 따른 경우를 제외하고, 작업구역의 바닥과 카의 가장 낮은 부분 사이의 수직거리 2 m 이상을 확보하기 위해 정격하중을 적재하고 정격속도로 하강하는 카를 기계적으로 정지시킬 수 있는 장치가 영구적으로 설치되어야 한다. 추락방지안전장치를 제외한 기계적인 장치에 의한 카의 감속도는 완충기(12.2)에 의한 감속도를 초과하지 않아야 된다.
나) 기계적인 장치는 카를 정지된 상태로 유지할 수 있어야 한다.
다) 기계적인 장치는 수동 또는 자동으로 작동될 수 있어야 한다.
라) 피트에 출입할 수 있는 문이 열쇠 사용에 의해 열렸을 때, 엘리베이터의 모든 움직임을 막는 15.2에 따른 전기안전장치에 의해 확인되어야 한다. 엘리베이터의 움직임은 바)에 따른 경우에만 가능해야 한다.
마) 기계적인 장치가 작동된 경우, 카의 모든 움직임이 15.2에 따른 전기안전장치에 의해 방지되어야 한다.
바) 15.2에 따른 전기안전장치에 의해 기계적인 장치가 작동 위치에 있다는 것이 확인되면, 전기적으로 구동시키는 카의 움직임은 점검운전 조작반에 의해서만 가능해야 한다.
사) 엘리베이터의 정상운전 상태로의 복귀는 점검자 등 관계자만이 접근 가능한(잠긴 캐비닛 내부 등) 승강로 외부의 전기적인 재-설정(reset) 장치에 의해서만 가능해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.4.1', '2013-09-15', '2022-03-01', 'old', '6.4.4.1 피트에서 구동기를 유지보수하거나 점검하는 경우 및 이러한 작업이 카를 움직이는데 필요한 경우 또는 제어되지 않거나 예상하지 못한 카의 움직임이 발생할 경우에는 다음 사항에 적합하여야 한다.
가) 5.7.3.3나)의 1) 및 2)에서 기술된 것을 제외하고, 작업구역의 바닥과 카의 가장 낮은 부품 사이의 수직거리를 2 m 이상으로 하기 위해 정격하중을 실은 카를 정격속도까지의 어떤 속도에서 기계적으로 정지시킬 수 있는 영구적인 장치가 설치되어야 한다. 비상정지장치 이외의 다른 기계적인 장치의 감속도는 완충기에 의한 감속도(10.4)를 초과하지 않아야 한다.
나) 기계적인 장치는 카의 정지 상태를 유지할 수 있어야 한다.
다) 기계적인 장치는 수동 또는 자동으로 작동되어야 한다.
라) 피트에서 카를 움직일 필요가 있는 경우, 14.2.1.3에 따른 점검운전 제어장치가 피트에서 사용될 수 있어야 한다.
마) 열쇠를 사용한 피트 출입문의 개방은 엘리베이터가 더 이상 움직이지 않도록 방지하는 14.1.2에 따른 전기안전장치에 의해 확인되어야 한다.
바) 기계적인 장치가 작동위치에 있을 때 14.1.2에 적합한 전기안전장치에 의해 카의 모든 움직임이 보호되어야 한다.
사) 14.1.2에 적합한 전기안전장치에 의해 확인되는 것과 같이 기계적인 장치가 작동위치에 있을 때 전기적으로 구동되는 카의 움직임은 점검운전 제어장치로만 가능하여야 한다.
아) 전기적인 복귀장치의 작동에 의해서만 엘리베이터가 정상운행으로 복귀가 가능하여야 한다. 이 장치는 승강로 외부에 설치되어 권한이 있는 사람만이 접근(잠김 캐비닛의 내부에 설치되어 있는 경우) 할 수 있어야 한다.');


-- 6.6.4.5 (신규)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.5' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5', '2022-03-02', NULL, 'current', '6.6.4.5 플랫폼 위의 작업구역');

-- 6.6.4.5.1 (제목 분리, 본문 + 종전 재저장)
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.4.5.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.1', '2022-03-02', NULL, 'current', '6.6.4.5.1 플랫폼 위에서 기계류의 점검 등 유지관리 업무를 수행하는 경우, 그 플랫폼은 다음과 같아야 한다.
가) 영구적으로 설치되어야 한다.
나) 카 또는 균형추/평형추의 주행로에 있는 경우에는 집어넣을 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.1', '2013-09-15', '2022-03-01', 'old', '6.4.5.1 구동기의 유지보수 또는 점검을 플랫폼에서 수행하는 경우, 다음 사항에 적합하여야 한다.
가) 플랫폼은 영구적으로 설치되어야 하고,
나) 플랫폼이 카 또는 균형추의 주행로에 있는 경우에는 집어넣을 수 있어야 한다.');
