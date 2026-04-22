import {
  StyledNavItemContainer,
  StyledNavItemLabel
} from '@/routes/_authenticated/-components/SideNavigation/components/deprecated/NavItem/NavItem.style';
import { Flex, Skeleton, Tooltip } from '@docs-front/ui';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useI18n } from '@/hooks/useI18n';
import { FileWarning } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { getDocumentOptions } from '@/query/options/products';

interface NavItemProps {
  label?: string | null;
  icon?: React.ReactNode;
  onClick: () => void;
  open?: boolean;
  productId: number;
  currentProductId: number | null;
}

export default function NavItem({
  label,
  icon,
  onClick,
  open = true,
  productId,
  currentProductId
}: NavItemProps) {
  const { t } = useI18n(['main']);
  const theme = useTheme();
  const { data: document } = useSuspenseQuery(getDocumentOptions(productId));

  const status = document.generationStatus;
  const isCurrent = currentProductId === productId;

  const container = (
    <StyledNavItemContainer $isCurrent={isCurrent} onClick={onClick}>
      {status === 'COMPLETED' && (
        <Flex alignItems="center" justify="start" gap="8px">
          {icon}
          {open && (
            <StyledNavItemLabel>{label ?? '새 사업계획서'}</StyledNavItemLabel>
          )}
        </Flex>
      )}

      {status === 'PROGRESS' && (
        <Skeleton loading={true} width="75%" height="20px" />
      )}

      {status === 'FAILED' && (
        <Flex alignItems="center" justify="start" gap="8px">
          <FileWarning size={20} color={theme.color.error} />
          {open && (
            <StyledNavItemLabel>
              <p style={{ color: theme.color.error }}>
                {t('main:navItem.generationFailed')}
              </p>
            </StyledNavItemLabel>
          )}
        </Flex>
      )}
    </StyledNavItemContainer>
  );

  if (status === 'PROGRESS') {
    return (
      <Tooltip content={t('main:tooltip.generate')} side="right">
        {container}
      </Tooltip>
    );
  }

  if (status === 'FAILED') {
    return (
      <Tooltip content={t('main:tooltip.regenerate')}>{container}</Tooltip>
    );
  }

  return container;
}

interface NavIconProps {
  label?: string | null;
  icon?: React.ReactNode;
  onClick: () => void;
  open?: boolean;
  isActive?: boolean;
}

export function NavIcon({
  icon,
  onClick,
  label,
  open = true,
  isActive = false
}: NavIconProps) {
  return (
    <StyledNavItemContainer
      onClick={onClick}
      $isCurrent={isActive}
      $isSetOpen={open}
    >
      <Flex alignItems="center" justify="start" gap="8px">
        {icon}
        {open && (
          <StyledNavItemLabel $isCurrent={isActive}>{label}</StyledNavItemLabel>
        )}
      </Flex>
    </StyledNavItemContainer>
  );
}
