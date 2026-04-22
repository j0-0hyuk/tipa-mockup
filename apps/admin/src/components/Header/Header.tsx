import { Flex, Button } from '@bichon/ds';
import { useAuthContext } from '@/hooks/useAuth';
import { HeaderContainer, HeaderTitle, UserEmail } from '@/components/Header/Header.style';

export function Header() {
  const { signOut, currentUser } = useAuthContext();

  const handleSignOut = () => {
    void signOut();
  };

  return (
    <HeaderContainer
      justify="space-between"
      alignItems="center"
      padding="16px 24px"
    >
      <Flex alignItems="center" gap={16}>
        <HeaderTitle>Docshunt Admin</HeaderTitle>
      </Flex>

      <Flex alignItems="center" gap={16}>
        {currentUser && <UserEmail>{currentUser.email}</UserEmail>}
        <Button variant="outlined" size="medium" onClick={handleSignOut}>
          로그아웃
        </Button>
      </Flex>
    </HeaderContainer>
  );
}
