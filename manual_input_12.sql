-- 수동 입력 6.5.2.2.1


-- 6.5.2.2.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.2.2.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.2.1', '2022-03-02', NULL, 'current', '6.5.2.2.1 승강로는 구멍이 없는 벽, 바닥 및 천장으로 완전히 둘러싸인 구조이어야 한다. 다만, 다음과 같은 개구부는 허용된다.
가) 승강장문을 설치하기 위한 개구부
나) 승강로의 비상문 및 점검문을 설치하기 위한 개구부
다) 화재 시 가스 및 연기의 배출을 위한 통풍구
라) 환기구
마) 엘리베이터 운행을 위해 필요한 기계실 또는 풀리실과 승강로 사이의 개구부
바) 5.6에 따른 엘리베이터와 다른 엘리베이터 사이에 설치된 칸막이의 개구부<2019. 3. 28. 삭제>
<2013년 9월 15일 이후 건축허가분부터 적용>');
