-- 에스컬레이터 부속서 Ⅲ·Ⅴ 연혁 행 신규 등록 + 연혁집 v2.0 그림 첨부 (묶음 ③)
-- 전제: client/public/revision-figures/esc_annex*.png 배포 완료. 같은 조문·종류·시행일·첫 줄이 이미 있으면 건너뜁니다.
\set ON_ERROR_STOP on
BEGIN;

INSERT INTO inspection_item_revisions (item_id, equipment_type, description, effective_date, expiry_date, introduction_type, attachments, attachments_text, source)
SELECT '부속서 Ⅲ', '에스컬레이터', $q$부속서 Ⅲ
고장안전회로 초안 작성 및 평가
[ 그림 Ⅲ.1 – 고장안전회로의 초안 작성과 평가를 위한 흐름도 ]$q$, '2022-03-02', NULL, 'current', $q$[{"kind": "figure", "table": null, "images": ["esc_annex3_failsafe_flow_cur.png"], "search": "그림 Ⅲ.1 고장안전회로의 초안 작성과 평가를 위한 흐름도 고장 1 고장 2 고장 3 고장 4 위험한가 상태 변화가 멈춤 허용 가능 허용 불가능 5.12.2.6.2.4", "caption": "그림 Ⅲ.1 – 고장안전회로의 초안 작성과 평가를 위한 흐름도"}]$q$::jsonb, $q$그림 Ⅲ.1 고장안전회로의 초안 작성과 평가를 위한 흐름도 고장 1 고장 2 고장 3 고장 4 위험한가 상태 변화가 멈춤 허용 가능 허용 불가능 5.12.2.6.2.4$q$, '연혁집 v2.0 p.132'
WHERE NOT EXISTS (SELECT 1 FROM inspection_item_revisions WHERE item_id='부속서 Ⅲ' AND equipment_type='에스컬레이터' AND introduction_type='current' AND effective_date='2022-03-02' AND split_part(description, E'\n', 1) = $q$부속서 Ⅲ$q$);

INSERT INTO inspection_item_revisions (item_id, equipment_type, description, effective_date, expiry_date, introduction_type, attachments, attachments_text, source)
SELECT '부속서 Ⅲ', '에스컬레이터', $q$부속서 Ⅱ
안전회로 초안 작성 및 평가
[ 그림 Ⅱ.1 - 안전회로의 초안 작성과 평가를 위한 흐름도 ]$q$, '2013-09-15', '2022-03-01', 'old', $q$[{"kind": "figure", "table": null, "images": ["esc_annex2_safety_flow_2013.png"], "search": "그림 Ⅱ.1 안전회로의 초안 작성과 평가를 위한 흐름도 고장 1 고장 2 고장 3 고장 4 위험한가 상태 변화가 멈춤 허용 가능 허용 불가능 5.12.1.2.3.4", "caption": "그림 Ⅱ.1 - 안전회로의 초안 작성과 평가를 위한 흐름도 (2013년 9월 15일 이후의 건축허가분부터 적용)"}]$q$::jsonb, $q$그림 Ⅱ.1 안전회로의 초안 작성과 평가를 위한 흐름도 고장 1 고장 2 고장 3 고장 4 위험한가 상태 변화가 멈춤 허용 가능 허용 불가능 5.12.1.2.3.4$q$, '연혁집 v2.0 p.133'
WHERE NOT EXISTS (SELECT 1 FROM inspection_item_revisions WHERE item_id='부속서 Ⅲ' AND equipment_type='에스컬레이터' AND introduction_type='old' AND effective_date='2013-09-15' AND split_part(description, E'\n', 1) = $q$부속서 Ⅱ$q$);

