# factra-web — FACTRA 회사 홈페이지 (factra.kr)

Next.js 15 (pages router) + Tailwind 4 + motion. 정적 빌드(`out/`)를 GitHub Pages로 배포한다. 구성은 `~/Developer/work/ksfc-landing` 을 참고했다.

```sh
npm install
npm run dev     # http://localhost:3002
npm run build   # → out/
```

## 페이지
| 경로 | 내용 |
|---|---|
| `/` | 홈 — 히어로, 문제, 제품 3종, 현장 검증 숫자, 플랫폼+앱 구조, 일하는 방식, 사례 |
| `/vision/` | Factra Vision (factrahq/factra-vision) |
| `/rtls/` | Factra RTLS — UWB (factrahq/uwb-rtls), 개발 중 |
| `/field/` | Factra Field — 현장 실측 (factrahq/factra-field) |
| `/cases/` | 도입 사례 (고객사명 비공개, 업종으로만) |
| `/company/` | 회사 소개 (Factory + Transformation) · 원칙 · 연혁 · 회사 정보 |
| `/contact/` | 도입 문의 (지금은 mailto) |

## 확인 필요 (TODO)
- `src/lib/site.ts` — 법인명·대표·사업자등록번호·주소·전화 (비어 있으면 화면에 안 나옴), `contact@factra.kr` 메일함
- 문의 폼 수신 방식 (지금은 메일 앱을 연다)
- 이미지는 Unsplash/Wikimedia 무료 이미지 → `public/images/CREDITS.md`. 실제 현장 사진으로 교체 권장

## 배포 (GitHub Pages)
1. `factrahq/factra-web` 저장소 생성 후 push → `.github/workflows/deploy.yml` 이 빌드·배포
2. 저장소 Settings → Pages → Source: GitHub Actions
3. DNS: `factra.kr` A 레코드 185.199.108.153 / .109 / .110 / .111 (www 는 CNAME `factrahq.github.io`), `public/CNAME` 에 도메인 있음
4. 무료 플랜에서 Pages 는 **공개 저장소**만 가능
