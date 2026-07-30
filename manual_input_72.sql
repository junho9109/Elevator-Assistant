-- 수동 입력 7.10 (신규 제목), 7.10.1, 7.10.2, 7.11 (신규 제목), 7.11.1~7.11.3, 7.12, 7.13 (신규 제목), 7.13.1, 7.13.2, 7.14 (신규 제목), 7.14.1, 7.14.2


-- 7.10 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.10' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.10', '2022-03-02', NULL, 'current', '7.10 승강장문의 닫힘 상태 및 잠금 상태를 입증하는 장치에 대한 공통요건');


-- 7.10.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.10.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.10.1', '2022-03-02', NULL, 'current', '7.10.1 사람이 일반적으로 접근할 수 있는 위치에서, 정상운행 시퀀스의 일부를 구성하지 못한 어떤 하나(단일)의 동작 후에는 승강장문이 열린 상태 또는 잠기지 않은 상태로 엘리베이터가 운행되는 것은 가능하지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.10.1', '2013-09-15', '2022-03-01', 'old', '7.7.5.1 사람이 일반적으로 접근할 수 있는 위치에서 정상운행 시퀀스를 구성하지 못한 어떤 하나의 동작 후에는 엘리베이터가 승강장문이 열린 상태 또는 잠기지 않은 상태로 운행되는 것은 불가능하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.10.1', '2003-06-18', '2013-09-14', 'old', '4.1.1(3)⑧ 2005년 6월 1일 이후 건축허가분부터 유압식 동일 적용

3.1.6(1) 카 및 승강로의 모든 출입문이 닫혀 있지 않으면 카가 움직이지 않는 장치

3.1.6(18) 정상운전모드에서 착상구간 범위 내에 있는 카 도어 또는 승강장문 중 어느 곳에서나 도어스위치 접점이 쇼트가 되거나 인위적으로 단락된 경우 이를 감지하여 강제로 승강기 운행을 정지시키는 기능
< 건축법시행령 제5조제4항제3호에 해당하는 다중이용건축물의 승강기는 2000년 10월 1일 이후 건축허가분부터 적용 >

4.1.1(3) 전동기·제동기 및 권상기
⑧ 정상운전모드에서 착상구간 범위 내에서 카 도어 또는 승강장문 중 어느곳에서나 도어스위치 접점이 쇼트되거나 인위적으로 단락된 경우 이를 감지하여 강제로 승강기 운행을 정지하여야 한다.
<건축법시행령 제5조제4항제3호에 해당하는 다중이용건축물의 승강기는 2000년 10월 1일 이후 건축허가분부터 적용 >

4.1.3(11) 승강장 문의 로크 및 스위치는 다음 기준에 적합하여야 한다.
② 승강장 문이 열려 있거나 닫혀 있지 않은 경우에는 엘리베이터가 움직이지 않도록 하는 도어스위치의 작동상태는 양호하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.10.1', NULL, '2003-06-17', 'old', '3.1.6(1) 카 및 승강로의 모든 출입문이 닫혀 있지 않으면 카가 움직이지 않는 장치

4.1.3(11) 승강장 문의 로크 및 스위치는 다음 기준에 적합하여야 한다.
② 승강장 문이 열려 있거나 닫혀 있지 않은 경우에는 엘리베이터가 움직이지 않도록 하는 도어스위치의 작동상태는 양호하여야 한다.');


-- 7.10.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.10.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.10.2', '2022-03-02', NULL, 'current', '7.10.2 잠금 부품의 위치를 입증하는데 사용되는 수단은 확실하게 작동되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.10.2', '2013-09-15', '2022-03-01', 'old', '7.7.5.2 잠금 부품의 상태를 입증하는데 사용되는 수단은 확실하게 작동되어야 한다.');


-- 7.11 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.11' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.11', '2022-03-02', NULL, 'current', '7.11 여러 문짝이 기계적으로 연결된 개폐식 승강장문');


