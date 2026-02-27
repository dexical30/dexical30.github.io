## 소개

이 저장소는 오픈 소스 프로젝트인  
[`timlrx/tailwind-nextjs-starter-blog`](https://github.com/timlrx/tailwind-nextjs-starter-blog)를 기반으로
커스터마이징한 **개인 블로그/노트용 Next.js + Tailwind CSS 프로젝트**입니다.

블로그/문서 원본은 Obsidian에서 작성하고, 이 레포의 `data` 폴더와 Obsidian 폴더를
심볼릭 링크(`ln -s`)로 연결해 관리합니다.

원본 템플릿의 라이선스는 MIT이며, 이 레포 역시 MIT 라이선스를 따릅니다.

---

## 요구 사항

- Node.js 20 이상 (LTS 권장)
- Yarn (또는 호환되는 패키지 매니저)
- Git

---

## 설치

처음 클론한 후 의존성을 설치합니다.

```bash
yarn install
```

또는

```bash
yarn
```

---

## Obsidian 연동 (data 폴더 심볼릭 링크)

이 프로젝트의 콘텐츠(MDX, 프로젝트 데이터 등)는 Obsidian 폴더를 그대로 재사용하기 위해  
**레포의 `data` 디렉터리를 Obsidian 안의 폴더에 심볼릭 링크로 연결**해서 사용합니다.

1. Obsidian에서 사용 중인 저장소(vault) 또는 폴더 경로를 확인합니다. 예시:
   - `/Users/USER/Obsidian/MyVault/blog-data`

2. 현재 레포 루트(예: `dexical30.github.io`)에서, `data` 디렉터리를 Obsidian 폴더와 연결합니다.
   이미 `data` 폴더가 있다면 필요에 따라 백업/삭제 후 진행하세요.

   ```bash
   # 레포 루트에서 실행
   rm -rf ./data  # 기존 data 가 필요 없다면 삭제 (주의!)
   ln -s "/Users/USER/Obsidian/MyVault/blog-data" "./data"
   ```

3. `ls -l`로 링크가 제대로 연결되었는지 확인합니다.

   ```bash
   ls -l ./data
   ```

4. Obsidian에서 작성/수정한 문서는 곧바로 이 레포의 `data` 아래에 반영되며,  
   Next.js 개발 서버를 통해 미리볼 수 있습니다.

> **주의**
>
> - 위 경로(`/Users/USER/Obsidian/MyVault/blog-data`)는 예시이므로 본인 환경에 맞게 수정해야 합니다.
> - Obsidian 폴더 구조에 맞춰 `data/blog`, `data/authors` 등이 들어 있도록 구성하면
>   기존 Contentlayer 설정을 그대로 활용할 수 있습니다.

---

## 로컬 실행 (Development)

개발 서버를 실행합니다.

```bash
yarn dev
```

브라우저에서 `http://localhost:3000`에 접속하면 사이트를 확인할 수 있습니다.

콘텐츠/레이아웃 수정은 다음 위치에서 주로 이루어집니다.

- `data/` : 블로그 글, 프로젝트 데이터, 메타데이터 (Obsidian과 연결된 폴더)
- `app/` : 페이지 및 레이아웃 (Next.js App Router)
- `components/` : 공통 UI 컴포넌트

파일을 수정하면 Hot Reload를 통해 브라우저가 자동으로 갱신됩니다.

---

## 프로덕션 빌드

정적 빌드를 생성하려면 다음 명령을 사용합니다.

```bash
EXPORT=1 UNOPTIMIZED=1 yarn build
```

기본 설정에서는 `out` 디렉터리에 정적 파일이 생성됩니다.

---

## GitHub Pages 배포

이 레포는 **GitHub Pages**에 배포할 수 있도록 설정되어 있습니다.

- GitHub Actions 워크플로우: `.github/workflows/pages.yml`
- 보조 배포 스크립트: `scripts/deploy-gh-pages.sh`

### 1. GitHub Pages 설정

1. GitHub 리포지토리에서 `Settings > Pages > Build and deployment > Source`로 이동합니다.
2. Source를 **“GitHub Actions”**로 설정합니다.

### 2. 로컬에서 빌드 및 gh-pages 브랜치로 푸시

다음 스크립트가 이 과정을 자동으로 수행합니다.

```bash
./scripts/deploy-gh-pages.sh
```

이 스크립트는:

- `yarn install`로 의존성을 설치하고
- `EXPORT=1`, `UNOPTIMIZED=1`, `BASE_PATH` 환경변수로 정적 빌드를 수행한 뒤
- `out` 디렉터리 내용을 `gh-pages` 브랜치로 force-push 합니다.

### 3. GitHub Actions 를 통한 최종 배포

`gh-pages` 브랜치가 업데이트되면 `.github/workflows/pages.yml`이 자동 실행됩니다.

- `gh-pages` 브랜치를 체크아웃
- 정적 파일을 GitHub Pages용 artifact로 업로드
- `actions/deploy-pages`를 사용해 GitHub Pages에 최종 배포

요약하면, 배포 플로우는 다음과 같습니다.

- **로컬**: `./scripts/deploy-gh-pages.sh` → `gh-pages` 브랜치 업데이트
- **GitHub Actions**: `.github/workflows/pages.yml` → GitHub Pages에 반영
