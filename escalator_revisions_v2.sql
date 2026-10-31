-- 에스컬레이터 연혁집 v2.0 → inspection_item_revisions (equipment_type='에스컬레이터')
-- 1) 먼저 백업:  \copy (SELECT * FROM public.inspection_item_revisions) TO 'backup_revisions_20261019.csv' CSV HEADER
-- 2) 기존 에스컬레이터 연혁 확인: SELECT item_id,introduction_type,effective_date,expiry_date FROM public.inspection_item_revisions WHERE equipment_type='에스컬레이터' ORDER BY 1;
-- 중복 방지: 같은 (item_id, equipment_type, introduction_type, effective_date, expiry_date)가 있으면 건너뜀
BEGIN;
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '1','에스컬레이터','2013-09-15','2022-03-01','old','1. 적용 범위
 일정한 통로에 승객을 수송하기 위해 설치되는 경사지게 연속으로 움직이는 계단형 에스컬레이터와 평행하게 연속으로 움직이는
 표면형 무빙워크의 구조 및「승강기시설 안전관리법」제13조제1항에 따른 검사의 판정기준에 적용한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '1','에스컬레이터','2022-03-02',NULL,'current','1 적용 범위
 이 기준은 일정한 통로에 승객을 수송하기 위해 설치되는 에스컬레이터 및 무빙워크에
 대해 적용한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '2','에스컬레이터','2013-09-15','2022-03-01','old','2. 인용규격
 이 기준에서 인용한 규격은 그 최신판을 적용한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '2','에스컬레이터','2022-03-02',NULL,'current','2 인용 표준
 이 기준에서 인용하는 표준은 그 최신판을 적용한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.1','에스컬레이터','2013-09-15','2022-03-01','old','3.1 경사각(angle of inclination)
 스텝, 팔레트 또는 벨트 동선의 수평에 대한 최대 각도' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.1','에스컬레이터','2022-03-02',NULL,'current','3.1.1 경사도(angle of inclination)
 디딤판 움직임의 수평에 대한 최대 각도' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.2','에스컬레이터','2013-09-15','2022-03-01','old','3.16 이중안전회로(fail safe circuit)
 고장 모드 반응으로 규정된 전기적 또는 전자적 시스템과 관계된 안전' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.2','에스컬레이터','2022-03-02',NULL,'current','3.1.2 고장안전회로(failsafe circuit)
 규정된 고장 모드 동작을 갖는 전기적 또는 전자적 시스템과 연계된 안전회로' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.3','에스컬레이터','2013-09-15','2022-03-01','old','3.2 공칭속도(nominal speed)
 에스컬레이터 또는 무빙워크의 설계된 것처럼 제조업체에 의해 설명된 무부하 조건에서 장치를 운전할 때 스텝, 팔레트 또는
 벨트의 움직이는 방향에서의 속도
 비고 정격속도는 정격하중 조건하에 에스컬레이터/무빙워크가 움직이는 속도이다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.3','에스컬레이터','2022-03-02',NULL,'current','3.1.3 공칭속도(nominal speed)
 공칭주파수, 공칭전압 및 무부하 상태에서 제조사가 제시한 디딤판의 움직이는 방향의 속도
 비고 정격속도는 정격하중 조건하에 에스컬레이터/무빙워크가 움직이는 속도이다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.4','에스컬레이터','2013-09-15','2022-03-01','old','3.19 정격하중(rated road)
 움직이도록 설계된 장치의 하중(최대용량은 부속서 Ⅳ 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.4' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.4','에스컬레이터','2022-03-02',NULL,'current','3.1.4 구조의 정격 하중(structural rated load)
 구조(물)의 설계 하중' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.4' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.5','에스컬레이터','2013-09-15','2022-03-01','old','3.3 구동기(machinery)
 에스컬레이터 또는 무빙워크의 구동기 및 구동기 관련 설비' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.5' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.5','에스컬레이터','2022-03-02',NULL,'current','3.1.5 기계류(machinery)
 에스컬레이터 또는 무빙워크 기계 장치 및 관련 장비' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.5' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.6','에스컬레이터','2013-09-15','2022-03-01','old','3.4 구동기 공간(machinery space)
 구동기의 전체 또는 일부분이 놓여있는 트러스 내‧외부 공간' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.6' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.6','에스컬레이터','2022-03-02',NULL,'current','3.1.6 기계류 공간(machinery spaces)
 기계류가 전체 또는 부분적으로 배치되는 트러스 내부 혹은 외부 공간' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.6' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.7','에스컬레이터','2013-09-15','2022-03-01','old','3.5 난간(balustrade)
 움직이는 부품으로부터 보호하고 핸드레일을 지지하며 안전을 제공함으로써 이용자의 안전을 보장하는 에스컬레이터 또는
 무빙워크의 부품' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.7' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.7','에스컬레이터','2022-03-02',NULL,'current','3.1.7 난간(balustrade)
 움직이는 부분으로부터 보호 및 손잡이 지지로 안정성을 제공함으로써 이용자의 안전을
 보장하는 에스컬레이터/무빙워크의 부품' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.7' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.8','에스컬레이터','2013-09-15','2022-03-01','old','3.6 난간데크(balustrade decking)
 핸드레일 가이드 측면과 만나고 난간의 상부 커버를 형성하는 난간의 가로 요소' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.8' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.8','에스컬레이터','2022-03-02',NULL,'current','3.1.8 난간데크(balustrade decking)
 손잡이 주행안내 부재와 만나고 난간의 상부 덮개를 형성하는 난간의 가로 요소' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.8' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.9','에스컬레이터','2013-09-15','2022-03-01','old','3.7 내부패널(interior panel)
 스커트 또는 하부 내측 데크와 핸드레일 가이드 측면 또는 난간 데크 사이에 위치한 패널



                                      [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.9' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.9','에스컬레이터','2022-03-02',NULL,'current','3.1.9 내부패널(interior panel)
 스커트 또는 하부 내측데크와 손잡이 가이드 또는 난간 데크 사이에 위치한 패널' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.9' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.10','에스컬레이터','2013-09-15','2022-03-01','old','3.9 뉴얼(newel)
 난간의 끝' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.10' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.10','에스컬레이터','2022-03-02',NULL,'current','3.1.10 뉴얼(newel)
  난간의 끝부분으로 콤 교차선부터 손잡이 곡선 반환부까지의 난간 구역' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.10' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.12','에스컬레이터','2013-09-15','2022-03-01','old','3.12 스커트(skirting)
 스텝, 팔레트 또는 벨트와 연결되는 난간의 수직 부분' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.12' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.12','에스컬레이터','2022-03-02',NULL,'current','3.1.12 스커트(skirting)
  디딤판과 연결되는 난간의 수직 부분' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.12' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.16','에스컬레이터','2013-09-15','2022-03-01','old','3.17 전기 안전시스템(electrical safety system)
 안전회로 및 모니터링장치의 배열로 전기제어시스템의 안전관련 부분' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.16' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.16','에스컬레이터','2022-03-02',NULL,'current','3.1.16 안전 시스템(safety system)
  안전회로 및 감시장치의 배열로 전기제어시스템의 안전관련 부분' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.16' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.17','에스컬레이터','2013-09-15','2022-03-01','old','3.18 전기 안전장치(electrical safety devices)
 안전스위치 그리고/또는 (고장에 대비한)비상안전장치로 구성된 안전회로의 부분' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.17' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.17','에스컬레이터','2022-03-02',NULL,'current','3.1.17 안전장치(safety devices)
 안전기능을 수행하기 위해 사용되는 안전스위치 및/또는 고장안전회로 및/또는 전기,
 전자 및 프로그램 가능한 전자장치(E/E/PE)로 구성된 안전회로의 일부' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.17' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.18','에스컬레이터','2013-09-15','2022-03-01','old','3.14 안전회로(safety circuit)
 전기안전장치로 구성된 전기적인 안전시스템의 부분' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.18' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.18','에스컬레이터','2022-03-02',NULL,'current','3.1.18 안전회로(safety circuit)
 전기안전장치로 구성된 전기적인 안전시스템의 일부' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.18' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.23','에스컬레이터','2013-09-15','2022-03-01','old','3.11 브레이크 하중(brake load)
 에스컬레이터 또는 무빙워크를 정지시키기 위해 설계된 브레이크 시스템의 스텝ㆍ팔레트ㆍ벨트의 하중




                                 [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.23' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.23','에스컬레이터','2022-03-02',NULL,'current','3.1.23 제동부하(brake load)
 에스컬레이터/무빙워크를 정지시키기 위해 설계된 브레이크 시스템의 디딤판에 가해지
 는 하중' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.23' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.24','에스컬레이터','2013-09-15','2022-03-01','old','3.20 최대용량(maximum capacity)
 운전 조건아래 운송할 수 있는 사람의 최대 유동량' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.24' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.24','에스컬레이터','2022-03-02',NULL,'current','3.1.24 최대 수송능력(maximum capacity)
 운전 조건아래 운송할 수 있는 사람의 최대 인원수' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.24' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.25','에스컬레이터','2013-09-15','2022-03-01','old','3.8 높이(rise)
 상부와 하부 끝단의 바닥면 사이의 수직 거리' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.25' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.25','에스컬레이터','2022-03-02',NULL,'current','3.1.25 층고(rise)
 상부 바닥마감면과 하부 바닥마감면사이의 수직거리' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.25' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.26','에스컬레이터','2013-09-15','2022-03-01','old','3.21 콤(comb)
 홈에 맞물리는 각 승강장의 갈래진 부분' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.26' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.26','에스컬레이터','2022-03-02',NULL,'current','3.1.26 콤(comb)
 홈에 맞물리는 각 승강장의 갈라진 부분' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.26' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.28','에스컬레이터','2013-09-15','2022-03-01','old','3.24 하부 내측 데크(lower inner decking)
 내부패널과 스커트가 공통 지점에 맞닿지 않을 때 내부패널의 스커트와 연결된 측면' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.28' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.28','에스컬레이터','2022-03-02',NULL,'current','3.1.28 하부 내측데크(lower inner decking)
 내부패널과 스커트가 맞닿지 않을 때 내부패널과 스커트를 연결하는 부재' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.28' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.29','에스컬레이터','2013-09-15','2022-03-01','old','3.25 하부 외측 데크(lower outer decking)
 내부패널과 함께 외부패널에 연결된 측면' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.29' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.29','에스컬레이터','2022-03-02',NULL,'current','3.1.29 하부 외측데크(lower outer decking)
 내부패널과 외부패널을 연결하는 부재' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.29' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.30','에스컬레이터','2013-09-15','2022-03-01','old','     3.23 핸드레일(handrail)
      사람이 에스컬레이터 또는 무빙워크를 이용하는 동안 잡고타기 위한 동력-기동의 움직이는 레일








<추가 종전 기준>----------------------------------------------' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.30' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '3.1.30','에스컬레이터','2022-03-02',NULL,'current','3.1.30 손잡이(handrail)
 에스컬레이터 또는 무빙워크를 사용하는 동안 손으로 잡을 수 있는 전동식 이동 레일' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='3.1.30' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '4.1','에스컬레이터','2013-09-15','2022-03-01','old','4.1 단위
단위는 국제단위(SI 단위)를 사용한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='4.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '4.1','에스컬레이터','2022-03-02',NULL,'current','4.1 단위
  단위는 국제단위계(SI)를 사용하는 것을 원칙으로 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='4.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '4.2','에스컬레이터','2013-09-15','2022-03-01','old','4.2 기호
기호는 사용된 공식과의 관계를 설명한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='4.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '4.2','에스컬레이터','2022-03-02',NULL,'current',' 4.2 기호
   이 기준에는 다음 기호들과 표 1에 따른 해당 측정 단위들이 사용된다.

                                 [표 1. 이 기준에서 사용된 기호 및 해당 측정 단위]

      기호           설명                                                 단위    그림

       b1          손잡이 중심선 사이의 거리                                     m      6

       b2          손잡이 폭                                              ㎜      6

       b3          스커트와 내부패널 사이의 수평 거리                                ㎜      6

       b4          내부패널에 직접 연결된 하부 내측데크 수평 부분의 폭                      ㎜      6

       b5          손잡이의 내부 끝과 내부패널의 상부 끝 사이의 수평 거리                    ㎜      6

  b6’, b6” 손잡이 외형과 주행안내 또는 덮개 외형 사이의 수평 거리                            ㎜      6

       b7          홈의 폭                                               ㎜      5

       b8          웹의 폭                                               ㎜      5

                   손잡이의 외부 끝과 비연속적인 장애물(지붕 교차점, 기둥 등) 사이
       b9                                                             ㎜     Ⅰ.1
                   의 수평 거리

      b10          손잡이의 외부 끝과 연속적인 장애물(벽 사이의 수평 거리 등)                 ㎜    7, Ⅰ.1

      b11          근접한 에스컬레이터/무빙워크 손잡이 사이의 수평 거리                      ㎜     Ⅰ.1

      b12          손잡이의 하부 끝과 난간데크 사이의 수직 거리                          ㎜      6

      b13          하부 외측데크의 폭                                         ㎜      7

                   근접한 에스컬레이터 또는 무빙워크의 내부패널의 외부 끝 사이의
      b14                                                             ㎜      7
                   수평 거리

      b15          건축 구조물(벽)과 손잡이 중심선 사이의 수평 거리                       ㎜      7


                                 [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




b16   근접한 에스컬레이터/무빙워크 손잡이 중심선 사이의 수평 거리             ㎜      7

b17   손잡이 외부 끝과 미끄럼 방지장치 사이의 수평 거리                  ㎜      7

      손잡이의 하부 끝과 손잡이 스탠드가 난간에 연결된 지점 사이의
b18                                                 ㎜      6
      수직 거리

      손잡이 상부와 스텝 앞부분 또는 팔레트 또는 벨트 표면 사이의
h1                                                  m     5, 6
      수직 거리

      스커트의 상부 끝 또는 덮개 연결부 하부 끝과 스텝 앞부분 또는
h2                                                  m      6
      팔레트 또는 벨트의 트레드 표면 사이의 수직 거리

h3    뉴얼로 들어가는 손잡이 입구와 바닥 사이의 거리                    m     5, 6

      뉴얼의 끝 부분을 포함한 양쪽 손잡이의 바깥 끝부분 및 자유공간
h4                                                  m    5, Ⅰ.1
      모든 지점에 걸친 스텝 표면, 팔레트 또는 벨트로부터의 자유 높이

h5    삼각부 막는조치의 높이                                  m     5, 7

h6    트레드 표면의 상부 끝과 콤의 빗살 사이의 틈새                    ㎜      5

h7    홈의 깊이                                         ㎜      5

h8    트레드 홈으로 들어가는 콤의 빗살의 맞물림 깊이                    ㎜      5

h9    바닥과 기어오름 방지장치 하부 끝 사이의 수직 거리                  ㎜      7

h10   손잡이 하부 끝과 접근방지장치의 상부 끝 사이의 수직 거리              ㎜      7

h11   기어오름 방지장치의 높이                                 ㎜      7

h12   손잡이 외부 자유공간 상부 끝의 높이                          ㎜     Ⅰ.1

h13   상부와 하부의 마감된 바닥 사이의 수직 거리                      m      5

L1    콤의 빗살의 밑바닥                                    －      5

    지지대 사이의 수평 거리                                 m      5

L2    콤 교차선                                         －      5

      손잡이에 의해 도달하는 가장 먼 지점과 트레드 표면에서 평행으로
                                                  m      5
      측정된 콤 교차선 사이의 거리

    콤 교차선으로부터 측정된 승강장 방향으로 손잡이 직선부의 길이            m      5

      손잡이에 의해 도달하는 가장 먼 지점과 트레드 표면에서 평행으로
                                                  m      5
      측정된 뉴얼로 진입하는 지점 사이의 거리

    하부 외측데크에 있는 기어오름 방지장치의 길이                     ㎜      7

     공칭속도                                          ㎧      －

    스텝 높이                                         m      8







                 스텝 깊이                                              m       8

                 부하운반 구역(디딤판)의 공칭 폭                                 m      6, 8

                 스커트 사이의 수평 거리                                      m       6

                 지지 롤러 사이의 가로 거리                                    ㎜      11

                  에스컬레이터 또는 무빙워크의 경사각                                 °      5

                  콤의 빗살의 설계 각도                                        °      5

                  하부 내측 데크의 단면 경사각                                    °      6

                  마찰 계수                                              －       －' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='4.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5','에스컬레이터','2013-09-15','2022-03-01','old','5.1 일반사항
에스컬레이터 및 무빙워크는 이 기준의 안전요건 및 보호대책에 따라야 한다. 또한, 에스컬레이터 및 무빙워크는 KS B
ISO 12100-2의 규정 중 관련 있는 항목에 따라 설계되어야 한다. 다만, 중요하지 않은 위험은 이 기준에서 다루지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5','에스컬레이터','2022-03-02',NULL,'current','5 일반사항
 에스컬레이터 및 무빙워크는 이 기준의 안전요건 및 보호/위험감소 대책에 따라야 한다.
 또한, 에스컬레이터 및 무빙워크는 관련은 있으나 본 기준에서 다루지 않는 중요하지
 않은 위험에 대해서는 KS B ISO 12100의 6.2의 기준에 따라 설계되어야 한다.
 특정 에스컬레이터 및 무빙워크는 특수한 작동 및 환경 조건의 영향을 받는다.
 이러한 경우 몇 가지 추가 권장사항이 정의되어 진다.(Ⅵ.2 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.1','에스컬레이터','2013-09-15','2022-03-01','old','6.2.8 승강기 번호
승강기를 식별할 수 있는 고유번호는 상‧하 승강장에서 잘 보이는 위치에 부착되어 있어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.1','에스컬레이터','2022-03-02',NULL,'current','5.1 승강기번호
 승강기를 식별할 수 있는 지정된 승강기번호가 상‧하 승강장에서 잘 보이는 위치에 부
 착되어 있어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.1.1','에스컬레이터','2013-09-15','2022-03-01','old','5.2.1.1 에스컬레이터 또는 무빙워크의 기계적으로 움직이는 모든 부품은 구멍이 없는 패널이나 벽으로 완전히 둘러싸여야 한다.
다만, 이용자가 접근할 수 있는 스텝ㆍ팔레트ㆍ벨트 및 핸드레일의 부품은 제외한다. 환기를 위한 틈은 허용된다.(5.2.1.5 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.1.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.1.1','에스컬레이터',NULL,'2013-09-14','old','3.3.1(1) 사람이나 물건이 에스컬레이터 또는 수평보행기의 각부분에 끼이거나 부딪치는 일이 없도록 안전한 구조로 하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.1.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.1.1','에스컬레이터','2022-03-02',NULL,'current','5.2.1.1 에스컬레이터 또는 무빙워크의 기계적으로 움직이는 모든 부품은 구멍이 없는 패



                                                 [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




널이나 벽으로 완전히 둘러싸여야 한다. 다만, 이용자가 접근할 수 있는 디딤판 및 손
잡이의 부품은 제외한다. 환기를 위한 틈은 허용된다.(5.2.1.5 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.1.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.1.2','에스컬레이터','2013-09-15','2022-03-01','old','5.2.1.2 외부 패널은 25 ㎠의 면적의 어느 지점에서나 수직으로 250 N의 힘을 가할 때 파손 또는 편향으로 인해 틈이 발생하지
    않도록 견뎌야 한다.
고정은 보호벽(패널) 정하중의 2배 이상을 견디는 방법으로 설계되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.1.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.1.2','에스컬레이터','2022-03-02',NULL,'current','5.2.1.2 모든 틈이나 구멍은 움직이는 부품과 접촉할 위험이 있는 곳에서 4 ㎜로 제한된다.
 외부 패널은 2,500 ㎟의 원형 또는 정사각형 면적의 어느 지점에서나 수직으로 250 N
 의 힘을 가할 때 파손 없이 견뎌야 한다.
 고정은 보호벽(패널) 자중의 2배 이상을 견디는 방법으로 설계되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.1.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.1.3','에스컬레이터','2013-09-15','2022-03-01','old','5.2.1.3 일반인의 위험을 예방할 수 있는 다른 조치(권한이 있는 사람만이 접근 가능한 잠금장치가 있는 방 등)가 있는 경우에는
    기계적으로 움직이는 부품에 대한 둘러싸인 보호벽은 생략될 수 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.1.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.1.3','에스컬레이터','2022-03-02',NULL,'current','5.2.1.3 일반인의 위험을 예방할 수 있는 다른 조치(권한이 있는 사람만이 접근 가능한잠
 금장치가 있는 공간 등)가 있는 경우에는 기계적으로 움직이는 부품에 대한 둘러싸인
 보호벽은 생략될 수 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.1.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.1.4','에스컬레이터','2013-09-15','2022-03-01','old','5.2.1.4 그리스, 오일, 먼지 또는 종이 등이 쌓이는 것은 화재의 위험을 의미하므로 에스컬레이터 및 무빙워크의 내부는 청소가
    가능한 구조이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.1.4' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.1.4','에스컬레이터','2022-03-02',NULL,'current','5.2.1.4 윤활유, 오일, 먼지 또는 종이 등이 쌓이는 것은 화재의 위험을 의미하므로 에스
 컬레이터/무빙워크의 내부는 청소가 가능한 구조이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.1.4' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.1.5','에스컬레이터','2013-09-15','2022-03-01','old','5.2.1.5 환기구는 ISO 13857, 표 5에 따른 방법으로 설계되어야 한다. 다만, 보호벽을 통해 지름 10 mm의 곧은 단단한 막대기가
    통과되는 것이 가능하지 않아야 하고 환기구를 통해 어떤 움직이는 부품에 접촉되지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.1.5' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.1.5','에스컬레이터','2022-03-02',NULL,'current','5.2.1.5 환기구는 KS B ISO 13857, 표 5에 따른 방법으로 설계되어야 한다. 다만, 환기
 구 주변을 통해 지름 10 ㎜의 곧은 단단한 막대기가 통과되거나 환기구를 통해 어떤
 움직이는 부품에 접촉되는 것이 가능하지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.1.5' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.1.6','에스컬레이터','2013-09-15','2022-03-01','old','5.2.1.6 열리도록 설계된 외부패널(청소 목적 등)에는 표 5의 하)에 적합한 전기안전장치가 설치되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.1.6' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.1.6','에스컬레이터','2022-03-02',NULL,'current','5.2.1.6 열리도록 설계된 외부패널(청소 목적 등)에는 5.12.2.7.14에 적합한 전기안전장치
 가 설치되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.1.6' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.2.1','에스컬레이터','2013-09-15','2022-03-01','old','5.2.2.1 에스컬레이터의 경사도 α는 30°를 초과하지 않아야 한다. 다만, 높이(h13)가 6 m 이하이고 공칭속도가 0.5 ㎧ 이하인
     경우에는 경사도를 35°까지 증가시킬 수 있다.(그림 2의 α참조)
비고 경사도 α는 현장 설치여건 등을 감안하여 최대 1°까지 초과될 수 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.2.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.2.1','에스컬레이터',NULL,'2007-09-09','old','3.3.1(2) 에스컬레이터의 경사도는 30°이하로 하여야 하고, 수평보행기의 경사도는 12°이하로 하여야 한다. 다만, 에스컬레이터의
     층고가 6m 이하일 때에는 35°이하로 할 수 있으며, 수평보행기의 디딤면이 고무제품 등 미끄러지기 어려운 구조일 경
     우에는 경사도를 15°이하로 할 수 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.2.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2007-09-09');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.2.1','에스컬레이터','2022-03-02',NULL,'current','5.2.2.1 에스컬레이터의 경사도 α는 30°를 초과하지 않아야 한다. 다만, 층고(h13)가 6 m
 이하이고, 공칭속도가 0.5 ㎧ 이하인 경우에는 경사도를 35 °까지 증가시킬 수 있다.(그
 림 5의 α 참조)
  비고 경사도 α는 현장 설치여건 등을 감안하여 최대 1 °까지 초과될 수 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.2.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.2.2','에스컬레이터',NULL,'2007-09-09','old','3.3.1(2) 에스컬레이터의 경사도는 30°이하로 하여야 하고, 수평보행기의 경사도는 12°이하로 하여야 한다. 다만, 에스컬레이터의
     층고가 6m 이하일 때에는 35°이하로 할 수 있으며, 수평보행기의 디딤면이 고무제품 등 미끄러지기 어려운 구조일 경
     우에는 경사도를 15°이하로 할 수 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.2.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2007-09-09');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.2.2','에스컬레이터','2022-03-02',NULL,'current','5.2.2.2 무빙워크의 경사도는 12 °이하이어야 한다.
                                                   <2013년 9월 15일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.2.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.3','에스컬레이터','2013-09-15','2022-03-01','old','5.2.3 내부 출입
지지 구조물(트러스) 내부의 구동기 공간은 열쇠 등에 의해 권한이 있는 사람만이 출입할 수 있어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.3','에스컬레이터','2022-03-02',NULL,'current','5.2.3 내부 출입
 골조 구조물(Truss) 내부의 기계류 공간은 열쇠 등에 의해 자격자만이 접근 가능해야
 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.4','에스컬레이터','2013-09-15','2022-03-01','old','5.2.4 점검용 덮개 및 바닥 플레이트
점검용 덮개 및 바닥 플레이트는 다음 사항에 적합하여야 한다.
가) 표 5의 하)에 따른 제어장치가 설치되어야 한다.
나) 열쇠 또는 도구에 의해서만 열려야 한다.
다) 잠겨 있다면 내부에서 열쇠 또는 도구를 사용하지 않고 열려야 한다.
라) 구멍이 없어야 한다.
비고 점검용 덮개는 설치되는 장소에서 요구되는 조건(상호 계약 등)에 적합하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.4' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.4','에스컬레이터','2022-03-02',NULL,'current','5.2.4 점검용 덮개
 점검용 덮개는 다음 사항에 적합해야 한다.
 가) 5.12.2.7.14에 따른 안전장치가 설치되어야 한다.
 나) 전용열쇠 또는 도구에 의해서만 열려야 한다.


                                                 [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




 다) 하나 이상의 부품으로 구성되는 경우, 먼저 열리는 부품에 안전장치가 있어야 한다.
       연속적으로 구성된 것은 기계적 연동, 겹침 등으로 개별적 제거가 방지되거나 각각
       의 부품마다 안전장치가 제공되어야 한다.
 라) 점검용 덮개 뒤의 공간에 들어갈 수 있다면 덮개가 잠기더라도 내부에서 열쇠 또는
       도구를 사용하지 않고 열려야 한다.
 마) 구멍이 없어야 한다.
 비고
 1. 유지관리 목적으로 제거되는 난간 관련 부품(데크, 패널 등)은 점검용 덮개로 간주하지 않는다.
 2. 점검용 덮개는 설치되는 장소에 적용되는 관련 법령 등에 적합한 구조이어야 한다.
 3. 승강장 플레이트가 점검용 덮개의 기능을 가지고 있는 경우 동일하게 적용한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.4' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.5','에스컬레이터','2013-09-15','2022-03-01','old','      5.2.5.1 지지 구조물(트러스)은 에스컬레이터 또는 무빙워크의 자중에 5,000 N/㎡의 정격하중을 더한 부하를 견딜 수 있는 방법으로
          설계되어야 하며 EN 1993-1-1에 따라 계산되어야 한다.
       비고 부하운송면적 = 에스컬레이터 또는 무빙워크의 공칭폭 z1(그림 4)×지지물 사이의 거리 l1(그림 2 참조)
      정격하중에 근거하여, 계산되거나 측정된 최대 편향은 지지물 사이의 거리 l1의 1/750 이하이어야 한다.



<추가 종전 기준>----------------------------------------------' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.5' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.2.5','에스컬레이터','2022-03-02',NULL,'current','5.2.5 구조 설계
  골조 구조물은 에스컬레이터 또는 무빙워크의 자중에 5,000 N/㎡의 구조적 정격하중을
  기초로 더한 부하를 견딜 수 있는 방법으로 설계되어야 한다.
  비고 부하운송면적 = 에스컬레이터 또는 무빙워크의 공칭폭 (그림 6) × 지지물 사이의 거리  (그림 5)

  구조적 정격하중에 근거하여 계산되거나 측정된 최대 처짐량은 지지물 사이의 거리 
  의 1/750 이하이어야 한다.
  구조적 정격하중에 근거하여, 콤 플레이트와 승강장 플레이트의 최대 처짐량은 4 ㎜ 이
  하이어야 하고, 콤의 맞물림이 보장되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.2.5' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.1','에스컬레이터','2013-09-15','2022-03-01','old','5.3.1 일반사항
 에스컬레이터의 이용자 운송구역에서, 스텝 트레드는 운행방향에 ± 1°의 공차로 수평 해야 한다.
 에스컬레이터 및 무빙워크의 트레드 표면에는 안전한 발판이 있어야 한다.
 비고 2개의 연속적인 스텝 사이의 최대 허용 높이는 5.3.4 및 5.7.2.1에서 규정한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.1','에스컬레이터','2022-03-02',NULL,'current','5.3.1 일반사항
 에스컬레이터의 이용자 운송구역에서, 스텝 트레드는 운행방향에 ± 1 °의 공차로 수평
 해야 한다.
  비고 수평주행구간의 2개의 연속적인 스텝 사이의 최대 허용 높이는 5.3.4 및 5.7.2.1에서 규정한다.
 에스컬레이터 및 무빙워크의 트레드 표면에는 안전한 발판이 제공되어야 한다.
  비고 재료 및 시험방법에 대한 정의는 부속서 Ⅷ 참조' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.2.1','에스컬레이터','2022-03-02',NULL,'current','5.3.2.1 일반사항
 에스컬레이터 및 무빙워크의 공칭 폭 은 0.58 m 이상 1.1 m 이하이어야 한다.
 경사도가 6 °이하인 무빙워크의 폭은 1.65 m까지 허용된다.
                                                    <2013년 9월 15일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.2.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.2.2','에스컬레이터','2013-09-15','2022-03-01','old','5.3.2.2 스텝 트레드 및 팔레트(그림 2, 상세도 X 및 그림 5 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.2.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.2.2','에스컬레이터','2022-03-02',NULL,'current','5.3.2.2 스텝 트레드 및 팔레트(그림 5, 상세도 X 및 그림 8 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.2.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.2.2.1','에스컬레이터','2022-03-02',NULL,'current','5.3.2.2.1 스텝 높이 은 0.24 m 이하이어야 한다.
                                                    <2013년 9월 15일 이후 건축허가분부터 적용>




                                             [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.2.2.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.2.2.2','에스컬레이터','2022-03-02',NULL,'current','5.3.2.2.2 스텝 깊이 은 0.38 m 이상이어야 한다.
                                               <2013년 9월 15일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.2.2.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.2.2.8','에스컬레이터','2013-09-15','2022-03-01','old','5.3.2.2.8 스텝 트레드와 스텝 라이저 또는 팔레트는 모서리 부분에서 홈 형태로 마감되지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.2.2.8' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.2.2.8','에스컬레이터','2022-03-02',NULL,'current','5.3.2.2.8 스텝 트레드와 스텝 라이저 또는 팔레트의 측면 모서리 부분은 홈으로 마감되
 지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.2.2.8' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.2.3','에스컬레이터','2013-09-15','2022-03-01','old','5.3.2.3 벨트(그림 2, 상세도 X 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.2.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.2.3','에스컬레이터','2022-03-02',NULL,'current','5.3.2.3 벨트(그림 5, 상세도 X 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.2.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.2.3.5','에스컬레이터','2013-09-15','2022-03-01','old','5.3.2.3.5 벨트는 벨트의 측면 모서리에서 홈 형태로 마감되지 않아야 한다.
트레드웨이(treadway) 벨트의 접합부는 파손되지 않은 연속적인 트레드웨이 표면과 같아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.2.3.5' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.2.3.5','에스컬레이터','2022-03-02',NULL,'current','5.3.2.3.5 벨트의 측면 모서리 부분은 홈으로 마감되지 않아야 한다. 트레드웨이
 (treadway) 벨트의 접합부는 파손되지 않은 연속적인 트레드웨이 표면과 같아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.2.3.5' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.1','에스컬레이터','2013-09-15','2022-03-01','old','5.3.3.1 일반사항
재질은 구체적인 수명주기 동안에 환경적인 조건(온도, 자외선, 습도 및 부식 등)을 고려한 강도 특성을 유지하여야 한다.
스텝, 팔레트 및 벨트는 정상운행 동안에 트랙킹(tracking), 가이드 및 구동 시스템에 의해 부과될 수 있는 모든 가능한 하중
및 변형 작용에 견디도록 설계되어야 하고 6,000 N/㎡에 상응하는 균일하게 분포된 하중을 견디도록 설계되어야 한다.
비고 6,000 N/㎡은 5,000 N/㎡의 정하중(5.2.5 참조)에 1.2의 충격계수를 더한 값으로부터 유도된다.
벨트 및 벨트의 지지시스템의 치수를 정하기 위해, 유효 폭 × 길이 1 m의 면적은 상기의 상응하는 부하의 기초로 채택되어야
한다. 또한, 5.3.3.1.4의 규정에 적합하여야 한다.
조립되는 스텝 및 팔레트의 모든 구성 부품(삽입부품 또는 고정부품 등)은 안전하게 부착되어야 하고 수명주기 동안 느슨해지지
않아야 한다. 삽입부품 및 고정부품은 콤ㆍ콤 플레이트 전기안전장치[표 5 사)]의 작동에 대한 반력을 견뎌야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.1','에스컬레이터','2022-03-02',NULL,'current','5.3.3.1 일반사항

 재질은 수명주기 동안에 환경적인 조건(온도, 자외선, 습도, 부식 등)을 고려한 강도특성
 을 유지해야 한다.
 디딤판은 정상운행 동안에 트랙킹(tracking), 주행안내 및 구동 시스템에 의해 부과될
 수 있는 모든 가능한 하중 및 변형 작용에 견디도록 설계되어야하고, 6,000 N/㎡에 상
 응하는 균일하게 분포된 하중을 견디도록 설계되어야 한다.


                                                   [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




 비고 6,000 N/㎡은 5,000 N/㎡의 구조적 정격하중(5.2.5 참조)에 1.2의 충격계수를 더한 값으로부터 유
        도된다.
벨트 및 벨트 지지시스템의 규격을 정하기 위해, 유효 폭 × 길이 1 m의 면적은 상기
의 상응하는 부하의 기초로 채택되어야 한다.
또한, 5.3.3.2.4의 기준에 적합해야 한다.
조립되는 스텝 및 팔레트의 모든 구성 부품(삽입부품 및 고정부품 등)은 수명주기 동안
안전하게 부착되어지고 느슨해지지 않아야 한다.
삽입부품 및 고정부품은 콤/콤 플레이트 안전장치(5.12.2.7.7)의 작동에 대한 반력을 견
뎌야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.2.1','에스컬레이터','2013-09-15','2022-03-01','old','5.3.3.2.1 스텝
 스텝은 두께 25 mm 이상이고 크기 0.2 m × 0.3 m의 강판 위에 트레드 표면의 중앙에 수직으로 3,000 N(강판무게 포함)의
 단일 힘을 가하여 휨에 대해 시험되어야 한다. 길이 0.2 m인 강판의 끝부분은 스텝 앞면의 끝부분과 평행하게, 길이 0.3 m
 인 강판의 끝부분은 스텝 앞면의 끝부분과 직각으로 배열되어야 한다.
이 시험동안, 트레드 표면에서 측정되는 휨은 4 mm 이하이어야 하며, 영구적인 변형이 없어야 한다.(최초 설정 공차는 허용된다.)
스텝은 수평 위치(수평 지지대) 및 적용되는 스텝의 최대 경사(경사진 지지대)에서 롤러(회전하지 않은), 축 또는 스터브 샤프트
(stub shafts)와 함께 전체적으로 시험되어야 한다.
허용된 최대 경사보다 작은 경사에 대해서는 새로운 시험이 요구되지 않는다. 설치된 스텝의 시험 즉, 에스컬레이터의 가이드
레일 및 지지구조물과 함께 설치된 스텝의 시험 또한 필요하지 않다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.2.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.2.1','에스컬레이터','2022-03-02',NULL,'current','5.3.3.2.1 스텝
 스텝은 트레드 표면 중앙의 두께 25 ㎜ 이상이고 크기 0.2 m × 0.3 m의 강판에 트레
 드 표면에 수직으로 3,000 N(강판무게 포함)의 단일 힘을 가하여 휨에 대해 시험되어야
 한다.
 길이 0.2 m인 강판의 끝부분은 스텝 앞면의 끝부분과 평행하게, 길이 0.3 m인 강판의
 끝부분은 스텝 앞의 끝부분과 직각으로 배열되어야 한다.
 이 시험 동안, 트레드 표면에서 측정되는 휨량은 4 ㎜ 이하이어야 하며, 영구 변형이
 없어야 한다.(초기 설정 공차는 허용된다.)
 스텝에 적용되는 수평 위치(수평 지지대) 및 최대 경사(경사 지지대)에서 롤러(회전하지
 않는), 축 또는 스터브 축(stub shafts)과 함께 전체적으로 시험되어야 한다.
 허용된 최대 경사보다 작은 경사에 대해서는 새로운 시험이 요구되지 않는다.
 설치된 스텝의 시험 즉, 에스컬레이터의 주행안내 레일 및 에스컬레이터의 골조 구조물
 과 함께 설치된 스텝의 시험 또한 필요하지 않다.
 스커트 면에 근접한 트레드 표면은 두께 25 ㎜ 이상의 사각 강판을 사용하여 2,500 ㎟
 의 면적 표면에 수직으로 1,500 N의 단일하중을 가할 때 어떤 위치에서도 휨 량은 4
 ㎜ 이하이어야 한다.(그림 1 참조)
 트레드 표면에 삽입부품/고정부품이 있는 경우, 하중은 삽입 부품/고정 부품 자체에만
 적용되어야 한다. 하중은 삽입부품/고정부품의 폭 × 50 ㎜의 면적으로 시험되어야 한






  다.(그림 2 참조)
  적용된 힘은 수직으로 고정되어야 하고, 적용된 힘의 방향은 시험 도중 변하지 않아야
  하며, 영구적인 변형은 없어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.2.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.2.2','에스컬레이터','2013-09-15','2022-03-01','old','5.3.3.2.2 스텝 라이저
스텝 라이저는 라이저 곡선에 적합한 모양의 두께 25 mm 이상의 사각이나 원형의 강판을 사용하여 25 ㎠의 면적 표면에
1,500 N의 단일 하중을 가할 때 휨은 4 mm 이하이어야 한다. 이 하중은 라이저의 폭을 중앙선으로 가로질러, 중간 및 양 끝의
세 지점에 적용하여야 한다. 영구적인 변형은 없어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.2.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.2.2','에스컬레이터','2022-03-02',NULL,'current',' 5.3.3.2.2 스텝 라이저
  스텝 라이저는 라이저 곡선에 적합한 모양의 두께 25 ㎜ 이상의 사각이나 원형의 강판
  을 사용하여 2,500 ㎟의 면적 표면에 1,500 N의 단일하중을 가할 때 휨량은 4 ㎜ 이하
  이어야 한다.
  이 하중은 스텝 라이저의 최대 높이의 중간을 가로지르는 중간 및 양끝의 세 지점에 완
  전히 조립된 스텝에 적용되어야 한다.
  가해지는 힘은 고정되어 있어야 하고 시험 중 적용된 힘의 방향은 변하지 않아야 한다.
  이 스텝은 축 또는 스터브 축을 사용하여 고정된 위치에서 시험해야 하고, 영구적인 변
  형은 없어야 한다.(초기 설정 공차는 허용된다.)


  스텝 라이저의 삽입부품/고정부품이 있는 경우 삽입부품/고정부품의 폭 × 50 ㎜의 적
  에 스텝 라이저 중간높이에서 완전히 조립된 스텝으로 삽입부품/고정부품에 하중을 적용
  하여 추가 시험이 수행되어야 한다.




                                 [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




기호설명
 F1 3,000 N
 F2 1,500 N
 a1 50 ㎜
 b 50 ㎜

                     [그림 1. 스텝 시험]




기호설명
 F1 3,000 N
 F2 1,500 N
 a2 삽입부품/고정부품의 폭
b 50 ㎜

              [그림 2. 삽입부품/고정부품이 있는 스텝 시험]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.2.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.2.3','에스컬레이터','2013-09-15','2022-03-01','old','5.3.3.2.3 팔레트
팔레트는 1 ㎡의 팔레트 면적에 7,500 N(강판 무게 포함)의 단일 힘을 가하여 휨에 대해 시험되어야 한다. 그 힘은 트레드
표면 중앙에 수직으로 두께 25 mm 이상이고, 크기 0.3 m × 0.45 m인 강판 위에 적용되어야 한다. 그리고 길이 0.45 m인
강판의 끝부분은 팔레트의 옆면 끝부분과 평행하게 배열되어야 한다.
더 작거나 더 큰 면적을 갖는 팔레트에 대해, 그 힘 및 부하면적은 비례적으로 변경되어야 하고, 이에 따라 부하면적에 대
한 끝 부분 길이의 비율은 1:1.5 이어야한다. 다만, 그 힘은 두께 25 mm 이상, 크기 0.2 m × 0.3 m 이상인 강판의 무게를
포함하여 3,000 N 보다 작지 않아야 한다.
깊이 0.3 m 이하인 팔레트의 폭은 0.2 m이어야 하고, 길이는 팔레트 깊이이어야 한다.
이 시험동안, 트레드 표면에서 측정되는 휨은 4 mm 이하이어야 하며, 영구적인 변형이 없어야 한다.(최초 설정 공차는 허용된다.)
팔레트는 수평 위치(수평 지지대)에서 롤러(회전하지 않은), 축 또는 스터브 샤프트와 함께 전체적으로 시험되어야 한다. 설치된
팔레트의 시험 즉, 무빙워크의 가이드 레일 및 지지 구조물과 함께 설치된 팔레트의 시험은 요구되지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.2.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.2.3','에스컬레이터','2022-03-02',NULL,'current','5.3.3.2.3 팔레트
 팔레트는 1 ㎡의 팔레트 면적에 7,500 N(강판 무게 포함)의 단일 힘을 가하여 휨에 대
 해 시험되어야 한다. 그 힘은 트레드 표면 중앙의 두께 25 ㎜ 이상이고 크기 0.3 m ×
 0.45 m의 강판에 트레드 표면에 수직으로 적용되어야 한다.
 길이 0.45 m인 강판의 끝부분은 팔레트의 옆면 끝부분과 평행하게 배열되어야 한다.
 더 작거나 더 큰 면적을 갖는 팔레트에 대해, 힘과 부하면적은 비례적으로 변경되어야
 하고, 이에 따라 부하면적에 대한 끝부분 길이의 비율은 1:1.5 이어야한다.
 다만, 그 힘은 두께 25 ㎜ 이상, 크기 0.2 m × 0.3 m 이상인 강판의 무게를 포함하여
 3,000 N 보다 작지 않아야 한다.
 깊이 0.3 m 이하인 팔레트에 대해, 강판의 폭은 0.2 m이어야 하고 강판의 길이는 팔레
 트 깊이이어야 한다.
 이 시험동안, 트레드 표면에서 측정되는 휨량은 4 ㎜ 이하이어야 하며, 영구적인 변형이
 없어야 한다.(초기 설정 공차는 허용된다.)
 팔레트는 수평 위치(수평 지지)에서 롤러(회전하지 않는), 축 또는 스터브 축과 함께 전
 체적으로 시험되어야 한다.
 설치된 팔레트의 시험 즉, 무빙워크의 주행안내 레일 및 지지 구조물과 함께 설치된 팔
 레트의 시험은 요구되지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.2.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.2.4','에스컬레이터','2013-09-15','2022-03-01','old','5.3.3.2.4 벨트
 운행조건에 적합하게 인장된 벨트에 대해, 750 N의 단일 힘(강판무게 포함)이 크기 0.15 m × 0.25 m × 0.025 m인 강판에
 적용되어야 한다. 강판은 강판의 세로축이 벨트의 세로축과 평행한 방법으로 끝부분 지지롤러 사이 중앙에 위치되어야 한다.
 중심에서 처짐은 0.01 × Z3 이하이어야 한다. 여기서 Z3는 지지롤러 사이의 가로 거리이다.(그림 8, Z3 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.2.4' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.2.4','에스컬레이터','2022-03-02',NULL,'current','5.3.3.2.4 벨트
 운행조건에 적합하게 인장된 벨트에 대해, 750 N의 단일 힘(강판무게 포함)이 크기
 0.15 m(폭) × 0.25 m(길이) × 0.025 m(두께)인 강판에 적용되어야 한다.
 강판은 세로축이 벨트의 세로축과 평행한 방법으로 양끝의 지지롤러 사이 중앙에 위치
 되어야 한다.


                                                 [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




중심에서 처짐 량은 0.01 ×  이하이어야 한다.
여기서 는 지지롤러 사이의 가로 거리이다.(그림 11,  참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.2.4' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.3.1.1','에스컬레이터','2013-09-15','2022-03-01','old','5.3.3.3.1.1 하중시험
 스텝은 적용되는 최대 경사(경사진 지지물)에서 롤러(회전하지 않은), 축 또는 스터브 샤프트와 함께 모두 시험되어야 한다.
 이것은 영향을 받지 않는 사인파 곡선의 힘의 흐름이 이뤄지는 5×106 이상의 주기 동안 5 Hz와 20 Hz 사이의 한 주파수에서
 500 N과 3,000 N 사이의 맥동하중이어야 한다. 하중은 5.3.3.2.1에서 규정된 것과 같은 트레드 표면의 중앙에서 트레드 표면
 에 대해 수직으로 두께 25 mm 이상, 크기 0.2 m × 0.3 m의 강판 위에 적용되어야 한다.
 시험 후에는 스텝에 균열이 생길 조짐이 보이지 않아야 한다.
트레드 표면에서 측정되어 4 mm를 초과하는 영구적인 변형은 없어야 한다. 스텝 또는 스텝 구성부품(삽입부품 또는 고정부품
등)은 견고하게 부착되어야 하고 느슨해지지 않아야 한다.
 시험하는 동안 롤러가 손상되면 롤러의 교체는 허용된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.3.1.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.3.1.1','에스컬레이터','2022-03-02',NULL,'current','5.3.3.3.1.1 하중시험
 스텝은 적용되는 최대 경사(경사 지지대)에서 롤러(회전하지 않는), 축 또는 스터브 축과
 함께 모두 시험되어야 한다.
 이것은 영향을 받지 않는 사인파 곡선의 힘의 흐름이 이뤄지는 5 × 106 이상의 주기
 동안 5 ㎐와 20 ㎐ 사이의 한 주파수에서 500 N과 3,000 N 사이의 맥동하중이어야 한다.
 하중은 5.3.3.2.1에서 규정된 것과 같은 트레드 표면의 중앙에서 트레드 표면에 대해
 수직으로 두께 25 ㎜ 이상, 크기 0.2 m × 0.3 m의 강판 위에 적용되어야 한다.
 시험 후에는 스텝에 균열이 생길 조짐이 보이지 않아야 한다.
 트레드 표면에서 측정하여 4 ㎜를 초과하는 영구적인 변형은 없어야 한다.
 스텝 또는 스텝 구성부품(삽입부품 또는 고정부품 등)은 견고하게 부착되어야 하고 느슨
 해지지 않아야 한다.
 시험하는 동안 롤러가 손상되면 롤러의 교체는 허용된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.3.1.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.3.1.2','에스컬레이터','2013-09-15','2022-03-01','old','5.3.3.3.1.2 비틀림 시험
스텝 설계는 중심이 체인 휠의 중심인 아크에서 움직이는 트레일러 휠 중심의 ± 2 mm의 변위와 동등한 비틀기 하중을 수용할
수 있는 구조이어야 한다. ± 2 mm의 변위는 트레일러 휠에서 체인 휠 중심까지의 거리 400 mm에 비례한다. 이 비율은
400 mm의 치수가 변할 때 유지되어야 한다.(부속서 Ⅲ 참조)
동적시험은 시험도중에 상기의 규정된 휨이 이뤄지는 것을 보장하도록 조정이 가능하여야 한다. 이것은 영향을 받지 않은
사인파 곡선의 힘의 흐름이 이뤄지는 5 × 106 이상의 주기 동안 5 Hz와 20 Hz 사이의 한 주파수로 적용되어야 한다.
시험 후에는 스텝에 균열이 생길 조짐이 보이지 않아야 한다.
트레드 표면에서 측정되어 4 mm를 초과하는 영구적인 변형은 없어야 한다. 스텝 또는 스텝 구성부품(삽입부품 또는 고정부품
등)은 안전하게 부착되어야 하고 느슨해지지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.3.1.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.3.1.2','에스컬레이터','2022-03-02',NULL,'current','5.3.3.3.1.2 비틀림 시험
 스텝 설계는 중심이 구동롤러의 중심인 원호에서 움직이는 종동롤러 중심의 ± 2 ㎜의
 변위와 동등한 비틀기 하중을 수용할 수 있는 구조이어야 한다.
 ± 2 ㎜의 변위는 종동롤러에서 구동롤러 중심까지의 거리 400 ㎜에 비례한다.
 이 비율은 400 ㎜의 치수가 변할 때 유지되어야 한다. 동적시험은 시험도중에 상기의
 규정된 휨이 이뤄지는 것을 보장하도록 조정이 가능해야 한다.
 이것은 영향을 받지 않은 사인파 곡선의 힘의 흐름이 이뤄지는 5 × 106 이상의 주기






  동안 5 ㎐와 20 ㎐ 사이의 한 주파수로 적용되어야 한다.
  시험 후에는 스텝에 균열이 생길 조짐이 보이지 않아야 한다.
  트레드 표면에서 측정하여 4 ㎜를 초과하는 영구적인 변형은 없어야 한다.
  스텝 또는 스텝 구성부품(삽입부품 또는 고정부품 등)은 안전하게 부착되어야 하고 느슨
  해지지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.3.1.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.3.2.1','에스컬레이터','2013-09-15','2022-03-01','old','5.3.3.3.2.1 하중시험
팔레트는 크기와 상관없이 수평위치에서 롤러(회전하지 않은), 축 또는 스터브 샤프트와 함께 모두 시험되어야 한다. 이것은
영향을 받지 않는 사인파 곡선의 힘의 흐름이 이뤄지는 5×106 이상의 주기 동안 5 Hz와 20 Hz 사이의 한 주파수에서 500 N
과 3,000 N 사이의 맥동하중이어야 한다. 트레드 표면의 중앙에서 트레드 표면에 대해 수직으로 두께 25 mm 이상, 크기 0.2
m × 0.3 m의 강판 위에 적용되어야 한다.
시험 후에는 스텝에 균열이 생길 조짐이 보이지 않아야 한다.
트레드 표면에서 측정되어 4 mm를 초과하는 영구적인 변형은 없어야 한다. 팔레트 또는 팔레트 구성부품(삽입부품 또는 고정부품
등)은 견고하게 부착되어야 하고 느슨해지지 않아야 한다.
시험하는 동안 롤러가 손상되면 롤러의 교체는 허용된다.




                                        [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.3.2.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.3.2.1','에스컬레이터','2022-03-02',NULL,'current','5.3.3.3.2.1 하중 시험
 팔레트는 크기와 상관없이 수평 위치에서 롤러(회전하지 않는), 축 또는 스터브 축과 함
 께 모두 시험되어야 한다.
 이것은 영향을 받지 않는 사인파 곡선의 힘의 흐름이 이뤄지는 5 × 106 이상의 주기
 동안 5 ㎐와 20 ㎐ 사이의 한 주파수에서 500 N과 3,000 N 사이의 맥동하중이어야 한다.
 트레드 표면의 중앙에서 트레드 표면에 대해 수직으로 두께 25 ㎜ 이상, 크기 0.2 m ×
 0.3 m의 강판 위에 적용되어야 한다.
 깊이 0.3 m 이하인 팔레트에 대해, 강판의 폭은 0.2 m이어야 하고 강판의 길이는 팔레
 트 깊이이어야 한다.
 시험 후에는 팔레트에 균열이 생길 조짐이 보이지 않아야 한다.
 트레드 표면에서 측정하여 4 ㎜를 초과하는 영구적인 변형은 없어야 한다.
 팔레트 또는 팔레트 구성부품(삽입부품 또는 고정부품 등)은 견고하게 부착되어야 하고,
 느슨해지지 않아야 한다.
 시험하는 동안 롤러가 손상되면 롤러의 교체는 허용된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.3.2.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.3.2.2','에스컬레이터','2013-09-15','2022-03-01','old','5.3.3.3.2.2 비틀림 시험
 비틀림 시험은 팔레트에 트레일러 롤러가 설치된 경우에만 요구된다.
 팔레트 설계는 중심이 체인 휠의 중심인 아크에서 움직이는 트레일러 휠 중심의 ± 2 mm의 변위와 동등한 비틀기 하중을
 수용할 수 있는 구조이어야 한다. ± 2 mm의 변위는 트레일러 휠에서 체인 휠 중심까지의 거리 400 mm에 비례한다. 이 비율
 은 400 mm의 치수가 변할 때 유지되어야 한다.(부속서 Ⅲ 참조)
 동적 하중은 시험도중에 편향이 -5 %의 공차로 이뤄지도록 조정이 가능하여야 한다. 이것은 영향을 받지 않은 사인파 곡선 힘의
 흐름이 이뤄지는 5 × 106 이상의 주기 동안 5 Hz와 20 Hz 사이의 한 주파수로 적용되어야 한다.
 시험 후에는 스텝에 균열이 생길 조짐이 보이지 않아야 한다.
 트레드 표면에서 측정되어 4 mm를 초과하는 영구적인 변형은 없어야 한다. 스텝 또는 스텝 구성부품(삽입부품 또는 고정부품
 등)은 안전하게 부착되어야 하고 느슨해지지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.3.2.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.3.3.2.2','에스컬레이터','2022-03-02',NULL,'current','5.3.3.3.2.2 비틀림 시험
 비틀림 시험은 팔레트에 종동롤러가 설치된 경우에만 요구된다.
 팔레트 설계는 중심이 구동롤러의 중심인 원호에서 움직이는 종동롤러 중심의 ± 2 ㎜의
 변위와 동등한 비틀기 하중을 수용할 수 있는 구조이어야 한다.
 ± 2 ㎜의 변위는 종동롤러에서 구동롤러 중심까지의 거리 400 ㎜에 비례한다.
 이 비율은 400 ㎜의 치수가 변할 때 유지되어야 한다.
 동적 하중은 시험도중에 편향이 –5 %의 공차로 이뤄지도록 조정이 가능해야 한다.
 이것은 영향을 받지 않은 사인파 곡선 힘의 흐름이 이뤄지는 5 × 106 이상의 주기 동
 안 5 ㎐와 20 ㎐ 사이의 한 주파수로 적용되어야 한다.
 시험 후에는 팔레트에 균열이 생길 조짐이 보이지 않아야 한다.
 트레드 표면에서 측정하여 4 ㎜를 초과하는 영구적인 변형은 없어야 한다.
 팔레트 또는 팔레트 구성부품(삽입부품 또는 고정부품 등)은 안전하게 부착되어야 하고,
 느슨해지지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.3.3.2.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.4','에스컬레이터','2013-09-15','2022-03-01','old','5.3.4 스텝, 팔레트 및 벨트의 가이드
 스텝 또는 팔레트의 가이드 시스템에서 스텝 또는 팔레트의 측면 변위는 각각 4 mm 이하이어야 하고 양쪽 측면에서 측정된
 틈새의 합은 7 mm 이하이어야 한다. 그리고 스텝 및 팔레트의 수직 변위는 4 mm 이하이고 벨트의 수직 변위는 6 mm 이
 하이어야 한다.
 이 규정은 스텝, 팔레트 또는 벨트의 이용 가능한 구역에만 적용한다.
 벨트의 경우 트레드웨이 지지대는 디딤판의 중앙선을 따라 2 m 이하의 간격으로 설치되어야 한다. 이러한 지지대는
 5.3.3.2.4에서 요구되는 조건하에 하중이 부과될 때 트레드웨이의 하부 아래로 50 mm를 초과하지 않은 위치에 설치되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.4' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.4','에스컬레이터','2022-03-02',NULL,'current','5.3.4 디딤판의 주행안내
 스텝 또는 팔레트의 주행안내 시스템에서 스텝 또는 팔레트의 측면 변위는 각각 4 ㎜
 이하이어야 하고, 양쪽 측면에서 측정된 틈새의 합은 7 ㎜ 이하이어야 한다.
 또한, 스텝 및 팔레트의 수직 변위는 4 ㎜ 이하이고 벨트의 수직 변위는 6 ㎜ 이하이어
 야 한다.
 이 기준은 디딤판의 이용 가능한 구역에만 적용한다.
 벨트의 경우 트레드웨이 지지대는 디딤판의 중앙선을 따라 2 m 이하의 간격으로 설치
 되어야 한다.
 이러한 지지대는 5.3.3.2.4에서 요구되는 조건하에 하중이 부과될 때 트레드웨이 하부
 아래로 50 ㎜ 이하의 높이에 위치되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.4' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.5','에스컬레이터','2013-09-15','2022-03-01','old','5.3.5 스텝과 스텝 또는 팔레트와 팔레트 사이의 틈새
트레드 표면에서 측정된 이용 가능한 모든 위치의 연속되는 2개의 스텝 또는 팔레트 사이의 틈새는 6 mm 이하이어야 한다.
(그림 2 상세도 Y 및 Z, 그림 6 상세도 S 및 그림 7 상세도 U 참조)
데마케이션(스텝 트레드에 있는 홈 등)은 승강장에서 스텝 뒤쪽 끝부분을 황색 등으로 표시하여 설치되어야 한다.
팔레트의 맞물리는 전면 끝 부분과 후면 끝부분이 있는 무빙워크의 변환 곡선부에서는 이 틈새가 8 mm까지 증가되는 것은
허용된다.(그림 7 상세도 V 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.5' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.5','에스컬레이터',NULL,'2013-09-14','old','4.3.2(16) 디딤판 위의 안전마크는 황색 또는 적색으로 명확하게 표시되어 있어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.5' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.5','에스컬레이터','2022-03-02',NULL,'current','5.3.5 스텝 또는 팔레트 사이의 틈새
 트레드 표면에서 측정된 이용 가능한 모든 위치의 연속되는 2개의 스텝 또는 팔레트 사
 이의 틈새는 6 ㎜ 이하이어야 한다.(그림 5 상세도 Y 및 Z, 그림 9 상세도 S 및                           그림
 10 상세도 U 참조)
 틈새의 치수는 스텝의 경우 그림 5에 따라 측정하고 팔레트의 경우 그림 9와 10에 따
 라 측정해야 한다.
 데마케이션(스텝 트레드에 있는 홈 등)은 승강장에 스텝 뒤쪽 끝부분을 황색 등으로 표
 시하여 설치되어야 한다.
 팔레트의 맞물리는 전면 끝 부분과 후면 끝부분이 있는 무빙워크의 천이구간에서는 이
 틈새가 8 ㎜까지 증가되는 것은 허용된다.(그림 10 상세도 V 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.5' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.6','에스컬레이터','2013-09-15','2022-03-01','old','5.3.6 빠진 스텝 또는 팔레트 장치
빠진 스텝 또는 팔레트[표 5카) 참조]는 콤으로부터 틈(빠진 스텝 또는 팔레트로부터 발생한 결과)이 나타나기 전에 감지되어야
하고 에스컬레이터 또는 무빙워크는 정지되어야 한다. 이것은 각 구동 및 순환 장소에 설치된 어떤 장치에 의해 보장되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.6' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.3.6','에스컬레이터','2022-03-02',NULL,'current','5.3.6 스텝 또는 팔레트 누락 감지장치
 에스컬레이터/무빙워크의 작동은 완전한 스텝/팔레트에서만 허용된다.
 누락된 스텝/팔레트는 5.12.2.7.11에 따라 안전장치 또는 안전기능에 의해 감지되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.3.6' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.1','에스컬레이터','2013-09-15','2022-03-01','old','5.4.1.1 일반사항
구동장치는 2대 이상의 에스컬레이터 또는 무빙워크를 운전하지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.1','에스컬레이터','2022-03-02',NULL,'current','5.4.1.1 일반사항
 하나의 구동장치는 2대 이상의 에스컬레이터 또는 무빙워크를 작동하지 않아야 한다.


                                                       [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.2.1','에스컬레이터','2013-09-15','2022-03-01','old','5.4.1.2.1 공칭속도는 공칭 주파수 및 공칭 전압에서 ± 5 %를 초과하지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.2.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.2.1','에스컬레이터',NULL,'2009-11-23','old','3.3.1(4) 에스컬레이터 및 수평보행기의 디딤판의 속도는 다음의 각호의 기준에 적합하여야 한다. 다만, 현장에서 속도 측정 시
     기준속도의 5% 이하초과는 허용할 수 있다.


4.3.1(4) 4.1.1(4)의 하중시험은 적재하중을 싣지 않은 경우에만 검사한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.2.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2009-11-23');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.2.1','에스컬레이터','2022-03-02',NULL,'current','5.4.1.2.1 무부하 에스컬레이터 또는 무빙워크의 속도는 공칭주파수 및 공칭전압에서 공
 칭속도로부터 ± 5 %를 초과하지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.2.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.2.2','에스컬레이터','1999-09-03','2013-09-14','old','3.3.1(4) 에스컬레이터 및 수평보행기의 디딤판의 속도는 다음의 각호의 기준에 적합하여야 한다. 다만, 현장에서 속도 측정 시
         기준속도의 5% 이하초과는 허용할 수 있다.
 ① 에스컬레이터 디딤판의 속도는 30m/min 이하로 하여야 한다. 다만, 에스컬레이터의 경사도가 30° 이하이고 층고가 6m
     이하이며 수평주행구간 디딤판의 수가 3개 이상인 경우에는 40m/min 이하로 할 수 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.2.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1999-09-03' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.2.2','에스컬레이터','1999-09-03','2022-03-01','old','3.3.1(4) 에스컬레이터 및 수평보행기의 디딤판의 속도는 다음의 각호의 기준에 적합하여야 한다. 다만, 현장에서 속도 측정 시
         기준속도의 5% 이하초과는 허용할 수 있다.
 - 에스컬레이터 디딤판의 속도는 30m/min 이하로 하여야 한다. 다만, 에스컬레이터의 경사도가 30° 이하이고, 층고가 6m 이하이며,
    수평주행구간 디딤판의 수가 3개 이상인 경우에는 40m/min 이하로 할 수 있으며, 수평보행기 디딤판의 속도는 경사도가 8°
    이하의 것은 50m/min 이하, 경사도가 8°를 초과하는 것은 40m/min 이하로 하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.2.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1999-09-03' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.2.2','에스컬레이터',NULL,'1999-09-02','old','3.3.1(4) 에스컬레이터 및 수평보행기의 디딤판의 속도는 다음의 각호의 기준에 적합하여야 한다. 다만, 현장에서 속도 측정 시
         기준속도의 5% 이하초과는 허용할 수 있다.
 - 에스컬레이터 디딤판의 속도는 30m/min 이하로 하여야 하고, 수평보행기 디딤판의 속도는 경사도가 8°이하의 것은 50m/min 이하,
  경사도가 8°를 초과하는 것은 40m/min 이하로 하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.2.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='1999-09-02');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.2.2','에스컬레이터','2022-03-02',NULL,'current','5.4.1.2.2 에스컬레이터의 공칭속도는 다음과 같아야 한다.
 가) 경사도 α가 30 °이하인 에스컬레이터는 0.75 ㎧ 이하이어야 한다.
 나) 경사도 α가 30 °를 초과하고 35 °이하인 에스컬레이터는 0.5 ㎧ 이하이어야 한다.
                                                           <2013년 9월 15일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.2.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.2.3','에스컬레이터','1999-09-03','2009-11-23','old','3.3.1(4) 에스컬레이터 및 수평보행기의 디딤판의 속도는 다음의 각호의 기준에 적합하여야 한다. 다만, 현장에서 속도 측정 시
    기준속도의 5% 이하초과는 허용할 수 있다.
- 에스컬레이터 디딤판의 속도는 30m/min 이하로 하여야 한다. 다만, 에스컬레이터의 경사도가 30° 이하이고, 층고가 6m 이하이며,
 수평주행구간 디딤판의 수가 3개 이상인 경우에는 40m/min 이하로 할 수 있으며, 수평보행기 디딤판의 속도는 경사도가 8°
 이하의 것은 50m/min 이하, 경사도가 8°를 초과하는 것은 40m/min 이하로 하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.2.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1999-09-03' AND COALESCE(expiry_date,'')='2009-11-23');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.2.3','에스컬레이터',NULL,'1999-09-02','old','3.3.1(4) 에스컬레이터 및 수평보행기의 디딤판의 속도는 다음의 각호의 기준에 적합하여야 한다. 다만, 현장에서 속도 측정 시
    기준속도의 5% 이하초과는 허용할 수 있다.
- 에스컬레이터 디딤판의 속도는 30m/min 이하로 하여야 하고, 수평보행기 디딤판의 속도는 경사도가 8°이하의 것은 50m/min 이하,
 경사도가 8°를 초과하는 것은 40m/min 이하로 하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.2.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='1999-09-02');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.2.3','에스컬레이터','2022-03-02',NULL,'current','5.4.1.2.3 무빙워크의 공칭속도는 0.75 ㎧ 이하이어야 한다. 팔레트 또는 벨트의 폭이 1.1
 m 이하이고, 승강장에서 팔레트 또는 벨트가 콤에 들어가기 전 1.6 m 이상의 수평주행






  구간이 있는 경우 공칭속도는 0.9 ㎧까지 허용된다.
  다만, 가속구간이 있거나 무빙워크를 다른 속도로 직접 전환시키는 시스템이 있는 무빙
  워크에는 적용되지 않는다.
                                                    <2013년 9월 15일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.2.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.3','에스컬레이터','2013-09-15','2022-03-01','old','5.4.1.3 주 브레이크와 스텝, 팔레트 또는 벨트 구동기 사이의 연결' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.3','에스컬레이터','2022-03-02',NULL,'current','5.4.1.3 브레이크와 디딤판 구동기 사이의 연결' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.3.1','에스컬레이터','2013-09-15','2022-03-01','old','5.4.1.3.1 주 브레이크와 스텝, 팔레트 또는 벨트 구동기 사이의 연결에는 샤프트, 기어 휠, 다중 체인 또는 2개 이상의
     단일 체인과 같은 비-마찰 구동부품이 사용되어야 한다. 사다리꼴 벨트(평 벨트는 허용 안 됨)와 같은 마찰 부품이
     사용된 경우에는 5.4.2.2에 따른 보조 브레이크가 사용되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.3.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.3.1','에스컬레이터',NULL,'2013-09-14','old','3.3.2(7) 구동체인이 절단되었을 때 동력을 차단하고 역행을 방지하는 장치 또는 상승중 비정상 역행구동시 구동정지와 동시에
    제동역할을 하는 장치. 다만, 수평보행기의 경우에는 그러하지 아니하다.


4.3.1(5) 구동체인 절단시의 정지스위치 및 역행방지장치 또는 제동장치의 작동상태는 양호하여야 한다. 다만, 수평보행기의 경우에는
    그러하지 아니하다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.3.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.3.1','에스컬레이터','2022-03-02',NULL,'current','5.4.1.3.1 브레이크와 디딤판 구동기 사이의 연결에는 축, 기어 휠, 다중 체인 또는 2개
 이상의 단일 체인과 같은 비-마찰 구동부품이 사용되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.3.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.3.2','에스컬레이터','2013-09-15','2022-03-01','old','5.4.1.3.2 모든 구동부품의 안전율은 정적 계산으로 5 이상이어야 한다. 사다리꼴 벨트의 경우에는 3개 이상의 벨트가 적용되어야 한다.
이 안전율은 구동부품의 정지력과 에스컬레이터 또는 경사형 무빙워크가 인장장치의 인장력과 함께 5.2.5에 따른 정격하중
(사람 무게)을 운반할 때 구동부품이 받는 정적인 힘 사이의 비율로 결정된다.
수평한 무빙워크에는 인장장치의 인장력과 함께 5.4.2.1.3.3 또는 5.4.2.1.3.4에 따른 각각의 동적인 힘이 안전율을 결정하는데
사용되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.3.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.3.2','에스컬레이터','2022-03-02',NULL,'current','5.4.1.3.2 모든 구동부품의 설계는 일반적으로 무한 피로 수명에 의해야 한다.
 모든 구동부품의 안전율은 정적 계산으로 5 이상이어야 한다.
 이 안전율은 구동부품의 파단하중과 에스컬레이터 또는 경사형 무빙워크가 인장장치의
 인장력을 포함하여 5.2.5에 따른 구조적 정격하중을 운반할 때 구동부품이 받는 정적인
 하중 사이의 비율로 결정된다.



                                                [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




수평형 무빙워크에는 인장장치의 인장력을 포함한 5.4.2.1.3.3 또는 5.4.2.1.3.4에 따른
각각의 동적인 힘이 안전율을 결정하는데 사용되어야 한다.
비고 구동부품은 축, 기어 휠, 다중 체인 같이 움직이면서 동적으로 하중을 받는 부품이다.
      트러스에 이러한 부품의 고정은 특별한 기준(트러스용 코드, 관련 표준에 따른 용접 및 나사)에 따
      라야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.3.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.4','에스컬레이터','2013-09-15','2022-03-01','old','5.4.1.4 수동 권취 장치
수동 권취 장치가 설치된 경우에는 작동하기 위해 쉽게 접근이 가능하고 안전하여야 한다.
수동 권취 장치가 제거되면, 5.12.1.2.2에 적합한 전기 안전장치[표 5교) 참조]는 수동 권취 장치가 구동기에 끼워질 때 또는
끼워지기 전에 작동되어야 한다.
크랭크(L자형 손잡이) 핸들 또는 구멍이 있는 수동 휠은 허용되지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.4' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.1.4','에스컬레이터','2022-03-02',NULL,'current','5.4.1.4 수동핸들
 수동핸들이 제공되는 경우 쉽게 접근이 가능하고 작동하기에 안전해야 한다.
 수동핸들이 탈착 가능한 경우 5.12.2.7.16에 적합한 안전장치 또는 안전기능이 제공되
 어야 한다.
 크랭크(L자형 손잡이) 핸들 또는 구멍이 있는 수동핸들은 허용되지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.1.4' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.1.1','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.1.1.1 에스컬레이터 및 무빙워크는 균일한 감속 및 정지 상태(제동 운전)를 지속할 수 있는 브레이크 시스템이 있어야
       한다. 또한, 5.12.1.2.4를 참조한다. 브레이크 시스템의 적용에서 의도적인 지연은 없어야 한다.
정지거리가 5.4.2.1.3.2 및 5.4.2.1.3.4의 최대값의 20 %를 초과하면, 고장 안전장치의 재설정[표 5의 거)]후에만 재-기동이
가능하여야 한다. 수동 재설정 전에 브레이크 시스템에 대한 정밀점검이 필요하다면 브레이크 시스템은 정밀하게 조사되어야
하고 정확한 조치가 취해지도록 설계되어야 한다.
에스컬레이터 및 무빙워크의 출발 후에는 브레이크 시스템의 개방을 감시하는 장치가 설치되어야 한다.[표 5의 타) 참조]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.1.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.1.1','에스컬레이터',NULL,'2013-09-14','old','3.3.2(6) 동력이 차단되었을 때 관성에 의한 전동기의 회전을 자동적으로 제지하는 장치' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.1.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.1.1','에스컬레이터','2022-03-02',NULL,'current','5.4.2.1.1.1 에스컬레이터 및 무빙워크는 아래 기능을 가진 브레이크 시스템을 가져야 한다.
 가) 균일한 감속에 따른 안정감
 나) 정지 상태로 유지





  추가로 5.12.3.5 참조' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.1.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.1.2','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.1.1.3 주 브레이크는 전자-기계 브레이크 또는 다른 수단에 의해 유효하여야 한다.
전자-기계 작동 브레이크가 사용되지 않는 경우에는 5.4.2.2에 따른 보조 브레이크가 설치되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.1.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.1.2','에스컬레이터','2022-03-02',NULL,'current','5.4.2.1.1.2 전자-기계 브레이크에 의한 제동 방식
 전자-기계 브레이크에 의한 제동 방식은 5.4.2.1.2의 기준이 적용된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.1.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.1.3','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.1.1.3 주 브레이크는 전자-기계 브레이크 또는 다른 수단에 의해 유효하여야 한다.
전자-기계 작동 브레이크가 사용되지 않는 경우에는 5.4.2.2에 따른 보조 브레이크가 설치되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.1.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.1.3','에스컬레이터','2022-03-02',NULL,'current','5.4.2.1.1.3 전기 브레이크에 의한 제동 방식
 전기 브레이크(인버터로 전기적 제동)는 5.4.2.1.1.1가)의 기준에 충족해야 한다.
 5.4.2.1.2에 따른 전자-기계 브레이크가 요구되며, 5.12.3.5.2의 조건하에서 시작되어져
 야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.1.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.2','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.1.2 전자-기계 브레이크
전자-기계 브레이크의 정상 개방은 지속적인 전류의 흐름에 의해야 한다. 브레이크는 전기적 브레이크 회로가 개방되면 즉시
작동되어야 한다.
제동력은 안내되는 압축 스프링에 의해 발휘되어야 한다. 브레이크 해제장치의 전기적 자체여자의 발생은 불가능하여야 한다.
전원공급은 2개 이상의 독립적인 전기장치에 의해 차단되어야 한다. 이 전기장치는 구동기에 공급되는 전원을 차단할 수 있다.
에스컬레이터 또는 무빙워크가 정지된 후 이 전기장치 중 어느 하나가 개방되지 않으면 재-기동은 방지되어야 한다.(5.4.1.5 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.2','에스컬레이터',NULL,'2013-09-14','old','3.3.2(6) 동력이 차단되었을 때 관성에 의한 전동기의 회전을 자동적으로 제지하는 장치




                                        [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.2','에스컬레이터','2022-03-02',NULL,'current','5.4.2.1.2 전자-기계 브레이크
 전자-기계 브레이크의 정상 개방은 지속적인 전류의 흐름에 의해야 한다.
 브레이크는 브레이크 회로가 개방되면 즉시 작동되어야 한다.
 제동력은 안내되는 압축 스프링에 의해 발휘되어야 한다.
 브레이크 개방장치의 전기적 자체여자의 발생은 불가능해야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.3.1','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.1.3.1 에스컬레이터의 제동부하 결정
표 1은 에스컬레이터의 제동부하 결정에 적용되어야 한다.
                          [ 표 1 - 에스컬레이터의 제동부하 결정 ]

                     공칭 폭 Z1                 스텝 당 제동부하
                    0.6 m 이하                       60 kg
               0.6 m 초과 0.8 m 이하                   90 kg
               0.8 m 초과 1.1 m 이하                   120 kg
고려되는 스텝의 수량은 “스텝 라이저의 최대 외관 높이로 나눈 높이 h13”에 의해 결정된다.(그림 5의 x1 참조)
시험의 목적을 위해, 총 제동부하는 이렇게 얻어진 스텝 수량의 2/3 이상 분포되는 것을 허용한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.3.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.3.1','에스컬레이터','2022-03-02',NULL,'current','5.4.2.1.3.1 에스컬레이터의 제동부하 결정
 표 2는 에스컬레이터의 제동부하 결정에 적용되어야 한다.
                               [표 2 ― 에스컬레이터의 제동부하 결정]

                    공칭 폭                       스텝 당 제동부하
                    0.6 m 이하                         60 ㎏
               0.6 m 초과 0.8 m 이하                     90 ㎏
               0.8m 초과 1.1 m 이하                     120 ㎏

 표 2. 에스컬레이터의 제동부하 결정에 고려되는 스텝의 수량은”층고 을 스텝 라이저의
 최대 외관 높이로 나눈 값”에 의해 결정된다.(그림 8의  참조)
 시험의 목적을 위해, 총 제동부하는 이렇게 얻어진 스텝 수량의 2/3 이상 분포되는 것을
 허용한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.3.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.3.2','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.1.3.2 에스컬레이터의 정지거리
무부하 상태의 에스컬레이터 및 하강 방향으로 움직이는 제동부하 상태(5.4.2.1.3.1 참조)의 에스컬레이터에 대한 정지거리는
표 2에 따라야 한다.
                           [ 표 2 - 에스컬레이터의 정지거리 ]

                     공칭속도 V                        정지거리
                      0.50 ㎧               0.20 m에서 1.00 m 사이
                      0.65 ㎧               0.30 m에서 1.30 m 사이
                      0.75 ㎧               0.40 m에서 1.50 m 사이
공칭속도 사이에 있는 속도의 정지거리는 보간법으로 결정되어야 한다.
정지거리는 전기적 정지장치가 작동된 시간부터 측정되어야 한다.
운행방향에서 하강방향으로 움직이는 에스컬레이터에서 측정된 감속도는 브레이크 시스템이 작동하는 동안 1 ㎨ 이하이어야
한다. 원 감속신호는 4 Hz 2극 버터워스 필터를 사용하는 대역제한신호이어야 한다.
비고 주어진 감속제한 내에서 가능한 가장 짧은 정지거리가 이뤄지는 것이 추천된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.3.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.3.2','에스컬레이터',NULL,'2013-09-14','old','4.3.1(3) 제동기의 설치상태는 견고하고, 작동상태는 양호하여야 한다. 또한, 강도는 적재하중을 작용시키지 않고 디딤판이
     상승할 때의 정지거리가 0.1m 이상 0.6m 이하이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.3.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.3.2','에스컬레이터','2022-03-02',NULL,'current','5.4.2.1.3.2 에스컬레이터의 정지거리
 무부하 상승, 무부하 하강 및 부하 상태(5.4.2.1.3.1 참조) 하강에 대한 에스컬레이터
 정지거리는 표 3에 따라야 한다.

                                [표 3 ― 에스컬레이터의 정지거리 ]

                    공칭속도                           정지거리

                      0.50 ㎧                   0.20 m부터 1.00 m까지

                      0.65 ㎧                   0.30 m부터 1.30 m까지

                      0.75 ㎧                   0.40 m부터 1.50m까지

 공칭속도 사이에 있는 속도의 정지거리는 보간법으로 결정되어야 한다. 정지거리는 전기적
 정지장치가 작동된 시간부터 측정되어야 한다.
 하강방향으로 움직이는 에스컬레이터에서 측정된 감속도는 브레이크 시스템이 작동 하는







  동안 1 ㎨ 이하이어야 한다.
  측정 목적을 위해, 측정 감속신호는 4 ㎐ 이하 통과 2극 버터워스 필터를 사용하여 대역이
  제한되어야 한다.
   비고 주어진 감속제한 내에서 가능한 가장 짧은 정지거리가 이뤄지는 것이 추천된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.3.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.3.3','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.1.3.3 무빙워크의 제동부하 결정
표 3은 무빙워크의 제동부하 결정에 적용되어야 한다.
                            [ 표 3 - 무빙워크의 제동부하 결정 ]

                     공칭 폭 Z1                  0.4 m 길이 당 제동부하
                    0.6 m 이하                          50 kg
               0.6 m 초과 0.8 m 이하                      75 kg
               0.8 m 초과 1.1 m 이하                      100 kg
              1.10 m 초과 1.40 m 이하                     125 kg
              1.40 m 초과 1.65 m 이하                     150 kg
여러 개의 경사(다른 수준)를 갖는 무빙워크의 제동부하 결정은 하강운행 부분만 고려되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.3.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.3.3','에스컬레이터','2022-03-02',NULL,'current','5.4.2.1.3.3 무빙워크의 제동부하 결정

 표 4는 무빙워크의 제동부하 결정에 적용되어야 한다.

                                 [표 4 ― 무빙워크의 제동부하 결정]

                      공칭 폭                     0.4 m 길이 당 제동부하

                      0.6 m 이하                            50 ㎏

                 0.6 m 초과 0.8 m 이하                        75 ㎏

                 0.8 m 초과 1.1 m 이하                    100 ㎏

                1.10 m 초과 1.40 m 이하                   125 ㎏

                1.40 m 초과 1.65 m 이하                   150 ㎏

 여러 개의 경사(층고 차이)를 갖는 무빙워크 길이에 대한 제동부하 결정은 하강 운행부
 분만 고려되어야 한다.




                                                 [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.3.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.3.4','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.1.3.4 무빙워크의 정지거리
무부하 상태의 무빙워크 및 수평 또는 하강 방향으로 움직이는 제동부하 상태(5.4.2.1.3.3 참조)의 무빙워크에 대한 정지거리는
표 4에 따라야 한다.
                         [ 표 4 무빙워크의 정지거리 ]

            공칭속도 V                            정지거리
              0.50 ㎧                   0.20 m에서 1.00 m 사이
              0.65 ㎧                   0.30 m에서 1.30 m 사이
              0.75 ㎧                   0.40 m에서 1.50 m 사이
              0.90 ㎧                   0.55 m에서 1.70 m 사이
공칭속도 사이에 있는 속도의 정지거리는 보간법으로 결정되어야 한다.
정지거리는 전기적 정지장치가 작동된 시간부터 측정되어야 한다.
운행방향에서 하강방향으로 움직이거나 또는 수평으로 움직이는 무빙워크에서 측정된 감속도는 브레이크 시스템이 작동하는
동안 1 ㎨ 이하이어야 한다. 원 감속신호는 4 Hz 2극 버터워스 필터를 사용하는 대역제한신호이어야 한다.
비고 무빙워크 제동시험은 무부하로 충분하며, 주어진 감속제한 내에서 가능한 가장 짧은 정지거리가 되는 것을 추천한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.3.4' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.1.3.4','에스컬레이터','2022-03-02',NULL,'current','5.4.2.1.3.4 무빙워크의 정지거리
 무부하 상승, 무부하 하강 및 부하 상태(5.4.2.1.3.3 참조) 하강에 대한 경사형 무빙워
 크 정지거리는 표 5에 따라야 한다.
 이는 무부하 및 부하상태의 양방향에 대한 수평형 무빙워크에도 적용된다.

                                 [표 5 ― 무빙워크의 정지거리 ]

                    공칭속도                             정지거리

                      0.50 ㎧                    0.20 m부터 1.00 m까지

                      0.65 ㎧                    0.30 m부터 1.30 m까지

                      0.75 ㎧                    0.40 m부터 1.50 m까지

                      0.90 ㎧                    0.55 m부터 1.70 m까지

 공칭 속도 사이에 있는 속도의 정지거리는 보간법으로 결정되어야 한다.
 정지거리는 전기적 정지장치가 작동된 시간부터 측정되어야 한다.
 운행방향에서 하강방향으로 움직이거나 또는 수평으로 움직이는 무빙워크에서 측정된
 감속도는 브레이크 시스템이 작동하는 동안 1 ㎨ 이하이어야 한다.
 측정 목적을 위해 측정 감속신호는 4 ㎐ 이하 통과 2극 버터워스 필터를 사용하여 대역
 이 제한되어야 한다.
 비고 무빙워크 제동시험은 무부하로 충분하며, 주어진 감속제한 내에서 가능한 가장 짧은 정지거리가 되는
       것을 추천한다.
 무빙워크의 경우 제조사는 부하 상태의 정지거리를 계산으로 증명해야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.1.3.4' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.2.1','에스컬레이터','2014-07-01','2022-03-01','old','5.4.2.2.1 에스컬레이터 및 경사형 무빙워크에는 보조 브레이크가 설치되어야 하며, 보조 브레이크와 스텝/팔레트의 구동 스프라켓
또는 벨트의 드럼 사이의 연결은 샤프트, 기어 휠, 다중체인 또는 2개 이상의 단일 체인으로 이뤄져야 한다. 마찰 구동 즉,
클러치로 이뤄진 연결은 허용되지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.2.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2014-07-01' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.2.1','에스컬레이터','2013-09-15','2014-06-30','old','5.4.2.2.1 에스컬레이터 및 경사형 무빙워크에는 다음과 같은 경우에 보조 브레이크가 설치되어야 한다.
가) 주 브레이크(5.4.2.1 참조)와 스텝ㆍ팔레트의 구동 스프라켓 또는 벨트의 드럼 사이의 연결이 샤프트, 기어 휠, 다중체인
   또는 2개 이상의 단일체인으로 이뤄지지 않는 경우, 또는
나) 주 브레이크가 5.4.2.1.2에 따른 전자-기계 브레이크가 아닌 경우, 또는
다) 층고 h13이 6 m를 초과하는 경우(7.2 참조)
라)「교통약자의 이동편의증진법」제2조제3호에 따른 여객시설에 설치되는 경우(부속서 Ⅳ.2.2 참조)
 보조 브레이크와 스텝/팔레트의 구동 스프라켓 또는 벨트의 드럼 사이의 연결은 샤프트, 기어 휠, 다중체인 또는 2개 이상의
 단일 체인으로 이뤄져야 한다. 마찰 구동 즉, 클러치로 이뤄진 연결은 허용되지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.2.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2014-06-30');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.2.1','에스컬레이터',NULL,'2013-09-14','old','3.3.2(7) 구동체인이 절단되었을 때 동력을 차단하고 역행을 방지하는 장치 또는 상승중 비정상 역행구동시 구동정지와 동시에
     제동역할을 하는 장치. 다만, 수평보행기의 경우에는 그러하지 아니하다.


4.3.1(5) 구동체인 절단시의 정지스위치 및 역행방지장치 또는 제동장치의 작동상태는 양호하여야 한다. 다만, 수평보행기의 경우에는
     그러하지 아니하다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.2.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.2.1','에스컬레이터','2022-03-02',NULL,'current','5.4.2.2.1 에스컬레이터 및 경사형 무빙워크에는 보조 브레이크가 설치되어야 하며, 보조
 브레이크와 스텝/팔레트의 구동 스프로킷 또는 벨트의 드럼 사이의 연결은 축, 기어 휠,
 다중체인 또는 2개 이상의 단일체인으로 이루어져야 한다.
 마찰 구동 즉, 클러치로 이뤄진 연결은 허용되지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.2.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.2.2','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.2.2 보조 브레이크 시스템은 제동부하를 갖고 하강 운행하는 에스컬레이터 및 무빙워크를 효과적인 감속에 의해 정지시키고
     정지 상태를 유지할 수 있는 방법으로 설계되어야 한다. 감속도는 1 ㎨ 이하이어야 한다.
보조 브레이크가 작동할 때 주 브레이크에서 규정된 정지거리(5.4.2.1.3.1 참조)를 지킬 필요는 없다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.2.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.2.2','에스컬레이터',NULL,'2013-09-14','old','3.3.2(7) 구동체인이 절단되었을 때 동력을 차단하고 역행을 방지하는 장치 또는 상승중 비정상 역행구동시 구동정지와 동시에
    제동역할을 하는 장치. 다만, 수평보행기의 경우에는 그러하지 아니하다.


4.3.1(5) 구동체인 절단시의 정지스위치 및 역행방지장치 또는 제동장치의 작동상태는 양호하여야 한다. 다만, 수평보행기의 경우에는
    그러하지 아니하다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.2.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.2.2','에스컬레이터','2022-03-02',NULL,'current','5.4.2.2.2 보조 브레이크 시스템은 제동 부하를 갖고 하강 운행하는 에스컬레이터 및 경
 사형 무빙워크가 효과적으로 감속하고 정지상태를 유지할 수 있도록 설계되어야 한다.



                                              [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




하강방향으로 움직일 때 측정한 감속도는 모든 작동 조건 아래에서 1 ㎨ 이하이어야 한다.
측정 목적을 위해, 측정 감속신호는 4 ㎐ 이하 통과 2극 버터워스 필터를 사용하여 대
역이 제한되어야 한다.
보조 브레이크가 작동할 때 브레이크에서 규정된 정지거리(5.4.2.1.3 참조)를 지킬 필요
는 없다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.2.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.2.3','에스컬레이터',NULL,'2013-09-14','old','3.3.2(7) 구동체인이 절단되었을 때 동력을 차단하고 역행을 방지하는 장치 또는 상승중 비정상 역행구동시 구동정지와 동시에
    제동역할을 하는 장치. 다만, 수평보행기의 경우에는 그러하지 아니하다.


4.3.1(5) 구동체인 절단시의 정지스위치 및 역행방지장치 또는 제동장치의 작동상태는 양호하여야 한다. 다만, 수평보행기의 경우에는
    그러하지 아니하다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.2.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.2.3','에스컬레이터','2022-03-02',NULL,'current','5.4.2.2.3 보조 브레이크는 기계적(마찰) 형식이어야 한다.
                                                 <2013년 9월 15일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.2.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.2.4','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.2.4 보조 브레이크는 다음 사항 중 어느 조건에서도 작동되어야 한다.
가) 속도가 공칭속도의 1.4배의 값을 초과하기 전
나) 스텝 및 팔레트 또는 벨트가 현 운행 방향에서 바뀔 때
보조 브레이크의 작동은 제어회로를 확실하게 개방시켜야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.2.4' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.2.4','에스컬레이터',NULL,'2013-09-14','old','3.3.2(7) 구동체인이 절단되었을 때 동력을 차단하고 역행을 방지하는 장치 또는 상승중 비정상 역행구동시 구동정지와 동시에
    제동역할을 하는 장치. 다만, 수평보행기의 경우에는 그러하지 아니하다.


4.3.1(5) 구동체인 절단시의 정지스위치 및 역행방지장치 또는 제동장치의 작동상태는 양호하여야 한다. 다만, 수평보행기의 경우에는
    그러하지 아니하다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.2.4' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.2.4','에스컬레이터','2022-03-02',NULL,'current','5.4.2.2.4 보조 브레이크는 5.12.3.5.3에 따라 정지해야 한다. 보조 브레이크의 작동은
 5.12.2.7.4에 적합한 전기안전장치 또는 안전기능에 의해 감지되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.2.4' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.2.5','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.2.5 보조 브레이크는 정전 또는 안전회로가 차단된 경우에 5.4.2.1.3.2 및 5.4.2.1.3.4에 따른 정지 조건이 유지되면 주
     브레이크와 함께 작동될 수 있다. ; 그렇지 않다면 보조 브레이크 시스템과 주 브레이크 시스템의 동시 작동은
     5.4.2.2.4의 조건하에서만 허용된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.2.5' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.2.5','에스컬레이터',NULL,'2013-09-14','old','3.3.2(7) 구동체인이 절단되었을 때 동력을 차단하고 역행을 방지하는 장치 또는 상승중 비정상 역행구동시 구동정지와 동시에
     제동역할을 하는 장치. 다만, 수평보행기의 경우에는 그러하지 아니하다.


4.3.1(5) 구동체인 절단시의 정지스위치 및 역행방지장치 또는 제동장치의 작동상태는 양호하여야 한다. 다만, 수평보행기의 경우에는
     그러하지 아니하다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.2.5' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.4.2.2.5','에스컬레이터','2022-03-02',NULL,'current','5.4.2.2.5 보조브레이크는 정전 또는 안전회로 차단 시 5.4.2.1.3.2 및 5.4.2.1.3.4에 따
 른 정지조건이 유지되는 경우 브레이크와 동시에 작동되는 것이 허용된다.
 그렇지 않으면 보조브레이크와 브레이크의 동시 작동은 5.4.2.2.4의 조건하에서만 허용
 된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.4.2.2.5' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.4.2.3 과속 및 의도되지 않은 운행 방향의 역전의 위험에 대한 보호


5.4.2.4 과속역행방지장치(보조 브레이크를 포함한다)는 별표 18에 따라 안전성이 입증되
 어야 한다.
                                                      <2019년 3월 28일 이후 건축허가분부터 적용>

5.4.2.5 과속역행방지장치(보조 브레이크를 포함한다)에는 보기 쉬운 곳에 쉽게 지워지지
 않는 방법으로 별표 18에 따른 표시사항이 표시되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2015-05-13','2019-03-27','old','      6.2.9 과속ㆍ역행방지수단
      과속ㆍ역행방지수단에는 다음과 같은 사항이 표시된 명판이 부착되어야 한다.
      가) 제조업체명
      나) 안전인증 표시


5.4.3 스텝 및 팔레트의 구동

5.4.3.1 에스컬레이터의 스텝은 스텝 측면에 각각 1개 이상 설치된 2개 이상의 체인에 의
 해 구동되어야 한다.
 무빙워크의 팔레트는 이용할 수 있는 구역에서 팔레트의 평행한 움직임이 다른 기계적
 인 수단에 의해 보장되는 경우 하나의 체인으로만 구동되는 것이 허용된다.
 5.12.2.7.5에 적합한 안전장치 또는 안전기능은 디딤판체인의 파손 또는 과도한 늘어남
 을 감지하기 위해 제공되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2015-05-13' AND COALESCE(expiry_date,'')='2019-03-27');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','       5.4.3.1 에스컬레이터의 스텝은 스텝 측면에 각각 1개 이상 설치된 2개 이상의 체인에 의해 구동되어야 한다.
       무빙워크의 팔레트는 이용할 수 있는 지점에서 팔레트의 평행한 움직임이 다른 기계적인 수단에 의해 보장되는 경우 하나의
       체인으로만 구동되는 것이 허용된다.




                                                     [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




5.4.3.2 디딤판체인은 일반적으로 무한 피로수명에 의해 설계되어야 하며 다음에 적합해
 야 한다.
 가) 각 체인의 절단에 대한 안전율은 5이상이어야 한다.(5.4.1.3.2 참조)
 나) KS B 6853에 적합해야 한다.
 체인은 인장시험이 수행되어야 한다.
 2개 이상의 체인이 사용될 때 하중은 모든 체인에 균등하게 분포되는 것으로 가정한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.4.3.2 스텝 체인은 일반적으로 무한 피로수명으로 설계되어야 하며 다음 중 어느 하나에 적합하여야 한다. 스텝 체인은
         인장시험이 수행되어야 한다.
     가) KS B 6853에 적합하거나 동등 이상이어야 한다.
     나) 각 체인의 절단에 대한 안전율은 EN 10025-2, EN 10025-3, EN 10025-4, EN 10025-5 및 EN 10025-6과 함께 EN
        10025-1에 따른 구조용 강철과 EN 10083-2 및 EN 10083-3과 함께 EN 80083-1에 따른 담금질한 강철에 대하여 5
        이상이어야 한다. (5.4.1.3.2 참조)
     2개 이상의 체인이 사용될 때 하중은 모든 체인에 균등하게 분포되는 것으로 추정된다.


5.4.3.3 디딤판체인은 지속적으로 인장되어야 한다.
 인장장치의 움직임을 감지하기 위해 5.12.2.7.6에 적합한 안전장치 또는 안전기능이 제
 공되어야한다.
 인장방식의 스프링은 인장장치로 허용되지 않는다.
 무게추가 인장을 위해 사용될 때 무게추의 현수수단이 파손되더라도 안전하게 유지되어
 야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.4.3.3 체인은 지속적으로 인장되어야 한다. 에스컬레이터/무빙워크는 인장장치[표 5의 마) 및 바) 참조]가 ± 20 mm를 초과하여
    움직이기 전에 자동으로 정지되어야 한다. 스프링으로 인장되는 것은 인장장치로 허용되지 않는다. 무게추가 인장을
    위해 사용될 때 무게추의 현수수단이 파손되더라도 안전하게 유지되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2009-11-24','2013-09-14','old','     3.3.2(1) 디딤판체인이 절단되었을 때 디딤판의 승강을 자동적으로 정지시키는 장치


     4.3.2(1) 디딤판체인이 절단되었을 때 작동하는 정지스위치의 설치상태는 견고하고, 작동상태는 양호하여야 한다.


5.4.3.4 디딤판체인은 별표 21에 따라 안전성이 입증되어야 한다.
                                                       <2019년 3월 28일 이후 건축허가분부터 적용>

5.4.3.5 디딤판체인에는 보기 쉬운 곳에 쉽게 지워지지 않는 방법으로 별표 21에 따른 표
 시사항이 표시되어야 한다.
                                                       <2019년 3월 28일 이후 건축허가분부터 적용>

5.4.4 벨트 구동

5.4.4.1 연결부를 포함한 벨트의 안전율은 5.4.2.1.3.3 및 5.4.2.1.3.4에 따른 각각의 동
 적인 힘에 대하여 5 이상(5.4.1.3.2 참조)이어야 한다.
 최악의 조건으로 계산되어야 한다.
                                                       <2013년 9월 15일 이후 건축허가분부터 적용>






 5.4.4.2 벨트는 드럼에 의해 구동되어야 하고 지속적이며 자동으로 인장되어야 한다.
  인장장치의 움직임을 감지하기 위하여 5.12.2.7.6에 적합한 안전장치 또는 안전기능이
  제공되어야 한다.
  인장방식의 스프링은 인장장치로 허용되지 않는다. 무게추가 인장을 위해 사용될 때 무
  게추의 현수수단이 파손되더라도 안전하게 유지되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2009-11-24' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.4.4.2 벨트는 드럼에 의해 구동되어야 하고 지속적으로 인장되어야 한다. 스프링으로 인장되는 것은 인장장치로 허용되지
          않는다. 무게추가 인장을 위해 사용될 때 무게추의 현수수단이 파손되더라도 안전하게 유지되어야 한다.



5.5 난간

5.5.1 일반사항
 난간은 에스컬레이터 또는 무빙워크의 각 측면에 설치되어야 한다.
                                                           <2013년 9월 15일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2007-09-10','2009-11-23','old','      3.3.1(3) 디딤판의 양쪽에 난간을 설치하고 난간 윗부분의 핸드레일과 디딤판이 동일방향 및 동일속도로 움직여야 한다. 다만,
          옥외에 설치되는 경우에는 핸드레일을 고정식으로 할 수 있다.


      4.3.2(7) 고정식 핸드레일의 경우에 난간과 손잡이의 설치상태는 안전하고 견고하여야 한다.




5.5.2 난간 규격

5.5.2.1 경사진 부분에서 스텝 앞부분(step nose)이나 팔레트 표면 또는 벨트 표면에서 손잡
 이 꼭대기까지 수직 높이 은 0.9 m 이상 1.1 m 이하이어야 한다.(그림 5 및 7 참조)
                                                           <2022년 3월 2일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2007-09-10' AND COALESCE(expiry_date,'')='2009-11-23');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2019-03-28','2022-03-01','old','5.5.2.1 경사진 부분에서 스텝 앞부분(step nose)이나 팔레트 표면 또는 벨트 표면에서 손잡이 꼭대기까지 수직 높이  은
    0.9 m 이상 1.1 m 이하이어야 한다.(그림 5 및 6 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2019-03-28' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','       5.5.2.1 경사진 부분에서 스텝 돌출부나 팔레트 표면 또는 벨트 표면에서 핸드레일 꼭대기까지 수직높이 h1은 0.9 m 이상
           1.1 m 이하이어야 한다.(그림 2 및 3 참조)


 5.5.2.2 난간에는 사람이 정상적으로 서 있을 수 있는 부분이 없어야 한다.
  사람이 난간 외부에서 추락할 위험이 있는 경우, 난간 외부로 기어오르는 것을 방지할
  수 있는 적절한 조치가 다음과 같이 구비되어야 한다.


                                                [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




가) 위험을 확실하게 방지하기 위한 기어오름 방지장치(그림 6의 1 참조)가 에스컬레이
      터 및 무빙워크에 있어야 하며, 이 장치는 장치의 바닥이 난간데크와 교차하는 승
      강장 바닥 위로 1,000 ± 50 ㎜의 지점(그림 6의 h9 참조)의 하부 외측데크에 설치
      되어야 하고, 걷는 것이 불가능하도록 난간데크와 평행하게 1,000 ㎜ 이상의 길이
      까지 연장되어야 한다. 이 장치는 b10 및 b12의 기준에 상충되지 않는 손잡이의
      꼭대기 선상 높이 이상으로 연장되어야 한다. 에스컬레이터 또는 무빙워크가 벽 근
      처에 위치한 경우, 난간데크에 접근을 막는 접근 금지장치(그림 6의 2 참조)는 하
      부 외측데크의 폭 b13이 125 ㎜를 초과할 때 이러한 벽의 상‧하부 끝에 설치되어
      야 한다. 인접한 평행 배치에서 이러한 보호는 결합된 난간데크 폭 b14가 125 ㎜를
      초과할 때 설치되어야 한다. 이 장치는 높이 h10 까지 연장되어야 한다. 이 장치의
      모든 노출된 고정장치 헤드는 고의적인 파손을 막는 형식이어야 한다.
나) 손잡이 높이 난간데크가 에스컬레이터 또는 경사형 무빙워크와 근처의 벽                                 사이에
      있는 경우, 건축물(벽)의 구조와 손잡이 중심선 사이의 거리 b15가 300 ㎜ 이상일
      때 미끄럼 방지장치(그림 6의 3 참조)가 난간데크에 설치되어야 한다. 이 장치는
      손잡이까지는 100 ㎜(b17 참조)보다 가깝지 않고 1,800 ㎜보다 크지 않은 일정한
      간격으로 난간데크에 고정된 물체로 구성되어야 한다. 높이 h11은 20 ㎜ 이상이어
      야 한다. 이 장치는 날카로운 구석이나 모서리가 없어야 한다. 또한, 인접한 에스
      컬레이터 또는 경사형 무빙워크의 손잡이 중심선 사이의 거리 b16이 400 ㎜를 초
      과할 경우에도 적용된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.5.2.2 난간에는 사람이 정상적으로 설 수 있는 부분이 없어야 한다.
사람이 난간 외부로 추락하는 위험이 있는 경우, 사람이 난간 외부로 기어오르는 것을 차단할 수 있는 적절한 조치가
다음과 같이 구비되어야 한다.
가) 위험을 확실하게 차단하기 위한 장치(그림 4의 1 참조)가 에스컬레이터 및 무빙워크에 있어야 하며, 이 장치는 장치의
   바닥이 난간데크와 교차하는 승강장 바닥 위로 1,000 ± 50 mm의 지점(그림 4의 h9 참조)의 하부 외측 데크에 설치되어야
   하고, 걷는 것이 불가능한 난간 데크와 평행하게 1,000 mm 이상의 길이 l5까지 연장되어야 한다. 이 장치는 b10 및
   b12의 규정에 상충되지 않는 핸드레일의 꼭대기 선상 높이 이상으로 연장되어야 한다.
   에스컬레이터 또는 무빙워크가 벽 근처에 위치한 경우, 난간 데크에 접근을 막는 장치(그림 4의 2 참조)는 하부 외측 데크의
   폭 b13이 125 mm를 초과할 때 이러한 벽의 상‧하부 끝에 설치되어야 한다. 인접한 평행 배치에서 이러한 보호는 결합된
   난간 데크 폭 b14가 125 mm를 초과할 때 설치되어야 한다. 이 장치는 높이 h10까지 연장되어야 한다.
   이 장치의 모든 노출된 고정 장치 헤드는 고의적인 파손을 막는 형식이어야 한다.
나) 핸드레일 높이 난간 데크가 에스컬레이터 또는 경사형 무빙워크와 근처의 벽 사이에 있는 경우, 건축물(벽)의 구조와
   핸드레일 중안선 사이의 거리 b15가 300 mm 이상일 때 미끄럼 방지장치(그림 4의 3 참조)가 난간 데크에 설치되어야
   한다. 이 장치는 핸드레일까지는 100 mm(b17 참조)보다 가깝지 않고 1,800 mm보다 크지 않은 일정한 간격으로 난간
   데크에 고정된 물체로 구성되어야 한다. 높이 h11은 20 mm 이상이어야 한다. 이 장치는 날카로운 구석이나 모서리가
   없어야 한다.
   미끄럼 방지장치는 또한 인접한 에스컬레이터 또는 경사형 무빙워크의 핸드레일 중앙선 사이의 거리 b16이 400 mm를
   초과하면 설치되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2009-11-24','2013-09-14','old','   4.3.2(15) 안전선반 또는 낙하방지망이 설치되어 있는 경우에 설치상태는 견고하여야 한다.








5.5.2.3 난간은 동일한 장소에서 1 m의 길이에 걸쳐 균등하게 분포되면서 손잡이 주행안
 내 시스템의 꼭대기에 작용하는 600 N의 정적 수평력과 730 N의 수직력을 동시에 견
 디도록 설계되어야 한다.
                                                 <2013년 9월 15일 이후 건축허가분부터 적용>

5.5.2.4 디딤판과 마주하는 난간 부분은 매끄럽고 평평해야 하며, 다음 사항에 적합해야
 한다.
 가) 운행방향이 아닌 곳의 덮개는 3 ㎜ 이상 돌출되지 않아야 한다. 덮개는 견고해야 하
        며 모서리는 둥글거나 경사져야 한다. 이러한 종류의 덮개는 스커트에 허용되지 않
        는다. 운행방향에서 덮개의 연결부분(특히, 스커트와 내부패널 사이)은 끼임의 위험
        을 최소로 줄이는 방법으로 배열되고 설치되어야 한다. 난간의 내부패널 사이의 틈
        새는 4 ㎜ 이하이어야 하며 모서리는 둥글거나 경사져야 한다.
 나) 내부패널은 2,500 ㎟의 원형 또는 정사각형 면적의 어느 지점에서나 표면에 수직
       으로 500 N의 힘을 가할 때 4 ㎜를 초과하는 틈새나 영구적인 변형이 없어야 한다.
 다) 내부패널에 유리가 사용된 경우에는 KS L 2002에 적합하거나 동등이상의 강화유
        리이어야 한다. 단층으로 사용될 경우 최소 6 ㎜의 두께가 적용되어야 한다. 복층의
        유리난간이 사용된 경우에는 접합강화유리이어야 하며, 한 층의 두께는 6 ㎜ 이상
        이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2009-11-24' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.5.2.4 스텝, 팔레트 또는 벨트와 마주하는 난간 부분은 매끄럽고 평면이 이어져야 하고 다음 사항에 적합하여야 한다.
       가) 운행방향이 아닌 곳의 덮개는 3 mm 이상 돌출되지 않아야 한다. 덮개는 견고해야 하며 모서리는 둥글거나 경사져야
            한다. 이러한 종류의 덮개는 스커트에 허용되지 않는다.
             운행방향에서 덮개의 연결부분(특히, 스커트와 내부 패널 사이)은 끼임의 위험을 최소로 줄이는 방법으로 배열되고 설치
             되어야 한다.
             난간의 내부패널 사이의 틈새는 4 mm 이하이어야 하며 모서리는 둥글거나 경사져야 한다.
       나) 내부 패널의 25 ㎠의 어느 지점에 500 N의 힘을 가했을 때 4 mm를 초과하는 틈새는 없어야 하고 영구적인 변형이 없어야
            한다.
       다) 내부패널에 유리가 사용된 경우에는 KS L 2002에 적합하거나 동등 이상의 강화유리이어야 한다. 최소 6 mm의 두께가
            한 층의 난간에 적용되어야 한다. 복층의 유리난간이 사용된 경우에는 접합강화유리이어야 하며, 한 층의 두께는 6 mm
            이상이어야 한다.


5.5.2.5 내부패널의 하부 사이의 수평거리(이동 방향에 수직으로 측정된)는 상부에서 측정
 된 수평거리와 같거나 작아야 한다.
                                                 <2013년 9월 15일 이후 건축허가분부터 적용>

5.5.2.6 하부 내측데크 및 내부패널은 수평에 대해 25 °이상의 경사각 ϒ(그림 6 참조)을
 가져야 한다.
 이것은 내부패널에 직접 연결되는 하부 내측데크의 수평부분(그림 6의 b4 참조)에는 적
 용되지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','       5.5.2.6 하부 내측 데크 및 내부 패널은 수평에 대해 25°이상의 경사각 ϒ(그림 3 참조)을 가져야 한다. 이것은 내부 패널에
           직접 연결되는 하부 내측 데크의 수평부분(그림 3의 b4 참조)에는 적용되지 않는다.




                                                   [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




5.5.2.6.1 하부 내측데크의 내부패널까지 수평부분 b4는 30 ㎜ 이하이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.5.2.6.1 내부 패널까지 수평부분 b4는 30 mm 이하이어야 한다.


5.5.2.6.2 수평에 대해 45 °미만으로 경사진 하부 내측데크의 수평으로 측정된 폭 b3는
 0.12 m 미만이어야 한다.(그림 6 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.5.2.6.2 수평에 대해 45° 미만으로 경사진 각 하부 내측 데크의 수평으로 측정된 폭 b3는 0.12 m 미만이어야 한다.(그림 3 참조)


5.5.3 스커트

5.5.3.1 스커트는 평탄한 수직면의 맞대기 이음이어야 한다.
 비고 긴 무빙워크가 건축물 신축이음(팽창이음) 부위를 통과하는 지점에는 맞대기 이음 대신 특별한 배열
       (슬라이딩 조인트 등)이 필요할 수 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.5.3.1 스커트는 수직이고 평탄하며 맞대기 이음이어야 한다.
비고 긴 무빙워크가 건축물 확장 연결 부위를 통하는 지점에는 맞대기 이음 대신 특별한 배열(슬라이딩 조인트 등)이 필요할
    수 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2001-06-18','2004-11-30','old','     3.3.1(6) 스커트 가드는 다음의 기준에 적합하여야 한다.
     ① 스커트 가드는 수직이어야 하며, 디딤면과 스커트 가드 윗부분까지(덮개가 씌워진 경우에는 덮개 아랫부분까지, 안전보조장치가
       부착된 경우에는 보조장치의 아랫부분까지)의 수직높이는 25mm 이상이어야 한다.


5.5.3.2 스커트의 상부 끝부분 또는 덮개 연결부 또는 스커트 디플렉터의 견고한 부분의
 하부 끝부분과 스텝 앞부분(step nose) 또는 팔레트나 벨트의 트레드 표면 사이의 수직
 거리 h2는 25 ㎜ 이상이어야 한다.(그림 6 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2004-11-30');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.5.3.2 스커트의 상부 끝부분과 덮개 연결부 또는 스커트 디플렉터의 견고한 부분의 하부 끝부분과 스텝 돌출부 또는 팔레트나
         벨트의 트레드 표면의 선상 사이의 수직거리 h2는 25mm 이상이어야 한다.(그림 3 참조)


5.5.3.3 스커트(조명 및 다른 장치 포함)는 2,500 ㎟ 의 정사각 또는 원형 면적에 수직으
 로 가장 약한 지점의 표면에 대해 1,500 N의 집중하중을 가할 때 휨량은 4 ㎜ 이하이
 어야 한다.
 이로 인한 영구변형은 발생되지 않아야 한다. 이는 스텝 앞부분(step nose) 연결선상
 또는 팔레트나 벨트의 트레드 표면으로부터 25 ㎜ 높이까지 적용되어야 한다.
 높이 25 ㎜ 이상에서는 난간에 요구되는 힘 500 N (5.5.2.4 참조)에 대해 충족되어야한
 다.(그림 5 상세도 R 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.5.3.3 스커트는 2,500 ㎟의 사각이나 원형 면적을 사용하여 수직으로 가장 약한 지점의 표면에 1,500 N의 집중하중을 가할 때
    휨량은 4 mm 이하이어야 한다. 이 결과로 인한 영구변형은 발생되지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2001-06-18','2004-11-30','old','       3.3.1(6) 스커트 가드는 다음의 기준에 적합하여야 한다.
       ③ 스커트 가드는 어느 부분에서나 25㎠의 면적에 1500N(153kgf)의 힘을 직각으로 가했을 때 휨량이 4mm 이내이어야 하고,
         시험후 영구변형이 없어야 한다. 다만, 이 시험이 승강기 설계구조상 완성검사시 현장시험이 불가한 경우에는 설계서나
         공인기관 성적서로 확인할 수 있다.


 5.5.3.4 에스컬레이터는 스커트와 스텝 사이에 끼일 가능성이 최소화 되어야 한다.
  이 목적을 위해 다음 4가지 조건이 충족되어야 한다.
  가) 5.5.3.3에 따른 스커트의 충분한 강도
  나) 5.5.5.1에 따른 틈새
  다) 아래의 사항을 만족하는 스커트 디플렉터의 설치
         1) 견고한 부분과 유연한 부분(브러시 또는 고무 재질 등)으로 구성되어야 한다.
         2) 스커트 패널의 수직면으로부터 수평방향으로 최소 33 ㎜, 최대 50 ㎜ 돌출되어
            야 한다.
         3) 견고한 부분의 돌출된 지점에 600 ㎟의 직사각형 면적 위로 견고한 부분의 부착
            선상에 수직으로 균등 분포된 900 N의 힘을 가할 때 떨어지거나 영구적인 변
            형 없이 견뎌야 한다.
         4) 견고한 부분은 18 ㎜와 25 ㎜ 사이의 수평 돌출부가 있어야 하고, 규정된 강도
            를 견뎌야 한다. 유연한 부분의 수평 돌출부는 최소 15 ㎜, 최대 30 ㎜ 이어야
            한다.
         5) 경사구간에서 스커트 디플렉터의 견고한 부분의 아래쪽 가장 낮은 부분과 스텝
            앞부분(step nose) 사이의 수직거리는 25 ㎜와 30 ㎜ 사이이어야 한다.
         6) 천이구간 및 수평구간에서 스커트 디플렉터의 견고한 부분의 아래쪽 가장 낮은
            부분과 스텝 클리트의 꼭대기 사이의 거리는 25 ㎜와 55 ㎜ 사이이어야 한다.
         7) 스커트 패널 수직면에 대해 견고한 부분의 하부표면은 위로 25 °이상 경사져야
            하고 상부 표면은 아래로 25 °이상 경사져야 한다.
         8) 그림 3 가)와 달리, 견고한 부분의 상부에서는 아래로 하부에서는 위로 볼록한
            경사면을 갖는 스커트에 수직인 폭 5 ㎜ 이하의 평평한 표면이 제공되는 것은
            허용된다. 형상은 견고한 부분을 수평투영한 길이의 절반 이상은 25 °경사도를
            가져야 한다.[그림 3 나)]
         9) 견고한 부분의 경사면이 25 °이상의 직선 기울기를 갖고 스커트에 수직방향으로
            평평한 표면이 있는 경우 그 폭은 상부 10 ㎜ 이하, 하부 5 ㎜ 이하까지 허용된
            다.[그림 3 다)]
         10) 스커트 디플렉터는 모서리가 둥글게 설계되어야 한다. 고정장치 헤드 및 접합
             연결부는 운행경로로 연장되지 않아야 한다.
         11) 스커트 디플렉터의 말단 끝부분은 스커트와 동일 평면에 마감되도록 점점 가늘
             어져야 한다. 스커트 디플렉터의 말단 끝부분은 콤 교차선에서 최소 50 ㎜ 이


                              [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




    상, 최대 150 ㎜ 앞에서 마감되어야 한다.
  12) 스커트 디플렉터가 하부 내측데크 연장일 경우에는 5.5.2.6.2가 적용된다. 스
     커트 디플렉터가 스커트에 부착되거나 스커트의 구성부품인 경우에는 5.5.3.1
     이 적용된다.
라) 시험용 윤활제를 이용한 고무 마찰계수를 0.45보다 작게 하기 위하여 디플렉터 아
  래에 적합한 재질 또는 적합한 형식의 안감 사용. 이 고무는 SBR 생고무, 미네랄
  충전재, 가공 첨가제, 밀도가 (1.23 ± 0.2) g/㎤인 가교 결합제 및 KS M ISO
  868에 따른 쇼어 D-경도가 50 ± 3인 SBR 고무로 정의된다.
  시험용 윤활제는 황산 도데실 나트륨(순도 ≥ 99 %) 탈이온수 또는 증류수로 구성
  된 용액으로 정의된다. (시험방법에 대한 정보는 부속서 Ⅸ 참조)




               가)                          나)








                                   다)

       기호설명
       1 유연한 부분
       2 견고한 부분
       a 경사 구간
       b 천이 및 수평 구간
       비고 이 그림은 일정한 비율로 그려져 있지 않고 단지 기준을 설명한다.
                        [그림 3 ― 스커트 디플렉터에 대한 기준]




                                               [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2004-11-30');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.5.3.4 에스컬레이터는 스커트와 스텝 사이에 끼일 가능성이 최소화 되어야 한다.
이 목적을 위해 다음 4가지 사항에 적합하여야 한다.
가) 5.5.3.3에 따른 스커트의 충분한 강도
나) 5.5.5.1에 따른 틈새
다) 아래의 사항을 만족하는 스커트 디플렉터의 설치
 1) 견고한 부분과 유연한 부분(브러시 또는 고무 등)으로 구성되어야 한다.
 2) 스커트 패널의 수직면 돌출부는 최소 33 mm, 최대 50 mm이어야 한다.
 3) 견고한 부분의 부착물 선상에 수직으로 견고한 부분의 돌출된 지점에 600 ㎟의 직사각형 면적 위로 균등하게 분포된
   900 N의 힘을 가할 때 떨어지거나 영구적인 변형 없이 견뎌야 한다.
 4) 견고한 부분은 18 mm와 25 mm 사의 수평 돌출부가 있어야 하고, 규정된 강도를 견뎌야 한다. 유연한 부분의 수평 돌출부는
   최소 15 mm, 최대 30 mm 이어야 한다.
 5) 주행로의 경사진 구간의 전체에 걸쳐 스커트 디플렉터의 견고한 부분의 아래 쪽 가장 낮은 부분과 스텝 돌출부 선상
   사이의 수직거리는 25 mm와 27 mm 사이이어야 한다.
 6) 천이구간 및 수평구간에서 스커트 디플렉터의 견고한 부분의 아래 쪽 가장 낮은 부분과 스텝 클리트의 꼭대기 사이의
   거리는 25 mm와 50 mm 사이이어야 한다.
 7) 견고한 부분의 하부표면은 스커트 패널로부터 상승방향으로 25°이상 경사져야하고 상부표면은 하강방향으로 25°이상
   경사져야 한다.
 8) 스커트 디플렉터는 모서리가 둥글게 설계되어야 한다. 고정 장치 헤드 및 접합 연결부는 운행통로로 연장되지 않아야
   한다.
 9) 스커트 디플렉터의 말단 끝 부분은 스커트와 동일 평면에 접촉되도록 점점 가늘어져야 한다. 스커트 디플렉터의 말단
   끝부분은 콤 교차선에서 최소 50mm 이상, 최대 150mm 앞에서 마감되어야 한다.
 10) 스커트 디플렉터가 하부 내측 데크의 범위까지 확장될 경우에는 5.5.2.6.2가 적용된다.
 11) 스커트 디플렉터가 스커트에 부착되거나 스커트의 구성부품인 경우에는 5.5.3.1이 적용된다.
라) 가죽(젖고 마른), PVC(마른) 및 고무(마른)의 마찰계수를 0.45보다 작게 하기위해 디플렉터 아래에 적합한 재질 또는 적합한
   형식의 안감 사용

                                                                [단위 : mm]




    Key
    1. 유연한 부분
    2. 견고한 부분
    a
        경사진 지역
    b
        천이구간 및 수평구간
                            [ 그림 1 스커트 디플렉터의 요건 ]

[승강기 검사기준] 부칙 <시행 2015. 5. 13.>
제3조(경과조치)
③ 제1항에 불구하고 이 고시 시행 전에 종전의 검사기준을 적용하여 검사를 받고 사용 중인 에스컬레이터의 경우 이 고시
   시행일로부터 1년 이내에 [별표 3] 5.5.3.4 다)에 적합한 스커트 디플렉터를 설치하여야 한다. 다만, 이 고시 시행일 이전에
   설치된 스커트 디플렉터의 경우 이 고시에 의해 설치된 것으로 본다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2001-06-18','2004-11-30','old','      3.3.1(6) 스커트 가드는 다음의 기준에 적합하여야 한다.
      ① 스커트 가드는 수직이어야 하며, 디딤면과 스커트 가드 윗부분까지(덮개가 씌워진 경우에는 덮개 아랫부분까지, 안전보조장치가
        부착된 경우에는 보조장치의 아랫부분까지)의 수직높이는 25mm 이상이어야 한다.
      ② 스커트 가드는 확실하게 고정되어 있어야 하며, 평활하여야 한다.
      ④ 스커트 가드는 마찰계수가 작은 재질을 사용하거나 또는 표면처리된 것을 사용하여야 한다.



<추가 종전 기준>----------------------------------------------' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2004-11-30');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2009-11-24','2013-09-14','old','      3.3.2(4) 승강구의 가까운 위치에서 사람이나 물건이 디딤판 측면과 스커트가드와의 사이에 강하게 끼였을 때 끼인 물체가
           콤플레이트에 도달하기 전에 디딤판의 승강을 자동적으로 정지시키는 장치. 이 장치는 승강로 상하부 좌우측에 각각
           1개소 이상 설치하여야 한다. 다만, 수평보행기의 경우에는 그러하지 아니하다.


      4.3.2(12) 스커트가드스위치의 작동상태는 양호하여야 한다. 다만, 수평보행기는 그러하지 아니하다.


5.5.4 뉴얼

5.5.4.1 손잡이를 포함한 뉴얼은 콤 교차선을 지나 이동방향의 수평 방향으로 0.6 m 이상
  돌출되어야 한다.(그림 5의 L2 및  그리고 상세도 X 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2009-11-24' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.5.4.1 핸드레일을 포함한 뉴얼은 길이 방향으로 0.6 m 이상까지 콤 교차점 선상 뒤에 수평으로 돌출되어야 한다.(그림 2의
          L2 및 l2 그리고 상세도 X 참조)


5.5.4.2 손잡이의 수평부분은 콤 교차선을 지나 0.3 m 이상의 거리  (그림 5 참조)만큼
  승강장에서 길이방향으로 연장되어야 한다.(그림 5의 L2 및 상세도 X 참조)
  승강장에 수평부분이 없는 경사형 무빙워크의 경우 경사도와 평행한 손잡이의 연장은
  허용된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.5.4.2 핸드레일의 수평부분은 콤 교차점 선상을 지나 0.3 m 이상의 거리 l3(그림 2 참조)만큼 승강장에서 길이방향으로 연장되어야 한다.
      승강장에 수평부분이 없는 경사형 무빙워크의 경우 경사각도와 평행한 핸드레일의 연장은 허용된다.


5.5.5 디딤판과 스커트 사이의 틈새

5.5.5.1 에스컬레이터 또는 무빙워크의 스커트가 디딤판 측면에 위치한 경우 수평 틈새는
  각 측면에서 4 ㎜ 이하이어야 하고, 정확히 반대되는 두 지점의 양 측면에서 측정된 틈
  새의 합은 7 ㎜ 이하이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.5.5.1 에스컬레이터 또는 무빙워크의 스커트가 스텝 및 팔레트 또는 벨트 측면에 위치한 곳에서 수평 틈새는 각 측면에서
    4 mm 이하이어야 하고, 정확히 반대되는 두 지점의 양 측면에서 측정된 틈새의 합은 7 mm 이하이어야 한다.



                                         [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2001-06-18','2004-11-30','old','4.3.2(11) 디딤판 상호간의 틈새는 승강로의 총길이에 걸쳐서 2～5㎜의 범위내이어야 한다. 또한, 스커트가드와 디딤판과의
     틈새는 승강로의 총길이에 걸쳐서 한쪽이 4mm 이하이어야 하고, 양쪽을 합쳐서 7mm 이하이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2004-11-30');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','1999-01-14','2001-06-17','old','     4.3.2(11) 디딤판 상호간 또는 스커트가드와 디딤판과의 틈새는 승강로의 총 길이에 걸쳐서 2～5㎜의 범위내이어야 한다.


5.5.5.2 무빙워크의 스커트가 팔레트 또는 벨트 위에서 마감되는 경우, 트레드 표면으로
 부터 수직으로 측정된 틈새는 4 ㎜ 이하이어야 한다.
 팔레트 또는 벨트의 좌우측으로의 움직임은 팔레트 또는 벨트의 측면과 스커트의 수직
 투영면 사이의 틈새를 만들지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1999-01-14' AND COALESCE(expiry_date,'')='2001-06-17');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.5.5.2 무빙워크의 스커트가 팔레트 또는 벨트 위에서 마감되는 경우, 트레드 표면으로부터 수직으로 측정된 틈새는 4 mm
    이하이어야 한다. 측면 방향에서 팔레트 또는 벨트의 움직임은 팔레트 또는 벨트의 측면과 스커트의 수직 돌출부 사이의
    틈새를 만들지 않아야 하다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2001-06-18','2004-11-30','old','4.3.2(11) 디딤판 상호간의 틈새는 승강로의 총길이에 걸쳐서 2～5㎜의 범위내이어야 한다. 또한, 스커트가드와 디딤판과의
     틈새는 승강로의 총길이에 걸쳐서 한쪽이 4mm 이하이어야 하고, 양쪽을 합쳐서 7mm 이하이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2004-11-30');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','1999-01-14','2001-06-17','old','     4.3.2(11) 디딤판 상호간 또는 스커트가드와 디딤판과의 틈새는 승강로의 총 길이에 걸쳐서 2～5㎜의 범위내이어야 한다.



5.6 손잡이 시스템

5.6.1 일반사항
 각 난간의 상부에는 정상운행 조건하에서 디딤판의 속도와 - 0 %에서 + 2 %의 허용오차
 로 같은 방향과 속도로 움직이는 손잡이가 설치되어야 한다.
 손잡이는 정상운행 중 운행방향의 반대편에서 450 N의 힘으로 당겨도 정지되지                               않아
 야 한다.
 5.12.2.7.13에 적합한 손잡이의 속도감시장치 또는 기능이 제공되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1999-01-14' AND COALESCE(expiry_date,'')='2001-06-17');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.6.1.1 각 난간의 꼭대기에는 정상운행 조건하에서 스텝, 팔레트 또는 벨트의 실제 속도와 관련하여 동일 방향으로 - 0 %에서
    + 2 %의 공차가 있는 속도로 움직이는 핸드레일이 설치되어야 한다.
핸드레일은 정상운행 중 운행방향의 반대편에서 450 N의 힘으로 당겨도 정지되지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2004-12-01','2007-09-09','old','      3.3.1(3) 디딤판의 양쪽에 난간을 설치하고 난간 윗부분의 핸드레일과 디딤판이 동일방향 및 동일속도로 움직여야 한다. 다만,
               옥외에 설치되는 경우에는 핸드레일을 고정식으로 할 수 있다.


      4.3.2(4) 이동식 핸드레일은 디딤판과 동일방향 및 동일속도로 승강하여야 한다.


      4.3.2(5) 이동식 핸드레일은 하강운전중 상부 승강장에서 약 15㎏f(147N)의 인력으로 수평으로 당겨도 정지하지 않아야 한다.


      4.3.2(7) 고정식 핸드레일의 경우에 난간과 손잡이의 설치상태는 안전하고 견고하여야 한다.


5.6.2 외형 및 위치

5.6.2.1 난간 위의 손잡이 외형 및 주행안내 장치는 손이나 손가락이 끼거나 끼일 가능성
 을 줄일 수 있는 방법으로 이루어지거나 둘러싸여야 한다.
 손잡이는 인접 표면으로부터 수평으로 80 ㎜(b10) 이상, 수직으로 25 ㎜(b12) 이상 떨어
 져야 한다.
 이 구역의 감소는 그림 6의 상세도 W에서처럼 b18이 8 ㎜보다 클 경우 허용된다. (그림
 6의 W 참조)(손잡이 외형 위의 A지점 - 수직방향으로 손잡이 하부 끝단에서 25 ㎜ 이
 상 아래이고 수평방향으로 손잡이 외부 끝단 이내인 B지점)
 난간의 어떤 지점도 A에서 B까지의 직선보다 위에 있어서는 안된다.
 손잡이 외형과 주행안내 장치 또는 덮개 외형 사이의 거리는 8 ㎜ 이하이어야 한다. (그
 림 6의 b6’및 b6”,상세도 W 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2004-12-01' AND COALESCE(expiry_date,'')='2007-09-09');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','       5.6.2.1 난간 위의 핸드레일 측면 및 핸드레일 측면의 가이드는 손가락 또는 손이 끼일 가능성을 줄일 수 있는 방법으로 이루어지거나
           둘러싸여야 한다.
       핸드레일 측면과 가이드 또는 덮개 측면 사이의 거리는 8 mm 이하이어야 한다.(그림 3의 b6′ 및 b6″, 상세도 W 참조)



                                                    [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




5.6.2.2 손잡이 폭 b2는 70 ㎜와 100 ㎜ 사이이어야 한다.(그림 6, 상세도 W 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.6.2.2 핸드레일 폭 b2는 70 mm와 100 mm 사이이어야 한다.(그림 3, 상세도 W 참조)


5.6.2.3 손잡이와 난간 끝부분 사이의 거리 b5는 50 ㎜ 이하이어야 한다.(그림 6 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.6.2.3 핸드레일과 난간 끝부분 사이의 거리 b5는 50 mm 이하이어야 한다.(그림 3 참조)


5.6.3 손잡이 중심선 사이의 거리
 손잡이 중심선 사이의 거리 b1은 스커트 사이의 거리보다 0.45 m를 초과하지 않아야 한
 다.(그림 6의 b1 및  참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.6.3 핸드레일 중심선 사이의 거리
     핸드레일 중심선 사이의 거리 b1은 스커트 사이의 거리보다 0.45 m를 초과하지 않아야 한다. (그림 3의 b1 및 Z2 참조)


5.6.4 손잡이 입구

5.6.4.1 뉴얼 안에 들어가는 손잡이 입구의 최하점은 마감된 바닥으로부터 0.1 m 이상,
 0.25 m 이하의 거리 h3에 있어야 한다.(그림 5 및 6 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.6.4.1 뉴얼 안에 들어가는 핸드레일 입구의 최하점은 마감된 바닥으로부터 0.1 m 이상, 0.25 m 이하의 거리 h3에 있어야 한다.
     (그림 2 및 3 참조)


5.6.4.2 손잡이가 도달되는 가장 먼 지점과 뉴얼 안에 들어가는 입구 사이의 수평거리는
 0.3 m 이상이어야 한다.(그림 5 참조)
 가 ( -  + 50 ㎜)보다 크면 손잡이는 수평으로 측정하여 20 °이상의 각도 α로 난
 간 안에 들어가야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.6.4.2 핸드레일에 도달되는 가장 먼 지점과 뉴얼 안에 들어가는 입구 점 사이의 수평거리 l4는 0.3 m 이상이어야 한다.(그림 2 참조)
     l4가 (l2 - l3 + 50 mm)보다 크면 핸드레일은 수평으로 측정하여 20°이상의 각도 α로 난간 안에 들어가야 한다.


5.6.4.3 뉴얼 안에 들어가는 손잡이 입구에는 손가락 및 손의 끼임을 방지하는 보호장치
 가 설치되어야 하고, 5.12.2.7.9에 따른 안전장치 또는 안전기능이 제공되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.6.4.3 뉴얼 안에 들어가는 핸드레일 입구 점에는 손가락 및 손의 끼임을 방지하는 가이드가 설치되어야 한다. 또한, 표 5의 자)에
    따른 스위치가 설치되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2009-11-24','2013-09-14','old','    3.3.2(5) 사람이나 물건이 핸드레일 인입구에 끼였을 때 디딤판의 승강을 자동적으로 정지시키는 장치


    4.3.2(6) 이동식 핸드레일의 인입구에는 적절한 보호장치가 설치되어 있고, 핸드레일 인입구 정지스위치의 작동상태는 양호
         하여야 한다.








5.6.5 주행안내 장치
 손잡이는 정상운행 중에 손잡이가 주행안내 장치로부터 이탈되지 않도록 안내되고 인장
 되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2009-11-24' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.6.5 가이드
      핸드레일은 정상운행 동안, 핸드레일이 핸드레일의 가이드로부터 이탈되지 않는 방법으로 안내되고 인장되어야 한다.



5.7 승강장

5.7.1 표면 특징

 에스컬레이터 및 무빙워크의 승강장(즉, 콤 플레이트 및 승강장 플레이트)은 콤의 빗살
 에서 측정하여 0.85 m 이상이고, 안전한 발판을 제공하는 표면을 가져야 한다.(그림 5
 의 L1 및 상세도 X 참조)
 다만, 5.7.3에서 기술된 콤은 제외된다.
  비고 재료 및 시험방법의 정의에 대해서는 부속서 Ⅷ 참조' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.7.1 표면 특징
      에스컬레이터 및 무빙워크의 승강장(즉, 콤 플레이트 및 바닥 플레이트)은 콤의 빗살에서 측정하여 0.85 m 이상이고, 안전한
      발판이 설치되어야 한다.(그림 2의 L1 및 상세도 X 참조) 다만, 5.7.3에서 기술된 콤은 제외된다.


5.7.2 디딤판의 구성

5.7.2.1 에스컬레이터의 스텝은 승강장에서 콤을 떠나는 스텝의 전면 끝부분 및 콤에 들
 어가는 스텝의 후면 끝부분이 L1의 지점에서 측정하여 길이 0.8 m 이상으로 수평하게
 운행하도록 안내되어야 한다.(그림 5 및 상세도 X 참조)
 공칭속도가 0.5 ㎧를 초과하고 0.65 ㎧ 이하이거나 층고 h13이 6 m를 초과하는 경우, 이
 길이는 L1의 지점에서 측정하여 1.2 m 이상이어야 한다.(그림 5 및 상세도 X 참조)
 공칭속도가 0.65 ㎧를 초과하는 경우, 이 길이는 L1의 지점에서 측정하여 1.6 m 이상이
 어야 한다.(그림 5 및 상세도 X 참조)
 수평주행구간에서 연속된 두 스텝간의 수직높이 편차는 4 ㎜까지 허용된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.7.2.1 에스컬레이터의 스텝은 승강장에서 콤을 떠나는 스텝의 전면 끝부분 및 콤에 들어가는 스텝의 후면 끝부분이 L1의
     지점에서 측정하여 길이 0.8 m 이상으로 수평하게 움직이는 방법으로 안내되어야 한다.(그림 2 및 상세도 X 참조)
공칭속도가 0.5 ㎧를 초과하고 0.65 ㎧ 이하이거나 층고 h13이 6 m를 초과하는 경우, 이 길이는 L1의 지점에서 측정하여 1.2 m
이상이어야 한다.(그림 2 및 상세도 X 참조)
공칭속도가 0.65 ㎧를 초과하는 경우, 이 길이는 L1의 지점에서 측정하여 1.6 m 이상이어야 한다.(그림 2 및 상세도 X 참조)
연속된 두 스텝간의 수직높이 편차는 4 mm까지 허용된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2001-06-18','2004-11-30','old','       3.3.1(8) 디딤판끼리의 높이차가 4mm 이하인 수평주행구간의 길이는 0.8m 이상이어야 한다. 다만, 정격속도가 30m/min를 초과하거나
            층고가 6m를 초과하는 경우에는 1.2m 이상으로 하여야 한다.




                                                        [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




5.7.2.2 에스컬레이터의 경우, 경사부에서 수평부로 전환되는 천이구간의 곡률반경은 다음
 과 같아야 한다.
 가) 상부 천이구간의 곡률반경
       1) 공칭속도() ≤ 0.5 ㎧(최대 경사도 35 °) : 1 m 이상
       2) 0.5 ㎧ < 공칭속도() ≤ 0.65 ㎧ (최대 경사도 30 °) : 1.5 m 이상
       3) 공칭속도() > 0.65 ㎧(최대 경사도 30 °) : 2.6 m 이상
 나) 하부 천이구간의 곡률반경
       1) 공칭속도() ≤ 0.65 ㎧ : 1 m 이상
       2) 공칭속도() > 0.65 ㎧ : 2 m 이상' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2004-11-30');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.7.2.2 에스컬레이터의 경우, 경사부에서 수평부로 전환되는 상부 천이구간의 곡률반경은 다음과 같아야 한다.
- 공칭속도 V ≤ 0.5 ㎧(최대 경사도 35°) : 1 m 이상
- 0.5 ㎧ ＜ 공칭속도 V ≤ 0.65 ㎧(최대 경사도 30°) : 1.5 m 이상
- 공칭속도 V ＞ 0.65 ㎧(최대 경사도 30°) : 2.6 m 이상
 에스컬레이터의 경사 부분에서 수평 부분으로 전환되는 하부 천이구간의 곡률반경은 공칭속도 0.65 ㎧까지는 1 m 이상이고
 0.65 ㎧를 초과하면 2 m 이상이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2001-06-18','2004-11-30','old','     3.3.1(9) 내리는 부분의 천이구간(경사부에서 수평부로 변하는 구간)의 곡률반경은 다음 기준에 적합하여야 한다. 다만, 이 시험이
         승강기 설계구조상 완성검사시 현장시험이 불가한 경우에는 설계서나 공인기관 성적서로 확인할 수 있다.
     ① 상승용 에스컬레이터의 상부 천이구간의 곡률반경은 정격속도가 30m/min 이하인 경우에는 1.0m 이상, 정격속도가
       30m/min를 초과하는 경우에는 1.5m 이상으로 하여야 하며, 하강용 에스컬레이터의 하부 천이구간의 곡률반경은 정격속도에
       관계없이 1.0m 이상으로 하여야 한다.


5.7.2.3 벨트식 무빙워크의 경우, 경사부에서 수평부로 전환되는 천이구간의 곡률반경은 0.4
 m 이상이어야 한다.
 팔레트식 무빙워크의 경우, 2개의 연속되는 팔레트 사이의 최대 허용거리(5.3.5 참조)는
 항상 충분히 크기 때문에 곡률반경의 결정은 필요하지 않다.
                                                         <2013년 9월 15일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2004-11-30');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2001-06-18','2004-11-30','old','     3.3.1(9) 내리는 부분의 천이구간(경사부에서 수평부로 변하는 구간)의 곡률반경은 다음 기준에 적합하여야 한다. 다만, 이 시험이
         승강기 설계구조상 완성검사시 현장시험이 불가한 경우에는 설계서나 공인기관 성적서로 확인할 수 있다.
     ② 벨트방식 수평보행기의 경우 천이구간의 곡률반경은 0.4m 이상으로 하여야 한다. 다만, 팰릿 타입은 서로 인접한 디딤판의
       틈새가 규정치를 만족하면 천이구간의 곡률반경은 항상 크게 되므로 규정하지 않는다.


5.7.2.4 경사도가 6 °이상인 무빙워크의 상부 승강장에서, 팔레트 또는 벨트는 콤에 들어
 가기 전 또는 콤을 떠난 후 0.4 m 이상의 길이를 경사각 6 °이하로 움직여야 한다.
 5.7.2.1에 유사하게, 팔레트식 무빙워크에 대한 움직임은 다음과 같이 규정된다.
 콤을 벗어나는 팔레트의 전면 끝부분 및 콤에 들어가는 팔레트의 후면 끝부분은 각도의
 변화 없이 0.4 m 이상으로 운행되어야 한다.
                                                         <2013년 9월 15일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2004-11-30');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2001-06-18','2004-11-30','old','      3.3.1(8) 디딤판끼리의 높이차가 4mm 이하인 수평주행구간의 길이는 0.8m 이상이어야 한다. 다만, 정격속도가 30m/min를 초과하거나
           층고가 6m를 초과하는 경우에는 1.2m 이상으로 하여야 한다.


5.7.2.5 트레드 표면의 홈과 콤의 빗살의 정확한 맞물림(5.7.3.3 참조)을 보장하는 장치가
 콤 구역에 만들어져야 한다.
 벨트는 이 구역에서 적절한 방법(드럼, 롤러, 슬라이딩 플레이트 등)에 의해 지지되어야
 한다. 5.12.2.7.10에 적합한 안전장치 또는 안전기능이 제공되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2004-11-30');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.7.2.5 트레드 표면의 홈과 콤의 빗살의 정확한 맞물림(5.7.3.3 참조)을 보장하는 장치가 콤 구역에 만들어져야 한다.
벨트는 이 구역에서 적절한 방법(드럼, 롤러, 슬라이딩 플레이트 등)에 의해 지지되어야 한다.
스텝 또는 팔레트의 어느 부분이 처져서 콤의 맞물림이 더 이상 보장되지 않으면 에스컬레이터 및 무빙워크를 정지시키는
표 5의 차)에 따른 안전장치가 설치되어야 한다. 이 안전장치는 쳐진 스텝 또는 팔레트가 콤 교차점 선상에 닿지 않도록 하
기 위해 콤 교차점 선상 앞에 충분한 거리를 두고 각 변환 곡선 앞에 배열(5.4.2.1.3.2 및 5.4.2.1.3.4 참조)되어야 한다.
감시 장치가 스텝 또는 팔레트의 어느 지점에 적용될 수 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','1997-08-18','1999-01-13','old','3.3.2(9) 승강로의 상하부의 좌우에 고정되어 디딤판이 들려지는 상태에서의 운행이탈을 감지하여 디딤판의 승강을 제어하여
    정지시키는 장치. 다만, 수평보행기의 경우에는 그러하지 아니하다.


4.3.2(13) 고무벨트의 양단에는 마모와 분리됨이 없어야 한다.
① 고무벨트가 절단되었을 때 작동하는 정지스위치의 설치상태는 견고하고, 작동상태는 양호하여야 한다.
② 고무벨트의 본체 및 엔들레스 접합부에는 부분적인 균열 및 손상이 없어야 한다.
③ 고무벨트의 엔들레스 접합부는 분리되지 않고, 요철 및 펄럭거림 등이 없어야 한다.
④ 고무벨트의 양단에는 마모와 분리됨이 없어야 한다.
⑤ 고무벨트와 디딤지지판의 접촉면에는 마찰저항을 줄이기 위한 조치가 되어 있어야 한다.
⑥ 고무벨트의 주행상태는 양호하고, 프레임과의 접촉 및 노킹현상이 없어야 한다.
⑦ 고무벨트의 좌우 움직임을 방지하기 위한 가이드롤러의 설치상태는 견고하고, 작동상태는 양호하여야 한다.
⑧ 고무벨트의 양단과 가이드롤러는 보호커버에 의해서 외부에 노출되지 않아야 한다.


4.3.2(17) 승강로의 상하부 좌우측에 고정되어 디딤판과 가이드레일 사이에 이물질 등이 끼이는 경우에 디딤판이 들려지는
     상태에서의 운행이탈을 감지하여 디딤판의 승강을 자동적으로 제어하여 정지시키는 장치의 작동상태는 양호하여야
     한다. 다만, 수평보행기의 경우에는 그러하지 아니하다.




                                           [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1997-08-18' AND COALESCE(expiry_date,'')='1999-01-13');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터',NULL,'1997-08-17','old','      4.3.2(13) 고무벨트의 양단에는 마모와 분리됨이 없어야 한다.
      ① 고무벨트가 절단되었을 때 작동하는 정지스위치의 설치상태는 견고하고, 작동상태는 양호하여야 한다.
      ② 고무벨트의 본체 및 엔들레스 접합부에는 부분적인 균열 및 손상이 없어야 한다.
      ③ 고무벨트의 엔들레스 접합부는 분리되지 않고, 요철 및 펄럭거림 등이 없어야 한다.
      ④ 고무벨트의 양단에는 마모와 분리됨이 없어야 한다.
      ⑤ 고무벨트와 디딤지지판의 접촉면에는 마찰저항을 줄이기 위한 조치가 되어 있어야 한다.
      ⑥ 고무벨트의 주행상태는 양호하고, 프레임과의 접촉 및 노킹현상이 없어야 한다.
      ⑦ 고무벨트의 좌우 움직임을 방지하기 위한 가이드롤러의 설치상태는 견고하고, 작동상태는 양호하여야 한다.
      ⑧ 고무벨트의 양단과 가이드롤러는 보호커버에 의해서 외부에 노출되지 않아야 한다.


5.7.3 콤

5.7.3.1 일반사항
 콤은 이용자의 이동을 용이하게 하기 위해 승강장에 설치되어야 하며, 쉽게 교체될 수
 있어야 한다.
                                                   <2013년 9월 15일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='1997-08-17');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2009-11-24','2013-09-14','old','  3.3.2(8) 상하 승강장에서 디딤판과 콤플레이트 사이에 사람이나 물건이 끼이지 않도록 하는 장치


5.7.3.2 설계

5.7.3.2.1 콤의 빗살은 디딤판의 홈(5.7.3.3 참조)에 맞물려야 한다. 콤 빗살의 폭은 트레
 드 표면에서 측정하여 2.5 ㎜ 이상이어야 한다.(그림 5, 상세도 X 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2009-11-24' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.7.3.2.1 콤의 빗살은 스텝, 팔레트 또는 벨트의 홈(5.7.3.3 참조)에 맞물려야 한다. 콤 빗살의 폭은 트레드 표면에서 측정하여
     2.5 mm 이상이어야 한다.(그림 2, 상세도 X 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2001-06-18','2004-11-30','old','4.3.2(8) 승강장에서는 물체가 쉽게 끼어 들어가지 않도록 디딤판과 콤(Comb)의 물림량은 6mm 이상(벨트방식의 경우에는
     4mm 이상)이어야 하고, 맞물리는 부분의 틈새는 4mm 이하이어야 한다.


3.3.2(8) 상하 승강장에서 디딤판과 콤플레이트 사이에 사람이나 물건이 끼이지 않도록 하는 장치' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2004-11-30');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','1999-01-14','2001-06-17','old','      4.3.2(8) 디딤판과 상하 승강장의 물림이 충분하고, 물체가 쉽게 끼어 들어가지 않아야 한다.


      3.3.2(8) 상하 승강장에서 디딤판과 콤플레이트 사이에 사람이나 물건이 끼이지 않도록 하는 장치


5.7.3.2.2 콤의 끝은 둥글게 하고 콤과 디딤판 사이에 끼이는 위험을 최소로 하는 형상
 이어야 한다.
 빗살 끝의 반경은 2 ㎜ 이하이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1999-01-14' AND COALESCE(expiry_date,'')='2001-06-17');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.7.3.2.2 콤의 끝은 둥글게 하고 콤과 스텝, 팔레트 또는 벨트 사이에 끼이는 위험을 최소로 하는 형상이어야 한다. 빗살의
           반경은 2 mm 이하이어야 한다.


5.7.3.2.3 콤의 빗살은 에스컬레이터 또는 무빙워크에서 내리는 이용자의 발이 콤에 걸리






  지 않도록 하는 형상과 기울기를 가져야 한다.
  그림 5, 상세도 X에서 보여주는 설계 각도 β는 35 °이하이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.7.3.2.3 콤의 빗살은 에스컬레이터 또는 무빙워크에서 내리는 이용자의 발이 콤에 채이지 않도록 형상과 기울기를 가져야 한다.
      그림 2, 상세도 X에서 보여주는 설계 각도 β는 35° 이하이어야 한다.


5.7.3.2.4 콤 또는 콤의 지지구조는 정확히 물리는 것이 보장되도록 조정되는 구조이어야
 한다.(그림 5, 상세도 X 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.7.3.2.4 콤 또는 콤의 지지구조는 정확히 물리는 것이 보장되도록 조정되는 구조이어야 한다.(그림 2, 상세도 X 참조)


5.7.3.2.5 콤에 이물질이 낄 때, 콤의 빗살은 이물질이 빗겨가게 하거나 맞물리는 홈에
 있게 하거나, 또는 부서지도록 설계되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.7.3.2.5 콤은 이물질이 낄 때 콤의 빗살이 이물질을 저지하면서 스텝, 팔레트 또는 벨트의 홈에 물린 채로 있게 하거나, 또는
           콤의 빗살이 깨지도록 설계되어야 한다.


5.7.3.2.6 5.12.2.7.7에 적합한 안전장치 또는 안전기능이 제공되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.7.3.2.6 5.7.3.2.5에서 설명된 방법으로 처리되지 않고 이물질이 끼고 콤ㆍ스텝ㆍ팔레트에 충격이 가해지면 에스컬레이터 또는
          무빙워크는 자동으로 정지되어야 한다.[표 5의 사) 참조]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2001-06-18','2004-11-30','old','3.3.2(10) 디딤판과 콤(Comb)이 맞물리는 지점에 물체가 끼였을 때 디딤판의 승강을 자동적으로 정지시키는 장치


4.3.2(9) 디딤면 구조상 콤브(Comb)를 설치할 수 없는 구조인 경우에 승강장에 물체가 끼었을 때 작동하는 정지스위치의 설치상태는
     견고하고, 작동상태는 양호하여야 한다.


4.3.2(19) 디딤판과 콤(Comb)이 맞물리는 지점에 물체가 끼였을 때 디딤판의 승강을 자동적으로 정지시키는 정지스위치의 설치상태는
     견고하고, 작동상태는 양호하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2004-11-30');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','1999-01-14','2001-06-17','old','      4.3.2(9) 디딤면 구조상 콤브(Comb)를 설치할 수 없는 구조인 경우에 승강장에 물체가 끼었을 때 작동하는 정지스위치의 설치상태는
           견고하고, 작동상태는 양호하여야 한다.


5.7.3.3 콤이 홈에 맞물리는 깊이

5.7.3.3.1 트레드 홈에 맞물리는 콤 깊이 h8(그림 5, 상세도 X)은 4 ㎜ 이상이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1999-01-14' AND COALESCE(expiry_date,'')='2001-06-17');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.7.3.3.1 트레드 홈에 맞물리는 콤 깊이 h8(그림 2, 상세도 X)은 4 mm 이상이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2001-06-18','2004-11-30','old','4.3.2(8) 승강장에서는 물체가 쉽게 끼어 들어가지 않도록 디딤판과 콤(Comb)의 물림량은 6mm 이상(벨트방식의 경우에는
     4mm 이상)이어야 하고, 맞물리는 부분의 틈새는 4mm 이하이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2004-11-30');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','1999-01-14','2001-06-17','old','       4.3.2(8) 디딤판과 상하 승강장의 물림이 충분하고, 물체가 쉽게 끼어 들어가지 않아야 한다.




                                                       [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




5.7.3.3.2 틈새 h6(그림 5, 상세도 X 참조)은 4 ㎜ 이하이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1999-01-14' AND COALESCE(expiry_date,'')='2001-06-17');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.7.3.3.2 틈새 h6(그림 2, 상세도 X 참조)은 4 mm 이하이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2001-06-18','2004-11-30','old','4.3.2(8) 승강장에서는 물체가 쉽게 끼어 들어가지 않도록 디딤판과 콤(Comb)의 물림량은 6mm 이상(벨트방식의 경우에는
     4mm 이상)이어야 하고, 맞물리는 부분의 틈새는 4mm 이하이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2004-11-30');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','1999-01-14','2001-06-17','old','     4.3.2(8) 디딤판과 상하 승강장의 물림이 충분하고, 물체가 쉽게 끼어 들어가지 않아야 한다.



5.8 기계류 공간 및 구동ㆍ순환 장소

5.8.1 일반사항
 이 공간(기계실)은 에스컬레이터 또는 무빙워크의 운전, 점검 등 유지관리 업무에 필요
 한 설비만 수용하는데 이용되어야 한다.
 화재경보시스템, 직접 소화설비 및 스프링클러 헤더는 우발적 손상에 대해 충분히 보호
 된 경우 및 점검 등 유지관리 업무를 위해 추가적인 위험이 발생하지 않는 경우에만 이
 공간에 설치될 수 있다.
 움직이고 회전하는 부품 특히, 다음과 같은 부품에는 KS B ISO 12100, 6.3에 따라
 효과적으로 보호 및 방호되어야 한다.
 가) 축의 키 및 스크류
 나) 체인, 벨트
 다) 기어, 기어 휠, 스프로킷
 라) 돌출된 전동기 축
 마) 둘러싸지 않은 과속조절기
 바) 점검 등 유지관리 업무를 위해 출입해야하는 구동ㆍ순환 장소에 있는 스텝 및 팔레트의 역전
 사) 수동핸들 및 브레이크 드럼' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1999-01-14' AND COALESCE(expiry_date,'')='2001-06-17');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.8.1 일반사항
이 공간(기계실)은 에스컬레이터 또는 무빙워크의 운전, 유지보수 및 점검에 필요한 설비만 수용하는데 이용되어야 한다.
화재경보시스템, 직접 소화설비 및 스프링클러 헤더는 우발적 손상에 대해 충분히 보호된 경우 및 유지보수 운전을 위해 추가적인
위험이 발생하지 않는 경우에는 이 공간에 설치될 수 있다.
움직이고 회전하는 부품 특히, 다음과 같은 부품에는 KS B ISO 12100-2, 5항에 따라 효과적으로 보호 및 방호되어야 한다.
가) 샤프트의 키 및 스크류
나) 체인, 벨트
다) 기어, 기어 휠, 스프라켓
라) 돌출된 전동기 샤프트
마) 조속기
바) 유지보수를 위해 출입해야하는 구동ㆍ순환 장소에 있는 스텝 및 팔레트의 역전
사) 수동 휠 및 브레이크 드럼' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2009-11-24','2013-09-14','old','      4.1.1(3) 전동기?제동기 및 권상기
      ① 전동기 및 권상기의 설치상태는 견고하고, 지진 기타의 진동에 의해 움직이거나 넘어지지 않는 조치가 되어 있어야 한다.


5.8.2 치수 및 설비

5.8.2.1 기계류 공간 내부(특히, 트러스)의 구동ㆍ순환 장소에서 충분히 서 있을 수 있는
 공간은 영구적으로 설치된 부품으로부터 자유로워야 한다.
 서 있을 수 있는 면적의 크기는 0.3 m2 이상이고 작은 변의 길이는 0.5 m 이상이어야
 한다. 단, 영구적으로 설치된 부품이 최대 반경 0.25 m의 둥근 모서리 뒤에 위치하고
 서 있을 수 있는 면적 위로 0.12 m 이상 높이 위치하는 경우, 이 공간에 영구적으로
 설치된 부품을 둘 수 있다.(그림 4 참조)




                               [그림 4 ― 서 있을 수 있는 공간]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2009-11-24' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.8.2.1 구동기 공간 내부(특히, 트러스)의 구동ㆍ순환 장소에서 충분히 서 있을 수 있는 공간은 영구적으로 설치된 부품으로부터
          여유가 있어야 한다. 서 있을 수 있는 면적의 크기는 0.3 ㎡ 이상이고 작은 변의 길이는 0.5 m 이상이어야 한다.


5.8.2.2 점검 등 유지관리 목적을 위해 제어 캐비닛(제어반)을 움직이거나 들어 올려야 하는
 경우에는 들어 올리는 적당한 장치(아이볼트, 핸들 등)가 제공되어야 한다.
                                                   <2013년 9월 15일 이후 건축허가분부터 적용>

5.8.2.3 구동기 또는 브레이크가 디딤판의 이용자 측면과 순환 선 사이에 배치되는 경우,
 작업구역에 서 있을 수 있는 최소 치수가 0.3 m 이상이고 0.12 m2 이상의 수평 면적이
 있어야 한다.
 이 구역은 고정되거나 제거되는 것이 허용된다.
  비고 기계류 공간을 위한 기준 I.3 참조' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','       5.8.2.3 주 구동기 또는 브레이크가 스텝, 팔레트 또는 벨트의 이용자 측면과 순환 선 사이에 배치되는 경우, 작업구역에 서
           있을 수 있는 0.12 ㎡ 이상의 수평 면적이 있어야 한다. 그 폭은 0.3 m 이상이어야 한다. 서 있을 수 있는 구역은 고정되거나
           제거되는 것이 허용된다.
       비고 기계실 공간을 위한 규정 7.3 참조




                                             [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




5.8.3 조명 및 콘센트

5.8.3.1 전기조명 및 콘센트는 에스컬레이터 또는 무빙워크의 주 개폐기 앞에 연결된 개
 별 케이블 또는 분기 케이블에 의해 구동기의 전원공급과는 독립적이어야 한다.
 별도의 차단기에 의해 모든 조명 및 콘센트의 전원공급 차단이 가능해야 한다.
 (5.11.3.1 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.8.3.1 전기조명 및 콘센트는 에스컬레이터 또는 무빙워크의 주 개폐기 앞에 연결된 개별적 케이블 또는 분기 케이블에
         의해 공급되는 구동기의 전원공급과는 독립적이어야 한다. 독립된 차단기에 의해 모든 단계의 전원공급 차단이 가능
         하여야 한다.(5.11.4.1 참조)


5.8.3.2 트러스 내부의 구동ㆍ순환 장소 및 기기 공간 중 한 곳에 영구적으로 사용가능한
 휴대용 조명이 비치되어야 하고, 각 장소에는 1개 이상의 콘센트가 제공되어야 한다.
 작업공간의 조도는 200 ㏓ 이상이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.8.3.2 트러스 내부의 구동ㆍ순환 장소 및 구동기 공간의 전기 조명장치는 이 장소 중 한 곳에 영구적으로 설치되어야 하며
        휴대용 전구에 의해 이용 가능하여야 한다. 작업공간의 조도는 200 Lux 이상이어야 한다. 또한, 1개 이상의 콘센트가
        이 장소에 각각 있어야 한다.


5.8.3.3 콘센트는 다음 중 어느 하나와 같이 공급되어야 한다.
 가) 2P + PE(2극+접지), 250V로 직접 공급
 나) KS C IEC 60364-4-41에 따른 안전 초저전압(SELV)으로 공급
                                              <2013년 9월 15일 이후 건축허가분부터 적용>


5.9 화재 보호
 화재보호 및 건물에 대한 다음의 요구조건을 권장한다.
 에스컬레이터 및 무빙워크는 화재가 발생할 경우 추가적인 위험이 발생하지 않는 재질
 로 만들어지는 것을 추천한다.
 화재 위험을 피하려면 5.2.1.4. 참조해야 한다.
 내‧외측 데크, 트러스, 스텝/팔레트 및 트랙 시스템은 EN 13501-1, 11.5에 따른 등
 급 C 이상이어야 한다.
 일반적으로          분류되지        않은   재료의   경우,   EN   13501-1:2007+A1:2009   (EN
 13823:2010 +A1:2014[2]에 따른 SBI 시험)에 따라 적합성 시험을 수행해야 한다.
 트레드 표면 또는 라이저에 플라스틱 부품이 있는 스텝 및 팔레트의 경우, 플라스틱 부
 품이 있는 부분이 스텝 또는 팔레트의 수직 위치에 시험 표면이 형성되도록 하고 이 시
 험을 수행해야 한다.
 운행방향으로 플라스틱 삽입/부품이 연속 배치된 구성에서는 전체 시험 표면을 플라스틱 삽입
 재료만으로 EN 13501-1:2007+A1:2009 (EN 13823:2010+A1:2014에 따른 SBI 시
 험)에 따라 시험을 수행해야 한다.






   비고 연속적인 배치란 트레드와 라이저에 플라스틱 삽입부품이 장착된 스텝 그리고 운행방향으로 플라스
         틱 삽입부품이 있는 팔레트를 지칭한다. 스텝과 팔레트 사이의 간격은 연속적인 배치의 중단으로
         간주되지 않는다.
  스프링클러 또는 물 분무 시스템을 사용하는 경우, 에스컬레이터 및 무빙워크의 결합
  및 고정은 기기의 특수한 기준을 고려해야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.9 화재 보호
      에스컬레이터 및 무빙워크는 화재가 발생한 경우 추가적인 위험이 없도록 고려되어야 한다.
      비고 내‧외측 데크, 트러스, 스텝/팔레트 및 트랙 시스템은 EN 13501-1, 11.5에 따른 등급 C 이상을 추천한다.



5.10 운송
 사람의 힘으로 운반할 수 없는 에스컬레이터/무빙워크 완제품 또는 구성품은 다음과 같
 아야 한다.
 가) 양중장치 또는 운송수단에 의해 운반할 수 있는 고정설비 장착, 또는
 나) 상기의 고정설비가 장착될 수 있는 방법(나사 구멍 등)으로 설계, 또는
 다) 양중장치 또는 운송수단에 쉽게 장착될 수 있는 형상' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','       5.10 운송
       손으로 다룰 수 없는 완전히 조립된 에스컬레이터/무빙워크 또는 에스컬레이터/무빙워크의 부품은 다음과 같아야 한다.
       가) 양중장치 또는 운송수단에 의해 운반할 수 있는 고정설비 장착, 또는
       나) 상기의 고정설비가 장착될 수 있는 방법(나사 구멍 등)으로 설계, 또는
       다) 양중장치 또는 운송수단에 쉽게 장착될 수 있는 형상




                                       [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




       주요 치수               항목             주요 치수             항목

   b7 5 ㎜에서 7 ㎜까지
                         5.3.2.2.5       h8 ≥ 4 ㎜         5.7.3.3.1
  (스텝 트레드 및 팔레트)


  b7 4.5 ㎜에서 7 ㎜까지
                         5.3.2.3.2        h13 층고             －
        (벨트)


  b8 2.5 ㎜에서 5 ㎜까지
                         5.3.2.2.7    L1 콤의 빗살의 밑바닥          －
  (스텝 트레드 및 팔레트)


  b8 4.5 ㎜에서 8 ㎜까지
                         5.3.2.3.4      L2 콤 교차선             －
        (벨트)


 h1 0.9 m에서 1.1 m까지       5.5.2.1     지지물 사이의 수평거리         －

 h3 0.1 m에서 0.25 m까지      5.6.4.1         ≥ 0.6 m        5.5.4.1

     h4 ≥ 2.3 m            I.2.1          ≥ 0.3 m        5.5.4.2

     h5 ≥ 0.3 m            I.2.4          ≥ 0.3 m        5.6.4.2

      h6 ≤ 4 ㎜           5.7.3.3.2        α 경사도              －

      h7 ≥ 10 ㎜
                         5.3.2.2.6       β ≤ 35 °         5.7.3.2.3
  (스텝 트레드 및 팔레트)

    h7 ≥ 5 ㎜(벨트)         5.3.2.3.3

비고 이 그림은 일정한 비율로 그려져 있지 않고, 단지 기준을 설명한다.


                  [그림 5 ― 에스컬레이터(입면도), 주요 치수]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','                        [ 그림 2 - 에스컬레이터(입면도) 주요 치수 ]




                                     [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




          주요치수          항목                  주요치수            항목

b7 5 mm에서 7 mm까지      5.3.2.2.5   h8 ≥ 4 mm               5.7.3.3.1
   (스텝 발판 및 팔레트)


b7 4.5 mm에서 7 mm까지    5.3.2.3.2   h13 높이                     -
   (벨트)


b8 2.5 mm에서 5 mm까지    5.3.2.2.7   L1 콤 이빨의 밑바닥               -
   (스텝 발판 및 팔레트)


b8 4.5 mm에서 8 mm까지    5.3.2.3.4   L2 콤 교차선                   -
   (벨트)


h1 0.9 m에서 1.1 m까지    5.5.2.1     I1 지지물사이의 수평거리             -


h3 0.1 m에서 0.25 m까지   5.6.4.1     I2 ≥ 0.6 m               5.5.4.1


h4 ≥ 2.3 m             7.2.1      I3 ≥ 0.3 m               5.5.4.2


h5 ≥ 0.3 m             7.2.4      I4 ≥ 0.3 m               5.6.4.2


h6 ≤ 4.0 m            5.7.3.3.2   α 경사각도                     -


h7 ≥ 10 mm            5.3.2.2.6   β ≤ 35°                 5.7.3.2.3
     (스텝 발판 및 팔레트)


h7 ≥ 5mm(벨트)          5.3.2.2.3








  기호설명
  1 기어오름 방지장치(5.5.2.2)             3 미끄럼 방지장치(5.5.2.2)
  2 접근금지 장치(5.5.2.2)               4 삼각부 막는 조치(I.2.4)

               주요 치수                    항목                   주요 치수               항목

   b13, b14, b15, b16                 5.5.2.2      h10 ＝ 25 ㎜에서 150 ㎜까지        5.5.2.2

   b17 ≥ 100 ㎜                        5.5.2.2      h11 ≥ 20 ㎜                  5.5.2.2

   h5 ≥ 0.3 m                          Ⅰ.2.4        ≥ 1000 ㎜                 5.5.2.2

   h9 ＝ (1000±50) ㎜                   5.5.2.2      b10 ≥ 80 ㎜                   Ⅰ.2.2

   비고 이 그림은 일정한 비율로 그려져 있지 않고, 단지 기준을 설명한다.


                         [그림 6 ― 에스컬레이터/무빙워크(단면도), 주요 치수]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','               Key
               1. 기어오름 방지장치(5.5.2.2)            3. 미끌림 방지장치(5.5.2.2)
               2 접근금지 장치(5.5.2.2)               4. 수직 디플렉터(7.2.4)
                        주요치수            항목                  주요치수            항목
              b13, b14, b15, b16      5.5.2.2     h10 = 25 mm에서 150 mm까지   5.5.2.2
              b17 ≥ 100 mm            5.5.2.2     h11 ≥ 20 mm              5.5.2.2
              h5 ≥ 0.3 m               7.2.4      l5 ≥ 1,000 mm            5.5.2.2
              h9 = (1000±50) mm       5.5.2.2
                                     [ 그림 4 - 오용 방지장치 ]




                                                   [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




기호설명

1    스커트(5.5.3)                        3   내부패널(5.5.2.4)

2a 하부 내측데크(5.5.2.6)                    4   외부패널(5.2.1.2)

2b 하부 외측데크(5.5.2.2)                    5   난간데크(5.5.2.2)


         주요 치수            항목           주요 치수        항목             주요 치수       항목
    b1 ≤ ＋0.45 m       5.6.3
                                    b6’ ≤ 8 ㎜                 h3   0.10 m에서
    b2 70 ㎜에서                                      5.6.2.1                    5.6.4.1
                        5.6.2.2     b6” ≤ 8 ㎜                      0.25 m까지
    100 ㎜까지
    b3 <0.12 m                                     5.6.2.1,
                        5.5.2.6.2 b12 ≥ 25 ㎜                  ≤ ＋7 ㎜,
    ( 가 45°보다 작은 경우)                               Ⅰ.2.2
                                                                              5.5.5.1
    b4 <30 ㎜                        b18 ≥ 8 ㎜      5.6.2.1    스커트 사이의 거리
                        5.5.2.6.1
                                    h1 0.90 m에서
    b5 ≤50 ㎜            5.6.2.3                    5.5.2.1     ≥ 25 °        5.5.2.6
                                       1.10 m까지
                                    h2 ≥ 25 ㎜      5.5.3.2
    비고 이 그림은 일정한 비율로 그려져 있지 않고, 단지 기준을 설명한다.


                                    [그림 7 ― 오용 방지장치]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','          주요치수             항목              주요치수        항목            주요치수          항목

    b1 ≤ Z2 + 0.45 m       5.6.3      b6′+ b6″≤ 8 mm   5.6.2.1
                                                                  Z2 = Z1+7 mm ;
    b2   70 mm에서                      b12 ≥ 25 mm                       스커트
                          5.6.2.2                      7.2.2
         100 mm까지                                                       사이의        5.5.5.1
                                                                        거리
    b3 < 0.12 m                       h1   0.9 m에서     5.5.2.1
                          5.5.2.6.2
    (ϒ가 45°보다 작은 경우)                       1.1 m까지

    b4 < 30 mm            5.5.2.6.1   h2 ≥ 25 mm       5.5.3.1    ϒ ≥ 25°          5.5.2.6

                                      h3   0.1 m에서
    b5 ≤ 50 mm            5.6.2.3                      5.6.4.1
                                           0.25 m까지


                  [ 그림 3 - 에스컬레이터/무빙워크(단면도), 주요 치수 ]




기호설명
1 스텝 트레드 표면
2 스텝 라이저 표면

                  주요 치수                                            항목

x1 ≤ 0.24 m                                                      5.3.2.2.1

y1 ≥ 0.38 m                                                      5.3.2.2.2

z1 0.58 m에서 1.1 m                                                5.3.2.1

비고 이 그림은 일정한 비율로 그려져 있지 않고, 단지 기준을 설명한다.


                            [그림 8 ― 스텝, 주요 치수]




                                    [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','Key
1. 스텝 트레드
2. 스텝 라이저

                       주요치수                      항목

         x1 ≤ 0.24 m                           5.3.2.2.1

         y1 ≥ 0.38 m                           5.3.2.1.2

         z1   0.58 m에서 1.1 m                    5.3.2.

                        [ 그림 5 - 스텝, 주요 치수 ]




  [그림 9 ― 팔레트, 상하부 승강장 및 천이구간에서 틈새 및 맞물림 깊이
           (맞물리는 홈이 없는 무빙워크의 팔레트 형식)]








     [그림 10 ― 팔레트, 상하부 승강장 및 천이구간에서 틈새 및 맞물림 깊이
              (맞물리는 홈이 있는 무빙워크의 팔레트 형식)]




                             [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','                                           [ 단위 : mm ]




[ 그림 6 - 팔레트, 상하부 승강장 및 천이구간에서 틈새 및 맞물림 깊이
       (맞물린 전후 끝부분 없는 무빙워크의 팔레트 형식) ]


                                           [ 단위 : mm ]




[ 그림 7 - 팔레트, 상하부 승강장 및 변이 곡선에서 틈새 및 맞물림 깊이
       (맞물린 전후 끝부분이 있는 무빙워크의 팔레트 형식) ]







  기호설명

               기호 설명                       항목

      z3 지지롤러사이의 가로 거리                   5.3.3.2.4
   비고 이 그림은 일정한 비율로 그려져 있지 않고, 단지 기준을 설명한다.

                 [그림 11 ― 벨트(단면도), 단일 힘]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','                           양/지시에 대한 기호                         항목

                         Z3 지지롤러사이의 가로 거리                    5.3.3.2.4

                               [ 그림 8 - 벨트(단면도), 단독 힘 ]


5.11 전기설비 및 전기기구

5.11.1 일반사항

5.11.1.1 에스컬레이터 또는 무빙워크의 전기설비는 사용법에 맞게 사용되고 전기적 장치
 로부터 발생되는 위험 또는 외부 영향에 의한 위험으로부터 보호되도록 설계되어야 한다.
 따라서, 전기설비는 다음과 같아야 한다.
 가) 사용목적이 적절해야 한다.


                                                [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




나) 한국산업표준(KS) 또는 국가통합인증(KC)에 적합해야 한다.
다) 나)를 적용할 수 없는 경우, 국제전기표준(IEC)에 적합해야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.11.1.1 에스컬레이터 또는 무빙워크의 전기설비는 사용법에 맞게 사용되고 전기적 장치로부터 발생되는 위험 또는 외부 영향에
          의한 위험으로부터 보호되도록 설계되어야 한다.
     따라서 전기설비는 다음과 같아야 한다.
     가) 한국산업표준(KS) 또는 국제전기표준(IEC)을 근거로 한다.
     나) KS 또는 IEC 표준이 없는 경우에는 유럽전기표준(CENELEC)을 참조한다.


5.11.1.2 적용 범위

5.11.1.2.1 전기설비의 설치 및 구성부품과 관련한 이 기준은 다음과 같이 적용한다.
 가) 에스컬레이터 또는 무빙워크의 독립적인 각각의 동력회로(구동기, 열 시스템 등) 및
       종속회로의 주(전원) 개폐기
 나) 에스컬레이터 또는 무빙워크의 조명회로 및 종속회로에 대한 개폐기
 에스컬레이터 또는 무빙워크는 일체화된 장치의 기계로서 전체적으로 동일하게 고려되
 어야 한다.
                                                   <2013년 9월 15일 이후 건축허가분부터 적용>

5.11.1.2.2 5.11.1.2.1에서 기술된 개폐기의 입력단자에 공급되는 전원과 기계류 공간 및
 구동ㆍ순환 장소의 조명에 공급되는 전원은 이 기준을 적용하지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.11.1.2.2 5.11.1.2.1에서 기술된 개폐기 및 차단기의 입력단자에 공급되는 전원 그리고 구동기 공간 및 구동·순환 장소의 조명에
                공급되는 전원은 이 규정을 적용하지 않는다.


5.11.1.2.3 전자기적 적합성은 KS B 6945 및 KS B 6955에 적합하거나 동등 이상이어
 야 한다.
                                                   <2013년 9월 15일 이후 건축허가분부터 적용>
5.11.1.3 직접 접촉에 대한 보호
 직접 접촉에 대비한 보호는 KS C IEC 60204-1, 6.2에 적합하거나 동등 이상이어야 한다.
                                                   <2013년 9월 15일 이후 건축허가분부터 적용>

5.11.1.4 절연저항 시험
 전도체와 전도체, 전도체와 대지사이의 절연저항은 KS C IEC 60204-1, 18.3에 적합
 하거나 동등 이상이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.11.1.4 전기설비의 절연저항
전도체와 전도체, 전도체와 대지사이의 절연저항은 1,000 [Ω/V] 이상이어야 한다.
동력회로, 안전회로 및 기타 회로의 절연저항은 전기가 통하는 각각의 전도체와 접지 사이에서 측정되어 다음과 같아야 한다.
가) 동력회로 및 안전회로의 절연저항은 0.5 ㏁ 이상이어야 한다.
나) 기타 회로(제어, 조명 및 신호 등)의 절연저항은 0.25 ㏁ 이상이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','1997-08-18','1999-01-13','old','       4.3.1(1) 절연저항은 각회로마다 각각 표 10의 규정에 합격하여야 한다. 다만, 절연저항은 개폐기 또는 과전류차단기로 구획할
           수 있는 전로마다 검사할 수 있다.




       비고 1. 절연저항을 구하는 방법은 4.1.1(2)④의 비고에 따른다.
       비고 2. 에스컬레이터의 측면 등을 조명하는 순시가동열 음극형광전등(소위 슬림라인램프로 칭하는 것)의 회로 사용전압
              구분은 일차측(저압측)의 전압으로 한다.


       4.3.1(2) 옥외에 설치되는 경우에는 다음 ①～③을 추가하여 검사한다.
       ① 배전선과 배관의 접속 및 취부상태는 견고하여야 한다.
       ② 접지선의 취부상태는 견고하고, 접지저항은 표 11의 규정에 합격하여야 한다.




       ③ 기타 전기설비에 대해서는 상공자원부고시 제1993-70호(1993. 9. 3)에 의한 전기설비기술기준에 적합하여야 한다.




                                                           [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




5.11.1.5 제어회로 및 안전회로의 전압 제한
 제어회로 및 안전회로의 경우 전도체와 전도체 사이 또는 전도체와 접지 사이의 직류
 전압값 또는 교류 전압 실효값은 250 V 이하이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1997-08-18' AND COALESCE(expiry_date,'')='1999-01-13');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.11.1.5 제어회로 및 안전회로의 전압범위
      제어회로 및 안전회로의 경우 전도체와 전도체 사이 또는 전도체와 접지 사이의 직류 전압 평균값 및 교류 전압 실효값은
      250 V 이하이어야 한다.


5.11.1.6 중성 및 접지 연속성을 위한 도체
 중성 및 접지 연속성 도체는 KS C IEC 60204-1, 8에 적합하거나 동등 이상이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.11.1.6 중성 및 접지 도통을 위한 도체
      접지-도통 도체는 KS C IEC 60204-1, 8에 적합하거나 동등 이상이어야 한다.


5.11.2 접촉기, 릴레이, 고장안전회로의 부품

5.11.2.1 접촉기 및 릴레이

5.11.2.1.1 구동기를 정지시키기 위한 주(전원) 접촉기는 KS C IEC 60947-4-1에 규정
 한 대로 다음과 같은 범주에 속해야 한다.
 가) 교류 전동기용 접촉기 : AC-3
 나) 직류 동력용 접촉기 : DC-3
                                                             <2013년 9월 15일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2009-11-24','2013-09-14','old','     4.1.1(2) 수전반?주개폐기?제어반?전기배관 및 배선
      ③ 제어반상의 각 스위치의 접점 및 작동상태는 양호하여야 한다.


5.11.2.1.2 릴레이는 KS C IEC 60947-5-1에 규정한 대로 다음과 같은 범주에 속해야 한다.
 가) 교류 제어회로용 릴레이 : AC-15
 나) 직류 제어회로용 릴레이 : DC-13
                                                             <2013년 9월 15일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2009-11-24' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2009-11-24','2013-09-14','old','     4.1.1(2) 수전반?주개폐기?제어반?전기배관 및 배선
      ③ 제어반상의 각 스위치의 접점 및 작동상태는 양호하여야 한다.


5.11.2.1.3 주 접촉기(5.11.2.1.1)는 5.12.1.2.2에 적합하기 위해 취해진 수단에서 다음과
 같아야 한다.
 가)     만약     주     접점     중    하나가       닫힌다면(A접점),           모든      상호     B접점(KS        C   IEC
       60947-4-1, 부속서 F)은 개방되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2009-11-24' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','    5.11.2.1.3 주 접촉기(5.11.2.1.1) 및 릴레이-접촉기(5.11.2.1.2) 모두는 5.12.1.1.2에 적합하기 위해 취해진 수단에서 다음과 같아야 있다.
     가) 브레이크 접점(B 접점) 중 1개가 닫히면, 모든 메이크 접점(A 접점)은 개방
     나) 메이크 접점(A 접점) 중 1개가 닫히면, 모든 브레이크 접점(B 접점)은 개방








5.11.2.1.4 릴레이(5.11.2.1.2) 및 안전 릴레이(EN 50205), 즉 강제 유도(기계적 링크)
 접점이 있는 릴레이는 5.12.1.2.2에 적합하기 위해 취해진 수단에서 다음과 같아야 한다.
 가) B 접점 중 1개가 닫히면, 모든 A 접점은 개방 (KS C IEC 60947-5-1)
 나) A 접점 중 1개가 닫히면, 모든 B 접점은 개방 (KS C IEC 60947-5-1)
  비고 주 접촉기 또는 릴레이에 별도 블록으로 추가되어 사용되는 보조 접점은 KS C IEC 60947-5-1의
        기준을 충족할 때에만 허용된다.
                                                       <2019년 3월 28일 이후 건축허가분부터 적용>

5.11.2.2 고장안전회로의 부품

5.11.2.2.1 5.11.2.1.2에 따른 소자가 고장안전회로에 릴레이로 사용될 때, 5.11.2.1.3의
 규정이 적용되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.11.2.2.1 5.11.2.1.2에 따른 릴레이-접촉기가 안전회로에 계전기로 사용될 때, 5.11.2.1.3의 규정이 적용되어야 한다.


5.11.2.2.2 사용된 릴레이가 전기자의 어떤 위치에 대해서도 브레이크 접점과 메이크 접
 점이 동시에 닫히지 않는 경우, 전기자의 부분적인 인력의 가능성은 무시될 수 있
 다.[5.12.1.2.2 바) 참조]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.11.2.2.2 어떤 전기자의 위치에서 브레이크 접점과 메이크 접점이 동시에 닫히지 않는 릴레이가 사용될 경우, 전기자의 부분적인
                 당김력의 가능성[5.12.1.1.2바)]는 무시될 수 있다.


5.11.2.2.3 전기안전장치 뒤에 연결된 장치는 연면거리 및 공극(분리거리가 아님)에 대해
 5.12.2.6.1.3의 규정을 만족해야 한다. 다만, 이 규정은 5.11.2.1에서 기술된 장치에는
 적용하지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.11.2.2.3 전기안전장치 뒤에 연결된 장치는 연면거리 및 공극(분리거리가 아님)에 대해 5.12.1.2.2.3의 규정을 만족하여야 한다.
       다만, 이 규정은 5.11.2.1에서 기술된 장치에는 적용하지 않는다.


5.11.3 주 개폐기

5.11.3.1 구동기 근처나 순환 장소 또는 제어장치의 근처에는 전동기, 브레이크 개방장치
  및 활성화된 제어회로에 공급되는 전원을 차단할 수 있는 주 개폐기가 설치되어야 한다.
  이 개폐기는 점검 등 유지관리 업무에 필요한 콘센트 또는 전기조명회로에 공급되는 전
  원을 차단시키지 않아야 한다.(5.8.3 참조)
  난방시스템, 난간 조명 및 콤 조명과 같은 보조설비에 별도의 전원이 공급될 때, 각각
  독립적으로 차단되는 것이 가능해야 한다.
  해당 개폐기는 주 개폐기와 가깝게 위치되어야 하고 확실히 구별되도록 표시되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.11.4.1 구동기 근처나 순환 장소 또는 제어장치의 근처에는 전동기, 브레이크 개방장치 및 활성 전도체의 제어회로에 공급되는
         전원을 차단할 수 있는 주 개폐기가 설치되어야 한다.
 이 개폐기는 점검 및 유지보수에 필요한 콘센트 또는 전기조명회로에 공급되는 전원을 차단시키지 않아야 한다.(5.8.3 참조)
 가열, 난간 조명 및 콤 조명과 같은 보조설비에 분기된 전원이 공급될 때 각각 독립적으로 차단되는 것이 가능하여야 한다.
 각각의 스위치는 주 개폐기와 가깝게 위치되어야 하고 확실히 구별되도록 표시되어야 한다.



                                              [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2009-11-24','2013-09-14','old','     4.1.1(2) 수전반?주개폐기?제어반?전기배관 및 배선
     ① 수전반 및 주개폐기는 원칙적으로 기계실 출입구 내부 가까이 설치하고, 안전하고 용이하게 조작되도록 하여야 한다.
     ② 제어반 기타의 제어장치의 설치상태는 견고하고, 지진 기타의 진동에 의해 움직이거나 넘어지지 않는 조치가 되어 있어야
        한다.


5.11.3.2 5.11.3.1에서 규정된 주 개폐기는 외부인의 부주의한 작동을 방지하기 위해 “구
 획된” 장소에 자물쇠 또는 이와 동등한 것을 사용한 잠금장치가 있어야 한다. (KS C
 IEC 60204-1, 5.3.3 참조)
 주 개폐기의 조작 장치는 문 또는 트랩문이 열린 후 쉽고 빠르게 접근 가능한 위치에
 있어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2009-11-24' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.11.4.2 5.11.4.1에서 규정된 주 개폐기는 외부인의 부주의한 작동을 방지하기 위해(KS C IEC 60204-1, 5.3.3 참조) “구획된”
            장소에 자물쇠 또는 이와 동등한 것을 사용한 잠금장치가 있어야 한다. 주 개폐기의 조작 장치는 문 또는
            트랩문이 열린 후 쉽고 빠르게 접근 가능한 위치에 있어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2009-11-24','2013-09-14','old','     4.1.1(2) 수전반?주개폐기?제어반?전기배관 및 배선
     ① 수전반 및 주개폐기는 원칙적으로 기계실 출입구 내부 가까이 설치하고, 안전하고 용이하게 조작되도록 하여야 한다.
     ② 제어반 기타의 제어장치의 설치상태는 견고하고, 지진 기타의 진동에 의해 움직이거나 넘어지지 않는 조치가 되어 있어야 한다.


5.11.3.3 주 개폐기는 에스컬레이터 또는 무빙워크의 정상적인 운전조건에서 수반되는 최
 대 전류를 차단할 수 있어야 한다.
 주 개폐기는 KS C IEC 60204-1, 5의 요건에 적합하거나 동등 이상이어야 한다.
                                                       <2013년 9월 15일 이후 건축허가분부터 적용>

5.11.3.4 여러 대의 에스컬레이터 또는 무빙워크의 주 개폐기가 함께 있을 때 각각의 에
 스컬레이터 또는 무빙워크의 주 개폐기가 쉽게 구별되도록 표시되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2009-11-24' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.11.4.4 여러 대의 에스컬레이터 또는 무빙워크의 주 개폐기가 모두 같은 위치에 있을 때 각각의 에스컬레이터 또는 무빙워크의
          주 개폐기가 쉽게 구별되도록 표시되어야 한다.



5.11.4 전기 배선

5.11.4.1 전도체 및 케이블
 전도체 및 케이블은 KS C IEC 60204-1, 12에 적합해야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.11.5.1.1 케이블은 한국산업표준에 의해 표준화된 것을 사용하거나 KS C IEC 60227-3 또는 KS C IEC 60245-4에 적합하거나
              동등 이상의 것이 선택되어야 한다.


5.11.4.2 전도체의 단면적
 적절한 기계적 강도를 보장하기 위해 전도체의 단면적은 KS C IEC 60204-1, 표 5에
 제시된 것보다 커야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.11.5.1.2 KS C IEC 60227-3에 적합하거나 동등 이상의 케이블은 금속이나 플라스틱 재질의 전선관에 설치되거나 기타
             동등한 방법으로 설치되어야 한다. 다만, KS C IEC 60227-3에 부적합한 케이블인 경우에는 전도체의 공칭단면
             적은 0.75 ㎟ 이상이어야 한다.


      5.11.5.2 전도체의 단면적
      안전회로의 전도체 단면적은 기계적 강도를 제공하기 위해 0.75 ㎟ 이상이어야 한다.


5.11.4.3 배선 방법

5.11.4.3.1 KS C IEC 60204-1, 13.1.1, 13.1.2 및 13.1.3의 일반 기준이 적용된다.
                                                          <2019년 3월 28일 이후 건축허가분부터 적용>

5.11.4.3.2 전도체나 케이블은 전선관이나 전선 덕트 또는 이와 동등한 기계적 보호장치
 에 설치되어야 한다.
 움직이는 부분 등과 같이 우발적인 손상을 방지하기 위해 전선관 이나 전선 덕트 없이
 이중 절연 전도체 및 이중 절연 케이블을 설치할 수 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.11.5.1.3 KS C IEC 60245-4에 적합하거나 동등 이상의 단단한 케이블은 벽에 고정된 보이는 설치대에 사용되거나 덕트,
             플라스틱 케이스 또는 유사한 고정설비에 설치되어야 한다.


5.11.4.3.3 다음과 같은 경우, 5.11.4.3.2 기준은 적용되지 않는다.
 가) 안전장치에 연결되지 않은 전도체 또는 케이블 중
        1) 100 VA를 초과하는 정격출력을 받지 않고
        2) SELV 또는 PELV 회로의 일부인 경우
 나) 캐비닛 또는 패널 내의 작동 또는 배전장치의 배선
        1) 전기설비의 서로 다른 부품 사이, 또는
        2) 이러한 전기설비와 연결 단자 사이' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.11.5.1.5 5.11.5.1.2, 5.11.5.1.3 및 5.11.4.1.4의 규정은 다음과 같은 경우 제어 캐비닛 또는 패널에서 제어배선 또는 배전장치에
                                   적용될 필요는 없다.
      가) 전기설비의 서로 다른 부품 사이, 또는
      나) 설비 부품과 접속단자 사이


5.11.4.3.4 보호 피복이 없는 접속, 접속단자 및 접속기의 경우 연결 및 분리 시에도
 IP2X(KS C IEC 60529) 보호를 유지해야 하며, 의도하지 않은 단선을 방지하기 위해
 적절하게 고정되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.11.5.3.3 케이블의 보호 피복은 기계적인 보호의 연속성을 보장하기 위해 스위치 및 기구의 케이스에 완전히 들어가거나
             적절하게 만들어진 마개에 단말처리 되어야 한다.


5.11.4.3.5 에스컬레이터 또는 무빙워크의 주 개폐기 또는 개폐기의 개방 후에도 일부 연
 결 단자에 여전히 전류가 흐르고 전압이 25 VAC 또는 60 VDC를 초과하는 경우,                                            KS


                                                    [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




 C IEC 60204-1, 16에 적합한 경고 표시를 주 개폐기 또는 개폐기 부근에 적절하게
 표시하고 관련 내용을 유지관리 매뉴얼에 포함시켜야 한다.
 또한, 이러한 전류가 흐르는 단자에 연결된 회로의 경우 경고 표식, 분리 또는 색상 구
 분은 KS C IEC 60204-1, 5.3.5에 적합해야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.11.5.3.2 에스컬레이터 또는 무빙워크의 주 개폐기 또는 차단기의 개방 후 결선단자에 여전히 전류가 통하는 단자는 통하지
            않은 단자와 확실하게 분리되어야 한다. 전압이 50 V를 초과하면 적절하게 표시되어야 한다.


5.11.4.3.6 우발적인 연결로 인해 에스컬레이터 및 무빙워크의 위험한 움직임을 초래할
  수 있는 연결단자는 이러한 위험이 구조적 방법으로 제거되지 않는 한 확실하게 분리되
  어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.11.6 결선단자
      오 결선으로 인해 에스컬레이터 및 무빙워크의 위험한 움직임을 초래할 수 있는 결선단자는 이러한 위험을 제거하는
      방법이 없는 경우 확실하게 분리되어야 한다.


5.11.4.3.7 전도체와 케이블의 보호 피복은 기계적인 보호의 연속성을 보장하기 위해 스
  위치 및 기구의 케이스에 완전히 들어가거나 적절하게 만들어진 케이블 그랜드로 단말
  처리 되어야 한다. 그러나, 부품의 움직임으로 인한 기계적 손상 또는 프레임 자체의
  날카로운 모서리에 의한 위험이 있는 경우, 안전장치에 연결된 전도체는 기계적으로 보
  호되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.11.5.3.3 케이블의 보호 피복은 기계적인 보호의 연속성을 보장하기 위해 스위치 및 기구의 케이스에 완전히 들어가거나
            적절하게 만들어진 마개에 단말처리 되어야 한다.



<추가 종전 기준>----------------------------------------------' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.11.5.4 결선장치
          안전회로에 있는 오 결선으로 인해 에스컬레이터의 위험한 오동작을 유발하거나 결선장치의 분리에 도구가 불필요한
          경우, 플러그를 재결합할 때 오 결선되지 않도록 설계되고 배치되어야 한다.



5.12 전기 제어 시스템

5.12.1 보호 장치 및 기능

5.12.1.1 개요
 표 6은 해당 조항을 참조하여 보호 장치 및 기능에 대한 개요이다.

                                 [표 6 – 보호장치 및 기능]

      순번                설명             참조              일반 기준              고장 잠금

          가)   전기 고장에 대한 보호          5.12.1.2   부속서 Ⅱ                        Ya

          나)   전동기 보호                5.12.1.3   KS C IEC 60947-4-1           Yb

          다)   안전장치 보호               5.12.1.4                                Y

          라)   정전기에 대한 보호            5.12.1.5                                N
      a
          고장 잠금(5.12.2.8 참조)은 5.12.1.2.2가) 및 나)에는 요구되지 않는다.
      b
          고장 잠금은 5.12.1.3.3에는 적용되지 않는다.

                                                    <2019년 3월 28일 이후 건축허가분부터 적용>

5.12.1.2 전기 고장에 대한 보호

5.12.1.2.1 에스컬레이터 또는 무빙워크의 전기설비에 5.12.1.2.2에 열거된 어떤 하나의
 고장은 5.12.1.2.3 및 부속서 Ⅱ에 기술된 상황에서 배제될 수 없다면, 그 자체로 인해
 에스컬레이터 또는 무빙워크의 위험한 오동작의 원인이 되지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.12.1.1.1 에스컬레이터 또는 무빙워크의 전기설비에 5.12.1.1.2에 열거된 어떤 하나의 고장은 5.12.1.1.3 및 부속서 Ⅰ에서
               기술된 상황에서 배제될 수 없다면, 그 자체로 인해 에스컬레이터 또는 무빙워크의 위험한 오동작의 원인이 되
               지 않아야 한다.


5.12.1.2.2 예상되는 고장은 다음과 같다.
 가) 전압 부재
 나) 전압 강하
 다) 전도체의 연속성 상실
 라) 회로의 접지 결함
 마) 단락 또는 회로개방, 저항, 캐패시터, 트랜지스터, 램프 등과 같은 전기부품의 값
           및 기능 의 변화
 바) 접촉기 또는 릴레이의 움직이는 전기자의 인력 부재 또는 불완전한 인력


                                                  [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




사) 접촉기 또는 릴레이의 움직이는 전기자의 융착
아) 접점의 개로 불능
자) 접점의 폐로 불능
차) 역상' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.12.1.1.2 예상되는 고장은 다음과 같다.
     가) 전압부재
     나) 전압강하
     다) 단선
     라) 누전
     마) 단락 또는 회로개방, 저항, 캐패시터, 트랜지스터, 램프 등과 같은 전기부품의 값 및 기능의 변화
     바) 접촉기 또는 릴레이의 움직이는 전기자의 접점력 부재 또는 불완전한 접점력
     사) 접촉기 또는 릴레이의 움직이는 전기자의 미분리
     아) 접점의 개로 불능
     자) 접점의 폐로 불능
     차) 역상


5.12.1.2.3 5.12.2.6.1에 따르는 안전스위치의 경우 접점의 개로 불능은 고려할 필요가
 없다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.12.1.1.3 접점의 개로 불능은 5.12.1.2.2에 적합한 안전 스위치에 관해서 고려될 필요는 없다.


5.12.1.3 전동기 보호

5.12.1.3.1 주 전원에 직접 연결된 전동기는 단락에 대해 보호되어야 한다.
                                                    <2013년 9월 15일 이후 건축허가분부터 적용>

5.12.1.3.2 주 전원에 직접 연결된 전동기는 모든 전도체에서 전동기에 공급되는 전원을
 차단하고 수동 재-설정이 가능한 자동 회로차단기(5.12.1.3.3에 따라 설치된 것 제외)에
 의해 과부하가 보호되어야 한다.(KS C IEC 60947-4-1 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.11.3.2 주 전원에 직접 연결된 전동기는 모든 전도체에서 전동기에 공급되는 전원을 차단하는 수동 재설정이 있는 자동 회로
          차단기(5.11.3.3에 따라 설치된 것 제외)에 의해 과부하가 보호되어야 한다.


5.12.1.3.3 과부하의 검출이 전동기 권선의 온도상승에 의해 작동될 때, 보호 장치는 충
 분히 냉각된 후에 자동으로 접점이 닫히는 것이 허용된다. 다만, 5.12.3.2의 조건하에
 서만 에스컬레이터 또는 무빙워크가 재-기동하는 것이 가능해야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.11.3.3 전동기의 감지장치가 전동기 권선의 온도상승에 의해 작동될 때 전동기에 공급되는 전원은 차단되어야 한다. 보호
          장치는 충분히 냉각된 후에 자동으로 접점이 닫히는 것이 허용된다. 다만, 5.12.2.1의 조건하에서만 에스컬레이터
          또는 무빙워크가 재-기동하는 것이 가능하여야 한다.


5.12.1.3.4 5.12.1.3.2 및 5.12.1.3.3은 다른 회로에 의해 전원을 공급받는 권선이 있는
 전동기의 경우 각 권선에 적용된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.11.3.4 5.11.3.2 및 5.11.3.3은 다른 회로에 의해 전원을 공급받는 권선이 있는 전동기의 경우 각 권선에 적용된다.


5.12.1.3.5 에스컬레이터 또는 무빙워크의 전동기가 전동기에 의해 구동되는 직류 발전기
 로부터 전원을 공급받을 때, 발전기를 구동하는 전동기 또한 과부하에 대해 보호되 어
 야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.11.3.5 전동기가 전동기에 의해 구동되는 직류 발전기로부터 전원을 공급받을 때, 전동기를 구동하는 발전기는 또한 과부하에
           대해 보호되어야 한다.


5.12.1.4 안전장치 보호
 안전장치가 있는 회로의 접지 결함은 구동기를 즉시 정지시켜야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.12.1.1.4 전기안전장치가 있는 회로의 접지 불량은 구동기를 즉시 정지시켜야 한다.[표 5의 겨) 참조]


5.12.1.5 정전기에 대한 보호
 정전기를 방전시키는 수단(예: 정전기 방지 브러시)이 제공되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','       5.11.7 정전기에 대한 보호
       정전기를 방전하기 위한 수단이 설치되어야 한다.(브러시 등)


 5.12.2 안전장치 및 기능

 5.12.2.1 개요
  표 7은 안전회로 구현을 위한 요구조건의 개요를 제공한다.
   비고 5.12.2에서 장치라는 용어는 장치와 기능을 모두 나타낸다.


                           [표 7 - 안전 제어 시스템 구현을 위한 요구조건]

             순번                       설명                               참조

              가)     안전장치의 기능                               5.12.2.2

              나)     안전장치의 감시                               5.12.2.3

              다)     안전장치에 대한 전원공급                          5.12.2.4

              라)     안전장치 작동                                5.12.2.5

              마)     안전장치의 수단                               5.12.2.6

              바)     안전장치가 감지해야 할 사항                        5.12.2.7 (표 8)

              사)     고장 잠금 기능                               5.12.2.8

              아)     전기적 차단 시퀀스 감지 기능                       5.12.2.9 (표 9)

                                                      <2019년 3월 28일 이후 건축허가분부터 적용>



                                               [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




5.12.2.2 안전장치 기능
 표 8에 열거된 안전장치는 정지를 시작하고 5.12.3.9에 따라 재-기동을 방지해야 한다.
 안전장치는 아래와 같이 구성된다.
 가) 5.12.2.6.1을 만족하는 하나 이상의 안전 스위치 및/또는
 나) 부속서 Ⅱ에 따른 전자 부품의 고장 배제를 고려한 5.12.2.6.2를 만족하는 고장 안
      전회로 및/또는
 다) 5.12.2.6.3에 따른 안전 관련 전기, 전자 및 프로그램 가능한 전자장치(E/E/PE)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.12.1.2.1.1 표 5에 따른 전기안전장치 중에 어느 하나가 작동하는 동안에는 구동기의 움직임을 방지하거나 5.12.1.2.4에
            기술된 것과 같이 구동기를 즉시 정지시켜야 하며 다음과 같이 구성되어야 한다.
     가) 접촉기 또는 릴레이-접촉기에 전원을 직접 차단하는 5.12.1.2.2를 만족하는 1개 이상의 안전접점 또는
     나) 아래의 1개 이상의 조합으로 이루어진 5.12.1.2.3을 만족하는 안전회로
      1) 접촉기 또는 릴레이-접촉기에 전원공급을 직접 차단하지 않은 5.12.1.2.2를 만족하는 1개 이상의 안전접점
      2) 5.12.1.2.2의 규정을 만족하지 않는 접점
      3) 부속서 Ⅰ에 따른 다른 부품


5.12.2.3 안전장치의 감시
 다음을 제외한 전기장치는 전기안전장치와 병렬로 연결되지 않아야 한다.
 가) 점검모드 경우의 전기안전장치(5.12.3.13)
 나) 전기안전장치 상태에 대한 정보를 안전회로의 다른 지점에 연결; 그 목적을 위해
       사용되는 이 장치는 부속서 Ⅱ의 기준을 충족시켜야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.12.1.2.1.2 다음을 제외한 전기장치는 전기안전장치와 병렬로 연결되지 않아야 한다.
     가) 점검모드 경우의 전기안전장치(5.12.2.5)
     나) 전기안전장치 상태에 대한 정보에 대하여 안전회로의 다른 지점에 연결. 그 목적을 위해 사용되는 이 장치는 부속서 Ⅰ의
        규정에 충족되어야 한다.


5.12.2.4 안전장치에 대한 전원공급
 내부 전원공급 장치의 구조 및 설치는 스위칭 효과로 인하여 전기안전장치의 출력에 잘
 못된 신호가 나타나는 것을 막아야 한다.
 특히, 네트워크상의 에스컬레이터 또는 무빙워크, 기타 설비의 작동으로부터 발생되는
 전압피크는 KS B 6945 및 KS B 6955에 적합하거나 동등 이상이 되도록 전기부품에
 허용할 수 없는 장애(노이즈, 내성)를 발생시키지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','    5.12.1.2.1.5 내부 전원공급 장치의 구조 및 설치는 스위칭 효과로 인하여 전기안전장치의 출력에 잘못된 신호의 출현을
           막는 것이어야 한다. 특히, 네트워크상에서 에스컬레이터 또는 무빙워크, 기타장치의 작동으로부터 발생되는
           전압피크는 KS B 6945 및 KS B 6955에 적합하거나 동등 이상이되도록 전기부품에 허용할 수 없는 외란을 발
           생시키지 않아야 한다.(노이즈 내성)








5.12.2.5 안전장치 작동
 안전장치를 작동시키는 구성 부품은 지속적인 작동에 의해 발생하는 기계적인 응력 조
 건하에서도 적절한 성능을 발휘할 수 있도록 선택되고 조립되어야 한다.
 안전장치용 고정부품은 기계적 또는 기하학적 배열에 의한 기능 작동을 보장해야 한다.
 이중계 고장안전회로의 경우, 기계적 고장이 이중계의 간과되는 결함에 원인이 될 수
 없도록 감지부품의 기계적 또는 기하학적 배열에 의해 보장되어야 한다.
 고장안전회로의 감지요소는 자체적으로 고장이 검출하지 못하면 별표 16에 따라 안전성
 이 입증되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.12.1.2.5 전기안전장치의 작동
      전기안전장치를 작동시키는 부품은 지속적인 정상운행으로 발생하는 기계적인 응력의 조건하에 적절한 성능을 발휘할 수
      있도록 설치되어야 한다.
      이중계 안전회로는 기계적 고장이 이중계 손실의 원인이 되지 않게 전송부품의 기계적 또는 기하학적 배열에 의해 보장되어야
      한다.
      안전회로의 전송부품은 다음 사항 또는 동등 이상을 견디어야 한다.
      가) KS C 0240, 스위핑에 의한 내구성 : 표 C.2
         진폭 0.35 mm 또는 5 gn, 주파수 범위 (10-55) Hz, 각 축에서 20 스위핑 사이클;
      나) KS C 0241, 펄스의 가속도 및 지속시간 : 표 1
         다음과 같은 조합
            - 첨두 가속도 294 ㎨ 또는 30 gn
            - 11 ms에 상응하는 펄스의 지속시간, 그리고
            - 2.1 ㎧ 반 정현에 상응하는 속도 변화
      비고 전송부품용 충격 흡수기가 설치된 경우 충격 흡수기는 전송부품의 일부로 간주된다.
      이 시험 후 공극거리 및 연면거리는 최소 허용치보다 작아지지 않아야 한다.


5.12.2.6 안전장치의 수단

5.12.2.6.1 안전 스위치

5.12.2.6.1.1 안전 스위치의 작동은 접점의 확실한 기계적 분리에 의해 작동되어야 한다.
 확실한 기계적 분리는 접점이 서로 융착되더라도 이뤄져야 한다.
 움직임의 중요한 부품인 가동접점과 작동력이 작용하는 액추에이터 부품 사이에 탄성요
 소(스프링 등)가 없는 것처럼 모든 접점이 개방위치로 이동할 때, 확실한 기계적 분리가
 이루어져야 한다.
 결함이 있는 부품으로 인한 단락의 위험을 최소화 할 수 있도록 설계되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','       5.12.1.2.2.1 안전 접점은 회로차단장치의 확실한 분리에 의해 작동되어야 한다. 이 확실한 기계적 분리는 접점이 모두 용착되더라도
                이뤄져야 한다.
       안전접점은 부품 고장으로 인한 단락의 위험을 최소로 하는 것으로 설계되어야 한다.
       비고 모든 접점-차단 부품이 개방위치가 되었을 때 및 운행의 중요한 부품의 가동접점과 작동력이 작용하는 액추에이터 부품 사이
             에 탄성부품(스프링 등)이 없을 때 확실한 개방이 이루어진다.




                                                  [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




5.12.2.6.1.2 안전스위치의 외함이 IP 4X(KS C IEC 60529에 따라) 이상의 보호등급인
 경우에는 정격 절연전압 250 V, IP 4X 미만의 보호등급인 경우에는 정격 절연전압
 500 V에 대해 안전스위치를 제공해야 한다.
 안전 스위치는 KS C IEC 60947-5-1에 규정한 대로 다음과 같은 범주에 포함되어야
 한다.
 가) 교류회로에 있는 안전스위치: AC-15
 나) 직류회로에 있는 안전스위치: DC-13' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.12.1.2.2.2 안전접점은 외함이 IP 4X 이상의 보호등급인 경우에는 정격절연전압이 250 V 이상 이어야 하고, 외함이 IP 4X
            미만의 보호등급인 경우에는 정격절연전압이 500 V 이상이어야 한다.
     안전접점은 KS C IEC 60947-5-1에 규정한 대로 다음과 같은 범주에 포함되어야 한다.
      가) 교류회로에 있는 안전 스위치 : AC-15
      나) 직류회로에 있는 안전 스위치 : DC-13


5.12.2.6.1.3 보호외함이 IP 4X 미만인 경우, 공극은 3 ㎜ 이상이고 연면거리는 4 ㎜ 이
 상이어야 한다. 분리된 후 접점 거리는 4 ㎜ 이상이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.12.1.2.2.3 보호 등급이 IP 4X 미만인 경우, 접점이 분리된 후 공극은 3 mm 이상이고 연면거리는 4 mm 이상이어야 하며
            접점(B 접점)의 분리된 거리는 4 mm 이상이어야 한다.
     분리된 후 접점에 대한 거리는 4 mm 이상이어야 한다.


5.12.2.6.1.4 다중 차단의 경우, 접점이 분리된 후 차단된 접점 사이의 개별 거리는 2 ㎜
 이상이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.12.1.2.2.4 다수의 브레이크 접점의 경우, 접점이 분리된 후 접점 사이의 거리는 2 mm 이상이어야 한다.


5.12.2.6.1.5 전도성 물질의 파편이 접점의 단락을 일으키지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.12.1.2.2.5 전도체 재질이 마모되어도 접점의 단락이 발생되지 않아야 한다.


5.12.2.6.2 고장안전회로

5.12.2.6.2.1 5.12.1.2에서 나타나는 어떠한 고장도 그 자체에 의해 위험한 상황을 유발
 시키지 않아야 된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','     5.12.1.2.3.1 5.12.1.1에서 나타나는 어떠한 고장도 그 자체에 의해 위험한 상황을 유발시키지 않아야 된다.


5.12.2.6.2.2 더욱이 아래와 같은 조건은 5.12.1.2.2의 예상되는 고장에 적용된다.
 2차 결함과 결합된 1개의 결함이 위험한 상황을 초래할 수 있는 경우, 에스컬레이터 또
 는 무빙워크는 결함 요소가 관여했던 다음 작동 순서가 발생할 때까지 정지되어야 한
 다. 에스컬레이터 및 무빙워크가 상기에 기술된 순서에 의해 정지되기 전까지 2차 결함
 으로 위험한 상황이 초래될 가능성은 고려되지 않는다. 1차 결함을 유발한 부품의 오작






  동이 상태변화에 의해 감지될 수 없는 경우 적절한 수단이 5.12.3.2에 따라 늦어도 에
  스컬레이터 또는 무빙워크가 재-기동될 때 고장을 감지하고 운행을 방지하는 것이 보장
  되어야 한다. 고장안전회로의 MTBF (mean time between failures)는 2.5년 이상이
  어야 한다. 이 시간은 3개월의 기간 내에 각 에스컬레이터 또는 무빙워크가 5.12.3.2에
  따라 적어도 한번 재-기동되어 상태변화가 있었을 것이라는 가정 하에 결정되었다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.12.1.2.3.2 더욱이 아래와 같은 조건은 5.12.1.1의 예상되는 고장에 적용된다.
      2차 고장과 결합된 1개의 고장이 위험한 상황을 초래할 수 있는 경우, 에스컬레이터 또는 무빙워크는 늦어도 1차 고장요소가
      관여된 다음 작동 순서에서 정지되어야 한다.
      1차 고장 후, 그리고 에스컬레이터 및 무빙워크가 상기에 기술된 순서에 의해 정지되기 전까지 2차 고장 발생의 가능성은
      고려되지 않는다.
      1차 고장을 유발한 부품의 고장이 상태변화에 의해 감지될 수 없다면 적절한 수단이 5.12.2.4에 따라 늦어도 에스컬레이터
      또는 무빙워크가 재-기동될 때 고장을 감지하여 운행을 방지하는 것이 보장되어야 한다.
      안전회로의 MTBF는 2.5년 이상이어야 한다.
      비고 MTBF(mean time between failures) : 이 시간은 3개월의 기간 내에 각 에스컬레이터 또는 무빙워크가 5.12.2.4에 따라
          한번 이상 재기동하는 사용 조건아래 및 더해서, 상태변화에 영향을 받는다는 조건 아래에서 결정되었다.


5.12.2.6.2.3 3차 결함과 결합된 2개의 결함이 위험한 상황을 초래할 수 있는 경우, 에스
 컬레이터 또는 무빙워크는 결함 요소 중 하나가 관여했던 다음 작동 순서가 발생할 때
 까지 정지되어야 한다.
 에스컬레이터 및 무빙워크가 상기에 기술된 순서에 의해 정지되기 전까지 3차 결함으로
 위험한 상황이 초래될 가능성은 고려되지 않는다.
 2개의 결함을 유발한 부품의 오작동이 상태변화에 의해 감지될 수 없는 경우 적절한 수
 단이 5.12.3.2에 따라 늦어도 에스컬레이터 또는 무빙워크가 재-기동될 때 고장을 감지
 하고 운행을 방지하는 것이 보장되어야 한다.
 고장 안전회로의 MTBF (mean time between failures)는 2.5년 이상이어야 한다.
 이 시간은 3개월의 기간 내에 각 에스컬레이터 또는 무빙워크가 5.12.3.2에 따라 적어
 도 한번 재-기동되어 상태변화가 있었을 것이라는 가정 하에 결정되었다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.12.1.2.3.3 2개의 고장이 그 자체에 의해 위험한 상황을 초래하지 않는다면, 3차 고장과 결합된 고장이 위험한 상황을 초래할
             수 있을 때, 에스컬레이터 및 무빙워크는 늦어도 고장 요소의 하나가 관여된 다음 작동순서에서 정지되어야 한다.
      에스컬레이터 및 무빙워크가 상기에 기술된 순서에 의해 정지되기 전에 위험한 상황을 초래하는 3차 고장의 가능성은 고려되지
      않는다.
      2개의 고장을 유발하는 부품의 고장이 상태변화에 의해 감지될 수 없다면 적절한 수단이 5.12.2.4에 따라 늦어도 에스컬레이터
      또는 무빙워크가 재-기동될 때 고장을 감지하여 운행을 방지하는 것이 보장되어야 한다.
      안전회로의 MTBF는 2.5년 이상이어야 한다.


5.12.2.6.2.4 3개 이상의 고장 결합은 다음과 같은 경우에 무시해도 된다.
 가) 고장 안전회로가 2개 이상의 채널로 구성되어 있고 제어회로에 의해 동등한 상태가
        감시되어 진다. 제어회로는 5.12.3.2에 따라 에스컬레이터 또는 무빙워크의 재-기
        동전에 확인되어 진다.(부속서 Ⅲ 참조), 또는
 나) 고장 안전회로는 3개 이상의 채널로 구성되어 있고 제어회로에 의해 동등한 상태가


                                                   [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




       감시되어 진다.
 가) 또는 나)의 기준을 만족하지 않은 경우, 고장분석을 중단하는 것은 허용되지 않고
 5.12.2.6.2.3에 유사하게 지속되어야 한다. 실행을 위하여 5.11.2.2가 적용되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.12.1.2.3.4 3개 이상의 고장 결합은 다음과 같은 경우에 무시될 수 있다.
      가) 안전회로가 2개 이상으로 회로로 되어 있고 제어회로에 의해 동등한 상태가 감시된다. 제어회로는 5.12.2.4에 따라 에스컬레이터
         또는 무빙워크의 재-기동하기 전에 확인되어야 한다.(부속서 Ⅱ 참조) 또는
      나) 안전회로는 3개 이상의 회로로 구성되어 있고 제어회로에 의해 동등한 상태가 감시된다.
      가) 또는 나)의 규정을 만족하지 않은 경우 고장분석을 차단하는 것은 허용되지 않는다. 다만, 5.12.1.2.3.3에 유사하게 지속되어야 하다.


5.12.2.6.2.5 고장안전회로의 설계 및 평가는 그림 Ⅲ.1과 같아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','      5.12.1.2.3.5 안전회로의 초안 작성 및 평가는 부속서 Ⅱ의 그림 Ⅱ.1에서 보여주는 것과 같아야 한다.



<추가 종전 기준>----------------------------------------------' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','   [ 표 5 감시 및 전기 안전장치에 대한 규정 ]

         감지되는 상황                                                 규정

         과부하(자동 회로차단기를 사용한);
    가)                                                           5.11.3.2
         출발되지 않아야 한다. (또한 5.12.2.4.1 참조)

    나)   과부하(온도 상승의 원리에 의해 작동되는)                                 5.11.3.3

         과속 또는 운행방향의 의도하지 않은 역전(5.4.2.3에 따라); 출발되지 않아야 한다.
    다)                                                           5.12.1.2.2 또는 5.12.1.2.3
         (또한 5.12.2.4.1 참조)

    라)   보조 브레이크의 닫힘(5.4.2.2.4에 따라)                              5.12.1.2.2 또는 5.12.1.2.3

                                                                 5.12.1.2.2 또는 5.12.1.2.3
         스텝, 팔레트 또는 벨트를 직접 구동하는 부품(체인 또는 랙 등)의 파손 또는
    마)
         과도한 늘어남; 출발되지 않아야 한다.(또한 5.12.2.4.1 참조)


    바)   구동 및 순환 장치 사이의 거리의 (의도하지 않은) 연장 또는 감소                   5.12.1.2.2 또는 5.12.1.2.3

         스텝, 팔레트, 또는 벨트가 콤에 들어가는 지점에 끼이는 이물질(5.7.3.2.6에 따 5.12.1.2.2 또는 5.12.1.2.3
    사)
         라) 및 스텝과 스커트에 끼이는 이물질(5.5.3.5 참조)

                                                                 5.12.1.2.2 또는 5.12.1.2.3
         중간 비상구(7.2.6 참조)가 없거나 구조적인 수단에 의해 에스컬레이터 또는 무
    아)
         빙워크가 막혀 있는 곳(셔터, 방화문 등)의 에스컬레이터 또는 무빙워크의 정지


    자)   핸드레일 입구에 끼이는 이물질(5.6.4.3 참조)                            5.12.1.2.2 또는 5.12.1.2.3

         스텝 또는 팔레트의 늘어짐(5.7.2.5 참조);
    차)   출발되지 않아야 한다.(또한 5.12.3.4.1 참조)                          5.12.1.2.2 또는 5.12.1.2.3
         벨트식 무빙워크에는 적용하지 않는다.


         스텝/팔레트의 누락(5.3.6참조);                                    EN 954-1:1996 및
    카)
         출발되지 않아야 한다.(또한 5.12.2.4.1 참조)                          ISO 13849-2:2003의 범위 3


         에스컬레이터 또는 무빙워크의 기동 후 브레이크시스템의                           EN 954-1:1996 및
    타)   미-작동(5.4.2.1.1 참조);                                     ISO13849-2:2003의
         출발되지 않아야 한다.(또한 5.12.2.4.1 참조)                          범위 1

                                                                 EN 954-1:1996 및
    파)   15초 이상 동안 실제 속도보다 -15%이상의 핸드레일 속도 편차(5.6.1 참조)          ISO 13849-2:2003의
                                                                 범위 2

                                                                 EN 954-1:1996 및
         트러스 구역의 열리는 구조의 트랩문 또는 제거되거나 열리는 구조의 바닥평판
    하)                                                           ISO 13849-2:2003의
         (5.2.4 참조)
                                                                 범위 1

         최대 허용정지거리가 20% 이상 초과(5.4.2.1.1 참조);                     5.12.2.4.1
    거)
         출발되지 않아야 한다.

         전기 안전장치가 있는 곳의 회로의 접지 결함;                               5.12.2.4.1
    겨)
         출발되지 않아야 한다.(또한 5.12.1.1.4 참조)

                                                                 EN 954-1:1996 및
    교)   제거 가능한 수동 권취 장치의 설치(5.4.1.4 참조)                         ISO 13849-2:2003의
                                                                 범위 1






5.12.2.7.2 과속 감지
 속도가 공칭 속도의 1.2배를 초과하기 전에 과속을 감지할 수 있는 장치가 제공되어야
 한다.
 과속을 방지하도록 설계된 경우 이 기준은 무시해도 된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2013-09-15','2015-05-12','old','5.4.2.3.1 에스컬레이터 및 무빙워크는 공칭 속도의 1.2배 값을 초과하기 전에 자동으로 정지되는 방법[표 5다) 참조] 으로
       설치되어야 한다. 속도 제어장치가 이 목적을 위해 사용된 경우에는 속도가 공칭속도의 1.2배의 값을 초과하기 전에 에스
       컬레이터 또는 무빙워크에 전원이 차단되어야 한다.
과속을 방지하는 설계가 있는 경우, 이 규정은 무시될 수 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.2','에스컬레이터','2022-03-02',NULL,'current','5.12.2.7.2 및 5.12.2.7.3에 적합한 안전장치 또는 안전기능이 제공되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.3','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.3.2 에스컬레이터 및 경사형(α󰀄 6°) 무빙워크는 미리 설정된 운행방향이 변할 때 스텝 및 팔레트 또는 벨트가 자동으로
       정지되는 방법으로 설치되어야 한다.[표 5의 다) 참조]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.3','에스컬레이터','2022-03-02',NULL,'current','5.12.2.7.3 의도되지 않은 운행방향의 역전 감지
 에스컬레이터와 경사형(α ≥6 °) 무빙워크의 의도되지 않은 역전을 즉시 감지할 수 있는
 장치가 제공되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.4','에스컬레이터','2013-09-15','2022-03-01','old','[ 표 5 감시 및 전기 안전장치에 대한 규정 ]

        감지되는 상황                                       규정

  라)    보조 브레이크의 닫힘(5.4.2.2.4에 따라)                    5.12.1.2.2 또는 5.12.1.2.3' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.4' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.4','에스컬레이터','2022-03-02',NULL,'current','5.12.2.7.4 보조 브레이크의 미-작동 감지
 에스컬레이터 또는 경사형 무빙워크 기동 후 보조 브레이크의 미-작동을 감지할 수 있
 는 장치가 제공되어야 한다.(5.4.2.2 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.4' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.5','에스컬레이터','2013-09-15','2022-03-01','old','[ 표 5 감시 및 전기 안전장치에 대한 규정 ]

        감지되는 상황                                       규정

                                                      5.12.1.2.2 또는 5.12.1.2.3
        스텝, 팔레트 또는 벨트를 직접 구동하는 부품(체인 또는 랙 등)의 파손 또는
  마)
        과도한 늘어남; 출발되지 않아야 한다.(또한 5.12.2.4.1 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.5' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.5','에스컬레이터','2022-03-02',NULL,'current','5.12.2.7.5 디딤판을 직접 구동하는 부품의 파손 또는 과도한 늘어짐 감지
 디딤판을 직접 구동하는 부품(예: 체인 또는 랙)의 파손 또는 과도한 늘어짐을 감지할
 수 있는 장치가 제공되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.5' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.6','에스컬레이터','2013-09-15','2022-03-01','old','[ 표 5 감시 및 전기 안전장치에 대한 규정 ]

       감지되는 상황                                              규정

                                                            5.12.1.2.2 또는 5.12.1.2.3
       스텝, 팔레트 또는 벨트를 직접 구동하는 부품(체인 또는 랙 등)의 파손 또는
 마)
       과도한 늘어남; 출발되지 않아야 한다.(또한 5.12.2.4.1 참조)


 바)    구동 및 순환 장치 사이의 거리의 (의도하지 않은) 연장 또는 감소                5.12.1.2.2 또는 5.12.1.2.3' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.6' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.6','에스컬레이터','2022-03-02',NULL,'current','5.12.2.7.6 인장 장치의 움직임 감지
 구동장치와 인장장치 사이의 거리가 20 ㎜를 초과하는 의도되지 않은 연장 또는 감소
 움직임을 감지하기 위한 장치가 제공되어야 한다.(5.4.3.3 및 5.4.4.2 참조)



                                                      [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.6' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.7','에스컬레이터','2013-09-15','2022-03-01','old','5.7.3.2.6 5.7.3.2.5에서 설명된 방법으로 처리되지 않고 이물질이 끼고 콤ㆍ스텝ㆍ팔레트에 충격이 가해지면 에스컬레이터 또는
           무빙워크는 자동으로 정지되어야 한다.[표 5의 사) 참조]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.7' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.7','에스컬레이터','2001-06-18','2013-09-14','old','3.3.2(10) 디딤판과 콤(Comb)이 맞물리는 지점에 물체가 끼였을 때 디딤판의 승강을 자동적으로 정지시키는 장치


4.3.2(9) 디딤면 구조상 콤브(Comb)를 설치할 수 없는 구조인 경우에 승강장에 물체가 끼었을 때 작동하는 정지스위치의 설치상태는
       견고하고, 작동상태는 양호하여야 한다.


4.3.2(19) 디딤판과 콤(Comb)이 맞물리는 지점에 물체가 끼였을 때 디딤판의 승강을 자동적으로 정지시키는 정지스위치의 설치상태는
       견고하고, 작동상태는 양호하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.7' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.7','에스컬레이터',NULL,'2001-06-17','old','4.3.2(9) 디딤면 구조상 콤브(Comb)를 설치할 수 없는 구조인 경우에 승강장에 물체가 끼었을 때 작동하는 정지스위치의 설치상태는
       견고하고, 작동상태는 양호하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.7' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2001-06-17');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.7','에스컬레이터','2022-03-02',NULL,'current','5.12.2.7.7 콤 끼임 감지
 5.7.3.2.5에서 기술된 수단으로 처리되지 않는 끼인 물체를 감지하기 위한 장치가 제공
 되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.7' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.9','에스컬레이터','2013-09-15','2022-03-01','old','5.6.4.3 뉴얼 안에 들어가는 핸드레일 입구 점에는 손가락 및 손의 끼임을 방지하는 가이드가 설치되어야 한다. 또한, 표 5의 자)에
       따른 스위치가 설치되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.9' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.9','에스컬레이터',NULL,'2013-09-14','old','3.3.2(5) 사람이나 물건이 핸드레일 인입구에 끼였을 때 디딤판의 승강을 자동적으로 정지시키는 장치


4.3.2(6) 이동식 핸드레일의 인입구에는 적절한 보호장치가 설치되어 있고, 핸드레일 인입구 정지스위치의 작동상태는 양호
       하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.9' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.9','에스컬레이터','2022-03-02',NULL,'current','5.12.2.7.9 손잡이 입구에서의 끼임 감지
 손잡이 입구에 끼이는 이물질을 감지할 수 있는 장치가 제공되어야 한다.(5.6.4.3 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.9' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.10','에스컬레이터','2013-09-15','2022-03-01','old','5.7.2.5 트레드 표면의 홈과 콤의 빗살의 정확한 맞물림(5.7.3.3 참조)을 보장하는 장치가 콤 구역에 만들어져야 한다.
 벨트는 이 구역에서 적절한 방법(드럼, 롤러, 슬라이딩 플레이트 등)에 의해 지지되어야 한다.
 스텝 또는 팔레트의 어느 부분이 처져서 콤의 맞물림이 더 이상 보장되지 않으면 에스컬레이터 및 무빙워크를 정지시키는
 표 5의 차)에 따른 안전장치가 설치되어야 한다. 이 안전장치는 쳐진 스텝 또는 팔레트가 콤 교차점 선상에 닿지 않도록 하
 기 위해 콤 교차점 선상 앞에 충분한 거리를 두고 각 변환 곡선 앞에 배열(5.4.2.1.3.2 및 5.4.2.1.3.4 참조)되어야 한다.
 감시 장치가 스텝 또는 팔레트의 어느 지점에 적용될 수 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.10' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.10','에스컬레이터','1997-08-18','1999-01-13','old','3.3.2(9) 승강로의 상하부의 좌우에 고정되어 디딤판이 들려지는 상태에서의 운행이탈을 감지하여 디딤판의 승강을 제어하여
         정지시키는 장치. 다만, 수평보행기의 경우에는 그러하지 아니하다.


4.3.2(13) 고무벨트의 양단에는 마모와 분리됨이 없어야 한다.
 ① 고무벨트가 절단되었을 때 작동하는 정지스위치의 설치상태는 견고하고, 작동상태는 양호하여야 한다.
 ② 고무벨트의 본체 및 엔들레스 접합부에는 부분적인 균열 및 손상이 없어야 한다.
 ③ 고무벨트의 엔들레스 접합부는 분리되지 않고, 요철 및 펄럭거림 등이 없어야 한다.
 ④ 고무벨트의 양단에는 마모와 분리됨이 없어야 한다.
 ⑤ 고무벨트와 디딤지지판의 접촉면에는 마찰저항을 줄이기 위한 조치가 되어 있어야 한다.
 ⑥ 고무벨트의 주행상태는 양호하고, 프레임과의 접촉 및 노킹현상이 없어야 한다.
 ⑦ 고무벨트의 좌우 움직임을 방지하기 위한 가이드롤러의 설치상태는 견고하고, 작동상태는 양호하여야 한다.
 ⑧ 고무벨트의 양단과 가이드롤러는 보호커버에 의해서 외부에 노출되지 않아야 한다.


4.3.2(17) 승강로의 상하부 좌우측에 고정되어 디딤판과 가이드레일 사이에 이물질 등이 끼이는 경우에 디딤판이 들려지는
          상태에서의 운행이탈을 감지하여 디딤판의 승강을 자동적으로 제어하여 정지시키는 장치의 작동상태는 양호하여야
          한다. 다만, 수평보행기의 경우에는 그러하지 아니하다.




                                           [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.10' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1997-08-18' AND COALESCE(expiry_date,'')='1999-01-13');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.10','에스컬레이터',NULL,'1997-08-17','old','4.3.2(13) 고무벨트의 양단에는 마모와 분리됨이 없어야 한다.
① 고무벨트가 절단되었을 때 작동하는 정지스위치의 설치상태는 견고하고, 작동상태는 양호하여야 한다.
② 고무벨트의 본체 및 엔들레스 접합부에는 부분적인 균열 및 손상이 없어야 한다.
③ 고무벨트의 엔들레스 접합부는 분리되지 않고, 요철 및 펄럭거림 등이 없어야 한다.
④ 고무벨트의 양단에는 마모와 분리됨이 없어야 한다.
⑤ 고무벨트와 디딤지지판의 접촉면에는 마찰저항을 줄이기 위한 조치가 되어 있어야 한다.
⑥ 고무벨트의 주행상태는 양호하고, 프레임과의 접촉 및 노킹현상이 없어야 한다.
⑦ 고무벨트의 좌우 움직임을 방지하기 위한 가이드롤러의 설치상태는 견고하고, 작동상태는 양호하여야 한다.
⑧ 고무벨트의 양단과 가이드롤러는 보호커버에 의해서 외부에 노출되지 않아야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.10' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='1997-08-17');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.10','에스컬레이터','2022-03-02',NULL,'current','5.12.2.7.10 스텝 또는 팔레트 처짐 감지
 스텝 또는 팔레트의 어느 부분이 처져서 콤과 맞물림이 더 이상 보장되지 않는 경우안
 전장치가 제공되어야 한다.
 이 안전장치는 처진 스텝 또는 팔레트가 콤 교차점 선상에 닿지 않도록 하기 위해 콤
 교차점        선상    앞에서      충분한     거리를     두고     각       천이구간   앞에    배치되어야       한
 다.(5.4.2.1.3.2 및 5.4.2.1.3.4에 정의된 정지거리 참조).
 안전장치는 스텝 또는 팔레트의 어느 지점에나 적용될 수 있다.(5.7.2.5 참조)
 벨트식 무빙워크에는 적용되지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.10' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.11','에스컬레이터','2013-09-15','2022-03-01','old','5.3.6 빠진 스텝 또는 팔레트 장치
빠진 스텝 또는 팔레트[표 5카) 참조]는 콤으로부터 틈(빠진 스텝 또는 팔레트로부터 발생한 결과)이 나타나기 전에 감지되어야
하고 에스컬레이터 또는 무빙워크는 정지되어야 한다. 이것은 각 구동 및 순환 장소에 설치된 어떤 장치에 의해 보장되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.11' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.11','에스컬레이터','2022-03-02',NULL,'current','5.12.2.7.11 스텝 또는 팔레트 누락 감지
 누락된 스텝/팔레트는 콤으로부터 틈새(누락된 스텝 또는 팔레트로부터 발생한 결과)가
 나타나기 전에 감지되어야 하고 에스컬레이터/무빙워크는 정지되어야 한다.
 이것은 스텝/팔레트의 순환 운행에서 각각의 구동 및 순환 장소에 설치된 안전장치 또
 는 안전기능에 의해 보장되어야 한다.
 이 장치의 감지수단은 구동 및 순환장소의 일부가 아닌 천이구간 사이의 직선구간에 설
 치가 허용되지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.11' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.12','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.1.1.1 에스컬레이터 및 무빙워크는 균일한 감속 및 정지 상태(제동 운전)를 지속할 수 있는 브레이크 시스템이 있어야
      한다. 또한, 5.12.1.2.4를 참조한다. 브레이크 시스템의 적용에서 의도적인 지연은 없어야 한다.
정지거리가 5.4.2.1.3.2 및 5.4.2.1.3.4의 최대값의 20 %를 초과하면, 고장 안전장치의 재설정[표 5의 거)]후에만 재-기동이
가능하여야 한다. 수동 재설정 전에 브레이크 시스템에 대한 정밀점검이 필요하다면 브레이크 시스템은 정밀하게 조사되어야
하고 정확한 조치가 취해지도록 설계되어야 한다.
에스컬레이터 및 무빙워크의 출발 후에는 브레이크 시스템의 개방을 감시하는 장치가 설치되어야 한다.[표 5의 타) 참조]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.12' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.12','에스컬레이터',NULL,'2013-09-14','old','3.3.2(6) 동력이 차단되었을 때 관성에 의한 전동기의 회전을 자동적으로 제지하는 장치' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.12' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.12','에스컬레이터','2022-03-02',NULL,'current','5.12.2.7.12 브레이크의 미-작동 감지
 에스컬레이터/무빙워크의 운행 시작 후 브레이크의 미-작동을 감지하는 장치가 제공되
 어야 한다.(5.4.2.1 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.12' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.13','에스컬레이터','2013-09-15','2022-03-01','old','5.6.1.2 핸드레일 속도감시장치[표 5파)참조]가 설치되어야 하고 에스컬레이터 또는 무빙워크가 운행하는 동안 핸드레일 속도가
    15초 이상 동안 실제 속도보다 - 15 % 이상 차이가 발생하면 에스컬레이터 및 무빙워크를 정지시켜야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.13' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.13','에스컬레이터',NULL,'2007-09-09','old','     4.3.2(4) 이동식 핸드레일은 디딤판과 동일방향 및 동일속도로 승강하여야 한다.

이 상황을 방지하도록 설계된 경우 + 15 %의 요구조건은 무시해도 된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.13' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2007-09-09');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.13','에스컬레이터','2022-03-02',NULL,'current','5.12.2.7.13 손잡이의 속도 편차 감지
 손잡이 속도 감시 장치가 설치되어야 하고, 5초 ∼ 15초 내에 디딤판에 대해 ± 15 %
 이상의 손잡이 속도 편차가 발생하는 경우 에스컬레이터 또는 무빙워크의                                   정지를 시작
 해야한다.(5.6.1 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.13' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.15','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.2.3.2 비상정지스위치는 5.12.1.2에 따른 전기안전장치이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.15' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.15','에스컬레이터',NULL,'2007-09-09','old','3.3.2(3) 승강장에서 디딤판의 승강을 정지시키는 것이 가능한 장치


4.3.2(3) 상하 승강장의 기동스위치?정지스위치?비상정지버튼스위치 및 신호스위치 등의 작동상태는 양호하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.15' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2007-09-09');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.15','에스컬레이터','2022-03-02',NULL,'current','5.12.2.7.15 비상정지장치 작동 감지
 비상정지장치 작동을 감지하는 장치가 제공되어야 한다.
  비고 KS B ISO 13850에 따른 장치는 5.12.2.7.15에 따른 정지장치의 기능 기준을 지원하지 않는다.
        에스컬레이터 및 무빙워크의 안전을 위해 비상정지장치는 KS B ISO 13850과 다르게 정의한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.15' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.16','에스컬레이터','2013-09-15','2022-03-01','old','5.4.1.4 수동 권취 장치
수동 권취 장치가 설치된 경우에는 작동하기 위해 쉽게 접근이 가능하고 안전하여야 한다.
수동 권취 장치가 제거되면, 5.12.1.2.2에 적합한 전기 안전장치[표 5교) 참조]는 수동 권취 장치가 구동기에 끼워질 때 또는
끼워지기 전에 작동되어야 한다.
크랭크(L자형 손잡이) 핸들 또는 구멍이 있는 수동 휠은 허용되지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.16' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.16','에스컬레이터','2022-03-02',NULL,'current','5.12.2.7.16 수동핸들의 설치 감지
 탈착 가능한 수동핸들의 설치를 감지하기 위한 장치가 제공되어야 한다.(5.4.1.4 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.16' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.17','에스컬레이터','2013-09-15','2022-03-01','old','5.8.4 유지보수 정지스위치
구동 및 순환 장소에는 정지 스위치가 설치되어야 한다.
스텝, 팔레트 또는 벨트의 이용자 측면과 순환 선상 또는 순환 장소 사이에 배치된 구동장치가 있는 에스컬레이터 및 무빙워크에는
구동장치 구역에 추가적으로 정지 스위치가 설치되어야 한다.
이러한 정지 스위치의 작동은 구동기로부터 공급되는 동력을 차단하여야 하며 주 브레이크가 에스컬레이터 또는 무빙워크를
정지시켜야 한다.
정지스위치는 수동으로 작동되는 형식으로 스위치의 변환위치가 확실하고 영구적으로 표시되어야 하며 5.12.1.2.2에 적합한
안전 스위치이어야 한다.
정지스위치가 작동되면 에스컬레이터 또는 무빙워크는 운행되지 않아야 한다.
스위치 위치는 분명하고 영구적으로 표시되어야 한다.
특별한 경우 : 5.11.4에 따른 주(전원) 개폐기가 구동기 공간에 있는 경우 정지 스위치는 구동기 공간에 설치될 필요는 없다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.17' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.17','에스컬레이터','2022-03-02',NULL,'current','5.12.2.7.17 점검 등 유지관리 업무를 위한 정지장치 감지
 구동 및 순환 장소에는 정지장치가 설치되어야 한다.
 디딤판의 이용자 측면과 순환 선상 사이 또는 순환 장소 외부에 배치된 구동장치가 있
 는 에스컬레이터 및 무빙워크에는 구동장치 구역에 추가적으로 정지장치가 설치되어야
 한다.
 정지장치는 기능적으로 KS B ISO 13850에 따라야 한다.
 정지장치의 액추에이터 위치는 명확하고 영구적으로 표시되어야 하며, 안전접점의 상태
 는 안전장치에 명확하게 표시되어야 한다.


                                             [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




특별한 경우: 5.11.3에 따른 주(전원) 개폐기가 구동장치 구역에 있는 경우 정지장치는
설치할 필요가 없다.
비고 KS B ISO 13850에 정의된 비상정지장치에 따른 정지장치는 위의 기준을 준수해야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.17' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.18','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.5.3 이 제어장치의 작동부품은 우발적인 작동에 대해 보호되어야 한다. 에스컬레이터 또는 무빙워크는 손으로 스위치를 지
      속적으로 누르는 동안에만 운전되어야 한다. 각 제어장치에는 정지스위치가 설치되어야 하며 이 스위치는 한다.
정지스위치는 다음과 같아야 한다.
 가) 수동으로 작동되어야 한다.
 나) 스위치 전환 위치가 분명하고 영구적으로 표시되어야 한다.
 다) 5.12.1.2.2에 적합한 안전 스위치이어야 한다.
 라) 수동 재설정이 요구되어야 한다.
 점검 제어장치가 플러그-인 될 때 정지 스위치가 작동되면 구동기에 공급되는 전원을 차단시켜야 하고 브레이크가 작동되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.18' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.7.18','에스컬레이터','2022-03-02',NULL,'current','5.12.2.7.18 점검운전 제어장치에서 정지장치의 작동 감지
 점검운전 제어장치에서 정지장치의 작동을 감지하는 장치가 제공되어야 한다.
 정지장치는 다음과 같아야 한다.
 가) 수동으로 작동되어야 한다.
 나) 전환 위치가 분명하고 영구적으로 표시되어야 한다.
 비고 KS B ISO 13850에 정의된 비상정지장치에 따른 정지장치는 위의 기준을 준수해야 한다.
 이 장치는 점검운전 제어장치가 연결되었을 때만 작동되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.7.18' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.8','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.4.1 스위치에 의한 재-기동
5.12.2.2.2에서 기술된 것을 제외하고 각 정지(5.12.2.2.1, 5.12.2.2.3, 5.12.2.2.4) 후에는 5.12.2.1에서 기술된 스위치에 의해서 또는
5.12.2.5에 기술된 점검운전 제어수단에 의해서만 재-기동이 가능하여야 한다. 이것은 표 5의 가), 다), 마), 차), 카), 자), 거),
겨) 및 교)에 목록된 것과 같은 경우에 정지된다면 재-기동은 고장 잠금이 수동으로 재-설정 된 후에만 가능하여야 한다.
수동으로 재-설정하기 전에 정지된 근본적인 원인은 확인되어야 한다. 정지장치는 점검되어야 하고 필요하다면 올바른 조치가
취해져야 한다.
고장 잠금(fail lock)은 다음 고장 또는 동력공급의 복귀까지 유효한 상태가 지속되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.8' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.2.8','에스컬레이터','2022-03-02',NULL,'current','5.12.2.8 고장 잠금 기능
 고장이 잠긴 경우, 표 8 및 표 9에 언급된 전기 제어장치 및 기능의 시작을 방지해야
 한다.
  비고 고장 잠금은 시작을 방지한다. 수동 재-설정은 고장 잠금을 해제한다.
 안전 장치(표 8 및 표 9 참조), 보호 장치(표 6 참조), 제어 장치(표 10 참조)에 언급된
 경우 고장 잠금이 제공되어야 한다.
 고장 잠금의 수동 재-설정 후에만 표 10, 항목 가에 따른 이용이 가능해야 한다.
 고장 잠금의 원격 수동 재-설정은 허용되지 않는다.
 고장 잠금의 수동 재-설정은 인가된 작업자만이 할 수 있다.
 고장 잠금을 수동으로 재-설정하기 전 정지의 근본 원인을 조사하고, 정지 장치를 점검
 하고, 필요한 경우 시정 조치를 취해야 한다.
 고장 잠금은 아래의 경우 활성 상태를 유지해야 한다.
 가) 표 6, 표 8, 표 9의 또 다른 추가 사항 발생
 나) 전원 공급 장치의 복원
 다) 점검 제어로 변경 또는 점검 제어로부터 복귀
 점검 제어에서 표 8 및 표 9에 따라 안전장치를 활성화/비활성화 할 수 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.2.8' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.1','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.1 에스컬레이터 또는 무빙워크의 기동 및 사용 가능' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.1','에스컬레이터','2022-03-02',NULL,'current','5.12.3.1 개요
 표 10은 제어장치 및 기능의 개요를 제공한다.

                                 [표 10 – 제어장치 및 기능]

   구분                       설명                    참조               일반 기준

      가)     사용 및 기동 – 수동 조작                    5.12.3.2    5.12.1.1[표 6, 가)항]

      나)     자동 운전 – 미리 정해진 방향에서 기동             5.12.3.3    5.12.1.1[표 6, 가)항]

      다)     자동 운전 – 양방향 모드 기동                  5.12.3.4    5.12.1.1[표 6, 가)항]

      라)     에스컬레이터 또는 무빙워크의 정지                 5.12.3.5    5.12.1.1[표 6, 가)항]

                                                            5.12.1.1[표 6, 가)항]
      마)     운전자에 의한 정지 – 수동 작동                 5.12.3.6
                                                            5.12.3.5

                                                            5.12.1.1[표 6, 가)항]
      바)     정지 – 자동 작동                         5.12.3.7
                                                            5.12.3.5

      사)     비상정지장치에 의한 정지, 수동 작동               5.12.3.8    5.12.3.5

      아)     보호, 안전장치 및 기능에 의한 정지               5.12.3.9    5.12.3.5

                                                            5.4.2.1.3.2,
      자)     허용된 정지거리 초과 시 기동 방지                5.12.3.10
                                                            5.4.2.1.3.4, 5.12.2.8

      차)     운행 방향의 의도된 역전                      5.12.3.11              -

      카)     자동 재-기동에 의한 재개                     5.12.3.12   5.12.1.1[표 6, 가)항]

      타)     점검운전 제어                            5.12.3.13   5.12.2.7.18, 5.12.3.5' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.2','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.1.1 에스컬레이터 또는 무빙워크의 기동(또는 이용자가 어느 지점을 지나갈 때 자동으로 기동)은 권한이 있는 사람만이
     1개 이상의 스위치(열쇠로 작동되는 스위치, 탈부착 레버가 있는 스위치, 잠글 수 있는 보호 덮개가 있는 스위치, 원격
     기동장치 등)에 의하여 유효하여야 하고, 콤 교차선 외부에서 닿을 수 있어야 한다. 이러한 스위치는 5.11.4에서 기
     술된 주 개폐기의 기능과 구분되어야 한다. 스위치를 작동시키는 사람이 운전 전에 전체 에스컬레이터 또는 무빙워
     크를 이용하는 사람이 없는지 볼 수 있거나 확인할 수 있는 수단이 있어야 한다. 스위치에 운행방향의 표시로 명
     확하게 인식할 수 있어야 한다.
에스컬레이터 또는 무빙워크의 전기장치에서 5.12.1.1.2에서 보여준 고장 중 어느 하나가 5.12.1.1.3 및 부속서 Ⅰ에서 기술된
조건하에서 배제될 수 없다면 구동기를 기동시켜서는 안 된다.
기동 스위치는 5.12.2.2.3.2에 따라 정지 스위치와 가깝게 위치되어야 한다.
원격 기동장치에 대해서는 상기의 규정이 적용되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.2','에스컬레이터',NULL,'2007-09-09','old','4.3.2(3) 상하 승강장의 기동스위치?정지스위치?비상정지버튼스위치 및 신호스위치 등의 작동상태는 양호하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2007-09-09');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.2','에스컬레이터','2022-03-02',NULL,'current','5.12.3.2 사용 및 기동 – 수동 조작
 에스컬레이터/무빙워크의 사용 및 기동은 사용자가 없어도 가능하며 권한이 있는 사람
 만이 1개 이상의 스위치(예: 열쇠로 작동되는 스위치, 탈부착 레버가 있는 스위치, 잠글
 수 있는 보호 덮개가 있는 스위치, 원격 기동장치)에 의해서만 유효해야 하고, 콤 교차
 선 바깥쪽에서 닿을 수 있어야 한다.





  이러한 스위치는 5.11.3에서 기술된 주 개폐기처럼 동시에 작동하지 않아야 한다.
  스위치를 조작하는 사람은 작동 전에 디딤판에 이용자 및 물건이 없는지 시각적 또는
  다른 수단에 의해 확인할 수 있어야 한다.
  스위치의 표시는 운행방향을 명확하게 구분할 수 있어야 한다.
  기동 스위치는 5.12.3.8에 따른 정지스위치에서 손이 닿을 수 있는 곳에 위치해야 한다.
  원격 기동장치에 대해서도 상기의 기준이 적용되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.3.1','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.1.2 이용자가 들어오는 것(준비 운전)에 의해 자동으로 기동되거나 가속되는 에스컬레이터 또는 무빙워크는 사람이 콤
     교차 선에 도착할 때 공칭속도의 0.2배 이상으로 움직여야 한다. 그리고 나서 0.5 ㎨ 미만으로 가속되어야 한다.
 비고 1 ㎧로 걸어가는 사람의 평균속도를 고려하여 계산됨.
5.12.1.1의 규정에 적합하여야 한다.
구조적인 수단이 제어 부품의 우회를 방지하는데 필요할 수 있다.




                                         [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.3.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.3.1','에스컬레이터','2022-03-02',NULL,'current','5.12.3.3.1 자동 운전은 5.12.3.2를 적용 후에만 가능해야 한다.
 이용자의 진입을 감지(준비운전)하여 자동으로 기동되거나 가속되는 에스컬레이터 또는
 무빙워크는 이용자가 콤 교차선에 도착할 때 공칭속도의 0.2배 이상으로 움직여야 하고
 0.5 ㎨ 미만으로 가속되어야 한다.
 이용자의 진입을 감지하는 수단은 1 ㎧의 평균 보행속도를 고려해야 한다.
 감지 수단의 우회를 방지하기 위해 구조적인 수단이 필요할 수 있다.
 자동 기동 구현을 위해(5.12.1.2 적용), 입구에서 자동 기동을 작동시키는 감지 수단의
 고장으로 인한 결과를 방지해야 한다.(예: 이용자를 감지하지 못하거나 부분적으로 감지
 하지 못함)
  비고 상기 기준의 의도는 이용자의 승강장 진입을 감지하는 것이다. 감지 수단의 위치에 따라, 감지되어
        야 할 구역은 승강장(예: 운행 안내 표시 기둥)까지 이어지거나 승강장보다 작을 수 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.3.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.3.2','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.1.3 이용자가 들어서면 자동으로 운행되는 에스컬레이터 또는 무빙워크에서 운행방향은 미리 설정되고 이용자에게 명확히
     보여야 하며, 에스컬레이터 또는 무빙워크에 뚜렷하게 표시되어야 한다.
이용자가 들어서면 자동으로 운행되는 에스컬레이터 또는 무빙워크에서 미리 정해진 운행방향과 반대방향으로 들어갈 경우에는
미리 정해진 방향으로 운행되고 5.12.2.1.2의 규정에 적합하여야 한다. 지속시간은 10초 이상이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.3.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.3.2','에스컬레이터',NULL,'2007-09-09','old','4.3.2(3) 상하 승강장의 기동스위치?정지스위치?비상정지버튼스위치 및 신호스위치 등의 작동상태는 양호하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.3.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2007-09-09');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.3.2','에스컬레이터','2022-03-02',NULL,'current','5.12.3.3.2 이용자가 진입하면 자동으로 운행되는 에스컬레이터/무빙워크에서 운행방향은
 미리 설정되고 이용자에게 명확히 보여야 하며, 에스컬레이터/무빙워크에 뚜렷하게 표
 시되어야 한다.(6.2 참조)
 이용자가 들어서면 자동으로 운행되는 에스컬레이터 또는 무빙워크에서 미리 정해진 운
 행방향과 반대방향으로 들어갈 경우에는 미리 정해진 방향으로 운행되고 5.12.3.3.1의
 기준에 적합해야 한다.
 지속시간은 10초 이상이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.3.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.5.1','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.1.1.2 브레이크 시스템은 다음과 같을 때 자동으로 작동되어야 한다.
가) 전압 공급이 중단될 때
나) 제어 회로에 전압 공급이 중단될 때


5.4.1.5 구동기 정지 및 구동기의 정지 상태 확인
5.12.1.2에 따른 전기 안전장치에 의한 에스컬레이터 또는 무빙워크의 정지는 다음과 같아야 한다.
가) 전원공급은 2개의 독립적인 접촉기에 의해 차단되어야 하며, 접점은 전원공급 회로에서 직렬이어야 한다.
나) 에스컬레이터 또는 무빙워크가 정지될 때 하나의 접촉기의 주 접점 중 하나가 개방되지 않으면 재-기동은 불가능하여야 한다.


5.4.2.1.2 전자-기계 브레이크
전자-기계 브레이크의 정상 개방은 지속적인 전류의 흐름에 의해야 한다. 브레이크는 전기적 브레이크 회로가 개방되면 즉시
작동되어야 한다.
제동력은 안내되는 압축 스프링에 의해 발휘되어야 한다. 브레이크 해제장치의 전기적 자체여자의 발생은 불가능하여야 한다.
전원공급은 2개 이상의 독립적인 전기장치에 의해 차단되어야 한다. 이 전기장치는 구동기에 공급되는 전원을 차단할 수 있다.
에스컬레이터 또는 무빙워크가 정지된 후 이 전기장치 중 어느 하나가 개방되지 않으면 재-기동은 방지되어야 한다.(5.4.1.5 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.5.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.5.1','에스컬레이터',NULL,'2013-09-14','old','3.3.2(6) 동력이 차단되었을 때 관성에 의한 전동기의 회전을 자동적으로 제지하는 장치


4.1.1(3) 전동기?제동기 및 권상기
② 전동기의 운전상태는 양호하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.5.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.5.1','에스컬레이터','2022-03-02',NULL,'current','5.12.3.5.1 일반사항


                                                [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




정지는 보호, 안전, 제어장치 및 기능에 따른 차단 시퀀스의 시작으로 간주된다.
정지는 다음과 같을 때 자동으로 작동해야 한다.
가) 전압 공급이 중단되었을 때
나) 제어 회로에 전압 공급이 중단되었을 때
 비고 안전 회로의 차단은 전압 공급 중단으로 간주되지 않는다.
전동기에 대한 전원 공급은 2개 이상의 독립적인 접촉기에 의해 차단되어야 하며, 그
접점은 전동기의 전원 공급 회로에 직렬이여야 한다.
에스컬레이터 또는 무빙워크가 정지될 때 하나의 접촉기의 주 접점 중 하나가 개방되지
않으면 재-기동은 금지되어야 한다.
주 브레이크에 대한 전원 공급 차단은 2개 이상의 독립적인 전기장치에 의해 이루어져
야 한다.
이것은 전동기에 대한 전원 공급을 차단하는 것이 될 수 있다.
에스컬레이터 또는 무빙워크가 정지한 후 이 전기장치 중 하나가 열리지 않으면 재-기
동이 방지되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.5.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.5.3','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.2.4 보조 브레이크는 다음 사항 중 어느 조건에서도 작동되어야 한다.
가) 속도가 공칭속도의 1.4배의 값을 초과하기 전
나) 스텝 및 팔레트 또는 벨트가 현 운행 방향에서 바뀔 때
보조 브레이크의 작동은 제어회로를 확실하게 개방시켜야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.5.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.5.3','에스컬레이터',NULL,'2013-09-14','old','3.3.2(7) 구동체인이 절단되었을 때 동력을 차단하고 역행을 방지하는 장치 또는 상승중 비정상 역행구동시 구동정지와 동시에
     제동역할을 하는 장치. 다만, 수평보행기의 경우에는 그러하지 아니하다.


4.3.1(5) 구동체인 절단시의 정지스위치 및 역행방지장치 또는 제동장치의 작동상태는 양호하여야 한다. 다만, 수평보행기의 경우에는
     그러하지 아니하다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.5.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.5.3','에스컬레이터','2022-03-02',NULL,'current','5.12.3.5.3 보조 브레이크에 의한 차단 시퀀스의 시작
 보조 브레이크는 다음 조건 중 어느 하나에도 유효해야 한다.(5.4.2.2.5 참조)
 가) 속도가 공칭속도의 1.4배의 값을 초과하기 전
 나) 디딤판이 현재 운행 방향에서 바뀔 때' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.5.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.6','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.2.1 운전자에 의한 수동정지
정지하기 전, 관리자는 수동운전을 하기 전에 에스컬레이터 또는 무빙워크를 이용하는 사람이 아무도 없는지 확인하는
수단을 가져야 한다. 원격 정지장치에 대해서는 동일한 규정을 적용한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.6' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.6','에스컬레이터','2022-03-02',NULL,'current','5.12.3.6 운전자에 의한 정지–수동 작동
 정지하기 전, 운전자는 이러한 작업을 하기 전에 아무도 에스컬레이터 또는 무빙워크를
 이용하지 않는지 확인하는 수단을 가져야 한다.
 원격 정지장치에 대해서도 동일한 기준을 적용한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.6' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.7','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.2.2 자동정지
이용자가 5.12.2.1.2에서 기술된 제어부품을 작동시킨 후 충분한 시간이 흐른 다음(예상 승객수송 설계시간에 10초를 더한
시간 이상)에 에스컬레이터 또는 무빙워크가 자동으로 정지되는 제어방법으로 설계되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.7' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.7','에스컬레이터','2022-03-02',NULL,'current','5.12.3.7 정지–자동 작동
 이용자가 5.12.3.3 및 5.12.3.4에서 설명된 감지수단을 작동시킨 후 충분한 시간 (예상
 승객수송시간에 10초를 더한 시간 이상)이 흐른 다음에 에스컬레이터 또는 무빙워크가



                                           [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




자동으로 정지되는 제어방법으로 설계되는 것은 허용된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.7' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.8.1','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.2.3.1 비상정지스위치는 비상시 에스컬레이터 또는 무빙워크를 정지시키기 위해 설치되어야 하고 에스컬레이터 또는
       무빙워크의 각 승강장 또는 승강장 근처에 눈이 뛰고 쉽게 접근할 수 있는 위치에 있어야 한다.
비상정지스위치 사이의 거리는 다음과 같아야 한다.
 - 에스컬레이터의 경우에는 30 m 이하이어야 한다.
 - 무빙워크의 경우에는 40 m 이하이어야 한다.
필요할 경우 추가적인 정지스위치는 거리를 유지하도록 설치되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.8.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.8.1','에스컬레이터','2001-06-18','2007-09-09','old','3.3.2(3) 승강장에서 디딤판의 승강을 정지시키는 것이 가능한 장치


4.3.2(3) 상하 승강장의 기동스위치?정지스위치?비상정지버튼스위치 및 신호스위치 등의 작동상태는 양호하여야 한다.


4.3.2(20) 비상시 사용하는 비상정지버튼스위치는 다음 기준에 적합하여야 한다.
① 비상정지버튼스위치는 비상시 쉽게 작동할 수 있도록 상하 승강장의 잘 보이는 곳에 설치하여야 한다. 또한, 층고가
   12m를 초과하는 에스컬레이터나 길이가 40m를 초과하는 수평보행기의 경우에는 승강로의 도중에 비상정지버튼스위치를
   추가로 설치하여야 하며, 추가로 설치한 비상정지버튼스위치의 간격은 에스컬레이터의 경우 15m, 수평보행기의 경우
   40m를 초과하지 않아야 한다.
③ 비상정지버튼스위치에는 장난 등에 의한 오조작을 방지하기 위하여 덮개를 설치하여야 하며, 덮개는 비상시 쉽게 열 수
  있는 구조이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.8.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2007-09-09');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.8.1','에스컬레이터','2007-09-10','2013-09-14','old','3.3.2(3) 승강장에서 디딤판의 승강을 정지시키는 것이 가능한 장치


4.3.2(3) 상하 승강장의 기동스위치?정지스위치?비상정지버튼스위치 및 신호스위치 등의 작동상태는 양호하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.8.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2007-09-10' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.8.1','에스컬레이터','2022-03-02',NULL,'current','5.12.3.8.1 정지장치의 액추에이터가 작동될 때, 5.12.2.7.15에 따라 비상상황 시 에스컬
 레이터 또는 무빙워크를 정지시키기 위한 비상정지장치를 설치해야 한다.
 정지장치의 액추에이터는 에스컬레이터 또는 무빙워크의 각 승강장 또는 승강장 근처에
 눈에 뛰고 쉽게 접근할 수 있는 위치에 있어야 한다.(6.1.2.2 참조)
 승강장에서, 정지 스위치는 디딤판 바깥 구역에서 접근 가능해야 한다.
 정지 스위치가 난간 높이 h1의 중간 이하에 위치하는 경우, 그림 12에 따른 다음 특징
 을 가진 표시가 난간의 안쪽에 위치해야 한다.

                                                                 치수 (㎜)




      비고 이 그림은 일정한 비율로 그려져 있지 않고 단지 기준을 설명한다.

                            [그림 12. 정지 장치 표시 예]
     - 지름 80 ㎜ 이상
     - 적색
     - 흰색 글씨로”정지”(필요시 다른 언어 병기 가능)라고 표시
     - 난간 높이 h1의 중간 이상에 위치
     - 정지장치를 가리키는 화살표(난간 높이 h1의 중간 이하에 위치할 수도 있음)
 비상정지장치 사이의 거리는 다음과 같아야 한다.
     - 에스컬레이터의 경우에는 30 m 이하이어야 한다.
     - 무빙워크의 경우에는 40 m 이하이어야 한다.
 필요한 경우 추가적인 정지장치는 거리를 유지하도록 설치되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.8.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.8.2','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.2.3.2 비상정지스위치는 5.12.1.2에 따른 전기안전장치이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.8.2','에스컬레이터','2001-06-18','2007-09-09','old','      3.3.2(3) 승강장에서 디딤판의 승강을 정지시키는 것이 가능한 장치


      4.3.2(3) 상하 승강장의 기동스위치?정지스위치?비상정지버튼스위치 및 신호스위치 등의 작동상태는 양호하여야 한다.



<추가 종전 기준>----------------------------------------------' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2007-09-09');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.8.2','에스컬레이터','2001-06-18','2007-09-09','old','4.3.2(20) 비상시 사용하는 비상정지버튼스위치는 다음 기준에 적합하여야 한다.
③ 비상정지버튼스위치에는 장난 등에 의한 오조작을 방지하기 위하여 덮개를 설치하여야 하며, 덮개는 비상시 쉽게 열 수
   있는 구조이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2007-09-09');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.8.2','에스컬레이터','2022-03-02',NULL,'current','5.12.3.8.2 비상정지장치는 5.12.2.6.1에 따른 안전장치이어야 한다.
  비고 KS B ISO 13850에 따른 장치는 5.12.3.8에 따른 정지장치에 대한 기능 기준을 지원하지 않는다.
         에스컬레이터 및 무빙워크의 안전이라는 특수 목적을 위한 비상정지장치는 KS B ISO 13850과 다
         르게 정의된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.8.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.9','에스컬레이터','2013-09-15','2022-03-01','old','      5.12.2.2.4 감시 또는 전기안전장치에 의한 정지(5.12.1.2.1.1 참조)



<추가 종전 기준>----------------------------------------------' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.9' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.9','에스컬레이터','2022-03-02',NULL,'current','5.12.3.9 보호, 안전장치 및 기능에 의한 정지
  표 6, 항목 가), 나), 다)의 모든 보호수단과 표 8 및 표 9의 모든 감지수단은 5.12.3.5
  에 따라 정지되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.9' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.10','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.1.1.1 에스컬레이터 및 무빙워크는 균일한 감속 및 정지 상태(제동 운전)를 지속할 수 있는 브레이크 시스템이 있어야
       한다. 또한, 5.12.1.2.4를 참조한다. 브레이크 시스템의 적용에서 의도적인 지연은 없어야 한다.
정지거리가 5.4.2.1.3.2 및 5.4.2.1.3.4의 최대값의 20 %를 초과하면, 고장 안전장치의 재설정[표 5의 거)]후에만 재-기동이
가능하여야 한다. 수동 재설정 전에 브레이크 시스템에 대한 정밀점검이 필요하다면 브레이크 시스템은 정밀하게 조사되어야
하고 정확한 조치가 취해지도록 설계되어야 한다.
에스컬레이터 및 무빙워크의 출발 후에는 브레이크 시스템의 개방을 감시하는 장치가 설치되어야 한다.[표 5의 타) 참조]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.10' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.10','에스컬레이터',NULL,'2013-09-14','old','3.3.2(6) 동력이 차단되었을 때 관성에 의한 전동기의 회전을 자동적으로 제지하는 장치' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.10' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.10','에스컬레이터','2022-03-02',NULL,'current','5.12.3.10 허용된 정지거리 초과 시 기동 방지
  최대 허용 정지거리(5.4.2.1.3.2 및 5.4.2.1.3.4)가 20 % 초과되는 경우 기동을 방지하
  는 장치가 제공되어야 한다. 5.12.2.8에 따른 고장 잠금 기능이 제공되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.10' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.11','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.3 운행방향의 역전
운행방향의 의도된 역전은 에스컬레이터 또는 무빙워크가 멈춘 상태로 있고 5.12.2.1, 5.12.2.1.2, 5.12.2.1.3 및 5.12.2.2.2에
적합한 경우에만 가능하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.11' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.11','에스컬레이터','2022-03-02',NULL,'current','5.12.3.11 운행방향의 의도된 역전
 운행방향의 의도된 역전은 에스컬레이터 또는 무빙워크가 정지되어 있고 5.12.3.2가 적
 용된 경우에만 가능해야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.11' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.12','에스컬레이터','2013-09-15','2022-03-01','old','5.4.2.1.1.1 에스컬레이터 및 무빙워크는 균일한 감속 및 정지 상태(제동 운전)를 지속할 수 있는 브레이크 시스템이 있어야
       한다. 또한, 5.12.1.2.4를 참조한다. 브레이크 시스템의 적용에서 의도적인 지연은 없어야 한다.
정지거리가 5.4.2.1.3.2 및 5.4.2.1.3.4의 최대값의 20 %를 초과하면, 고장 안전장치의 재설정[표 5의 거)]후에만 재-기동이
가능하여야 한다. 수동 재설정 전에 브레이크 시스템에 대한 정밀점검이 필요하다면 브레이크 시스템은 정밀하게 조사되어
야 하고 정확한 조치가 취해지도록 설계되어야 한다.
에스컬레이터 및 무빙워크의 출발 후에는 브레이크 시스템의 개방을 감시하는 장치가 설치되어야 한다.[표 5의 타) 참조]


5.12.2.4.2 자동 재-기동에 대한 재개
5.12.2.2.3에 따른 비상정지스위치에 의해 정지된 경우 5.12.2.1에서 기술된 스위치 없이 자동으로 재-기동되는 에스컬레이터
또는 무빙워크의 재-기동은 다음 조건하에서 허용된다.
가) 사람이나 물체가 콤의 교차선과 각 콤 측면의 추가적인 0.3 m사이 안에 없을 때에만 재개되도록 스텝, 팔레트 또는
   벨트는 콤의 교차선과 각 콤을 지나 0.3 m 사이에서 통제되어야 한다.
   이 장치는 상기 구역의 어느 곳에서나 직경 0.3 m, 높이 0.3 m의 불투명한 원통을 감지할 수 있어야 한다.
나) 에스컬레이터 또는 무빙워크는 5.12.2.1.2에 따라 이용자가 들어가면 운행되어야 한다.
   10초 이상 동안 제어장치가 설정된 구역 내에서 사람이나 물체를 감지하지 못할 때에만 운행되어야 한다.
다) 자동 재-기동을 위한 제어장치에 의해 시작되는 재개제어는 5.12.1.2에 따른 전기안전장치이어야 한다. 자체제어 송신부품은
   1개의 회로설계로 허용된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.12' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.12','에스컬레이터',NULL,'2013-09-14','old','3.3.2(6) 동력이 차단되었을 때 관성에 의한 전동기의 회전을 자동적으로 제지하는 장치




                                       [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.12' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.12','에스컬레이터','2022-03-02',NULL,'current','5.12.3.12 자동 재-기동에 대한 재개
 5.12.3.8에 따른 비상정지스위치에 의해 정지된 경우, 5.12.3.2에서 언급된 스위치 없이
 자동 재-기동을 위한 에스컬레이터 또는 무빙워크의 재개는 다음 조건하에서 허용된다.
 가) 디딤판은 콤의 교차선과 콤을 지나 추가로 0.3m 사이가 감시되어지므로 자동 재-
        기동에 의한 재개는 이 구역에 사람이나 물체가 없는 경우에만 수행되어 진다. 이
        장치는 구역 내의 어느 위치에서나 직경 0.3 m, 높이 0.3 m의 불투명한 직립형 원
        통을 감지할 수 있어야 한다.
 나) 에스컬레이터 또는 무빙워크는 5.12.3.3 및 5.12.3.4에 따라 이용자가 진입하면 기
        동한다. 최소 10초 동안 제어장치가 설정된 구역 내에서 사람이나 물체를 감지하지
        못한 경우에만 기동되어야 한다.
 다) 자동 재-기동을 위한 제어장치에 의해 시작되는 재개 제어는 5.12.2에 따른 전기안
        전장치이어야 한다. 자체 제어 송신부품은 단일 채널 설계에서만 허용된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.12' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.13.1','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.5.1 에스컬레이터 또는 무빙워크에는 유지보수 또는 점검하는 동안 휴대용 수동운전 제어장치가 설치되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.13.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.13.1','에스컬레이터','2022-03-02',NULL,'current','5.12.3.13.1 에스컬레이터 또는 무빙워크에는 휴대하기 쉽고 수동으로 작동되는 제어장치
 를 통해 점검 등 유지관리 업무를 하는 동안 기기를 작동할 수 있도록 점검운전 제어장
 치가 설치되어야 한다.
 각 에스컬레이터 또는 무빙워크에 대해 적어도 1개 이상의 휴대용 제어장치가 보관되어
 야 한다.
 이 장치는 에스컬레이터/무빙워크의 작동을 활성화하고 유지하기 위해 양손을 사용하여
 한 손은 방향 제어 장치에 두고 다른 손은 운행 제어 장치에 두어 연속적으로 동시에
 작동시켜야 한다.
 비고 동시 작동은 2개의 제어장치 각각의 시작 시간 지연과 관계없다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.13.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.13.2','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.5.2 이 목적을 위해, 휴대용 수동운전 제어장치의 가요성 케이블의 연결을 위한 1개의 점검용 콘센트는 적어도 각 승강장
       (트러스 내부에 있는 구동 장소 및 순환 장소 내부 등)에 설치되어야 한다. 케이블의 길이는 3 m 이상이어야 한
       다. 점검용 콘센트는 에스컬레이터 또는 무빙워크의 어떤 곳이든 케이블이 도달할 수 있는 곳에 위치되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.13.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.13.2','에스컬레이터','2022-03-02',NULL,'current','5.12.3.13.2 이를 위해, 휴대용 제어장치의 유연 케이블 연결을 위한 1개의 점검용 콘센
 트는 적어도 각 승강장(트러스 내의 구동 장소 및 순환 장소 등)에 제공되어야 한다.
 케이블의 길이는 3 m 이상이어야 한다.
 점검용 콘센트는 에스컬레이터 또는 무빙워크의 어떤 곳이든 케이블이 도달할 수 있는
 곳에 위치되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.13.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.13.3','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.5.3 이 제어장치의 작동부품은 우발적인 작동에 대해 보호되어야 한다. 에스컬레이터 또는 무빙워크는 손으로 스위치를 지
       속적으로 누르는 동안에만 운전되어야 한다. 각 제어장치에는 정지스위치가 설치되어야 하며 이 스위치는 한다.
정지스위치는 다음과 같아야 한다.
 가) 수동으로 작동되어야 한다.
 나) 스위치 전환 위치가 분명하고 영구적으로 표시되어야 한다.
 다) 5.12.1.2.2에 적합한 안전 스위치이어야 한다.
 라) 수동 재설정이 요구되어야 한다.
 점검 제어장치가 플러그-인 될 때 정지 스위치가 작동되면 구동기에 공급되는 전원을 차단시켜야 하고 브레이크가 작동되어야
 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.13.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.13.3','에스컬레이터','2022-03-02',NULL,'current','5.12.3.13.3 점검운전 제어장치의 조작부품은 우발적인 조작에 대해 보호되어야 한다. 에스
 컬레이터 또는 무빙워크는 수동압력을 지속적으로 가하여 조작부품을 작동시키는 동안에
 만 운전되어야 한다.
 운행 방향은 스위치에 표시하여 명확하게 인식할 수 있어야 한다.
 각 점검운전 제어장치에는 5.12.2.7.18에 따른 정지장치가 설치되어야 한다.
 점검운전 제어장치를 점검용 콘센트에 연결하였을 때 정지 스위치가 작동되면 구동기에 공
 급되는 전원을 차단시켜야 하고 브레이크가 작동되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.13.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.13.4','에스컬레이터','2013-09-15','2022-03-01','old','5.12.2.5.4 점검 제어장치가 사용될 때, 다른 모든 기동장치는 5.12.1.2에 따라 무효화 되어야 한다.
 모든 점검용 콘센트는 1개 이상의 제어장치가 연결되면 모두 무효화되는 방법으로 설치되어야 한다. 전기안전장치
 (5.12.2.2.4에 따른)는 표 5의 아), 차), 카), 타), 파) 및 하)에서 기술된 전기안전장치를 제외하고 효력이 있어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.13.4' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '5.12.3.13.4','에스컬레이터','2022-03-02',NULL,'current','5.12.3.13.4 점검운전 제어에서, 점검운전 제어장치는 에스컬레이터 또는 무빙워크를 기
  동시키는 유일한 수단이어야 한다.
  다른 모든 기동 장치는 작동불능 상태가 되어야 한다.
  모든 점검용 콘센트는 2개 이상의 점검운전 제어장치가 연결되었을 때, 점검운전 제어
  장치 모두 에스컬레이터 또는 무빙워크의 기동이 작동되지 않도록 설치되어야 한다.(점
  검운전 제어에서 유효한 상태로 남아 있는 안전장치에 대해서는 표 8 및 표 9 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='5.12.3.13.4' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '6.1.1','에스컬레이터','2013-09-15','2022-03-01','old','6.1 일반사항
 모든 경고, 표시 및 라벨 등은 지울 수 없고 읽기 쉬우며 손쉽게 이해(필요할 경우 표지 또는 기호에 의해 지원)할 수
 있어야 한다. 이러한 것은 찢어질 수 없고 내구성이 있는 재질로 잘 보이는 곳에 있어야 하며 한글(필요시 다른 언어 병
 기 가능)로 기재되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='6.1.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '6.1.1','에스컬레이터','2022-03-02',NULL,'current','6.1.1 일반사항
  사용을 위한 모든 표시, 안내 및 문구는 견고한 재질로 눈에 띄는 위치에 명확하게 읽
  을 수 있는 한글로 작성되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='6.1.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '6.1.2.1','에스컬레이터','2013-09-15','2022-03-01','old','6.2.1 주의표시를 위한 표시판 또는 표지는 견고한 재질로 만들어야 하며, 승강장에서 잘 보이는 곳에 확실히 부착되어야 한다.
 주의표시는 80 mm × 100 mm 이상의 크기로 그림 9와 같이 표시되어야 한다.


[그림 9- 에스컬레이터 또는 무빙워크 출입구 근처의 주의표시 ]




                                       기준규격
                 구 분                                     색 상
                                        (mm)
              최소 크기                    80 × 100           -
                 바탕                       -              흰색
                         원             40 × 40            -
                        바탕                -              황색
                        사선                -              적색
                        도안                -              흑색

                                                       녹색(안전)
                                       10 × 10
                                                       황색(위험)

              안전, 위험                   10 × 10           흑색

         주의              대              19 Pt            흑색
         문구              소              14 Pt            적색




                                       [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='6.1.2.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '6.1.2.1','에스컬레이터','2022-03-02',NULL,'current',' 6.1.2.1 주의표시를 위한 표시판 또는 표지는 견고한 재질로 만들어야 하며, 승강장에서
   잘 보이는 곳에 확실히 부착되어야 한다.
   주의표시는 80 ㎜ × 100 ㎜ 이상의 크기로 그림과 같이 표시되어야 한다.




                             [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




                            기준규격
          구 분                                  색 상
                             (㎜)

         최소 크기             80 × 100             -

          바탕                  -                흰색

                  원        40 × 40              -

                  바탕          -                황색

                  사선          -                적색

                  도안          -                흑색

                                             녹색(안전)
                           10 × 10
                                             황색(위험)

         안전, 위험            10 × 10             흑색

    주의            대         19 Pt              흑색
    문구            소         14 Pt              적색

비고 상기의 주의표시이외에 부속서 Ⅴ의 주의표시를 추가로 부착할 수 있다.


       [그림 13. 에스컬레이터 또는 무빙워크 출입구 근처의 주의표시]
                                  <2022년 3월 2일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='6.1.2.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '6.1.2.2','에스컬레이터','2013-09-15','2022-03-01','old','6.2.2 5.12.2.2.3에 기술된 정지장치 또는 근처에 “정지(필요 시 기타 언어 병행 가능)”라는 적색의 글자가 표기되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='6.1.2.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '6.1.2.2','에스컬레이터','2001-06-18','2013-09-14','old','4.3.2(20) 비상시 사용하는 비상정지버튼스위치는 다음 기준에 적합하여야 한다.
 ② 비상정지버튼스위치의 색상은 적색으로 하여야 하며, 버튼 또는 버튼 부근에는 “정지” 표시를 하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='6.1.2.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '6.1.2.2','에스컬레이터','2022-03-02',NULL,'current','6.1.2.2 5.12.3.8에 기술된 정지장치는 적색으로 표시되어야 하며 정지장치 자체 또는 근
 처에 “정지(필요 시 기타 언어 병행 가능)”라고 표시되어야 한다.
 5.12.3.8.1에 언급된 정지장치 표시기는 상기 기준을 만족하는 것으로 간주되지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='6.1.2.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '6.1.2.3','에스컬레이터','2013-09-15','2022-03-01','old','6.2.3 유지보수, 점검 또는 유사한 작업을 하는 동안에는 접근을 막는 수단이 근처에 있어야 하며 이 수단에는 다음과 같은
   경고문이 표기되어야 한다.
 - “접근금지” 또는
 - “진입금지”' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='6.1.2.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '6.1.2.3','에스컬레이터','2022-03-02',NULL,'current','6.1.2.3 점검 등 유지관리 업무 또는 유사한 작업을 하는 동안에는 접근을 막는 수단이
  근처에 있어야 하며 이 수단에는 다음과 같은 경고문이 표기되어야 한다.
  - “접근금지” 또는
  - “진입금지”' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='6.1.2.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '6.1.3','에스컬레이터','2013-09-15','2022-03-01','old','6.2.4 수동 권취장치에 대한 지침
 수동 권치장치가 설치된 경우에는 사용에 대한 작동지침이 근처에 있어야 하며 에스컬레이터 또는 무빙워크의 운행방향이
 분명하게 표시되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='6.1.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '6.1.3','에스컬레이터','2022-03-02',NULL,'current','6.1.3 수동핸들에 대한 지침
  수동핸들이 설치된 경우에는 사용지침이 근처에 있어야 하며 에스컬레이터 또는 무빙워
  크의 운행방향이 분명하게 표시되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='6.1.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '6.1.4','에스컬레이터','2013-09-15','2022-03-01','old','6.2.5 트러스, 구동 및 순환 장소 외부의 구동기 출입문에 대한 주의
 트러스, 구동·순환장소 외부의 출입문에는 “기계실 -위험, 관계자 외 접근금지” 와 같은 경고문이 표기되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='6.1.4' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '6.1.4','에스컬레이터','2022-03-02',NULL,'current','6.1.4 트러스 외부의 기계류 공간, 구동 및 순환 장소 출입문에 대한 안내
  트러스 외부의 기계류 공간, 구동 및 순환장소 출입문에는”기계류 공간 - 위험, 관계자
  외 접근금지”문구의 안내문이 부착되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='6.1.4' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '6.2','에스컬레이터','2013-09-15','2022-03-01','old','       6.2.6 자동 운행 에스컬레이터 또는 무빙워크의 안내문
        에스컬레이터 또는 무빙워크가 자동으로 운행되는 경우, 도로교통표시와 같은 확실히 보이는 신호시스템에 의해 에스컬레이터
        또는 무빙워크의 이용 가능여부 및 운행방향을 이용자에게 안내되어야 한다.




                                                  [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




<추가 종전 기준>----------------------------------------------' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='6.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '6.2','에스컬레이터','2022-03-02',NULL,'current','6.2 자동 기동 에스컬레이터 또는 무빙워크의 표시장치
  자동으로 기동하는 에스컬레이터 또는 무빙워크의 경우(5.12.3.3 및 5.12.3.4 참조), 에
  스컬레이터 또는 무빙워크가 사용 가능한지와 운행방향을 이용자에게 알려주는 도로교
  통표시 같은 명확한 시각 신호 시스템이 제공되어야 한다.
  양방향 모드의 자동 운행은 이 작업에 대한 추가 표시가 요구된다.(예 :양방향 도로 표
  시 같은)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='6.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.1','에스컬레이터',NULL,'2013-09-14','old','4.3.2(18) 옥외에 설치되는 경우에는 다음 기준에 적합하여야 한다.
① 시설에 접한 지반에는 침하 및 함몰 등이 없어야 한다.
② 기초콘크리트에는 구조상 지장이 있는 균열 및 파손이 없어야 한다.
③ 기초주위에는 토사의 유출 및 함몰이 없어야 한다.
④ 기초는 부동침하?경사 및 이동이 없어야 한다.
⑤ 앵커볼트 및 받침대에는 녹 및 부식이 없어야 한다.
⑥ 앵커볼트의 체결상태는 견고하고, 쉽게 풀리지 않는 조치가 되어 있어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.1','에스컬레이터','2022-03-02',NULL,'current','7.1 일반 기준' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.1.1','에스컬레이터',NULL,'2013-09-14','old','4.3.2(18) 옥외에 설치되는 경우에는 다음 기준에 적합하여야 한다.
⑦ 기둥 및 보 등의 구조부재에는 녹 및 부식이 없고, 균열?파손 및 변형이 없어야 한다.
⑧ 보조부재 및 접합부에는 녹 및 부식이 없고, 균열?파손 및 변형이 없어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.1.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.1.1','에스컬레이터','2022-03-02',NULL,'current','7.1.1 에스컬레이터 및 무빙워크 그리고 지지설비는 부식으로부터 보호되어야 한다.
                                                   <2013년 9월 15일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.1.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.1.2','에스컬레이터','1997-08-18','2022-03-01','old','4.3.2(18) 옥외에 설치되는 경우에는 다음 기준에 적합하여야 한다.
⑪ 전원인입선용 인입구에는 방수조치가 되어 있어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.1.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1997-08-18' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.1.2','에스컬레이터','2022-03-02',NULL,'current','7.1.2 전기설비는 KS C IEC 60529에 따른 IP 54 이상 또는 NEMA 250에 따른 Type
  4 이상의 등급이나 동등 이상으로 보호되어야 한다.
  그리고 배선은 젖은 지역에서의 사용을 위해 KS C IEC 60364 또는 NFPA 70에 적합
  하거나 동등 이상이어야 한다.
                                                   <2013년 9월 15일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.1.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.2.1','에스컬레이터','2013-09-15','2022-03-01','old','8.2 강수에 대한 보호
 에스컬레이터 및 무빙워크의 수평 투영면적 바로 위에 보호 덮개가 설치되어야 한다. 이 덮개는 덮개 끝부분에서 핸드레일
 중심선까지 수직으로부터 15° 이상의 각도를 갖는 형상으로 핸드레일 중심선으로부터 외부방향으로 연장되어야 한다.(그림 13 참조)




                  [ 그림 13 옥외용 에스컬레이터 및 무빙워크의 보호 덮개 ]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.2.1' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.2.1','에스컬레이터','2022-03-02',NULL,'current','7.2.1 에스컬레이터 및 무빙워크의 수평 투영면적 바로 위에 보호 덮개가 설치되거나 눈
  ‧비 등에 젖었을 때 미끄러지지 않게 안전한 디딤판이 설치되어야 한다.
  보호 덮개를 설치할 경우, 이 덮개는 덮개 끝부분에서 손잡이 중심선까지 수직으로부터
  15°이상의 각도를 갖는 형상으로 손잡이 중심선으로부터 외부방향으로 연장되어야 한
  다.(그림 14 참조)
  비고 미끄럼 방지를 위한 디딤판은 부속서 Ⅷ참조








                       [ 그림 14. 옥외용 에스컬레이터 및 무빙워크의 보호 덮개 ]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.2.1' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.2.2','에스컬레이터','2013-09-15','2022-03-01','old','8.2.1 동절기에 스텝/팔레트/벨트, 승강장 및 스커트 디플렉터에 눈이 쌓이거나 물기가 들어는 오는 것을 방지하기 위한 난방시
   스템이 설치되어야 한다. 난방시스템의 작동은 자동 온도 조절로 제어되어야 하며 에스컬레이터의 운행과는 독립적이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.2.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.2.2','에스컬레이터','1997-08-18','1999-01-13','old','4.3.2(18) 옥외에 설치되는 경우에는 다음 기준에 적합하여야 한다.
⑨ 트러스 내부에 빗물 등이 침입하지 않도록 승강장 주위의 바닥면보다 높게하고, 바닥면과 승강장 사이에는 경사지게 하며,
  트러스 하부 피트에 고인 물이 배수되도록 물빼기구멍 또는 배수시설이 설치되어 있어야 한다. 또한, 고인물을 외부로
  배수시에는 적절한 정화시설을 갖추어야 한다.
⑫ 동절기에 눈 또는 얼음을 녹일 수 있는 장치가 설치되어 있고, 열원용 전원용량을 충분히 확보하여야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.2.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1997-08-18' AND COALESCE(expiry_date,'')='1999-01-13');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.2.2','에스컬레이터','2022-03-02',NULL,'current','7.2.2 동절기에 디딤판, 승강장 및 스커트 디플렉터에 눈이 쌓이거나 물기가 들어오는 것
  을 방지하기 위한 난방시스템이 설치되어야 한다.
  난방시스템의 작동은 자동 온도 조절로 제어되어야 하며 에스컬레이터의 운행과는 독립
  적이어야 한다.


                                                [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.2.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.2.3','에스컬레이터','1997-08-18','1999-01-13','old','4.3.2(18) 옥외에 설치되는 경우에는 다음 기준에 적합하여야 한다.
⑨ 트러스 내부에 빗물 등이 침입하지 않도록 승강장 주위의 바닥면보다 높게하고, 바닥면과 승강장 사이에는 경사지게 하며,
  트러스 하부 피트에 고인 물이 배수되도록 물빼기구멍 또는 배수시설이 설치되어 있어야 한다. 또한, 고인물을 외부로
  배수시에는 적절한 정화시설을 갖추어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.2.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1997-08-18' AND COALESCE(expiry_date,'')='1999-01-13');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.2.3','에스컬레이터','2022-03-02',NULL,'current','7.2.3 트러스 내부에 물이 침투되면 고인 물을 배수하는 수단이 있어야 한다. 또한 고인
 물이 기름 등으로 심하게 오염될 우려가 있는 경우를 대비하여 적절한 정화시설이 구비
 되어야 한다.
                                                  <2013년 9월 15일 이후 건축허가분부터 적용>' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.2.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.2.4','에스컬레이터','2013-09-15','2022-03-01','old','8.3 미끌림 방지
승강장 플레이트 및 콤 플레이트는 눈‧비 등에 젖었을 때 미끄러지지 않게 안전한 발판으로 설계되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.2.4' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.2.4','에스컬레이터','2022-03-02',NULL,'current','7.2.4 승강장 플레이트 및 콤 플레이트는 눈‧비 등에 젖었을 때 미끄러지지 않게 안전한
 발판으로 설계되어야 한다.(부속서 Ⅷ참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.2.4' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.3','에스컬레이터','2013-09-15','2022-03-01','old','8.4 야간 조명
야간에 승객이 승강장 플레이트 및 스텝/팔레트/벨트를 잘 볼 수 있도록 조명설비가 설치되어 있어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.3','에스컬레이터','1997-08-18','2013-09-14','old','4.3.2(18) 옥외에 설치되는 경우에는 다음 기준에 적합하여야 한다.
 ⑩ 야간에 승객이 발판을 잘 볼 수 있도록 조명설비가 설치되어 있어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.3' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='1997-08-18' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '7.3','에스컬레이터','2022-03-02',NULL,'current','7.3 야간 조명
 야간에 승객이 승강장 플레이트 및 디딤판을 잘 볼 수 있도록 조명설비가 설치되어 있
 어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='7.3' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','     6.2.7 제조업체 표시
     상‧하 승강장에서 잘 보이는 위치에 제조업체명(또는 로고)이 표기되어야 한다.



Ⅰ.2 이용자를 위한 자유공간

Ⅰ.2.1 뉴얼의 끝 지점 및 모든 지점의 자유공간을 포함한 에스컬레이터의 스텝 또는 무빙워크의
 팔레트나 벨트 위의 틈새 높이는 2.3 m 이상이어야 한다.(그림 5의 h4 및 그림 I.1 참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','     7.2.1 모든 지점에서 에스컬레이터의 스텝 또는 무빙워크의 팔레트나 벨트 위의 틈새 높이는 2.3 m 이상이어야 한다.(그림 2
        및 그림 11의 h4 참조)
     그 틈새 높이는 뉴얼의 끝까지 연장되어야 한다.
     비고 2.3 m의 틈새 높이는 또한 제한이 없는 구역에 적용되어야 한다.


Ⅰ.2.2 충돌을 방지하기 위해 에스컬레이터 또는 무빙워크 주위의 최소 자유구역은 그
 림 I.1과 같이 규정된다.
 틈새 높이 h4는 손잡이 바깥에서 높이 h12로 감소될 수 있으며, 에스컬레이터의 스텝
 또는 무빙워크의 팔레트나 벨트로부터 측정된 높이 h12는 2.1 m 이상이어야 한다.
 손잡이 바깥 가장자리와 벽 또는 다른 장애물(그림 I.1의 b10 참조) 사이의 거리는 어떤
 경우에도 80 ㎜ 이상이어야 하고 손잡이 하부 모서리 아래(그림 6의 b12 참조)에서 수직
 으로 25 ㎜ 이상이어야 한다. 다만, 적절한 조치에 의해 부상의 위험이 적어진 경우에
 는 이 공간이 작아지는 것이 허용된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','7.2.2 충돌을 방지하기 위해 에스컬레이터 또는 무빙워크 주위의 최소 자유구역은 그림 11과 같이 규정된다. 에스컬레이터의
   스텝 또는 무빙워크의 팔레트나 벨트로부터 측정된 높이 h12는 2.1 m 이상 이어야한다. 핸드레일 외부 끝 부분
   과 벽 또는 다른 물체(그림 11의 b10 참조)사이의 거리는 핸드레일 하부 모서리 아래(그림 3의 b12 참조)에서 수
   평으로 80 mm 및 수직으로 25 mm 이상이어야 한다. 다만, 신축성이 있는 재료로 보호조치를 하고 주의표시를 하
   는 등 적절한 조치에 의해 부상의 위험이 적어진 경우에는 이 공간이 작아지는 것은 허용된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2008-11-07','2013-09-14','old','    4.3.2(10) 핸드레일 외측끝단에서 수평으로 0.5m 이내 및 디딤면에서 높이 2.1m 이내에 기둥이나 보 등이 있거나 건축물
          천장부 또는 측면부 등에 요철부분이 있는 경우에는 승객이 다치지 않도록 신축성이 있는 재료(스폰지 등)로 보
          호조치를 하고 주의표시를 하여야 한다.








Ⅰ.2.3 평행하거나 십자형으로 교차된 서로 근접한 에스컬레이터 및 무빙워크의 경우, 손
  잡이 사이의 거리는 160 ㎜ 이상이어야 한다.(그림 Ⅰ.1의  참조)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2008-11-07' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','      7.2.3 평행하거나 십자형으로 교차된 서로 근접한 에스컬레이터의 경우, 핸드레일 사이의 거리는 160 mm이상이어야 한다.
         (그림 11의 b11 참조)


Ⅰ.2.4 건축물의 장애물로 인해 부상이 발생할 수 있는 장소는 적절한 예방조치가 취해져
  야 한다.
  특히, 계단 교차점 및 십자형으로 교차하는 에스컬레이터 또는 무빙워크의 경우에는 그
  림 Ⅰ.2와 같이 틈새의 수직거리가 300 ㎜ 되는 곳까지 막는 등의 조치를 하되 부딪쳤을
  때 신체에 상해를 주지 않는 탄력성이 있는 재료(스폰지 등)로 마감되어야 한다.(그림 5
  및 그림 7의 h5 참조)
  다만, 건축물 천장부 또는 측면부가 손잡이 외측 끝단에서 400 ㎜ 이상 떨어져 있는 경
  우에는 이 기준을 적용할 필요는 없다.(그림 Ⅰ.2 참조)
  막는 조치의 끝부분에서 수평으로 250 ∼ 350 ㎜ 전방에 부드러운 재질의 비고정식 안
  전 보호판이 설치되어야 한다.
  막는 조치 및 안전 보호판의 모서리나 끝부분은 날카롭지 않게 마감되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2015-05-13','2017-01-27','old','7.2.4 건축물의 장애물로 인해 부상이 발생할 수 있는 장소는 적절한 예방조치가 취해져야 한다.
 특히, 계단 교차점 및 십자형으로 교차하는 에스컬레이터 또는 무빙워크의 경우에는 그림 10과 같이 틈새의 수직거리가
 300 mm 되는 곳까지 막는 등의 조치를 하되 부딪쳤을 때 신체에 상해를 주지 않는 탄력성이 있는 재료(스폰지 등)
 로 마감되어야 한다. (그림 2 및 그림 4의 h5 참조) 다만, 건축물 천장부 또는 측면부가 핸드레일 외측 끝단에서 400
 mm 이상 떨어져 있는 경우 또는 교차각이 45°를 초과하는 경우에는 이 규정을 적용할 필요는 없다. (그림 11 참조)
 막는 조치의 끝부분에서 수평으로 250 ∼ 350 mm 전방에 부드러운 재질의 비고정식 안전 보호판이 설치되어야 한다.
 막는 조치 및 안전 보호판의 모서리나 끝부분은 날카롭지 않게 마감되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2015-05-13' AND COALESCE(expiry_date,'')='2017-01-27');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','7.2.4 건축물의 장애물로 인해 부상이 발생할 수 있는 장소는 적절한 예방조치가 취해져야 한다.
 특히, 계단 교차점 및 십자형으로 교차하는 에스컬레이터 또는 무빙워크의 경우에는 그림 10과 같이 틈새의 수직거리가
 300 mm 되는 곳까지 막는 등의 조치를 하되 부딪쳤을 때 신체에 상해를 주지 않는 탄력성이 있는 재료(스폰지 등)
 로 마감되어야 한다. (그림 2 및 그림 4의 h5 참조) 다만, 건축물 천장부 또는 측면부가 핸드레일 외측 끝단에서 400
 mm 이상 떨어져 있는 경우에는 이 규정을 적용할 필요는 없다. (그림 11 참조)
 막는 조치의 끝부분에서 수평으로 250 ∼ 350 mm 전방에 부드러운 재질의 비고정식 안전 보호판이 설치되어야 한다.
 막는 조치 및 안전 보호판의 모서리나 끝부분은 날카롭지 않게 마감되어야 한다.




                                       [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2001-06-18','2008-11-06','old','4.3.2(14) 난간부와 교차하는 건축물 천장부 또는 측면부 등과의 사이에 생기는 3각부에 사람의 머리 등 신체의 일부가
     끼이는 것을 방지하기 위하여 다음 각항의 조치가 되어 있어야 한다.
① 그림 1과 같이 3각부가 형성되지 않도록 3각부 틈새의 수직거리가 30㎝ 되는 곳까지 막는 등의 조치를 하되 디딤판의
  진행속도로 부딪쳤을 때 신체에 상해를 주지 않는 탄력성이 있는 재료(스폰지 등)로 마감처리 하여야 한다. 다만,
  건축물 천장부 또는 측면부가 핸드레일외측 끝단에서 50㎝ 이상 떨어져 있는 경우 또는 교차각이 45°를 초과하는
  경우에는 그러하지 아니하다.
② 사람이 3각부에 충돌하는 것을 경고하기 위하여 25～35㎝ 전방에 신체상해의 우려가 없는 재질의 비고정식 안전보호판
  등이 설치되어 있어야 한다. 다만, 건축물 천장부 또는 측면부가 핸드레일 외측 끝단에서 50㎝ 이상 떨어져 있는
  경우 또는 교차각이 60°를 초과하는 경우에는 그러하지 아니하다.
③ 3각부의 막는 재료 및 안전보호판과 건축물의 천장부 등 사람이 부딪칠 수 있는 부분의 모서리나 끝부분은 날카롭지
  않도록 마감처리 되어 있어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2008-11-06');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터',NULL,'1999-01-13','old','     4.3.2(14) 난간부와 교차하는 건축물 천장부 또는 측면부 등과의 사이에 생기는 3각부에 사람의 머리 등 신체의 일부가
          끼이는 것을 방지하기 위하여 다음 각항의 조치가 되어 있어야 한다.
     ① 그림 1과 같이 3각부가 형성되지 않도록 3각부 틈새의 수직거리가 30㎝ 되는 곳까지 막는 등의 조치를 하되 디딤판의
       진행속도로 부딪쳤을 때 신체에 상해를 주지 않는 탄력성이 있는 재료(스폰지 등)로 마감처리 하여야 한다. 다만,
       건축물 천장부 또는 측면부가 핸드레일외측 끝단에서 50㎝ 이상 떨어져 있는 경우 또는 교차각이 45°를 초과하는
       경우에는 그러하지 아니하다.
     ② 사람이 막은 부위에 충돌하는 것을 경고하기 위하여 25～35㎝ 전방에 신체상해의 우려가 없는 재질(아크릴판 등)의
       비고정식 안전보호판 등이 설치되어 있어야 한다.


Ⅰ.2.5 각각의 에스컬레이터 또는 무빙워크의 출구에는 승객을 수용할 수 있는 충분한
 자유공간이 있어야 한다.







   자유공간의 폭은 각각의 손잡이 바깥 끝단에서 80 ㎜를 더한 지점 사이의 거리 이상이
   어야 한다.
   자유공간의 깊이는 난간의 끝에서부터                  측정하여 2.5 m 이상이어야 한다.
   자유공간의 폭이 손잡이 바깥 끝단에서 80 ㎜를 더한 지점 사이의 거리에 2배 이상으로
   증가되는 경우 2 m로 감소하는 것이 허용된다.
   이러한 자유공간은 건물 내 다른 승객들의 흐름 등에 영향을 받지 않는다고 가정할
   때, 모든 조건에서 적용될 수 있는 최소 허용 치수이다.
   비고 안내 울타리 및 운행 안내 표시 기둥은 Ⅰ.5 참조
   자유공간의 중첩은 허용되지 않고 측면 이동은 허용된다.
   자유공간의 바닥은 평평해야 한다. 경사도는 6 °이하이어야 한다.
   자유공간 내의 고정형 계단은 허용되지 않는다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='' AND COALESCE(expiry_date,'')='1999-01-13');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','7.2.5 각각의 에스컬레이터나 무빙워크의 출구에서 사람을 수용할 수 있는 충분한 자유공간이 있어야 한다. 자유공간의
      폭은 각 면에 80 mm를 더한 핸드레일의 외부 끝단 사이의 거리에 상응하는 값 이상이어야 한다. 그 깊이는 난간의 끝에서
      부터 측정하여 2.5 m 이상이어야 한다. 자유공간의 폭이 각 면에 80 mm를 더한 핸드레일의 외부 끝단 사이의 거리
      2배 이상 증가된 경우에는 2 m로 감소하는 것이 허용된다.
 비고 연속되는 에스컬레이터 및 무빙워크에 대한 자유공간의 깊이는 이용의 유형(승객용 또는 수송 장치를 포함한 승객용,
       중간 출입구의 개수, 관련된 방침과 이론적 수용능력 등)에 따라 각각의 여건에 맞게 결정되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2001-06-18','2008-11-06','old','      3.3.1(7) 승강장의 면적은 다음 기준에 적합하여야 한다.
       ① 승강장의 폭은 핸드레일 중심선간의 거리 이상이어야 한다.
       ② 승강장의 길이는 난간 끝단에서 진행방향으로 2.5m 이상이어야 한다. 다만, 승강장의 폭이 핸드레일 중심선간 거리의
           2배 이상일 경우에는 2.0m 이상으로 할 수 있다.



Ⅰ.2.5.1 에스컬레이터/무빙워크 승강장에 대면하는 방화셔터가 손잡이 반환부의 선단에서 2
  m 이내에 설치된 경우 방화셔터가 닫히기 시작할 때 연동하여 자동으로 정지시키는 장치
  가 설치되어야 한다.
  여러 개의 방화셔터가 하나의 구획으로 구성되어 그것들이 동시에 폐쇄되는 경우 어느 쪽
  의 셔터와 연동되어도 된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2001-06-18' AND COALESCE(expiry_date,'')='2008-11-06');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','7.4.1 에스컬레이터에는 승강장에 근접하여 설치된 방화셔터가 닫히기 시작할 때 자동으로 에스컬레이터를 정지시키는 장치가
      설치되어야 한다.


7.4.2 에스컬레이터 승강장에 대면하는 방화셔터가 핸드레일 반환부의 선단에서 2 m 이내에 있는 것에서는 당해 에스컬레이터는
      그 셔터의 폐쇄개시와 연동하여 정지하여야 한다. 또한, 상기의 셔터를 포함하여 여러 개의 방화셔터가 하나의 구획
      으로 구성되어 그것들이 동시에 폐쇄되는 경우에 에스컬레이터의 연동정지는 어느 쪽의 셔터와 연동되어도 된다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2008-11-07','2013-09-14','old','       3.3.2(2) 승강장에 근접하여 설치한 방화셔터 등이 닫히기 시작할 때 디딤판의 승강을 자동적으로 정지시키는 장치


       4.3.2(2) 에스컬레이터 승강장에 대면하는 방화셔터가 핸드레일 반환부의 선단에서 2m 이내에 있는 것에서는 당해 에스컬레이터는 그
           셔터의 폐쇄개시와 연동하여 정지하여야 한다. 또한, 상기의 셔터를 포함하여 여러개의 방화셔터가 하나의 구획으
           로 구성되어 그것들이 동시에 폐쇄되는 경우에 에스컬레이터의 연동정지는 어느 쪽의 셔터와 연동되어도 된다.




                                               [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




Ⅰ.2.5.2 연속으로 이어지는 에스컬레이터/무빙워크 사이의 공간이 충분하지 않은 경우,                                다
 음과 같은 추가적인 비상정지장치가 제공되어야 한다.
 가) 에스컬레이터/무빙워크 내부에서 닿을 수 있고,
 나) 디딤판이 콤 교차선에 도달하기 전, 2 m ~ 3 m 사이의 거리에 있고,
 다) 손잡이 상부면에서 액추에이터(예: 누름 버튼, 핸들) 중심까지 측정된 수직범위가 손잡
      이 아래로 200 ㎜ 위로 400 ㎜ 이내에 있을 것
 난간의 내외부에 있는 조립품은 걸림(또는 끼임)으로 인한 손상의 위험을 제거하는 방식
 으로 배열되고 형성될 때 허용된다.(5.5.2.4, Ⅰ.2.2 및 Ⅰ.5를 고려함)
                                                <2019년 3월 28일 이후 건축허가분부터 적용>

Ⅰ.2.6 중간 출입구 없이 연속되는 에스컬레이터 및 무빙워크의 경우, 동일한 승객 수
 송능력을 가져야 한다.
 5.12.2.7.8에 따른 안전장치가 제공되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2008-11-07' AND COALESCE(expiry_date,'')='2013-09-14');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','     7.2.6 중간 출입구 없이 연속되는 에스컬레이터 및 무빙워크의 경우에는 모두 동일한 수용능력을 가져야 한다.[표 5의 아) 참조]



Ⅰ.2.7 사람이 승강장에서 손잡이 바깥 끝단에 접촉할 수 있고, 추락하는 등의 위험한 상
 황에 처할 수 있는 곳에서는 적절한 예방 조치가 이루어져야 한다.(그림 I.3 참조)
 몇가지 예는 다음과 같다.
 - 영구적인 보호수단의 설치로 해당공간으로의 진입 방지
 - 위험 지역에서 고정난간의 건축구조 높이를 손잡이 위로 100 ㎜이상 높게 하고, 손잡
     이 바깥 끝단에서부터 80 ㎜에서 120 ㎜ 사이에 위치토록 함' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2015-05-13','2017-01-27','old','7.2.7 사람이 승강장에서 핸드레일 외부 끝단에 접촉할 가능성이 있고, 사람이 추락하는 등의 위험한 상황에 처할 수 있는
   곳에서는 적절한 조치가 이루어져야 한다.(그림 12 참조)
비고 상기와 같은 적절한 조치로 다음과 같이 할 수 있다.
 - 영구적인 보호수단의 설치로 공간으로의 출입 방지
 - 위험 지역에서 핸드레일 위로 100 mm이상, 그리고, 핸드레일 외부 끝단에서부터 80 mm에서 120 mm 사이에 위치한
  고정난간의 높이 증가' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2015-05-13' AND COALESCE(expiry_date,'')='2017-01-27');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','    7.2.7 사람이 승강장에서 핸드레일 외부 끝단에 접촉할 가능성이 있고, 난간을 넘는 것과 같은 위험한 상황에 처할 수
       있는 곳에서는 적절한 조치가 이루어져야 한다.(그림 12 참조)
    예를 들면, 다음과 같이 할 수 있다.
     - 영구적인 장애물의 설치로 공간으로의 출입 방지
     - 위험 지역에서 핸드레일 위로 100 mm이상, 그리고, 핸드레일 외부 끝단에서부터 80 mm에서 120 mm 사이에 위치한
      고정난간의 높이 증가








Ⅰ.2.8 에스컬레이터 또는 무빙워크의 주변, 특히 콤 부근은 밝게 비춰져야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','      7.2.8 콤을 포함한 승강장에서의 조도는 바닥에서 측정하여 콤의 교차 선에서 50 Lux 이상이어야 한다.


Ⅰ.2.9 주변 공간 및/또는 기기 자체에 조명을 배치하는 것은 허용된다. 콤을 포함한 승
  강장 조도는 해당 구역의 일반 조명 조도와 관련되며, 바닥에서 측정된 콤 교차선에서
  의 조도는 50 ㏓ 이상이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','      7.2.8 콤을 포함한 승강장에서의 조도는 바닥에서 측정하여 콤의 교차 선에서 50 Lux 이상이어야 한다.



Ⅰ.3 트러스 외부의 기계류 공간

Ⅰ.3.1 기계류 공간에 사람의 안전한 접근이 제공되어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','      7.3.1 구동기 공간으로의 안전한 출입이 제공되어야 한다.


Ⅰ.3.2 기계류 공간은 잠글 수 있어야하고 자격자만이 접근할 수 있어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','      7.3.2 구동기 공간에는 잠금장치가 있어야 하고 오직 권한 있는 사람만이 출입할 수 있어야 한다.


Ⅰ.3.3 기계류 공간에는 영구적으로 설치된 전기조명장치가 다음과 같이 제공되어야 한다.
  가) 작업구역의 바닥에서 200 ㏓ 이상
  나) 작업구역으로 접근하는 통로의 바닥에서 50 ㏓ 이상' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','      7.3.3 구동기 공간은 다음과 같은 조명이 영구적으로 설치되어야 한다.
       가) 작업공간의 바닥에서 200 lx 이상
       나) 작업공간으로 접근하는 통로의 바닥에서 50 lx 이상


Ⅰ.3.4 비상조명은 모든 기계류 공간에서 작업하는 모든 인원의 안전한 대피를 위해 설
  치되어야 한다.
  비고 비상조명은 점검 등 유지관리 업무를 지속하기 위한 것은 아니다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','      7.3.4 비상조명은 구동기 공간의 어떤 공간에서 일하는 작업자의 안전한 피난을 위해 설치되어야 한다.


Ⅰ.3.5 기계류 공간의 크기는 설비, 특히 전기설비의 작업이 쉽고 안전하도록 충분해야 한다.
  작업구역에서 유효 높이는 2 m 이상이어야 하고, 다음 사항에 적합해야 한다.
  가) 제어패널 및 캐비닛 전면의 유효 수평면적은 아래와 같아야 한다.
       1) 깊이는 외함의 표면에서 측정하여 0.7 m 이상
       2) 폭은 0.5 m 또는 제어패널과 캐비닛의 전체 폭 중에서 큰 값 이상



                                              [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




나) 움직이는 부품의 점검 등 유지관리 업무가 필요한 지점에서 유효 수평면적은 0.5 m ×
      0.6 m 이상이어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','     7.3.5 구동기 공간의 크기는 설비, 특히 전기설비의 작업이 쉽고 안전하도록 충분하여야 한다.
     작업구역에서 유효 높이는 2 m 이상이어야 하고 다음 사항에 적합하여야 한다.
     가) 제어 패널 및 캐비닛 전면의 유효 수평면적은 아래와 같아야 한다.
      1) 폭은 0.5 m 또는 제어 패널‧캐비닛의 전체 폭 중에서 큰 값 이상
      2) 깊이는 외함의 표면에서 측정하여 0.7 m 이상
     나) 움직이는 부품의 유지보수 및 점검을 위한 유효 수평면적은 0.5 m × 0.6 m 이상이어야 한다.


Ⅰ.3.6 이동을 위한 유효 높이는 1.8 m 이상이어야 한다.
 이동을 위한 통로의 폭은 0.5 m 이상이어야 한다. 다만, 움직이는 부품이 없는 경우에
 는 0.4 m로 줄일 수 있다.
 이동을 위한 공간의 유효 높이는 다음과 같은 바닥에서부터 구조물의 지붕 및                                       빔
 하부까지 측정하여 1.8 m 이상이어야 한다.
 가) 접근지역
 나) 작업구역' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','     7.3.6 이동을 위한 통로의 폭은 0.5 m 이상이어야 한다. 다만, 움직이는 부품이 없는 경우에는 0.4 m로 줄일 수 있다.
     이동을 위한 공간의 유효 높이는 다음과 같은 바닥에서부터 구조물의 지붕ㆍ빔 하부까지 측정하여 1.8 m 이상이어야 한다.
      가) 접근지역
      나) 작업구역


Ⅰ.3.7 기계류 공간의 유효 높이는 2.0 m 이상이어야 한다.
                                                  <2019년 3월 28일 이후 건축허가분부터 적용>


Ⅰ.4 쇼핑 카트 및 수하물 카트의 접근 방지를 위한 조치
                                                  <2019년 3월 28일 이후 건축허가분부터 적용>

Ⅰ.4.1 일반사항

 쇼핑 카트 및 수하물 카트를 에스컬레이터 또는 무빙워크로 가져올 수 있는 합리적이
 고 예측 가능한 위험이 있는 경우, 다음과 같은 조건이 주어지면 위험을 제거하고 접
 근을 방지하기 위한 적절한 조치가 취해져야 한다.
 가) 에스컬레이터의 경우
     - 주변 지역에서 쇼핑 카트 또는 수하물 카트를 사용할 수 있는 경우
     - 쇼핑 카트 또는 수하물 카트가 에스컬레이터에 가까이 있지 않지만 에스컬레이터로 가
       져올 수 있는 것이 합리적이고 예측 가능한 경우
 나) 무빙워크
     - 쇼핑 카트 또는 수하물 카트가 무빙워크에서 사용되지 않도록 한 경우







   비고 카트가 난간과 진입방지대 사이를 통과하지 못하도록 카트의 폭을 정의하는 것은 소유자의
        책임이다.

 Ⅰ.4.2 진입방지대
                                      <2019년 3월 28일 이후 건축허가분부터 적용>

   진입방지대가 사용되는 경우, 다음 요구조건이 충족되어야 한다.
   가) 진입방지대는 입구에만 설치해야 한다. 자유구역에서는 출구에 설치할 수 없다.
   나) 진입방지대 설계는 다른 위험을 초래하지 않아야 한다.
   다) 뉴얼의 끝과 진입방지대 및 진입방지대와 진입방지대 사이의 자유로운 입구 폭은
        500 ㎜ 이상이어야 하며, 사용되는 쇼핑 카트 또는 수하물 카트 유형의 폭보다 작
        아야 한다.
   라) 진입방지대의 높이는 900 ㎜에서 1,100 ㎜ 사이이어야 한다.
   마) 진입방지대 및 고정장치는 높이 200 ㎜에서 3,000 N의 수평력을 견뎌야 한다.
   비고 이 힘은 쇼핑카트의 경우 EN 1929-1 [5]에 따른 섀시의 충격으로 발생/수하물 카트의 경우
        160 ㎏ 하중을 적재하여 1㎧ 의 속도로 움짐임으로 발생
   바) 진입방지대는 가급적이면 건물 구조물에 고정되어야 한다. 승강장 플레이트에 고
        정시키는 것도 허용된다. 이 경우, 마)에서 정의된 힘이 적용될 때, 영구 변형 및 틈새
        의 증가/추가가 없어야 한다.

 Ⅰ.5 고정 안내 울타리 및 운행 안내 표시 기둥(traffic columns)
                                      <2019년 3월 28일 이후 건축허가분부터 적용>

   자유공간에서 고정 안내 울타리 및/또는 운행 안내 표시 기둥(예: 제어 장치 및 비상
   정지장치등 포함)이 필요한 경우, 이들의 설계가 다른 위험을 유발해서는 안되며, 다
   음 요구 조건이 충족되어야 한다.
   가) 안내 울타리 또는 운행 안내 표시 기둥은 손잡이의 임의 지점까지 최소 수평거리(반
        경)가 500 ㎜ 이상이 되어야하며, 손잡이의 중심선 바깥쪽에 위치해야한다.(그림
        Ⅰ.4의 배치 A 참조)
   나) 안내 울타리 또는 운행 안내 표시 기둥이 손잡이의 중심선 바깥에 위치하고 추가
        울타리가 안내 울타리 또는 운행 안내 표시 기둥과 난간 뉴얼의 수직 중심선 사이에
        설치되어 있으면 손잡이의 임의 지점까지의 최소 수평거리(반경)를 300 ㎜로 줄일
        수 있다.(그림 Ⅰ.4의 배치 B 참조)
        추가 울타리는 손잡이 바깥 끝단과 80 ㎜에서 120 ㎜ 사이의 측면 거리를 가져야
        하고, 최소한 뉴얼로 들어가는 손잡이의 실제 가장 낮은 지점과 난간 데크 사이의
        구역을 막아야 하며, 추가 울타리의 틈새는 25 ㎜ 미만이 되어야 한다.(그림 Ⅰ.3 참조)
   다) 안내 울타리 또는 운행 안내 표시 기둥이 손잡이 바깥 끝단의 외부에 위치하고                추




                                 [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




    가 울타리가 안내 장벽 또는 운행 안내 표시 기둥과 난간 뉴얼의 수직 중심선 사
    이에 설치되어 있으면 손잡이의 임의 지점까지의 최소 수평거리(반경)는 180 ㎜로
    줄일 수 있다.(그림 Ⅰ.4의 배치C 참조)
    추가 울타리는 손잡이 바깥 끝단과 80 ㎜에서 120 ㎜ 사이의 측면 거리를            가져야
    하고, 최소한 뉴얼로 들어가는 손잡이의 실제 가장 낮은 지점과 난간              데크 사이
    의 구역을 막아야 하며, 추가 울타리의 틈새는 25 ㎜ 미만이 되어야 한다.(그림 Ⅰ.3 참조)
 라) 안내 울타리 또는 운행 안내 표시 기둥이 둥근 형태로 되어 있고 손잡이 바깥 끝
    단의 외부에 위치하고 추가 울타리가 안내 울타리 또는 운행 안내 표시 기둥과 난
    간 뉴얼의 수직 중심선 사이에 설치되어 있으면 손잡이의 임의 지점까지의 최소
    수평거리(반경)는 100 ㎜로 줄일 수 있다. (그림 Ⅰ.4의 배치D 참조)
   추가 울타리는 손잡이 바깥 끝단과 80 ㎜에서 120 ㎜ 사이의 측면 거리를             가져야
   하고, 최소한 뉴얼로 들어가는 손잡이의 실제 가장 낮은 지점과 난간데크 사이의 구역
   을 막아야 하며, 추가 울타리의 틈새는 25 ㎜ 미만이 되어야 한다.(그림 Ⅰ.4 참조)

 추가로, 다음과 같은 특별 요구조건이 적용되어야 한다.
 마) 안내 울타리와 운행 안내 표시 기둥 및 그 고정 장치는 장치의 상단에 가해지는 1
    kN/m의 수평력을 견뎌야한다.
 바) 안내 울타리와 운행 안내 표시 기둥은 가급적이면 건물 구조물에 고정되어야 한다.
    승강장 플레이트에 고정시키는 것도 허용된다. 이 경우, 마)에서 정의된 힘이 적
    용될 때, 영구 변형 및 틈새의 증가/추가가 없어야 한다.
 사) 운행 안내 표시 기둥의 높이는 손잡이의 높이 이상이어야 한다.
 아) 안내 울타리의 높이는 난간데크의 높이 이상이어야 한다.
 자) 안내 울타리와 운행 안내 표시 기둥이 자유공간 안에 배치되면 자유공간의 크기는 동
    일하게 유지되어야 하며, 이 경우 길이가 연장되어야 한다.
 차) 안내 울타리와 운행 안내 표시 기둥은 출구를 막는 구조적 수단으로 간주하지 않
    는다.

 자유공간과 근접한 곳에 있는 안내 울타리와 운행 안내 표시 기둥 또한 상기의 요구조
 건이 적용된다.
 자유공간 밖의 근접한 곳에 있는 기타 장치 및 설비에는 가), 나), 다), 라)의 조건이
 적용된다.

Ⅰ.6 전력 공급
                                  <2019년 3월 28일 이후 건축허가분부터 적용>

 전기 공급 및 전기 보호 기준(예: 감전, 단락, 과부하)에 대해 소유자(또는 구매자)와 제조자
 간에 합의가 이루어져야 한다. 설치는 KS C IEC 60204-1에 따라야 한다.







  기호설명
  1. 장애물(기둥 등)

         주요 치수               항목           주요 치수            항목

        b9 ≥ 400 ㎜          Ⅰ.2.4       h4 ≥ 2,300 ㎜       Ⅰ.2.1

        b10 ≥ 80 ㎜          Ⅰ.2.2       h12 ≥ 2,100 ㎜      Ⅰ.2.2

        b11 ≥ 160 ㎜         Ⅰ.2.3
   비고 이 그림은 일정한 비율로 그려져 있지 않고, 단지 기준만을 설명한다.


                     [그림 Ⅰ.1 ― 건축구조와 에스컬레이터/무빙워크 사이의 간격]




                                    [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','장애물(기둥 등)

   주요 치수            항목      주요 치수             항목
b9 ≥ 400 mm        7.2.4   h4≥ 2.3 m          7.2.1
b10 ≥ 80 mm        7.2.2   h12≥ 2.1 m         7.2.2
b11 ≥ 160 mm       7.2.3


        [ 그림 11 - 건축물과 에스컬레이터ㆍ무빙워크 사이의 치수 ]








                   [그림 Ⅰ.2 - 막는 조치 및 안전 보호판]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','    [ 그림 10 - 막는 조치 및 안전 보호판 ]

                    건축물             25˜35㎝
                    천장부



                                   30㎝초과

                                                    막는
                                                    조치

                                             핸드레일


                            안전보호판




                                    [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




단위 : ㎜
비고 이 그림은 일정한 비율로 그려져 있지 않고, 단지 기준만을 설명한다.




                   [그림 Ⅰ.3 ― 승강장 울타리의 예시]' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','                             [ 그림 12 - 승강장의 보호수단 ]








  단위 : ㎜
  기호설명
  1 각각의 손잡이 바깥 끝단에서 80 ㎜를 더한 지점 사이의 거리
  A 위치: 손잡이 중심선의 외부
    추가 울타리: 불필요
  B 위치: 손잡이 중심선의 외부
    추가 울타리: 운행 안내 표시 기둥/안내 울타리와 난간 뉴얼의 수직 중심선 사이
  C 위치: 손잡이 바깥 끝단의 외부
    추가 울타리: 운행 안내 표시 기둥/안내 울타리와 난간 뉴얼의 수직 중심선 사이
  D 위치(원형 기둥/안내 울타리): 손잡이 바깥 끝단의 외부
    추가 울타리: 운행 안내 표시 기둥/안내 울타리와 난간 뉴얼의 수직 중심선 사이
  R 손잡이의 임의의 지점과 운행 안내 표시 기둥/안내 울타리 사이의 수평 거리(반경)


           [그림 Ⅰ.4 – 자유공간 내에 고정된 안내 울타리 및 운행 안내 표시 기둥의 가능 위치]




                                           [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




                                 부속서 Ⅱ

                           전기 부품 – 고장 배제



Ⅱ.1 범위

 5.12.1은 에스컬레이터와 무빙워크의 여러 가지 전기장치 결함을 예상한다.
 고장분석 중 일부 결함은 특정 조건에서 배제될 수 있다.
 본 부속서는 이러한 조건을 기술하고 그것들을 이행하기 위한 요구조건을 알려준다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','     Ⅰ.1 범위
     5.12.1은 에스컬레이터 또는 무빙워크의 전기장치의 결함을 관찰한다.
     고장분석 중 일부결함이 어떠한 상황에서 배제될 수 있다.
     이 부속서는 이러한 조건을 기술하고 그것들을 이행하기 위한 요건을 알려준다.



Ⅱ.2 고장 배제 : 조건

 상기 표는 다음을 보여준다.:
 가) 현재의 전자기술에 사용되는 주요 부품 및 가장 일반적인 부품 목록; 부품은 ‘집
       단’으로 분류된다.
       1) 수동소자                   1
       2) 반도체                    2
       3) 기타                     3
       4) 조립된 인쇄 회로              4
 나) 고장 분류
       1) 작동중단                   Ⅰ
       2) 단락                     Ⅱ
       3) 더 높은 값으로의 변환          Ⅲ
       4) 더 낮은 값으로의 변환          Ⅳ
       5) 기능 변경                  Ⅴ
 다) 고장 배제의 가능성과 조건들
       고장 배제의 가장 중요한 조건은 부품이 규격에 명시된 온도, 습도, 전압 및 진
       동이 최악의 조건에서도 그 부품들의 최악의 한계내에서 항상 사용되어질 수 있
       어야 한다는 것이다.

 라) 참고
       표에서:
       - 셀 안의 “NO”의 의미 : 고장은 배제되지 않는다. 즉, 고려되어야 한다.






          - 표시가 없는 셀의 의미: 고장 분류 유형과 관계없음.
   안전회로에 대한 설계 지침은 부속서 Ⅳ에 있다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','        Ⅰ.2 고장 배제 : 조건
        상기 표는 다음을 보여준다.:
        가) 현재의 전자기술에 사용되는 중요하고, 가장 통상적인 구성요소의 목록. 그 부품은 ‘집단’으로 분류된다.
         1) 수동부품(소자)         1
         2) 반도체              2
         3) 기타               3
         4) 조립된 인쇄 회로        4


        나) 몇몇의 동일한 고장
         1) 방해               Ⅰ
         2) 단락회로             Ⅱ
         3) 더 높은 값으로의 변환     Ⅲ
         4) 더 낮은 값으로의 변환     Ⅳ
         5) 성능 변경            Ⅴ


        다) 고장 배제의 가능성과 조건들
         고장 배제의 첫 번째 조건은 부품들이 온도, 습도, 전압 및 진동의 분야에 있어서 규격에 의해 열거된 최악의 경우인
         상태일지라도 최악의 경우 범위 내에서 항상 사용되어야 한다는 것이다.


        라) 주의
         표에서:
         - 셀 안의 “NO”의 의미 : 고장은 제외되지 않는다. 즉, 포함되어야 한다.
         - 표시가 되지 않은 셀의 의미: 확인된 고장 유형은 관련이 없다.




                                               [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




                               [ 표 Ⅱ.1 고장 배제 ]
                    가능한 고장 배제                        고장 배제에 대한 조건
      부품
               Ⅰ    Ⅱ     Ⅲ     Ⅳ     Ⅴ                   표시
1 수동 소자
                                           (1) 적용할 수 있는 IEC 표준에 따른 니스를 입히거
                                           나 저항 필름과 축이 연결 봉인된 필름 저항에 대해서
1.1 고정저항       No   (1)   No    (1)
                                           만, 그리고 에나멜 또는 봉인에 의해서 보호되는 단일
                                           층 권선에 의해 제작된 권선 저항에 대해서만

1.2 가변 저항      No   No    No    No

1.3 비선형 저항
1.3.1 NTC      No   No    No    No
1.3.2 PTC      No   No    No    No
1.3.3 VDR      No   No    No    No
1.3.4 IDR      No   No    No    No

1.4 캐패시터       No   No          No

1.5 유도부품       No   No          No
 - 코일
 - 쵸크

2 반도체
2.1 다이오드 LED   No   No                No   성능 변경은 역 전류 값의 변경을 의미

                                           값이 낮게 변하는 것은 제너전압의 변경을 의미
2.2 제너다이오드     No   No         No     No
                                           성능 변경은 역 전류 값의 변경을 의미

2.3 사이리스터,
   트라이악,       No   No                No   성능 변경은 부품의 자체-트리거링 또는 랫칭을 의미
   GTO

                                           ’I’는 2개의 기본부품(LED와 포토 트랜지스터)중 하나
                                           의 개방을 의미하며,’Ⅱ’는 그들 사이의 단락을 의미함.
                                           (2) KS C IEC 60747-5-5에 따른 광커플러의 조건
                                           하에서 배제될 수 있다. 그리고 절연전압은 적어도 아
                                           래의 표를 따른다. (KS C IEC 60664-1:2007, 표 F.1
                                           에서 얻음)
                                           정격시스템 전압으로부터 유       설치를 위한 볼트에서 내
2.4 광커플러       No   (2)               No   도된 대지상전압 Vr.m.s와     충격 전압의 우선 시리즈
                                           D.C 포함               (카테고리 Ⅲ)
                                                    50                800
                                                   100               1,500
                                                   150               2,500
                                                   300               4,000
                                                   600               6,000
                                                  1,000              8,000

2.5   하이브리드회
               No   No    No    No    No
로

                                           진동에 대한 성능 변경 ;
2.6 집적회로       No   No    No    No    No
                                           ’and’게이트가 ‘or’게이트 등






                          배제된 고장
        부 품                                          고장 배제에 대한 조건 언급
                   Ⅰ    Ⅱ     Ⅲ     Ⅳ     Ⅴ

   3 기타
                                              (3) 커넥터의 보호가 IP 4X보다 좋지 않은 경우,
                                              최소값이 적어도 아래와 같다면 커넥터의 단락은
                                              배제될 수 있다.
                                              - 연면거리 4 ㎜ ;
                                              - 공극 3 ㎜
                                              이것은 피치치수 또는 이론적 값이 아니라 연결된
   3.1 커넥터 단자
                   No   (3)                   장치에서 확인 가능한 절대적인 최소값이다.
       플러그
                                              커넥터의 보호가 IP 4X보다 좋다면, 연면거리는
                                              다음조건을 포함하는 KS C IEC 60664-1에 주어
                                              진 간극으로 줄일 수 있다.
                                              - 3의 오염 등급;
                                              - 재료 그룹 Ⅲ과
                                              - 동질이 아닌 장소의 존재

   3.2 내온전구        No   No

                                              (4) 단락은 1차 또는 2차권선, 또는 1차와 2차
                                              코일사이의 단락을 포함한다.
                                              (5) 값의 변화는 권선에 있어서 부분적인 단락의
   3.3 변압기         No   (4)   (5)   (5)       비(ratio) 변화를 의미한다.
                                              (4)와 (5)는 EN 61588-1:2005, 18.2와 18.3를
                                              일맥상통하는 고립 저항과 전압의 조건 하에서
                                              배제될 수 있다.

                                              ’Ⅱ’는 용단퓨즈의 단락을 의미한다.
   3.4 퓨즈               (6)                   (6) 퓨즈가 KS에 따라 용량이 맞고 올바르게 설치
                                              되었다면 배제될 수 있다.

                                              (7) 만약 릴레이가 5.11.2.2.3(5.12.1.2.2.2)의 기
                                              준을 만족한다면 접점사이 및 접점과 코일사이의 단
                                              락은 배제될 수 있다.
                        (7)
   3.5 릴레이         No                         (8) 접점의 용접은 배제될 수 없다. 그러나 릴레이가
                        (8)
                                              기계적인 힘으로 인터록 접점을 갖도록 설치되고, KS
                                              C IEC 60947-5-1에 따라 제작되었다면 5.11.2.1.3
                                              의 가정을 적용한다.

                                              PCB의 일반사양은 KS C IEC 62326-1에 따른
                                              다.
                                              기본재료는 KS C IEC 61249 시리즈 사양에
                                              따라야 된다.
                                              (9) 다음의 조건을 포함하여 KS C IEC
   3.6 인쇄회로기판                                 60664-1에 따른다.
                   No   (9)
       (PCB)                                  - 3의 오염 등급
                                              - 재료 그룹 Ⅲ
                                              - 그리고 동질이 아닌 장소의 존재
                                              PCB의 보호가 IP 4X(KS C IEC 60529)보다
                                              좋다면, 연면거리는 KS C IEC 60664-1에 주어
                                              진 간극으로 줄일 수 있다.




                                                     [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




                               배제된 고장
     부 품                                                 고장 배제에 대한 조건 언급
                 Ⅰ         Ⅱ         Ⅲ   Ⅳ   Ⅴ

                                                 (10) 부품자체가 배제될 수 있고, 연면거리와 간
                                                 극이 설치기술이나 PCB 자신에 의해서가 아니
4 PCB 부품의
                 No        (10)                  고 3.1과 3.6에 있는 목록과 같은 최소 허용 값
  조립품
                                                 아래로 줄일 수 있는 방법으로 설치되었다면 단락
                                                 은 배제될 수 있다.


                                             3.6 인쇄회로기판을 제외한 나머지 안전기준' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','                                         -> 2013년 9월 15일 이후 건축허가분부터 적용

                                             PCB의 일반사양은 EN 62326-1에 따른다.
                                             기본재료는 기준의 KS C IEC 60249-2-3 및 KS C IEC
                                             60249-2-2의 사양에 따라야 된다.
                                             (9) PCB가 상기의 요건에 따라 설치되고 보호가 IP 4X보다
                                               좋지 않고 최소값이 다음 값 이상인 경우 단락은 배제될
                                               수 있다.
                                             - 연면거리 4 mm ;
3.6 인쇄회로기판                                   - 공극 3 mm.
                  No       (9)
  (PCB)                                      이것은 피치치수나 이론적인 값이 아니라 연결된 장치에서
                                             확인 가능한 절대적인 최소값이다.
                                             커넥터의 보호가 IP 4X보다 좋다면, 연면거리는 다음의
                                               조건을 포함하는 KS C IEC 60664-1에 주어진 간극으
                                               로 줄일 수 있다.
                                             - 3의 오염 등급;
                                             - 재료 그룹 Ⅲ;
                                             - 그리고 동질이 아닌 장소의 존재








                            부속서 Ⅲ

                    고장안전회로 초안 작성 및 평가




              [ 그림 Ⅲ.1 – 고장안전회로의 초안 작성과 평가를 위한 흐름도]




                                   [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','    부속서 Ⅱ
    안전회로 초안 작성 및 평가




                 [ 그림 Ⅱ.1 - 안전회로의 초안 작성과 평가를 위한 흐름도 ]








                           부속서 Ⅳ

                        안전회로 설계 지침
                                   <2019년 3월 28일 이후 건축허가분부터 적용>

  이 설계 지침은 제어 목적, 원격 제어, 경보 제어 등에 대한 정보를 안전 회로에서 수
  집하는 경우 위험한 상황을 피하기 위한 권장사항을 제공한다.
  일부 위험 상황은 하나 또는 여러 개의 전기안전장치의 단락 또는 하나 또는 여러 개
  의 고장이 결합된 공통 리드(접지)의 국부적인 차단에 의한 가능성으로 나타날 수 있
  다. 따라서 아래 권장사항을 따르는 것이 좋다.
  가) 표 Ⅱ.1의 3.1 및 3.6에 따른 연면거리로 보드 및 회로를 설계한다.
  나) 에스컬레이터/무빙워크의 제어를 위한 공통 리드가 전자부품 뒤에 있도록 공통 리
        드를 구성한다. 파손으로 인해 제어 장치가 작동하지 않을 수 있다.(에스컬레이터/
        무빙워크의 수명 동안 배선 변경이 발생할 위험이 있다)
  다) 항상 “최악의 상황”에 대비해 계산한다.
  라) 입력 요소의 보호장치로 항상 외부(구성요소 외부) 저항을 사용한다. 장치의 내부저
        항을 안전하다고 생각해서는 안된다.
  마) 구성 목록에 따른 부품만 사용한다.
  바) 전자 장치에서 오는 역방향 전압을 고려한다. 경우에 따라서는 전기적으로 분리된
        회로를 사용하는 것이 문제 해결에 도움이 된다.
  사) KS C IEC 60364-5-54에 따라 전기 설비를 설계한다.
  아) 설계에 관계없이 “최악의 상황” 고려해야 한다. 에스컬레이터/무빙워크 설치 후 수
        정 또는 추가 작업이 이루어지면, 신규 및 기존 설비와 관련된 “최악의 상황”계산
        을 다시 수행해야 한다.
  자) 일부 고장 배제는 표 Ⅱ.1에 따라 수용이 가능하다.
  차) 에스컬레이터/무빙워크 환경 밖에서의 고장은 고려할 필요가 없다.
  카) KS C IEC 60364-5-54에 따라 설치가 이루어진 경우, 건물의 주 전원에서 제어
        반 접지바(레일)까지 접지는 연결되지 않을 수 있다.




                                   [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




                          부속서 Ⅴ

           에스컬레이터 및 무빙워크 이용자를 위한 안전표지
                                   <2019년 3월 28일 이후 건축허가분부터 적용>

안전 표지의 설계는 KS S ISO 3864-1 및 KS S ISO 3864-3에 따라야 한다. 표지의
최소 지름은 80 ㎜이다.




            [그림 Ⅴ.1 – 강제 행동 표지 “애완동물은 안고 이용하세요”]




              [그림 Ⅴ.2 – 금지 표지 “유모차는 이용하지 마세요”]








                                          부속서 Ⅵ

                에스컬레이터 및 무빙워크의 선택 및 계획을 위한 가이드라인



  Ⅵ.1 최대 수송능력

   교통 흐름 계획을 위해, 1 시간에 에스컬레이터 또는 무빙워크로 수송할 수 있는 최
   대 인원은 표 Ⅵ.1에 주어진다.

                              [표 Ⅵ.1 ― 최대 수송능력]

                                              공칭 속도 v(㎧)
         디딤판 폭 z1 (m)
                                 0.5                0.65         0.75

                0.6           3,600 명/h           4,400 명/h    4,900 명/h

                0.8           4,800 명/h           5,900 명/h    6,600 명/h

                 1            6,000 명/h           7,300 명/h    8,200 명/h

    비고 1. 쇼핑 카트와 수하물 카트의 사용은 수용력이 약 80%로 감소될 것이다.
       2. 1 m를 초과하는 팔레트 폭을 가진 무빙워크의 경우 이용자가 손잡이를 잡아야 하기
          때문에 수용능력은 증가하지 않고, 1 m를 초과하는 추가 폭은 주로 쇼핑 카트 및 수
          하물 카트의 사용을 가능하게 하는 것이다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','        Ⅳ.1 최대 수용능력
        교통 흐름 계획을 위해, 1 시간당 에스컬레이터 또는 무빙워크로 수송할 수 있는 최대 인원의 수는 표 Ⅳ.1에 주어진다.


        [ 표 Ⅳ.1 - 최대 수용력 ]

                                                  공칭 속도 v
            스텝/팔레트 폭 z1                              ㎧
                 m
                                 0.5                0.65         0.75


                 0.6          3,600 명/h           4,400 명/h    4,900 명/h


                 0.8          4,800 명/h           5,900 명/h    6,600 명/h


                  1           6,000 명/h           7,300 명/h    8,200 명/h


        비고 1 쇼핑용 손수레와 화물용 카트의 사용은 대략 수용력의 80%가 감소한다.
        비고 2 1 m를 초과하는 팔레트 폭을 가진 무빙워크에서 이용자가 핸드레일을 잡아야 하기 때문에 수용능력은
             증가하지 않는다.




                                                 [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




Ⅵ.2 대중교통시설의 에스컬레이터 또는 무빙워크

 입구 및 출구 지점을 포함하는 대중교통 시스템의 일부인 경우 또는 3시간 간격으로
 합산하여 최소 0.5시간 동안에 제동부하의 100% (5.4.2.1.3.1 및 5.4.2.1.3.3 참조)
 에 달하는 하중을 받는 경우가 평소에 대략 140시간/주를 운행하는 집중적인 사용에
 적합해야 하는 경우 하중 조건 및 추가 안전 기능에 관해서는 설치장소의 교통량을
 반영하여 제조자와 소유자(또는 구매자)간에 합의가 있어야 한다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','                                        부속서 Ⅳ
                             에스컬레이터 및 무빙워크의 선택 및 설계


     Ⅳ.2 대중교통시설의 에스컬레이터 또는 무빙워크


     Ⅳ.2.1 「교통약자의 이동편의증진법」 제2조제3호에 따른 여객시설에 설치되는 경우 또는 3시간 간격으로 최소한 0.5
        시간의 총 지속에 대한 제동부하의 100% (5.4.2.1.3.1 및 5.4.2.1.3.3 참조)에 달하는 하중을 받는 경우에는 이러한
        하중을 포함하여 평소에 대략 140시간/주를 운행하는 집중적인 사용에 적합하여야 한다.


     Ⅳ.2.2 높이(h13)가 6 m 미만인 에스컬레이터에도 보조 브레이크가 설치되어야 한다.


     Ⅳ.2.3 에스컬레이터의 수평주행구간은 L1의 지점에서 측정하여 길이 1.2 m 이상이어야 한다.(그림 2 및 상세도 X 참조)








                                부속서 Ⅶ

                        쇼핑 카트 및 수하물 카트를 운반하기 위한

                         에스컬레이터 및 무빙워크에 대한 기준
                                        <2019년 3월 28일 이후 건축허가분부터 적용>




  Ⅶ.1 에스컬레이터

    에스컬레이터에서 쇼핑 및 수하물 카트를 사용하는 것은 안전하지 않으며 사용되어
    서는 안 된다. 이러한 제품의 사용이 예측 가능한 잘못된 사용, 과적 및 폭 제한으로
    인하여 안전하지 않다고 간주되는 것이 주요 이유다.
    에스컬레이터 설치 주변에서 쇼핑 카트 및/또는 수하물 카트를 사용할 수 있고 카트
    를 에스컬레이터에 가져갈 수 있다고 합리적으로 예측 가능한 경우, 접근을 막기 위
    한 적절한 진입방지대를 설치해야 한다.(Ⅰ.4 참조)

  Ⅶ.2 무빙워크

    무빙워크에서는 적절하게 설계된 쇼핑 카트 및 수하물 카트만 사용이 허용된다.
    무빙워크에서 사용할 쇼핑 카트 또는 수하물 카트는 안전한 사용을 위해 카트 제조
    사와 무빙워크 제조사 간에 지정해야 한다.
    무빙워크 구역에서 지정되지 않은 쇼핑 또는 수하물 카트를 사용하는 경우 심각한
    잘못된 사용의 위험이 있으므로 무빙워크 입구에 접근하지 못하게 해야 한다.(Ⅰ.4
    참조)
    경사가 6 °이상인 무빙워크의 경우, 공칭 속도는 0.5 ㎧로 제한된다.




                                  [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




                          부속서 Ⅷ

  디딤판의 트레드 표면, 콤 플레이트 및 승강장 플레이트의 미끄럼 방지 특성 결정
                                  <2019년 3월 28일 이후 건축허가분부터 적용>


미끄럼 방지 특성 시험에 관한 절차는 DIN 51130을 참조한다.
주의할 점은 DIN 51130 시험 절차에서 오일이라는 중간 매개체가 시험에 불리한 작
동 조건을 부여하는데 사용되지 않는다는 사실이다.
특별히 정의된 오일은 시험결과의 우수한 차별성이 입증된 지속적인 시험 매개변수로
사용되어 진다.
비고 이 절차는 경사면에서 시험할 시험표면의 밟기 테스트를 수행하는 사람들을 기준으로 한다. 각 시
  험표면은 에스컬레이터 및 무빙워크에 사용하기 적합한지 여부를 결정하는 데 도움이 된다.
측정 범위에서 결정된 평균 경사각은 5개 평가그룹중 하나에서 분류된 시험표면을
결정한다.
평가그룹은 R9 평가그룹의 시험표면이 가장 낮은 미끄럼 방지 특성 요구조건을 충족하
고, R13 평가그룹이 가장 높은 미끄럼 방지 특성 기준을 충족시키는 기준으로
사용되어 진다. 각도 범위에 대한 평가그룹의 할당은 표 Ⅷ.1에 나와 있다.

   [표 Ⅷ.1 - 미끄럼 방지 평가 그룹에 대한 경사각의 전체 평균값 할당]

            전체 평균값                      평가 그룹

           6°이상   10°이하                   R9

           10°초과 19°이하                    R10

           19°초과 27°이하                    R11

           27°초과 35°이하                    R12

             35°초과                        R13

표면 첨가물을 갖는 표면의 미끄럼 방지 특성 평가는 모든 방향을 고려해야 한다.
가장 낮은 평가그룹은 안전과 관련된 그룹이다.
최소한 R9 평가그룹을 충족시키는 표면은 일반적으로 설치되는 미끄럼 방지로
간주된다.
물과 눈의 영향을 받는 경우 에스컬레이터 및 무빙워크에 대한 R10 평가그룹과
경사형 무빙워크의 팔레트에 대한 R11 평가그룹이 고려되어야 한다.
에스컬레이터와 무빙워크 및 배정된 층의 승강장이 서로 다른 평가그룹에 있는 경우,
인접된 곳은 평가그룹에서 한 단계만 달라지도록 주의해야 한다.
클리트 영역과 관련된 시험 부분은 에스컬레이터 및 무빙워크에서 미끄럼 방지 특성을
평가하는데 사용되지 않는다.






                                부속서 Ⅸ

                        난간 스커트에서 신발의 미끄럼 특성 결정
                                        <2019년 3월 28일 이후 건축허가분부터 적용>




  Ⅸ.1 개요

   에스컬레이터에는 움직이는 스텝과 스커트 사이에 끼일 위험이 있다.
   위험을 줄이기 위해 몇 가지 기준이 5.5.3.4에 정의되어 있다.
   그 중 하나는 스커트 패널의 미끄럼 마찰을 줄이기 위해 적절한 조치가 취해질 필요
   가 있다는 것이다.
   이 일반 기준은 실제로 안전하게 사용하기 위해 보다 구체적으로 작성되어야 한다.

  Ⅸ.2 미끄럼 특성 시험 및 평가

   미끄럼 특성 시험 절차는 DIN 51131을 참조한다.
   가능한 실제와 같이 에스컬레이터 상태를 재현하기 위해 시험은 고무만 사용하여
   DIN 51131에 따라 수행해야 한다.
   미끄럼 재료 및 스커트 패널에 대한 운동 마찰계수 μ의 평균은 3회 ~ 5회 개별 측
   정으로부터 계산되어야 한다.




                               [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




                       부속서 Ⅹ

                        기술서류

Ⅹ.1 설계심사에 필요한 기술서류에는 별표 22 부속서Ⅱ의 Ⅱ.1에 따른 정보가 포함되
 어야 한다.

Ⅹ.2 승강기 안전기준 적합여부 확인을 위한 안전 요구사항 및 보호조치에 대한 기술서류
 세부 목록은 한국승강기안전공단이 다음의 사항을 고려하여 제시한 기술서류 목록에 따
 라 제출해야 한다.

Ⅹ.2.1 일반사항
 (1) 제조ㆍ수입업자의 성명(업체인 경우에는 업체명과 그 대표자의 성명)과 주소
 (2) 기본모델명 및 파생모델
 (3) 승강기안전인증 분류, 구조별 종류, 용도별 종류
 (4) 구동기 위치, 권상 구조
 (5) 정격하중, 정격속도, 경사도, 및 최대 수용능력
 (6) 구동기 용량, 제어반 방식(용량 포함), 정격전압, 정격전류
 (7) 층고(에스컬레이터), 운행거리(무빙워크)

Ⅹ.2.2 기술적 사항

Ⅹ.2.2.1 기계실･기계류 공간 및 풀리실
 (1) 트러스 내･외부 공간의 위치 및 주요 치수
 (2) 에스컬레이터의 입면과 주요 치수
 (3) 에스컬레이터 및 무빙워크의 단면도 주요 치수
 (4) 오용방지수단 주요 치수
 (5) 디딤판(스텝, 팔레트, 벨트)의 주요 치수
 (6) 팔레트 상하부 승강장 및 천이구간의 주요 치수
 (7) 벨트 단면도, 단독 힘
 (8) 스커트와 스텝사이에 끼일 가능성 최소화 수단
  가) 스커트와 기계적 강도
  나) 스커트와 스텝 사이의 틈새
  다) 스커트 디플렉터 설치
 (9) 핸드레일 시스템의 주요 치수
 (10) 수평주행구간 및 천이구간 곡률반경
 (11) 기타 안전성시험이 불가하거나 곤란한 사항








  Ⅹ.2.2.2 전기설비 및 전기기구의 기술적 사항
   (1) 전기회로 – 도면에 사용되는 약어 또는 기호의 구체적인 설명(한글화 원칙)
        가) 동력회로
        나) 안전회로
        다) 조명회로
   (2) 전기안전장치 및 안전회로
        가) 내･외부의 유도 작용 또는 축전효과로 인한 고장 방지
        나) 전기안전장치의 출력신호의 관계없는 신호에 의해 변경 방지
        다) 2개 이상의 병렬 채널로 구성된 안전회로의 경우 패리티 검사
        라) 전기안전장치의 잘못된 신호의 출력을 막는 내부 전원공급장치의 구조
        마) 안전접점의 분리 후 틈새, 연면거리 및 분리거리
        바) 안전회로의 평가
        사) 고장분석
   (3) 기타 안전성시험이 불가하거나 곤란한 사항

  Ⅹ.2.3 적합성 검증 사항
   (1) 공인 시험성적서 대상 승강기 부품
   (2) 제조사 자체 시험성적서 대상 승강기 부품
   (3) IP 보호등급 대상 승강기 부품
    비고 1. 다른 법령에서 규정한 인증서 또는 시험성적서로 안전기준 적합여부를 확인할 수 없는 경우
           이를 확인할 수 있는 관련서류를 추가로 제출하여야 한다.
         2. (3)에서 규정한 IP 보호등급 대상으로 규정된 승강기 부품 중 “IP4Ⅹ” 또는 “IPⅩ3” 이하인 경
          우에는 제조사 자체 시험성적서로 제출할 수 있다.




                                                [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




<추가 종전 기준>-------------------------------------------' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2013-09-15','2015-05-12','old','                                 부속서 Ⅲ
                    스텝 및 팔레트에 대한 가능한 동적 비틀림 시험


Ⅲ.1 일반사항
다음 예시는 5.3.3.3.1.2와 5.3.2.3.2에서 요구되는 것과 같은 동적 비틀림 시험을 실행하는 실제 방법을 예를 들어
설명한 것이다.


Ⅲ.2 비틀림 시험 1
스텝ㆍ팔레트는 허용되는 최대 경사(경사진 받침)에서 롤러(회전하지 않는), 축 또는 스터브 샤프트(있는 경우)를
포함하는 모두를 시험하게 된다. 그것은 스텝ㆍ팔레트 체인을 통해 지지되고 고정된다. 변형으로 인한 롤러의 영향
을 최소화하기 위해서, 모든 스텝을 지지하는 롤러는 동일한 주요 치수로 된 강철 롤러로 교체된다. 게다가 지지용 트레
일러 롤러는 가로축으로의 이동을 허용하는 지지 평판에서 낮은 마찰력으로 움직일 수 있다. 아래에 기술된 지지가
안 된 자유로운 트레일러 롤러 반대편의 스텝ㆍ팔레트의 상승을 방지하기 위해, 그것은 틈새가 0.2 mm가 안 되는
지지하는 지역에 평행한 고정 클램프를 가진다. (시험 장비에 대해 그림 Ⅲ.1 참조)
스텝/팔레트의 비틀림이 가능하게 하기 위해, 하나의 트레일러 롤러는 지지 되지 않거나 빼버린다. 게다가 이 트레일러
롤러의 중심은 0에서 -4 mm까지 아래쪽으로의 이동이 가능하다. 이 호 안에서의 움직임이다. 이 4 mm의 이동은
트레일러 롤러에서 스텝ㆍ팔레트 체인 롤러 중심거리까지의 거리 400 mm와 연관된다. 이 비율은 400 mm길이가
변화될 때에도 유지된다.
동적 하중은 각각 5.3.3.2.1과 5.3.3.2.3에 기술된 것처럼 지지되지 않거나 빠진 트레일러 롤러로 휨이 나타나는 발판
표면의 중심에서 정렬된 강판의 발판 표면에 수직으로 적용된다.




 Key
 1 강철 롤러 포함
 2 롤러 없이
 3 지지 지역과 평행한 고정 클램프
 F 동적 하중


 비고 시험 장비의 제작은 그림과 일치할 필요가 없다. 오직 요건을 그림으로 설명하는 것을 돕는다.
           [ 그림 Ⅲ.1 - 스텝과 팔레트의 비틀림 시험 (1) - 시험 장비 ]








  Ⅲ.3 비틀림 시험 2
  스텝ㆍ팔레트 조립품은 아래의 그림 Ⅲ.2(이 시험에서 휠은 고정되지 않음)에 보이는 것처럼 그것의 체인 축과 트레일러
  휠 축의 하나의 끝에 의해 설치된다. 체인 축은 스텝ㆍ팔레트 체인에 의해 보통 사용되는 위치에서 지지 된다. 스텝
  ㆍ팔레트는 체인 축 주위 회전에 대해 자유롭다, 그러나 체인 축을 따라 미끄러지는 것은 자유롭지 않다.
  트레일러 휠 축의 ‘자유로운’ 끝은 볼 조인트에 의해 가동장치로 연결된다. 가동장치의 낮은 끝은 고정된 지지물로
  볼 조인트 된다. 그래서 그 트레일러 휠 축의 ''자유로운’끝이 어느 부분으로도 이동할 수 있다. 가동장치의 축은 양
  쪽 트레일러의 축과 체인 휠 축을 둘러싼 평판에 수직이다.
  재-기동과 가동 연동장치는 트레일러 휠에 맞는 베어링에 동일한 디자인의 볼베어링을 사용하여 만든다. 이 시험
  조립을 위해 표준 트레일러 휠 고정이 사용되고, 규정된 토크 값이 적용된다.
  기동 장치는 각 목적지 순환적 선형 이동 을 위해 각 방향으로 적용되고, 나타난다. 최대 이동은 스텝ㆍ팔레트의
  정상 ‘0’ 위치에서 위와 아래로 2mm이다.(같은 평판에서 축 체인과 트레일러 축을 포함한 지점으로 등)
  이 ± 2 mm 이동은 400 mm의 트레일러 롤러에서 스텝ㆍ팔레트 체인 롤러 중심거리와 연관된다. 이 비율은 400 mm
  길이가 변화될 때에도 유지된다.




   Key
   1 피봇
   2 링크(스텝의 한 쪽만)
   F 동적 하중
                 [ 그림 Ⅲ.2 - 스텝ㆍ팔레트의 비틀림 시험 (2) - 시험 장비 ]




                                                            [승강기안전부품 안전기준 및 승강기 안전기준] 별표24' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2013-09-15' AND COALESCE(expiry_date,'')='2015-05-12');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2017-01-28','2022-03-01','old','                                                부속서 Ⅴ
                                    에스컬레이터의 전동기 용량 설계(참조)


Ⅴ.1 일반사항
이 부속서 Ⅴ는 에스컬레이터의 전동기 최소 용량을 산출하기 위해 기술한 참조기준으로, 제조사마다 계산방법을 달
리할 수 있다.
에스컬레이터 전동기 용량 계산은 다음을 고려한다.
- 부속서 Ⅳ.1 최대 수용능력을 참고한다.
- 5.4.2.1.3 주브레이크의 제동부하 및 정지거리를 결정하는 하중을 고려한다.


Ⅴ.1 전동기 용량
에스컬레이터의 전동기 용량 산출은 다음 식으로 정한다.


  (㎾) = 하중에 따른 용량
              ×  ×sin  cos          ×  ×sin   cos
           =  ×
                     
                                           
                                            
                                              
                                                  




     :     전동기 용량 ( ㎾ )

      :     정격하중(510 ㎏/  ) × A(  )

      :     부하운송면적(Z1 × H/tanθ)(  )

      :     층고(  )

     :     공칭폭(  )

      :     속도(m/s)

  μ          스텝롤러 마찰계수
       :     총 효율
  
             (제조사별 차이 있으나 대체적으로 웜은 60∼80 %, 헬리컬 95∼96 %,
             웜-헬리컬 85∼91 %)

       :     에스컬레이터 경사도 ( °)
  

       :     승입율(제조사 설계기준)
  

             핸드레일 중량(Mh× H/sinθ)(㎏)
     :
           핸드레일 단위 중량(㎏/ )

 μh    :     핸드레일 마찰계수(제조사 설계기준)' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='old' AND COALESCE(effective_date,'')='2017-01-28' AND COALESCE(expiry_date,'')='2022-03-01');
INSERT INTO public.inspection_item_revisions (item_id,equipment_type,effective_date,expiry_date,introduction_type,description) SELECT '8.2','에스컬레이터','2022-03-02',NULL,'current',' 8.2 설계확인

   표 11은 안전 요구사항 및 보호조치의 검증 방법을 나타내고 있다. 표에 포함되지 않는
   하위 조항은 표시된 기준항목으로 확인한다.

                         [ 표 11.   안전 요구사항 및 보호조치 검증 방법]
  기준항목                   안전 요구사항                  육안시험    안전성시험      설계심사
       5                                   일반사항
       5.2          지지구조물(트러스) 및 보호벽               ○                   ○
   5.2.1                   일반사항                    ○         ○         ○
   5.2.2                    경사도                    ○         ○         ○
   5.2.3                   내부출입                    ○
   5.2.4                  점검용 덮개                   ○         ○         ○
   5.2.5                   구조 설계                   ○         ○         ○
       5.3                  디딤판                    ○         ○         ○
   5.3.1                   일반사항                    ○         ○         ○
   5.3.2                  디딤판 규격                   ○         ○
   5.3.3                   구조 설계                   ○         ○         ○
   5.3.4                디딤판의 주행안내                  ○         ○         ○
   5.3.5            스텝 또는 팔레트 사이의 틈새               ○         ○         ○
   5.3.6           스텝 또는 팔레트 누락 감지장치               ○
  5.3.7~8            디딤판은 별표 20에 적합                ○         ○         ○
       5.4                 구동 장치                   ○         ○         ○
   5.4.1                    구동기                    ○         ○         ○
   5.4.2                 브레이크 시스템                  ○         ○         ○
   5.4.3              스텝 및 팔레트의 구동                 ○         ○         ○



                                    [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




5.4.4           벨트 구동                ○          ○          ○
 5.5             난간                  ○
5.5.1           일반사항                 ○          ○          ○
5.5.2           난간 규격                ○          ○          ○
5.5.3            스커트                 ○          ○          ○
5.5.4            뉴얼                  ○          ○          ○
5.5.5      디딤판과 스커트 사이의 틈새           ○          ○          ○
 5.6          핸드레일 시스템               ○          ○          ○
5.6.1           일반사항                 ○          ○          ○
5.6.2          외형 및 위치               ○          ○          ○
5.6.3      핸드레일 중심선 사이의 거리           ○          ○          ○
5.6.4          핸드레일 입구               ○          ○          ○
5.6.5          주행안내 장치               ○
 5.7             승강장                 ○          ○          ○
5.7.1           표면 특징                ○          ○          ○
5.7.2          디딤판의 구성               ○          ○          ○
5.7.3             콤                  ○          ○          ○
 5.8      기계류 공간 및 구동･순환 장소          ○          ○          ○
5.8.1           일반사항                 ○          ○          ○
5.8.2          치수 및 설비               ○          ○          ○
5.8.3         조명 및 콘센트               ○                     ○
 5.9            화재 보호                ○
5.10             운송                  ○                     ○
5.11         전기설비 및 전기기구             ○          ○          ○
5.11.1          일반사항                 ○          ○          ○
5.11.2   접촉기, 릴레이, 고장안전회로의 부품        ○                     ○
5.11.3          주 개폐기                ○                     ○
5.11.4          전기 배선                ○          ○          ○
5.12          전기 제어 시스템              ○          ○          ○
5.12.1        보호 장치 및 기능             ○          ○          ○
5.12.2        안전장치 및 기능              ○          ○          ○
5.12.3        제어장치 및 기능              ○          ○          ○
  6                           표시 및 경고장치
 6.1       사용 표지판, 표지 및 안내문          ○
6.1.1           일반사항                 ○







             에스컬레이터 또는 무빙워크의 출입구
   6.1.2                                  ○
                  근처의 안전 표시
   6.1.3           수동핸들에 대한 지침            ○
            트러스 외부의 기계류 공간, 구동 및 순환
   6.1.4                                  ○
                장소 출입문에 대한 안내
            자동 기동 에스컬레이터 또는 무빙워크의
    6.2                                   ○
                     표시장치
       7                     옥외용 에스컬레이터 및 무빙워크 추가요건
    7.1                 일반 요구사항           ○       ○   ○
  7.1.1~2       지지설비 부식으로부터 보호            ○       ○   ○
    7.2,
                   눈비 등에 대한 보호            ○       ○   ○
  7.2.1~4
    7.3                  야간 조명
  비고
  1. 육안시험은 공급되는 부품의 육안시험에 의한 요구사항에 필요한 기능들을 검증한다.
  2. 성능시험은 제공되는 기능들이 요구사항을 만족하는 방식으로 그것들의 기능을 수행한다는 것
    을 검증한다.
  3. 측정은 명시된 한계에 대해 요구사항을 만족하는 도구를 사용하여 검증한다.
  4. 도면계산은 부품의 설계 특징이 요구사항을 만족하는지 검증할 것이다.




                                              [승강기안전부품 안전기준 및 승강기 안전기준] 별표24




                                   부속서 Ⅰ

                               건축물과의 공유영역

Ⅰ.1 일반사항

 본 부속서의 기준은 이용자 및 유지관리인의 안전을 위해 중요하다. 다음의 요구조건은
 소유자 또는 구매자의 준수사항으로 제조자와의 협의가 필요하다.' WHERE NOT EXISTS (SELECT 1 FROM public.inspection_item_revisions WHERE item_id='8.2' AND equipment_type='에스컬레이터' AND introduction_type='current' AND COALESCE(effective_date,'')='2022-03-02' AND COALESCE(expiry_date,'')='');
COMMIT;
