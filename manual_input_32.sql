-- 수동 입력 6.6.2.3


-- 6.6.2.3
DELETE FROM inspection_item_revisions WHERE item_id = '6.6.2.3' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.2.3', '2022-03-02', NULL, 'current', '6.6.2.3 기계실(6.6.3), 기계류 공간(6.6.5.1) 또는 비상운전 및 작동시험을 위한 패널(6.6.6)에는 엘리베이터의 갑작스런 고장발생 시 그 고장처리에 관한 설명서가 있어야 한다.
특히, 승객 구출운전을 위한 장치 및 승장장문의 비상잠금해제 삼각열쇠의 조작방법·절차 등 구체적인 사용 설명서가 포함되어야 한다.
비고 승객 구출을 위한 설명서에는 다음의 사항을 참조한다.
특수공구의 사용위치, 비상잠금해제 장치에 주의표시 부착, 권한이 부여된 작업 및 구조 작업을 위한 세부지침(브레이크, 상승과속방지수단, 문열림출발방지수단, 밸브파손, 안전장치 등의 해제)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.6.2.3', '2013-09-15', '2022-03-01', 'old', '15.4.3 기계실(6.3), 구동기 캐비닛(6.5.2) 또는 비상운전 및 작동시험을 위한 패널(6.6)에는 엘리베이터의 고장이 발생할 경우 따라야 할 지침. 특히 수동ㆍ전기적 비상운전에 대한 장치 및 승강장문에 대한 비상 열쇠의 사용에 관한 상세한 지침이 있어야 한다.');
