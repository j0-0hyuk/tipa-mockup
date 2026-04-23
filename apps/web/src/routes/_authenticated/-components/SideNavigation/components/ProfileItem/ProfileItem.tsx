import * as PopoverPrimitive from '@radix-ui/react-popover';
import {
  StyledProfileDialogContent,
  StyledUserEmail,
  StyledProfileDialogTrigger,
  StyledMenuButton,
  StyledProfileDialogTriggerPlan,
  StyledProfileDialogTriggerEmail,
  StyledProfileAvatarWrapper,
  StyledProfileUpdateBadge,
  StyledUpdateNewsDot,
  StyledNewFeatureContainer
} from '@/routes/_authenticated/-components/SideNavigation/components/ProfileItem/ProfileItem.style';
import { Bell, ChevronRight, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter, useLocation } from '@tanstack/react-router';
import { useI18n } from '@/hooks/useI18n.ts';
import { Flex, Avatar, Select, Tooltip } from '@docs-front/ui';
import { Internet } from '@docs-front/ui';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { useSideNavigationModalStore } from '@/store/useSideNavigationModalStore';
import { docsCacheClear } from '@/query/cache';
import { isMockupRoutePath } from '@/routes/_authenticated/-utils/mockupRoutes';

import { useAuth } from '@/service/auth/hook';
import { useTheme } from '@emotion/react';

const UPDATE_NEWS_LAST_READ_AT_STORAGE_KEY = 'profile.updateNews.lastReadAt';
const UPDATE_CHECK_INTERVAL_MS = 60_000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const KST_UTC_OFFSET = '+09:00';

const getUpdateLatestTimeEndpoint = (): string | null => {
  const proxyBaseUrl = import.meta.env.VITE_AI_PROXY_URL;
  if (!proxyBaseUrl) return null;

  const normalized = proxyBaseUrl.endsWith('/')
    ? proxyBaseUrl.slice(0, -1)
    : proxyBaseUrl;

  return normalized.endsWith('/api')
    ? `${normalized}/notion/latest-time`
    : `${normalized}/api/notion/latest-time`;
};

const toKstIsoString = (
  value: string | Date | null | undefined
): string | null => {
  if (!value) return null;

  const baseDate = value instanceof Date ? value : new Date(value);
  const timestamp = baseDate.getTime();
  if (!Number.isFinite(timestamp)) return null;

  const kstDate = new Date(timestamp + KST_OFFSET_MS);
  return kstDate.toISOString().replace('Z', KST_UTC_OFFSET);
};

