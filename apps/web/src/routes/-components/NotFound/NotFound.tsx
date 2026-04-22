import { Button, Flex } from '@docs-front/ui';
import {
  StyledMainText,
  StyledContactText,
  StyledSubText
} from '@/routes/-components/NotFound/NotFound.style';
import { Link } from '@tanstack/react-router';
import { RotateCcw } from 'lucide-react';
import { useCallback } from 'react';
import { useI18n } from '@/hooks/useI18n';

const ErrorDogImage = '/images/errors/error-dog-2.webp';

export const NotFound = () => {
  const { t } = useI18n('error');
  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <Flex
      direction="column"
      alignItems="center"
      gap={16}
      justify="center"
      height="100%"
    >
      <img width={280} src={ErrorDogImage} loading="lazy" />
      <StyledMainText>{t('notFound.title')}</StyledMainText>
      <Flex direction="column" alignItems="center" gap={6}>
        <StyledSubText>{t('notFound.message')}</StyledSubText>
        <StyledSubText>{t('notFound.subMessage')}</StyledSubText>
      </Flex>
      <Flex gap={8}>
        <Button variant="outlined" size="medium" onClick={reload}>
          <Flex alignItems="center" gap={4}>
            <RotateCcw size={16} />
            {t('notFound.retry')}
          </Flex>
        </Button>
        <Link to="/">
          <Button variant="filled" size="medium">
            {t('notFound.goBack')}
          </Button>
        </Link>
      </Flex>
      <StyledContactText>{t('notFound.contact')}</StyledContactText>
    </Flex>
  );
};
