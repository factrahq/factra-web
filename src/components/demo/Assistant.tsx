import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { machines, fmt, SHIFT_MIN } from '@/lib/demo-factory'
import { weeklyKwh, inspections } from '@/lib/demo-data'

type Msg = { who: 'me' | 'ai'; text: string; extra?: ReactNode }

export default function Assistant({ now, acPress }: { now: Date; acPress: number }) {
  const equip = machines.filter(m => m.id !== 'pm1')
  const kwh = useMemo(() => weeklyKwh(now), [now.toDateString()]) // eslint-disable-line react-hooks/exhaustive-deps
  const totalKwh = kwh.reduce((s, x) => s + x.kwh, 0)

  // 미리 정해 둔 질문 → 가상 데이터로 계산한 답
  const qa: { q: string; a: () => Msg }[] = [
    {
      q: '오늘 가동률이 가장 낮은 설비는?',
      a: () => {
        const low = [...equip].sort((a, b) => a.runMin - b.runMin).slice(0, 2)
        return {
          who: 'ai', text: `오늘 주간 근무(08:00–16:00) 기준으로 가동률이 가장 낮은 설비는 ${low.map(m => `${m.tag} ${m.name} ${Math.round(m.runMin / SHIFT_MIN * 100)}%`).join(', ')}입니다. PR-02는 금형 교체로 계획 정지 중이고, MC-01은 다음 작업을 기다리는 대기 상태입니다. 둘 다 고장 알람은 없습니다.`,
        }
      },
    },
    {
      q: '공기압축기 압력이 왜 떨어져?',
      a: () => ({
        who: 'ai', text: `AC-01 토출 압력이 지금 ${fmt(acPress, 2)} bar로, 3시간 전 6.2 bar에서 꾸준히 내려가고 있습니다. 같은 시간 압축기 전력과 토출 온도는 평소와 같습니다. 압축기는 그대로 일하는데 압력만 빠지는 모양이라 압축기 고장보다 배관 누설 가능성이 높습니다. 공기를 가장 많이 쓰는 프레스 구역 에어 라인부터 점검하시고, 조치 관리에 등록된 "에어 배관 누설 위치 확인"을 진행하시면 됩니다.`,
      }),
    },
    {
      q: '이번 주 전력 사용량 요약해줘',
      a: () => ({
        who: 'ai', text: `최근 7일 동안 설비 ${equip.length}대가 쓴 전력은 약 ${fmt(totalKwh, 0)} kWh입니다. 많이 쓴 순서는 아래와 같고, 위 세 대가 전체의 ${Math.round(kwh.slice(0, 3).reduce((s, x) => s + x.kwh, 0) / totalKwh * 100)}%입니다. 점심시간(12~13시)과 밤·주말에는 사용량이 크게 줄어듭니다.`,
        extra: (
          <ul className="mt-3 space-y-1.5">
            {kwh.slice(0, 5).map(x => (
              <li key={x.m.id} className="grid grid-cols-[72px_1fr_76px] items-center gap-2 text-[12.5px]">
                <span className="mono text-on-ink-2">{x.m.tag}</span>
                <span className="h-2.5 bg-white/[0.06]"><span className="block h-full rounded-r-[3px] bg-[#3987e5]" style={{ width: `${x.kwh / kwh[0].kwh * 100}%` }} /></span>
                <span className="mono text-right">{fmt(x.kwh, 0)} kWh</span>
              </li>
            ))}
          </ul>
        ),
      }),
    },
    {
      q: '내일 점검할 설비 알려줘',
      a: () => {
        const tm = inspections.filter(i => i.due === 1)
        const today = inspections.filter(i => i.due === 0 && !i.done)
        return {
          who: 'ai', text: `내일 예정된 점검은 ${tm.map(i => `${i.tag} "${i.item}"`).join(', ') || '없습니다'}입니다.${today.length ? ` 오늘 남은 점검도 ${today.map(i => `${i.tag} "${i.item}"`).join(', ')} ${today.length}건이 있습니다.` : ''}`,
        }
      },
    },
  ]

  const [msgs, setMsgs] = useState<Msg[]>([{ who: 'ai', text: '안녕하세요. 공장 데이터를 바탕으로 답하는 AI 어시스턴트입니다. 아래 예시 질문을 눌러 보세요.' }])
  const [typing, setTyping] = useState<{ full: Msg; n: number } | null>(null)
  const [input, setInput] = useState('')
  const box = useRef<HTMLDivElement>(null)

  // 답을 한 글자씩 보여 준다
  useEffect(() => {
    if (!typing) return
    if (typing.n >= typing.full.text.length) { setMsgs(m => [...m, typing.full]); setTyping(null); return }
    const id = setTimeout(() => setTyping(t => t && { ...t, n: t.n + 3 }), 16)
    return () => clearTimeout(id)
  }, [typing])
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight }, [msgs, typing?.n])

  const ask = (q: string, a: Msg) => {
    if (typing) return
    setMsgs(m => [...m, { who: 'me', text: q }])
    setTimeout(() => setTyping({ full: a, n: 0 }), 350)
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const q = input.trim()
    if (!q) return
    setInput('')
    const hit = qa.find(x => x.q.replace(/\s/g, '') === q.replace(/\s/g, ''))
    ask(q, hit ? hit.a() : { who: 'ai', text: '데모에서는 아래 예시 질문에만 답할 수 있습니다. 실제 화면에서는 우리 공장 데이터에 대해 자유롭게 물어보실 수 있습니다.' })
  }

  const bubble = (m: Msg, i: number | string, partial?: number) => (
    <div key={i} className={`flex gap-2.5 ${m.who === 'me' ? 'flex-row-reverse' : ''}`}>
      <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${m.who === 'me' ? 'bg-white/10' : 'bg-signal/20 text-signal-2'}`}>
        {m.who === 'me' ? <User size={14} /> : <Bot size={14} />}
      </span>
      <div className={`max-w-[85%] px-3.5 py-2.5 text-[13.5px] leading-relaxed ${m.who === 'me' ? 'bg-white/10' : 'border border-line-ink bg-ink'}`}>
        {partial !== undefined ? m.text.slice(0, partial) : m.text}
        {partial === undefined && m.extra}
      </div>
    </div>
  )

  return (
    <div className="mx-auto flex max-w-[860px] flex-col border border-line-ink bg-ink-2" >
      <div ref={box} className="max-h-[60vh] flex-1 space-y-4 overflow-y-auto p-4 md:max-h-[520px]">
        {msgs.map((m, i) => bubble(m, i))}
        {typing && bubble(typing.full, 'typing', typing.n)}
      </div>
      <div className="border-t border-line-ink p-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {qa.map(x => (
            <button key={x.q} type="button" disabled={!!typing} onClick={() => ask(x.q, x.a())}
              className="border border-line-ink px-3 py-1.5 text-[12.5px] text-on-ink-2 hover:border-white/40 hover:text-white disabled:opacity-40">{x.q}</button>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="질문을 입력하세요" className="h-11 min-w-0 flex-1 border border-line-ink bg-ink px-3 text-[14px] outline-none focus:border-white/40" />
          <button type="submit" className="flex h-11 w-11 items-center justify-center bg-white text-ink" aria-label="보내기"><Send size={16} /></button>
        </form>
      </div>
    </div>
  )
}
