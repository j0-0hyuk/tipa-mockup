import styled from '@emotion/styled';
import { colors, radius } from '@bichon/ds';

export const StyledStepHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
`;

export const StyledTemplateName = styled.p`
  ${({ theme }) => theme.typo.Md_18}
  color: ${colors.textAccent};
  margin: 0;
`;

export const StyledStepSubtitle = styled.h2`
  ${({ theme }) => theme.typo.Sb_18}
  color: ${colors.textPrimary};
  margin: 0;
`;

export const StyledInfoBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 16px 20px;
  border-radius: ${radius['2xl']};
  background-color: ${colors.bgMediumGrey};
  width: 100%;
  ${({ theme }) => theme.typo.Rg_14}
  color: ${colors.textSecondary};

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

export const StyledToggleWrapper = styled.div`
  display: flex;
  align-self: flex-start;
`;

export const StyledPromptFooter = styled.footer`
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
  padding: 16px 0;
  background-color: ${({ theme }) => theme.color.white};
  border-top: 1px solid ${({ theme }) => theme.color.borderLightGray};
  z-index: 10;
`;
