import styled from '@emotion/styled';

export const StyledDraftTitle = styled.h3`
  margin: 0;
  padding: 7.5px 12px;
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.textGray};
  border-bottom: 1px solid ${({ theme }) => theme.color.borderLightGray};
`;
