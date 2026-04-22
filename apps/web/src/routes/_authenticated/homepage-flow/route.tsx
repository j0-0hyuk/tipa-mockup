import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { StyledPageRoot } from './-components/styles';
import { TopNoticeBar } from './-components/TopNoticeBar';
import { SiteHeader } from './-components/SiteHeader';
import { QuickServices } from './-components/QuickServices';
import { NoticeList } from './-components/NoticeList';
import { CtaBanner } from './-components/CtaBanner';

export const Route = createFileRoute('/_authenticated/homepage-flow')({
  component: HomepageFlowPage,
});

function HomepageFlowPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.ChannelIO?.('hideChannelButton');
    return () => {
      window.ChannelIO?.('showChannelButton');
    };
  }, []);

  const handleAiStart = () => {
    navigate({ to: '/start' });
  };

  return (
    <StyledPageRoot>
      <TopNoticeBar />
      <SiteHeader />
      <QuickServices onAiStart={handleAiStart} />
      <NoticeList onAiStart={handleAiStart} />
      <CtaBanner onAiStart={handleAiStart} />
    </StyledPageRoot>
  );
}
