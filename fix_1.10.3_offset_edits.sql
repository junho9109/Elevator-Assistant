-- inspection_base_items는 이미 고쳤는데 화면에 여전히 옛 번호가 보이는 이유:
-- judgment.tsx는 inspection_base_items 위에 inspection_item_edits(관리자 수동 편집)를
-- "덮어쓰기"로 얹습니다. 이 4개 항목에 예전에 잘못된 문구로 편집 저장된 행이 있으면
-- inspection_base_items를 아무리 고쳐도 화면엔 edits 쪽 값이 표시됩니다.

-- 1) 먼저 편집 행이 실제로 존재하는지 확인
SELECT item_id, text, standard_note
FROM inspection_item_edits
WHERE item_id IN ('1.10.3-라', '1.10.3-마', '1.10.3-바', '1.10.3-사');

-- 2) 편집 행이 있고 text가 옛 번호를 담고 있다면 아래 UPDATE로 맞춰줍니다.
--    (행이 없으면 0 rows affected로 아무 영향 없음 — 안전하게 실행 가능)
UPDATE inspection_item_edits
SET text = '라) 호출버튼 또는 등록버튼에 의하여 카가 승강장문에 도착하면「엘리베이터 안전기준」17.1.5.4에 따라 10초 이상 열린 상태로 대기하는지 확인한다.'
WHERE item_id = '1.10.3-라';

UPDATE inspection_item_edits
SET text = '마) 승강장의 점형블럭이「엘리베이터 안전기준」17.1.5.5에 따라 부착되어 있는지 확인한다.'
WHERE item_id = '1.10.3-마';

UPDATE inspection_item_edits
SET text = '바) 카 내부의 층수 버튼을 누르면 점멸등 표시 및 음성안내가「엘리베이터 안전기준」17.1.5.6에 따라 동작되는지 확인한다.'
WHERE item_id = '1.10.3-바';

UPDATE inspection_item_edits
SET text = '사) 카 내 조명이「엘리베이터 안전기준」17.1.5.7에 따라 적합한지 확인한다.'
WHERE item_id = '1.10.3-사';

-- 3) standard_note 컬럼도 edits에 옛 값이 저장돼 있다면 같이 맞춰줍니다.
UPDATE inspection_item_edits
SET standard_note = '[17.1.5.4] 17.1.5.4 호출버튼 또는 등록버튼에 의하여 카가 정지하면 10초 이상 문이 열린 채로
대기해야 한다.'
WHERE item_id = '1.10.3-라' AND standard_note IS NOT NULL;

UPDATE inspection_item_edits
SET standard_note = '[17.1.5.5] 17.1.5.5 각 층의 호출버튼 0.3 m 전면에는 점형블록이 설치되거나 시각장애인이 감지할
수 있도록 바닥재의 질감 등을 달리해야 한다.'
WHERE item_id = '1.10.3-마' AND standard_note IS NOT NULL;

UPDATE inspection_item_edits
SET standard_note = '[17.1.5.6] 17.1.5.6 카 내부의 층 선택버튼을 누르면 점멸등 표시와 동시에 음성으로 층이 안내되어야
한다. 또한 층 등록과 취소 시에도 음성으로 안내되어야 한다.'
WHERE item_id = '1.10.3-바' AND standard_note IS NOT NULL;

UPDATE inspection_item_edits
SET standard_note = '[17.1.5.7] 17.1.5.7 카 내부 바닥의 어느 부분에서든 150 ㏓ 이상의 조도가 확보되어야 한다.'
WHERE item_id = '1.10.3-사' AND standard_note IS NOT NULL;
