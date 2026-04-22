import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, Button, TextField } from '@bichon/ds';
import {
  emailSignInRequestFormSchema,
  type EmailSignInRequestForm
} from '@/schema/api/auth/emailSignIn';
import { useMutation } from '@tanstack/react-query';
import { GoogleLoginButton } from '@/components/GoogleLoginButton/GoogleLoginButton';

export const Route = createFileRoute('/_intro/login')({
  component: AdminLoginPage,
  beforeLoad: async ({ context }) => {
    if (context.authentication.isLogined.current) {
      throw redirect({ to: '/main' });
    }
  }
});

function AdminLoginPage() {
  const hasGoogleOAuth = Boolean(import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID);
  const form = useForm<EmailSignInRequestForm>({
    resolver: zodResolver(emailSignInRequestFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const { authentication } = Route.useRouteContext();
  const { emailLogin } = authentication;
  const navigate = useNavigate();

  const emailLoginMutation = useMutation({
    mutationFn: emailLogin,
    onSuccess: async () => {
      navigate({ to: '/main' });
    },
    onError: (error: Error) => {
      if (error.message === '관리자 권한이 필요합니다') {
        form.setError('email', {
          message: '관리자 권한이 없는 계정입니다'
        });
      } else {
        form.setError('password', {
          message: '이메일 또는 비밀번호가 올바르지 않습니다'
        });
      }
    }
  });

  const handleEmailLogin = (data: EmailSignInRequestForm) => {
    void emailLoginMutation.mutate(data);
  };

  return (
    <Flex direction="column" gap={24} width={400}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Docshunt Admin
      </h1>
      {hasGoogleOAuth && <GoogleLoginButton />}
      <form onSubmit={form.handleSubmit(handleEmailLogin)}>
        <Flex width="100%" direction="column" gap={16}>
          <TextField
            placeholder="이메일을 입력하세요"
            {...form.register('email')}
            variant={form.formState.errors.email ? 'warning' : 'default'}
            helperText={form.formState.errors.email?.message}
            showHelperText={!!form.formState.errors.email}
          />
          <TextField
            type="password"
            placeholder="비밀번호를 입력하세요"
            {...form.register('password')}
            variant={form.formState.errors.password ? 'warning' : 'default'}
            helperText={form.formState.errors.password?.message}
            showHelperText={!!form.formState.errors.password}
          />
          <Button
            type="submit"
            variant="filled"
            size="medium"
            width="100%"
            style={{ marginTop: '20px' }}
          >
            로그인
          </Button>
        </Flex>
      </form>
    </Flex>
  );
}
