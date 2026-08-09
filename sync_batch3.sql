-- 별표22 배치검토(3차) 반영: 오탈자/개정조문 수정
-- 종전기준(2022.3.2 이외 날짜) 항목은 DB에서 삭제하지 않음 (검사가이드/판정 페이지가 같은 테이블의
-- permitEffectiveDate·standardDates를 이력 조회용으로 사용 중 - client/src/pages/judgment.tsx baseItemMap 참조).
-- 별표22(2022) 페이지에서만 안 보이게 하는 건 client/src/data/별표22_유효항목.json 화이트리스트로 처리함.

-- 1) 텍스트 수정
UPDATE inspection_base_items SET text = '1 적용 범위
수직에 대해 15°이하의 경사진 주행안내 레일을 따라 사람이나 화물을 운송하기 위한 카를 미리 정해진 승강장으로 운행시키는 엘리베이터에 적용한다. 다만, 다음 중 어느 하나에 해당하는 엘리베이터는 제외한다.
가) 정격속도가 0.15 ㎧ 이하의 엘리베이터
나) 정격속도가 1 ㎧를 초과하는 유압식 엘리베이터
다) 릴리프 밸브 설정압력(13.3.5.3)이 50 ㎫을 초과하는 유압식 엘리베이터', section_title = '1 적용 범위', updated_at = now() WHERE item_id = '1';
UPDATE inspection_base_items SET text = '2 인용 표준
이 기준에서 인용하는 표준은 그 최신판을 적용한다.', section_title = '2 인용 표준', updated_at = now() WHERE item_id = '2';
UPDATE inspection_base_items SET text = '3.9 기계류 공간(machinery space)
기계류와 관련된 작업구역을 포함하고, 기계류의 일부 또는 전부가 설치되는 승강로 내·외부 공간', section_title = '3.9 기계류 공간(machinery space)', updated_at = now() WHERE item_id = '3.9';
UPDATE inspection_base_items SET text = '3.21 안전 로프(safety rope)
로프 또는 체인이 파단 등 정상적인 현수(懸垂)가 안 될 경우, 추락방지안전장치를 작동시키기 위해 카, 균형추 또는 평형추에 부착된 보조 로프', section_title = '3.21 안전 로프(safety rope)', updated_at = now() WHERE item_id = '3.21';
UPDATE inspection_base_items SET text = '3.35 잠금해제구간(unlocking zone)
카가 해당 정지층의 승강장문이 잠기지 않게 할 수 있는 상·하 한계 구간', section_title = '3.35 잠금해제구간(unlocking zone)', updated_at = now() WHERE item_id = '3.35';
UPDATE inspection_base_items SET text = '6.1 일반사항', section_title = '6.1 일반사항', updated_at = now() WHERE item_id = '6.1';
UPDATE inspection_base_items SET text = '6.1.5.1 피트에는 다음과 같은 장치가 있어야 한다.
가) 16.1.11에 적합하고, 피트 출입문 및 피트 바닥에서 잘 보이고 접근 가능한 정지장치. 이 정지장치는 다음 사항을 만족해야 한다.
1) 피트 깊이가 1.6 m 이하인 경우, 정지스위치는 다음 위치에 있어야 한다.
- 최하층 승강장 바닥에서 수직 위로 최소 0.4 m 이내 및 피트 바닥에서 수직 위로 최대 2 m 이내
- 승강장문 안쪽 문틀에서 수평으로 최대 0.75 m 이내
2) 피트 깊이가 1.6 m 초과인 경우, 2개의 정지스위치는 다음 구분에 따른 위치에 각각 있어야 한다.
- 상부 정지스위치: 최하층 승강장 바닥에서 수직 위로 최소 1 m 이내 및 승강장문 안쪽 문틀에서 수평으로 최대 0.75 m 이내
- 하부 정지스위치: 피트 바닥에서 수직 위로 최대 1.2 m 이내 및 피난 공간에서 조작이 가능한 위치
3) 승강장문을 제외한 피트 출입문이 있는 경우에는 정지스위치가 그 출입문 안쪽 문틀에서 수평으로 최대 0.75 m 이내 및 피트 바닥에서 수직 위로 1.2 m 위치에 있어야 한다.
피트에 출입할 수 있는 승강장문이 같은 층에 2개가 있는 경우, 하나의 승강장문이 피트 출입문으로 지정되어야 하고, 출입을 위한 설비가 설치되어야 한다.
비고 정지스위치는 나)에 따른 점검운전 조작반에 설치될 수 있다.
나) 16.1.5에 적합하고 피난 공간에서 0.3 m 떨어진 범위 이내에서 조작할 수 있는 영구적으로 설치된 점검운전 조작반
다) 콘센트(14.7.2)
라) 피트 출입문 안쪽 문틀에서 수평으로 최대 0.75 m 이내 및 피트 출입층 바닥 위로 최소 1 m 위치에 설치된 승강로 조명(6.1.4.1)의 점멸수단', section_title = '6.1.5.1 피트에는 다음과 같은 장치가 있어야 한다.', updated_at = now() WHERE item_id = '6.1.5.1';
UPDATE inspection_base_items SET text = '6.2.1 승강로, 기계실·기계류 공간, 풀리실 및 관련 작업구역은 접근이 가능해야 한다. 카 내부를 제외하고 관계자만이 접근할 수 있게 해야 한다.(부속서 Ⅴ 참조)', section_title = '6.2.1 승강로, 기계실·기계류 공간, 풀리실 및 관련 작업구역은 접근이 가능해야 한다. 카 내부를 제외하고 관계자만이 접근할 수 있게 해야 한다.(부속서 Ⅴ 참조)', updated_at = now() WHERE item_id = '6.2.1';
UPDATE inspection_base_items SET text = '6.4 표시', section_title = '6.4 표시', updated_at = now() WHERE item_id = '6.4';
UPDATE inspection_base_items SET text = '15.2.6 안전 관련 프로그램 적용 가능한 전자시스템(PESSRAL)
부속서 Ⅰ의 표Ⅰ.1 은 각 전기안전장치의 최소 안전 무결성 기준을 제시한다.15.2.6에 따라 설계된 프로그램 적용 가능한 전자시스템을 포함하는 안전 회로는 15.2.3.3의 요구사항을 포함한다. PESSRAL은 별표 2의 4.8에 기술된 것과 같이 관련 안전 무결성 등급(SIL)에 대한 설계 기준을 준수해야 한다. 안전하지 않은 프로그램 수정 방지를 위해 EPROM사용, 접근 코드 등을 사용하여 안전관련 데이터 및 PESSRAL에 대한 권한이 없는 접근을 방지하는 조치가 제공되어야 한다. PESSRAL과 안전과 관련 없는 시스템이 동일한 인쇄회로기판(PCB)를 공유하는 경우, 14.3.2의 요구사항이 두 시스템의 분리에 적용된다. PESSRAL과 안전과 관련 없는 시스템이 동일한 하드웨어를 공유하는 경우, PESSRAL의 규정을 만족해야 한다. 내장 시스템 또는 외부 도구에 의해 PESSRAL의 고장 상태를 식별할 수 있어야 한다. 외부 도구가 특별한 도구인 경우, 설치 현장에서 이용 가능해야 한다.PESSRAL은 별표 2에 따라 안전성이 입증되어야 한다.', section_title = '15.2.6 안전 관련 프로그램 적용 가능한 전자시스템(PESSRAL)', updated_at = now() WHERE item_id = '15.2.6';

-- 2) 18.2 삭제 (연혁집 서문/표16이 뒤섞인 손상 항목. 검사가이드(INSPECTION_DATA_MR)는 섹션 1~2만 사용하고
-- "18.2"를 참조하는 곳이 코드 전체에 없음을 확인 - 삭제해도 다른 화면에 영향 없음)
DELETE FROM inspection_base_items WHERE item_id = '18.2';
