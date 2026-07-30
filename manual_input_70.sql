-- 수동 입력 7.9.1.5 ~ 7.9.1.13, 7.9.2 (신규 제목), 7.9.2.1 ~ 7.9.2.3


-- 7.9.1.5
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.1.5' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.5', '2022-03-02', NULL, 'current', '7.9.1.5 잠금 부품 및 그 부품의 고정 장치는 충격에 강해야 하며, 환경 조건 아래에서 설계된 수명 동안 강도 특성을 유지하는 내구성 재질로 만들어 져야 한다.
비고 충격에 관한 기준은 별표 11에서 확인할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.5', '2013-09-15', '2022-03-01', 'old', '7.7.3.1.4 잠금 부품 및 잠금 부품의 고정설비는 충격에 견딜 수 있어야 하며 금속 또는 강화금속이어야 한다.');


-- 7.9.1.6
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.1.6' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.6', '2022-03-02', NULL, 'current', '7.9.1.6 잠금 부품의 결합은 문이 열리는 방향으로 300 N의 힘을 가할 때 잠금 효과를 감소시키지 않는 방식으로 이루어져야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.6', '2013-09-15', '2022-03-01', 'old', '7.7.3.1.5 잠금 부품은 문이 열리는 방향으로 300 N의 힘을 가할 때 잠금 효력이 감소되지 않는 방법으로 물려야 한다.');


-- 7.9.1.7
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.1.7' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.7', '2022-03-02', NULL, 'current', '7.9.1.7 승강장문 잠금장치는 잠겨있는 승강장에서 문이 열리는 방향으로 다음과 같은 힘을 가할 때 별표 11의 출입문 잠금장치 시험과정에서 안전에 악영향을 미칠 수 있는 영구적인 변형이나 파손 없이 견뎌야 한다.
가) 개폐식 문: 1,000 N
나) 경첩이 달린 문(잠금 핀): 3,000 N');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.7', '2013-09-15', '2022-03-01', 'old', '7.7.3.1.6 잠금장치는 문이 열리는 방향으로 다음과 같은 힘을 가할 때 영구변형 없이 견뎌야 한다.
가) 수직 수평 개폐식 문 : 1,000 N
나) 경첩이 있는 문 : 3,000 N');


-- 7.9.1.8
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.1.8' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.8', '2022-03-02', NULL, 'current', '7.9.1.8 잠금 작용은 중력, 영구자석 또는 스프링에 의해 이루어지고 유지되어야 한다.
스프링은 압축에 의해 작동 및 안내되고, 잠금해제 시 코일이 단단하게 압축되지 않을 크기이어야 한다.
영구자석 또는 스프링이 그 기능을 더 이상 발휘할 수 없을 경우, 중력에 의해 잠금이 풀리지 않아야 한다.
잠금부품이 영구자석의 작용에 의해 위치를 유지하는 경우, 간단한 수단(열 또는 충격 등)에 의해 무효화되는 것은 가능하지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.8', '2013-09-15', '2022-03-01', 'old', '7.7.3.1.7 잠금 작용은 중력, 영구자석 또는 스프링에 의해 이루어지고 유지되어야 한다. 스프링은 압축에 의해 작용하고, 잠금을 해제하는 순간에 코일은 단단히 압축되지 않는 것으로 안내되어야 하며 그러한 치수이어야 한다.
영구 자석 또는 스프링이 그 기능을 더 이상 발휘할 수 없는 경우에는 중력이 잠금 해제의 원인이 되어서는 안 된다.
잠금 부품이 영구 자석의 작용에 의해 위치를 유지하는 경우에는 간단한 방법(열 또는 충격 등)에 의해 무효화되는 것은 불가능하여야 한다.');


-- 7.9.1.9
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.1.9' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.9', '2022-03-02', NULL, 'current', '7.9.1.9 승강장문 잠금장치는 적절한 기능을 방해할 수 있는 먼지 쌓임에 따른 위험에 대하여 보호되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.9', '2013-09-15', '2022-03-01', 'old', '7.7.3.1.8 잠금장치는 적절한 기능을 방해할 수 있는 먼지 축적에 의한 위험에 대하여 보호되어야 한다.');


-- 7.9.1.10
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.1.10' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.10', '2022-03-02', NULL, 'current', '7.9.1.10 작동하고 있는 부품에 대한 점검은 투명한 덮개 사용 등에 의해 쉽게 수행되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.10', '2013-09-15', '2022-03-01', 'old', '7.7.3.1.9 동작하는 부품의 유지보수 및 점검은 쉬워야 한다.(투명한 패널 사용 등)');


-- 7.9.1.11
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.1.11' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.11', '2022-03-02', NULL, 'current', '7.9.1.11 승강장문 잠금장치의 접점이 박스 내에 있는 경우, 덮개를 고정시키는 나사는 구속형으로 덮개를 열 때 덮개 또는 박스의 구멍에 나사가 남아있어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.11', '2013-09-15', '2022-03-01', 'old', '7.7.3.1.10 잠금 스위치 접점이 박스 내에 있는 경우, 덮개의 고정나사는 구속형으로 덮개를 열 때 덮개 또는 박스의 구멍에 나사가 남아 있어야 한다.');


-- 7.9.1.12
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.1.12' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.12', '2019-03-28', NULL, 'current', '7.9.1.12 승강장문 잠금장치는 별표 11에 따라 안전성이 입증되어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');


-- 7.9.1.13
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.1.13' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.13', '2022-03-02', NULL, 'current', '7.9.1.13 승강장문 잠금장치에는 보기 쉬운 곳에 쉽게 지워지지 않는 방법으로 별표 11에 따른 표시사항이 표시되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.1.13', '2013-09-15', '2022-03-01', 'old', '15.13 잠금장치
잠금장치에는 다음과 같은 사항이 표시된 명판이 부착되어야 한다.
가) 제조업체명
나) 안전인증 표시');


-- 7.9.2 (신규 제목)
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.2', '2022-03-02', NULL, 'current', '7.9.2 카문 잠금장치');


-- 7.9.2.1
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.2.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.2.1', '2019-03-28', NULL, 'current', '7.9.2.1 카문의 잠금이 필요한 경우[6.5.3.1다) 참조], 카문 잠금장치는 7.9.1에 따른 승강장문 잠금장치에 관한 기준에 적합하도록 설계되어야 한다.
카문 잠금장치는 고의적인 오용에 대해 보호되어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');


-- 7.9.2.2
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.2.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.2.2', '2019-03-28', NULL, 'current', '7.9.2.2 카문 잠금장치는 별표 11에 따라 안전성이 입증되어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');


-- 7.9.2.3
DELETE FROM inspection_item_revisions WHERE item_id = '7.9.2.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.9.2.3', '2019-03-28', NULL, 'current', '7.9.2.3 카문 잠금장치에는 보기 쉬운 곳에 쉽게 지워지지 않는 방법으로 별표 11에 따른 표시사항이 표시되어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');
