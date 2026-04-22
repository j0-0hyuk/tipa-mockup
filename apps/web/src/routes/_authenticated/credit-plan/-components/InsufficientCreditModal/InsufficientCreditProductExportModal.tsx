import { Modal } from '@docs-front/ui';
import { Info } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n.ts';
import { useTheme } from '@emotion/react';
import { useNavigate } from '@tanstack/react-router';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  totalCredit: number;
  productExportCredit: number;
}

export const InsufficientCreditProductExportModal = ({
  isOpen,
  onClose,
  totalCredit,
  productExportCredit
}: Props) => {
  const { t } = useI18n(['creditPlan']);
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header
        icon={<Info size="24px" />}
        title={t('creditPlan:insufficient.title')}
      />
      <Modal.Body>
        <div>
          {t('creditPlan:insufficient.productExportDescription', {
            credit: productExportCredit
          })}
        </div>
        <div>
          {t('creditPlan:insufficient.remaining', {
            remaining: totalCredit
          })}
        </div>
        <br />
        <div style={{ color: theme.color.main, fontWeight: 600 }}>
          {t('creditPlan:insufficient.needed', {
            needed: productExportCredit - totalCredit
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Modal.CancelButton>
          {t('creditPlan:insufficient.close')}
        </Modal.CancelButton>
        <Modal.ConfirmButton
          onClick={() => {
            onClose();
            navigate({ to: '/credit-plan' });
          }}
        >
          {t('creditPlan:insufficient.fillCredit')}
        </Modal.ConfirmButton>
      </Modal.Footer>
    </Modal>
  );
};
