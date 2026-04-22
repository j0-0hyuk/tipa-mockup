import { getAccountMeQueryOptions } from '@/query/options/account';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useMemo } from 'react';
import { Tally } from '@/components/Tally';
import { StyledTallyWrapper } from '@/routes/_authenticated/f/output/-components/Tally/ExportedProductTally.style';

export default function ExportedProductTally() {
  const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());
  const { productFileId } = useParams({
    from: '/_authenticated/f/output/$productFileId'
  });

  const tallyUrl = useMemo(
    () => `https://tally.so/embed/PdDA1d?hideTitle=1&dynamicHeight=1&userId=${me.id}&plan=${me.hasProAccess ? 'pro' : 'free'}&productFileId=${productFileId}`,
    [me.id, me.hasProAccess, productFileId]
  );

  return (
    <StyledTallyWrapper>
      <Tally tallyUrl={tallyUrl} title="" />
    </StyledTallyWrapper>
  );
}
