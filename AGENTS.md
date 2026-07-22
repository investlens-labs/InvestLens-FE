# InvestLens Codex Team Guide

이 문서는 이 저장소에서 동작하는 Codex와 OMX 에이전트의 최상위 실행 규칙입니다. 목표는 필요한 경우에만 병렬화하고, 파일 충돌 없이 구현한 뒤 검증·커밋·푸시까지 자동으로 완료하는 것입니다.

## 1. 기본 원칙

- 명확하고 되돌릴 수 있는 로컬 작업은 확인을 요청하지 않고 끝까지 수행합니다.
- 작은 작업은 리더가 직접 처리합니다. 에이전트 수를 늘리는 것 자체를 목표로 삼지 않습니다.
- 병렬 작업은 서로 독립적인 조사, 구현, 테스트 또는 리뷰 작업에만 사용합니다.
- 동시에 파일을 수정하는 에이전트는 최대 2명으로 제한하고 파일 소유권을 먼저 분리합니다.
- 리더는 요구사항 해석, 작업 분배, 결과 통합, 최종 검증, 커밋과 푸시를 소유합니다.
- Swagger/OpenAPI와 실제 저장소 코드를 추측보다 우선합니다.
- 사용자 변경사항을 덮어쓰거나 관련 없는 파일을 정리하지 않습니다.

## 2. 프로젝트 기준 정보

- 프레임워크: Next.js 16 App Router, React 19, TypeScript
- 스타일: Tailwind CSS 4
- 서버 상태: TanStack Query 5
- 테스트: Vitest, React Testing Library
- 배포: OpenNext + Cloudflare Workers
- 백엔드 Swagger: `https://investlens-be.onrender.com/swagger-ui.html`
- OpenAPI JSON: `https://investlens-be.onrender.com/v3/api-docs`
- 브라우저 API 진입점: `/api/backend`
- 서버 API 기본 주소: `https://investlens-be.onrender.com/api/v1`
- Next.js 프로젝트이므로 Vite 전용 `VITE_API_BASE_URL`을 추가하지 않습니다.
- 서버 업스트림은 `INVESTLENS_API_BASE_URL`, 브라우저 공개 진입점은 `NEXT_PUBLIC_API_BASE_URL`을 사용합니다.

## 3. 작업 규모별 팀 구성

### 단순 작업

대상: 문구, 한 컴포넌트 스타일, 작은 오류 수정, 문서 수정.

- 리더 단독 실행
- 변경 파일에 맞는 표적 테스트 후 `lint`, `typecheck`
- 병렬 에이전트를 만들지 않음

### 중간 작업

대상: 한 화면 기능, API 하나 추가, 재현 가능한 버그, 제한된 리팩터링.

- `explore` 또는 `debugger`: 읽기 전용 원인·영향 범위 조사
- 리더 또는 `executor`/`designer`: 구현
- `verifier`: 구현 완료 후 독립 검증

조사와 구현이 명확히 독립적일 때만 동시에 실행합니다.

### 복합 작업

대상: 여러 화면, API 계약 변경, 인증/상태관리 변경, 배포 변경, 대규모 기능.

최대 동시 구성은 리더 포함 4명입니다.

1. `explore` 또는 `researcher`: 저장소 구조 또는 공식 명세 조사
2. `executor` 또는 `designer`: 기능/API 또는 UI 구현
3. `test-engineer`: 회귀 테스트와 경계 조건 구현
4. 리더: 통합 후 `verifier` 역할로 전체 품질 게이트 수행

`verifier`가 별도 에이전트로 필요하면 먼저 끝난 조사 에이전트 슬롯을 재사용합니다.

## 4. 역할 선택 기준

| 필요 | 역할 | 책임 |
|---|---|---|
| 파일·심볼·데이터 흐름 파악 | `explore` | 읽기 전용 저장소 조사 |
| Swagger·공식 문서 확인 | `researcher` | 외부 공식 근거 수집 |
| 원인이 불명확한 실패 | `debugger` | 재현, 원인 분리, 최소 수정안 |
| 일반 기능·API 구현 | `executor` | 타입, 서비스, 상태, 화면 구현 |
| 시각·반응형·접근성 중심 작업 | `designer` | 기존 디자인 시스템 기반 UI 구현 |
| 테스트 전략과 회귀 방지 | `test-engineer` | 실패 테스트 우선, 경계 조건 검증 |
| 완료 주장 검증 | `verifier` | 변경과 명령을 독립적으로 확인 |
| 종합 코드 리뷰 | `code-reviewer` | 버그, 보안, 유지보수성 검토 |

한 에이전트가 인접 역할까지 무리하게 흡수하지 않도록 하며, 역할 경계가 바뀌면 리더에게 보고합니다.

## 5. 기본 파일 소유권

병렬 수정 전에 아래 경계를 사용합니다. 한 파일의 소유자는 항상 한 명입니다.

| 영역 | 기본 소유 역할 | 경로 |
|---|---|---|
| API·DTO·인증 | `executor` | `src/lib/api/**`, `src/lib/auth/**`, `src/app/api/**` |
| 페이지·도메인 UI | `designer` 또는 `executor` | `src/app/(app)/**`, `src/app/(auth)/**`, 도메인 컴포넌트 |
| 공통 훅·유틸 | `executor` | `src/hooks/**`, `src/lib/*.ts` |
| 테스트 | `test-engineer` | `src/**/*.test.*`, `src/test/**`, `vitest.config.mts` |
| 배포·도구 설정 | 리더 또는 `executor` | `package.json`, `next.config.ts`, `wrangler.jsonc`, `open-next.config.ts` |
| 문서 | 리더 또는 `writer` | `README.md`, `docs/**` |

