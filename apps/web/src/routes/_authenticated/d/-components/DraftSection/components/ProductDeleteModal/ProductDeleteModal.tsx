import { deleteProduct } from '@/api/products/mutation';
import { Modal } from '@docs-front/ui';
import { StyledProductDeleteModalDescription } from '@/routes/_authenticated/d/-components/DraftSection/components/ProductDeleteModal/ProductDeleteModal.style';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMatchRoute, useNavigate } from '@tanstack/react-router';
import i18n from '@/i18n';
import { getProductsQueryOptions } from '@/query/options/products';

interface ProductDeleteModalProps {
  onClose: () => void;
  productId: number;
}

export const ProductDeleteModal = ({
  onClose,
  productId
}: ProductDeleteModalProps) => {
  const t = i18n.t;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const matchRoute = useMatchRoute();
  const params = matchRoute({ to: '/c/$productId' });
  const locationId = params ? Number(params.productId) : -1;

  const mutation = useMutation<void>({
    mutationFn: () => deleteProduct(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries(getProductsQueryOptions());
      onClose();
      if (locationId === productId) {
        navigate({ to: '/start' });
      }
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
