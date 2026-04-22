import { FileEdit, FileText, Bot, Info, Bell, FlaskConical } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  StyledQuickSection,
  StyledQuickHeader,
  StyledQuickAccent,
  StyledQuickTitle,
  StyledQuickGrid,
  StyledQuickCard,
  StyledQuickIconWrap,
  StyledQuickLabel,
  StyledNewBadge,
} from './styles';

interface QuickServicesProps {
  onAiStart: () => void;
}

interface QuickItem {
  key: string;
  label: string;
  Icon: LucideIcon;
  isNew?: boolean;
  onClick?: () => void;
}

export function QuickServices({ onAiStart }: QuickServicesProps) {
  const items: QuickItem[] = [
    { key: 'apply', label: '과제신청', Icon: FileEdit },
    { key: 'rnd', label: 'R&D 사업공고', Icon: FileText },
    { key: 'rse', label: 'RSE-GPT', Icon: Bot },
    { key: 'intro', label: '사업소개', Icon: Info },
    { key: 'notice', label: '정책 및 공지', Icon: Bell },
    { key: 'ai', label: 'AI 초안 작성', Icon: FlaskConical, isNew: true, onClick: onAiStart },
  ];

  return (
    <StyledQuickSection>
      <StyledQuickHeader>
        <StyledQuickAccent />
        <StyledQuickTitle>즐겨찾는 서비스</StyledQuickTitle>
      </StyledQuickHeader>
      <StyledQuickGrid>
        {items.map(({ key, label, Icon, isNew, onClick }) => (
          <StyledQuickCard key={key} onClick={onClick} type="button" $highlighted={isNew}>
            {isNew && <StyledNewBadge>NEW</StyledNewBadge>}
            <StyledQuickIconWrap $highlighted={isNew}>
              <Icon size={26} strokeWidth={1.8} />
            </StyledQuickIconWrap>
            <StyledQuickLabel>{label}</StyledQuickLabel>
          </StyledQuickCard>
        ))}
      </StyledQuickGrid>
    </StyledQuickSection>
  );
}
