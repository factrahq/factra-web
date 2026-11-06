import Seo from '@/components/layout/Seo'
import PageHero from '@/components/sections/PageHero'
import SectionHead from '@/components/sections/SectionHead'
import CTA from '@/components/sections/CTA'
import FadeIn from '@/components/ui/FadeIn'
import { company } from '@/lib/site'

const principles = [
  { t: '현장 먼저', d: '책상에서 설계하지 않습니다. 라인에 가서 재고, 찍고, 신호를 확인한 뒤에 만듭니다.' },
  { t: '작게 시작해 넓힌다', d: '라인 하나, 공정 하나로 먼저 증명합니다. 숫자로 확인되면 그때 넓힙니다.' },
  { t: '플랫폼과 앱을 나눈다', d: '공장마다 다른 것은 설정과 앱으로. 검증된 공통 기반은 건드리지 않아 안정적입니다.' },
  { t: '보안에 맞춰 둔다', d: '클라우드 구독이 기본이고, 데이터를 밖으로 낼 수 없는 공장은 공장 안 서버로 운영합니다.' },
  { t: '운영까지 책임진다', d: '설치가 끝이 아닙니다. 원격 배포·롤백·기록 재생으로 돌아가는 동안 계속 다듬습니다.' },
]

const history = [
  { d: '2026. 09', t: '화학소재(접착제) 제조 현장 — 제조AI특화 스마트공장 착수', s: '4개 라인 킥오프 · 1차 현장 실측' },
  { d: '2026. 10', t: '전자부품 제조 현장 — 릴 라벨 비전 시스템 가동', s: '25MP 2-카메라, PLC·MES 연동, 로봇 라벨 부착 라인' },
  { d: '2026. 10', t: '화학소재 제조 현장 — 설비 데이터 수집 설계', s: '91대 기기 · 163 데이터 포인트 · 게이트웨이 9대' },
  { d: '2026. 11', t: 'FACTRA 출범', s: '현장 비전 시스템을 범용 플랫폼(Factra Vision)으로 분리 · 공장별 앱 구조 확립' },
  { d: '2026. 11', t: 'Factra Field · Factra RTLS 개발 착수', s: '현장 실측 플랫폼, UWB 접근 경보·위치추적 하드웨어' },
]

const team = [
  { t: '설비 데이터 · IIoT', d: '실측, 수집 설계, 게이트웨이 결선, 플랫폼 활성화' },
  { t: '비전 · AI', d: '카메라·조명 구성, 분할·매칭·판독 모델 학습' },
  { t: '임베디드 · 하드웨어', d: '엣지 장비, UWB 보드·펌웨어, 설비 신호' },
  { t: '설비 연동', d: 'PLC·MES·센서·경광등 연결과 현장 시운전' },
  { t: '소프트웨어', d: '운영 화면, 이력·배포, 모바일·웹 플랫폼' },
]

