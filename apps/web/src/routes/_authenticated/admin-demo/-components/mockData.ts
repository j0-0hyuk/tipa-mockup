/* ─────────────────────────────────────────────
   TIPA R&D 지원 서비스 관리자 페이지 — 더미 데이터
   (일반 사용자 대상 서비스: 소속/기관/직책 개념 없음)
   ───────────────────────────────────────────── */

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  joinedAt: string; // ISO date
  lastAccessAt: string; // ISO date
  totalDocs: number;
  docsThisMonth: number;
  totalSessions: number;
  avgSessionMinutes: number;
  aiReviewCount: number;
  status: 'active' | 'dormant' | 'new'; // 활성/휴면/신규
}

export interface Document {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  qualityScore: number;
  state: '초안' | '검토중' | '완료';
}

export interface ActivityLog {
  time: string;
  label: string;
}

/* ─── 사용자 데이터 ─── */
const koreanNames = [
  '김민수', '이지연', '박상훈', '정수민', '최현우', '강지혜', '조은영', '윤재훈',
  '한서준', '임도윤', '오서아', '장하윤', '송민준', '권지우', '황예준', '안시우',
  '홍유나', '전하람', '노지후', '심채원', '유태경', '문지안', '고나라', '배태민',
  '서예린', '남건우', '도민재', '엄소율', '양태희', '구윤아', '방주원', '천현서',
];

const emailDomains = ['naver.com', 'gmail.com', 'daum.net', 'kakao.com'];
const emailPrefixes = [
  'minsoo', 'jiyeon', 'sanghoon', 'sumin', 'hyunwoo', 'jihye', 'eunyoung', 'jaehoon',
  'seojun', 'doyoon', 'seoah', 'hayoon', 'minjun', 'jiwoo', 'yejun', 'siwoo',
  'yuna', 'haram', 'jihoo', 'chaewon', 'taekyung', 'jian', 'nara', 'taemin',
  'yerin', 'gunwoo', 'minjae', 'soyul', 'taehee', 'yoona', 'juwon', 'hyunseo',
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const USERS: User[] = koreanNames.map((name, idx) => {
  const joinedDaysAgo = 5 + Math.floor(Math.random() * 120);
  const lastAccessDaysAgo = Math.floor(Math.random() * 14);
  const totalDocs = Math.floor(Math.random() * 18) + 1;
  const docsThisMonth = Math.min(totalDocs, Math.floor(Math.random() * 6));
  const status: User['status'] =
    joinedDaysAgo < 14 ? 'new' : lastAccessDaysAgo > 10 ? 'dormant' : 'active';

  return {
    id: `user-${idx + 1}`,
    email: `${emailPrefixes[idx % emailPrefixes.length]}${1990 + idx}@${emailDomains[idx % emailDomains.length]}`,
    name,
    phone: `010-${String(1000 + (idx * 7) % 9000).padStart(4, '0')}-${String(2000 + (idx * 13) % 7999).padStart(4, '0')}`,
    joinedAt: daysAgo(joinedDaysAgo),
    lastAccessAt: daysAgo(lastAccessDaysAgo),
    totalDocs,
    docsThisMonth,
    totalSessions: Math.floor(Math.random() * 60) + 10,
    avgSessionMinutes: Math.floor(Math.random() * 40) + 15,
    aiReviewCount: Math.floor(totalDocs * (2 + Math.random() * 3)),
    status,
  };
});

/* ─── 일별 접속자 수 (최근 30일) ─── */
export const DAILY_VISITS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const base = 18 + Math.sin(i / 4) * 8 + i * 0.9;
  const weekday = d.getDay();
  const weekendFactor = weekday === 0 || weekday === 6 ? 0.4 : 1;
  return {
    date: `${d.getMonth() + 1}/${d.getDate()}`,
    visitors: Math.max(3, Math.round((base + Math.random() * 8) * weekendFactor)),
  };
});