const toTimestamp = (value: string | null): number | null => {
  if (!value) return null;

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const fetchLatestNotionUpdateTime = async (
  endpoint: string
): Promise<string | null> => {
  const response = await fetch(endpoint);
  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { latestTime?: unknown };
  return typeof data.latestTime === 'string' ? data.latestTime : null;
};

const normalizeExternalUrl = (rawUrl: string | undefined): string | null => {
  if (!rawUrl) return null;

  const trimmedUrl = rawUrl.trim();
  if (!trimmedUrl) return null;

  try {
    return new URL(trimmedUrl).toString();
  } catch {
    try {
      return new URL(`https://${trimmedUrl}`).toString();
    } catch {
      return null;
    }
  }
};

export const ProfileItem = ({ open }: { open: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const [lastReadAt, setLastReadAt] = useState<string | null>(() =>
    toKstIsoString(localStorage.getItem(UPDATE_NEWS_LAST_READ_AT_STORAGE_KEY))
  );
  const router = useRouter();
  const { isMobile } = useBreakPoints();
  const { signOut } = useAuth();
  const { options, t, currentLanguage, onChangeLanguageForUser } = useI18n([
    'language',
    'profile'
  ]);
  const { close } = useSideNavigationModalStore();

  const signOutMutation = useMutation({
    mutationFn: signOut
  });

  // 데모/프로토타입 라우트 및 프로토타입 빌드에서는 백엔드 호출을 끈다
  const { pathname } = useLocation();
  const isPrototypeBuild = import.meta.env.VITE_IS_PROTOTYPE === 'true';
  const isDemoRoute = isPrototypeBuild || isMockupRoutePath(pathname);

  const { data: accountData } = useQuery({
    ...getAccountMeQueryOptions(),
    enabled: !isDemoRoute,
  });
  const updateLatestTimeEndpoint = getUpdateLatestTimeEndpoint();

  const { data: latestNotionUpdateTime } = useQuery({
    queryKey: ['profile', 'notion-latest-time'],
    queryFn: () => fetchLatestNotionUpdateTime(updateLatestTimeEndpoint ?? ''),
    enabled: Boolean(updateLatestTimeEndpoint) && !isDemoRoute,
    staleTime: UPDATE_CHECK_INTERVAL_MS,
    refetchInterval: isDemoRoute ? false : UPDATE_CHECK_INTERVAL_MS,
    select: (latestTime) => toKstIsoString(latestTime),
    retry: false,
    throwOnError: false,
  });

  useEffect(() => {
    const storedLastReadAt = localStorage.getItem(
      UPDATE_NEWS_LAST_READ_AT_STORAGE_KEY
    );

    if (!storedLastReadAt) {
      return;
    }

    const normalizedLastReadAt = toKstIsoString(storedLastReadAt);

    if (!normalizedLastReadAt) {
      localStorage.removeItem(UPDATE_NEWS_LAST_READ_AT_STORAGE_KEY);
      setLastReadAt(null);
      return;
    }

    if (storedLastReadAt !== normalizedLastReadAt) {
      localStorage.setItem(
        UPDATE_NEWS_LAST_READ_AT_STORAGE_KEY,
        normalizedLastReadAt
      );
    }

    setLastReadAt((prev) =>
      prev === normalizedLastReadAt ? prev : normalizedLastReadAt
    );
  }, []);

  const shouldShowUpdateBadge = useMemo(() => {
    if (!lastReadAt) {
      return true;
    }

    const latestUpdatedAtTimestamp = toTimestamp(
      latestNotionUpdateTime ?? null
    );
    const lastReadAtTimestamp = toTimestamp(lastReadAt);

    if (!lastReadAtTimestamp) {
      return true;
    }

    if (!latestUpdatedAtTimestamp) {
      return false;
    }

    return latestUpdatedAtTimestamp > lastReadAtTimestamp;
  }, [lastReadAt, latestNotionUpdateTime]);

  const isFreePlan = !accountData?.hasProAccess;

  const handlesignOut = () => {
    signOutMutation.mutate();
    docsCacheClear();
    localStorage.clear();
    close();
  };

  const handleCreditPlanClick = () => {
    setIsOpen(false);
    router.navigate({ to: '/credit-plan' });
    close();
  };

  const handleUserReportErrorsClick = () => {
    window.ChannelIO?.('showMessenger');
    setIsOpen(false);
    close();
  };

  const handleUpdateNewsClick = () => {
    const nowKstIsoTimestamp = toKstIsoString(new Date());
    if (nowKstIsoTimestamp) {
      localStorage.setItem(
        UPDATE_NEWS_LAST_READ_AT_STORAGE_KEY,
        nowKstIsoTimestamp
      );
      setLastReadAt(nowKstIsoTimestamp);
    }

    const updateUrl = normalizeExternalUrl(import.meta.env.VITE_UPDATE_URL);
    if (updateUrl) {
      window.open(updateUrl, '_blank', 'noopener,noreferrer');
    }

    setIsOpen(false);
    close();
  };

  const handlePopoverOpenChange = (open: boolean) => {
    // 모달이 열려 있는지 확인 (Radix UI Dialog는 data-state="open"을 사용)
    const isModalOpen = document.querySelector(
      '[role="dialog"][data-state="open"]'
    );
    if (isModalOpen && open) {
      return; // 모달이 열려 있으면 Popover를 열지 않음
    }
    setIsOpen(open);
  };

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={handlePopoverOpenChange}>
      <StyledProfileDialogTrigger asChild>
        <Flex direction="row" gap={8} alignItems="center">
          <StyledProfileAvatarWrapper>
            <Avatar $size="32px" />
            {shouldShowUpdateBadge && (
              <StyledProfileUpdateBadge aria-label="업데이트 소식 알림">
                <Bell fill={theme.color.textWarning} size={12} />
              </StyledProfileUpdateBadge>
            )}
          </StyledProfileAvatarWrapper>
          {open && (
            <>
              <Flex direction="column" gap={2}>
                <StyledProfileDialogTriggerEmail $isFreePlan={isFreePlan}>
                  {accountData?.email || t('profile:profile.loading')}
                </StyledProfileDialogTriggerEmail>
                <StyledProfileDialogTriggerPlan>
                  {isFreePlan ? 'Free' : 'Pro'}
                </StyledProfileDialogTriggerPlan>
              </Flex>
              <Internet color="#FFFFFF" />
            </>
          )}
        </Flex>
      </StyledProfileDialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <PopoverPrimitive.Portal forceMount>
            <PopoverPrimitive.Content
              side="bottom"
              align="start"
              sideOffset={8}
              asChild
            >
              <motion.div
                initial={{ opacity: 0, x: -20, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, y: 20, scale: 0.8 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                style={{
                  zIndex: isMobile ? '50' : '0'
                }}
              >
                <StyledProfileDialogContent>
                  <StyledUserEmail>
                    {accountData?.email || t('profile:profile.loading')}
                  </StyledUserEmail>

                  <StyledMenuButton onClick={handleCreditPlanClick}>
                    <div style={{ flex: 1 }}>
                      {t('profile:profile.planUpgrade')}
                    </div>
                    <ChevronRight size={16} />
                  </StyledMenuButton>

                  <Tooltip
                    side="left"
                    content={
                      shouldShowUpdateBadge ? '최신 업데이트 소식이 있어요' : null
                    }
                  >
                    <StyledMenuButton onClick={handleUpdateNewsClick}>
                      <StyledNewFeatureContainer>
                        <span>{t('profile:profile.updateNews')}</span>
                        {shouldShowUpdateBadge && <StyledUpdateNewsDot />}
                      </StyledNewFeatureContainer>
                      <ChevronRight size={16} />
                    </StyledMenuButton>
                  </Tooltip>

                  <StyledMenuButton onClick={handleUserReportErrorsClick}>
                    <div style={{ flex: 1 }}>
                      {t('profile:profile.reportErrors')}
                    </div>
                    <ChevronRight size={16} />
                  </StyledMenuButton>

                  <StyledMenuButton onClick={handlesignOut}>
                    <div style={{ flex: 1 }}>{t('profile:profile.logout')}</div>
                  </StyledMenuButton>

                  <Select
                    leftIcon={<Globe size={14} />}
                    value={currentLanguage}
                    iconSize={14}
                    padding="6px 10px"
                    $typo="Md_13"
                    height="36px"
                    $borderColor="borderGray"
                    $borderRadius="md"
                    $color="black"
                    onChange={onChangeLanguageForUser}
                  >
                    {options.map((option) => (
                      <Select.Item key={option.value} value={option.value}>
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select>
                </StyledProfileDialogContent>
              </motion.div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    </PopoverPrimitive.Root>
  );
};
