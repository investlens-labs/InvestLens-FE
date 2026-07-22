# 검색엔진 최적화 운영

InvestLens의 기술 SEO는 검색엔진이 공개 서비스 소개를 정확히 수집하고 브랜드, 설명, 공유 이미지를 일관되게 이해하도록 구성합니다. 기술 SEO는 크롤링과 색인 가능성을 높이지만 특정 검색어의 순위, 색인 시점 또는 리치 결과 노출을 보장하지 않습니다.

## 색인 정책

| 경로 | 정책 | 이유 |
|---|---|---|
| `/` | `index, follow` | 서버에서 렌더링되는 공개 서비스 소개 |
| `/login`, `/signup` | `noindex, follow` | 검색 결과로 제공할 핵심 콘텐츠가 아닌 인증 화면 |
| `/dashboard`, `/search`, `/portfolio` | `noindex, nofollow` | JWT 인증과 사용자 데이터에 기반한 개인화 화면 |
| `/instruments/*`, `/news/*` | `noindex, nofollow` | 인증 후 클라이언트에서 불러오는 종목·뉴스 데이터 |
| `/api/*` | robots 크롤링 제한 | 검색 콘텐츠가 아닌 동일 출처 백엔드 프록시 |

`robots.txt` 차단은 개인정보 보호 수단이 아닙니다. 개인화 데이터는 JWT 인증과 백엔드 인가로 보호하고, HTML의 robots metadata로 검색 색인을 제한합니다.

## 제공하는 검색 메타데이터

- locale 기반 title과 description
- 절대 canonical URL
- Open Graph 및 Twitter large image
- `WebSite`, `Organization`, `WebApplication` JSON-LD
- `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`
- Google 및 Naver 사이트 소유권 확인 meta 환경변수
- 개인화 화면의 `noindex`

사이트 origin은 `NEXT_PUBLIC_SITE_URL`로 관리합니다. 커스텀 도메인을 연결하면 이 값을 새 HTTPS origin으로 변경한 뒤 재배포해야 canonical, sitemap, JSON-LD가 같은 주소를 사용합니다.

```dotenv
NEXT_PUBLIC_SITE_URL=https://investlens.example.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=google에서_발급한_값
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=naver에서_발급한_값
```

검증 코드는 공개 meta 값이며 비밀번호나 API Token이 아닙니다. 값이 없으면 해당 meta 태그를 출력하지 않습니다.

## 다국어 정책

서비스 UI는 한국어, 영어, 일본어, 중국어를 지원하지만 현재 언어 선택은 `NEXT_LOCALE` 쿠키를 사용하는 동일 URL 구조입니다. 검색엔진의 `hreflang`은 언어별 고유 URL과 상호 참조가 필요하므로 존재하지 않는 언어 URL을 임의로 선언하지 않습니다. 언어별 검색 유입을 확대할 때는 `/ko`, `/en`, `/ja`, `/zh` 같은 고유 공개 URL을 별도 설계한 뒤 canonical과 sitemap을 함께 전환합니다.

## 배포 후 확인

```bash
curl -I https://investlens.mandoo4137-a53.workers.dev/
curl https://investlens.mandoo4137-a53.workers.dev/robots.txt
curl https://investlens.mandoo4137-a53.workers.dev/sitemap.xml
curl https://investlens.mandoo4137-a53.workers.dev/manifest.webmanifest
```

운영 배포 후 다음 외부 도구에서 확인합니다.

1. Google Search Console에서 사이트 소유권 확인
2. `sitemap.xml` 제출 및 URL 검사
3. Google Rich Results Test에서 JSON-LD 구문 확인
4. Naver Search Advisor에서 사이트 소유권 확인 및 sitemap 제출
5. 색인, 크롤링 오류, 수동 조치와 Core Web Vitals를 정기적으로 점검

숨김 키워드, 키워드 반복, cloaking, 유료 링크나 자동 생성 링크 등 검색엔진 스팸 정책을 위반하는 방식은 사용하지 않습니다.
