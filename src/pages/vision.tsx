import { Barcode, ScanSearch, Crosshair, History, RotateCcw, Users, FlaskConical, WifiOff, PlayCircle } from 'lucide-react'
import Seo from '@/components/layout/Seo'
import PageHero from '@/components/sections/PageHero'
import SectionHead from '@/components/sections/SectionHead'
import CTA from '@/components/sections/CTA'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/ui/FadeIn'

const uses = [
  {
    icon: Barcode,
    title: '판독',
    sub: 'Read',
    desc: '바코드·QR·문자. 공급사마다 다른 라벨 양식을 템플릿으로 등록해 두면, 어느 위치에 붙어 있어도 찾아서 읽습니다.',
    eg: '입고 자재 라벨, 출하 라벨 검증, 로트 추적',
  },
  {
    icon: ScanSearch,
    title: '외관 검사',
    sub: 'Inspect',
    desc: '기준 이미지와 비교해 번짐·누락·이물·위치 틀어짐을 찾습니다. 불량 사진이 적어도 기준 비교로 시작할 수 있습니다.',
    eg: '인쇄 번짐·누락, 부품 누락, 표면 이물',
  },
  {
    icon: Crosshair,
    title: '위치 · 정렬',
    sub: 'Locate',
    desc: '대상의 위치와 방향을 계산해 로봇·설비가 쓸 좌표로 넘깁니다. 부착 후에는 두 번째 카메라로 결과를 확인합니다.',
    eg: '라벨 부착 좌표, 픽앤플레이스 보정',
  },
]

const flow = [
  { t: '트리거', d: 'PLC 레지스터 · 근접센서 · 주기 촬영' },
  { t: '촬영', d: 'USB3 · GigE 산업용 카메라' },
  { t: 'AI 처리', d: '분할 · 임베딩 · 매칭 · 판독' },
  { t: '판정', d: 'OK / NG · 불량 종류 · 좌표' },
  { t: '출력', d: 'PLC · MES · 경광등 · 부저' },
  { t: '기록', d: '처리 이력 · 증거 이미지' },
]

const features = [
  { icon: PlayCircle, t: '현장 기록 재생', d: '지난 운전 기록을 새 규칙·새 기준정보로 다시 계산합니다. 배포 전에 “NG로 바뀌는 건수”를 미리 압니다.' },
  { icon: History, t: '처리 이력', d: '사이클마다 한 줄씩 쌓입니다. 기간·OK/NG·LOT로 찾고, 엑셀(CSV)로 내려받습니다.' },
  { icon: Users, t: '담당자 화면', d: '신규 품목·라벨 템플릿 등록은 현장 담당자가 직접. “읽힌 값 복사” 방식으로 입력 실수를 줄였습니다.' },
  { icon: RotateCcw, t: '배포 · 즉시 롤백', d: '새 버전은 새 폴더에 설치하고 서비스 경로만 바꿉니다. 문제가 있으면 한 번에 되돌립니다.' },
  { icon: FlaskConical, t: '시험 모드', d: '가상 PLC·가상 MES·가상 센서로 라인 없이 전체 흐름을 돌려 봅니다. 설치 전 검증에 씁니다.' },
  { icon: WifiOff, t: '오프라인 운전', d: '판정은 모두 라인 옆 장비에서. 내부망만으로 동작하고, 재부팅 후 시계·원격 접속까지 자동 복구합니다.' },
]

const specs = [
  ['엣지 장비', 'NVIDIA Jetson Orin 계열 (JetPack 6)'],
  ['카메라', '산업용 USB3 · GigE · UVC, 최대 25MP (5120×5120)'],
  ['AI', '인스턴스 분할(RTMDet), 임베딩 검색(DINOv2), 특징점 매칭, 바코드·QR·OCR'],
  ['설비 연동', 'Modbus TCP (PLC), 디지털 입출력, 경광등 · 부저'],
  ['MES 연동', 'HTTP API — 업무 규격은 고객 앱에서 정의'],
  ['운영 화면', '웹 콘솔 — 실시간 상태, 처리 이력, 기준정보, 수동 촬영'],
  ['설치 · 운영', '패키지 설치 · 롤백 스크립트, 서비스 자동 재시작, 원격 지원'],
]

