import { Button } from '@bichon/ds';
import { StyledLabelText } from '@/components/GoogleLoginButton/GoogleLoginButton.style';
import { useGoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useRouteContext } from '@tanstack/react-router';

const GoogleLogo = '/images/icons/google.png';

export const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { authentication } = useRouteContext({ from: '__root__' });
  const { googleLogin } = authentication;

  const googleLoginMutation = useMutation({
    mutationFn: googleLogin,
    onSuccess: async () => {
      navigate({ to: '/main' });
    }
  });

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: googleLoginMutation.mutate
  });

  return (
    <Button
      variant="outlined"
      size="medium"
      type="button"
      width="100%"
      onClick={handleGoogleLogin}
    >
      <img src={GoogleLogo} alt="Google Logo" />
      <StyledLabelText>Google로 로그인</StyledLabelText>
    </Button>
  );
};
