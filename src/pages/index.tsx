import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, ScanLine, Siren, Gauge, Zap } from 'lucide-react'
import Seo from '@/components/layout/Seo'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/ui/FadeIn'
import SectionHead from '@/components/sections/SectionHead'
import CTA from '@/components/sections/CTA'
import { products } from '@/lib/site'

const ease = [0.16, 1, 0.3, 1] as const

// 히어로 오른쪽 — 설비 모니터링 화면 예시 (값은 예시)
const hudRows = [
  { tag: 'CNC-03', name: 'CNC 스핀들 부하', v: '62', u: '%', ok: true, spark: '0,10 10,8 20,11 30,9 40,7 50,10 60,8 70,9 80,8' },
  { tag: 'PR-01', name: '프레스 오늘 타수', v: '3,420', u: '회', ok: true, spark: '0,16 10,14 20,13 30,11 40,10 50,8 60,6 70,5 80,4' },
  { tag: 'IM-02', name: '사출기 금형 온도', v: '58.2', u: '℃', ok: true, spark: '0,9 10,10 20,9 30,8 40,9 50,10 60,9 70,9 80,8' },
  { tag: 'AC-01', name: '공기압축기 토출 압력', v: '5.1', u: 'bar', ok: false, spark: '0,4 10,4 20,5 30,4 40,6 50,8 60,10 70,12 80,14' },
  { tag: 'LINE', name: '오늘 전력 사용량', v: '1,284', u: 'kWh', ok: true, spark: '0,16 10,14 20,13 30,11 40,10 50,8 60,6 70,5 80,4' },
]

