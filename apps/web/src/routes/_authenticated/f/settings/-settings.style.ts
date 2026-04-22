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

export const StyledSettingsFooter = styled.footer`
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

/* ── 문서 스타일 카드 ── */

export const StyledStyleCard = styled.div`
  width: 100%;
  border: 1px solid ${colors.lineDefault};
  border-radius: ${radius['2xl']};
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StyledCardTitle = styled.h3`
  ${({ theme }) => theme.typo.Sb_18}
  color: ${colors.textPrimary};
  margin: 0;
`;

export const StyledCardDescription = styled.p`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${colors.textSecondary};
  margin: 0;
`;

/* ── 필드 영역 ── */

export const StyledFieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StyledFieldGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const StyledFieldLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: -0.24px;
  color: ${colors.textSecondary};
`;

export const StyledMenuTriggerBox = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: 1px solid ${colors.lineDefault};
  border-radius: 8px;
  background: ${colors.bgWhite};
  font-size: 13px;
  line-height: 20px;
  letter-spacing: -0.28px;
  color: ${colors.textPrimary};
  cursor: pointer;
  outline: none;
  overflow: hidden;
  text-align: left;

  & > span {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & > svg {
    flex-shrink: 0;
    margin-left: 8px;
    color: ${colors.textSecondary};
  }

  &:hover {
    border-color: ${colors.textSecondary};
  }
`;

/* ── 서식 ── */

export const StyledAttrGroup = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px;
  border: 1px solid ${colors.lineDefault};
  border-radius: 8px;
`;

export const StyledAttrButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.textPrimary};
  background: ${({ $active }) =>
    $active ? colors.bgMediumGrey : 'transparent'};
  &:hover {
    background: ${colors.bgMediumGrey};
  }
`;

/* ── 미리보기 ── */

export const StyledPreviewBox = styled.div`
  border: 1px solid ${colors.lineDefault};
  border-radius: 8px;
  background: ${colors.bgWhite};
  padding: 8px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledPreviewLine = styled.p<{ $style?: React.CSSProperties }>`
  margin: 0;
  width: 100%;
  color: ${colors.textPrimary};
  ${({ $style }) =>
    $style
      ? Object.entries($style)
          .map(
            ([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`
          )
          .join(';')
      : ''}
`;

export const StyledPreviewNotice = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin: 6px 0 0;
  font-size: 11px;
  line-height: 16px;
  color: ${colors.textTertiary};

  & > svg {
    flex-shrink: 0;
    margin-top: 1px;
  }
`;

/* ── 레이아웃 (다이얼로그 통일) ── */

export const StyledContentRow = styled.div`
  display: flex;
  gap: 40px;
  align-items: flex-start;
`;

export const StyledStyleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
`;

export const StyledStylePill = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  font-size: 14px;
  color: ${colors.textPrimary};
  background: ${({ $active }) =>
    $active ? colors.bgMediumGrey : 'transparent'};
  &:hover {
    background: ${({ $active }) =>
      $active ? colors.bgMediumGrey : colors.bgLightGrey};
  }
`;

export const StyledPropertiesPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
`;

export const StyledFieldRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const StyledHorizontalDivider = styled.hr`
  border: none;
  border-top: 1px solid ${colors.lineDefault};
  margin: 0;
  width: 100%;
`;

