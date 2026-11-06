import { motion } from 'motion/react'
import type { ReactNode } from 'react'

// 하위 페이지 공통 히어로 (어두운 사진 + 왼쪽 정렬 제목)
export default function PageHero({ eyebrow, title, desc, image, children }: { eyebrow: string; title: ReactNode; desc?: ReactNode; image: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0">
        <img src={image} alt="" className="h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
      </div>
      <div className="relative wrap pt-[168px] pb-24 md:pt-[200px] md:pb-32">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="max-w-[760px]">
          <p className="eyebrow text-on-ink-2">{eyebrow}</p>
          <h1 className="h-display mt-6 text-[clamp(2.1rem,5vw,3.75rem)]">{title}</h1>
          {desc && <p className="lead mt-6 max-w-[620px] text-on-ink-2">{desc}</p>}
          {children && <div className="mt-10 flex flex-wrap gap-3">{children}</div>}
        </motion.div>
      </div>
    </section>
  )
}
