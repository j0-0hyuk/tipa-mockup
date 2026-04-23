import styled from '@emotion/styled';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #FFFFFF;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const StyledHeader = styled.div`
  padding: 40px 60px 24px;
  border-bottom: 1px solid #F1F2F5;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
`;

export const StyledHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StyledPageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #25262C;
  margin: 0;
`;

export const StyledPageDesc = styled.p`
  font-size: 15px;
  color: #6E7687;
  margin: 0;
  line-height: 1.6;
  letter-spacing: -0.02em;
`;

export const StyledCompletenessCard = styled.div`
  min-width: 260px;
  padding: 18px 22px;
  background: linear-gradient(135deg, #F4F8FF 0%, #F8FAFF 100%);
  border: 1px solid #DCE8FF;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow:
    0 20px 40px -20px rgba(44, 129, 252, 0.25),
    0 1px 2px rgba(44, 129, 252, 0.05);
`;

export const StyledRing = styled.div<{ $percent: number }>`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: conic-gradient(
    #2C81FC 0deg,
    #7F5EFF ${(p) => p.$percent * 3.6}deg,
    #E6ECF5 ${(p) => p.$percent * 3.6}deg
  );
  position: relative;
  flex-shrink: 0;
  box-shadow:
    0 0 0 4px rgba(44, 129, 252, 0.06),
    0 8px 24px -6px rgba(44, 129, 252, 0.35);

  &::after {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: 50%;
    background: #FFFFFF;
  }
`;

export const StyledRingLabel = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  font-size: 18px;
  font-weight: 800;
  background: linear-gradient(135deg, #2C81FC 0%, #7F5EFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
`;

export const StyledCompletenessText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StyledCompletenessTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #596070;
  letter-spacing: -0.02em;
`;

export const StyledCompletenessHint = styled.span`
  font-size: 12px;
  color: #6E7687;
  line-height: 1.5;
`;

export const StyledTabRow = styled.div`
  display: flex;
  gap: 4px;
  padding: 0 60px;
  border-bottom: 1px solid #F1F2F5;
  background: #FFFFFF;
`;

export const StyledTab = styled.button<{ $active: boolean }>`
  border: none;
  background: none;
  padding: 14px 18px;
  font-size: 14px;
  font-weight: ${(p) => (p.$active ? 600 : 500)};
  color: ${(p) => (p.$active ? '#2C81FC' : '#6E7687')};
  cursor: pointer;
  position: relative;
  letter-spacing: -0.02em;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 12px;
    right: 12px;
    height: 2px;
    background: ${(p) => (p.$active ? '#2C81FC' : 'transparent')};
    transition: background 0.15s;
  }
`;

export const StyledContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 32px 60px 120px;
`;

export const StyledSection = styled.section``;

export const StyledSectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #25262C;
  margin: 0 0 6px 0;
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StyledSectionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #2C81FC 0%, #7F5EFF 100%);
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0;
  box-shadow: 0 6px 16px -6px rgba(44, 129, 252, 0.5);
`;

export const StyledSectionDesc = styled.p`
  font-size: 13px;
  color: #6E7687;
  margin: 0 0 24px 0;
  letter-spacing: -0.02em;
`;

export const StyledFieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 24px;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledField = styled.div<{ $full?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  ${(p) => (p.$full ? 'grid-column: 1 / -1;' : '')}
`;

export const StyledLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #25262C;
  letter-spacing: -0.02em;
`;

export const StyledRequired = styled.span`
  color: #F04452;
  margin-left: 3px;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #D8DCE5;
  border-radius: 8px;
  outline: none;
  background: #FFFFFF;
  color: #25262C;
  transition: border-color 0.15s;

  &:focus {
    border-color: #2C81FC;
  }

  &::placeholder {
    color: #B5B9C4;
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #D8DCE5;
  border-radius: 8px;
  outline: none;
  background: #FFFFFF;
  color: #25262C;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' stroke='%236E7687' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;

  &:focus {
    border-color: #2C81FC;
  }
`;

export const StyledChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StyledChip = styled.button<{ $active: boolean }>`
  border: 1px solid ${(p) => (p.$active ? '#2C81FC' : '#D8DCE5')};
  background: ${(p) => (p.$active ? '#EEF4FF' : '#FFFFFF')};
  color: ${(p) => (p.$active ? '#1E5BB8' : '#596070')};
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: ${(p) => (p.$active ? 600 : 500)};
  cursor: pointer;
  letter-spacing: -0.02em;
  transition: all 0.15s;

  &:hover {
    border-color: #2C81FC;
  }
`;

export const StyledKeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

export const StyledKeywordTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px 4px 12px;
  background: #EEF4FF;
  color: #1E5BB8;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
`;

export const StyledKeywordRemove = styled.button`
  border: none;
  background: none;
  color: #1E5BB8;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

export const StyledToggleRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid #D8DCE5;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: #25262C;
`;

export const StyledFooter = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 60px;
  background: #FFFFFF;
  border-top: 1px solid #F1F2F5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const StyledFooterHint = styled.div`
  font-size: 13px;
  color: #6E7687;
  letter-spacing: -0.02em;
`;

/* ── 매칭 결과 카드 ── */

export const StyledMatchesSection = styled.section`
  margin-top: 24px;
`;

export const StyledMatchesHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 16px;
`;

export const StyledMatchesTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #25262C;
  margin: 0;
  letter-spacing: -0.02em;
`;

export const StyledMatchesSub = styled.p`
  font-size: 13px;
  color: #6E7687;
  margin: 4px 0 0 0;
`;

export const StyledMatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledMatchCard = styled.div<{ $tier: 'strong' | 'good' | 'weak'; $top?: boolean }>`
  position: relative;
  border: 1px solid
    ${(p) =>
      p.$tier === 'strong'
        ? '#C7DBFF'
        : p.$tier === 'good'
          ? '#E6ECF5'
          : '#F1F2F5'};
  background: ${(p) =>
    p.$tier === 'strong'
      ? 'linear-gradient(180deg, #F6F9FF 0%, #FFFFFF 40%)'
      : '#FFFFFF'};
  border-radius: 16px;
  padding: 22px 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow:
    ${(p) =>
      p.$tier === 'strong'
        ? '0 12px 32px -16px rgba(44, 129, 252, 0.25), 0 1px 2px rgba(15, 23, 42, 0.04)'
        : '0 6px 20px -12px rgba(15, 23, 42, 0.12), 0 1px 2px rgba(15, 23, 42, 0.03)'};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: ${(p) =>
      p.$tier === 'strong'
        ? 'linear-gradient(90deg, #2C81FC 0%, #7F5EFF 100%)'
        : p.$tier === 'good'
          ? 'linear-gradient(90deg, #30C7B5 0%, #2C81FC 100%)'
          : 'linear-gradient(90deg, #C2C7D0 0%, #9CA3B0 100%)'};
    opacity: ${(p) => (p.$tier === 'weak' ? 0.5 : 1)};
  }

  ${(p) =>
    p.$top
      ? `
    box-shadow:
      0 0 0 2px rgba(44, 129, 252, 0.35),
      0 24px 48px -20px rgba(44, 129, 252, 0.45),
      0 2px 4px rgba(44, 129, 252, 0.08);
  `
      : ''}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px -20px rgba(44, 129, 252, 0.35), 0 2px 4px rgba(44, 129, 252, 0.08);
  }
