import Seo from '@/components/layout/Seo'
import { company } from '@/lib/site'

// 개인정보 처리방침 — 문의 폼(회사명·담당자·연락처·이메일·문의 내용)만 다룬다.
// 법인 정보(법인명·대표·주소)가 정해지면 책임자 항목에 채운다.
const sections: { t: string; body: (string | string[])[] }[] = [
  { t: '1. 수집하는 항목', body: ['도입 문의를 받을 때 아래 항목을 받습니다.', ['필수: 회사명, 담당자 이름, 연락처', '선택: 이메일, 관심 분야, 공정·문제 설명, 메일에 첨부하신 사진·도면']] },
  { t: '2. 수집 목적', body: ['문의에 답하고, 상담·현장 방문·샘플 시험 일정을 잡는 데만 씁니다. 광고나 마케팅에는 쓰지 않습니다.'] },
  { t: '3. 보유 기간', body: ['답변을 마친 날부터 1년 동안 보관한 뒤 지웁니다. 계약으로 이어지면 계약과 관련 법령이 정한 기간 동안 보관합니다.'] },
  { t: '4. 제3자 제공', body: ['받은 정보를 다른 회사나 기관에 넘기지 않습니다. 법령에 따라 요구받는 경우는 예외입니다.'] },
  { t: '5. 처리 위탁', body: ['문의는 이메일로 받습니다. 메일 서비스 제공자가 메일을 보관하는 것 외에 처리를 맡기는 곳은 없습니다.'] },
  { t: '6. 파기 방법', body: ['보유 기간이 지나면 메일과 파일을 지우고, 출력한 문서는 분쇄합니다.'] },
  { t: '7. 정보주체의 권리', body: ['언제든 내 정보를 열람하거나 고치거나 지워 달라고, 또는 처리를 멈춰 달라고 요청할 수 있습니다. 아래 이메일로 알려 주시면 바로 처리합니다.'] },
  { t: '8. 샘플 사진', body: ['검사 가능 여부를 보기 위해 받은 사진은 그 검토에만 씁니다. 요청하시면 검토 후 지우고, 필요하면 비밀유지계약(NDA)을 먼저 맺습니다.'] },
  { t: '9. 문의처', body: [`개인정보 관련 문의: ${company.email}`] },
]

export default function Privacy() {
  return (
    <>
      <Seo title="개인정보 처리방침" description="FACTRA 도입 문의에서 받는 개인정보의 항목, 목적, 보유 기간과 처리 방법." />
      <section className="pt-[68px]">
        <div className="wrap max-w-[760px] py-20 md:py-28">
          <p className="eyebrow text-fg-2">Privacy</p>
          <h1 className="h-section mt-5">개인정보 처리방침</h1>
          <p className="mt-5 text-[15px] text-fg-2">{company.brand}({company.nameKo})는 도입 문의에서 받는 개인정보를 아래와 같이 다룹니다.</p>
          <div className="mt-12 space-y-10">
            {sections.map(s => (
              <div key={s.t}>
                <h2 className="text-[18px] font-bold">{s.t}</h2>
                {s.body.map((b, i) => Array.isArray(b)
                  ? <ul key={i} className="mt-3 list-disc space-y-1 pl-5 text-[15px] text-fg-2">{b.map(x => <li key={x}>{x}</li>)}</ul>
                  : <p key={i} className="mt-3 text-[15px] leading-relaxed text-fg-2">{b}</p>)}
              </div>
            ))}
          </div>
          <p className="mt-14 border-t border-line pt-6 text-[13px] text-fg-3">시행일: 2026년 11월 9일</p>
        </div>
      </section>
    </>
  )
}
