import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { useSuspenseQuery, useQueries } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import { Button, Flex } from '@bichon/ds';
import {
  getProductsQueryOptions,
  getDocumentOptions
} from '@/query/options/products';
import { getProduct } from '@/api/products/query';
import {
  StyledDraftList,
  StyledDraftCard,
  StyledItemName
} from '@/routes/_authenticated/f/prompt/-components/DraftList/DraftList.style';
import { useI18n } from '@/hooks/useI18n';

interface DraftListProps {
  disabled?: boolean;
  onProductSelect?: (productId: number | null) => void;
  initialSelectedProductId?: number | null;
}

export default function DraftList({
  disabled = false,
  onProductSelect,
  initialSelectedProductId = null
}: DraftListProps) {
  const { data: products } = useSuspenseQuery({
    ...getProductsQueryOptions()
  });
  const { setValue } = useFormContext<{ draft?: string }>();
  const { t } = useI18n(['main']);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    initialSelectedProductId
  );
  const latestFetchRequestIdRef = useRef(0);

  const productStatusQueries = useQueries({
    queries: products.map((product) => ({
      ...getDocumentOptions(product.id),
      enabled: true
    }))
  });

  const productStatusMap = useMemo(() => {
    const map = new Map<
      number,
      'PENDING' | 'PROGRESS' | 'COMPLETED' | 'FAILED' | undefined
    >();
    products.forEach((product, index) => {
      const status = productStatusQueries[index]?.data?.generationStatus;
      if (status) {
        map.set(product.id, status);
      }
    });
    return map;
  }, [products, productStatusQueries]);

  useEffect(() => {
    setSelectedProductId(initialSelectedProductId ?? null);
  }, [initialSelectedProductId]);

  useEffect(() => {
    if (selectedProductId == null) return;

    const exists = products.some((product) => product.id === selectedProductId);
    if (exists) return;

    setSelectedProductId(null);
    setValue('draft', '');
    onProductSelect?.(null);
  }, [selectedProductId, products, setValue, onProductSelect]);

  const isGeneratingStatus = useCallback(
    (productId: number) => {
      const status = productStatusMap.get(productId);
      return status === 'PENDING' || status === 'PROGRESS';
    },
    [productStatusMap]
  );

  const handleSelect = async (productId: number) => {
    if (disabled) return;
    if (isGeneratingStatus(productId)) {
      return;
    }

    if (selectedProductId === productId) {
      setValue('draft', '');
      setSelectedProductId(null);
      onProductSelect?.(null);
      return;
    }

    const requestId = ++latestFetchRequestIdRef.current;

    try {
      const product = await getProduct(productId);
      if (requestId !== latestFetchRequestIdRef.current) {
        return;
      }

      setValue('draft', product.content || '');
      setSelectedProductId(productId);
      onProductSelect?.(productId);
    } catch (error) {
      console.error('Product fetch failed:', error);
    }
  };

  const scrollable = products.length >= 7;

  return (
    <StyledDraftList $scrollable={scrollable}>
      {products.map((product) => {
        const isSelected = selectedProductId === product.id;
        const isGenerating = isGeneratingStatus(product.id);
        const isButtonDisabled = disabled || isGenerating;

        return (
          <StyledDraftCard
            key={product.id}
            $isSelected={isSelected}
            disabled={disabled}
          >
            <StyledItemName>
              {product.itemName ||
                `${t('main:fillForm.prompt.draft.productName')} ${product.id}`}
            </StyledItemName>
            <Button
              active={isSelected}
              type="button"
              variant="outlined"
              size="small"
              disabled={isButtonDisabled}
              onClick={() => handleSelect(product.id)}
            >
              {isSelected ? (
                t('main:fillForm.prompt.draft.selected')
              ) : isGenerating ? (
                '생성중'
              ) : (
                <Flex direction="row" alignItems="center" gap={4}>
                  <Check size={16} />
                  {t('main:fillForm.prompt.draft.select')}
                </Flex>
              )}
            </Button>
          </StyledDraftCard>
        );
      })}
    </StyledDraftList>
  );
}
