import { useEffect, useRef, useState } from 'react';
import { Streamdown } from 'streamdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { customComponents } from '@/make/pages/demo/loading/components/CustomComponents/CustomComponents';
import { basicComponents } from '@/make/pages/demo/loading/components/BasicComponents/BasicComponents';
import { useLocation, useNavigate } from 'react-router-dom';
import { Flex, ProductCreationLoadingToast } from '@/packages/ui/src';
import { useMutation } from '@tanstack/react-query';
import { postMakeExport, postMakeProducts } from '@/apps/make/src/api/products';
import type {
  PostMakeExportRequest,
  PostMakeProductsRequest
} from '@/apps/make/src/schema/api/products';
import { captureAllElements } from '@/make/pages/demo/loading/utils/capture';
import {
  StyledHiddenContainer,
  StyledLoadingContainer
} from '@/make/pages/demo/loading/markdown.style';

export const DemoMarkdownPage = () => {
  const data = useLocation();
  const navigate = useNavigate();
  const {
    document,
    templateFile,
    productRequest,
    isLoading: initialLoading
  } = (data.state as {
    document?: string;
    templateFile?: File;
    productRequest?: PostMakeProductsRequest;
    isLoading?: boolean;
  }) || {};
  const containerRef = useRef<HTMLDivElement>(null);
  const hasSubmittedRef = useRef(false);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading || false);
  const [progress, setProgress] = useState(0);
  const [documentContent, setDocumentContent] = useState<string | null>(
    document || null
  );

  const { mutateAsync: createProducts } = useMutation({
    mutationFn: (arg: PostMakeProductsRequest) => postMakeProducts(arg)
  });

  const { mutate: exportDocument, isIdle } = useMutation({
    mutationFn: (data: PostMakeExportRequest) => {
      if (!templateFile) {
        throw new Error('Template file is required');
      }
      return postMakeExport({
        documentFormat: templateFile,
        productImages: data.productImages,
        productImagesMetaData: data.productImagesMetaData,
        userPrompt: documentContent || ''
      });
    },
    onSuccess: (response) => {
      setTimeout(() => {
        setIsLoading(false);
        window.document.body.style.overflow = '';
        const fileName = templateFile?.name || 'document.docx';
        navigate('/file', {
          state: {
            file: response.filled_file,
            fileName
          }
        });
      }, 500);
    },
    onError: () => {
      setIsLoading(false);
      hasSubmittedRef.current = false;
      window.document.body.style.overflow = '';
      navigate('/');
    }
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLoading) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isLoading]);

  useEffect(() => {
    if (
      !containerRef.current ||
      !templateFile ||
      hasSubmittedRef.current ||
      !isIdle
    )
      return;

    hasSubmittedRef.current = true;

    const processDocument = async () => {
      setIsLoading(true);
      setProgress(0);

      window.document.body.style.overflow = 'hidden';

      if (productRequest && !documentContent) {
        let firstRequestProgress = 0;
        const firstRequestInterval = setInterval(() => {
          firstRequestProgress = Math.min(firstRequestProgress + 1.5, 36);
          setProgress(firstRequestProgress);
          if (firstRequestProgress >= 36) {
            clearInterval(firstRequestInterval);
          }
        }, 1500);

        try {
          const response = await createProducts(productRequest);
          clearInterval(firstRequestInterval);
          const doc =
            typeof response.content === 'string'
              ? response.content
              : JSON.stringify(response.content);
          setDocumentContent(doc);
          setProgress(40);
        } catch (error) {
          clearInterval(firstRequestInterval);
          setIsLoading(false);
          hasSubmittedRef.current = false;
          navigate('/');
          return;
        }
      } else {
        setProgress(40);
      }

      const container = containerRef.current;
      if (!container) {
        setIsLoading(false);
        hasSubmittedRef.current = false;
        window.document.body.style.overflow = '';
        navigate('/');
        return;
      }

      let retries = 0;
      let elements: HTMLElement[] = [];
      while (retries < 20 && elements.length === 0) {
        await new Promise((r) => setTimeout(r, 200));
        elements = Array.from(
          container.querySelectorAll<HTMLElement>('[data-docx-id]')
        );
        retries++;
      }

      await new Promise((r) => setTimeout(r, 1000));

      const results =
        elements.length > 0
          ? await captureAllElements(container, {
              firstPixelRatio: 2,
              allowJpegFallback: true,
              allowServerFallback: true,
              serverWidth: 1200,
              nonDestructiveFirst: false
            })
          : [];

      const productImages = results.map((r) => r.file);
      const productImagesMetaData = results.map((r) => ({
        name: r.name,
        info: r.info
      }));

      exportDocument({
        documentFormat: templateFile,
        productImages,
        productImagesMetaData,
        userPrompt: documentContent || ''
      });

      let cp = 40;
      const tid = setInterval(() => {
        cp = Math.min(cp + 0.5, 96);
        setProgress(cp);
        if (cp >= 96) clearInterval(tid);
      }, 1500);
    };

    processDocument();
  }, []);

  return (
    <>
      <StyledHiddenContainer $isHidden={isLoading} ref={containerRef}>
        <Flex width="1200px">
          <Streamdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{ ...basicComponents, ...customComponents }}
            parseIncompleteMarkdown={false}
          >
            {documentContent || ''}
          </Streamdown>
        </Flex>
      </StyledHiddenContainer>

      {isLoading && (
        <StyledLoadingContainer>
          <Flex
            direction="column"
            alignItems="center"
            justify="center"
            height={'144px'}
          >
            <ProductCreationLoadingToast
              progress={progress}
              isVisible={isLoading}
              message="문서 생성 중..."
              showSpinnerIcon
            />
          </Flex>
        </StyledLoadingContainer>
      )}
    </>
  );
};
