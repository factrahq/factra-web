import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, ScanLine, PackageX, Siren, Check, Gauge } from 'lucide-react'
import Seo from '@/components/layout/Seo'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/ui/FadeIn'
import SectionHead from '@/components/sections/SectionHead'
import CTA from '@/components/sections/CTA'
import { products } from '@/lib/site'

const ease = [0.16, 1, 0.3, 1] as const

const hudSteps = [
  { t: 'TRIGGER', v: 'PLC 촬영 요청 수신' },
  { t: 'CAPTURE', v: '25MP 촬영 · 5120×5120' },
  { t: 'DETECT', v: '라벨 영역 분할 (AI)' },
  { t: 'READ', v: '바코드 · QR · 문자 판독' },
  { t: 'MES', v: '입고 등록 응답 OK' },
  { t: 'OUTPUT', v: 'PLC ← 판정 · 부착 좌표' },
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
              제조 DX·AX를 위한 Factory Transformation, Factra. 흩어진 설비를 데이터로 잇고, 그 위에서 비전 검사와 AI가 사람이 하던 확인을 대신합니다.
              현장 실측부터 설치, 운영까지 직접 합니다.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5, ease }} className="mt-10 flex flex-wrap gap-3">
              <Button href="/contact/">도입 문의</Button>
              <Button href="/vision/" variant="ghost-light">Factra Vision 보기</Button>
            </motion.div>
          </div>

          {/* 검사 화면 느낌의 HUD */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.3, delay: 0.6, ease }}
            className="hidden lg:block"
          >
            <div className="finder relative overflow-hidden border border-white/15 bg-ink/70 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <span className="mono text-[11px] tracking-[0.1em] text-on-ink-2">STATION 01 · LIVE</span>
                <span className="mono flex items-center gap-2 text-[11px] text-ok"><span className="blink h-2 w-2 rounded-full bg-ok" />RUNNING</span>
              </div>
              <div className="relative">
                <img src="/images/pcb.jpg" alt="" className="h-[190px] w-full object-cover opacity-70" />
                <div className="scanline" />
                <div className="absolute left-[18%] top-[22%] h-[52%] w-[38%] border-2 border-signal">
                  <span className="mono absolute -top-6 left-0 bg-signal px-1.5 py-0.5 text-[10px] text-white">LABEL 0.97</span>
                </div>
                <div className="absolute right-[12%] top-[30%] h-[30%] w-[20%] border-2 border-ok">
                  <span className="mono absolute -bottom-6 right-0 bg-ok px-1.5 py-0.5 text-[10px] text-ink">QR OK</span>
                </div>
              </div>
              <ul className="divide-y divide-white/[0.07]">
                {hudSteps.map((s, i) => (
                  <motion.li
                    key={s.t}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + i * 0.18 }}
                    className="flex items-center justify-between px-5 py-2.5"
                  >
                    <span className="mono w-[76px] text-[11px] text-on-ink-3">{s.t}</span>
                    <span className="flex-1 text-[13px] text-on-ink">{s.v}</span>
                    <Check size={14} className="text-ok" />
                  </motion.li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-white/10 bg-ok/10 px-5 py-3">
                <span className="mono text-[11px] text-on-ink-2">JUDGE</span>
                <span className="mono text-[13px] font-medium text-ok">OK · 다음 사이클 대기</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-y-4 border-t border-white/10 pt-6 md:grid-cols-5">
          {['NVIDIA Jetson Edge', 'Modbus TCP / PLC', 'MES 연동', '산업용 카메라 25MP', 'UWB 위치추적'].map(t => (
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
    icon: ScanLine,
    title: '라벨을 사람이 읽고 입력합니다',
    desc: '입고 자재마다 다른 라벨 양식, 대소문자 하나 틀린 품번. 수작업 판독과 입력은 느리고, 실수는 뒤 공정에서야 드러납니다.',
  },
  {
    icon: PackageX,
    title: '불량을 늦게 알아 통째로 버립니다',
    desc: '인쇄 번짐·누락을 끝에서야 발견하면, 어디서부터 불량인지 몰라 롤·로트 전체를 폐기합니다. 찍는 순간 알면 그 한 장만 빼면 됩니다.',
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
          <SectionHead eyebrow="Products" title={<>보고, 재고, 기록하는<br />세 가지 제품.</>} />
          <FadeIn><p className="max-w-[380px] text-[15px] text-fg-2">모두 라인 옆 엣지 장비에서 돌아가며, 인터넷이 끊겨도 멈추지 않습니다. 데이터는 공장 안에 남습니다.</p></FadeIn>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
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
  { n: '4,339', u: '사이클', d: '실제 현장 운전 기록을 새 코드로 다시 돌려, PLC 판정·MES 값·부착 좌표가 전부 일치함을 확인' },
  { n: '677', u: '건', d: '배포 전에 매번 도는 자동 시험. 현장 판독 이미지 208장이 포함됩니다' },
  { n: '25', u: 'MP', d: '5120×5120 산업용 카메라로 릴 한 장 안의 작은 바코드까지 한 번에 읽습니다' },
  { n: '0', u: '클라우드 의존', d: '판정은 라인 옆 Jetson에서. 외부망 없이 동작하고 영상은 공장 밖으로 나가지 않습니다' },
]

function Proof() {
  return (
    <section className="relative overflow-hidden bg-ink text-white grid-ink">
      <div className="wrap section">
        <SectionHead
          dark
          eyebrow="Field-proven"
          title={<>데모가 아니라,<br />라인에서 매일 돌아가는 시스템입니다.</>}
          desc="Factra Vision은 전자부품 제조 현장의 입고 라벨 자동화 라인에서 시작했습니다. 그 현장에서 쌓인 기록이 곧 우리의 시험 기준입니다."
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
  const platform = ['카메라', 'PLC · 디지털 I/O', 'MES 연동', '운전 루프', '처리 이력', '운영 화면', '배포 · 롤백', '학습 도구']
  const app = ['검사 로직', 'AI 모델', '신호 의미', 'MES 업무 규격', '기준정보 화면']
  return (
    <section className="section">
      <div className="wrap grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHead
            eyebrow="Approach"
            title={<>검증된 플랫폼 위에<br />공장별 앱만 얹습니다.</>}
            desc="공장마다 처음부터 새로 만드는 SI는 느리고, 유지보수가 어렵습니다. Factra는 현장에서 검증된 공통 플랫폼을 그대로 두고, 공장마다 다른 검사 로직과 규격만 설정과 앱으로 붙입니다."
          />
          <FadeIn delay={0.1}>
            <ul className="mt-10 space-y-4">
              {[
                ['더 빠르게', '카메라·PLC·MES·이력·배포는 이미 돌아갑니다. 새 공장은 검사 로직에 집중합니다.'],
                ['더 안정적으로', '한 현장에서 고친 문제가 모든 현장에 반영됩니다.'],
                ['미리 확인하고', '현장 기록을 새 규칙으로 재생해, 배포 전에 결과가 어떻게 바뀌는지 숫자로 봅니다.'],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-4">
                  <span className="mt-2 h-2 w-2 shrink-0 bg-signal" />
                  <p className="text-[15.5px] text-fg-2"><b className="font-semibold text-fg">{t}</b> — {d}</p>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div className="border border-line bg-card p-6 md:p-8">
            <div className="border-2 border-dashed border-signal/60 bg-signal/[0.04] p-5">
              <p className="mono text-[11px] uppercase tracking-[0.1em] text-signal">Customer App · 공장마다 다름</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {app.map(a => <span key={a} className="border border-signal/30 bg-white px-3 py-1.5 text-[13.5px]">{a}</span>)}
              </div>
            </div>
            <div className="my-3 flex justify-center"><span className="mono text-[11px] text-fg-3">▼ 설정 · 앱 연결점</span></div>
            <div className="bg-ink p-5 text-white">
              <p className="mono text-[11px] uppercase tracking-[0.1em] text-on-ink-2">Factra Platform · 공통</p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {platform.map(a => <span key={a} className="border border-white/15 px-2 py-2 text-center text-[13px]">{a}</span>)}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {['산업용 카메라', 'Jetson 엣지', 'PLC · 센서 · 경광등'].map(h => (
                <span key={h} className="border border-line bg-paper py-2 text-[12.5px] text-fg-2">{h}</span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

const steps = [
  { n: '01', t: '현장 실측', d: '엔지니어가 라인에 가서 공정·설비·신호를 직접 측정합니다. 사진과 통신 기록은 Factra Field에 남습니다.' },
  { n: '02', t: '과제 정의', d: '무엇을 언제 판정할지, 성공 기준(판독률·사이클 타임)을 숫자로 정합니다.' },
  { n: '03', t: 'PoC · 시뮬레이션', d: '가상 PLC·가상 장비로 먼저 돌려 보고, 실제 이미지로 정확도를 확인합니다.' },
  { n: '04', t: '설치 · 연동', d: '카메라·조명·엣지 장비를 설치하고 PLC·MES·경광등과 연결합니다.' },
  { n: '05', t: '운영 · 개선', d: '원격 배포와 즉시 롤백, 처리 이력과 기록 재생으로 계속 다듬습니다.' },
]

function Process() {
  return (
    <section className="section bg-paper-2">
      <div className="wrap">
        <SectionHead eyebrow="How we work" title="실측에서 운영까지, 한 팀이 끝까지." desc="중간에 손이 바뀌지 않습니다. 현장을 잰 엔지니어가 설치하고, 운영까지 책임집니다." />
        <div className="mt-16 grid gap-px border border-line bg-line md:grid-cols-5">
          {steps.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.07} className="relative bg-paper-2 p-7 md:min-h-[280px]">
              <p className="mono text-[13px] text-signal">{s.n}</p>
              <h3 className="mt-10 text-[19px] font-bold tracking-[-0.02em]">{s.t}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-fg-2">{s.d}</p>
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
    desc: '인버터·온도조절계·PLC·전력량계처럼 패널 화면에만 있던 값을 게이트웨이로 모읍니다. 제조사가 달라도, 가동 중인 설비를 멈추지 않고 읽기만 해서 연결합니다.',
    items: ['설비 데이터 수집 · 모니터링', '설비별 전력 사용량', '수기 기록 대체'],
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
    tag: 'AX · 전자부품 제조',
    title: <>입고 릴 라벨 판독부터<br />자사 라벨 부착까지, 사람 손 없이.</>,
    desc: '공급사마다 제각각인 릴 라벨을 25MP 카메라로 찍어 AI가 라벨을 찾고 바코드·QR을 읽습니다. MES 입고 후 로봇이 붙일 라벨 좌표를 PLC로 넘기고, 두 번째 카메라가 결과를 다시 확인합니다.',
    facts: [['상태', '현장 가동 중'], ['연동', 'PLC · MES · 로봇']],
    image: '/images/hands-electronics.jpg',
  },
  {
    tag: 'DX · 화학소재(접착제) 제조',
    title: <>4개 라인, 91대 설비를<br />하나의 데이터로.</>,
    desc: '인버터·온도조절계·PLC·칠러·전력량계 값이 패널마다 흩어져 있던 공장. 세 차례 현장 실측으로 설비 태그와 통신 방식을 전수 확인하고, 게이트웨이 9대로 163개 데이터 포인트를 모으는 수집 체계를 설계했습니다.',
    facts: [['상태', '구축 진행 중'], ['대상', '제조AI특화 스마트공장']],
    image: '/images/process-plant.jpg',
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
