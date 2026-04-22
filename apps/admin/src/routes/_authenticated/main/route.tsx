import { createFileRoute } from '@tanstack/react-router';
import { Flex } from '@bichon/ds';
import {
  PageHeader,
  PageTitle,
  PageDescription,
  DashboardGrid,
  DashboardCard,
  CardTitle,
  CardDescription
} from '@/routes/_authenticated/main/main.style';

export const Route = createFileRoute('/_authenticated/main')({
  component: MainPage
});

function MainPage() {
  return (
    <Flex direction="column" gap={24}>
      <PageHeader>
        <PageTitle>관리자 대시보드</PageTitle>
        <PageDescription>환영합니다! 관리자 페이지입니다.</PageDescription>
      </PageHeader>

      <DashboardGrid>
        <DashboardCard>
          <CardTitle>사용자 현황</CardTitle>
          <CardDescription>전체 사용자 수를 확인하세요</CardDescription>
        </DashboardCard>

        <DashboardCard>
          <CardTitle>쿠폰 관리</CardTitle>
          <CardDescription>쿠폰 발급 및 관리를 수행하세요</CardDescription>
        </DashboardCard>
      </DashboardGrid>
    </Flex>
  );
}
