import styled from '@emotion/styled';

export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

export const PageDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
`;

export const FormContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
`;

export const FormSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

export const FileInputWrapper = styled.div`
  position: relative;
`;

export const FileInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }

  input[type='file'] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;

export const FileName = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #6b7280;
  padding: 8px 12px;
  background-color: #f9fafb;
  border-radius: 4px;
`;

export const ErrorMessage = styled.span`
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: #dc2626;
`;

export const HelpText = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 8px 0 0 0;
  line-height: 1.4;
`;

export const TableContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9fafb;
  }
`;

export const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  white-space: nowrap;
`;

export const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
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
  padding: 16px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
`;

export const PageEllipsis = styled.span`
  padding: 8px 4px;
  font-size: 14px;
  color: #6b7280;
  user-select: none;
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${(props) => (props.$active ? '#3b82f6' : '#d1d5db')};
  background-color: ${(props) => (props.$active ? '#3b82f6' : '#ffffff')};
  color: ${(props) => (props.$active ? '#ffffff' : '#374151')};
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$active ? '#2563eb' : '#f3f4f6')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DeleteButton = styled.button`
  padding: 6px 12px;
  background-color: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #dc2626;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  background-color: #ffffff;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  background-color: #ffffff;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const LinkCell = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-size: 13px;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
`;

export const TruncatedText = styled.span`
  display: block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  color: #4b5563;
`;

export const WarningMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 8px;
  padding: 12px;
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 6px;
  font-size: 13px;
  color: #92400e;
  line-height: 1.4;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
`;

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #6b7280;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
`;

export const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
`;

export const CancelButton = styled.button`
  padding: 10px 16px;
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
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

export const SubmitButton = styled.button`
  padding: 10px 16px;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

