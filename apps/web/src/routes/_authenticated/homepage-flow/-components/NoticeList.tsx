import { useState } from 'react';
import { FlaskConical, ChevronRight } from 'lucide-react';
import {
  StyledNoticeSection,
  StyledNoticeHeader,
  StyledNoticeTabs,
  StyledNoticeTab,
  StyledNoticeMeta,
  StyledNoticeMetaSep,
  StyledNoticeMetaLink,
  StyledNoticeGrid,
  StyledNoticeCard,
  StyledNoticeBadge,
  StyledNoticeTitle,
  StyledNoticeFooter,
  StyledNoticeDates,
  StyledNoticeDday,
  StyledNoticeAiLink,
} from './styles';
import { NOTICES_SMTECH } from './mockData';

interface NoticeListProps {
  onAiStart: () => void;
}

type Tab = 'smtech' | 'iris';

export function NoticeList({ onAiStart }: NoticeListProps) {
  const [tab, setTab] = useState<Tab>('smtech');
  const notices = NOTICES_SMTECH;

  return (
    <StyledNoticeSection>
      <StyledNoticeHeader>
        <StyledNoticeTabs>
          <StyledNoticeTab $active={tab === 'smtech'} onClick={() => setTab('smtech')}>
            SMTECH 사업공고 보기
          </StyledNoticeTab>
          <StyledNoticeTab $active={tab === 'iris'} onClick={() => setTab('iris')}>
            IRIS 사업공고 보기
          </StyledNoticeTab>
        </StyledNoticeTabs>
        <StyledNoticeMeta>
          <span>공고일</span>
          <StyledNoticeMetaSep />
          <span>신청기간</span>
          <StyledNoticeMetaSep />
          <StyledNoticeMetaLink>
            전체보기 <ChevronRight size={12} />
          </StyledNoticeMetaLink>
        </StyledNoticeMeta>
      </StyledNoticeHeader>

      <StyledNoticeGrid>
        {notices.map((n) => (
          <StyledNoticeCard key={n.id}>
            <StyledNoticeBadge>{n.badge}</StyledNoticeBadge>
            <StyledNoticeTitle>{n.title}</StyledNoticeTitle>
            <StyledNoticeFooter>
              <StyledNoticeDates>
                <span>등록 {n.registeredAt}</span>
                <StyledNoticeDday>D-{n.dDay}</StyledNoticeDday>
              </StyledNoticeDates>
              <StyledNoticeAiLink
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAiStart();
                }}
              >
                <FlaskConical size={12} strokeWidth={2.4} />
                AI 초안 작성
              </StyledNoticeAiLink>
            </StyledNoticeFooter>
          </StyledNoticeCard>
        ))}
      </StyledNoticeGrid>
    </StyledNoticeSection>
  );
}
