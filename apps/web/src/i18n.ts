import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Korean translations
import koCommon from '@/locales/ko/common.json';
import koAuth from '@/locales/ko/auth.json';
import koOnboarding from '@/locales/ko/onboarding.json';
import koMain from '@/locales/ko/main.json';
import koError from '@/locales/ko/error.json';
import koProfile from '@/locales/ko/profile.json';
import koLanguage from '@/locales/ko/language.json';
import koCreditPlan from '@/locales/ko/creditPlan.json';
import koBusinessPlan from '@/locales/ko/businessPlan.json';
import koExport from '@/locales/ko/export.json';
import koPricing from '@/locales/ko/pricing.json';
import koReferralEvent from '@/locales/ko/referralEvent.json';

// English translations
import enCommon from '@/locales/en/common.json';
import enAuth from '@/locales/en/auth.json';
import enOnboarding from '@/locales/en/onboarding.json';
import enMain from '@/locales/en/main.json';
import enError from '@/locales/en/error.json';
import enProfile from '@/locales/en/profile.json';
import enLanguage from '@/locales/en/language.json';
import enCreditPlan from '@/locales/en/creditPlan.json';
import enBusinessPlan from '@/locales/en/businessPlan.json';
import enExport from '@/locales/en/export.json';
import enPricing from '@/locales/en/pricing.json';
import enReferralEvent from '@/locales/en/referralEvent.json';

const getInitialLanguage = (): 'ko' | 'en' => {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage === 'ko' || savedLanguage === 'en') {
    return savedLanguage;
  }

  /** 브라우저 언어 설정 이용 ex) ko-KR, en-US */
  const browserLanguage = navigator.language.slice(0, 2);
  return browserLanguage === 'ko' ? 'ko' : 'en';
};

const initialLanguage = getInitialLanguage();

// HTML lang 속성 설정 (Chrome 자동 번역 방지)
document.documentElement.lang = initialLanguage;

// 언어 변경 시 HTML lang 속성도 업데이트
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

i18n.use(initReactI18next).init({
  resources: {
    ko: {
      common: koCommon,
      auth: koAuth,
      onboarding: koOnboarding,
      main: koMain,
      error: koError,
      profile: koProfile,
      language: koLanguage,
      creditPlan: koCreditPlan,
      businessPlan: koBusinessPlan,
      export: koExport,
      pricing: koPricing,
      referralEvent: koReferralEvent
    },
    en: {
      common: enCommon,
      auth: enAuth,
      onboarding: enOnboarding,
      main: enMain,
      error: enError,
      profile: enProfile,
      language: enLanguage,
      creditPlan: enCreditPlan,
      businessPlan: enBusinessPlan,
      export: enExport,
      pricing: enPricing,
      referralEvent: enReferralEvent
    }
  },
  fallbackLng: 'ko',
  lng: initialLanguage,
  interpolation: {
    escapeValue: false
  },
  debug: true
});

export default i18n;
