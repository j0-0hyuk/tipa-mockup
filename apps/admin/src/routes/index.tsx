import { createFileRoute, Navigate, useRouteContext } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent
});

function RouteComponent() {
  const { authentication } = useRouteContext({ from: '/' });
  const { isLogined } = authentication;

  return <Navigate replace to={isLogined.current ? '/main' : '/login'} />;
}