# InvestLens Frontend

뉴스 기반 투자 영향 분석 서비스의 Next.js 프론트엔드입니다. 포트폴리오를 기준으로 맞춤 뉴스, 종목별 영향 방향과 점수를 제공합니다.

## 기술 스택

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4
- TanStack Query (서버 상태 및 중복 요청 방지)
- Vitest, React Testing Library
- Lucide Icons

## 실행

```bash
cp .env.example .env.local
npm install
npm run dev
```

서버 프록시의 기본 업스트림은 `https://investlens-be.onrender.com/api/v1`이며 `INVESTLENS_API_BASE_URL`로 변경할 수 있습니다. 브라우저는 CORS 영향을 피하기 위해 기본적으로 동일 출처 `/api/backend`를 호출합니다.

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
| 종목 검색 | GET | `/instruments` |
| 종목 상세 | GET | `/instruments/{instrumentId}` |
| 포트폴리오 조회/추가 | GET/POST | `/portfolio` |
| 포트폴리오 삭제 | DELETE | `/portfolio/{portfolioItemId}` |
| 맞춤 뉴스 | GET | `/news` |
| 뉴스 상세 | GET | `/news/{newsId}` |

> 뉴스 영향 분석은 투자 참고 정보이며 투자 조언 또는 주가 예측이 아닙니다.
