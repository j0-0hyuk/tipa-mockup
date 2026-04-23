import {
  EMPLOYEE_SIZE_OPTIONS,
  REVENUE_OPTIONS,
  type CompanyProfile,
} from '@/constants/companyProfile.constant';

export type EligibilityAnswer = 'yes' | 'no' | 'unknown';

export type EligibilitySeverity = 'blocker' | 'warning';

export interface EligibilityCheck {
  id: string;
  category: string;
  severity: EligibilitySeverity;
  question: string;
  hint: string;
  noMeaning: string;
  drillDown?: {
    title: string;
    items: string[];
  };
}

export const ELIGIBILITY_ANSWER_OPTIONS: Array<{
  value: EligibilityAnswer;
  label: string;
}> = [
  { value: 'yes', label: '네' },
  { value: 'no', label: '아니오' },
  { value: 'unknown', label: '모름' },
];

// 11개 HWPX 공고 공통 질문을 4개로 통합
export const TIPA_ELIGIBILITY_CHECKS: EligibilityCheck[] = [
  {
    id: 'company-status',
    category: '기업 자격',
    severity: 'blocker',
    question: '중소기업확인서 제출 가능하고, 휴·폐업·부도 같은 예외 이슈는 없나요?',
    hint: '위 기본정보는 반영했고, 여기서는 신청을 막는 예외 사유만 확인해요.',
    noMeaning:
      '중소기업이 아니거나 휴·폐업·부도 상태면 지원 불가. 회생인가·재도전 체계만 예외.',
    drillDown: {
      title: '기업 자격 세부 확인',
      items: [
        '중소기업확인서 또는 이에 준하는 증빙 제출 가능한가?',
        '회사가 현재 휴업·폐업·부도 상태인가?',
        '법원에 파산·회생·개인회생 개시를 신청한 상태인가?',
        '대표자 또는 회사가 사실상 채무조정 중이거나 정상 영업이 어려운 상태인가?',
      ],
    },
  },
  {
    id: 'sanction-status',
    category: '제재·참여제한',
    severity: 'blocker',
    question: '참여제한·수행배제·교부제한 이력 없나요?',
    hint: 'NTIS 제재정보조회, e나라도움 수행배제 조회로 현재 유효한 이력 확인.',
    noMeaning:
      '접수 마감일 현재 유효한 제재 이력이 있으면 지원 자체가 불가. 예외 없음.',
    drillDown: {
      title: '제재·제한 세부 확인',
      items: [
        '국가연구개발사업 또는 중소기업기술개발사업 참여제한 중인가?',
        '대표자·공동대표·연구책임자 중 참여제한 중인 사람이 있는가?',
        '보조금법상 수행 대상 배제 또는 교부 제한 상태인가?',
        'NTIS/e나라도움에서 현재 유효한 제재 이력이 확인되는가?',
      ],
    },
  },
  {
    id: 'capacity-limit',
    category: '수행 한도',
    severity: 'blocker',
    question: '졸업제·동시수행 한도에 여유 있나요?',
    hint: '최근 7년 수행이력 + 2025년 이후 주관기관 수행 중 과제 수 기준.',
    noMeaning:
      '졸업제·동시수행 한도 초과 시 지원 불가. 단계형·컨소시엄·예외사업은 재계산 필요.',
    drillDown: {
      title: '수행 이력·한도 세부 확인',
      items: [
        '최근 7년 주관기관 수행한 졸업제 대상 과제가 이미 3회 이상인가?',
        '주관기관으로 수행한 중소기업기술개발 지원사업이 이미 5회 이상인가?',
        '2025년 이후 신규 협약 기준 주관기관 수행 중 과제가 이미 1개 이상인가?',
        '이번 신청으로 동시수행 한도를 넘게 되는가?',
      ],
    },
  },
  {
    id: 'admin-finance',
    category: '행정·재무',
    severity: 'warning',
    question: '체납·미이행 의무·재무·IRIS 준비 이슈 없나요?',
    hint: '최초 평가 개시 전까지 해소하거나 예외 조항으로 커버 가능.',
    noMeaning:
      '바로 탈락은 아님. 최초 평가 개시 전까지 해소하거나 유예·예외 조항을 활용하면 지원 가능.',
    drillDown: {
      title: '행정·재무 세부 확인',
      items: [
        '국세·지방세·4대보험·임금체불·과태료 체납이 남아 있는가?',
        '기술료·환수금·회수금·제재부가금 미납 또는 성과 실적 미입력 건이 있는가?',
        '최근 결산 기준 부채비율 1,000% 이상 또는 자본전액잠식 상태인가?',
        '연구책임자·참여연구자의 IRIS 등록·연구자 전환·국가연구자번호 발급이 안 됐는가?',
        '주관기관 IRIS 기관등록·기관대표자·총괄담당자 등록이 안 됐는가?',
      ],
    },
  },
];

