# 배포 파이프라인

InvestLens 프론트엔드는 GitHub Actions를 단일 배포 주체로 사용해 Cloudflare Workers에 배포합니다. Pull Request에서는 동일한 품질 검증만 수행하고, `master` 반영 뒤에만 운영 배포와 스모크 테스트를 실행합니다.

## 자동 실행 흐름

```text
Pull Request → install → lint → typecheck → test → OpenNext build
master push  → install → lint → typecheck → test → OpenNext build → deploy → smoke test
```

- Node.js 22와 `package-lock.json`을 기준으로 재현 가능한 `npm ci`를 사용합니다.
- npm 다운로드 캐시와 `.next/cache`를 재사용합니다.
- OpenNext 빌드는 한 번만 실행하고, 검증된 `.open-next` 결과를 `deploy:built`로 업로드합니다.
- 같은 Pull Request의 이전 실행은 취소하지만 운영 배포는 중간에 취소하지 않습니다.
- 운영 확인은 `/login`이 정상 HTML을 반환할 때까지 제한적으로 재시도합니다.
- Dependabot이 npm 패키지와 GitHub Actions 업데이트를 매주 묶어서 제안합니다.

워크플로 파일은 [`.github/workflows/ci-deploy.yml`](../.github/workflows/ci-deploy.yml), 스모크 테스트는 [`scripts/smoke-deployment.mjs`](../scripts/smoke-deployment.mjs)에 있습니다.

## GitHub Actions 비밀값

저장소의 **Settings → Secrets and variables → Actions**에 다음 Repository secret이 필요합니다.

| 이름 | 용도 |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | 배포 대상 Cloudflare 계정 식별 |
| `CLOUDFLARE_API_TOKEN` | `investlens` Worker 배포 권한 |

API Token은 최소 권한 원칙에 따라 대상 계정의 Workers Scripts 편집 권한만 부여합니다. 비밀값은 워크플로 전체가 아니라 배포 단계에만 전달되며 Pull Request 검증에는 노출되지 않습니다.

## 배포 운영 규칙

Cloudflare의 Git 저장소 자동 배포와 GitHub Actions 배포를 동시에 활성화하면 같은 커밋이 중복 배포될 수 있습니다. 이 저장소에서는 GitHub Actions만 자동 배포 주체로 사용하고 Cloudflare Workers Builds의 자동 배포는 비활성화합니다.

수동 재배포는 GitHub 저장소의 **Actions → Validate and deploy → Run workflow**에서 `master`를 선택합니다. 로컬 긴급 배포가 필요한 경우에만 다음 명령을 사용합니다.

```bash
npm run deploy
```

운영 스모크 테스트만 다시 실행할 수 있습니다.

```bash
npm run smoke:production
```

배포 실패 시 GitHub Actions 로그에서 실패 단계를 확인합니다. 검증 단계가 실패한 커밋은 배포되지 않으며, 배포 뒤 스모크 테스트가 실패하면 Cloudflare Workers의 이전 정상 버전으로 롤백한 뒤 원인을 수정합니다.
