-- 5, 5.1 조문 정정 (DB에 잘못 인덱싱된 다른 항목 내용이 들어가 있었음)
UPDATE inspection_base_items SET text = '5 일반사항', section_title = '5 일반사항', updated_at = now() WHERE item_id = '5';
UPDATE inspection_base_items SET text = '5.1 엘리베이터는 5부터 16까지의 기준에 적합해야 한다.
비고 이 기준에서 다루지 아니하는 경미한 위험(뾰족한 모서리 등)에 대해서는 KS B ISO 12100에 따라 설계 및 제조·설치해야 한다.', section_title = '5.1 엘리베이터는 5부터 16까지의 기준에 적합해야 한다.', updated_at = now() WHERE item_id = '5.1';
UPDATE inspection_base_items SET text = '5.2 모든 라벨, 주의사항, 표시 및 작동 지침은 영구적으로 부착하고, 지울 수 없고, 읽기 쉬우며 쉽게 이해할 수 있어야 한다.(필요한 경우 기호 및 심볼 추가) 이러한 것들은 견고한 재질로 눈에 띄는 위치에 한글(필요한 경우 영어 등 다른 문자를 같이 기재)로 작성되어야 한다.', section_title = '5.2 모든 라벨, 주의사항, 표시 및 작동 지침은 영구적으로 부착하고, 지울 수 없고, 읽기 쉬우며 쉽게 이해할 수 있어야 한다.(필요한 경우 기호 및 심볼 추가) 이러한 것들은 견고한 재질로 눈에 띄는 위치에 한글(필요한 경우 영어 등 다른 문자를 같이 기재)로 작성되어야 한다.', updated_at = now() WHERE item_id = '5.2';
