import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Activity, MapPin, ClipboardList, ScanEye, ShieldAlert, DoorClosed, History, Layers } from 'lucide-react'
import Seo from '@/components/layout/Seo'
import PageHero from '@/components/sections/PageHero'
import SectionHead from '@/components/sections/SectionHead'
import CTA from '@/components/sections/CTA'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/ui/FadeIn'
import UnityTwin, { type TwinHandle } from '@/components/twin/UnityTwin'
import { machines, initialLive, step, isAlarm, type Live } from '@/lib/demo-factory'
import { twinLivePayload, twinEventText, type TwinEvent } from '@/lib/twin'

const layers = [
  { icon: Activity, k: 'Factra Platform', t: '설비 상태 · 측정값', d: '가동·대기·정지와 알람을 설비 위 경광등 색으로, 측정값을 라벨로 보여 줍니다. 설비를 누르면 실시간 값과 추이가 나옵니다.', s: '데모 연동' },
  { icon: MapPin, k: 'Factra RTLS', t: '위치 · 위험 감지', d: 'UWB 태그를 단 지게차·대차·작업자가 실제 위치대로 움직입니다. 접근 경보와 출입 제한 구역 진입을 3D 위에서 바로 봅니다.', s: '데모 연동 · 하드웨어 개발 중' },
  { icon: ClipboardList, k: 'Factra MES', t: '작업지시 흐름', d: '대차에 실린 작업지시와 품목·수량, 어느 공정에서 어디로 가는지를 위치와 함께 봅니다. "그 자재 지금 어디 있지"에 바로 답합니다.', s: '데모 연동' },
  { icon: ScanEye, k: 'Factra Vision', t: '학습용 합성 이미지', d: '3D 모델로 조명·각도·불량 모양을 바꿔 가며 이미지를 만들어, 모으기 어려운 불량 학습 데이터를 보탭니다. 성능은 실제 현장 이미지로 확인합니다.', s: '준비 중' },
]

const safety = [
  { icon: ShieldAlert, t: '지게차–작업자 접근 경보', d: '태그 사이 거리가 3 m 안으로 들어오면 3D 위에 경보 반경이 켜지고 기록이 남습니다. 거리 기준은 현장마다 정합니다.' },
  { icon: DoorClosed, t: '출입 제한 구역', d: '수전실·로봇 셀처럼 정해 둔 구역에 태그가 들어가면 누가 언제 들어갔는지 남기고 담당자에게 알립니다.' },
  { icon: History, t: '기록으로 검토', d: '경보가 난 시각과 위치, 그때의 설비 상태를 함께 남겨 아차사고를 사람 기억이 아닌 기록으로 검토합니다.' },
]

const steps = [
  ['도면으로 배치 만들기', '공장 도면과 설비 목록으로 3D 배치를 만듭니다. 처음엔 기본 도형으로 빠르게, 필요한 설비만 정밀하게.'],
  ['있는 데이터 잇기', 'Platform·MES·RTLS가 이미 모으는 데이터를 그대로 연결합니다. 트윈을 위해 따로 수집 장치를 달지 않습니다.'],
  ['규칙과 알림', '접근 거리, 제한 구역, 설비 알람 기준을 현장에 맞춰 정하고 알림 대상을 정합니다.'],
  ['시뮬레이션 (선택)', '운반 장비 대수나 배치를 바꿨을 때 처리량이 어떻게 달라지는지, 투자 전에 미리 돌려 봅니다.'],
]