/* ─── 일별 문서 생성 수 (최근 30일) ─── */
export const DAILY_DOCS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const base = 12 + Math.sin(i / 5) * 5 + i * 0.7;
  const weekday = d.getDay();
  const weekendFactor = weekday === 0 || weekday === 6 ? 0.3 : 1;
  return {
    date: `${d.getMonth() + 1}/${d.getDate()}`,
    docs: Math.max(1, Math.round((base + Math.random() * 6) * weekendFactor)),
  };
});

/* ─── 현재 접속 중인 사용자 (실시간) ─── */
export const CURRENT_ONLINE = [
  { userId: 'user-3', name: '박상훈', minutesAgo: 2 },
  { userId: 'user-1', name: '김민수', minutesAgo: 5 },
  { userId: 'user-8', name: '윤재훈', minutesAgo: 8 },
  { userId: 'user-15', name: '황예준', minutesAgo: 11 },
  { userId: 'user-4', name: '정수민', minutesAgo: 14 },
  { userId: 'user-11', name: '오서아', minutesAgo: 16 },
  { userId: 'user-7', name: '조은영', minutesAgo: 19 },
  { userId: 'user-22', name: '문지안', minutesAgo: 22 },
];

/* ─── KPI 요약 ─── */
export const KPI = {
  totalUsers: 342,
  onlineNow: 14,
  mau: 187,
  totalDocs: 1247,
  weeklyUserGrowth: 18,
  weeklyDocsGrowth: 23,
};

/* ─── 사용자별 문서 더미 ─── */
const docTitles = [
  'AI 기반 지능형 문서 자동 생성 시스템 개발',
  '자연어처리 기반 공공 R&D 계획서 자동화',
  '소규모 스마트팜 환경 제어 시스템',
  '차세대 반도체 공정 최적화 연구',
  '바이오센서 기반 조기 진단 플랫폼',
  '1인 창업 초기 IoT 디바이스 프로토타입',
  '차량용 엣지 AI 추론 엔진 개발',
  '양자컴퓨팅 에뮬레이터 프레임워크',
  '친환경 이차전지 전해질 소재 개발',
  '심층강화학습 기반 로봇 제어',
] as const;

export function getUserDocuments(userId: string): Document[] {
  const user = USERS.find((u) => u.id === userId);
  if (!user) return [];
  const count = Math.min(user.totalDocs, 8);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i * 4 - 2);
    return {
      id: `doc-${userId}-${i}`,
      title: docTitles[(parseInt(userId.replace('user-', ''), 10) + i) % docTitles.length],
      authorId: userId,
      authorName: user.name,
      createdAt: d.toISOString(),
      qualityScore: Math.floor(75 + Math.random() * 20),
      state: i === 0 ? '초안' : i < 3 ? '검토중' : '완료',
    };
  });
}

/* ─── 사용자별 월별 문서 생성 추이 ─── */
export function getUserMonthlyDocs(userId: string) {
  const user = USERS.find((u) => u.id === userId);
  const base = user ? Math.max(1, user.totalDocs / 6) : 2;
  return ['11월', '12월', '1월', '2월', '3월', '4월'].map((month, i) => ({
    month,
    docs: Math.max(0, Math.round(base + Math.sin(i) * 2 + (Math.random() - 0.3) * 3)),
  }));
}

/* ─── 사용자 활동 타임라인 ─── */
export function getUserActivityTimeline(userId: string): ActivityLog[] {
  const user = USERS.find((u) => u.id === userId);
  if (!user) return [];
  const fmt = (daysOffset: number, timeStr: string) => {
    const d = new Date();
    d.setDate(d.getDate() - daysOffset);
    return `${d.getMonth() + 1}월 ${d.getDate()}일 ${timeStr}`;
  };
  return [
    { time: fmt(0, '14:32'), label: '계획서 "AI 기반 문서 자동 생성" 초안 저장' },
    { time: fmt(0, '13:18'), label: 'AI 품질 검토 실행 (종합 점수 87)' },
    { time: fmt(1, '11:40'), label: '신규 계획서 작성 시작 · TIPA 예시 2 모드' },
    { time: fmt(2, '16:05'), label: '과거 초안 불러오기' },
    { time: fmt(3, '10:12'), label: '로그인' },
    { time: fmt(7, '09:47'), label: '첫 계획서 작성 완료' },
    { time: user.joinedAt.slice(0, 10), label: '서비스 가입' },
  ];
}

