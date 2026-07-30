-- 9항 재파싱 (p139~p153, 9.1~9.8)

DELETE FROM inspection_item_revisions WHERE item_id LIKE '9.%';

INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1', '2022-03-02', NULL, 'current', '9.1 매다는 장치(현수)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.1', '2022-03-02', NULL, 'current', '9.1.1 카와 균형추 또는 평형추는 매다는 장치에 의해 매달려야 한다. 다만, 직접 유압식 
엘리베이터의 경우에는 그렇지 않다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.1', '2022-03-02', NULL, 'current', '9.1.1 카, 균형추 또는 평형추는 와이어로프, 롤러체인 또는 기타 수단에 의해 현수되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.2', '2022-03-02', NULL, 'current', '9.1.2 매다는 장치는 다음의 구분에 따라 적합해야 한다.
  가) 로프: 공칭 직경이 8 ㎜ 이상이어야 한다. 다만, 구동기가 승강로에 위치하고, 정격
승강기 안전기준 연혁집[v1.0]
❙ 130
속도가 1.75 ㎧ 이하인 경우로서 행정안전부장관이 안전성을 확인한 경우에 한정하여
공칭 직경 6 ㎜의 로프가 허용된다.
  나) 체인: 인장강도 및 특성 등이 KS B 1407에 적합해야 한다.
  다) 벨트: 별표 8 부속서 표 V.1에 적합해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.2', '2022-03-02', NULL, 'current', '9.1.2 로프 또는 체인은 다음 사항에 적합하여야 한다.
가) 로프는 공칭 직경이 8 mm 이상이어야 하며 KS D ISO 4344에 적합하거나 동등 이상이어야 한다.
나) 체인은 KS B 1407에 적합하거나 동등 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.4', '2022-03-02', NULL, 'current', '9.1.4 구멍에 꿰어 매는 방식이 사용되는 경우, 고려되는 수는 내려지는 수가 아니라 로프 또는 체인의 수이다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.4', '1999-01-14', '2022-03-01', 'old', '3.1.1(1)①, 3.2.1(1)① 시행
[로프식]
3.1.1(1) 주로프는 다음 각항의 구조로 하여야 한다.
① 직경은 12㎜ 이상으로 하여야 한다. 다만, 주로프의 안전율이 10 이상이 되도록 여러가닥의 로프를 사용하는 경우에 직경은 
8㎜ 이상으로 할 수 있다.
[유압식]
3.2.1(1) 주로프 또는 체인은 다음 각항의 구조로 하여야 한다.
① 주로프의 직경은 12㎜ 이상이어야 한다. 다만, 주로프의 안전율이 10 이상이 되도록 여러가닥의 로프를 사용하는 경우에 
주로프의 직경은 8㎜ 이상으로 할 수 있다.
② 체인은 한국산업규격 KS B 1407(전동용 롤러체인)에 적합한 것이어야 하고, 호칭번호 80 이상으로 하여야 한다.
4.2.4(4) 로프를 사용하는 간접식 유압엘리베이터에 있어서는 급제동시나 지진 기타의 진동에 의해 주로프가 벗겨지지 않도록 
조치되어 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.3', '2022-03-02', NULL, 'current', '9.1.3 로프 또는 체인 등의 가닥수는 2가닥 이상이어야 한다.
간접 유압식 엘리베이터의 경우에는 간접 작동 잭 당 2가닥 이상이어야 하고, 카와 
평형추 사의 연결 부분에 2가닥 이상이어야 한다.
  비고 구멍에 꿰어 매는 방식(로핑)이 사용되는 경우, 고려되는 수는 내려지는 수가 아니라 로프 또는 체인의
수이다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
131 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.3', '2013-09-15', '2022-03-01', 'old', '[전기식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.3', '2022-03-02', NULL, 'current', '9.1.3 로프는 3가닥 이상이어야 한다. 다만, 포지티브 구동식 엘리베이터의 경우에는 로프 및 체인을 2가닥 이상으로 할 수 있다.
로프 또는 체인은 독립적이어야 한다.
[유압식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.3', '2022-03-02', NULL, 'current', '9.1.3 로프 또는 체인의 최소 가닥은 다음과 같아야 한다.
 가) 간접식 엘리베이터의 경우 : 잭 당 2가닥
 나) 카와 평형추 사이의 연결의 경우 : 잭 당 2가닥
로프 또는 체인은 독립적이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.3', NULL, '2013-09-15', 'old', '[로프식]
3.1.1(1) 주로프는 다음 각항의 구조로 하여야 한다.
② 3가닥(권동식 엘리베이터의 경우에는 2가닥) 이상으로 하여야 한다.
[유압식]
3.2.1(1) 주로프 또는 체인은 다음 각항의 구조로 하여야 한다.
③ 2가닥 이상으로 하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.4', '2019-03-28', NULL, 'current', '9.1.4 매다는 장치는 독립적이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.5', '2019-03-28', NULL, 'current', '9.1.5 매다는 장치는 별표 8에 따라 안전성이 입증되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.1.6', '2019-03-28', NULL, 'current', '9.1.6 매다는 장치에는 보기 쉬운 곳에 쉽게 지워지지 않는 방법으로 별표 8에 따른 표시
사항이 표시되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2', '2022-03-02', NULL, 'current', '9.2 권상 도르래·풀리 또는 드럼과 로프(벨트) 사이의 직경 비율, 로프/체인의 단말처리');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.1', '2022-03-02', NULL, 'current', '9.2.1 권상 도르래ㆍ풀리 또는 드럼의 피치직경과 로프(벨트)의 공칭 직경 사이의 비율은 
로프(벨트)의 가닥수와 관계없이 40 이상이어야 한다. 다만, 주택용 엘리베이터의 경우 
30 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.1', '2022-03-02', NULL, 'current', '9.2.1 권상도르래, 풀리 또는 드럼과 현수로프의 공칭 직경사이의 비는 스트랜드의 수와 관계없이 40 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.1', NULL, '2013-09-15', 'old', '[로프식]
3.1.1(2) 도르래 또는 권동은 다음 각항의 구조로 하여야 한다.
 ① 직경은 주로프 직경의 40배 이상으로 하여야 한다. 다만, 도르래에서 주로프가 접하는 부분의 길이가 그 원둘레의 1/4 
