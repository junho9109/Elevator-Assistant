-- 수동 입력 데이터 (5.2, 5.3, 6, 6.1.1.x, 6.1.2.x, 6.1.3)


-- 5.2
DELETE FROM inspection_item_revisions WHERE item_id = '5.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('5.2', '2022-03-02', NULL, 'current', '5.2 모든 라벨, 주의사항, 표시 및 작동 지침은 영구적으로 부착하고, 지울 수 없고, 읽기 쉬우며 쉽게 이해할 수 있어야 한다.(필요한 경우 기호 및 심볼 추가) 이러한 것들은 견고한 재질로 눈에 띄는 위치에 한글(필요한 경우 영어 등 다른 문자를 같이 기재)로 작성되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('5.2', '2013-09-15', '2022-03-01', 'old', '15.1 일반사항 모든 경고, 표시 및 라벨 등은 지울 수 없고 읽기 쉬우며 손쉽게 이해(필요할 경우 표지 또는 기호에 의해 지원)할 수 있어야 한다. 이러한 것은 찢어질 수 없고 내구성이 있는 재질로 잘 보이는 곳에 있어야 하며 한글(필요시 다른 언어 병기 가능)로 기재되어야 한다.');

-- 5.3
DELETE FROM inspection_item_revisions WHERE item_id = '5.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('5.3', '2022-03-02', NULL, 'current', '5.3 승강기번호 승강기를 식별할 수 있는 지정된 승강기번호가 승강장문 근처와 카 내부에 부착되어야 한다. 비고 카 내부에 부착되는 승강기번호는 비상호출버튼 근처에 부착한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('5.3', '2013-09-15', '2022-03-01', 'old', '15.19 승강기 번호 승강기를 식별할 수 있는 고유번호가 승강장문 근처 및 카 내부에 부착되어 있어야 한다.');

-- 6
DELETE FROM inspection_item_revisions WHERE item_id = '6' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6', '2022-03-02', NULL, 'current', '6 승강로, 기계실·기계류 공간 및 풀리실');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6', '2008-11-07', '2022-03-01', 'old', '3.1.3(8) <삭제>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6', '2003-06-18', '2008-11-06', 'old', '3.1.3(8) 승강로의 치수는 KS B ISO 4190-1 부속서에서 규정한 치수의 면적비율에 따른다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6', '1997-08-18', '2003-06-17', 'old', '3.1.3(8) 승강로의 치수는 KS B 6830(승용엘리베이터와 승강로의 치수)에서 규정한 치수의 면적비율에 따른다.');

-- 6.1.1.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.1.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.1.1', '2022-03-02', NULL, 'current', '6.1.1.1 모든 엘리베이터 설비(엘리베이터를 구성하는 부품을 말한다)는 승강로, 기계실·기계류 공간 또는 풀리실에 위치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.1.1', '2013-09-15', '2022-03-01', 'old', '5.1.1 이 항목의 규정은 1대 이상의 엘리베이터 카가 있는 승강로에 관련된다. 5.1.2 엘리베이터의 균형추 또는 평형추는 카와 동일한 승강로에 있어야 한다.');

-- 6.1.1.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.1.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.1.2', '2022-03-02', NULL, 'current', '6.1.1.2 하나의 기계실 또는 풀리실에 여러 대의 엘리베이터가 있는 경우, 각각의 엘리베이터를 구성하는 모든 부품들(구동기, 제어반, 과속조절기, 스위치 등)은 일관되게 사용되는 숫자·문자 또는 색상으로 식별되어야 한다. 유지관리 등을 위해 카 지붕·피트 또는 필요한 다른 곳에도 동일한 방법으로 식별되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.1.2', '2015-05-13', '2022-03-01', 'old', '15.15 여러 대의 엘리베이터 서로 다른 엘리베이터의 부품이 하나의 기계실 및 풀리실에 있는 경우, 각 엘리베이터에는 모든 부품(구동기, 제어기, 조속기, 스위치 등)에 일관되게 사용되는 숫자 또는 글자로 식별되어야 한다. 유지보수 등을 용이하게 하기 위하여 카 지붕 위, 피트 내부 또는 필요한 다른 장소에는 동일한 식별 기호가 보여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.1.2', '2013-09-15', '2015-05-12', 'old', '15.15 군 관리 제어 엘리베이터 서로 다른 엘리베이터의 부품이 하나의 기계실 및 풀리실에 있는 경우, 각 엘리베이터에는 모든 부품(구동기, 제어기, 조속기, 스위치 등)에 일관되게 사용되는 숫자 또는 글자로 식별되어야 한다.');

