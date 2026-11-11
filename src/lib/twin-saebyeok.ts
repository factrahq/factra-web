// /twin 페이지 3D 데모: 새벽정밀(가상) 화성 1공장 — 연습용 가상 고객 공장 (실제 회사와 무관)
// 배치는 factra-twin/site-format/samples/virtual-saebyeok/site.json (sync-twin.sh 가 복사). 값은 모두 가상이며 브라우저에서만 움직인다.
import site from './saebyeok-site.json'
import type { TwinEvent } from './twin'

export const SAEBYEOK_SITE_URL = '/twin/sites/virtual-saebyeok.json'
export const saebyeok = {
  title: site.site.title,
  machineCount: site.machines.length,
  tagCount: site.tags.length,
  anchorCount: site.anchors.length,
}

type Gen = { unit: string; base: number; noise: number; digits: number; hi?: number; drift?: number }
// 종류별 대표 값 하나 (3D 라벨은 Unity 기본 글꼴이라 영문·숫자만)
const GEN: Record<string, Gen> = {
  lathe: { unit: '%', base: 56, noise: 8, digits: 0, hi: 90 },
  machining: { unit: '%', base: 61, noise: 7, digits: 0, hi: 90 },
  press: { unit: 'SPM', base: 18, noise: 1.5, digits: 0 },
  compressor: { unit: 'bar', base: 6.8, noise: 0.06, digits: 1 },
  chiller: { unit: '°C', base: 17.5, noise: 0.3, digits: 1, hi: 22 },
  panel: { unit: 'kW', base: 212, noise: 9, digits: 0 },
  conveyor: { unit: 'm/min', base: 12, noise: 0.3, digits: 1 },
  oven: { unit: '°C', base: 182, noise: 1.2, digits: 0, hi: 195, drift: 0.35 },
  robot: { unit: 's', base: 42, noise: 1.5, digits: 0 },
}
const STATE: Record<string, 'run' | 'idle' | 'stop'> = { 'cnc-05': 'idle', 'pr-02': 'stop', 'qc-01': 'idle' }

type Mach = { id: string; tag: string; name: string; kind: string }
const machines = site.machines as unknown as Mach[]
export type SaebyeokLive = Record<string, number>

export function saebyeokInitial(): SaebyeokLive {
  const v: SaebyeokLive = {}
  for (const m of machines) { const g = GEN[m.kind]; if (g) v[m.id] = g.base }
  return v
}

export function saebyeokStep(prev: SaebyeokLive): SaebyeokLive {
  const v: SaebyeokLive = {}
  for (const m of machines) {
    const g = GEN[m.kind]; if (!g) continue
    if (STATE[m.id] && STATE[m.id] !== 'run') { v[m.id] = 0; continue }
    if (g.drift) { // 건조로: 천천히 오르다가 상한을 넘으면 잠시 뒤 다시 처음부터 (데모 반복)
      const x = prev[m.id] + g.drift + (Math.random() - 0.5) * g.noise
      v[m.id] = x > g.base + 18 ? g.base : x
    } else v[m.id] = g.base + (Math.random() - 0.5) * 2 * g.noise
  }
  return v
}

const fmt = (x: number, d: number) => x.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

export function saebyeokAlarms(v: SaebyeokLive) {
  const s = new Set<string>()
  for (const m of machines) { const g = GEN[m.kind]; if (g?.hi !== undefined && v[m.id] > g.hi) s.add(m.id) }
  return s
}

/** 설비 값 → Unity OnLive */
export function saebyeokPayload(v: SaebyeokLive, alarms: Set<string>) {
  return JSON.stringify({
    machines: machines.map(m => {
      const g = GEN[m.kind]
      const st = STATE[m.id] ?? 'run'
      return { id: m.id, state: st, alarm: alarms.has(m.id), label: g && st === 'run' ? `${fmt(v[m.id], g.digits)} ${g.unit}` : '' }
    }),
  })
}

const tagName: Record<string, string> = Object.fromEntries((site.tags as { id: string; name: string }[]).map(t => [t.id, t.name]))
const zoneName: Record<string, string> = { 'weld-1': '용접 셀 1 (출입 제한 구역)', 'weld-2': '용접 셀 2 (출입 제한 구역)', 'power-room': '수배전실 (출입 제한 구역)' }
const machineName = (id: string) => machines.find(m => m.id === id)

/** 트윈 이벤트 → 기록 문구 */
export function saebyeokEventText(e: TwinEvent): { msg: string; sev: 'critical' | 'warning' } | null {
  if (e.type === 'proximity') return { msg: `${tagName[e.a] ?? e.a} ↔ ${tagName[e.b] ?? e.b} 3 m 안으로 접근 — 접근 경보`, sev: 'critical' }
  if (e.type === 'zone') return { msg: `${tagName[e.id] ?? e.id} ${zoneName[e.zone] ?? e.zone} 진입 — 출입 허가 확인 필요`, sev: 'warning' }
  return null
}

export function saebyeokAlarmText(id: string, v: SaebyeokLive) {
  const m = machineName(id); const g = m && GEN[m.kind]
  if (!m || !g) return null
  return { msg: `${m.tag} ${m.name} ${fmt(v[id], g.digits + 1)} ${g.unit} — 상한 ${g.hi} ${g.unit} 초과`, sev: 'warning' as const }
}
