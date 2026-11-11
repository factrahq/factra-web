// Factra Twin (Unity 3D) 과 주고받는 데이터. 3D 화면은 /public/twin/ 의 Unity WebGL 빌드 (원본: factrahq/factra-twin).
// 배치는 Unity 빌드 안의 기본 현장 패키지(site.json)로 그린다 — 2D 배치도(demo-factory.ts)와 같은 파일
// 웹 → Unity: 현장 패키지(LoadSite), 설비 값(OnLive), RTLS 실측 좌표(OnTags), 선택(Select), 시점(SetView)
// Unity → 웹: window.factraTwin.onEvent(e) — site · ready · select · proximity · zone · tags
import { machines, isAlarm, fmt, type Live } from './demo-factory'

export const TWIN_BUILD = '/twin/Build/twin'
export const TWIN_SIZE_MB = 5.4 // 3D 빌드 내려받기 크기 (MB, 압축 기준) — Unity 빌드 후 갱신
// Unity 압축(Gzip) + 해제 대체(decompressionFallback): GitHub Pages 가 Content-Encoding 을 못 붙여 로더가 직접 푼다
export const TWIN_FILES = { data: '.data.unityweb', framework: '.framework.js.unityweb', code: '.wasm.unityweb' }

export type TagKind = 'forklift' | 'cart' | 'worker' | 'asset'
export type TwinTag = { id: string; kind: TagKind; x: number; y: number; level: 0 | 1 | 2; restricted: boolean; external: boolean }

export type TwinEvent =
  | { type: 'site'; ok: boolean; id: string; title: string; source: string; machines: number; tags: number; errors: string[]; warnings: string[] }
  | { type: 'ready' }
  | { type: 'select'; kind: 'machine' | 'tag' | 'none'; id: string }
  | { type: 'proximity'; a: string; b: string; d: number }
  | { type: 'zone'; id: string; zone: string }
  | { type: 'tags'; tags: TwinTag[] }

export const kindLabel: Record<TagKind, string> = { forklift: '지게차', cart: '대차', worker: '작업자', asset: '자산' }

// 태그 → 사람이 읽는 이름 (가상 데이터)
export const tagInfo: Record<string, { name: string; sub: string }> = {
  'FL-01': { name: '지게차 1호', sub: '입고·출하 운반 · 견고형 태그' },
  'CT-01': { name: '대차 CT-01', sub: '사출품 → 가공 구역 · 견고형 태그' },
  'CT-02': { name: '대차 CT-02', sub: '프레스품 → 출하 대기 · 견고형 태그' },
  'W-01': { name: '작업자 A', sub: '가공 반 · 안전모 태그' },
  'W-02': { name: '작업자 B', sub: '사출 반 · 조끼형 태그' },
  'W-03': { name: '작업자 C', sub: '프레스 반 · 조끼형 태그' },
  'W-04': { name: '작업자 D', sub: '설비 보전 · 안전모 태그' },
}

// 대차에 실린 작업지시 (Factra MES 연동 예시, 가상 데이터)
export const cartOrders: Record<string, { wo: string; item: string; qty: string; from: string; to: string; step: string }> = {
  'CT-01': { wo: 'WO-1110-014', item: '하우징 커버 (PP)', qty: '480 EA', from: 'IM-02 사출기 #2', to: 'CNC-02 2차 가공', step: '사출 완료 → 가공 대기' },
  'CT-02': { wo: 'WO-1110-009', item: '브래킷 B-220', qty: '1,200 EA', from: 'PR-01 프레스 #1', to: '출하장', step: '프레스 완료 → 출하 검사' },
}

export const zoneLabel: Record<string, string> = { 'power-room': '수전실 (출입 제한 구역)' }

const asciiUnit = (u: string) => u.replace('℃', '°C')

/** 설비 값 → Unity 로 보낼 형태. 라벨은 Unity 기본 글꼴이 그릴 수 있게 영문·숫자만 쓴다. */
export function twinLivePayload(live: Live, alarmIds: Set<string>) {
  return JSON.stringify({
    machines: machines.map(m => {
      const p = m.points[0]
      const v = live[m.id][p.key].at(-1)!
      const alarmPoint = m.points.find(pt => isAlarm(pt, live[m.id][pt.key].at(-1)!))
      const show = alarmPoint ?? p
      const sv = live[m.id][show.key].at(-1)!
      return {
        id: m.id,
        state: m.state,
        alarm: alarmIds.has(m.id),
        label: `${fmt(alarmPoint ? sv : v, show.digits)} ${asciiUnit(show.unit)}`.trim(),
      }
    }),
  })
}

/** 트윈 이벤트 → 데모 이벤트 기록 문구 */
export function twinEventText(e: TwinEvent): { tag: string; msg: string; sev: 'critical' | 'warning' } | null {
  if (e.type === 'proximity') {
    const a = tagInfo[e.a]?.name ?? e.a, b = tagInfo[e.b]?.name ?? e.b
    return { tag: e.a, msg: `${a} ↔ ${b} 3 m 안으로 접근 — 접근 경보`, sev: 'critical' }
  }
  if (e.type === 'zone') {
    return { tag: e.id, msg: `${tagInfo[e.id]?.name ?? e.id} ${zoneLabel[e.zone] ?? e.zone} 진입 — 출입 허가 확인 필요`, sev: 'warning' }
  }
  return null
}
