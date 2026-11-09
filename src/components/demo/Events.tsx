import { useMemo, useState } from 'react'
import { AlertOctagon, AlertTriangle, Info, BellRing } from 'lucide-react'
import { pastEvents, severityLabel, severityColor, type LogEvent, type Severity } from '@/lib/demo-data'
import { Card, Kpis } from './ui'

const sevIcon = { critical: AlertOctagon, warning: AlertTriangle, info: Info }
type Filter = 'all' | Severity
const rules = [
  { t: 'AC-01 토출 압력 5.5 bar 아래', who: '설비보전팀 · 앱 알림' },
  { t: 'CH-01 냉각수 온도 24℃ 넘음', who: '설비보전팀 · 앱 알림' },
  { t: '공장 전력 140kW 넘음 (피크)', who: '공장장 · 앱 알림' },
  { t: 'AI 이상 징후 감지', who: '설비보전팀 · 앱 알림' },
]

export default function Events({ now, live }: { now: Date; live: LogEvent[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [openOnly, setOpenOnly] = useState(false)
  const all = useMemo(() => [...live, ...pastEvents(now)].sort((a, b) => b.t - a.t), [live, now.toDateString()]) // eslint-disable-line react-hooks/exhaustive-deps
  const rows = all.filter(e => (filter === 'all' || e.sev === filter) && (!openOnly || !e.resolved))
  const dayStart = new Date(now); dayStart.setHours(0, 0, 0, 0)
  const today = all.filter(e => e.t >= dayStart.getTime())

  const when = (t: number) => {
    const d = new Date(t)
    const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    return t >= dayStart.getTime() ? `오늘 ${hm}` : `${d.getMonth() + 1}/${d.getDate()} ${hm}`
  }

  return (
    <>
      <Kpis items={[
        ['오늘 이벤트', String(today.length), '건'],
        ['오늘 알람', String(today.filter(e => e.sev === 'critical').length), '건', today.some(e => e.sev === 'critical')],
        ['미해결', String(all.filter(e => !e.resolved).length), '건'],
        ['최근 7일', String(all.length), '건'],
        ['알림 규칙', String(rules.length), '개'],
        ['연결 끊김', '0', '대'],
      ]} />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {(['all', 'critical', 'warning', 'info'] as Filter[]).map(f => (
          <button key={f} type="button" onClick={() => setFilter(f)}
            className={`h-9 border px-3 text-[13px] ${filter === f ? 'border-white bg-white text-ink' : 'border-line-ink text-on-ink-2 hover:border-white/40'}`}>
            {f === 'all' ? '전체' : severityLabel[f]}
          </button>
        ))}
        <label className="ml-1 flex items-center gap-2 text-[13px] text-on-ink-2">
          <input type="checkbox" checked={openOnly} onChange={e => setOpenOnly(e.target.checked)} className="accent-[#3987e5]" />미해결만
        </label>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card title={`이벤트 기록 · ${rows.length}건`}>
          <ul className="divide-y divide-line-ink">
            {rows.map((e, i) => {
              const Icon = sevIcon[e.sev]
              return (
                <li key={i} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 py-3 sm:grid-cols-[92px_64px_1fr_auto] sm:items-center">
                  <span className="mono text-[12px] text-on-ink-3 sm:order-none">{when(e.t)}</span>
                  <span className="mono text-[12px] text-on-ink-2">{e.tag}</span>
                  <span className="col-span-2 text-[13.5px] sm:col-span-1">{e.msg}</span>
                  <span className="col-span-2 flex items-center gap-3 text-[12px] sm:col-span-1 sm:justify-end">
                    <span className="inline-flex items-center gap-1" style={{ color: severityColor[e.sev] === '#6B6E75' ? '#A3A6AC' : severityColor[e.sev] }}><Icon size={14} />{severityLabel[e.sev]}</span>
                    <span className={e.resolved ? 'text-on-ink-3' : 'text-on-ink'}>{e.planned ? '계획' : e.resolved ? '해결' : '미해결'}</span>
                  </span>
                </li>
              )
            })}
            {!rows.length && <li className="py-8 text-center text-[13px] text-on-ink-3">조건에 맞는 이벤트가 없습니다.</li>}
          </ul>
        </Card>

        <Card title={<span className="flex items-center gap-1.5"><BellRing size={14} />알림 규칙</span>}>
          <ul className="divide-y divide-line-ink">
            {rules.map(r => (
              <li key={r.t} className="py-3">
                <p className="text-[13.5px]">{r.t}</p>
                <p className="mt-0.5 text-[12px] text-on-ink-3">{r.who}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] text-on-ink-3">조건과 받을 사람은 화면에서 직접 정합니다.</p>
        </Card>
      </div>
    </>
  )
}
