import Seo from '@/components/layout/Seo'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <>
      <Seo title="페이지를 찾을 수 없습니다" />
      <section className="grid min-h-[80vh] place-items-center pt-[68px] grid-paper">
        <div className="wrap text-center">
          <p className="mono text-[13px] text-signal">404 · NG</p>
          <h1 className="h-display mt-5 text-[clamp(2rem,4vw,3rem)]">찾는 페이지가 없습니다.</h1>
          <p className="mt-4 text-fg-2">주소가 바뀌었거나 삭제된 페이지입니다.</p>
          <div className="mt-10 flex justify-center"><Button href="/" variant="dark">홈으로</Button></div>
        </div>
      </section>
    </>
  )
}
