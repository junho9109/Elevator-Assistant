-- 수동 입력 7.1.3, 7.1.4, 7.1.5


-- 7.1.3
DELETE FROM inspection_item_revisions WHERE item_id = '7.1.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.1.3', '2022-03-02', NULL, 'current', '7.1.3 승강장문 및 카문이 닫혔을 때, 필수적인 틈새를 제외하고 승장장 출입구 및 카 출입구를 완전히 닫아야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');


-- 7.1.4
DELETE FROM inspection_item_revisions WHERE item_id = '7.1.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.1.4', '2022-03-02', NULL, 'current', '7.1.4 승강장문 및 카문이 닫혀 있을 때, 문짝 간 틈새나 문짝과 문틀(측면) 또는 문턱 사이의 틈새는 6 ㎜ 이하이어야 하며, 관련 부품이 마모된 경우에는 10 ㎜까지 허용될 수 있다. 유리로 만든 문은 제외한다.[7.6.2.2.1자)3) 참조]
수직 개폐식 승강장문 및 카문의 경우에는 상기 틈새를 10 ㎜까지 허용될 수 있으며, 관련부품이 마모된 경우에는 14 ㎜까지 허용될 수 있다.
이 틈새는 움푹 들어간 부품이 있다면 그 부분의 안쪽을 측정한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.1.4', '2017-01-28', '2022-03-01', 'old', '7.1.2 승강장문이 닫혀 있을 때 문짝사이의 틈새 또는 문짝과 문설주, 인방 또는 문턱 사이의 틈새는 6 mm 이하로 가능한 작아야 한다. 다만, 마모될 경우에는 10 mm 까지 허용될 수 있다. 이 틈새는 움푹 들어간 부분이 있다면 그 부분의 안쪽을 측정한다.
수직 개폐식 승강장문인 경우에는 상기의 틈새 규정을 10 ㎜까지(마모된 경우에는 14 ㎜) 완화하여 적용할 수 있다.

8.6.3 카문이 닫혀 있을 때의 틈새는 다음과 같아야 한다.
8.6.3.1 카문이 닫혀 있을 때, 문짝사이의 틈새 또는 문짝과 문설주, 인방 또는 문턱 사이의 틈새는 6 ㎜ 이하로 가능한 작아야 한다. 다만, 마모될 경우에는 10 ㎜까지 허용될 수 있다. 이 틈새는 움푹 들어간 부분이 있다면 그 부분의 안쪽을 측정한다.
수직 개폐식 카문인 경우에는 상기의 틈새 규정을 10 ㎜까지(마모된 경우에는 14 ㎜) 완화하여 적용할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.1.4', '2015-05-13', '2017-01-27', 'old', '8.6.3 카문이 닫혀 있을 때, 문짝사이의 틈새 또는 문짝과 문설주, 인방 또는 문턱 사이의 틈새는 6 mm 이하로 가능한 작아야 한다. 다만, 마모될 경우에는 10 mm까지 허용될 수 있다. 이 틈새는 움푹 들어간 부분이 있다면 그 부분의 안쪽을 측정한다.
수직 개폐식 카문인 경우에는 상기의 틈새 규정을 10 ㎜까지(마모된 경우에는 14 ㎜) 완화하여 적용할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.1.4', '2013-09-15', '2015-05-12', 'old', '8.6.3 카문이 닫혀 있을 때, 문짝사이의 틈새 또는 문짝과 문설주, 인방 또는 문턱 사이의 틈새는 6 mm 이하로 가능한 작아야 한다. 다만, 마모될 경우에는 10 mm까지 허용될 수 있다. 이 틈새는 움푹 들어간 부분이 있다면 그 부분의 안쪽을 측정한다.
8.6.1의 단서조항에 따른 수직 개폐식 문은 제외한다.');


-- 7.1.5
DELETE FROM inspection_item_revisions WHERE item_id = '7.1.5' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.1.5', '2022-03-02', NULL, 'current', '7.1.5 경첩이 달린 카문에는 그 문이 카 외부로 열리는 것을 방지하기 위한 장치가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.1.5', '2013-09-15', '2022-03-01', 'old', '8.6.4 경첩이 달린 문에는 문이 카 외부로 열리는 것을 방지하는 걸리개 또는 정지시키는 장치가 있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.1.5', '2013-09-15', '2019-03-27', 'additional', '8.6.5 카가 승강장에 정지 상태로 있을 때 카문이 자동으로 열림 위치를 유지하고 있지 않을 경우, 승강장문에 전망창[7.6.2가)]이 있다면 카문에도 전망창이 있어야 한다.
이 전망창은 7.6.2가)의 규정을 만족하여야 하며 카가 승강장에 있을 때 승강장문의 전망창과 일치하도록 카문에 위치 되어야 한다.
<2019.3.28.삭제>');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.1.5', '2005-06-01', NULL, 'additional', '3.1.2(6) 카 및 승강장 문은 다음 각항의 기준에 적합하여야 한다.
② 승강장에서 카 안을 볼 수 있도록 하거나, 카의 도착 여부를 확인할 수 있도록 투명창을 설치하는 경우에는 다음 조건을 모두 만족하여야 한다. 다만, 전망을 목적으로 유효 출입구 면적의 50%이상을 투명창으로 하는 경우에는 3.1.3(2)의 단서 규정을 적용한다.
a) 투명창의 크기는 최대 폭은 100mm 이하, 최대 높이는 500mm 이하로 하여야 한다.
b) 투명창에 사용되는 유리는 한국산업규격의 강화유리ㆍ망입유리(공칭두께 6mm이상) 또는 접합유리(공칭두께 5mm이상)와 동등 이상의 것을 사용하여야 한다.');
