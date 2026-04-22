import styled from '@emotion/styled';

export const StyledEventHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
`;

export const StyledEventPeriod = styled.span`
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.textGray};
`;

export const StyledSection = styled.section<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? '100%' : '880px')};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledSectionTitle = styled.h2`
  ${({ theme }) => theme.typo.Md_15}
  color: ${({ theme }) => theme.color.black};
  margin: 0;
`;

export const StyledCard = styled.div`
  background: ${({ theme }) => theme.color.white};
  border: 1.5px solid ${({ theme }) => theme.color.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StyledLinkContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-direction: ${({ $isMobile }) => ($isMobile ? 'column' : 'row')};
`;

export const StyledLinkInput = styled.div`
  flex: 1;
  width: 100%;
  padding: 12px 16px;
  background: ${({ theme }) => theme.color.bgGray};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.black};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: all;
`;

export const StyledProgressBarContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StyledProgressBar = styled.div`
  flex: 1;
  height: 12px;
  background: ${({ theme }) => theme.color.bgMediumGray};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
`;

export const StyledProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => Math.min($percent, 100)}%;
  background: ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: width 0.3s ease;
`;

export const StyledProgressText = styled.span`
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.black};
  white-space: nowrap;
`;

export const StyledRewardItem = styled.div<{ $achieved: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ $achieved, theme }) =>
    $achieved ? theme.color.bgMain : theme.color.bgGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const StyledRewardIcon = styled.div<{ $achieved: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $achieved, theme }) =>
    $achieved ? theme.color.main : theme.color.bgMediumGray};
  color: ${({ $achieved, theme }) =>
    $achieved ? theme.color.white : theme.color.textGray};
  ${({ theme }) => theme.typo.Md_14}
`;

export const StyledRewardText = styled.span<{ $achieved: boolean }>`
  ${({ theme }) => theme.typo.Md_15}
  color: ${({ $achieved, theme }) =>
    $achieved ? theme.color.main : theme.color.black};
  flex: 1;
`;

export const StyledInfoCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StyledInfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledInfoGroupTitle = styled.h3`
  ${({ theme }) => theme.typo.Sb_16}
  color: ${({ theme }) => theme.color.black};
  margin: 0;
`;

export const StyledInfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textGray};
`;

export const StyledEventEndedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 24px;
  text-align: center;
`;

export const StyledEventEndedTitle = styled.h2`
  ${({ theme }) => theme.typo.Sb_24}
  color: ${({ theme }) => theme.color.textGray};
  margin: 0;
`;

export const StyledEventEndedDescription = styled.p`
  ${({ theme }) => theme.typo.Rg_15}
  color: ${({ theme }) => theme.color.textGray};
  margin: 0;
`;
