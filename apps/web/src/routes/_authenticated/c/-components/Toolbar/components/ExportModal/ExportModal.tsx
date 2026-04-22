import { useEffect, useRef } from 'react';
import {
  StyledMenuItem,
  StyledModal
} from '@/routes/_authenticated/c/-components/Toolbar/components/ExportModal/ExportModal.style';
import { useI18n } from '@/hooks/useI18n';
import { exportDocx } from '@/markdown/utils/exportDocx';
import { exportHwpx } from '@/markdown/utils/exportHwpx';
import { exportPdf } from '@/markdown/utils/exportPdf';

interface ExportModalProps {
  onClose: () => void;
  itemName: string;
}

export default function ExportModal({ onClose, itemName }: ExportModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n(['main']);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleExportHwpx = () => {
    exportHwpx({ itemName: itemName ?? '사업계획서' });
    onClose();
  };

  const handleExportDocx = () => {
    exportDocx({ itemName: itemName ?? '사업계획서' });
    onClose();
  };

  const handleExportPdf = () => {
    exportPdf({
      fileName: `${itemName ?? '사업계획서'}.pdf`
    });
    onClose();
  };

  return (
    <StyledModal ref={modalRef}>
      <StyledMenuItem onClick={handleExportHwpx}>
        {t('main:export.drawer.method.options.hwpx')}
      </StyledMenuItem>
      <StyledMenuItem onClick={handleExportDocx}>
        {t('main:export.drawer.method.options.docx')}
      </StyledMenuItem>
      <StyledMenuItem onClick={handleExportPdf}>
        {t('main:export.drawer.method.options.pdf')}
      </StyledMenuItem>
    </StyledModal>
  );
}
