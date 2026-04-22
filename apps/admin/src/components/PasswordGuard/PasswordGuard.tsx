import { useState, useCallback, useEffect, type ReactNode } from 'react';
import {
  Overlay,
  Content,
  Header,
  Title,
  Body,
  Footer,
  FormSection,
  Label,
  HelpText,
  PasswordInput,
  ErrorMessage,
  SubmitButton,
  CancelButton
} from '@/components/PasswordGuard/PasswordGuard.style';

const USER_DATA_PASSWORD = import.meta.env.VITE_ADMIN_USER_DATA_PASSWORD || '';
const SESSION_STORAGE_KEY = 'admin_user_data_authenticated';

interface PasswordGuardProps {
  children: ReactNode;
  description?: string;
  onCancel?: () => void;
}

export function PasswordGuard({
  children,
  description = '이 페이지에 접근하려면 관리자 패스워드가 필요합니다.',
  onCancel
}: PasswordGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordSubmit = useCallback(() => {
    if (passwordInput === USER_DATA_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      setPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('패스워드가 일치하지 않습니다.');
    }
  }, [passwordInput]);

  useEffect(() => {
    if (isAuthenticated) return;

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPasswordInput('');
        setPasswordError('');
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Overlay>
      <Content
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-guard-title"
        onClick={(e) => e.stopPropagation()}
      >
        <Header>
          <Title id="password-guard-title">패스워드 인증</Title>
        </Header>
        <Body>
          <FormSection>
            <Label htmlFor="guardPassword">패스워드</Label>
            <HelpText style={{ marginBottom: '8px' }}>
              {description}
            </HelpText>
            <PasswordInput
              id="guardPassword"
              type="password"
              placeholder="패스워드를 입력하세요"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handlePasswordSubmit();
                }
              }}
              autoFocus
            />
            {passwordError && (
              <ErrorMessage>{passwordError}</ErrorMessage>
            )}
          </FormSection>
        </Body>
        <Footer>
          {onCancel && (
            <CancelButton type="button" onClick={onCancel}>
              취소
            </CancelButton>
          )}
          <SubmitButton type="button" onClick={handlePasswordSubmit}>
            확인
          </SubmitButton>
        </Footer>
      </Content>
    </Overlay>
  );
}
