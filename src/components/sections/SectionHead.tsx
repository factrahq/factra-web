import type { ReactNode } from 'react'
import FadeIn from '@/components/ui/FadeIn'

export default function SectionHead({ eyebrow, title, desc, dark = false, className = '' }: { eyebrow: string; title: ReactNode; desc?: ReactNode; dark?: boolean; className?: string }) {
  return (
    <FadeIn className={`max-w-[760px] ${className}`}>
      <p className={`eyebrow ${dark ? 'text-on-ink-2' : 'text-fg-2'}`}>{eyebrow}</p>
      <h2 className="h-section mt-5">{title}</h2>
      {desc && <p className={`lead mt-5 ${dark ? 'text-on-ink-2' : 'text-fg-2'}`}>{desc}</p>}
    </FadeIn>
  )
}
