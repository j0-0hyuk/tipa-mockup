import {
  postGoogleSignIn,
  postEmailSignIn,
  postSignOut
} from '@/api/auth';
import { getMyAccount } from '@/api/authenticated/accounts';
import type { EmailSignInRequestParams } from '@/schema/api/auth/emailSignIn';
import { useLocalStorage } from 'usehooks-ts';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { GoogleSignInRequestParams } from '@/schema/api/auth/googleSignIn';
import type { getMyAccountResponseSchema } from '@/schema/api/accounts/accounts';
import type { z } from 'zod';

type GetMyAccountResponse = z.infer<typeof getMyAccountResponseSchema>;

// Auth Context 생성
const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({
  children,
  value
}: {
  children: React.ReactNode;
  value: AuthContext;
}) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export const useAuth = () => {
  const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<
    string | null
  >('accessToken', localStorage.getItem('accessToken') ?? null);
  const [, setRefreshToken, removeRefreshToken] = useLocalStorage<
    string | null
  >('refreshToken', localStorage.getItem('refreshToken') ?? null);
  const [currentUser, setCurrentUser] = useState<GetMyAccountResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(
    !!localStorage.getItem('accessToken')
  );
  const [isAdmin, setIsAdmin] = useState(false);

  const isLogined = useRef(!!localStorage.getItem('accessToken'));
  const initializedByLogin = useRef(false);

  useEffect(() => {
    isLogined.current = !!accessToken;

    // 로그인 함수에서 이미 사용자 정보를 가져온 경우 중복 호출 방지
    if (accessToken && initializedByLogin.current) {
      initializedByLogin.current = false;
      setIsLoading(false);
      return;
    }

    // 페이지 새로고침 등으로 토큰이 있지만 사용자 정보가 없는 경우
    if (accessToken) {
      setIsLoading(true);
      getMyAccount()
        .then((account) => {
          setCurrentUser(account);
          setIsAdmin(account.role === 'ADMIN');
        })
        .catch(() => {
          // 토큰이 유효하지 않으면 로그아웃
          isLogined.current = false;
          setIsAdmin(false);
          setCurrentUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsAdmin(false);
      setCurrentUser(null);
      setIsLoading(false);
    }

    return () => {
      isLogined.current = !!localStorage.getItem('accessToken');
    };
  }, [accessToken]);

  const googleLogin = async (params: GoogleSignInRequestParams) => {
    const { accessToken, refreshToken } = await postGoogleSignIn(params);
    initializedByLogin.current = true;
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    // 로그인 후 사용자 정보 확인
    const account = await getMyAccount();
    if (account.role !== 'ADMIN') {
      // Admin이 아니면 로그아웃 처리
      removeAccessToken();
      removeRefreshToken();
      throw new Error('관리자 권한이 필요합니다');
    }

    setCurrentUser(account);
    isLogined.current = true;
    setIsAdmin(true);
  };

  const emailLogin = async (params: EmailSignInRequestParams) => {
    const { accessToken, refreshToken } = await postEmailSignIn(params);
    initializedByLogin.current = true;
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    // 로그인 후 사용자 정보 확인
    const account = await getMyAccount();
    if (account.role !== 'ADMIN') {
      // Admin이 아니면 로그아웃 처리
      removeAccessToken();
      removeRefreshToken();
      throw new Error('관리자 권한이 필요합니다');
    }

    setCurrentUser(account);
    isLogined.current = true;
    setIsAdmin(true);
  };

  const signOut = async () => {
    await postSignOut();
    isLogined.current = false;
    setIsAdmin(false);
    setCurrentUser(null);
    removeAccessToken();
    removeRefreshToken();
    window.location.href = '/login';
  };

  return {
    isLogined,
    isAdmin,
    isLoading,
    currentUser,
    emailLogin,
    googleLogin,
    signOut
  };
};

export type AuthContext = ReturnType<typeof useAuth>;