INSERT INTO inspection_item_revisions (item_id, equipment_type, description, effective_date, expiry_date, introduction_type, attachments, attachments_text, source)
SELECT '부속서 Ⅲ', '에스컬레이터', $q$부속서 Ⅲ (추가 종전 기준)
부속서 Ⅲ
스텝 및 팔레트에 대한 가능한 동적 비틀림 시험
Ⅲ.1 일반사항
다음 예시는 5.3.3.3.1.2와 5.3.2.3.2에서 요구되는 것과 같은 동적 비틀림 시험을 실행하는 실제 방법을 예를 들어 설명한 것이다.
Ⅲ.2 비틀림 시험 1
스텝ㆍ팔레트는 허용되는 최대 경사(경사진 받침)에서 롤러(회전하지 않는), 축 또는 스터브 샤프트(있는 경우)를 포함하는 모두를 시험하게 된다. 그것은 스텝ㆍ팔레트 체인을 통해 지지되고 고정된다. 변형으로 인한 롤러의 영향을 최소화하기 위해서, 모든 스텝을 지지하는 롤러는 동일한 주요 치수로 된 강철 롤러로 교체된다. 게다가 지지용 트레일러 롤러는 가로축으로의 이동을 허용하는 지지 평판에서 낮은 마찰력으로 움직일 수 있다. 아래에 기술된 지지가 안 된 자유로운 트레일러 롤러 반대편의 스텝ㆍ팔레트의 상승을 방지하기 위해, 그것은 틈새가 0.2 mm가 안 되는 지지하는 지역에 평행한 고정 클램프를 가진다. (시험 장비에 대해 그림 Ⅲ.1 참조) 스텝/팔레트의 비틀림이 가능하게 하기 위해, 하나의 트레일러 롤러는 지지 되지 않거나 빼버린다. 게다가 이 트레일러 롤러의 중심은 0에서 -4 mm까지 아래쪽으로의 이동이 가능하다. 이 호 안에서의 움직임이다. 이 4 mm의 이동은 트레일러 롤러에서 스텝ㆍ팔레트 체인 롤러 중심거리까지의 거리 400 mm와 연관된다. 이 비율은 400 mm길이가 변화될 때에도 유지된다. 동적 하중은 각각 5.3.3.2.1과 5.3.3.2.3에 기술된 것처럼 지지되지 않거나 빠진 트레일러 롤러로 휨이 나타나는 발판 표면의 중심에서 정렬된 강판의 발판 표면에 수직으로 적용된다.
Key
1 강철 롤러 포함
2 롤러 없이
3 지지 지역과 평행한 고정 클램프
F 동적 하중
비고 시험 장비의 제작은 그림과 일치할 필요가 없다. 오직 요건을 그림으로 설명하는 것을 돕는다.
[ 그림 Ⅲ.1 - 스텝과 팔레트의 비틀림 시험 (1) - 시험 장비 ]
Ⅲ.3 비틀림 시험 2
스텝ㆍ팔레트 조립품은 아래의 그림 Ⅲ.2(이 시험에서 휠은 고정되지 않음)에 보이는 것처럼 그것의 체인 축과 트레일러 휠 축의 하나의 끝에 의해 설치된다. 체인 축은 스텝ㆍ팔레트 체인에 의해 보통 사용되는 위치에서 지지 된다. 스텝ㆍ팔레트는 체인 축 주위 회전에 대해 자유롭다, 그러나 체인 축을 따라 미끄러지는 것은 자유롭지 않다. 트레일러 휠 축의 ‘자유로운’ 끝은 볼 조인트에 의해 가동장치로 연결된다. 가동장치의 낮은 끝은 고정된 지지물로 볼 조인트 된다. 그래서 그 트레일러 휠 축의 '자유로운’끝이 어느 부분으로도 이동할 수 있다. 가동장치의 축은 양쪽 트레일러의 축과 체인 휠 축을 둘러싼 평판에 수직이다. 재-기동과 가동 연동장치는 트레일러 휠에 맞는 베어링에 동일한 디자인의 볼베어링을 사용하여 만든다. 이 시험 조립을 위해 표준 트레일러 휠 고정이 사용되고, 규정된 토크 값이 적용된다. 기동 장치는 각 목적지 순환적 선형 이동 을 위해 각 방향으로 적용되고, 나타난다. 최대 이동은 스텝ㆍ팔레트의 정상 ‘0’ 위치에서 위와 아래로 2mm이다.(같은 평판에서 축 체인과 트레일러 축을 포함한 지점으로 등) 이 ± 2 mm 이동은 400 mm의 트레일러 롤러에서 스텝ㆍ팔레트 체인 롤러 중심거리와 연관된다. 이 비율은 400 mm 길이가 변화될 때에도 유지된다.
Key
1 피봇
2 링크(스텝의 한 쪽만)
F 동적 하중
[ 그림 Ⅲ.2 - 스텝ㆍ팔레트의 비틀림 시험 (2) - 시험 장비 ]$q$, '2013-09-15', '2022-03-01', 'old', $q$[{"kind": "figure", "table": null, "images": ["esc_annex3_twist1_2013.png"], "search": "그림 Ⅲ.1 스텝과 팔레트의 비틀림 시험 시험 장비 강철 롤러 포함 롤러 없이 지지 지역과 평행한 고정 클램프 동적 하중 F 동적 비틀림 시험", "caption": "그림 Ⅲ.1 - 스텝과 팔레트의 비틀림 시험 (1) - 시험 장비"}, {"kind": "figure", "table": null, "images": ["esc_annex3_twist2_2013.png"], "search": "그림 Ⅲ.2 스텝 팔레트의 비틀림 시험 시험 장비 피봇 링크 스텝의 한 쪽만 동적 하중 F 30° 동적 비틀림 시험", "caption": "그림 Ⅲ.2 - 스텝ㆍ팔레트의 비틀림 시험 (2) - 시험 장비"}]$q$::jsonb, $q$그림 Ⅲ.1 스텝과 팔레트의 비틀림 시험 시험 장비 강철 롤러 포함 롤러 없이 지지 지역과 평행한 고정 클램프 동적 하중 F 동적 비틀림 시험
그림 Ⅲ.2 스텝 팔레트의 비틀림 시험 시험 장비 피봇 링크 스텝의 한 쪽만 동적 하중 F 30° 동적 비틀림 시험$q$, '연혁집 v2.0 p.143~144'
WHERE NOT EXISTS (SELECT 1 FROM inspection_item_revisions WHERE item_id='부속서 Ⅲ' AND equipment_type='에스컬레이터' AND introduction_type='old' AND effective_date='2013-09-15' AND split_part(description, E'\n', 1) = $q$부속서 Ⅲ (추가 종전 기준)$q$);

