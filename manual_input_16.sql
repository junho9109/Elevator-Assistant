-- 수동 입력 6.5.4


-- 6.5.4
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.4', '2022-03-02', NULL, 'current', '6.5.4 승강로 하부에 위치한 공간의 보호
승강로 하부에 접근할 수 있는 공간이 있는 경우, 피트의 기초는 5,000 N/㎡ 이상의 부하가 걸리는 것으로 설계되어야 하고, 균형추 또는 평형추에 추락방지안전장치가 설치되어야 한다.
비고 1. 승강로 하부에 접근할 수 있는 공간이란 피트 바닥 직하부에 사람이 상주하는 공간 또는 상시 출입하는 통로나 공간을 말한다.
2. 엘리베이터 승강로는 사람이 접근할 수 있는 공간 위에 위치하지 않는 것이 바람직하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.4', '2015-05-13', '2022-03-01', 'old', '5.5 승강로 하부에 위치한 공간의 보호
승강로 하부에 접근할 수 있는 공간이 있는 경우, 피트의 기초는 5,000 N/㎡ 이상의 부하가 걸리는 것으로 설계되어야 하고, 균형추 또는 평형추에 비상정지장치가 설치되어야 한다.
비고 1. 접근할 수 있는 공간이란 피트바닥 직하부에 사람이 상주하는 공간 또는 상시 출입하는 통로 등을 말한다.
2. 엘리베이터 승강로는 사람이 접근할 수 있는 공간 위에 위치하지 않는 것이 바람직하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.4', '2013-09-15', '2015-05-12', 'old', '5.5 카, 균형추 또는 평형추 하부에 위치한 공간의 보호
카, 균형추 또는 평형추 하부에 접근할 수 있는 공간이 있는 경우, 피트의 기초는 5,000 N/㎡ 이상의 부하가 걸리는 것으로 설계되어야 하고, 다음 중 어느 하나에 적합하여야 한다.
가) 균형추 완충기 또는 평형추 주행구간 직하부에 견고한 벽이 단단한 지면까지 연장되도록 설치되어야 한다.
나) 균형추 또는 평형추에 비상정지장치가 설치되어야 한다.
비고 엘리베이터 승강로는 사람이 접근할 수 있는 공간 위에 위치하지 않는 것이 바람직하다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.4', '1997-08-18', '2013-09-14', 'old', '[로프식] 3.1.3(11) 피트 바닥하부는 거실 또는 여러사람이 출입하는 통로 등으로 사용하지 않아야 한다. 다만, 피트 바닥하부를 거실 또는 여러사람이 출입하는 통로 등으로 사용할 경우에는 피트 바닥을 2중슬라브로 하고, 균형추쪽에도 비상정지장치를 설치하거나 균형추쪽 직하부에 두꺼운 벽을 설치하여야 한다.
[유압식] 3.2.2(2) 피트 바닥하부는 거실 또는 여러사람이 출입하는 통로 등으로 사용하지 않아야 한다. 다만, 피트 바닥하부를 거실 등으로 사용할 경우에는 피트 바닥을 2중슬라브로 하여야 한다.');
