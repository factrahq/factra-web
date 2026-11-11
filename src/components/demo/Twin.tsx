import { useMemo, useRef, useState } from 'react'
import { ShieldAlert, MapPin, ClipboardList, Eye } from 'lucide-react'
import { machines, isAlarm, fmt, stateColor, stateText, type Live } from '@/lib/demo-factory'
import { twinLivePayload, tagInfo, kindLabel, cartOrders, type TwinEvent, type TwinTag } from '@/lib/twin'
import UnityTwin, { type TwinHandle } from '@/components/twin/UnityTwin'
import { Card, Kpis, Spark, Pill, ALERT } from './ui'

export type TwinLog = { time: string; tag: string; msg: string; sev: 'critical' | 'warning' }

const levelColor = ['#2BB673', '#E0A82E', ALERT] as const
const levelText = ['안전', '주의', '경보'] as const

/** Platform 데모의 "3D 트윈" 화면. 설비 값은 같은 가상 공장 데이터를 3D로 보내고, RTLS 태그는 3D 안의 가상 태그가 보낸다. */
export default function Twin({ live, alarmIds, log, onTwinEvent }: { live: Live; alarmIds: Set<string>; log: TwinLog[]; onTwinEvent: (e: TwinEvent) => void }) {
  const twin = useRef<TwinHandle>(null)
  const [tags, setTags] = useState<TwinTag[]>([])
  const [sel, setSel] = useState<{ kind: 'machine' | 'tag'; id: string } | null>({ kind: 'machine', id: 'ac1' })
  const payload = useMemo(() => twinLivePayload(live, alarmIds), [live, alarmIds])

  const onEvent = (e: TwinEvent) => {
    if (e.type === 'tags') setTags(e.tags)
    else if (e.type === 'select') setSel(e.kind === 'none' ? null : { kind: e.kind, id: e.id })
    onTwinEvent(e)
  }
  const pick = (kind: 'machine' | 'tag', id: string) => { setSel({ kind, id }); twin.current?.select(id) }

  const alertNow = tags.filter(t => t.level === 2 && t.kind === 'forklift').length
  const restricted = tags.filter(t => t.restricted).length
  const m = sel?.kind === 'machine' ? machines.find(x => x.id === sel.id) : undefined
  const t = sel?.kind === 'tag' ? tags.find(x => x.id === sel.id) : undefined

  return (
    <>
      <Kpis items={[
        ['설비', String(machines.length), '대 · 실시간 연동'],
        ['UWB 태그', String(tags.length || 7), '개 추적 중'],
        ['지게차 접근 경보', String(alertNow), '건 진행 중', alertNow > 0],
        ['출입 제한 구역', String(restricted), '명 안에 있음', restricted > 0],
        ['오늘 접근 경보', String(log.filter(l => l.sev === 'critical').length), '건 (데모 시작 이후)'],
        ['설비 알람', String(alarmIds.size), '건', alarmIds.size > 0],
      ]} />

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_340px]">
        <Card title="3D 디지털 트윈 · 가상 공장 A" right={
          <div className="flex gap-1">
            {([['iso', '전체'], ['top', '위에서'], ['floor', '현장 높이']] as const).map(([k, l]) => (
              <button key={k} type="button" onClick={() => twin.current?.view(k)} className="border border-line-ink px-2.5 py-1 text-[12px] text-on-ink-2 hover:border-white/40 hover:text-white">{l}</button>
            ))}
          </div>
        }>
          <UnityTwin ref={twin} live={payload} onEvent={onEvent} className="aspect-[16/10] max-h-[68vh] w-full" />
          <p className="pt-2 text-[12px] text-on-ink-3">드래그로 회전 · 오른쪽 드래그(또는 Shift)로 이동 · 휠로 확대. 설비나 태그를 누르면 오른쪽에 실시간 값이 나옵니다.</p>
        </Card>

        <div className="flex flex-col gap-4">
          {m && (
            <Card>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[12px] text-on-ink-3"><span className="mono">{m.tag}</span> · {m.zone}</p>
                  <h2 className="mt-1 text-[18px] font-bold">{m.name}</h2>
                </div>
                <Pill color={alarmIds.has(m.id) ? ALERT : stateColor[m.state]}>{alarmIds.has(m.id) ? '알람' : stateText(m)}</Pill>
              </div>
              <ul className="mt-3 divide-y divide-line-ink border-t border-line-ink">
                {m.points.map(p => {
                  const arr = live[m.id][p.key]; const v = arr.at(-1)!; const al = isAlarm(p, v)
                  return (
                    <li key={p.key} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 py-2.5">
                      <span className="text-[13px] text-on-ink-2">{p.name}</span>
                      <span className={`mono text-right text-[15px] ${al ? 'text-signal' : ''}`}>{fmt(v, p.digits)}<span className="ml-1 text-[11px] text-on-ink-3">{p.unit}</span></span>
                      <div className="col-span-2"><Spark values={arr} alarm={al} /></div>
                    </li>
                  )
                })}
              </ul>
            </Card>
          )}

          {sel?.kind === 'tag' && (
            <Card>
              <p className="text-[12px] text-on-ink-3"><span className="mono">{sel.id}</span> · {t ? kindLabel[t.kind] : 'UWB 태그'}</p>
              <h2 className="mt-1 text-[18px] font-bold">{tagInfo[sel.id]?.name ?? sel.id}</h2>
              <p className="mt-1 text-[12.5px] text-on-ink-2">{tagInfo[sel.id]?.sub}</p>
              {t && (
                <dl className="mt-3 grid grid-cols-3 gap-px border border-line-ink bg-line-ink text-center">
                  {[['X', `${fmt(t.x, 2)} m`], ['Y', `${fmt(t.y, 2)} m`], ['상태', levelText[t.level]]].map(([k, v], i) => (
                    <div key={k} className="bg-ink px-2 py-2.5">
                      <dt className="text-[11px] text-on-ink-3">{k}</dt>
                      <dd className="mono mt-0.5 text-[14px]" style={i === 2 ? { color: levelColor[t.level] } : undefined}>{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {cartOrders[sel.id] && (
                <div className="mt-3 border border-line-ink bg-ink p-3">
                  <p className="flex items-center gap-1.5 text-[12px] text-on-ink-3"><ClipboardList size={14} />Factra MES 작업지시</p>
                  <p className="mono mt-1.5 text-[14px] font-semibold">{cartOrders[sel.id].wo}</p>
                  <p className="mt-0.5 text-[13px]">{cartOrders[sel.id].item} · {cartOrders[sel.id].qty}</p>
                  <p className="mt-1.5 text-[12px] text-on-ink-2">{cartOrders[sel.id].from} → {cartOrders[sel.id].to}</p>
                  <p className="mt-0.5 text-[12px] text-signal-2">{cartOrders[sel.id].step}</p>
                </div>
              )}
            </Card>
          )}

          {!sel && (
            <Card><p className="flex items-center gap-2 text-[13px] text-on-ink-2"><Eye size={15} />3D 화면이나 아래 목록에서 설비·태그를 고르세요.</p></Card>
          )}

          <Card title={<span className="flex items-center gap-1.5"><MapPin size={14} />UWB 태그 위치 (실시간)</span>}>
            <table className="w-full text-[12.5px]">
              <thead><tr className="text-left text-on-ink-3"><th className="pb-1.5 font-normal">태그</th><th className="pb-1.5 font-normal">종류</th><th className="pb-1.5 text-right font-normal">X · Y (m)</th><th className="pb-1.5 text-right font-normal">상태</th></tr></thead>
              <tbody>
                {(tags.length ? tags : Object.keys(tagInfo).map(id => ({ id } as TwinTag))).map(tg => (
                  <tr key={tg.id} onClick={() => pick('tag', tg.id)} className={`cursor-pointer border-t border-line-ink hover:bg-white/[0.04] ${sel?.id === tg.id ? 'bg-white/[0.07]' : ''}`}>
                    <td className="mono py-1.5">{tg.id}</td>
                    <td className="py-1.5 text-on-ink-2">{tg.kind ? kindLabel[tg.kind] : '—'}</td>
                    <td className="mono py-1.5 text-right">{tg.kind ? `${fmt(tg.x, 1)} · ${fmt(tg.y, 1)}` : '—'}</td>
                    <td className="py-1.5 text-right">{tg.kind ? <span style={{ color: tg.restricted ? '#FF7A47' : levelColor[tg.level] }}>{tg.restricted ? '제한 구역' : levelText[tg.level]}</span> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card title={<span className="flex items-center gap-1.5"><ShieldAlert size={14} />위험 감지 기록</span>}>
            {log.length === 0 ? <p className="text-[12.5px] text-on-ink-3">아직 기록이 없습니다. 지게차가 작업자 3 m 안으로 들어오거나 누군가 수전실에 들어가면 여기에 남습니다.</p> : (
              <ul className="space-y-2.5">
                {log.slice(0, 6).map((e, i) => (
                  <li key={i} className="grid grid-cols-[44px_1fr] gap-2 text-[12.5px]">
                    <span className="mono text-on-ink-3">{e.time}</span>
                    <span style={{ color: e.sev === 'critical' ? '#FF7A47' : '#E0A82E' }}>{e.msg}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-on-ink-3">
        설비 값은 다른 데모 화면과 같은 가상 공장 데이터입니다. 태그 위치는 3D 안의 가상 태그가 만듭니다. 실제 현장에서는 UWB 수신 소프트웨어가 보내는 좌표(태그 · 시각 · X · Y)를 그대로 받아 같은 화면에 그립니다.
        접근 경보는 작업자에게 알리고 기록을 남기는 보조 수단이며, 설비 안전장치를 대신하지 않습니다.
      </p>
    </>
  )
}