export type EligibilityStatus =
  | 'not_started'
  | 'in_progress'
  | 'needs_check'
  | 'safe'
  | 'risk';

export interface EligibilitySummary {
  status: EligibilityStatus;
  answeredCount: number;
  totalCount: number;
  riskCount: number;
  blockerNoCount: number;
  warningNoCount: number;
  unknownCount: number;
  autoCount: number;
}

export interface DerivedEligibility {
  answer: EligibilityAnswer;
  reason: string;
}

export const deriveAutoEligibility = (
  profile: Pick<CompanyProfile, 'employeeSize' | 'revenue' | 'hasPriorAward' | 'foundedYear'>,
): Record<string, DerivedEligibility> => {
  const auto: Record<string, DerivedEligibility> = {};

  // ① 기업 자격: 종업원 300인 미만 + 매출 300억 미만이면 중소기업으로 추정
  if (profile.employeeSize && profile.revenue) {
    const isLargeByEmp = profile.employeeSize === 'OVER_300';
    const isLargeByRev = profile.revenue === 'OVER_300E';
    if (!isLargeByEmp && !isLargeByRev) {
      const empLabel = EMPLOYEE_SIZE_OPTIONS.find(
        (o) => o.value === profile.employeeSize,
      )?.label;
      const revLabel = REVENUE_OPTIONS.find(
        (o) => o.value === profile.revenue,
      )?.label;
      auto['company-status'] = {
        answer: 'yes',
        reason: `종업원 ${empLabel} · 연매출 ${revLabel} 기준으로 먼저 반영했어요. 휴·폐업 이슈가 있으면 수정해 주세요`,
      };
    }
  } else {
    auto['company-status'] = {
      answer: 'yes',
      reason: '신청 가능한 중소기업으로 먼저 반영했어요. 휴·폐업·부도 이슈가 있으면 수정해 주세요',
    };
  }

  // ② 제재·참여제한: 제재 이력 없는 회사로 기본 가정
  auto['sanction-status'] = {
    answer: 'yes',
    reason: '제재 이력 없는 상태로 먼저 반영했어요. 참여제한 이력이 있으면 수정해 주세요',
  };

  // ③ 수행 한도
  if (profile.hasPriorAward === false) {
    auto['capacity-limit'] = {
      answer: 'yes',
      reason: '최근 3년 수혜 이력이 없는 것으로 먼저 반영했어요. 수행 이력이 있으면 수정해 주세요',
    };
  } else {
    auto['capacity-limit'] = {
      answer: 'yes',
      reason: '수행 한도 안으로 먼저 반영했어요. 졸업제·동시수행 이슈가 있으면 수정해 주세요',
    };
  }

  // ④ 행정·재무: 이슈 없는 상태로 기본 가정
  auto['admin-finance'] = {
    answer: 'yes',
    reason: '행정·재무 이슈 없는 상태로 먼저 반영했어요. 체납·미납·재무 이슈가 있으면 수정해 주세요',
  };

  return auto;
};

export const mergeEligibilityAnswers = (
  userAnswers: Record<string, EligibilityAnswer | undefined> | undefined,
  derived: Record<string, DerivedEligibility>,
): Record<string, EligibilityAnswer | undefined> => {
  const merged: Record<string, EligibilityAnswer | undefined> = {
    ...Object.fromEntries(
      Object.entries(derived).map(([id, d]) => [id, d.answer]),
    ),
    ...(userAnswers ?? {}),
  };
  return merged;
};

export const computeEligibilitySummary = (
  effectiveAnswers: Record<string, EligibilityAnswer | undefined> | undefined,
  derivedKeys?: Set<string>,
): EligibilitySummary => {
  const total = TIPA_ELIGIBILITY_CHECKS.length;
  const safe = effectiveAnswers ?? {};
  let answered = 0;
  let risk = 0;
  let blockerNo = 0;
  let warningNo = 0;
  let unknown = 0;
  let auto = 0;

  TIPA_ELIGIBILITY_CHECKS.forEach((check) => {
    const a = safe[check.id];
    if (!a) return;
    answered += 1;
    if (a === 'no') {
      risk += 1;
      if (check.severity === 'blocker') blockerNo += 1;
      else warningNo += 1;
    } else if (a === 'unknown') unknown += 1;
    if (derivedKeys?.has(check.id)) auto += 1;
  });

  let status: EligibilityStatus = 'not_started';
  if (answered === 0) status = 'not_started';
  else if (answered < total) status = 'in_progress';
  else if (risk > 0) status = 'risk';
  else if (unknown > 0) status = 'needs_check';
  else status = 'safe';

  return {
    status,
    answeredCount: answered,
    totalCount: total,
    riskCount: risk,
    blockerNoCount: blockerNo,
    warningNoCount: warningNo,
    unknownCount: unknown,
    autoCount: auto,
  };
};
