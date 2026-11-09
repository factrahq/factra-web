import { useMemo, useState } from 'react'
import { Download, Table2, LineChart as LineIcon, Sparkles } from 'lucide-react'
import { fmt, isAlarm, machines } from '@/lib/demo-factory'
import { history, analysisPoints, rangeLabel, type Range } from '@/lib/demo-data'
import { Card, LineChart } from './ui'

const MAX = 4

export default function Analysis({ now }: { now: Date }) {
  const [range, setRange] = useState<Range>('24h')
  const [picked, setPicked] = useState<string[]>(['ac1.press', 'ac1.kw'])
  const [view, setView] = useState<'chart' | 'table'>('chart')

  const series = useMemo(() => picked.map(id => {
    const a = analysisPoints.find(x => x.id === id)!
    const data = history(a.m, a.p, range, now)
    const vals = data.map(d => d.v).filter(Number.isFinite)
    return { ...a, data, avg: vals.reduce((s, v) => s + v, 0) / vals.length, min: Math.min(...vals), max: Math.max(...vals), out: vals.filter(v => isAlarm(a.p, v)).length }
  }), [picked, range, now.toDateString()]) // eslint-disable-line react-hooks/exhaustive-deps

  const timeFmt = (t: number) => {
    const d = new Date(t)
    const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    return range === '24h' ? hm : range === '7d' ? `${d.getMonth() + 1}/${d.getDate()} ${hm}` : `${d.getMonth() + 1}/${d.getDate()}`
  }

  const toggle = (id: string) => setPicked(p => p.includes(id) ? p.filter(x => x !== id) : p.length >= MAX ? p : [...p, id])

  const csv = () => {
    if (!series.length) return
    const head = ['시각', ...series.map(s => `${s.m.tag} ${s.p.name}(${s.p.unit})`)]
    const rows = series[0].data.map((d, i) => [new Date(d.t).toLocaleString('ko-KR'), ...series.map(s => Number.isFinite(s.data[i].v) ? s.data[i].v.toFixed(s.p.digits) : '')])
    const text = '﻿' + [head, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a'); a.href = url; a.download = `factra-demo-${range}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const press = series.find(s => s.id === 'ac1.press'), acKw = series.find(s => s.id === 'ac1.kw')

  return (
    <>
      {/* 필터: 기간 먼저, 한 줄 */}
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(rangeLabel) as Range[]).map(r => (
          <button key={r} type="button" onClick={() => setRange(r)}
            className={`h-9 border px-3 text-[13px] ${range === r ? 'border-white bg-white text-ink' : 'border-line-ink text-on-ink-2 hover:border-white/40'}`}>{rangeLabel[r]}</button>
        ))}
        <span className="mx-1 hidden h-5 w-px bg-line-ink sm:block" />
        <div className="flex">
          <button type="button" onClick={() => setView('chart')} aria-pressed={view === 'chart'} className={`flex h-9 items-center gap-1.5 border border-line-ink px-3 text-[13px] ${view === 'chart' ? 'bg-white/10 text-white' : 'text-on-ink-2'}`}><LineIcon size={14} />그래프</button>
          <button type="button" onClick={() => setView('table')} aria-pressed={view === 'table'} className={`-ml-px flex h-9 items-center gap-1.5 border border-line-ink px-3 text-[13px] ${view === 'table' ? 'bg-white/10 text-white' : 'text-on-ink-2'}`}><Table2 size={14} />표</button>
        </div>
        <button type="button" onClick={csv} disabled={!series.length} className="ml-auto flex h-9 items-center gap-1.5 border border-line-ink px-3 text-[13px] text-on-ink-2 hover:border-white/40 disabled:opacity-40"><Download size={14} />CSV 내려받기</button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Card title="데이터포인트" right={<span className="text-[11.5px] text-on-ink-3">{picked.length} / {MAX}개</span>}>
          <div className="max-h-[260px] space-y-3 overflow-y-auto pr-1 lg:max-h-[640px]">
            {machines.map(m => {
              const pts = analysisPoints.filter(a => a.m.id === m.id)
              if (!pts.length) return null
              return (
                <div key={m.id}>
                  <p className="text-[12px] text-on-ink-3"><span className="mono">{m.tag}</span> · {m.name}</p>
                  <ul className="mt-1">
                    {pts.map(a => {
                      const on = picked.includes(a.id)
                      const full = !on && picked.length >= MAX
                      return (
                        <li key={a.id}>
                          <label className={`flex cursor-pointer items-center gap-2 py-1 text-[13px] ${full ? 'opacity-40' : ''}`}>
                            <input type="checkbox" checked={on} disabled={full} onChange={() => toggle(a.id)} className="accent-[#3987e5]" />
                            {a.p.name} <span className="text-[11px] text-on-ink-3">{a.p.unit}</span>
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </Card>

        <div className="min-w-0 space-y-4">
          {!series.length && <Card><p className="py-10 text-center text-[13px] text-on-ink-3">왼쪽에서 데이터포인트를 고르세요.</p></Card>}

          {/* 같은 축에 단위가 다른 값을 겹치지 않도록, 값마다 그래프를 하나씩 */}
          {view === 'chart' && series.map(s => (
            <Card key={s.id} title={<><span className="mono">{s.m.tag}</span> · {s.p.name} <span className="font-normal text-on-ink-3">({s.p.unit || '-'})</span></>}
              right={<span className="mono text-[11.5px] text-on-ink-3">평균 {fmt(s.avg, s.p.digits)} · 최소 {fmt(s.min, s.p.digits)} · 최대 {fmt(s.max, s.p.digits)}</span>}>
              <LineChart data={s.data} digits={s.p.digits} unit={s.p.unit} limit={s.p.limit} timeFmt={timeFmt} />
            </Card>
          ))}

          {view === 'table' && series.length > 0 && (
            <Card title={`${rangeLabel[range]} · ${series[0].data.length}행`}>
              <div className="max-h-[480px] overflow-auto">
                <table className="w-full min-w-[420px] text-right text-[12.5px]">
                  <thead className="sticky top-0 bg-ink-2 text-on-ink-3">
                    <tr className="border-b border-line-ink"><th className="py-2 text-left font-normal">시각</th>{series.map(s => <th key={s.id} className="font-normal">{s.m.tag} {s.p.name} ({s.p.unit})</th>)}</tr>
                  </thead>
                  <tbody className="mono divide-y divide-line-ink">
                    {[...series[0].data].reverse().map((d, ri) => {
                      const i = series[0].data.length - 1 - ri
                      return (
                        <tr key={d.t}>
                          <td className="py-1.5 text-left text-on-ink-2">{timeFmt(d.t)}</td>
                          {series.map(s => <td key={s.id} className={isAlarm(s.p, s.data[i].v) ? 'text-signal' : ''}>{Number.isFinite(s.data[i].v) ? fmt(s.data[i].v, s.p.digits) : '–'}</td>)}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {series.length > 0 && (
            <Card title={<span className="flex items-center gap-1.5"><Sparkles size={14} className="text-signal-2" />AI 분석</span>}>
              {press && range === '24h' ? (
                <p className="text-[13.5px] leading-relaxed text-on-ink">
                  AC-01 토출 압력이 최근 3시간 동안 <b>{fmt(press.data.at(-13)!.v, 2)} → {fmt(press.data.at(-1)!.v, 2)} bar</b>로 꾸준히 내려갔습니다.
                  {acKw ? <> 같은 3시간 동안 압축기 전력은 {fmt(Math.min(...acKw.data.slice(-13).map(d => d.v)), 1)}–{fmt(Math.max(...acKw.data.slice(-13).map(d => d.v)), 1)} kW로, 하는 일의 양은 평소와 비슷합니다.</> : null} 압축기는 그대로 일하는데 압력만 빠지는 모양이라
                  <b> 압축기 고장보다 배관 누설</b> 쪽 가능성이 높습니다. 사용량이 큰 프레스 구역 에어 라인부터 점검하세요.
                </p>
              ) : (
                <ul className="space-y-1.5 text-[13px] text-on-ink">
                  {series.map(s => (
                    <li key={s.id}>
                      <span className="mono">{s.m.tag}</span> {s.p.name}: 평균 {fmt(s.avg, s.p.digits)}{s.p.unit}, 범위 {fmt(s.min, s.p.digits)}–{fmt(s.max, s.p.digits)}{s.p.unit}
                      {s.p.limit ? (s.out ? <b className="text-signal-2"> · 기준을 {s.out}번 벗어남</b> : ' · 기준 안') : ''}
                    </li>
                  ))}
                  <li className="pt-1 text-[12px] text-on-ink-3">근무 시간(08:00–17:00)에 값이 오르고 밤·주말에는 내려가는 평소 패턴입니다. 설비가 서 있는 동안 사이클 타임은 비어 있습니다.</li>
                </ul>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
