import type { CompanyProfile } from '@/constants/companyProfile.constant';
import {
  TIPA_MOCK_PROGRAMS,
  type TipaProgram,
} from '@/constants/tipaMockPrograms.constant';

export interface MatchReason {
  label: string;
  type: 'positive' | 'neutral' | 'negative';
}

export interface ProgramMatch {
  program: TipaProgram;
  score: number; // 0~100
  reasons: MatchReason[];
}

const SIZE_FROM_EMPLOYEE: Record<string, 'STARTUP' | 'SMALL' | 'MID' | 'MID_LARGE'> = {
  UNDER_10: 'STARTUP',
  '10_49': 'SMALL',
  '50_99': 'SMALL',
  '100_299': 'MID',
  OVER_300: 'MID_LARGE',
};

const isStartup = (foundedYear?: number) =>
  typeof foundedYear === 'number' && new Date().getFullYear() - foundedYear < 7;

export const computeMatchScore = (
  profile: CompanyProfile,
  program: TipaProgram,
): ProgramMatch => {
  const reasons: MatchReason[] = [];
  let score = 0;

  // 업종 매칭 (20점)
  if (profile.industry && program.targetIndustries.includes(profile.industry)) {
    score += 20;
    reasons.push({ label: '업종 일치', type: 'positive' });
  }

  // TRL 매칭 (20점)
  if (profile.trl && program.targetTrls.includes(profile.trl)) {
    score += 20;
    reasons.push({ label: '기술 성숙도 일치', type: 'positive' });
  }

  // 기업 규모 매칭 (20점)
  const companySize = profile.employeeSize
    ? SIZE_FROM_EMPLOYEE[profile.employeeSize]
    : undefined;
  const effectiveSize = isStartup(profile.foundedYear) ? 'STARTUP' : companySize;
  if (effectiveSize && program.targetCompanySize.includes(effectiveSize)) {
    score += 20;
    reasons.push({
      label: effectiveSize === 'STARTUP' ? '창업 7년 이내' : '기업 규모 적합',
      type: 'positive',
    });
  }

  // 과제 규모 매칭 (10점)
  if (profile.rndBudget && profile.rndBudget === program.budgetRange) {
    score += 10;
    reasons.push({ label: '과제 규모 일치', type: 'positive' });
  }

  // 지역 매칭 (10점) - 지역 제한 없는 사업은 가산 없음
  if (
    profile.region &&
    program.targetRegions &&
    program.targetRegions.includes(profile.region)
  ) {
    score += 10;
    reasons.push({ label: '지역 특화 대상', type: 'positive' });
  } else if (!program.targetRegions) {
    score += 5; // 전국 대상은 기본 점수
  }

  // 키워드 매칭 (최대 20점) - 교집합 1개당 5점
  if (profile.techKeywords?.length) {
    const matched = profile.techKeywords.filter((k) =>
      program.keywords.some((pk) => pk.includes(k) || k.includes(pk)),
    );
    const kwScore = Math.min(20, matched.length * 5);
    if (kwScore > 0) {
      score += kwScore;
      reasons.push({
        label: `키워드 ${matched.length}건 일치`,
        type: 'positive',
      });
    }
  }

  // 기수혜 감점 (5점)
  if (profile.hasPriorAward === true) {
    score = Math.max(0, score - 5);
    reasons.push({ label: '기수혜 이력 -5점', type: 'negative' });
  }

  return {
    program,
    score: Math.min(100, Math.round(score)),
    reasons,
  };
};

export const findMatchingPrograms = (
  profile: CompanyProfile,
  options: { minScore?: number; limit?: number } = {},
): ProgramMatch[] => {
  const { minScore = 40, limit = 10 } = options;

  return TIPA_MOCK_PROGRAMS.map((p) => computeMatchScore(profile, p))
    .filter((m) => m.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const scoreTier = (score: number): 'strong' | 'good' | 'weak' => {
  if (score >= 75) return 'strong';
  if (score >= 55) return 'good';
  return 'weak';
};
