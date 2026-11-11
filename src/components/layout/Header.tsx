import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { nav } from '@/lib/site'

// 어두운 히어로가 있는 페이지는 맨 위에서 헤더를 투명하게 둔다
const DARK_HERO = ['/', '/platform', '/platform/demo', '/mes', '/vision', '/rtls', '/twin', '/field', '/process', '/cases', '/company']

export default function Header() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => setOpen(false), [router.asPath])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const path = router.pathname.replace(/\/$/, '') || '/'
  const transparent = DARK_HERO.includes(path) && !scrolled && !open
  // 데모처럼 화면 전체가 어두운 페이지는 내려도 헤더를 어둡게 둔다
  const darkApp = path === '/platform/demo'
  const dark = transparent || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        transparent ? 'bg-transparent text-white border-b border-white/10' : open ? 'bg-ink text-white' : darkApp ? 'bg-ink/90 backdrop-blur-md text-white border-b border-white/10' : 'bg-paper/85 backdrop-blur-md text-fg border-b border-line'
      }`}
    >
      <div className="wrap flex h-[68px] items-center justify-between">
        <Link href="/" aria-label="Factra 홈"><Logo /></Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map(n => {
            const active = path === n.href.replace(/\/$/, '')
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`px-3.5 py-2 text-[14.5px] font-medium transition-opacity ${active ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
              >
                {n.label}
              </Link>
            )
          })}
          <Link
            href="/contact/"
            className={`ml-3 inline-flex h-10 items-center px-4 text-[14px] font-semibold transition-colors ${
              dark ? 'bg-white text-ink hover:bg-paper-2' : 'bg-ink text-white hover:bg-ink-3'
            }`}
          >
            도입 문의
          </Link>
        </nav>

        <button className="md:hidden p-2 -mr-2" onClick={() => setOpen(v => !v)} aria-label="메뉴">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 top-[68px] bg-ink text-white grid-ink">
          <div className="wrap pt-6 flex flex-col">
            {[...nav, { label: '도입 문의', href: '/contact/' }].map((n, i) => (
              <Link key={n.href} href={n.href} className="flex items-baseline gap-4 border-b border-white/10 py-5 text-[22px] font-semibold">
                <span className="mono text-[12px] text-signal">0{i + 1}</span>
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
