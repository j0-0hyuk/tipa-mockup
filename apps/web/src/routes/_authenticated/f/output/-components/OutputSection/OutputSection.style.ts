import styled from '@emotion/styled';
import { Flex } from '@docs-front/ui';
import isPropValid from '@emotion/is-prop-valid';

const disabledPropFilter = (prop: string) =>
  isPropValid(prop) && prop !== '$disabled';

export const StyledOutputSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.color.bgBlueGray};
  border-radius: 12px;
  justify-content: center;
  gap: 16px;
  min-height: 200px;
`;

export const StyledLoadingContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
`;

export const StyledLoadingText = styled.p`
  ${({ theme }) => theme.typo.Md_16}
  color: ${({ theme }) => theme.color.black};
  margin: 0;
  text-align: center;
`;

export const StyledLoadingDescription = styled.p`
  ${({ theme }) => theme.typo.Rg_13}
  color: ${({ theme }) => theme.color.textGray};
  margin: 0;
  text-align: center;
  white-space: pre-line;
`;

export const StyledLoadingHint = styled.p`
  ${({ theme }) => theme.typo.Md_13}
  color: ${({ theme }) => theme.color.textGray2};
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-wrap: wrap;
  gap: 4px;
`;

export const StyledFailedContent = styled.div`
  width: 100%;
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 24px 16px 20px;
  box-sizing: border-box;
`;

export const StyledFailedMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const StyledProgressWrapper = styled.div`
  width: 400px;
  display: flex;
  align-items: center;

  > div:first-of-type {
    background-color: ${({ theme }) => theme.color.bgMediumGray} !important;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const StyledCompletedContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
`;

export const StyledHwpImage = styled.img`
  width: 58px;
  height: 70px;
  object-fit: contain;
`;

export const StyledFileNameRow = styled(Flex)`
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.color.bgDarkGray};
`;

export const StyledFileName = styled('button', {
  shouldForwardProp: disabledPropFilter
})<{ $disabled?: boolean }>`
  ${({ theme }) => theme.typo.Rg_15}
  color: ${({ theme }) => theme.color.bgDarkGray};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  text-decoration: underline;
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

export const StyledDownloadButton = styled.button`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.color.bgDarkGray};
  background: ${({ theme }) => theme.color.bgMediumGray};
  ${({ theme }) => theme.typo.Md_15}
  border-radius: 6px;

  &:hover {
    opacity: 0.8;
  }
`;
