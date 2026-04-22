import { Search } from 'lucide-react';
import {
  StyledSiteHeader,
  StyledHeaderInner,
  StyledLogo,
  StyledNavMenu,
  StyledNavItem,
  StyledHeaderRight,
  StyledHeaderLink,
  StyledHeaderDivider,
  StyledHeaderIconBtn,
} from './styles';

const NAV_ITEMS = ['과제신청', '과제수행', '연구비정산', '연구비관리', '정보마당', '고객지원'];

export function SiteHeader() {
  return (
    <StyledSiteHeader>
      <StyledHeaderInner>
        <StyledLogo>중소벤처기업부</StyledLogo>
        <StyledNavMenu>
          {NAV_ITEMS.map((item) => (
            <StyledNavItem key={item}>{item}</StyledNavItem>
          ))}
        </StyledNavMenu>
        <StyledHeaderRight>
          <StyledHeaderLink>로그인</StyledHeaderLink>
          <StyledHeaderDivider />
          <StyledHeaderLink>회원가입</StyledHeaderLink>
          <StyledHeaderIconBtn aria-label="검색">
            <Search size={14} strokeWidth={2} />
          </StyledHeaderIconBtn>
        </StyledHeaderRight>
      </StyledHeaderInner>
    </StyledSiteHeader>
  );
}
