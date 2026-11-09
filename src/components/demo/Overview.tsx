import { useState } from 'react'
import { AlertTriangle, ChevronDown } from 'lucide-react'
import { machines, zones, isAlarm, fmt, stateLabel, stateColor, availMin, stateText, type Live, type Machine } from '@/lib/demo-factory'
import { Card, Kpis, Spark, Pill, ALERT } from './ui'

export type LiveEvent = { time: string; tag: string; msg: string }

const hhmm = (min: number) => `${Math.floor(min / 60)}시간 ${String(min % 60).padStart(2, '0')}분`

function Values({ m, live }: { m: Machine; live: Live }) {
  return (
    <ul className="divide-y divide-line-ink border-t border-line-ink">
      {m.points.map(p => {
        const arr = live[m.id][p.key]
        const v = arr.at(-1)!
        const alarm = isAlarm(p, v)
        const lim = p.limit ? [p.limit.lo !== undefined && `${p.limit.lo} 이상`, p.limit.hi !== undefined && `${p.limit.hi} 이하`].filter(Boolean).join(' · ') : ''
        return (
          <li key={p.key} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 py-3">
            <span className="text-[13px] text-on-ink-2">{p.name}</span>
            <span className={`mono text-right text-[15px] ${alarm ? 'text-signal' : ''}`}>{fmt(v, p.digits)}<span className="ml-1 text-[11px] text-on-ink-3">{p.unit}</span></span>
            <div className="col-span-2"><Spark values={arr} alarm={alarm} /></div>
            {lim && <span className="col-span-2 text-[11px] text-on-ink-3">기준 {lim}</span>}
          </li>
        )
      })}
    </ul>
  )
}

