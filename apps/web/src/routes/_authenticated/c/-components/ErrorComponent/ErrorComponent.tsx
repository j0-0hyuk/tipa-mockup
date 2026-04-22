import {
  StyledDescriptionError,
  StyledEmphasize,
  StyledTitleErrorText
} from '@/routes/_authenticated/c/-components/ErrorComponent/ErrorComponent.style';
import {
  useMatchRoute,
  useNavigate,
  useRouter,
  type ErrorRouteComponent
} from '@tanstack/react-router';
import { RotateCcw } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n.ts';
import { Flex, Button } from '@docs-front/ui';
import { deleteProduct } from '@/api/products/mutation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductsQueryOptions } from '@/query/options/products';
import { useEffect } from 'react';
import { showChannelTalkMessenger } from '@/service/channel-talk';

const ErrorDogImage = '/images/errors/error-dog-1.webp';

export const ErrorComponent: ErrorRouteComponent = ({ error }) => {
  const { t } = useI18n(['error']);
  const matchRoute = useMatchRoute();
  const router = useRouter();
  const navigate = useNavigate();
  const params = matchRoute({ to: '/c/$productId' });
  if (!params) {
    throw new Error('params is not found');
  }
  const productId = Number(params.productId);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries(getProductsQueryOptions());
      navigate({ to: '/c' });
    }
  });

  const fallbackError = error instanceof Error && error.message === 'FAILED';

  useEffect(() => {
    const idleCallbackId = requestIdleCallback(() => {
      showChannelTalkMessenger({ retryCount: 10, retryDelayMs: 100 });
    });

    return () => {
      cancelIdleCallback(idleCallbackId);
    };
  }, []);

  const handleNavigateToMain = () => {
    if (fallbackError) {
      mutate();
    } else {
      router.invalidate();
    }
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
        {t(
          fallbackError
            ? 'error:documentGenerationFailed.title'
            : 'error:unknownError.title'
        )}
      </StyledTitleErrorText>
      <Flex direction="column" alignItems="center" gap={4}>
        <StyledDescriptionError>
          <StyledEmphasize>
            {t(
              fallbackError
                ? 'error:documentGenerationFailed.message'
                : 'error:unknownError.message'
            )}
          </StyledEmphasize>
        </StyledDescriptionError>
        <StyledDescriptionError>
          <StyledEmphasize>
            {t(
              fallbackError
                ? 'error:documentGenerationFailed.subMessage'
                : 'error:unknownError.subMessage'
            )}
          </StyledEmphasize>
        </StyledDescriptionError>
      </Flex>
      <Flex justify="center" width="100%">
        <Button
          variant="filled"
          size="medium"
          onClick={handleNavigateToMain}
          disabled={isPending}
        >
          <Flex alignItems="center" gap={4}>
            <RotateCcw size={16} />
            {t(
              fallbackError
                ? 'error:documentGenerationFailed.regenerateButton'
                : 'error:unknownError.retryButton'
            )}
          </Flex>
        </Button>
      </Flex>
    </Flex>
  );
};
