-- 9항 파싱

DELETE FROM inspection_item_revisions WHERE item_id LIKE '9.%';

INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.8.7', '2022-03-02', NULL, 'current', '9.8.7 카 바닥의 기울기
카 비상정지장치가 작동될 때, 부하가 없거나 부하가 균일하게 분포된 카의 바닥은 정상적인 위치에서 5%를 초과하여 기울어지지 
않아야 한다.
[유압식]');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2022-03-02', NULL, 'current', '9.11.11 멈춤 쇠 장치가 작동되는 경우 카 바닥의 기울기
9.8.7의 규정을 적용한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', NULL, '2013-09-15', 'old', '[로프식]
4.1.1(6) 비상정지장치의 작동상태
카 내에 65㎏의 하중을 싣고, 가능한 최저속도로 다음 ① 및 ②의 사항을 검사한다.”
② 비상정지장치가 작동된 상태에서 기계장치 및 조속기로프에는 아무런 손상이 없어야 한다. 또한, 비상정지장치는 좌우 
양쪽 다같이 균등하게 작용하고, 카 바닥의 수평도는 어느 부분에서나 1/30 이내이어야 한다.
8.3.2.2 카의 각 벽은 다음 구분과 같은 기계적 강도를 가져야 한다.
  가) 5 ㎠ 면적의 원형 또는 정사각형 모양의 어느 지점마다 수직으로 300 N의 힘을 균등
하게 분산하여 카 내부에서 외부로 가할 때 다음과 같아야 한다.
      1) 1 ㎜를 초과하는 영구적인 변형이 없어야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 116
      2) 15 ㎜를 초과하는 탄성변형이 없어야 한다.
  나) 100 ㎠ 면적의 원형 또는 정사각형 모양의 어느 지점마다 수직으로 1,000 N의 힘을
균등하게 분산하여 카 내부에서 외부로 가할 때 1 ㎜를 초과하는 영구적인 변형이 
없어야 한다.
      비고 이 힘은 거울, 장식용 패널, 카 조작반 등을 제외하고, 벽 “구조체”에 적용한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2015-05-13', '2015-05-12', 'old', '8.3.2.1 5 ㎠ 면적의 원형이나 사각의 단면에 300 N의 힘을 균등하게 분산하여 카 내부에서 외부로 카 벽의 어느 지점에 수직으로 
가할 때 카 벽의 기계적 강도는 다음과 같아야 한다.
 가) 1 ㎜를 초과하는 영구변형이 견뎌야 한다.
 나) 15 mm를 초과하는 탄성변형 없이 견뎌야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.3.2.1 5 ㎠ 면적의 원형이나 사각의 단면에 300 N의 힘을 균등하게 분산하여 카 내부에서 외부로 카 벽의 어느 지점에 
수직으로 가할 때 카 벽의 기계적 강도는 다음과 같아야 한다. 
 가) 영구적인 변형 없이 견뎌야 한다. 
 나) 15 mm를 초과하는 탄성변형 없이 견뎌야 한다. 
8.3.2.3 카 벽 전체 또는 일부에 사용되는 유리는 KS L 2004에 적합한 접합유리이어야 한다.
높이 500 ㎜에서 떨어지는 것과 동등한 충격에너지의 경질 진자충격장치(별표 9 참조) 
및 높이 700 ㎜에서 떨어지는 것과 동등한 충격에너지의 연질 진자충격장치(별표 9 참조)를 
카 벽의 유리판 중심선의 바닥 위로 높이 1 m의 타격지점에 충격을 가할 때 또는 카 벽의 
일부에 유리가 있는 경우 유리부품 중앙의 타격지점에 충격을 가할 때, 다음과 같아야 한다.
  가) 카 벽의 구성요소에는 균열이 없어야 한다.
  나) 유리 표면에는 지름 2 ㎜ 이하의 흡집을 제외하고 손상이 없어야 한다.
  다) 카 벽의 완전성에 손실이 없어야 한다.
  다만, 표 8과 같은 평면 유리로 된 카 벽의 부품들이 모든 면에서 틀에 끼여져 있는 경우, 
상기의 충격시험은 필요하지 않다.
  상기의 충격시험은 카 벽의 내부 면에서 수행되어야 한다. 
[ 표 8. 카 벽에 사용되는 평면 유리판 ]
유리 형식
내접원 지름
최대 1 m
최대 2 m
최소 두께 (㎜)
최소 두께 (㎜)
강화 접합유리
8
(4 + 4 + 0.76)
10
(5 + 5 + 0.76)
접합유리
10
(5 + 5 + 0.76)
12
(6 + 6 + 0.76)
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
117 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2015-05-13', '2015-05-12', 'old', '8.3.2.2 유리로 된 카 벽은 KS L 2004에 적합하거나 동등이상의 접합유리이어야 한다. 
바닥에서 1.1 m 이하인 곳의 카 벽에 유리가 사용된 경우에는 0.9 m와 1.1 m 사이에 손잡이가 설치되어야 하며, 이 손잡이는 
유리와 독립적으로 고정되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.3.2.2 유리로 된 카 벽은 KS L 2004에 적합하거나 동등이상의 접합유리이어야 한다. 
추가로, 부속서 Ⅴ에 기술된 연질진자 충격시험에 견디어야 하며 이 시험이 끝난 후에 안전성능은 영향을 받지 않아야 한다. 
바닥에서 1.1 m 이하인 곳의 카 벽에 유리가 사용된 경우에는 0.9 m와 1.1 m 사이에 손잡이가 설치되어야 하며, 이 손잡이는 
유리와 독립적으로 고정되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.3.2.3 카 벽에 있는 유리의 고정설비는 유리가 내려앉거나 함몰되더라도 유리가 고정설비 밖으로 미끄러지지 않도록 보장
되어야 한다.
8.3.2.5 유리판에는 다음과 같은 정보가 표시되어야 한다.
  가) 판매자명 및 상표
  나) 유리의 유형
  다) 두께(예시: 8/8/0.76 ㎜)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.3.2.4 유리판에는 다음과 같은 정보가 표시되어야 한다.
 가) 공급자명 및 상표
 나) 유리의 유형
