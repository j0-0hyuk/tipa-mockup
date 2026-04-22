import { Megaphone, ArrowRight } from 'lucide-react';
import {
  StyledTopNoticeBar,
  StyledTopNoticeInner,
  StyledTopNoticeTitle,
  StyledTopNoticeBadge,
  StyledTopNoticeButton,
} from './styles';

export function TopNoticeBar() {
  return (
    <StyledTopNoticeBar>
      <StyledTopNoticeInner>
        <StyledTopNoticeTitle>
          <Megaphone size={18} strokeWidth={2} />
          <StyledTopNoticeBadge>공지</StyledTopNoticeBadge>
          2026년 중소기업 기술개발 지원사업 통합 공고
        </StyledTopNoticeTitle>
        <StyledTopNoticeButton type="button">
          통합 공고 바로가기
          <ArrowRight size={14} />
        </StyledTopNoticeButton>
      </StyledTopNoticeInner>
    </StyledTopNoticeBar>
  );
}
