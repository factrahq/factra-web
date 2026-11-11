import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Box, Factory, LineChart, Bell, Bot, ArrowLeft } from 'lucide-react'
import Seo from '@/components/layout/Seo'
import { machines, initialLive, step, isAlarm, fmt, DEMO_START_MIN, type Live } from '@/lib/demo-factory'
import { pastEvents, type LogEvent } from '@/lib/demo-data'
import Overview, { type LiveEvent } from '@/components/demo/Overview'
import Equipment from '@/components/demo/Equipment'
import Analysis from '@/components/demo/Analysis'
import Events from '@/components/demo/Events'
import Assistant from '@/components/demo/Assistant'
import Twin, { type TwinLog } from '@/components/demo/Twin'
import { twinEventText, type TwinEvent } from '@/lib/twin'

const views = [
  { id: 'overview', icon: LayoutDashboard, t: '통합 관제', s: '관제', d: '공장 배치도 위에서 설비 상태와 실시간 값을 봅니다.' },
  { id: 'twin', icon: Box, t: '3D 트윈', s: '3D', d: '같은 공장을 3D로 봅니다. 설비 측정값과 UWB 태그 위치, 위험 감지가 실시간으로 움직입니다.' },
  { id: 'equipment', icon: Factory, t: '설비 관리', s: '설비', d: '가동률, 오늘 가동 타임라인, 점검 일정과 조치를 관리합니다.' },
  { id: 'analysis', icon: LineChart, t: '데이터 분석', s: '분석', d: '데이터포인트를 골라 기간별 추이를 보고 CSV로 내려받습니다.' },
  { id: 'events', icon: Bell, t: '이벤트 · 알림', s: '이벤트', d: '기준을 벗어난 기록과 알림 규칙을 봅니다.' },
  { id: 'assistant', icon: Bot, t: 'AI 어시스턴트', s: 'AI', d: '공장 데이터에 대해 묻고 답을 받습니다.' },
] as const
type ViewId = typeof views[number]['id']