8.3.2.6 카 지붕은 8.7에 따른 기준에 적합해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.3.2.5 카 지붕은 8.13의 규정을 만족하여야 한다.
8.3.3 바닥에서 높이 1.1 m 이하인 곳에 유리가 있는 카 벽에는 높이 0.9 m부터 1.1 m
까지 구간 사이에 손잡이가 있어야 한다. 
이 손잡이는 유리와 독립적으로 고정되어야 한다. 
  비고 장애인용 엘리베이터의 경우 17.1.5.1을 따른다.
승강기 안전기준 연혁집[v1.0]
❙ 118');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2015-05-13', '2015-05-12', 'old', '8.3.2.2 유리로 된 카 벽은 KS L 2004에 적합하거나 동등이상의 접합유리이어야 한다. 
바닥에서 1.1 m 이하인 곳의 카 벽에 유리가 사용된 경우에는 0.9 m와 1.1 m 사이에 손잡이가 설치되어야 하며, 이 손잡이는 
유리와 독립적으로 고정되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.3.2.2 유리로 된 카 벽은 KS L 2004에 적합하거나 동등이상의 접합유리이어야 한다. 
추가로, 부속서 Ⅴ에 기술된 연질진자 충격시험에 견디어야 하며 이 시험이 끝난 후에 안전성능은 영향을 받지 않아야 한다. 
바닥에서 1.1 m 이하인 곳의 카 벽에 유리가 사용된 경우에는 0.9 m와 1.1 m 사이에 손잡이가 설치되어야 하며, 이 손잡이는 
유리와 독립적으로 고정되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.3.3 카의 벽, 바닥 및 지붕은 불연재료로 만들거나 씌워야 한다. 다만, 인테리어 목적으로 사용되는 카 내장재를 포함한 구조상 
경미한 부분은 제외할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.4.1 카 문턱에는 승강장 유효 출입구 전폭에 걸쳐 에이프런이 설치되어야 한다. 수직면의 아랫부분은 수평면에 대해 60° 
이상으로 아랫방향을 향하여 구부러져야 한다. 구부러진 곳의 수평면에 대한 투영길이는 20 mm 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '1997-08-18', '1997-08-17', 'old', '4.1.5(7) 승객용, 침대용, 승객․화물용, 비상용, 장애인용 및 전망용 엘리베이터에 설치되는 보호판은 다음 기준에 적합하여야 
한다.
 ① 카 바닥 앞부분의 아랫방향으로 출입구의 전폭에 걸쳐 수직높이가 540㎜ 이상인 보호판이 견고하게 설치되어 있어야 한다.
 ② 보호판은 두께 1.2㎜ 이상의 금속제 판으로 충분한 강도 및 강성을 갖도록 설치되어 있어야 한다.
 ③ 보호판은 카 바닥 앞부분의 아랫방향으로 출입구 전폭에 걸쳐 곧은 수직면을 가져야 하고, 보호판의 아랫부분은 안전상 
지장이 없도록 충분히 뒤로 구부러져 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '1994-06-01', '1994-05-31', 'old', '4.1.5(7) 승객용, 침대용, 승객․화물용, 비상용, 장애인용 및 전망용 엘리베이터에 설치되는 보호판은 다음 기준에 적합하여야 
한다.
 ① 카 바닥 앞부분의 아랫방향으로 출입구의 전폭에 걸쳐 수직높이가 540㎜ 이상인 보호판이 견고하게 설치되어 있어야 한다.
8.5.2 에이프런의 수직 부분 높이는 0.75 m 이상이어야 한다. 다만, 주택용 엘리베이터의 
경우에는 0.54 m 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.4.2 수직 부분의 높이는 0.75 m 이상이어야 한다
8.4.3 도킹 운전(14.2.1.5)이 있는 엘리베이터의 경우, 카가 가장 높은 곳에서 타거나 내리는 위치(또는 하역하는 위치)에 있을 때, 
수직부분의 높이는 승강장 문턱 아래로 0.1 m 이상 연장되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '1997-08-18', '1997-08-17', 'old', '4.1.5(7) 승객용, 침대용, 승객․화물용, 비상용, 장애인용 및 전망용 엘리베이터에 설치되는 보호판은 다음 기준에 적합하여야 
한다.
 ① 카 바닥 앞부분의 아랫방향으로 출입구의 전폭에 걸쳐 수직높이가 540㎜ 이상인 보호판이 견고하게 설치되어 있어야 한다.
 ② 보호판은 두께 1.2㎜ 이상의 금속제 판으로 충분한 강도 및 강성을 갖도록 설치되어 있어야 한다.
 ③ 보호판은 카 바닥 앞부분의 아랫방향으로 출입구 전폭에 걸쳐 곧은 수직면을 가져야 하고, 보호판의 아랫부분은 안전상 
