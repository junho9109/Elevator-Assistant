-- PDF 표준화 모음 신규 92개 추가 (ON CONFLICT DO NOTHING)

INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('LCD 모니터', '6.1.2', '', '있음을 기술서류를 통해 증명하는 경우 허용
[카 내 LCD 모니터 설치 및 적용]
① 신규 승강기에 설치 시
a. 제조사: 해당 기기 및 설비가 새로운 승강기
안전기준에 적합한지 증명
b. 유지관리: 승강기 제조사는 승강로 내 유선 또는
무선전송기기에 대한 사용설명서(적용범위 등)
및 품질보증서를 관리주체에 제공하고, 관리
주체는 승강기 제조사 또는 유지관리업체를', '', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('출입수단', '6.2.4', '', '구조의 변경 없이는 개정된 승강기 안전기준에
적합하지 않은 경우 종전 승강기 검사기준을
적용할 수 있음
② 종전 검사기준에 따라 피트사다리 미설치 또는
승강장문 직 하부에 설치된 경우
→시정권고안내
[최하층 승강장문 2개인 경우]
① 2개의 승강장문 중 한쪽의 피트에 설치 가능
② 작업자의 원활한 출입을 위하여 출입수단 위치를
확인할 수 있는 심볼 표시 필요
① 신규 건축물의 기계실·기계류 공간으로 가는
통로의 경우 계단을 설치하는 것이 바람직함.
다만, 계단 설치가 불가능한 경우 원형사다리
가능
② 트랩도어 적용 방안
a. 하부 개방 불가능한 구조
b. 트랩도어 개문 시 개문상태 유지', '(17년 제9차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('승강장 제어반 조명장치 및 작업구역 조도', '6.6.6.3', '', '패널은 50lx 이상 확보
④ 조명장치는 패널 근처에서 조작할 수 있어야
하며, 센서등 설치 불가
① 제어패널 부분: 200lx', '(16년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('승강장문 및 카문 틈새 측정', '7.1.4', '', '테이퍼 게이지를 사용하는 경우 별도의 압력을', '', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('카문의 높이', '7.2.1', '', '[사유서, 검토서, 도면 등]를 제출 시 종전
검사기준을 적용할 수 있음
① 카 크기 변경에 따른 자동차용 엘리베이터의
종전 검사기준의 적용
a. 카 폭만 증가
- 종전 검사기준 적용에 따른 카 문 제외 가능
b. 카 깊이만 증가
- 종전 검사기준 적용에 따른 카 문 제외
불가 (카 문 설치하여야 함)
c. 카 높이만 증가
- 현행 검사기준에 따른 상부 틈새, 피난공간
확보하여야함
- 종전 검사기준 적용에 따른 카 문 제외 가능
② 정격속도 변경에 따른 자동차용 엘리베이터의
종전 검사기준의 적용
a. 정격속도만 증가
- 종전 검사기준 적용에 따른 카 문 제외 가능
- 현행 검사기준에 따른 상부 틈새, 피난
공간 확보되어야 함
③ 구동방식 변경에 따른 종전 검사기준의 적용
a. 유압식을 전기식으로 구동방식만 변경
- 종전 검사기준에 따른 상·하부 틈새, 피난
공간 확보하여야함
b. MR에서 MRL로 변경
- 종전 검사기준에 따른 상부 틈새, 피난
공간 확보되어야 함
④ 정격하중 변경에 따른 자동차용 엘리베이
터의 종전 검사기준의 적용
a. 카 크기 변경 없이 정격하중만 증가
- 종전 검사기준 적용에 따른 카 문 제외 가능
- 종전 검사기준에 따른 상부틈새 적용 가능
⑤ 복합적 변경에 따른 자동차용 엘리베이터의
종전 검사기준의 적용
a. 유압식을 전기식으로 변경, 카 폭 증가,
카 깊이 변경 없음, 카 높이 증가
- 구동방식 및 카 높이 변경에 따라 현행
검사기준에 따른 상부 틈새, 피난공간
확보되어야 함
- 카 깊이 변경이 없으므로 종전 검사기준
적용에 따른 카 문 제외 가능
(다만 카 높이를 증가시키지 않아 카문의
설치가 가능한 경우, 카 문 제외 불가)
b. 카 크기 및 정격하중 동시 증가
- 카 폭 증가, 정격하중 증가
: 카 깊이가 변경되지 않았으므로 종전
검사기준 적용에 따른 카 문 제외 가능
- 카 깊이 증가, 정격하중 증가
: 종전 검사기준 적용에 따른 카 문 제외
불가 (카 문 설치하여야 함)
: 종전 검사기준에 따른 상부틈새 적용 가능
- 카 높이 증가, 정격하중 증가
: 종전 검사기준 적용에 따른 카 문 제외 가능
: 현행 검사기준에 따른 상부 틈새, 피난
공간 확보되어야 함', '(20년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('승강장문 유효 폭 제한', '7.2.2', '', '보다 50 mm 초과하지 않아야 함
[경사로 설치]
① 승강장문 문턱과 승강장은 높이 차가 없도록
하여 이용자가 걸려 넘어지는 등의 위험을
예방하여야 함
② 승강장(카)문 문턱과의 단차가 없도록 시공
하여야 함(경사도와 재질 규정하지 않음)
[교체설치 시 수직개폐식 문턱의 재사', '(16년 제1차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('승강장문 문턱', '7.3.1', '', '용]
① 검사방법: 교체설치 시 건축 구조물의 교체를
강제하지 않음
② 검사판정
a. 수직개폐식 문의 문턱 플레이트 등이 파손되
거나 변형되는 경우: 보완
b. 승강로 내 돌출물이 카의 안전운행에 지장을
주는 경우: 불합격
c. 승강로 마감 불량으로 낙하물의 위험이 있는
경우: 불합격
① 가이드롤러 스틸프레임+ 리벳 구조 설치 불가
② 승강장문과 문틀부분이 겹쳐 그 자체로 문', '(23년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('승강장문 비상가이드', '7.5.3.2', '', '방지장치(비상가이드)로 인정하여 추가 설치
불필요
③ 상부 비상가이드의 구조 확인 시 행거를 제
외한 별도의 이탈보호장치가 설치되어 마모,
화재, 부식에 의한 보호 가능 여부 확인
[문닫힘 안전장치 적용]
① 접촉식 및 비접촉식 문닫힘 안전장치 모두
미작동 시 불합격 판정
② 비접촉식 문닫힘 안전장치 설치 높이 및 감지:', '(20년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('수평 개폐식 문', '7.6.2.2', '', '최소 25 mm, 최대 1800 mm 이상
[장애인용 문닫힘 안전장치 적용]
① 기계식과 광감지식이 동시에 설치된 경우 검사
판정 방법
a. 기계식이 불량인 경우: 조건부합격
b. 광감지식 불량인 경우: 시정권고
[전자인터록 사용]
① 수직 개폐식의 카문 잠금장치 설치는 부적
합하며, 카와 승강로 벽간 거리 기준에 적합
하여야 함
② 인증 유효기간이 남은 전자인터록을 사용하는
경우: 적합
③ 추후 안전인증 시 인정하지 않을 계획
(적용시점 추후 안내)
[문닫힘 안전장치 적용]', '(16년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('수직 개폐식 문', '7.6.2.3', '', '① ''15. 5. 13. 전 건축허가(공사계약)일 현장:
카 또는 승강장 중 한 곳 설치
② ''15. 5. 13. 이후 건축허가(공사계약)일 현장:
카 및 승강장 모두 설치
③ 문닫힘 안전장치 설치하여야 함
④ 반자동 동력 작동식 문(버튼을 지속적으로
누르고 있거나 이와 유사한 방법으로 사용자의
지속적인 관리하에 닫히는 문)의 경우 제외 가능', '(18년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('승강장 조명', '7.7.1', '', '설치검사 시 임시조명 설치 허용하지 않음
① 승강장문 잠금장치의 덮개는 투명한 덮개', '(23년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('승강장문 잠금장치 보호수단', '7.9.1', '', '② 방폭형 및 수직개폐식 잠금장치는 7.9.1.11', '''23.4.17. 검사 이후', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('승강장문 잠금', '7.9.3.5', '', '바닥 위치의 윗 발판)에서 수직 1.8 m, 수', '(16년 제1차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('승강장문 닫힘 상태 및 잠금 상태 입증 장치', '7.10', '', '① 카 문 잠금장치가 잠금해제구간 내에서 수동
개방안됨
a. ''18. 8. 전 설치 현장: 관리실 등 매뉴얼 비치
b. ''18. 8. 이후 설치 현장: 부적합 판정', '(23년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('카문의 개방', '7.15.3', '', '[수직개폐식 카문의 개방]
· 카문 잠금장치가 설치된 경우 비상잠금해제
삼각열쇠 이외의 도구가 없어도 승강장문을
열면 카문을 열 수 있어야 함', '(23년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('카의 유효면적, 정격하중 및 정원', '8.2', '', '종전 기준에 따른 권상능력 및 정격하중 유지 가능', '', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('카 면적', '8.2.1.2', '', '① 카 내 구조물 신규 설치 불가
카 내 구조물 기 설치분 철거
② 철거되지 않은 경우: 조건부합격 판정
① 카 벽의 움푹 들어간 공간 또는 확장된 공간의', '''23. 4. 17. 검사이후', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('카 벽의 확장된 공간의 정원 및 하중', '8.2.1.3', '', '② 해당 공간은 최대 카 유효면적 계산에 고려', '(20년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('카 내부 표기', '8.2.3.2', '', '② 교체 설치하는 승강기의 정원 산정
정원은 건축법령 등 타 법령과 연관된 사항으로
교체하는 승강기의 최초 건축허가일이 ''19. 3. 23.
전의 경우 정격하중 및 권상능력은 현행 안전기
준에 모두 적합하여야 하나, 정원은 종전 검사기
준에 따라 인당 65 kg로 계산하여 카 내 표시 가능
① 카 벽에 유리가 설치된 경우 유리의 유형
및 두께 확인
★ 개별안전인증 시 추락방지안전장치 작동 후
유리가 미끄러지지 않음을 추가 확인', '(20년 제5차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('카 벽 유리 사용', '8.3.2.3', '', '② 유리의 모든 면이 틀에 끼어져 있지 않은 경우
충격시험 공인기관 시험성적서 제출
★ 안전인증을 받은 승강기의 경우 인증 시
충격시험이 수행되었는지 확인
[에이프런과 토가드 폭]
① 각 승강장문의 문턱 아랫부분 수직면의 폭은', '(19년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('에이프런', '8.5.1', '', '카 출입구 폭에다 양쪽 모두 25mm를 더한
값 이상
② 에이프런의 폭은 마주하는 승강장 유효 출
입구의 전체 폭 이상
[소방구조용 엘리베이터 적용]
카 내부에서 비상구출문을 완전히 열어 출입이
가능하여야 함
[천장 교체 시 적용]
① 수단을 마련하는 경우 기존 비상구출문 폐쇄 가능
a. (MR) 카 상부 비상통화장치 설치', '(20년 제1차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('비상구출문', '8.6', '', 'b. (MRL)
- 비상통화장치+ 기계적 고정장치 해제 수단
및 매뉴얼 영구 비치
- 비상통화장치+ 비상문(1.8m × 0.5m) /
승강장문*(0.5m × 0.7m)
* 승강로밖으로나올수있도록승강장문
틈새를확보하는경우해당위치에서
구동기등승강기부품점검이가능하
여야함
① 카 지붕의 표면에서 미끄러지지 않게 하여야 함
a. 카 지붕(부분 단면적) 끝단의 내측 모서리의
50mm 이내 제외 가능
b. 미끄럼방지 테이프를 이용하는 경우, 간격
없이 부착하여야 함', '(23년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('카 지붕 미끄러짐 방지 수단', '8.7.1', '', '않도록 테두리에 둘러 구정 마감
★ 전선이 가로질러 설치되는 경우 덕트를
포함하여 고정 마감
② 카 지붕 위 체대에 서 있을 수 있는 경우
미끄럼방지수단 적용
① 카 지붕의 바깥쪽 가장자리에서 승강로 벽
까지의 수평거리와 관계없이 카 지붕의 모', '(20년 제1차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('카 지붕 전면부 발보호판', '8.7.2', '', '어야 함', '(19년 제4차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('보호난간', '8.7.4', '', '① 보호난간의 1/2 높이 지점에 중간봉 설치
② 중간봉 사이 간격은 난간의 1/2 지점(550mm 이내)
이어야 하며, 여러개 중간봉 설치 가능
[카 지붕 위 접이식 보호난간]
① 공구를 사용한 접이식 난간: 부적합 판정
② 카 지붕 위 접이식 보호난간 적용 불가
[리모델링 범위에 따른 적용]
① 카 전면(체대+판넬)교체: 개정 적용
② 카 부분교체: 종전 적용
[카의 출입구가 2개인 경우]
· 2개의 카 출입구에서 벽까지의 거리가 0.3m를
초과하는 경우: “ㅁ” 형태로 설치
[카 지붕 위 보호난간 외부 공간]
보호난간 바깥의 사다리 고정 브라켓 등을 포함
하여 사람이 서 있을 수 있는 구조 및 면적에
해당하는 경우 경고 문구 부착
[보호난간과 로프 보호수단 겸용]
로프의 간섭이 없는 조건에서 보호조치 되어야 함
[카문 방향으로 설치된 카 지붕 위 보호난간]
카문 방향으로 설치된 보호난간은 작업자의 안전한
진출입을 위해 안전스위치가 설치되고 공구 없이
간단하게 탈착(회전 포함)이 될 수 있는 보호난간
으로 설치하여야 하며, 강도는 엘리베이터 안전기
준에 적합하여야 함
① 보호난간이 두 곳 이상 탈착(회전 포함)
가능하도록 설치된 부분은 각각의 안전스위치
가 설치되어야 함
② 카문 방향으로 설치된 중간봉은 탈착 불필요
③ 보호난간의 강도계산서는 안전인증 시 제출
① 카 지붕 위 점검운전 조작반 고정식으로 설치
(고정식 조작반+이동식 점검운전 리모컨 부적합)', '(18년 제1차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('카 지붕의 설비', '8.8', '', '② 점검운전 조작반 내 비상통화장치 버튼 별도
설치 가능
[정상 조명에 대한 해석]', '이후', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('비상등', '8.10.4', '', '· 정상 조명전원이 차단되는 경우란,
건물 정전으로 조명이 차단되는 경우로 적용하
며 즉시 자동으로 점등되어야 함
관련 보호수단', '(20년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('매다는 장치 (벨트 스트렌드/소선 파열)', '9.1', '', '스트렌드(코드) 파열', '', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('로프의 단말처리', '9.2', '', '[바빗채움 방식]
① 매다는 장치의 끝부분은 바빗채움 방식 설치 불가
② 보상수단의 균형로프 끝부분은 안전율 5 이상의
증빙서류 제출 시 사용 가능
★ 설치검사가 아닌 경우 바빗식의 사용을
판정하지 않음
· 승강기 운행구간 내 종단층 근방의 정속 주행 중
검사기준에 따른 하중에서 비상정지하여 완충기에', '''23. 3. 2. 허가 이후', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('과도한 미끄러짐의 정의', '9.3.1', '', '★ 감속구간이 아닌 정속구간 중 비상정지하여
미끄러짐 확인 필요
[보상수단의 제거]
① (종전 현장) 시정권고
② (개정 현장) 조건부합격(보완)
[교체 수시검사 시 추가 설치된 보상수단]
보상수단 및 보상수단의 부속품은 영향을 받는
모든 정적인 힘에 대해 5 이상의 안전율 증명
[추가적인 보호조치]
추가적인 보호조치로 와이어 로프의 사용 허용
[보상수단의 용접허용]
① 공장용접', '(20년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('보상수단', '9.6', '', 'a. 공장에서 용접하여 인증심사 시 안전율을
만족하여 출하된 제품 사용
b. 적용: 즉시
② 현장용접
a. 검사신청 시 아래 모든 서류 제출
- 설계도면
- 강도계산서
- 자체확인서(확인자 서명 필수)
b. 적용: ~''24.12.31.까지 제조사 자체 강도
계산서 제출 시 인정
: ''24.12.31.이후 설치검사 시 모든
서류 제출
[보호수단의 적용범위]
① 도르래 사이의 물체의 유입 등 위험이 존재하는
경우 보호수단 설치하여야 함
② 인체보호를 위한 보호수단 설치하여야 함', '(24년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('권상도르래의 보호수단', '9.7', '', '장치가 있는 경우 다른 공간에 대한 막음 조치는
규정하지 않음
[카 하부 도르래 물체유입 보호수단]
(티케이엘리베이터)
① ''18. 4. 전 검사분: 시정권고
② ''18. 4. 이후 검사분: 부적합 판정
[구동기 회전부품 상부 유효거리]
① MR: 유효 수직거리 미달 시 부적합 판정
② MRL: 유효 수직거리 미달되더라도 보호 조치
되는 경우 적합 판정
[카 지붕 위 설치되는 과속조절기의 보호수단]
기계실, 승강로 상부공간, 피트에 위치하여 작업자
보호를 위한 보호조치 되어야 함
[주 도르래 메쉬망 적용 여부]
① 매쉬망 구조는 규정하지 않음
② 점검 등 유지관리를 위해 필요한 경우 떼어낼
수 있어야 함
[보조도르래 보호수단]
로프와 풀리/체인과 스프라켓 사이의 물체유입은
로프/체인이 권상도르래 또는 풀리/스프라켓에
수평 또는 최대 90도까지 수평의 어떤 각도로
들어가고 있는 경우 요구됨
[구동기 도르래 로프 벗어남 보호수단]
① 싱글랩 도르래: 중간 고정장치가 추가로 포함
되지 않은 경우 부적합 판정
② 더블랩 도르래: 중간고정장치가 추가로 포함
되지 않은 경우: 적합 판정
③ 랩의 각도가 30도 이하: 로프가 도르래에 들어
가고 나오는 지점 사이에 하나의 고정 장치
허용
④ 과속조절기의 로프가 도르래에 들어가고 나오
는 지점 근처에 고정장치가 없는 경우 부품
인증 정기심사 시 개선`적용하며 과속조절기
인장풀리 보호수단의 점검구 크기는 KS B
ISO 13857, 표 4에 따라야함
① 보호수단의 설치여부와 관계없이 회전방향 및
회전여부 등을 확인할 수 있으면 인정', '(23년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('권상도르래 보호수단 (회전부품이 보이는 구조)', '9.7.2', '', '표 4에 따른 구멍크기 확인', '(20년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('추락방지 안전장치', '10.2.1', '', '확인
★ 추가적으로 무부하에서 점검운전속도로
추락방지안전장치의 작동여부를 확인하는
경우에도 하강방향으로 움직이는 카를
정지시킬 수 있어야 함
② 정기검사:
무부하에서 점검운전속도로 추락방지안전
장치의 작동여부 확인
③ 승강기인증:
무부하(점검운전 속도)를 포함하여 추락
방지안전장치의 작동 확인
[감속도의 범위]
① 최대: 비상정지장치 작동 및 완충기에 정
지할 때 감속도 이내
② 최소: 자율안전확인 안전기준 엘리베이터
권상기 제동장치의 최대 제동거리는 0.05 g
상당거리 이내로 규정
③ 설치/수시검사 시 안전기준에 따라 정격', '(23년 제4차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('과속조절기 로프', '10.2.2.1.3', '', '유지관리용 공구(스패너)를 사용하여 분리
할 수 있어야 함
② 과속조절기 로프와 비상정지장치 연결부
분리 시 과속조절기 로프 간 연결이 분리
되어 위험상황이 발생되는 구조 불가
[로프 또는 체인 이완감지장치 검사]
① 로프 또는 체인 이완감지장치는 로프 또는
체인이 늘어진 경우 지속적으로 감지가
유지되는 구조인지 확인
a. 로프/체인 이완감지장치가 늘어짐을 감지
(설치위치 불량)하지 못하는 등 검사기준에
부적합한 경우 : 불합격 판정', '(17년 제4차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('안전로프에 의한 작동', '10.2.2.3', '', 'b. 로프/체인 이완감지장치가 지속적으로 감지', '', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('상승과속방지장치', '10.6', '', '부품이 설치되어 있는 경우 두가지 중 어느', '', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('개문출발방지장치', '10.7', '', '하나임을 확인
a. 부품인증 시 두가지 부품을 하나로 안전인증
b. 승강기 안전인증(모델/개별) 설계심사 시
두가지 부품으로 인증
★ 사용중인 승강기에 추가로 부품을 설치
하는 경우 안전성평가 대상
③ 인증: 이중브레이크와 로프브레이크가 동시에
작동하지 않는 것을 확인(서류)
④ 검사: 검사 시 로프브레이크 정지거리만 확인
[정밀안전검사 시 카의 의도하지 않은
움직임에 대한 보호수단의 분동 적용]
정격하중의 100%, 무부하 모두 검사 실시
★ 로프브레이크, 카브레이크 등 현장검사가
가능한 보호수단일 경우에 한함
[유압식 엘리베이터 개문출발방지장치
UCMP 밸브의 압력을 초과하는 경우]
수시검사(제어반 교체 등)의 경우
① 노후수리 불능 등에 따라 부분교체하는
것으로 실린더 교체를 적용할 수 없음
② 적용 범위에 맞는 밸브 설치 또는 실린더
교체  - 시정권고 판정
③ 기준적용일이 ''18.12.31. 이전이고 구동기
+ 제어반 교체에 따라 설치날짜가 바뀌는
수시검사인 경우 압력을 초과하지 않아야 함
[유압식 엘리베이터 개문출발방지장치
작동 시험]
① 제조사의 제공 매뉴얼에 따른 시험방법
절차대로 검사 진행 및 확인
② 정지거리 검사가 불가한 경우, 개문출발
방지장치 작동 신호에 따른 램프 등으로
갈음 가능
- 이 경우 검사기록표 내 정지거리 공란
[이중브레이크가 설치된 승강기 수시검사
방법]
① 상승과속방지장치 및 개문출발방지장치
검사가 가능하도록 패널이 구비된 제어
반으로 교체된 경우 현장검사 실시
② 해당 패널이 구비되지 않은 제어반으로
교체하거나 제어반이 교체되지 않은
수시검사인 경우, 설치상태(이중브레이크
설정상태, 스위치 설치상태 등) 현장검사
및 정지거리 성적서 서류검사로 대체
11. 주행안내 레일
① 기존의 승강기 부품을 재사용하는 경우
안전기준에서 요구하는 강도 등이 증명
되어야 함
② 주행안내 레일, 레일의 부분품, 기계대,
완충기 지지대를 재사용하는 경우 인증
에서 승인된 규격 이상을 사용하여야 함
(자기적합확인서 제출)
a. 주행안내 레일: 규격이상 확인', '(20년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('레일 브라켓 재사용', '11.2.1', '', '* 설치간격 초과: 레일브라켓 추가 또는
계산서 제출
c. 기계대: 설치상태(고정상태 등) 확인
③ 규격이하의 경우 변경사항에 대한 안전
인증을 받아야 하며 정격속도, 하중 등
설계내용이 변경되는 수시검사의 경우
주행안내레일, 구동기지지대 안전성검토
확인서 및 자기적합확인서를 추가로
제출하여야 함
[교체공사 시 균형추 측 슬라이딩 클립
인정 여부]
① 슬라이딩 클립은 승강행정이 40m 이상
에서 열팽창 또는 건물 침하(정착)에 의해', '(20년 제1차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('슬라이딩 클립', '11.2.3.5', '', '가이드레일의 움직임이 있는 곳에 사용
되어야 함
② 다만, 교체되지 않은 주행안내 레일 및
주행안내 레일의 부분품은 종전 기준으로
적용할 수 있으나 승강행정에 따라 적합한
클립으로 교체하는 것이 바람직함
12. 완충기
[개별인증 승강기 검사방법]', '(22년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('에너지분산형 완충기', '12.2.2.2', '', '완전히 눌러 엘리베이터 또는 완충기의 설치
상태 확인
[병렬형(다중) 에너지분산형 완충기]', '(19년 제4차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('완충기의 정상적인 복귀 확인 장치', '12.2.2.4', '', '모두 설치되어 완충기의 복귀상태를', '(18년 제1차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('권상기 고정', '13.1', '', '있으며, 허가를 득하지 않은 구조(허가서에
포함되지 않은 구조)인 경우 승강로 구조
계산서 또는 승강로 구조 안전 확인서
제출하여야 함
④ 기계대가 철골이나 벽 위에 얹히지 않고
임의 부재로 고정하는 경우 허가를 득하지
않은 철골이나 벽으로 간주 되므로 구조
기술사의 서류 등을 받아야 함
[수시검사]
① 제어반 등 부분교체 수시검사 시 오버밸런스 측정
② 제조사로부터 오버밸런스 설계치를 받아
설계치 이내인지 확인
[오버밸런스 전류차]
① 기술서류: 제조업체에서 제출한 정격하중의
균형량(오버밸런스율) 및 상승/하강 전류
차에 대한 설계값
② 현장검사: 50%의 하중을 카에 적재하고
정격속도의 상승/하강 전류 차가 설계치', '(18년 제9차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('균형량 (오버밸런스율)', '13.2.1.3', '', '③ 제원사항: OB U/D 전류차로 표시, 제조', '', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('전자-기계 브레이크', '13.2.2.2', '', '(티케이: T51 SN01)', '', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('비상운전', '13.2.3', '', 'b. 두 번째 스위치: 5가지 안전장치 무효화
★ 첫 번째 스위치는 승강기 운전을 위한
추가 운전제어 스위치임
[수동비상운전수단 휠 구조]
카를 움직이는 수단으로 휠이 사용되는 경우
휠의 구조는 부드럽고 바퀴살이 없는 구조
이어야 함
[수동비상운전수단 제거 확인 스위치]
평상시 구동기와 일체형으로 고정된 휠에 적용
★ 일체형 고정 휠이 제거되거나 풀리는 경우
정상적인 엘리베이터 운행이 불가한
구조이므로 휠이 구동기에 재 연결되기
전까지는 전기안전장치에 의해 엘리
베이터 정지
[연속되는 상하 승강장문의 문턱간 거리가
11m 초과한 경우 건축허가별 전기적 비상
운전 제어의 예비전원 적용]
① 종전의 「승강기 안전검사기준」을 적용
하여 검사를 받고 사용중이거나 건축허가
(''19.3.28. 이전 건축허가)가 진행중인 승
강기에 대해 해당 안전기준 및 고시에
따라 전기적 비상운전을 적용할 수 있음
(신규 및 교체 설치검사)
② 전기적 비상운전 제어가 적용되는 경우
정상적인 주전원 또는 예비전원으로부터
전원이 공급
a. 주전원 공급 시: 정상적인 주전원에 의한
전기적 비상운전 제어
b. 정전 시: 예비전원(무정전 전원장치, 비상
발전기 등)에 의한 전기적 비상운전 제어
[비상운전 검사 중 전원 차단 후 복귀 시
승강기 운행불가]
승강기 안전검사 및 자체점검에서 발생하는
승강기 부품 손상 방지를 위해 제조사는 안
전한 검사 및 점검 방법을 제시하여야 함
[기계적 비상운전 수단 개수]
각각의 엘리베이터마다 기계적 수단 또는 전기적
수단이 비상운전 수단으로서 구성되어야 함
[균형량(오버밸런스율) 검사]
정격하중의 균형량에 따른 하중을 카에 적재하고', '(18년 제1차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('오버밸런스율', '13.2.3.1', '', '정격속도로 상승할 때와 하강할 때
① 전류 차이가 설계치 범위 이내인 경우 합격
② 제조사에서 제시하는 방법으로 2~3회 추가 시험
에도 설계치 범위 초과 시 불합격
① 기계실이 있는 엘리베이터의 경우 현수
로프 또는 과속조절기의 로프에 전층
표시하는 방법 등으로 잠금해제 구간의
도착 여부 확인 가능', '(24년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('카 잠금 해제구간 확인 장치 적용', '13.2.3.2', '', '② 예비전원은 건축물의 정전 시 공급되는
전력으로 승강기의 전원계통 고장 또는
주개폐기를 차단한 상태에서의 구출운전 중
잠금해제구간을 확인할 수 없음으로 적용
불가
[수시검사 시 적용]
① 제어반+구동기* 교체: 적용
*구동기: 권상기+전동기+제동기
② 제어반 교체: 적용 제외
[전자파 인증]
자동구출운전장치의 전자파 인증서 불필요
하며 동작 상태만을 확인
[50% 적재 후 카와 균형추가 만나는 지점
에서 자동구출운전 작동 안되는 경우]
설치(수시)검사 시 확인하여 부적합한 경우
보완(조건부합격) 판정
[발전기 설치현장 배터리 설치 제외 가능 여부]', '(23년 제1차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('자동구출 운전수단', '13.2.3.6', '', '적용 불가하며, 각 엘리베이터에 투입되는
전원이 차단되는 경우에도 비상발전기로 전원이
투입될 수 있어야 함
[소방구조용 엘리베이터 전원공급장치]
① 두가지 방안 중 어느 하나에 적합할 경우 적용
a. 자동구출운전 작동을 모두 포함하여 60초
이내에 소방구조용 엘리베이터 보조 전원
공급장치로 전환
b. 자동구출운전의 문 열림 1회를 포함하여
60초 이내에 소방구조용 엘리베이터 보조
전원공급장치로 전환
② 소방스위치 “0” 위치에서는 자동구출운전
수단 작동
③ 소방스위치 “1” 전환에 따른 소방운전에서는
건축 전원이 차단되면 자동구출운전장치
작동 후 17.2.9.2.3 가) 만족
[검사판정]
① 현행 검사기준에 미적용 되는 항목이더라도
기 설치된 안전장치의 작동 상태는 양호
하여야 함
② 현행 기준에 의해 설치된 자동구출안전
장치가 아닌 권장사항 및 옵션으로 설치된
자동착상장치(단순 착상만 적용되는 장치)는
시정권고
[안전장치]
문닫힘안전장치, 카 내 조명 또는 비상등, 카 내
비상통화장치 등 카 내 이용자 관련 안전
기능은 정상 작동 되어야 함
[전동기 구동시간 제한장치 적용 제외]
① 중력방식(무게차)에 따라 경부하 방향으로
움직이도록 설계되어 있으므로 전동기
과부하가 발생하지 않는 구조임
② 전동기 구동시간 제한장치의 적용 제외
[군관리 운전 시 개별 승강기의 자동구
출운전]
군관리 운전 제어부의 이상(전원차단, 고장 등)
으로 개별 승강기의 정상운전에 영향을 끼
치지 않아야 함
[검사방법]
① MR
a. 카를 점검운전으로 층과 층사이에 정지 후
점검운전을 자동전환(고장구현)
b. 기계실 내 분전반 차단기 전원 off(정전구현)
c. 자동구출운전 작동 확인
② MRL
a. 카를 점검운전으로 층과 층사이에 정지 후
점검운전을 자동전환(고장구현)
b. 주개폐기 전원 off 후 별도의 테스트 스
위치 작동(정전구현)
c. 자동구출운전 작동 확인
★ 제조사와 협의하여 구성된 시스템으로 보관
및 제출되는 제조사의 자동구출운전
매뉴얼 참조
③ 자동구출운전의 원활한 검사를 위해
자동구출운전 테스트 버튼 설치 권장
a. 자동구출운전 테스트 버튼이 설치되지 않은
경우 건물 측 수전반은 제어반(비상패널)
근처에 설치하는 것이 바람직함
b. 수전반의 위치 확인이 불가한 경우 접근
방법을 매뉴얼에 표시
④ 제조사가 제시하는 자동구출운전 등의 안전한
검사 및 점검 방법을 매뉴얼에 기재
[비상문을 승강장으로 적용가능 여부]
자동구출운전 시 카는 자동으로 가장 가까운
승강장으로 이동하여야 하나 비상문이 설치되는
전면공간은 승강장이 아니므로 자동구출운전 시
비상문이 설치된 층으로 이동하는 것은 불가
[문 열림 횟수]
자동구출운전장치 작동 시 문 열림 횟수에
대하여 제한하지 않으므로 배터리 용량 등
안전기준에 따라 제조사 및 유지관리업체에
서 충분하게 설계하여 관리
[속도 판정]
① 정기검사 시 카의 정격속도 범위를 벗어난
경우 조건부합격 판정
② 승강기시설 안전관리법(''92.7.1.) 시행 전
설치된 승강기의 정밀안전검사의 경우
시정권고
③ 정격속도를 변경한 경우 수시검사 대상
[유압식 엘리베이터 정격속도]', '(18년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('속도', '13.2.4', '', '① 기준해석: 빈 카의 상승 운행속도와 정격
하중을 실은 카의 하강 운행속도의 제한을 의미
② 운행속도의 범위는 정격속도의 ±8 %
③ 설치, 수시, 정밀안전검사 시
0%(상승), 100%(하강) 측정
④ 정기검사 시
0%(상승)만 측정, 하강은 제외
[구동기 관련 승강기안전부품의 로핑,
적용하중, 속도 적용]
① ''19. 3. 28. 이전 상승과속방지장치 인증 시
1:1 로핑으로 인증받은 것을 2:1 로핑으로
설치 시 속도를 1/2로 줄이면 적용 하중을
2배로 사용가능한 것으로 인정하였고 이후
UCMPM 안전성평가에서도 이를 준용하여
인정함
★ 1:1 로핑으로 인증받은 경우, 상기 조건을
만족한다면 2:1 로핑 적용 가능
② 구동기 관련 승강기안전부품(구동기, 상
승과속방지장치, 개문출발방지장치) 전체
에도 종전과 같이 동일하게 적용
[가설(임시)전원 수급 현장 검사판정]
검사 신청인이 임시전원 사용으로 수검을
요청한 경우, 다른 부적합 사항이 없고 정상
주행 시 합격 판정
[정밀안전검사 시 오버밸런스 부하에서의
속도 측정]
검사기준에 적용되는 장치(기능)이 설치되어 있고
측정장비로 검사가 가능하다면 관련 검사기
준에 맞춰 속도를 측정하고 입력하여야 함
[전 부하 압력 측정 방법]
① 정격하중의 최상층에서 유압잭에 연결된', '(16년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('잭의 실린더 및 램의 압력', '13.3.2.1.1', '', 'a. 검사방법: 정격하중(100 %)의 카가 최상', '(16년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('릴리프 밸브', '13.3.5.3', '', '② 140% 초과 170% 미만으로 조절하려는
경우 관련 기술서류가 제출되어야 함', '(18년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('전기설비 및 전기기기 (제어장치의 위치)', '14.1.1.5', '', '권장:', '이후', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('주 개폐기', '14.5.1', '', '구분된 경우 비상운전 패널에 위치
③ 주 개폐기가 제어반, 비상운전 패널 등에
포함된 경우 분전반의 위치와 관련하여
별도 규정하지 않음
- 분전반 내 타 설비의 차단기와 엘리베이터
차단기가 함께 있는 경우 명판 등으로 구분
④ 분전반이 기계실, 기계류 공간, 승강로,
풀리실 등 엘리베이터 공간에 포함된 경우
엘리베이터와 관계없는 설비의 차단기는
포함되지 않아야 함
주 개폐기가 위치한 패널의 덮개 개폐 시', '(20년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('패널의 덮개', '14.5.2', '', '별도의 공구가 필요한 경우 부적합 판정
① 엘리베이터에 탑승하는 로봇은 한국산업
표준 KS B 7317에 적합해야 하고 관련된
공인기관의 안전성 평가를 받아야 함', '(19년 제4차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('로봇 탑승용 엘리베이터 무선통신장치', '14.11', '', '로봇 엘리베이터 탑승 불가', '(22년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('전기고장에 대한 보호 및 고장분석', '15.1', '', 'b. 제어회로에 연결: 승강기 인증 기술도서에', '(24년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('강제감속장치', '15.2.4', '', '② 데이터가 미 설정된 상태에서 정상 운행이', '', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('강제감속장치 미설정으로 인한 돌상 방지', '15.2.5', '', '', '(22년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('강제감속장치 돌상 방지', '15.2.6', '', '가능하여 정격속도로 최상층 또는 최하
층에 충돌하는 사고 발생
a. 신규제품: 공장에서 입력하여 출고하고
현장에서 데이터 수정이 불가하도록 조치
b. 기존제품: 제조사 현장 확인
16. 제어-파이널 리미트
스위치-우선순위
① 보안업체 등의 관련 장치는 설치 가능하며, 해당
승강기 제조업체의 검증을 통해 등록을 제어하는
것이 바람직함
- 무선통신을 활용하지 않는 경우 보안을 위해
설치하는 층 등록 제한 장치는 안전성 평가', '', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('보안업체 등의 층 등록 제한 장치', '16.1.1.1', '', '② 소방구조용 엘리베이터의 소방운전 및 피난용
엘리베이터의 피난운전 시 관련 장치가 층 등록을
제한하지 않아야 함
③ 장애인용 엘리베이터의 경우 층 등록을 제한하지
않는 것이 바람직하며 주무부처의 개별 법령에
따른 유권해석에 따라 적용
① 과부하감지장치 작동 시 자동 동력 작동식 문은
완전히 개방되어야 함
- 과부하감지장치 스위치 작동 중에만 문이
반전되는 경우 부적합 판정
② 결함확인장치 등으로 확인가능한 현장이나,
장치가 없는 경우 조건부합격 판정
★ 정기 및 정밀안전검사 확인검사 시 서류', '(22년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('과부하감지장치', '16.1.2', '', '확인이 원칙이나 안전계통 부적합사항
으로 현장확인 가능
③ 센서로 작동되는 과부하 감지장치에 대한 자체
점검 방법을 제시할 경우 적합여부를 판단하여
검사방법으로 안내
④ 과부하 감지장치는 어느 층에서도 정상적으로
작동해야 함
① 기계실 제어반 내 점검운전의 설치 불가하며
전기적 비상운전 제어 설치는 가능함
② 점검운전과 전기적 비상운전을 동시에 전환한 경우', '(22년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('점검운전 제어', '16.1.5', '', 'a. 점검운전이 되는 경우: 적합 판정
b. 엘리베이터가 움직이지 않는 경우: 적합 판정
c. 전기적 비상운전이 되는 경우: 부적합 판정
① 승강로 외부의 전기적 재-설정 장치는 재설정
시에만 적용되어야 함', '(17년 제10차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('전기적 재-설정', '16.1.5.2.2', '', '② 승강로 외부의 재설정 장치와 피트 점검조작반의
동시 조작에 의한 점검운전 전환은 부적합 판정
[피트 리셋 장치의 작동]
① 피트 리셋 장치는 피트로 출입할 수 있는 문과
가까운 곳에 위치하여야 함
② 피트 출입문 가까이 설치된 파킹 스위치에서만
자동운행 복귀 기능이 허용되며 다른 층에는
허용 불가
③ 추가로 다른 층에 파킹스위치를 복수로 설치는
가능하며, 이 경우 파킹스위치 작동 위치에서
파킹 및 해제되어야 함
★ 다른 층의 파킹스위치에서는 자동운행
복귀 허용하지 않음
④ ''21. 1. 1 이후 설치검사 시 피트 진입 층 외
기타 층에서 전기적 재-설정이 가능한 경우
보완 판정
[자동운행 중 바이패스 작동]
① 엘리베이터가 자동 상태에서 바이패스
작동 위치로 전환된 경우 엘리베이터의
정상 작동은 가능하지 않아야 함
② 다만, 아래 사항을 모두 만족하는 경우 인정
a. 자동 운행 중 바이패스 작동 위치 전환 시
근접 층으로 이동 후 운행 정지
b. 자동 상태이나 정지되어 있고 바이패스
작동 위치 전환 시 즉시 운행 정지
★ 자동모드에서는 바이패스 스위치 전환 시
도어단락 되지 않아야 함
③ 바이패스 기능은 점검운전(전기적 비상운전)', '(20년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('바이패스', '16.1.8', '', '스위치 및 바이패스 작동 모드가 모두
전환된 상태에서만 작동되어야 함
[비상문의 바이패스]
① 승강로(피트 포함)에 설치되는 비상문 또는 점검문,
출입문 등은 바이패스를 적용할 수 없음
★ 해당 문의 문 닫힘을 확인하는 접점은 승강장
문의 접점 회로에 연동되지 않아야 함
② 승강장문과 동일한 구조*로 설치되는 비상문은 유지
관리를 위해 바이패스 할 경우가 발생 되므로 그
비상문 잠금장치의 접점에 한정하여 바이패스 적용
가능
* 카문의 방향으로 설치되고 카문과 연동되어
열릴 수 있는 승강장 문과 동일한 구조의 비상문
③ 현재 승강장문과 동일한 구조가 아닌 비상문
또는 점검문, 출입문 등의 문 잠금장치가
승강장문의 접점에 연동되어 그 문이 바이패스
되는 경우 해당 승강기 제조사는 안전회로를
개선하여 변경인증을 받아야 함
④ 검사판정: 승강장문과 동일한 구조로 설치되는
비상문 잠금장치의 접점에 한정하여
바이패스 적용
a. ''24.7.1 이후 설치(신규)검사: 보완
b. ''24.7.1 이후 수시(제어반 교체)검사: 보완
c. ''25.1.1 이후 안전검사: 조건부합격
⑤ 기 설치된 현장: 주의표시 부착
a. 부착기한: ''24.7.1. ~ ''24.8.1
(바이패스 회로 보완 완료 후 제거 가능)
b. 부착위치: 제어반 내 바이패스 장치, 비상문·
점검문의 내/외부, 펼치는 사다리 등 전기
안전장치 근처의 보기 쉬운 위치
c. 픽토그램을 포함하는 직관적인 안내문구
[유압식 엘리베이터 카 내 도어 자동닫힘
정지스위치 설치]
① 카 내 문을 정지시키는 정지장치 또는 도어스
위치를 노출형으로 설치 불가
② 카 내 노출형 정지스위치 설치 시 아래의 사항을
모두 만족하여야 함
a. 도어 동력을 차단하는 방식이 아닌 도어
자동닫힘 신호*를 차단하는 방식', '(24년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('정지장치', '16.1.11', '', '* 도어가 열린 뒤 일정시간 이후 도어 자동
닫힘 신호
b. 크리핑에 대한 보호조치가 원활하게 작동된 경우
★ 전기적 크리핑 방지 시스템이 적용된 경우
설정시간(15분 이내)이 되면 자동으로
도어를 닫고 최하층으로 운행하여야 함
c. 카 내 스위치 근처에 ‘문을 닫으시오’ 표시
[기계실 정지장치]
① 구동기 주변 1m 이내에서 정지 장치를 누를 수
있도록 제공되는 경우 적합
★ 정지 장치를 추가로 설치하는 경우
영구적으로 고정
② 리모컨 사용으로 영구적으로 고정이 불가능한
경우 작업자가 정지 장치의 위치를 인지
할 수 있도록 홀더 또는 자석을 사용
★ 단, 상기 형식을 포함하여 인증을 받아야
하며, 기존 제어반에 리모컨을 추가로
설치하는 것은 운전 및 정지 장치를
포함하므로 변경 인증 대상임
[승강로 내 구동기의 정지장치]
① 승강로 내부 구동기에서 카 지붕에 설치된
정지장치 또는 주개폐기가 1m 이내에
직접 접근이 불가한 경우 다른 정지장치가
있어야 함
② 엘리베이터 구동기에서 1m 이내에 견고하게
고정되는 경우에 한정하여 자석식으로 설치 가능
[상부 파이널 리미트 스위치가 작동되기 전
균형추가 완충기에 먼저 간섭되는 경우
검사판정]
“파이널 리미트 스위치는 카(또는 균형추)가
완충기 또는 램이 완충장치에 충돌되기 전에
작동되어야 한다.”의 규정에 따라
조건부합격 판정
[유압식 완충기의 파이널 리미트 스위치
작동방법]', '(22년 제1차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('파이널 리미트 스위치', '16.2', '', '종전의 승강기검사기준을 적용하여 검사를
받고 사용중이거나 건축허가가 진행 중인
승강기에 대하여는 종전의 승강기검사기준을
적용할 수 있다(이하생략)라고 규정하고 있으
므로 현행 기준에 만족하지 못 할 경우 종전
검사기준 적용
[균형추 최대런바이 산정 - 캠 설치]
균형추 측 최대 런바이 계산 및 입력 시 카
상부 틈새에 따른 계산값과 캠의 길이를
비교하여 최소값 입력', '(18년 제9차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('비상통화장치', '16.3', '', '[시설물 내 비상통화장치 설치 위치]
① 관리 인력이 상주하는 장소가 2개소:
모두 설치
② 관리주체가 상주하는 장소가 1개임을
소명 시 1개소로 인정
★ 소명방법
a. 스마트워크 특이 사항에 소명 내용
입력 후 관리주체 확인 서명 저장
b. 별도의 양식으로 소명을 받아 스마트워크
비상통화장치 항목에 사진 촬영 후 저장
③ 건축물에 관리 인력이 상주하는 장소가
없는 경우라도 최소 1개의 통화 장치를
설치하여야 함
[비상통화장치 호출방식 일원화]
① 장난콜 방지기능(2회누름, 지속누름) 적용 불가
② 기 설치된 비상통화장치 중 장난콜 방지기능
제거가 불가한 비상통화장치의 경우 카 내
비상호출버튼 근처에 “비상 통화 연결 방법
스티커” 부착 의무화
[소방구조용 엘리베이터 승강로 내 비상
통화장치 물에 대한 보호]
승강로 내(카 지붕 위, 피트 등)에 설치된
비상통화장치가 승강장문을 포함한 승강로 벽
으로부터 1m 이내 또는 피트 바닥 위로 1m
초과한 위치에 설치된 경우:
떨어지는 물과 튀는 물로부터 보호되거나 IP
X3 이상의 등급을 보호
[승강로에 설치되는 비상통화장치]
① “표시 등”의 적용은 카 내로 한정
② 점검운전 조작반 내 비상통화장치 버튼의
경우 별도 설치 가능
③ 인터폰 형태(내선 번호가 분명히 표시되어
식별 가능 하여야 함)도 적합
[측면 조작반의 비상통화장치]
① 램프 색상(노란색, 녹색) 측면 조작반에도 적용
② 카 내 공간의 어떤 위치에서든 원활한
통화가 가능할 경우 측면 조작반의 스피
커 또는 마이크는 제외 가능함
[램프 색상 적용]
① 통화장치가 외부로 연결되는 동안 비상
통화 버튼은 노란색이 점등되어야 하며,
수신인과 연결된 경우 녹색 점등
② 상담원이 받기 전 상담센터로 정상적으로
연결된 경우(콜센터 연결되어 ARS 안내)
비상통화가 연결된 것으로 인정
[필터링 및 전기 인터페이스]
① 과도한 비상통화를 거를 수 있는 수단은
필수로 설치하여야 하며, 기능의 정지 및
재작동 할 수 있는 수단을 제공하도록
되어 있으므로 운영상 필요에 의해 정지/
작동 설정 가능함
② 전기 인터페이스가 안전회로 차단 시
자동호출기능을 의미하지 않으므로 검사 시
확인 불필요
[보이스봇]
① 보이스봇의 적용 조건
a. 특정 예약어*를 사용한 보이스봇의 일부
활용은 허용
* 위급상황에서 사용하지 않을 언어로 점검
상황에서만 사용하도록 설정어 등록
b. 보이스봇은 비상통화장치 점검에 한정하여
비상통화를 종료할 수 있음
① 기준 적용이 완화되는 경우: 정기검사', '(16년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('용도변경의 수시검사 적용', '17.1.1', '', '② 추가요건 기준이 적용되는 경우: 수시검사
(ex. 승객용 → 장애인용)
① ｢장노임법｣ 또는 ｢교통약자법｣ 등 개별법령
에서 규정하는 시설기준에 대하여 승강기', '(16년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('개별 법령에서 규정하는 시설기준', '17.1.1.2', '', '예) 군관리 운영방식, 카드키 사용, 손잡', '(20년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('전면 활동공간', '17.1.2.1', '', '활동공간이 중복되는 경우 출입문을 닫
았을 때 활동 공간 확보를 기준으로 함
따라서 건물 출입구 개폐반경과 승강기
전면 활동공간이 중복되어도 적합
④ “장애인용 엘리베이터의 추가요건의 검사
판정” 유권해석에 따라 승강기 전면 활동
공간에 시공오차 2 %를 적용
[소방구조/장애인용 엘리베이터 카의 깊이]
소방구조/장애인용 설치 시 카의 깊이는 소방
구조용의 깊이 1,400mm에 적합하게 설치
하여야 함', '(23년 제1차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('카 내부 유효바닥면적', '17.1.3.1', '', '카 크기]
① 신축하는 건물이 아닌 경우:
폭 1.1 m 이상, 깊이 1.35 m 이상
② 신축하는 건물인 경우:
폭 1.6 m 이상, 깊이 1.35 m 이상
★ 신축한 건물이란, 기존 건물과 독립되어
새로 증축된 건물과 기존 건물을 완전히
철거하고 그 규모 범위 내에서 새로 개축
및 재축한 건물, 그리고 신축건물에 설치
되는 대상 승강기를 의미함
따라서 층수 변경만으로 이루어지는 증축과
단순 용도변경은 해당하지 않음
[측면 조작반 및 손잡이 설치]
① 호출버튼·조작반·통화장치 등 승강기의 안팎에
설치되는 모든 스위치의 높이는 바닥면으
로부터 0.8m 이상 1.2m 이하의 위치에
설치되어야 함
② 다만, 스위치의 수가 많아 1.2m 이내에', '(19년 제4차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('이용자 조작설비', '17.1.4.1', '', '설치되는 것이 곤란한 경우 1.4m 이하까지
완화될 수 있음
[카 벽에 유리가 사용된 경우 손잡이 설치]
① 장애인용: 바닥에서 0.8m 이상 0.9m 이하 설치
② 장애인용 외: 0.9m와 1.1m 사이에 유리와
독립적으로 고정된 손잡이 설치
① 바닥면적이 1.4m × 1.4m 이상인 경우:
우측 및 좌측 어느쪽이던 한 개 이상 조', '(17년 제10차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('휠체어사용자용 조작반', '17.1.4.2', '', '② 바닥면적이 1.4 m × 1.4 m 미만인 경우:
진입방향 우측면에 설치하거나, 양측 모
두에 조작반을 설치할 경우 적합
장애인용 엘리베이터의 조작반에 필름 등이
부착되어 있더라도 점자 표시를 정상적으로
감지할 수 있어야 함
[비접촉식 조작설비]', '(18년 제7차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('점자표시', '17.1.4.3', '', '① 비-접촉식 조작설비 등의 추가 적용은 개별
제품에 대한 주무부처(보건복지부)의 유권
해석에 따라 판정
- 미제출 시 조건부합격 판정
① 각 층의 음향신호는 카 내의 음향신호로', '(23년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('음향 및 음성 신호', '17.1.5.3', '', '② 승강장에 있는 장애인이 인지할 수 있도록', '(19년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('문 열림 대기', '17.1.5.4', '', '② ''09. 11. 24. 이후 건축허가:
카 내 버튼(휠체어 사용조작반 및 주 조작반)
의 호출 동작 시 10초 대기
건축허가일 ''97. 8. 18. 이전 승강기 전면교체 시
① 승객용→장애인용: 점형블록 설치(강제적용)
② 장애인용→장애인용: 강제적용 제외
(시정권고)
[탈화 공간 및 BF 인증 현장]
① 실내 탈화 공간의 점형블록 설치 제외
★ 실내 탈화 공간: 경로당, 어린이집,
노인요양시설 등
② BF 인증서(예비인증 포함) 제출 시 점형', '(17년 제7차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('점형블록', '17.1.5.5', '', '블록 설치 제외
★ 예비인증서의 보완 내역에 승강기 점형
블록을 설치하도록 하는 경우 설치되어야 함
[검사판정]
① 점형블록의 개수는 판정하지 않음
② 점형블록 돌기의 바닥 마감선(바닥의 수평면)
일치 여부는 판정하지 않음
③ 바닥재(질감)는 주무부처의 개별 법령에
따른 유권해석에 따라 적용
[측정 위치]', '(22년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('조도', '17.1.5.7', '', '① 출입구 내부문과 외부문 틈새(하단)
② 승강기 내부 바닥
③ 승강기 내부 조작장치 최하단
[소방구조용과 승객용 기계실이 붙어 있는
경우 접근 경로]
① 기계실의 구조는 방화구획된 소방구조용을', '(17년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('소방구조용 기계실 방화구획', '17.2.2.1', '', '통하여 승객용으로 접근하도록 설치하는
것을 권장
② 소방구조용과 일반용 엘리베이터가 방화
구획된 경우 기계실 출입 순서는 규정하지 않음
① 소방구조용 엘리베이터 방화구획
a. 모든 승강장문 전면 로비
b. 승강로
c. 기계실
② 소방구조용+ 기타용도 승강로 및 기계실
a. 소방구조용 엘리베이터와 다른 엘리베이터를
구분시키기 위한 중간 방화벽 설치
b. 모든 엘리베이터(건축) 및 전기장치가 소방', '(17년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('최대 누수 수준', '17.2.4.2', '', '★ 완충기 눌림점 아래를 최대누수 수준
으로 설정하고 펌프용량, 배수능력 등
계산된 값을 제출받아야 함
★ 완충기 눌림점: 피트바닥에서 완전히
압축된 완충기까지의 거리
③ 정지 장치는 피트 깊이에 따라 점검운전
조작반과 같이 설치될 수 있으므로 IP67
이상의 등급 확보를 위한 커버 등의 설치 불가
카 내부에서 비상구출문을 완전히 열어 출입이', '(23년 제1차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('소방구조용 비상구출문', '17.2.5.1', '', '가능하여야 함
① 승강로 내 비상탈출을 위한 접이식 사다리가', '', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('카 외부에서 구출', '17.2.5.3', '', '설치되어 사다리가 펼쳐졌을 때 카와 간섭
등이 있는 경우 사다리에는 전기안전스위치가
설치되어야 함
② 접이식 사다리가 보관 위치에 있지 않으면
엘리베이터가 운행되지 않도록 막는 전기
안전장치가 있어야 함
③ 피트 사다리의 설치 규정 적용
④ 승강로에 설치되는 영구적인 고정 사다리는
승강장 출입구 문턱에서부터 0.75m 이내에
위치되고 꼭대기 끝부분 근처에 쉽게 닿을 수
있는 1개 이상의 손잡이가 있어야 함
⑤ 사다리 강도 및 재질
a. 1,500N의 힘에 견뎌야 하며, 알루미늄 또는
부식방지 조치가 된 철 재질이어야 함
⑥ 사다리 손잡이 및 발판
a. 손잡이는 봉 모양이어야 하고, 폭 35mm
이하, 깊이 100mm 이하 이어야 함
b. 발판의 유효 폭은 280mm 이상, 발판의
간격은 250mm에서 300mm 사이의 간
격으로 균등하게 배치되어야 함
c. 발판의 모양은 원형 또는 4면 이상의 다각형
이어야 하며, 그 단면적의 폭은 280mm
이상이고 깊이는 25mm 이상 30mm 이하
이어야 함
d. 발판의 표면은 미끄러짐을 방지하는 특
별한 조치가 있어야 함
⑦ 사다리 위치
a. 카 및 이동케이블의 주행에 지장이 없어
야 함
① 카 내 자체탈출을 위한 발판간 최대 거리는
400mm 이내로 유지
② 비상구출문이 카 지붕 중앙에 설치된 경우', '(17년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('카 내부에서 자체탈출', '17.2.5.4', '', '③ 사다리의 길이는 승강장문 잠금장치까지
도달할 수 있어야 함
④ 카 내부에 미디어보드 설치 시 카 내부의
사다리 함의 개방에 지장이 없어야 함
6 m 휴대용 사다리가 설치된다면 승강로 벽에
설치되는 고정사다리의 설치는 제외할 수 있음', '(18년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('소방관 자체 탈출', '17.2.5.7', '', '다만 휴대용 사다리의 지지대는 카 상부에
있어야 함
[중앙감시반 호출장치 기준 적용]', '(24년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('소방운전 스위치', '17.2.8.2', '', '중앙감시실(방재실)에 설치된 호출장치에 대하여
작동상태 등의 검사를 실시하고 별도의 중앙
감시반이 없는 경우 제외 가능
① 소방운전 시 문닫힘 안전장치는 유효화
되어야 함
★ 연기나 열에 의해 영향을 받을 수 있는
비접촉식 문닫힘 안전장치의 경우
무효화 되어야 함
② 문의 휴지시간이 2분 초과의 경우
문닫힘 안전장치 작동은
a. 넛징 기능이 있는 경우: 무효화
b. 넛징 기능이 없는 경우: 유효화
③ 접촉식 문닫힘 안전장치 설치는 필수사항임', '(17년 제4차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('소방구조용 문닫힘 안전장치', '17.2.8.7', '', '★ 문 열림 버튼 작동 시 승강장문은 닫
히지 않아야 함
⑤ 멀티빔이 물체를 감지하지 않고 유효한
상태로 닫힌다면 감소된 동력 조건이 아닌
정상속도로 동작 가능
① 1단계 작동 시 자동 점등 및 조도 200lx
(단독 점등 시) 이상일 경우 적합 판정
② 제어반 조명(200lx 이상)이 별도로 점등될
경우 자동 조명 장치의 조도 미적용', '(24년 제3차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('2개의 출입구를 갖는 카', '17.2.8.9', '', '설치된다면 시정권고
② 제조사는 EN81-72(2020)를 설계에 우선
반영
[교체 설치하는 소방구조용 엘리베이터의
[비상발전기 시험]
① 소방구조용 → 소방구조용의 경우 아래의
시험 방법 중 택 1
a. 비상발전기 테스트', '(24년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('비상발전기', '17.2.9', '', 'b. 제조사의 자체시험성적서
c. 비상발전기 점검일지
② 타용도 → 소방구조용의 경우 아래의 시험
방법 중 택 1
a. 비상발전기 테스트
b. 제조사의 자체시험성적서', '(20년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('소방 활동 통화시스템', '17.2.12', '', '① 카와 승강장의 통화시스템은 카가 소방관
접근 지정층에 도착할 때까지 연결되어야 함
② 소방관의 소방 조작이 과도하게 지연되어
닫힌 경우에는 제외
[소방구조 및 피난용의 통화 연결 범위]
① 비상구출_피난공간(피트, 승강로 내부 작업
구역, 카 상부 등)에서 조작할 수 있는
비상통화장치
a. 피난공간에서 조작할 수 있는 비상통화
장치의 연결 범위는 건축물이나 시설물의
관리 인력이 상주하는 장소로 적용할 수 있음
b. 유지관리 시 상기 장소에 관리 인력이
상주하지 않는 경우에는 피난공간에서', '(17년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('피난호출 스위치', '17.3.5.2', '', '물 침투에 대한 보호조치 필요하므로 유리
또는 투명한 아크릴 등 보호조치가 되어야 함', '(24년 제2차)', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;
INSERT INTO std_item_overrides (title, ref, basis, conclusion, source, type_tag, category, updated_at, manually_edited) VALUES ('피난 활동 통화시스템', '17.3.7', '', 'a. 조작 버튼을 설치하는 경우, 피난호출 및', '이후', '', '', NOW(), false) ON CONFLICT (title) DO NOTHING;