-- 수동 입력 7.5.3.5, 7.5.3.6, 7.5.3.7, 7.5.3.8, 7.5.3.9


-- 7.5.3.5
DELETE FROM inspection_item_revisions WHERE item_id = '7.5.3.5' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.3.5', '2022-03-02', NULL, 'current', '7.5.3.5 유리가 있는 문/문틀은 KS L 2004에 따른 접합유리가 사용되어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');


-- 7.5.3.6
DELETE FROM inspection_item_revisions WHERE item_id = '7.5.3.6' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.3.6', '2022-03-02', NULL, 'current', '7.5.3.6 문에 있는 유리의 고정설비는 유리가 내려앉거나 함몰되더라도 유리가 고정설비 밖으로 미끄러지지 않도록 보장되어야 한다.
<2013년 9월 15일 이후 건축허가분부터 적용>');


-- 7.5.3.7
DELETE FROM inspection_item_revisions WHERE item_id = '7.5.3.7' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.3.7', '2022-03-02', NULL, 'current', '7.5.3.7 유리판에는 다음과 같은 정보가 표시되어야 한다.
가) 판매자명 및 상표
나) 유리의 유형
다) 두께(예시: 8/8/0.76 ㎜)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.3.7', '2013-09-15', '2022-03-01', 'old', '7.2.3.5 유리판에는 다음과 같은 정보가 표시되어야 한다.
가) 공급자명 및 상표
나) 유리의 유형

8.6.7.4 유리판에는 다음과 같은 정보가 표시되어야 한다.
가) 공급자명 및 상표
나) 유리의 유형');


-- 7.5.3.8
DELETE FROM inspection_item_revisions WHERE item_id = '7.5.3.8' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.3.8', '2022-03-02', NULL, 'current', '7.5.3.8 수평 개폐식 승강장문 조립체 및 카문 조립체는 별표 9에 따라 안전성이 입증되어야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.3.8', '2013-09-15', '2022-03-01', 'old', '7.2.3.7 승강장문의 조립체는 450 J의 운동에너지(유효 출입구 면적의 50% 이상이 유리로 된 경우 308 J 적용)로 충격을 가했을 때 승강장문의 이탈 없이 견뎌야 한다. 다만, 수직개폐식 승강장문은 제외한다.
비고 1. 진자 충격시험은 부속서 Ⅴ 또는 KS B 8301을 참조한다.
    2. 시험 중이거나 시험이 끝난 후의 문은 안전성능에 영향을 받지 않아야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.3.8', '2008-09-10', '2013-09-14', 'old', '3.1.2(6) 카 및 승강장 문은 다음 각항의 기준에 적합하여야 한다.
④ 승강장문의 조립체는 KS B EN 81-1 부속서 J의 소프트 팬들럼 시험 방법에 따라 450J의 운동에너지로 충격을 가하였을 때 문의 이탈 없이 견딜 수 있어야 한다. 다만, 전망을 목적으로 유효 출입구 면적의 50%이상을 접합유리로 설치하는 경우 운동에너지를 308J로 적용할 수 있다. 현장시험이 불가한 경우에는 공인시험기관의 시험성적서, 승강기 검사기관의 안전성 평가 등으로 확인할 수 있다. 화물용은 제외한다.

4.1.3(18)
② 승강장문의 가이드슈는 3.1.2(6)④에 의한 충격시험시 확인된 깊이 이상 문턱에 맞물려야 한다. 화물용은 제외한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.3.8', '2003-06-18', '2008-09-09', 'old', '3.1.2(6) 카 내부치수 및 도어치수는 KS B ISO 4190-1 부속서에 따른다. 다만 카 내부치수는 KS B ISO 4190-1 부속서 또는 용도 및 적재하중을 고려한 최적 카 내부치수와 면적대비시 5% 이내의 증가는 허용할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.3.8', '1997-08-18', '2003-06-17', 'old', '3.1.2(6) 카 내부치수 및 도어치수는 KS B 6830(승용엘리베이터와 승강로의 치수)에 따른다. 다만 카 내부치수는 KS S 6830 또는 용도 및 적재하중을 고려한 최적 카 내부치수와 면적대비시 5% 이내의 증가는 허용할 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.3.8', NULL, '1997-08-17', 'old', '3.1.2(6) 카 내부의 치수 및 도어치수는 KS B 6830(승용엘리베이터와 승강로의 치수)에 따른다.”');


-- 7.5.3.9
DELETE FROM inspection_item_revisions WHERE item_id = '7.5.3.9' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('7.5.3.9', '2022-03-02', NULL, 'current', '7.5.3.9 수평 개폐식 승강장문 조립체 및 카문 조립체에는 보기 쉬운 곳에 쉽게 지워지지 않는 방법으로 별표 9에 따른 표시사항이 표시되어야 한다.
<2019년 3월 28일 이후 건축허가분부터 적용>');
