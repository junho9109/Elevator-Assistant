-- 수동 입력 7.7.2.1


-- 7.7.2.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.7.2.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.7.2.1', '2022-03-02', NULL, 'current', '7.7.2.1 수동 개폐식 승강장문의 경우, 카의 유무를 알 수 있도록 다음 수단 중 어느 하나에 해당되는 수단이 설치되어야 한다.
가) 다음 4가지 조건을 동시에 모두 만족하는 1개 이상의 투명 전망창
1) 7.5.3.4가)에 따른 진자충격시험 중 발생하는 유리의 파손 또는 손상이 7.5.3에 따른 기계적 강도에 대한 시험 실패로 간주되지 않으며, 유리판은 문에서 분리되지 않아야 한다.
2) KS L 2004에 적합한 접합유리, 두께는 3/3/0.76 ㎜ 이상이고, 유리판에는 다음과 같은 정보가 표시되어야 한다.
- 판매자명 및 상표
- 두께(3/3/0.76 ㎜ 등)
3) 승강장문 당 유리가 끼워진 면적 0.015 ㎡ 이상, 전망창 당 0.01 ㎡ 이상
4) 폭 60 ㎜ 이상 150 ㎜ 이하, 폭이 80 ㎜ 보다 넓은 전망창의 하부 모서리는 바닥면 위로 1 m 이상이어야 한다.
나) 카가 특정층에 정지하려는 시점 또는 정지하고 있는 경우에만 켜지는 해당층 승강장의 <<카 있음>> 신호 표시
이 신호는 카가 정지하고 문이 닫힌 상태일 때는 꺼져 있을 수 있으나, 정지된 승강장의 호출 버튼이 작동되면 켜져야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.7.2.1', '2013-09-15', '2022-03-01', 'old', '7.6.2 << 카 있음 >> 신호표시
수동 개폐식 승강장문의 경우, 이용자가 문을 열기 전에 카의 유무를 확인할 수 있도록 다음 중 어느 하나가 설치되어야 한다.
가) 다음 4가지 사항을 동시에 만족하는 1개 이상의 투명 전망창
1) 7.2.3.1에서 규정된 것과 같은 기계적 강도
2) 두께 6 mm 이상
3) 전망창 면적은 0.01 ㎡ 이상, 승강장문의 유리가 끼워진 면적은 0.015 ㎡ 이상
4) 폭은 60 mm 이상 150 mm 이하
80 mm보다 넓은 전망창의 하부 모서리는 바닥면에서 1 m 이상 위에 있어야 한다.
나) 카가 정지하려는 시점 또는 특정 층에 정지되었을 때에만 켜지는 <<카 있음>> 신호표시
이 신호표시는 카가 그 층에 정지하고 있는 동안 계속 켜져 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.7.2.1', '2005-06-01', '2013-09-14', 'old', '3.1.2(6) 카 및 승강장 문은 다음 각항의 기준에 적합하여야 한다.
② 승강장에서 카 안을 볼 수 있도록 하거나, 카의 도착 여부를 확인할 수 있도록 투명창을 설치하는 경우에는 다음 조건을 모두 만족하여야 한다. 다만, 전망을 목적으로 유효 출입구 면적의 50%이상을 투명창으로 하는 경우에는 3.1.3(2)의 단서 규정을 적용한다.
a) 투명창의 크기는 최대 폭은 100mm 이하, 최대 높이는 500mm 이하로 하여야 한다.
b) 투명창에 사용되는 유리는 한국산업규격의 강화유리ㆍ망입유리(공칭두께 6mm이상) 또는 접합유리(공칭두께 5mm이상)와 동등 이상의 것을 사용하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.7.2.1', '2003-06-18', '2005-05-31', 'old', '3.1.2(6) 카 내부치수 및 도어치수는 KS B ISO 4190-1 부속서에 따른다. 다만 카 내부치수는 KS B ISO 4190-1 부속서 또는 용도 및 적재하중을 고려한 최적 카 내부치수와 면적대비시 5% 이내의 증가는 허용할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.7.2.1', '1997-08-18', '2003-06-17', 'old', '3.1.2(6) 카 내부치수 및 도어치수는 KS B 6830(승용엘리베이터와 승강로의 치수)에 따른다. 다만 카 내부치수는 KS S 6830 또는 용도 및 적재하중을 고려한 최적 카 내부치수와 면적대비시 5% 이내의 증가는 허용할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.7.2.1', NULL, '1997-08-17', 'old', '3.1.2(6) 카 내부의 치수 및 도어치수는 KS B 6830(승용엘리베이터와 승강로의 치수)에 따른다.');
