import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin-demo/organizations')({
  beforeLoad: () => {
    throw redirect({ to: '/admin-demo' });
  },
});
