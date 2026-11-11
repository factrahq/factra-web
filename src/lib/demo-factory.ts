// Factra Platform 데모용 가상 공장. 모든 값은 가짜이며 브라우저에서만 움직인다.
import site from './demo-site.json'

export type State = 'run' | 'idle' | 'stop' | 'offline'

export const stateLabel: Record<State, string> = { run: '가동', idle: '대기', stop: '정지', offline: '연결 끊김' }
export const stateColor: Record<State, string> = { run: '#2BB673', idle: '#E0A82E', stop: '#8B8D92', offline: '#55575C' }

export type Point = {
  key: string
  name: string
  unit: string
  base: number // 평소 값
  noise: number // 흔들림 폭
  digits: number
  drift?: number // 한 번에 더해지는 추세 (공기압축기 압력 하락 등)
  min?: number
  counter?: boolean // 타수처럼 계속 늘어나는 값
  limit?: { lo?: number; hi?: number } // 벗어나면 알람
  histBase?: number // 지금은 멈춰 있지만 평소(가동 중) 값 — 이력 그래프용
}

export type Machine = {
  id: string
  tag: string
  name: string
  zone: string
  state: State
  runMin: number // 오늘 가동 시간(분), 가상 공장 시각 14:00 기준
  since?: number // 지금 상태(대기·정지)가 시작된 시각, 근무 시작부터 분
  planned?: boolean // 계획 정지 (금형 교체 등) — 가동률 계산에서 뺀다
  x: number; y: number; w: number; h: number // 배치도 위치 (viewBox 1000×560) — demo-site.json 에서
  points: Point[]
}

// 배치(구역·설비 위치·이름)는 3D 트윈과 같은 현장 패키지에서 읽는다. 원본: factra-twin/site-format/samples/demo-factory-a/site.json
// (scripts/sync-twin.sh 가 src/lib/demo-site.json 으로 복사). 배치도 1단위 = 0.07 m, viewBox 1000×560
const S = 0.07
const u = (m: number) => Math.round((m / S) * 100) / 100

type SitePoint = [number, number]
const zoneName: Record<string, string> = Object.fromEntries(site.zones.map(z => [z.id, z.name]))

export const zones = site.zones.map(z => {
  const xs = z.polygon.map(p => (p as SitePoint)[0]), ys = z.polygon.map(p => (p as SitePoint)[1])
  const x0 = Math.min(...xs), y0 = Math.min(...ys)
  return { id: z.id, name: z.name, restricted: z.kind === 'restricted', x: u(x0), y: u(y0), w: u(Math.max(...xs) - x0), h: u(Math.max(...ys) - y0) }
})

/** site.json 설비 → 배치도 사각형 (중심·m → 왼쪽 위·배치도 단위). 90°·270° 회전이면 가로·세로를 바꾼다 */
function layoutOf(id: string) {
  const m = site.machines.find(x => x.id === id)
  if (!m) throw new Error(`demo-site.json 에 설비 ${id} 없음`)
  const turned = Math.round(((m.rot ?? 0) % 180 + 180) % 180) === 90
  const w = turned ? m.d : m.w, d = turned ? m.w : m.d
  return { tag: m.tag, name: m.name, zone: zoneName[m.zone] ?? m.zone, x: u(m.x - w / 2), y: u(m.y - d / 2), w: u(w), h: u(d) }
}

const power = (base: number): Point => ({ key: 'kw', name: '유효 전력', unit: 'kW', base, noise: base * 0.06, digits: 1, min: 0 })

// 멈춘 시각 (오늘 주간 08:00 기준 분) — 이벤트·타임라인이 이 값과 맞는다
// 데모는 실제 시각과 상관없이 '가상 공장 시각' 오늘 14:00에서 시작해 흘러간다
export const SHIFT_START = 8 * 60 // 주간 근무 08:00–17:00
export const SHIFT_MIN = 540
export const DEMO_START_MIN = 14 * 60 // 가상 시각 14:00
export const ELAPSED = DEMO_START_MIN - SHIFT_START // 근무 시작부터 지금까지 360분

