import { Paperclip, RotateCcw } from 'lucide-react';
import {
  StyledTemplatePreview,
  StyledFileInfo,
  StyledFileName
} from '@/routes/_authenticated/f/prompt/-components/TemplatePreview/TemplatePreview.style';
import { Button } from '@docs-front/ui';
import { useNavigate } from '@tanstack/react-router';

interface TemplatePreviewProps {
  fileName?: string;
}

export default function TemplatePreview({ fileName }: TemplatePreviewProps) {
  const navigate = useNavigate();
  return (
    <StyledTemplatePreview>
      <StyledFileInfo>
        <Paperclip size={18} />
        <StyledFileName>{fileName || '템플릿 파일'}</StyledFileName>
      </StyledFileInfo>
      <Button
        type="button"
        variant="outlined"
        size="medium"
        onClick={() => {
          navigate({ to: '/f/template' });
        }}
      >
        <RotateCcw size={16} />
        <span>양식 변경</span>
      </Button>
    </StyledTemplatePreview>
  );
}