지장이 없도록 충분히 뒤로 구부러져 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '1994-06-01', '1995-06-06', 'old', '4.1.5(7) 승객용, 침대용, 승객․화물용, 비상용, 장애인용 및 전망용 엘리베이터에 설치되는 보호판은 다음 기준에 적합하여야 
한다.
 ① 카 바닥 앞부분의 아랫방향으로 출입구의 전폭에 걸쳐 수직높이가 540㎜ 이상인 보호판이 견고하게 설치되어 있어야 한다.
8.5.3 에이프런 하단의 모서리에 대해 5 ㎠ 면적의 원형 또는 정사각형 모양의 어느 지점
마다 수직으로 300 N의 힘을 균등하게 분산하여 승강장 측에서 가할 때 다음과 같아야 
한다.
  가) 1 ㎜를 초과하는 영구적인 변형이 없어야 한다.
  나) 35 ㎜를 초과하는 탄성변형이 없어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>
승강기 안전기준 연혁집[v1.0]
❙ 120
8.6 비상구출문
8.6.1 카 천장에 비상구출문이 설치된 경우, 유효 개구부의 크기는 0.4 m × 0.5 m 이상
이어야 한다. 다만, 8.6.2에 따라 카 벽에 설치된 경우 제외될 수 있다.
  비고 공간이 허용된다면, 유효 개구부의 크기는 0.5 × 0.7 m 가 바람직하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.12.1 12.5에서 기술된 비상구출 운전 시, 카 내 승객의 구출은 항상 카 밖에서 이루어져야 한다.
8.12.2 승객의 구출 및 구조를 위한 비상구출문이 카 천장에 있는 경우, 비상구출구의 크기는 0.35 m × 0.5 m 이상이어야 한다.
8.12.4 비상구출문은 8.3.2 및 8.3.3에 적합하여야 한다. 또한, 다음 사항에 적합하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '1997-08-18', '1997-08-17', 'old', '3.1.2(4) 비상시 외부에서 구출할 수 있는 비상구출구는 다음 각항의 기준에 적합하여야 한다. 다만, 자동차용 엘리베이터와 
카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 아니하다.
 ① 카 천장에 설치된 비상구출구는 카 위에서는 공구 등을 사용하지 않고 간단한 조작에 의해 쉽게 열 수 있어야 하나, 카 내에서는 
열 수 없도록 잠금장치를 갖추어야 하며, 승객의 구출활동에 장애가 없도록 충분한 공간이 확보되는 위치에 설치하고, 
크기는 작은쪽 변의 길이가 0.4m 이상,  면적은 0.2㎡ 이상으로 하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', NULL, '1997-08-18', 'old', '3.1.2(4) 비상시 외부에서 구출할 수 있는 비상구출구는 다음 각항의 기준에 적합하여야 한다. 다만, 자동차용 엘리베이터와 
카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 아니하다.
 ① 비상시 승강기(전동 덤웨이터를 제외한다)에는 외부에서 구출할 수 있는 비상구출구를 설치하여야 한다. 
8.6.2 하나의 승강로에 2대 이상의 엘리베이터가 있는 경우, 카 벽에 비상구출문(6.3.3 참조)을
설치할 수 있다. 다만, 카 간의 수평거리는 1 m를 초과할 수 없다.
이 경우, 각 카에는 구조 작업이 가능할 수 있도록 사람이 구출될 인접한 카의 위치를 
결정하는 수단이 제공되어야 한다.
구조가 이뤄질 때, 카 벽의 비상구출문 간의 거리가 0.35 m를 초과한 경우에는 손잡이가
있고 폭이 0.5 m 이하이지만 비상구출문의 개구부에 들어가기에 충분한 공간이 있는 
휴대용/이동식 다리(portable/movable bridge) 또는 카에 일체형으로 된 다리(bridge)
가 설치되어야 한다.
다리는 2,500 N의 힘을 견딜 수 있도록 설계되어야 한다.
다리가 휴대용/이동식인 경우, 그 다리는 구조가 이루어지는 건축물에 보관되어야 하고, 
다리의 사용에 관한 설명서가 있어야 한다.
  카 벽에 설치된 비상구출문의 크기는 폭 0.4 m 이상, 높이 1.8 m 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.12.3 2대 이상의 엘리베이터가 동일 승강로에 설치되어 인접한 카에서 구출할 수 있도록 카 벽에 비상구출문이 설치될 수 
