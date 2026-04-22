import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Flex } from '@docs-front/ui';
import { IntroHeader } from '@/routes/-components/IntroHeader/IntroHeader';
import { IntroFooter } from '@/routes/_intro/-components/IntroFooter/IntroFooter';

export const Route = createFileRoute('/_intro')({
  component: IntroLayout
});

function IntroLayout() {
  return (
    <Flex
      height="100%"
      direction="column"
      justify="space-between"
      alignItems="center"
      margin="0 auto"
    >
      <IntroHeader />
      <Outlet />
      <IntroFooter />
    </Flex>
  );
}
