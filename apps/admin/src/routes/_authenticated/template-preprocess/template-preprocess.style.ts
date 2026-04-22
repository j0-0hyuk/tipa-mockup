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

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  background-color: #ffffff;
  resize: vertical;
  min-height: 150px;
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

export const SubmitButton = styled.button`
  padding: 12px 24px;
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

export const ResultContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
`;

export const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const ResultTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

export const DownloadButton = styled.button`
  padding: 8px 16px;
  background-color: #10b981;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #059669;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ResultContent = styled.pre`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  font-size: 13px;
  color: #374151;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 400px;
  overflow-y: auto;
`;

export const ErrorMessage = styled.div`
  padding: 12px 16px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 14px;
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const HelpText = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 8px 0 0 0;
  line-height: 1.4;
`;
