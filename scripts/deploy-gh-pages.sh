#!/usr/bin/env bash

set -euo pipefail

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "⚠️  현재 브랜치가 'main'이 아닙니다. 현재 브랜치: $CURRENT_BRANCH"
  echo "   gh-pages 배포는 main 브랜치 기준으로 수행하는 것이 일반적입니다."
  read -p "계속 진행할까요? (y/N): " CONTINUE
  if [[ "${CONTINUE:-N}" != "y" && "${CONTINUE:-N}" != "Y" ]]; then
    echo "배포를 중단합니다."
    exit 1
  fi
fi

echo "1) 의존성 설치 (yarn)"
yarn install --immutable

echo "2) 정적 빌드 (out 디렉터리 생성)"
export EXPORT=1
export UNOPTIMIZED=1
export BASE_PATH=""  # GitHub Pages 루트에 배포하는 경우 비워둡니다.
yarn build

echo "3) gh-pages 브랜치에 out 디렉터리만 force-push"
npx --yes gh-pages -d out -b gh-pages -m "Deploy to gh-pages" --dotfiles

echo "✅ gh-pages 배포가 완료되었습니다."

