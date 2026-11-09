import { Activity, Zap, ShieldCheck, LayoutDashboard, Bot, Cable, Replace, Radar, Network, Tags, MousePointerClick, Cloud, Server } from 'lucide-react'
import Seo from '@/components/layout/Seo'
import PageHero from '@/components/sections/PageHero'
import SectionHead from '@/components/sections/SectionHead'
import CTA from '@/components/sections/CTA'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/ui/FadeIn'

// 3층 구조: 현장 기기 → 게이트웨이 → 플랫폼 → 운영 앱·AI
const layers = [
  {
    tag: 'FIELD',
    title: '현장 기기',
    items: ['PLC (LS · 미쓰비시 · 지멘스 · 옴론 등)', '인버터', '온도조절계', '전력량계 · CT', '진동 · 압력 · 근접 센서', '칠러 · 보일러 컨트롤러'],
  },
  {
    tag: 'EDGE',
    title: 'Factra Gateway',
    items: ['설비 값을 모아 보내는 현장 수집 장치', 'RS-485 · Ethernet · Wi-Fi', 'Modbus RTU / TCP', 'PLC 전용 프로토콜', '제어반 · 통신선 단위로 배치', '끊겨도 먼저 저장 후 전송'],
  },
  {
    tag: 'PLATFORM',
    title: 'Factra Platform',
    items: ['설비 · 디바이스 · 데이터 포인트 모델', '노코드 연결 · 등록', 'MQTT / TLS 암호화 수집', '공통 규격으로 표준화'],
  },
  {
    tag: 'APPS · AI',
    title: '운영 앱 · AI',
    items: ['설비 · 가동률', '에너지', '품질', '통합 관제', 'MES 수주 · 재고 · 생산 · 품질', 'AI 이상 감지 · 에이전트'],
  },
]

const apps = [
  { icon: Activity, t: '설비 · 가동률', d: '가동/정지·사이클·알람을 자동으로 모아 설비별 가동률을 계산합니다. 설비 앞에 가지 않아도 상태를 봅니다.' },
  { icon: Zap, t: '에너지', d: '회로(차단기) 단위 전력량을 모아 설비·라인별 사용량과 피크를 봅니다. 절감 근거가 숫자로 남습니다.' },
  { icon: ShieldCheck, t: '품질', d: '온도·압력·속도처럼 품질을 좌우하는 변수를 규격과 비교해 감시하고, 벗어나면 바로 알립니다.' },
  { icon: LayoutDashboard, t: '통합 관제', d: '라인 전체를 한 화면에. 공장 도면 위에서 설비 상태와 알람을 한눈에 봅니다.' },
  { icon: Bot, t: 'AI', d: '쌓인 데이터로 이상 징후를 찾고 예지보전 기준을 만듭니다. 묻는 말에 데이터로 답하는 AI 에이전트를 붙입니다.' },
]

const types = [
  { k: 'A', icon: Cable, t: '기존 기기 통신 연동', d: '이미 있는 PLC·컨트롤러·인버터에 통신선을 연결해 값을 읽습니다. 가장 빠르고 저렴합니다.', note: '가동 중 설비는 읽기만 · 제어 로직 변경 없음' },
  { k: 'B', icon: Replace, t: '통신 가능 기기로 교체', d: '통신 포트가 없는 오래된 조절계·계기는 같은 기능의 통신 가능 모델로 1:1 교체합니다.', note: '예) 온도조절계 교체 후 Modbus 연결' },
  { k: 'C', icon: Radar, t: '센서 신설', d: '데이터 원천이 없는 곳에는 진동·압력·전력·근접 센서를 새로 붙입니다.', note: '예) 회로별 전력량계, 구동부 진동센서' },
]

const why = [
  { icon: Tags, t: '공장의 언어 그대로', d: '공장이 쓰던 설비 번호(태그)를 그대로 데이터 식별자로 씁니다. 새 이름을 외울 필요가 없습니다.' },
  { icon: MousePointerClick, t: '노코드 엔지니어링', d: '수집 명세표만 있으면 설비·데이터 포인트 등록과 게이트웨이 연결을 화면에서 끝냅니다. 늘릴 때도 같습니다.' },
  { icon: Network, t: '대수만 넣으면 견적', d: '설비 1대당 표준 구성이 정해져 있어, 설비 대수를 넣으면 게이트웨이·시공·클라우드 규모가 바로 나옵니다.' },
]