`src/app/globals.css`, `src/components/ui/**`, `src/components/providers/**`, `src/components/layout/**`, `package*.json`과 배포 설정은 공유 hotspot이므로 리더만 최종 수정합니다. `src/lib/api/types.ts`, `src/lib/api/services.ts`, `src/lib/query-keys.ts`는 API 담당 단독 소유로 두고 UI 담당은 공개 인터페이스를 사용합니다. 테스트를 위해 제품 코드 변경이 필요하면 테스트 에이전트가 직접 고치지 않고 리더에게 원인과 권장 수정안을 전달합니다.

## 6. 구현 규칙

### API와 인증

- API 경로, 쿼리, DTO, enum은 OpenAPI 명세로 확인합니다.
- 인증 요청은 `Authorization: Bearer {accessToken}`을 유지합니다.
- 401 처리는 토큰과 인증 캐시를 제거하고 로그인으로 이동해야 합니다.
- GET에만 제한적 재시도를 허용하며 POST/DELETE 자동 재시도는 금지합니다.
- 한글 쿼리는 `URLSearchParams` 등 안전한 인코딩 방식을 사용합니다.
- mock 데이터나 프론트의 외부 시세 직접 호출을 추가하지 않습니다.

### UI와 접근성

- 기존 컴포넌트와 Tailwind 토큰을 먼저 재사용합니다.
- 라이트·다크 모드, 모바일 1열 전환, 키보드 포커스와 의미 있는 레이블을 유지합니다.
- 색상만으로 상태를 표현하지 않고 아이콘과 텍스트를 함께 제공합니다.
- 로딩, 오류, 빈 상태, 인증 만료 상태를 정상 화면과 동일한 수준으로 구현합니다.
- 불필요한 애니메이션이나 새 의존성을 추가하지 않습니다.

### 테스트

- 버그 수정은 가능하면 실패를 재현하는 회귀 테스트를 먼저 추가합니다.
- API 변경은 요청 경로, 파라미터, 인증 헤더, 오류 정책을 테스트합니다.
- UI 변경은 사용자에게 보이는 동작과 접근 가능한 이름을 테스트합니다.
- 구현 세부사항보다 공개 동작을 검증합니다.

## 7. 검증 순서

변경 범위에 맞는 가장 작은 검증부터 시작하고, 실패하면 수정 후 다시 실행합니다.

```bash
npm run test -- <관련 테스트 파일>
npm run lint
npm run typecheck
npm run test
npm run build
```

Cloudflare 또는 런타임 설정이 바뀌면 다음도 수행합니다.

```bash
npm run cf-typegen
npm run build:cloudflare
```

완료 보고 전에 최신 실행 결과를 직접 확인합니다. 실행할 수 없는 검증은 통과했다고 표현하지 않고 이유와 남은 위험을 명시합니다.

## 8. Issue 및 Pull Request 규칙

- 모든 코드, 문서, 설정 변경은 구현 전에 GitHub Issue를 생성하고 작업 범위와 완료 조건을 기록합니다.
- 긴급한 운영 장애 대응을 제외하면 `master`에서 직접 작업하거나 직접 푸시하지 않습니다.
- 브랜치는 `<type>/<issue-number>-<short-description>` 형식을 사용합니다. 예: `fix/42-news-score-filter`.
- 커밋과 Pull Request 본문에서 `#<issue-number>`를 참조해 변경 이력을 연결합니다.
- Pull Request에는 변경 내용, 검증 결과, 영향 범위와 롤백 방법을 기록합니다.
- CI의 lint, typecheck, test, build 검증이 모두 통과한 뒤에만 Pull Request를 병합합니다.
- 병합 후 연결된 Issue가 자동으로 닫혔는지 확인하고, 실패하면 완료 상태와 근거를 댓글로 남긴 뒤 닫습니다.
- 작은 작업은 하나의 Issue와 하나의 Pull Request로 끝내고, 범위가 커지면 독립적으로 검증 가능한 Issue로 분리합니다.

기본 흐름은 다음과 같습니다.

```text
Issue 생성 → 작업 브랜치 → 구현·검증 → 논리 커밋 → Pull Request → CI 통과 → 병합 → Issue 종료
```

## 9. Git 규칙

- 논리적으로 독립된 변경마다 작은 커밋을 생성합니다.
- 커밋 형식은 `<type> : <한국어 설명>`을 사용합니다.
- 허용 예시: `feat`, `fix`, `test`, `docs`, `refactor`, `style`, `chore`.
- 커밋 전 `git diff --check`와 관련 검증을 실행합니다.
- 사용자가 별도로 금지하지 않았다면 검증된 커밋을 작업 브랜치에 푸시하고 Pull Request를 생성합니다.
- rebase, reset, force push, 기존 커밋 수정은 명시적 요청 없이는 수행하지 않습니다.

## 10. 완료 조건

다음 항목을 모두 만족해야 작업을 완료로 보고합니다.

- 요청한 동작이 실제 코드에 구현됨
- 관련 로딩·오류·빈 상태와 접근성이 처리됨
- 변경 범위의 테스트와 정적 검사가 통과함
- 프로덕션 또는 Cloudflare 빌드가 필요한 경우 통과함
- 관련 없는 변경이나 충돌이 없음
- 작업 Issue, Pull Request, 커밋과 병합 결과가 확인됨
- 최종 보고에 Issue/PR 링크, 변경 파일, 검증 결과, 커밋 해시, 남은 위험이 포함됨
