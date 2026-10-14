# 검사통합검색앱 (Elevator Assistant) — 프로젝트 컨텍스트

Cowork 프로젝트 생성 시 이 내용을 "커스텀 지침(instructions)"에 붙여넣으세요.
새 세션이 이걸 먼저 읽으면 아키텍처를 재설명할 필요가 없습니다.

## 기본 정보
- 로컬 경로: `C:\Projects\HTMLConverter`
- GitHub: `github.com/junho9109/Elevator-Assistant.git` (branch: `main`)
- 배포: Railway (`elevator-assistant-production.up.railway.app`)
- DB: Neon Postgres (pooler 엔드포인트 사용 중)
- 스택: React + TypeScript(Vite) 프론트, Express 백엔드, Drizzle ORM

## 반드시 지켜야 할 표준 작업 규칙
1. **`.git/index.lock` 문제**: Claude는 이 파일을 직접 삭제할 수 없음. git 명령 전에 항상 사용자가 WSL에서 `rm -f .git/index.lock` 실행해야 함.
2. **`git add -A` 절대 금지**: 저장소에 무관한 진행 중 파일이 많음(manual_input_*.sql 등). 항상 변경된 파일만 명시적으로 `git add`.
3. **SQL은 항상 `public.` 스키마 명시**: `public.inspection_base_items` 처럼. Neon pooler가 search_path를 세션에 안정적으로 반영하지 않는 이슈가 있었음(이미 `server/db.ts`의 `pool.on('connect', ...)` 훅으로 근본 수정 완료).
4. **DB 데이터 삭제는 항상 신중히**: `inspection_base_items`는 검사기준 페이지와 검사가이드 페이지(judgment.tsx)가 컬럼을 나눠서 같이 사용 중. 삭제 전 반드시 전체 코드베이스에서 참조 여부 확인.
5. **DB 백업**: `pg_dump`는 버전 불일치로 실패하므로 `psql -c "\copy ... TO ... CSV"` 사용.

## 데이터 구조 (별표22 검사기준)
- `client/src/data/별표22_parsed.json` — 별표22 원문 데이터. 키: 조항번호, 값: `{text, title, source}`.
- `client/src/data/별표22_유효항목.json` — 위 파일의 키 목록(allowlist). JSON 키 추가/삭제 시 반드시 재생성.
- DB 테이블 `inspection_base_items` — 실제 서비스에서 읽는 소스. JSON은 로컬 편집용, 최종적으로 SQL UPDATE/INSERT로 DB에 반영.
- **별표22(2022) 표시 규칙**: 날짜 태그가 없거나 `<2022년 3월 2일...>` 태그인 항목만 표시. 다른 특정 날짜 태그가 있는 항목은 종전기준이라 제외. 단, 대체할 무태그 버전이 PDF에 없는 경우(14.2, 14.9, 15.2.6 등)는 태그를 본문에 그대로 표시.
- `inspection_item_revisions` 테이블은 **완전히 별개** — judgment.tsx의 "조문 연혁" 기능이 사용. `inspection_base_items.text`와 혼동하지 말 것.

## 참조 자료 (검증용)
- "안전기준 연혁집" PDF가 원본 기준. `pdf_clauses.json`(974개 항목 추출본)과 `yeonhyeokjip_full.txt`(전체 텍스트)를 세션 outputs 폴더에서 재생성해 대조 작업에 사용.

## 진행 상황 (2026-08-10 기준)
- ✅ Neon search_path 프로덕션 장애 수정 완료, 배포됨.
- ✅ 기술자료 표준화 항목 삭제 기능, 검사기준 관리자 모달 제목 수정 기능 추가 완료.
- ✅ 검사기준 페이지 스크롤 분리, 트리 무한 중첩, 좌측 목록 줄바꿈 버그 수정 완료.
- ✅ "표16 체크마크(○)" 오염 70개 항목 전수 수정 완료 + 17.3.5.1~17.3.5.9 누락 하위조항 9개 신규 추가 완료. `fix_circle_batch.sql`로 DB 반영 완료(에러 없음), git 커밋/푸시 대기 중이었음(최근에 진행 지시함 — 완료 여부 확인 필요).
- ⏳ **미완료로 알려진 작업**: `flagged_sorted.json` 기반 110개 항목 PDF 대조 리뷰 — circle-fix 작업 전에 15~20개 정도만 처리하고 중단됨. 재개 여부 확인 필요.

## 다음 세션 시작 시 체크리스트
1. `git log -5`로 마지막 커밋이 실제 반영됐는지 확인.
2. `git status`로 미커밋 변경사항 있는지 확인.
3. 위 "미완료 작업"에서 무엇을 이어갈지 사용자에게 확인.
