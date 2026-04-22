import { Button } from '@docs-front/ui';
import { StyledLabelText } from '@/routes/_intro/-components/GoogleLoginButton/GoogleLoginButton.style';
import { useGoogleLogin } from '@react-oauth/google';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useI18n } from '@/hooks/useI18n.ts';
import { Google } from '@docs-front/ui';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { useAuth } from '@/service/auth/hook';
import type { GoogleSignInRequestParams } from '@/schema/api/auth/googleSignIn';

export const GoogleLoginButton = () => {
  const { t, onChangeLanguageForGuest } = useI18n(['auth']);
  const navigate = useNavigate({ from: '/' });
  const { signIn } = useAuth();
  const queryClient = useQueryClient();

  const googleLoginMutation = useMutation({
    mutationFn: (params: GoogleSignInRequestParams) => signIn(params),
    onSuccess: async () => {
      const [accountData] = await Promise.all([
        queryClient.fetchQuery(getAccountMeQueryOptions())
      ]);
      const targetLanguage = accountData.language === 'en' ? 'en' : 'ko';
      await onChangeLanguageForGuest(targetLanguage);
      navigate({ to: '/', replace: true });
    }
  });

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: googleLoginMutation.mutate
  });

  return (
    <Button
      variant="outlined"
      size="large"
      width="100%"
      type="button"
      onClick={handleGoogleLogin}
    >
      <Google size={24} />
      <StyledLabelText>{t('auth:login.googleLogin')}</StyledLabelText>
    </Button>
  );
};
