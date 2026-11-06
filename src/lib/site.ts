// 회사 기본 정보 — 한 곳에서 관리한다.
// TODO(확인 필요): 법인명·대표·사업자등록번호·주소·전화는 확정되면 채운다. 비어 있으면 화면에 표시하지 않는다.
export const company = {
  brand: 'FACTRA',
  nameKo: '팩트라',
  legalName: '', // 예: 주식회사 팩트라
  ceo: '',
  bizNo: '',
  address: '',
  phone: '',
  email: 'contact@factra.kr', // TODO: 메일함 개설 확인
  domain: 'factra.kr',
  url: 'https://factra.kr',
  github: 'https://github.com/factrahq',
  // 어원: Factory + Transformation — 공장을 디지털·AI로 전환한다
  tagline: '제조 DX·AX를 위한 Factory Transformation',
  description:
    'Factra는 Factory와 Transformation을 합친 이름입니다. 설비 데이터 수집(DX)부터 비전 검사·AI 분석(AX)까지, 공장을 디지털과 AI로 전환합니다. 현장 실측부터 설치, 운영까지 직접 합니다.',
}

export const products = [
  {
    key: 'platform',
    name: 'Factra Platform',
    href: '/platform/',
    short: 'DX · 설비 데이터 수집·운영 플랫폼',
    desc: 'PLC·인버터·온도조절계·전력량계를 엣지 게이트웨이로 잇고, 노코드로 표준화해 설비·에너지·품질 운영 앱과 AI까지 한 환경에서 씁니다.',
    image: '/images/process-plant.jpg',
    status: '구축 진행 중',
  },
  {
    key: 'mes',
    name: 'Factra MES',
    href: '/mes/',
    short: 'DX · 수주·재고·생산·품질',
    desc: '같은 기준정보 위에서 수주·재고·생산·품질 업무를 잇습니다. 실적을 확정하면 재고와 품질이 함께 움직이고, 품질 AI를 선택으로 붙입니다.',
    image: '/images/mes-warehouse.jpg',
    status: '도입 가능',
  },
  {
    key: 'vision',
    name: 'Factra Vision',
    href: '/vision/',
    short: 'AX · 비전 검사·판독 플랫폼',
    desc: '라벨 판독, 외관 불량, 부착 위치 계산까지. 라인 옆 엣지 장비에서 사이클마다 판정하고 PLC·MES로 돌려줍니다.',
    image: '/images/optics.jpg',
    status: '현장 가동 중',
  },
  {
    key: 'rtls',
    name: 'Factra RTLS',
    href: '/rtls/',
    short: 'AX · UWB 실시간 위치추적',
    desc: '지게차와 작업자가 가까워지면 즉시 경보. 같은 앵커·태그로 사람·자재·운반 장비의 위치를 실내에서도 실시간으로 추적합니다.',
    image: '/images/warehouse.jpg',
    status: '개발 중',
  },
] as const

export const nav = [
  { label: 'Platform', href: '/platform/' },
  { label: 'MES', href: '/mes/' },
  { label: 'Vision', href: '/vision/' },
  { label: 'RTLS', href: '/rtls/' },
  { label: '도입 절차', href: '/process/' },
  { label: '도입 사례', href: '/cases/' },
  { label: '회사 소개', href: '/company/' },
]
