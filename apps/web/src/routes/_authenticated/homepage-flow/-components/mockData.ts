export interface NoticeItem {
  id: string;
  badge: string;
  title: string;
  registeredAt: string;
  deadline: string;
  dDay: number;
}

export const NOTICES_SMTECH: NoticeItem[] = [
  {
    id: 'n1',
    badge: '사업공고',
    title: '2026년 중소기업 기술혁신개발사업(혁신형) 시행계획 공고',
    registeredAt: '2026.04.02',
    deadline: '2026.04.27',
    dDay: 17,
  },
  {
    id: 'n2',
    badge: '사업공고',
    title: '2026년 제1차 중소기업 기술상용화 지원사업 시행계획 공고',
    registeredAt: '2026.04.01',
    deadline: '2026.04.30',
    dDay: 20,
  },
  {
    id: 'n3',
    badge: '사업공고',
    title: '2026년 창업성장기술개발사업(TIPS 연계) 2차 공고',
    registeredAt: '2026.03.28',
    deadline: '2026.05.09',
    dDay: 29,
  },
  {
    id: 'n4',
    badge: '사업공고',
    title: '2026년 산학연 Collabo R&D사업 시행계획 공고',
    registeredAt: '2026.03.25',
    deadline: '2026.05.14',
    dDay: 34,
  },
];