INSERT INTO inspection_item_revisions (item_id, equipment_type, description, effective_date, expiry_date, introduction_type, attachments, attachments_text, source)
SELECT '부속서 Ⅴ', '에스컬레이터', $q$부속서 Ⅴ
에스컬레이터 및 무빙워크 이용자를 위한 안전표지
안전 표지의 설계는 KS S ISO 3864-1 및 KS S ISO 3864-3에 따라야 한다. 표지의 최소 지름은 80 ㎜이다.
[그림 Ⅴ.1 – 강제 행동 표지 "애완동물은 안고 이용하세요"]
[그림 Ⅴ.2 – 금지 표지 "유모차는 이용하지 마세요"]$q$, '2019-03-28', NULL, 'current', $q$[{"kind": "figure", "table": null, "images": ["esc_annex5_fig1_cur.png"], "search": "그림 Ⅴ.1 강제 행동 표지 애완동물은 안고 이용하세요 안전표지 KS S ISO 3864", "caption": "그림 Ⅴ.1 – 강제 행동 표지 \"애완동물은 안고 이용하세요\""}, {"kind": "figure", "table": null, "images": ["esc_annex5_fig2_cur.png"], "search": "그림 Ⅴ.2 금지 표지 유모차는 이용하지 마세요 안전표지 KS S ISO 3864", "caption": "그림 Ⅴ.2 – 금지 표지 \"유모차는 이용하지 마세요\""}]$q$::jsonb, $q$그림 Ⅴ.1 강제 행동 표지 애완동물은 안고 이용하세요 안전표지 KS S ISO 3864
그림 Ⅴ.2 금지 표지 유모차는 이용하지 마세요 안전표지 KS S ISO 3864$q$, '연혁집 v2.0 p.135'
WHERE NOT EXISTS (SELECT 1 FROM inspection_item_revisions WHERE item_id='부속서 Ⅴ' AND equipment_type='에스컬레이터' AND introduction_type='current' AND effective_date='2019-03-28' AND split_part(description, E'\n', 1) = $q$부속서 Ⅴ$q$);

-- 기대 결과: INSERT 4개, 각각 INSERT 0 1
COMMIT;
SELECT id, item_id, introduction_type, effective_date, expiry_date, left(description,40) AS d, jsonb_array_length(attachments) AS n FROM inspection_item_revisions WHERE equipment_type='에스컬레이터' AND item_id IN ('부속서 Ⅲ','부속서 Ⅴ') ORDER BY item_id, id;
