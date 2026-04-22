import React from 'react';
import { Streamdown } from 'streamdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Button } from '@docs-front/ui';
import {
  diffBeforeBasicComponents,
  diffAfterBasicComponents
} from '@/markdown/components/BasigComponents/BasicComponents';
import { createCustomComponents } from '@/markdown/components/CustomComponents/CustomComponents';
import {
  StyledDiffWrap,
  StyledDiffButtonGroup
} from '@/markdown/components/DiffComponents/DiffComponents.style';
import { hastNodeToMarkdown } from '@/schema/main/diff';
import { useI18n } from '@/hooks/useI18n';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import { patchProduct } from '@/api/products/mutation';
import { useParams } from '@tanstack/react-router';
import DocshuntMarkdown from '@/markdown/DocshuntMarkdown';
import { getDocumentOptions } from '@/query/options/products';
import { syncDiffIdsFromDOM, useDiffNavStore } from '@/store/useDiffNavStore';
import { scrollToId } from '@/utils/scroll';

interface DiffWrapProps {
  children: React.ReactNode;
  id: string;
}

/**
 * Before/After 마크다운을 비교하여 보여주는 Diff 컴포넌트
 */
function DiffWrap(props: DiffWrapProps) {
  const { t } = useI18n('common');

  const childArray = React.Children.toArray(props.children);

  const beforeNode = childArray.find(
    (n: React.ReactNode) => React.isValidElement(n) && n.type === DiffBefore
  );
  const afterNode = childArray.find(
    (n: React.ReactNode) => React.isValidElement(n) && n.type === DiffAfter
  );

  const id = props['id'] || '';

  const { productId } = useParams({ from: '/_authenticated/c/$productId' });

  const queryClient = useQueryClient();

  const nextIdRef = React.useRef<string | null>(null);
  const fallbackIndexRef = React.useRef<number | null>(null);

  const getPagedArea = () =>
    window.document.querySelector<HTMLElement>('.pagedjs-preview-area');

  const waitForPagedRendered = (pagedArea: HTMLElement) =>
    new Promise<void>((resolve) => {
      let settled = false;

      const done = () => {
        if (settled) return;
        settled = true;
        pagedArea.removeEventListener('pagedjs-rendered', onRendered);
        window.clearTimeout(timeout);
        resolve();
      };

      const onRendered = () => done();
      const timeout = window.setTimeout(done, 1200);

      pagedArea.addEventListener('pagedjs-rendered', onRendered, {
        once: true
      });
    });

  const { data: documentData } = useSuspenseQuery(
    getDocumentOptions(Number(productId))
  );

  const { content: markdown } = documentData;

  const { mutate: patchDocumentContentMutate } = useMutation({
    onMutate: (variables) => {
      queryClient.setQueryData(getDocumentOptions(Number(productId)).queryKey, {
        ...documentData,
        content: variables
      });
    },
    mutationFn: (markdown: string) => {
      return patchProduct(Number(productId), markdown);
    },
    onSuccess: async () => {
      // 서버에서 최신 상태를 가져와서 캐시 업데이트
      await queryClient.invalidateQueries({
        queryKey: getDocumentOptions(Number(productId)).queryKey
      });

      const pagedArea = getPagedArea();
      if (pagedArea) {
        await waitForPagedRendered(pagedArea);
        syncDiffIdsFromDOM(pagedArea);
        const ids = useDiffNavStore.getState().ids;
        const targetId =
          nextIdRef.current && ids.includes(nextIdRef.current)
            ? nextIdRef.current
            : fallbackIndexRef.current !== null && ids.length > 0
              ? ids[Math.min(fallbackIndexRef.current, ids.length - 1)] ?? null
              : null;
        scrollToId(targetId, { root: pagedArea, mode: 'instant' });
      }

      nextIdRef.current = null;
      fallbackIndexRef.current = null;
    }
  });

  const beforeMd =
    beforeNode && React.isValidElement(beforeNode) && beforeNode.props.node
      ? hastNodeToMarkdown(beforeNode.props.node.children)
      : '';
  const afterMd =
    afterNode && React.isValidElement(afterNode) && afterNode.props.node
      ? hastNodeToMarkdown(afterNode.props.node.children)
      : '';

  if (!beforeMd && !afterMd) {
    return null;
  }

  const diffBeforeCustomComponents = createCustomComponents('diff-before');
  const diffAfterCustomComponents = createCustomComponents('diff-after');

  if (!markdown) {
    throw new Error('Markdown is not found');
  }

  const handleCancel = () => {
    const pagedArea = getPagedArea();
    if (pagedArea) {
      syncDiffIdsFromDOM(pagedArea);
    }
    const ids = useDiffNavStore.getState().ids;
    const currentIndex = ids.indexOf(id);
    fallbackIndexRef.current = currentIndex >= 0 ? currentIndex : null;
    nextIdRef.current =
      currentIndex >= 0 ? ids[currentIndex + 1] ?? ids[currentIndex - 1] ?? null : null;
    patchDocumentContentMutate(
      DocshuntMarkdown.from(markdown).cancel([id]).markdown
    );
  };

  const handleApply = () => {
    const pagedArea = getPagedArea();
    if (pagedArea) {
      syncDiffIdsFromDOM(pagedArea);
    }
    const ids = useDiffNavStore.getState().ids;
    const currentIndex = ids.indexOf(id);
    fallbackIndexRef.current = currentIndex >= 0 ? currentIndex : null;
    nextIdRef.current =
      currentIndex >= 0 ? ids[currentIndex + 1] ?? ids[currentIndex - 1] ?? null : null;
    patchDocumentContentMutate(
      DocshuntMarkdown.from(markdown).apply([id]).markdown
    );
  };

  const cancelButtonId = id ? `${id}-cancel` : undefined;
  const applyButtonId = id ? `${id}-apply` : undefined;

  return (
    <StyledDiffWrap id={id} data-diffwrap="true">
      <Streamdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          ...diffBeforeBasicComponents,
          ...diffBeforeCustomComponents
        }}
        parseIncompleteMarkdown={false}
      >
        {beforeMd}
      </Streamdown>

      <Streamdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          ...diffAfterBasicComponents,
          ...diffAfterCustomComponents
        }}
        parseIncompleteMarkdown={false}
      >
        {afterMd}
      </Streamdown>

      <StyledDiffButtonGroup>
        <Button
          variant="outlined"
          size="medium"
          id={cancelButtonId}
          onClick={handleCancel}
        >
          {t('common:button.cancel')}
        </Button>
        <Button
          variant="filled"
          size="medium"
          id={applyButtonId}
          onClick={handleApply}
        >
          {t('common:button.apply')}
        </Button>
      </StyledDiffButtonGroup>
    </StyledDiffWrap>
  );
}

function DiffBefore(props: { children?: React.ReactNode }) {
  return <>{props.children}</>;
}
function DiffAfter(props: { children?: React.ReactNode }) {
  return <>{props.children}</>;
}

export const diffComponents = {
  diffwrap: DiffWrap,
  diffbefore: DiffBefore,
  diffafter: DiffAfter
};