이하인 것은 주로프 직경의 36배 이상으로 할 수 있다.
4.1.3(4) 고정도르래 또는 현수도르래가 있는 경우에는 그 설치상태는 견고하고, 몸체에 균열이 없어야 한다. 또한, 급제동시나 
지진 기타의 진동에 의해 주로프가 벗겨지지 않도록 조치되어 있어야 한다.
[유압식]
3.2.1(2) 도르래 또는 스프로켓은 다음 각항의 구조로 하여야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 132');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.2', '2022-03-02', NULL, 'current', '9.2.2 매다는 장치의 안전율은 다음 구분에 따른 수치 이상이어야 한다.
  가) 3가닥 이상의 로프(벨트)에 의해 구동되는 권상 구동 엘리베이터의 경우: 12
  나) 3가닥 이상의 6 ㎜ 이상 8 ㎜ 미만의 로프에 의해 구동되는 권상 구동 엘리베이터의
경우: 16
  다) 2가닥 이상의 로프(벨트)에 의해 구동되는 권상 구동 엘리베이터의 경우: 16
  라) 로프가 있는 드럼 구동 및 유압식 엘리베이터의 경우: 12
  마) 체인에 의해 구동되는 엘리베이터의 경우: 10
  안전율은 정격하중의 카가 최하층에 정지하고 있을 때 매다는 장치 1가닥의 최소 파단
하중(N)과 이 매다는 장치에 걸리는 최대 힘(N) 사이의 비율이다. 
포지티브 구동 엘리베이터 및 유압식 엘베이터의 경우, 평형추 매다는 장치의 안전율은 
평형추의 무게로 발생하는 매다는 장치 힘을 기준으로 계산되어야 한다.
  매다는 장치에 대한 안전율 평가는 부속서 Ⅹ에 따른다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.2', '2015-05-13', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.4', '2022-03-02', NULL, 'current', '9.2.4 현수체인의 안전율은 10 이상이어야 한다.
