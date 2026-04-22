import { deleteProductsFile } from '@/api/products/mutation';
import { Modal } from '@docs-front/ui';
import { StyledProductDeleteModalDescription } from '@/routes/_authenticated/d/-components/DraftSection/components/ProductDeleteModal/ProductDeleteModal.style';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import i18n from '@/i18n';
import { useToast } from '@docs-front/ui';
import { useI18n } from '@/hooks/useI18n';

interface DocsDeleteModalProps {
  onClose: () => void;
  productFileId: number;
  onSuccess?: () => void;
}

export const DocsDeleteModal = ({
  onClose,
  productFileId,
  onSuccess
}: DocsDeleteModalProps) => {
  const t = i18n.t;
  const { t: t2 } = useI18n(['main']);
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation<void>({
    mutationFn: () => deleteProductsFile(productFileId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['productsFiles']
      });
      if (onSuccess) {
        onSuccess();
      }
      onClose();
      toast.open({
        content: t2('main:docs.toast.success'),
        duration: 3000
      });
    },
    onError: () => {
      toast.open({
        content: '삭제에 실패했습니다',
        duration: 3000
      });
    }
  });

  const handleDelete = () => mutation.mutate();

  return (
    <Modal isOpen={true} onClose={onClose}>
      <Modal.Header title={t('main:menuNavigation.deleteTitle')} />
      <Modal.Body>
        <StyledProductDeleteModalDescription>
          {t('main:menuNavigation.deleteDescription')}
        </StyledProductDeleteModalDescription>
      </Modal.Body>
      <Modal.Footer>
        <Modal.CancelButton onClick={onClose}>
          {t('main:menuNavigation.cancel')}
        </Modal.CancelButton>
        <Modal.ConfirmButton
          onClick={handleDelete}
          disabled={mutation.isPending}
          variant="warning"
        >
          {t('main:menuNavigation.deleteButton')}
        </Modal.ConfirmButton>
      </Modal.Footer>
    </Modal>
  );
};
