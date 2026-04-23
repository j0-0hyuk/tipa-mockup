import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, Button, useToast } from '@docs-front/ui';
import {
  Building2,
  Calendar,
  Check,
  Landmark,
  Minus,
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
  StyledTopBadge,
} from './-components/styles';
import styled from '@emotion/styled';

const StyledSectionStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
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
  const [showMatches, setShowMatches] = useState(false);

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

  const completeness = useMemo(() => computeCompleteness(draft), [draft]);
  const matches = useMemo(
    () => (showMatches ? findMatchingPrograms(draft, { minScore: 35, limit: 6 }) : []),
    [draft, showMatches],
  );

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

  const handleSave = useCallback(() => {
    update(draft);
    setShowMatches(true);
    toast.open({
      content:
        completeness >= 80
          ? '저장 완료! 일치율 높은 공고를 찾았습니다.'
          : '저장되었습니다. 더 많은 정보를 채우면 추천 정확도가 올라가요.',
      duration: 2500,
    });
    setTimeout(() => {
      document
        .getElementById('matches-section')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, [draft, update, completeness, toast]);

  const handleStartRnd = useCallback(
    (programTitle?: string) => {
      if (programTitle) {
        toast.open({
          content: `"${programTitle}" 공고로 초안 작성을 시작합니다.`,
          duration: 2000,
        });
      }
      navigate({ to: '/start2' });
    },
    [navigate, toast],
  );

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledHeaderLeft>
          <StyledPageTitle>기업정보 및 공고추천</StyledPageTitle>
          <StyledPageDesc>
            우리 회사에 맞는 R&D 지원사업을 자동으로 찾아드립니다. 정보가 많을수록 매칭 정확도가 올라갑니다.
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
                ? '매칭 정확도 최상'
                : completeness >= 60
                  ? '추천 가능'
                  : '더 입력이 필요해요'}
            </StyledCompletenessHint>
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
              지원사업 매칭의 기본 단위입니다. 창업 7년 이내 여부, 지역 특화 공고 등에 사용됩니다.
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
              기업 규모·업종은 가장 강한 매칭 신호입니다. 최대한 정확히 선택해주세요.
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
              기술 성숙도와 키워드는 매칭 정확도를 크게 높입니다.
            </StyledSectionDesc>
            <StyledFieldGrid>
              <StyledField $full>
                <StyledLabel>
                  기술 성숙도(TRL)<StyledRequired>*</StyledRequired>
                </StyledLabel>
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
                    프로필 완성도 {completeness}% · 입력이 많아질수록 정확도가 올라갑니다.
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
                본 매칭 결과는 입력하신 기업정보를 기반으로 한 AI 참고 추천입니다. 실제 신청 자격·마감일·세부 요건은 주관기관 공고를 통해 반드시 다시 확인해 주세요.
              </StyledNoticeBanner>

              {matches.length === 0 ? (
                <StyledEmptyMatches>
                  아직 매칭 조건이 부족합니다. 업종, 기술 성숙도, 기업 규모를 채우면 바로 추천이 나와요.
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
                                {r.type === 'negative' ? (
                                  <Minus size={11} strokeWidth={3} />
                                ) : (
                                  <Check size={11} strokeWidth={3} />
                                )}
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
                              onClick={() => {
                                window.open(
                                  'https://www.smtech.go.kr/region/rms',
                                  '_blank',
                                  'noopener,noreferrer',
                                );
                              }}
                            >
                              공고 확인하기
                            </Button>
                            <Button
                              variant="filled"
                              size="small"
                              onClick={() => handleStartRnd(program.title)}
                            >
                              <Target size={13} style={{ marginRight: 4 }} />
                              초안 작성하기
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
            : '입력 완료 후 아래 버튼을 눌러 공고를 추천받아보세요'}
        </StyledFooterHint>
        <Button variant="filled" size="medium" onClick={handleSave}>
          저장하고 공고 매칭
        </Button>
      </StyledFooter>
    </StyledContainer>
  );
}
