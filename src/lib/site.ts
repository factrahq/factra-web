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
    key: 'vision',
    name: 'Factra Vision',
    href: '/vision/',
    short: '비전 검사·판독 플랫폼',
    desc: '라벨 판독, 인쇄·외관 불량, 부착 위치 계산까지. 라인 옆 엣지 장비에서 1사이클마다 판정하고 PLC·MES로 돌려줍니다.',
    image: '/images/optics.jpg',
    status: '현장 가동 중',
  },
  {
    key: 'rtls',
    name: 'Factra RTLS',
    href: '/rtls/',
    short: 'UWB 실시간 위치추적',
    desc: '지게차와 작업자가 가까워지면 즉시 경보. 같은 앵커·태그로 사람·자재·운반 장비의 위치를 실내에서도 실시간으로 추적합니다.',
    image: '/images/warehouse.jpg',
    status: '개발 중',
  },
  {
    key: 'field',
    name: 'Factra Field',
    href: '/field/',
    short: '현장 실측·진단 플랫폼',
    desc: '사진·메모·설비 통신을 현장에서 오프라인으로 기록하고, 사무실에서 설비 단위로 묶어 진단 보고서까지 이어 줍니다.',
    image: '/images/field-measure.jpg',
    status: '사내 운영',
  },
] as const

export const nav = [
  { label: 'Vision', href: '/vision/' },
  { label: 'RTLS', href: '/rtls/' },
  { label: 'Field', href: '/field/' },
  { label: '도입 사례', href: '/cases/' },
  { label: '회사 소개', href: '/company/' },
]
