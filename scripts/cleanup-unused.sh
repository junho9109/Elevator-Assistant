#!/usr/bin/env bash
# 미사용 UI 컴포넌트/의존성 정리 — 안전장치 포함.
# 사용법(WSL): cd /mnt/c/Projects/HTMLConverter && bash scripts/cleanup-unused.sh
# 어느 단계든 실패하면 변경을 전부 되돌리고(git checkout/reset) 중단한다.
set -u
cd "$(dirname "$0")/.."

UI_UNUSED="accordion alert alert-dialog aspect-ratio avatar breadcrumb button-group calendar carousel chart checkbox collapsible command context-menu drawer dropdown-menu empty field form hover-card input-group input-otp item kbd menubar navigation-menu pagination popover progress radio-group resizable separator sheet sidebar skeleton slider sonner spinner switch table tabs toggle toggle-group"

PKGS="expo-constants expo-file-system expo-splash-screen expo-status-bar expo-updates @react-navigation/native @react-navigation/native-stack react-native-safe-area-context react-native-screens passport passport-local express-session connect-pg-simple memorystore sqlite3 framer-motion ws date-fns zod-validation-error @hookform/resolvers react-hook-form @neondatabase/serverless @jridgewell/trace-mapping @replit/vite-plugin-cartographer @replit/vite-plugin-dev-banner cmdk vaul input-otp embla-carousel-react react-day-picker react-resizable-panels recharts sonner next-themes @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toggle @radix-ui/react-toggle-group @types/bun @types/passport @types/passport-local @types/express-session @types/connect-pg-simple @types/ws"

rollback() {
  echo "!! 실패 — 변경을 되돌립니다"
  git reset -q HEAD -- client package.json package-lock.json 2>/dev/null
  git checkout -- client/src/components/ui client/src/hooks/use-mobile.tsx package.json package-lock.json 2>/dev/null
  npm install --silent 2>/dev/null
  echo "되돌렸습니다. (필요하면: git status 로 확인)"
  exit 1
}

echo "[1/5] 기준선: 정리 전 빌드가 되는지 확인"
npm run build >/tmp/build_before.log 2>&1 || { echo "정리 전 빌드부터 실패합니다. 로그: /tmp/build_before.log"; exit 1; }

echo "[2/5] 미사용 UI 컴포넌트 삭제"
for n in $UI_UNUSED; do git rm -q "client/src/components/ui/$n.tsx" || rollback; done
git rm -q client/src/hooks/use-mobile.tsx || rollback

echo "[3/5] 미사용 패키지 제거 (package-lock.json도 함께 갱신)"
npm uninstall $PKGS >/tmp/uninstall.log 2>&1 || { tail -20 /tmp/uninstall.log; rollback; }

echo "[4/5] 정리 후 빌드"
npm run build >/tmp/build_after.log 2>&1 || { tail -30 /tmp/build_after.log; rollback; }

echo "[5/5] tsc 오류 수 비교(기준선 오류 외 새 오류가 없어야 함)"
npx tsc --noEmit 2>&1 | grep -v -E "TS2802|TS1252|\(2765," | grep -E "error TS" | head -20
echo "(위에 아무것도 안 나오면 정상)"
echo "완료. 이어서: npx vitest run  →  모두 통과하면 git commit/push"