있다. 다만, 서로 다른 카사이의 수평거리는 0.75 m 이하이어야 한다.(5.2.2.1.2 참조) 이 비상구출문의 크기는 폭 0.35 m 
이상, 높이 1.8 m 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '1997-08-18', '1997-08-17', 'old', '3.1.2(4) 비상시 외부에서 구출할 수 있는 비상구출구는 다음 각항의 기준에 적합하여야 한다. 다만, 자동차용 엘리베이터와 
카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 아니하다.
 ② 카 벽에 설치된 비상구출구는 카 안쪽으로만 열리고, 카 내부에서는 열쇠를 사용하지 않으면 열 수 없어야 하며, 크기
는 폭 0.35m 이상, 높이 1.5m 이상으로 하여야 한다.
 
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
121 ❙');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', NULL, '1997-08-18', 'old', '3.1.2(4) 비상시 외부에서 구출할 수 있는 비상구출구는 다음 각항의 기준에 적합하여야 한다. 다만, 자동차용 엘리베이터와 
카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 아니하다.
 ② 비상시 승강기(전동 덤웨이터를 제외한다)에는 외부에서 구출할 수 있는 비상구출구를 설치하여야 한다.
8.6.3 비상구출문에는 손으로 조작할 수 있는 잠금장치가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.12.4.1 비상구출문은 손으로 조작 가능한 잠금장치가 있어야 한다.
8.6.3.1 카 천장의 비상구출문은 카 외부에서 열쇠 없이 열려야 하고, 카 내부에서는 
7.9.3에 따른 비상잠금해제 삼각열쇠로 열려야 한다. 
카 천장의 비상구출문은 카 내부 방향으로 열리지 않아야 한다. 
카 천장의 비상구출문이 완전히 열렸을 때, 그 열린 부분은 카 천장의 가장자리를 넘어 
돌출되지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.12.4.1.1 카 천장에 설치된 비상구출문은 열쇠 등을 사용하지 않고 카 외부에서 간단한 조작으로 열 수 있어야 하고 카 내부에서는 
부속서 Ⅱ에서 규정한 열쇠를 사용하지 않으면 열 수 없는 구조이어야 한다.
카 천장에 설치된 비상구출문은 카 내부 방향으로 열리지 않아야 한다.
카 천장에 설치된 비상구출문이 완전히 열렸을 때 카 천장의 가장자리를 넘어 돌출되지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '1997-08-18', '1997-08-17', 'old', '3.1.2(4) 비상시 외부에서 구출할 수 있는 비상구출구는 다음 각항의 기준에 적합하여야 한다. 다만, 자동차용 엘리베이터와 
카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 아니하다.
 ① 카 천장에 설치된 비상구출구는 카 위에서는 공구 등을 사용하지 않고 간단한 조작에 의해 쉽게 열 수 있어야 하나, 카 내에서는 
열 수 없도록 잠금장치를 갖추어야 하며, 승객의 구출활동에 장애가 없도록 충분한 공간이 확보되는 위치에 설치하고, 
크기는 작은쪽 변의 길이가 0.4m 이상,  면적은 0.2㎡ 이상으로 하여야 한다.
4.1.3(1) 비상구출구는 카 밖에서 간단한 조작으로 열 수 있어야 한다. 또한, 비상구출구스위치의 설치상태는 견고하고, 작동
상태는 양호하여야 한다. 다만, 자동차용 엘리베이터와 카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 
아니하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', NULL, '1997-08-18', 'old', '3.1.2(4) 비상시 승강기(전동 덤웨이터를 제외한다)에는 외부에서 구출할 수 있는 비상구출구를 설치하여야 한다.
4.1.3(1) 비상구출구는 카 밖에서 간단한 조작으로 열 수 있어야 한다. 또한, 비상구출구스위치의 설치상태는 견고하고, 작동
상태는 양호하여야 한다. 다만, 자동차용 엘리베이터와 카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 
아니하다.
8.6.3.2 카 벽의 비상구출문은 카 외부에서 열쇠 없이 열려야 하고, 카 내부에서는 7.9.3에
따른 비상잠금해제 삼각열쇠로 열려야 한다. 
카 벽의 비상구출문은 카 외부방향으로 열리지 않아야 한다. 
카 벽의 비상구출문은 균형추나 평형추의 주행로 또는 카에서 다른 카로 이동을 방해하는
고정된 장애물(카를 분리하는 중간 빔은 제외한다)의 전면에 위치되지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.12.4.1.2 카 벽에 설치된 비상구출문은 열쇠 등을 사용하지 않고 카 외부에서 간단한 조작으로 열 수 있어야 하고 카 내부에서는 
부속서 Ⅱ에서 규정한 열쇠를 사용하지 않으면 열 수 없는 구조이어야 한다.
카 벽에 설치된 비상구출문은 카 외부 방향으로 열리지 않아야 하며 균형추나 평형추의 주행로 또는 카에서 다른 카로 이동하는 
것을 방해하는 고정된 장애물(카를 분리하는 중간 빔은 제외)의 전방에 설치되지 않아야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 122');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '1997-08-18', '2013-09-14', 'old', '3.1.2(4) 비상시 외부에서 구출할 수 있는 비상구출구는 다음 각항의 기준에 적합하여야 한다. 다만, 자동차용 엘리베이터와 
카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 아니하다.
 ② 카 벽에 설치된 비상구출구는 카 안쪽으로만 열리고, 카 내부에서는 열쇠를 사용하지 않으면 열 수 없어야 하며, 크기는 
