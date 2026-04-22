import styled from '@emotion/styled';

export const StyledFormatToolbar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 8px;
  min-height: 44px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.color.white};
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
  flex-shrink: 0;
`;

export const StyledToolbarDivider = styled.div`
  width: 1px;
  height: 20px;
  background: ${({ theme }) => theme.color.borderGray};
  flex-shrink: 0;
`;

export const StyledStyleTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: 6px;
  background: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.black};
  ${({ theme }) => theme.typo.Rg_13}
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.color.textPlaceholder};
  }

  &:hover {
    border-color: ${({ theme }) => theme.color.textPlaceholder};
  }
`;
