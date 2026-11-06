import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

type Variant = 'signal' | 'light' | 'dark' | 'ghost-light' | 'ghost-dark'

const styles: Record<Variant, string> = {
  signal: 'bg-signal text-white hover:bg-signal-2',
  light: 'bg-white text-ink hover:bg-paper-2',
  dark: 'bg-ink text-on-ink hover:bg-ink-3',
  'ghost-light': 'border border-white/25 text-white hover:border-white/60',
  'ghost-dark': 'border border-line text-fg hover:border-fg',
}

export default function Button({ href, children, variant = 'signal', arrow = true }: { href: string; children: ReactNode; variant?: Variant; arrow?: boolean }) {
  const external = href.startsWith('http') || href.startsWith('mailto:')
  const cls = `group inline-flex items-center gap-2 h-12 px-6 text-[15px] font-semibold transition-colors ${styles[variant]}`
  const inner = (
    <>
      {children}
      {arrow && <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
    </>
  )
  if (external) return <a href={href} className={cls} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{inner}</a>
  return <Link href={href} className={cls}>{inner}</Link>
}
