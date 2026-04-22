import styled from '@emotion/styled';

export const PopoverWrapper = styled.div`
  position: relative;
  display: inline-block;

  /* active 클래스가 붙으면 내부 Content를 보여줌 */
  &.active .popover-content {
    display: flex;
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  /* bottom 클래스가 있는 경우 transform 조정 */
  &.active .popover-content.bottom {
    transform: translateY(0);
  }
`;

export const StyledTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px 6px 12px;
  margin-left: 8px;
  ${({ theme }) => theme.typo.Rg_13}
  background-color: ${({ theme }) => theme.color.bgBlueGray};
  color: ${({ theme }) => theme.color.bgDarkGray};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  &:hover {
    background-color: ${({ theme }) => theme.color.bgGray};
  }
`;

// 내용을 담을 팝오버 (absolute)
export const StyledPopoverContent = styled.div`
  position: absolute;
  left: 0;
  z-index: 100;
  width: 300px;
  display: none;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition:
    opacity 0.2s,
    transform 0.2s,
    visibility 0.2s;
  background-color: white;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  box-shadow: 0 10px 20px -15px rgba(22, 23, 24, 0.2);
  flex-direction: column;
  break-inside: avoid;

  top: 100%;
  margin-top: 8px;

  &.bottom {
    top: auto;
    bottom: 100%;
    margin-top: 0;
    margin-bottom: 8px;
    transform: translateY(8px);
  }
`;

export const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  gap: 182px;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
  background-color: ${({ theme }) => theme.color.bgGray};
  border-radius: 10px 10px 0 0;
`;

export const StyledHeaderTitle = styled.h3`
  ${({ theme }) => theme.typo.Md_13}
  color: ${({ theme }) => theme.color.bgDarkGray};
  margin: 0;
`;

export const StyledCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: fit-content;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  color: ${({ theme }) => theme.color.textGray};
  transition: all 0.2s;
  padding: 0;
  &:hover {
    background-color: ${({ theme }) => theme.color.bgGray};
    color: ${({ theme }) => theme.color.textGray};
  }
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const StyledContentList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const StyledSourceCard = styled.a<{ isLast: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 12px;
  background-color: ${({ theme }) => theme.color.white};
  border-bottom: ${({ isLast, theme }) =>
    isLast ? 'none' : `1px solid ${theme.color.borderGray}`};
  border-radius: ${({ isLast }) => (isLast ? '0 0 10px 10px' : '0')};
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  gap: 8px;
  &:hover {
    background-color: ${({ theme }) => theme.color.bgGray};
  }
`;

export const StyledSourceTitle = styled.div`
  ${({ theme }) => theme.typo.Rg_12}
  color: ${({ theme }) => theme.color.black};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  width: 286px;
`;

export const StyledSourceDescription = styled.div`
  width: 286px;
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.black};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const StyledFavicon = styled.img`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  object-fit: contain;
`;