-- 6.1.2.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.2.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.2.1', '2022-03-02', NULL, 'current', '6.1.2.1 승강로, 기계실·기계류 공간 및 풀리실은 엘리베이터 전용으로 사용되어야 한다. 엘리베이터와 관계없는 배관, 전선 또는 그 밖에 다른 용도의 설비는 승강로, 기계실·기계류 공간 및 풀리실에 설치되어서는 안 된다. 다만, 다음과 같은 설비는 설치될 수 있으나, 해당 설비의 제어장치 또는 조절장치는 승강로, 기계실·기계류 공간 및 풀리실 외부에 있어야 하며, 엘리베이터의 안전한 운행에 지장을 주지 않아야 한다. 가) 증기난방 및 고압 온수난방을 제외한 엘리베이터를 위한 냉·난방설비 나) 카에 설치되는 영상정보처리기기의 전선 등 관련 설비 다) 카에 설치되는 모니터의 전선 등 관련 설비 라) 환기를 위한 덕트 마) 소방 관련 법령에 따라 기계실 천장에 설치되는 화재감지기 본체, 비상용 스피커 및 가스계 소화설비 바) 화재 또는 연기 감지시스템에 의해 전원이 자동으로 차단되고 엘리베이터가 승강장에 정상적으로 정지했을 때에만 작동되는 스프링클러 관련 설비 사) 피트 침수를 대비한 배수 관련 설비');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.2.1', '2013-09-15', '2022-03-01', 'old', '5.8 엘리베이터 승강로의 사용 제한 승강로는 엘리베이터 전용으로 사용되어야 한다. 가) 증기난방 및 고압 온수난방을 제외한 냉·난방설비 나) 소방 관련 법령에 따른 화재감지기 본체 및 비상방송용 스피커 다) 카 내에 설치되는 CCTV의 전선 등 관련 설비 라) 카 내에 설치되는 모니터의 전선 등 관련 설비');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.2.1', NULL, '2013-09-14', 'old', '3.1.3(10) 승강로 내에는 엘리베이터와 관계없는 급배수관·가스관 및 전선관 등을 설치하지 않아야 한다. 3.1.5(7) 기계실에는 엘리베이터와 관계없는 공조설비·급배수설비·전기설비 등을 설치하지 않아야 한다. 4.1.1(1)② 기계실에는 소요설비 이외의 것이 없도록 유지되어 있어야 한다.');

-- 6.1.2.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.2.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.2.2', '2022-03-02', NULL, 'current', '6.1.2.2 기계실에는 화물용 엘리베이터, 자동차용 엘리베이터 또는 소형 화물용 엘리베이터 등 다른 형식의 엘리베이터의 설비가 설치될 수 있다.');

-- 6.1.2.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.2.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.2.3', '2022-03-02', NULL, 'current', '6.1.2.3 6.5.2.3에 따른 반-밀폐식 엘리베이터의 경우, 다음의 구분에 따른 공간은 승강로로 간주한다. 가) 벽이 있는 경우: 벽 내부 공간 나) 벽이 없는 경우: 움직일 수 있는 부품으로부터 수평거리가 1.5 m 이내인 공간');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.2.3', '2013-09-15', '2022-03-01', 'old', '5.8 비고 5.2.1.2에 따른 엘리베이터의 경우: 1. 벽이 있는 경우: 벽 내부 공간 2. 벽이 없는 경우: 움직일 수 있는 부품으로부터 수평거리가 1.5 m 이내의 공간');

-- 6.1.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.3', '2022-03-02', NULL, 'current', '6.1.3 승강로, 기계실·기계류 공간 및 풀리실의 환기 승강로, 기계실·기계류 공간 및 풀리실은 엘리베이터 이외 용도의 환기실로 사용되지 않아야 한다. 환기는 먼지, 유해한 연기 및 습기로부터 전동기, 전기설비 및 전선 등을 보호하는 방법으로 설계되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.3', '2013-09-15', '2022-03-01', 'old', '5.2.3 승강로의 환기 승강로는 적절하게 환기되어야 하며 엘리베이터 이외 용도의 환기실로는 사용되지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.3', '2004-12-01', '2013-09-14', 'old', '3.1.5(6)② 자연환기하는 경우에 환기창 또는 루버 등의 합산한 크기는 기계실 바닥면적의 1/20 이상이어야 하고, 실온은 원칙적으로 40℃ 이하를 유지할 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.3', '1997-08-18', '2004-11-30', 'old', '3.1.5(6)② 자연환기하는 경우에 환기창 또는 갤러리 등의 합산한 크기는 기계실 바닥면적의 1/20 이상이어야 하고, 실온은 원칙적으로 40℃ 이하를 유지할 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.3', NULL, '1997-08-17', 'old', '3.1.5(6) 관리, 검사에 지장이 없도록 조명 및 환기는 적절하고, 실온은 원칙적으로 40℃ 이하를 유지하도록 하여야 한다.');