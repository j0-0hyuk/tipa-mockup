import auth from '../locales/ko/auth.json';
import businessPlan from '../locales/ko/businessPlan.json';
import common from '../locales/ko/common.json';
import creditPlan from '../locales/ko/creditPlan.json';
import error from '../locales/ko/error.json';
import exportLocale from '../locales/ko/export.json';
import language from '../locales/ko/language.json';
import main from '../locales/ko/main.json';
import onboarding from '../locales/ko/onboarding.json';
import pricing from '../locales/ko/pricing.json';
import profile from '../locales/ko/profile.json';
import referralEvent from '../locales/ko/referralEvent.json';

const resources = {
  auth,
  businessPlan,
  common,
  creditPlan,
  error,
  export: exportLocale,
  language,
  main,
  onboarding,
  pricing,
  profile,
  referralEvent
} as const;

export default resources;
