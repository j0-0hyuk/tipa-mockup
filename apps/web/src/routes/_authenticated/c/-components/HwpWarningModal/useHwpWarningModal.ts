import { useState, useCallback } from 'react';

type WarningType = 'hwp' | 'unsupported' | 'filesize';

export function useHwpWarningModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [warningType, setWarningType] = useState<WarningType>('hwp');

  const openModal = useCallback((type: WarningType) => {
    setWarningType(type);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const validateFile = useCallback(
    (file: File): boolean => {
      const MAX_FILE_SIZE = 30 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        openModal('filesize');
        return false;
      }

      const hangulTypes = [
        'application/vnd.hancom.hwp',
        'application/haansofthwp',
        'application/x-hwp'
      ];

      const isHwpx = file.name.endsWith('.hwpx');
      const isDocx = file.name.endsWith('.docx');
      const isPdf = file.name.endsWith('.pdf');
      const isHwp =
        file.name.endsWith('.hwp') || hangulTypes.includes(file.type);

      if (!isHwpx && !isDocx && !isPdf && !isHwp) {
        openModal('unsupported');
        return false;
      }

      return true;
    },
    [openModal]
  );

  return {
    isOpen,
    warningType,
    openModal,
    closeModal,
    validateFile
  };
}
