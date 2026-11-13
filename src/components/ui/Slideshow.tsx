import { useEffect, useState } from 'react'

export type Slide = { src: string; caption?: string }

// 사진 여러 장을 겹쳐 두고 일정 간격으로 크로스페이드한다. 움직임 줄이기 설정이면 첫 장만 보인다.
export default function Slideshow({ slides, interval = 4500, className = '' }: { slides: Slide[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setI(n => (n + 1) % slides.length), interval)
    return () => clearTimeout(t)
  }, [i, slides.length, interval])

  return (
    <div className={`relative ${className}`}>
      {slides.map((s, n) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.caption ?? ''}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${n === i ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      {slides[i]?.caption && (
        <p className="mono absolute bottom-3 left-3 bg-ink/70 px-2 py-1 text-[11px] text-white">{slides[i].caption}</p>
      )}
      {slides.length > 1 && (
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          {slides.map((s, n) => (
            <button
              key={s.src}
              type="button"
              aria-label={`사진 ${n + 1}`}
              onClick={() => setI(n)}
              className={`h-1.5 w-1.5 rounded-full ${n === i ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