폭 0.35m 이상, 높이 1.5m 이상으로 하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', NULL, '1997-08-18', 'old', '3.1.2(4) 비상시 승강기(전동 덤웨이터를 제외한다)에는 외부에서 구출할 수 있는 비상구출구를 설치하여야 한다.
8.6.4 8.6.3에 따른 잠금 상태는 15.2에 따른 전기안전장치에 의해 입증되어야 한다. 
카 벽의 비상구출문의 경우, 잠금장치가 해제되면 이 장치는 또한 인접한 엘리베이터를 
정지시켜야 한다. 
엘리베이터의 운행 재개는 잠금장치가 다시 잠긴 후에만 가능해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.12.4.2 8.12.4.1에서 규정된 잠금 상태는 14.1.2에 적합한 전기안전장치에 의해 확인되어야 한다. 이 장치는 잠금이 이뤄지지 
않을 경우 엘리베이터를 정지시켜야 한다. 엘리베이터의 재 운행은 잠금 상태가 다시 확인된 후에만 가능하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', NULL, '2013-09-15', 'old', '3.1.2(4) 비상시 외부에서 구출할 수 있는 비상구출구는 다음 각항의 기준에 적합하여야 한다. 다만, 자동차용 엘리베이터와 
카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 아니하다.
 ③ 비상구출구를 열었을 때에는 비상구출구스위치가 작동하여 카가 움직이지 않아야 한다.
4.1.3(1) 비상구출구는 카 밖에서 간단한 조작으로 열 수 있어야 한다. 또한, 비상구출구스위치의 설치상태는 견고하고, 작동상태는 
양호하여야 한다. 다만, 자동차용 엘리베이터와 카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 아니하다.
8.7 카 지붕
8.7.1 카 지붕은 8.3에 따른 기준 뿐만 아니라 다음과 같은 기준에 적합해야 한다.
  가) 카 지붕은 6.5.7.1에 따른 허용 가능 인원을 지탱할 수 있는 충분한 강도를 가져야 
하고, 0.3 m × 0.3 m 면적의 어느 지점에서나 최소 2,000 N의 힘을 영구 변형 
없이 견딜 수 있어야 한다.
  나) 작업 또는 작업구역 간의 이동이 필요한 카 지붕의 표면은 사람이 미끄러지지 않도록
되어야 한다.
       비고 KS B ISO 14122-2, 4.2.4.6을 참조한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.13 카 지붕
8.3에 추가하여, 카 지붕은 다음 사항을 만족하여야 한다.
8.13.1 카 지붕은 어떤 위치에서든지 0.2 m × 0.2 m의 면적에 1000 N으로 각각 계산한 두 사람의 무게를 영구적인 변형 없이 
견딜 수 있어야 한다.
8.13.2 카 지붕은 사람이 서 있을 수 있는 0.12 ㎡ 이상의 유효 면적이 확보되어야 하고, 작은 변의 길이는 0.25 m 이상이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '1995-06-07', '1995-06-06', 'old', '4.1.3(20) 카 위의 출입구를 제외한 전둘레에는 카 위 바닥면에서 수직높이가 60㎝ 이상인 보호난간이 견고하게 설치되어 있어야 
한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
123 ❙
8.7.2 카 지붕에는 다음과 같은 보호수단이 있어야 한다.
  가) 다음 중 어느 하나에 해당하는 곳에 높이 0.1 m 이상의 발보호판(toe board)이 
있어야 한다.
      1) 카 지붕의 바깥쪽 가장자리
      2) 보호난간(8.7.4)이 있는 경우에는 카 지붕의 바깥쪽 가장자리와 보호난간 사이
  나) 카 지붕의 바깥쪽 가장자리에서 승강로 벽까지의 수평거리가 0.3 m를 초과하는 경우
에는 8.7.4에 따른 보호난간이 있어야 한다.
이 수평거리는 승강로 벽까지 측정되어야 한다. 다만, 폭 또는 높이가 0.3 m 이하의
움푹 들어간 부분은 측정에서 제외될 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2015-05-13', '2015-05-12', 'old', '8.13.3 카 지붕에는 다음과 같은 보호수단이 설치되어야 한다.
 가) 발보호판 : 카 지붕의 가장자리 또는 보호난간이 있는 경우에는 카 지붕의 가장자리와 보호난간 사이에 높이 0.1 m 이상으로 
설치되어야 한다.
 나) 보호난간 : 카 지붕의 바깥쪽 가장자리에서 승강로 벽까지의 수평거리가 0.3 m를 초과하는 경우에 설치되어야 한다. 이 
