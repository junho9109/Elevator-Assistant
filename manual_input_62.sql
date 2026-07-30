-- 수동 입력 7.6.2.2.2, 7.6.2.3


-- 7.6.2.2.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.6.2.2.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2.2.2', '2022-03-02', NULL, 'current', '7.6.2.2.2 반자동 동력 작동식 문
버튼을 지속적으로 누르고 있거나 이와 유사한 방법(hold-to-run control)으로 이용자의 지속적인 관리 아래에서 문이 닫히는 경우, 7.6.2.2.1가)에 따라 계산되거나 측정된 운동에너지가 10 J을 초과할 때 가장 빠른 문짝의 평균 닫힘 속도는 0.3 ㎧로 제한되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2.2.2', '2015-05-13', '2022-03-01', 'old', '7.5.2.1.2 반자동 동력 작동식 문
버튼을 지속적으로 누르고 있거나 이와 유사한 방법(hold-to-run control)으로 사용자의 지속적인 관리 하에 문이 닫히는 경우, 7.5.2.1.1.2에서 기술된 것과 같이 계산되거나 측정된 운동에너지가 10 J를 초과할 때 가장 빠른 문짝의 평균 닫힘 속도는 0.3 ㎧까지 제한되어야 한다.

8.7.2.1.2 반자동 동력 작동식 문
버튼을 지속적으로 누르고 있거나 이와 유사한 방법(hold-to-run control)으로 사용자의 지속적인 관리 하에 문이 닫히는 경우, 7.5.2.1.1.2에서 기술된 것과 같이 계산되거나 측정된 운동에너지가 10 J를 초과할 때 가장 빠른 문짝의 평균 닫힘 속도는 0.3 ㎧로 제한되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2.2.2', '2013-09-15', '2015-05-12', 'old', '7.5.2.1.2(8.7.2.1.2) 반자동 동력 작동식 문
버튼을 지속적으로 누르고 있거나 이와 유사한 방법(hold-to-run control)으로 사용자의 지속적인 관리 하에 문이 닫히는 경우, 7.5.2.1.1.2에서 기술된 것과 같이 계산되거나 측정된 운동에너지가 10 J를 초과할 때 가장 빠른 문짝의 평균 닫힘 속도는 0.3 ㎧로 제한되어야 한다.');


-- 7.6.2.3
DELETE FROM inspection_item_revisions WHERE item_id = '7.6.2.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2.3', '2022-03-02', NULL, 'current', '7.6.2.3 수직 개폐식 문
수직 개폐식 문은 화물용 엘리베이터와 자동차용 엘리베이터에만 사용되어야 한다. 동력 닫힘은 다음 조건을 만족하는 경우에만 사용되어야 한다.
가) 문짝의 평균 닫힘 속도는 0.3 ㎧ 이하이어야 한다.
나) 카문은 7.1.2에 따른 구조이어야 한다.
다) 문닫힘안전장치는 문이 닫히는 동안 문 앞(승강장문의 경우에는 승강장문 측, 카문의 경우에는 카 내부 측)의 일정한 거리에서 움직이는 사람이나 물체를 감지하면 자동으로 문을 다시 열리기 시작해야한다.
라) 7.6.2.2.2에 따른 반자동 동력 작동식 문의 경우, 카문은 승강장문이 닫히기 시작하기 전에 2/3 이상 닫혀야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2.3', '2015-05-13', '2022-03-01', 'old', '7.5.2.2(8.7.2.2) 수직 개폐식 문
수직 개폐식 문은 화물용에만 적용되어야 한다. 동력 닫힘은 다음 3가지 사항을 동시에 만족하는 경우에만 이루어져야 한다.
가) 문짝의 평균 닫힘 속도는 0.3 ㎧까지 제한되어야 한다.
나) 카문은 8.6.1에 규정된 것과 같은 구조이어야 한다.
다) 문이 닫히는 동안 사람이나 물건이 끼이거나 끼려고 할 때 자동으로 문이 반전되어 열리는 문닫힘안전장치가 있어야 한다. 다만, 반자동 동력 작동식 문인 경우에는 제외한다.
비고 문닫힘안전장치로 센서가 사용될 경우에는 카 내부와 승강장에 각각 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2.3', '2013-09-15', '2015-05-12', 'old', '7.5.2.2(8.7.2.2) 수직 개폐식 문
이 형식의 개폐문은 화물용에만 적용되어야 한다. 동력 닫힘은 다음 2가지 사항을 동시에 만족하는 경우에만 이루어져야 한다.
가) 문짝의 평균 닫힘 속도는 0.3 ㎧로 제한되어야 한다.
나) 카문은 8.6.1에 규정된 것과 같은 구조이어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2.3', '2005-06-01', '2013-09-14', 'old', '3.1.2(6) 카 및 승강장 문은 다음 각항의 기준에 적합하여야 한다.
③ 수직개폐방식의 문은 승객용 엘리베이터에는 사용되지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2.3', '2003-06-18', '2005-05-31', 'old', '3.1.2(6) 카 내부치수 및 도어치수는 KS B ISO 4190-1 부속서에 따른다. 다만 카 내부치수는 KS B ISO 4190-1 부속서 또는 용도 및 적재하중을 고려한 최적 카 내부치수와 면적대비시 5% 이내의 증가는 허용할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2.3', '1997-08-18', '2003-06-17', 'old', '3.1.2(6) 카 내부치수 및 도어치수는 KS B 6830(승용엘리베이터와 승강로의 치수)에 따른다. 다만 카 내부치수는 KS S 6830 또는 용도 및 적재하중을 고려한 최적 카 내부치수와 면적대비시 5% 이내의 증가는 허용할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.6.2.3', NULL, '1997-08-17', 'old', '3.1.2(6) 카 내부의 치수 및 도어치수는 KS B 6830(승용엘리베이터와 승강로의 치수)에 따른다.');
