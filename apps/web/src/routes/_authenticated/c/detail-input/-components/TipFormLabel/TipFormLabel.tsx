import { TipFormLabel as UITipFormLabel } from '@docs-front/ui';
import { useI18n } from '@/hooks/useI18n';
import type * as LabelPrimitive from '@radix-ui/react-label';

interface TipFormLabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  children: React.ReactNode;
}

export const TipFormLabel = ({ children, ...props }: TipFormLabelProps) => {
  const { t } = useI18n(['main']);
  return (
    <UITipFormLabel tipLabel={t('main:detailInput.tip')} {...props}>
      {children}
    </UITipFormLabel>
  );
};
