import type {
  CompanyProfile,
  EligibilityAnswerValue,
} from '@/constants/companyProfile.constant';

/**
 * 공고별 "추가 확인" 조항 카탈로그
 * - 페이지 4에서 공통 자격을 먼저 확인한다.
 * - 여기서는 공고마다 갈리는 예외/분기 조건만 다룬다.
 * - HWPX 공고문 공통 축 기준: 신산업 창업분야, 졸업제, 재무 예외, 모집차수 중복신청
 */

export type SpecialClauseId =
  | 'new-industry-fit-7to10'
  | 'graduation-limit'
  | 'finance-exception'
  | 'single-call-limit';

export type SpecialClauseAnswer = 'ready' | 'not_ready' | 'not_applicable';

export type SpecialClauseSeverity = 'blocker' | 'warning';

export interface SpecialClause {
  id: SpecialClauseId;
  category: string;
  severity: SpecialClauseSeverity;
  question: string;
  hint: string;
  readyMeaning: string;
  notReadyMeaning: string;
  notApplicableMeaning?: string;
}

export interface SpecialClauseContext {
  profile?: Pick<CompanyProfile, 'foundedYear' | 'hasPriorAward'>;
  effectiveEligibility?: Record<string, EligibilityAnswerValue | undefined>;
  currentYear?: number;
}

export const SPECIAL_CLAUSE_ANSWER_OPTIONS: Array<{
  value: SpecialClauseAnswer;
  label: string;
}> = [
  { value: 'ready', label: '네' },
  { value: 'not_ready', label: '아니오' },
  { value: 'not_applicable', label: '해당 없어요' },
];

export const TIPA_SPECIAL_CLAUSES: Record<SpecialClauseId, SpecialClause> = {
  'new-industry-fit-7to10': {
    id: 'new-industry-fit-7to10',
    category: '신산업 창업분야',
    severity: 'blocker',
    question:
      '업력 7년 초과 10년 이하 기업이라면, 이 공고가 요구하는 신산업 창업분야에 해당하나요?',
    hint:
      '업력 7년 이하는 해당 없어요. 7~10년 기업은 분야가 맞지 않으면 신청 제외될 수 있어요.',
    readyMeaning: '신산업 창업분야가 맞으면 계속 진행할 수 있어요.',
    notReadyMeaning:
      '업력 7~10년 기업인데 신산업 창업분야가 맞지 않으면 이 공고는 신청 제외 대상이에요.',
    notApplicableMeaning: '업력 7년 이하 또는 10년 초과면 이 항목은 넘어가면 돼요.',
  },
  'graduation-limit': {
    id: 'graduation-limit',
    category: 'R&D 졸업제',
    severity: 'blocker',
    question: '최근 7년 수행 이력 기준으로 졸업제 한도를 넘지 않나요?',
    hint:
      '중소기업기술개발 지원사업은 최근 7년 3회, 누적 5회 기준을 넘으면 신청이 어려워요. 예외사업은 별도 확인이 필요해요.',
    readyMeaning: '한도 안이면 계속 진행할 수 있어요.',
    notReadyMeaning:
      '졸업제 한도 초과거나 예외사업 여부가 불분명하면 신청이 어려울 수 있어요.',
    notApplicableMeaning: '수행 이력이 거의 없거나 예외사업이면 별도 확인만 하면 돼요.',
  },
  'finance-exception': {
    id: 'finance-exception',
    category: '재무 예외 조항',
    severity: 'warning',
    question:
      '재무 이슈가 있다면, 창업 3년 미만·디딤돌 첫걸음·이행보증보험증권 제출 같은 예외 사유가 있나요?',
    hint:
      '부채비율, 자본잠식, 의무 미이행 이슈가 있어도 예외 조항으로 해소되는 경우가 있어요.',
    readyMeaning: '예외 사유가 있으면 공고별 추가 검토 후 진행할 수 있어요.',
    notReadyMeaning:
      '예외 사유가 없으면 재무 요건 때문에 신청이 어려울 수 있어요. 먼저 해소 여부를 확인해 주세요.',
    notApplicableMeaning: '재무 이슈가 없다면 이 항목은 넘어가면 돼요.',
  },
  'single-call-limit': {
    id: 'single-call-limit',
    category: '모집차수 중복신청',
    severity: 'blocker',
    question: '같은 모집차수에 주관기관으로 다른 과제를 이미 신청하진 않았나요?',
    hint:
      '동일 모집차수에는 내역사업별 1개 과제만 신청 가능한 경우가 많아요. 중복 신청이면 접수 제외될 수 있어요.',
    readyMeaning: '같은 차수 중복 신청이 없으면 그대로 진행하면 돼요.',
    notReadyMeaning:
      '같은 모집차수 중복 신청이면 이 공고는 접수 제외될 수 있어요. 신청 건을 먼저 정리해 주세요.',
  },
};

const getCompanyAge = (
  foundedYear: number | undefined,
  currentYear: number,
): number | null => {
  if (!foundedYear) return null;
  return currentYear - foundedYear;
};

const isClauseApplicable = (
  id: SpecialClauseId,
  context?: SpecialClauseContext,
): boolean => {
  const currentYear = context?.currentYear ?? new Date().getFullYear();
  const age = getCompanyAge(context?.profile?.foundedYear, currentYear);
  const eligibility = context?.effectiveEligibility;

  switch (id) {
    case 'new-industry-fit-7to10':
      return age !== null && age > 7 && age <= 10;
    case 'graduation-limit':
      return (
        context?.profile?.hasPriorAward === true ||
        eligibility?.['capacity-limit'] === 'unknown' ||
        eligibility?.['capacity-limit'] === 'no'
      );
    case 'finance-exception':
      return eligibility?.['admin-finance'] === 'no';
    case 'single-call-limit':
      return true;
    default:
      return true;
  }
};

/**
 * 공고의 specialClauses id 배열 → 실제 질문 객체 배열로 변환
 */
export const resolveSpecialClauses = (
  clauseIds: SpecialClauseId[] | undefined,
  context?: SpecialClauseContext,
): SpecialClause[] => {
  if (!clauseIds || clauseIds.length === 0) return [];
  return clauseIds
    .map((id) => TIPA_SPECIAL_CLAUSES[id])
    .filter((clause): clause is SpecialClause => !!clause)
    .filter((clause) => isClauseApplicable(clause.id, context));
};

export interface SpecialClauseSummary {
  total: number;
  answered: number;
  notReady: number;
  notReadyBlocker: number;
  notReadyWarning: number;
  notApplicableCount: number;
}

export const computeSpecialClauseSummary = (
  clauses: SpecialClause[],
  answers: Record<string, SpecialClauseAnswer | undefined>,
): SpecialClauseSummary => {
  let answered = 0;
  let notReady = 0;
  let notReadyBlocker = 0;
  let notReadyWarning = 0;
  let notApplicableCount = 0;
  clauses.forEach((c) => {
    const a = answers[c.id];
    if (!a) return;
    answered += 1;
    if (a === 'not_ready') {
      notReady += 1;
      if (c.severity === 'blocker') notReadyBlocker += 1;
      else notReadyWarning += 1;
    } else if (a === 'not_applicable') {
      notApplicableCount += 1;
    }
  });
  return {
    total: clauses.length,
    answered,
    notReady,
    notReadyBlocker,
    notReadyWarning,
    notApplicableCount,
  };
};
