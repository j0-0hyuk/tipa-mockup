import { ChevronRight, X } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { getMetaQueryOptions } from '@/query/options/meta';
import { Suspense, useMemo } from 'react';
import { Flex, SourceDefault } from '@docs-front/ui';
import { useI18n } from '@/hooks/useI18n';
import { v4 as uuidv4 } from 'uuid';
import type { SourcePopoverProps } from '@/markdown/components/CustomComponents/SourcePopover/SourcePopover.schema';
import {
  PopoverWrapper,
  StyledPopoverContent,
  StyledContentList,
  StyledTrigger,
  StyledFavicon,
  StyledSourceTitle,
  StyledSourceCard,
  StyledSourceDescription,
  StyledHeader,
  StyledHeaderTitle,
  StyledCloseButton
} from '@/markdown/components/CustomComponents/SourcePopover/SourcePopover.style';

function SourcePopoverContentInternal({ sourceUrls }: SourcePopoverProps) {
  const { t } = useI18n(['main']);
  const results = useSuspenseQueries({
    queries: sourceUrls.map((url) => getMetaQueryOptions(url))
  });

  const sourcesMetadata = results
    .map((result, index) => {
      if (!result.data || result.error) {
        return null;
      }
      return {
        logo: result.data.logo || '',
        title: result.data.title || sourceUrls[index],
        description: result.data.description || '',
        url: result.data.url || sourceUrls[index]
      };
    })
    .filter((source): source is NonNullable<typeof source> => source !== null);

  return (
    <>
      <StyledHeader>
        <StyledHeaderTitle>
          {t('main:sourcePopover.headerTitle')}
        </StyledHeaderTitle>
        <StyledCloseButton
          onClick={(e) => {
            e.stopPropagation();
            const wrapper = (e.currentTarget as HTMLElement).closest(
              '.popover-trigger-wrapper'
            );
            if (wrapper) {
              wrapper.classList.remove('active');
            }
          }}
        >
          <X />
        </StyledCloseButton>
      </StyledHeader>

      <StyledContentList>
        {sourcesMetadata.map((source, index) => (
          <StyledSourceCard
            key={source.url}
            isLast={index === sourcesMetadata.length - 1}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {source.description && (
              <StyledSourceDescription>
                {source.description}
              </StyledSourceDescription>
            )}
            <Flex direction={'row'} gap={6}>
              {source.logo ? (
                <StyledFavicon src={source.logo} alt={source.title} />
              ) : (
                <SourceDefault />
              )}
              <StyledSourceTitle>{source.title}</StyledSourceTitle>
            </Flex>
          </StyledSourceCard>
        ))}
      </StyledContentList>
    </>
  );
}

export default function SourcePopover({ sourceUrls }: SourcePopoverProps) {
  const theme = useTheme();
  const { t } = useI18n(['main']);
  const triggerId = useMemo(() => uuidv4(), []);

  return (
    <Suspense fallback={<SourceDefault />}>
      <PopoverWrapper className="popover-trigger-wrapper">
        <StyledTrigger id={triggerId} type="button">
          {t('main:sourcePopover.trigger', { count: sourceUrls.length })}
          <ChevronRight size={12} color={theme.color.textGray} />
        </StyledTrigger>

        <StyledPopoverContent className="popover-content">
          <SourcePopoverContentInternal sourceUrls={sourceUrls} />
        </StyledPopoverContent>
      </PopoverWrapper>
    </Suspense>
  );
}