수평거리는 승강로 내의 벽면까지 측정한다. 다만, 움푹 들어간 부분의 폭이나 높이가 0.3 m 이하인 경우에는 측정부분에서 
제외될 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.13.3 카 지붕의 바깥쪽 가장자리에서 승강로 벽까지의 수평거리가 0.3 m를 초과하는 경우에는 보호난간이 설치되어야 한다. 
이 수평거리는 승강로 내 벽면까지 측정한다. 다만, 움푹 들어간 부분의 폭 또는 높이가 0.3 m 이하인 경우에는 측정 
부분에서 제외될 수 있다. 보호난간은 다음 사항에 적합하여야 한다.
8.7.3 카 지붕의 바깥쪽 가장자리와 승강로 벽 사이에 위치된 엘리베이터 부품이 추락 
위험을 방지할 수 있는 경우(그림 15 및 그림 16 참조), 그 보호는 다음 조건을 동시에 
충족해야 한다.
  가) 카 지붕의 바깥쪽 가장자리와 승강로 벽 사이의 거리가 0.3 m를 초과한 경우, 카 
지붕의 바깥쪽 가장자리와 관련 부품 사이, 부품과 부품 사이 또는 보호난간의 
끝 부분과 부품 사이에는 직경 0.3 m를 초과하는 수평 원을 놓을 수 없어야 한다.
  나) 부품에 대해 어느 지점마다 수직으로 300 N의 힘을 수평으로 가할 때, 가)에 따른 
기준을 더 이상 충족할 수 없는 곳으로 편향되지 않아야 한다.
  다) 부품은 카 주행의 전 구간에 걸쳐, 8.7.4에 따른 보호난간과 같은 수준의 보호를 형성
하기 위해 카 지붕 위의 높이로 연장되어야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 124
    
기호 설명
① 승강로 벽        ② 카 지붕 가장자리 
③ 로프, 벨트       ④ 주행안내 레일
⑤ 보호난간
[ 그림 15. 추락 보호 부품의 예(전기식 엘리베이터) ]
    
기호 설명
① 승강로 벽        ② 카 지붕 가장자리 
③ 램               ④ 주행안내 레일
⑤ 보호난간
[ 그림 16. 추락 보호 부품의 예(유압식 엘리베이터) ]
<2019년 3월 28일 이후 건축허가분부터 적용>
8.7.4 보호난간은 다음과 같아야 한다.
  가) 보호난간은 손잡이와 보호난간의 1/2 높이에 있는 중간 봉으로 구성되어야 한다.
  나) 보호난간의 높이는 보호난간의 손잡이 안쪽 가장자리와 승강로 벽(그림 17 참조) 사이의 
수평거리를 고려하여 다음 구분에 따른 수치 이상이어야 한다.
      1) 수평거리가 0.5 m 이하인 경우: 0.7 m
      2) 수평거리가 0.5 m를 초과한 경우: 1.1 m
  다) 보호난간은 카 지붕의 가장자리로부터 0.15m 이내에 위치되어야 한다.
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
125 ❙
  라) 보호난간의 손잡이 바깥쪽 가장자리와 승강로의 부품(균형추 또는 평형추, 스위치, 
레일, 브래킷 등) 사이의 수평거리는 0.1 m 이상이어야 한다.
  마) 보호난간 상부의 어느 지점마다 수직으로 1,000 N의 힘을 수평으로 가할 때, 50 ㎜
를 초과하는 탄성 변형 없이 견딜 수 있어야 한다.
< 보호난간 불필요, 발보호판 높이 0.1 m 이상 >
< 0.7 m 이상의 보호난간 필요, 발보호판 높이 0.1 m 이상 >
<1.1 m 이상의 보호난간 필요, 발보호판 높이 0.1 m 이상>
[ 그림 17. 카 지붕 보호난간 – 높이 ]
승강기 안전기준 연혁집[v1.0]
❙ 126');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2015-05-13', '2022-03-01', 'old', '8.13.3.1 보호난간은 손잡이 및 보호난간의 1/2 높이 지점의 중간봉으로 구성되어야 한다.
8.13.3.2 보호난간의 손잡이 바깥쪽 끝 면과 승강로 벽 사이의 수평거리를 고려하여 보호난간의 높이는 다음과 같아야 한다.
 가) 수평거리가 0.3 m를 초과하고 0.5 m 이하인 경우 : 0.7 m 이상
 나) 수평거리가 0.5 m를 초과하는 경우 : 1.1 m 이상
8.13.3.4 출입구 측에 있는 보호난간은 카 지붕으로 안전하고 쉽게 접근할 수 있도록 조치되어야 한다.
8.13.3.5 발보호판 및 보호난간은 카 지붕 가장자리에서 0.15 m 이내에 있어야 한다.
8.13.3.3 손잡이의 바깥쪽 모서리와 승강로의 어떤 부품(균형추 또는 평형추, 스위치, 레일, 브라켓 등) 사이의 수평거리는 
0.1 m 이상이어야 한다.
8.13.4 난간에 기대는 위험에 대한 경고표시 또는 주의 문이 보호난간의 적절한 위치에 부착되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.13.3.1 보호난간은 손잡이, 높이 0.1 m의 발 보호판 및 보호난간의 1/2 높이 지점의 중간봉으로 구성되어야 한다.
8.13.3.2 보호난간의 손잡이 바깥쪽 끝 면과 승강로 벽 사이의 수평거리를 고려하여 보호난간의 높이는 다음과 같아야 한다.
 가) 수평거리가 0.3 m를 초과하고 0.85 m 이하인 경우 : 0.7 m 이상 
 나) 수평거리가 0.85 m를 초과하는 경우 : 1.1 m 이상
