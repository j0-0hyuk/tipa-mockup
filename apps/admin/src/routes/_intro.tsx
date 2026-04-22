import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Flex } from '@bichon/ds';

/** _intro 디렉토리 파일 라우트 생성 */
export const Route = createFileRoute('/_intro')({
  component: IntroLayout
});

function IntroLayout() {
  return (
    <Flex
      height="100vh"
      direction="column"
      justify="center"
      alignItems="center"
      style={{ margin: '0 auto' }}
    >
      <Outlet />
    </Flex>
  );
}
