import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { company, products } from '@/lib/site'

export default function Footer() {
  const info = [
    company.legalName && `상호 ${company.legalName}`,
    company.ceo && `대표 ${company.ceo}`,
    company.bizNo && `사업자등록번호 ${company.bizNo}`,
    company.address,
    company.phone && `T. ${company.phone}`,
  ].filter(Boolean)

  return (
    <footer className="bg-ink text-on-ink">
      <div className="wrap pt-20 pb-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-[320px] text-[14px] leading-relaxed text-on-ink-2">
              제조 DX·AX를 위한 Factory Transformation.
              <br />
              공장을 디지털로, 그리고 AI로 전환합니다.
            </p>
          </div>

          <div>
            <p className="mono text-[11px] uppercase tracking-[0.1em] text-on-ink-3">Products</p>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {products.map(p => (
                <li key={p.key}><Link href={p.href} className="text-on-ink-2 hover:text-white">{p.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mono text-[11px] uppercase tracking-[0.1em] text-on-ink-3">Company</p>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              <li><Link href="/company/" className="text-on-ink-2 hover:text-white">회사 소개</Link></li>
              <li><Link href="/cases/" className="text-on-ink-2 hover:text-white">도입 사례</Link></li>
              <li><Link href="/contact/" className="text-on-ink-2 hover:text-white">도입 문의</Link></li>
              <li><a href={company.github} target="_blank" rel="noreferrer" className="text-on-ink-2 hover:text-white">GitHub</a></li>
            </ul>
          </div>

          <div>
            <p className="mono text-[11px] uppercase tracking-[0.1em] text-on-ink-3">Contact</p>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              <li><a href={`mailto:${company.email}`} className="text-on-ink-2 hover:text-white">{company.email}</a></li>
              <li className="text-on-ink-2">{company.domain}</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-line-ink pt-6 text-[12.5px] text-on-ink-3 md:flex-row md:items-center md:justify-between">
          <p>{info.length > 0 ? info.join('  ·  ') : `${company.brand} — ${company.domain}`}</p>
          <p className="mono">© {new Date().getFullYear()} FACTRA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
