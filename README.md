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
| `/` | 홈 — DX(설비 데이터) → AX(비전·AI) 순서. 히어로, 문제, Factory Transformation, 제품, 현장 숫자, 플랫폼 구조, 도입 절차, 사례 |
| `/platform/` | Factra Platform (DX) — 게이트웨이 → 노코드 플랫폼 → 운영 앱·AI, 연결 3유형 A/B/C, 도입 형태 |
| `/mes/` | Factra MES (DX) — 수주·재고·생산·품질 4개 앱, 업무 흐름, 화면 예시(가상 데이터), 품질 AI(선택), 일정·산출물, 양사 역할, 검수, 비용. 원본: 컨포트랩 「PORTA MES 도입 안내 v1.1」 |
| `/vision/` | Factra Vision (AX, factrahq/factra-vision) |
| `/rtls/` | Factra RTLS (AX, factrahq/uwb-rtls), 개발 중 |
| `/twin/` | Factra Twin — Unity 3D 디지털 트윈 데모 (원본 factrahq/factra-twin, 비공개 · 로컬 `~/factra/factra-twin`). `/platform/demo/#twin` 에도 같은 3D 화면 |
| `/process/` | 도입 8단계 · 견적 방식(확정/조건부/별도) · 정부지원사업 |
| `/field/` | Factra Field — 현장 실측 (factrahq/factra-field), 메뉴엔 없고 푸터·도입 절차에서 링크 |
| `/cases/` | 도입 사례 — 화학소재 설비 데이터 수집(DX), 전자부품 릴 라벨 비전(AX). 고객사명 비공개 |
| `/company/` | 회사 소개 (Factory + Transformation) · 원칙 · 연혁 · 회사 정보 |
| `/contact/` | 도입 문의 (지금은 mailto) |

## 3D 트윈 (Unity WebGL)
`public/twin/Build/` 는 `factra-twin` 빌드 결과(약 5.2 MB)다. 3D 를 고치면 그쪽에서 빌드한 뒤 `sh scripts/sync-twin.sh` 로 복사한다. 웹 연동 코드는 `src/lib/twin.ts`, `src/components/twin/UnityTwin.tsx`, `src/components/demo/Twin.tsx`.

## 확인 필요 (TODO)
- `src/lib/site.ts` — 법인명·대표·사업자등록번호·주소·전화 (비어 있으면 화면에 안 나옴), `contact@factra.kr` 메일함
- 문의 폼 수신 방식 (지금은 메일 앱을 연다)
- 이미지는 Unsplash/Wikimedia 무료 이미지 → `public/images/CREDITS.md`. 실제 현장 사진으로 교체 권장

## 배포 (GitHub Pages)
1. `factrahq/factra-web` 저장소 생성 후 push → `.github/workflows/deploy.yml` 이 빌드·배포
2. 저장소 Settings → Pages → Source: GitHub Actions
3. DNS: `factra.kr` A 레코드 185.199.108.153 / .109 / .110 / .111 (www 는 CNAME `factrahq.github.io`), `public/CNAME` 에 도메인 있음
4. 무료 플랜에서 Pages 는 **공개 저장소**만 가능
