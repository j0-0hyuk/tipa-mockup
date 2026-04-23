import type { CompanyProfile } from '@/constants/companyProfile.constant';

const PRIMARY_WEIGHT = 14; // 5개 필수 필드 * 14 = 70점
const SECONDARY_WEIGHT = 6; // 4개 보조 필드 * 6 = 24점
const META_WEIGHT = 2; // 3개 메타 필드 * 2 = 6점

const isPresent = (v: unknown): boolean => {
  if (v === undefined || v === null || v === '') return false;
  if (Array.isArray(v) && v.length === 0) return false;
  return true;
};

export const computeCompleteness = (profile: CompanyProfile): number => {
  const primary = [
    profile.industry,
    profile.employeeSize,
    profile.revenue,
    profile.trl,
    profile.foundedYear,
  ];
  const secondary = [
    profile.region,
    profile.rndBudget,
    profile.techKeywords,
    profile.hasPriorAward !== undefined,
  ];
  const meta = [
    profile.companyName,
    profile.bizRegNo,
    profile.ceoName,
  ];

  let score = 0;
  primary.forEach((v) => {
    if (isPresent(v)) score += PRIMARY_WEIGHT;
  });
  secondary.forEach((v) => {
    if (isPresent(v)) score += SECONDARY_WEIGHT;
  });
  meta.forEach((v) => {
    if (isPresent(v)) score += META_WEIGHT;
  });

  // 메타는 3개지만 10점에 맞추려면 나머지는 round-up. 100점 캡.
  return Math.min(100, Math.round(score));
};

export const COMPLETENESS_LOW_THRESHOLD = 60;
