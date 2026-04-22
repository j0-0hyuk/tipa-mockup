import { Button, Tooltip } from '@docs-front/ui';
import { FileUp } from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useI18n } from '@/hooks/useI18n.ts';
import { getDocumentOptions } from '@/query/options/products';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { useDiffNavStore } from '@/store/useDiffNavStore';

interface ExportButtonProps {
  productId: number;
  onClick: () => void;
}

export const ExportButton = ({ productId, onClick }: ExportButtonProps) => {
  const { t } = useI18n(['main', 'common']);
  const { sm } = useBreakPoints();
  const ids = useDiffNavStore((s) => s.ids);

  const { data: document } = useSuspenseQuery(getDocumentOptions(productId));
  const { data: account } = useSuspenseQuery(getAccountMeQueryOptions());
  const hasProAccess = account.hasProAccess;
  const disabled = document.content === null || !hasProAccess || ids.length > 0;

  const button = (
    <Button
      variant="filled"
      size="medium"
      onClick={onClick}
      disabled={disabled}
    >
      <FileUp size={20} />
      {!sm && t('main:navigation.export')}
    </Button>
  );

  if (disabled) {
    return (
      <Tooltip
        content={
          document.content === null
            ? t('main:tooltip.export.disabled')
            : ids.length > 0
              ? t('main:tooltip.export.diffPending')
              : t('main:tooltip.export.proPlanRequired')
        }
        side="bottom"
      >
        {button}
      </Tooltip>
    );
  }

  return button;
};
