// import secureLocalStorage from 'react-secure-storage';
// import {
//   postGoogleSignIn,
//   postEmailSignIn,
//   postSignUp,
//   postSignOut
// } from '@/api/auth';
// import type { EmailSignInRequestParams } from '@/schema/api/auth/emailSignIn';
// import type { SignUpRequestParams } from '@/schema/api/auth/signUp';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import type { GoogleSignInRequestParams } from '@/schema/api/auth/googleSignIn';

// const getStoredToken = (key: string) => {
//   const value = secureLocalStorage.getItem(key);
//   return typeof value === 'string' ? value : null;
// };

// // Never Used In Route Component Directly
// export const useAuth = () => {
//   const [accessToken, setAccessTokenState] = useState<string | null>(() => {
//     return getStoredToken('accessToken');
//   });

//   const setAccessToken = useCallback(
//     (token: string) => {
//       secureLocalStorage.setItem('accessToken', token);
//       setAccessTokenState(token);
//     },
//     [setAccessTokenState]
//   );

//   const removeAccessToken = useCallback(() => {
//     secureLocalStorage.removeItem('accessToken');
//     setAccessTokenState(null);
//   }, [setAccessTokenState]);

//   const setRefreshToken = useCallback((token: string) => {
//     secureLocalStorage.setItem('refreshToken', token);
//   }, []);

//   const removeRefreshToken = useCallback(() => {
//     secureLocalStorage.removeItem('refreshToken');
//   }, []);

//   const isLogined = useRef(!!getStoredToken('accessToken'));

//   useEffect(() => {
//     isLogined.current = !!accessToken;

//     return () => {
//       isLogined.current = !!getStoredToken('accessToken');
//     };
//   }, [accessToken]);

//   const googleLogin = async (params: GoogleSignInRequestParams) => {
//     const { accessToken, refreshToken } = await postGoogleSignIn(params);
//     isLogined.current = true;
//     setAccessToken(accessToken);
//     setRefreshToken(refreshToken);
//   };

//   const emailLogin = async (params: EmailSignInRequestParams) => {
//     const { accessToken, refreshToken } = await postEmailSignIn(params);
//     isLogined.current = true;
//     setAccessToken(accessToken);
//     setRefreshToken(refreshToken);
//   };

//   const signOut = async () => {
//     try {
//       await postSignOut();
//     } catch (error) {
//       console.error('Signout API failed:', error);
//     } finally {
//       isLogined.current = false;
//       removeAccessToken();
//       removeRefreshToken();
//       window.location.href = '/';
//     }
//   };

//   const signUp = async (params: SignUpRequestParams) => {
//     const { accessToken, refreshToken } = await postSignUp(params);
//     isLogined.current = true;
//     setAccessToken(accessToken);
//     setRefreshToken(refreshToken);
//   };

//   return {
//     isLogined,
//     emailLogin,
//     googleLogin,
//     signOut,
//     signUp
//   };
// };

// export type AuthContext = ReturnType<typeof useAuth>;
