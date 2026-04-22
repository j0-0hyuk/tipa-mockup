import styled from '@emotion/styled';
import { Flex, TextArea, useToast } from '@docs-front/ui';
import { StyledPageTitle, StyledInfoBanner, StyledDropZone } from '../../-route.style';
import { Upload, FileText, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { useTheme } from '@emotion/react';

const StyledIdeaTextArea = styled(TextArea)`
  width: 100% !important;
  min-height: 220px;
  padding: 20px !important;
  border: 1px solid #EEF1F5 !important;
  border-radius: 12px !important;
  font-size: 15px !important;
  line-height: 1.7 !important;
  font-weight: 400 !important;
  letter-spacing: -0.02em !important;
  color: #25262C !important;
  background: #FBFCFE !important;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04) !important;
  resize: none !important;
  &:focus { border-color: #2C81FC !important; box-shadow: 0 0 0 2px rgba(44,129,252,0.12) !important; outline: none !important; }
  &::placeholder { color: #B5B9C4 !important; }
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid #EEF1F5;
  border-radius: 8px;
  background: #FBFCFE;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  padding: 2px;
  color: #B5B9C4;
  cursor: pointer;
  display: flex;
  &:hover { color: #EF4444; }
`;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

interface Step2InputUploadProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  hasUpload: boolean;
  onUploadChange: (val: boolean) => void;
  referenceFiles: File[];
  onReferenceFilesChange: (files: File[]) => void;
}

export function Step2InputUpload({ prompt, onPromptChange, hasUpload, onUploadChange, referenceFiles, onReferenceFilesChange }: Step2InputUploadProps) {
  const theme = useTheme();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    const combined = [...referenceFiles, ...incoming];
    if (combined.length > 3) {
      toast.open({ content: '최대 3개까지 첨부 가능합니다.', duration: 2000 });
      return;
    }
    onReferenceFilesChange(combined);
    onUploadChange(true);
  };

  const removeFile = (idx: number) => {
    const updated = referenceFiles.filter((_, i) => i !== idx);
    onReferenceFilesChange(updated);
    if (updated.length === 0) onUploadChange(false);
  };

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      <StyledPageTitle style={{ marginBottom: 24 }}>연구개발 주제와 참고 자료를 입력해주세요</StyledPageTitle>

      <StyledInfoBanner>
        <span style={{ color: '#2C81FC', flexShrink: 0, fontSize: 15 }}>&#9432;</span>
        <span style={{ fontSize: 14 }}>자유롭게 입력한 내용과 업로드한 자료를 AI가 분석하여, 다음 단계의 항목별 질문에 자동으로 반영합니다.</span>
      </StyledInfoBanner>

      {/* 자유 입력 */}
      <div style={{ fontSize: 16, fontWeight: 600, color: '#25262C', marginBottom: 10 }}>자유 입력</div>
      <StyledIdeaTextArea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder={`연구개발 주제와 관련된 내용을 자유롭게 입력해 주세요.\n\n예: 개발하려는 기술, 해결하려는 문제, 목표 성능, 팀 구성 등\n입력한 내용은 다음 단계의 항목별 질문에 AI가 자동으로 반영합니다.`}
      />

      {/* 자료 업로드 */}
      <div style={{ fontSize: 16, fontWeight: 600, color: '#25262C', marginTop: 28, marginBottom: 10 }}>참고 자료 업로드</div>
      <StyledDropZone
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        style={hasUpload ? { borderColor: theme.color.main, background: theme.color.bgMain } : undefined}
      >
        <Upload
          size={24}
          color={hasUpload ? theme.color.main : '#B5B9C4'}
          style={{ marginBottom: 8 }}
        />
        {hasUpload ? (
          <div style={{ color: theme.color.main, fontWeight: 500, fontSize: 15 }}>
            {referenceFiles.length}개 파일이 업로드되었습니다
          </div>
        ) : (
          <>
            <div style={{ fontSize: 15 }}>클릭하여 파일을 선택하거나 여기로 드래그해주세요</div>
            <div style={{ fontSize: 13, color: '#B5B9C4', marginTop: 6 }}>
              (pdf, docx, hwp, hwpx — 30MB 이내, 최대 3개)
            </div>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".hwp,.hwpx,.docx,.pdf"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </StyledDropZone>

      {referenceFiles.length > 0 && (
        <FileList>
          {referenceFiles.map((file, idx) => (
            <FileItem key={idx}>
              <FileText size={16} color="#2C81FC" />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#25262C' }}>{file.name}</span>
              <span style={{ fontSize: 13, color: '#B5B9C4' }}>{formatFileSize(file.size)}</span>
              <RemoveBtn onClick={() => removeFile(idx)}><X size={14} /></RemoveBtn>
            </FileItem>
          ))}
        </FileList>
      )}
    </div>
  );
}