[전기식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.2', '2022-03-02', NULL, 'current', '9.2.2 현수로프의 안전율은 부속서 Ⅸ에 따라 계산되어야 한다. 어떠한 경우라도 안전율은 12 이상이어야 한다.
안전율은 카가 정격하중을 싣고 최하층에 정지하고 있을 때 로프 1가닥의 최소 파단하중(N)과 이 로프에 걸리는 최대 힘(N) 
사이의 비율이다.
 비고 승강기 설계시에는 현수로프의 수명을 충분히 고려하여 안전율을 계산하여야 한다.
[유압식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.2', '2022-03-02', NULL, 'current', '9.2.2 현수로프의 안전율은 12 이상이어야 한다.
안전율은 카가 정격하중을 싣고 최하층에 정지하고 있을 때 로프 1가닥의 최소 파단하중(N)과 이 로프에 걸리는 최대 힘(N) 
사이의 비율이다.
평형추 로프 또는 체인의 최대 힘은 유추에 의해 계산되어야 한다.
 비고 승강기 설계 시에는 현수로프의 수명을 충분히 고려하여 안전율을 계산하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.4', '2022-03-02', NULL, 'current', '9.2.4 현수체인의 안전율은 10 이상이어야 한다.
[전기식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.2', '2022-03-02', NULL, 'current', '9.2.2 현수로프의 안전율은 부속서 Ⅸ에 따라 계산되어야 한다. 어떠한 경우라도 안전율은 12 이상이어야 한다. 
 비고 안전율은 카가 정격하중을 싣고 최하층에 정지하고 있을 때 로프 1가닥의 최소 파단하중(N)과 이 로프에 걸리는 최대 
힘(N) 사이의 비율이다.
[유압식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.2', '2022-03-02', NULL, 'current', '9.2.2 현수로프의 안전율은 12 이상이어야 한다.
비고 1. 안전율은 카가 정격하중을 싣고 최하층에 정지하고 있을 때 로프 1가닥의 최소 파단하중(N)과 이 로프에 걸리는 
최대 힘(N) 사이의 비율이다.
     2. 평형추 로프 또는 체인의 최대 힘은 유추에 의해 계산되어야 한다.
① 도르래의 직경은 주로프 직경의 40배 이상으로 하여야 한다. 다만, 도르래에서 주로프가 접하는 부분의 길이가 그 원둘레의 
1/4 이하인 것은 주로프 직경의 36배 이상으로 할 수 있다.
4.2.3(1) 도르래 또는 스프로켓의 설치상태는 견고하고, 몸체에 균열이 없어야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
133 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.2', '1999-01-14', '2022-03-01', 'old', '3.1.1(1)①, 3.2.1(1)① 시행
[로프식]
3.1.1(1) 주로프는 다음 각항의 구조로 하여야 한다.
① 직경은 12㎜ 이상으로 하여야 한다. 다만, 주로프의 안전율이 10 이상이 되도록 여러가닥의 로프를 사용하는 경우에 직경은 
8㎜ 이상으로 할 수 있다.
[유압식]
3.2.1(1) 주로프 또는 체인은 다음 각항의 구조로 하여야 한다.
① 주로프의 직경은 12㎜ 이상이어야 한다. 다만, 주로프의 안전율이 10 이상이 되도록 여러가닥의 로프를 사용하는 경우에 
주로프의 직경은 8㎜ 이상으로 할 수 있다.
② 체인은 한국산업규격 KS B 1407(전동용 롤러체인)에 적합한 것이어야 하고, 호칭번호 80 이상으로 하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.3', '2022-03-02', NULL, 'current', '9.2.3 매다는 장치와 매다는 장치 끝부분 사이의 연결(9.2.3.1)은 매다는 장치의 최소 파단
하중의 80 % 이상을 견딜 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.3', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.3', '2022-03-02', NULL, 'current', '9.2.3 9.2.3.1에 따른 로프와 로프 단말 사이의 연결은 로프의 최소 파단하중의 80% 이상을 견뎌야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.3', '2008-11-07', '2022-03-01', 'old', '3.1.1(1)④, 3.2.1(1)④ 시행
[로프식]
3.1.1(1) 주로프는 다음 각항의 구조로 하여야 한다.
 ④ 끝부분은 1가닥마다 로프소켓에 바빗트채움을 하거나 체결식 로프 소켓을 사용하여 고정하여야 한다. 다만, 기타의 장치로 
고정하는 경우의 연결은 주로프 최소파단하중의 80% 이상이어야 한다. 또한, 권동식 엘리베이터인 경우에는 권동측의 
끝부분을 1가닥마다 클램프 고정으로 할 수 있다.
[유압식]
3.2.1(1) 주로프 또는 체인은 다음 각항의 구조로 하여야 한다.
④ 주로프의 끝부분은 1가닥마다 로프소켓에 바빗트채움을 하거나 체결식 로프소켓을 사용하여 고정하고, 체인의 끝부분은 
1가닥마다 강제 고정구를 사용하여 고정하여야 하며, 기타의 장치로 고정하는 경우의 연결은 주로프 최소파단하중의 
80% 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.3.1', '2023-03-02', NULL, 'current', '9.2.3.1 매다는 장치 끝부분은 자체 조임 쐐기 형 소켓, 압착링 매듭법(ferrule secured 
eyes), 스웨이지 터미널(swage terminals)에 의해 카, 균형추/평형추 또는 구멍에 꿰어 맨
매다는 장치 마감 부분(dead parts)의 지지대에 고정되어야 한다.
  비고 매다는 장치 단말은 매다는 장치의 최소 파단하중의 80 % 이상을 달성한다고 가정할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.3.1', '2019-03-28', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.3.1', '2022-03-02', NULL, 'current', '9.2.3.1 매다는 장치 끝부분은 자체 조임 쐐기 형 소켓, 압착링 매듭법(ferrule secured eyes), 주물 단말처리(swage terminals)에 
의해 카, 균형추/평형추 또는 구멍에 꿰어 맨 매다는 장치 마감 부분(dead parts)의 지지대에 고정되어야 한다.
 비고 매다는 장치 단말은 매다는 장치의 최소 파단하중의 80 % 이상을 달성한다고 가정할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.3.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.3.1', '2022-03-02', NULL, 'current', '9.2.3.1 로프의 끝 부분은 카, 균형추(또는 평형추) 또는 현수되는 지점에 금속 또는 수지로 채워진 소켓, 자체 조임 쐐기형식의 
소켓 또는 안전상 이와 동등한 기타 시스템에 의해 고정되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.3.1', '2007-09-10', '2022-03-01', 'old', '4.1.3(8)① 시행
4.1.3(8) 주로프 및 조속기로프는 카 위에서 카를 조금씩 승강시키면서 검사하고, 카 위에서 검사할 수 없는 부분은 기계실 
및 피트에서 검사하며, 다음 기준에 적합하여야 한다.
 ① 로프의 단말은 견고히 처리되거나 또는 주로프가 바빗트 채움 방식인 경우 끝부분은 각 가닥을 접어서 구부린 것이 명확하게 
보이도록 되어 있어야 한다.
 ② 주로프를 걸어 맨 고정부위는 2중너트로 견고하게 조이고, 풀림방지를 위한 분할핀이 꽂혀 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.3.2', '2022-03-02', NULL, 'current', '9.2.3.2 드럼에 있는 로프는 쐐기로 막는 시스템 사용 또는 2개 이상의 클램프 사용에 의해 
고정되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.3.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.3.2', '2022-03-02', NULL, 'current', '9.2.3.2 드럼에 있는 로프는 쐐기로 막는 시스템을 사용하거나 2개 이상의 클램프 또는 안전상 이와 동등한 기타 시스템에 
의해 고정되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.3.2', '2007-09-10', '2022-03-01', 'old', '4.1.3(8)① 시행
4.1.3(8) 주로프 및 조속기로프는 카 위에서 카를 조금씩 승강시키면서 검사하고, 카 위에서 검사할 수 없는 부분은 기계실 
및 피트에서 검사하며, 다음 기준에 적합하여야 한다.
 ① 로프의 단말은 견고히 처리되거나 또는 주로프가 바빗트 채움 방식인 경우 끝부분은 각 가닥을 접어서 구부린 것이 명확하게 
보이도록 되어 있어야 한다.
 ② 주로프를 걸어 맨 고정부위는 2중너트로 견고하게 조이고, 풀림방지를 위한 분할핀이 꽂혀 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.4', '2022-03-02', NULL, 'current', '9.2.4 체인의 끝 부분은 카, 균형추/평형추 또는 구멍에 꿰어 맨 체인 마감 부분(dead 
parts)의 지지대에 고정되어야 한다. 
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
135 ❙
체인과 체인 끝부분 사이의 연결은 체인의 최소 파단하중의 80 % 이상을 견딜 수 있어야 
한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.4', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.5', '2022-03-02', NULL, 'current', '9.2.5 체인의 끝 부분은 카, 균형추(또는 평형추) 또는 현수되는 지점에 적절한 단말처리에 의해 고정되어야 한다. 체인과 체인 
단말 사이의 연결은 체인의 최소 파단하중의 80% 이상을 견뎌야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.3', '2022-03-02', NULL, 'current', '9.3 로프(벨트) 권상');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.3.1', '2022-03-02', NULL, 'current', '9.3.1 로프(벨트) 권상은 다음 3가지 사항에 적합해야 한다. 
  가) 카는 8.2.1 및 8.2.2에 따라 정격하중의 125 %로 적재될 때 승강장 바닥 높이에서 
미끄러짐 없이 정지상태가 유지되어야 한다.
  나) 빈 카 또는 정격하중의 카가 비상 제동될 때, 카는 행정거리가 줄어든 완충기를 포함
하여 완충기의 설계된 속도 이하로 확실하게 감속되어야 한다.
  다) 카 또는 균형추가 완충기를 누르고 있는 위험한 위치에 정지해 있는 경우, 빈 카 또는 
균형추를 들어 올리는 것이 가능하지 않아야 한다. 
또한, 다음 중 어느 하나와 같아야 한다.
      1) 로프(벨트)가 권상도르래에서 미끄러져야 한다.
      2) 구동기는 15.2에 따른 전기안전장치에 의해 정지되어야 한다.
  비고 매다는 장치에 가해지는 충격력과 카의 과도한 감속을 초래하는 카/균형추의 과주행에 의한 충돌이나 
