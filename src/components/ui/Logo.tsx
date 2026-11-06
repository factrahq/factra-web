// Factra 표식: 카메라 뷰파인더 모서리 + 가운데 신호점
export function LogoMark({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M2 8V2h6M16 2h6v6M22 16v6h-6M8 22H2v-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
      <rect x="9" y="9" width="6" height="6" fill="#FF5A1F" />
    </svg>
  )
}

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="font-[family-name:var(--font-display)] text-[19px] font-bold tracking-[0.14em]">FACTRA</span>
    </span>
  )
}
