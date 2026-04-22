import {
  StyledFileNameText,
  StyledHistoryItemFailed,
  StyledHistoryItemPopoverContent,
  StyledHistoryItemProgress,
  StyledHistoryItemWrapper
} from '@/routes/_authenticated/c/-components/Toolbar/components/deprecated/HistoryItem/HistoryItem.style';
import { Flex, Button, Spinner, IconButton } from '@docs-front/ui';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import { deleteProductFile } from '@/api/products/mutation';
import { getProductFile } from '@/api/products/query';
import { useCallback } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { getProductFilesQueryOptions } from '@/query/options/products';
import { useTheme } from '@emotion/react';
import {
  Download,
  MoreHorizontal,
  Trash2,
  TriangleAlert,
  X
} from 'lucide-react';
import { blobDownload } from '@/utils/blobDownload';
import { useI18n } from '@/hooks/useI18n.ts';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { getFileNameFromPath } from '@/utils/file/getFileNameFromPath';

const HwpxIcon = '/images/icons/hwpx-icon.webp';
const DocxIcon = '/images/icons/docx-icon.webp';

interface HistoryItemsProps {
  productId: number;
}

export const HistoryItems = ({ productId }: HistoryItemsProps) => {
  const { t } = useI18n(['main', 'export']);
  const { data: historyItems } = useSuspenseQuery(
    getProductFilesQueryOptions(Number(productId), {
      filter: 'EXPORT'
    })
  );
  const { sm } = useBreakPoints();
  const theme = useTheme();

  const queryClient = useQueryClient();

  const deleteProductFileMutationFn = useCallback(
    (productFilePathMapId: number) =>
      deleteProductFile(Number(productId), productFilePathMapId),
    [productId]
  );

  const deleteProductFileMutation = useMutation({
    mutationFn: deleteProductFileMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProductFilesQueryOptions(Number(productId), {
          filter: 'EXPORT'
        }).queryKey
      });
    }
  });

  const onClickDelete = useCallback(
    (productFilePathMapId: number) => {
      deleteProductFileMutation.mutate(productFilePathMapId);
    },
    [deleteProductFileMutation]
  );

  const onClickDownload = useCallback(
    async (productFilePathMapId: number, filePath?: string | null) => {
      const blob = await getProductFile(
        Number(productId),
        productFilePathMapId
      );
      const fileName = getFileNameFromPath(filePath) || 'download';
      blobDownload(blob, fileName);
    },
    [productId]
  );

  const getFileIcon = (filtPath: string) => {
    const fileName = getFileNameFromPath(filtPath);
    const extension = fileName?.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'hwpx':
        return HwpxIcon;
      case 'docx':
        return DocxIcon;
      default:
        return HwpxIcon;
    }
  };

  if (historyItems.length === 0) {
    return (
      <Flex alignItems="center" justify="center" padding={20}>
        <p style={{ color: theme.color.textGray, fontSize: '13px' }}>
          {t('export:history.emptyState')}
        </p>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap={4}>
      {historyItems.map((item) => (
        <StyledHistoryItemWrapper
          key={item.productFilePathMapId}
          status={item.status}
        >
          <Flex alignItems="center" gap={12}>
            <Flex alignItems="center" gap={8} flex={1} minWidth="0">
              {(item.status === 'COMPLETED' || item.status === 'PROGRESS') && (
                <img
                  src={getFileIcon(item.filePath || '')}
                  alt={item.filePath ?? ''}
                  width={20}
                  height={20}
                  loading="lazy"
                />
              )}
              {item.status === 'FAILED' && (
                <TriangleAlert size={20} color={theme.color.error} />
              )}
              <StyledFileNameText sm={sm}>
                {getFileNameFromPath(item.filePath)}
              </StyledFileNameText>
            </Flex>

            {item.status === 'COMPLETED' && (
              <PopoverPrimitive.Root>
                <PopoverPrimitive.Trigger asChild>
                  <IconButton variant="text" size="small" type="button">
                    <MoreHorizontal size={16} color={theme.color.textGray} />
                  </IconButton>
                </PopoverPrimitive.Trigger>
                <PopoverPrimitive.Content asChild sideOffset={5} align="end">
                  <StyledHistoryItemPopoverContent>
                    <PopoverPrimitive.Close asChild>
                      <Button
                        variant="text"
                        size="small"
                        type="button"
                        onClick={() =>
                          onClickDownload(
                            item.productFilePathMapId,
                            item.filePath
                          )
                        }
                      >
                        <Flex flex={1} alignItems="center" gap={6}>
                          <Download size={16} />
                          {t('main:export.history.actions.download')}
                        </Flex>
                      </Button>
                    </PopoverPrimitive.Close>
                    <PopoverPrimitive.Close asChild>
                      <Button
                        variant="text"
                        size="small"
                        type="button"
                        onClick={() => onClickDelete(item.productFilePathMapId)}
                      >
                        <Flex flex={1} alignItems="center" gap={6}>
                          <Trash2 size={16} />
                          {t('main:export.history.actions.delete')}
                        </Flex>
                      </Button>
                    </PopoverPrimitive.Close>
                  </StyledHistoryItemPopoverContent>
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Root>
            )}

            {item.status === 'PROGRESS' && <Spinner size={16} />}

            {item.status === 'FAILED' && (
              <IconButton
                variant="text"
                size="small"
                onClick={() => onClickDelete(item.productFilePathMapId)}
              >
                <X size={16} color={theme.color.textGray} />
              </IconButton>
            )}
          </Flex>
          {item.status === 'PROGRESS' && (
            <StyledHistoryItemProgress>
              {t('main:export.history.status.progress')}
            </StyledHistoryItemProgress>
          )}

          {item.status === 'FAILED' && (
            <Flex
              justify="space-between"
              alignItems="center"
              alignSelf="stretch"
            >
              <StyledHistoryItemFailed>
                {t('main:export.history.status.failed')
                  .split('\n')
                  .map((line: string, index: number) => (
                    <span key={index}>
                      {line}
                      {index === 0 && <br />}
                    </span>
                  ))}
              </StyledHistoryItemFailed>
              <a
                href="https://tally.so/r/w4VY6Y"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outlined" size="small">
                  {t('main:export.history.status.errorReport')}
                </Button>
              </a>
            </Flex>
          )}
        </StyledHistoryItemWrapper>
      ))}
    </Flex>
  );
};
