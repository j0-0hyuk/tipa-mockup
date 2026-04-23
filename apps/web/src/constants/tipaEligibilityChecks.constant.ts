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
    hint: '중소기업 여부보다, 신청을 막는 예외 이슈가 있는지만 보면 돼요.',
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
    hint: '지금 유효한 참여제한 이력이 있는지만 확인해 주세요.',
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
    hint: '최근 수행 이력과 현재 진행 중인 과제 수만 보면 돼요.',
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
    hint: '체납·미납·재무 이슈가 있다면 예외 조항으로 풀 수 있는지 확인해 주세요.',
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
};

export const computeEligibilitySummary = (
  effectiveAnswers: Record<string, EligibilityAnswer | undefined> | undefined,
): EligibilitySummary => {
  const total = TIPA_ELIGIBILITY_CHECKS.length;
  const safe = effectiveAnswers ?? {};
  let answered = 0;
  let risk = 0;
  let blockerNo = 0;
  let warningNo = 0;
  let unknown = 0;

  TIPA_ELIGIBILITY_CHECKS.forEach((check) => {
    const a = safe[check.id];
    if (!a) return;
    answered += 1;
    if (a === 'no') {
      risk += 1;
      if (check.severity === 'blocker') blockerNo += 1;
      else warningNo += 1;
    } else if (a === 'unknown') unknown += 1;
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
  };
};
