import type {
  BudgetValue,
  IndustryValue,
  MinistryValue,
  RegionValue,
  TrlValue,
} from '@/constants/companyProfile.constant';
import type { SpecialClauseId } from '@/constants/tipaSpecialClauses.constant';

export interface TipaProgram {
  id: string;
  title: string;
  ministry: MinistryValue;
  agency: string;
  applyDeadline: string; // ISO date
  budgetRange: BudgetValue;
  targetTrls: TrlValue[];
  targetIndustries: IndustryValue[];
  targetRegions?: RegionValue[]; // 없으면 전국
  targetCompanySize: Array<'STARTUP' | 'SMALL' | 'MID' | 'MID_LARGE'>; // 창업/소기업/중기업/중견
  keywords: string[];
  description: string;
  specialTag?: 'NEW' | 'HOT' | 'DEADLINE_SOON';
  /** 이 공고 고유의 추가 유의사항 조항 id 배열 (tipaSpecialClauses.constant.ts 참조) */
  specialClauses?: SpecialClauseId[];
}

export const TIPA_MOCK_PROGRAMS: TipaProgram[] = [
  {
    id: 'p1',
    title: '2026년도 창업성장기술개발사업 (디딤돌 과제)',
    ministry: 'MSS',
    agency: '중소기업기술정보진흥원',
    applyDeadline: '2026-05-20',
    budgetRange: '1E_3E',
    targetTrls: ['TRL_4_5', 'TRL_6_7'],
    targetIndustries: ['IT_SW', 'BIO_HEALTH', 'MANUFACTURING', 'MATERIALS', 'CONTENTS'],
    targetCompanySize: ['STARTUP', 'SMALL'],
    keywords: ['창업', 'AI', '플랫폼', '시제품'],
    description:
      '창업 7년 이내 중소기업 중심 R&D. 신산업 창업분야는 업력 10년 이하까지 예외 검토 가능.',
    specialTag: 'HOT',
    specialClauses: [
      'new-industry-fit-7to10',
      'graduation-limit',
      'finance-exception',
      'single-call-limit',
    ],
  },
  {
    id: 'p2',
    title: '중소기업 상용화 기술개발사업 (구매조건부 과제)',
    ministry: 'MSS',
    agency: '중소기업기술정보진흥원',
    applyDeadline: '2026-06-10',
    budgetRange: '3E_5E',
    targetTrls: ['TRL_6_7', 'TRL_8_9'],
    targetIndustries: ['MANUFACTURING', 'MATERIALS', 'ENERGY_ENV', 'MOBILITY'],
    targetCompanySize: ['SMALL', 'MID'],
    keywords: ['구매연계', '상용화', '양산', '공급망'],
    description: '수요기업 구매 의향서 기반 R&D. 최대 3년, 정부출연금 4억 한도.',
    specialClauses: [
      'graduation-limit',
      'finance-exception',
      'single-call-limit',
    ],
  },
  {
    id: 'p3',
    title: '소재·부품·장비 기술개발사업 (전략핵심소재)',
    ministry: 'MOTIE',
    agency: '한국산업기술평가관리원',
    applyDeadline: '2026-05-30',
    budgetRange: 'OVER_10E',
    targetTrls: ['TRL_6_7', 'TRL_8_9'],
    targetIndustries: ['MATERIALS', 'MANUFACTURING'],
    targetCompanySize: ['MID', 'MID_LARGE'],
    keywords: ['소재', '부품', '국산화', '공급망'],
    description: '전략핵심 소재 국산화 R&D. 최대 5년, 정부출연금 30억 한도.',
  },
  {
    id: 'p4',
    title: 'AI 선도형 바우처 지원사업',
    ministry: 'MSIT',
    agency: '정보통신산업진흥원',
    applyDeadline: '2026-05-07',
    budgetRange: 'UNDER_1E',
    targetTrls: ['TRL_4_5', 'TRL_6_7'],
    targetIndustries: ['IT_SW', 'CONTENTS', 'BIO_HEALTH'],
    targetCompanySize: ['STARTUP', 'SMALL'],
    keywords: ['AI', '바우처', 'SaaS', '도입'],
    description: 'AI 기술 도입·실증 바우처. 최대 8천만원, 자부담 20%.',
    specialTag: 'DEADLINE_SOON',
  },
  {
    id: 'p5',
    title: '바이오·헬스케어 혁신 R&D 사업',
    ministry: 'MOHW',
    agency: '한국보건산업진흥원',
    applyDeadline: '2026-06-25',
    budgetRange: '5E_10E',
    targetTrls: ['TRL_4_5', 'TRL_6_7'],
    targetIndustries: ['BIO_HEALTH'],
    targetCompanySize: ['SMALL', 'MID'],
    keywords: ['의료기기', '디지털헬스', '진단', '치료제'],
    description: '바이오·의료 융합 기술 실증 지원. 최대 3년, 출연금 7억 한도.',
  },
  {
    id: 'p6',
    title: '탄소중립형 에너지 실증사업',
    ministry: 'ME',
    agency: '한국환경산업기술원',
    applyDeadline: '2026-07-15',
    budgetRange: '5E_10E',
    targetTrls: ['TRL_6_7', 'TRL_8_9'],
    targetIndustries: ['ENERGY_ENV', 'MATERIALS', 'MOBILITY'],
    targetCompanySize: ['SMALL', 'MID', 'MID_LARGE'],
    keywords: ['탄소중립', '실증', '에너지', '환경'],
    description: '탄소 저감 실증 R&D. 최대 4년, 출연금 10억 한도.',
  },
  {
    id: 'p7',
    title: '지역 특화산업 육성 R&D (비수도권)',
    ministry: 'MOTIE',
    agency: '한국산업기술진흥원',
    applyDeadline: '2026-06-05',
    budgetRange: '1E_3E',
    targetTrls: ['TRL_4_5', 'TRL_6_7'],
    targetIndustries: ['MANUFACTURING', 'MATERIALS', 'AGRI_FOOD', 'ENERGY_ENV'],
    targetRegions: ['DAEJEON', 'BUSAN', 'DAEGU', 'GWANGJU', 'GANGWON', 'JEJU'],
    targetCompanySize: ['SMALL', 'MID'],
    keywords: ['지역특화', '비수도권', '산업혁신'],
    description: '비수도권 소재 기업 전용. 최대 2년, 출연금 2.5억 한도.',
  },
  {
    id: 'p8',
    title: '모빌리티 융합 서비스 실증 지원사업',
    ministry: 'MOLIT',
    agency: '한국교통안전공단',
    applyDeadline: '2026-07-01',
    budgetRange: '3E_5E',
    targetTrls: ['TRL_6_7', 'TRL_8_9'],
    targetIndustries: ['MOBILITY', 'IT_SW'],
    targetCompanySize: ['STARTUP', 'SMALL', 'MID'],
    keywords: ['모빌리티', '자율주행', 'UAM', '실증'],
    description: '모빌리티 서비스 실증. 최대 3년, 출연금 4억 한도.',
    specialTag: 'NEW',
  },
  {
    id: 'p9',
    title: '농식품 벤처·창업 바우처',
    ministry: 'MAFRA',
    agency: '농업기술실용화재단',
    applyDeadline: '2026-06-18',
    budgetRange: 'UNDER_1E',
    targetTrls: ['TRL_4_5', 'TRL_6_7'],
    targetIndustries: ['AGRI_FOOD', 'BIO_HEALTH'],
    targetCompanySize: ['STARTUP', 'SMALL'],
    keywords: ['농식품', '푸드테크', '스마트팜', '바우처'],
    description: '농식품 분야 창업 기업 대상 R&D 바우처. 최대 8천만원.',
  },
  {
    id: 'p10',
    title: '콘텐츠 원천기술 고도화 R&D',
    ministry: 'MSIT',
    agency: '한국콘텐츠진흥원',
    applyDeadline: '2026-08-10',
    budgetRange: '3E_5E',
    targetTrls: ['TRL_4_5', 'TRL_6_7'],
    targetIndustries: ['CONTENTS', 'IT_SW'],
    targetCompanySize: ['STARTUP', 'SMALL', 'MID'],
    keywords: ['콘텐츠', 'XR', '메타버스', '스토리테크'],
    description: '콘텐츠 원천기술 R&D. 최대 3년, 출연금 3.5억 한도.',
  },
];
