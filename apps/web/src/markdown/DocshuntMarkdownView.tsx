import {
  StyledBlurWrapper,
  StyledCanvas,
  StyledCanvasBlur,
  StyledCanvasBlurContent,
  StyledSkeletonPage
} from '@/markdown/DocshuntMarkdownView.style';
import { Flex } from '@docs-front/ui';
import { Skeleton } from '@docs-front/ui';
import { useI18n } from '@/hooks/useI18n';
import { Button } from '@docs-front/ui';
import { usePagedPreview } from '@/markdown/paged';
import { fakeDocument } from '@/constants/fakeDocument';
import Streamdown from '@/markdown/Streamdown';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { useSuspenseQuery } from '@tanstack/react-query';
import { PricingPlanModal } from '@/routes/_authenticated/credit-plan/-components/PricingPlanModal/PricingPlanModal';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { DiffNavController } from '@/markdown/components/DiffComponents/DiffNavController';

interface DocshuntMarkdownViewProps {
  document: string;
  hasDiff?: boolean;
}
export default function DocshuntMarkdownView({
  document
}: DocshuntMarkdownViewProps) {
  const { data: account } = useSuspenseQuery(getAccountMeQueryOptions());
  const hasProAccess = account.hasProAccess;
  const { isMobile } = useBreakPoints();
  return (
    <StyledCanvas id="markdown-canvas" $isSm={isMobile}>
      {hasProAccess ? (
        <DocshuntMarkdownViewPro document={document} />
      ) : (
        <DocshuntMarkdownViewFree document={document} />
      )}
    </StyledCanvas>
  );
}

export function DocshuntMarkdownViewSkeleton() {
  const { sm } = useBreakPoints();
  return (
    <StyledCanvas $isSm={sm}>
      {Array.from({ length: 5 }).map((_, pageIndex) => (
        <StyledSkeletonPage $isSm={sm} key={pageIndex}>
          {Array.from({ length: 2 }).map((_, groupIndex) => (
            <Flex
              key={groupIndex}
              width={'100%'}
              gap={sm ? 6 : 9}
              direction="column"
            >
              <Skeleton
                width={'50%'}
                height={sm ? '10px' : '20px'}
                loading={true}
              />
              {Array.from({ length: sm ? 12 : 16 }).map((_, index) => (
                <Skeleton
                  key={index}
                  width={'100%'}
                  height={sm ? '10px' : '20px'}
                  loading={true}
                />
              ))}
            </Flex>
          ))}
        </StyledSkeletonPage>
      ))}
    </StyledCanvas>
  );
}

function DocshuntMarkdownViewPro({ document }: DocshuntMarkdownViewProps) {
  const { contentRef, previewRef } = usePagedPreview(document);

  return (
    <>
      <DiffNavController />

      <div ref={contentRef} className="pagedjs-preview-area" />
      <div ref={previewRef} style={{ display: 'none' }}>
        <Streamdown>{document}</Streamdown>
      </div>
    </>
  );
}

function DocshuntMarkdownViewFree({ document }: DocshuntMarkdownViewProps) {
  const { contentRef: contentRef1, previewRef: previewRef1 } =
    usePagedPreview(document);
  const { contentRef: contentRef2, previewRef: previewRef2 } = usePagedPreview(
    fakeDocument,
    undefined,
    { blur: true }
  );
  const { t } = useI18n(['creditPlan']);
  const slicedDocument = document.split('\n').slice(0, 50).join('\n');
  const { sm } = useBreakPoints();

  return (
    <>
      <div ref={contentRef1} className="pagedjs-preview-area" />
      <div ref={previewRef1} style={{ display: 'none' }}>
        <Streamdown>{slicedDocument}</Streamdown>
      </div>
      <StyledBlurWrapper>
        <div ref={contentRef2} className="pagedjs-preview-blur" />
        <div ref={previewRef2} style={{ display: 'none' }}>
          <Streamdown>{fakeDocument}</Streamdown>
        </div>
        <StyledCanvasBlur>
          <StyledCanvasBlurContent $isSm={sm}>
            <h2>{t('creditPlan:blurContent.title')}</h2>
            <p>{t('creditPlan:blurContent.description')}</p>
            <Flex justify="center" alignItems="center">
              <PricingPlanModal>
                <Button variant="filled" size="medium">
                  {t('creditPlan:blurContent.upgradeButton')}
                </Button>
              </PricingPlanModal>
            </Flex>
          </StyledCanvasBlurContent>
        </StyledCanvasBlur>
      </StyledBlurWrapper>
    </>
  );
}