폴백(falling back)의 위험이 없다면, 카/균형추를 약간 권상하는 것은 허용된다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.3.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.3', '2022-03-02', NULL, 'current', '9.3 로프 권상
로프 권상은 다음 3가지 사항에 적합하여야 한다. 설계에 고려되는 사항은 부속서 Ⅷ를 참조한다.
 가) 8.2.1 및 8.2.2에서와 같이 카에 정격하중의 125%까지 실었을 때 카는 승강장 바닥 높이에서 미끄러짐 없이 유지되어야 한다.
 나) 무부하 또는 정격하중이 실려 있더라도, 비상 제동 시 카는 행정거리가 작아진 완충기를 포함하여 완충기의 설정 값을 
초과하지 않는 값으로 감속되어야 한다.
 다) 균형추가 완충기 위에 정지하고 있고 구동기는 “상승” 방향으로 회전하고 있을 때 빈 카를 들어 올리는 것이 가능하지 
않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.3', NULL, '2013-09-15', 'old', '[전기식]
4.1.1(3) 전동기․제동기 및 권상기
 ④ 권상기의 도르래는 몸체에 균열이 없어야 하고, 자동정지때 주로프와의 사이에 심한 미끄러움 및 마모가 없어야 한다. 
또한, 감속기구가 있는 것은 톱니바퀴에 심한 마모 및 점식 등으로 카 운행에 지장이 없어야 하고, 이물림상태는 양호
하여야 한다. 권상기 도르래홈의 언더컷의 잔여량은 1㎜ 이상이어야 하고, 권상기 도르래에 감긴 주로프 가닥끼리의 높이차는 
2㎜ 이내이어야 한다. 
4.1.3(4) 고정도르래 또는 현수도르래가 있는 경우에는 그 설치상태는 견고하고, 몸체에 균열이 없어야 한다. 또한, 급제동시나 
지진 기타의 진동에 의해 주로프가 벗겨지지 않도록 조치되어 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.4', '2022-03-02', NULL, 'current', '9.4 포지티브 구동 엘리베이터의 로프 감김');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.4.1', '2022-03-02', NULL, 'current', '9.4.1 13.2.1.1나)에 따른 조건에서 사용될 수 있는 드럼은 나선형으로 홈이 있어야 하고, 
그 홈은 사용되는 로프에 적합해야 한다. 
승강기 안전기준 연혁집[v1.0]
❙ 136');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.4.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.4.1', '2022-03-02', NULL, 'current', '9.4.1 12.2.1나)에서 규정된 조건에서 사용될 수 있는 드럼은 나선형의 홈이 있어야 하고, 그 홈은 사용되는 로프에 적합하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.4.2', '2022-03-02', NULL, 'current', '9.4.2 카가 완전히 압축된 완충기 위에 정지하고 있을 때, 드럼의 홈에는 한바퀴 반의 
로프가 남아 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.4.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.4.2', '2022-03-02', NULL, 'current', '9.4.2 카가 완전히 압축된 완충기에 정지하고 있을 때, 드럼 홈에는 1+(1/2)권의 로프가 남아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.4.2', NULL, '2013-09-15', 'old', '[로프식]
3.1.1(1) 주로프는 다음 각항의 구조로 하여야 한다.
 ③ 권동식 엘리베이터의 카가 최하정지위치에 있는 경우에 주로프가 권동에 감기고 남는 권수는 2권 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.4.3', '2022-03-02', NULL, 'current', '9.4.3 로프는 드럼에 한 겹으로만 감겨야 된다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.4.4', '2022-03-02', NULL, 'current', '9.4.4 홈에 대한 로프의 편향각(후미각)은 4°를 초과하지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.4.4', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.4.4', '2022-03-02', NULL, 'current', '9.4.4 홈에 연관된 로프의 편향 각(후미 각)은 4° 이하이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5', '2022-03-02', NULL, 'current', '9.5 매다는 장치 사이의 하중 분산');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.1', '2022-03-02', NULL, 'current', '9.5.1 적어도 한쪽 끝에는 매다는 장치의 장력을 균등하게하기 위한 자동장치가 있어야 
