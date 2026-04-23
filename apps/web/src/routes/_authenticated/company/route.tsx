import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, Button, useToast } from '@docs-front/ui';
import {
  AlertTriangle,
  Building2,
  Calendar,
  HelpCircle,
  Landmark,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet,
  X,
} from 'lucide-react';
import {
  BUDGET_OPTIONS,
  EMPLOYEE_SIZE_OPTIONS,
  EMPTY_PROFILE,
  INDUSTRY_OPTIONS,
  MINISTRY_OPTIONS,
  REGION_OPTIONS,
  REVENUE_OPTIONS,
  TRL_OPTIONS,
  type CompanyProfile,
} from '@/constants/companyProfile.constant';
import {
  ELIGIBILITY_ANSWER_OPTIONS,
  TIPA_ELIGIBILITY_CHECKS,
  computeEligibilitySummary,
  deriveAutoEligibility,
  mergeEligibilityAnswers,
  type EligibilityAnswer,
} from '@/constants/tipaEligibilityChecks.constant';
import {
  SPECIAL_CLAUSE_ANSWER_OPTIONS,
  computeSpecialClauseSummary,
  resolveSpecialClauses,
  type SpecialClauseId,
  type SpecialClauseAnswer,
} from '@/constants/tipaSpecialClauses.constant';
import type { TipaProgram } from '@/constants/tipaMockPrograms.constant';
import { useCompanyProfile } from '@/service/company/profileStore';
import { computeCompleteness } from '@/service/company/profileCompleteness';
import { findMatchingPrograms, scoreTier } from '@/service/company/matchScore';
import {
  StyledChip,
  StyledChipGroup,
  StyledCompletenessCard,
  StyledCompletenessHint,
  StyledCompletenessText,
  StyledCompletenessTitle,
  StyledContainer,
  StyledContent,
  StyledEligibilityAutoReason,
  StyledEligibilityBadge,
  StyledEligibilityCard,
  StyledEligibilityCardTop,
  StyledEligibilityDrillDown,
  StyledEligibilityDrillDownItem,
  StyledEligibilityDrillDownList,
  StyledEligibilityDrillDownTitle,
  StyledEligibilityHint,
  StyledEligibilityIndex,
  StyledEligibilityList,
  StyledEligibilityNoMeaning,
  StyledEligibilityOption,
  StyledEligibilityOptions,
  StyledEligibilityQuestion,
  StyledEligibilitySummaryBar,
  StyledEligibilitySummaryMeta,
  StyledEligibilitySummaryText,
  StyledEmptyMatches,
  StyledField,
  StyledFieldGrid,
  StyledFooter,
  StyledFooterHint,
  StyledHeader,
  StyledHeaderLeft,
  StyledInput,
  StyledKeywordList,
  StyledKeywordRemove,
  StyledKeywordTag,
  StyledLabel,
  StyledMatchCard,
  StyledMatchCardFoot,
  StyledMatchCardHead,
  StyledMatchDesc,
  StyledMatchGrid,
  StyledMatchMeta,
  StyledMatchMetaItem,
  StyledMatchScore,
  StyledMatchTitle,
  StyledMatchesHeader,
  StyledMatchesSection,
  StyledMatchesSub,
  StyledMatchesTitle,
  StyledNoticeBanner,
  StyledNoticeIcon,
  StyledPageDesc,
  StyledPageTitle,
  StyledReasonChip,
  StyledReasonList,
  StyledRequired,
  StyledRing,
  StyledRingLabel,
  StyledSection,
  StyledSectionBadge,
  StyledSectionDesc,
  StyledSectionTitle,
  StyledSelect,
  StyledTagBadge,
  StyledToggleRow,
} from '@/routes/_authenticated/company/-components/styles';
import {
  StyledBtnFilled,
  StyledBtnOutlined,
  StyledModalBox,
  StyledModalClose,
  StyledModalDesc,
  StyledModalFooter,
  StyledModalHeader,
  StyledModalOverlay,
  StyledModalTitle,
} from '@/routes/_authenticated/start/-route.style';
import styled from '@emotion/styled';

const StyledSectionStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const StyledFieldHint = styled.div`
  font-size: 12px;
  color: #6e7687;
  line-height: 1.5;
  letter-spacing: -0.02em;
`;

const StyledEligibilityBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const StyledCheckProgramTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: -0.03em;
  color: #25262c;
  margin-bottom: 10px;
`;

const StyledCheckQuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledCheckQuestionCard = styled.div`
  border: 1px solid #e6ecf5;
  border-radius: 14px;
  padding: 16px 18px;
  background: #ffffff;
`;

const StyledCheckQuestion = styled.div`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.02em;
  color: #25262c;
`;

const StyledCheckHint = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #6e7687;
  line-height: 1.55;
  letter-spacing: -0.02em;
`;

const StyledCheckOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
`;

const StyledCheckOption = styled.button<{
  $active: boolean;
  $value: 'confirmed' | 'needs_review' | 'not_applicable';
}>`
  min-width: 104px;
  height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid
    ${(p) =>
      p.$active
        ? p.$value === 'confirmed'
          ? '#2c81fc'
          : p.$value === 'needs_review'
            ? '#f59e0b'
            : '#bcc7d6'
        : '#e3e4e8'};
  background: ${(p) =>
    p.$active
      ? p.$value === 'confirmed'
        ? '#eef4ff'
        : p.$value === 'needs_review'
          ? '#fff7e8'
          : '#f4f7fb'
      : '#ffffff'};
  color: ${(p) =>
    p.$active
      ? p.$value === 'confirmed'
        ? '#1e5bb8'
        : p.$value === 'needs_review'
          ? '#a16207'
          : '#344054'
      : '#6e7687'};
  font-size: 13px;
  font-weight: ${(p) => (p.$active ? 700 : 600)};
  letter-spacing: -0.02em;
  cursor: pointer;
  box-shadow: ${(p) =>
    p.$active
      ? p.$value === 'confirmed'
        ? '0 0 0 2px rgba(44,129,252,0.16)'
        : p.$value === 'needs_review'
          ? '0 0 0 2px rgba(245,158,11,0.18)'
          : '0 0 0 2px rgba(148,163,184,0.14)'
      : 'none'};
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: ${(p) =>
      p.$value === 'confirmed'
        ? '#2c81fc'
        : p.$value === 'needs_review'
          ? '#f59e0b'
          : '#a8b6c8'};
    background: ${(p) =>
      p.$value === 'confirmed'
        ? '#f6f9ff'
        : p.$value === 'needs_review'
          ? '#fffaf0'
          : '#eef2f7'};
  }
`;

const StyledCheckFooterNote = styled.div<{ $tone?: 'warning' | 'neutral' }>`
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 10px;
  background: ${(p) => (p.$tone === 'neutral' ? '#f5f7fb' : '#fff7e8')};
  border: 1px solid
    ${(p) => (p.$tone === 'neutral' ? '#d7deea' : '#fde3a7')};
  color: ${(p) => (p.$tone === 'neutral' ? '#596070' : '#9a6700')};
  font-size: 13px;
  line-height: 1.55;
  letter-spacing: -0.02em;
`;

const StyledPreviewMetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const StyledPreviewMetaCard = styled.div`
  padding: 14px 16px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e6ecf5;
`;

const StyledPreviewMetaLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #6e7687;
  letter-spacing: -0.02em;
`;

const StyledPreviewMetaValue = styled.div`
  margin-top: 6px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.02em;
  color: #25262c;
`;

const StyledPreviewSection = styled.div`
  margin-top: 18px;
`;

const StyledPreviewSectionTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #25262c;
  letter-spacing: -0.02em;
`;

const StyledPreviewSectionBody = styled.div`
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.65;
  letter-spacing: -0.02em;
  color: #596070;
`;

const StyledPreviewPillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const StyledPreviewPill = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: #f1f5fb;
  border: 1px solid #d9e3f3;
  color: #1e5bb8;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const StyledPreviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
`;

const StyledPreviewListItem = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e6ecf5;
  font-size: 13px;
  line-height: 1.6;
  letter-spacing: -0.02em;
  color: #596070;
`;


export const Route = createFileRoute('/_authenticated/company')({
  component: CompanyPage,
});

// 가입한 사용자(김민수)의 대표 기업 데모 프로필 — 발표용 프리필
const KIMMINSU_DEMO_PROFILE: CompanyProfile = {
  companyName: '(주)케이엠솔루션',
  bizRegNo: '123-45-67890',
  ceoName: '김민수',
  foundedYear: 2022,
  region: 'SEOUL',
  industry: 'IT_SW',
  employeeSize: '10_49',
  revenue: '1E_10E',
  trl: 'TRL_6_7',
  rndBudget: '1E_3E',
  hasPriorAward: false,
  techKeywords: ['AI', '플랫폼', 'SaaS'],
  eligibility: {},
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${m}월 ${day}일`;
};

const daysUntil = (iso: string) => {
  const target = new Date(iso).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
};

const COMPANY_SIZE_LABELS: Record<
  'STARTUP' | 'SMALL' | 'MID' | 'MID_LARGE',
  string
> = {
  STARTUP: '창업기업',
  SMALL: '소기업',
  MID: '중기업',
  MID_LARGE: '중견기업',
};

interface PendingProgramCheck {
  id: string;
  title: string;
  specialClauseIds: SpecialClauseId[];
}

function CompanyPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { profile: savedProfile, update } = useCompanyProfile();

  const [draft, setDraft] = useState<CompanyProfile>(() => {
    const hasSaved = !!savedProfile.updatedAt;
    return hasSaved
      ? { ...EMPTY_PROFILE, ...savedProfile }
      : { ...KIMMINSU_DEMO_PROFILE };
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [showMatches, setShowMatches] = useState(() => !!savedProfile.updatedAt);
  const [pendingProgramCheck, setPendingProgramCheck] =
    useState<PendingProgramCheck | null>(null);
  const [previewProgram, setPreviewProgram] = useState<TipaProgram | null>(null);
  const [specialClauseAnswers, setSpecialClauseAnswers] = useState<
    Record<string, SpecialClauseAnswer | undefined>
  >({});

  useEffect(() => {
    window.ChannelIO?.('hideChannelButton');
    return () => {
      window.ChannelIO?.('showChannelButton');
    };
  }, []);

  useEffect(() => {
    setDraft((prev) => {
      if (prev.updatedAt) return prev;
      if (savedProfile.updatedAt) return { ...EMPTY_PROFILE, ...savedProfile };
      return { ...KIMMINSU_DEMO_PROFILE };
    });
  }, [savedProfile]);

  useEffect(() => {
    setShowMatches(!!savedProfile.updatedAt);
  }, [savedProfile.updatedAt]);

  const completeness = useMemo(() => computeCompleteness(draft), [draft]);
  const derivedEligibility = useMemo(
    () =>
      deriveAutoEligibility({
        employeeSize: draft.employeeSize,
        revenue: draft.revenue,
        hasPriorAward: draft.hasPriorAward,
        foundedYear: draft.foundedYear,
      }),
    [draft.employeeSize, draft.revenue, draft.hasPriorAward, draft.foundedYear],
  );
  const effectiveEligibility = useMemo(
    () => mergeEligibilityAnswers(draft.eligibility, derivedEligibility),
    [draft.eligibility, derivedEligibility],
  );
  const specialClauseContext = useMemo(
    () => ({
      profile: {
        foundedYear: draft.foundedYear,
        hasPriorAward: draft.hasPriorAward,
      },
      effectiveEligibility,
    }),
    [draft.foundedYear, draft.hasPriorAward, effectiveEligibility],
  );
  const effectiveDerivedKeys = useMemo(() => {
    // 사용자가 답변하지 않았고 derived에만 있는 키 = 실제 자동 적용된 키
    return new Set(
      Object.keys(derivedEligibility).filter(
        (id) => !draft.eligibility?.[id],
      ),
    );
  }, [derivedEligibility, draft.eligibility]);
  const eligibilitySummary = useMemo(
    () => computeEligibilitySummary(effectiveEligibility, effectiveDerivedKeys),
    [effectiveEligibility, effectiveDerivedKeys],
  );
  const matches = useMemo(
    () => (showMatches ? findMatchingPrograms(draft, { minScore: 35, limit: 6 }) : []),
    [draft, showMatches],
  );
  const activeSpecialClauses = useMemo(
    () =>
      resolveSpecialClauses(
        pendingProgramCheck?.specialClauseIds,
        specialClauseContext,
      ),
    [pendingProgramCheck, specialClauseContext],
  );
  const specialClauseSummary = useMemo(
    () =>
      computeSpecialClauseSummary(
        activeSpecialClauses,
        specialClauseAnswers as Record<string, SpecialClauseAnswer | undefined>,
      ),
    [activeSpecialClauses, specialClauseAnswers],
  );
  const previewSpecialClauses = useMemo(
    () =>
      resolveSpecialClauses(
        previewProgram?.specialClauses,
        specialClauseContext,
      ),
    [previewProgram, specialClauseContext],
  );
  const isSpecialClauseComplete =
    activeSpecialClauses.length > 0 &&
    specialClauseSummary.answered === activeSpecialClauses.length;

  const patch = useCallback((p: Partial<CompanyProfile>) => {
    setDraft((prev) => ({ ...prev, ...p }));
  }, []);

  const addKeyword = useCallback(() => {
    const kw = keywordInput.trim();
    if (!kw) return;
    setDraft((prev) => {
      const list = prev.techKeywords ?? [];
      if (list.includes(kw) || list.length >= 6) return prev;
      return { ...prev, techKeywords: [...list, kw] };
    });
    setKeywordInput('');
  }, [keywordInput]);

  const removeKeyword = useCallback((kw: string) => {
    setDraft((prev) => ({
      ...prev,
      techKeywords: (prev.techKeywords ?? []).filter((k) => k !== kw),
    }));
  }, []);

  const setEligibilityAnswer = useCallback(
    (id: string, answer: EligibilityAnswer) => {
      setDraft((prev) => ({
        ...prev,
        eligibility: { ...(prev.eligibility ?? {}), [id]: answer },
        eligibilityUpdatedAt: new Date().toISOString(),
      }));
    },
    [],
  );

  const handleSave = useCallback(() => {
    update(draft);
    setShowMatches(true);
    setTimeout(() => {
      document
        .getElementById('matches-section')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, [draft, update]);

  const startRndDraft = useCallback(
    (
      programTitle?: string,
      options?: { answeredCount?: number; needsReviewCount?: number },
    ) => {
      if (programTitle) {
        toast.open({
          content:
            options?.answeredCount && options.answeredCount > 0
              ? `"${programTitle}" 초안을 시작해요${options.needsReviewCount ? ` (검토 ${options.needsReviewCount}건)` : ''}`
              : `"${programTitle}" 초안을 시작해요`,
          duration: 2000,
        });
      }
      navigate({
        to: '/start2',
        search: programTitle ? { programTitle } : {},
      });
    },
    [navigate, toast],
  );

  const closeProgramCheckModal = useCallback(() => {
    setPendingProgramCheck(null);
    setSpecialClauseAnswers({});
  }, []);

  const closePreviewModal = useCallback(() => {
    setPreviewProgram(null);
  }, []);

  const handleSpecialClauseAnswer = useCallback(
    (clauseId: string, answer: SpecialClauseAnswer) => {
      setSpecialClauseAnswers((prev) => ({ ...prev, [clauseId]: answer }));
    },
    [],
  );

  const handleStartRnd = useCallback(
    (program: PendingProgramCheck) => {
      const applicableClauses = resolveSpecialClauses(
        program.specialClauseIds,
        specialClauseContext,
      );

      if (applicableClauses.length === 0) {
        startRndDraft(program.title);
        return;
      }

      setPendingProgramCheck(program);
      setSpecialClauseAnswers({});
    },
    [specialClauseContext, startRndDraft],
  );

  const handleConfirmProgramCheck = useCallback(() => {
    if (!pendingProgramCheck) return;

    const title = pendingProgramCheck.title;
    const answeredCount = specialClauseSummary.answered;
    const reviewCount =
      specialClauseSummary.notReady + specialClauseSummary.notApplicableCount;

    closeProgramCheckModal();
    startRndDraft(title, {
      answeredCount,
      needsReviewCount: reviewCount,
    });
  }, [
    closeProgramCheckModal,
    pendingProgramCheck,
    specialClauseSummary,
    startRndDraft,
  ]);

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledHeaderLeft>
          <StyledPageTitle>기업정보 및 공고추천</StyledPageTitle>
          <StyledPageDesc>
            회사 정보를 입력하면 맞는 R&D 공고를 추천해드려요. 정보가 많을수록 정확해져요.
          </StyledPageDesc>
        </StyledHeaderLeft>

        <StyledCompletenessCard>
          <StyledRing $percent={completeness}>
            <StyledRingLabel>{completeness}%</StyledRingLabel>
          </StyledRing>
          <StyledCompletenessText>
            <StyledCompletenessTitle>프로필 완성도</StyledCompletenessTitle>
            <StyledCompletenessHint>
              {completeness >= 80
                ? '추천 정확도 최상'
                : completeness >= 60
                  ? '추천 가능'
                  : '정보를 더 채워주세요'}
            </StyledCompletenessHint>
            <StyledEligibilityBadge
              $status={eligibilitySummary.status}
              style={{ marginTop: 8 }}
            >
              {eligibilitySummary.status === 'safe' ? (
                <>
                  <ShieldCheck size={12} strokeWidth={2.5} />
                  이상 없음
                </>
              ) : eligibilitySummary.status === 'needs_check' ? (
                <>
                  <HelpCircle size={12} strokeWidth={2.5} />
                  확인 필요 {eligibilitySummary.unknownCount}건
                </>
              ) : eligibilitySummary.status === 'risk' ? (
                <>
                  <AlertTriangle size={12} strokeWidth={2.5} />
                  {eligibilitySummary.blockerNoCount > 0
                    ? `불가 ${eligibilitySummary.blockerNoCount}건`
                    : `해소 ${eligibilitySummary.warningNoCount}건`}
                </>
              ) : eligibilitySummary.status === 'in_progress' ? (
                <>
                  <HelpCircle size={12} strokeWidth={2.5} />
                  {eligibilitySummary.answeredCount}/
                  {eligibilitySummary.totalCount}
                </>
              ) : (
                <>
                  <HelpCircle size={12} strokeWidth={2.5} />
                  진단 전
                </>
              )}
            </StyledEligibilityBadge>
          </StyledCompletenessText>
        </StyledCompletenessCard>
      </StyledHeader>

      <StyledContent>
        <StyledSectionStack>
          {/* ── 1. 기본정보 ── */}
          <StyledSection>
            <StyledSectionTitle>
              <StyledSectionBadge>1</StyledSectionBadge>
              기본정보
            </StyledSectionTitle>
            <StyledSectionDesc>
              창업 연차와 지역 특화 공고 매칭에 쓰여요.
            </StyledSectionDesc>
            <StyledFieldGrid>
              <StyledField>
                <StyledLabel>회사명</StyledLabel>
                <StyledInput
                  value={draft.companyName ?? ''}
                  onChange={(e) => patch({ companyName: e.target.value })}
                  placeholder="(주)케이엠솔루션"
                />
              </StyledField>
              <StyledField>
                <StyledLabel>사업자등록번호</StyledLabel>
                <StyledInput
                  value={draft.bizRegNo ?? ''}
                  onChange={(e) => patch({ bizRegNo: e.target.value })}
                  placeholder="000-00-00000"
                />
              </StyledField>
              <StyledField>
                <StyledLabel>대표자명</StyledLabel>
                <StyledInput
                  value={draft.ceoName ?? ''}
                  onChange={(e) => patch({ ceoName: e.target.value })}
                  placeholder="김민수"
                />
              </StyledField>
              <StyledField>
                <StyledLabel>
                  설립연도<StyledRequired>*</StyledRequired>
                </StyledLabel>
                <StyledInput
                  type="number"
                  inputMode="numeric"
                  value={draft.foundedYear ?? ''}
                  onChange={(e) =>
                    patch({
                      foundedYear: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  placeholder="2022"
                  min={1900}
                  max={2030}
                />
              </StyledField>
              <StyledField $full>
                <StyledLabel>본사 소재지</StyledLabel>
                <StyledChipGroup>
                  {REGION_OPTIONS.map((opt) => (
                    <StyledChip
                      key={opt.value}
                      type="button"
                      $active={draft.region === opt.value}
                      onClick={() => patch({ region: opt.value })}
                    >
                      {opt.label}
                    </StyledChip>
                  ))}
                </StyledChipGroup>
              </StyledField>
            </StyledFieldGrid>
          </StyledSection>

          {/* ── 2. 사업현황 ── */}
          <StyledSection>
            <StyledSectionTitle>
              <StyledSectionBadge>2</StyledSectionBadge>
              사업현황
            </StyledSectionTitle>
            <StyledSectionDesc>
              기업 규모·업종은 매칭 정확도에 가장 큰 영향을 줘요.
            </StyledSectionDesc>
            <StyledFieldGrid>
              <StyledField $full>
                <StyledLabel>
                  업종<StyledRequired>*</StyledRequired>
                </StyledLabel>
                <StyledChipGroup>
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <StyledChip
                      key={opt.value}
                      type="button"
                      $active={draft.industry === opt.value}
                      onClick={() => patch({ industry: opt.value })}
                    >
                      {opt.label}
                    </StyledChip>
                  ))}
                </StyledChipGroup>
              </StyledField>
              <StyledField>
                <StyledLabel>
                  종업원 수<StyledRequired>*</StyledRequired>
                </StyledLabel>
                <StyledSelect
                  value={draft.employeeSize ?? ''}
                  onChange={(e) =>
                    patch({ employeeSize: e.target.value as typeof draft.employeeSize })
                  }
                >
                  <option value="">선택하세요</option>
                  {EMPLOYEE_SIZE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </StyledSelect>
              </StyledField>
              <StyledField>
                <StyledLabel>
                  연매출<StyledRequired>*</StyledRequired>
                </StyledLabel>
                <StyledSelect
                  value={draft.revenue ?? ''}
                  onChange={(e) =>
                    patch({ revenue: e.target.value as typeof draft.revenue })
                  }
                >
                  <option value="">선택하세요</option>
                  {REVENUE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </StyledSelect>
              </StyledField>
            </StyledFieldGrid>
          </StyledSection>

          {/* ── 3. R&D 현황 ── */}
          <StyledSection>
            <StyledSectionTitle>
              <StyledSectionBadge>3</StyledSectionBadge>
              R&D 현황
            </StyledSectionTitle>
            <StyledSectionDesc>
              기술 성숙도와 키워드로 추천 정확도가 올라가요.
            </StyledSectionDesc>
            <StyledFieldGrid>
              <StyledField $full>
                <StyledLabel>
                  기술 준비 단계(TRL)<StyledRequired>*</StyledRequired>
                </StyledLabel>
                <StyledFieldHint>
                  단계에 따라 추천 공고가 달라져요.
                </StyledFieldHint>
                <StyledChipGroup>
                  {TRL_OPTIONS.map((opt) => (
                    <StyledChip
                      key={opt.value}
                      type="button"
                      $active={draft.trl === opt.value}
                      onClick={() => patch({ trl: opt.value })}
                    >
                      {opt.label}
                    </StyledChip>
                  ))}
                </StyledChipGroup>
              </StyledField>
              <StyledField>
                <StyledLabel>희망 과제 규모</StyledLabel>
                <StyledSelect
                  value={draft.rndBudget ?? ''}
                  onChange={(e) =>
                    patch({ rndBudget: e.target.value as typeof draft.rndBudget })
                  }
                >
                  <option value="">선택하세요</option>
                  {BUDGET_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </StyledSelect>
              </StyledField>
              <StyledField>
                <StyledLabel>기수혜 이력</StyledLabel>
                <StyledToggleRow>
                  <input
                    type="checkbox"
                    checked={draft.hasPriorAward ?? false}
                    onChange={(e) => patch({ hasPriorAward: e.target.checked })}
                  />
                  최근 3년 이내 정부 R&D 수혜 경험 있음
                </StyledToggleRow>
              </StyledField>
              <StyledField $full>
                <StyledLabel>기술 키워드 (최대 6개)</StyledLabel>
                <StyledInput
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addKeyword();
                    }
                  }}
                  placeholder="예: AI, 소재, 플랫폼 — 입력 후 Enter"
                />
                <StyledKeywordList>
                  {(draft.techKeywords ?? []).map((kw) => (
                    <StyledKeywordTag key={kw}>
                      {kw}
                      <StyledKeywordRemove
                        type="button"
                        onClick={() => removeKeyword(kw)}
                        aria-label={`${kw} 제거`}
                      >
                        <X size={12} />
                      </StyledKeywordRemove>
                    </StyledKeywordTag>
                  ))}
                </StyledKeywordList>
              </StyledField>
            </StyledFieldGrid>
          </StyledSection>

          {/* ── 4. 신청자격 빠른 진단 ── */}
          <StyledSection>
            <StyledSectionTitle>
              <StyledSectionBadge>4</StyledSectionBadge>
              신청자격 빠른 진단
            </StyledSectionTitle>
            <StyledSectionDesc>
              기본정보와 기업 규모는 이미 반영했어요. 여기서는 참여제한, 체납,
              중복신청 같은 예외 이슈만 확인해 주세요.
            </StyledSectionDesc>

            <StyledEligibilitySummaryBar $status={eligibilitySummary.status}>
              <div>
                <StyledEligibilitySummaryText>
                  {eligibilitySummary.status === 'safe'
                    ? '공통 신청자격 이상 없음'
                    : eligibilitySummary.status === 'needs_check'
                      ? `확인 필요 ${eligibilitySummary.unknownCount}건 — 공고 전 다시 확인해 주세요`
                    : eligibilitySummary.blockerNoCount > 0
                      ? `지원 불가 ${eligibilitySummary.blockerNoCount}건 — 신청이 어려워요`
                      : eligibilitySummary.warningNoCount > 0
                        ? `해소 필요 ${eligibilitySummary.warningNoCount}건 — 예외 조항 확인하세요`
                        : eligibilitySummary.status === 'in_progress'
                          ? `${eligibilitySummary.answeredCount}/${eligibilitySummary.totalCount} 답변 완료`
                          : '4개 항목을 확인해 주세요'}
                </StyledEligibilitySummaryText>
                <StyledEligibilitySummaryMeta>
                  {eligibilitySummary.status === 'needs_check'
                    ? '모름으로 둔 항목은 초안 작성 전에 다시 확인하는 게 좋아요'
                    : eligibilitySummary.autoCount > 0
                    ? `입력한 기업정보 기준으로 ${eligibilitySummary.autoCount}건 먼저 반영했어요. 실제와 다르면 수정해 주세요`
                    : '답변은 공고별 확인에서 재사용돼요'}
                </StyledEligibilitySummaryMeta>
              </div>
            </StyledEligibilitySummaryBar>

            <StyledEligibilityList>
              {TIPA_ELIGIBILITY_CHECKS.map((check, index) => {
                const userAnswer = draft.eligibility?.[check.id];
                const derived = derivedEligibility[check.id];
                const isAutoApplied = !userAnswer && !!derived;
                const answer = userAnswer ?? derived?.answer;
                const showDrill = answer === 'no' && !!check.drillDown;
                const showNoMeaning = answer === 'no';
                return (
                  <StyledEligibilityCard
                    key={check.id}
                    $answer={answer}
                    $severity={check.severity}
                  >
                    <StyledEligibilityCardTop>
                      <StyledEligibilityIndex>{index + 1}</StyledEligibilityIndex>
                      <StyledEligibilityBody>
                        <StyledEligibilityQuestion>
                          {check.question}
                        </StyledEligibilityQuestion>
                        <StyledEligibilityHint>{check.hint}</StyledEligibilityHint>

                        {isAutoApplied && derived && (
                          <StyledEligibilityAutoReason>
                            {derived.reason}
                          </StyledEligibilityAutoReason>
                        )}

                        <StyledEligibilityOptions>
                          {ELIGIBILITY_ANSWER_OPTIONS.map((option) => (
                            <StyledEligibilityOption
                              key={option.value}
                              type="button"
                              $active={answer === option.value}
                              $value={option.value}
                              onClick={() =>
                                setEligibilityAnswer(check.id, option.value)
                              }
                            >
                              {option.label}
                            </StyledEligibilityOption>
                          ))}
                        </StyledEligibilityOptions>
                        {showNoMeaning && (
                          <StyledEligibilityNoMeaning $severity={check.severity}>
                            {check.severity === 'blocker' ? '🚫 ' : '⚠️ '}
                            {check.noMeaning}
                          </StyledEligibilityNoMeaning>
                        )}

                        {showDrill && check.drillDown && (
                          <StyledEligibilityDrillDown>
                            <StyledEligibilityDrillDownTitle>
                              <AlertTriangle size={12} strokeWidth={2.5} />
                              {check.drillDown.title}
                            </StyledEligibilityDrillDownTitle>
                            <StyledEligibilityDrillDownList>
                              {check.drillDown.items.map((item) => (
                                <StyledEligibilityDrillDownItem key={item}>
                                  {item}
                                </StyledEligibilityDrillDownItem>
                              ))}
                            </StyledEligibilityDrillDownList>
                          </StyledEligibilityDrillDown>
                        )}
                      </StyledEligibilityBody>
                    </StyledEligibilityCardTop>
                  </StyledEligibilityCard>
                );
              })}
            </StyledEligibilityList>
          </StyledSection>

          {/* ── 매칭 결과 ── */}
          {showMatches && (
            <StyledMatchesSection id="matches-section">
              <StyledMatchesHeader>
                <div>
                  <StyledMatchesTitle>
                    {matches.length > 0
                      ? `매칭 공고 ${matches.length}건`
                      : '매칭 공고를 찾는 중입니다'}
                  </StyledMatchesTitle>
                  <StyledMatchesSub>
                    프로필 완성도 {completeness}% · 정보가 많을수록 정확해져요
                  </StyledMatchesSub>
                </div>
                <Flex alignItems="center" gap={6}>
                  <Sparkles size={16} color="#2C81FC" />
                  <span
                    style={{
                      fontSize: 13,
                      color: '#2C81FC',
                      fontWeight: 600,
                    }}
                  >
                    AI 추천
                  </span>
                </Flex>
              </StyledMatchesHeader>

              <StyledNoticeBanner>
                <StyledNoticeIcon>i</StyledNoticeIcon>
                AI 참고 추천이에요. 실제 자격·마감일·요건은 주관기관 공고에서 꼭 확인해 주세요.
              </StyledNoticeBanner>

              {matches.length === 0 ? (
                <StyledEmptyMatches>
                  매칭 조건이 부족해요. 업종·기술 성숙도·기업 규모를 채워주세요
                </StyledEmptyMatches>
              ) : (
                <StyledMatchGrid>
                  {matches.map(({ program, score, reasons }) => {
                    const tier = scoreTier(score);
                    const dday = daysUntil(program.applyDeadline);
                    const ministryLabel = MINISTRY_OPTIONS.find(
                      (m) => m.value === program.ministry,
                    )?.label;
                    return (
                      <StyledMatchCard key={program.id} $tier={tier}>
                        <StyledMatchCardHead>
                          <Flex direction="column" gap={6} style={{ flex: 1 }}>
                            <Flex alignItems="center" gap={6}>
                              {program.specialTag && (
                                <StyledTagBadge $kind={program.specialTag}>
                                  {program.specialTag === 'HOT'
                                    ? '인기'
                                    : program.specialTag === 'NEW'
                                      ? '신규'
                                      : '마감임박'}
                                </StyledTagBadge>
                              )}
                              <StyledMatchTitle>{program.title}</StyledMatchTitle>
                            </Flex>
                            <StyledMatchMeta>
                              <StyledMatchMetaItem>
                                <Landmark size={12} />
                                {ministryLabel}
                              </StyledMatchMetaItem>
                              <StyledMatchMetaItem>
                                <Building2 size={12} />
                                {program.agency}
                              </StyledMatchMetaItem>
                              <StyledMatchMetaItem>
                                <Calendar size={12} />
                                {formatDate(program.applyDeadline)} 마감 · D-{dday}
                              </StyledMatchMetaItem>
                            </StyledMatchMeta>
                          </Flex>
                          <StyledMatchScore $tier={tier}>{score}%</StyledMatchScore>
                        </StyledMatchCardHead>

                        <StyledMatchDesc>{program.description}</StyledMatchDesc>

                        {reasons.length > 0 && (
                          <StyledReasonList>
                            {reasons.map((r) => (
                              <StyledReasonChip key={r.label} $type={r.type}>
                                {r.label}
                              </StyledReasonChip>
                            ))}
                          </StyledReasonList>
                        )}

                        <StyledMatchCardFoot>
                          <Flex alignItems="center" gap={6}>
                            <Wallet size={13} color="#6E7687" />
                            <span style={{ fontSize: 12, color: '#6E7687' }}>
                              {BUDGET_OPTIONS.find((b) => b.value === program.budgetRange)?.label}
                            </span>
                          </Flex>
                          <Flex gap={6}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => setPreviewProgram(program)}
                            >
                              공고 보기
                            </Button>
                            <Button
                              variant="filled"
                              size="small"
                              onClick={() =>
                                handleStartRnd({
                                  id: program.id,
                                  title: program.title,
                                  specialClauseIds: program.specialClauses ?? [],
                                })
                              }
                            >
                              <Target size={13} style={{ marginRight: 4 }} />
                              초안 작성
                            </Button>
                          </Flex>
                        </StyledMatchCardFoot>
                      </StyledMatchCard>
                    );
                  })}
                </StyledMatchGrid>
              )}
            </StyledMatchesSection>
          )}
        </StyledSectionStack>
      </StyledContent>

      <StyledFooter>
        <StyledFooterHint>
          {draft.updatedAt
            ? `마지막 저장: ${new Date(draft.updatedAt).toLocaleString('ko-KR', {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}`
            : '입력 완료 후 공고를 추천받아보세요'}
        </StyledFooterHint>
        <Button variant="filled" size="medium" onClick={handleSave}>
          매칭하기
        </Button>
      </StyledFooter>

      {pendingProgramCheck && activeSpecialClauses.length > 0 && (
        <StyledModalOverlay onClick={closeProgramCheckModal}>
          <StyledModalBox $width={640} onClick={(e) => e.stopPropagation()}>
            <StyledModalHeader>
              <StyledModalTitle>이 공고는 추가 확인이 필요해요</StyledModalTitle>
              <StyledModalClose type="button" onClick={closeProgramCheckModal}>
                <X size={18} />
              </StyledModalClose>
            </StyledModalHeader>

            <StyledCheckProgramTitle>{pendingProgramCheck.title}</StyledCheckProgramTitle>

            <StyledModalDesc>
              기본 신청 자격은 먼저 확인했어요. 이 공고에만 적용되는 조건을 확인해
              주세요.
            </StyledModalDesc>

            <StyledCheckQuestionList>
              {activeSpecialClauses.map((clause) => {
                const answer = specialClauseAnswers[clause.id];
                return (
                  <StyledCheckQuestionCard key={clause.id}>
                    <StyledCheckQuestion>{clause.question}</StyledCheckQuestion>
                    <StyledCheckHint>{clause.hint}</StyledCheckHint>

                    <StyledCheckOptions>
                      {SPECIAL_CLAUSE_ANSWER_OPTIONS.map((option) => {
                        const mappedValue =
                          option.value === 'ready'
                            ? 'confirmed'
                            : option.value === 'not_ready'
                              ? 'needs_review'
                              : 'not_applicable';
                        return (
                        <StyledCheckOption
                          key={option.value}
                          type="button"
                          $active={answer === option.value}
                          $value={mappedValue}
                          onClick={() =>
                            handleSpecialClauseAnswer(clause.id, option.value)
                          }
                        >
                          {option.label}
                        </StyledCheckOption>
                        );
                      })}
                    </StyledCheckOptions>

                    {answer === 'not_ready' && (
                      <StyledEligibilityNoMeaning $severity={clause.severity}>
                        {clause.severity === 'blocker' ? '🚫 ' : '⚠️ '}
                        {clause.notReadyMeaning}
                      </StyledEligibilityNoMeaning>
                    )}
                  </StyledCheckQuestionCard>
                );
              })}
            </StyledCheckQuestionList>

            {specialClauseSummary.notReadyBlocker > 0 && (
              <StyledCheckFooterNote $tone="warning">
                🚫 필수 {specialClauseSummary.notReadyBlocker}건 미준비 — 신청 전 해결 필요
              </StyledCheckFooterNote>
            )}

            {specialClauseSummary.notApplicableCount > 0 && (
              <StyledCheckFooterNote $tone="neutral">
                확인이 안 된 항목 {specialClauseSummary.notApplicableCount}건 — 초안 작성은
                진행되지만, 제출 전 공고문 기준으로 다시 확인해 주세요
              </StyledCheckFooterNote>
            )}

            <StyledModalFooter>
              <StyledBtnOutlined type="button" onClick={closeProgramCheckModal}>
                닫기
              </StyledBtnOutlined>
              <StyledBtnFilled
                type="button"
                disabled={!isSpecialClauseComplete}
                onClick={handleConfirmProgramCheck}
              >
                초안 작성
              </StyledBtnFilled>
            </StyledModalFooter>
          </StyledModalBox>
        </StyledModalOverlay>
      )}

      {previewProgram && (
        <StyledModalOverlay onClick={closePreviewModal}>
          <StyledModalBox $width={720} onClick={(e) => e.stopPropagation()}>
            <StyledModalHeader>
              <StyledModalTitle>공고 미리 보기</StyledModalTitle>
              <StyledModalClose type="button" onClick={closePreviewModal}>
                <X size={18} />
              </StyledModalClose>
            </StyledModalHeader>

            <StyledCheckProgramTitle>{previewProgram.title}</StyledCheckProgramTitle>
            <StyledModalDesc>{previewProgram.description}</StyledModalDesc>

            <StyledPreviewMetaGrid>
              <StyledPreviewMetaCard>
                <StyledPreviewMetaLabel>주관 부처·기관</StyledPreviewMetaLabel>
                <StyledPreviewMetaValue>
                  {MINISTRY_OPTIONS.find((item) => item.value === previewProgram.ministry)
                    ?.label}{' '}
                  · {previewProgram.agency}
                </StyledPreviewMetaValue>
              </StyledPreviewMetaCard>
              <StyledPreviewMetaCard>
                <StyledPreviewMetaLabel>마감 일정</StyledPreviewMetaLabel>
                <StyledPreviewMetaValue>
                  {formatDate(previewProgram.applyDeadline)} 마감 · D-
                  {daysUntil(previewProgram.applyDeadline)}
                </StyledPreviewMetaValue>
              </StyledPreviewMetaCard>
              <StyledPreviewMetaCard>
                <StyledPreviewMetaLabel>정부출연금 규모</StyledPreviewMetaLabel>
                <StyledPreviewMetaValue>
                  {BUDGET_OPTIONS.find((item) => item.value === previewProgram.budgetRange)
                    ?.label}
                </StyledPreviewMetaValue>
              </StyledPreviewMetaCard>
              <StyledPreviewMetaCard>
                <StyledPreviewMetaLabel>추천 대상</StyledPreviewMetaLabel>
                <StyledPreviewMetaValue>
                  {previewProgram.targetCompanySize
                    .map((size) => COMPANY_SIZE_LABELS[size])
                    .join(' · ')}
                </StyledPreviewMetaValue>
              </StyledPreviewMetaCard>
            </StyledPreviewMetaGrid>

            <StyledPreviewSection>
              <StyledPreviewSectionTitle>기술 단계·지역 조건</StyledPreviewSectionTitle>
              <StyledPreviewSectionBody>
                이 공고는 아래 조건과 잘 맞을 때 추천 정확도가 올라가요.
              </StyledPreviewSectionBody>
              <StyledPreviewPillRow>
                {previewProgram.targetTrls.map((trl) => (
                  <StyledPreviewPill key={trl}>
                    {TRL_OPTIONS.find((item) => item.value === trl)?.label}
                  </StyledPreviewPill>
                ))}
                {(previewProgram.targetRegions ?? ['ALL']).map((region) => (
                  <StyledPreviewPill key={region}>
                    {region === 'ALL'
                      ? '전국'
                      : REGION_OPTIONS.find((item) => item.value === region)?.label}
                  </StyledPreviewPill>
                ))}
              </StyledPreviewPillRow>
            </StyledPreviewSection>

            <StyledPreviewSection>
              <StyledPreviewSectionTitle>주요 키워드</StyledPreviewSectionTitle>
              <StyledPreviewPillRow>
                {previewProgram.keywords.map((keyword) => (
                  <StyledPreviewPill key={keyword}>{keyword}</StyledPreviewPill>
                ))}
              </StyledPreviewPillRow>
            </StyledPreviewSection>

            <StyledPreviewSection>
              <StyledPreviewSectionTitle>추가 확인 포인트</StyledPreviewSectionTitle>
              <StyledPreviewList>
                {previewSpecialClauses.length > 0 ? (
                  previewSpecialClauses.map((clause) => (
                    <StyledPreviewListItem key={clause.id}>
                      <strong style={{ color: '#25262c' }}>{clause.category}</strong>
                      <div style={{ marginTop: 4 }}>{clause.hint}</div>
                    </StyledPreviewListItem>
                  ))
                ) : (
                  <StyledPreviewListItem>
                    현재 입력한 기업정보 기준으로 별도 예외 확인 항목은 없어요.
                  </StyledPreviewListItem>
                )}
              </StyledPreviewList>
            </StyledPreviewSection>

            <StyledModalFooter>
              <StyledBtnOutlined type="button" onClick={closePreviewModal}>
                닫기
              </StyledBtnOutlined>
              <StyledBtnFilled
                type="button"
                onClick={() => {
                  const current = previewProgram;
                  closePreviewModal();
                  if (!current) return;
                  handleStartRnd({
                    id: current.id,
                    title: current.title,
                    specialClauseIds: current.specialClauses ?? [],
                  });
                }}
              >
                초안 작성
              </StyledBtnFilled>
            </StyledModalFooter>
          </StyledModalBox>
        </StyledModalOverlay>
      )}
    </StyledContainer>
  );
}
