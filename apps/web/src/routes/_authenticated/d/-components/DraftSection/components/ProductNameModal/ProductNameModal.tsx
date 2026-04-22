import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchProductMeta } from '@/api/products/mutation';
import i18n from '@/i18n';
import { Modal } from '@docs-front/ui';
import { StyledProductNameModalInput } from '@/routes/_authenticated/d/-components/DraftSection/components/ProductNameModal/ProductNameModal.style';
import {
  getDocumentOptions,
  getProductsQueryOptions
} from '@/query/options/products';

interface ProductNameModalProps {
  onClose: () => void;
  productId: number;
  itemName: string;
}

export const ProductNameModal = ({
  onClose,
  productId,
  itemName
}: ProductNameModalProps) => {
  const t = i18n.t;
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>(itemName?.trim() || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const mutation = useMutation({
    mutationFn: () => patchProductMeta(productId, { itemName: name }),
    onSuccess: () => {
      queryClient.invalidateQueries(getProductsQueryOptions());
      queryClient.invalidateQueries(getDocumentOptions(productId));
      onClose();
    }
  });

  const handleSave = () => {
    if (!name.trim()) return;
    mutation.mutate();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <Modal.Header title={t('main:menuNavigation.rename')} />
      <Modal.Body>
        <StyledProductNameModalInput
          ref={inputRef}
          placeholder={t('main:menuNavigation.placeholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </Modal.Body>
      <Modal.Footer>
        <Modal.CancelButton onClick={onClose}>
          {t('main:menuNavigation.cancel')}
        </Modal.CancelButton>
        <Modal.ConfirmButton onClick={handleSave} disabled={mutation.isPending}>
          {t('main:menuNavigation.save')}
        </Modal.ConfirmButton>
      </Modal.Footer>
    </Modal>
  );
};
