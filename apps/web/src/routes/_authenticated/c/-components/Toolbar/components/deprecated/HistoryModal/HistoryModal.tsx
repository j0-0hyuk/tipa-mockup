import { X } from 'lucide-react';
import {
  StyledHistoryModal,
  StyledHeader,
  StyledTitle
} from '@/routes/_authenticated/c/-components/Toolbar/components/deprecated/HistoryModal/HistoryModal.stlye';
import { IconButton } from '@docs-front/ui';
import { HistoryItems } from '@/routes/_authenticated/c/-components/Toolbar/components/deprecated/HistoryItem/HistoryItem';
import { useMatchRoute } from '@tanstack/react-router';
import { useI18n } from '@/hooks/useI18n';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const matchRoute = useMatchRoute();
  const params = matchRoute({ to: '/c/$productId' });
  const { t } = useI18n(['main']);

  if (!params) {
    return null;
  }

  return (
    <StyledHistoryModal isOpen={isOpen}>
      <StyledHeader>
        <StyledTitle>{t('main:export.history.title')}</StyledTitle>
        <IconButton variant="text" size="small" onClick={onClose}>
          <X size={20} />
        </IconButton>
      </StyledHeader>
      <HistoryItems productId={Number(params.productId)} />
    </StyledHistoryModal>
  );
}