export default function PlatformDemo() {
  const [view, setView] = useState<ViewId>('overview')
  const [live, setLive] = useState<Live>(initialLive)
  const [now, setNow] = useState<Date | null>(null)
  const [liveLog, setLiveLog] = useState<LogEvent[]>([])
  const [twinLog, setTwinLog] = useState<TwinLog[]>([])

  // 화면 주소의 #analysis 같은 값으로 바로 열 수 있게
  useEffect(() => {
    const fromHash = () => { // eslint-disable-line
      const h = window.location.hash.slice(1) as ViewId
      if (views.some(v => v.id === h)) setView(h)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    window.addEventListener('popstate', fromHash)
    return () => { window.removeEventListener('hashchange', fromHash); window.removeEventListener('popstate', fromHash) }
  }, [])
  const go = (id: ViewId) => {
    setView(id)
    history.replaceState(null, '', `#${id}`)
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    // 가상 공장 시각: 오늘 14:00에서 시작해 실제 시간만큼 흐른다 (언제 열어도 같은 장면)
    const opened = Date.now()
    const base = new Date(); base.setHours(0, DEMO_START_MIN, 0, 0)
    const virt = () => new Date(base.getTime() + (Date.now() - opened))
    setNow(virt())
    const id = setInterval(() => { setLive(prev => step(prev)); setNow(virt()) }, 1500)
    return () => clearInterval(id)
  }, [])

  const alarms = useMemo(() => {
    const list: { id: string; tag: string; name: string; v: number; unit: string; digits: number }[] = []
    for (const m of machines) for (const p of m.points) {
      const v = live[m.id][p.key].at(-1)!
      if (isAlarm(p, v)) list.push({ id: m.id, tag: m.tag, name: p.name, v, unit: p.unit, digits: p.digits })
    }
    return list
  }, [live])

  // 알람이 새로 켜질 때마다 이벤트 기록에 한 줄
  const alarmKey = alarms.map(a => a.id + a.name).join('|')
  useEffect(() => {
    if (!alarms.length) return
    setLiveLog(prev => {
      const add = alarms.filter(a => !prev.some(e => e.tag === a.tag && e.msg.startsWith(a.name) && !e.resolved))
        .map(a => ({ t: now ? now.getTime() : Date.now(), tag: a.tag, msg: `${a.name} ${fmt(a.v, a.digits)}${a.unit} — 기준 벗어남`, sev: 'critical' as const, resolved: false }))
      return add.length ? [...add, ...prev] : prev
    })
  }, [alarmKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const recent: LiveEvent[] = useMemo(() => {
    if (!now) return []
    const hm = (t: number) => { const d = new Date(t); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` }
    const dayStart = new Date(now); dayStart.setHours(0, 0, 0, 0)
    return [...liveLog, ...pastEvents(now).filter(e => e.t >= dayStart.getTime())]
      .sort((a, b) => b.t - a.t).slice(0, 6)
      .map(e => ({ time: hm(e.t), tag: e.tag, msg: e.msg }))
  }, [liveLog, now?.toDateString()]) // eslint-disable-line react-hooks/exhaustive-deps

  // 3D 트윈의 RTLS 이벤트(접근 경보·출입 제한 구역)를 이벤트 기록에도 남긴다
  const onTwinEvent = (e: TwinEvent) => {
    const ev = twinEventText(e)
    if (!ev) return
    const t = now ? now.getTime() : Date.now()
    const d = new Date(t)
    const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    setTwinLog(prev => [{ time, tag: ev.tag, msg: ev.msg, sev: ev.sev }, ...prev].slice(0, 30))
    setLiveLog(prev => [{ t, tag: ev.tag, msg: ev.msg, sev: ev.sev, resolved: true }, ...prev].slice(0, 60))
  }

  const cur = views.find(v => v.id === view)!
  const alarmIds = new Set(alarms.map(a => a.id))

  return (
    <>
      <Seo title="Factra Platform 데모" description="가상 공장 데이터로 움직이는 Factra Platform 데모. 통합 관제, 3D 디지털 트윈, 설비 관리, 데이터 분석, 이벤트·알림, AI 어시스턴트를 직접 눌러 봅니다." />
      <div className="min-h-screen bg-ink pt-[68px] text-on-ink [color-scheme:dark]">
        <div className="border-b border-line-ink bg-signal/10">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 md:px-6">
            <p className="text-[13px] text-on-ink-2"><b className="text-signal-2">데모</b> · 모든 값은 가상 공장 데이터이며 화면 안에서만 움직입니다.</p>
            <Link href="/platform/" className="flex items-center gap-1.5 text-[13px] text-on-ink-2 hover:text-white"><ArrowLeft size={14} />Factra Platform 소개로</Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <nav className="sticky top-[68px] z-30 flex shrink-0 gap-1 overflow-x-auto border-b border-line-ink bg-ink-2 p-2 md:static md:w-[200px] md:flex-col md:border-b-0 md:border-r md:p-3" aria-label="데모 메뉴">
            <p className="mono hidden px-3 pb-3 pt-1 text-[11px] tracking-[0.1em] text-on-ink-3 md:block">FACTRA PLATFORM</p>
            {views.map(it => (
              <button key={it.id} type="button" onClick={() => go(it.id)} aria-current={view === it.id ? 'page' : undefined}
                className={`flex flex-1 shrink-0 items-center justify-center gap-1.5 px-2 py-2.5 text-left text-[13px] md:flex-none md:justify-start md:gap-2.5 md:px-3 md:text-[13.5px] ${view === it.id ? 'bg-white/[0.1] text-white' : 'text-on-ink-2 hover:bg-white/[0.05] hover:text-white'}`}>
                <it.icon size={17} strokeWidth={1.7} />
                <span className="whitespace-nowrap"><span className="md:hidden">{it.s}</span><span className="hidden md:inline">{it.t}</span></span>
                {it.id === 'events' && alarms.length > 0 && <span className="ml-auto h-2 w-2 rounded-full bg-signal" aria-label="새 알람" />}
              </button>
            ))}
          </nav>

          <div className="min-w-0 flex-1 p-4 md:p-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[12px] text-on-ink-3">가상 공장 A · 금속·플라스틱 부품</p>
                <h1 className="mt-1 text-[22px] font-bold tracking-[-0.02em] md:text-[26px]">{cur.t}</h1>
                <p className="mt-1 text-[13px] text-on-ink-2">{cur.d}</p>
              </div>
              <p className="mono flex items-center gap-2 text-[12px] text-ok">
                <span className="blink h-2 w-2 rounded-full bg-ok" />LIVE
                <span className="text-on-ink-2">{now ? `가상 공장 시각 ${now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : ''}</span>
              </p>
            </div>

            {/* 날짜에 따라 값이 바뀌는 화면은 브라우저에서 시계를 읽은 뒤에 그린다 */}
            {now && (
              <>
                {view === 'overview' && <Overview live={live} alarmIds={alarmIds} alarmCount={alarms.length} events={recent} />}
                {view === 'twin' && <Twin live={live} alarmIds={alarmIds} log={twinLog} onTwinEvent={onTwinEvent} />}
                {view === 'equipment' && <Equipment now={now} />}
                {view === 'analysis' && <Analysis now={now} />}
                {view === 'events' && <Events now={now} live={liveLog} />}
                {view === 'assistant' && <Assistant now={now} acPress={live.ac1.press.at(-1)!} />}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
