import styled from '@emotion/styled';

export const StyledStatusBar = styled.div<{ $isActive?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 14.5px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
  color: ${({ theme }) => theme.color.textPlaceholder};
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

export const StyledNumber = styled.div`
  ${({ theme }) => theme.typo.Md_14}
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

export const StyledStatusTitle = styled.h2<{ $isActive?: boolean }>`
  ${({ theme }) => theme.typo.Sb_16}
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.color.black : theme.color.textPlaceholder};
  margin: 0;
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

export const StyledStatusActiveLine = styled.div`
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: ${({ theme }) => theme.color.black};
  margin: 0 16px;
`;

export const StyledStatusIndicator = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.color.bgDarkGray : theme.color.textPlaceholder};
  color: ${({ theme }) => theme.color.white};
  font-size: 12px;
  font-weight: 600;
  line-height: 1;

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
    font-size: 10px;
  }
`;
