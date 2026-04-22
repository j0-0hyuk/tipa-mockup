import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@docs-front/ui';
import { FileClock } from 'lucide-react';
import HistoryModal from '@/routes/_authenticated/c/-components/Toolbar/components/deprecated/HistoryModal/HistoryModal';
import { getProductFilesQueryOptions } from '@/query/options/products';
import { useSuspenseQuery } from '@tanstack/react-query';
import { StyledExportHistoryButtonCount } from '@/routes/_authenticated/c/-components/Toolbar/components/deprecated/HistoryButton/HistoryButton.style';
import { useI18n } from '@/hooks/useI18n';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { useBreakPoints } from '@/hooks/useBreakPoints';

export default function HistoryButton({ productId }: { productId: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isMobile } = useBreakPoints();
  const buttonRef = useRef<HTMLDivElement>(null);
  const { data } = useSuspenseQuery(
    getProductFilesQueryOptions(productId, { filter: 'EXPORT' })
  );
  const { data: account } = useSuspenseQuery(getAccountMeQueryOptions());
  const hasProAccess = account.hasProAccess;
  const { t } = useI18n(['common']);
  const progressCount = useMemo(() => {
    return data.filter((file) => file.status === 'PROGRESS').length;
  }, [data]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div ref={buttonRef} style={{ position: 'relative' }}>
      <Button
        variant={isMobile ? 'text' : 'outlined'}
        size="medium"
        disabled={!hasProAccess}
        onClick={toggleModal}
      >
        <FileClock size={20} />
        {!isMobile && t('common:button.exportHistory')}
      </Button>
      {progressCount > 0 && (
        <StyledExportHistoryButtonCount>
          {progressCount}
        </StyledExportHistoryButtonCount>
      )}
      <HistoryModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
