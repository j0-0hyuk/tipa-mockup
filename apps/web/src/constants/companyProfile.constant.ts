export const INDUSTRY_OPTIONS = [
  { value: 'IT_SW', label: 'IT·소프트웨어' },
  { value: 'BIO_HEALTH', label: '바이오·헬스케어' },
  { value: 'MANUFACTURING', label: '제조·기계' },
  { value: 'MATERIALS', label: '소재·부품' },
  { value: 'ENERGY_ENV', label: '에너지·환경' },
  { value: 'MOBILITY', label: '모빌리티·자동차' },
  { value: 'AGRI_FOOD', label: '농식품·바이오자원' },
  { value: 'CONTENTS', label: '콘텐츠·서비스' },
  { value: 'ETC', label: '기타' },
] as const;

export const EMPLOYEE_SIZE_OPTIONS = [
  { value: 'UNDER_10', label: '10인 미만' },
  { value: '10_49', label: '10~49인' },
  { value: '50_99', label: '50~99인' },
  { value: '100_299', label: '100~299인' },
  { value: 'OVER_300', label: '300인 이상' },
] as const;

export const REVENUE_OPTIONS = [
  { value: 'UNDER_1E', label: '1억 미만' },
  { value: '1E_10E', label: '1억 ~ 10억' },
  { value: '10E_50E', label: '10억 ~ 50억' },
  { value: '50E_300E', label: '50억 ~ 300억' },
  { value: 'OVER_300E', label: '300억 이상' },
] as const;

export const TRL_OPTIONS = [
  { value: 'TRL_1_3', label: '초기 연구 단계 (TRL 1~3)' },
  { value: 'TRL_4_5', label: '실험실 검증 단계 (TRL 4~5)' },
  { value: 'TRL_6_7', label: '시제품·파일럿 단계 (TRL 6~7)' },
  { value: 'TRL_8_9', label: '상용화 준비 단계 (TRL 8~9)' },
] as const;

export const REGION_OPTIONS = [
  { value: 'SEOUL', label: '서울' },
  { value: 'GYEONGGI', label: '경기' },
  { value: 'INCHEON', label: '인천' },
  { value: 'DAEJEON', label: '대전·충청' },
  { value: 'BUSAN', label: '부산·울산·경남' },
  { value: 'DAEGU', label: '대구·경북' },
  { value: 'GWANGJU', label: '광주·전라' },
  { value: 'GANGWON', label: '강원' },
  { value: 'JEJU', label: '제주' },
] as const;

export const BUDGET_OPTIONS = [
  { value: 'UNDER_1E', label: '1억 미만' },
  { value: '1E_3E', label: '1억 ~ 3억' },
  { value: '3E_5E', label: '3억 ~ 5억' },
  { value: '5E_10E', label: '5억 ~ 10억' },
  { value: 'OVER_10E', label: '10억 이상' },
] as const;

export const MINISTRY_OPTIONS = [
  { value: 'MSIT', label: '과학기술정보통신부' },
  { value: 'MOTIE', label: '산업통상자원부' },
  { value: 'MSS', label: '중소벤처기업부' },
  { value: 'MAFRA', label: '농림축산식품부' },
  { value: 'MOHW', label: '보건복지부' },
  { value: 'ME', label: '환경부' },
  { value: 'MOLIT', label: '국토교통부' },
] as const;

export type IndustryValue = typeof INDUSTRY_OPTIONS[number]['value'];
export type EmployeeSizeValue = typeof EMPLOYEE_SIZE_OPTIONS[number]['value'];
export type RevenueValue = typeof REVENUE_OPTIONS[number]['value'];
export type TrlValue = typeof TRL_OPTIONS[number]['value'];
export type RegionValue = typeof REGION_OPTIONS[number]['value'];
export type BudgetValue = typeof BUDGET_OPTIONS[number]['value'];
export type MinistryValue = typeof MINISTRY_OPTIONS[number]['value'];

export type EligibilityAnswerValue = 'yes' | 'no' | 'unknown';

export interface CompanyProfile {
  // 기본정보
  companyName?: string;
  bizRegNo?: string;
  ceoName?: string;
  foundedYear?: number;
  region?: RegionValue;

  // 사업현황
  industry?: IndustryValue;
  employeeSize?: EmployeeSizeValue;
  revenue?: RevenueValue;

  // R&D 현황
  trl?: TrlValue;
  rndBudget?: BudgetValue;
  hasPriorAward?: boolean;
  techKeywords?: string[];
  targetMinistries?: MinistryValue[];

  // 신청자격 빠른 진단 (TIPA 11개 공고 공통)
  eligibility?: Record<string, EligibilityAnswerValue>;
  eligibilityUpdatedAt?: string;

  // 메타
  updatedAt?: string;
}

export const EMPTY_PROFILE: CompanyProfile = {
  techKeywords: [],
  targetMinistries: [],
  eligibility: {},
};
