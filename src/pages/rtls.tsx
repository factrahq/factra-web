import { ShieldAlert, MapPin, Plug, Cpu, Shirt, HardHat, Truck } from 'lucide-react'
import Seo from '@/components/layout/Seo'
import PageHero from '@/components/sections/PageHero'
import SectionHead from '@/components/sections/SectionHead'
import CTA from '@/components/sections/CTA'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/ui/FadeIn'

const modes = [
  {
    icon: ShieldAlert,
    t: '접근 경보',
    en: 'TWR · Two-Way Ranging',
    d: '태그끼리 직접 거리를 잽니다. 지게차와 작업자가 정해 둔 거리 안으로 들어오면 양쪽에 즉시 경보. 카메라 사각지대·코너에서도 동작합니다.',
  },
  {
    icon: MapPin,
    t: '위치 추적',
    en: 'TDoA · Time Difference of Arrival',
    d: '천장의 앵커가 태그 신호를 받아 실시간 위치를 계산합니다. 사람·자재·운반 장비의 동선과 체류 시간을 데이터로 남깁니다.',
  },
]

const tags = [
  { icon: Shirt, t: '얇은 조끼형', d: '작업복·조끼에 넣는 얇은 태그' },
  { icon: HardHat, t: '작업자형', d: '목걸이 · 안전모 부착' },
  { icon: Truck, t: '견고형', d: '지게차 · 카트 · 운반 장비' },
]

const uses = [
  ['지게차–작업자 충돌 예방', '설정 거리 안 접근 시 진동·소리·경광등 경보, 접근 이력 기록'],
  ['위험 구역 출입 관리', '구역별 출입·체류 시간, 허가 없는 진입 알림'],
  ['MES 보조 위치추적', '자재·대차가 지금 어느 공정 앞에 있는지 MES로 전달'],
  ['동선 분석', '사람·장비 이동 경로를 쌓아 레이아웃 개선 근거로'],
]

export default function Rtls() {
  return (
    <>
      <Seo title="Factra RTLS — UWB 실시간 위치추적" description="하나의 UWB 앵커·태그 하드웨어로 지게차–작업자 접근 경보와 실시간 위치 추적을 함께. 데이터 개방 API로 기존 시스템과 연동합니다." />
      <PageHero
        eyebrow="Factra RTLS · 개발 중"
        image="/images/warehouse.jpg"
        title={<>보이지 않는 곳에서도<br />거리를 압니다.</>}
        desc="Factra RTLS는 UWB(초광대역) 기반 실시간 위치추적 시스템입니다. 하나의 하드웨어로 접근 경보와 위치 추적을 모두 하고, 용도는 펌웨어 설정으로 바꿉니다."
      >
        <Button href="/contact/">파일럿 참여 문의</Button>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Two modes" title="하드웨어는 하나, 용도는 설정으로." desc="태그를 바꾸지 않고 접근 경보와 위치 추적을 모두 지원합니다. 처음엔 경보만, 나중에 앵커를 더해 위치 추적으로 넓힐 수 있습니다." />
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {modes.map((m, i) => (
              <FadeIn key={m.t} delay={i * 0.1} className="border border-line bg-card p-8 md:p-10">
                <m.icon size={30} strokeWidth={1.6} className="text-signal" />
                <p className="mono mt-10 text-[12px] text-fg-3">{m.en}</p>
                <h3 className="mt-2 text-[26px] font-bold tracking-[-0.02em]">{m.t}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-fg-2">{m.d}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-white grid-ink">
        <div className="wrap section grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead dark eyebrow="Proximity alert" title={<>지게차가 다가오면,<br />보기 전에 먼저 압니다.</>} />
            <FadeIn delay={0.1}>
              <p className="lead mt-6 text-on-ink-2">
                카메라 기반 감지는 시야가 막히면 놓칩니다. UWB는 선반·벽 너머에서도 태그 사이 거리를 직접 재기 때문에, 교차로와 랙 사이 통로에서 특히 효과적입니다.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.15}>
            {/* 접근 경보 도식 */}
            <div className="relative aspect-square max-h-[460px] w-full border border-line-ink bg-ink-2">
              <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
                {[150, 105, 60].map((r, i) => (
                  <circle key={r} cx="150" cy="210" r={r} fill={i === 2 ? 'rgba(255,90,31,0.18)' : 'none'} stroke={i === 2 ? '#FF5A1F' : 'rgba(255,255,255,0.18)'} strokeDasharray={i === 2 ? '0' : '4 6'} />
                ))}
                <rect x="132" y="192" width="36" height="36" fill="#FF5A1F" />
                <text x="150" y="250" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="IBM Plex Mono">FORKLIFT</text>
                <circle cx="196" cy="168" r="9" fill="#fff" />
                <text x="210" y="160" fill="#FF7A47" fontSize="11" fontFamily="IBM Plex Mono">WORKER · 2.1m · ALERT</text>
                <circle cx="318" cy="96" r="9" fill="#2BB673" />
                <text x="300" y="80" textAnchor="middle" fill="#A3A6AC" fontSize="11" fontFamily="IBM Plex Mono">8.4m · SAFE</text>
                {[[30, 30], [370, 30], [30, 370], [370, 370]].map(([x, y]) => (
                  <g key={`${x}${y}`}>
                    <path d={`M${x - 7} ${y + 6} L${x} ${y - 7} L${x + 7} ${y + 6} Z`} fill="none" stroke="#A3A6AC" />
                  </g>
                ))}
                <text x="30" y="392" fill="#6B6E75" fontSize="10" fontFamily="IBM Plex Mono">ANCHOR</text>
              </svg>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="Use cases" title="이런 곳에 씁니다." />
            <FadeIn delay={0.1}>
              <dl className="mt-10 border-t-2 border-fg">
                {uses.map(([k, v]) => (
                  <div key={k} className="border-b border-line py-5">
                    <dt className="text-[17px] font-semibold">{k}</dt>
                    <dd className="mt-1 text-[14.5px] text-fg-2">{v}</dd>
                  </div>
                ))}
              </dl>
            </FadeIn>
          </div>
          <div>
            <SectionHead eyebrow="Hardware" title="직접 설계한 앵커와 태그" />
            <FadeIn delay={0.1}>
              <div className="mt-10 grid grid-cols-3 gap-3">
                {tags.map(t => (
                  <div key={t.t} className="border border-line bg-card p-5">
                    <t.icon size={22} strokeWidth={1.6} />
                    <p className="mt-5 text-[15px] font-semibold">{t.t}</p>
                    <p className="mt-1 text-[13px] text-fg-2">{t.d}</p>
                  </div>
                ))}
              </div>
              <ul className="mt-6 space-y-3 text-[15px] text-fg-2">
                <li className="flex gap-3"><Cpu size={18} className="mt-0.5 shrink-0 text-signal" />보드·펌웨어·케이스를 직접 설계 — 현장 요구에 맞춰 바꿀 수 있습니다</li>
                <li className="flex gap-3"><Plug size={18} className="mt-0.5 shrink-0 text-signal" />처음부터 데이터 개방 API — 기존 MES·안전관리 시스템에 바로 연동</li>
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      <CTA title="파일럿 현장을 찾고 있습니다." desc="지게차가 다니는 창고·공장에서 접근 경보를 먼저 시험해 보실 파트너를 모십니다. 통로 도면과 지게차 대수만 알려 주세요." />
    </>
  )
}
