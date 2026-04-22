import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Button } from '@docs-front/ui';
import {
  StyledColorPick,
  StyledColorPickContent,
  StyledColorPickInner
} from '@/routes/_authenticated/c/-components/Toolbar/components/ColorPicker/ColorPicker.style';
import { ColorSelect } from '@/routes/_authenticated/c/-components/Toolbar/components/ColorSelect/ColorSelect';
import { useTheme } from '@emotion/react';
import { CHART_COLORS } from '@/constants/chartColors.constant';
import { getDocumentOptions } from '@/query/options/products';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import { patchProductMeta } from '@/api/products/mutation';
import { useCallback } from 'react';
import type { PatchProductMetaRequestParams } from '@/schema/api/products/meta';
import { useI18n } from '@/hooks/useI18n.ts';
import { ChevronDown } from 'lucide-react';
import { useBreakPoints } from '@/hooks/useBreakPoints';

interface ColorPickerProps {
  productId: number;
}

const ColorPicker = ({ productId }: ColorPickerProps) => {
  const { t } = useI18n(['common']);
  const queryClient = useQueryClient();
  const { isMobile } = useBreakPoints();
  const { data: productMeta } = useSuspenseQuery(getDocumentOptions(productId));

  const patchProductMetaMutationFn = useCallback(
    (params: PatchProductMetaRequestParams) =>
      patchProductMeta(productId, params),
    [productId]
  );

  const patchProductMetaMutation = useMutation({
    mutationFn: patchProductMetaMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries(getDocumentOptions(productId));
    }
  });

  const theme = useTheme();

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        {isMobile ? (
          <StyledColorPick
            $color={theme.color[CHART_COLORS[productMeta.themeColor]] as string}
          >
            <StyledColorPickInner
              $color={
                theme.color[CHART_COLORS[productMeta.themeColor]] as string
              }
            />
          </StyledColorPick>
        ) : (
          <Button variant="outlined" size="medium">
            <StyledColorPick
              $color={
                theme.color[CHART_COLORS[productMeta.themeColor]] as string
              }
            >
              <StyledColorPickInner
                $color={
                  theme.color[CHART_COLORS[productMeta.themeColor]] as string
                }
              />
            </StyledColorPick>
            <p>{t('common:button.chartColor')}</p>
            <ChevronDown size={16} color={theme.color.textGray} />
          </Button>
        )}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content asChild>
          <StyledColorPickContent>
            <ColorSelect
              size="sm"
              value={productMeta.themeColor}
              onChange={(value) => {
                patchProductMetaMutation.mutate({
                  themeColor: value as keyof typeof CHART_COLORS
                });
              }}
            />
          </StyledColorPickContent>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export { ColorPicker };
