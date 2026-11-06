import Button from '@/components/ui/Button'
import FadeIn from '@/components/ui/FadeIn'
import { company } from '@/lib/site'

export default function CTA({ title, desc }: { title?: string; desc?: string }) {
  return (
    <section className="relative overflow-hidden bg-ink text-white grid-ink">
      <div className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-signal/20 blur-[140px]" />
      <div className="relative wrap py-28 md:py-36">
        <FadeIn>
          <p className="eyebrow text-on-ink-2">Contact</p>
          <h2 className="h-display mt-6 max-w-[820px] text-[clamp(2rem,4.4vw,3.4rem)]">
            {title ?? <>라인 하나, 공정 하나부터<br />같이 보겠습니다.</>}
          </h2>
          <p className="lead mt-6 max-w-[580px] text-on-ink-2">
            {desc ?? '공정 사진 몇 장과 지금 겪는 문제를 보내 주시면, 엔지니어가 직접 보고 가능한 범위와 방법을 답드립니다. 필요하면 현장에 가서 실측합니다.'}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/contact/">도입 문의하기</Button>
            <Button href={`mailto:${company.email}`} variant="ghost-light" arrow={false}>{company.email}</Button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
