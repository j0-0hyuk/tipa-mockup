import styled from '@emotion/styled';
import { Flex } from '@docs-front/ui';

export const StyledReferenceDropzone = styled.div<{
  isDragOver?: boolean;
  $isDashed?: boolean;
  disabled?: boolean;
}>`
  width: 100%;
  height: fit-content;
  border-radius: 8px;
  border: 1px ${({ $isDashed }) => ($isDashed === false ? 'solid' : 'dashed')}
    ${({ theme }) => theme.color.borderGray};
  background-color: ${({ theme, isDragOver }) =>
    isDragOver ? theme.color.bgGray : theme.color.white};
  cursor: ${({ onClick, disabled }) =>
    disabled ? 'not-allowed' : onClick ? 'pointer' : 'default'};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.color.bgGray};
    ${({ onClick, disabled }) =>
      disabled ? 'opacity: 0.5;' : onClick ? 'opacity: 0.8;' : ''}
  }
`;

export const StyledDropzoneContent = styled(Flex)`
  flex-direction: column;
  gap: 6px;
  align-items: center;
  padding: 23px 0;
`;

export const StyledIconWrapper = styled.div`
  color: ${({ theme }) => theme.color.black};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledMainText = styled.p`
  ${({ theme }) => theme.typo.Md_16}
  color: ${({ theme }) => theme.color.black};
  margin: 0;
  text-align: center;
`;

export const StyledFormatText = styled.p`
  ${({ theme }) => theme.typo.Rg_13}
  color: ${({ theme }) => theme.color.textGray};
  margin: 0;
  text-align: center;
  line-height: 1.5;
`;

export const StyledFileList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const StyledFileItem = styled(Flex)`
  width: 100%;
  padding: 13.5px 16px;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.color.textGray};

  button {
    margin-left: auto;
    color: ${({ theme }) => theme.color.textGray};
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.7;
    }
  }
`;

export const StyledFileName = styled.span`
  ${({ theme }) => theme.typo.Rg_15}
  color: ${({ theme }) => theme.color.black};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledAddFileButton = styled.button`
  padding: 9.5px 12px;
  background-color: ${({ theme }) => theme.color.bgMediumGray};
  color: ${({ theme }) => theme.color.bgDarkGray};
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const StyledAddFileButtonText = styled.span`
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.bgDarkGray};
`;
