-- 수동 입력 6.5.1.6, 6.5.2.1


-- 6.5.1.6
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.1.6' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.6', '2022-03-02', NULL, 'current', '6.5.1.6 유압식 엘리베이터의 잭은 카와 동일한 승강로 내에 있어야 하며, 지면 또는 다른 장소로 연장될 수 있다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.1.6', '2013-09-15', '2022-03-01', 'old', '[유압식] 5.1.3 엘리베이터의 잭은 카와 동일한 승강로 내에 있어야 한다. 땅속 또는 다른 장소로 연장될 수도 있다.');


-- 6.5.2.1
DELETE FROM inspection_item_revisions WHERE item_id = '6.5.2.1' AND introduction_type != 'revision';
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.1', '2022-03-02', NULL, 'current', '6.5.2.1 일반사항
엘리베이터는 다음 구분 중 어느 하나에 의해 주위와 구분되어야 한다.
가) 불연재료 또는 내화구조의 벽, 바닥 및 천장
나) 충분한 공간');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.1', '2009-11-24', '2022-03-01', 'old', '3.1.3(2) 승강로의 벽 또는 울 및 출입문은 불연재료 또는 내화구조로 만들거나 씌워야 한다. 다만, 승강로의 벽(건축법 시행령 제46조의 규정에 의하여 당해 건축물의 다른 부분과 방화구획한 부분이외의 부분에 한정) 일부에 유리를 사용할 경우에는(삭제) 한국산업규격의 망유리·강화유리·접합유리 및 복층유리(16mm 이상)와 동등 이상의 것을 사용하여야 한다.
비고 "내화구조"라 함은 화재에 견딜 수 있는 성능을 가진 구조로서 국토해양부령이 정하는 기준에 적합한 구조를 말한다.(건축법 시행령 제2조제1항제7의2호)');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.1', '2008-11-07', '2009-11-23', 'old', '3.1.3(2) 승강로의 벽 또는 울 및 출입문은 불연재료로 만들거나 씌워야 한다. 다만, 승강로의 벽(건축법 시행령 제46조의 규정에 의하여 당해 건축물의 다른 부분과 방화구획한 부분이외의 부분에 한정) 일부에 유리를 사용할 경우에는(삭제) 한국산업규격의 망유리·강화유리·접합유리 및 복층유리(16mm 이상)와 동등 이상의 것을 사용하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.1', '2004-12-01', '2008-11-06', 'old', '3.1.3(2) 승강로의 벽 또는 울 및 출입문은 불연재료로 만들거나 씌워야 한다. 다만 승강로의 벽(건축법 시행령 제46조의 규정에 의하여 당해 건축물의 다른 부분과 방화구획한 부분이외의 부분에 한정) 일부에 유리를 사용할 경우에는(비상용 제외) 한국산업규격의 망유리·강화유리·접합유리 및 복층유리(16mm이상)와 동등 이상의 것을 사용하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.1', '1999-09-03', '2004-11-30', 'old', '3.1.3(2) 승강로의 벽 또는 울 및 출입문은 불연재료로 만들거나 씌워야 한다. 다만, 승강로의 벽 또는 출입문(건축법시행령 제46조의 규정에 의하여 당해 건축물의 다른 부분과 방화구획한 부분 이외의 부분에 한정) 일부에 유리를 사용할 경우에는(비상용 엘리베이터는 제외) 한국산업규격의 망유리·강화유리·접합유리 및 복층유리(16㎜ 이상)와 동등 이상의 것을 사용하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.1', NULL, '1999-09-02', 'old', '3.1.3(2) 승강로의 벽 또는 울 및 출입문은 불연재료로 만들거나 씌워야 한다. 다만, 승강로의 벽(건축법시행령 제46조의 규정에 의하여 당해 건축물의 다른 부분과 방화구획한 부분 이외의 부분에 한정) 일부에 유리를 사용할 경우에는(비상용 엘리베이터는 제외) 한국산업규격의 망유리·강화유리·접합유리 및 복층유리(16㎜ 이상)와 동등 이상의 것을 사용하여야 한다.');
INSERT INTO inspection_item_revisions (item_id, effective_date, expiry_date, introduction_type, description) VALUES ('6.5.2.1', '1997-08-18', NULL, 'additional', '3.1.3(3) 승강로의 출입구에 접한 승강로비 또는 이와 유사한 부분은 엘리베이터 전용으로 하고, 당해부분의 벽 또는 천장이 실내에 접하는 부분의 마감은 준불연재료로 하며, 그 하부를 불연재료로 만든 것으로 하여야 한다.');