8.13.3.4 출입구 측에 있는 보호난간은 카 지붕으로 안전하고 쉽게 접근할 수 있도록 조치되어야 한다.
8.13.3.5 보호난간은 카 지붕 가장자리에서 0.15 m 이내에 있어야 한다.
8.13.3.3 손잡이의 바깥쪽 모서리와 승강로의 어떤 부품(균형추 또는 평형추, 스위치, 레일, 브라켓 등) 사이의 수평거리는 
0.1 m 이상이어야 한다.
8.13.4 난간에 기대는 위험에 대한 경고표시 또는 주의 문이 보호난간의 적절한 위치에 부착되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '1995-06-07', '1997-08-17', 'old', '4.1.3(20) 카 위의 출입구를 제외한 전둘레에는 카 위 바닥면에서 수직높이가 60㎝ 이상인 보호난간이 견고하게 설치되어 있어야 
한다.
8.7.5 카 지붕에 사용된 유리는 KS L 2004에 적합한 접합유리이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.13.5 카 지붕에 유리가 사용된 경우, 그 유리는 KS L 2004에 적합하거나 동등이상의 접합유리이어야 한다.
8.7.6 카에 고정된 풀리 또는 스프로킷은 9.7에 따라 보호되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.13.6 카에 설치된 풀리 및 스프라켓은 9.7의 규정에 따라 보호되어야 한다.
8.8 카 상부의 설비
  카 상부에는 다음과 같은 설비가 설치되어야 한다.
  가) 피난 공간(6.5.7.1)에서 수평거리 0.3 m 이내의 위치에서 조작이 가능한 16.1.5(점검
운전)에 따른 조작반
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
127 ❙
  나) 점검 등 유지관리 업무를 수행하는 사람이 쉽게 접근할 수 있고, 출입구에서 1 m 
이내에 있는 16.1.11에 따른 정지장치
출입구에서 1 m 이내에 있는 이 장치는 점검운전 조작반에 위치될 수 있다.
  다) 14.7.2에 따른 콘센트');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.15 카 상부의 설비
카 상부에는 다음과 같은 설비가 설치되어야 한다.
 가) 14.2.1.3에 적합한 제어장치(점검운전)
 나) 14.2.2 및 15.3에 적합한 정지장치
 다) 13.6.2에 적합한 콘센트
15.3 카 지붕
카 지붕에는 다음과 같은 정보가 표기되어야 한다.
 가) 정지장치에 “정지”라는 글자
 나) 점검운전 스위치 또는 근처에 “정상” 및 “점검” 이라는 글자
 다) 점검운전 버튼 또는 근처에 운행 방향 표시
 라) 보호난간에 경고문 또는 주의표시');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', NULL, '2013-09-15', 'old', '4.1.3(3) 카 위의 안전스위치 및 수동운전스위치의 작동상태는 양호하여야 한다.
<추가 종전 기준>-----------------------------------------------');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.14 카 헤더
승강장문이 열렸을 때 카 지붕과 승강장문의 헤더 사이에 틈새가 있는 경우에는 이 틈새를 채우기 위해 카 출입구의 윗부분에 
승강장문의 전체 폭에 걸쳐 위로 연장되는 견고한 금속판이 설치되어야 한다. 
 비고 이러한 가능성은 도킹 운전(14.2.1.5)이 있는 엘리베이터의 경우 특히 예상되어야 한다.
8.9 환기
8.9.1 카에는 카의 아랫부분과 윗부분에 환기 구멍이 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.16.1 구멍이 없는 문이 설치된 카에는 카의 위ㆍ아랫부분에 자연 환기구가 있어야 한다.
8.9.2 카의 아랫부분과 윗부분에 있는 환기 구멍의 유효 면적은 각각 카 유효 면적의 1 %
이상이어야 하고, 카문 주위의 틈새는 필요한 유효 면적의 50 %까지 환기 구멍의 면적 
계산에 고려될 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.16.2 카 윗부분에 위치한 자연 환기구의 유효면적은 카의 허용면적의 1% 이상이어야 한다. 카 아랫부분의 환기구 또한 동일하게 
적용된다. 카문 주위에 있는 개구부 또는 틈새는 규정된 유효면적의 50%까지 환기구의 면적에 계산될 수 있다.
8.9.3 환기 구멍은 직경 10 ㎜의 곧은 강철 막대 봉이 카 내부에서 카 벽을 통해 통과될 
수 없는 구조이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.16.3 자연 환기구는 직경 10 mm의 곧은 강체 막대 봉이 카 내부에서 카 벽을 통해 통과될 수 없는 구조이어야 한다.
승강기 안전기준 연혁집[v1.0]
❙ 128
8.10 조명
8.10.1 카에는 카 조작반 및 카 벽에서 100 ㎜ 이상 떨어진 카 바닥 위로 1 m 모든 
지점에 100 ㏓ 이상으로 비추는 전기조명장치가 영구적으로 설치되어야 한다.
  조도 측정 시 조도계는 가장 밝은 광원을 향하도록 해야 한다. 
  비고 손잡이, 접이식 의자 등 카의 환경 요소에 따라 발생하는 그림자는 무시할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.17.1 카에는 카 바닥 및 조작 장치를 50 lx 이상의 조도로 비출 수 있는 영구적인 전기조명이 설치되어야 한다.
