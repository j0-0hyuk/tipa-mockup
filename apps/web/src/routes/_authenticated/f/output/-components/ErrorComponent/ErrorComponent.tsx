import {
  StyledDescriptionError,
  StyledEmphasize,
  StyledTitleErrorText
} from '@/routes/_authenticated/f/output/-components/ErrorComponent/ErrorComponent.style';
import { useNavigate, type ErrorRouteComponent } from '@tanstack/react-router';
import { RotateCcw } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n.ts';
import { Flex, Button } from '@docs-front/ui';

const ErrorDogImage = '/images/errors/error-dog-1.webp';

export const ErrorComponent: ErrorRouteComponent = ({ reset }) => {
  const { t } = useI18n(['error', 'main']);
  const navigate = useNavigate();

  const handleNavigateToMain = () => {
    sessionStorage.removeItem('f-funnel-data');
    reset();
    navigate({ to: '/f/template' });
  };

  return (
    <Flex
      justify="center"
      height="100vh"
      width="100%"
      direction="column"
      alignItems="center"
      gap={16}
    >
      <img width={218} src={ErrorDogImage} alt="error" loading="lazy" />
      <StyledTitleErrorText>
        {t('main:fillForm.output.error.title')}
      </StyledTitleErrorText>
      <Flex direction="column" alignItems="center" gap={4}>
        <StyledDescriptionError>
          <StyledEmphasize>
            {t('main:fillForm.output.error.message')}
          </StyledEmphasize>
        </StyledDescriptionError>
        <StyledDescriptionError>
          <StyledEmphasize>
            {t('error:documentGenerationFailed.subMessage')}
          </StyledEmphasize>
        </StyledDescriptionError>
      </Flex>
      <Flex justify="center" width="100%">
        <Button variant="filled" size="medium" onClick={handleNavigateToMain}>
          <Flex alignItems="center" gap={4}>
            <RotateCcw size={16} />
            {t('main:fillForm.output.error.navigateToTemplate')}
          </Flex>
        </Button>
      </Flex>
    </Flex>
  );
};
