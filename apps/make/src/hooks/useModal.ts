import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { overlay } from 'overlay-kit';

interface UseModalOptions {
  onClose?: () => void;
}

interface ModalRenderProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UseModalReturn {
  openModal: (render: (props: ModalRenderProps) => ReactNode) => string;
  closeModal: () => void;
  isOpen: boolean;
}

export const useModal = (options?: UseModalOptions): UseModalReturn => {
  const [overlayId, setOverlayId] = useState<string | null>(null);

  const openModal = useCallback(
    (render: (props: ModalRenderProps) => ReactNode) => {
      if (overlayId) {
        overlay.unmount(overlayId);
      }

      const id = overlay.open(({ isOpen, close }) =>
        render({
          isOpen,
          onClose: () => {
            options?.onClose?.();
            close();
            setOverlayId(null);
          }
        })
      );

      setOverlayId(id);
      return id;
    },
    [overlayId, options]
  );

  const closeModal = useCallback(() => {
    if (overlayId) {
      overlay.unmount(overlayId);
      setOverlayId(null);
      options?.onClose?.();
    }
  }, [overlayId, options]);

  useEffect(() => {
    return () => {
      if (overlayId) {
        overlay.unmount(overlayId);
      }
    };
  }, [overlayId]);

  return {
    openModal,
    closeModal,
    isOpen: Boolean(overlayId)
  };
};
