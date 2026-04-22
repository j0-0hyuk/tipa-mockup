import TagManager from 'react-gtm-module';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import {
  Flex,
  Button,
  Checkbox,
  Divider,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  DocshuntLogo
} from '@docs-front/ui';
import { Input } from '@docs-front/ui';
import { postCheckAuthCode, postSendAuthCode } from '@/api/auth';
import { postTerms } from '@/api/terms';
import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  PostTermsRequestParams,
  TermsCode
} from '@/schema/api/terms/terms';
import { useCountdown } from 'usehooks-ts';
import { StyledTimer } from '@/routes/_intro/-sign-up.style';
import { formatTime } from '@/utils/formatTime';
import {
  createSignUpRequestFormSchema,
  type SignUpRequestForm
} from '@/schema/api/auth/signUp';
import { checkboxInfos } from '@/schema/terms';
import { errorToResult } from '@/utils/error';
import { ChevronLeft } from 'lucide-react';
import styled from '@emotion/styled';
import { useI18n } from '@/hooks/useI18n';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { useAuth } from '@/service/auth/hook';
import { useAtomos } from '@/service/atomos/hook';

const StyledTermsItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: 12px;
  width: 100%;
  height: 28px;
`;

const StyledTermsText = styled.span`
  flex-grow: 1;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  letter-spacing: -0.02em;
  color: #1a1a1c;
`;

const StyledChevronIcon = styled.div`
  width: 14px;
  height: 14px;
  cursor: pointer;
  color: #b5b9c4;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(180deg);

  &:hover {
    color: #1a1a1c;
  }
`;

export const Route = createFileRoute('/_intro/sign-up')({
  component: SignUpPage
});

function SignUpPage() {
  const { sm } = useBreakPoints();
  const { t } = useI18n(['auth', 'common']);
  const atomos = useAtomos();
  const form = useForm<SignUpRequestForm>({
    resolver: zodResolver(createSignUpRequestFormSchema()),
    defaultValues: {
      email: '',
      authCode: '',
      password: '',
      passwordConfirm: '',
      terms: {
        all: false,
        term: false,
        personal: false,
        marketing: false
      }
    }
  });

  const [verified, setVerified] = useState<boolean | null>(null);

  // TODO 에러있는 부분 찾아서 서버 에러가 아닌 자체 핸들링하기
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

  const postCheckAuthCodeMutation = useMutation({
    mutationFn: postCheckAuthCode,
    onSuccess: () => {
      setVerified(true);
      form.clearErrors('email');
    },
    onError: async (error) => {
      const { message } = await errorToResult(error);
      form.setError('authCode', {
        message
      });
    }
  });

  const navigate = useNavigate({ from: '/' });
  const queryClient = useQueryClient();
  const { signUp } = useAuth();

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpRequestForm) => {
      const authResult = await signUp(data);

      const termsCodeMap: Record<string, TermsCode> = {
        term: 'SERVICE_TERMS',
        personal: 'PRIVACY_POLICY',
        marketing: 'MARKETING_CONSENT'
      };

      const termsData: PostTermsRequestParams = {
        termsAgreements: Object.entries(data.terms)
          .filter(([key]) => key !== 'all')
          .map(([key, agreed]) => ({
            termsCode: termsCodeMap[key],
            agreed: Boolean(agreed)
          }))
      };

      await postTerms(termsData);

      await queryClient.invalidateQueries(getAccountMeQueryOptions());

      return authResult;
    },
    onSuccess: async () => {
      atomos.track({ type: 'REGISTER' });
      if (import.meta.env.VITE_ENVIRONMENT === 'prod') {
        TagManager.dataLayer({ dataLayer: { event: 'sign_up', method: 'email' } });
      }
      navigate({ to: '/' });
    },
    onError: async (error) => {
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
    (data: SignUpRequestForm) => {
      signUpMutation.mutate(data);
    },
    [signUpMutation]
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
                        email: form.getValues('email')
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
                <Flex gap={8}>
                  <Flex flex={1}>
                    <FormControl>
                      <Input
                        disabled={verified === true}
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
                  </Flex>

                  <Button
                    variant="outlined"
                    size="large"
                    type="button"
                    disabled={
                      verified === true || postCheckAuthCodeMutation.isPending
                    }
                    onClick={() => {
                      form.clearErrors('authCode');
                      postCheckAuthCodeMutation.mutate({
                        email: form.getValues('email'),
                        code: form.getValues('authCode')
                      });
                    }}
                  >
                    {t('auth:signUp.form.authCode.verify')}
                  </Button>
                </Flex>
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
        <Flex direction="column" gap={20} width="100%">
          <FormField
            control={form.control}
            name="terms.all"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <Checkbox
                  id="all"
                  onCheckedChange={(checked) => {
                    checkboxInfos.forEach((checkboxInfo) =>
                      form.setValue(
                        `terms.${checkboxInfo.name}`,
                        typeof checked === 'string' ? false : checked
                      )
                    );
                    onChange(checked);
                  }}
                  checked={value}
                >
                  {t('common:terms.allAgree')}
                </Checkbox>
                <FormMessage />
              </FormItem>
            )}
          />
          <Divider />
          {checkboxInfos.map((checkboxInfo) => (
            <FormField
              key={checkboxInfo.name}
              control={form.control}
              name={`terms.${checkboxInfo.name}`}
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormControl>
                    <StyledTermsItem>
                      <Checkbox
                        id={checkboxInfo.name}
                        onCheckedChange={(checked) => {
                          form.setValue(
                            'terms.all',
                            checkboxInfos.every(
                              (c) =>
                                c.name === checkboxInfo.name || // this checkbox
                                form.getValues(`terms.${c.name}`) === true // checked
                            ) && (typeof checked === 'string' ? false : checked) // and check this checkbox
                          );
                          onChange(checked);
                        }}
                        checked={value}
                      />
                      <StyledTermsText>
                        {t(`common:terms.${checkboxInfo.name}`)}
                      </StyledTermsText>
                      <StyledChevronIcon
                        onClick={() => window.open(checkboxInfo.url, '_blank')}
                      >
                        <ChevronLeft />
                      </StyledChevronIcon>
                    </StyledTermsItem>
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </Flex>
        <Button variant="filled" size="large" width="100%" type="submit">
          {t('auth:signUp.form.submit')}
        </Button>
      </Form>
    </Flex>
  );
}