한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.1', '2013-09-15', '2022-03-01', 'old', '[전기식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.1', '2022-03-02', NULL, 'current', '9.5.1 로프 또는 체인의 끝부분에는 현수로프 또는 체인의 장력을 자동으로 균등하게 하는 장치가 있어야 한다.
[유압식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.3.1', '2022-03-02', NULL, 'current', '9.3.1 로프 또는 체인의 끝부분에는 현수로프 또는 체인의 장력을 자동으로 균등하게 하는 장치가 있어야 한다.
동일 축에 여러 개의 회전 스프라켓이 있는 경우에 체인이 있다면, 이 스프라켓은 독립적으로 회전이 가능하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.3.1', NULL, '2013-09-15', 'old', '[로프식]
4.1.3(8) 주로프 및 조속기로프는 카 위에서 카를 조금씩 승강시키면서 검사하고, 카 위에서 검사할 수 없는 부분은 기계실 
및 피트에서 검사하며, 다음 기준에 적합하여야 한다.
③ 모든 주로프는 균등한 장력을 받고 있어야 한다.
[유압식]
4.2.3(2) 체인의 끝부분은 1가닥마다 확실하게 연결되어 균등한 장력을 받고 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.1.1', '2022-03-02', NULL, 'current', '9.5.1.1 스프로킷에 연결하는 체인의 경우, 카에 고정된 끝부분뿐만 아니라 평형추에 고정된
끝 부분에도 장력을 균등하게하기 위한 자동장치가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.1.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.1.1', '2022-03-02', NULL, 'current', '9.5.1.1 스프라켓에 연결하는 체인의 경우, 카에 고정된 끝부분뿐만 아니라 평형추에 고정된 끝부분에도 장력을 자동으로 균등하게 
하는 장치가 있어야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
137 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.1.2', '2022-03-02', NULL, 'current', '9.5.1.2 동일 축에 여러 개의 회전 스프로킷이 있는 경우, 이 스프로킷은 독립적으로 회전
할 수 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.1.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.1.2', '2022-03-02', NULL, 'current', '9.5.1.2 동일 축에 여러 개의 회전 스프라켓이 있는 경우에 체인이 있다면, 이 스프라켓은 독립적으로 회전이 가능하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.2', '2022-03-02', NULL, 'current', '9.5.2 장력을 균등하게하기 위해 스프링이 사용된다면, 그 스프링은 압축 시 작용되도록 
해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.2', '2022-03-02', NULL, 'current', '9.5.2 스프링이 장력을 균등하게 하는데 사용되는 경우에는 이 스프링이 압축되어 작용되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.3', '2022-03-02', NULL, 'current', '9.5.3 매다는 장치가 비정상적으로 늘어난 경우, 느슨한 매다는 장치는 다음과 같이 보호
되어야 한다.
  가) 2가닥의 매다는 장치가 카를 매다는 경우, 15.2에 따른 전기안전장치는 1가닥의 
매다는 장치가 다른 1가닥에 비해 비정상적으로 늘어나면 구동기를 정지시켜야 한다.
  나) 포지티브 구동 엘리베이터 및 유압식 엘리베이터의 경우, 매다는 장치가 느슨해지면 
15.2에 따른 전기안전장치는 구동기를 정지시켜야 한다. 
  구동기가 정지된 후에는 정상 운행이 이루어지지 않아야 한다. 
2개 이상의 잭이 있는 유압식 엘리베이터의 경우, 각각의 매다는 장치에 적용되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.3', '2013-09-15', '2022-03-01', 'old', '[전기식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.3', '2022-03-02', NULL, 'current', '9.5.3 카에 2가닥의 로프 또는 체인이 있는 경우, 1가닥의 로프 또는 체인이 비정상적으로 늘어나면 14.1.2에 적합한 전기안전장치가 
엘리베이터를 정지시켜야 한다.
12.9 로프이완 또는 체인이완 안전장치
포지티브 구동식 엘리베이터에는 14.1.2에 적합한 전기안전장치를 작동시키는 로프 또는 체인 이완장치가 있어야 한다. 이 장치는 
9.5.3에서 요구된 것과 같을 수 있다.
[유압식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.3.3', '2022-03-02', NULL, 'current', '9.3.3 카에 2가닥의 로프 또는 체인이 있는 경우, 1가닥의 로프 또는 체인이 비정상적으로 늘어나면 14.1.2에 적합한 전기안전장치가 
엘리베이터를 정지시켜야 한다.
2개 이상의 잭이 있는 엘리베이터에 대해, 이 규정은 각 현수 세트에 적용한다.
12.13 간접식 엘리베이터의 로프(또는 체인) 이완 안전장치
로프(또는 체인)가 이완되는 위험에 대하여 14.1.2에 적합한 전기안전장치가 설치되어야 한다. 이 장치는 이완될 때 구동기를 
정지시키고 정지 상태를 유지시켜야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.3.3', '1997-08-18', '2022-03-01', 'old', '[로프식]
3.1.6(11) 권동식 엘리베이터에 있어서 주로프가 이완된 경우에 동력을 자동적으로 차단하는 장치
4.1.3(26) 권동식 엘리베이터에 있어서 주로프가 이완되는 경우에 안전스위치의 작동상태는 양호하여야 한다.
[유압식]
3.2.6(5) 전동기의 공전을 방지하기 위한 장치
4.2.4(6) 카가 하강중에 어떤 장애물에 의해 정지하여 주로프 또는 체인이 이완된 경우에 안전스위치의 작동상태는 양호하여야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 138');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.3.3', NULL, '1997-08-18', 'old', '[로프식]
3.1.6(11) 권동식 엘리베이터에 있어서 주로프가 이완된 경우에 동력을 자동적으로 차단하는 장치
4.1.3(26) 권동식 엘리베이터에 있어서 주로프가 이완되는 경우에 안전스위치의 작동상태는 양호하여야 한다.
[유압식]
3.2.6(5) 전동기의 공전을 방지하기 위한 장치');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.4', '2022-03-02', NULL, 'current', '9.5.4 매다는 장치의 길이를 조정하는 장치는 조정 후 이 장치에 의해 매다는 장치가 
느슨해질 수 없도록 제작되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.4', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.5.4', '2022-03-02', NULL, 'current', '9.5.4 로프 또는 체인의 길이를 조정하는 장치는 조정 후 이 장치가 자체적으로 로프 또는 체인을 느슨하게 만들지 못하도록 
하는 방법으로 제작되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.6', '2022-03-02', NULL, 'current', '9.6 보상 수단');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.6.1', '2022-03-02', NULL, 'current', '9.6.1 적절한 권상능력 또는 전동기의 동력을 확보하기 위해 매다는 로프의 무게에 대한 
보상 수단은 다음과 같은 조건에 따라야 한다. 
  가) 정격속도가 3 ㎧ 이하인 경우에는 체인, 로프 또는 벨트와 같은 수단이 설치될 수 
있다.
  나) 정격속도가 3 ㎧를 초과한 경우에는 보상 로프가 설치되어야 한다.
  다) 정격속도가 3.5 ㎧를 초과한 경우에는 추가로 튀어오름방지장치가 있어야 한다. 튀어
