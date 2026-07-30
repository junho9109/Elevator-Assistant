-- 수동 입력 6.6.1


-- 6.6.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.1', '2022-03-02', NULL, 'current', '6.6.1 일반사항
점검 등 유지관리 업무 수행, 비상운전을 위한 공간 및 관련 작업구역은 환경적인 영향에 대하여 적절하게 보호되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.1', '2013-09-15', '2022-03-01', 'old', '6.1.1 구동기 및 풀리는 전용 공간에 설치되어야 한다. 이러한 공간 및 관련 작업구역은 접근이 가능하여야 한다. 이 공간의 출입 또는 접근은 권한이 부여된 사람(유지보수, 점검 및 구출)에게만 허용되어야 한다. 이 공간 및 관련 작업구역은 환경적인 영향을 고려하여 적절하게 보호되어야 하고, 유지보수, 점검 및 비상운전을 위해 적절한 공간이 확보되어야 한다.(부속서 Ⅹ 참조)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.1', '1997-08-18', '2013-09-14', 'old', '3.1.5(8) 기계실의 바로 위층 또는 인접한 벽면에 물탱크실이 있을 경우에는 물이 범람하는 경우에 대비하여 충분한 침수방지 조치를 하여야 한다.

[로프식]
3.1.5(2) 바닥면적은 승강로 수평투영면적의 2배 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 없는 경우에는 그러하지 아니하다.

[유압식]
3.2.5(4) 기름탱크 전용량의 작동유를 수용할 수 있도록 유압파워유니트의 주위에 기름방벽을 설치하거나 문턱을 높게 하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.1', NULL, '1997-08-17', 'old', '[로프식]
3.1.5(2) 바닥면적은 승강로 수평투영면적의 2배 이상으로 하여야 한다. 다만, 기기의 배치 및 관리에 지장이 없는 경우에는 그러하지 아니하다.');
