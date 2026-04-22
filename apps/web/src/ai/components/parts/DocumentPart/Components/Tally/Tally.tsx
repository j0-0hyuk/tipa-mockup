import {
  StyledTallyDescription,
  StyledTallyWrapper
} from '@/ai/components/parts/DocumentPart/Components/Tally/Tally.style';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useI18n } from '@/hooks/useI18n';
import { Tally as TallyEmbed } from '@/components/Tally';

export default function Tally() {
  const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());
  const { t } = useI18n('main');
  const tallyUrl = me.hasProAccess
    ? `https://tally.so/embed/rjD4bM?transparentBackground=1&dynamicHeight=1&hideTitle=1&userId=${me.id}&email=${me.email}`
    : `https://tally.so/embed/44B8bA?transparentBackground=1&dynamicHeight=1&hideTitle=1&userId=${me.id}&email=${me.email}`;

  return (
    <StyledTallyWrapper>
      <StyledTallyDescription>
        {t('chat.tally.description')}
      </StyledTallyDescription>
      <TallyEmbed tallyUrl={tallyUrl} />
    </StyledTallyWrapper>
  );
}
