import styled from '@emotion/styled';
import { X } from 'lucide-react';

// 모달 배경입니다.
export const StyledProductCreationModalContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.15);
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
`;

// 모달 컨테이너입니다.
export const StyledProductCreationModal = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  min-width: 400px;
  max-width: 500px;
`;

// 모달 헤더 컨테이너입니다.
export const StyledProductCreationModalHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

// 모달 헤더 텍스트입니다.
export const StyledProductCreationModalHeader = styled.h2`
  width: 411px;
  text-align: left;
  ${({ theme }) => theme.typo.Sb_24};
  color: ${({ theme }) => theme.color.black};
`;

// 모달 헤더 닫기 버튼입니다.
export const StyledProductCreationModalHeaderCloseButton = styled(X)`
  width: 24px;
  height: 24px;
  display: flex;
  color: ${({ theme }) => theme.color.textGray};
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
`;

export const StyledProductCreationModalInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
`;

export const StyledProductCreationModalHeader2 = styled.h3`
  font-weight: 400;
  font-size: 13px;
  line-height: 100%;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.bgDarkGray};
  margin: 0;
`;

export const StyledNumberKey = styled.span`
  font-weight: 400;
  font-size: 13px;
  line-height: 100%;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.main};
`;

export const StyledProductCreationModalInput = styled.input`
  padding: 14px 12px;
  width: 100%;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  background-color: ${({ theme }) => theme.color.white};
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: -0.02em;

  &::placeholder {
    color: ${({ theme }) => theme.color.textPlaceholder};
  }
`;

export const StyledProductCreationModalMethodContainer = styled.div<{
  isSelected: boolean;
}>`
  cursor: pointer;
  border: 1px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.color.main : theme.color.borderGray};
  gap: 12px;
  padding: 13px 14px;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.color.bgMain : 'transparent'};
  transition: all 0.2s ease-in-out;
`;

export const StyledProductCreationModalIcon = styled.div<{
  isSelected: boolean;
}>`
  padding: 8px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.color.bgMain : theme.color.bgBlueGray};
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.color.main : theme.color.black};
`;

export const StyledProductCreationModalMethodTitle = styled.p`
  ${({ theme }) => theme.typo.Md_15};
  color: ${({ theme }) => theme.color.bgDarkGray};
  text-align: left;
`;

export const StyledProductCreationModalMethodDes = styled.p`
  ${({ theme }) => theme.typo.Rg_12};
  color: ${({ theme }) => theme.color.bgDarkGray};
  text-align: left;
`;

export const StyledBadge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 6px;
  background: #0046ff;
  border-radius: 999px;
  height: 17px;

  span {
    font-weight: 400;
    font-size: 10px;
    line-height: 13px;
    letter-spacing: -0.02em;
    color: #ffffff;
  }
`;