/* ─── 유틸: 상대 시간 포맷 ─── */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMin = Math.floor((now - then) / 60000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}일 전`;
  const diffMonth = Math.floor(diffDay / 30);
  return `${diffMonth}개월 전`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}.${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/* ─── 아바타 색상 팔레트 ─── */
const AVATAR_COLORS = ['#E0EBFF', '#E8F7EE', '#FEF4E6', '#FDECEC', '#F3E8FF', '#E0F2FE', '#FCE7F3'];
export function avatarColor(id: string): string {
  const n = id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

/* ─── 전체 문서 리스트 (생성 문서 현황용) ─── */
export const ALL_DOCUMENTS: Document[] = (() => {
  const result: Document[] = [];
  USERS.forEach((user) => {
    const count = Math.min(user.totalDocs, 5);
    for (let i = 0; i < count; i += 1) {
      const d = new Date();
      d.setDate(d.getDate() - (i * 3 + (parseInt(user.id.replace('user-', ''), 10) % 10)));
      result.push({
        id: `doc-${user.id}-${i}`,
        title: docTitles[(parseInt(user.id.replace('user-', ''), 10) + i) % docTitles.length],
        authorId: user.id,
        authorName: user.name,
        createdAt: d.toISOString(),
        qualityScore: Math.floor(72 + Math.random() * 22),
        state: i === 0 ? '초안' : i < 3 ? '검토중' : '완료',
      });
    }
  });
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
})();

/* ─── 활발한 사용자 Top 5 (문서 생성 수 기준) ─── */
export const TOP_ACTIVE_USERS = [...USERS]
  .sort((a, b) => b.totalDocs - a.totalDocs)
  .slice(0, 5);

/* ─── 서비스 품질 지표 ─── */
export const QUALITY_METRICS = {
  avgScore: 86.3,
  scoreDelta: 2.1, // 지난 달 대비
  avgTimeSaved: 67, // % 단축
  reuseRate: 72, // 재방문률
  aiAdoptionRate: 81, // AI 제안 반영률
};

/* ─── 월별 AI 품질 점수 추이 ─── */
export const QUALITY_TREND = [
  { month: '10월', score: 78.2 },
  { month: '11월', score: 80.5 },
  { month: '12월', score: 82.1 },
  { month: '1월', score: 83.4 },
  { month: '2월', score: 84.7 },
  { month: '3월', score: 86.3 },
];

/* ─── 항목별 검토 통과율 ─── */
export const CATEGORY_PASS_RATES = [
  { category: '기술개발 목표', rate: 92 },
  { category: '연구개발 방법', rate: 88 },
  { category: '선행연구개발 분석', rate: 81 },
  { category: '연구개발기관 실적', rate: 79 },
  { category: '사업비 사용계획', rate: 85 },
  { category: '추진일정', rate: 68 },
  { category: '기대효과', rate: 84 },
  { category: '안전·보안', rate: 90 },
];

/* ─── 개선 필요 영역 Top 5 ─── */
export const IMPROVEMENT_AREAS = [
  { area: '추진일정 세부 마일스톤', count: 124, severity: 'high' as const },
  { area: '정량 목표 수치화', count: 87, severity: 'medium' as const },
  { area: '선행연구 국외 논문 보강', count: 62, severity: 'medium' as const },
  { area: '사업비 근거 자료', count: 48, severity: 'low' as const },
  { area: '기관 실적 정량화', count: 35, severity: 'low' as const },
];