export const machines: Machine[] = [
  { id: 'cnc1', ...layoutOf('cnc1'), state: 'run', runMin: 318,
    points: [{ key: 'load', name: '스핀들 부하', unit: '%', base: 62, noise: 6, digits: 0, limit: { hi: 90 } }, { key: 'rpm', name: '스핀들 회전수', unit: 'rpm', base: 2400, noise: 60, digits: 0 }, power(7.2)] },
  { id: 'cnc2', ...layoutOf('cnc2'), state: 'run', runMin: 305,
    points: [{ key: 'load', name: '스핀들 부하', unit: '%', base: 55, noise: 6, digits: 0, limit: { hi: 90 } }, { key: 'rpm', name: '스핀들 회전수', unit: 'rpm', base: 2100, noise: 60, digits: 0 }, power(6.4)] },
  { id: 'mc1', ...layoutOf('mc1'), state: 'idle', runMin: 226, since: 250,
    points: [{ key: 'load', name: '스핀들 부하', unit: '%', base: 0, noise: 0, digits: 0, histBase: 48 }, { key: 'rpm', name: '스핀들 회전수', unit: 'rpm', base: 0, noise: 0, digits: 0, histBase: 1800 }, { ...power(0.8), histBase: 6.1 }] },
  { id: 'pr1', ...layoutOf('pr1'), state: 'run', runMin: 331,
    points: [{ key: 'count', name: '오늘 타수', unit: '회', base: 5940, noise: 0, digits: 0, counter: true }, { key: 'spm', name: '분당 타수', unit: 'SPM', base: 18, noise: 1, digits: 0 }, { key: 'oil', name: '작동유 온도', unit: '℃', base: 46, noise: 0.6, digits: 1, limit: { hi: 60 } }, power(11.5)] },
  { id: 'pr2', ...layoutOf('pr2'), state: 'stop', runMin: 180, since: 195, planned: true,
    points: [{ key: 'count', name: '오늘 타수', unit: '회', base: 3850, noise: 0, digits: 0, counter: true }, { key: 'spm', name: '분당 타수', unit: 'SPM', base: 0, noise: 0, digits: 0, histBase: 22 }, { key: 'oil', name: '작동유 온도', unit: '℃', base: 31, noise: 0.2, digits: 1, histBase: 44 }, { ...power(0.3), histBase: 7.8 }] },
  { id: 'im1', ...layoutOf('im1'), state: 'run', runMin: 344,
    points: [{ key: 'mold', name: '금형 온도', unit: '℃', base: 58.2, noise: 0.5, digits: 1, limit: { lo: 52, hi: 65 } }, { key: 'cycle', name: '사이클 타임', unit: '초', base: 32.4, noise: 0.4, digits: 1 }, { key: 'barrel', name: '실린더 온도', unit: '℃', base: 228, noise: 1.2, digits: 0 }, power(18.3)] },
  { id: 'im2', ...layoutOf('im2'), state: 'run', runMin: 336,
    points: [{ key: 'mold', name: '금형 온도', unit: '℃', base: 61.5, noise: 0.5, digits: 1, limit: { lo: 52, hi: 65 } }, { key: 'cycle', name: '사이클 타임', unit: '초', base: 27.8, noise: 0.4, digits: 1 }, { key: 'barrel', name: '실린더 온도', unit: '℃', base: 221, noise: 1.2, digits: 0 }, power(13.9)] },
  { id: 'ac1', ...layoutOf('ac1'), state: 'run', runMin: 360,
    points: [{ key: 'press', name: '토출 압력', unit: 'bar', base: 5.6, noise: 0.03, digits: 2, drift: -0.003, min: 5.3, limit: { lo: 5.5 } }, { key: 'temp', name: '토출 온도', unit: '℃', base: 82, noise: 0.8, digits: 1, limit: { hi: 100 } }, power(22.4)] },
  { id: 'ch1', ...layoutOf('ch1'), state: 'run', runMin: 360,
    points: [{ key: 'water', name: '냉각수 온도', unit: '℃', base: 18.5, noise: 0.2, digits: 1, limit: { hi: 24 } }, power(9.6)] },
  { id: 'pm1', ...layoutOf('pm1'), state: 'run', runMin: 360,
    points: [{ key: 'kw', name: '공장 전체 전력', unit: 'kW', base: 98, noise: 3, digits: 1 }, { key: 'kwh', name: '오늘 사용량', unit: 'kWh', base: 760, noise: 0, digits: 0, counter: true }, { key: 'pf', name: '역률', unit: '', base: 0.94, noise: 0.005, digits: 2 }] },
]

export type Live = Record<string, Record<string, number[]>> // machine → point → 최근 값들 (마지막이 현재)

const HISTORY = 40

// 시작 값은 고정(서버·브라우저 렌더 결과가 같도록), 흔들림은 브라우저에서만
export function initialLive(): Live {
  const live: Live = {}
  for (const m of machines) {
    live[m.id] = {}
    for (const p of m.points) {
      live[m.id][p.key] = Array.from({ length: HISTORY }, (_, i) => {
        if (p.counter) return p.base - (HISTORY - 1 - i) * (p.key === 'kwh' ? 0.5 : 3)
        if (p.drift) return p.base + p.drift * (i - (HISTORY - 1)) // 마지막 값이 base
        return p.base + p.noise * Math.sin(i * 1.7 + p.base) * 0.8
      })
    }
  }
  return live
}

export function step(live: Live): Live {
  const next: Live = {}
  for (const m of machines) {
    next[m.id] = {}
    for (const p of m.points) {
      const arr = live[m.id][p.key]
      const last = arr[arr.length - 1]
      let v: number
      if (p.counter) v = m.state === 'run' ? last + (p.key === 'kwh' ? 0.4 + Math.random() * 0.2 : Math.random() < 0.6 ? 1 : 0) : last
      else if (p.drift) {
        v = last + p.drift + (Math.random() - 0.5) * p.noise
        if (p.min !== undefined && v < p.min) v = p.base // 압력이 바닥까지 내려가면 다시 처음부터 (데모 반복)
      } else v = p.base + (Math.random() - 0.5) * 2 * p.noise
      if (p.min !== undefined && !p.drift) v = Math.max(p.min, v)
      next[m.id][p.key] = [...arr.slice(1), v]
    }
  }
  return next
}

export function isAlarm(p: Point, v: number) {
  return !!p.limit && ((p.limit.lo !== undefined && v < p.limit.lo) || (p.limit.hi !== undefined && v > p.limit.hi))
}

export function fmt(v: number, digits: number) {
  return v.toLocaleString('ko-KR', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

// 가동률 = 가동 시간 / (지금까지 근무 시간 − 계획 정지 시간)
export const availMin = (m: Machine) => (m.planned && m.since !== undefined ? m.since : ELAPSED)
export const utilPct = (m: Machine) => Math.round((m.runMin / availMin(m)) * 100)
export const stateText = (m: Machine) => (m.planned && m.state === 'stop' ? '계획 정지' : stateLabel[m.state])