-- 7.11.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.11.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.11.1', '2022-03-02', NULL, 'current', '7.11.1 개폐식 승강장문이 기계적으로 직접 연결된 여러 개의 문짝으로 구성된 경우, 다음과 같아야 한다.
가) 7.9.4.1 또는 7.9.4.2에 따른 전기장치가 하나의 문짝에 있는 것이 허용된다.
나) 다중 연동 개폐식 문(telescopic door)의 경우, 어떤 한 문짝에 있는 잠금장치가 닫힌 위치에 있는 문짝에 기계적으로 걸려 다른 문짝(들)이 열리는 것을 방지할 수 있다면, 하나의 문짝만 잠그는 것이 허용된다.
비고 다중 연동 개폐식 문은 문이 열릴 때는 여러 개의 문짝이 포개지면서 열리고, 문이 닫힐 때는 포개진 문짝이 펼쳐지면서 닫히는 문을 말함
다) 다중 연동 개폐식문의 각 문짝 한 장에 접힌 뒷부분과 문이 닫힌 위치에 있을 때 빠른 문짝을 느린 문짝에 거는 고리 또는 동일하게 연결하는 행거 플레이트의 고리는 직접적인 기계적 연결로 간주되므로, 모든 문짝에 7.9.4.1 또는 7.9.4.2에 따른 장치가 요구되지 않는다.
그 연결은 안내수단이 파손된 경우에도 확실히 유지되어야 한다.
상부 안내수단과 하부 안내수단의 동시 파손은 고려되지 않는다.
7.11.3에 따른 강도에 관한 기준의 적합성은 문짝의 연결 고리 부품들의 설계상 겹침을 가능한 최소화하여 입증되어야 한다.
비고 행거 플레이트는 안내수단의 일부로 간주되지 않는다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.11.1', '2013-09-15', '2022-03-01', 'old', '7.7.6.1 기계적으로 직접 연결된 여러 개의 문짝으로 이뤄진 문은 다음과 같이 할 수 있다.
가) 7.7.4.1 또는 7.7.4.2에서 요구된 장치를 하나의 문짝에 설치한다.
나) 겹치는 문의 경우에는 닫힌 위치에서 하나의 문짝에만 있는 잠금장치가 문짝 간의 걸림에 의해 다른 문짝의 열림을 방지할 수 있다면 하나의 문짝에만 잠금장치를 설치한다.');


-- 7.11.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.11.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.11.2', '2022-03-02', NULL, 'current', '7.11.2 개폐식 문이 기계적으로 간접 연결(로프, 벨트 또는 체인 등에 의해)된 여러 개의 문짝으로 구성된 경우, 어떤 한 문짝에 있는 잠금장치가 다른 문짝(들)이 열리는 것을 방지하고 각 문짝에 손잡이가 없다면 하나의 문짝만 잠그는 것이 허용된다.
잠금장치에 의해 잠기지 않은 다른 문짝(들)의 닫힌 위치는 15.2에 따른 전기안전장치에 의해 입증되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.11.2', '2013-09-15', '2022-03-01', 'old', '7.7.6.2 기계적으로 간접 연결(로프, 벨트 또는 체인에 의해 등)된 여러 개의 문짝으로 이뤄진 문은 각 문짝에 손잡이가 없고 하나의 잠금으로 다른 문짝의 열림을 방지할 수 있다면 하나의 문짝만을 잠그는 것이 허용된다.
잠금장치에 의해 잠기지 않은 다른 문짝의 닫힘 상태는 14.1.2에 적합한 전기안전장치에 의해 입증되어야 한다.');


-- 7.11.3
DELETE FROM inspection_item_revisions WHERE item_id = '7.11.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.11.3', '2019-03-28', NULL, 'current', '7.11.3 7.11.1에 따른 문짝 간 직접적인 기계적 연결 또는 7.11.2에 따른 간접적인 기계적 연결은 잠금장치의 일부를 구성하는 것으로 간주된다.
이러한 기계적 연결은 7.5.3.1에 언급된 300 N의 힘이 동시에 가해지도라도 7.9.1.7 가)에 따라 1,000 N의 힘을 견딜 수 있어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');


-- 7.12
DELETE FROM inspection_item_revisions WHERE item_id = '7.12' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.12', '2022-03-02', NULL, 'current', '7.12 자동으로 작동하는 문의 닫힘
승강장문은 정상 운행 상태에서 카의 운행호출이 없는 경우 엘리베이터를 사용하는 교통량에 따라 정해진 시간 후에 닫혀야 한다.
비고 장애인용 엘리베이터의 승강장문 자동 닫힘 시간은 17.1을 참고하고, 소방구조용 엘리베이터의 승강장문 자동 닫힘 시간은 17.2를 참조한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.12', '2013-09-15', '2022-03-01', 'old', '7.8 자동으로 작동하는 문의 닫힘
정상운행 중 자동으로 작동되는 승강장문은 필요한 시간 후에 닫혀야 하며 그 시간은 카의 운행 호출이 없는 상태에서 엘리베이터의 사용량 즉, 운행량에 따라 정해질 수 있다.');


-- 7.13 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.13' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.13', '2022-03-02', NULL, 'current', '7.13 카문의 닫힘을 입증하는 전기안전장치');


-- 7.13.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.13.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.13.1', '2022-03-02', NULL, 'current', '7.13.1 16.1.4 및 16.1.8에 따른 경우를 제외하고, 카문(여러 개의 문짝이 있는 경우 어떤 하나의 문짝)이 열리면, 엘리베이터가 출발하거나 계속 움직일 가능성은 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.13.1', '2013-09-15', '2022-03-01', 'old', '8.9.1 엘리베이터의 정상 운전상태 중에 7.7.2.2를 제외하고 카문(또는 여러 문짝이 있는 경우 어떤 하나의 문짝)이 열리면 정지상태의 엘리베이터는 기동되지 않아야 하며, 운행 중인 엘리베이터는 정지되어야 한다. 다만, 카의 운행을 위한 예비 운전은 가능할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.13.1', NULL, '2013-09-14', 'old', '3.1.6(1) 카 및 승강로의 모든 출입문이 닫혀 있지 않으면 카가 움직이지 않는 장치

