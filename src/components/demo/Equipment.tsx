import { useMemo, useState } from 'react'
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react'
import { machines, stateLabel, stateColor, SHIFT_MIN } from '@/lib/demo-factory'
import { timeline, clock, inspections, actions } from '@/lib/demo-data'
import { Card, Kpis, Pill, SERIES } from './ui'

const dayName = ['일', '월', '화', '수', '목', '금', '토']

export default function Equipment({ now }: { now: Date }) {
  const equip = machines.filter(m => m.id !== 'pm1')
  const ranked = [...equip].sort((a, b) => b.runMin - a.runMin)
  const tl = useMemo(() => Object.fromEntries(equip.map(m => [m.id, timeline(m, now)])), [now.toDateString()]) // eslint-disable-line react-hooks/exhaustive-deps
  const [tip, setTip] = useState<string | null>(null)

  const todayDue = inspections.filter(i => i.due === 0)
  const overdue = inspections.filter(i => i.due < 0 && !i.done)
  const openActions = actions.filter(a => a.status !== '완료')
  const date = (offset: number) => { const d = new Date(now); d.setDate(d.getDate() + offset); return d }
  const week = Array.from({ length: 7 }, (_, i) => i)

  return (
    <>
      <Kpis items={[
        ['관리 설비', String(equip.length), '대'],
        ['오늘 점검', `${todayDue.filter(i => i.done).length}`, `/ ${todayDue.length} 완료`],
        ['연체 점검', String(overdue.length), '건', overdue.length > 0],
        ['진행 중 조치', String(openActions.length), '건'],
        ['이번 주 점검', String(inspections.filter(i => i.due >= 0 && i.due < 7).length), '건'],
        ['평균 가동률', String(Math.round(equip.reduce((s, m) => s + m.runMin, 0) / (equip.length * SHIFT_MIN) * 100)), '%'],
      ]} />

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Card title="오늘 설비별 가동률" right={<span className="text-[11.5px] text-on-ink-3">주간 근무 08:00–16:00 기준</span>}>
          <ul className="space-y-2.5">
            {ranked.map((m, i) => {
              const pct = Math.round((m.runMin / SHIFT_MIN) * 100)
              return (
                <li key={m.id} className="grid grid-cols-[18px_96px_1fr_42px] items-center gap-2 text-[12.5px]" title={`${m.name} · 가동 ${m.runMin}분 / ${SHIFT_MIN}분`}>
                  <span className="mono text-on-ink-3">{i + 1}</span>
                  <span className="truncate"><span className="mono">{m.tag}</span></span>
                  <span className="h-3 bg-white/[0.05]">
                    <span className="block h-full rounded-r-[4px]" style={{ width: `${pct}%`, background: SERIES }} />
                  </span>
                  <span className="mono text-right">{pct}%</span>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card title="오늘 가동 타임라인" right={
          <div className="flex flex-wrap gap-3">
            {(['run', 'idle', 'stop'] as const).map(s => (
              <span key={s} className="flex items-center gap-1.5 text-[11.5px] text-on-ink-2"><span className="h-2 w-3" style={{ background: stateColor[s] }} />{stateLabel[s]}</span>
            ))}
          </div>
        }>
          <ul className="space-y-2">
            {equip.map(m => (
              <li key={m.id} className="grid grid-cols-[64px_1fr] items-center gap-2">
                <span className="mono text-[12px] text-on-ink-2">{m.tag}</span>
                <div className="relative flex h-5 gap-[2px]">
                  {tl[m.id].map((s, i) => {
                    const id = `${m.id}-${i}`
                    return (
                      <button key={i} type="button" aria-label={`${m.tag} ${stateLabel[s.state]} ${clock(s.from)}–${clock(s.to)}`}
                        onPointerEnter={() => setTip(id)} onPointerLeave={() => setTip(null)} onFocus={() => setTip(id)} onBlur={() => setTip(null)} onClick={() => setTip(tip === id ? null : id)}
                        className="relative h-full first:rounded-l-[3px] last:rounded-r-[3px] hover:brightness-125"
                        style={{ width: `${((s.to - s.from) / SHIFT_MIN) * 100}%`, background: stateColor[s.state] }}>
                        {tip === id && (
                          <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap border border-line-ink bg-ink px-2 py-1 text-[11.5px] text-on-ink shadow-lg">
                            <b>{stateLabel[s.state]}</b> · {clock(s.from)}–{clock(s.to)} ({s.to - s.from}분)
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-2 grid grid-cols-[64px_1fr] gap-2">
            <span />
            <div className="mono flex justify-between text-[10.5px] text-on-ink-3"><span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span></div>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card title="점검 일정 (이번 주)">
          <div className="mb-4 grid grid-cols-7 gap-px border border-line-ink bg-line-ink">
            {week.map(o => {
              const d = date(o)
              const items = inspections.filter(i => i.due === o)
              return (
                <div key={o} className={`bg-ink px-1.5 py-2 text-center ${o === 0 ? 'outline outline-1 -outline-offset-1 outline-white/40' : ''}`}>
                  <p className="text-[11px] text-on-ink-3">{dayName[d.getDay()]}</p>
                  <p className="mono text-[14px]">{d.getDate()}</p>
                  <p className="mt-1 h-4 text-[11px] text-on-ink-2">{items.length ? `${items.length}건` : ''}</p>
                </div>
              )
            })}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-left text-[12.5px]">
              <thead className="text-on-ink-3"><tr className="border-b border-line-ink"><th className="py-2 font-normal">설비</th><th className="font-normal">점검 항목</th><th className="font-normal">주기</th><th className="font-normal">예정일</th><th className="font-normal">상태</th></tr></thead>
              <tbody className="divide-y divide-line-ink">
                {inspections.map(i => {
                  const d = date(i.due)
                  const st = i.done ? { icon: CheckCircle2, t: '완료', c: 'text-ok' } : i.due < 0 ? { icon: AlertCircle, t: '연체', c: 'text-signal' } : i.due === 0 ? { icon: Circle, t: '오늘', c: 'text-[#fab219]' } : { icon: Circle, t: '예정', c: 'text-on-ink-3' }
                  return (
                    <tr key={i.tag + i.item}>
                      <td className="mono py-2.5 text-on-ink-2">{i.tag}</td>
                      <td>{i.item}</td>
                      <td className="text-on-ink-2">{i.cycle}</td>
                      <td className="mono text-on-ink-2">{d.getMonth() + 1}/{d.getDate()}</td>
                      <td><span className={`inline-flex items-center gap-1 ${st.c}`}><st.icon size={13} />{st.t}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="조치 관리">
          <ul className="divide-y divide-line-ink">
            {actions.map(a => (
              <li key={a.title} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[13.5px]">{a.title}</p>
                  <Pill color={a.status === '완료' ? '#2BB673' : a.status === '진행 중' ? '#3987e5' : '#8B8D92'}>{a.status}</Pill>
                </div>
                <p className="mt-1 text-[12px] text-on-ink-3"><span className="mono">{a.tag}</span> · {a.owner} · 등록 {a.opened}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] text-on-ink-3">알람이나 AI 이상 징후에서 바로 조치를 등록하고, 담당자와 처리 결과를 남깁니다.</p>
        </Card>
      </div>
    </>
  )
}
