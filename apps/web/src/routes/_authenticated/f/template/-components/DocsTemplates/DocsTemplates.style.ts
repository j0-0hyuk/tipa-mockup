import styled from '@emotion/styled';

export const StyledDocsTemplatesDescription = styled.div`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textGray};
`;

export const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 12px;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  background-color: ${({ theme }) => theme.color.bgLightGray};
`;

export const StyledInput = styled.input`
  width: 100%;
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.black};
  placeholder: ${({ theme }) => theme.color.textGray};
  background-color: transparent;
  padding: 0;
  border: none;
  outline: none;
`;

export const StyledUploadModalDescription = styled.p`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textGray};
  margin: 0;
`;

export const StyledRequestTemplateContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
`;

export const StyledRequestTemplateText = styled.span`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textGray};
`;

export const StyledRequestTemplateLink = styled.button`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.main};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`;
