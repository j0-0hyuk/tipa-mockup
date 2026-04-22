import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { useI18n } from '@/hooks/useI18n.ts';
import { Check } from 'lucide-react';
import {
  StyledChangeScheduledModal,
  StyledChangeScheduledModalBody,
  StyledChangeScheduledModalContent,
  StyledChangeScheduledModalIcon,
  StyledChangeScheduledModalTitle,
  StyledChangeScheduledModalDescription,
  StyledChangeScheduledModalButton
} from '@/routes/_authenticated/credit-plan/-components/ChangeScheduledModal.style';
import { Modal, Flex } from '@docs-front/ui';

interface ChangeScheduledModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: string;
  effectiveDate?: string;
}

export const ChangeScheduledModal = ({
  isOpen,
  onClose,
  plan,
  effectiveDate
}: ChangeScheduledModalProps) => {
  const { t } = useI18n(['creditPlan']);

  return (
    <AlertDialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <AlertDialogPrimitive.Overlay
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'fixed',
          inset: 0,
          zIndex: 0
        }}
      />
      <AlertDialogPrimitive.Content asChild>
        <StyledChangeScheduledModal>
          <StyledChangeScheduledModalBody>
            <StyledChangeScheduledModalContent>
              <StyledChangeScheduledModalIcon>
                <Check size={40} color="white" strokeWidth={4} />
              </StyledChangeScheduledModalIcon>
              <AlertDialogPrimitive.Title asChild>
                <StyledChangeScheduledModalTitle>
                  {t('creditPlan:changeScheduled.title')}
                </StyledChangeScheduledModalTitle>
              </AlertDialogPrimitive.Title>
              <AlertDialogPrimitive.Description asChild>
                <StyledChangeScheduledModalDescription>
                  {t('creditPlan:changeScheduled.description', {
                    plan: plan,
                    date: effectiveDate
                  })}
                </StyledChangeScheduledModalDescription>
              </AlertDialogPrimitive.Description>
            </StyledChangeScheduledModalContent>
            <AlertDialogPrimitive.Cancel asChild>
              <StyledChangeScheduledModalButton onClick={onClose}>
                {t('creditPlan:changeScheduled.confirm')}
              </StyledChangeScheduledModalButton>
            </AlertDialogPrimitive.Cancel>
          </StyledChangeScheduledModalBody>
        </StyledChangeScheduledModal>
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Root>
  );
};

interface ChangeScheduledConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nextBillingDate?: string;
  nextBillingAmount?: number;
  countryCode?: string;
}

export const ChangeScheduledConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  nextBillingDate,
  nextBillingAmount,
  countryCode
}: ChangeScheduledConfirmModalProps) => {
  const { t } = useI18n(['creditPlan']);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title={t('creditPlan:changeConfirm.title')} />
      <Modal.Body>
        <Flex direction="column" gap={8}>
          <div>{t('creditPlan:changeConfirm.description')}</div>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            {nextBillingDate && (
              <li>
                {t('creditPlan:changeConfirm.nextBillingDate')}:{' '}
                {nextBillingDate}
              </li>
            )}
            {nextBillingAmount && (
              <li>
                {t('creditPlan:changeConfirm.billingAmount')}:{' '}
                {countryCode === 'KRW'
                  ? `${nextBillingAmount?.toLocaleString()}원`
                  : `$${nextBillingAmount?.toLocaleString()}`}
              </li>
            )}
          </ul>
        </Flex>
      </Modal.Body>
      <Modal.Footer>
        <Flex gap={8}>
          <Modal.CancelButton>
            {t('creditPlan:changeConfirm.cancel')}
          </Modal.CancelButton>
          <Modal.ConfirmButton onClick={onConfirm}>
            {t('creditPlan:changeConfirm.confirm')}
          </Modal.ConfirmButton>
        </Flex>
      </Modal.Footer>
    </Modal>
  );
};

interface ChangeScheduledErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInquiry?: () => void;
}

export const ChangeScheduledErrorModal = ({
  isOpen,
  onClose,
  onInquiry
}: ChangeScheduledErrorModalProps) => {
  const { t } = useI18n(['creditPlan']);

  const handleInquiry = () => {
    if (onInquiry) {
      onInquiry();
    } else {
      window.open('https://tally.so/r/w4VY6Y', '_blank');
    }
  };

  const errorIcon = (
    <div
      style={{
        width: '29px',
        height: '29px',
        border: '2px solid #1A1A1C',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0
      }}
    >
      <div
        style={{
          width: '2px',
          height: '6px',
          backgroundColor: '#1A1A1C',
          position: 'absolute',
          top: '6px'
        }}
      />
      <div
        style={{
          width: '2px',
          height: '2px',
          backgroundColor: '#1A1A1C',
          position: 'absolute',
          bottom: '6px'
        }}
      />
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header icon={errorIcon} title={t('creditPlan:errorModal.title')} />
      <Modal.Body>
        <div style={{ fontSize: '16px', lineHeight: '28px', color: '#1A1A1C' }}>
          {t('creditPlan:errorModal.description')
            .split('<br/>')
            .map((part, index) => (
              <span key={index}>
                {index > 0 && <br />}
                {part.includes('<a>') ? (
                  <>
                    {part.split('<a>')[0]}
                    <a
                      onClick={handleInquiry}
                      style={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: '#1A1A1C'
                      }}
                    >
                      {t('creditPlan:errorModal.inquiryButton')}
                    </a>
                    {part.split('</a>')[1]}
                  </>
                ) : (
                  part
                )}
              </span>
            ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Flex gap={8}>
          <Modal.CancelButton onClick={handleInquiry}>
            {t('creditPlan:errorModal.inquiryButton')}
          </Modal.CancelButton>
          <Modal.ConfirmButton onClick={onClose}>
            {t('creditPlan:errorModal.confirmButton')}
          </Modal.ConfirmButton>
        </Flex>
      </Modal.Footer>
    </Modal>
  );
};

interface ExistingProUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExistingProUserModal = ({
  isOpen,
  onClose
}: ExistingProUserModalProps) => {
  const { t } = useI18n(['pricing']);

  const handlePolicyLink = () => {
    window.open('/credit-policy', '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title={t('pricing:existingProModal.title')} />
      <Modal.Body>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>
            <span style={{ fontWeight: 600 }}>
              {t('pricing:existingProModal.point1Bold')}
            </span>
            {t('pricing:existingProModal.point1Rest')}
          </li>
          <li>
            <span style={{ fontWeight: 600 }}>
              {t('pricing:existingProModal.point2Bold')}
            </span>
            {t('pricing:existingProModal.point2Rest')}
          </li>
          <li>
            {t('pricing:existingProModal.point3Pre')}
            <a
              onClick={handlePolicyLink}
              style={{
                cursor: 'pointer',
                textDecoration: 'underline',
                color: '#106AF9'
              }}
            >
              {t('pricing:existingProModal.point3Link')}
            </a>
            {t('pricing:existingProModal.point3Post')}
          </li>
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Flex gap={8}>
          <Modal.CancelButton onClick={onClose}>
            {t('pricing:existingProModal.cancel')}
          </Modal.CancelButton>
          <Modal.ConfirmButton onClick={onClose}>
            {t('pricing:existingProModal.confirm')}
          </Modal.ConfirmButton>
        </Flex>
      </Modal.Footer>
    </Modal>
  );
};
