import { useSuspenseQuery } from '@tanstack/react-query';
import {
  StyledDraftListPosition,
  StyledDraftCard,
  StyledItemName,
  StyledDraftListContent,
  StyledButtonWrapper
} from '@/routes/_authenticated/c/-components/RecentDraftList/RecentDraftList.style';
import { getProductsQueryOptions } from '@/query/options/products';
import { useNavigate } from '@tanstack/react-router';
import { Button, Flex } from '@docs-front/ui';
import { Columns2 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

export default function RecentDraftList() {
  const navigate = useNavigate();
  const { t } = useI18n(['main']);
  const { data } = useSuspenseQuery(getProductsQueryOptions());
  const handleCardClick = (id: string) => {
    navigate({ to: `/c/${id}` });
  };

  return (
    <StyledDraftListPosition>
      <StyledDraftListContent>
        {data.map((e) => (
          <StyledDraftCard
            key={e.id}
            onClick={() => handleCardClick(e.id.toString())}
          >
            <StyledItemName>
              {e.itemName || t('main:recentDraftList.defaultItemName')}
            </StyledItemName>
            <StyledButtonWrapper>
              <Button variant="outlined" size="medium">
                <Flex direction="row" gap={4} alignItems="center">
                  <Columns2 size={18} />
                  {t('main:recentDraftList.openButton')}
                </Flex>
              </Button>
            </StyledButtonWrapper>
          </StyledDraftCard>
        ))}
      </StyledDraftListContent>
    </StyledDraftListPosition>
  );
}