`;

export const StyledTopBadge = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  color: #FFFFFF;
  background: linear-gradient(135deg, #2C81FC 0%, #7F5EFF 100%);
  border-radius: 999px;
  letter-spacing: -0.02em;
  box-shadow: 0 6px 14px -6px rgba(44, 129, 252, 0.6);
  z-index: 1;
`;

export const StyledMatchCardHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const StyledMatchTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #25262C;
  margin: 0;
  line-height: 1.45;
  letter-spacing: -0.02em;
`;

export const StyledMatchScore = styled.div<{ $tier: 'strong' | 'good' | 'weak' }>`
  flex-shrink: 0;
  text-align: right;
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  ${(p) =>
    p.$tier === 'strong'
      ? `
    background: linear-gradient(135deg, #2C81FC 0%, #7F5EFF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `
      : p.$tier === 'good'
        ? `color: #2C81FC;`
        : `color: #6E7687;`}
`;

export const StyledMatchMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: #6E7687;
`;

export const StyledMatchMetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const StyledMatchDesc = styled.p`
  font-size: 13px;
  color: #596070;
  margin: 0;
  line-height: 1.6;
  letter-spacing: -0.02em;
`;

export const StyledReasonList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const StyledReasonChip = styled.span<{ $type?: 'positive' | 'neutral' | 'negative' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: ${(p) =>
    p.$type === 'negative' ? '#FEECEE' : '#EEF4FF'};
  color: ${(p) =>
    p.$type === 'negative' ? '#C2323D' : '#1E5BB8'};
  font-size: 12px;
  font-weight: 500;
  border-radius: 999px;
  letter-spacing: -0.02em;
`;

export const StyledMatchCardFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
  margin-top: auto;
`;

export const StyledEmptyMatches = styled.div`
  padding: 48px 32px;
  border: 1px dashed #D8DCE5;
  border-radius: 12px;
  text-align: center;
  color: #6E7687;
  font-size: 14px;
  line-height: 1.6;
`;

export const StyledNoticeBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  margin: 0 0 16px 0;
  background: #F8FAFF;
  border: 1px solid #DCE8FF;
  border-radius: 10px;
  font-size: 13px;
  color: #1E5BB8;
  line-height: 1.55;
  letter-spacing: -0.02em;
`;

export const StyledNoticeIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #2C81FC;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const StyledTagBadge = styled.span<{ $kind: 'NEW' | 'HOT' | 'DEADLINE_SOON' }>`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  background: ${(p) =>
    p.$kind === 'HOT'
      ? '#FFE7EB'
      : p.$kind === 'NEW'
        ? '#E6F7EA'
        : '#FFF4DC'};
  color: ${(p) =>
    p.$kind === 'HOT'
      ? '#D93A4A'
      : p.$kind === 'NEW'
        ? '#1F8A4C'
        : '#8E5A00'};
`;