export default function Overview({ live, alarmIds, alarmCount, events }: { live: Live; alarmIds: Set<string>; alarmCount: number; events: LiveEvent[] }) {
  const [sel, setSel] = useState('ac1')
  const [open, setOpen] = useState<string | null>('ac1') // 휴대폰 목록에서 펼친 설비
  const equip = machines.filter(m => m.id !== 'pm1')
  const running = equip.filter(m => m.state === 'run').length
  const util = Math.round((equip.reduce((s, m) => s + m.runMin, 0) / equip.reduce((s, m) => s + availMin(m), 0)) * 100)
  const m = machines.find(x => x.id === sel)!
  const statusOf = (mc: Machine) => alarmIds.has(mc.id) ? { c: ALERT, t: '알람' } : { c: stateColor[mc.state], t: stateText(mc) }

  return (
    <>
      <Kpis items={[
        ['전체 설비', String(equip.length), '대'],
        ['가동 중', String(running), `/ ${equip.length}`],
        ['오늘 가동률', String(util), '%'],
        ['현재 전력', fmt(live.pm1.kw.at(-1)!, 1), 'kW'],
        ['오늘 전력량', fmt(live.pm1.kwh.at(-1)!, 0), 'kWh'],
        ['알람', String(alarmCount), '건 · AI 경고 1건', alarmCount > 0],
      ]} />

      {(

        <div className="mt-4 flex items-start gap-3 border border-signal/40 bg-signal/10 px-4 py-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-signal" />
          <p className="text-[13.5px] leading-relaxed text-on-ink">
            <b className="text-signal-2">AI 경고 · AC-01 공기압축기</b> — 토출 압력이 3시간 전 6.2 bar에서 지금 {fmt(live.ac1.press.at(-1)!, 2)} bar까지 꾸준히 떨어지고 있습니다. 알람 기준(5.5 bar)에 닿기 전에 먼저 알립니다. 전력은 그대로라 <b>배관 누설</b>이 의심됩니다. 프레스 구역 에어 라인 점검을 권합니다.
          </p>
        </div>
      )}

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_340px]">
        {/* PC: 배치도 */}
        <Card className="hidden md:block" title="공장 배치도" right={
          <div className="flex flex-wrap gap-3">
            {(['run', 'idle', 'stop'] as const).map(s => (
              <span key={s} className="flex items-center gap-1.5 text-[11.5px] text-on-ink-2"><span className="h-2 w-2 rounded-full" style={{ background: stateColor[s] }} />{stateLabel[s]}</span>
            ))}
            <span className="flex items-center gap-1.5 text-[11.5px] text-on-ink-2"><span className="h-2 w-2 rounded-full bg-signal" />알람</span>
          </div>
        }>
          <svg viewBox="0 0 1000 560" className="w-full" role="img" aria-label="가상 공장 배치도">
            {zones.map(z => (
              <g key={z.name}>
                <rect x={z.x} y={z.y} width={z.w} height={z.h} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.12)" strokeDasharray="6 5" />
                <text x={z.x + 12} y={z.y + 22} fill="#6B6E75" fontSize="15">{z.name}</text>
              </g>
            ))}
            {machines.map(mc => {
              const alarm = alarmIds.has(mc.id)
              const p0 = mc.points[0]
              const v0 = live[mc.id][p0.key].at(-1)!
              const color = statusOf(mc).c
              const active = sel === mc.id
              return (
                <g key={mc.id} onClick={() => setSel(mc.id)} className="cursor-pointer" role="button" aria-label={`${mc.name} 선택`}>
                  {alarm && <rect x={mc.x - 6} y={mc.y - 6} width={mc.w + 12} height={mc.h + 12} fill="none" stroke={ALERT} strokeWidth="2" className="blink" />}
                  <rect x={mc.x} y={mc.y} width={mc.w} height={mc.h} fill={active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'} stroke={active ? '#FFFFFF' : color} strokeWidth={active ? 2.5 : 1.5} />
                  <rect x={mc.x} y={mc.y} width="6" height={mc.h} fill={color} />
                  <text x={mc.x + 16} y={mc.y + 24} fill="#F4F4F1" fontSize="15" fontWeight="700">{mc.tag}</text>
                  <text x={mc.x + 16} y={mc.y + 46} fill="#A3A6AC" fontSize="13">{p0.name}</text>
                  <text x={mc.x + 16} y={mc.y + 64} fill={alarm ? '#FF7A47' : '#F4F4F1'} fontSize="15" fontFamily="IBM Plex Mono, monospace">{fmt(v0, p0.digits)} {p0.unit}</text>
                </g>
              )
            })}
          </svg>
          <p className="pt-1 text-[12px] text-on-ink-3">설비를 누르면 오른쪽에 실시간 값이 나옵니다.</p>
        </Card>

        {/* 휴대폰: 구역별 설비 목록, 누르면 펼쳐짐 */}
        <div className="space-y-4 md:hidden">
          {zones.map(z => (
            <div key={z.name}>
              <p className="mb-2 text-[12px] text-on-ink-3">{z.name}</p>
              <ul className="divide-y divide-line-ink border border-line-ink bg-ink-2">
                {machines.filter(mc => mc.zone === z.name).map(mc => {
                  const p0 = mc.points[0]
                  const v0 = live[mc.id][p0.key].at(-1)!
                  const st = statusOf(mc)
                  const isOpen = open === mc.id
                  return (
                    <li key={mc.id}>
                      <button type="button" onClick={() => setOpen(isOpen ? null : mc.id)} aria-expanded={isOpen}
                        className="flex w-full items-center gap-3 px-3 py-3 text-left" style={{ boxShadow: `inset 4px 0 0 ${st.c}` }}>
                        <div className="min-w-0 flex-1 pl-1">
                          <p className="text-[14px] font-semibold">{mc.name}</p>
                          <p className="mt-0.5 text-[12px] text-on-ink-3"><span className="mono">{mc.tag}</span> · {st.t}</p>
                        </div>
                        <div className="text-right">
                          <p className={`mono text-[14px] ${alarmIds.has(mc.id) ? 'text-signal' : ''}`}>{fmt(v0, p0.digits)}<span className="ml-1 text-[11px] text-on-ink-3">{p0.unit}</span></p>
                          <p className="text-[11px] text-on-ink-3">{p0.name}</p>
                        </div>
                        <ChevronDown size={16} className={`shrink-0 text-on-ink-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-2">
                          <p className="pb-2 text-[12px] text-on-ink-2">오늘 가동 {hhmm(mc.runMin)}</p>
                          <Values m={mc} live={live} />
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {/* PC: 선택한 설비 */}
          <Card className="hidden md:block">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[12px] text-on-ink-3"><span className="mono">{m.tag}</span> · {m.zone}</p>
                <h2 className="mt-1 text-[18px] font-bold">{m.name}</h2>
              </div>
              <Pill color={statusOf(m).c}>{statusOf(m).t}</Pill>
            </div>
            <p className="mb-3 mt-2 text-[12.5px] text-on-ink-2">오늘 가동 {hhmm(m.runMin)}</p>
            <Values m={m} live={live} />
          </Card>

          <Card title="최근 이벤트 (공장 전체)">
            <ul className="space-y-2.5">
              {events.map((e, i) => (
                <li key={i} className="grid grid-cols-[44px_64px_1fr] gap-2 text-[12.5px]">
                  <span className="mono text-on-ink-3">{e.time}</span>
                  <span className="mono text-on-ink-2">{e.tag}</span>
                  <span className="text-on-ink">{e.msg}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}
