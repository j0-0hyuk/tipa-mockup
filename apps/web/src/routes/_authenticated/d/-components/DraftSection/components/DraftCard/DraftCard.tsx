import { Flex, Skeleton, Tooltip, IconButton } from '@docs-front/ui';
import { StyledDraftCard } from '@/routes/_authenticated/d/-components/DraftSection/components/DraftCard/DraftCard.style';
import { FolderPen, Trash2 } from 'lucide-react';
import { ProductNameModal } from '@/routes/_authenticated/d/-components/DraftSection/components/ProductNameModal/ProductNameModal';
import { ProductDeleteModal } from '@/routes/_authenticated/d/-components/DraftSection/components/ProductDeleteModal/ProductDeleteModal';
import { useModal } from '@/hooks/useModal';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getDocumentOptions } from '@/query/options/products';

interface DraftCardProps {
  productId: number;
  itemName: string | null;
}

export const DraftCard = ({ productId, itemName }: DraftCardProps) => {
  const modal = useModal();

  const { data: document } = useSuspenseQuery(getDocumentOptions(productId));

  const progress = document.generationStatus === 'PROGRESS';

  const handleOpenRenameModal = (productId: number, itemName: string) => {
    modal.openModal(({ onClose: modalClose }) => (
      <ProductNameModal
        onClose={() => {
          modalClose();
        }}
        productId={productId}
        itemName={itemName}
      />
    ));
  };

  const handleOpenDeleteModal = (productId: number) => {
    modal.openModal(({ onClose: modalClose }) => (
      <ProductDeleteModal
        onClose={() => {
          modalClose();
        }}
        productId={productId}
      />
    ));
  };

  return (
    <StyledDraftCard to={`/c/${productId}`}>
      {progress ? (
        <Skeleton loading={true} width="25%" height="18px" />
      ) : (
        itemName || '사업계획서 초안'
      )}
      <Flex gap={12}>
        <Tooltip
          side="left"
          content={progress ? '초안 생성중' : '제목 수정하기'}
        >
          <IconButton
            variant="outlined"
            size="medium"
            disabled={progress}
            onClick={(e) => {
              e.preventDefault();
              handleOpenRenameModal(
                productId,
                itemName?.trim() || '사업계획서 초안'
              );
            }}
          >
            <FolderPen size={16} strokeWidth={1.5} />
          </IconButton>
        </Tooltip>
        <Tooltip content={progress ? '초안 생성중' : '삭제하기'}>
          <IconButton
            variant="outlined"
            size="medium"
            disabled={progress}
            onClick={(e) => {
              e.preventDefault();
              handleOpenDeleteModal(productId);
            }}
          >
            <Trash2 size={16} strokeWidth={1.3} />
          </IconButton>
        </Tooltip>
      </Flex>
    </StyledDraftCard>
  );
};