function DemoTwin() {
  const twin = useRef<TwinHandle>(null)
  const [live, setLive] = useState<Live>(initialLive)
  const [log, setLog] = useState<{ time: string; msg: string; sev: string }[]>([])
  useEffect(() => { const id = setInterval(() => setLive(prev => step(prev)), 1500); return () => clearInterval(id) }, [])
  const alarmIds = useMemo(() => {
    const s = new Set<string>()
    for (const m of machines) for (const p of m.points) if (isAlarm(p, live[m.id][p.key].at(-1)!)) s.add(m.id)
    return s
  }, [live])
  const payload = useMemo(() => twinLivePayload(live, alarmIds), [live, alarmIds])
  const onEvent = (e: TwinEvent) => {
    const ev = twinEventText(e)
    if (!ev) return
    const d = new Date()
    setLog(prev => [{ time: d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), msg: ev.msg, sev: ev.sev }, ...prev].slice(0, 4))
  }
  return (
    <div className="border border-line-ink bg-ink-2 p-3 md:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="mono flex items-center gap-2 text-[12px] text-ok"><span className="blink h-2 w-2 rounded-full bg-ok" />LIVE <span className="text-on-ink-2">가상 공장 A · 설비 10대 · UWB 태그 7개</span></p>
        <div className="flex gap-1">
          {([['iso', '전체'], ['top', '위에서'], ['floor', '현장 높이']] as const).map(([k, l]) => (
            <button key={k} type="button" onClick={() => twin.current?.view(k)} className="border border-line-ink px-2.5 py-1 text-[12px] text-on-ink-2 hover:border-white/40 hover:text-white">{l}</button>
          ))}
        </div>
      </div>
      <UnityTwin ref={twin} live={payload} onEvent={onEvent} className="aspect-[4/3] w-full md:aspect-[16/9]" />
      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
        <ul className="min-h-[24px] space-y-1 text-[12.5px]">
          {log.length === 0 ? <li className="text-on-ink-3">지게차가 작업자에게 다가가거나 누군가 수전실에 들어가면 여기에 기록됩니다.</li>
            : log.map((l, i) => <li key={i} className="flex gap-3"><span className="mono text-on-ink-3">{l.time}</span><span style={{ color: l.sev === 'critical' ? '#FF7A47' : '#E0A82E' }}>{l.msg}</span></li>)}
        </ul>
        <Link href="/platform/demo/#twin" className="text-[13px] font-semibold text-signal-2 hover:text-white">측정값까지 보려면 Platform 데모에서 →</Link>
      </div>
    </div>
  )
}