export default function Platform() {
  return (
    <>
      <Seo title="Factra Platform — 설비 데이터 수집·운영 플랫폼 (DX)" description="현장 수집 장치(게이트웨이)로 PLC·인버터·온도조절계·전력량계를 잇고, 노코드로 표준화해 설비·에너지·품질 운영 앱과 AI까지. 제조 DX를 위한 Factra Platform." />
      <PageHero
        eyebrow="Factra Platform · DX"
        image="/images/control-room.jpg"
        title={<>현장 연결부터 운영 앱, AI까지<br />하나의 환경에서.</>}
        desc="Factra Platform은 설비 데이터 수집·운영 플랫폼입니다. 현장 수집 장치(게이트웨이)로 설비 값을 모으고, 노코드로 데이터를 표준화하고, 그 위에서 설비·에너지·품질 앱과 AI를 바로 씁니다."
      >
        <Button href="/contact/">도입 상담</Button>
        <Button href="/platform/demo/" variant="ghost-light">데모 보기</Button>
      </PageHero>

      {/* 3층 구조 */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Architecture" title="기기에서 AI까지, 네 층을 한 번에." desc="수집 장치만 파는 회사, 대시보드만 만드는 회사가 따로 있으면 그 사이가 늘 비어 있습니다. Factra는 현장 결선부터 앱까지 한 구조로 책임집니다." />
          <div className="mt-16 grid gap-4 lg:grid-cols-4">
            {layers.map((l, i) => (
              <FadeIn key={l.tag} delay={i * 0.08} className={`relative border p-7 ${i === 1 || i === 2 ? 'border-ink bg-ink text-white' : 'border-line bg-card'}`}>
                <p className={`mono text-[12px] ${i === 1 || i === 2 ? 'text-signal' : 'text-fg-3'}`}>{String(i + 1).padStart(2, '0')} · {l.tag}</p>
                <h3 className="mt-6 text-[21px] font-bold tracking-[-0.02em]">{l.title}</h3>
                <ul className={`mt-5 space-y-2 text-[14.5px] ${i === 1 || i === 2 ? 'text-on-ink-2' : 'text-fg-2'}`}>
                  {l.items.map(it => <li key={it} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 bg-signal" />{it}</li>)}
                </ul>
                {i < layers.length - 1 && <span className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 place-items-center bg-signal text-[12px] text-white lg:grid">→</span>}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 운영 앱 */}
      <section className="bg-ink text-white grid-ink">
        <div className="wrap section">
          <SectionHead dark eyebrow="Apps" title={<>데이터를 모으는 데서 끝나지 않게,<br />바로 쓰는 운영 앱.</>} desc="수집한 데이터는 운영 앱에서 바로 씁니다. 필요한 앱만 골라 시작하고, 나중에 더합니다. 수주·재고·생산·품질 업무는 같은 기준정보를 쓰는 Factra MES로 이어집니다." />
          <FadeIn delay={0.1}><div className="mt-8"><Button href="/mes/" variant="ghost-light">Factra MES 보기</Button></div></FadeIn>
          <div className="mt-16 grid gap-px border border-line-ink bg-line-ink sm:grid-cols-2 lg:grid-cols-5">
            {apps.map((a, i) => (
              <FadeIn key={a.t} delay={i * 0.07} className="bg-ink p-7 lg:min-h-[280px]">
                <a.icon size={26} strokeWidth={1.6} className="text-signal" />
                <h3 className="mt-10 text-[19px] font-bold">{a.t}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-on-ink-2">{a.d}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 연결 3유형 */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Connection types" title="어떤 설비든, 세 가지 방법 중 하나로." desc="실측 단계에서 설비마다 A·B·C를 판정합니다. 이 판정이 곧 견적의 근거가 됩니다." />
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {types.map((t, i) => (
              <FadeIn key={t.k} delay={i * 0.1} className="border border-line bg-card p-8">
                <div className="flex items-start justify-between">
                  <span className="font-[family-name:var(--font-display)] text-[56px] font-bold leading-none text-signal">{t.k}</span>
                  <t.icon size={26} strokeWidth={1.6} />
                </div>
                <h3 className="mt-8 text-[21px] font-bold tracking-[-0.02em]">{t.t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-fg-2">{t.d}</p>
                <p className="mt-6 border-t border-line pt-4 text-[13.5px] text-fg-3">{t.note}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 게이트웨이 + 차별점 */}
      <section className="section bg-paper-2">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:items-center">
          <FadeIn>
            <div className="finder relative border border-line bg-card p-8 md:p-10">
              <p className="mono text-[12px] text-fg-3">FACTRA GATEWAY · EDGE</p>
              <svg viewBox="0 0 420 220" className="mt-6 w-full">
                <rect x="140" y="70" width="140" height="80" fill="#0E0F11" />
                <rect x="152" y="82" width="10" height="10" fill="#2BB673" />
                <rect x="168" y="82" width="10" height="10" fill="#FF5A1F" />
                <text x="210" y="125" textAnchor="middle" fill="#F4F4F1" fontSize="13" fontFamily="IBM Plex Mono">GATEWAY</text>
                {[['RS-485', 30], ['Ethernet', 110], ['Wi-Fi', 190]].map(([l, y]) => (
                  <g key={l as string}>
                    <line x1="20" y1={(y as number) + 10} x2="140" y2="110" stroke="#C9C9C3" strokeDasharray="3 4" />
                    <text x="8" y={(y as number) + 5} fill="#55575C" fontSize="11" fontFamily="IBM Plex Mono">{l}</text>
                  </g>
                ))}
                <line x1="280" y1="110" x2="400" y2="110" stroke="#FF5A1F" strokeWidth="2" />
                <text x="340" y="100" textAnchor="middle" fill="#FF5A1F" fontSize="11" fontFamily="IBM Plex Mono">MQTT/TLS</text>
                <text x="340" y="130" textAnchor="middle" fill="#55575C" fontSize="11" fontFamily="IBM Plex Mono">→ Platform</text>
              </svg>
              <dl className="mt-6 grid grid-cols-2 gap-px border border-line bg-line text-[13.5px]">
                {[
                  ['하는 일', '설비 값을 모아 플랫폼으로 보냄'],
                  ['배치', '제어반 · 통신선 단위'],
                                    ['통신', 'RS-485 · Ethernet · Wi-Fi'],
                  ['원칙', '가동 설비는 읽기 전용'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-card p-4"><dt className="mono text-[11px] text-fg-3">{k}</dt><dd className="mt-1 font-semibold">{v}</dd></div>
                ))}
              </dl>
            </div>
          </FadeIn>
          <div>
            <SectionHead eyebrow="Why Factra" title={<>묶지 않고 늘리고,<br />코딩 없이 연결합니다.</>} />
            <FadeIn delay={0.1}>
              <ul className="mt-10 space-y-7">
                {why.map(w => (
                  <li key={w.t} className="flex gap-4">
                    <w.icon size={22} className="mt-0.5 shrink-0 text-signal" />
                    <div><p className="text-[17px] font-semibold">{w.t}</p><p className="mt-1 text-[14.5px] leading-relaxed text-fg-2">{w.d}</p></div>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 도입 형태 */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Deployment" title="도입 형태" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <FadeIn className="border border-line bg-card p-8">
              <Cloud size={26} strokeWidth={1.6} className="text-signal" />
              <h3 className="mt-6 text-[21px] font-bold">클라우드 구독</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-fg-2">공장 안에 서버를 두지 않습니다. 국내 클라우드에서 운영하고, 서버·유지보수 비용이 구독료에 포함됩니다. 데이터 규모에 맞춰 단계를 고릅니다.</p>
            </FadeIn>
            <FadeIn delay={0.1} className="border border-line bg-card p-8">
              <Server size={26} strokeWidth={1.6} className="text-signal" />
              <h3 className="mt-6 text-[21px] font-bold">공장 내 설치</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-fg-2">데이터를 공장 밖으로 내보낼 수 없는 경우, 공장 안 서버에 설치합니다. 구축 후 유지보수 계약으로 운영을 이어갑니다.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      <CTA title="우리 공장 설비, 몇 대부터 연결할까요?" desc="라인 수와 설비 대수, 지금 기록하는 방식(수기·표시기·없음)만 알려 주세요. 연결 방법과 대략의 규모를 먼저 답드립니다." />
    </>
  )
}
