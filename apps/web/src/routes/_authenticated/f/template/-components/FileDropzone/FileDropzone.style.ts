import styled from '@emotion/styled';

export const StyledFileDropzoneTitle = styled.div`
  ${({ theme }) => theme.typo.Md_15}
  color: ${({ theme }) => theme.color.black};
`;

export const StyledDropzone = styled.div<{
  isDragOver: boolean;
  disabled?: boolean;
}>`
  width: 100%;
  min-height: 240px;
  padding: 40px 24px;
  border: 1px dashed ${({ theme }) => theme.color.borderGray};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.color.white};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  ${({ isDragOver, theme }) =>
    isDragOver &&
    `
    border-color: ${theme.color.main};
    background-color: ${theme.color.bgBlueGray};
  `}

  &:hover {
    opacity: ${({ disabled }) => (disabled ? 0.5 : 0.8)};
  }
`;

export const StyledUploadIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.bgBlueGray};
  color: ${({ theme }) => theme.color.main};
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

  span {
    color: ${({ theme }) => theme.color.main};
  }
`;
