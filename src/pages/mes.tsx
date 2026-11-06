import type { ReactNode } from 'react'
import { ClipboardList, Package, Factory, ShieldCheck, Database, LayoutDashboard, Activity, Zap, Search, MessageSquare, BrainCircuit, ArrowRight } from 'lucide-react'
import Seo from '@/components/layout/Seo'
import PageHero from '@/components/sections/PageHero'
import SectionHead from '@/components/sections/SectionHead'
import CTA from '@/components/sections/CTA'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/ui/FadeIn'

/* ───────── 화면 예시 (가상 데이터) ───────── */

function Win({ title, crumb, children }: { title: string; crumb: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden border border-line bg-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between border-b border-line bg-paper px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#E4E4DF]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#E4E4DF]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#E4E4DF]" />
        </div>
        <span className="mono text-[10.5px] text-fg-3">{crumb}</span>
      </div>
      <div className="p-5">
        <p className="text-[15px] font-bold">{title}</p>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

const Badge = ({ c, children }: { c: 'ok' | 'run' | 'wait'; children: ReactNode }) => (
  <span className={`mono px-1.5 py-0.5 text-[10.5px] ${c === 'ok' ? 'bg-ok/15 text-[#198754]' : c === 'run' ? 'bg-signal/10 text-signal' : 'bg-paper-2 text-fg-2'}`}>{children}</span>
)

function OrderMock() {
  const rows = [
    ['SO-001', '거래처 A', '제품 A', '1,000', '10.05', 'run'],
    ['SO-002', '거래처 B', '제품 B', '800', '10.08', 'wait'],
    ['SO-003', '거래처 A', '제품 B', '500', '10.12', 'run'],
    ['SO-004', '거래처 C', '제품 A', '300', '09.25', 'ok'],
  ] as const
  return (
    <Win title="수주 현황" crumb="수주관리 / 수주 현황">
      <div className="grid grid-cols-[1.4fr_1fr] gap-4">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-line text-left text-fg-3">{['수주번호', '품목', '수량', '납기', ''].map(h => <th key={h} className="pb-2 font-normal">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r[0]} className={`border-b border-line/60 ${r[0] === 'SO-001' ? 'bg-signal/[0.05]' : ''}`}>
                <td className="py-2"><b className="mono text-[11.5px]">{r[0]}</b><br /><span className="text-[10.5px] text-fg-3">{r[1]}</span></td>
                <td>{r[2]}</td><td className="mono">{r[3]}</td><td className="mono">{r[4]}</td>
                <td><Badge c={r[5]}>{r[5] === 'ok' ? '완료' : r[5] === 'run' ? '진행' : '대기'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border border-line p-3">
          <p className="mono text-[11px] text-fg-3">SO-001 · 제품 A</p>
          <div className="mt-2 flex gap-4">
            <div><p className="text-[10.5px] text-fg-3">수주</p><p className="font-[family-name:var(--font-display)] text-[22px] font-bold">1,000</p></div>
            <div><p className="text-[10.5px] text-fg-3">미출고</p><p className="font-[family-name:var(--font-display)] text-[22px] font-bold text-signal">400</p></div>
          </div>
          {[['생산 진행', 80], ['누적 출고', 60]].map(([k, v]) => (
            <div key={k} className="mt-3">
              <div className="flex justify-between text-[10.5px] text-fg-2"><span>{k}</span><span className="mono">{v}%</span></div>
              <div className="mt-1 h-1.5 bg-paper-2"><div className="h-full bg-ink" style={{ width: `${v}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </Win>
  )
}

function StockMock() {
  return (
    <Win title="재고 현황 · 수불 이력" crumb="재고관리 / 재고 현황">
      <div className="grid grid-cols-4 gap-px border border-line bg-line">
        {[['현재고', '180'], ['생산입고', '780'], ['제품출고', '600'], ['기초재고', '0']].map(([k, v], i) => (
          <div key={k} className="bg-white p-3">
            <p className="text-[10.5px] text-fg-3">{k}</p>
            <p className={`font-[family-name:var(--font-display)] text-[22px] font-bold ${i === 0 ? 'text-signal' : ''}`}>{v}<span className="ml-0.5 text-[10px] text-fg-3">EA</span></p>
          </div>
        ))}
      </div>
      <table className="mt-4 w-full text-[12px]">
        <thead><tr className="border-b border-line text-left text-fg-3">{['일시', '구분', '연결', '입고', '출고', '재고'].map(h => <th key={h} className="pb-2 font-normal">{h}</th>)}</tr></thead>
        <tbody>
          <tr className="border-b border-line/60"><td className="mono py-2">10.03 14:20</td><td><Badge c="run">제품출고</Badge></td><td className="mono">SH-001</td><td>—</td><td className="mono">600</td><td className="mono font-bold">180</td></tr>
          <tr><td className="mono py-2">10.02 17:00</td><td><Badge c="ok">생산입고</Badge></td><td className="mono">WO-001</td><td className="mono">780</td><td>—</td><td className="mono font-bold">780</td></tr>
        </tbody>
      </table>
    </Win>
  )
}

function PlanMock() {
  return (
    <Win title="작업계획 · 작업지시" crumb="생산관리 / 작업계획">
      <div className="grid grid-cols-[60px_repeat(4,1fr)] border-t border-l border-line text-[11px]">
        {['', '10.01', '10.02', '10.03', '10.04'].map(d => <div key={d} className="border-b border-r border-line bg-paper px-2 py-1.5 text-center text-fg-3">{d}</div>)}
        {['라인 1', '라인 2', '라인 3'].map((l, r) => (
          <div key={l} className="contents">
            <div className="border-b border-r border-line px-2 py-3 text-fg-2">{l}</div>
            {[0, 1, 2, 3].map(c => (
              <div key={c} className="relative border-b border-r border-line py-3">
                {r === 0 && c === 1 && <div className="absolute inset-x-1 top-1.5 border-l-2 border-signal bg-signal/10 px-1.5 py-1"><b className="mono text-[10px]">WO-001</b><br /><span className="text-[9.5px] text-fg-2">제품 A · 80%</span></div>}
                {r === 1 && c === 2 && <div className="absolute inset-x-1 top-1.5 border-l-2 border-fg-3 bg-paper-2 px-1.5 py-1"><b className="mono text-[10px]">WO-002</b><br /><span className="text-[9.5px] text-fg-2">제품 B · 계획</span></div>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Win>
  )
}

function ResultMock() {
  return (
    <Win title="생산실적 등록" crumb="생산관리 / 실적 입력">
      <p className="mono text-[11px] text-fg-3">WO-001 · 제품 A · 공정 01 / 설비 01 · 지시 1,000 EA</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[['생산', '800', 'border-ink'], ['양품', '780', 'border-line'], ['불량', '20', 'border-signal/50 text-signal']].map(([k, v, c]) => (
          <div key={k} className={`border-2 p-3 ${c}`}>
            <p className="text-[10.5px] text-fg-3">{k}수량</p>
            <p className="font-[family-name:var(--font-display)] text-[26px] font-bold">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1.5 text-[12px]">
        {[['유형 A', 10], ['유형 B', 6], ['유형 C', 4]].map(([k, v]) => (
          <div key={k} className="flex justify-between border-b border-line/60 pb-1.5"><span>{k}</span><span className="mono">{v} EA · 공정 01</span></div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-[#198754]">✓ 수량 검증 완료 800 = 양품 780 + 불량 20</p>
    </Win>
  )
}

function QualityMock() {
  return (
    <Win title="품질 현황" crumb="품질관리 / 품질 현황">
      <div className="grid grid-cols-3 gap-px border border-line bg-line">
        {[['생산수량', '800', 'EA'], ['불량수량', '20', 'EA'], ['불량률', '2.5', '%']].map(([k, v, u], i) => (
          <div key={k} className="bg-white p-3">
            <p className="text-[10.5px] text-fg-3">{k}</p>
            <p className={`font-[family-name:var(--font-display)] text-[22px] font-bold ${i > 0 ? 'text-signal' : ''}`}>{v}<span className="ml-0.5 text-[10px] text-fg-3">{u}</span></p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11.5px] text-fg-2">불량유형별 발생</p>
      <div className="mt-2 space-y-2">
        {[['유형 A', 10], ['유형 B', 6], ['유형 C', 4]].map(([k, v]) => (
          <div key={k} className="grid grid-cols-[48px_1fr_24px] items-center gap-2 text-[11.5px]">
            <span>{k}</span><div className="h-2.5 bg-paper-2"><div className="h-full bg-signal" style={{ width: `${(v as number) * 9}%` }} /></div><span className="mono text-right">{v}</span>
          </div>
        ))}
      </div>
    </Win>
  )
}

/* ───────── 내용 ───────── */

const coreApps = [
  { icon: ClipboardList, t: '수주관리', s: '주문 · 납기', d: '거래처 주문과 납기를 등록하고, 수주별 생산·출고 진행과 미출고 잔량을 봅니다.' },
  { icon: Package, t: '재고관리', s: '입고 · 출고 · 현재고 · 수불', d: '입고·생산·출고에 따른 수량 변동과 품목·창고·로트별 현재고를 관리합니다.' },
  { icon: Factory, t: '생산관리', s: '계획 · 지시 · 생산실적', d: '라인별 작업계획을 세우고, 제품·공정·설비별 작업을 지시하고, 실적과 불량을 받습니다.' },
  { icon: ShieldCheck, t: '품질관리', s: '불량 · 검사 · 품질 이력', d: '실적 불량과 검사 결과를 연결해 제품·공정별 불량률과 발생 이력을 봅니다.' },
]

const linkedApps = [
  { icon: LayoutDashboard, t: '통합관제' },
  { icon: Activity, t: '설비관리' },
  { icon: Zap, t: '에너지관리' },
  { icon: Search, t: '데이터조회' },
  { icon: MessageSquare, t: 'AI 채팅' },
]

const details = [
  {
    eyebrow: '수주관리',
    title: '주문 하나가 어디까지 왔는지, 한 화면에서.',
    points: [['주문 · 납기 등록', '거래처, 품목, 수량·납기를 등록하고 주문 변경과 수주 상태를 관리합니다.'], ['생산 진행 연결', '연결된 작업지시와 생산실적을 수주 상세에서 바로 확인합니다.'], ['출고 잔량 확인', '누적 출고와 미출고 수량, 분할 출고 이력을 봅니다.']],
    mock: <OrderMock />,
  },
  {
    eyebrow: '재고관리',
    title: '재고 숫자마다 근거가 남습니다.',
    points: [['입출고 · 생산 반영', '입고·자재 투입·생산·출고에 따른 재고 변동을 자동으로 기록합니다.'], ['현재고 · 이력 조회', '품목·창고·로트별 재고와 수량이 바뀐 근거를 확인합니다.'], ['출고 · 실사 · 조정', '출고 확정 시 재고와 수주 잔량이 함께 갱신되고, 이동·실사 차이는 사유와 함께 남습니다.']],
    mock: <StockMock />,
  },
  {
    eyebrow: '생산관리 · 계획 · 지시',
    title: '수주와 재고를 보고 계획하고, 번호 하나로 현장에 지시합니다.',
    points: [['작업계획 등록', '생산일·라인·계획수량과 우선순위를 일정표에서 조정합니다.'], ['현장 작업지시', '수주·제품·공정·설비를 지정해 작업지시번호로 현장과 연결합니다.'], ['진행 상태 확인', '대기·진행·완료와 계획 대비 미완료 작업을 봅니다.']],
    mock: <PlanMock />,
  },
  {
    eyebrow: '생산관리 · 실적',
    title: '실적을 확정하면 재고와 품질이 같이 움직입니다.',
    points: [['실적 · 불량 입력', '작업자·작업일시·수량과 불량유형·발생 공정을 기록합니다.'], ['관련 업무 반영', '확정 실적으로 생산 진행, 불량률, 생산입고 수량이 함께 갱신됩니다.'], ['수정 이력 관리', '임시저장과 확정을 구분하고, 확정 후 변경은 이력으로 남깁니다.']],
    mock: <ResultMock />,
  },
  {
    eyebrow: '품질관리',
    title: '불량을 제품·공정·유형별로, 생산 조건과 함께.',
    points: [['불량정보 연결', '실적 불량과 검사 결과를 작업·제품·공정 기준으로 연결합니다.'], ['집계 기준 확인', '같은 불량이 두 번 세어지지 않게 중복을 걸러 집계합니다.'], ['발생 이력 조회', '불량이 났을 때의 설비 조건까지 함께 조회합니다. 설비 데이터가 연결돼 있기 때문입니다.']],
    mock: <QualityMock />,
  },
]

const schedule = ['업무 파악', '설계 합의', '기능 구성', '기능 시연', '데이터 연계', '통합시험', '시범운영', '운영전환']
const rows = [
  { t: '업무분석 · 설계', s: 0, e: 2, label: '분석 · 설계' },
  { t: 'MES 기능 구축', s: 2, e: 6, label: '기능 구축' },
  { t: '데이터 연계 · 시험', s: 4, e: 7, label: '연계 · 시험' },
  { t: '현장 시범운영', s: 6, e: 8, label: '시범운영' },
  { t: '교육 · 검수 · 전환', s: 7, e: 8, label: '전환', dark: true },
]

const deliverables = [
  ['착수', '업무분석 · 설계', '업무 흐름 · 범위 · 설계안', '대상 업무와 처리 기준 합의'],
  ['구축', 'MES 기능 구축', '업무 앱 · 공통 기준정보', '기능별 시연 · 요구사항 확인'],
  ['검증', '데이터 연계 · 시험', '연계 · 통합시험 결과', '업무 흐름과 수량 정합성 확인'],
  ['현장 적용', '현장 시범운영', '현장 시험 결과 · 보완 내역', '실제 업무에서 사용 · 보완 확인'],
  ['완료', '교육 · 검수 · 전환', '교육 · 검수 · 운영 자료', '합의 기능과 운영 준비 확인'],
]

const roles = [
  { n: '01', t: '업무분석 · 설계', c: ['담당자 · 현행 양식', '품목 · 공정 · 설비', '품질 · 생산 데이터'], f: ['요구사항 · 양식 정리', '코드 · 연계 설계', '데이터 점검'] },
  { n: '02', t: '구축 · 연계 · 시험', c: ['접속 · 작업시간 협의', '품질 데이터 제공', '설계 · 기능 확인'], f: ['기능 구성 · 연계', '초기 데이터 등록', '기능 시연 · 시험'] },
  { n: '03', t: '시범운영', c: ['초기재고 확정', '실제 업무 시험', '보완 의견 제공'], f: ['통합시험 지원', '오류 수정', '업무 흐름 보완'] },
  { n: '04', t: '검수 · 인수', c: ['사용자 교육 참여', '운영 담당 지정', '검수 확인'], f: ['교육 · 운영 자료', '최종 시험 결과', '검수 · 인수 지원'] },
]

export default function Mes() {
  return (
    <>
      <Seo title="Factra MES — 수주·재고·생산·품질" description="공통 플랫폼 위에서 수주·재고·생산·품질 4개 업무 앱을 연결하는 Factra MES. 설비 데이터와 이어지고, 품질 AI를 선택 적용할 수 있습니다." />
      <PageHero
        eyebrow="Factra MES · DX"
        image="/images/mes-warehouse.jpg"
        title={<>주문부터 출고까지,<br />한 흐름으로 잇습니다.</>}
        desc="Factra MES는 공통 플랫폼 위에서 수주·재고·생산·품질 업무를 연결합니다. 같은 기준정보를 쓰고, 설비 데이터와 이어지며, 필요하면 품질 AI까지 붙입니다."
      >
        <Button href="/contact/">MES 도입 상담</Button>
        <Button href="/platform/" variant="ghost-light">Factra Platform 보기</Button>
      </PageHero>

      {/* 구성 */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Composition" title="업무 앱 4개, 그리고 하나의 기준정보." desc="수주·재고·생산·품질 업무 앱을 기본으로, 필요한 운영관리 앱을 함께 구성합니다. 처음 도입하는 공장도, 이미 Factra Platform을 쓰는 공장도 같은 방식으로 붙입니다." />
          <FadeIn delay={0.1}>
            <div className="mt-14 grid gap-4 lg:grid-cols-[1fr_3fr]">
              <div className="border border-line bg-paper-2 p-5">
                <p className="mono text-[11px] uppercase tracking-[0.08em] text-fg-3">연계 앱 · 선택</p>
                <ul className="mt-4 space-y-2">
                  {linkedApps.map(a => (
                    <li key={a.t} className="flex items-center gap-3 border border-line bg-white px-3 py-2.5 text-[14px] font-medium"><a.icon size={16} className="text-fg-2" />{a.t}</li>
                  ))}
                </ul>
              </div>
              <div className="border-2 border-ink p-5">
                <p className="mono text-[11px] uppercase tracking-[0.08em] text-signal">MES 업무 앱 4개</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {coreApps.map(a => (
                    <div key={a.t} className="border border-line bg-card p-5">
                      <a.icon size={24} strokeWidth={1.6} className="text-signal" />
                      <p className="mt-5 text-[19px] font-bold">{a.t}</p>
                      <p className="mono mt-1 text-[11.5px] text-fg-3">{a.s}</p>
                      <p className="mt-3 text-[13.5px] leading-relaxed text-fg-2">{a.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-px bg-ink p-6 text-white md:grid-cols-[220px_1fr]">
              <div>
                <p className="text-[20px] font-bold">Factra Platform</p>
                <p className="mono mt-1 text-[11px] text-on-ink-3">공통 기반</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[['현장 데이터 연계', '설비 · 공정 데이터'], ['공통 기준정보 관리', '제품 · 공정 · 설비 · 거래처 · 창고 · 불량유형'], ['사용자 · 권한', '작업자 업무 입력 · 검사 · 불량 정보']].map(([k, v]) => (
                  <div key={k} className="border-l border-white/15 pl-4"><p className="text-[15px] font-semibold">{k}</p><p className="mt-1 text-[12.5px] text-on-ink-2">{v}</p></div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 업무 흐름 */}
      <section className="bg-ink text-white grid-ink">
        <div className="wrap section">
          <SectionHead dark eyebrow="Flow" title="한 번 입력하면, 다음 업무가 따라옵니다." desc="출고를 확정하면 재고가 빠지고 수주 잔량이 줄어듭니다. 실적의 불량은 품질관리로 넘어갑니다. 같은 숫자를 두 번 입력하지 않습니다." />
          <FadeIn delay={0.1}>
            <div className="mt-14 grid items-stretch gap-3 lg:grid-cols-[1fr_auto_3fr_auto_1.2fr]">
              <div className="border border-white/15 p-5"><p className="mono text-[11px] text-signal">수주관리</p><p className="mt-3 text-[16px] font-semibold">품목 · 수량 · 납기</p></div>
              <div className="hidden items-center lg:flex"><ArrowRight className="text-signal" /></div>
              <div className="border border-signal/60 p-5">
                <p className="mono text-[11px] text-signal">생산관리</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {[['작업계획', '일자 · 라인 · 수량'], ['작업지시', '제품 · 공정 · 설비'], ['실적 입력', '생산 · 양품 · 불량']].map(([k, v]) => (
                    <div key={k} className="bg-white/[0.06] p-3"><p className="text-[15px] font-semibold">{k}</p><p className="mt-1 text-[12px] text-on-ink-2">{v}</p></div>
                  ))}
                </div>
              </div>
              <div className="hidden items-center lg:flex"><ArrowRight className="text-signal" /></div>
              <div className="border border-white/15 p-5"><p className="mono text-[11px] text-signal">재고관리</p><p className="mt-3 text-[16px] font-semibold">입고 · 출고 · 현재고</p><p className="mt-1 text-[12px] text-on-ink-2">출고 확정 → 재고 차감 · 수주 잔량 갱신</p></div>
            </div>
            <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_auto_3fr_auto_1.2fr]">
              <div className="hidden lg:block" /><div className="hidden lg:block" />
              <div className="border border-white/15 p-5"><p className="mono text-[11px] text-signal">품질관리 ← 실적 불량</p><p className="mt-2 text-[15px] font-semibold">불량 · 검사정보 연결, 제품 · 공정별 불량 집계</p></div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-5">
              <span className="text-[14px] font-semibold"><Database size={15} className="mr-2 inline text-signal" />공통 기준정보</span>
              {['제품 · 자재', '공정 · 설비', '거래처 · 창고', '불량유형'].map(t => <span key={t} className="mono text-[12px] text-on-ink-2">{t}</span>)}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 기능 상세 */}
      {details.map((d, i) => (
        <section key={d.eyebrow} className={`section ${i % 2 ? 'bg-paper-2' : ''}`}>
          <div className={`wrap grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
            <div>
              <SectionHead eyebrow={d.eyebrow} title={d.title} />
              <FadeIn delay={0.1}>
                <ol className="mt-10 space-y-5">
                  {d.points.map(([k, v], j) => (
                    <li key={k} className="grid grid-cols-[36px_1fr] gap-2">
                      <span className="mono text-[13px] text-signal">0{j + 1}</span>
                      <div><p className="text-[17px] font-semibold">{k}</p><p className="mt-1 text-[14.5px] leading-relaxed text-fg-2">{v}</p></div>
                    </li>
                  ))}
                </ol>
              </FadeIn>
            </div>
            <FadeIn delay={0.15}>
              {d.mock}
              <p className="mt-3 text-[12px] text-fg-3">화면 구성 예시 · 가상 데이터. 화면과 동작은 상세 설계에서 확정합니다.</p>
            </FadeIn>
          </div>
        </section>
      ))}

      {/* 품질 AI */}
      <section className="bg-ink text-white grid-ink">
        <div className="wrap section grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead dark eyebrow="Quality AI · 선택" title={<>쌓인 생산 조건으로,<br />불량을 미리 봅니다.</>} desc="MES의 실적·불량과 설비 데이터가 같은 곳에 있어 품질 AI를 바로 시험할 수 있습니다. 데이터 준비 상태를 먼저 확인하고, 과제를 골라 모델을 만들고 검증합니다." />
          </div>
          <FadeIn delay={0.1}>
            <ol className="space-y-3">
              {[
                ['품질문제 선정', '우선 적용할 품질문제를 고르고, 쓸 수 있는 데이터와 판정 기준을 확인합니다.'],
                ['모델 개발 · 시험', '공정·설비 조건과 품질 결과를 연결하고, 학습·시험 데이터를 나눠 검증합니다.'],
                ['활용 가능성 확인', '정밀도·재현율과 오검출·미검출 사례를 정리하고, 현장 적용 조건과 후속안을 제시합니다.'],
              ].map(([k, v], i) => (
                <li key={k} className="grid grid-cols-[48px_1fr] gap-3 border border-white/15 p-5">
                  <BrainCircuit size={22} className="text-signal" />
                  <div><p className="text-[16.5px] font-semibold"><span className="mono mr-2 text-[12px] text-signal">0{i + 1}</span>{k}</p><p className="mt-1.5 text-[14px] text-on-ink-2">{v}</p></div>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[12.5px] text-on-ink-3">선택 도입 항목입니다. 범위·비용·성능 목표는 따로 협의합니다.</p>
          </FadeIn>
        </div>
      </section>

      {/* 일정 */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Schedule" title="업무분석부터 운영전환까지." desc="단계별 기간은 도입 범위에 따라 착수 때 확정합니다. 각 단계는 합의한 완료 기준을 넘어야 다음으로 갑니다." />
          <FadeIn delay={0.1}>
            <div className="mt-12 overflow-x-auto">
              <div className="min-w-[860px]">
                <div className="grid grid-cols-[180px_repeat(8,1fr)] border-b-2 border-fg text-[12.5px]">
                  <div className="py-3 font-semibold">추진 항목</div>
                  {schedule.map((s, i) => <div key={s} className={`py-3 text-center ${i >= 2 ? 'text-signal' : 'text-fg-2'}`}>{s}</div>)}
                </div>
                {rows.map(r => (
                  <div key={r.t} className="grid grid-cols-[180px_repeat(8,1fr)] items-center border-b border-line">
                    <div className="py-4 text-[14.5px] font-semibold">{r.t}</div>
                    <div className="relative col-span-8 h-full py-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)' }}>
                      <div className={`flex items-center justify-center py-2.5 text-[13px] font-semibold ${r.dark ? 'bg-ink text-white' : 'bg-signal/10 text-signal'}`} style={{ gridColumn: `${r.s + 1} / ${r.e + 1}` }}>{r.label}</div>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-[180px_1fr] items-center border-b border-line">
                  <div className="py-4 text-[14.5px] font-semibold">품질 AI (선택)</div>
                  <div className="my-3 bg-paper-2 py-2.5 text-center text-[13px] text-fg-2">데이터 준비 상태와 과제 범위에 따라 별도 일정</div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-14 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-[14.5px]">
                <thead><tr className="border-b-2 border-fg">{['단계', '추진 항목', '주요 산출물', '완료 기준'].map(h => <th key={h} className="py-3 font-semibold">{h}</th>)}</tr></thead>
                <tbody>
                  {deliverables.map(r => (
                    <tr key={r[0]} className="border-b border-line">
                      <td className="py-4 font-semibold">{r[0]}</td><td className="text-fg-2">{r[1]}</td><td className="text-fg-2">{r[2]}</td><td>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 양사 역할 */}
      <section className="section bg-paper-2">
        <div className="wrap">
          <SectionHead eyebrow="Roles" title="공장은 기준을 주고, Factra가 만듭니다." desc="도입기업의 현장 기준과 자료를 바탕으로 Factra가 기능과 데이터를 구성합니다. 착수 전에 업무별 담당자를 정하고, 담당자와 Factra PM이 협의 창구를 맡습니다." />
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {roles.map((r, i) => (
              <FadeIn key={r.n} delay={i * 0.07} className="border border-line bg-card">
                <div className="border-b border-line p-5"><p className="mono text-[12px] text-signal">{r.n}</p><p className="mt-2 text-[17px] font-bold">{r.t}</p></div>
                <div className="p-5">
                  <p className="mono text-[11px] text-fg-3">도입기업</p>
                  <ul className="mt-2 space-y-1 text-[14px] text-fg-2">{r.c.map(x => <li key={x}>{x}</li>)}</ul>
                </div>
                <div className="bg-ink p-5 text-white">
                  <p className="mono text-[11px] text-signal">FACTRA</p>
                  <ul className="mt-2 space-y-1 text-[14px] text-on-ink">{r.f.map(x => <li key={x}>{x}</li>)}</ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 검수 · 비용 */}
      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="Acceptance" title="검수는 실제 업무 시나리오로." desc="기능 하나씩이 아니라, 주문에서 이력까지 실제 흐름을 돌려 수량과 연결이 맞는지 봅니다." />
            <FadeIn delay={0.1}>
              <ol className="mt-10 space-y-2">
                {[['수주 · 작업지시', '주문과 작업 연결 · 계획 · 상태 조회'], ['실적 · 불량 입력', '생산 · 양품 · 불량 수량, 작업 · 공정별 집계'], ['재고 · 출고 반영', '입출고 수량 정합성, 현재고 · 수주 잔량'], ['이력 · 집계 확인', '제품 · 로트 이력, 품질정보 연결']].map(([k, v], i) => (
                  <li key={k} className={`grid grid-cols-[32px_160px_1fr] items-center gap-3 p-4 ${i === 3 ? 'bg-ink text-white' : 'border border-line bg-card'}`}>
                    <span className={`mono text-[12px] ${i === 3 ? 'text-signal' : 'text-fg-3'}`}>0{i + 1}</span>
                    <span className="text-[15.5px] font-semibold">{k}</span>
                    <span className={`text-[13.5px] ${i === 3 ? 'text-on-ink-2' : 'text-fg-2'}`}>{v}</span>
                  </li>
                ))}
              </ol>
            </FadeIn>
          </div>
          <div>
            <SectionHead eyebrow="Pricing" title="초기 구축비 + 라이선스·운영비" desc="대상 업무와 현장 규모, 데이터 연계 범위를 확인한 뒤 기업별로 견적을 드립니다." />
            <FadeIn delay={0.1}>
              <dl className="mt-10 border-t-2 border-fg">
                {[['MES 구축', '적용 업무·화면, 데이터 이관, 교육·현장 적용'], ['현장 연계 · 인프라', '연계 설비·시스템, 수집 장치, 서버·네트워크'], ['선택 기능', '품질 AI 등 추가 기능의 데이터·개발·검증 범위']].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[150px_1fr] gap-4 border-b border-line py-5">
                    <dt className="text-[16px] font-semibold">{k}</dt><dd className="text-[14.5px] text-fg-2">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[13px] text-fg-3">포함 범위, 부가세, 지급 조건은 견적·계약에서 확정합니다.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      <CTA title="엑셀과 종이 일지, 이제 MES로." desc="지금 쓰는 수주·재고·생산 양식 몇 장만 보내 주세요. 어떤 업무부터 옮기면 좋을지, 대략의 범위를 먼저 정리해 드립니다." />
    </>
  )
}
