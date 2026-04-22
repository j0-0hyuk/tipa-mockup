import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_intro/_authenticated')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isLogined) throw redirect({ to: '/' });
  }
});
