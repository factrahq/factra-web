// Factra Platform 데모: 이력·점검·이벤트·AI 답변용 가상 데이터.
// 같은 날에는 같은 값이 나오도록 씨앗(seed) 있는 난수를 쓴다. 브라우저에서만 호출한다.
import { machines, SHIFT_START, ELAPSED, type Machine, type Point, type State } from './demo-factory'

// AI가 공기압축기 압력 하락을 처음 알아챈 시각 (근무 시작부터 분 = 11:35)
export const AI_DETECT_MIN = 215

function rng(seedText: string) {
  let h = 1779033703 ^ seedText.length
  for (let i = 0; i < seedText.length; i++) h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353), (h = (h << 13) | (h >>> 19))
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

// ── 이력 (데이터 분석) ──────────────────────────────────────────
export type Range = '24h' | '7d' | '30d'
export const rangeLabel: Record<Range, string> = { '24h': '최근 24시간', '7d': '최근 7일', '30d': '최근 30일' }
export type Sample = { t: number; v: number }

const ACTIVE_KEYS = new Set(['kw', 'load', 'rpm', 'spm'])

// 근무 시간(08~17시, 평일)에는 설비가 돌고 밤·주말에는 거의 쉰다
function activity(d: Date) {
  const h = d.getHours() + d.getMinutes() / 60
  const weekend = d.getDay() === 0 || d.getDay() === 6
  if (weekend) return 0.08
  if (h >= 8 && h < 17) return h >= 12 && h < 13 ? 0.45 : 1 // 점심
  return 0.12
}

export function history(m: Machine, p: Point, range: Range, now: Date): Sample[] {
  const stepMin = range === '24h' ? 15 : range === '7d' ? 60 : 360
  const count = range === '24h' ? 96 : range === '7d' ? 168 : 120
  const r = rng(`${m.id}:${p.key}:${range}:${dayKey(now)}`)
  const base = p.histBase ?? p.base
  const out: Sample[] = []
  const end = now.getTime() // 마지막 점은 언제나 '지금' (기간이 달라도 현재 값이 같다)
  const shift0 = new Date(now); shift0.setHours(0, SHIFT_START, 0, 0)
  for (let i = count - 1; i >= 0; i--) {
    const t = end - i * stepMin * 60000
    const d = new Date(t)
    let a = activity(d)
    // 오늘 상태가 바뀐 설비는 그 시각부터 멈춤
    const sinceShift = (t - shift0.getTime()) / 60000
    if (m.since !== undefined && sinceShift >= m.since && t <= now.getTime()) a = 0
    const noise = (r() - 0.5) * 2 * (p.noise || base * 0.03)
    let v: number
    if (p.key === 'cycle') v = a >= 0.3 ? base + noise : NaN // 서 있는 사출기는 사이클 타임이 없다
    else if (ACTIVE_KEYS.has(p.key)) v = Math.max(0, base * a + noise * a + (p.key === 'kw' ? base * 0.06 : 0))
    else if (p.unit === '℃' && p.key !== 'water') v = base - (1 - a) * base * 0.25 + noise * 0.5
    else v = base + noise
    // 공기압축기 토출 압력: 평소 6.2 bar, 최근 3시간 동안 지금 값(5.6)까지 서서히 떨어진다
    if (m.id === 'ac1' && p.key === 'press') {
      const hoursAgo = (end - t) / 3600000
      v = hoursAgo < 3 ? 5.6 + hoursAgo * 0.2 + (r() - 0.5) * 0.04 : 6.2 + (r() - 0.5) * 0.08
    }
    out.push({ t, v })
  }
  return out
}

// 분석에서 고를 수 있는 값 (누적 값은 뺀다)
export const analysisPoints = machines.flatMap(m => m.points.filter(p => !p.counter).map(p => ({ m, p, id: `${m.id}.${p.key}` })))

// ── 오늘 가동 타임라인 (설비 관리) ─────────────────────────────
export type Segment = { from: number; to: number; state: State } // 주간 시작부터 분

export function timeline(m: Machine, now: Date): Segment[] {
  const r = rng(`tl:${m.id}:${dayKey(now)}`)
  // 근무 시작부터 지금(ELAPSED)까지만 그린다. 가동하지 않은 시간은 짧은 대기 몇 번으로 나눈다
  const runEnd = m.since ?? ELAPSED // 지금 상태가 시작된 시각
  const idleTotal = Math.max(0, runEnd - m.runMin)
  const n = idleTotal <= 0 ? 0 : m.since !== undefined ? 1 : 2 + Math.floor(r() * 2)
  const each = n ? Math.round(idleTotal / n) : 0
  const lens = Array.from({ length: n }, (_, i) => (i < n - 1 ? each : idleTotal - each * (n - 1)))
  const segs: Segment[] = []
  let t = 0
  lens.forEach((len, i) => {
    const at = Math.max(t + 20, Math.round((runEnd / (n + 1)) * (i + 1) + (r() - 0.5) * 30))
    segs.push({ from: t, to: at, state: 'run' }, { from: at, to: at + len, state: 'idle' })
    t = at + len
  })
  segs.push({ from: t, to: runEnd, state: 'run' })
  if (m.since !== undefined) segs.push({ from: m.since, to: ELAPSED, state: m.state })
  return segs.filter(x => x.to > x.from)
}

