import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import {
  Flex,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  DocshuntLogo
} from '@docs-front/ui';
import { Input } from '@docs-front/ui';
import { postSendAuthCode, postPasswordReset } from '@/api/auth';
import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCountdown } from 'usehooks-ts';
import { StyledTimer } from '@/routes/_intro/-sign-up.style';
import { formatTime } from '@/utils/formatTime';
import {
  passwordResetRequestFormSchema,
  type PasswordResetRequestForm
} from '@/schema/api/auth/passwordReset';
import { errorToResult } from '@/utils/error';
import { getProductsQueryOptions } from '@/query/options/products';
import { useI18n } from '@/hooks/useI18n.ts';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { useAuth } from '@/service/auth/hook';

export const Route = createFileRoute('/_intro/password-reset')({
  component: PasswordResetPage,
  beforeLoad: async ({ context }) => {
    if (context.auth.isLogined) {
      const products = await context.queryClient.fetchQuery(
        getProductsQueryOptions()
      );
      if (products.length === 0) {
        throw redirect({ to: '/select-onboarding' });
      }
      throw redirect({
        to: '/c/$productId',
        params: { productId: products[0].id.toString() }
      });
    }
  }
});

function PasswordResetPage() {
  const { sm } = useBreakPoints();
  const form = useForm<PasswordResetRequestForm>({
    resolver: zodResolver(passwordResetRequestFormSchema),
    defaultValues: {
      email: '',
      authCode: '',
      password: '',
      passwordConfirm: ''
    }
  });

  const { t } = useI18n(['auth', 'common']);

  const [verified, setVerified] = useState<boolean | null>(null);

  const postSendAuthCodeMutation = useMutation({
    mutationFn: postSendAuthCode,
    onSuccess: () => {
      form.setFocus('authCode');
      form.setError('authCode', {
        message: t('auth:signUp.form.authCode.sentMessage')
      });
      resetCountdown();
      startCountdown();
      setVerified(false);
    },
    onError: async (error) => {
      const { message } = await errorToResult(error);
      form.setError('email', {
        message
      });
    }
  });

  const navigate = useNavigate({ from: '/' });
  const queryClient = useQueryClient();
  const { signIn } = useAuth();

  const passwordResetMutation = useMutation({
    mutationFn: postPasswordReset,
    onSuccess: async () => {
      try {
        await signIn({
          email: form.getValues('email'),
          password: form.getValues('password')
        });

        const products = await queryClient.fetchQuery(
          getProductsQueryOptions()
        );
        if (products.length === 0) {
          navigate({ to: '/select-onboarding' });
        } else {
          navigate({
            to: '/c/$productId',
            params: { productId: products[0].id.toString() }
          });
        }
      } catch (e) {
        console.error(e);
        navigate({ to: '/' });
      }
    },
    onError: async (error) => {
      console.log('Password reset failed:', error);
      const { message } = await errorToResult(error);
      form.setError('email', {
        message
      });
    }
  });

  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 5 * 60,
    countStop: 0
  });

  const formattedCount = useMemo(() => formatTime(count), [count]);

  const handleSubmit = useCallback(
    (data: PasswordResetRequestForm) => {
      passwordResetMutation.mutate({
        email: data.email,
        code: data.authCode,
        newPassword: data.password
      });
    },
    [passwordResetMutation]
  );

  return (
    <Flex
      height={'100vh'}
      alignItems="center"
      justify="center"
      direction="column"
      width={sm ? '100%' : '400px'}
      padding={sm ? '0 16px' : '0'}
      gap={40}
    >
      <DocshuntLogo width={160} />
      <Form onSubmit={handleSubmit} form={form}>
        <Flex direction="column" gap={24} width="100%">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem required>
                <FormLabel>{t('auth:signUp.form.email.label')}</FormLabel>
                <Flex gap={8}>
                  <Flex flex={1}>
                    <FormControl
                      onChange={() => {
                        setVerified(null);
                      }}
                    >
                      <Input
                        disabled={postSendAuthCodeMutation.isPending}
                        width="100%"
                        placeholder={t('auth:signUp.form.email.placeholder')}
                        height={48}
                        {...field}
                      />
                    </FormControl>
                  </Flex>
                  <Button
                    variant="outlined"
                    size="large"
                    type="button"
                    disabled={postSendAuthCodeMutation.isPending}
                    onClick={() => {
                      form.clearErrors('email');
                      postSendAuthCodeMutation.mutate({
                        email: form.getValues('email'),
                        purpose: 'RESET_PASSWORD'
                      });
                    }}
                  >
                    {t('auth:signUp.form.authCode.send')}
                  </Button>
                </Flex>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="authCode"
            render={({ field }) => (
              <FormItem required>
                <FormLabel>{t('auth:signUp.form.authCode.label')}</FormLabel>
                <FormControl>
                  <Input
                    width="100%"
                    placeholder={t('auth:signUp.form.authCode.placeholder')}
                    height={48}
                    {...field}
                  >
                    {verified === false && (
                      <StyledTimer>{formattedCount}</StyledTimer>
                    )}
                  </Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem required>
                <FormLabel>{t('auth:signUp.form.password.label')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    width="100%"
                    placeholder={t('auth:signUp.form.password.placeholder')}
                    height={48}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem required>
                <FormLabel>
                  {t('auth:signUp.form.passwordConfirm.label')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    width="100%"
                    placeholder={t(
                      'auth:signUp.form.passwordConfirm.placeholder'
                    )}
                    height={48}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Flex>
        <Button
          type="submit"
          width="100%"
          variant="filled"
          size="large"
          disabled={passwordResetMutation.isPending}
        >
          {passwordResetMutation.isPending
            ? t('auth:passwordReset.form.submitting')
            : t('auth:passwordReset.form.submit')}
        </Button>
      </Form>
    </Flex>
  );
}