오름방지장치가 작동되면 15.2에 따른 전기안전장치에 의해 구동기의 정지가 시작
되어야 한다.
  라) 정격속도가 1.75 ㎧를 초과한 경우, 인장장치가 없는 보상수단은 순환하는 부근에서 
안내봉 등에 의해 안내되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.6.1', '2015-05-13', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.6.1', '2022-03-02', NULL, 'current', '9.6.1 권상능력 또는 승강시키는 전동기의 힘을 충분히 확보하기 위해 현수로프의 무게를 보상하는 수단이 사용될 경우에는 
다음 사항이 적용되어야 한다.
 가) 정격속도가 3.0 ㎧ 이하인 경우에는 균형체인, 균형로프 또는 균형벨트 등이 보상수단으로 사용될 수 있다.
 나) 정격속도가 3.0 ㎧를 초과하는 경우에는 균형로프만 보상수단으로 사용되어야 한다.
 다) 정격속도가 3.5 ㎧를 초과하는 경우에는 추가로 튀어오름방지장치가 설치되어야 한다. 튀어오름방지장치가 작동되면 
14.1.2에 적합한 전기안전장치에 의해 구동기의 정지가 시작되어야 한다.
 라) 정격속도가 1.75 ㎧를 초과하는 경우, 인장장치가 없는 보상수단은 회전하는 부근의 근처에서 가이드 봉 등으로 안내되어야 
한다');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.6.1', '2013-09-15', '2022-03-01', 'old', '9.6.1 균형로프가 사용될 때마다, 다음 사항이 적용되어야 한다. 
  가) 인장 풀리가 사용되어야 한다. 
  나) 인장 풀리의 피치직경과 균형로프의 공칭직경 사이의 비는 30 이상이어야 한다. 
  다) 인장 풀리는 9.7에 따라 보호되어야 한다. 
  라) 중력에 의해 인장되어야 한다. 
  마) 14.1.2에 적합한 전기안전장치에 의해 최소 인장이 확인되어야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
139 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.6.1', NULL, '2013-09-15', 'old', '[로프식]
4.1.4(11) 균형로프 또는 균형체인이 있는 경우에 설치상태는 견고하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.6.2', '2022-03-02', NULL, 'current', '9.6.2 보상 로프가 사용된 경우에는 다음 사항이 적용되어야 한다.
  가) 보상 로프는 KS D 3514 또는 ISO 4344에 적합해야 한다.
  나) 인장 풀리가 사용되어야 한다.
  다) 인장 풀리의 피치 직경과 보상 로프의 공칭 직경 사이의 비율은 30 이상이어야 한다.
  라) 인장 풀리는 9.7에 따라 보호되어야 한다.
  마) 중력에 의해 인장되어야 한다.
  바) 인장은 15.2에 따른 전기안전장치에 의해 확인되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.6.2', '2015-05-13', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.6.2', '2022-03-02', NULL, 'current', '9.6.2 균형로프가 보상수단으로 사용될 경우에는 다음 사항에 적합하여야 한다.
 가) 균형로프는 KS D ISO 4344에 적합하여야 한다.
 나) 인장 풀리가 사용되어야 한다.
 다) 인장 풀리의 피치직경과 균형로프의 공칭직경 사이의 비는 30 이상이어야 한다.
 라) 인장 풀리는 9.7에 따라 보호되어야 한다.
 마) 중력에 의해 인장되어야 한다.
 바) 14.1.2에 적합한 전기안전장치에 의해 최소 인장이 확인되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.6.2', '2013-09-15', '2022-03-01', 'old', '9.6.2 정격속도가 3.5 ㎧를 초과하는 엘리베이터에는 9.6.1에 추가하여 튀어오름방지장치가 있어야 한다. 
      튀어오름방지장치가 작동하면 14.1.2에 적합한 전기안전장치에 의해 구동기의 정지가 시작되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.6.3', '2022-03-02', NULL, 'current', '9.6.3 보상 수단(로프, 체인, 벨트 및 그 단말부)은 안전율 5로 보상 수단에 가해지는 모든 
