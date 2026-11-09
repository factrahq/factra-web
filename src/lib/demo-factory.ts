// Factra Platform 데모용 가상 공장. 모든 값은 가짜이며 브라우저에서만 움직인다.

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
  runMin: number // 오늘 가동 시간(분)
  x: number; y: number; w: number; h: number // 배치도 위치 (viewBox 1000×560)
  points: Point[]
}

export const zones = [
  { name: '가공 구역', x: 30, y: 40, w: 420, h: 220 },
  { name: '프레스 구역', x: 480, y: 40, w: 300, h: 220 },
  { name: '사출 구역', x: 30, y: 300, w: 420, h: 220 },
  { name: '유틸리티', x: 480, y: 300, w: 300, h: 220 },
  { name: '수전실', x: 810, y: 40, w: 160, h: 480 },
]

const power = (base: number): Point => ({ key: 'kw', name: '유효 전력', unit: 'kW', base, noise: base * 0.06, digits: 1, min: 0 })

// 멈춘 시각 (오늘 주간 08:00 기준 분) — 이벤트·타임라인이 이 값과 맞는다
export const SHIFT_START = 8 * 60
export const SHIFT_MIN = 480

export const machines: Machine[] = [
  { id: 'cnc1', tag: 'CNC-01', name: 'CNC 선반 #1', zone: '가공 구역', state: 'run', runMin: 412, x: 60, y: 90, w: 110, h: 70,
    points: [{ key: 'load', name: '스핀들 부하', unit: '%', base: 62, noise: 6, digits: 0, limit: { hi: 90 } }, { key: 'rpm', name: '스핀들 회전수', unit: 'rpm', base: 2400, noise: 60, digits: 0 }, power(7.2)] },
  { id: 'cnc2', tag: 'CNC-02', name: 'CNC 선반 #2', zone: '가공 구역', state: 'run', runMin: 398, x: 190, y: 90, w: 110, h: 70,
    points: [{ key: 'load', name: '스핀들 부하', unit: '%', base: 55, noise: 6, digits: 0, limit: { hi: 90 } }, { key: 'rpm', name: '스핀들 회전수', unit: 'rpm', base: 2100, noise: 60, digits: 0 }, power(6.4)] },
  { id: 'mc1', tag: 'MC-01', name: '머시닝센터 #1', zone: '가공 구역', state: 'idle', runMin: 236, x: 320, y: 90, w: 110, h: 70,
    points: [{ key: 'load', name: '스핀들 부하', unit: '%', base: 0, noise: 0, digits: 0, histBase: 48 }, { key: 'rpm', name: '스핀들 회전수', unit: 'rpm', base: 0, noise: 0, digits: 0, histBase: 1800 }, { ...power(0.8), histBase: 6.1 }] },
  { id: 'pr1', tag: 'PR-01', name: '프레스 #1 (200톤)', zone: '프레스 구역', state: 'run', runMin: 430, x: 510, y: 90, w: 120, h: 120,
    points: [{ key: 'count', name: '오늘 타수', unit: '회', base: 3420, noise: 0, digits: 0, counter: true }, { key: 'spm', name: '분당 타수', unit: 'SPM', base: 18, noise: 1, digits: 0 }, { key: 'oil', name: '작동유 온도', unit: '℃', base: 46, noise: 0.6, digits: 1, limit: { hi: 60 } }, power(11.5)] },
  { id: 'pr2', tag: 'PR-02', name: '프레스 #2 (110톤)', zone: '프레스 구역', state: 'stop', runMin: 185, x: 650, y: 90, w: 110, h: 120,
    points: [{ key: 'count', name: '오늘 타수', unit: '회', base: 1210, noise: 0, digits: 0 }, { key: 'spm', name: '분당 타수', unit: 'SPM', base: 0, noise: 0, digits: 0, histBase: 22 }, { key: 'oil', name: '작동유 온도', unit: '℃', base: 31, noise: 0.2, digits: 1, histBase: 44 }, { ...power(0.3), histBase: 7.8 }] },
  { id: 'im1', tag: 'IM-01', name: '사출기 #1 (350톤)', zone: '사출 구역', state: 'run', runMin: 455, x: 60, y: 350, w: 170, h: 70,
    points: [{ key: 'mold', name: '금형 온도', unit: '℃', base: 58.2, noise: 0.5, digits: 1, limit: { lo: 52, hi: 65 } }, { key: 'cycle', name: '사이클 타임', unit: '초', base: 32.4, noise: 0.4, digits: 1 }, { key: 'barrel', name: '실린더 온도', unit: '℃', base: 228, noise: 1.2, digits: 0 }, power(18.3)] },
  { id: 'im2', tag: 'IM-02', name: '사출기 #2 (220톤)', zone: '사출 구역', state: 'run', runMin: 441, x: 250, y: 350, w: 170, h: 70,
    points: [{ key: 'mold', name: '금형 온도', unit: '℃', base: 61.5, noise: 0.5, digits: 1, limit: { lo: 52, hi: 65 } }, { key: 'cycle', name: '사이클 타임', unit: '초', base: 27.8, noise: 0.4, digits: 1 }, { key: 'barrel', name: '실린더 온도', unit: '℃', base: 221, noise: 1.2, digits: 0 }, power(13.9)] },
  { id: 'ac1', tag: 'AC-01', name: '공기압축기 #1', zone: '유틸리티', state: 'run', runMin: 480, x: 510, y: 350, w: 110, h: 80,
    points: [{ key: 'press', name: '토출 압력', unit: 'bar', base: 6.2, noise: 0.05, digits: 2, drift: -0.012, min: 4.9, limit: { lo: 5.5 } }, { key: 'temp', name: '토출 온도', unit: '℃', base: 82, noise: 0.8, digits: 1, limit: { hi: 100 } }, power(22.4)] },
  { id: 'ch1', tag: 'CH-01', name: '칠러 #1', zone: '유틸리티', state: 'run', runMin: 480, x: 650, y: 350, w: 110, h: 80,
    points: [{ key: 'water', name: '냉각수 온도', unit: '℃', base: 18.5, noise: 0.2, digits: 1, limit: { hi: 24 } }, power(9.6)] },
  { id: 'pm1', tag: 'PM-MAIN', name: '메인 전력량계', zone: '수전실', state: 'run', runMin: 480, x: 840, y: 90, w: 100, h: 90,
    points: [{ key: 'kw', name: '공장 전체 전력', unit: 'kW', base: 98, noise: 3, digits: 1 }, { key: 'kwh', name: '오늘 사용량', unit: 'kWh', base: 1284, noise: 0, digits: 0, counter: true }, { key: 'pf', name: '역률', unit: '', base: 0.94, noise: 0.005, digits: 2 }] },
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
        if (p.drift) return p.base + p.drift * i
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
