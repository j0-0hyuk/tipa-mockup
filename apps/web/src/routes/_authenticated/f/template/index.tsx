import { Flex } from '@docs-front/ui';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useModal } from '@/hooks/useModal';
import { AllCreditsExhaustedModal } from '@/routes/_authenticated/credit-plan/-components/InsufficientCreditModal/AllCreditsExhaustedModal';
import { DocsTemplates } from '@/routes/_authenticated/f/template/-components/DocsTemplates/DocsTemplates';
import { StyledFunnelContentWrapper } from '@/routes/_authenticated/f/-route.style';

const templateSortSchema = z
  .enum(['deadline', 'updated', 'supportAmount'])
  .transform((value) => (value === 'supportAmount' ? 'updated' : value));
const templateSearchQuerySchema = z
  .preprocess((value) => (typeof value === 'string' ? value : ''), z.string())
  .transform((value) =>
    value
      .normalize('NFC')
      .replace(/\s+/g, ' ')
      .trim()
  )
  .transform((value) => (value.length > 0 ? value : undefined));

const templateSearchSchema = z.object({
  page: z.number().optional().default(1),
  search: templateSearchQuerySchema.optional(),
  sort: templateSortSchema.optional().default('deadline')
});

export const Route = createFileRoute('/_authenticated/f/template/')({
  validateSearch: templateSearchSchema,
  component: RouteComponent,
  beforeLoad: () => {
    sessionStorage.setItem('f-funnel-data', JSON.stringify({
      step: 'template'
    }));
    sessionStorage.removeItem('f-visual-suggestions');
  }
});

function RouteComponent() {
  const modal = useModal();
  const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());
  const { page, search, sort } = Route.useSearch();

  const checkCreditBeforeAction = (): boolean | 'pending' => {
    if (!me.hasProAccess) {
      return true;
    }

    const hasAvailableCredit =
      me.freeCredit >= me.productExportCredit || me.paidCredit > 0;

    if (!hasAvailableCredit) {
      modal.openModal(({ isOpen, onClose }) => (
        <AllCreditsExhaustedModal isOpen={isOpen} onClose={onClose} />
      ));
      return 'pending';
    }

    return true;
  };

  return (
    <Flex direction="column" width="100%" gap="24px" flex={1} minHeight="0px" padding="0 0 20px 0">
      <StyledFunnelContentWrapper>
        <DocsTemplates
          page={page || 1}
          search={search}
          sort={sort}
          checkCreditBeforeAction={checkCreditBeforeAction}
        />
      </StyledFunnelContentWrapper>
    </Flex >
  );
}