정적인 힘에 견딜 수 있어야 한다. 
주행구간의 꼭대기에 카 또는 균형추가 있을 때 갖는 보상 수단의 최대 매달린 무게와 
전체 인장 도르래 조립체(있는 경우에 한정한다) 무게의 1/2이 포함되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.6.3', '2015-05-13', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.6.3', '2022-03-02', NULL, 'current', '9.6.3 균형로프, 균형체인 또는 균형벨트와 같은 보상수단 및 보상수단의 부속품은 영향을 받는 모든 정적인 힘에 대해 5 이상의 
안전율을 가지고 견딜 수 있어야 한다. 카 또는 균형추가 운행구간의 최상부에 있을 때 보상수단의 최대 현수무게 및 
인장 풀리 조립체(있는 경우) 전체 무게의 1/2의 무게가 포함되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.6.4', '2023-03-02', NULL, 'current', '9.6.4 추가적인 보호조치
  보상 수단이 체인인 경우에는 9.6.3을 만족하는 추가적인 보호조치를 하여야 하며, 추가
적인 보호조치는 고정부 이탈 등으로 인한 체인의 추락을 방지하기 위해 체인 연결부와 
다른 부재에 연결되어야 한다.
  비고 보상체인 고정부가 균형추 또는 카의 프레임에 직접 연결된 경우 추가적인 보호조치의 고정부도 같은
부재(프레임)에 연결할 수 있다.
 
승강기 안전기준 연혁집[v1.0]
❙ 140');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.7', '2022-03-02', NULL, 'current', '9.7 도르래·풀리 및 스프로킷의 보호 수단');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.7.1', '2022-03-02', NULL, 'current', '9.7.1 도르래, 풀리, 스프로킷, 과속조절기, 인장추 풀리에 대해, 다음과 같은 위험을 방지
하기 위한 수단이 표 9에 따라 설치되어야 한다.
  가) 인체 부상
  나) 로프(벨트)/체인이 느슨해질 경우, 로프/체인이 풀리/스프로킷에서 벗어남
  다) 로프(벨트)/체인과 풀리/스프로킷 사이에 물체 유입
[ 표 9,  도르래, 풀리 및 스프로킷의 보호 ]
도르래, 풀리 및 스프로킷의 위치
9.7.1에 따른 위험
가)
나)
다)
카
카 지붕
○
○
○
카 하부
 
○
○
균형추/평형추
 
○
○
기계류 공간ㆍ기계실 및 풀리실
 ○2)
○
 ○1)
승강로
상부 공간
카 위
○
○
 
카 옆
○
○
 
피트와 상부 공간 사이
 
○
 ○1)
피트
○
○
○
잭
위쪽으로 확장
 ○2)
○
 
아래쪽으로 확장
 
○
 ○1)
기계적인 동기 수단
○
○
○
○ 위험이 고려되어야 한다.
1) 로프(벨트)체인 등이 권상 도르래 또는 풀리/스프로킷에 수평 또는 수평면에 대해 최대 90° 까지 들어가고 있는 경우
에만 요구
2) 로프(벨트)인 등이 도르래, 풀리 또는 스프로킷에 들어가거나 나오는 구역에 대한 우발적인 접근을 막는 최소한의 보
호수단(nip guards)이 있어야 한다.(그림 18 참조)
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
141 ❙
기호 설명
A  풀리
B  로프, 벨트
C  보호 수단(nip guard)
[ 그림 18. 보호 수단(nip guard)의 예시 ]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.7.1', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.7.1', '2022-03-02', NULL, 'current', '9.7.1 권상도르래, 풀리 및 스프라켓에 대해, 다음과 같은 위험을 방지하기 위해 표 2에 따라야 한다.
 가) 인체의 부상
 나) 로프/체인이 느슨해질 경우, 로프/체인이 풀리/스프라켓에서 벗어남
 다) 로프와 풀리/체인과 스프라켓 사이에 물체의 유입
[ 표 2 ]
권상도르래, 풀리 및 스프라켓의 위치
9.7.1에 따른 위험
가)
나)
다)
카
카 지붕
X
X
X
카 바닥 아래
X
X
균형추/평형추
X
X
기계실
X 2)
X
X 1)
풀리실
X
승강로
상부공간
카 위
X
X
카 옆
X
피트와 상부공간 사이
X
X 1)
피트
X
X
X
조속기 및 조속기 인장 풀리
X
X 1)
X 고려되는 위험
1) 로프/체인이 권상도르래 또는 풀리/스프라켓에 수평 또는 최대 90°까지 수평의 어떤 각도로 들어가고 
있는 경우에만 요구
2) 최소한 물려 들어가는 것에 대한 보호
 
승강기 안전기준 연혁집[v1.0]
❙ 142');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.7.1', '1995-06-07', '2022-03-01', 'old', '[로프식]
4.1.1(3) 전동기․제동기 및 권상기
 ⑥ 도르레 또는 권동에는 사람의 손․물건 등이 끼이지 않도록 보호망 등이 설치되어 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.7.2', '2022-03-02', NULL, 'current', '9.7.2 사용된 보호 수단은 회전 부품이 보이는 구조이어야 하고, 작동시험 및 점검 등 유지
관리 업무 수행에 방해되지 않아야 한다. 
이 보호 수단에 구멍이 있는 경우에는 KS B ISO 13857, 표 4에 따라야 한다. 
다음과 같이 필요한 경우에만 떼어낼 수 있어야 한다.
  가) 로프(벨트)/체인의 교체
  나) 도르래/풀리/스프로킷의 교체
  다) 홈의 재-가공
  도르래나 풀리에서 로프의 이탈을 막는 장치는 로프가 도르래에 들어가고 나오는 지점 