export default function Vision() {
  return (
    <>
      <Seo title="Factra Vision — 비전 검사·판독 플랫폼" description="라벨 판독, 인쇄·외관 불량 검사, 부착 위치 계산. 라인 옆 엣지 장비에서 사이클마다 판정하고 PLC·MES로 돌려주는 공장용 비전 플랫폼." />
      <PageHero
        eyebrow="Factra Vision"
        image="/images/machine-dark.jpg"
        title={<>라인 위에서 읽고, 보고,<br />바로 판정합니다.</>}
        desc="Factra Vision은 공장용 비전 검사 플랫폼입니다. 카메라·PLC·MES·이력·배포까지 검증된 공통 기능 위에, 공장마다 다른 검사 로직만 얹어 빠르게 도입합니다."
      >
        <Button href="/contact/">도입 상담</Button>
        <Button href="/cases/" variant="ghost-light">도입 사례</Button>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="What it does" title="세 가지 일을 합니다." desc="대부분의 공장 비전 과제는 이 셋 중 하나, 또는 그 조합입니다." />
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {uses.map((u, i) => (
              <FadeIn key={u.title} delay={i * 0.1} className="border border-line bg-card p-8">
                <div className="flex items-center justify-between">
                  <u.icon size={28} strokeWidth={1.6} className="text-signal" />
                  <span className="mono text-[12px] text-fg-3">{u.sub}</span>
                </div>
                <h3 className="mt-10 text-[24px] font-bold tracking-[-0.02em]">{u.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-fg-2">{u.desc}</p>
                <p className="mt-6 border-t border-line pt-4 text-[13.5px] text-fg-3">예) {u.eg}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-white grid-ink">
        <div className="wrap section">
          <SectionHead dark eyebrow="Cycle" title="한 사이클은 이렇게 돕니다." desc="설비 신호 하나로 시작해 판정 결과를 설비로 돌려주고, 모든 과정을 기록으로 남깁니다." />
          <div className="mt-16 grid gap-px border border-line-ink bg-line-ink sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {flow.map((f, i) => (
              <FadeIn key={f.t} delay={i * 0.07} className="relative bg-ink p-6">
                <p className="mono text-[12px] text-signal">STEP {String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-8 text-[19px] font-bold">{f.t}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-on-ink-2">{f.d}</p>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.2}>
            <div className="finder relative mt-10 overflow-hidden border border-line-ink">
              <img src="/images/optics.jpg" alt="" className="h-[260px] w-full object-cover opacity-60 md:h-[340px]" />
              <div className="scanline" />
              <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-t from-ink to-transparent p-6">
                <p className="max-w-[560px] text-[15px] text-on-ink">
                  조명과 렌즈 선택이 정확도의 절반입니다. Factra는 현장 실측 단계에서 대상·거리·조도를 재고 카메라 구성을 정합니다.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Platform" title={<>설치하고 끝이 아니라,<br />운영하기 좋게 만들었습니다.</>} desc="현장에서 실제로 겪은 문제 — 기록이 며칠 만에 지워지고, 배포 후 화면이 예전 것으로 보이고, 재부팅하면 시계가 틀어지는 일 — 를 플랫폼 기본 기능으로 해결했습니다." />
          <div className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <FadeIn key={f.t} delay={(i % 3) * 0.08} className="bg-paper p-8">
                <f.icon size={24} strokeWidth={1.6} />
                <h3 className="mt-6 text-[18px] font-bold tracking-[-0.02em]">{f.t}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-fg-2">{f.d}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-paper-2">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <SectionHead eyebrow="Specification" title="구성과 사양" desc="공정에 맞춰 카메라·조명·장비를 고릅니다. 아래는 기본 구성입니다." />
            <FadeIn delay={0.1}>
              <div className="mt-10 overflow-hidden border border-line bg-white">
                <img src="/images/jetson.jpg" alt="엣지 AI 장비 예시 (NVIDIA Jetson 개발 키트)" className="aspect-[4/3] w-full object-cover" />
              </div>
              <p className="mt-3 text-[12.5px] text-fg-3">엣지 AI 장비 예시. 라인 옆 제어반 안에 설치합니다.</p>
            </FadeIn>
          </div>
          <FadeIn delay={0.15}>
            <dl className="border-t-2 border-fg">
              {specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[120px_1fr] gap-4 border-b border-line py-5 md:grid-cols-[160px_1fr]">
                  <dt className="mono text-[13px] text-fg-3">{k}</dt>
                  <dd className="text-[15.5px]">{v}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </section>

      <CTA title="우리 공정에도 될까요?" desc="검사 대상 사진 몇 장과 라인 속도(분당 몇 개), 지금 판정을 어떻게 하는지만 알려 주세요. 가능 여부와 접근 방법을 먼저 답드립니다." />
    </>
  )
}