4.1.2(3) 도어스위치의 작동상태는 양호하여야 한다.
4.1.3(2) 카 도어스위치 및 도어개폐장치의 설치상태는 견고하고, 각 부분의 연결 및 작동상태는 양호하여야 한다.');


-- 7.13.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.13.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.13.2', '2022-03-02', NULL, 'current', '7.13.2 카문의 닫힘을 입증하는 15.2에 따른 전기안전장치는 각 카문에 있어야 하고, 7.13.1에 따른 기준에 적합해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.13.2', '2013-09-15', '2022-03-01', 'old', '8.9.2 카문에는 8.9.1에 의한 규정을 만족하고 닫힘 상태를 입증하기 위해 14.1.2에 적합한 전기안전장치가 있어야 한다.

8.9.3 카문에 잠금장치가 필요한 경우[11.2.1다)], 카문의 잠금장치는 승강장문의 잠금장치(7.7.3.1 참조)와 동일한 구조로 설계되어 작동되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.13.2', NULL, '2013-09-14', 'old', '3.1.6(1) 카 및 승강로의 모든 출입문이 닫혀 있지 않으면 카가 움직이지 않는 장치');


-- 7.14 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.14' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.14', '2022-03-02', NULL, 'current', '7.14 여러 문짝이 기계적으로 연결된 개폐식 또는 접이식(folding) 카문');


-- 7.14.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.14.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.14.1', '2022-03-02', NULL, 'current', '7.14.1 개폐식 또는 접이식 카문이 기계적으로 직접 연결된 여러 개의 문짝으로 구성된 경우, 다음과 같아야 한다.
가) 7.13.2에 따른 장치가 다음 중 어느 하나에 해당하는 곳에 있는 것이 허용된다.
1) 어느 하나의 문짝(다중 연동 개폐식 문인 경우 선행 문짝)
2) 문 구동부품과 문짝 간의 기계적인 연결이 직접적인 경우, 문 구동부품
나) 다중 연동 개폐식 문 또는 접이식 문의 경우, 어떤 한 문짝에 있는 잠금장치가 닫힌 위치에 있는 그 문짝을 걸음으로써 다른 문짝(들)이 열리는 것을 방지할 수 있다면, 하나의 문짝만 잠그는 것이 허용된다.
다중 연동 개폐식 문의 각 문짝 한 장에 접힌 뒷부분과 문이 닫힌 위치에 있을 때 빠른 문짝을 느린 문짝에 거는 고리 또는 동일하게 연결하는 행거 플레이트의 고리는 직접적인 기계적 연결로 간주되므로, 모든 문짝에 7.13.2에 따른 장치가 요구되지 않는다.
그 연결은 안내수단이 파손된 경우에도 확실히 유지되어야 한다. 7.11.3에 따른 강도에 관한 기준의 적합성은 문짝의 연결 고리 부품들의 설계상 겹침을 가능한 최소화하여 입증되어야 한다.
비고 행거 플레이트는 안내수단의 일부로 간주되지 않는다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.14.1', '2013-09-15', '2022-03-01', 'old', '8.10.1 기계적으로 직접 연결된 여러 개의 문짝으로 이뤄진 문은 다음과 같이 할 수 있다.
가) 전기안전장치(8.9.2)를 하나의 문짝(겹침 문의 경우 빠른 문짝) 또는 문의 구동기 부품(문의 구동기 부품과 문짝이 직접 기계적으로 연결된 경우)에 설치한다.
나) 11.2.1다)에 규정된 조건에서, 하나의 문짝에만 있는 잠금장치가 문짝 간의 걸림에 의해 다른 문짝의 열림을 막을 수 있다면 하나의 문짝에만 잠금장치를 설치한다.');


-- 7.14.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.14.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.14.2', '2022-03-02', NULL, 'current', '7.14.2 개폐식 문이 기계적으로 간접 연결(로프, 벨트 또는 체인 등에 의해)된 여러 개의 문짝으로 구성된 경우, 다음에 모두 적합한 경우에는 하나의 문짝에만 전기안전장치(7.13.2)가 있는 것이 허용된다.
가) 이 문짝은 구동 문짝이 아니어야 하고,
나) 구동 문짝은 문 구동 부품과 기계적으로 직접 연결된 경우');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.14.2', '2013-09-15', '2022-03-01', 'old', '8.10.2 기계적으로 간접 연결(로프, 벨트 또는 체인 등에 의해)된 여러 개의 문짝으로 이뤄진 개폐식 문은 다음과 같은 경우에 하나의 문짝에 전기안전장치가(8.9.2)가 설치될 수 있다.
가) 그 문짝은 구동 문짝이 아니어야 하고,
나) 구동 문짝은 문 구동 부품과 기계적으로 직접 연결된 경우');
