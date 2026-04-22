import { useSuspenseQuery } from '@tanstack/react-query';
import { getProductsQueryOptions } from '@/query/options/products';
import { Flex } from '@docs-front/ui';
import { StyledDraftTitle } from '@/routes/_authenticated/d/-components/DraftSection/DraftSection.style';
import { DraftCard } from '@/routes/_authenticated/d/-components/DraftSection/components/DraftCard/DraftCard';
import {
  EmptyStateButton,
  EmptyStateText
} from '@/routes/_authenticated/d/-components/ExportSection/DocsList/DocsList.style';
import { useNavigate } from '@tanstack/react-router';
import { useTheme } from '@emotion/react';

export default function DraftSection() {
  const { data } = useSuspenseQuery(getProductsQueryOptions());
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Flex direction="column" width="100%" padding="0px 0px 64px 0px">
      <StyledDraftTitle>제목</StyledDraftTitle>
      {data.length === 0 ? (
        <Flex
          direction="column"
          gap={10}
          width="100%"
          alignItems="center"
          padding="48px 0px"
          justify="center"
          style={{
            borderBottom: `1px solid ${theme.color.borderLightGray}`
          }}
        >
          <EmptyStateText>{'아직 생성한 초안이 없습니다.'}</EmptyStateText>
          <Flex>
            <EmptyStateButton
              type="button"
              variant="outlined"
              size="medium"
              onClick={() => {
                navigate({ to: '/start' });
              }}
            >
              초안 생성하기
            </EmptyStateButton>
          </Flex>
        </Flex>
      ) : (
        data.map((product) => (
          <DraftCard
            key={product.id}
            productId={product.id}
            itemName={product.itemName}
          />
        ))
      )}
    </Flex>
  );
}
