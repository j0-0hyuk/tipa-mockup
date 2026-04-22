import styled from '@emotion/styled';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const PageHeader = styled.div`
  margin-bottom: 0;
`;

export const PageTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: bold;
`;

export const PageDescription = styled.p`
  margin: 0;
  color: #64748b;
`;

export const PlaceholderCard = styled.div`
  padding: 24px;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const PlaceholderTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1e293b;
`;

export const PlaceholderDescription = styled.p`
  margin: 0;
  color: #64748b;
`;

export const FormContainer = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background-color: #ffffff;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #3b82f6;
`;

export const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 12px;
`;

export const HelpText = styled.small`
  color: #6b7280;
  font-size: 12px;
`;

export const CouponTypeToggle = styled.div`
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
`;

export const CouponTypeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  background-color: ${(props) => (props.$active ? '#3b82f6' : '#ffffff')};
  color: ${(props) => (props.$active ? '#ffffff' : '#374151')};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.$active ? '#2563eb' : '#f9fafb')};
  }

  &:not(:last-of-type) {
    border-right: 1px solid #d1d5db;
  }
`;

export const PageModeToggle = styled.div`
  display: flex;
  width: 100%;
  max-width: 280px;
  align-self: flex-start;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
`;

export const PageModeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px 16px;
  border: none;
  background-color: ${(props) => (props.$active ? '#1f2937' : '#ffffff')};
  color: ${(props) => (props.$active ? '#ffffff' : '#374151')};
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.$active ? '#111827' : '#f9fafb')};
  }

  &:not(:last-of-type) {
    border-right: 1px solid #d1d5db;
  }
`;

export const ManageToolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;

export const SearchRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const TableContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  overflow-x: auto;
`;

export const CouponTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1120px;
`;

export const CouponTableHead = styled.thead`
  background-color: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
`;

export const CouponTableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  white-space: nowrap;
`;

export const CouponTableBody = styled.tbody``;

export const CouponTableRow = styled.tr`
  border-bottom: 1px solid #f1f5f9;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8fafc;
  }
`;

export const CouponTableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #1f2937;
  vertical-align: middle;
  white-space: nowrap;
`;

export const CouponDescriptionText = styled.span`
  display: inline-block;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CouponTypeBadge = styled.span<{ $type: 'TOSS' | 'LOCAL' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => (props.$type === 'TOSS' ? '#dbeafe' : '#dcfce7')};
  color: ${(props) => (props.$type === 'TOSS' ? '#1d4ed8' : '#166534')};
`;

export const CouponStatusBadge = styled.span<{ $status: 'ACTIVE' | 'INACTIVE' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => (props.$status === 'ACTIVE' ? '#dcfce7' : '#fee2e2')};
  color: ${(props) => (props.$status === 'ACTIVE' ? '#166534' : '#991b1b')};
`;

export const ActionCell = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const ActionButton = styled.button`
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #ffffff;
  color: #374151;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DangerActionButton = styled(ActionButton)`
  border-color: #fca5a5;
  color: #b91c1c;

  &:hover:not(:disabled) {
    background-color: #fee2e2;
  }
`;

export const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid ${(props) => (props.$active ? '#3b82f6' : '#d1d5db')};
  border-radius: 6px;
  background-color: ${(props) => (props.$active ? '#3b82f6' : '#ffffff')};
  color: ${(props) => (props.$active ? '#ffffff' : '#374151')};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$active ? '#2563eb' : '#f3f4f6')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PaginationInfo = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  width: min(560px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 24px 36px rgba(15, 23, 42, 0.16);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: #0f172a;
`;

export const ModalCloseButton = styled.button`
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #1f2937;
  }
`;

export const ModalBody = styled.div`
  padding: 20px 24px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 24px 20px;
`;

export const ModalButton = styled.button<{ $variant?: 'primary' | 'danger' }>`
  border: 1px solid
    ${(props) => {
      if (props.$variant === 'primary') return '#2563eb';
      if (props.$variant === 'danger') return '#dc2626';
      return '#d1d5db';
    }};
  background-color:
    ${(props) => {
      if (props.$variant === 'primary') return '#2563eb';
      if (props.$variant === 'danger') return '#dc2626';
      return '#ffffff';
    }};
  color: ${(props) => (props.$variant ? '#ffffff' : '#374151')};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 14px;
  cursor: pointer;

  &:hover:not(:disabled) {
    filter: brightness(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
