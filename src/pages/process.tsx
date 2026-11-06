import { Landmark, FileText, Presentation } from 'lucide-react'
import Link from 'next/link'
import Seo from '@/components/layout/Seo'
import PageHero from '@/components/sections/PageHero'
import SectionHead from '@/components/sections/SectionHead'
import CTA from '@/components/sections/CTA'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/ui/FadeIn'

const steps = [
  { n: '01', t: '상담 · 공장 둘러보기', d: '공장을 한 바퀴 돌며 라인·설비 대수, 명판, 표시기(HMI)를 봅니다. 필요한 데이터를 지금 설비로 가져올 수 있는지 먼저 판단합니다.', out: '방문 기록 · 가능 여부 판단' },
  { n: '02', t: '제안 · 견적', d: '설비 1대당 표준 구성 × 대수로 견적을 냅니다. 정부지원사업이면 사업계획서와 발표 준비를 함께 합니다.', out: '제안서 · 견적서 (확정/조건부/별도)' },
  { n: '03', t: '계약 · 협약', d: '검수 통과 조건과 대금 조건을 계약에 담습니다. 지원사업은 다자 협약으로 진행합니다.', out: '계약서 · 검수 조건' },
  { n: '04', t: '현장 실측', d: '제어반을 열어 기기 모델·통신 포트·결선을 설비마다 확인하고, 그 자리에서 통신을 시험합니다. 기록은 Factra Field에 남습니다.', out: '실측 산출물 · 기기별 A/B/C 판정' },
  { n: '05', t: '설계', d: '수집 명세표, 게이트웨이 결선도, 통신 설정, 센서 선정을 확정합니다. 이 설계가 시공과 활성화의 기준입니다.', out: '수집 명세표 · 결선 설계 · 자재 목록' },
  { n: '06', t: '시공 · 활성화', d: '게이트웨이와 전장을 설치하는 동안, 플랫폼에서는 설비·데이터 포인트를 등록해 연결을 켭니다. 두 일을 나란히 진행합니다.', out: '설치 감리 기록 · 플랫폼 설정' },
  { n: '07', t: '검수', d: '설비 화면의 값과 플랫폼에 들어온 값이 맞는지 하나씩 대조합니다. 계약 때 정한 조건으로 검수합니다.', out: '시운전 검증표 · 검수 확인' },
  { n: '08', t: '운영 · 고도화', d: '정기 점검과 이슈 대응을 이어가고, 쌓인 데이터로 다음 단계(AI·비전·확장)를 제안합니다.', out: '최종 설계 · 연동 목록 · 운영 기록' },
]

const quote = [
  { k: '확정', d: '플랫폼 · 엔지니어링 기본 + 설비 N대 × 표준 구성 단가', c: 'bg-ink text-white' },
  { k: '조건부', d: '실측 후 정산 — 함 신설 대수, 배선 거리, 게이트웨이 대수 등', c: 'bg-signal/10 border border-signal/40' },
  { k: '별도', d: '설비 제어 로직 수정, 범위 밖 센서 신설 등', c: 'bg-card border border-line' },
]

const support = [
  { icon: Landmark, t: '정부지원사업 연계', d: '제조 AI·스마트공장 지원사업에 맞춰 과제 범위를 잡습니다. 구축 비용의 일부를 지원받을 수 있습니다.' },
  { icon: FileText, t: '사업계획서 작성', d: '현장 실측과 데이터 설계를 근거로 사업계획서를 같이 씁니다. 평가 의견 반영도 함께 합니다.' },
  { icon: Presentation, t: '발표 · 협약 지원', d: '발표 준비와 선정 후 다자 협약, 수행 보고까지 이어서 지원합니다.' },
]

export default function Process() {
  return (
    <>
      <Seo title="도입 절차" description="상담·공장 둘러보기부터 실측, 설계, 시공·활성화, 검수, 운영까지 — Factra 도입 8단계와 견적 방식, 정부지원사업 연계." />
      <PageHero
        eyebrow="How we work"
        image="/images/engineers-drawing.jpg"
        title={<>상담부터 운영까지,<br />같은 칸을 채우며 갑니다.</>}
        desc="단계마다 무엇을 하고, 무엇이 나오고, 언제 끝나는지 정해 두었습니다. 한 단계의 산출물이 다음 단계의 입력이라, 담당자가 바뀌어도 현장에 되묻지 않습니다."
      >
        <Button href="/contact/">상담 신청</Button>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="8 steps" title="도입 8단계" />
          <ol className="mt-14 border-t-2 border-fg">
            {steps.map((s, i) => (
              <FadeIn key={s.n} delay={(i % 4) * 0.05}>
                <li className="grid gap-3 border-b border-line py-7 md:grid-cols-[80px_240px_1fr_260px] md:gap-8">
                  <span className="mono text-[14px] text-signal">{s.n}</span>
                  <h3 className="text-[19px] font-bold tracking-[-0.02em]">{s.t}</h3>
                  <p className="text-[15px] leading-relaxed text-fg-2">{s.d}</p>
                  <p className="mono text-[12.5px] text-fg-3 md:text-right">→ {s.out}</p>
                </li>
              </FadeIn>
            ))}
          </ol>
          <FadeIn>
            <p className="mt-8 text-[14.5px] text-fg-2">
              실측에서 확인하지 못한 것이 남으면 다시 방문하고, 시범 구축(PoC) 후 본 구축으로 넓힐 수 있습니다. 현장 실측 도구는{' '}
              <Link href="/field/" className="font-semibold text-fg underline underline-offset-4">Factra Field</Link>를 봐 주세요.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section bg-paper-2">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:items-center">
          <SectionHead eyebrow="Quotation" title={<>견적은 세 칸으로<br />나눠 드립니다.</>} desc="공장을 둘러보는 것만으로는 제어반 안까지 알 수 없습니다. 그래서 확실한 것과 실측 후 정산할 것을 처음부터 나눠 적고, 항목마다 근거를 붙입니다. 나중에 금액이 왜 바뀌었는지 다툴 일이 없습니다." />
          <FadeIn delay={0.1}>
            <div className="space-y-3">
              {quote.map(q => (
                <div key={q.k} className={`grid grid-cols-[90px_1fr] items-center gap-4 p-6 ${q.c}`}>
                  <span className="text-[19px] font-bold">{q.k}</span>
                  <span className="text-[15px]">{q.d}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Government support" title="정부지원사업도 같이 준비합니다." desc="상당수 프로젝트가 지원사업으로 진행됩니다. 과제 범위 설정부터 수행까지 한 팀이 맡습니다." />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {support.map((s, i) => (
              <FadeIn key={s.t} delay={i * 0.1} className="border border-line bg-card p-8">
                <s.icon size={26} strokeWidth={1.6} className="text-signal" />
                <h3 className="mt-8 text-[20px] font-bold">{s.t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-fg-2">{s.d}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
