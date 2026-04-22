import { useEffect, useState } from 'react';
import {
  StyledProductCreationModal,
  StyledProductCreationModalHeaderContainer,
  StyledProductCreationModalContainer,
  StyledProductCreationModalHeaderCloseButton,
  StyledProductCreationModalHeader,
  StyledProductCreationModalHeader2,
  StyledNumberKey,
  StyledProductCreationModalInput,
  StyledProductCreationModalInputContainer,
  StyledProductCreationModalMethodContainer,
  StyledProductCreationModalIcon,
  StyledProductCreationModalMethodDes,
  StyledProductCreationModalMethodTitle,
  StyledBadge
} from '@/routes/_authenticated/c/-components/ProductCreationModal/ProductCreationModal.style';
import { Button, Flex } from '@docs-front/ui';
import { useNavigate } from '@tanstack/react-router';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import { postProducts } from '@/api/products/mutation';
import { BookOpenText, File } from 'lucide-react';
import i18n from '@/i18n';
import { InsufficientCreditProductCreationModal } from '@/routes/_authenticated/credit-plan/-components/InsufficientCreditModal/InsufficientCreditProductCreationModal';
import { getAccountMeQueryOptions } from '@/query/options/account.ts';
import { overlay } from 'overlay-kit';
import { getProductsQueryOptions } from '@/query/options/products';

interface ProductCreationModalProps {
  onClose: () => void;
}

type MethodType = 'empty' | 'guide' | null;

export default function ProductCreationModal({
  onClose
}: ProductCreationModalProps) {
  const t = i18n.t;
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<MethodType>(null);
  const [itemName, setItemName] = useState('');
  const queryClient = useQueryClient();

  const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());
  const mutation = useMutation({
    mutationFn: postProducts,
    onSuccess: async (data) => {
      queryClient.invalidateQueries(getProductsQueryOptions());
      navigate({ to: `/c/${data}` });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      onClose();
    }
  });

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackgroundClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleMethodSelect = (method: MethodType) => {
    setSelectedMethod(method);
  };

  const handleStartButtonClick = () => {
    if (!itemName.trim() || !selectedMethod) return;

    onClose();

    if (selectedMethod === 'empty') {
      mutation.mutate({
        itemName: itemName,
        itemDescription: ' '
      });
    } else if (selectedMethod === 'guide') {
      const totalCredit = me.freeCredit + me.paidCredit;
      if (totalCredit < me.productCreationCredit) {
        /** [Temp] useModal 중복 사용시 충돌 발생으로 overay 하드 코딩 */
        overlay.open(({ isOpen, close }) => (
          <InsufficientCreditProductCreationModal
            isOpen={isOpen}
            onClose={close}
            totalCredit={totalCredit}
            productCreationCredit={me.productCreationCredit}
          />
        ));
      } else {
        navigate({
          to: '/c/detail-input'
        });
      }
    }
  };

  return (
    <StyledProductCreationModalContainer onClick={handleBackgroundClick}>
      <StyledProductCreationModal>
        <StyledProductCreationModalHeaderContainer>
          <StyledProductCreationModalHeader>
            {t('main:document.title')}
          </StyledProductCreationModalHeader>
          <StyledProductCreationModalHeaderCloseButton onClick={onClose} />
        </StyledProductCreationModalHeaderContainer>
        <StyledProductCreationModalInputContainer>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              alignSelf: 'flex-start',
              height: 'fit-content'
            }}
          >
            <StyledProductCreationModalHeader2>
              {t('main:document.productName')}
            </StyledProductCreationModalHeader2>
            <StyledNumberKey>*</StyledNumberKey>
          </div>
          <StyledProductCreationModalInput
            placeholder={t('main:document.productName')}
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </StyledProductCreationModalInputContainer>
        <StyledProductCreationModalInputContainer>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              alignSelf: 'flex-start'
            }}
          >
            <StyledProductCreationModalHeader2>
              {t('main:document.method')}
            </StyledProductCreationModalHeader2>
            <StyledNumberKey>*</StyledNumberKey>
          </div>
          <StyledProductCreationModalMethodContainer
            onClick={() => handleMethodSelect('empty')}
            isSelected={selectedMethod === 'empty'}
          >
            <StyledProductCreationModalIcon
              isSelected={selectedMethod === 'empty'}
            >
              <File size={24} />
            </StyledProductCreationModalIcon>
            <Flex gap={4} direction="column">
              <StyledProductCreationModalMethodTitle>
                {t('main:document.emptyMethodTitle')}
              </StyledProductCreationModalMethodTitle>
              <StyledProductCreationModalMethodDes>
                {t('main:document.emptyMethodDescription')}
              </StyledProductCreationModalMethodDes>
            </Flex>
          </StyledProductCreationModalMethodContainer>
          <StyledProductCreationModalMethodContainer
            onClick={() => handleMethodSelect('guide')}
            isSelected={selectedMethod === 'guide'}
          >
            <StyledProductCreationModalIcon
              isSelected={selectedMethod === 'guide'}
            >
              <BookOpenText size={24} />
            </StyledProductCreationModalIcon>
            <Flex gap={4} direction="column">
              <Flex gap={4} direction="row" alignItems="center">
                <StyledProductCreationModalMethodTitle>
                  {t('main:document.guideMethodTitle')}
                </StyledProductCreationModalMethodTitle>
                <StyledBadge>
                  <span>{t('main:document.proBadge')}</span>
                </StyledBadge>
                <StyledBadge>
                  <span>
                    {t('main:document.creditDeduction', {
                      credit: me.productCreationCredit
                    })}
                  </span>
                </StyledBadge>
              </Flex>
              <StyledProductCreationModalMethodDes>
                {t('main:document.guideMethodDescription')}
              </StyledProductCreationModalMethodDes>
            </Flex>
          </StyledProductCreationModalMethodContainer>
        </StyledProductCreationModalInputContainer>
        <Button
          variant="filled"
          size="medium"
          onClick={handleStartButtonClick}
          disabled={!selectedMethod || !itemName.trim()}
        >
          {t('main:document.submitButton')}
        </Button>
      </StyledProductCreationModal>
    </StyledProductCreationModalContainer>
  );
}
