import { useCallback, useEffect, useState } from 'react';
import {
  EMPTY_PROFILE,
  type CompanyProfile,
} from '@/constants/companyProfile.constant';

const STORAGE_KEY = 'tipa_company_profile';

export const loadProfile = (): CompanyProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...EMPTY_PROFILE, ...parsed };
  } catch {
    return EMPTY_PROFILE;
  }
};

export const saveProfile = (profile: CompanyProfile): CompanyProfile => {
  const next: CompanyProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent('tipa-profile-changed'));
  return next;
};

export const clearProfile = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent('tipa-profile-changed'));
};

export const useCompanyProfile = () => {
  const [profile, setProfile] = useState<CompanyProfile>(() => loadProfile());

  useEffect(() => {
    const handler = () => setProfile(loadProfile());
    window.addEventListener('tipa-profile-changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('tipa-profile-changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const update = useCallback((next: CompanyProfile) => {
    const saved = saveProfile(next);
    setProfile(saved);
    return saved;
  }, []);

  const merge = useCallback((patch: Partial<CompanyProfile>) => {
    const current = loadProfile();
    const saved = saveProfile({ ...current, ...patch });
    setProfile(saved);
    return saved;
  }, []);

  const reset = useCallback(() => {
    clearProfile();
    setProfile(EMPTY_PROFILE);
  }, []);

  return { profile, update, merge, reset };
};
