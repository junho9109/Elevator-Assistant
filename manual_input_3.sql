-- 수동 입력 6.1.9.1~6.2.3


-- 6.1.9.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.9.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.1', '2022-03-02', NULL, 'current', '6.1.9.1 기계실은 당해 건축물의 다른 부분과 내화구조 또는 방화구조로 구획하고, 기계실의 내장은 준불연재료 이상으로 마감되어야 한다. 다만, 기계실 벽면이 외기에 직접 접하는 등 관련 법령에 따른 건축물 구조상 내화구조 또는 방화구조로 구획할 필요가 없는 경우에는 불연재료를 사용하여 구획할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.1', '2013-09-15', '2022-03-01', 'old', '6.3.2.3 기계실은 당해 건축물의 다른 부분과 내화구조 또는 방화구조로 구획하고 기계실의 내장은 준불연재료 이상으로 마감 되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.1', NULL, '2013-09-14', 'old', '3.1.5(4) 기계실은 당해 건축물의 다른 부분과 내화구조 또는 방화구조로 구획하고, 기계실의 내장은 준불연재료 이상의 재료로 마감하여야 한다. [유압식] 4.2.1(1)① 기계실의 바닥·벽 및 천장은 내화구조 또는 방화구조로 양호하게 유지되어 있어야 한다.');

-- 6.1.9.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.9.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.2', '2022-03-02', NULL, 'current', '6.1.9.2 승강로, 기계실·기계류 공간 및 풀리실의 벽, 바닥 및 천장은 먼지가 발생되지 않고 내구성이 있는 재질(콘크리트, 벽돌 또는 블록 등)로 구획되어야 한다. 바닥은 업무 수행자 등 사람이 미끄러지지 않게 하는 재질로 마감되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.2', '2013-09-15', '2022-03-01', 'old', '6.3.2.1 기계실은 필요로 하는 하중 및 힘에 견디도록 시공되어야 하며 먼지 등이 발생되지 않는 내구성의 재질이어야 한다. 6.3.2.2 기계실 바닥은 콘크리트 또는 체크 플레이트 등의 미끄러지지 않은 재질로 마감되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.2', '1997-08-18', '2013-09-14', 'old', '3.1.1(3) 지지보는 철골조·철근콘크리트조 또는 철골철근콘크리트조로 하여야 한다. 4.1.1(2)② 제어반 기타의 제어장치의 설치상태는 견고하고, 지진 기타의 진동에 의해 움직이거나 넘어지지 않는 조치가 되어 있어야 한다. [유압식] 3.2.5(3) 기계실 바닥은 작동유가 침투하지 않도록 콘크리트·모르타르 등으로 시공하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.2', NULL, '1997-08-17', 'old', '3.1.1(3) 지지보는 철골조·철근콘크리트조 또는 철골철근콘크리트조로 하여야 한다. 4.1.1(2)② 제어반 기타의 제어장치의 설치상태는 견고하고, 지진 기타의 진동에 의해 움직이거나 넘어지지 않는 조치가 되어 있어야 한다.');

-- 6.1.9.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.9.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.3', '2022-03-02', NULL, 'current', '6.1.9.3 피트는 주행안내 레일 고정 장치, 완충기, 배전관 등의 설치완료 후에 물이 침투되지 않는 구조이어야 한다. 작업구역의 바닥은 완충기, 주행안내 레일 기초 및 배수 설비를 위한 부분을 제외하고 평탄해야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.3', '2013-09-15', '2022-03-01', 'old', '5.7.3.1 피트 바닥은 완충기, 가이드 레일 기초 및 배수장치를 위한 부분을 제외하고 매끄럽고 평탄하여야 한다. 가이드 레일 고정설비, 완충기, 시설망 등의 설치완료 후에는 피트에 물이 침투되지 않아야 하며 누수도 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.3', NULL, '2013-09-14', 'old', '4.1.4(1) 피트에 설치된 스위치류·인장장치류 및 완충기 등이 누수·습기 또는 먼지 등으로 기능을 상실하지 않도록 누수가 없이 청결하여야 하고, 화재의 위험이 없도록 유지되어야 한다.');

-- 6.1.9.4
DELETE FROM inspection_item_revisions WHERE item_id = '6.1.9.4' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.1.9.4', '2022-03-02', NULL, 'current', '6.1.9.4 유압식 엘리베이터의 경우, 파워 유니트가 있는 공간 및 피트는 해당 공간에 있는 설비의 모든 유체가 새거나 유출되어도 전 유량을 수용할 수 있도록 스며들지 않는 재질로 설치 및 마감되어야 한다. <2019년 3월 28일 이후 건축허가분부터 적용>');

-- 6.2.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.2.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.1', '2022-03-02', NULL, 'current', '6.2.1 승강로, 기계실·기계류 공간, 풀리실 및 관련 작업구역은 접근이 가능해야 한다. 카 내부를 제외하고 관계자만이 접근할 수 있게 해야 한다.');

-- 6.2.2
DELETE FROM inspection_item_revisions WHERE item_id = '6.2.2' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.2', '2022-03-02', NULL, 'current', '6.2.2 승강로, 기계실·기계류 공간, 풀리실의 출입문에 인접한 접근 통로는 50 lx 이상의 조도를 갖는 영구적으로 설치된 전기 조명에 의해 비춰야 한다.');

-- 6.2.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.2.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.3', '2022-03-02', NULL, 'current', '6.2.3 6.2.1에 기술된 구역의 접근통로는 개인적인 공간에 들어갈 필요 없이 어떠한 조건에서도 안전하게 이용되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.3', '2013-09-15', '2022-03-01', 'old', '6.2.1 구동기 공간 및 풀리 공간의 출입문에 인접한 출입 통로는 다음과 같아야 한다. 가) 영구적인 전기 조명장치에 의해 적절히 조명되어야 한다. 나) 개인적인 공간에 들어갈 필요 없이 어떠한 조건에서도 안전하게 이용되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.3', '2003-06-18', '2013-09-14', 'old', '3.1.5(9)① 복도 등 통로의 도중에 거실이 있거나 창고와 같이 화물을 쌓아 놓아서는 아니되며, 유지관리상 통행에 지장이 없도록 기계실 출입구의 폭과 높이에 해당하는 크기 이상의 통로를 확보하여야 한다. 4.1.1(1)⑤ 기계실로 가는 복도·계단 및 출입문 등은 유지관리상 지장이 없어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.3', '1997-08-18', '2003-06-17', 'old', '3.1.5(9)① 복도 등 통로의 도중에 거실이 있거나 창고와 같이 화물을 쌓아 놓아서는 아니 되며, 유지관리상 통행에 지장이 없도록 기계실 출입구의 폭과 높이에 해당하는 크기의 통로를 확보하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.2.3', NULL, '1997-08-17', 'old', '3.1.5(9) 기계실로 가는 복도, 계단, 출입문 등은 유지관리상 지장이 없어야 한다. 4.1.1(1)⑤ 기계실로 가는 복도·계단 및 출입문 등은 유지관리상 지장이 없어야 한다.');