근처에 하나의 고정장치를 포함해야 한다. 
도르래/풀리의 수평축 아래에 60°이상의 감김 각도로 감겨 있고, 총 감김 각도가 120°
이상인 경우에는 하나 이상의 중간 고정장치를 추가로 포함해야 한다.(그림 19 참조)
[ 그림 19. 로프 고정장치(retainer)의 배치 예시 ]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.7.2', '2013-09-15', '2022-03-01', 'old', '');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.7.2', '2022-03-02', NULL, 'current', '9.7.2 사용되는 보호 수단은 회전하는 부품이 보이는 구조이어야 하고, 작동시험 및 유지보수 작업에 방해 되지 않아야 한다. 
이 보호 수단에 구멍이 있는 경우에는 KS B 6947, 표4에 따라야 한다.
다음과 같이 필요한 경우에 떼어낼 수 있어야 한다.
 가) 로프/체인의 교체
 나) 풀리/스프라켓의 교체
 다) 홈의 재-가공
 라) 점검 등 유지관리에 필요한 경우');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.7.2', '2007-09-10', '2022-03-01', 'old', '3.1.1(2)② 시행 
[로프식]
3.1.1(2) 도르래 또는 권동은 다음 각항의 구조로 하여야 한다.
 ② 급제동시나 지진 기타의 진동에 의해 주로프가 벗겨질 우려가 있는 경우에는 로프이탈방지장치 등을 설치하여야 한다. 
다만, 기계실에 설치된 고정 도르래 또는 도르래 홈에 주로프가 1/2이상 묻히거나 도르래의 끝단의 높이가 주로프보다 
더 높은 경우에는 제외한다.
4.1.1(3) 전동기․제동기 및 권상기
 ⑥ 도르레 또는 권동에는 사람의 손․물건 등이 끼이지 않도록 보호망 등이 설치되어 있어야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
143 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.7.2', '1995-06-07', '2007-09-09', 'old', '[로프식]
3.1.1(2) 도르래 또는 권동은 다음 각항의 구조로 하여야 한다.
 ② 급제동시나 지진 기타의 진동에 의해 주로프가 벗겨질 우려가 있는 경우에는 로프이탈방지장치 등을 설치하여야 한다. 
다만, 기계실에 설치된 고정 도르래의 경우에는 그러하지 아니하다.
4.1.1(3) 전동기․제동기 및 권상기
 ⑥ 도르레 또는 권동에는 사람의 손․물건 등이 끼이지 않도록 보호망 등이 설치되어 있어야 한다.
4.1.3(4) 고정도르래 또는 현수도르래가 있는 경우에는 그 설치상태는 견고하고, 몸체에 균열이 없어야 한다. 또한, 급제동시나 
지진 기타의 진동에 의해 주로프가 벗겨지지 않도록 조치되어 있어야 한다.
[유압식]
3.2.1(2) 도르래 또는 스프로켓은 다음 각항의 구조로 하여야 한다.
② 급제동시나 지진 기타의 진동에 의해 주로프 및 체인이 도르래 및 스프로켓으로부터 벗겨질 우려가 있는 경우에는 로프
이탈방지장치 등을 설치하여야 한다.
4.2.3(1) 도르래 또는 스프로켓의 설치상태는 견고하고, 몸체에 균열이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.7.2', NULL, '1995-06-07', 'old', '[로프식]
3.1.1(2) 도르래 또는 권동은 다음 각항의 구조로 하여야 한다.
 ② 급제동시나 지진 기타의 진동에 의해 주로프가 벗겨질 우려가 있는 경우에는 로프이탈방지장치 등을 설치하여야 한다. 
다만, 기계실에 설치된 고정 도르래의 경우에는 그러하지 아니하다.
4.1.3(4) 고정도르래 또는 현수도르래가 있는 경우에는 그 설치상태는 견고하고, 몸체에 균열이 없어야 한다. 또한, 급제동시나 
지진 기타의 진동에 의해 주로프가 벗겨지지 않도록 조치되어 있어야 한
[유압식]
3.2.1(2) 도르래 또는 스프로켓은 다음 각항의 구조로 하여야 한다.
② 급제동시나 지진 기타의 진동에 의해 주로프 및 체인이 도르래 및 스프로켓으로부터 벗겨질 우려가 있는 경우에는 로프
이탈방지장치 등을 설치하여야 한다.
4.2.3(1) 도르래 또는 스프로켓의 설치상태는 견고하고, 몸체에 균열이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.8', '2022-03-02', NULL, 'current', '9.8 승강로 내부의 권상도르래·풀리 및 스프로킷
  권상도르래, 풀리 및 스프로킷은 다음과 같은 조건 아래에서 최하층 승강장 바닥 위의 
승강로에 설치될 수 있다.
  가) 기계적인 고장 발생 시 편향 풀리/스프로킷의 추락을 막는 고정장치(retaining 
devices)가 있어야 한다. 이 고정 장치는 풀리/스프로킷의 무게와 매달려진 하중을 
지지할 수 있어야 한다.
4.1.3(4) 고정도르래 또는 현수도르래가 있는 경우에는 그 설치상태는 견고하고, 몸체에 균열이 없어야 한다. 또한, 급제동시나 
지진 기타의 진동에 의해 주로프가 벗겨지지 않도록 조치되어 있어야 한다.
[유압식]
3.2.1(2) 도르래 또는 스프로켓은 다음 각항의 구조로 하여야 한다.
② 급제동시나 지진 기타의 진동에 의해 주로프 및 체인이 도르래 및 스프로켓으로부터 벗겨질 우려가 있는 경우에는 로프
이탈방지장치 등을 설치하여야 한다.
4.2.3(1) 도르래 또는 스프로켓의 설치상태는 견고하고, 몸체에 균열이 없어야 한다.');