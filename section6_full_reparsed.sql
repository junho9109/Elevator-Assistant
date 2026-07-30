-- 6항 전체 재파싱 (현행 포함)

DELETE FROM inspection_item_revisions WHERE item_id LIKE '6.%';

INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1', '2022-03-02', NULL, 'current', '6.1 일반사항');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.1', '2022-03-02', NULL, 'current', '6.1.1 엘리베이터 설비의 배치');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.1.1', '2022-03-02', NULL, 'current', '6.1.1.1 모든 엘리베이터 설비(엘리베이터를 구성하는 부품을 말한다)는 승강로, 기계실·
기계류 공간 또는 풀리실에 위치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.1.1', '2013-09-15', '2022-03-01', 'old', '5.1.1 이 항목의 규정은 1대 이상의 엘리베이터 카가 있는 승강로에 관련된다.
5.1.2 엘리베이터의 균형추 또는 평형추는 카와 동일한 승강로에 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.1.2', '2022-03-02', NULL, 'current', '6.1.1.2 하나의 기계실 또는 풀리실에 여러 대의 엘리베이터가 있는 경우, 각각의 엘리베
이터를 구성하는 모든 부품들(구동기, 제어반, 과속조절기, 스위치 등)은 일관되게 사용
되는 숫자·문자 또는 색상으로 식별되어야 한다. 
유지관리 등을 위해 카 지붕·피트 또는 필요한 다른 곳에도 동일한 방법으로 식별되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.1.2', '2015-05-13', '2022-03-01', 'old', '15.15 여러 대의 엘리베이터
서로 다른 엘리베이터의 부품이 하나의 기계실 및 풀리실에 있는 경우, 각 엘리베이터에는 모든 부품(구동기, 제어기, 조속기, 
스위치 등)에 일관되게 사용되는 숫자 또는 글자로 식별되어야 한다. 유지보수 등을 용이하게 하기 위하여 카 지붕 위, 피트 
내부 또는 필요한 다른 장소에는 동일한 식별 기호가 보여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.1.2', '2013-09-15', '2015-05-12', 'old', '15.15 군 관리 제어 엘리베이터
서로 다른 엘리베이터의 부품이 하나의 기계실 및 풀리실에 있는 경우, 각 엘리베이터에는 모든 부품(구동기, 제어기, 조속기, 
스위치 등)에 일관되게 사용되는 숫자 또는 글자로 식별되어야 한다. 유지보수 등을 용이하게 하기 위하여 카 지붕 위, 피트 
내부 또는 필요한 다른 장소에는 동일한 식별 기호가 보여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.2', '2022-03-02', NULL, 'current', '6.1.2 승강로, 기계실ㆍ기계류 공간 및 풀리실의 사용 제한');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.2.1', '2022-03-02', NULL, 'current', '6.1.2.1 승강로, 기계실․기계류 공간 및 풀리실은 엘리베이터 전용으로 사용되어야 한다.
엘리베이터와 관계없는 배관, 전선 또는 그 밖에 다른 용도의 설비는 승강로, 기계실․
기계류 공간 및 풀리실에 설치되어서는 안 된다. 다만, 다음과 같은 설비는 설치될 수 
있으나, 해당 설비의 제어장치 또는 조절장치는 승강로, 기계실․기계류 공간 및 풀리실 
외부에 있어야 하며, 엘리베이터의 안전한 운행에 지장을 주지 않아야 한다.
  가) 증기난방 및 고압 온수난방을 제외한 엘리베이터를 위한 냉·난방설비
  나) 카에 설치되는 영상정보처리기기의 전선 등 관련 설비
  다) 카에 설치되는 모니터의 전선 등 관련 설비
  라) 환기를 위한 덕트
  마) 소방 관련 법령에 따라 기계실 천장에 설치되는 화재감지기 본체, 비상용 스피커 및 
가스계 소화설비
  바) 화재 또는 연기 감지시스템에 의해 전원(조명 전원을 포함한다)이 자동으로 차단되고
엘리베이터가 승강장에 정상적으로 정지했을 때에만 작동되는 스프링클러 관련 설비
(스프링클러 시스템은 엘리베이터를 구성하는 설비로 간주한다)
승강기 안전기준 연혁집[v1.0]
❙ 10
  사) 피트 침수를 대비한 배수 관련 설비');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.2.1', '2013-09-15', '2022-03-01', 'old', '5.8 엘리베이터 승강로의 사용 제한
승강로는 엘리베이터 전용으로 사용되어야 한다. 엘리베이터와 관계없는 배관, 전선 또는 장치 등이 있어서는 안 된다. 다만, 
다음과 같은 설비는 포함될 수 있으나 엘리베이터의 안전한 운행에 지장을 주지 않아야 한다.
 가) 증기난방 및 고압 온수난방을 제외한 엘리베이터 승강로를 위한 냉·난방설비, 다만, 냉·난방설비의 제어장치 또는 조절
장치는 승강로 외부에 있어야 한다.
 나) 소방 관련 법령에 따른 화재감지기 본체 및 비상방송용 스피커
 다) 카 내에 설치되는 CCTV의 전선 등 관련 설비
 라) 카 내에 설치되는 모니터의 전선 등 관련 설비
  비고 5.2.1.2에 따른 엘리베이터의 경우, 다음과 같은 경우에 “승강로”로 간주한다.
  1. 벽이 있는 경우 : 벽 내부 공간
  2. 벽이 없는 경우 : 엘리베이터가 운행하는 동안 움직일 수 있는 부품으로부터 수평거리가 1.5 m 이내의 공간');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.1.1', '2022-03-02', NULL, 'current', '6.3.1.1 구동기 및 관련 설비가 기계실에 있는 경우, 기계실은 견고한 벽, 천장, 바닥 및 출입문으로 구획되어야 한다.
