import { useTranslation } from 'react-i18next';
import type { FlatNamespace } from 'i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { updateAccount } from '@/api/accounts';
import { useAuth } from '@/service/auth/hook';

export const useI18n = (namespace: FlatNamespace | FlatNamespace[]) => {
  const { i18n, t } = useTranslation(namespace);
  const { refresh } = useAuth();

  const options = ['ko', 'en'].map((language) => {
    return {
      value: language,
      label: t(
        `common:language.${language}` as
          | 'common:language.ko'
          | 'common:language.en'
      )
    };
  });

  const onChangeLanguageForGuest = async (lng?: string) => {
    await i18n.changeLanguage(lng);
    localStorage.setItem('language', lng || 'ko');
    // window.location.reload();
  };

  const queryClient = useQueryClient();
  const updateAccountMutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: async () => {
      await refresh();
      await queryClient.invalidateQueries(getAccountMeQueryOptions());
    }
  });
  const onChangeLanguageForUser = (language: string) => {
    const newLanguage = language as 'ko' | 'en';
    updateAccountMutation.mutate(
      { language: newLanguage },
      { onSuccess: async () => onChangeLanguageForGuest(newLanguage) }
    );
  };

  const storedLanguage = localStorage.getItem('language');
  const currentLanguage =
    storedLanguage === 'ko' || storedLanguage === 'en' ? storedLanguage : 'ko';
  const locale = currentLanguage === 'ko' ? 'ko-KR' : 'en-US';

  return {
    t,
    options,
    currentLanguage,
    locale,
    /** 회원 페이지에서 사용 */
    onChangeLanguageForUser,
    /** 비회원 페이지에서 사용 */
    onChangeLanguageForGuest
  };
};
