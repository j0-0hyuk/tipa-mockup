import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import {
  Divider,
  DocshuntLogo,
  Flex,
  Form,
  FormField,
  FormItem,
  FormMessage,
  Input
} from '@docs-front/ui';
import { IntroHeader } from '@/routes/-components/IntroHeader/IntroHeader';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { useI18n } from '@/hooks/useI18n';
import {
  StyledForgetPassword,
  StyledSignupLink,
  StyledSignupPromptText
} from '@/routes/-index.style';
import { useCallback } from 'react';
import { getAccountMeQueryOptions } from '@/query/options/account';

import { useAuth } from '@/service/auth/hook';
import { GoogleLoginButton } from '@/routes/_intro/-components/GoogleLoginButton/GoogleLoginButton';
import { Button } from '@bichon/ds';
import {
  emailSignInRequestFormSchema,
  type EmailSignInRequestForm
} from '@/schema/api/auth/emailSignIn';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    // 프로토타입 빌드: 백엔드 없이 바로 /start 로 진입
    if (
      import.meta.env.VITE_IS_PROTOTYPE === 'true' ||
      !import.meta.env.VITE_API_URL
    ) {
      throw redirect({ to: '/start' });
    }
    if (context.auth.isLogined) {
      const account = await context.queryClient.fetchQuery(
        getAccountMeQueryOptions()
      );
      if (account.termsConsents) {
        const allRequiredTermsAgreed = account.termsConsents
          .filter((term) => term.isRequired)
          .every((term) => term.agreed);

        if (allRequiredTermsAgreed) {
          const storedRedirectTo = localStorage.getItem('redirectTo');
          localStorage.removeItem('redirectTo');

          const redirectTo =
            typeof storedRedirectTo === 'string' &&
            storedRedirectTo.trim() &&
            storedRedirectTo !== '/'
              ? storedRedirectTo
              : '/start';

          throw redirect({ to: redirectTo });
        } else {
          throw redirect({ to: '/select-onboarding' });
        }
      } else {
        throw redirect({ to: '/select-onboarding' });
      }
    }
  },
  component: RouteComponent
});

function RouteComponent() {
  const { sm } = useBreakPoints();
  const { t, onChangeLanguageForGuest } = useI18n(['main', 'auth']);
  const { signIn: emailLogin } = useAuth();
  const navigate = useNavigate();
  const form = useForm<EmailSignInRequestForm>({
    resolver: zodResolver(emailSignInRequestFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const queryClient = useQueryClient();

  const emailLoginMutation = useMutation({
    mutationFn: emailLogin,
    onSuccess: async () => {
      const [accountData] = await Promise.all([
        queryClient.fetchQuery(getAccountMeQueryOptions())
      ]);
      const targetLanguage = accountData.language === 'en' ? 'en' : 'ko';
      await onChangeLanguageForGuest(targetLanguage);
      navigate({ to: '/', replace: true });
    },
    onError: () => {
      form.setError('password', {
        message: t('auth:login.error.invalidCredentials')
      });
    }
  });
  const handleEmailLogin = useCallback(
    (data: EmailSignInRequestForm) => {
      emailLoginMutation.mutate(data);
    },
    [emailLoginMutation]
  );

  return (
    <Flex
      height={'100vh'}
      direction="column"
      justify="center"
      alignItems="center"
      margin="0 auto"
    >
      <IntroHeader />
      <Flex
        width={sm ? '100%' : '360px'}
        padding={sm ? '0 16px' : '0'}
        alignItems="center"
        justify="center"
        direction="column"
        gap="40px"
      >
        <DocshuntLogo width={160} />
        <Flex
          alignItems="center"
          width="100%"
          justify="center"
          direction="column"
          gap="24px"
        >
          <GoogleLoginButton />
          <Divider text={t('auth:login.divider')} />
          <Form form={form} onSubmit={handleEmailLogin}>
            <Flex width="100%" direction="column" alignItems="flex-end" gap={4}>
              <Flex
                direction="column"
                alignItems="flex-start"
                gap={12}
                alignSelf="stretch"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      placeholder={t('auth:login.form.email.placeholder')}
                      {...field}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        type="password"
                        placeholder={t('auth:login.form.password.placeholder')}
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Flex>
              <StyledForgetPassword to="/password-reset">
                {t('auth:login.form.findPasswordLink')}
              </StyledForgetPassword>
            </Flex>
            <Button
              variant="filled"
              size="large"
              width="100%"
              type="submit"
              disabled={emailLoginMutation.isPending}
            >
              {t('auth:login.form.submit')}
            </Button>
            <Flex gap={8} alignItems="center" justify="center">
              <StyledSignupPromptText>
                {t('auth:login.signUp.text')}
              </StyledSignupPromptText>
              <StyledSignupLink to="/sign-up">
                {t('auth:login.signUp.link')}
              </StyledSignupLink>
            </Flex>
          </Form>
        </Flex>
      </Flex>
    </Flex>
  );
}