기계실은 엘리베이터 이외의 목적으로 사용되지 않아야 한다.
또한, 기계실에는 엘리베이터 이외 용도의 덕트, 케이블 또는 장치가 설치되지 않아야 한다. 다만, 다음과 같은 설비 및 장치는 
설치될 수 있다.
 가) 덤웨이터 또는 `에스컬레이터 등 승강기의 구동기
 나) 증기난방 및 고압 온수난방을 제외한 기계실의 공조기 또는 냉ㆍ난방을 위한 설비
 다) 환기를 위한 덕트
 라) 소방 관련 법령에 따라 기계실 천장에 설치되는 화재감지기 본체, 비상용 스피커 및 가스계 소화설비(제어장치는 제외)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.1.1', NULL, '2013-09-15', 'old', '3.1.3(10) 승강로 내에는 엘리베이터와 관계없는 급배수관․가스관 및 전선관 등을 설치하지 않아야 한다. 다만, 소방법에 의하여 
승강로 천장에 설치하는 화재감지기본체 및 비상방송용 스피커 등은 설치할 수 있다.
3.1.5(7) 기계실에는 엘리베이터와 관계없는 공조설비․급배수설비․전기설비․곤도라설비․항공등용 제어반․TV공청분배기․
피뢰침선․기타 설비용 동력선․무선송수신기 또는 변압기 등을 설치하지 않아야 한다. 다만, 기계실의 냉난방설비, 
환기를 위한 덕트, 소방법에 의하여 기계실 천장에 설치하는 화재감지기본체 및 비상방송용 스피커 등은 설치할 수 
있다.
4.1.1(1) 기계실의 구조 및 설비
 ② 기계실에는 소요설비 이외의 것이 없도록 유지되어 있어야 한다.
< 1992년 7월 1일 전에 설치된 엘리베이터의 경우에는 이미 설치된 설비에 대하여 적용 제외 가능 >
4.1.3(12) 승강로 내에는 엘리베이터와 관계없는 배관 또는 배선 등이 없도록 유지되어 있어야 한다.
< 1992년 7월 1일 전에 설치된 엘리베이터의 경우에는 이미 설치된 설비에 대하여 적용 제외 가능 >');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.2.2', '2022-03-02', NULL, 'current', '6.1.2.2 기계실에는 화물용 엘리베이터, 자동차용 엘리베이터 또는 소형 화물용 엘리베이터
등 다른 형식의 엘리베이터의 설비가 설치될 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.2.3', '2022-03-02', NULL, 'current', '6.1.2.3 6.5.2.3에 따른 반-밀폐식 엘리베이터의 경우, 다음의 구분에 따른 공간은 승강로로
간주한다.
  가) 벽이 있는 경우: 벽 내부 공간
  나) 벽이 없는 경우: 움직일 수 있는 부품으로부터 수평거리가 1.5 m 이내인 공간
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
11 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.2.3', '2013-09-15', '2022-03-01', 'old', '5.8 엘리베이터 승강로의 사용 제한
비고 5.2.1.2에 따른 엘리베이터의 경우, 다음과 같은 경우에 “승강로”로 간주한다.
 1. 벽이 있는 경우 : 벽 내부 공간
 2. 벽이 없는 경우 : 엘리베이터가 운행하는 동안 움직일 수 있는 부품으로부터 수평거리가 1.5 m 이내의 공간');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.3', '2022-03-02', NULL, 'current', '6.1.3 승강로, 기계실ㆍ기계류 공간 및 풀리실의 환기
  승강로, 기계실․기계류 공간 및 풀리실은 엘리베이터 이외 용도의 환기실로 사용되지 
않아야 한다. 
환기는 먼지, 유해한 연기 및 습기로부터 전동기, 전기설비 및 전선 등을 보호하는 방법
으로 설계되어야 한다.
  비고 환기에 관한 자세한 사항은 부속서 Ⅵ을 참조한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.3', '2013-09-15', '2022-03-01', 'old', '5.2.3 승강로의 환기
승강로는 적절하게 환기되어야 하며 엘리베이터 이외 용도의 환기실로는 사용되지 않아야 한다.
비고 환기구는 승강로 수평단면의 1% 이상 면적으로 승강로 꼭대기에 두는 것을 권장하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.6', '2022-03-02', NULL, 'current', '6.3.6 환기
기계실은 적절하게 환기되어야 한다. 기계실을 통한 승강로의 환기도 고려되어야 한다. 건축물의 다른 부분으로부터 신선하지 
않은 공기가 기계실로 직접 유입되지 않아야 한다. 전동기, 설비 및 전선 등은 성능에 지장이 없도록 먼지, 유해한 연기 및 
습도로부터 보호되어야 한다. 기계실은 눈·비가 유입되거나 동절기에 실온이 내려가지 않도록 조치되어야 하며 실온은 + 5 ℃에서 
+ 40 ℃ 사이에서 유지되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.8', '2022-03-02', NULL, 'current', '6.4.8 환기
구동기 공간은 적절하게 환기되어야 한다. 구동기의 전기설비는 성능에 지장이 없도록 먼지, 유해한 연기 및 습도로부터 보호되어야 
한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.8', '2004-12-01', '2022-03-01', 'old', '3.1.5(6) 기계실의 유지관리에 지장이 없도록 조명 및 환기시설은 다음 각항의  기준에 적합하여야 한다.
 ② 자연환기하는 경우에 환기창 또는 루버 등의 합산한 크기는 기계실 바닥면적의 1/20 이상이어야 하고, 실온은 원칙적으로 
40℃ 이하를 유지할 수 있어야 한다. 환기창 또는 루버 등의 크기가 부족할 경우에는 강제환기장치 또는 공조장치를 설치하여야 
하며, 루버를 설치하는 경우에는 눈․비가 유입되거나 동절기에 실온이 내려가지 않도록 덧창을 설치하여야 한다.
4.1.1(1) 기계실의 구조 및 설비
 ③ 유지관리에 지장이 없도록 기계실의 조도는 기기가 배치된 바닥면에서 100Lux 이상이어야 하고, 환기는 적절하여야 하며, 
실온은 원칙적으로 40℃ 이하를 유지하도록 하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.8', '1997-08-18', '2004-11-30', 'old', '3.1.5(6) 기계실의 유지관리에 지장이 없도록 조명 및 환기시설은 다음 각항의  기준에 적합하여야 한다.
 ② 자연환기하는 경우에 환기창 또는 갤러리 등의 합산한 크기는 기계실 바닥면적의 1/20 이상이어야 하고, 실온은 원칙적
으로 40℃ 이하를 유지할 수 있어야 한다. 환기창 또는 갤러리 등의 크기가 부족할 경우에는 강제환기장치 또는 공조장
치를 설치하여야 하며, 갤러리를 설치하는 경우에는 눈․비가 유입되거나 동절기에 실온이 내려가지 않도록 덧창을 설
치하여야 한다
4.1.1(1) 기계실의 구조 및 설비
 ③ 유지관리에 지장이 없도록 기계실의 조도는 기기가 배치된 바닥면에서 100Lux 이상이어야 하고, 환기는 적절하여야 하
며, 실온은 원칙적으로 40℃ 이하를 유지하도록 하여야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 12');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.8', NULL, '1997-08-18', 'old', '3.1.5(6) 관리, 검사에 지장이 없도록 조명 및 환기는 적절하고, 실온은 원칙적으로 40℃ 이하를 유지하도록 하여야 한다.
4.1.1(1) 기계실의 구조 및 설비
③ 관리, 검사에 지장이 없도록 조명 및 환기는 적절하고, 실온은 원칙적으로 40℃ 이하를 유지하도록 하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.4', '2022-03-02', NULL, 'current', '6.1.4 조명');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.4.1', '2022-03-02', NULL, 'current', '6.1.4.1 승강로에는 모든 출입문이 닫혔을 때 승강로 전 구간에 걸쳐 영구적으로 설치된 
다음의 구분에 따른 조도 이상을 밝히는 전기조명이 있어야 한다. 
조도계는 가장 밝은 광원 쪽을 향하여 측정한다.
  가) 카 지붕에서 수직 위로 1 m 떨어진 곳: 50 ㏓
  나) 피트(사람이 서 있을 수 있는 공간, 작업구역 및 작업구역 간 이동 공간) 바닥에서 
수직 위로 1 m 떨어진 곳: 50 ㏓
  다) 위 가) 및 나)에 따른 장소 이외의 장소[카 또는 부품에 의한 그림자 제외]: 20 ㏓
  상기의 조도를 확보하기 위해 충분한 조명장치가 승강로에 고정되어야 하고, 필요한 
경우에는 승강로 조명장치의 일부로 카 지붕에 조명을 추가로 고정할 수 있다.
  조명장치는 기계적인 손상으로부터 보호되어야 한다.
  조명장치의 전원공급은 14.7.1에 적합해야 한다.
  비고 업무 수행자는 점검 등 유지관리 및 검사 업무를 보다 안전하게 수행하기 위해 손전등과 같은 임시 
조명이 필요할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.4.1', '2013-09-15', '2022-03-01', 'old', '5.9 승강로 조명
승강로에는 모든 문이 닫혀있을 때 카 지붕 및 피트 바닥 위로 1 m 위치에서 조도 50 lx 이상의 영구적으로 설치된 전기조명이 
있어야 한다. 이 조명은 승강로의 천장 및 피트바닥에서 약 0.5 m에 중간전구(들)와 함께 각각 1개의 전구로 구성되어야 한다. 
다만, 카 지붕에 조도 50 lx 이상의 조명장치(전구 포함)가 설치될 경우 중간전구는 제외될 수 있다.
5.2.1.2에 따라 승강로 벽이 일부 없는 경우, 이러한 조명은 승강로 주변에 충분한 전기조명이 있다면 생략될 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.4.1', NULL, '2013-09-15', 'old', '4.1.3(21) 카 위에는 점검 및 보수관리에 지장이 없도록 작업등의 설치상태는 견고하고, 작동상태는 양호하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.4.2', '2022-03-02', NULL, 'current', '6.1.4.2 기계실·기계류 공간 및 풀리실에는 다음의 구분에 따른 조도 이상을 밝히는 영구적
으로 설치된 전기조명이 있어야 하며, 전원공급은 14.7.1에 적합해야 한다.
  가) 작업공간의 바닥 면: 200 ㏓
  나) 작업공간 간 이동 공간의 바닥 면: 50 ㏓
  비고 상기 조명은 승강로 조명의 일부일 수 있다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
13 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.4.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.7', '2022-03-02', NULL, 'current', '6.3.7 조명 및 콘센트
기계실에는 바닥 면에서 200 lx 이상을 비출 수 있는 영구적으로 설치된 전기 조명이 있어야 한다. 이 조명의 전원공급은 
13.6.1에 적합하여야 한다.
조명스위치는 쉽게 조명을 점멸할 수 있도록 기계실 출입문 가까이에 적절한 높이로 설치되어야 한다.
1개 이상의 콘센트(13.6.2)가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.9', '2022-03-02', NULL, 'current', '6.4.9 조명 및 콘센트
작업구역 및 구동기 공간은 바닥 면에 200 lx 이상을 비출 수 있는 영구적으로 설치된 전기 조명이 있어야 한다. 이 조명의 
전원공급은 13.6.1에 적합하여야 한다.
권한이 있는 사람만이 접근할 수 있고 적절한 높이로 출입지점에 가까이 설치된 조명스위치는 작업구역 및 공간의 조명을 
점멸할 수 있어야 한다.
 비고 이 조명은 승강로 조명의 일부일 수 있다.
1개 이상의 콘센트(13.6.2)가 각 작업구역에 적절히 위치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5', '2022-03-02', NULL, 'current', '6.5.5 조명 및 콘센트
구동기 캐비닛은 바닥 면에 200 lx 이상을 비출 수 있는 영구적으로 설치된 전기 조명이 있어야 한다. 이 조명의 전원공급은 
13.6.1에 적합하여야 한다. 적절한 높이로 문 가까이에 설치된 조명스위치는 캐비닛의 조명을 점멸할 수 있어야 한다. 1개 
이상의 콘센트(13.6.2)가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5', '1997-08-18', '2022-03-01', 'old', '3.1.5(6) 기계실의 유지관리에 지장이 없도록 조명 및 환기시설은 다음 각항의  기준에 적합하여야 한다.
① 조명스위치는 출입구 가까이에 설치하고, 조명전원은 엘리베이터의 제어전원과 별도로 분리하여야 하며, 조도는 기기가 
배치된 바닥면에서 100Lux 이상이어야 한다.
4.1.1(1) 기계실의 구조 및 설비
③ 유지관리에 지장이 없도록 기계실의 조도는 기기가 배치된 바닥면에서 100Lux 이상이어야 하고, 환기는 적절하여야 하며, 
실온은 원칙적으로 40℃ 이하를 유지하도록 하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5', NULL, '1997-08-18', 'old', '3.1.5(6) 관리, 검사에 지장이 없도록 조명 및 환기는 적절하고, 실온은 원칙적으로 40℃ 이하를 유지하도록 하여야 한다.
4.1.1(1) 기계실의 구조 및 설비
③ 관리, 검사에 지장이 없도록 조명 및 환기는 적절하고, 실온은 원칙적으로 40℃ 이하를 유지하도록 하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.5', '2022-03-02', NULL, 'current', '6.1.5 피트, 기계실ㆍ기계류 공간 및 풀리실의 전기 설비');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.5.1', '2022-03-02', NULL, 'current', '6.1.5.1 피트에는 다음과 같은 장치가 있어야 한다.
  가) 16.1.11에 적합하고, 피트 출입문 및 피트 바닥에서 잘 보이고 접근 가능한 정지장치.
이 정지장치는 다음 사항을 만족해야 한다.
      1) 피트 깊이가 1.6 m 이하인 경우, 정지스위치는 다음 위치에 있어야 한다.
        - 최하층 승강장 바닥에서 수직 위로 최소 0.4 m 이내 및 피트 바닥에서 수직 
위로 최대 2 m 이내
        - 승강장문 안쪽 문틀에서 수평으로 최대 0.75 m 이내
      2) 피트 깊이가 1.6 m 초과인 경우, 2개의 정지스위치는 다음 구분에 따른 위치에 
각각 있어야 한다.
        - 상부 정지스위치: 최하층 승강장 바닥에서 수직 위로 최소 1 m 이내 및 승강장문 
안쪽 문틀에서 수평으로 최대 0.75 m 이내
승강기 안전기준 연혁집[v1.0]
❙ 14
        - 하부 정지스위치: 피트 바닥에서 수직 위로 최대 1.2 m 이내 및 피난 공간에서
조작이 가능한 위치
      3) 승강장문을 제외한 피트 출입문이 있는 경우에는 정지스위치가 그 출입문 안쪽 
문틀에서 수평으로 최대 0.75 m 이내 및 피트 바닥에서 수직 위로 1.2 m 위치에
있어야 한다.
     피트에 출입할 수 있는 승강장문이 같은 층에 2개가 있는 경우, 하나의 승강장문이 
피트 출입문으로 지정되어야 하고, 출입을 위한 설비가 설치되어야 한다.
      비고 정지스위치는 나)에 따른 점검운전 조작반에 설치될 수 있다.
  나) 16.1.5에 적합하고 피난 공간에서 0.3 m 떨어진 범위 이내에서 조작할 수 있는 
영구적으로 설치된 점검운전 조작반
  다) 콘센트(14.7.2)
  라) 피트 출입문 안쪽 문틀에서 수평으로 최대 0.75 m 이내 및 피트 출입층 바닥 위로 
최소 1 m 위치에 설치된 승강로 조명(6.1.4.1)의 점멸수단
<2022년 3월 2일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.5.1', '2019-03-28', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.5.1', '2022-03-02', NULL, 'current', '6.1.5.1 피트에는 다음과 같은 장치가 있어야 한다.
 가) 16.1.11에 적합하고, 피트 출입문 및 피트 바닥에서 잘 보이고 접근 가능한 정지장치.
이 정지장치는 다음 사항을 만족해야 한다.
  1) 피트 깊이가 1.6 m 미만인 경우, 정지스위치는 다음 위치에 있어야 한다.
   - 최하층 승강장 바닥에서 수직 위로 0.4 m 이내 및 피트 바닥에서 수직 위로 2 m 이내
   - 승강장문 안쪽 문틀에서 수평으로 0.75 m 이내
  2) 피트 깊이가 1.6 m 이상인 경우, 2개의 정지스위치는 다음 구분에 따른 위치에 각각 있어야 한다.
   - 상부 정지스위치: 최하층 승강장 바닥에서 수직 위로 1 m 이내 및 승강장문 안쪽 문틀에서 수평으로 0.75 m 이내
   - 하부 정지스위치: 피트 바닥에서 수직 위로 1.2 m 이내 및 피난 공간에서 조작이 가능한 위치
  3) 승강장문을 제외한 피트 출입문이 있는 경우에는 정지스위치가 그 출입문 안쪽 문틀에서 수평으로 0.75 m 이내 및 피트 
바닥에서 수직 위로 1.2 m 이내에 있어야 한다.
     피트에 출입할 수 있는 승강장문이 같은 층에 2개가 있는 경우, 하나의 승강장문이 피트 출입문으로 지정되어야 하고, 
출입을 위한 설비가 설치되어야 한다.
      비고 정지스위치는 나)에 따른 점검운전 조작반에 설치될 수 있다.
 나) 16.1.5에 적합하고 피난 공간에서 0.3 m 떨어진 범위 이내에서 조작할 수 있는 영구적으로 설치된 점검운전 조작반
 다) 콘센트(14.7.2)
 라) 피트 출입문 안쪽 문틀에서 수평으로 0.75 m 이내 및 피트 출입층 바닥 위로 1 m 이내에 설치된 승강로 조명(6.1.4.1)의 점멸수단');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.5.1', '2013-09-15', '2022-03-01', 'old', '5.7.3.4 피트에는 다음과 같은 장치가 있어야 한다.
 가) 14.2.2 및 15.7의 규정에 적합하고 피트 출입문 및 피트 바닥에서 조작할 수 있는 정지장치
 나) 콘센트(13.6.2)
 다) 피트 출입문을 열고 쉽게 조작할 수 있는 승강로 조명(5.9)을 점멸할 수 있는 수단
15.7 피트
피트 내부의 정지스위치 또는 근처에 “정지” 라는 글자가 표기되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.5.1', '1997-01-01', '2013-09-14', 'old', '4.1.4(16) 작업등 및 피트 정지스위치의 설치상태는 견고하고, 작동상태는 양호하여야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
15 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.5.2', '2022-03-02', NULL, 'current', '6.1.5.2 기계실·기계류 공간 및 풀리실에는 다음과 같은 장치가 있어야 한다.
  가) 출입문의 가까운 곳에 적절한 높이로 설치되어 승강기 안전관리 기술자 등 관련 
자격을 갖춘 사람만이 접근할 수 있는 조명스위치
  나) 작업구역마다 적절한 위치에 설치된 1개 이상의 콘센트(14.7.2)
  다) 16.1.11에 적합하고, 각 접근 지점의 가까운 곳에 설치된 풀리실 내의 정지장치');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.5.2', '2013-09-15', '2022-03-01', 'old', '15.4.4 풀리실의 정지장치 또는 근처에 “정지” 라는 글자가 표기되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.6', '2022-03-02', NULL, 'current', '6.1.6 비상 구출
  승강로에 갇힌 사람이 빠져나올 방법이 없는 경우, 이러한 위험이 존재하는 장소(피트, 
승강로 내부 작업구역, 카 상부 등)에는 피난공간에서 조작할 수 있는 16.3에 적합한 
비상통화장치가 설치되어야 한다.
  건축물이나 시설물은 승강로 밖에서 이용자 등 사람이 갇히는 위험이 없는 구조이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.6', '2013-09-15', '2022-03-01', 'old', '5.10 비상통화장치
승강로에서 작업하는 사람이 갇히게 되어 카 또는 승강로를 통해서 빠져나올 방법이 없는 경우, 이러한 위험이 존재하는 장소에는 
비상통화장치가 설치되어야 한다.
비상통화장치는 14.2.3.2 및 14.2.3.3의 규정을 만족하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.7', '2022-03-02', NULL, 'current', '6.1.7 설비의 취급(양중용 지지대 및 고리)
  무거운 설비를 편리한 위치에서 양중할 수 있는 금속 지지대 또는 고리가 기계실·기계류 
공간 또는 승강로의 천장에 1개 이상 설치되어야 하며, 금속 지지대 또는 고리에는 
안전한 양중을 위해 허용 하중이 표시되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.7', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.8', '2022-03-02', NULL, 'current', '6.3.8 설비의 취급(양중 지지대 또는 고리)
안전한 양중하중(15.4.5)이 적정하게 표시된 양중용 금속 지지대 또는 고리는 무거운 설비를 편리한 위치에서 양중할 수 있도록 
기계실 내의 천장 또는 보의 알맞은 위치에 1개 이상 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.10', '2022-03-02', NULL, 'current', '6.4.10 설비의 취급(양중 지지대 또는 고리)
안전하게 양중할 수 있는 하중(15.4.5)이 표시된 금속 지지대 또는 고리가 무거운 설비를 편리한 위치에서 양중할 수 있도록 
구동기 공간의 알맞은 위치에 1개 이상 있어야 한다.
15.4.5 최대 허용하중은 빔이나 양중 고리에 표기되어야 한다.(6.3.8 및 6.4.10 참조)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.10', '1997-08-18', '2022-03-01', 'old', '3.1.5(5) 유압식 제외
3.1.5(5) 기계실 천장에는 기기를 양정하기 위한 고리 등을 설치하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8', '2022-03-02', NULL, 'current', '6.1.8 벽, 바닥 및 천장의 강도');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.1', '2022-03-02', NULL, 'current', '6.1.8.1 승강로, 기계실·기계류 공간 및 풀리실은 「건축법」 등 관련 법령에 적합한 구조
이어야 하고, 구동기에 의한 하중, 추락방지안전장치 작동 순간의 주행안내 레일, 카의 
편심하중, 완충기의 작용, 튀어오름방지장치의 작용, 카의 출입 또는 하역 등으로 인한 
부하를 지지할 수 있는 구조이어야 한다.(부속서 Ⅵ.1 참조)
승강기 안전기준 연혁집[v1.0]
❙ 16');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.1', '2013-09-15', '2022-03-01', 'old', '5.3 승강로의 벽, 바닥 및 천장
승강로 구조는 건축 관련 법령에 적합하여야 하고, 최소한 구동기에 의한 하중, 비상정지장치 작동 순간의 가이드 레일, 카 내의 
편심하중, 완충기의 작용, 튀어오름 방지장치의 작용, 카에 출입 또는 하역 등으로 인한 부하를 지지할 수 있어야 한다.
5.3.3 천장 강도');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.2', '2022-03-02', NULL, 'current', '6.3.2 및 6.7.1.1의 규정에도 불구하고, 매달림 가이드 레일의 경우 현수되는 부분은 최소한 부속서 Ⅲ.5.1에 따른 부하 및 힘에 
견딜 수 있어야 한다.
<2019. 3. 28. 삭제>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.2', '2022-03-02', NULL, 'current', '6.1.8.2 승강로 벽은 0.3 m × 0.3 m 면적의 원형이나 사각의 단면에 1,000 N의 힘을 
균등하게 분산하여 벽의 어느 지점에 가할 때 다음과 같은 기계적 강도를 가져야 한다.
  가) 1 ㎜를 초과하는 영구적인 변형이 없어야 한다.
  나) 15 ㎜를 초과하는 탄성 변형이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.2', '2015-05-13', '2022-03-01', 'old', '5.3.1.1 엘리베이터의 안전운행을 위하여, 0.3 m × 0.3 m 면적의 원형이나 사각의 단면에 1,000 N의 힘을 균등하게 분산하여 
벽의 어느 지점에 수직으로 가할 때, 승강로 벽은 다음과 같은 기계적 강도를 가져야 한다.
 가) 1 ㎜를 초과하는 영구변형이 없어야 한다.
 나) 15 mm를 초과하는 탄성변형이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.2', '2013-09-15', '2015-05-12', 'old', '5.3.1.1 엘리베이터의 안전운행을 위하여, 5 ㎠ 면적의 원형이나 사각의 단면에 300 N의 힘을 균등하게 분산하여 벽의 어느 
지점에 수직으로 가할 때, 승강로 벽은 다음과 같은 기계적 강도를 가져야 한다.
 가) 영구적인 변형이 없어야 한다. 
 나) 15 mm를 초과하는 탄성변형이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.3', '2022-03-02', NULL, 'current', '6.1.8.3 평면·성형 유리판은 KS L 2004에 적합한 접합유리로 만들어져야 한다.
유리판 및 그 고정설비는 0.3 m × 0.3 m 면적의 원형이나 사각의 단면에 벽 내부 및 
외부의 어느 지점마다 정적인 힘 1,000 N에 대하여 영구 변형 없이 견딜 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.3', '2013-09-15', '2022-03-01', 'old', '5.3.1.2 일반적으로 사람이 접근 가능한 승강로 벽이 평면 또는 성형 유리판인 경우, 5.2.1.2에서 요구하는 높이까지는 KS L 
2004에 적합하거나 동등 이상의 접합유리이어야 한다. 다만, 그 이외의 부분은 KS L 2002에 적합하거나 동등 이상의 
강화유리, KS L 2003에 적합하거나 동등 이상의 복층유리(16 mm 이상) 또는 KS L 2006에 적합하거나 동등 이상의 
망유리가 사용될 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.3', '2009-11-24', '2013-09-14', 'old', '3.1.3(2) 시행
3.1.3(2) 승강로의 벽 또는 울 및 출입문은 불연재료 또는 내화구조로 만들거나 씌워야 한다. 다만, 승강로의 벽(건축법 시행령 
제46조의 규정에 의하여 당해 건축물의 다른 부분과 방화구획한 부분이외의 부분에 한정) 일부에 유리를 사용할 경우에는(삭제) 
한국산업규격의 망유리․강화유리․접합유리 및 복층유리(16mm 이상)와 동등 이상의 것을 사용하여야 한다.
 비 고 “내화구조”라 함은 화재에 견딜 수 있는 성능을 가진 구조로서 국토해양부령이 정하는 기준에 적합한 구조를 말한다
(건축법 시행령 제2조제1항제7의2호).');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.3', '2008-11-07', '2009-11-23', 'old', '3.1.3(2) 시행
3.1.3(2) 승강로의 벽 또는 울 및 출입문은 불연재료로 만들거나 씌워야 한다. 다만, 승강로의 벽(건축법 시행령 제46조의 규정에 
의하여 당해 건축물의 다른 부분과 방화구획한 부분이외의 부분에 한정) 일부에 유리를 사용할 경우에는(삭제) 한국
산업규격의 망유리․강화유리․접합유리 및 복층유리(16mm 이상)와 동등 이상의 것을 사용하여야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
17 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.3', '2004-12-01', '2008-11-06', 'old', '3.1.3(2) 시행
3.1.3(2) 승강로의 벽 또는 울 및 출입문은 불연재료로 만들거나 씌워야 한다. 다만 승강로의 벽(건축법 시행령 제46조의 규정에 
의하여 당해 건축물의 다른 부분과 방화구획한 부분이외의 부분에 한정) 일부에 유리를 사용할 경우에는(비상용 제외) 
한국산업규격의 망유리·강화유리·접합유리 및 복층유리(16mm이상)와 동등 이상의 것을 사용하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.3', '1999-09-03', '2004-11-30', 'old', '3.1.3(2) 시행
3.1.3(2) 승강로의 벽 또는 울 및 출입문은 불연재료로 만들거나 씌워야 한다. 다만, 승강로의 벽 또는 출입문(건축법시행령 
제46조의 규정에 의하여 당해 건축물의 다른 부분과 방화구획한 부분 이외의 부분에 한정) 일부에 유리를 사용할 
경우에는(비상용 엘리베이터는 제외) 한국산업규격의 망유리․강화유리․접합유리 및 복층유리(16㎜ 이상)와 동등 이상의 
것을 사용하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.4', '2022-03-02', NULL, 'current', '6.1.8.4 피트 바닥은 매달린 주행안내 레일을 제외하고 각 주행안내 레일의 하부에 작용하는
힘[주행안내 레일의 중량 및 주행안내 레일에 부착되거나 연결된 부품의 중량과 비상
정지에 의한 반작용력(주행안내 레일 위의 구동기의 경우 반동에 의한 권상도르래의 
하중 등), 추락방지안전장치가 작동하는 순간의 반작용력 및 주행안내 레일 부착부에 
가해지는 힘을 더한 힘(N)]을 지지할 수 있어야 한다.(11.2.3.5 참조)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.4', '2013-09-15', '2022-03-01', 'old', '5.3.2.1 피트 바닥은 매달린 가이드 레일을 제외하고 각 가이드 레일의 하부에 작용하는 힘 즉, 가이드 레일의 중량과 비상
정지장치가 작동하는 순간의 반작용력을 더한 힘(N)을 지지할 수 있어야 한다.(부속서 Ⅲ.2.3 및 Ⅲ.2.4 참조)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.5', '2022-03-02', NULL, 'current', '6.1.8.5 피트 바닥은 전 부하 상태의 카가 완충기에 작용하였을 때 카 완충기 지지대 
아래에 부과되는 정하중의 4배를 지지할 수 있어야 한다. 
∙∙
      여기서,
      F
: 전체 수직력(N)
      
: 중력 가속도(9.81 ㎨)
      P
: 카 자중과 이동케이블,  보상 로프/체인 등 카에 의해 지지되는 부품의 
중량(㎏)
      Q
: 정격하중(㎏)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.5', '2013-09-15', '2022-03-01', 'old', '5.3.2.2 피트 바닥은 전 부하 상태의 카가 완충기에 작용하였을 때 완충기 지지대 아래에 부과되는 정하중의 4배를 지지할 
수 있어야 한다.
4ㆍgnㆍ(P+Q)
여기서,
P : 카 자중 및 이동케이블, 균형 로프/체인 등 카에 의해 지지되는 부품의 중량(㎏)
Q : 정격하중(㎏)
gn : 중력 가속도(9.81 ㎨)
승강기 안전기준 연혁집[v1.0]
❙ 18');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.6', '2022-03-02', NULL, 'current', '6.1.8.6 피트 바닥은 균형추가 완충기에 작용하였을 때 균형추 완충기 지지대 아래에 부과
되는 정하중의 4배를 지지할 수 있어야 한다.
∙∙∙
      여기서,
      F
: 전체 수직력(N)
      
: 중력 가속도(9.81 ㎨)
      P
: 카 자중 및 이동케이블, 보상 로프/체인 등 카에 의해 지지되는 부품의 
중량(㎏)
      Q
: 정격하중(㎏)
      q
: 균형추에 의해 보상되는 밸런스율');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.6', '2013-09-15', '2022-03-01', 'old', '5.3.2.3 피트 바닥은 균형추 또는 평형추의 무게에 의해 균형추 완충기 지지대 또는 평형추 주행구간 아래에 부과되는 정하중의 
4배를 지지할 수 있어야 한다.
4ㆍgnㆍ(P+qㆍQ) : 균형추
4ㆍgnㆍqㆍP    : 평형추
여기서,
P  : 카 자중 및 이동케이블, 균형 로프/체인 등 카에 의해 지지되는 부품의 중량(㎏)
Q  : 정격하중(㎏)
gn : 중력가속도(9.81 ㎨)
q  : 밸런스율(부속서 Ⅲ.2.4 참조)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.7', '2022-03-02', NULL, 'current', '6.1.8.7 유압식 엘리베이터의 경우, 피트 바닥은 각 잭의 바로 아래에 부과되는 하중 및 
힘(N)을 지지할 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.7', '2013-09-15', '2022-03-01', 'old', '5.3.2.4 피트 바닥은 각 잭의 바로 아래에 부과되는 하중 및 힘(N)을 지지할 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.8', '2022-03-02', NULL, 'current', '6.1.8.8 유압식 엘리베이터의 경우, 멈춤쇠 장치가 작동하는 동안 고정된 정지위치에 부과
되는 전체 수직력은 다음 공식에 따라 계산될 수 있다.
  가) 에너지 축적형 완충기가 적용된 멈춤 쇠 장치


∙∙
  나) 에너지 분산형 완충기가 적용된 멈춤 쇠 장치


∙∙
      여기서,
      F
: 멈춤 쇠 장치가 작동하는 동안에 고정 정지위치에 작용하는 전체 수직력
(N)
      
: 중력 가속도(9.81 ㎨)
      n
: 멈춤 쇠 장치 수
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
19 ❙
      P
: 카 자중 및 이동케이블, 보상 로프/체인 등 카에 의해 지지되는 부품의 
중량(㎏)
      Q
: 정격하중(㎏)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.8.8', '2013-09-15', '2022-03-01', 'old', '5.3.4 멈춤 쇠(pawl) 장치가 작동하는 동안 수직력의 평가
멈춤 쇠 장치가 작동하는 동안 고정된 정지위치에 부과되는 전체 수직력은 다음과 같은 공식에 따라 계산될 수 있다.
 가) 완충 복귀 움직임 여부에 관계없이, 에너지 축적형 스프링 완충기에 설치된 멈춤 쇠 장치



 나) 에너지 분산형 스프링 완충기에 설치된 멈춤 쇠 장치



여기서,
F : 멈춤 쇠 장치가 작동하는 동안에 고정 정지위치에 작용하는 전체 수직력(N)
P : 빈 카 및 카에 의해 지지되는 부품(이동 케이블, 균형로프, 균형체인 등)의 무게(㎏)
Q : 정격하중(무게), ㎏
n : 멈춤 쇠 장치 수');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9', '2022-03-02', NULL, 'current', '6.1.9 벽, 바닥 및 천장의 재질');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.1', '2022-03-02', NULL, 'current', '6.1.9.1 기계실은 당해 건축물의 다른 부분과 내화구조 또는 방화구조로 구획하고, 기계실의
내장은 준불연재료 이상으로 마감되어야 한다. 다만, 기계실 벽면이 외기에 직접 접하는 
등 「건축법」 등 관련 법령에 따른 건축물 구조상 내화구조 또는 방화구조로 구획할 
필요가 없는 경우에는 불연재료를 사용하여 구획할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.2.3', '2022-03-02', NULL, 'current', '6.3.2.3 기계실은 당해 건축물의 다른 부분과 내화구조 또는 방화구조로 구획하고 기계실의 내장은 준불연재료 이상으로 마감
되어야 한다. 다만, 기계실 벽면이 외기에 직접 접하는 등 건축물 구조상 내화구조 또는 방화구조로 구획할 필요가 
없는 경우에는 불연재료를 사용하여 구획할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.2.3', NULL, '2013-09-15', 'old', '3.1.5(4) 기계실은 당해 건축물의 다른 부분과 내화구조 또는 방화구조로 구획하고, 기계실의 내장은 준불연재료 이상의 재료로 
마감하여야 한다. 다만, 기계실 벽면이 외기에 직접 접하는 등 건축물 구조상 내화구조 또는 방화구조로 구획할 필요가 
없는 경우에는 불연재료를 사용하여 구획할 수 있다.
[유압식]
4.2.1(1) 기계실의 구조 및 설비
① 기계실의 바닥?벽 및 천장은 내화구조 또는 방화구조로 양호하게 유지되어 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.2', '2022-03-02', NULL, 'current', '6.1.9.2 승강로, 기계실·기계류 공간 및 풀리실의 벽, 바닥 및 천장은 먼지가 발생되지 않고 
내구성이 있는 재질(콘크리트, 벽돌 또는 블록 등)로 구획되어야 한다.
  바닥은 업무 수행자 등 사람이 미끄러지지 않게 하는 재질로 마감되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.2.1', '2022-03-02', NULL, 'current', '6.3.2.1 기계실은 필요로 하는 하중 및 힘에 견디도록 시공되어야 하며 먼지 등이 발생되지 않는 내구성의 재질이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.2.2', '2022-03-02', NULL, 'current', '6.3.2.2 기계실 바닥은 콘크리트 또는 체크 플레이트 등의 미끄러지지 않은 재질로 마감되어야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 20');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.2.2', '1997-08-18', '2022-03-01', 'old', '3.1.1(3) 지지보는 철골조․철근콘크리트조 또는 철골철근콘크리트조로 하여야 한다.
4.1.1(2) 수전반․주개폐기․제어반․전기배관 및 배선
 ② 제어반 기타의 제어장치의 설치상태는 견고하고, 지진 기타의 진동에 의해 움직이거나 넘어지지 않는 조치가 되어 있어야 한다.
[전기식]
4.1.1(3) 전동기․제동기 및 권상기
 ① 전동기 및 권상기의 설치상태는 견고하고, 지진 기타의 진동에 의해 움직이거나 넘어지지 않는 조치가 되어 있어야 한다. 
[유압식]
3.2.5(3) 기계실 바닥은 작동유가 침투하지 않도록 콘크리트?모르타르 등으로 시공하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.2.2', NULL, '1997-08-18', 'old', '3.1.1(3) 지지보는 철골조․철근콘크리트조 또는 철골철근콘크리트조로 하여야 한다.
4.1.1(2) 수전반․주개폐기․제어반․전기배관 및 배선
 ② 제어반 기타의 제어장치의 설치상태는 견고하고, 지진 기타의 진동에 의해 움직이거나 넘어지지 않는 조치가 되어 있어야 한다.
[전기식]
4.1.1(3) 전동기․제동기 및 권상기
 ① 전동기 및 권상기의 설치상태는 견고하고, 지진 기타의 진동에 의해 움직이거나 넘어지지 않는 조치가 되어 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.3', '2022-03-02', NULL, 'current', '6.1.9.3 피트는 주행안내 레일 고정 장치, 완충기, 배전관 등의 설치완료 후에 물이 침투
되지 않는 구조이어야 한다.
작업구역의 바닥은 완충기, 주행안내 레일 기초 및 배수 설비를 위한 부분을 제외하고 
평탄해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.3', '2013-09-15', '2022-03-01', 'old', '5.7.3.1 승강로 하부는 피트로 구성되어야 하고, 피트 바닥은 완충기, 가이드 레일 기초 및 배수장치를 위한 부분을 제외하고 
매끄럽고 평탄하여야 한다.
가이드 레일 고정설비, 완충기, 시설망 등의 설치완료 후에는 피트에 물이 침투되지 않아야 하며 누수도 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.3', NULL, '2013-09-15', 'old', '4.1.4(1) 피트에 설치된 스위치류․인장장치류 및 완충기 등이 누수․습기 또는 먼지 등으로 기능을 상실하지 않도록 누수가 
없이 청결하여야 하고, 화재의 위험이 없도록 휴지․헝겊걸레 또는 기름받이에서 넘친 기름 등이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.4', '2022-03-02', NULL, 'current', '6.1.9.4 유압식 엘리베이터의 경우, 파워 유니트가 있는 공간 및 피트는 해당 공간에 있는 
설비의 모든 유체가 새거나 유출되어도 전 유량을 수용할 수 있도록 스며들지 않는 
재질로 설치 및 마감되어야 한다. 
 <2019년 3월 28일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2', '2022-03-02', NULL, 'current', '6.2 승강로, 기계실·기계류 공간 및 풀리실 접근 및 출입');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.1', '2022-03-02', NULL, 'current', '6.2.1 승강로, 기계실·기계류 공간, 풀리실 및 관련 작업구역은 접근이 가능해야 한다. 
카 내부를 제외하고 관계자만이 접근할 수 있게 해야 한다.(부속서 Ⅴ 참조)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.2', '2022-03-02', NULL, 'current', '6.2.2 승강로, 기계실·기계류 공간, 풀리실의 출입문에 인접한 접근 통로는 50 ㏓ 이상의 
조도를 갖는 영구적으로 설치된 전기 조명에 의해 비춰야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
21 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.3', '2022-03-02', NULL, 'current', '6.2.3 6.2.1에 기술된 구역의 접근통로는 개인적인 공간에 들어갈 필요 없이 어떠한 조건
에서도 안전하게 이용되어야 한다. 다만, 주택용 엘리베이터의 경우 유지관리 및 구출 
목적을 위해 개인적인 공간을 경유해야 한다면 관계자의 출입권한 및 관련 지침이 제공
되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.3', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.1', '2022-03-02', NULL, 'current', '6.2.1 구동기 공간 및 풀리 공간의 출입문에 인접한 출입 통로는 다음과 같아야 한다.
 가) 영구적인 전기 조명장치에 의해 적절히 조명되어야 한다.
 나) 개인적인 공간에 들어갈 필요 없이 어떠한 조건에서도 안전하게 이용되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.1', '2003-06-18', '2022-03-01', 'old', '3.1.5(9)① 시행
3.1.5(9) 기계실로 가는 복도․계단 및 출입문 등은 다음 각항의 기준에 적합하여야 한다. 
 ① 복도 등 통로의 도중에 거실이 있거나 창고와 같이 화물을 쌓아 놓아서는 아니되며, 유지관리상 통행에 지장이 없도록 
기계실 출입구의 폭과 높이에 해당하는 크기 이상의 통로를 확보하여야 한다.
4.1.1(1) 기계실의 구조 및 설비
 ⑤ 기계실로 가는 복도․계단 및 출입문 등은 유지관리상 지장이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.1', '1997-08-18', '2003-06-17', 'old', '3.1.5(9) 기계실로 가는 복도․계단 및 출입문 등은 다음 각항의 기준에 적합하여야 한다. 
 ① 복도 등 통로의 도중에 거실이 있거나 창고와 같이 화물을 쌓아 놓아서는 아니 되며, 유지관리상 통행에 지장이 없도록 
기계실 출입구의 폭과 높이에 해당하는 크기의 통로를 확보하여야 한다.
4.1.1(1) 기계실의 구조 및 설비
 ⑤ 기계실로 가는 복도․계단 및 출입문 등은 유지관리상 지장이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.1', NULL, '1997-08-18', 'old', '3.1.5(9) 기기계실로 가는 복도, 계단, 출입문 등은 유지관리상 지장이 없어야 한다.” 및 “출입구의 자물쇠의 시건장치는 양호
하여야 한다.
4.1.1(1) 기계실의 구조 및 설비
⑤ 기계실로 가는 복도․계단 및 출입문 등은 유지관리상 지장이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.4', '2022-03-02', NULL, 'current', '6.2.4 피트 출입수단은 다음 구분에 따른 수단으로 구성되어야 한다.
  가) 피트 깊이가 2.5 m를 초과하는 경우: 피트 출입문
  나) 피트 깊이가 2.5 m 이하인 경우: 피트 출입문 또는 승강장문에서 쉽게 접근할 수 
있는 승강로 내부의 사다리
  피트 출입문은 6.3에 적합해야 한다.
  피트 사다리는 부속서 Ⅶ에 적합해야 한다.
  피트 사다리가 펼쳐진 위치에서 엘리베이터의 움직이는 부품과 충돌할 위험이 있는 경우, 
사다리가 보관 위치에 있지 않으면 엘리베이터가 운행되지 않도록 막는 15.2에 적합한 
전기안전장치가 있어야 한다.
사다리를 피트 바닥에 보관하는 경우, 사다리가 보관 위치에 있을 때 피트의 모든 피난
공간은 유지되어야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 22');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.4', '2015-05-13', '2022-03-01', 'old', '5.7.3.2 피트에 출입하는 수단은 다음과 같아야 한다.
 가) 피트 깊이가 2.5 m를 초과하는 경우에는 피트 출입문이 설치되어야 한다.
 나) 피트 깊이가 2.5 m 이하인 경우에는 피트 출입문 또는 점검자 등 사람이 승강장문에서 쉽게 진입할 수 있는 피트 사다리가 
설치되어야 한다.
피트 출입문은 점검문의 규정에 적합하여야 한다.(5.2.2 참조)
피트 사다리는 부속서 ⅩⅣ에 적합하여야 한다.
피트 사다리가 펼쳐진 위치에서 엘리베이터의 움직이는 부품과 충돌할 위험이 있는 경우에는 사다리가 보관위치에 있지 않을 
때 엘리베이터의 운행을 막는 14.1.2에 적합한 전기안전장치가 있어야 한다.
피트 사다리가 피트 바닥에 보관되는 경우에는 사다리가 보관위치에 있을 때 피트의 모든 대피 공간이 유지되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.4', '2013-09-15', '2015-05-12', 'old', '5.7.3.2 승강장문 이외의 피트 출입문이 있는 경우, 피트 출입문은 5.2.2의 규정에 적합하여야 한다. 피트 출입문은 피트 
깊이가 2.5 m를 초과하는 경우에 설치되어야 한다. 다른 출입 수단이 없는 경우에는 점검자가 피트 바닥으로 안전하게 
내려갈 수 있도록 승강장문에서 쉽게 진입할 수 있는 영구적인 수단이 승강로 내부에 있어야 한다. 이 수단은 엘리베이터 
설비의 주행 공간으로 돌출되지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.4', '1999-01-14', '2013-09-14', 'old', '3.1.3(12) 피트에는 유지관리상 지장이 없도록 피트점검용 사다리 또는 출입구를 설치하여야 하며, 다음 각항의 기준에 적합
하여야 한다. 다만, 피트깊이가 1.5m 미만인 경우에는 그러하지 아니하다.
 ① 사다리는 불연재료로 설치하여야 하고, 카의 운행에 지장을 주지 않고 피트 출입이 용이한 위치에 고정식으로 견고하게 
설치하여야 한다. 사다리를 출입구 양옆에 설치할 경우에는 최하층 바닥보다 1.1m 이상 높이 설치하여야 한다.
 ② 피트깊이가 3.0m를 초과하는 경우에는 출입구를 설치할 수 있다. 이 경우 잠금장치가 있는 금속제 문을 설치하고, 출입구의 
폭은 0.75m 이상, 높이는 1.2m 이상으로 하여야 한다.
 ③ 출입구가 닫혀있지 않는 경우에 엘리베이터가 움직이지 않도록 하는 도어스위치를 설치하여야 한다.
 ④ 동일 승강로에 2대 이상의 엘리베이터를 설치하는 경우에는 사다리 또는 출입구를 각각 설치하여야 하며, 1개의 출입구를 
설치하여 공용하는 경우에는 출입구에서 가장 가까운 엘리베이터만이 제3항의 규정에 의한 도어스위치와 연동하여 정지하도록 
하고, 다른 엘리베이터는 피트에 설치한 각각의 피트 정지스위치에 의해 개별정지가 가능한 구조로 하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.4', '1997-08-18', '1999-01-13', 'old', '3.1.3(12) 피트에는 유지관리상 지장이 없도록 피트점검용 사다리 또는 출입구를 설치하여야 하며, 다음 각항의 기준에 적합
하여야 한다. 다만, 피트깊이가 1.5m 미만인 경우에는 그러하지 아니하다.
① 사다리는 수직사다리로 설치하여야 한다.
② 피트깊이가 3.0m를 초과하는 경우에는 출입구를 설치할 수 있다. 이 경우 잠금장치가 있는 금속제 문을 설치하고, 출입구의 
폭은 0.75m 이상, 높이는 1.2m 이상으로 하여야 한다.
③ 출입구가 닫혀있지 않는 경우에 엘리베이터가 움직이지 않도록 하는 도어스위치를 설치하여야 한다.
④ 동일 승강로에 2대 이상의 엘리베이터를 설치하는 경우에는 사다리 또는 출입구를 각각 설치하여야 하며, 1개의 출입구를 
설치하여 공용하는 경우에는 출입구에서 가장 가까운 엘리베이터만이 제3항의 규정에 의한 도어스위치와 연동하여 정지
하도록 하고, 다른 엘리베이터는 피트에 설치한 각각의 피트 정지스위치에 의해 개별정지가 가능한 구조로 하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.4', '1995-06-07', '1997-08-17', 'old', '3.1.3(12) 피트에는 유지관리상 지장이 없도록 피트점검용 사다리 또는 출입구를 설치하여야 하며, 다음 각항의 기준에 적합
하여야 한다. 다만, 피트깊이가 1.5m 미만인 경우에는 그러하지 아니하다.
① 사다리는 수직사다리로 설치하여야 한다.
② 피트에는 유지관리상 지장이 없도록 피트 점검용 출입구 또는 사다리를 설치하여야 한다. 다만, 피트의 깊이가 1.5m미만인 
경우에는 그러하지 않는다.
③ 출입구가 닫혀있지 않는 경우에 엘리베이터가 움직이지 않도록 하는 도어스위치를 설치하여야 한다.
④ 동일 승강로에 2대 이상의 엘리베이터를 설치하는 경우에는 사다리 또는 출입구를 각각 설치하여야 하며, 1개의 출입구를 
설치하여 공용하는 경우에는 출입구에서 가장 가까운 엘리베이터만이 제3항의 규정에 의한 도어스위치와 연동하여 정지
하도록 하고, 다른 엘리베이터는 피트에 설치한 각각의 피트 정지스위치에 의해 개별정지가 가능한 구조로 하여야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
23 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.4', NULL, '1995-06-07', 'old', '3.1.3(12) 피트에는 유지관리상 지장이 없도록 피트점검용 사다리 또는 출입구를 설치하여야 하며, 다음 각항의 기준에 적합
하여야 한다. 다만, 피트깊이가 1.5m 미만인 경우에는 그러하지 아니하다.
③ 출입구가 닫혀있지 않는 경우에 엘리베이터가 움직이지 않도록 하는 도어스위치를 설치하여야 한다.
④ 동일 승강로에 2대 이상의 엘리베이터를 설치하는 경우에는 사다리 또는 출입구를 각각 설치하여야 하며, 1개의 출입구를 
설치하여 공용하는 경우에는 출입구에서 가장 가까운 엘리베이터만이 제3항의 규정에 의한 도어스위치와 연동하여 정지
하도록 하고, 다른 엘리베이터는 피트에 설치한 각각의 피트 정지스위치에 의해 개별정지가 가능한 구조로 하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.5', '2022-03-02', NULL, 'current', '6.2.5 사람이 기계실·기계류 공간 및 풀리실에 안전하게 접근 및 출입할 수 있도록 계단 
등의 통로가 있어야 하며, 통로는 계단의 설치를 우선으로 한다. 다만, 기존 건축물에 
엘리베이터를 설치한 경우 등 건축물의 구조상 계단의 설치가 불가능한 경우에는 다음 
사항을 만족하는 사다리로 대체할 수 있다.
  가) 사다리는 바닥 위에서 수직 높이로 4 m를 초과할 수 없으며, 수직 높이가 3 m를 
초과하는 사다리에는 추락 보호수단이 있어야 한다.
  나) 사다리는 접근통로에 영구적으로 설치되거나 사다리를 제거하지 못하도록 최소한 로프
또는 체인 등으로 견고하게 고정되어야 한다.
  다) 사다리는 수평면에 대해 65°이상 75°이하의 경사형 사다리로 해야 하며, 쉽게 미끄러
지거나 전도되지 않아야 한다.
  라) 사다리의 유효 폭은 0.35 m 이상이어야 하고, 발판의 깊이는 25 ㎜ 이상이어야 하며, 
발판은 1,500 N의 하중을 견디도록 설계되어야 한다.
  마) 사다리의 상부 끝 부분에 인접한 곳에는 쉽게 잡을 수 있는 손잡이가 1개 이상 
있어야 한다.
  바) 수평거리로 1.5 m 이내의 사다리 주위에는 추락위험을 막는 보호조치가 그 사다리의
높이 이상까지 있어야 한다.
  비고 계단을 포함한 통로는 출입문의 폭과 높이 이상이어야 하며, 계단에는 높이 0.85 m 이상의 견고한 
난간이 설치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.5', '2015-05-13', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.2', '2022-03-02', NULL, 'current', '6.2.2 구동기 공간 및 풀리 공간에 사람이 안전하게 출입할 수 있는 계단 등의 통로가 있어야 한다. 계단을 포함한 통로는 
출입문의 폭과 높이 이상이어야 하며, 계단에는 높이 0.85 m 이상의 견고한 난간이 설치되어야 한다.
계단의 설치가 불가능한 경우에는 다음 사항에 적합한 사다리가 사용되어야 한다. 다만, 사다리를 설치할 수 있는 수직높이는 
4 m 이하이다.
 가) 사다리는 영구적으로 설치되어야 한다.
 나) 출입문까지 수직 높이가 1.5 m를 초과하는 경우에 설치하는 사다리는 수평면에 대해 65°와 75° 사이의 각도로 설치되고 
쉽게 미끄러지거나 전도되지 않아야 한다. 다만, 수직높이가 1.5 m 미만의 경우에는 수직 사다리를 설치할 수 있다.
 다) 사다리의 폭은 0.35 m 이상이어야 하고, 발판의 깊이는 25 mm 이상이어야 한다. 수직 사다리의 경우 발판과 벽 사이의 
거리는 0.15 m 이상이어야 한다.
 사다리의 발판은 1,500 N의 하중을 견디도록 설계되어야 한다.
 라) 수평거리로 1.5 m 이내의 사다리 주위는 사다리 높이 이상까지 추락의 위험으로부터 보호되어야 한다.
[유압식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.3', '2022-03-02', NULL, 'current', '6.2.3 소화기 또는 소화용 모래가 구동기 공간 출입문 가까이 보기 쉬운 위치에 있어야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 24');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.3', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.2', '2022-03-02', NULL, 'current', '6.2.2 구동기 공간 및 풀리 공간에 사람이 안전하게 출입할 수 있는 계단 등의 통로가 있어야 한다. 계단을 포함한 통로는 
출입문의 폭과 높이 이상이어야 하며, 계단에는 높이 0.85 m 이상의 견고한 난간이 설치되어야 한다. 계단의 설치가 
불가능한 경우에는 다음 사항에 적합한 사다리가 사용되어야 한다. 다만, 사다리를 설치할 수 있는 수직높이는 4 m 
이하이다. 
 가) 사다리는 영구적으로 설치되어야 한다. 
 나) 출입문까지 수직 높이가 1.5 m를 초과하는 경우에 설치하는 사다리는 수평면에 대해 65°와 75° 사이의 각도로 설치되고 
쉽게 미끄러지거나 전도되지 않아야 한다. 다만, 수직높이가 1.5 m 미만의 경우에는 수직 사다리를 설치할 수 있다. 
 다) 사다리의 폭은 0.35 m 이상이어야 하고, 발판의 깊이는 25 mm 이상이어야 한다. 수직 사다리의 경우 발판과 벽 사이의 
거리는 0.15 m 이상이어야 한다. 사다리의 발판은 1,500 N의 하중을 견디도록 설계되어야 한다. 
 라) 수평거리로 1.5 m 이내의 사다리 주위는 낙하 물로부터 보호되어야 한다.
[유압식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.3', '2022-03-02', NULL, 'current', '6.2.3 소화기 또는 소화용 모래가 구동기 공간 출입문 가까이 보기 쉬운 위치에 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.3', '2003-06-18', '2022-03-01', 'old', '3.1.5(9)② 시행
3.1.5(9) 기계실로 가는 복도․계단 및 출입문 등은 다음 각항의 기준에 적합하여야 한다. 
② 계단은 불연재료로 설치하여야 하고, 발판․난간 및 경사가 있어야 하며, 계단의 폭은 0.7m 이상이여야 한다. 다만, 위의 조건
을 만족하는 사다리(원형사다리 포함)는 계단으로 간주할 수 있으며, 기계실 바닥까지의 높이가 1.5m 미만인 경우에는 수직사다
리를 설치할 수 있다. 또한, 기계실 바닥의 높이차가 45㎝를 초과하는 경우에도 계단 또는 사다리를 설치하여야 한다
[유압식]
4.2.1(1) 기계실의 구조 및 설비
② 기계실 출입구 외부 가까이 소화기 또는 소화용 모래가 보기 쉬운 위치에 놓여 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.3', '1997-08-18', '2003-06-17', 'old', '3.1.5(9) 기계실로 가는 복도․계단 및 출입문 등은 다음 각항의 기준에 적합하여야 한다. 
② 계단은 불연재료로 설치하여야 하고, 발판․난간 및 경사가 있어야 한다. 다만, 위의 조건을 만족하는 사다리(원형사다리 
포함)는 계단으로 간주할 수 있으며, 기계실 바닥까지의 높이가 1.5m 미만인 경우에는 수직사다리를 설치할 수 있다. 또한, 
기계실 바닥의 높이차가 45㎝를 초과하는 경우에도 계단 또는 사다리를 설치하여야 한다.
[유압식]
4.2.1(1) 기계실의 구조 및 설비
② 기계실 출입구 외부 가까이 소화기 또는 소화용 모래가 보기 쉬운 위치에 놓여 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.3', NULL, '1997-08-18', 'old', '3.1.5(9) 기계실로 가는 복도, 계단, 출입문 등은 유지관리상 지장이 없어야 한다.” 및 “출입구의 자물쇠의 시건장치는 양호하여야 한다.
[유압식]
4.2.1(1) 기계실의 구조 및 설비
② 기계실 출입구 외부 가까이 소화기 또는 소화용 모래가 보기 쉬운 위치에 놓여 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3', '2022-03-02', NULL, 'current', '6.3 출입문 및 비상문 – 점검문');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.1', '2022-03-02', NULL, 'current', '6.3.1 연속되는 상·하 승강장문의 문턱간 거리가 11 m를 초과한 경우에는 다음 중 어느 
하나의 조건에 적합해야 한다.
  가) 중간에 비상문이 있어야 한다.
  나) 서로 인접한 카에 8.6.2에 따른 비상구출문이 각각 있어야 한다.
  비고 비상문이 설치된 경우, 건축물에는 비상문으로의 영구적인 접근수단이 제공되어야 하며, 비상문과 
승강장문 및 비상문과 비상문의 문턱간 거리는 11 m 이하이어야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
25 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.1', '2013-09-15', '2022-03-01', 'old', '[전기식]
5.2.2.1.2 연속되는 승강장문 문턱사이의 거리가 11 m를 초과할 경우에는 다음 중 어느 하나에 적합하여야 한다.
 가) 중간에 비상문이 설치되어야 한다.
 나) 14.2.1.4에 따른 전기적 비상운전에 적합하고, 이 수단은 관련된 공간에 있어야 한다.
   - 기계실(6.3)
   - 구동기 캐비닛(6.5.2)
   - 비상 및 작동시험을 위한 운전패널(6.6)
 다) 서로 인접한 카에 8.12.3에 따른 비상구출문이 설치되어야 한다.
[유압식]
5.2.2.1.2 연속되는 승강장문 문턱사이의 거리가 11 m를 초과할 경우에는 다음 중 어느 하나에 적합하여야 한다.
가) 중간에 비상문이 설치되어야 한다.
나) 서로 인접한 카에 8.12.3에 따른 비상구출문이 설치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.2', '2022-03-02', NULL, 'current', '6.3.2 출입문, 비상문 및 점검문의 치수는 다음과 같아야 한다. 다만, 라)의 경우에는 문을 
통해 필요한 유지관리 업무를 수행하는데 충분한 크기이어야 한다.
  가) 기계실, 승강로 및 피트 출입문: 높이 1.8 m 이상, 폭 0.7 m 이상
다만, 주택용 엘리베이터의 경우 기계실 출입문은 폭 0.6 m 이상, 높이 0.6 m 이상
으로 할 수 있다.
  나) 풀리실 출입문: 높이 1.4 m 이상, 폭 0.6 m 이상
  다) 비상문: 높이 1.8 m 이상, 폭 0.5 m 이상
  라) 점검문: 높이 0.5 m 이하, 폭 0.5 m 이하');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.2', '2013-09-15', '2022-03-01', 'old', '5.2.2.1 승강로의 점검문 및 비상문은 이용자의 안전 또는 유지보수를 위한 용도 외에는 사용되지 않아야 한다.
<2019. 3. 28. 삭제>
5.2.2.1.1 점검문은 폭 0.6 m 이상, 높이 1.4 m 이상이어야 한다. 다만, 트랩 방식의 문일 경우에는 폭 0.5 m 이하, 높이 0.5 m 
이하이어야 한다. 비상문은 폭 0.35 m 이상, 높이 1.8 m 이상이어야 한다.
<2019. 3. 28. 삭제>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.4.1', '2022-03-02', NULL, 'current', '6.3.4.1 출입문은 폭 0.7 m 이상, 높이 1.8 m 이상의 금속제 문이어야 하며 기계실 외부로 완전히 열리는 구조이어야 한다. 
기계실 내부로는 열리지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.7.1', '2022-03-02', NULL, 'current', '6.4.7.1 승강로 내부의 작업구역은 승강로 벽을 통해 접근할 수 있어야 한다. 문은 승강장문 또는 다음 사항을 만족하는 문이어야 
한다.
 가) 폭은 0.6 m 이상, 높이는 1.8 m 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.7.2', '2022-03-02', NULL, 'current', '6.4.7.2 승강로 외부의 작업구역에서 승강로 내부의 구동기 공간에 출입은 다음과 같아야 한다.
 가) 문을 통해 요구된 작업을 수행할 수 있는 충분한 크기를 가져야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.7.2', '2003-06-18', '2022-03-01', 'old', '3.1.5(9) 기계실로 가는 복도․계단 및 출입문 등은 다음 각항의 기준에 적합하여야 한다. 
③ 출입문은 보수관리 및 방재를 고려하여 잠금장치가 있는 금속제 문을 설치하여야 하고, 유효 개구부의 폭 0.7m 이상, 유효 
개구부의 높이 1.8m 이상으로 하여야 하며, 출입문이 외기에 접하는 경우에는 빗물이 침입하지 않는 구조로 하여야 하고, 
부식이 없어야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 26');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.7.2', '1997-08-18', '2003-06-17', 'old', '3.1.5(9) 기계실로 가는 복도․계단 및 출입문 등은 다음 각항의 기준에 적합하여야 한다. 
③ 출입문은 보수관리 및 방재를 고려하여 잠금장치가 있는 금속제 문을 설치하여야 하고, 폭은 0.7m 이상, 높이는 1.8m 이상으로 
하여야 하며, 출입문이 외기에 접하는 경우에는 빗물이 침입하지 않는 구조로 하여야 하고, 부식이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.7.2', NULL, '1997-08-18', 'old', '3.1.5(9) 기계실로 가는 복도, 계단, 출입문 등은 유지관리상 지장이 없어야 한다.” 및 “출입구의 자물쇠의 시건장치는 양호하여야 
한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3', '2022-03-02', NULL, 'current', '6.3.3 출입문, 비상문 및 점검문은 다음과 같아야 한다.
  가) 승강로, 기계실·기계류 공간 또는 풀리실 내부로 열리지 않아야 한다.
  나) 열쇠로 조작되는 잠금장치가 있어야 하며, 그 잠금장치는 열쇠 없이 다시 닫히고 
잠길 수 있어야 한다.
  다) 기계실·기계류 공간 또는 풀리실 내부에서는 문이 잠겨 있더라도 열쇠를 사용하지 
않고 열릴 수 있어야 한다.
  라) 문 닫힘을 확인하는 15.2에 따른 전기안전장치가 있어야 한다. 다만, 기계실 출입문, 
풀리실 출입문 및 피트 출입문(위험이 없는 경우에 한정)의 경우에는 전기안전장치가
요구되지 않는다. 
위험이 없는 경우라 함은 정상운행 중인 엘리베이터의 가이드 슈/롤러, 에이프런 등을
포함한 카, 균형추 또는 평형추의 최하부와 피트 바닥 사이의 수직거리가 2 m 이상인
경우를 말한다. 
이동케이블, 보상 로프/체인과 그 관련 설비, 과속조절기 인장 풀리 및 이와 유사한 
설비는 위험하지 않은 것으로 본다.
  마) 구멍이 없어야 하고, 관련 법령에 따라 방화등급이 요구되는 경우에는 그 기준에 
적합해야 한다.
  바) 수직면의 기계적 강도는 0.3 m × 0.3 m 면적의 원형이나 사각의 단면에 1,000 N의 
힘을 균등하게 분산하여 어느 지점에 수직으로 가할 때 15 ㎜를 초과하는 탄성
변형이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3', '2013-09-15', '2022-03-01', 'old', '5.2.2.2 점검문 및 비상문은 승강로 내부로 열리지 않아야 한다.
5.2.2.2.1 문에는 열쇠로 조작되는 잠금장치가 있어야 하며, 열쇠 없이 다시 닫히고 잠길 수 있어야 한다. 점검문 및 비상문은 
문이 잠겨있더라도 승강로 내부에서 열쇠를 사용하지 않고 열릴 수 있어야 한다.
5.2.2.2.2 엘리베이터의 운행은 점검문 및 비상문이 닫힘 위치에 있을 때 자동으로 가능하여야 한다. 이 목적을 위해 14.1.2에 
적합한 전기안전장치가 사용되어야 한다.
피트 출입문과 연결된 통로가 위험구역이 아닌 경우에는 전기안전장치가 요구되지 않는다. 위험구역이 아닌 경우라 함은 정상운행 
중 가이드 슈, 에이프런 등을 포함한 카, 균형추 또는 평형추의 최하부와 피트 바닥 사이의 수직거리가 2 m 이상인 경우를 
말한다.
이동 케이블, 균형 로프․체인 및 관련 설비, 조속기 인장 풀리 및 이와 유사한 설치물은 위험한 것이 아닌 것으로 간주된다.
5.2.2.3 점검문 및 비상문은 구멍이 없어야 하고 승강장문과 동일한 기계적 강도를 만족하여야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
27 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3', '2003-06-18', '2013-09-14', 'old', '3.1.5(9)③ 시행
3.1.5(9) 기계실로 가는 복도․계단 및 출입문 등은 다음 각항의 기준에 적합하여야 한다. 
 ③ 출입문은 보수관리 및 방재를 고려하여 잠금장치가 있는 금속제 문을 설치하여야 하고, 유효 개구부의 폭 0.7m 이상, 
유효 개구부의 높이 1.8m 이상으로 하여야 하며, 출입문이 외기에 접하는 경우에는 빗물이 침입하지 않는 구조로 하여야 
하고, 부식이 없어야 한다.
4.1.1(1) 기계실의 구조 및 설비
 ④ 출입구의 자물쇠의 잠금장치는 양호하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3', '1997-08-18', '2003-06-17', 'old', '3.1.5(9) 기계실로 가는 복도․계단 및 출입문 등은 다음 각항의 기준에 적합하여야 한다. 
③ 출입문은 보수관리 및 방재를 고려하여 잠금장치가 있는 금속제 문을 설치하여야 하고, 폭은 0.7m 이상, 높이는 1.8m 이상으로 
하여야 하며, 출입문이 외기에 접하는 경우에는 빗물이 침입하지 않는 구조로 하여야 하고, 부식이 없어야 한다.
4.1.1(1) 기계실의 구조 및 설비
④ 출입구의 자물쇠의 잠금장치는 양호하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3', NULL, '1997-08-18', 'old', '3.1.5(9) 기계실로 가는 복도, 계단, 출입문 등은 유지관리상 지장이 없어야 한다.” 및 “출입구의 자물쇠의 시건장치는 양호하여야 
한다.
4.1.1(1) 기계실의 구조 및 설비
④ 출입구의 자물쇠의 잠금장치는 양호하여야 한다.
 비고 방화등급이 요구되는 경우 관련 법령에 따라야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.4.1', '2022-03-02', NULL, 'current', '6.3.4.1 출입문은 폭 0.7 m 이상, 높이 1.8 m 이상의 금속제 문이어야 하며 기계실 외부로 완전히 열리는 구조이어야 한다. 
기계실 내부로는 열리지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.4.2', '2022-03-02', NULL, 'current', '6.3.4.2 출입문은 열쇠로 조작되는 잠금장치가 있어야 하며, 기계실 내부에서 열쇠를 사용하지 않고 열릴 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.4.3', '2022-03-02', NULL, 'current', '6.3.4.3 출입문이 외기에 접하는 경우에는 빗물이 침입하지 않는 구조이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.7.1', '2022-03-02', NULL, 'current', '6.4.7.1 승강로 내부의 작업구역은 승강로 벽을 통해 접근할 수 있어야 한다. 문은 승강장문 또는 다음 사항을 만족하는 문이어야 
한다.
 나) 승강로 내부 방향으로 열리지 않아야 한다.
 다) 열쇠로 조작되는 잠금장치가 있어야 하며, 열쇠 없이 다시 닫히고 잠길 수 있어야 한다.
 라) 잠겨있더라도 승강로 내부에서 열쇠를 사용하지 않고 열릴 수 있어야 한다.
 마) 닫힌 상태를 확인하는 14.1.2에 적합한 전기안전장치가 있어야 한다.
 바) 구멍이 없어야 하고 승강장문과 동일한 기계적 강도이어야 한다. 
 비고 방화등급이 요구되는 문의 경우 관련 법령에 따라야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.7.2', '2022-03-02', NULL, 'current', '6.4.7.2 승강로 외부의 작업구역에서 승강로 내부의 구동기 공간에 출입은 다음과 같아야 한다.
 나) 승강로 추락을 막을 수 있도록 가능한 작아야 한다.
 다) 승강로 내부 방향으로 열리지 않아야 한다.
 라) 열쇠로 조작되는 잠금장치가 있어야 하며 열쇠 없이 다시 닫히고 잠길 수 있어야 한다.
 마) 잠겨있더라도 승강로 내부에서 열쇠를 사용하지 않고 열릴 수 있어야 한다.
 바) 닫힌 상태를 확인하는 14.1.2에 적합한 전기안전장치가 있어야 한다.
 사) 구멍이 없어야 하고 승강장문과 동일한 기계적 강도이어야 한다.
 비고 방화등급이 요구되는 문의 경우 관련 법령에 따라야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 28');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4', '2022-03-02', NULL, 'current', '6.4 표시');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.1', '2022-03-02', NULL, 'current', '6.4.1 기계실·기계류 공간 및 풀리실의 출입문(승강장문 및 비상운전·작동시험을 위한 패널의 
문은 제외) 외부에는 다음과 같은 경고문이 표기되어야 한다.
엘리베이터 기계실 – 위험
관계자 외 접근 금지');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.1', '2013-09-15', '2022-03-01', 'old', '15.4.1 구동기 공간 및 풀리 공간의 출입문(승강장문 및 비상운전 및 작동시험을 위한 패널의 문은 제외) 외부에는 “엘리베이터 
구동기 - 위험, 관계자 외 접근금지” 와 같은 경고문이 표기되어야 한다.
트랩문의 경우에는 “추락 위험 - 문을 닫으시오” 와 같은 경고문이 보일 수 있도록 표기되어야 한다.\
15.5.2 수동으로 개방되는 승강장문이 인접한 다른 문과 혼동될 경우는 승강장문에 “엘리베이터” 라는 글자가 표기되어야 한다.
15.4.8 기계실 내에는 “화기엄금” 표시가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.1', NULL, '2013-09-15', 'old', '4.2.1(1) 기계실의 구조 및 설비
③ 기계실 내에는 화기엄금 표시가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.2', '2022-03-02', NULL, 'current', '6.4.2 점검문 및 비상문이 있는 경우, 승강로 외부의 점검문 및 비상문 외부에는 다음과 
같은 경고문이 표기되어야 한다.
엘리베이터 승강로 – 위험
관계자 외 접근 금지');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.2', '2013-09-15', '2022-03-01', 'old', '15.5.1 점검문 또는 출입문(승강장문 제외) 근처 승강로 외부에는 “엘리베이터 승강로 - 위험, 관계자외 접근금지”와 같은 경고문이 
표기되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.3', '2022-03-02', NULL, 'current', '6.4.3 엘리베이터 승강장문 전면 바닥에는 다음과 같은 주의문이 표기되어야 한다.
문이 열리면 승강기안의 바닥을 확인한 후 탑승하기 바랍니다.
  비고 표지의 규격과 부착방법 및 부착위치에 관한 세부기준은 행정안전부장관이 별도 고시하는 「승강기 
안전운행 및 관리에 관한 운영규정」 별표 4에 따른다.
<추가 종전 기준>-----------------------------------------------');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.3', '2013-09-15', '2022-03-01', 'old', '15.5.4 다음과 같은 경우 필요한 모든 운전지침이 있는 경고문이 승강로의 적절한 위치에 표기되어야 한다.
 - 집어넣을 수 있는 플랫폼(6.4.5) 및 움직일 수 있는 멈춤 쇄기 [(6.4.5.2나)]
 - 수동 작동 기계장치 (6.4.3.1 및 6.4.4.1)
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
29 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5', '2022-03-02', NULL, 'current', '6.5 승강로');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1', '2022-03-02', NULL, 'current', '6.5.1 일반사항');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.1', '2022-03-02', NULL, 'current', '6.5.1.1 승강로에는 1대 이상의 엘리베이터 카가 있을 수 있다.
 <2019년 3월 28일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.2', '2022-03-02', NULL, 'current', '6.5.1.2 엘리베이터의 균형추 또는 평형추는 카와 동일한 승강로에 있어야 한다.
<2013년 9월 15일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.3', '2022-03-02', NULL, 'current', '6.5.1.3 승강로 내에 설치되는 돌출물은 안전상 지장이 없어야 한다.
<2013년 9월 15일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.3', NULL, '2013-09-15', 'old', '3.1.3(9) 승강로 내에 설치되는 돌출물은 엘리베이터의 운행 및 안전상 지장이 없어야 한다.
4.1.3(17) 승강로 내 설치되는 돌출물은 엘리베이터의 운행 및 안전상 지장이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.4', '2022-03-02', NULL, 'current', '6.5.1.4 승강로 내에는 각 층을 나타내는 표기가 있어야 한다.
<2013년 9월 15일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.4', NULL, '2013-09-15', 'old', '4.1.3(22) 승강로 내에는 각층을 나타내는 표기가 되어 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.5', '2022-03-02', NULL, 'current', '6.5.1.5 승강로는 누수가 없고 청결상태가 유지되는 구조이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.5', '2017-01-28', '2022-03-01', 'old', '5.1.5 승강로는 누수가 없는 구조이어야 한다.
5.1.6 승강로는 청결상태가 유지되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.5', '2013-09-15', '2017-01-27', 'old', '5.1.5 승강로는 누수가 없는 구조이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.5', NULL, '2013-09-15', 'old', '4.1.1(1) 기계실의 구조 및 설비
⑩ 기계실은 누수가 없이 청결하여야 한다.
4.1.3(25) 승강로는 누수가 없이 청결하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.6', '2022-03-02', NULL, 'current', '6.5.1.6 유압식 엘리베이터의 잭은 카와 동일한 승강로 내에 있어야 하며, 지면 또는 다른 
장소로 연장될 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.6', '2013-09-15', '2022-03-01', 'old', '[유압식]
5.1.3 엘리베이터의 잭은 카와 동일한 승강로 내에 있어야 한다. 땅속 또는 다른 장소로 연장될 수도 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2', '2022-03-02', NULL, 'current', '6.5.2 승강로의 구획');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.1', '2022-03-02', NULL, 'current', '6.5.2.1 일반사항
  엘리베이터는 다음 구분 중 어느 하나에 의해 주위와 구분되어야 한다.
  가) 불연재료 또는 내화구조의 벽, 바닥 및 천장
승강기 안전기준 연혁집[v1.0]
❙ 30
  나) 충분한 공간');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.1', '2009-11-24', '2022-03-01', 'old', '3.1.3(2) 시행
3.1.3(2) 승강로의 벽 또는 울 및 출입문은 불연재료 또는 내화구조로 만들거나 씌워야 한다. 다만, 승강로의 벽(건축법 시행령 
제46조의 규정에 의하여 당해 건축물의 다른 부분과 방화구획한 부분이외의 부분에 한정) 일부에 유리를 사용할 경우에는(삭제) 
한국산업규격의 망유리․강화유리․접합유리 및 복층유리(16mm 이상)와 동등 이상의 것을 사용하여야 한다.
 비 고 “내화구조”라 함은 화재에 견딜 수 있는 성능을 가진 구조로서 국토해양부령이 정하는 기준에 적합한 구조를 말한다
(건축법 시행령 제2조제1항제7의2호).');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.1', '2008-11-07', '2009-11-23', 'old', '3.1.3(2) 시행
3.1.3(2) 승강로의 벽 또는 울 및 출입문은 불연재료로 만들거나 씌워야 한다. 다만, 승강로의 벽(건축법 시행령 제46조의 규정에 
의하여 당해 건축물의 다른 부분과 방화구획한 부분이외의 부분에 한정) 일부에 유리를 사용할 경우에는(삭제) 한국
산업규격의 망유리․강화유리․접합유리 및 복층유리(16mm 이상)와 동등 이상의 것을 사용하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.1', '2004-12-01', '2008-11-06', 'old', '3.1.3(2) 시행
3.1.3(2) 승강로의 벽 또는 울 및 출입문은 불연재료로 만들거나 씌워야 한다. 다만 승강로의 벽(건축법 시행령 제46조의 규정에 
의하여 당해 건축물의 다른 부분과 방화구획한 부분이외의 부분에 한정) 일부에 유리를 사용할 경우에는(비상용 제외) 
한국산업규격의 망유리·강화유리·접합유리 및 복층유리(16mm이상)와 동등 이상의 것을 사용하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.1', '1999-09-03', '2004-11-30', 'old', '3.1.3(2) 시행
3.1.3(2) 승강로의 벽 또는 울 및 출입문은 불연재료로 만들거나 씌워야 한다. 다만, 승강로의 벽 또는 출입문(건축법시행령 
제46조의 규정에 의하여 당해 건축물의 다른 부분과 방화구획한 부분 이외의 부분에 한정) 일부에 유리를 사용할 
경우에는(비상용 엘리베이터는 제외) 한국산업규격의 망유리․강화유리․접합유리 및 복층유리(16㎜ 이상)와 동등 이상의 
것을 사용하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.1', '1997-08-18', '1999-09-02', 'old', '3.1.3(3) 승강로의 출입구에 접한 승강로비 또는 이와 유사한 부분은 엘리베이터 전용으로 하고, 당해부분의 벽 또는 천장이 
실내에 접하는 부분의 마감은 준불연재료로 하며, 그 하부를 불연재료로 만든 것으로 하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.2', '2022-03-02', NULL, 'current', '6.5.2.2 밀폐식 승강로');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.2.1', '2022-03-02', NULL, 'current', '6.5.2.2.1 승강로는 구멍이 없는 벽, 바닥 및 천장으로 완전히 둘러싸인 구조이어야 한다. 
다만, 다음과 같은 개구부는 허용된다.
  가) 승강장문을 설치하기 위한 개구부
  나) 승강로의 비상문 및 점검문을 설치하기 위한 개구부
  다) 화재 시 가스 및 연기의 배출을 위한 통풍구
  라) 환기구
  마) 엘리베이터 운행을 위해 필요한 기계실 또는 풀리실과 승강로 사이의 개구부
  바) 5.6에 따른 엘리베이터와 다른 엘리베이터 사이에 설치된 칸막이의 개구부<2019. 3. 28. 삭제>
<2013년 9월 15일 이후 건축허가분부터 적용>
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
31 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.2.2', '2022-03-02', NULL, 'current', '6.5.2.2.2 폭 0.15 m 이상의 승강로 내부 벽 수평 돌출부 또는 수평 빔에는 사람이 서 있지
못하도록 보호조치를 해야 한다. 다만, 8.7.4에 따른 카 상부 보호난간에 의해 접근을 
막을 수 있는 경우에는 제외한다.
  보호조치는 다음 중 어느 하나의 조건에 적합해야 한다.
  가) 0.15 m 이상의 돌출물은 수평면에 대해 45°이상으로 모따기가 되어야 한다.
  나) 수평면에 대해 45°이상의 경사진 면을 형성하고 5 ㎠ 면적의 원형 또는 정사각형 
모양의 어느 지점마다 수직으로 300 N의 힘을 균등하게 분산하여 가할 때 다음을 
만족하는 디플렉터(deflector)를 설치해야 한다.
      1) 영구적인 변형이 없어야 한다.
      2) 15 ㎜를 초과하는 탄성변형이 없어야 한다.
 <2019년 3월 28일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.3', '2022-03-02', NULL, 'current', '6.5.2.3 반-밀폐식 승강로
  내화구조 또는 방화구조가 요구되지 않는 승강로(갤러리, 중앙 홀, 타워 등에 설치된 
엘리베이터의 승강로 또는 외기에 접하는 승강로 등)는 다음과 같아야 한다.
  가) 사람이 일반적으로 접근할 수 있는 곳의 승강로 벽은 아래와 같은 상황에 처한 사람이
충분히 보호될 수 있는 높이이어야 한다.
      1) 엘리베이터의 움직이는 부품에 의해 위험하게 되는 상황
      2) 사람의 손 또는 손에 들고 있는 물건이 승강로 내의 엘리베이터의 설비에 직접 
닿아 엘리베이터의 안전운행을 방해하게 되는 상황 
  나) 높이는 그림 1 및 그림 2에 적합하고, 다음과 같아야 하다.
      1) 승강장문 측: 3.5 m 이상
      2) 다른 측면 및 움직이는 부품까지의 수평거리가 0.5 m 이하인 장소: 2.5 m 이상 
         움직이는 부품까지의 거리가 0.5 m를 초과하는 경우에는 2.5 m의 값을 순차적
으로 줄일 수 있으며, 2 m의 거리에서는 최소 1.1 m까지 줄일 수 있다.
  다) 승강로 벽은 구멍이 없어야 한다.
  라) 승강로 벽은 복도, 계단 또는 플랫폼의 가장자리로부터 최대 0.15 m 이내(그림 1참
조)에 있어야 하거나, 6.5.2.2.2에 따라 보호되어야 한다.
  마) 타 설비로 인해 엘리베이터의 운행이 방해되지 않도록 하는 보호조치가 마련되어야 
한다.[6.1.2.3나) 참조]
       비고 승강로 벽이 없는 반-밀폐식 엘리베이터의 경우 움직이는 부품으로부터 수평거리가 1.5 m 
이내인 공간에 타 설비가 없도록 보호되어야 한다.
  바) 외기에 노출된 엘리베이터(건축물 외벽에 설치된 엘리베이터 등)에는 특별한 예방
조치가 마련되어야 한다.
       비고 눈·비 등 기후적 환경 및 위치적 환경을 충분히 고려한 후에 엘리베이터를 설계, 제조·설치해야 
한다.
승강기 안전기준 연혁집[v1.0]
❙ 32
기호 설명
C 카
D 엘리베이터 움직이는 부품과의 거리 (그림2 참조)
H 승강로 벽 높이
[ 그림 1. 반-밀폐식 승강로 ]
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
33 ❙
[ 그림 2. 반 밀폐식 승강로 – 거리 ]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.3', '2013-09-15', '2022-03-01', 'old', '5.2.1.2 반-밀폐식 승강로
방화구조 또는 내화구조가 요구되지 않은 승강로(갤러리, 중앙 홀, 타워 등에 설치된 엘리베이터의 승강로 또는 외기에 접하는 
승강로 등)는 다음 사항을 모두 만족하는 경우 완전히 둘러싸인 구조일 필요는 없다.
 가) 사람이 일반적으로 접근할 수 있는 곳의 승강로 벽은 아래와 같은 상황에 처한 사람이 충분히 보호될 수 있는 높이로 
시공되어야 한다.
  - 엘리베이터의 움직이는 부품에 의한 위험한 상황
  - 승강로 내의 엘리베이터 설비에 직접 손이 닿거나 손에 있는 물건이 닿아 엘리베이터의 안전운행이 방해되는 상황
높이는 그림 1 및 그림 2에 적합하여야 한다. 즉, 다음과 같다.
 1) 승강장문 측 : 3.5 m 이상
 2) 다른 측면 및 움직이는 부품까지 수평거리가 0.5 m 이하인 장소 : 2.5 m 이상
움직이는 부품까지 거리가 0.5 m를 초과하는 경우, 2.5 m의 값을 순차적으로 줄일 수 있으며 2.0 m의 거리에서는 최소 1.1 m까지 
높이를 줄일 수 있다.
 나) 승강로 벽은 구멍이 없어야 한다.
 다) 승강로 벽은 복도, 계단 또는 플랫폼의 가장자리로부터 최대 0.15 m 이내에 시공되어야 한다.(그림 1 참조)
 라) 타 설비에 의해 엘리베이터의 운행이 간섭받지 않도록 방지대책이 마련되어야 한다. [5.8의 비고 2 참조]
 마) 외기에 노출된 엘리베이터(건축물 외벽에 설치된 엘리베이터 등)에는 특별한 예방조치가 마련되어야 한다.
 비고 반-밀폐식 승강로를 갖는 엘리베이터는 기후적 및 위치적인 환경을 충분히 고려한 후에 설치되어야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 34');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.3', '2008-11-07', '2013-09-14', 'old', '3.1.3(1) 시행
3.1.3(1) 승강로 밖의 사람이나 물건이 카 또는 균형추에 닿을 염려가 없는 구조로 된 견고한 벽 또는 울 및 출입문(비상구
출구를 포함)을 설치하여야 한다. 다만, 전망을 목적으로 설치되는 승강로 주벽이 일부 없는 엘리베이터는 사람의 
접근에 대하여 보호될 수 있도록 다음의 높이까지 둘러싸인 벽을 설치하여야 한다. 
 - 승강장 문쪽에서 최소 3.50m 이상
 - 다른 쪽 및 엘리베이터의 움직이는 부분과의 최소 수평거리가 0.5m 인 곳에서 최소 2.50m, 만일 움직이는 부분까지 거리가 
0.50m를 초과하면 2.50m의 값은 순차적으로 줄여 2.0m의 거리에서 최소 높이 1.10m까지 될 수 있다.<그림1, 그림2 참조>
 - 둘러싸인 부분은 복도, 계단 또는 플랫폼의 가장자리로부터 최대 0.15m 이내에 위치하여야 한다.
 - 유리를 사용하는 경우에는 한국산업규격의 접합유리와 동등이상의 것을 사용하여야 한다.
 - 외기에 노출된 엘리베이터 즉 건물 외벽에 설치된 엘리베이터는 추가로 전문기관의 안전성평가를 통한 특별한 예방조치가 
마련되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.3', '2022-03-02', NULL, 'current', '6.5.3 카 출입구와 마주하는 승강로 벽 및 승강장문의 구조');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.3.1', '2022-03-02', NULL, 'current', '6.5.3.1 승강로 내측과 카 문턱, 카 문틀 또는 카문의 닫히는 모서리 사이의 수평거리는 
승강로 전체 높이에 걸쳐 0.15 m 이하이어야 한다.(그림 3 참조)
  0.15 m 이하의 수평거리는 각각의 조건에 따라 다음과 같이 적용될 수 있다.
  가) 함몰부분의 수직높이가 0.5 m 이하인 경우 수평거리는 0.20 m까지 연장될 수 있다. 
이러한 함몰부분은 연속된 두 개의 승강장문 사이에 1개를 초과할 수 없다.
  나) 수직 개폐식 승강장문인 엘리베이터(화물용 엘리베이터, 자동차용 엘리베이터 등)의 
경우에는 전체 주행로에 걸쳐 수평거리가 0.20 m 까지 연장될 수 있다.
  다) 잠금해제구간에서만 열리는 7.9.2에 따른 기계적 잠금장치가 카문에 있는 경우에는 
수평거리를 제한하지 않는다.
  엘리베이터는 16.1.4 및 16.1.8에 적용되는 경우를 제외하고 카문이 잠겨야만 자동으로 
운행되어야 하며, 이 잠금은 15.2에 적합한 전기안전장치에 의해 입증되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.3.1', '2013-09-15', '2022-03-01', 'old', '5.4.1 카 출입구와 마주하는 승강장문 및 벽이나 벽의 일부분에 관련된 다음 사항은 승강로 전체 높이에 걸쳐 적용되어야 
한다.
카 출입구와 마주하는 승강로 벽과 카사이의 틈새는 11의 규정을 참조한다.
5.4.2 카 출입구와 마주하는 승강장문 및 벽이나 벽의 일부분은 문이 작동하는 틈새를 제외하고 카 출입구 전체 폭에 걸쳐 
구멍이 없는 표면으로 이루어져야 한다.
11.2 카와 카 출입구를 마주하는 벽 사이의 틈새
다음 사항은 그림 5 및 6에서 설명된다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
35 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.3.1', '2008-11-07', '2013-09-14', 'old', '3.1.3(6)② 시행
3.1.3(6) 카 바닥 앞부분과 승강로 벽과의 수평거리는 다음 각항의 기준에 적합하여야 한다. 다만, 카 도어록이 설치되어 사람의 
힘으로 열 수 없는 경우 또는 화물용(자동차용 제외) 엘리베이터의 경우에는 그러하지 아니하다.
 ① 수평거리는 125㎜ 이하이어야 하며, 출입구가 2개인 엘리베이터의 경우에는 각각의 출입구에 대하여 125㎜ 이하이어야 
한다.
 ② 수평거리가 125㎜를 초과할 경우에는 금속제판 또는 기타 불연재료를 사용하여 최상정지층의 바닥아래에서 최하정지층의 
출입구상부까지 출입문을 제외한 카 출입구에 면하는 전체부분에 대하여 보호면을 견고하게 설치하여야 한다. 이 경우 
헤더케이스상부와 보호면하단까지의 틈새는 38㎜ 이하이어야 하나, 보수관리상 부득이한 경우에는 100㎜ 이하로 할 수 
있으며, 자동차용 엘리베이터에 있어서 출입문이 상승개폐문 또는 상하개폐문일 때에 출입문이 열리는 부분에 대해서는 
보호면을 설치하지 아니할 수 있다.
4.1.2(1) 카 바닥 앞부분과 승강로 벽과의 수평거리는 다음 각항의 기준에 적합하여야 한다. 다만, 카 도어록이 설치되어 사람의 
힘으로 열 수 없는 경우 또는 화물용(자동차용 제외) 엘리베이터의 경우에는 그러하지 아니하다.
 ① 수평거리는 125㎜ 이하이어야 하며, 출입구가 2개인 엘리베이터의 경우에는 각각의 출입구에 대하여 125㎜ 이하이어야 
한다.
 ② 수평거리가 125㎜를 초과할 경우에는 금속제판 등으로 최상정지층의 바닥아래에서 최하정지층의 출입구상부까지 출입문을 
제외한 카 출입구에 면하는 전체부분에 대하여 보호면을 설치하여야 한다. 이 경우 헤더케이스상부와 보호면하단까지의 
틈새는 38㎜ 이하이어야 하나, 보수관리상 부득이한 경우에는 100㎜ 이하로 할 수 있으며, 자동차용 엘리베이터에 있어서 
출입문이 상승개폐문 또는 상하개폐문일 때에 출입문이 열리는 부분에 대해서는 보호면을 설치하지 아니할 수 있다
[ 그림 5 - 카와 카 출입구를 마주하는 벽 사이의 틈새 ]
11.2.1 승강로의 내측면과 카 문턱, 카 문틀 또는 카문의 닫히는 모서리 사이의 수평거리는 0.125 m 이하이어야 한다. 다만, 
0.125m 이하의 수평거리는 각각의 조건에 따라 다음과 같이 적용될 수 있다.
 가) 수직 높이가 0.5 m 이하인 경우에는 0.15 m까지 연장될 수 있다.
 나) 수직 개폐식 승강장문이 설치된 화물용인 경우, 주행로 전체에 걸쳐 0.15 m 까지 연장될 수 있다.
 다) 잠금해제구간에서만 열리는 기계적 잠금장치가 카문에 설치된 경우에는 제한하지 않는다.
엘리베이터는 7.7.2.2에 적용되는 경우를 제외하고 카문이 잠겨야만 자동으로 운행되어야 한다. 이 잠금은 14.1.2에 적합한 
전기안전장치에 의해 입증되어야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 36');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.3.1', '2007-09-10', '2008-11-06', 'old', '3.1.3(6), 4.1.2(1) 기준 동일, 시행
3.1.3(6)[4.1.2(1)] 카 바닥 앞부분과 승강로 벽과의 수평거리는 다음 각항의 기준에 적합하여야 한다. 다만, 카 도어록이 설치되
어 사람의 힘으로 열 수 없는 경우 또는 화물용(자동차용 제외) 엘리베이터의 경우에는 그러하지 아니하다.
 ① 수평거리는 125㎜ 이하이어야 하며, 출입구가 2개인 엘리베이터의 경우에는 각각의 출입구에 대하여 125㎜ 이하이어야 
한다.
 ② 수평거리가 125㎜를 초과할 경우에는 금속제판 등으로 최상정지층의 바닥아래에서 최하정지층의 출입구상부까지 출입문을 
제외한 카 출입구에 면하는 전체부분에 대하여 보호면을 설치하여야 한다. 이 경우 헤더케이스상부와 보호면하단까지의 
틈새는 38㎜ 이하이어야 하나, 보수관리상 부득이한 경우에는 100㎜ 이하로 할 수 있으며, 자동차용 엘리베이터에 있어서 
출입문이 상승개폐문 또는 상하개폐문일 때에 출입문이 열리는 부분에 대해서는 보호면을 설치하지 아니할 수 있다 
< 1996년 12월 31일 이전 건축허가분으로 종전의 검사기준을 적용하여 검사를 받고 사용중인 자동차용 엘리베이터는 
2009년 3월 10일부터 시행 >
③ <삭제>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.3.1', '1999-01-14', '2007-09-09', 'old', '3.1.3(6), 4.1.2(1) 시행
3.1.3(6) 카 바닥 앞부분과 승강로 벽과의 수평거리는 다음 각항의 기준에 적합하여야 한다. 다만, 카 도어록이 설치되어 사람의 
힘으로 열 수 없는 경우 또는 화물용 엘리베이터의 경우에는 그러하지 아니하다.
 ① 수평거리는 125㎜ 이하이어야 하며, 출입구가 2개인 엘리베이터의 경우에는 각각의 출입구에 대하여 125㎜ 이하이어야 
한다.
 ② 수평거리가 125㎜를 초과할 경우에는 금속제판 등으로 최상정지층의 바닥아래에서 최하정지층의 출입구상부까지 출입문을 
제외한 카 출입구에 면하는 전체부분에 대하여 보호면을 설치하여야 한다. 이 경우 헤더케이스상부와 보호면하단까지의 
틈새는 38㎜ 이하이어야 하나, 보수관리상 부득이한 경우에는 100㎜ 이하로 할 수 있으며, 자동차용 엘리베이터에 있어서 
출입문이 상승개폐문 또는 상하개폐문일 때에 출입문이 열리는 부분에 대해서는 보호면을 설치하지 아니할 수 있다
 ③ 출입구가 2개인 엘리베이터에 있어서 승강로 출입구가 없는 부분과 정지하지 않는 층이 있는 경우에도 제2항의 규정에 
의한 보호면을 설치하여야 한다.
4.1.2(1) 카 바닥 앞부분과 승강로 벽과의 수평거리(카 도어록이 설치된 경우나 화물용 엘리베이터는 제외)는 125㎜ 이하를 
유지하고 있어야 하며, 출입구가 2개인 엘리베이터의 경우에는 각각의 출입구쪽 카 바닥 앞부분과 승강로 벽과의 
수평거리는 125㎜ 이하를 유지하고 있어야 한다.
 ① 수평거리는 125㎜ 이하이어야 하며, 출입구가 2개인 엘리베이터의 경우에는 각각의 출입구에 대하여 125㎜ 이하이어야 
한다.
 ② 수평거리가 125㎜를 초과할 경우에는 금속제판 등으로 최상정지층의 바닥아래에서 최하정지층의 출입구상부까지 출입문을 
제외한 카 출입구에 면하는 전체부분에 대하여 보호면을 설치하여야 한다. 이 경우 헤더케이스상부와 보호면하단까지의 
틈새는 38㎜ 이하이어야 하나, 보수관리상 부득이한 경우에는 100㎜ 이하로 할 수 있으며, 자동차용 엘리베이터에 있어서 
출입문이 상승개폐문 또는 상하개폐문일 때에 출입문이 열리는 부분에 대해서는 보호면을 설치하지 아니할 수 있다
 ③ 출입구가 2개인 엘리베이터에 있어서 승강로 출입구가 없는 부분과 정지하지 않는 층이 있는 경우에도 제2항의 규정에 
의한 보호면을 설치하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.3.1', '1997-01-01', '1999-01-13', 'old', '3.1.3(6) 카 바닥 앞부분과 승강로 벽과의 수평거리는 다음 각항의 기준에 적합하여야 한다. 다만, 화물용 엘리베이터의 경우에는 
그러하지 아니하다.
 ① 수평거리는 125㎜ 이하이어야 하며, 출입구가 2개인 엘리베이터의 경우에는 각각의 출입구에 대하여 125㎜ 이하이어야 
한다.
 ② 수평거리가 125㎜를 초과할 경우에는 금속제판 등으로 최상정지층의 바닥아래에서 최하정지층의 출입구상부까지 출입문을 
제외한 카 출입구에 면하는 전체부분에 대하여 보호면을 설치하여야 한다. 이 경우 헤더케이스상부와 보호면하단까지의 
틈새는 38㎜ 이하이어야 하나, 보수관리상 부득이한 경우에는 100㎜ 이하로 할 수 있으며, 자동차용 엘리베이터에 있어서 
출입문이 상승개폐문 또는 상하개폐문일 때에 출입문이 열리는 부분에 대해서는 보호면을 설치하지 아니할 수 있다
 ③ 출입구가 2개인 엘리베이터에 있어서 승강로 출입구가 없는 부분과 정지하지 않는 층이 있는 경우에도 제2항의 규정에 
의한 보호면을 설치하여야 한다.
4.1.2(1) 카 바닥 앞부분과 승강로 벽과의 수평거리(화물용 엘리베이터는 제외)는 125㎜ 이하를 유지하고 있어야 하며, 출입구가 
2개인 엘리베이터의 경우에는 각각의 출입구쪽 카 바닥 앞부분과 승강로 벽과의 수평거리는 125㎜ 이하를 유지하고 
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
37 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.3.1', '1994-06-01', '1996-12-31', 'old', '3.1.3(6), 4.1.2(1) 기준 동일
3.1.3(6)[4.1.2(1)] 승객용, 침대용, 승객․화물용 엘리베이터에 있어서는 카바닥앞부분과 승강로 벽과의 수평거리는 125㎜이하
이어야 한다.”');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.3.1', NULL, '1994-06-01', 'old', '3.1.3(6), 4.1.2(1) 기준 동일
3.1.3(6)[4.1.2(1)] 승용 엘리베이터 및 침대용 엘리베이터에 있어서는 카바닥앞부분과 승강로 벽과의 수평거리는 125㎜이하이어
야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.3.2', '2022-03-02', NULL, 'current', '6.5.3.2 각 승강장문의 문턱 아랫부분은 다음과 같아야 한다.
  가) 수직면은 승강장문의 문턱에 직접 연결되어야 하며, 수직면의 폭은 카 출입구 폭에
다 양쪽 모두 25 ㎜를 더한 값 이상이어야 하고, 수직면의 높이는 잠금해제구간의 
1/2에 50 ㎜를 더한 값 이상이어야 한다.
  나) 수직면의 표면은 연속적이며 매끈하고 견고한 재질(금속판 등)이어야 한다. 또한, 
수직면의 기계적 강도는 5 ㎠ 면적의 원형 또는 정사각형 모양의 어느 지점마다 수직
으로 300 N의 힘을 균등하게 분산하여 가할 때 다음과 같아야 한다.
      1) 영구적인 변형이 없어야 한다.
      2) 15 ㎜를 초과하는 탄성변형이 없어야 한다. 
             <10 mm를 초과하는 탄성변형이 없어야 한다 / 2013년 9월 15일 이후의 건축허가분.>
  다) 5 ㎜를 초과하는 돌출물은 없어야 하며, 2 ㎜를 초과하는 돌출물은 수평면에 대해 
75°이상으로 모따기가 되어야 한다.
  라) 추가로, 다음 중 어느 하나에 적합해야 한다.
      1) 수직면은 연속되는 다음 문의 상인방에 연결되어야 한다. 
      2) 수평면에 60°이상으로 견고하고 매끄럽게 모따기 된 수직면을 사용하여 아랫방향
으로 연장되어야 하며, 수평면에 대한 모따기의 투영은 20 ㎜ 이상이어야 한다.
있어야 한다.
 ① 수평거리는 125㎜ 이하이어야 하며, 출입구가 2개인 엘리베이터의 경우에는 각각의 출입구에 대하여 125㎜ 이하이어야 
한다.
 ② 수평거리가 125㎜를 초과할 경우에는 금속제판 등으로 최상정지층의 바닥아래에서 최하정지층의 출입구상부까지 출입문을 
제외한 카 출입구에 면하는 전체부분에 대하여 보호면을 설치하여야 한다. 이 경우 헤더케이스상부와 보호면하단까지의 
틈새는 38㎜ 이하이어야 하나, 보수관리상 부득이한 경우에는 100㎜ 이하로 할 수 있으며, 자동차용 엘리베이터에 있어서 
출입문이 상승개폐문 또는 상하개폐문일 때에 출입문이 열리는 부분에 대해서는 보호면을 설치하지 아니할 수 있다
 ③ 출입구가 2개인 엘리베이터에 있어서 승강로 출입구가 없는 부분과 정지하지 않는 층이 있는 경우에도 제2항의 규정에 
의한 보호면을 설치하여야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 38
[ 그림 3. 카와 카 출입구를 마주하는 벽 사이의 틈새 ]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.4', '2022-03-02', NULL, 'current', '6.5.4 승강로 하부에 위치한 공간의 보호
  승강로 하부에 접근할 수 있는 공간이 있는 경우, 피트의 기초는 5,000  이상의 
부하가 걸리는 것으로 설계되어야 하고, 균형추 또는 평형추에 추락방지안전장치가 설치
되어야 한다.
  비고 1. 승강로 하부에 접근할 수 있는 공간이란 피트 바닥 직하부에 사람이 상주하는 공간 또는 상시 출입
하는 통로나 공간을 말한다.
       2. 엘리베이터 승강로는 사람이 접근할 수 있는 공간 위에 위치하지 않는 것이 바람직하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.4', '2015-05-13', '2022-03-01', 'old', '5.5 승강로 하부에 위치한 공간의 보호
승강로 하부에 접근할 수 있는 공간이 있는 경우, 피트의 기초는 5,000 N/㎡ 이상의 부하가 걸리는 것으로 설계되어야 하고, 
균형추 또는 평형추에 비상정지장치가 설치되어야 한다.
 비고 1. 접근할 수 있는 공간이란 피트바닥 직하부에 사람이 상주하는 공간 또는 상시 출입하는 통로 등을 말한다.
      2. 엘리베이터 승강로는 사람이 접근할 수 있는 공간 위에 위치하지 않는 것이 바람직하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.4', '2013-09-15', '2015-05-12', 'old', '5.5 카, 균형추 또는 평형추 하부에 위치한 공간의 보호
   카, 균형추 또는 평형추 하부에 위치한 공간의 보호 카, 균형추 또는 평형추 하부에 접근할 수 있는 공간이 있는 경우,
피트의 기초는 5,000 N/㎡ 이상의 부하가 걸리는 것으로 설계되어야 하고, 다음 중 어느 하나에 적합하여야 한다.
 가) 균형추 완충기 또는 평형추 주행구간 직하부에 견고한 벽이 단단한 지면까지 연장되도록 설치되어야 한다. 
 나) 균형추 또는 평형추에 비상정지장치가 설치되어야 한다. 비고 엘리베이터 승강로는 사람이 접근할 수 있는 공간 위에 
위치하지 않는 것이 바람직하다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
39 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.4', '1997-08-18', '2013-09-14', 'old', '[로프식]
3.1.3(11) 피트 바닥하부는 거실 또는 여러사람이 출입하는 통로 등으로 사용하지 않아야 한다. 다만, 피트 바닥하부를 거실 
또는 여러사람이 출입하는 통로 등으로 사용할 경우에는 피트 바닥을 2중슬라브로 하고, 균형추쪽에도 비상정지장치를 
설치하거나 균형추쪽 직하부에 두꺼운 벽을 설치하여야 한다.
[유압식]
3.2.2(2) 피트 바닥하부는 거실 또는 여러사람이 출입하는 통로 등으로 사용하지 않아야 한다. 다만, 피트 바닥하부를 거실 
등으로 사용할 경우에는 피트 바닥을 2중슬라브로 하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5', '2022-03-02', NULL, 'current', '6.5.5 승강로 내에서 보호');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.1', '2022-03-02', NULL, 'current', '6.5.5.1 균형추 또는 평형추의 주행구간은 다음 사항에 적합한 칸막이로 보호되어야 한다.
  가) 칸막이에 구멍이 있는 경우에는 KS B ISO 13857, 표4에 따라야 한다.
  나) 칸막이는 완전히 압축된 완충기 위에 있는 균형추 또는 가장 낮은 지점에 있는 평형
추의 끝단에서부터 위로 연장되어야 하며, 그 연장 높이는 피트바닥으로부터 2 m 
이상이어야 한다.
  다) 칸막이의 가장 낮은 부분은 피트 바닥에서 위로 0.3 m 이하(보상 로프·체인 간섭 
등 부득이한 경우에는 완충기의 최저 이동높이 이하)이어야 한다. 균형추에 고정된 
완충기에 관한 사항은 12.1.1을 참조한다.
  라) 칸막이의 폭은 균형추 또는 평형추의 폭 이상이어야 한다.
  마) 균형추/평형추 주행안내 레일과 승강로 벽 사이의 틈새가 0.3 m를 초과하는 경우에는
나) 및 다)에 따라 보호되어야 하다.
  바) 칸막이에는 보상수단(보상 로프·체인 등)의 유효 통로를 허용하는데 필요하거나 육안 
점검에 필요한 구멍이 있을 수 있으며, 그 폭은 최소화되어야 한다.
  사) 칸막이의 기계적 강도는 5 ㎠ 면적의 원형 또는 정사각형 모양의 어느 지점마다 수직
으로 300 N의 힘을 균등하게 분산하여 가할 때 균형추 또는 평형추에 충돌되지 
않아야 한다.
  아) 카 및 카의 관련 부품은 균형추/평형추 및 이와 관련한 부품으로부터 50 ㎜ 이상 
떨어진 거리에 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.1', '2015-05-13', '2022-03-01', 'old', '5.6.1 균형추 또는 평형추의 주행구간은 엘리베이터 피트 바닥으로부터 0.3 m 이하(균형체인ㆍ로프 간섭 등 부득이한 경우에는 
완충기의 최저 이동 높이 이하로 한다)부터 2.0 m 이상의 높이까지 연장된 견고한 칸막이로 보호되어야 한다. 칸막이의 
폭은 균형추 또는 평형추의 폭에 각각 0.1 m를 더한 값 이상이어야 한다.
5.6.1.1 칸막이에 구멍이 있는 경우에는 KS B 6947, 4.5.1에 따라야 한다.
5.6.1.2 칸막이에는 균형추 또는 평형추와 완충기 사이 틈새를 육안으로 확인할 수 있는 조치가 있어야 한다.
11.3 카, 균형추 또는 평형추 사이의 틈새
카 및 카의 관련 부품은 균형추 또는 평형추 및 이와 관련된 부품으로부터 50 mm 이상의 거리가 있어야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 40');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.1', '2013-09-15', '2015-05-12', 'old', '5.6.1 균형추 또는 평형추의 주행구간은 엘리베이터 피트 바닥으로부터 0.3 m 이하(균형체인ㆍ로프 간섭 등 부득이한 경우에는 
완충기의 최저 이동 높이 이하로 한다)부터 2.5 m 이상의 높이까지 연장된 견고한 칸막이로 보호되어야 한다. 칸막이의 
폭은 균형추 또는 평형추의 폭에 각각 0.1 m를 더한 값 이상이어야 한다.
5.6.1.1 칸막이에 구멍이 있는 경우에는 KS B 6947, 4.5.1에 따라야 한다.
5.6.1.2 칸막이에는 균형추 또는 평형추와 완충기 사이 틈새를 육안으로 확인할 수 있는 조치가 있어야 한다.
11.3 카, 균형추 또는 평형추 사이의 틈새
카 및 카의 관련 부품은 균형추 또는 평형추 및 이와 관련된 부품으로부터 50 mm 이상의 거리가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.2', '2022-03-02', NULL, 'current', '6.5.5.2 여러 대의 엘리베이터가 있는 승강로에는 서로 다른 엘리베이터의 움직이는 부품들 
사이에 칸막이가 있어야 한다.
  칸막이에 구멍이 있는 경우에는 KS B ISO 13857, 표4에 따라야 한다.
  칸막이의 기계적 강도는 5 ㎠ 면적의 원형 또는 정사각형 모양의 어느 지점마다 수직으로
300 N의 힘을 균등하게 분산하여 가할 때 움직이는 부품들에 충돌되지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.2', '2013-09-15', '2022-03-01', 'old', '5.6.2 2대 이상의 엘리베이터가 있는 승강로에는 서로 다른 엘리베이터의 움직이는 부품 사이에 칸막이가 설치되어야 한다. 
칸막이에 구멍이 있는 경우에는 KS B 6947, 4.5.1에 따라야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.2', '1997-08-18', '2013-09-14', 'old', '3.1.3(13) 동일 승강로에 2대 이상의 엘리베이터를 설치한 경우에 속도가 다르거나 정지층이 달라 피트 바닥의 높이차가 
0.6m 이상일 때에는 그 사이에 높이 1.1m 이상의 추락방지용 난간을 견고하게 설치하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.2.1', '2022-03-02', NULL, 'current', '6.5.5.2.1 칸막이는 피트 바닥에서 0.3 m 이내부터 최하층 승강장 바닥에서 위로 2.5 m 
이상까지 설치되어야 한다.
  칸막이의 폭은 서로 다른 피트 간의 접근을 방지할 수 있는 크기이어야 한다.
6.3.3라)에 따른 위험이 없는 경우의 조건을 충족하는 경우, 칸막이는 피트 바닥에서 
0.3 m 이내의 가장 낮은 지점 아래에 있을 필요는 없다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.2.1', '2013-09-15', '2022-03-01', 'old', '5.6.2.1 칸막이는 카, 균형추 또는 평형추 주행로의 가장 낮은 지점에서부터 최하층 승강장 바닥 위로 2.5 m 이상으로 설치
되어야 한다. 칸막이의 폭은 5.2.2.2.2의 규정을 만족하는 경우를 제외하고, 서로 다른 피트에서 피트로의 접근을 방지할 
수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.2.2', '2022-03-02', NULL, 'current', '6.5.5.2.2 칸막이는 보호난간의 내측 모서리와 인접한 엘리베이터의 움직이는 부품(카, 균형추 
또는 평형추) 사이의 수평거리가 0.5 m 미만인 경우에는 승강로 전체 높이까지 연장
되어야 한다.
  칸막이의 폭은 움직이는 부품의 폭에 양쪽 모두 각각 0.1 m를 더한 값 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.5.2.2', '2013-09-15', '2022-03-01', 'old', '5.6.2.2 칸막이는 카 지붕의 모서리와 인접한 엘리베이터의 움직이는 부품(카, 균형추 또는 평형추) 사이의 수평거리가 0.5 m 
미만인 경우에는 승강로 전체 높이까지 설치되어야 한다. 
      칸막이의 폭은 움직이는 부품의 폭에 양쪽 모두 각각 0.1 m를 더한 값 이상이어야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
41 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6', '2022-03-02', NULL, 'current', '6.5.6 카, 균형추 및 평형추의 주행구간
 <2019년 3월 28일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.1', '2022-03-02', NULL, 'current', '6.5.6.1 카, 균형추 및 평형추의 끝단 위치');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.1.1', '2022-03-02', NULL, 'current', '6.5.6.1.1 표 1에 따른 카, 균형추 및 평형추의 끝단 위치는 6.5.6에 따른 주행구간,');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.7', '2022-03-02', NULL, 'current', '6.5.7 및 6.5.8에 따른 피난 공간 및 틈새에 관한 기준이 고려되어야 한다.
[ 표 1 카, 균형추 및 평형추의 끝단 위치 ] 
위치
권상 구동
포지티브 구동
유압식 구동
카의 최고 위치
균형추가 완전히 압축된 
완충기에 있을 때
+ ∙
카가 완전히 압축된 상부 
완충기에 있을 때
램이 행정 제한 수단을 통해 
최종 위치에 있을 때
+ ∙
카의 최저 위치
카가 완전히 압축된 
완충기에 있을 때
카가 완전히 압축된 하부 
완충기에 있을 때
카가 완전히 압축된 완충기에 
있을 때
균형추/평형추의 
최고 위치
카가 완전히 압축된 
완충기에 있을 때 
+ ∙
카가 완전히 압축된 하부 
완충기에 있을 때
카가 완전히 압축된 완충기에 
있을 때
+ ∙
균형추/ 평형추의 
최저 위치
균형추가 완전히 압축된 
완충기에 있을 때
카가 완전히 압축된 상부 
완충기에 있을 때
램이 행정 제한 수단을 통해 
최종 위치에 있을 때
+ ∙
비고
   ∙는 정격 속도의 115 %에 상응하는 중력 정지거리의 절반을 나타낸다.
   
∙
∙
∙
∙ → ∙으로 반올림한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.1.2', '2022-03-02', NULL, 'current', '6.5.6.1.2 권상 구동 엘리베이터의 구동기 감속이 16.1.3에 따라 감지되는 경우, 표 1의 
0.035・ 값을 카 또는 균형추가 완충기에 닿을 때의 속도를 고려하여 줄일 수 있다. 
(12.2.2.2 참조)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.1.3', '2022-03-02', NULL, 'current', '6.5.6.1.3 튀어오름 방지장치(제동 또는 록다운 장치)에 장착된 인장 도르래가 있는 보상 
로프가 설치된 권상 구동 엘리베이터의 경우, 표 1의 0.035・ 값을 도르래의 이동 
가능한 거리(사용된 로프에 따라)에 카 주행거리의 1/500을 더한 값(로프의 탄성을 고려
하여 0.2 m 이상)으로 계산을 대신할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.1.4', '2022-03-02', NULL, 'current', '6.5.6.1.4 직접 유압식 엘리베이터의 경우에는 표 1의 0.035・ 값을 고려할 필요가 없다.
승강기 안전기준 연혁집[v1.0]
❙ 42');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.2', '2022-03-02', NULL, 'current', '6.5.6.2 권상 구동 엘리베이터의 주행안내 레일 길이
  주행안내 레일 길이는 카 또는 균형추가 6.5.6.1에 따른 최고 위치에 있을 때 가이드 
슈/롤러 위로 각각 0.1 m 이상 연장되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.3', '2022-03-02', NULL, 'current', '6.5.6.3 포지티브 구동 엘리베이터의 주행안내 레일 길이');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.3.1', '2022-03-02', NULL, 'current', '6.5.6.3.1 카가 상승방향으로 상부 완충기에 충돌하기 전까지 안내되는 카의 주행거리는 
최상층 승강장 바닥에서부터 위로 0.5 m 이상이어야 하며, 카는 완충기 행정의 한계까지
주행되어야 한다. 
  주택용 엘리베이터의 경우에는 0.25 m 이상으로 완화 적용할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.3.2', '2022-03-02', NULL, 'current', '6.5.6.3.2 평형추가 있는 경우, 평형추 주행안내 레일의 길이는 평형추가 6.5.6.1에 따른 
최고 위치에 있을 때 그 가이드 슈/롤러 위로 0.3 m 이상 안내되어야 한다. 
  다만, 주택용 엘리베이터의 경우에는 0.15 m 이상으로 완화 적용할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.4', '2022-03-02', NULL, 'current', '6.5.6.4 유압식 엘리베이터의 주행안내 레일 길이');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.4.1', '2022-03-02', NULL, 'current', '6.5.6.4.1 카 주행안내 레일의 길이는 카가 6.5.6.1에 따른 최고 위치에 있을 때 그  가이드
슈/롤러 위로 0.1 m 이상 안내되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.4.2', '2022-03-02', NULL, 'current', '6.5.6.4.2 평형추가 있는 경우, 평형추 주행안내 레일의 길이는 평형추가 6.5.6.1에 따른 
최고 위치에 있을 때 가이드 슈/롤러 위로 0.1 m 이상 안내되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.6.4.2', '2013-09-15', '2022-03-01', 'old', '5.7.2.4 평형추가 설치된 경우, 완전히 압축된 잭의 완충정지장치에 의해 결정되는 카의 가장 높은 위치에 카가 있을 때 평형추의 
가이드 길이는 0.1 + 0.035 V2 (m) 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.7', '2022-03-02', NULL, 'current', '6.5.7 카 지붕의 피난공간 및 틈새');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.7.1', '2022-03-02', NULL, 'current', '6.5.7.1 카가 6.5.6.1에 따른 최고 위치에 있을 때 표 2에 따른 피난공간을 수용할 수 있는
유효 구역이 1개 이상 카 지붕에 있어야 한다.
표 2의 유형 2에 따른 피난공간이 카 지붕의 고정된 부품과 닿는 경우, 피난공간 모서리
하단부의 한쪽 면은 카 지붕에 고정된 부품을 포함하기 위해 폭 0.1 m, 높이 0.3 m
까지의 공간을 줄일 수 있다.(그림 4 참조)
점검 등 유지관리 업무 수행을 위해 두 명 이상의 사람이 카 지붕 위에 있어야 하는 경우,
피난공간은 추가되는 사람마다 각각 제공되어야 한다.
피난공간이 두 개 이상인 경우, 각 피난공간들은 같은 유형이어야 하고, 서로 간섭되지 
않아야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
43 ❙
[ 그림 4. – 피난공간 축소의 최대 크기 ]
  피난공간의 허용 가능 인원 및 자세 유형(표 2)이 명확하게 표시된 표지가 카 지붕에 
있어야 하고, 그 표지는 승강장에서 카 지붕으로 출입하는 경로에서 읽을 수 있는 위치에
있어야 한다.
균형추가 사용된 경우, 균형추 칸막이(6.5.5.1 참조)표면 또는 주위에 카가 최상층 승강장에 
있을 때 카 상부 피난공간의 크기를 유지하기 위한 균형추와 균형추 완충기 사이의 최대
허용 틈새가 명시된 표지가 부착되어 있어야 한다.
[표 2. 상부공간의 피난공간 크기 ]
유형
자세
그림
피난공간 크기
수평 거리(m×m)
높이(m)
1
서 있는 자세
0.4 × 0.5
2
2
웅크린 자세
0.5 × 0.7
1
기호 설명
① 검은색 ② 노란색 ③ 검은색
 <2019년 3월 28일 이후 건축허가분부터 적용>
승강기 안전기준 연혁집[v1.0]
❙ 44');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.7.2', '2022-03-02', NULL, 'current', '6.5.7.2 카가 6.5.6.1에 따른 최고 위치에 있을 때, 승강로 천장의 가장 낮은 부분(천장 
아래에 있는 빔 및 부품을 포함)과 다음 구분에 따른 카 지붕의 설비 사이의 유효 거리는
다음과 같아야 한다.
  가) 카의 투영부분 중 다음 나)와 다)를 제외한 카 지붕에 고정된 설비 중 가장 높은 부분: 
0.5 m 이상(수직거리, 경사거리 포함)
  나) 카의 투영부분에서 수평거리 0.4 m 이내의 가이드 슈/롤러, 로프 단말처리부 및 수직 
개폐식 문의 헤더 또는 부품의 가장 높은 부분: 0.1 m 이상(수직거리)
  다) 난간의 가장 높은 부분
     1) 카의 투영부분에서 수평거리 0.4 m 이내와 난간 외부 수평거리 0.1 m 이내 부분: 
0.3 m 이상(수직거리)
     2) 카의 투영부분에서 수평거리 0.4m 바깥 부분: 0.5 m 이상(경사거리)
기호 설명
A 유효 거리 ≥ 0.50 m[6.5.7.2가)]
B 유효 거리 ≥ 0.50 m[6.5.7.2가)]
C 유효 거리 ≥ 0.50 m[6.5.7.2다)2)]
D 유효 거리 ≥ 0.30 m[6.5.7.2다)1)]
E 유효 거리 ≤ 0.40 m[6.5.7.2다)1)]
F   카 지붕에서 가장 높은 부분
G   카
H   피난공간
X   피난공간 높이(표 2)
[ 그림 5. 카 지붕에 고정된 부품과 승강로 천장에 고정된 가장 낮은 부품 사이의 최소 거리 ]
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
45 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.7.2', '2013-09-15', '2022-03-01', 'old', '5.7.1.1 마), 바) 유압식
5.7.1 권상 구동식 엘리베이터의 상부틈새
권상 구동식 엘리베이터의 상부틈새는 다음 사항 및 부속서 Ⅵ에 적합하여야 한다.
5.7.1.1 균형추가 완전히 압축된 완충기 위에 있을 때 다음 4가지 사항이 동시에 만족되어야 한다.
5.7.1.1 램이 12.2.3에 따라 램의 행정 제한수단을 통해 최대 위치에 있을 때 다음 6가지 사항이 동시에 만족되어야 한다.(유압식)
 가) 카 가이드 레일의 길이는 0.1 + 0.035v² m 이상 연장되어야 한다.
  비고 0.035v2는 정격속도의 115%에 상응하는 중력 정지거리의 1/2를 나타낸다.
 1/2 × 


 ≈ 0.0337v2, 따라서 대략 0.035v2이다.2
 나) 8.13.2[5.7.1.1다)의 해당부분 제외]에 적합한 면적의 카 지붕에서 가장 높은 부분과 승강로 천장의 가장 낮은 부분(천장 
아래 위치한 빔 및 부품 포함) 사이의 수직거리는 1.0 + 0.035v² m 이상이어야 한다.
 다) 승강로 천장의 가장 낮은 부분과 아래에서 설명하는 설비 또는 부품 사이의 수직거리는 다음과 같다.
  1) 카 지붕에 고정된 설비의 가장 높은 부분[5.7.1.1다)2)에 포함된 것 제외] 사이의 수직거리는 0.3+0.035v² m 이상이어야 
한다.
  2) 가이드 슈 또는 롤러, 로프 연결부 및 수직 개폐식 문의 헤더 또는 부품의 가장 높은 부분(있는 경우) 사이의 수직거리는 
0.1+0.035v² m 이상이어야 한다.
  비고 8.13.3에 따른 보호난간의 바깥 부분은 5.7.1.1다)2)의 규정을 적용한다.<2015년 5월 13일 이후의 건축허가분>
 라) 카 위에는 0.5 m × 0.6 m × 0.8 m 이상의 장방형 블록을 수용할 수 있는 충분한 공간이 있어야 한다. 직접 현수방식의 
엘리베이터에 있어서 로프의 중심선이 블록의 수직 표면으로부터 0.15 m 이내에 있는 경우, 현수로프 및 그 부착물은 
이 공간 내에 있을 수 있다.
 마) 승강로 천장의 가장 낮은 부분과 상승방향으로 주행하는 램-헤드 부품의 가장 높은 부분 사이의 수직거리는 0.1 m 이상이어야 
한다.(유압식)
 바) 직접식 엘리베이터의 경우, 가), 나) 및 다)에서 기술된 0.035v2 m의 값은 고려되지 않아야 한다.(유압식)
5.7.1.2 카가 완전히 압축된 완충기 위에 있을 때, 균형추 가이드 레일의 길이는 0.1 + 0.035v² m 이상 연장되어야 한다.
5.7.1.3 엘리베이터의 감속이 12.8에 따라 감지되는 경우, 5.7.1.1 및 5.7.1.2의 0.035v² 값은 다음과 같이 감소될 수 있다.
 가) 정격속도 4 ㎧ 이하의 엘리베이터에 대해 1/2까지. 다만, 이 값은 0.25 m 이상이어야 한다.
 나) 정격속도 4 ㎧ 초과의 엘리베이터에 대해 1/3까지. 다만, 이 값은 0.28 m 이상이어야 한다.
5.7.1.4 튀어오름방지장치(제동 또는 록다운 장치)가 장착된 인장 도르래가 있는 균형로프가 설치된 엘리베이터의 경우, 
0.035v² 값을 도르래의 이동 가능한 거리(사용된 로프에 따라)에 카의 주행거리의 1/500을 더한 값(로프의 탄성을 고
려하여 0.2 m 이상)으로 틈새 계산을 대신할 수 있다.
5.7.2  포지티브 구동식 엘리베이터의 상부틈새
5.7.2.1 카가 상승방향으로 상부 완충기에 충돌하기 전까지 안내되는 카의 주행거리는 최상층 승강장 바닥에서부터 0.5 m 
이상이어야 한다. 카는 완충기 행정의 한계까지 주행되어야 한다.
5.7.2.2 카에 의해 상부 완충기가 완전히 압축될 때, 다음 3가지 사항이 동시에 만족되어야 한다. 
 가) 8.13.2[5.7.2.2나)의 해당부분 제외]에 적합한 면적의 카 지붕에서 가장 높은 부분과 승강로 천장의 가장 낮은 부분(천장 
아래 위치한 빔 및 부품 포함) 사이의 수직거리는 1.0 m 이상이어야 한다. 
 나) 승강로 천장의 가장 낮은 부분과 아래에서 설명하는 설비 또는 부품 사이의 수직거리는 아래와 같다. <2015년 5월 13일 이후의 
건축허가분부터');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.7.2', NULL, '2013-09-15', 'old', '[전기식]
3.1.3(7) 꼭대기틈새 및 피트깊이는 다음 각항의 기준에 적합하여야 한다.
 ① 꼭대기틈새는 카를 최상층에 정지시켜 놓은 상태에서 카의 상부체대와 승강로 천장부와의 수직거리를 측정하여 표 1에서 
규정한 수치 이상이어야 한다. 이 경우 카 위의 여러가지 장치중에서 가장 위로 돌출된 것이 승강로 천장부 또는 천장
보다 돌출된 것(고정보 등)과 접촉되지 않아야 한다.
표 1 < 2004년 12월 1일부터 시행 >
 
정격속도(m/min)
꼭대기틈새(m)
피트깊이(m)
 45 이하
1 . 2
1 . 2
 45 초과～ 60 이하
1 . 4
1 . 5
 60 초과～ 90 이하
1 . 6
1 . 8
 90 초과～120 이하
1 . 8
2 . 1
120 초과～150 이하
2 . 0
2 . 4
150 초과～180 이하
2 . 3
2 . 7
180 초과～210 이하
2 . 7
3 . 2
210 초과～240 이하
3 . 3
3 . 8
240 초과
4 . 0
4 . 0
비고 : 카가 상승 또는 하강할 때 최상층 또는 최하층의 1개층 앞에서 카를 강제적으로 감속시키고 최상층 
또는 최하층 구간에서는 꼭대기틈새 및 피트깊이에 맞는 적정 속도 이하로 정속주행하도록 제어하는 
종단층강제감속장치를 설치한 경우에는 수시검사에 한하여 표1에서 규정된 치수를 한단계 낮추어 꼭
대기틈새와 피트깊이를 적용할 수 있다.(완성검사일로부터 3년이 경과하지 않은 승강기는 제외)
표 1 < 2004년 12월 1일 전까지의 종전기준 >
정격속도(m/min)
꼭대기틈새(m)
피트깊이(m)
 45 이하
1 . 2
1 . 2
 45 초과～ 60 이하
1 . 4
1 . 5
 60 초과～ 90 이하
1 . 6
1 . 8
 90 초과～120 이하
1 . 8
2 . 1
120 초과～150 이하
2 . 0
2 . 4
150 초과～180 이하
2 . 3
2 . 7
180 초과～210 이하
2 . 7
3 . 2
210 초과～240 이하
3 . 3
3 . 8
240 초과
4 . 0
4 . 0
[유압식]
3.2.2(1) 카를 최상층에서 미속으로 상승시켜 플런저가 이탈방지장치로 정지했을 때 꼭대기부분틈새(카 위에서 측정한 치수로써 
천장이 없는 카의 경우에는 카 바닥에서 측정한 치수에서 최상층 출입구 유효높이를 빼낸 치수)는 다음 수치 이상이어야 
한다.
 
 
여기서, V는 카의 상승정격속도(m/min)이다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
47 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.7.2', NULL, '1992-07-01', 'old', '[전기식]
3.1.3(7) 꼭대기틈새 및 피트깊이는 다음 각항의 기준에 적합하여야 한다.
 ① 꼭대기틈새는 카를 최상층에 정지시켜 놓은 상태에서 카의 상부체대와 승강로 천장부와의 수직거리를 측정하여 표 1에서 
규정한 수치 이상이어야 한다. 이 경우 카 위의 여러가지 장치중에서 가장 위로 돌출된 것이 승강로 천장부 또는 천장보다 
돌출된 것(고정보 등)과 접촉되지 않아야 한다.
[유압식]
3.2.6(6) 카 위에서 운전조작하는 경우에 있어서 꼭대기부분 안전거리인 승강로 천장 또는 보의 하부와 카 상부체대와의 거리를 
1.2m 이상 확보하고, 그 이상의 카의 상승을 자동적으로 제어하여 정지시키는 장치. 다만, 카 천장이 없는 자동차용 
엘리베이터의 경우에는 그러하지 아니하다.
4.2.3(3) 카 위에서 운전조작하는 경우에 있어서 꼭대기부분 안전거리를 1.2m 이상을 확보하고, 그 이상의 카의 상승을 자동적으로 
제어하여 정지시키는 장치의 작동상태는 양호하여야 한다. 다만, 카 천장이 없는 자동차용 엘리베이터의 경우에는 
그러하지 아니하다.
<추가 종전 기준>-----------------------------------------------');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.7.2', '1993-09-03', '2013-09-14', 'old', '4.1.5(5) 시행
[로프식]
4.1.4(5) 카가 최상층에서 수평으로 정지되어 있을 때의 균형추와 완충기와의 거리 및 카가 최하층에서 수평으로 정지되어 
있을 때의 카와 완충기와의 거리는 표 7의 규정에 합격하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.7.3', '2022-03-02', NULL, 'current', '6.5.7.3 카 지붕 또는 카 지붕의 설비 위에 어떤 하나의 연속되는 구역이 유효 면적 0.12 ㎡ 
이상이고 가장 작은 변의 길이가 0.25 m 이상인 경우, 그 구역은 사람이 서 있을 수 
있는 장소로 본다.
카가 6.5.6.1에 따른 최고 위치에 있을 때, 그 구역 위로 승강로 천장의 가장 낮은 부분
(천장 아래에 있는 빔과 부품을 포함) 사이의 수직 틈새는 6.5.7.1에 따른 관련 피난 
공간의 높이 이상이어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.7.4', '2022-03-02', NULL, 'current', '6.5.7.4 유압식 엘리베이터의 경우, 승강로 천장의 가장 낮은 부분과 상승방향으로 주행하는 
램-헤드 조립체의 가장 높은 부분 사이의 유효 수직거리는 0.1 m 이상이어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.8', '2022-03-02', NULL, 'current', '6.5.8 피트의 피난공간 및 틈새');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.8.1', '2022-03-02', NULL, 'current', '6.5.8.1 피트에는 카가 6.5.6.1에 따른 최저 위치에 있을 때, 표 3에 따른 어느 하나에 해당
하는 피난공간이 1개 이상 있어야 한다. 다만, 주택용 엘리베이터의 경우에는 움직이는 
수단에 의해 카가 이 수단에 정지하고 있을 때 피트 바닥과 카 하부의 가장 낮은 부품 
사이에 0.2 m× 0.2 m의 면적 및 1.8 m의 수직거리가 확보되어야 하고, 이러한 목적을 
위한 장치가 승강로 내부에 영구적으로 설치되어야 하며, 이 수단이 작동 작동위치에 있을
경우 15.2에 적합한 전기안전장치에 의해 카의 모든 움직임은 보호되어야 한다.
점검 등 유지관리 업무를 수행하기 위해 두 명 이상의 사람이 피트에 있어야 하는 경우, 
피난공간은 추가되는 사람마다 각각 제공되어야 한다.
피난 공간이 두 개 이상인 경우, 그 피난공간들은 같은 유형이어야 하고, 서로 간섭되지 
않아야 한다.
피난공간의 허용 가능 인원 및 자세 유형(표 3)이 명확하게 표시된 표지가 피트에 있어야
하고, 그 표지는 피트 출입구에서 읽을 수 있는 위치에 있어야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
49 ❙
[표 3. 피트의 피난공간 크기 ]
유형
자세
그림
피난공간 크기
수평 거리(m×m)
높이(m)
1
서 있는 자세
0.4 × 0.5
2
2
웅크린 자세
0.5 × 0.7
1
3
누운 자세
0.7 × 1
0.5
기호 설명
① 검은색 ② 노란색 ③ 검은색
 <2019년 3월 28일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.8.2', '2022-03-02', NULL, 'current', '6.5.8.2 카가 6.5.6.1에 따른 최저 위치에 있을 때, 다음과 같아야 한다.
  가) 피트 바닥과 카의 가장 낮은 부분 사이의 유효 수직거리는 0.5 m 이상이어야 한다. 
다만, 다음과 같은 경우에는 유효 수직거리를 해당 수치까지 줄일 수 있다.
     1) 인접한 벽에서 수평거리 0.15 m 이내에 에이프런 또는 수직 개폐식 문의 어느 
부분이 있는 경우: 0.1 m까지 
     2) 주행안내 레일에서 그림 6 및 그림 7에 따른 최대 수평거리 이내에 카 프레임 부분, 
추락방지안전장치, 가이드 슈/롤러, 멈춤 쇠 장치가 있는 경우: 그림 6 및 그림 7에 
따른 최소 유효 수직거리까지
  나) 피트에 고정된 가장 높은 부분(보상 로프 인장장치의 가장 높은 부분, 잭 지지대·
파이프 및 그 부속품 등)과 카의 가장 낮은 부분[6.5.8.2가)1)·2)에서 기술된 사항은 
제외] 사이의 유효 수직거리는 0.3 m 이상이어야 한다.
  다) 유압식엘리베이터의 경우, 피트 바닥 또는 피트 바닥에 설치된 설비의 가장 높은 
부분과 역방향 잭의 하강방향으로 주행하는 램-헤드 조립체의 가장 낮은 부분 사이의
유효 수직거리는 0.5 m 이상이어야 한다. 다만, 6.5.5.1에 따른 칸막이 등에 의해 
램-헤드 조립체 아래에 접근이 불가능한 경우, 이 수직거리는 0.5 m에서 0.1 m까지
감소될 수 있다.
승강기 안전기준 연혁집[v1.0]
❙ 50
  라) 피트 바닥과 직접 유압식 엘리베이터의 카 아래에 있는 다단 잭의 가장 낮은 가이드 
이음쇠 사이의 유효 수직거리는 0.5 m 이상이어야 한다.
  마) 주택용 엘리베이터의 경우 카가 완전히 압축된 완충기 위에 있을 때 피트 바닥과 카의
가장 낮은 부품(에이프런 등) 사이의 수직거리는 0.05 m 이상이어야 한다.
[ 그림 6. 주행안내 레일 주변의 수평 거리 XH ]
수평거리 XH(m)
최
소
수
직
거
리 
(m)
[ 그림 7. 카 프레임 부분, 추락방지안전장치, 가이드 슈/롤러, 멈춤 쇠 장치의 
최소 수직 거리 ]
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
51 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.8.2', '2013-09-15', '2022-03-01', 'old', '[전기식]
5.7.3.3 카가 완전히 압축된 완충기 위에 있을 때, 다음 3가지 사항이 동시에 만족되어야 한다.
 가) 피트에는 0.5 m × 0.6 m × 1.0 m 이상의 장방형 블록을 수용할 수 있는 충분한 공간이 있어야 한다.
 나) 피트 바닥과 카의 가장 낮은 부품 사이의 수직거리는 0.5 m 이상이어야 한다. 이 거리는 아래에 해당되는 수평거리가 
0.15 m 이내인 경우 최소 0.1 m까지 감소될 수 있다.
  1) 에이프런 또는 수직 개폐식 카문과 인접한 벽 사이
  2) 카의 가장 낮은 부품과 가이드 레일 사이
 다) 피트에 고정된 가장 높은 부품[5.7.3.3나)의 1)과 2)에서 설명한 것을 제외한 균형로프 인장장치 등]과 카의 가장 낮은 
부품 사이의 수직거리는 0.3 m 이상이어야 한다.
[유압식]
5.7.2.3 카가 완전히 압축된 완충기 위에 있을 때, 다음 5가지 사항이 동시에 만족되어야 한다.
 가) 피트에는 0.5 m × 0.6 m × 1.0 m 이상의 장방형 블록을 수용할 수 있는 충분한 공간이 있어야 한다.
 나) 피트 바닥과 카의 가장 낮은 부품 사이의 수직거리는 0.5 m 이상이어야 한다. 이 거리는 아래에 해당되는 수평거리가 
0.15 m 이내인 경우 최소 0.1 m까지 감소될 수 있다.
  1) 크램핑 정지블록, 멈춤 쇠 장치, 에이프런 또는 수직 개폐식 카문의 부품과 인접한 벽 사이
  2) 카의 가장 낮은 부품과 가이드 레일 사이
 다) 피트에 고정된 가장 높은 부품[5.7.2.3나)의 1)과 2)에서 설명한 것을 제외한 균형로프 인장장치 등]과 카의 가장 낮은 
부품 사이의 수직거리는 0.3 m 이상이어야 한다.
 라) 피트 바닥이나 피트에 설치된 장치의 꼭대기와 거꾸로 된 잭의 하강 운행하는 램-헤드 조립부품의 가장 낮은 부품사이의 
수직거리는 0.5 m 이상이어야 한다. 다만, 램-헤드 조립부품 아래로 접근이 불가능한 경우(5.6.1에 따른 칸막이가 설치된 
것에 의해 등)에는 이 최소거리를 0.5 m부터 0.1 m까지 줄일 수 있다.
 마) 직접식 엘리베이터의 경우, 피트 바닥과 카 아래에 있는 다단 잭의 가장 낮은 가이드 이음쇠 사이의 수직거리는 0.5 m 
이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.8.2', NULL, '2013-09-15', 'old', '3.1.3(7) 꼭대기틈새 및 피트깊이는 다음 각항의 기준에 적합하여야 한다.
 ② 피트깊이는 최하층의 바닥면에서 카의 수평투영면에 있는 피트 바닥 또는 가장 높이 돌출된 지중보까지의 수직거리를 
측정하여 표 1에서 규정한 수치 이상이어야 한다.
표 1 < 2004년 12월 1일부터 시행 >
정격속도(m/min)
꼭대기틈새(m)
피트깊이(m)
 45 이하
1 . 2
1 . 2
 45 초과～ 60 이하
1 . 4
1 . 5
 60 초과～ 90 이하
1 . 6
1 . 8
 90 초과～120 이하
1 . 8
2 . 1
120 초과～150 이하
2 . 0
2 . 4
150 초과～180 이하
2 . 3
2 . 7
180 초과～210 이하
2 . 7
3 . 2
210 초과～240 이하
3 . 3
3 . 8
240 초과
4 . 0
4 . 0
비고 : 카가 상승 또는 하강할 때 최상층 또는 최하층의 1개층 앞에서 카를 강제적으로 감속
시키고 최상층 또는 최하층 구간에서는 꼭대기틈새 및 피트깊이에 맞는 적정 속도 이
하로 정속주행하도록 제어하는 종단층강제감속장치를 설치한 경우에는 수시검사에 한
하여 표1에서 규정된 치수를 한단계 낮추어 꼭대기틈새와 피트깊이를 적용할 수 있
다.(완성검사일로부터 3년이 경과하지 않은 승강기는 제외)
승강기 안전기준 연혁집[v1.0]
❙ 52');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6', '2022-03-02', NULL, 'current', '6.6 기계실·기계류 공간 및 풀리실');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.1', '2022-03-02', NULL, 'current', '6.6.1 일반사항
  점검 등 유지관리 업무 수행, 비상운전을 위한 공간 및 관련 작업구역은 환경적인 영향에
대하여 적절하게 보호되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.1', '2022-03-02', NULL, 'current', '6.1.1 구동기 및 풀리는 전용 공간에 설치되어야 한다. 이러한 공간 및 관련 작업구역은 접근이 가능하여야 한다. 이 공간의 
출입 또는 접근은 권한이 부여된 사람(유지보수, 점검 및 구출)에게만 허용되어야 한다. 이 공간 및 관련 작업구역은 
환경적인 영향을 고려하여 적절하게 보호되어야 하고, 유지보수, 점검 및 비상운전을 위해 적절한 공간이 확보되어야 
한다.(부속서 Ⅹ 참조)
표 1 < 2004년 12월 1일 전까지의 종전기준 >
정격속도(m/min)
꼭대기틈새(m)
피트깊이(m)
 45 이하
1 . 2
1 . 2
 45 초과 ~ 60 이하
1 . 4
1 . 5
 60 초과 ~ 90 이하
1 . 6
1 . 8
 90 초과 ~ 120 이하
1 . 8
2 . 1
120 초과 ~ 150 이하
2 . 0
2 . 4
150 초과 ~ 180 이하
2 . 3
2 . 7
180 초과 ~ 210 이하
2 . 7
3 . 2
210 초과 ~ 240 이하
3 . 3
3 . 8
240 초과
4 . 0
4 . 0
[전기식]
4.1.4(3) 카가 최하층에 수평으로 정지되어 있는 경우에 카와 완충기의 거리에 완충기의 충격정도를 더한 수치는 균형추의 
꼭대기틈새보다 작아야 한다.
[유압식]
4.2.4(1) 카가 최하층에 수평으로 정지하고 있을 때의 카와 완충기와의 거리는 표 9의 규정에 합격하여야 한다. 다만, 자동차용 
엘리베이터의 경우에는그러하지 아니하다.
 
 
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
53 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.1', '1997-08-18', '2022-03-01', 'old', '3.1.5(8) 기계실의 바로 위층 또는 인접한 벽면에 물탱크실이 있을 경우에는 물이 범람하는 경우에 대비하여 충분한 침수방지
조치를 하여야 한다.
[로프식]
3.1.5(2) 바닥면적은 승강로 수평투영면적의 2배 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 없는 경우에는 
그러하지 아니하다.
[유압식]
3.2.5(4) 기름탱크 전용량의 작동유를 수용할 수 있도록 유압파워유니트의 주위에 기름방벽을 설치하거나 문턱을 높게 하여야 
한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.1', NULL, '1997-08-18', 'old', '[로프식]
3.1.5(2) 바닥면적은 승강로 수평투영면적의 2배 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 없는 경우에는 
그러하지 아니하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.1.1', '2022-03-02', NULL, 'current', '6.6.1.1 기계실·기계류 공간 및 풀리실 내에 설치되는 돌출물은 안전상 지장이 없어야 한다.
 <2019년 3월 28일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.1.2', '2022-03-02', NULL, 'current', '6.6.1.2 기계실·기계류 공간 및 풀리실은 누수가 없어야 하며, 청결상태가 유지되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.1.2', '2017-01-28', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.2', '2022-03-02', NULL, 'current', '6.1.2 구동기 공간 및 풀리 공간은 청결상태가 유지되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.2', '2022-03-02', NULL, 'current', '6.6.2 안내표지 및 설명서');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.2.1', '2022-03-02', NULL, 'current', '6.6.2.1 주 개폐기와 조명 스위치를 쉽게 식별할 수 있는 안내표지가 있어야 한다.
 <2019년 3월 28일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.2.2', '2022-03-02', NULL, 'current', '6.6.2.2 주 개폐기가 차단된 후에도 전기가 통하는 부품(엘리베이터 간 상호연결, 조명 등)이
있는 경우에는 감전 등 위험을 알리는 안내표지가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.2.2', '2013-09-15', '2022-03-01', 'old', '15.4.2 주 개폐기 및 조명 스위치를 쉽게 식별할 수 있는 표시가 있어야 한다.
주 개폐기 개방 후에 전기가 통하는 어떤 부품(엘리베이터 간 상호결선, 조명 등)이 있는 경우에는 이 위험을 알리는 표시가 
있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.2.3', '2022-03-02', NULL, 'current', '6.6.2.3 기계실(6.6.3), 기계류 공간(6.6.5.1) 또는 비상운전 및 작동시험을 위한 패널
(6.6.6)에는 엘리베이터의 갑작스런 고장발생 시 그 고장처리에 관한 설명서가 있어야 
한다. 
특히, 승객 구출운전을 위한 장치 및 승장장문의 비상잠금해제 삼각열쇠의 조작방법·절차
등 구체적인 사용 설명서가 포함되어야 한다.
  비고 승객 구출을 위한 설명서에는 다음의 사항을 참조한다. 
  특수공구의 사용위치, 비상잠금해제 장치에 주의표시 부착, 권한이 부여된 작업 및 구조
작업을 위한 세부지침(브레이크, 상승과속방지수단, 문열림출발방지수단, 밸브파손, 안전
장치 등의 해제)
승강기 안전기준 연혁집[v1.0]
❙ 54');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.2.3', '2013-09-15', '2022-03-01', 'old', '15.4.3 기계실(6.3), 구동기 캐비닛(6.5.2) 또는 비상운전 및 작동시험을 위한 패널(6.6)에는 엘리베이터의 고장이 발생할 경우 
따라야 할 지침. 특히 수동ㆍ전기적 비상운전에 대한 장치 및 승강장문에 대한 비상 열쇠의 사용에 관한 상세한 지침이 
있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3', '2022-03-02', NULL, 'current', '6.6.3 기계실');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.1', '2022-03-02', NULL, 'current', '6.6.3.1 승강로에 있는 권상도르래
  권상도르래는 다음과 같은 경우 승강로에 설치될 수 있다.
  가) 기계실에서 점검 등 유지관리 업무가 수행될 수 있는 경우
  나) 기계실과 승강로 사이의 개구부가 업무 수행자 등 자격자의 추락 또는 작업 공구의 
낙하 위험이 없도록 가능한 작은 경우');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.1.2', '2022-03-02', NULL, 'current', '6.3.1.2 권상 도르래는 다음과 같을 경우 승강로에 설치될 수 있다.
 가) 유지보수 및 점검이 기계실에서부터 수행될 수 있는 경우
 나) 기계실과 승강로 사이의 개구부가 가능한 작은 경우');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2', '2022-03-02', NULL, 'current', '6.6.3.2 기계실의 크기 등 치수');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.1', '2022-03-02', NULL, 'current', '6.6.3.2.1 기계실은 설비의 작업이 쉽고 안전하도록 다음과 같이 충분한 크기이어야 한다. 
특히, 작업구역의 유효 높이는 2.1 m 이상이어야 하고, 유효 수평면적은 다음과 같아야 
한다.
  가) 제어반 및 캐비닛 전면의 유효 수평면적은 다음과 같아야 한다.
     1) 깊이는 외함 표면에서 측정하여 0.7 m 이상이어야 한다.
     2) 폭은 다음 구분에 따른 수치 이상이어야 한다.
        - 제어반 폭이 0.5 m 미만인 경우: 0.5 m
        - 제어반 폭이 0.5 m 이상인 경우: 제어반 폭
  나) 움직이는 부품의 점검 및 유지관리 업무 수행이 필요한 곳에 0.5 m × 0.6 m 
이상의 작업구역이 있어야 한다. 수동 비상운전(13.2.3.1)이 필요할 경우에도 동일
하게 적용한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3.1', '2022-03-02', NULL, 'current', '6.3.3.1 기계실 크기는 설비, 특히 전기설비의 작업이 쉽고 안전하도록 충분하여야 한다.
작업구역에서 유효 높이는 2 m 이상이어야 하고 다음 사항에 적합하여야 한다.
 가) 제어 패널 및 캐비닛 전면의 유효 수평면적은 아래와 같아야 한다.
  1) 폭은 0.5 m 또는 제어 패널·캐비닛의 전체 폭 중에서 큰 값 이상
  2) 깊이는 외함의 표면에서 측정하여 0.7 m 이상
 나) 수동 비상운전 수단(12.5.1)이 필요하다면, 움직이는 부품의 유지보수 및 점검을 위한 유효 수평면적은 0.5 m × 0.6 m 
이상이어야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
55 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3.1', '1999-01-14', '2022-03-01', 'old', '3.1.5(3) 시행
[로프식]
3.1.5(1) 주요한 기기로부터 기둥이나 벽까지의 수평거리는 30㎝ 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 
없는 경우에는 그러하지 아니하다.
3.1.5(3) 바닥면부터 천장 또는 보의 하부까지의 수직거리는 2m 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 
없는 경우에는 그러하지 아니하다.
[유압식]
3.2.5(1) 주요한 기기로부터 기둥이나 벽까지의 수평거리는 50㎝ 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 
없는 경우에는 그러하지 아니하다.
3.2.5(2) 바닥에서부터 천장이나 보의 하단까지의 수직거리는 2m 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 
없는 경우에는 그러하지 아니하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3.1', '1997-08-18', '1999-01-13', 'old', '[로프식]
3.1.5(1) 주요한 기기로부터 기둥이나 벽까지의 수평거리는 30㎝ 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 
없는 경우에는 그러하지 아니하다.
3.1.5(3) 바닥면부터 천장 또는 보의 하부까지의 수직거리는 2m 이상으로 하여야 한다.
[유압식]
3.2.5(1) 주요한 기기로부터 기둥이나 벽까지의 수평거리는 50㎝ 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 
없는 경우에는 그러하지 아니하다.
3.2.5(2) 바닥에서부터 천장이나 보의 하단까지의 수직거리는 2m 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 
없는 경우에는 그러하지 아니하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3.1', NULL, '1997-08-18', 'old', '[로프식]
3.1.5(1) 주요한 기기로부터 기둥이나 벽까지의 수평거리는 30㎝ 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 
없는 경우에는 그러하지 아니하다.
[유압식]
3.2.5(1) 주요한 기기로부터 기둥이나 벽까지의 수평거리는 50㎝ 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 
없는 경우에는 그러하지 아니하다.
3.2.5(2) 바닥에서부터 천장이나 보의 하단까지의 수직거리는 2m 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 
없는 경우에는 그러하지 아니하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.2', '2022-03-02', NULL, 'current', '6.6.3.2.2 작업구역(6.6.3.2.1)간 이동통로의 유효 높이(바닥에서 천장의 가장 낮은 충돌점 
사이)는 1.8 m 이상이어야 한다.
  작업구역 간 이동통로의 유효 폭은 0.5 m 이상이어야 한다. 다만, 움직이는 부품이나 
14.1.1.6에 따른 고온의 표면이 없는 경우에는 0.4 m까지 감소될 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3.2', '2022-03-02', NULL, 'current', '6.3.3.2 6.3.3.1에서 기술된 유효 공간으로 접근하는 통로의 폭은 0.5 m 이상이어야 한다. 다만, 움직이는 부품이 없는 경우에는 
0.4 m로 줄일 수 있다.
 이동을 위한 공간의 유효 높이는 바닥에서부터 천장의 빔 하부까지 측정하여 1.8 m 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.3', '2022-03-02', NULL, 'current', '6.6.3.2.3 보호되지 않은 회전부품 위로 0.3 m 이상의 유효 수직거리가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.3', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3.3', '2022-03-02', NULL, 'current', '6.3.3.3 구동기의 회전부품 위로 0.3 m 이상의 유효 수직거리가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.4', '2022-03-02', NULL, 'current', '6.6.3.2.4 기계실 바닥에 0.5 m를 초과하는 단차가 있는 경우, 6.2.5에 따른 고정된 사다리
또는 보호난간이 있는 계단이나 발판이 있어야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 56');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.4', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3.4', '2022-03-02', NULL, 'current', '6.3.3.4 기계실 바닥에 0.5 m를 초과하는 단차가 있을 경우에는 보호난간이 있는 계단 또는 발판이 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3.4', '2003-06-18', '2022-03-01', 'old', '3.1.5(9)② 시행
3.1.5(9) 기계실로 가는 복도․계단 및 출입문 등은 다음 각항의 기준에 적합하여야 한다. 
 ② 계단은 불연재료로 설치하여야 하고, 발판․난간 및 경사가 있어야 하며, 계단의 폭은 0.7m 이상이여야 한다. 다만, 위의 
조건을 만족하는 사다리(원형사다리 포함)는 계단으로 간주할 수 있으며, 기계실 바닥까지의 높이가 1.5m 미만인 경우에는 
수직사다리를 설치할 수 있다. 또한, 기계실 바닥의 높이차가 45㎝를 초과하는 경우에도 계단 또는 사다리를 설치하여야 
한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3.4', '1997-08-18', '2003-06-17', 'old', '3.1.5(9) 기계실로 가는 복도․계단 및 출입문 등은 다음 각항의 기준에 적합하여야 한다. 
 ② 계단은 불연재료로 설치하여야 하고, 발판․난간 및 경사가 있어야 한다. 다만, 위의 조건을 만족하는 사다리(원형사다리 
포함)는 계단으로 간주할 수 있으며, 기계실 바닥까지의 높이가 1.5m 미만인 경우에는 수직사다리를 설치할 수 있다. 
또한, 기계실 바닥의 높이차가 45㎝를 초과하는 경우에도 계단 또는 사다리를 설치하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3.4', NULL, '1997-08-18', 'old', '3.1.5(9) 기계실로 가는 복도, 계단, 출입문 등은 유지관리상 지장이 없어야 한다.” 및 “출입구의 자물쇠의 시건장치는 양호하여야 
한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.5', '2022-03-02', NULL, 'current', '6.6.3.2.5 작업구역 및 작업구역 간 이동통로 바닥에 깊이 0.05 m 이상, 폭 0.05 m에서 
0.5 m 사이의 함몰이 있거나 덕트가 있는 경우, 그 함몰부분 및 덕트는 덮개 등으로 
보호되어야 한다.
  폭이 0.5 m를 초과하는 함몰이 있는 경우에는 단차가 발생한 것으로 간주하고, 
6.6.3.2.4를 적용한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.5', '2015-05-13', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3.5', '2022-03-02', NULL, 'current', '6.3.3.5 기계실 작업구역의 바닥 또는 작업구역 간 이동 통로의 바닥에 폭이 0.05 m 이상이고 0.5 m 미만이며, 깊이가 0.05 m를 
초과하는 함몰이 있거나 덕트가 있는 경우, 그 함몰부분 및 덕트는 방호되어야 한다.
 폭이 0.5 m를 초과하는 함몰은 6.3.3.4에 따른 단차로 고려되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3.5', '2013-09-15', '2022-03-01', 'old', '6.3.3.5 기계실 바닥에 폭 0.5 m, 깊이 0.5 m를 초과하는 함몰 또는 덕트가 있는 경우, 함몰부분 및 덕트는 방호되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.3.5', NULL, '2013-09-15', 'old', '4.1.1(1) 유압식 제외
4.1.1(1) 기계실의 구조 및 설비
 ① 주로프․조속기로프 및 층상선택기의 스티일테이프 등은 기계실 바닥의 관통부분과 접촉되지 않아야 하고, 엘리베이터 
관련 설비 이외의 것이 기계실 바닥을 관통하여서는 아니된다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.3', '2022-03-02', NULL, 'current', '6.6.3.3 그 밖의 개구부
  슬라브 및 기계실 바닥의 개구부 크기는 그 목적을 위해 최소화 되어야 한다. 
승강로 위에 있는 개구부(전기 케이블을 위한 개구부 포함)를 통해 물건이 떨어지는 
위험이 없도록 금속이나 플라스틱으로 된 덮개가 사용되어야 하며, 그 덮개는 슬라브 또는 
마감된 바닥 위로 50 ㎜ 이상 돌출되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.3', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.5', '2022-03-02', NULL, 'current', '6.3.5 기타 개구부
슬라브 및 바닥의 구멍은 그 목적을 위해 치수를 최소로 줄여야 한다. 승강로 위에 위치한 개구부를 통해 전선을 포함한 물건이 
떨어지는 위험이 없도록 금속 또는 플라스틱으로 된 덮개가 사용되어야 하며, 이러한 덮개는 슬라브 또는 마감된 바닥 위로 
50 mm 이상 돌출되어야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
57 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.3.5', NULL, '2013-09-15', 'old', '[로프식]
4.1.1(1) 기계실의 구조 및 설비
 ① 주로프․조속기로프 및 층상선택기의 스티일테이프 등은 기계실 바닥의 관통부분과 접촉되지 않아야 하고, 엘리베이터 
관련 설비 이외의 것이 기계실 바닥을 관통하여서는 아니된다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4', '2022-03-02', NULL, 'current', '6.6.4 승강로 내부의 기계류 공간');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.1', '2022-03-02', NULL, 'current', '6.6.4.1 일반사항');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.1.1', '2022-03-02', NULL, 'current', '6.6.4.1.1 건축물의 외벽에 반-밀폐식 승강로가 구획된 경우, 기계류는 환경적인 영향에 
대비하여 적절하게 보호되어야 한다.
  비고 기계류는 눈·비 및 먼지 등에 의한 안전 및 성능에 영향을 받지 않도록 IP 등급 등 특별한 예방조치
가 마련되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.1.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.1.2', '2022-03-02', NULL, 'current', '6.4.1.2 건축물 외부에 부분적으로 둘러싸인 승강로 즉, 반-밀폐식 승강로의 경우, 구동기는 환경적인 영향에 대비하여 적절하게 
보호되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.1.2', '2022-03-02', NULL, 'current', '6.6.4.1.2 승강로 내부의 작업구역 간 이동 통로의 유효 높이는 1.8 m 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.1.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.1.3', '2022-03-02', NULL, 'current', '6.4.1.3 승강로 내부의 작업구역에서 다른 작업구역으로 이동하는 공간의 유효 높이는 1.8 m 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.1.3', '2022-03-02', NULL, 'current', '6.6.4.1.3 다음과 같은 설비에는 조작에 필요한 모든 설명이 포함된 안내문이 승강로의 
적절한 위치에 부착되어야 한다.
  가) 접이식 플랫폼(6.6.4.5) 및 이동식 멈춤 쐐기[6.6.4.5.2나)]
  나) 수동으로 작동되는 기계 장치(6.6.4.3.1, 6.6.4.4.1)
<2019년 3월 28일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.2', '2022-03-02', NULL, 'current', '6.6.4.2 승강로 내부 작업구역의 치수');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.2.1', '2022-03-02', NULL, 'current', '6.6.4.2.1 작업구역은 승강로 내부 설비의 작업이 쉽고 안전하도록 다음과 같이 충분한 크기
이어야 한다.
  특히, 작업구역의 유효 높이는 2.1 m 이상이어야 하고, 유효 수평공간은 다음과 같아야 
한다.
  가) 제어반 및 캐비닛 전면의 유효 수평공간은 다음과 같아야 한다.
     1) 깊이는 외함 표면에서 측정하여 0.7 m 이상이어야 한다.
     2) 폭은 다음 구분에 따른 수치 이상이어야 한다.
        - 제어반 폭이 0.5 m 미만인 경우: 0.5 m
        - 제어반 폭이 0.5 m 이상인 경우: 제어반 폭
  나) 움직이는 부품의 점검 및 유지관리 업무 수행이 필요한 곳에 0.5 m × 0.6 m 이상의 
작업구역이 있어야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 58');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.2.1', '2015-05-13', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.2.1', '2022-03-02', NULL, 'current', '6.4.2.1 승강로 내부의 구동기 작업구역의 치수는 설비의 작업이 쉽고 안전하도록 충분하여야 한다. 특히, 작업구역의 유효 
높이는 2 m 이상이어야 하고 다음 사항에 적합하여야 한다.
 가) 유지보수 및 점검을 위한 유효 수평면적은 0.5 m × 0.6 m 이상이어야 한다.
 나) 제어 패널 및 캐비닛 앞의 유효 수평공간은 아래와 같아야 한다.
  1) 폭은 0.5 m 또는 제어 패널 및 캐비닛의 전체 폭 중에서 큰 값 이상
  2) 깊이는 외함의 표면에서 측정하여 0.7 m 이상');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.2.1', '2013-09-15', '2022-03-01', 'old', '6.4.2.1 승강로 내부의 구동기 작업구역의 치수는 설비의 작업이 쉽고 안전하도록 충분하여야 한다. 특히, 작업구역의 유효 
높이는 2 m 이상이어야 하고 다음 사항에 적합하여야 한다. 
 가) 유지보수 및 점검을 위한 유효 수평면적은 0.5 m × 0.6 m 이상이어야 한다. 
 나) 제어 패널 및 캐비닛 앞의 유효 수평면적은 아래와 같아야 한다. 
  1) 폭은 0.5 m 또는 제어 패널 및 캐비닛의 전체 폭 중에서 큰 값 이상 
  2) 깊이는 외함의 표면에서 측정하여 0.7 m 이상');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.2.2', '2022-03-02', NULL, 'current', '6.6.4.2.2 보호되지 않은 회전부품 위로 0.3 m 이상의 유효 수직거리가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.2.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.2.2', '2022-03-02', NULL, 'current', '6.4.2.2 구동기의 보호되지 않은 회전 부품 위로 0.3 m 이상의 유효 수직거리가 있어야 한다. 수직거리가 0.3 m 미만일 경우에는 
9.7.1가)에 따라 보호되어야 한다. 또한, 5.7.1.1 또는 5.7.2.2에 적합하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.3', '2022-03-02', NULL, 'current', '6.6.4.3 카 내부 또는 카 지붕 위의 작업구역');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.3.1', '2022-03-02', NULL, 'current', '6.6.4.3.1 카 내부 또는 카 지붕에서 기계류의 점검 등 유지관리 업무를 수행하는 경우, 
그 업무 수행으로 문열림출발 등 통제되지 않거나 예측되지 않은 카의 움직임이 사람을 
위험하게 만들 수 있다면 다음과 같이 그 위험을 방지해야 한다.
  가) 카의 위험한 움직임은 기계적인 장치에 의해 보호되어야 한다.
  나) 기계적인 장치가 작동된 경우, 카의 모든 움직임은 15.2에 따른 전기안전장치에 의해
방지되어야 한다.
  다) 기계적인 장치가 작동 위치에 있고 힘이 가해져 해제되지 않을 때, 점검자 등 자격
자가 다음 중 어느 하나의 방법을 통해 승강로 밖으로 나올 수 있어야 한다. 또한, 
탈출 절차에 관한 설명이「승강기 안전관리법 시행규칙」 제9조제5호에 따른 유지관리
매뉴얼에 포함되어야 한다.
      1) 카문의 상부틀/구동부 위로 0.5 m × 0.7 m 이상 열린 승강장문
      2) 8.6에 따른 카 지붕의 비상구출문
         이 경우 카 안으로 안전하게 내려갈 수 있는 손잡이가 있는 발판 또는 사다리가 
있어야 한다.
      3) 6.3에 따른 비상문');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.3.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.3.1', '2022-03-02', NULL, 'current', '6.4.3.1 구동기의 유지보수 또는 점검을 카 내부 또는 카 지붕에서 수행하는 경우 및 유지보수 또는 점검의 결과로 제어되지 
않거나 예상하지 못한 카의 움직임이 사람을 위험하게 만들 수 있는 경우에는 다음 사항에 적합하여야 한다.
 가) 기계적인 장치에 의해 카의 위험스러운 움직임은 보호되어야 한다.
 나) 기계적인 장치가 작동위치에 있는 경우에는 14.1.2에 적합한 전기안전장치에 의해 카의 모든 움직임이 보호되어야 한다.
 다) 이 장치가 작동하고 있을 때 안전하게 유지보수 또는 점검을 수행할 수 있어야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
59 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.3.2', '2022-03-02', NULL, 'current', '6.6.4.3.2 비상운전 및 작동시험을 위해 필요한 장치는 6.6.6에 따라 승강로 외부에서 비상
운전 및 작동시험이 수행될 수 있도록 배치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.3.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.3.2', '2022-03-02', NULL, 'current', '6.4.3.2 비상운전 및 작동시험(브레이크 시험, 권상 시험, 비상정지장치 시험, 완충기 시험 또는 카의 상승과속방지수단의 시험 
같은)을 위해 필요한 장치는 6.6에 따라 승강로 외부에서 비상운전 및 작동시험이 가능하도록 배치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.3.3', '2022-03-02', NULL, 'current', '6.6.4.3.3 카 벽에 점검문이 있는 경우, 그 점검문은 다음과 같아야 한다.
  가) 6.3.2라)에 적합해야 한다.
  나) 점검문의 폭이 0.3 m 이상인 경우에는 승강로 아래로 추락을 방지하기 위한 방호수단
(분리대 등)이 있어야 한다.
  다) 카 외부 방향으로 열리지 않아야 한다.
  라) 열쇠로 조작되는 잠금장치가 있어야 하며, 그 잠금장치는 열쇠 없이 다시 닫히고 잠길
수 있어야 한다.
  마) 잠금상태를 확인하는 15.2에 따른 전기안전장치가 있어야 한다.
  바) 그 밖에 카 벽과 같은 기준을 만족해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.3.3', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.3.3', '2022-03-02', NULL, 'current', '6.4.3.3 점검문 또는 점검 트랩문이 카 벽에 설치된 경우에는 다음 사항에 적합하여야 한다.
 가) 점검문 및 점검 트랩문을 통해서 요구된 작업을 수행하도록 크기는 충분하여야 한다.
 나) 승강로 아래로 추락을 방지하기 위해 가능한 작아야 한다.
 다) 카 외부 방향으로 열리지 않아야 한다.
 라) 열쇠로 조작되는 잠금장치가 있어야 하며, 열쇠 없이 다시 닫히고 잠길 수 있어야 한다.
 마) 잠금 상태를 확인하는 14.1.2에 적합한 전기안전장치가 있어야 한다.
 바) 구멍이 없어야 하고 카 벽과 동일한 기계적 강도를 가져야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.3.4', '2022-03-02', NULL, 'current', '6.6.4.3.4 점검문이 열린 상태로 카 내부에서 카를 움직일 필요가 있는 경우에는 다음과 
같아야 한다.
  가) 16.1.5에 따른 점검운전 조작반은 점검문 근처에서 조작할 수 있어야 한다.
  나) 점검운전 조작반은 자격자만 접근(점검문 뒤편에 두는 방법 등) 할 수 있어야 하고, 
카 상부에서 점검운전을 할 때에는 점검운전 조작반으로 카의 운전이 불가능하도록 
설계되어야 한다.
  다) 개구부의 작은 치수가 0.2 m 를 초과한 경우, 카 벽 개구부의 외측 끝 부분과 승강로에 
설치된 설비(그 개부구 전면에 있는 설비를 말한다) 사이의 유효 수평거리는 0.3 m 
이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.3.4', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.3.4', '2022-03-02', NULL, 'current', '6.4.3.4 점검문이 열린 상태로 카 내부에서 카를 움직일 필요가 있는 경우에는 다음 사항에 적합하여야 한다.
 가) 14.2.1.3에 따른 점검운전 제어장치는 점검문 근처에서 이용할 수 있는 위치에 있어야 한다.
 나) 카의 점검운전 제어장치는 6.4.3.3마)에 따른 전기안전장치를 무효화 시켜야 한다.
 다) 카 내부의 점검운전 제어장치는 권한이 있는 사람만이 접근 가능(점검문의 뒤편에 두는 것에 의해 등)하도록 하고 카 
상부의 점검운전시에는 카 내부의 점검운전이 무효화되어야 한다.
 라) 개부구의 작은 치수가 0.2 m를 초과하는 경우, 카 벽 개구부의 외측 끝 부분과 열린 개부구의 전면 승강로에 설치된 
설비 사이의 수평거리는 0.3 m 이상이어야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 60');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.4', '2022-03-02', NULL, 'current', '6.6.4.4 피트 내부의 작업구역');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.4.1', '2022-03-02', NULL, 'current', '6.6.4.4.1 피트에서 기계류의 점검 등 유지관리 업무를 수행하는 경우, 그 업무 수행으로 
문열림출발 등 통제되지 않거나 예측되지 않은 카의 움직임이 사람을 위험하게 만들 수 
없도록 다음 사항에 적합해야 한다.
  가) 6.5.8.2가)의 1) 및 2)에 따른 경우를 제외하고, 작업구역의 바닥과 카의 가장 낮은 
부분 사이의 수직거리 2 m 이상을 확보하기 위해 정격하중을 적재하고 정격속도로 
하강하는 카를 기계적으로 정지시킬 수 있는 장치가 영구적으로 설치되어야 한다. 
추락방지안전장치를 제외한 기계적인 장치에 의한 카의 감속도는 완충기(12.2)에 의한 
감속도를 초과하지 않아야 된다.
  나) 기계적인 장치는 카를 정지된 상태로 유지할 수 있어야 한다.
  다) 기계적인 장치는 수동 또는 자동으로 작동될 수 있어야 한다.
  라) 피트에 출입할 수 있는 문이 열쇠 사용에 의해 열렸을 때, 엘리베이터의 모든 움직
임을 막는 15.2에 따른 전기안전장치에 의해 확인되어야 한다. 
엘리베이터의 움직임은 바)에 따른 경우에만 가능해야 한다.
  마) 기계적인 장치가 작동된 경우, 카의 모든 움직임이 15.2에 따른 전기안전장치에 의해
방지되어야 한다.
  바) 15.2에 따른 전기안전장치에 의해 기계적인 장치가 작동 위치에 있다는 것이 확인
되면, 전기적으로 구동시키는 카의 움직임은 점검운전 조작반에 의해서만 가능해야 한다.
  사) 엘리베이터의 정상운전 상태로의 복귀는 점검자 등 관계자만이 접근 가능한(잠긴 캐비닛 
내부 등) 승강로 외부의 전기적인 재-설정(reset) 장치에 의해서만 가능해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.4.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.4.1', '2022-03-02', NULL, 'current', '6.4.4.1 피트에서 구동기를 유지보수하거나 점검하는 경우 및 이러한 작업이 카를 움직이는데 필요한 경우 또는 제어되지 않거나 
예상하지 못한 카의 움직임이 발생할 경우에는 다음 사항에 적합하여야 한다.
 가) 5.7.3.3나)의 1) 및 2)에서 기술된 것을 제외하고, 작업구역의 바닥과 카의 가장 낮은 부품 사이의 수직거리를 2 m 이상으로 
하기 위해 정격하중을 실은 카를 정격속도까지의 어떤 속도에서 기계적으로 정지시킬 수 있는 영구적인 장치가 설치
되어야 한다. 비상정지장치 이외의 다른 기계적인 장치의 감속도는 완충기에 의한 감속도(10.4)를 초과하지 않아야 한다.
 나) 기계적인 장치는 카의 정지 상태를 유지할 수 있어야 한다.
 다) 기계적인 장치는 수동 또는 자동으로 작동되어야 한다.
 라) 피트에서 카를 움직일 필요가 있는 경우, 14.2.1.3에 따른 점검운전 제어장치가 피트에서 사용될 수 있어야 한다.
 마) 열쇠를 사용한 피트 출입문의 개방은 엘리베이터가 더 이상 움직이지 않도록 방지하는 14.1.2에 따른 전기안전장치에 
의해 확인되어야 한다.
 바) 기계적인 장치가 작동위치에 있을 때 14.1.2에 적합한 전기안전장치에 의해 카의 모든 움직임이 보호되어야 한다.
 사) 14.1.2에 적합한 전기안전장치에 의해 확인되는 것과 같이 기계적인 장치가 작동위치에 있을 때 전기적으로 구동되는 
카의 움직임은 점검운전 제어장치로만 가능하여야 한다.
 아) 전기적인 복귀장치의 작동에 의해서만 엘리베이터가 정상운행으로 복귀가 가능하여야 한다. 이 장치는 승강로 외부에 
설치되어 권한이 있는 사람만이 접근(잠김 캐비닛의 내부에 설치되어 있는 경우) 할 수 있어야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
61 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.4.2', '2022-03-02', NULL, 'current', '6.6.4.4.2 카가 6.6.4.4.1 가)에 따른 위치에 있을 때, 점검자 등 관계자가 다음 중 어느 
하나의 방법을 통해 피트 밖으로 나올 수 있어야 한다.
  가) 0.5 m 이상의 승강장문 바닥과 카 에이프런 가장 낮은 부분사이의 수직 틈새
  나) 피트 출입문');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.4.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.4.2', '2022-03-02', NULL, 'current', '6.4.4.2 카가 6.4.4.1가)에 따른 위치에 있을 때, 작업구역에 안전하게 있을 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.4.3', '2022-03-02', NULL, 'current', '6.6.4.4.3 비상운전 및 작동시험을 위해 필요한 장치는 6.6.6에 따라 승강로 외부에서 비상
운전 및 작동시험이 수행될 수 있도록 배치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.4.3', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.4.3', '2022-03-02', NULL, 'current', '6.4.4.3 비상운전 및 작동시험(브레이크, 권상능력, 비상정지장치, 완충기 또는 카의 상승과속방지수단의 시험)을 위해 필요한 
장치는 6.6에 따라 승강로 외부에서 비상운전 및 작동시험이 가능하도록 배치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5', '2022-03-02', NULL, 'current', '6.6.4.5 플랫폼 위의 작업구역');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.1', '2022-03-02', NULL, 'current', '6.6.4.5.1 플랫폼 위에서 기계류의 점검 등 유지관리 업무를 수행하는 경우, 그 플랫폼은 
다음과 같아야 한다.
  가) 영구적으로 설치되어야 한다.
  나) 카 또는 균형추/평형추의 주행로에 있는 경우에는 집어넣을 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.5.1', '2022-03-02', NULL, 'current', '6.4.5.1 구동기의 유지보수 또는 점검을 플랫폼에서 수행하는 경우, 다음 사항에 적합하여야 한다.
 가) 플랫폼은 영구적으로 설치되어야 하고,
 나) 플랫폼이 카 또는 균형추의 주행로에 있는 경우에는 집어넣을 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.2', '2022-03-02', NULL, 'current', '6.6.4.5.2 카, 균형추 또는 평형추의 주행로 내부에 위치한 플랫폼에서 기계류의 점검 등 
유지관리 업무를 수행하는 경우에는 다음 중 어느 하나에 적합해야 한다.
  가) 카는 6.6.4.3.1가) 및 나)에 따른 기계적 장치를 사용하여 정지상태가 유지되어야 한다.
  나) 카를 움직일 필요가 있는 경우, 카의 움직임은 멈춤 쐐기에 의해 다음과 같이 카의 
주행로가 제한되어야 한다.
      1) 정격속도의 카가 플랫폼을 향해 아래로 운행되는 경우, 플랫폼 위로 2 m 이상
에서 카를 정지시켜야 한다.
      2) 정격속도의 카가 플랫폼을 향해 위로 운행되는 경우, 6.5.7.2에 적합하도록 플랫폼
아래에서 카를 정지시켜야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.5.2', '2022-03-02', NULL, 'current', '6.4.5.2 카, 균형추 또는 평형추의 주행로에 위치한 플랫폼에서 구동기의 유지보수 또는 점검이 수행되는 경우에는 다음과 
같아야 한다.
 가) 카는 6.4.3.1의 가) 및 나)에 적합한 기계적인 장치를 사용하여 정지되어야 한다.
 나) 카를 움직일 필요가 있는 경우에는 움직이는 멈춤 쇄기에 의해 아래와 같이 카의 주행로가 제한되어야 한다.
  1) 카가 플랫폼을 향해 아랫방향으로 운행되는 경우, 플랫폼 위로 2 m 이상 정지
  2) 카가 플랫폼을 향해 위 방향으로 운행되는 경우, 5.7.1.1의 나), 다) 및 라)에 적합하게 플랫폼 아래에 정지
승강기 안전기준 연혁집[v1.0]
❙ 62');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.3', '2022-03-02', NULL, 'current', '6.6.4.5.3 플랫폼은 다음과 같아야 한다.
  가) 어떤 위치에서라도 0.2 m × 0.2 m의 면적에 1,000 N으로 각각 계산된 두 사람의
무게를 영구적인 변형 없이 견딜 수 있어야 한다. 
플랫폼이 무거운 설비의 양중 등을 위한 목적으로 사용된 경우에는 그 설비의 무게에
맞춰 플랫폼의 크기가 고려되어야 하고, 그 플랫폼은 설계된 하중 및 힘을 견딜 수 
있는 기계적인 강도(6.1.7 참조)가 있어야 하며, 최대 허용 하중이 그 플랫폼에 표시
되어야 한다.
  나) 8.7.4에 따른 난간이 있어야 한다.
  다) 다음과 같은 조건을 입증하는 수단이 있어야 한다.
      1) 플랫폼 바닥과 출입층 사이의 발판 높이는 0.5 m 이하이어야 한다.
      2) 플랫폼과 출입문의 문턱 사이의 틈새를 통해 0.15 m의 구(球)가 통과되어서는 
안 된다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.3', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.5.3', '2022-03-02', NULL, 'current', '6.4.5.3 플랫폼은 다음과 같아야 한다.
 가) 어떤 지점에서 0.2 m × 0.2 m의 면적에 1,000 N으로 각각 계산한 두 사람 이상의 무게를 영구적인 변형 없이 견딜 수 
있어야 한다.
 나) 8.13.3의 규정에 적합한 보호난간이 설치되어야 한다.
 다) 아래와 같은 조건을 입증할 수 있는 수단이 설치되어야 한다.
  1) 플랫폼 바닥과 출입문 바닥 사이의 발판 높이는 0.5 m를 초과하지 않아야 한다.
  2) 플랫폼과 출입문의 문턱사이의 틈새를 통해 지름 0.15 m의 구가 통과되지 않아야 한다.
  3) 승강로 아래로 추락을 방지하는 추가적인 대비가 없다면, 완전히 열린 승강장문 문짝과 플랫폼 가장자리 사이를 수평으로 
측정한 틈새는 0.15 m를 초과하지 않아야 한다.
15.4.6 최대 허용하중은 플랫폼에 표기되어야 한다.(6.4.5.3 참조)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.4', '2022-03-02', NULL, 'current', '6.6.4.5.4 집어넣을 수 있는 플랫폼은 6.6.4.5.3 외에 다음 사항이 추가되어야 한다.
  가) 완전히 집어넣어진 위치를 확인하는 15.2에 따른 전기안전장치가 있어야 한다.
  나) 작업 위치로 플랫폼을 밀어 넣거나, 작업 위치에서 플랫폼을 제거하는 수단이 있어야 한다. 
이런 작동은 피트 또는 점검자 등 자격자만이 접근할 수 있는 승강로 외부에 위치한
수단에 의해서만 가능해야 한다. 
플랫폼의 수동 작동을 위해 필요한 힘은 250 N을 초과하지 않아야 한다. 
  다) 승강장문을 통하지 않고 플랫폼에 출입하는 경우, 다음 중 어느 하나에 적합해야 한다.
      1) 플랫폼에 출입하는 문은 그 플랫폼이 작업 위치에 있지 않을 때에는 열리지 않아야 한다. 
      2) 승강로 아래로 사람이 추락하는 것을 방지하는 수단이 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.4', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.5.4', '2022-03-02', NULL, 'current', '6.4.5.4 6.4.5.3에 추가하여, 집어넣을 수 있는 플랫폼은 다음과 같아야 한다.
 가) 완전히 집어넣은 위치를 확인하는 14.1.2에 적합한 전기안전장치가 설치되어야 한다.
 나) 작업위치에서 집어넣거나 뺄 수 있는 수단이 있어야 한다. 이 수단은 피트에서 접근 할 수 있거나 승강로 외부에 위치한 
수단에 의해 작동되어야 하며 권한이 있는 사람만 접근 가능하여야 한다. 승강장문을 통해 플랫폼에 접근할 수 없는 
경우, 출입문은 플랫폼이 작업위치에 있지 않을 때 열리지 않아야 한다. 또는 다른 방법으로 사람이 승강로 아래로 추락하는 
것을 방지하는 수단이 설치되어야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
63 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.5', '2022-03-02', NULL, 'current', '6.6.4.5.5 6.6.4.5.2 나)의 경우 움직이는 멈춤 쐐기는 플랫폼이 내려질 때 자동으로 작동
되어야 한다. 움직이는 멈춤 쐐기에는 다음과 같은 장치가 있어야 한다.
  가) 12에 따른 완충기
  나) 멈춤 쐐기가 완전히 집어넣어진 위치에 있는 경우에만 카의 움직임을 허용하는 
15.2에 따른 전기안전장치
  다) 멈춤 쐐기가 완전히 연장된 위치에 있는 경우에만 내려진 플랫폼과 함께 카의 움직임을
허용하는 15.2에 따른 전기안전장치');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.5', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.5.5', '2022-03-02', NULL, 'current', '6.4.5.5 6.4.5.2나)의 경우, 움직이는 멈춤 쇄기는 플랫폼이 내려질 때 자동으로 작동되어야 한다. 멈춤 쇄기에는 다음과 같은 
장치가 설치되어야 한다.
 가) 10.3 및 10.4에 적합한 완충기
 나) 멈춤 쇄기가 완전히 집어넣은 위치에 있는 경우, 카의 움직임을 허용하는 14.1.2에 적합한 전기안전장치
 다) 멈춤 쇄기가 완전히 뻗은 위치에 있는 경우, 내려간 플랫폼과 함께 카의 움직임을 허용하는 14.1.2에 적합한 전기안전장치');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.6', '2022-03-02', NULL, 'current', '6.6.4.5.6 플랫폼에서 카를 움직일 필요가 있는 경우에는 그 플랫폼에서 16.1.5에 따른 
점검운전 조작반의 사용이 가능해야 한다.
움직이는 멈춤 쐐기가 작동 위치에 있을 때, 전기적으로 구동시키는 카의 움직임은 점검
운전 조작반에 의해서만 가능해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.6', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.5.6', '2022-03-02', NULL, 'current', '6.4.5.6 플랫폼에서 카를 움직일 필요가 있는 경우, 14.2.1.3에 따른 점검운전 제어장치는 플랫폼에서 이용 가능하여야 한다. 
움직이는 멈춤 쇄기가 작동하는 위치에 있을 때, 카의 전기적인 움직임은 점검운전 제어장치에서만 가능하여야 한다');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.7', '2022-03-02', NULL, 'current', '6.6.4.5.7 비상운전 및 작동시험을 위해 필요한 장치는 6.6.6에 따라 승강로 외부에서 비상
운전 및 작동시험이 수행될 수 있도록 배치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.7', '2013-09-15', '2022-03-01', 'old', '[전기식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.5.7', '2022-03-02', NULL, 'current', '6.4.5.7 비상운전 및 작동시험(브레이크 시험, 권상 시험, 비상정지장치 시험, 완충기 시험 또는 카의 상승과속방지수단의 시험 
같은)을 위해 필요한 장치는 6.6에 따라 승강로 외부에서 비상운전 및 작동시험이 가능하도록 배치되어야 한다.
[유압식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.5.7', '2022-03-02', NULL, 'current', '6.4.5.7 비상운전 및 작동시험(비상정지장치 시험, 완충기 시험, 럽처밸브 시험, 압력 시험 등과 같은)을 위해 필요한 장치는 
6.6에 따라 승강로 외부에서 비상운전 및 작동시험이 가능하도록 배치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.5.8', '2022-03-02', NULL, 'current', '6.6.4.5.8 최대 허용 하중이 플랫폼에 표시되어야 한다.
 <2019년 3월 28일 이후 건축허가분부터 적용>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4.6', '2022-03-02', NULL, 'current', '6.6.4.6 승강로 외부의 작업구역
  기계류가 승강로에 있고, 승강로 외부에서 점검 등 유지관리 업무가 수행되는 경우,');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.1', '2022-03-02', NULL, 'current', '6.6.3.2.1 및 6.6.3.2.2에 따른 작업구역은 승강로 외부에 있을 수 있다. 
이러한 설비에 접근은 6.3에 따른 점검문을 통해서만 가능해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3.2.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.6', '2022-03-02', NULL, 'current', '6.4.6 승강로 외부의 작업구역
6.1과 달리 구동기는 승강로에 있고 승강로 외부에서 유지보수 또는 점검을 수행하는 경우, 6.3.3.1 및 6.3.3.2에 따른 작업구역은 
승강로 외부에 있을 수 있다. 이 설비는 6.4.7.2에 적합한 문에 의해서만 접근이 가능하여야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 64');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5', '2022-03-02', NULL, 'current', '6.6.5 승강로 외부의 기계류 공간');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.1', '2022-03-02', NULL, 'current', '6.6.5.1 기계류 공간');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.1.1', '2022-03-02', NULL, 'current', '6.6.5.1.1 엘리베이터의 기계류는 엘리베이터 전용 공간 내부에 위치되어야 한다. 이 공간
에는 엘리베이터 용도 이외의 덕트, 전선 또는 장치 등이 포함되지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.1.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1', '2022-03-02', NULL, 'current', '6.5.1 일반사항
승강로 외부에 있고 구획된 기계실에 위치하지 않은 구동기 공간은 필요로 하는 하중 및 힘에 견디도록 시공되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.1', '2022-03-02', NULL, 'current', '6.5.2.1 엘리베이터 구동기는 엘리베이터 전용 캐비닛 내부에 위치하여야 한다. 캐비닛에는 엘리베이터 이외 용도의 덕트, 케이블 
또는 장치가 포함되지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.1.2', '2022-03-02', NULL, 'current', '6.6.5.1.2 기계류 공간은 구멍이 없는 벽, 바닥, 지붕 및 문으로 구성되어야 한다.
  다음과 같은 개구부는 허용된다. 
  가) 환기구
  나) 엘리베이터 운행을 위해 필요한 승강로와 기계류 공간 사이의 개구부
  다) 화재 시 가스 및 연기의 배출을 위한 통풍구
  상기 개구부에 비-자격자가 접근할 수 있는 경우에는 다음과 같이 보호되어야 한다.
  - 위험지역에 접촉을 막는 KS B ISO 13857, 표 5에 따른 보호
  - 전기설비에 접촉을 막는 KS C IEC 60529, IP 보호등급 2X 이상');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.1.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.2', '2022-03-02', NULL, 'current', '6.5.2.2 구동기 캐비닛은 구멍이 없는 벽, 바닥, 지붕 및 문으로 구획되어야 한다. 다만, 다음과 같은 개구부는 허용될 수 있다.
 가) 환기구
 나) 엘리베이터 성능을 위한 승강로와 구동기 캐비닛 사이의 필요 개구부
 다) 화재 시 가스 및 연기의 배출을 위한 통풍구
 권한이 없는 사람이 접근할 때 이러한 개구부는 다음 사항에 적합하여야 한다.
  1) 위험한 지역에 접촉을 방지하는 KS B 6947, 표 5에 따른 보호
  2) 전기설비의 접촉을 막는 IP 2X 이상의 보호 등급');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.1.3', '2022-03-02', NULL, 'current', '6.6.5.1.3 문은 다음과 같아야 한다.
  가) 열린 문을 통해 요구된 작업을 수행할 수 있는 충분한 크기이어야 한다.
  나) 공간 내부 방향으로 열리지 않아야 한다.
  다) 열쇠로 조작되는 잠금장치가 있어야 하며, 그 잠금장치는 열쇠 없이 다시 닫히고 잠
길 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.1.3', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.3', '2022-03-02', NULL, 'current', '6.5.2.3 문은 다음 사항에 적합하여야 한다.
 가) 문을 통해 요구된 작업을 수행할 수 있는 충분한 크기를 가져야 한다.
 나) 캐비닛 내부 방향으로 열리지 않아야 한다.
 다) 열쇠로 조작되는 잠금장치가 있어야 하며, 열쇠 없이 다시 닫히고 잠길 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.2', '2022-03-02', NULL, 'current', '6.6.5.2 작업구역
  기계류 공간 전면의 작업구역은 6.6.4.2에 따른 치수에 적합해야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
65 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.5.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.3', '2022-03-02', NULL, 'current', '6.5.3 작업구역
구동기 캐비닛 전면의 작업구역 치수는 6.4.2의 규정에 적합하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.4', '2022-03-02', NULL, 'current', '6.5.4 환기
구동기 캐비닛은 적절하게 환기되어야 한다. 구동기의 전기설비는 성능에 지장이 없도록 먼지, 유해한 연기 및 습도로부터 
보호되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6', '2022-03-02', NULL, 'current', '6.6.6 비상운전 및 작동시험을 위한 장치');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6.1', '2022-03-02', NULL, 'current', '6.6.6.1 6.6.4.3, 6.6.4.4 및 6.6.4.5의 경우 비상운전 및 작동시험에 필요한 장치는 엘리
베이터의 모든 비상운전 및 작동시험(권상능력, 추락방지안전장치, 완충기, 상승과속방지
수단, 문열림출발방지수단, 럽처밸브, 유량제한기, 멈춤쇠 장치, 완충형 정지수단 및 압력
장치)을 승강로 외부에서 수행하기에 적합한 패널에 제공되어야 한다. 
이 패널에는 점검자 등 자격자만 접근할 수 있어야 한다.
  비상운전 및 작동시험을 위한 장치가 기계류 공간 내에 보호되지 않는 경우 다음과 같은
적절한 덮개로 둘러쌓아야 한다.
  가) 승강로 내부 방향으로 열리지 않아야 한다.
  나) 열쇠로 조작되는 잠금장치가 있어야 하며, 그 잠금장치는 열쇠 없이 다시 닫히고 잠길
수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.1', '2022-03-02', NULL, 'current', '6.6.1 6.4.3, 6.4.4 및 6.4.5의 경우, 비상운전 및 작동시험을 위한 필요장치는 승강로 외부에서 모든 비상운전 및 엘리베이터의 
필요한 작동시험을 수행하기 위해 적합한 패널에 있어야 한다. 이 패널에는 권한이 있는 사람만이 접근할 수 있어야 
한다. 또한, 이것은 유지보수 절차 상 카의 움직임이 요구되고 승강로 내부에 있는 작업구역에서 안전하게 작업을 수행할 
수 없을 경우 유지보수를 위한 수단에 적용한다.
     비상운전 및 작동시험 장치가 구동기 캐비닛 내부에서 보호되지 못할 경우, 이 장치는 다음과 같은 적절한 덮개로 둘러
싸여야 한다.
 가) 승강로 내부 방향으로 열리지 않아야 한다.
 나) 열쇠로 조작되는 잠금장치가 있어야 하며, 열쇠 없이 다시 닫히고 잠길 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6.2', '2022-03-02', NULL, 'current', '6.6.6.2 패널에는 다음과 같은 장치 또는 설비가 있어야 한다.
  가) 16.3.2에 따른 비상통화장치와 함께 13.2.2.2.7 및 13.2.3 또는 13.3.9에 따른 비상
운전을 위한 작동장치
  나) 작동시험을 수행하기 위한 제어 설비
  다) 다음과 같은 내용을 표시하는 구동기의 방향 감시장치 또는 표시장치
      1) 카 움직임의 방향
      2) 잠금해제구간의 도착
      3) 카의 속도 
승강기 안전기준 연혁집[v1.0]
❙ 66');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6.2', '2013-09-15', '2022-03-01', 'old', '[전기식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.2', '2022-03-02', NULL, 'current', '6.6.2 패널에는 다음 사항을 만족하는 장치 또는 설비가 있어야 한다. 
 가) 14.2.3.4에 적합한 내부통화 시스템과 함께, 12.5에 따른 비상운전
 나) 작동시험을 수행할 수 있는 제어설비(6.4.3.2, 6.4.4.3, 6.4.5.7)
 다) 아래와 같은 내용을 나타내는 구동기의 방향 감시 또는 표시장치
  - 카의 운행 방향
  - 잠금해제구간의 도착
  - 엘리베이터 카 속도
[유압식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.2', '2022-03-02', NULL, 'current', '6.6.2 패널에는 다음 사항을 만족하는 장치 또는 설비가 있어야 한다. 
 가) 14.2.3.4에 적합한 내부통화 시스템과 함께, 12.9에 따른 비상운전
 나) 작동시험을 수행할 수 있는 제어설비(6.4.3.2, 6.4.4.3, 6.4.5.7)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.2', '2003-06-18', '2022-03-01', 'old', '4.1.1(3)⑧ 2005년 6일 1일 이후 건축허가분부터 유압식 동일 적용
4.1.1(3) 전동기·제동기 및 권상기
⑧ 정상운전모드에서 착상구간 범위 내에서 카 도어 또는 승강장문 중 어느곳에서나 도어스위치 접점이 쇼트되거나 인위적으로 
단락된 경우 이를 감지하여 강제로 승강기 운행을 정지하여야 한다.
< 건축법시행령 제5조제4항제3호에 해당하는 다중이용건축물의 승강기는 2000년 10월 1일 이후 건축허가분부터 적용 >');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6.3', '2022-03-02', NULL, 'current', '6.6.6.3 패널에 있는 장치에서 측정하여 조도 200 ㏓ 이상으로 비추는 전기조명이 영구적
으로 설치되어야 한다. 
패널 자체 또는 근처에 있는 스위치로 패널의 조명을 점멸해야 한다. 
이 조명의 전원공급은 14.7.1에 따른다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6.3', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.3', '2022-03-02', NULL, 'current', '6.6.3 패널에 설치되어 있는 장치를 50 lx 이상으로 비출 수 있는 영구적인 전기 조명이 설치되어야 한다.
패널 위 또는 근처에 설치된 스위치는 패널의 조명을 점멸할 수 있어야 한다.
이 조명의 전원공급은 13.6.1에 적합하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6.4', '2022-03-02', NULL, 'current', '6.6.6.4 비상운전 및 작동시험을 위한 패널 전면에는 6.6.3.2.1에 따른 작업구역이 있어야 
한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.6.4', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.4', '2022-03-02', NULL, 'current', '6.6.4 비상운전 및 시험운전을 위한 패널은 6.3.3.1에 따른 작업구역이 유용한 경우에만 설치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.7', '2022-03-02', NULL, 'current', '6.6.7 풀리실의 구조 및 설비');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7', '2022-03-02', NULL, 'current', '6.7 풀리 공간의 구조 및 설비');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1', '2022-03-02', NULL, 'current', '6.7.1 풀리실
승강로 외부의 풀리는 풀리실에 위치하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.1', '2022-03-02', NULL, 'current', '6.7.1.1 기계적 강도 및 재질');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.1.1', '2022-03-02', NULL, 'current', '6.7.1.1.1 풀리실은 필요로 하는 하중 및 힘에 견디도록 시공되어야 한다. 풀리실은 먼지를 일으키지 않는 내구성이 있는 재
질이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.1.2', '2022-03-02', NULL, 'current', '6.7.1.1.2 풀리실의 바닥은 미끄러지지 않은 재질(콘크리트 마감 또는 체크 플레이트의 금속판 등)이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.2.4', '2022-03-02', NULL, 'current', '6.7.1.2.4 풀리실에 제어 패널 및 캐비닛이 있을 경우, 6.3.3.1 및 6.3.3.2의 규정이 적용된다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
67 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.7.1', '2022-03-02', NULL, 'current', '6.6.7.1 풀리실의 크기 등 치수');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.7.1.1', '2022-03-02', NULL, 'current', '6.6.7.1.1 풀리실은 자격자가 모든 설비에 쉽고 안전하게 접근할 수 있도록 다음과 같이 
충분한 크기이어야 한다.
  가) 움직일 수 있는 유효 높이는 1.5 m 이상이어야 한다.
이 움직일 수 있는 유효 높이는 접근 구역의 바닥에서부터 가장 낮은 충돌 지점의 
아래 부분까지 측정한다.
  나) 움직이는 부품의 점검 및 유지관리 업무 수행이 필요한 곳에 0.5 m × 0.6 m 이상의 
유효 수평 면적이 있어야 한다. 
      이 수평 유효 면적에 접근하는 통로의 유효 폭은 0.5 m 이상이어야 한다. 다만, 움직이는
부품이나 14.1.1.6에 따른 고온의 표면이 없는 경우에는 0.4 m까지 감소될 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.3', '2022-03-02', NULL, 'current', '6.7.1.3 문 및 트랩문');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.3.1', '2022-03-02', NULL, 'current', '6.7.1.3.1 출입문은 폭 0.6 m 이상, 높이 1.4 m 이상이어야 하고 풀리실 내부 방향으로 열리지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.3.2', '2022-03-02', NULL, 'current', '6.7.1.3.2 사람을 위한 출입 트랩문은 0.8 m × 0.8 m 이상의 유효 통로가 있어야 하고, 반대 방향으로 균형이 이루어져야 한다.
트랩문이 닫혀 있을 때, 모든 트랩문은 어느 지점에서나 0.2 m × 0.2 m의 면적에  1,000 N으로 각각 계산한 두 사람의 무게를 
영구적인 변형 없이 견딜 수 있어야 한다.
트랩문이 집어넣을 수 있는 사다리와 연결되지 않을 경우, 트랩문은 하강 방향으로 열리지 않아야 한다. 경첩이 있다면 경첩은 
풀리지 않아야 한다.
트랩문이 열린 상태로 있을 때 사람이 추락하는 것을 막는 조치(보호대 등)가 구비되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.3.3', '2022-03-02', NULL, 'current', '6.7.1.3.3 문 또는 트랩문은 열쇠로 조작되는 잠금장치가 있어야 하며, 열쇠 없이 풀리실 내부에서 열릴 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.5', '2022-03-02', NULL, 'current', '6.7.1.5 정지장치
14.2.2 및 15.4.4에 적합한 정지장치는 풀리실 내부의 출입문 가까운 곳에 설치되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.6', '2022-03-02', NULL, 'current', '6.7.1.6 온도
풀리실에 서리가 끼고 물방울이 맺힐 위험이 있다면 설비를 보호할 수 있는 조치가 구비되어야 한다.
풀리실에 전기설비가 포함된 경우, 주위 온도는 기계실의 온도와 비슷해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.7', '2022-03-02', NULL, 'current', '6.7.1.7 조명 및 콘센트
풀리실에는 도르래에 100 lx 이상을 비출 수 있는 영구적으로 설치된 전기 조명이 있어야 한다. 이 조명의 전원공급은 
13.6.1에 적합하여야 한다.
적절한 높이로 출입지점에 가까이 설치된 조명스위치는 풀리실의 조명을 점멸할 수 있어야 한다.
1개 이상의 콘센트(13.6.2)가 있어야 한다. 6.7.1.2.4 참조
제어 패널 및 캐비닛이 풀리실에 있는 경우에는 6.3.7의 규정이 적용된다.
[전기식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.2', '2022-03-02', NULL, 'current', '6.7.2 승강로 내부의 풀리
카 지붕의 투영면적 외부에 편향 풀리가 위치하고 카 지붕, 카 내부(6.4.3), 플랫폼(6.4.5) 또는 승강로 외부에서 유지보수, 점검운전 
및 작동시험이 안전하게 수행될 수 있는 경우, 편향 풀리는 승강로 상부공간에 설치될 수 있다. 다만, 안전한 상태에서 카 
지붕이나 플랫폼(6.4.5)으로부터 편향 풀리의 샤프트에 닿을 수 있다면 균형추 방향으로 바꾸기 위해 싱글 또는 더블 랩 방식의 
편향 풀리가 카 지붕 위에 설치될 수 있다.
[유압식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.2', '2022-03-02', NULL, 'current', '6.7.2 승강로 내부의 풀리
카 지붕의 투영면적 외부에 편향 풀리가 위치하고 카 지붕, 카 내부(6.4.3), 플랫폼(6.4.5) 또는 승강로 외부에서 유지보수, 점검운전 
및 작동시험이 안전하게 수행될 수 있는 경우, 편향 풀리는 승강로 상부공간에 설치될 수 있다.
승강기 안전기준 연혁집[v1.0]
❙ 68');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.2.2', '2022-03-02', NULL, 'current', '6.7.1.2.2 천장 아래의 높이는 1.5 m 이상이어야 한다.
[전기식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.2.1', '2022-03-02', NULL, 'current', '6.7.1.2.1 풀리실의 크기는 유지보수 점검자가 모든 설비에 쉽고 안전한 출입을 위하여 충분하여야 하며 다음 사항에 적합하여야 
한다.
 가) 움직이는 부품의 유지보수 및 점검을 위한 유효 수평면적은 0.5 m × 0.6 m 이상이어야 한다.
 나) 유효 공간으로의 접근 통로의 폭은 0.5 m 이상이어야 한다. 다만, 움직이는 부품이 없는 경우에는 0.4 m로 줄일 수 있다.
[유압식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.2.1', '2022-03-02', NULL, 'current', '6.7.1.2.1 풀리실의 크기는 유지보수 점검자가 모든 설비에 쉽고 안전한 출입을 위하여 충분하여야 하며 다음 사항에 적합하여야 
한다.
 가) 수동 비상운전 수단(12.9.1)이 필요할 경우, 움직이는 부품의 유지보수 및 점검을 위한 유효 수평면적은 0.5 m × 0.6 m 
이상이어야 한다.
 나) 6.7.1.2.2에 기술된 유효 공간으로의 접근 통로는 0.5 m 이상이어야 한다. 다만, 움직이는 부품이 없는 경우에는 0.4 m로 
줄일 수 있다.
 이동을 위한 유효 높이는 접근공간의 바닥에서부터 천장의 빔 하부까지 측정한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.7.1.2', '2022-03-02', NULL, 'current', '6.6.7.1.2 보호되지 않은 회전부품 위에서 0.3 m 이상의 유효 수직거리가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.7.1.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.2.3', '2022-03-02', NULL, 'current', '6.7.1.2.3 풀리 위로 0.3 m 이상의 유효 공간이 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.7.2', '2022-03-02', NULL, 'current', '6.6.7.2 그 밖의 개구부 
  슬라브 및 풀리실 바닥의 개구부 크기는 그 목적을 위해 최소화 되어야 한다. 
승강로 위에 있는 개구부(전기 케이블을 위한 개구부 포함)를 통해 물건이 떨어지는 위험이 
없도록 금속이나 플라스틱으로 된 덮개가 사용되어야 하며, 그 덮개는 슬라브 또는 마감된
바닥 위로 50 ㎜ 이상 돌출되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.7.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2022-03-02', NULL, 'current', '6.7.1.4 기타 개구부
슬라브 및 풀리실 바닥의 구멍은 그 목적을 위해 최소의 크기로 줄여야 한다.
승강로 위에 위치한 개구부를 통해 전선을 포함한 물건이 떨어지는 위험이 없도록 금속이나 플라스틱으로 된 덮개가 사용되어야 
하며 그 덮개는 슬라브 또는 마감된 바닥 위로 50 mm 이상 돌출되어야 한다.
7 승강장문 및 카문
7.1 일반사항
7.1.1 카에 정상적으로 출입할 수 있는 승강로 개구부에는 승강장문이 제공되어야 하고, 
카에 출입은 카문을 통해야 한다. 다만, 2개 이상의 카문이 있는 경우, 어떠한 경우라도 
2개의 문이 동시에 열리지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2013-09-14', 'old', '8.5.1 카 출입구에는 문이 설치되어야 한다.
8.5.2 카에는 2개 이상의 출입구가 설치될 수 있으나 2개 이상의 문이 동시에 열려 통로로 사용되는 구조가 아니어야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
69 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2004-12-01', '2005-05-31', 'old', '4.1.2(14) 시행 
4.1.2(14) 2004년 12일 1일 이후 건축허가분부터 유압식 동일 적용
3.1.2(3) 사람이나 물건이 균형추, 승강로 벽 등 카 바깥부분에 닿을 염려가 없는 구조로 된 벽 또는 울 및 출입문을 설치하여야 
한다. 다만, 자동차용 엘리베이터의 경우에는 출입문의 설치는 제외하나 자동차가 카 밖으로 벗어날 경우에 엘리베이터의 
운행을 정지시키는 장치가 설치되어 있어야 한다.
3.1.2(5) 카에는 2개 이상의 출입구를 설치할 수 있으나, 2개의 문이 동시에 열려 통로로 사용되는 구조이어서는 아니된다.
3.1.3(4) 1개층에 대한 출입구는 카 1대에 대하여 2개의 출입구를 설치할 수 있으나 2개의 문이 동시에 열려 통로로 사용되는 
구조이어서는 아니된다. 
4.1.2(14) 카 문 또는 승강장 문이 2개 이상 설치된 경우 2개 이상의 문이 동시에 열려 통로로 사용되어서는 아니 된다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '1999-09-03', '2004-11-30', 'old', '3.1.2(5), 3.1.3(4) 시행 
3.1.2(3) 사람이나 물건이 균형추, 승강로 벽 등 카 바깥부분에 닿을 염려가 없는 구조로 된 벽 또는 울 및 출입문을 설치하여야 
한다. 다만, 자동차용 엘리베이터의 경우에는 출입문의 설치는 제외하나 자동차가 카 밖으로 벗어날 경우에 엘리베이터의 
운행을 정지시키는 장치가 설치되어 있어야 한다.
3.1.2(5) 카에는 2개의 출입구를 설치할 수 있으나, 2개의 문이 동시에 열려 통로로 사용되는 구조이어서는 아니된다.
3.1.3(4) 1개층에 대한 출입구는 카 1대에 대하여 2개의 출입구를 설치할 수 있으나 2개의 문이 동시에 열려 통로로 사용되는 
구조이어서는 아니된다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2017-01-28', '2017-01-27', 'old', '7.1.1 엘리베이터의 카로 출입할 수 있는 승강로 개구부에는 구멍이 없는 승강장문이 설치되어야 한다.
8.6.1 카문에는 구멍이 없어야 한다. 다만, 반자동 동력 작동 또는 수동 작동의 수직 개폐식 카문을 사용하는 화물용은 수평으로 
10 mm 이하, 수직으로 60 mm 이하 크기의 구멍이 있을 수 있다.
8.6.2 카문은 닫혔을 때 필수적인 틈새를 제외하고 카 출입구를 완전히 막아야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 70');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2015-05-13', '2015-05-12', 'old', '7.1 일반사항
엘리베이터의 카로 출입할 수 있는 승강로 개구부에는 구멍이 없는 승강장문이 설치되어야 한다.
승강장문이 닫혀 있을 때 문짝사이의 틈새 또는 문짝과 문설주, 인방 또는 문턱 사이의 틈새는 6 mm 이하로 가능한 작아야 
한다. 다만, 마모될 경우에는 10 mm 까지 허용될 수 있다. 이 틈새는 움푹 들어간 부분이 있다면 그 부분의 안쪽을 측정한다.
수직 개폐식 승강장문인 경우에는 상기의 틈새 규정을 10 ㎜까지(마모된 경우에는 14 ㎜) 완화하여 적용할 수 있다.
8.6.1 카문에는 구멍이 없어야 한다. 다만, 반자동 동력 작동 또는 수동 작동의 수직 개폐식 카문을 사용하는 화물용은 수평으로 
10 mm 이하, 수직으로 60 mm 이하 크기의 구멍이 있을 수 있다.
8.6.2 카문은 닫혔을 때 필수적인 틈새를 제외하고 카 출입구를 완전히 막아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2013-09-14', 'old', '7.1 일반사항
엘리베이터의 카로 출입할 수 있는 승강로 개구부에는 구멍이 없는 승강장문이 설치되어야 한다. 승강장문이 닫혀 있을 때 
문짝사이의 틈새 또는 문짝과 문설주, 인방 또는 문턱 사이의 틈새는 6 ㎜ 이하로 가능한 작아야 한다. 
다만, 마모될 경우에는 10 ㎜ 까지 허용될 수 있다. 이 틈새는 움푹 들어간 부분이 있다면 그 부분의 안쪽을 측정한다.
8.6.1 카문에는 구멍이 없어야 한다. 다만, 수직 개폐식 카문을 사용하는 화물용은 수평으로 10 mm 이하, 수직으로 60 mm 
이하 크기의 구멍이 있을 수 있다.
8.6.2 카문은 닫혔을 때 필수적인 틈새를 제외하고 카 출입구를 완전히 막아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', NULL, '2013-09-15', 'old', '3.1.2(3) 사람이나 물건이 균형추, 승강로 벽 등 카 바깥부분에 닿을 염려가 없는 구조로 된 벽 또는 울 및 출입문을 설치하여야 
한다. 다만, 자동차용 엘리베이터의 경우에는 출입문의 설치는 제외하나 자동차가 카 밖으로 벗어날 경우에 엘리베이터의 
운행을 정지시키는 장치가 설치되어 있어야 한다.
7.1.3 승강장문 및 카문이 닫혔을 때, 필수적인 틈새를 제외하고 승장장 출입구 및 카 출
입구를 완전히 닫아야 한다. 
<2019년 3월 28일 이후 건축허가분부터 적용>
7.1.4 승강장문 및 카문이 닫혀 있을 때, 문짝 간 틈새나 문짝과 문틀(측면) 또는 문턱 
사이의 틈새는 6 ㎜ 이하이어야 하며, 관련 부품이 마모된 경우에는 10 ㎜까지 허용될 
수 있다. 유리로 만든 문은 제외한다.[7.6.2.2.1자)3) 참조]
  수직 개폐식 승강장문 및 카문의 경우에는 상기 틈새를 10 ㎜까지 허용될 수 있으며, 
관련부품이 마모된 경우에는 14 ㎜까지 허용될 수 있다. 
  이 틈새는 움푹 들어간 부품이 있다면 그 부분의 안쪽을 측정한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2017-01-28', '2022-03-01', 'old', '7.1.2 승강장문이 닫혀 있을 때 문짝사이의 틈새 또는 문짝과 문설주, 인방 또는 문턱 사이의 틈새는 6 mm 이하로 가능한 
작아야 한다. 다만, 마모될 경우에는 10 mm 까지 허용될 수 있다. 이 틈새는 움푹 들어간 부분이 있다면 그 부분의 
안쪽을 측정한다.
     수직 개폐식 승강장문인 경우에는 상기의 틈새 규정을 10 ㎜까지(마모된 경우에는 14 ㎜) 완화하여 적용할 수 있다.
8.6.3 카문이 닫혀 있을 때의 틈새는 다음과 같아야 한다.
8.6.3.1 카문이 닫혀 있을 때, 문짝사이의 틈새 또는 문짝과 문설주, 인방 또는 문턱 사이의 틈새는 6 ㎜ 이하로 가능한 작아야 
한다. 다만, 마모될 경우에는 10 ㎜까지 허용될 수 있다. 이 틈새는 움푹 들어간 부분이 있다면 그 부분의 안쪽을 측정한다.
       수직 개폐식 카문인 경우에는 상기의 틈새 규정을 10 ㎜까지(마모된 경우에는 14 ㎜) 완화하여 적용할 수 있다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
71 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2015-05-13', '2017-01-27', 'old', '8.6.3 카문이 닫혀 있을 때, 문짝사이의 틈새 또는 문짝과 문설주, 인방 또는 문턱 사이의 틈새는 6 mm 이하로 가능한 작아야 
한다. 다만, 마모될 경우에는 10 mm까지 허용될 수 있다. 이 틈새는 움푹 들어간 부분이 있다면 그 부분의 안쪽을 측정한다.
     수직 개폐식 카문인 경우에는 상기의 틈새 규정을 10 ㎜까지(마모된 경우에는 14 ㎜) 완화하여 적용할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2013-09-14', 'old', '8.6.3 카문이 닫혀 있을 때, 문짝사이의 틈새 또는 문짝과 문설주, 인방 또는 문턱 사이의 틈새는 6 mm 이하로 가능한 작아야 
한다. 다만, 마모될 경우에는 10 mm까지 허용될 수 있다. 이 틈새는 움푹 들어간 부분이 있다면 그 부분의 안쪽을 측정한다. 
8.6.1의 단서조항에 따른 수직 개폐식 문은 제외한다.
7.1.5 경첩이 달린 카문에는 그 문이 카 외부로 열리는 것을 방지하기 위한 장치가 있어야
한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2013-09-14', 'old', '8.6.4 경첩이 달린 문에는 문이 카 외부로 열리는 것을 방지하는 걸리개 또는 정지시키는 장치가 있어야 한다.
<추가 종전 기준>-----------------------------------------------');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2013-09-14', 'old', '<2019.3.28.삭제> 
8.6.5 카가 승강장에 정지 상태로 있을 때 카문이 자동으로 열림 위치를 유지하고 있지 않을 경우, 승강장문에 전망창[7.6.2가)]이 
있다면 카문에도 전망창이 있어야 한다.
     이 전망창은 7.6.2가)의 규정을 만족하여야 하며 카가 승강장에 있을 때 승강장문의 전망창과 일치하도록 카문에 위치
되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2005-06-01', '2005-05-31', 'old', '3.1.2(6) 카 및 승강장 문은 다음 각항의 기준에 적합하여야 한다.
 ② 승강장에서 카 안을 볼 수 있도록 하거나, 카의 도착 여부를 확인할 수 있도록 투명창을 설치하는 경우에는 다음 조건을 
모두 만족하여야 한다. 다만, 전망을 목적으로 유효 출입구 면적의 50%이상을 투명창으로 하는 경우에는 3.1.3(2)의 단서 
규정을 적용한다.
  a) 투명창의 크기는 최대 폭은 100mm 이하, 최대 높이는 500mm 이하로 하여야 한다.
  b) 투명창에 사용되는 유리는 한국산업규격의 강화유리․망입유리(공칭두께 6mm이상) 또는 접합유리(공칭두께 5mm이상)와 
동등 이상의 것을 사용하여야 한다.
 
7.2 출입문의 높이 및 폭
7.2.1 높이
  승강장문 및 카문의 출입구 유효 높이는 2 m 이상이어야 한다. 다만, 주택용 엘리베이터의 
경우에는 1.8 m 이상으로 할 수 있으며, 자동차용 엘리베이터의 경우에는 제외한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2013-09-14', 'old', '7.3.1 높이
승강장문의 유효 출입구 높이는 2 m 이상이어야 한다. 다만, 자동차용 엘리베이터는 제외한다.
8.1.2 카 출입구의 유효 높이는 2 m 이상이어야 한다. 다만, 자동차용 엘리베이터는 제외한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2005-06-01', '2005-05-31', 'old', '3.1.2(6) 카 및 승강장 문은 다음 각항의 기준에 적합하여야 한다.
 ① 카 및 승강장 문의 유효 출입구의 높이는 2.0m이상이어야 한다. 다만, 화물용 및 자동차용은 제외한다.
승강기 안전기준 연혁집[v1.0]
❙ 72');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '1997-08-18', '1999-09-02', 'old', '3.1.2(6) “카 내부치수 및 도어치수는 KS B 6830(승용엘리베이터와 승강로의 치수)에 따른다. 다만 카 내부치수는 KS S 6830 
또는 용도 및 적재하중을 고려한 최적 카 내부치수와 면적대비시 5% 이내의 증가는 허용할 수 있다.”');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', NULL, '1997-08-18', 'old', '3.1.2(6) 카 내부의 치수 및 도어치수는 KS B 6830(승용엘리베이터와 승강로의 치수)에 따른다.” 
7.2.2 폭
  승강장문의 출입구 유효 폭은 카 출입구 폭 이상으로 하되, 카 출입구 폭보다 50 ㎜를 
초과하지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2013-09-14', 'old', '7.3.2 폭
승강장문의 유효 출입구 폭은 카 출입구의 폭 이상으로 하되, 양쪽 측면 모두 카 출입구 측면의 폭보다 50 mm를 초과하지 
않아야 한다.
7.3 문턱, 가이드 및 문의 현수
7.3.1 문턱
  모든 승강장 및 카 출입구에는 카 내부에 들어가는 하중을 견디도록 충분한 강도
(11.2.3.6 참조)의 문턱이 있어야 한다.
   비고 물청소나 스프링클러의 작동 등으로 물이 승강로에 들어가지 않도록 각 승강장문 문턱 앞의 바닥은 
약간 경사지게 마감하는 것이 바람직하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2013-09-14', 'old', '7.4.1 문턱
모든 승강장의 출입구에는 카에 들어가는 하중을 견디도록 충분한 강도의 문턱이 있어야 한다.
비고 물청소, 스프링클러의 작동 등으로 물이 승강로에 들어가지 않도록 각 승강장 문턱 앞의 바닥을 약간 경사지도록 마감하는 
것이 좋다.
8.6.6 문턱, 가이드 및 문의 현수
카문과 관련하여 7.4의 규정이 준수되어야 한다.
7.3.2 출입문 안내수단
7.3.2.1 승강장문 및 카문은 정상작동 중 이탈, 기계적인 끼임 또는 작동 경로의 끝단에서 
벗어나는 것이 방지되도록 설계되어야 한다.
 <2019년 3월 28일 이후 건축허가분부터 적용>
7.3.2.2 수평 개폐식 승강장문 및 카문은 상부와 하부에서 안내되어야 한다.
  비고 상부 안내수단은 행거롤러를 말하고, 하부 안내수단은 가이드 슈를 말한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2013-09-14', 'old', '7.4.2.2 수평 개폐식 승강장문은 상·하부에서 안내되어야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
73 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2005-06-01', '2005-05-31', 'old', '4.1.5(12) 카 문의 가이드 슈가 문턱 틈에 충분히 들어가 있어야 하며, 도어행거의 요동정지의 설치상태는 견고하여야 한다.
7.3.2.3 수직 개폐식 승강장문 및 카문은 양 측면에서 안내되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2013-09-14', 'old', '7.4.2.3 수직 개폐식 승강장문은 양 측면에서 안내되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2005-06-01', '2013-09-14', 'old', '4.1.5(12) 카 문의 가이드 슈가 문턱 틈에 충분히 들어가 있어야 하며, 도어행거의 요동정지의 설치상태는 견고하여야 한다.
7.3.3 수직 개폐식 문의 현수
7.3.3.1 수직 개폐식 승강장문 및 카문의 문짝은 2개의 독립된 현수 부품에 의해 고정
되어야 한다.
7.3.3.2 현수 로프·체인 및 벨트의 안전율은 8 이상으로 설계되어야 한다. 
7.3.3.3 현수 로프 풀리의 피치 직경은 로프 직경의 25배 이상이어야 한다. 
7.3.3.4 현수 로프/체인은 풀리 홈 또는 스프로킷에서 이탈되지 않도록 보호되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2013-09-14', 'old', '7.4.3 수직 개폐식 문의 현수
7.4.3.1 수직 개폐식 문의 문짝은 2개의 독립된 현수부품에 고정되어야 한다.
7.4.3.2 현수 로프, 체인 및 벨트의 안전율은 8 이상이어야 한다.
7.4.3.3 현수 로프 풀리의 피치 직경은 로프 직경의 25배 이상이어야 한다.
7.4.3.4 현수 로프 및 체인은 풀리 홈 또는 스프라켓으로부터 이탈되지 않도록 보호되어야 한다.
7.4 승강장문과 카문 사이의 수평 틈새
7.4.1 카문의 문턱과 승강장문의 문턱 사이의 수평 거리는 35 ㎜ 이하이어야 한다.(그림 3
참조)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2013-09-14', 'old', '카 문턱과 승강장문 문턱 사이의 수평거리는 35 mm 이하이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', NULL, '2013-09-15', 'old', '3.1.3(5) 승강장 출입구 바닥 앞부분과 카 바닥 앞부분과의 틈의 너비는 4㎝ 이하로 하여야 한다.
4.1.2(10) 승강장 출입구 바닥 앞부분과 카 바닥 앞부분과의 틈의 너비는 4㎝ 이하이어야 한다. 다만, 장애인용 엘리베이터의 
경우에는 그러하지 아니하다.
7.4.2 승강장문과 카문 전체가 정상 작동하는 동안, 카문의 앞 부분과 승강장문 사이의 수평
거리는 0.12 m 이하이어야 한다.(그림 3 참조)
  비고 승강장문 전면에 건축물의 출입문이 추가되어 공간이 발생한 경우, 그 공간 사이에 사람이 갇히지 
않도록 조치해야 한다.(6.2.1 및 6.2.3 참조)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2013-09-14', 'old', '11.2.3 카문과 닫힌 승강장문 사이의 수평거리 또는 문이 정상 작동하는 동안 문 사이의 접근거리는 0.12 m 이하이어야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 74
7.4.3 다음과 같은 조합인 경우, 그림 8, 그림 9 또는 그림 10과 같이 닫힌 문 사이의 어떤
틈새에도 직경 0.15 m의 구가 있을 가능성이 없어야 한다.
  가) 경첩이 있는 승강장문과 접히는 카문의 조합(그림 8 참조)
  나) 경첩이 있는 승강장문과 수평 개폐식 카문의 조합(그림 9 참조)
  다) 기계적으로 연동되지 않은 수평 개폐식 승강장문과 카문의 조합(그림 10 참조)
      비고 그림 10은 “닫힌 카문 및 열린 승강장문의 조합”에도 적용된다.   
[ 그림 8. 경첩이 있는 승강장문과 접히는 카문의 조합 ]
[ 그림 9. 경첩이 있는 승강장문과 수평 개폐식 카문의 조합 ]
[ 그림 10. 기계적으로 연동되지 않은 수평 개폐식 승강장문과 카문의 조합 ]
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
75 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2013-09-14', 'old', '11.2 카와 카 출입구를 마주하는 벽 사이의 틈새
다음 사항은 그림 5 및 6에서 설명된다.
11.2.4 경첩이 있는 승강장문과 접히는 카문의 조합인 경우에는 닫힌 문 사이의 어떤 틈새에도 직경 0.15 m의 구가 통과되지 
않아야 한다.
[ 그림 6 - 경첩달린 승강장문과 접힌 카문의 틈새 ]
7.5 승강장문 및 카문의 강도
7.5.1 일반사항
  승강장문 및 카문을 구성하는 부품들은 환경적인 조건에서 설계된 수명 동안 적절한 
강도가 유지되는 재질로 만들어져야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2013-09-14', 'old', '7.2.1 승강장문 및 문틀은 시간이 경과되어도 변형되지 않는 방법으로 설치되어야 한다. 승강장문 및 문틀은 이 기준을 만족하기 
위해 금속으로 하는 것을 권장한다.
7.5.2 방화 등급
7.5.2.1 「건축법」 등 관계 법령에 따라 승강장문에 방화 등급이 요구되는 경우, 관련 규정에
적합한 승강장문이 설치되어야 한다.
  비고 국토교통부 고시 또는 승강기안전부품 안전기준 별표 10을 참조한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.7.1.4', '2013-09-15', '2015-05-12', 'old', '7.2.2 방화 등급
건축법령에서 방화등급이 요구되는 경우에는 관련 규정에 적합한 승강장문이 설치되어야 한다.
7.5.2.2 승강장문(방화문)에는 보기 쉬운 곳에 쉽게 지워지지 않는 방법으로 별표 10에 따른
표시사항이 표시되어야 한다.');