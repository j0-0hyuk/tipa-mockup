import styled from '@emotion/styled';

export const StyledFileNameText = styled.div<{ sm?: boolean }>`
  flex: 1;
  min-width: 0;
  ${({ sm }) => (sm ? 'width: 180px' : 'width: 100%')}
  white-space: nowrap
  line-clamp: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  color: ${({ theme }) => theme.color.black};
  text-overflow: ellipsis;
  ${({ theme }) => theme.typo.Md_14}
`;

export const StyledHistoryItemPopoverContent = styled.div`
  display: inline-flex;
  padding: 4px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  background: ${({ theme }) => theme.color.white};
  box-shadow: 0px 4px 12px 0px rgba(0, 27, 55, 0.15);
  z-index: 1000;
`;

export const StyledHistoryItemWrapper = styled.div<{
  status: 'COMPLETED' | 'PROGRESS' | 'FAILED' | 'PENDING';
}>`
  width: 100%;
  padding: 12px;
  flex-direction: column;
  display: flex;
  gap: 12px;
  flex: 1;
  border-radius: 6px;
  background: ${({ status, theme }) =>
    status === 'COMPLETED'
      ? 'transparent'
      : status === 'PROGRESS'
        ? theme.color.bgMain
        : '#FFEBEB'};
  cursor: pointer;
`;

export const StyledHistoryItemProgress = styled.div`
  color: ${({ theme }) => theme.color.main};

  ${({ theme }) => theme.typo.Md_12}
`;

export const StyledHistoryItemFailed = styled.div`
  color: #e74a47;
  ${({ theme }) => theme.typo.Md_12}
`;
