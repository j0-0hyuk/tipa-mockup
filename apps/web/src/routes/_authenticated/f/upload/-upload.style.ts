import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
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

export const StyledSectionTitle = styled.h3`
  ${({ theme }) => theme.typo.Sb_18}
  color: ${colors.textPrimary};
  margin: 0;
`;

export const StyledUploadFooter = styled.footer`
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

export const StyledDropzone = styled.div<{
  $isDragOver: boolean;
  $disabled?: boolean;
}>`
  width: 100%;
  padding: 48px 0;
  border: 1px dashed ${colors.borderPrimary};
  border-radius: ${radius['2xl']};
  background-color: ${({ $isDragOver }) =>
    $isDragOver ? colors.bgAccentSubtle : 'transparent'};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    opacity: ${({ $disabled }) => ($disabled ? 0.5 : 0.8)};
  }
`;

export const StyledDropzoneMainText = styled.p`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${colors.textSecondary};
  margin: 0;
  text-align: center;
`;

export const StyledDropzoneSubText = styled.p`
  ${({ theme }) => theme.typo.Rg_13}
  color: ${colors.textTertiary};
  margin: 0;
  text-align: center;
`;

export const StyledFileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const StyledFileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: ${radius.xl};
  background-color: ${colors.bgSecondary};
  ${({ theme }) => theme.typo.Rg_14}
  color: ${colors.textPrimary};
`;

export const StyledFileName = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledFileSize = styled.span`
  ${({ theme }) => theme.typo.Rg_13}
  color: ${colors.textTertiary};
  flex-shrink: 0;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const StyledSpinningIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  animation: ${spin} 1s linear infinite;
`;

export const StyledFileIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
`;
