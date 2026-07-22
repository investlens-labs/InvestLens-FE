# InvestLens Frontend

뉴스 기반 투자 영향 분석 서비스의 Next.js 프론트엔드입니다. 포트폴리오를 기준으로 맞춤 뉴스, 종목별 영향 방향과 점수를 제공합니다.

## 문서

- [서비스 소개](./docs/service-introduction.md)
- [개발 문서](./docs/development.md)
- [Codex 에이전트 팀 운영](./docs/agent-team.md)

## 기술 스택

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4
- TanStack Query (서버 상태 및 중복 요청 방지)
- Vitest, React Testing Library
- Lucide Icons
- TradingView Lightweight Charts 5 (영역·거래량 차트)

## 실행

```bash
cp .env.example .env.local
npm install
npm run dev
```

서버 프록시의 기본 업스트림은 `https://investlens-be.onrender.com/api/v1`이며 `INVESTLENS_API_BASE_URL`로 변경할 수 있습니다. 브라우저는 CORS 영향을 피하기 위해 기본적으로 동일 출처 `/api/backend`를 호출합니다.

## Cloudflare Workers 배포

프로젝트는 OpenNext 어댑터와 Wrangler를 통해 `investlens` Worker로 배포됩니다.

```bash
npm run build:cloudflare
npm run preview
npm run deploy
```

Cloudflare Workers Builds에서는 다음 명령을 사용합니다.

```text
Build command:  npm run build:cloudflare
Deploy command: npx @opennextjs/cloudflare deploy
```

환경 변수와 호환성 설정은 `wrangler.jsonc`, OpenNext 설정은 `open-next.config.ts`에서 관리합니다.

## 품질 검증

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## 구조

```text
src/
├── app/                    # App Router 페이지와 레이아웃
├── components/             # 재사용 UI, 도메인 컴포넌트, Provider
├── hooks/                  # 범용 React 훅
└── lib/
    ├── api/                # Swagger 기반 DTO, 공통 클라이언트, 서비스
    └── auth/               # JWT 저장소
```

### API 정책

- JWT는 `Authorization: Bearer {accessToken}` 형식으로 전달합니다.
- Next.js Route Handler가 허용된 API 경로만 백엔드로 전달해 브라우저 CORS 의존성을 제거합니다.
- 인증된 요청의 401 응답은 토큰과 Query 캐시를 제거하고 로그인으로 이동합니다.
- 무료 서버의 cold start를 고려해 GET 요청만 5xx/네트워크 오류 시 최대 2회 지연 재시도합니다.
- POST/DELETE는 중복 변경을 막기 위해 자동 재시도하지 않습니다.
- 버튼 pending 상태와 TanStack Query mutation 상태로 연속 클릭을 방지합니다.

## API 계약

2026-07-17 백엔드 OpenAPI `/v3/api-docs`를 기준으로 구현했습니다.

| 기능 | Method | Path |
|---|---:|---|
| 회원가입 | POST | `/auth/signup` |
| 로그인 | POST | `/auth/login` |
| 내 정보 | GET | `/users/me` |
| 종목 검색 | GET | `/instruments?query=&market=KR|US&type=STOCK|ETF&limit=1~100` |
| 종목 상세 | GET | `/instruments/{instrumentId}` |
| 종목 차트 | GET | `/instruments/{instrumentId}/chart?range=1D|1W|1M|3M|1Y|5Y` |
| 종목 관련 뉴스 | GET | `/instruments/{instrumentId}/news?language=ko|en|ja|zh&page=0&size=20` |
| 종목 뉴스 AI 반응 집계 | GET | `/instruments/{instrumentId}/news/sentiment` |
| 포트폴리오 조회/추가 | GET/POST | `/portfolio` |
| 포트폴리오 삭제 | DELETE | `/portfolio/{portfolioItemId}` |
| 맞춤 뉴스 | GET | `/news` |
| 뉴스 상세 | GET | `/news/{newsId}` |

> 뉴스 영향 분석은 투자 참고 정보이며 투자 조언 또는 주가 예측이 아닙니다.

- 종목 뉴스는 `localized`가 참일 때만 번역 제목과 요약을 표시합니다.
- 영향 방향과 1~5점 점수는 `aiAnalyzed`가 참인 실제 AI 분석 결과에만 표시합니다.
- AI 분석 기사에는 상승·하락·중립 가능성을 표시하고, 종목 상세에는 분석 완료 기사의 평균 집계를 제공합니다.
- AI 비활성화 또는 호출 실패 fallback은 방향·점수 대신 `AI 분석 준비 중`으로 구분합니다.