export const clock = (minFromShift: number) => {
  const m = SHIFT_START + Math.round(minFromShift)
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

// ── 점검 · 조치 ───────────────────────────────────────────────
export type Inspection = { tag: string; item: string; cycle: string; due: number; done: boolean } // due: 오늘부터 며칠
export const inspections: Inspection[] = [
  { tag: 'AC-01', item: '흡입 필터 청소', cycle: '매주', due: -1, done: true },
  { tag: 'PR-01', item: '작동유 레벨·누유 확인', cycle: '매주', due: 0, done: true },
  { tag: 'IM-01', item: '금형 냉각수 유량 확인', cycle: '매주', due: 0, done: false },
  { tag: 'CNC-02', item: '절삭유 농도 측정', cycle: '격주', due: 1, done: false },
  { tag: 'CH-01', item: '응축기 코일 청소', cycle: '매월', due: 2, done: false },
  { tag: 'PR-02', item: '클러치·브레이크 점검', cycle: '매월', due: 3, done: false },
  { tag: 'PM-MAIN', item: '수전반 열화상 점검', cycle: '분기', due: 5, done: false },
]

export type Action = { tag: string; title: string; owner: string; opened: string; status: '진행 중' | '대기' | '완료' }
export const actions: Action[] = [
  { tag: 'AC-01', title: '에어 배관 누설 위치 확인 (프레스 구역)', owner: '설비보전팀', opened: '오늘', status: '진행 중' },
  { tag: 'PR-02', title: '금형 교체 후 시타 확인', owner: '생산 1팀', opened: '오늘', status: '대기' },
  { tag: 'IM-02', title: '취출 로봇 그리퍼 패드 교체', owner: '설비보전팀', opened: '3일 전', status: '완료' },
]

// ── 이벤트 기록 ────────────────────────────────────────────────
export type Severity = 'critical' | 'warning' | 'info'
export const severityLabel: Record<Severity, string> = { critical: '알람', warning: '경고', info: '정보' }
export const severityColor: Record<Severity, string> = { critical: '#d03b3b', warning: '#fab219', info: '#6B6E75' }
export type LogEvent = { t: number; tag: string; msg: string; sev: Severity; resolved: boolean; planned?: boolean }

export function pastEvents(now: Date): LogEvent[] {
  const day = 86400000
  const at = (daysAgo: number, hh: number, mm: number) => { const d = new Date(now.getTime() - daysAgo * day); d.setHours(hh, mm, 0, 0); return d.getTime() }
  const today = (min: number) => at(0, 0, SHIFT_START + min)
  const pr2 = machines.find(m => m.id === 'pr2')!, mc1 = machines.find(m => m.id === 'mc1')!
  return [
    { t: today(mc1.since!), tag: 'MC-01', msg: '대기 전환 (다음 작업 대기)', sev: 'info', resolved: true },
    { t: today(pr2.since!), tag: 'PR-02', msg: '계획 정지 (금형 교체)', sev: 'info', resolved: true, planned: true },
    { t: today(AI_DETECT_MIN), tag: 'AC-01', msg: '토출 압력 하락 추세 감지 (AI)', sev: 'warning', resolved: false },
    { t: at(1, 15, 42), tag: 'IM-02', msg: '사이클 타임 34.1초 — 평소보다 22% 김', sev: 'warning', resolved: true },
    { t: at(1, 10, 8), tag: 'CH-01', msg: '냉각수 온도 24.6℃ — 기준 24℃ 넘음', sev: 'critical', resolved: true },
    { t: at(2, 14, 20), tag: 'PM-MAIN', msg: '공장 전력 142kW — 피크 알림 기준 넘음', sev: 'warning', resolved: true },
    { t: at(2, 9, 3), tag: 'CNC-01', msg: '스핀들 부하 93% — 기준 90% 넘음', sev: 'critical', resolved: true },
    { t: at(3, 16, 55), tag: 'IM-02', msg: '취출 로봇 그리퍼 이상 — 조치 등록', sev: 'warning', resolved: true },
    { t: at(4, 11, 30), tag: 'PR-01', msg: '작동유 온도 58.4℃ — 상승 추세', sev: 'warning', resolved: true },
    { t: at(5, 8, 12), tag: 'CH-01', msg: '게이트웨이 통신 끊김 3분 — 자동 복구', sev: 'info', resolved: true },
    { t: at(6, 13, 47), tag: 'IM-01', msg: '금형 온도 51.6℃ — 기준 52℃ 아래', sev: 'critical', resolved: true },
  ].sort((a, b) => b.t - a.t) as LogEvent[]
}

// ── AI 어시스턴트 (미리 정해 둔 질문과 답) ─────────────────────
export function weeklyKwh(now: Date) {
  return machines.filter(m => m.id !== 'pm1').map(m => {
    const p = m.points.find(x => x.key === 'kw')!
    const kwh = history(m, p, '7d', now).reduce((s, x) => s + x.v, 0) // 1시간 간격이라 합이 곧 kWh
    return { m, kwh }
  }).sort((a, b) => b.kwh - a.kwh)
}
