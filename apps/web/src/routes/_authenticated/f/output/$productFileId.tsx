import OutputSection from '@/routes/_authenticated/f/output/-components/OutputSection/OutputSection';
import { Button, Dialog, Flex } from '@docs-front/ui';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import { z } from 'zod';
import ExportedProductTally from '@/routes/_authenticated/f/output/-components/Tally/ExportedProductTally';
import { StyledFunnelContentWrapper } from '@/routes/_authenticated/f/-route.style';
import { CircleAlert, ChevronRight } from 'lucide-react';
import {
  StyledHwpGuide,
  StyledHwpGuideDialogFooter
} from '@/routes/_authenticated/f/output/-index.style';
import { useModal } from '@/hooks/useModal';
import { useBreakPoints } from '@/hooks/useBreakPoints';

const HWP_CONVERT_LINK = 'https://www.polarisofficetools.com/hwpx/convert/hwp';

export const Route = createFileRoute('/_authenticated/f/output/$productFileId')(
  {
    component: RouteComponent,
    validateSearch: z.object({
      fileName: z.string().optional(),
      templateFileId: z.string().optional()
    }),
    beforeLoad: ({ params, search }) => {
      let existingTemplateFileId: string | undefined;
      try {
        const saved = sessionStorage.getItem('f-funnel-data');
        if (saved) {
          existingTemplateFileId = JSON.parse(saved).context?.templateFileId;
        }
      } catch {
        // ignore corrupted sessionStorage
      }

      sessionStorage.setItem(
        'f-funnel-data',
        JSON.stringify({
          step: 'output',
          context: {
            productFileId: params.productFileId,
            templateFileId: search.templateFileId ?? existingTemplateFileId
          }
        })
      );
    }
  }
);

function RouteComponent() {
  const modal = useModal();
  const { productFileId } = Route.useParams();
  const productFileIdNumber = Number(productFileId);
  const { isMobile } = useBreakPoints();

  const handleHwpGuideClick = () => {
    modal.openModal(({ isOpen, onClose }) => (
      <Dialog isOpen={isOpen} onClose={onClose}>
        <Dialog.title>
          <>
            한글 구 버전에서는
            <br />
            파일이 열리지 않습니다.
          </>
        </Dialog.title>
        <Dialog.content>
          <Button
            type="button"
            variant="filled"
            size="medium"
            onClick={() => {
              window.open(HWP_CONVERT_LINK, '_blank', 'noopener,noreferrer');
              onClose();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            파일 변환하러 가기 &gt;
            <ChevronRight size={16} />
          </Button>
        </Dialog.content>
        <Dialog.footer>
          <StyledHwpGuideDialogFooter>
            독스헌트에선 최신 표준 규격의 한글 파일을 생성하고 있으나, 일부
            구버전 한글 프로그램에선 호환성 문제로 파일이 열리지 않을 수
            있습니다. 위 링크를 통해 파일을 변환해 주시면 구버전에서도
            정상적으로 확인하실 수 있습니다.
          </StyledHwpGuideDialogFooter>
        </Dialog.footer>
      </Dialog>
    ));
  };

  if (!productFileIdNumber || isNaN(productFileIdNumber)) {
    return <Navigate to="/f/template" />;
  }

  return (
    <StyledFunnelContentWrapper>
      <Flex direction="column" gap={isMobile ? 24 : 32} width="100%">
        <Flex direction="column" gap={isMobile ? 8 : 10} width="100%">
          <StyledHwpGuide onClick={handleHwpGuideClick}>
            <CircleAlert size={15} />
            파일이 열리지 않나요?
          </StyledHwpGuide>
          <OutputSection productFileId={productFileIdNumber} />
        </Flex>
        <ExportedProductTally />
      </Flex>
    </StyledFunnelContentWrapper>
  );
}
