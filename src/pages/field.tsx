import { Camera, CloudOff, Layers, FileCheck2, Radio, Lock } from 'lucide-react'
import Seo from '@/components/layout/Seo'
import PageHero from '@/components/sections/PageHero'
import SectionHead from '@/components/sections/SectionHead'
import CTA from '@/components/sections/CTA'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/ui/FadeIn'

const stages = [
  { n: '01', icon: Camera, t: '현장에서 찍고 적는다', d: '설비 명판·제어반·배선 사진과 메모를 모바일 앱에 바로 기록합니다.' },
  { n: '02', icon: CloudOff, t: '끊겨도 기기에 먼저 저장', d: '공장 안 음영 지역에서도 기록은 기기에 먼저 남고, 연결되면 자동으로 올라갑니다.' },
  { n: '03', icon: Layers, t: '사무실에서 설비로 묶는다', d: '흩어진 사진·메모·측정을 설비 단위로 정리합니다. 원본은 지우지 않습니다.' },
  { n: '04', icon: FileCheck2, t: '판정하고 산출물로', d: '설비 데이터 수집 가능 여부를 판정하고, 진단 보고서와 구축 범위로 이어 줍니다.' },
]

export default function Field() {
  return (
    <>
      <Seo title="Factra Field — 현장 실측·진단 플랫폼" description="현장 실측(사진·메모·통신 측정)을 기기에 먼저 저장하고, 사무실에서 설비로 묶어 판정·진단 보고서까지 잇는 Factra의 실측 플랫폼." />
      <PageHero
        eyebrow="Factra Field"
        image="/images/field-measure.jpg"
        title={<>좋은 설계는<br />정확한 실측에서 나옵니다.</>}
        desc="Factra Field는 Factra 엔지니어가 현장 진단에 쓰는 실측 플랫폼입니다. 현장에서 본 것을 빠짐없이 남기고, 그 기록으로 판정과 설계까지 한 번에 잇습니다."
      >
        <Button href="/contact/">현장 진단 신청</Button>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Flow" title="현장의 기록이 그대로 설계가 됩니다." desc="실측 노트가 엑셀과 카톡 사진으로 흩어지면, 설계 단계에서 다시 현장에 가야 합니다. Field는 그 왕복을 없앱니다." />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stages.map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.08} className="border border-line bg-card p-7">
                <div className="flex items-center justify-between">
                  <s.icon size={24} strokeWidth={1.6} className="text-signal" />
                  <span className="mono text-[12px] text-fg-3">{s.n}</span>
                </div>
                <h3 className="mt-8 text-[18px] font-bold tracking-[-0.02em]">{s.t}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-fg-2">{s.d}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper-2">
        <div className="wrap section grid gap-14 lg:grid-cols-2 lg:items-center">
          <FadeIn>
            <div className="finder relative overflow-hidden">
              <img src="/images/control-room.jpg" alt="" className="aspect-[4/3] w-full object-cover" />
            </div>
          </FadeIn>
          <div>
            <SectionHead eyebrow="Field rules" title="현장 장비는 건드리지 않습니다." />
            <FadeIn delay={0.1}>
              <ul className="mt-10 space-y-6">
                <li className="flex gap-4">
                  <Radio size={22} className="mt-0.5 shrink-0 text-signal" />
                  <div><p className="text-[17px] font-semibold">통신 측정은 읽기만</p><p className="mt-1 text-[14.5px] text-fg-2">설비 통신을 확인할 때 쓰기 명령은 코드 수준에서 막혀 있습니다. 가동 중인 라인에 영향을 주지 않습니다.</p></div>
                </li>
                <li className="flex gap-4">
                  <Lock size={22} className="mt-0.5 shrink-0 text-signal" />
                  <div><p className="text-[17px] font-semibold">원본은 지우지 않음</p><p className="mt-1 text-[14.5px] text-fg-2">사진·녹화 원본은 삭제하지 않고 표시만 합니다. 나중에 판단 근거를 다시 확인할 수 있습니다.</p></div>
                </li>
                <li className="flex gap-4">
                  <FileCheck2 size={22} className="mt-0.5 shrink-0 text-signal" />
                  <div><p className="text-[17px] font-semibold">기기 판정 기준 내장</p><p className="mt-1 text-[14.5px] text-fg-2">PLC·인버터·계측기 등 기기별로 데이터를 받을 수 있는지 판정하는 기준을 쌓아 두고 씁니다.</p></div>
                </li>
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      <CTA title="현장 진단부터 시작하세요." desc="엔지니어가 라인을 직접 보고, 무엇을 자동화할 수 있는지와 필요한 장비·범위를 정리해 드립니다." />
    </>
  )
}