export default function Company() {
  return (
    <>
      <Seo title="회사 소개" description="FACTRA(팩트라) = Factory + Transformation. 제조 DX·AX를 위한 Factory Transformation — 설비 데이터 수집, 비전 검사, UWB 위치추적, 현장 실측." />
      <PageHero
        eyebrow="About FACTRA"
        image="/images/engineer-rig.jpg"
        title={<>제조 DX·AX를 위한<br />Factory Transformation.</>}
        desc="FACTRA(팩트라)는 Factory와 Transformation을 합친 이름입니다. 공장을 디지털로, 그리고 AI로 전환하는 일을 합니다."
      />

      <section className="border-b border-line">
        <div className="wrap py-16 md:py-20">
          <FadeIn>
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-3 font-[family-name:var(--font-display)] text-[clamp(2rem,5.4vw,4.4rem)] font-bold tracking-[-0.03em]">
              <span><span className="text-signal">Fact</span>ory</span>
              <span className="text-fg-3">+</span>
              <span>T<span className="text-signal">ra</span>nsformation</span>
              <span className="text-fg-3">=</span>
              <span className="text-signal">Factra</span>
            </div>
            <p className="mt-5 text-[16px] text-fg-2">어원 Factory + Transformation · 의미 공장을 디지털, AI로 전환한다</p>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <SectionHead eyebrow="Mission" title={<>공장을 디지털로,<br />그리고 AI로.</>} />
          <FadeIn delay={0.1}>
            <div className="space-y-5 text-[17px] leading-[1.8] text-fg-2">
              <p>
                많은 중소 제조 현장에서 설비 값은 패널 화면에만 있고, 품질은 숙련자의 눈에, 안전은 조심에 맡겨져 있습니다. 사람이 줄고 품목이 늘수록 그 방식은 버티기 어렵습니다.
              </p>
              <p>
                FACTRA는 먼저 설비를 데이터로 잇고(DX), 그 데이터와 영상 위에서 AI가 판단하게(AX) 만듭니다. 화학소재 공장의 설비 데이터 수집과
                전자부품 공장의 비전 자동화 라인을 직접 실측하고, 만들고, 운영하며 얻은 방법을 플랫폼으로 만들어 다른 공장에도 빠르게 옮기고 있습니다.
              </p>
              <p className="text-fg">
                <b>우리가 파는 것은 데모가 아니라, 내일 아침에도 돌아가고 있을 시스템입니다.</b>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-ink text-white grid-ink">
        <div className="wrap section">
          <SectionHead dark eyebrow="Principles" title="일하는 원칙" />
          <div className="mt-16 grid gap-px border border-line-ink bg-line-ink md:grid-cols-5">
            {principles.map((p, i) => (
              <FadeIn key={p.t} delay={i * 0.07} className="bg-ink p-7 md:min-h-[260px]">
                <p className="mono text-[12px] text-signal">0{i + 1}</p>
                <h3 className="mt-10 text-[19px] font-bold">{p.t}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-on-ink-2">{p.d}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <SectionHead eyebrow="History" title="연혁" />
          <FadeIn delay={0.1}>
            <ol className="border-t-2 border-fg">
              {history.map(h => (
                <li key={h.t} className="grid grid-cols-[90px_1fr] gap-6 border-b border-line py-6 md:grid-cols-[120px_1fr]">
                  <span className="mono text-[14px] text-fg-3">{h.d}</span>
                  <div>
                    <p className="text-[17px] font-semibold">{h.t}</p>
                    <p className="mt-1 text-[14.5px] text-fg-2">{h.s}</p>
                  </div>
                </li>
              ))}
            </ol>
          </FadeIn>
        </div>
      </section>

      <section className="section bg-paper-2">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead eyebrow="Team" title={<>현장을 아는 엔지니어가<br />처음부터 끝까지.</>} desc="영업과 개발, 설치가 따로 놀지 않습니다. 상담한 엔지니어가 실측하고, 만들고, 설치합니다." />
            <FadeIn delay={0.1}>
              <div className="mt-10 grid grid-cols-2 gap-px border border-line bg-line [&>*:last-child:nth-child(odd)]:col-span-2">
                {team.map(t => (
                  <div key={t.t} className="bg-paper-2 p-5">
                    <p className="text-[16px] font-semibold">{t.t}</p>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-2">{t.d}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={0.15}>
            <div className="finder relative overflow-hidden">
              <img src="/images/engineers-drawing.jpg" alt="" className="aspect-[4/3] w-full object-cover" />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Company info" title="회사 정보" />
          <FadeIn delay={0.1}>
            <dl className="mt-10 grid border-t-2 border-fg md:grid-cols-2">
              {[
                ['브랜드', `${company.brand} (${company.nameKo})`],
                ['법인명', company.legalName],
                ['대표', company.ceo],
                ['주소', company.address],
                ['이메일', company.email],
                ['웹사이트', company.domain],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[110px_1fr] border-b border-line py-5 md:pr-10">
                    <dt className="mono text-[13px] text-fg-3">{k}</dt>
                    <dd className="text-[15.5px]">{v}</dd>
                  </div>
                ))}
            </dl>
          </FadeIn>
        </div>
      </section>

      <CTA />
    </>
  )
}
