import styled from '@emotion/styled';
import { colors } from '@bichon/ds';

export const StyledDialogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StyledDescription = styled.p`
  ${({ theme }) => theme.typo.Rg_15}
  color: ${({ theme }) => theme.color.textSecondary};
`;

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

export const StyledFieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StyledFieldRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
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
  height: 40px;
  padding: 0 12px;
  border: 1px solid ${colors.lineDefault};
  border-radius: 8px;
  background: ${colors.bgWhite};
  font-size: 14px;
  line-height: 21px;
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

export const StyledDivider = styled.div`
  width: 0;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  &::after {
    content: '';
    display: block;
    width: 1px;
    height: 16px;
    background: ${colors.lineDefault};
  }
`;

export const StyledHorizontalDivider = styled.hr`
  border: none;
  border-top: 1px solid ${colors.lineDefault};
  margin: 0;
  width: 100%;
`;

export const StyledPreviewBox = styled.div`
  border: 1px solid ${colors.lineDefault};
  border-radius: 8px;
  background: ${colors.bgWhite};
  padding: 8px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
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

export const StyledFooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;
