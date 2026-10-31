-- 표준화 등록: 「고시 개정에 따른 검사업무 전산 적용 방법 안내」 (신규 현장 2026.09.28. 접수분부터)
-- 첨부: 원본 PDF 1건 — 파일은 client/public/std-files/jeonsan26.pdf 커밋 필요

-- 1) 사전 확인 (0건이어야 함)
SELECT id, title FROM std_item_overrides WHERE title = $q$고시 개정에 따른 검사업무 전산 적용 방법 안내$q$;

-- 2) 등록 (중복 시 0건 삽입)
INSERT INTO std_item_overrides
  (title, ref, basis, conclusion, source, type_tag, category, inspection_year, figures, updated_at, manually_edited)
SELECT
  $q$고시 개정에 따른 검사업무 전산 적용 방법 안내$q$,
  $q$$q$,
  $q$$q$,
  $q$□ 설치검사 시 검사기준 적용일

○ (개정) 착공신고필증 교부일로 검사기준적용일 반영
 - 건축과 승강기를 분리하여 적용, 건축 사항은 건축허가일로 승강기 관련
   검사 적용은 착공신고필증(공사계약서 등) 교부일로 적용하기 위함

○ (적용) 신규 현장 (2026.09.28. 접수분부터 적용)
 - 주의사항: 착공신고필증 교부서 제출 및 입력은 필수
<table style="width:100%;border-collapse:collapse;font-size:12px;margin:6px 0;"><tr><th colspan="3" style="border:1px solid #9ca3af;padding:4px 6px;vertical-align:middle;background:#f3f4f6;">구분</th><th  style="border:1px solid #9ca3af;padding:4px 6px;vertical-align:middle;background:#f3f4f6;">입력 방법</th></tr><tr><td  style="border:1px solid #9ca3af;padding:4px 6px;vertical-align:middle;">(건축)</td><td colspan="2" style="border:1px solid #9ca3af;padding:4px 6px;vertical-align:middle;">건축허가일</td><td  style="border:1px solid #9ca3af;padding:4px 6px;vertical-align:middle;">건축허가일 입력</td></tr><tr><td rowspan="3" style="border:1px solid #9ca3af;padding:4px 6px;vertical-align:middle;">(승강기)</td><td rowspan="2" style="border:1px solid #9ca3af;padding:4px 6px;vertical-align:middle;">착공신고필증<br>교부일<br>(필수입력)</td><td  style="border:1px solid #9ca3af;padding:4px 6px;vertical-align:middle;">착공신고필증 교부 (유)</td><td  style="border:1px solid #9ca3af;padding:4px 6px;vertical-align:middle;">착공신고필증일 교부일 입력</td></tr><tr><td  style="border:1px solid #9ca3af;padding:4px 6px;vertical-align:middle;">착공신고필증 교부 (무)</td><td  style="border:1px solid #9ca3af;padding:4px 6px;vertical-align:middle;">공사계약서 등 적용 일자 입력</td></tr><tr><td colspan="2" style="border:1px solid #9ca3af;padding:4px 6px;vertical-align:middle;">검사기준적용일</td><td  style="border:1px solid #9ca3af;padding:4px 6px;vertical-align:middle;">착공신고필증 교부일 또는 공사계약서 등 적용 일자</td></tr></table>
※ 착공신고필증 미발급 현장: 건축물의 증축 또는 대수선(공사계약서),
  학교현장 (학교시설 건축축조승인서), 지제체(공용건축물 건축협의서) 등
 예시1) 신규 학교현장 : 교육지원청 발급 서류 “학교시설 건축축조승인서
      (일자 2026.01.01.)” 외 추가 서류 없음
   → 입력: 건축허가일, 착공신고필증 교부일, 검사기준적용일 통일 입력
      (학교시설 건축축조승인서의 승인일로 통일 2026.01.01. 입력)
 예시2) 교체 설치현장 : 기존 건축물로 기존 건축허가일(2024.01.01.) 착공신고필증
      불가, 공사계약서(2026.01.01.) 첨부
   → 입력: 건축허가일(기존 건축허가일 2024.01.01. 입력), 착공신고필증
      교부일 및 검사기준적용일(공사계약서 계약일로 통일, 2026.01.01. 입력)$q$,
  $q$고시 개정에 따른 검사업무 전산 적용 방법 안내$q$,
  $q$검사방법$q$,
  $q$기타$q$,
  '2026-09-28',
  $q$[{"src": "/std-files/jeonsan26.pdf", "caption": "원본 PDF (고시 개정에 따른 검사업무 전산 적용 방법 안내)", "kind": "file"}]$q$,
  NOW(),
  true
WHERE NOT EXISTS (SELECT 1 FROM std_item_overrides WHERE title = $q$고시 개정에 따른 검사업무 전산 적용 방법 안내$q$);

-- 3) 사후 확인 (1건, figures에 원본 PDF 1건)
SELECT id, title, category, type_tag, inspection_year, length(conclusion) AS concl_len, figures
FROM std_item_overrides WHERE title = $q$고시 개정에 따른 검사업무 전산 적용 방법 안내$q$;
