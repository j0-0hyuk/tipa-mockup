import styled from '@emotion/styled';

export const SearchContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px 24px;
`;

export const SearchWrapper = styled.div`
  max-width: 400px;
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
`;

export const Tab = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 14px 24px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? '#3b82f6' : '#6b7280')};
  background-color: ${({ $active }) => ($active ? '#ffffff' : '#f9fafb')};
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? '#3b82f6' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #3b82f6;
    background-color: #ffffff;
  }
`;

export const TabCount = styled.span`
  margin-left: 6px;
  padding: 2px 6px;
  background-color: #e5e7eb;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
`;

export const StatusBadge = styled.span<{ $status?: string }>`
  display: inline-block;
  padding: 4px 8px;
  background-color: ${({ $status }) => {
    switch ($status) {
      case 'COMPLETED':
        return '#dcfce7';
      case 'FAILED':
        return '#fee2e2';
      case 'PROCESSING':
        return '#fef3c7';
      default:
        return '#f3f4f6';
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case 'COMPLETED':
        return '#15803d';
      case 'FAILED':
        return '#dc2626';
      case 'PROCESSING':
        return '#b45309';
      default:
        return '#6b7280';
    }
  }};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

export const DeadlineText = styled.span<{ $isExpired?: boolean }>`
  display: inline-block;
  font-size: 13px;
  white-space: nowrap;
  color: ${({ $isExpired }) => ($isExpired ? '#dc2626' : '#374151')};
  font-weight: ${({ $isExpired }) => ($isExpired ? 600 : 400)};
  ${({ $isExpired }) =>
    $isExpired
      ? `background-color: #fef2f2; padding: 2px 6px; border-radius: 4px;`
      : ''}
`;

export const DownloadableFileName = styled.button`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  color: #3b82f6;
  font-weight: 500;
  word-break: break-all;
  cursor: pointer;
  transition: all 0.2s;
  background: none;
  border: none;
  padding: 0;
  text-align: left;

  &:hover {
    text-decoration: underline;
    color: #2563eb;
  }
`;

export const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const ActionCellWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: none;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #9ca3af;
  font-size: 18px;
  transition: all 0.15s;

  &:hover {
    background-color: #f3f4f6;
    border-color: #e5e7eb;
    color: #374151;
  }
`;

export const ActionMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 50;
  min-width: 140px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 4px 0;
  margin-top: 4px;
`;

export const ActionMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 14px;
  font-size: 13px;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s;

  &:hover {
    background-color: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const OrderCell = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
    color: #1f2937;
  }
`;
