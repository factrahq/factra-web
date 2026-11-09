import Seo from '@/components/layout/Seo'
import PageHero from '@/components/sections/PageHero'
import SectionHead from '@/components/sections/SectionHead'
import CTA from '@/components/sections/CTA'
import FadeIn from '@/components/ui/FadeIn'

// 고객사 이름은 공개 동의 전까지 쓰지 않는다 (업종으로만 표기)
const cases = [
  {
    tag: 'DX · 설비 데이터 수집 · 구축 진행 중',
    industry: '화학소재(접착제) 제조',
    title: '4개 라인 · 91대 설비 데이터 수집 체계 구축',
    image: '/images/process-plant.jpg',
    before: [
      '인버터·온도조절계·칠러 값이 설비마다 패널 화면에만 표시 — 사람이 돌며 수기 기록',
      'LS·Siemens PLC, 인버터 3종, 조절계·전력량계까지 제조사와 통신 방식이 제각각',
      '설비별 전력 사용량을 알 수 없어 에너지 절감 근거가 없음',
    ],
    how: [
      '세 차례 현장 실측 — 제어반 50면을 조사해 기기 모델·통신 포트·결선을 설비마다 확인 (Factra Field)',
      '공장이 쓰던 설비 태그 체계(TK·KN·WC…)를 그대로 데이터 식별자로 사용',
      '기기별 통신 가능 여부 판정 → 교체가 필요한 조절계 27대 선별, 전력량계 25회로 추가',
      '게이트웨이 9대 결선 설계 — 버스별 통신 속도·국번 체계 통일, 가동 중인 PLC는 읽기 전용 연결',
      '수집 → 모니터링 → AI 분석 (제조AI특화 스마트공장 과제)',
    ],
    after: [
      ['연결 설계 기기', '91대 (4개 라인)'],
      ['데이터 포인트', '163개 확정'],
      ['게이트웨이', '9대 설계'],
    ],
  },
  {
    tag: 'AX · Factra Vision · 현장 가동',
    industry: '전자부품 제조',
    title: '입고 릴 라벨 자동 판독 · 자사 라벨 부착',
    image: '/images/hands-electronics.jpg',
    before: [
      '공급사마다 다른 릴 라벨을 작업자가 보고 품번·수량·로트를 확인',
      '자사 라벨 출력·부착을 사람이 처리 — 입력 실수는 뒤 공정에서 발견',
    ],
    how: [
      'PLC 촬영 요청 → 25MP 카메라로 릴 촬영',
      'AI가 라벨 영역을 찾고(분할), 등록된 공급사 템플릿과 대조',
      '바코드·QR 판독 → MES 입고 등록 → PLC에 판정과 부착 좌표 전달',
      '로봇이 자사 라벨 부착 → 2차 카메라가 QR을 다시 읽어 MES 검증',
      '신규 품목·라벨 템플릿은 현장 담당자가 직접 등록',
      '가동 후 못 읽던 가는 품번 바코드는 확대 판독을 더해 해결 — 같은 품번 32건 중 5건 NG → 178건 전부 OK',
    ],
    after: [
      ['비전 판독 NG', '922건 중 0건 (개선 후 첫 운전)'],
      ['남은 NG 원인', 'MES 서버 오류 · 로봇팔 가림 (설비 쪽)'],
      ['배포 전 검증', '현장 기록 4,339건 재생 일치'],
    ],
  },
]

export default function Cases() {
  return (
    <>
      <Seo title="도입 사례" description="Factra 도입 사례 — 화학소재 공장 설비 데이터 수집(DX), 전자부품 입고 릴 라벨 자동 판독(AX)." />
      <PageHero
        eyebrow="Cases"
        image="/images/sparks.jpg"
        title={<>현장에서 시작해,<br />현장으로 증명합니다.</>}
        desc="고객사 정보 보호를 위해 업종으로만 소개합니다. 자세한 구성과 결과는 상담 때 직접 보여 드립니다."
      />

      {cases.map((c, idx) => (
        <section key={c.title} className={`section ${idx % 2 ? 'bg-paper-2' : ''}`}>
          <div className="wrap">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
              <FadeIn>
                <div className="finder relative overflow-hidden bg-ink">
                  <img src={c.image} alt="" className="aspect-[4/3] w-full object-cover" />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-px border border-line bg-line">
                  {c.after.map(([k, v]) => (
                    <div key={k} className="bg-card p-4">
                      <p className="mono text-[11px] text-fg-3">{k}</p>
                      <p className="mt-1.5 text-[14px] font-semibold leading-snug">{v}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
              <div>
                <SectionHead eyebrow={`${c.tag} · ${c.industry}`} title={c.title} />
                <FadeIn delay={0.1}>
                  <div className="mt-10 space-y-8">
                    <div>
                      <p className="mono text-[12px] uppercase tracking-[0.08em] text-fg-3">Before</p>
                      <ul className="mt-3 space-y-2">
                        {c.before.map(b => <li key={b} className="text-[15.5px] text-fg-2">— {b}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="mono text-[12px] uppercase tracking-[0.08em] text-signal">How</p>
                      <ol className="mt-3 space-y-3">
                        {c.how.map((h, i) => (
                          <li key={h} className="flex gap-4 border-b border-line pb-3 text-[15.5px]">
                            <span className="mono text-[13px] text-fg-3">{String(i + 1).padStart(2, '0')}</span>{h}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>
      ))}

      <CTA title="다음 사례는 귀사의 라인일 수 있습니다." />
    </>
  )
}