export default function TwinPage() {
  return (
    <>
      <Seo title="Factra Twin — 3D 디지털 트윈" description="설비 데이터, 작업지시, UWB 위치, 비전 검사를 하나의 3D 공장 위에. 브라우저에서 바로 움직이는 가상 공장 데모를 확인하세요." />
      <PageHero
        eyebrow="Factra Twin · 데모 공개"
        image="/images/control-room.jpg"
        title={<>공장을 3D로,<br />데이터는 그대로.</>}
        desc="Factra Twin은 설비 데이터(Platform), 작업지시(MES), UWB 위치(RTLS)를 하나의 3D 공장 위에 겹쳐 보여 주는 디지털 트윈입니다. 따로 보던 화면을 공장 모양 그대로 한곳에서 봅니다."
      >
        <Button href="#demo">3D 데모 보기</Button>
        <Button href="/platform/demo/#twin" variant="ghost-light">Platform 데모에서 열기</Button>
      </PageHero>

      <section id="demo" className="bg-ink text-white grid-ink scroll-mt-[68px]">
        <div className="wrap section">
          <SectionHead dark eyebrow="Live demo" title="직접 돌려 보세요." desc="모든 값은 가상 공장 데이터이며 브라우저 안에서만 움직입니다. 드래그로 회전하고, 휠로 확대하고, 설비나 사람을 눌러 보세요." />
          <FadeIn delay={0.1} className="mt-12"><DemoTwin /></FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="One factory, four layers" title={<>따로 보던 데이터를<br />한 공장 위에.</>} desc="트윈은 새 데이터를 만드는 시스템이 아니라, 이미 모으는 데이터를 공장 모양 그대로 보여 주는 창입니다." />
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {layers.map((l, i) => (
              <FadeIn key={l.k} delay={i * 0.08} className="border border-line bg-card p-8">
                <div className="flex items-start justify-between gap-4">
                  <l.icon size={28} strokeWidth={1.6} className="text-signal" />
                  <span className="mono border border-line px-2 py-0.5 text-[11px] text-fg-3">{l.s}</span>
                </div>
                <p className="mono mt-8 text-[12px] text-fg-3">{l.k}</p>
                <h3 className="mt-1.5 text-[24px] font-bold tracking-[-0.02em]">{l.t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-fg-2">{l.d}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-white grid-ink">
        <div className="wrap section grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <SectionHead dark eyebrow="Safety" title={<>위험한 순간을<br />위치로 남깁니다.</>} />
            <FadeIn delay={0.1}>
              <p className="lead mt-6 text-on-ink-2">Factra RTLS의 UWB 태그 위치를 트윈 위에 올리면, 경보가 어디서 왜 났는지를 공장 배치와 함께 봅니다.</p>
              <p className="mt-6 text-[13px] leading-relaxed text-on-ink-3">접근 경보와 구역 알림은 사람에게 알리고 기록하는 보조 수단입니다. 설비를 멈추는 안전장치를 대신하지 않습니다.</p>
              <div className="mt-8"><Button href="/rtls/" variant="ghost-light">Factra RTLS 보기</Button></div>
            </FadeIn>
          </div>
          <div className="grid gap-px border border-line-ink bg-line-ink">
            {safety.map((s, i) => (
              <FadeIn key={s.t} delay={i * 0.08} className="flex gap-5 bg-ink-2 p-6 md:p-7">
                <s.icon size={24} strokeWidth={1.6} className="mt-0.5 shrink-0 text-signal" />
                <div>
                  <h3 className="text-[18px] font-semibold">{s.t}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-on-ink-2">{s.d}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="For Factra Vision" title={<>모으기 어려운 불량,<br />3D로 만들어 보탭니다.</>} />
            <FadeIn delay={0.1}>
              <p className="lead mt-6 text-fg-2">비전 검사 AI는 불량 사진이 많아야 잘 배우는데, 좋은 공장일수록 불량이 드뭅니다. 트윈의 3D 모델로 조명·카메라 각도·불량 모양을 바꿔 가며 학습용 이미지를 만들어 Factra Vision 학습 도구에 넣는 기능을 준비하고 있습니다.</p>
              <ul className="mt-8 space-y-3 text-[15px] text-fg-2">
                <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 bg-signal" />합성 이미지는 실제 이미지를 보태는 용도이고, 성능 판단은 언제나 현장 이미지로 합니다.</li>
                <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 bg-signal" />라벨(불량 위치·종류)이 이미지와 함께 자동으로 생겨 표시 작업이 줄어듭니다.</li>
              </ul>
              <div className="mt-8"><Button href="/vision/" variant="ghost-dark">Factra Vision 보기</Button></div>
            </FadeIn>
          </div>
          <div>
            <SectionHead eyebrow="How we start" title="작게 시작합니다." />
            <FadeIn delay={0.1}>
              <ol className="mt-10 border-t-2 border-fg">
                {steps.map(([t, d], i) => (
                  <li key={t} className="flex gap-5 border-b border-line py-5">
                    <span className="mono pt-0.5 text-[13px] text-signal">0{i + 1}</span>
                    <div>
                      <p className="text-[17px] font-semibold">{t}</p>
                      <p className="mt-1 text-[14.5px] text-fg-2">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 flex items-center gap-2 text-[13px] text-fg-3"><Layers size={15} />Unity 기반 · 웹 브라우저에서 바로 열립니다 (설치 없음)</p>
            </FadeIn>
          </div>
        </div>
      </section>

      <CTA title="우리 공장에 무엇을 얹을지 같이 보겠습니다." desc="배치도와 설비 목록, 지금 모으고 있는 데이터를 알려 주시면 트윈에 무엇을 올릴 수 있고 어디서부터 시작하면 좋을지 같이 정합니다." />
    </>
  )
}
