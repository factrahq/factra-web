import { useState, type FormEvent } from 'react'
import { Mail, Clock, MapPinned } from 'lucide-react'
import Link from 'next/link'
import Seo from '@/components/layout/Seo'
import { company } from '@/lib/site'

const topics = ['설비 데이터 수집', 'MES', '비전 검사 · 판독', 'UWB 위치추적 · 안전', '현장 진단', '기타']

// 관심 분야마다 "있으면 더 빨라요" 안내를 바꾼다
const hints: Record<string, string[]> = {
  '설비 데이터 수집': ['라인 수와 설비 대수', '주요 설비의 제조사 · 모델 (명판 사진)', '지금 기록하는 방식 (수기 · 표시기 · 없음)'],
  MES: ['지금 쓰는 방식 (엑셀 · 수기 · 기존 시스템)', '품목 수와 하루 작업지시 건수', '먼저 바꾸고 싶은 업무 (수주 · 재고 · 생산 · 품질)'],
  '비전 검사 · 판독': ['검사·판독 대상 사진 (정상 / 불량)', '라인 속도 (분당 몇 개, 사이클 타임)', '지금 판정 방법과 연결된 설비 (PLC 기종 · MES 유무)', '사진을 회사 밖으로 보낼 수 있는지 (어렵다면 현장에서 시험합니다)'],
  'UWB 위치추적 · 안전': ['통로 도면이나 배치 사진', '지게차 대수와 작업자 수', '사고·아차사고가 잦은 구역'],
  '현장 진단': ['공장 위치와 라인 수', '가장 먼저 해결하고 싶은 문제'],
  기타: ['지금 겪는 문제와 공정'],
}

// 정적 사이트라 서버가 없다 → 입력 내용으로 메일 작성 창을 연다.
// TODO: 폼 수신 서비스(예: Formspree, 자체 API)가 정해지면 fetch 로 바꾼다.
export default function Contact() {
  const [topic, setTopic] = useState(topics[0])
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const body = [
      `회사명: ${f.get('company')}`,
      `담당자: ${f.get('name')}`,
      `연락처: ${f.get('phone')}`,
      `이메일: ${f.get('email')}`,
      `관심 분야: ${topic}`,
      '',
      '[공정 · 문제 설명]',
      `${f.get('message')}`,
    ].join('\n')
    const subject = `[도입 문의] ${f.get('company')} — ${topic}`
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const input = 'w-full border border-line bg-white px-4 h-12 text-[15px] outline-none transition-colors focus:border-fg'

  return (
    <>
      <Seo title="도입 문의" description="Factra 도입 문의 — 비전 검사, UWB 위치추적, 현장 진단. 공정 사진과 문제를 보내 주시면 엔지니어가 직접 답드립니다." />
      <section className="pt-[140px] pb-28 md:pt-[180px]">
        <div className="wrap grid gap-16 lg:grid-cols-[1fr_1.25fr]">
          <div>
            <p className="eyebrow text-fg-2">Contact</p>
            <h1 className="h-display mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)]">도입 문의</h1>
            <p className="lead mt-6 max-w-[440px] text-fg-2">
              지금 겪는 문제와 공정을 간단히 적어 주세요. 영업 담당이 아니라 엔지니어가 직접 읽고 답드립니다.
            </p>
            <ul className="mt-12 space-y-6 border-t border-line pt-8">
              <li className="flex gap-4"><Mail size={20} className="mt-0.5 text-signal" /><div><p className="mono text-[12px] text-fg-3">EMAIL</p><a href={`mailto:${company.email}`} className="text-[16px] font-semibold">{company.email}</a></div></li>
              <li className="flex gap-4"><Clock size={20} className="mt-0.5 text-signal" /><div><p className="mono text-[12px] text-fg-3">RESPONSE</p><p className="text-[16px] font-semibold">영업일 기준 1~2일 안에 답변</p></div></li>
              <li className="flex gap-4"><MapPinned size={20} className="mt-0.5 text-signal" /><div><p className="mono text-[12px] text-fg-3">ON-SITE</p><p className="text-[16px] font-semibold">필요하면 현장 방문 실측</p></div></li>
            </ul>
            <div className="mt-12 border border-line bg-paper-2 p-6">
              <p className="text-[15px] font-semibold">이런 것이 있으면 더 빨라요</p>
              <ul className="mt-3 space-y-1.5 text-[14px] text-fg-2">
                {hints[topic].map(h => <li key={h}>— {h}</li>)}
              </ul>
            </div>
          </div>

          <form onSubmit={onSubmit} className="border border-line bg-card p-7 md:p-10">
            <p className="text-[15px] font-semibold">관심 분야</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {topics.map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`h-10 px-4 text-[14px] border transition-colors ${topic === t ? 'border-ink bg-ink text-white' : 'border-line hover:border-fg'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <label className="block"><span className="text-[14px] font-medium">회사명 *</span><input name="company" required className={`${input} mt-2`} /></label>
              <label className="block"><span className="text-[14px] font-medium">담당자 *</span><input name="name" required className={`${input} mt-2`} /></label>
              <label className="block"><span className="text-[14px] font-medium">연락처 *</span><input name="phone" required type="tel" className={`${input} mt-2`} /></label>
              <label className="block"><span className="text-[14px] font-medium">이메일</span><input name="email" type="email" className={`${input} mt-2`} /></label>
            </div>
            <label className="mt-5 block">
              <span className="text-[14px] font-medium">공정 · 문제 설명 *</span>
              <textarea name="message" required rows={7} placeholder="예) 입고 자재 라벨을 사람이 보고 MES에 입력하고 있습니다. 하루 약 800릴, 공급사 12곳…" className="mt-2 w-full border border-line bg-white p-4 text-[15px] outline-none transition-colors focus:border-fg" />
            </label>
            <label className="mt-5 flex items-start gap-2.5 text-[13.5px] text-fg-2">
              <input type="checkbox" required className="mt-1 accent-[#FF5A1F]" />
              <span>문의 답변을 위해 회사명·담당자·연락처를 수집·이용하는 데 동의합니다. (답변 완료 후 1년 보관) <Link href="/privacy/" className="underline underline-offset-2">개인정보 처리방침</Link></span>
            </label>
            <button type="submit" className="mt-8 h-13 w-full bg-signal py-4 text-[16px] font-semibold text-white transition-colors hover:bg-signal-2">
              문의 보내기
            </button>
            <p className="mt-3 text-[13px] text-fg-3">보내기를 누르면 내용이 담긴 메일 작성 창이 열립니다. 사진·도면은 그 메일에 첨부해 주세요.</p>
            {sent && <p className="mt-4 text-[14px] text-fg-2">메일 작성 창이 열렸습니다. 사진을 첨부해 보내 주세요. 창이 열리지 않으면 {company.email} 로 직접 보내 주세요.</p>}
          </form>
        </div>
      </section>
    </>
  )
}
