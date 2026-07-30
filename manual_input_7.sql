-- 수동 입력 6.4.1


-- 6.4.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.4.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.1', '2022-03-02', NULL, 'current', '6.4.1 기계실·기계류 공간 및 풀리실의 출입문(승강장문 및 비상운전·작동시험을 위한 패널의 문은 제외) 외부에는 다음과 같은 경고문이 표기되어야 한다.
엘리베이터 기계실 – 위험
관계자 외 접근 금지');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.1', '2013-09-15', '2022-03-01', 'old', '15.4.1 구동기 공간 및 풀리 공간의 출입문(승강장문 및 비상운전 및 작동시험을 위한 패널의 문은 제외) 외부에는 “엘리베이터 구동기 - 위험, 관계자 외 접근금지” 와 같은 경고문이 표기되어야 한다. 트랩문의 경우에는 “추락 위험 - 문을 닫으시오” 와 같은 경고문이 보일 수 있도록 표기되어야 한다.
15.5.2 수동으로 개방되는 승강장문이 인접한 다른 문과 혼동될 경우는 승강장문에 “엘리베이터” 라는 글자가 표기되어야 한다.
15.4.8 기계실 내에는 “화기엄금” 표시가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.4.1', NULL, '2013-09-14', 'old', '4.2.1(1)③ 기계실 내에는 화기엄금 표시가 있어야 한다.');
