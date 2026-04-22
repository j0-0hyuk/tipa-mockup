import { useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { getProductsFilesOptions } from '@/query/options/products';
import { getProductFileDownload } from '@/api/products/query';
import { blobDownload } from '@/utils/blobDownload';
import { useToast } from '@docs-front/ui';
import { useI18n } from '@/hooks/useI18n';
import type { ProductFilePathMapContents } from '@/schema/api/products/products';
import { DocsList } from '@/routes/_authenticated/d/-components/ExportSection/DocsList/DocsList';
import { getFileNameFromPath } from '@/utils/file/getFileNameFromPath';
interface ExportSectionProps {
  page: number;
  onTotalPagesChange?: (totalPages: number) => void;
}

export default function ExportSection({
  page,
  onTotalPagesChange
}: ExportSectionProps) {
  const navigate = useNavigate();
  const { t } = useI18n(['main']);
  const toast = useToast();

  const params = useMemo(
    () => ({
      page: page - 1,
      size: 12,
      filter: 'EXPORT'
    }),
    [page]
  );

  const { data } = useQuery({
    ...getProductsFilesOptions({ ...params, fileType: 'EXPORT' }),
    placeholderData: (previousData) => {
      if (!previousData) return undefined;

      const currentPage = params.page + 1;
      const exports = previousData.data?.exports;
      if (!exports) return undefined;

      const totalPages = exports.totalPages;
      const isLastPage = currentPage >= totalPages;

      return isLastPage ? undefined : previousData;
    }
  });

  const totalPages = data?.data?.exports?.totalPages || 0;

  useEffect(() => {
    if (onTotalPagesChange) {
      onTotalPagesChange(totalPages);
    }
  }, [totalPages, onTotalPagesChange]);

  const handleDownload = useCallback(
    async (doc: ProductFilePathMapContents) => {
      if (doc.status === 'PROGRESS') {
        toast.open({
          content: t('main:docs.toast.progress'),
          duration: 3000
        });
        return;
      }

      if (doc.status === 'FAILED') {
        toast.open({
          content: t('main:docs.toast.failed'),
          duration: 3000
        });
        return;
      }

      try {
        const productFileId = Number(doc.productFileId);
        const blob = await getProductFileDownload(productFileId);
        const fileName = getFileNameFromPath(doc.filePath) || 'download';
        blobDownload(blob, fileName);
      } catch {
        toast.open({
          content: t('main:docs.toast.error'),
          duration: 3000
        });
        return;
      }
    },
    [toast, t]
  );

  const docs = data?.data?.exports?.content || [];

  return (
    <DocsList
      docs={docs}
      emptyStateText={t('main:docs.emptyState')}
      emptyStateButtonText={t('main:mainPage.sideNavigation.fill')}
      onEmptyStateButtonClick={() => {
        navigate({ to: '/f/template' });
      }}
      onDownload={handleDownload}
    />
  );
}