8.10.2 조명장치에는 2개 이상의 등(燈)이 병렬로 연결되어야 한다.
  비고 “등”이란 전구, 형광등 등 개별 광원을 말한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.17.2 조명이 백열등 형태일 경우에는 2개 이상의 등이 병렬로 연결되어야 한다.
8.10.3 카는 문이 닫힌 채로 승강장에 정지하고 있을 때를 제외하고 계속 조명되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.17.3 엘리베이터가 사용 중일 때, 카는 지속적으로 조명되어야 한다.
자동 동력 작동식 문의 경우, 7.8에 따라 카가 문이 닫힌 채로 승강장에 정지하고 있을 때 조명은 차단될 수 있다.
8.10.4 카에는 자동으로 재충전되는 비상전원공급장치에 의해 5 ㏓ 이상의 조도로 1시간 
동안 전원이 공급되는 비상등이 있어야 한다. 
이 비상등은 다음과 같은 장소에 조명되어야 하고, 정상 조명전원이 차단되면 즉시 자동
으로 점등되어야 한다. 
  가) 카 내부 및 카 지붕에 있는 비상통화장치의 작동 버튼
  나) 카 바닥 위 1 m 지점의 카 중심부
  다) 카 지붕 바닥 위 1 m 지점의 카 지붕 중심부');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.17.4, 14.2.3.2 시행
8.17.4 정상 조명전원이 차단될 경우에는 2 lx 이상의 조도로 1시간 동안 전원이 공급될 수 있는 자동 재충전 예비전원공급
장치가 있어야 하며, 이 조명은 정상 조명전원이 차단되면 자동으로 즉시 점등되어야 한다. 측정은 다음과 같은 곳에서 
이루어져야 한다.
 가) 호출버튼 및 비상통화장치 표시
 나) 램프중심부로부터 2m 떨어진 수직면상
14.2.3.2 이 장치는 8.17.4에서 요구된 비상 조명 전원공급 장치 또는 동등한 전원공급 장치로부터 전원이 공급되어야 한다.
 비고 일반전화 네트워크에 연결된 경우에는 14.2.3.2가 적용되지 않는다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', NULL, '2013-09-15', 'old', '3.1.6(13) 정전시에 램프중심부로부터 2m 떨어진 수직면상에서 측정하여 1Lux 이상의 조도를 확보할 수 있는 예비조명장치. 
다만, 자동차용 엘리베이터와 카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 아니하다.
4.1.2(11) 정전시에 램프중심부로부터 2m 떨어진 수직면상의 조도를 1Lux 이상으로 비출 수 있는 예비조명장치의 작동상태는 
양호하여야 한다. 다만, 자동차용 엘리베이터와 카 내에 조작반이 없는 화물용 엘리베이터의 경우에는 그러하지 아니하다. 
[승강기안전부품 안전기준 및 승강기 안전기준] 별표22
129 ❙
8.10.5 비상등의 조명에 사용되는 비상전원공급장치가 16.3에 따른 비상통화장치와 동시에
사용될 경우, 그 비상전원공급장치는 충분한 용량이 확보되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.17.5 8.17.4에서 기술된 예비전원이 14.2.3에서 규정된 비상통화장치를 작동하는데 또한 사용될 경우에는 충분한 전원용량을 
확보하여 동시에 작동될 수 있어야 한다.
14.2.3.2 이 장치는 8.17.4에서 요구된 비상 조명 전원공급 장치 또는 동등한 전원공급 장치로부터 전원이 공급되어야 한다.
 비고 일반전화 네트워크에 연결된 경우에는 14.2.3.2가 적용되지 않는다.
8.11 균형추 및 평형추
8.11.1 일반사항
  평형추의 사용은 13.2.1.1에 따른다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.18 균형추 및 평형추
평형추의 사용은 12.2.1에서 규정한다.
8.11.2 균형추 또는 평형추가 공간을 채우는 무게추를 포함한 경우, 무게추의 이탈을 막기 
위해 필요한 조치가 취해져야 한다. 
이러한 효과를 발휘하기 위해 무게추를 틀에 끼우고 견고하게 고정시켜야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2013-09-14', 'old', '8.18.1 균형추 또는 평형추 틀에 무게추가 채워지는 경우에는 무게추의 이동 또는 이탈을 방지하기 위해 다음과 같은 필요한 
조치가 이루어져야 한다.
 가) 틀에 무게추를 안전하게 고정하거나
 나) 무게추가 금속으로 만들어지고 엘리베이터의 정격속도가 1 ㎧ 이하인 경우에는 2개 이상의 고정봉을 사용하여 무게추
를 안전하게 고정한다.
8.11.3 균형추 또는 평형추에 고정된 풀리 또는 스프로킷은 9.7에 따라 보호되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.11.11', '2013-09-15', '2015-05-12', 'old', '8.18.2 균형추 또는 평형추에 풀리 또는 스프라켓이 있는 경우에는 9.7에 따라 보호되어야 한다.
9 매다는 장치(현수), 보상수단 및 관련 보호수단');
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
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('9.2.3.1', '2019-03-28', '2023-03-01', 'old', '');
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