function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[760px] max-h-[1080px] overflow-hidden bg-ink text-white">
      <div className="absolute inset-0">
        <img src="/images/hero-line.jpg" alt="" className="h-full w-full object-cover opacity-60 animate-[kenburns_28s_ease-in-out_infinite_alternate]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      </div>

      <div className="relative wrap flex h-full flex-col justify-center pt-[120px] pb-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="eyebrow text-on-ink-2">
              Factory Transformation · 제조 DX·AX
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.15, ease }}
              className="h-display mt-7 text-[clamp(2.4rem,6vw,4.9rem)]"
            >
              공장을 디지털로,
              <br />
              <span className="text-signal">AI로 전환합니다.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.35, ease }}
              className="lead mt-7 max-w-[560px] text-on-ink-2"
            >
              설비 값 기록, 라벨 확인, 외관 검사처럼 사람이 눈과 손으로 하던 일을 설비 데이터와 AI로 자동화합니다.
              현장 실측부터 설치, 운영까지 직접 합니다.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5, ease }} className="mt-10 flex flex-wrap gap-3">
              <Button href="/contact/">도입 문의</Button>
              <Button href="/platform/" variant="ghost-light">Factra Platform 보기</Button>
            </motion.div>
          </div>

          {/* 설비 모니터링 화면 느낌의 HUD */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.3, delay: 0.6, ease }}
            className="hidden lg:block"
          >
            <div className="finder relative overflow-hidden border border-white/15 bg-ink/75 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <span className="mono text-[11px] tracking-[0.1em] text-on-ink-2">LINE A · 설비 모니터링</span>
                <span className="mono flex items-center gap-2 text-[11px] text-ok"><span className="blink h-2 w-2 rounded-full bg-ok" />LIVE</span>
              </div>
              <div className="grid grid-cols-3 border-b border-white/10">
                {[['가동률', '87', '%'], ['가동 설비', '24', '/27'], ['알람', '1', '건']].map(([k, v, u], i) => (
                  <div key={k} className={`px-5 py-4 ${i < 2 ? 'border-r border-white/10' : ''}`}>
                    <p className="mono text-[10.5px] text-on-ink-3">{k}</p>
                    <p className={`mt-1 font-[family-name:var(--font-display)] text-[28px] font-bold leading-none ${k === '알람' ? 'text-signal' : ''}`}>{v}<span className="ml-0.5 text-[13px] text-on-ink-3">{u}</span></p>
                  </div>
                ))}
              </div>
              <ul className="divide-y divide-white/[0.07]">
                {hudRows.map((r, i) => (
                  <motion.li key={r.tag} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 + i * 0.15 }} className="grid grid-cols-[64px_1fr_84px_90px] items-center gap-2 px-5 py-3">
                    <span className="mono text-[11px] text-on-ink-3">{r.tag}</span>
                    <span className="text-[13px] text-on-ink">{r.name}</span>
                    <svg viewBox="0 0 80 18" className="h-[18px] w-[80px]"><polyline points={r.spark} fill="none" stroke={r.ok ? '#2BB673' : '#FF5A1F'} strokeWidth="1.6" /></svg>
                    <span className={`mono text-right text-[13px] ${r.ok ? 'text-on-ink' : 'text-signal'}`}>{r.v}<span className="ml-1 text-[11px] text-on-ink-3">{r.u}</span></span>
                  </motion.li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-white/10 bg-signal/10 px-5 py-3">
                <span className="mono text-[11px] text-on-ink-2">AI · 이상 징후</span>
                <span className="text-[12.5px] text-signal-2">공기압축기 압력이 평소보다 빠르게 떨어집니다 · 배관 누설 의심</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-y-4 border-t border-white/10 pt-6 md:grid-cols-5">
          {['PLC · 인버터 · 조절계', '수집 장치 (게이트웨이)', '노코드 플랫폼', 'MES 수주 · 재고 · 생산 · 품질', '비전 AI · 위치추적'].map(t => (
            <span key={t} className="mono text-[12px] tracking-[0.04em] text-on-ink-3">{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

const pains = [
  {
    icon: Gauge,
    title: '설비 값이 패널 화면에만 있습니다',
    desc: '온도·회전수·전류·전력은 설비마다 따로 표시되고, 사람이 돌며 적습니다. 문제가 생겨도 언제부터였는지 되짚을 기록이 없습니다.',
  },
  {
    icon: Zap,
    title: '전기를 어디서 얼마나 쓰는지 모릅니다',
    desc: '전력은 공장 전체 고지서 한 장으로만 봅니다. 어느 설비가 피크를 만드는지 모르면 절감도 감으로 할 수밖에 없습니다.',
  },
  {
    icon: ScanLine,
    title: '라벨을 사람이 읽고 입력합니다',
    desc: '입고 자재마다 다른 라벨 양식, 대소문자 하나 틀린 품번. 수작업 판독과 입력은 느리고, 실수는 뒤 공정에서야 드러납니다.',
  },
  {
    icon: Siren,
    title: '지게차와 사람이 같은 통로를 씁니다',
    desc: '사각지대 접촉 사고는 대부분 몇 초 전에 알았다면 막을 수 있었습니다. 카메라가 못 보는 곳까지 거리로 감지해야 합니다.',
  },
]

function Problems() {
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead
          eyebrow="Problem"
          title={<>공장은 아직 많은 일을<br />사람의 눈에 기대고 있습니다.</>}
          desc="숙련자가 보고, 읽고, 조심하는 일. 사람이 줄고 품목이 늘수록 가장 먼저 무너지는 곳입니다."
        />
        <div className="mt-16 grid gap-px bg-line border border-line md:grid-cols-2">
          {pains.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.1} className="bg-paper p-8 md:p-10">
              <p.icon size={26} strokeWidth={1.6} className="text-signal" />
              <h3 className="mt-8 text-[20px] font-bold tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-fg-2">{p.desc}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function Products() {
  return (
    <section className="section bg-paper-2">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead eyebrow="Products" title={<>연결하고, 관리하고,<br />판단하는 제품들.</>} />
          <FadeIn><p className="max-w-[380px] text-[15px] text-fg-2">설비 데이터 수집과 MES(DX)를 바탕으로 비전 검사·위치추적(AX)을 더합니다. 현장 엣지 장비가 먼저 처리해, 네트워크가 끊겨도 기록을 잃지 않습니다.</p></FadeIn>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <FadeIn key={p.key} delay={i * 0.1}>
              <Link href={p.href} className="group block h-full bg-card border border-line transition-colors hover:border-fg">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                  <img src={p.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="mono absolute left-4 top-4 bg-ink/80 px-2.5 py-1 text-[11px] text-white backdrop-blur">{p.status}</span>
                </div>
                <div className="p-7">
                  <p className="mono text-[12px] text-fg-3">0{i + 1} / {p.short}</p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-[26px] font-bold tracking-[-0.02em]">{p.name}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-fg-2">{p.desc}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold">
                    자세히 보기 <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

const proofs = [
  { n: '91', u: '대', d: '화학소재 공장 4개 라인의 인버터·조절계·PLC·칠러·전력량계를 하나의 수집 체계로 연결 설계' },
  { n: '163', u: '포인트', d: '설비 태그 그대로 정리해 확정한 데이터 포인트. 게이트웨이 9대로 모읍니다' },
  { n: '50', u: '면', d: '세 차례 실측에서 조사한 제어반. 기기 모델과 통신 방식을 설비마다 판정했습니다' },
  { n: '4,339', u: '사이클', d: '전자부품 비전 라인의 실제 운전 기록을 새 버전으로 다시 돌려, 배포 전에 판정이 바뀌지 않음을 확인' },
]

function Proof() {
  return (
    <section className="relative overflow-hidden bg-ink text-white grid-ink">
      <div className="wrap section">
        <SectionHead
          dark
          eyebrow="Field-proven"
          title={<>제안서의 숫자가 아니라,<br />현장에서 센 숫자입니다.</>}
          desc="제어반을 직접 열어 보고, 설비를 하나씩 세고, 실제 운전 기록으로 시험합니다. 그래서 견적의 숫자마다 근거가 남습니다."
        />
        <div className="mt-16 grid gap-px border border-line-ink bg-line-ink md:grid-cols-4">
          {proofs.map((p, i) => (
            <FadeIn key={p.d} delay={i * 0.08} className="bg-ink p-8">
              <p className="font-[family-name:var(--font-display)] text-[54px] font-bold leading-none tracking-[-0.03em]">
                {p.n}<span className="ml-1.5 text-[18px] font-semibold text-signal">{p.u}</span>
              </p>
              <p className="mt-6 text-[14px] leading-relaxed text-on-ink-2">{p.d}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function Approach() {
  const stack = [
    { t: 'MES · 운영 앱 · AI', d: '수주 · 재고 · 생산 · 품질 / 설비 · 에너지 · 관제 / AI', dark: false, accent: true },
    { t: 'Factra Platform', d: '설비 모델 · 노코드 연결 · 데이터 표준화', dark: true },
    { t: 'Factra Gateway', d: '설비 값을 모아 보내는 현장 수집 장치 / RS-485 · Ethernet · Wi-Fi', dark: true },
    { t: '현장 기기', d: 'PLC · 인버터 · 조절계 · 전력량계 · 센서', dark: false },
  ]
  return (
    <section className="section">
      <div className="wrap grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHead
            eyebrow="Platform"
            title={<>현장 연결부터 AI까지,<br />하나의 환경에서.</>}
            desc="수집 장치만, 대시보드만 따로 사면 그 사이 연결은 늘 공장 몫이 됩니다. Factra는 결선부터 앱까지 한 구조로 만들고 책임집니다."
          />
          <FadeIn delay={0.1}>
            <ul className="mt-10 space-y-4">
              {[
                ['노코드', '수집 명세표만 있으면 설비 등록과 연결을 화면에서 끝냅니다. 설비가 늘어도 같습니다.'],
                ['공장의 언어 그대로', '공장이 쓰던 설비 번호를 그대로 데이터 이름으로 씁니다.'],
                ['읽기 전용 연결', '가동 중인 설비의 제어 로직은 건드리지 않습니다.'],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-4">
                  <span className="mt-2 h-2 w-2 shrink-0 bg-signal" />
                  <p className="text-[15.5px] text-fg-2"><b className="font-semibold text-fg">{t}</b> — {d}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10"><Button href="/platform/" variant="dark">Factra Platform 자세히</Button></div>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div className="space-y-2 border border-line bg-card p-6 md:p-8">
            {stack.map((l, i) => (
              <div key={l.t}>
                <div className={`flex items-center justify-between gap-4 px-5 py-5 ${l.dark ? 'bg-ink text-white' : l.accent ? 'border-2 border-dashed border-signal/60 bg-signal/[0.05]' : 'border border-line bg-paper'}`}>
                  <span className="text-[17px] font-bold">{l.t}</span>
                  <span className={`text-right text-[13px] ${l.dark ? 'text-on-ink-2' : 'text-fg-2'}`}>{l.d}</span>
                </div>
                {i < stack.length - 1 && <div className="flex justify-center py-1"><span className="mono text-[11px] text-fg-3">▲</span></div>}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

const steps = [
  { n: '01', t: '상담 · 둘러보기' },
  { n: '02', t: '제안 · 견적' },
  { n: '03', t: '계약 · 협약' },
  { n: '04', t: '현장 실측' },
  { n: '05', t: '설계' },
  { n: '06', t: '시공 · 활성화' },
  { n: '07', t: '검수' },
  { n: '08', t: '운영 · 고도화' },
]

function Process() {
  return (
    <section className="section bg-paper-2">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead eyebrow="How we work" title="상담에서 운영까지, 한 팀이 끝까지." desc="단계마다 산출물이 정해져 있어 담당자가 바뀌어도 현장에 되묻지 않습니다. 정부지원사업 사업계획서도 함께 준비합니다." />
          <FadeIn><Button href="/process/" variant="ghost-dark">도입 절차 자세히</Button></FadeIn>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4 lg:grid-cols-8">
          {steps.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.05} className="bg-paper-2 p-6 lg:min-h-[150px]">
              <p className="mono text-[13px] text-signal">{s.n}</p>
              <h3 className="mt-8 text-[16.5px] font-bold tracking-[-0.02em]">{s.t}</h3>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

const transform = [
  {
    step: 'DX',
    title: '설비를 데이터로',
    desc: '인버터·온도조절계·PLC·전력량계처럼 패널 화면에만 있던 값을 현장 수집 장치(게이트웨이)로 모읍니다. 제조사가 달라도, 가동 중인 설비를 멈추지 않고 읽기만 해서 연결합니다.',
    items: ['설비 데이터 수집 · 모니터링', '설비별 전력 사용량', 'MES 수주 · 재고 · 생산 · 품질'],
    proof: '화학소재 공장 · 4개 라인 91대 기기 연결 설계',
    image: '/images/process-plant.jpg',
  },
  {
    step: 'AX',
    title: '데이터를 판단으로',
    desc: '모인 데이터와 카메라 영상 위에서 AI가 판정합니다. 사람이 보고 읽고 확인하던 일을 라인 옆 엣지 장비가 사이클마다 대신합니다.',
    items: ['비전 검사 · 라벨 판독', '공정 이상 감지 · 분석', '위치 기반 안전 경보'],
    proof: '전자부품 공장 · 입고 라벨 판독 자동화 가동',
    image: '/images/optics.jpg',
  },
]

function Transformation() {
  return (
    <section className="bg-ink text-white grid-ink">
      <div className="wrap section">
        <SectionHead
          dark
          eyebrow="Factory Transformation"
          title={<>Factory + Transformation,<br />그래서 Factra입니다.</>}
          desc="공장을 디지털로, 그리고 AI로. 먼저 설비를 데이터로 잇고(DX), 그 위에서 AI가 판단하게(AX) 만듭니다. 두 단계를 한 팀이 이어서 하기 때문에, 수집한 데이터가 실제로 쓰입니다."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {transform.map((t, i) => (
            <FadeIn key={t.step} delay={i * 0.12} className="border border-line-ink bg-ink-2">
              <div className="relative h-[200px] overflow-hidden">
                <img src={t.image} alt="" className="h-full w-full object-cover opacity-55" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-2 to-transparent" />
                <span className="absolute bottom-5 left-7 font-[family-name:var(--font-display)] text-[64px] font-bold leading-none text-signal">{t.step}</span>
              </div>
              <div className="p-7 pt-4">
                <h3 className="text-[24px] font-bold tracking-[-0.02em]">{t.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-on-ink-2">{t.desc}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {t.items.map(it => <li key={it} className="border border-white/15 px-3 py-1.5 text-[13px]">{it}</li>)}
                </ul>
                <p className="mono mt-6 border-t border-line-ink pt-4 text-[12px] text-on-ink-3">CASE · {t.proof}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

const caseTeasers = [
  {
    tag: 'DX · 화학소재(접착제) 제조',
    title: <>4개 라인, 91대 설비를<br />하나의 데이터로.</>,
    desc: '인버터·온도조절계·PLC·칠러·전력량계 값이 패널마다 흩어져 있던 공장. 세 차례 현장 실측으로 설비 태그와 통신 방식을 전수 확인하고, 게이트웨이 9대로 163개 데이터 포인트를 모으는 수집 체계를 설계했습니다.',
    facts: [['상태', '구축 진행 중'], ['대상', '제조AI특화 스마트공장']],
    image: '/images/process-plant.jpg',
  },
  {
    tag: 'AX · 전자부품 제조',
    title: <>입고 릴 라벨 판독부터<br />자사 라벨 부착까지 자동으로.</>,
    desc: '공급사마다 제각각인 릴 라벨을 25MP 카메라로 찍어 AI가 라벨을 찾고 바코드·QR을 읽습니다. MES 입고 후 로봇이 붙일 라벨 좌표를 PLC로 넘기고, 두 번째 카메라가 결과를 다시 확인합니다. 개선 후 첫 운전 922건에서 비전 판독 NG는 0건이었습니다.',
    facts: [['상태', '현장 가동 중'], ['연동', 'PLC · MES · 로봇']],
    image: '/images/hands-electronics.jpg',
  },
]

function CaseTeaser() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead eyebrow="Cases" title="현장에서 하고 있는 일" />
          <FadeIn><Button href="/cases/" variant="ghost-dark">사례 전체 보기</Button></FadeIn>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {caseTeasers.map((c, i) => (
            <FadeIn key={c.tag} delay={i * 0.1} className="flex flex-col border border-line bg-card">
              <div className="aspect-[16/9] overflow-hidden bg-ink"><img src={c.image} alt="" className="h-full w-full object-cover" /></div>
              <div className="flex flex-1 flex-col p-8">
                <p className="eyebrow text-fg-2">{c.tag}</p>
                <h3 className="mt-4 text-[clamp(1.3rem,2vw,1.65rem)] font-bold leading-snug tracking-[-0.03em]">{c.title}</h3>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-fg-2">{c.desc}</p>
                <dl className="mt-7 grid grid-cols-2 gap-6 border-t border-line pt-5">
                  {c.facts.map(([k, v]) => (
                    <div key={k}><dt className="mono text-[11px] text-fg-3">{k}</dt><dd className="mt-1 text-[15px] font-semibold">{v}</dd></div>
                  ))}
                </dl>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Seo />
      <Hero />
      <Problems />
      <Transformation />
      <Products />
      <Proof />
      <Approach />
      <Process />
      <CaseTeaser />
      <CTA />
    </>
  )
}
