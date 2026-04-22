import { useCallback, useEffect } from 'react';
import { Flex, Button } from '@docs-front/ui';
import {
  Link,
  useRouter,
  type ErrorRouteComponent
} from '@tanstack/react-router';
import { RotateCcw } from 'lucide-react';
import {
  StyledMainText,
  StyledContactText,
  StyledSubText
} from '@/routes/-components/NotFound/NotFound.style';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useI18n } from '@/hooks/useI18n';
import { showChannelTalkMessenger } from '@/service/channel-talk';

const ErrorDogImage = '/images/errors/error-dog-1.webp';

export const RootErrorComponent: ErrorRouteComponent = () => {
  const { reset } = useQueryErrorResetBoundary();
  const router = useRouter();
  const { t } = useI18n('error');

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    const idleCallbackId = requestIdleCallback(() => {
      showChannelTalkMessenger({ retryCount: 10, retryDelayMs: 100 });
    });

    return () => {
      cancelIdleCallback(idleCallbackId);
    };
  }, []);

  const handleReset = useCallback(() => {
    router.invalidate();
  }, [router]);

  return (
    <Flex
      direction="column"
      alignItems="center"
      gap={16}
      justify="center"
      height="100%"
    >
      <img width={280} src={ErrorDogImage} loading="lazy" />
      <StyledMainText>{t('unexpected.title')}</StyledMainText>
      <Flex direction="column" alignItems="center" gap={6}>
        <StyledSubText>{t('unexpected.message')}</StyledSubText>
        <StyledSubText>{t('unexpected.subMessage')}</StyledSubText>
      </Flex>
      <Flex gap={8}>
        <Button variant="outlined" size="medium" onClick={handleReset}>
          <Flex alignItems="center" gap={4}>
            <RotateCcw size={16} />
            {t('unexpected.retry')}
          </Flex>
        </Button>
        <Link to="/">
          <Button variant="filled" size="medium">
            {t('unexpected.goHome')}
          </Button>
        </Link>
      </Flex>
      <StyledContactText>{t('unexpected.contact')}</StyledContactText>
    </Flex>
  );
};
