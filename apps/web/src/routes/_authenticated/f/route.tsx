import {
  createFileRoute,
  Outlet,
  useLocation
} from '@tanstack/react-router';
import {
  StyledFillFormTitle,
  StyledFillFormFileName,
  StyledHeaderRow,
  StyledMainContainer,
  StyledMainContent,
  StyledStickyStepperWrapper
} from '@/routes/_authenticated/f/-route.style';
import { Flex } from '@docs-front/ui';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { Suspense, useEffect, useMemo } from 'react';
import { ErrorComponent } from '@/routes/_authenticated/f/output/-components/ErrorComponent/ErrorComponent';
import { FillFormStepper } from '@/routes/_authenticated/f/-components/FillFormStepper/FillFormStepper';

export const Route = createFileRoute('/_authenticated/f')({
  component: RouteComponent,
  errorComponent: ErrorComponent
});

const TEMPLATE_PATH = '/f/template';

const PROMPT_PATH_PREFIX = '/f/prompt';
const UPLOAD_PATH_PREFIX = '/f/upload';
const SETTINGS_PATH_PREFIX = '/f/settings';
const VISUAL_SUGGESTIONS_PATH_PREFIX = '/f/visual-suggestions';
const OUTPUT_PATH_PREFIX = '/f/output';

function RouteComponent() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isMobile } = useBreakPoints();

  const isTemplate = currentPath === TEMPLATE_PATH;
  const isPrompt = currentPath.startsWith(PROMPT_PATH_PREFIX);
  const isUpload = currentPath.startsWith(UPLOAD_PATH_PREFIX);
  const isSettings = currentPath.startsWith(SETTINGS_PATH_PREFIX);
  const isVisualSuggestions = currentPath.startsWith(
    VISUAL_SUGGESTIONS_PATH_PREFIX
  );
  const isOutput = currentPath.startsWith(OUTPUT_PATH_PREFIX);

  const currentStep = useMemo(() => {
    if (isTemplate) return 1;
    if (isPrompt) return 2;
    if (isUpload) return 3;
    if (isVisualSuggestions) return 4;
    if (isSettings) return 5;
    if (isOutput) return 6;
    return 1;
  }, [isTemplate, isPrompt, isUpload, isVisualSuggestions, isSettings, isOutput]);

  const shouldHideChannelTalk = isPrompt || isUpload || isVisualSuggestions;

  useEffect(() => {
    if (shouldHideChannelTalk) {
      window.ChannelIO?.('hideChannelButton');
    } else {
      window.ChannelIO?.('showChannelButton');
    }
    return () => {
      window.ChannelIO?.('showChannelButton');
    };
  }, [shouldHideChannelTalk]);

  const search = location.search as { fileName?: string } | undefined;
  const fileName = search?.fileName ?? '';

  return (
    <StyledMainContainer>
      <StyledMainContent>
        <Flex
          margin="0 auto"
          alignItems="start"
          justify="center"
          direction="column"
          gap={24}
          width="100%"
          height="100%"
          padding={isMobile ? 16 : 0}
        >
          {!isMobile && (
            <StyledStickyStepperWrapper>
              <FillFormStepper currentStep={currentStep} />
            </StyledStickyStepperWrapper>
          )}
          {isTemplate && (
            <Flex semantic="header" direction="column" gap={4}>
              <StyledHeaderRow>
                <StyledFillFormTitle>지원사업 사업계획서</StyledFillFormTitle>
              </StyledHeaderRow>
              {fileName !== '' && (
                <StyledFillFormFileName>{fileName}</StyledFillFormFileName>
              )}
            </Flex>
          )}
          <Suspense>
            <Outlet />
          </Suspense>
        </Flex>
      </StyledMainContent>
    </StyledMainContainer>
  );
}
