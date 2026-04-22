import { Suspense, useCallback, useRef, useState } from 'react';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { Spinner, Flex, Toggle } from '@docs-front/ui';
import { MessagesSquare, ScrollText } from 'lucide-react';
import { getProductFileStatusPollingOptions } from '@/query/options/products';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { DocumentChatSection } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatSection';
import type { DocumentChatSectionHandle } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatSection';
import { DocumentPanel } from '@/routes/_authenticated/d/-components/DocumentPanel/DocumentPanel';
import type { DocumentPanelHandle } from '@/routes/_authenticated/d/-components/DocumentPanel/DocumentPanel';
import type { HwpxAction } from '@/ai/document-chat/ui-message';
import { BetaNoticeDialog } from '@/routes/_authenticated/d/-components/BetaNoticeDialog/BetaNoticeDialog';
import { FloatingSurvey } from '@/routes/_authenticated/d/-components/FloatingSurvey/FloatingSurvey';
import {
  StyledEditorContainer,
  StyledPanelResizeHandle,
  StyledToggleContainer,
  StyledMobileSlideContainer,
  StyledMobileSlideWrapper,
  StyledMobileSlideItem
} from '@/routes/_authenticated/d/-$productFileId.style';

export const Route = createFileRoute('/_authenticated/d/$productFileId')({
  component: EditorPage
});

function EditorPage() {
  const [betaNoticeOpen, setBetaNoticeOpen] = useState(true);
  const { productFileId } = Route.useParams();
  const [fromGenerate] = useState(() => new URLSearchParams(window.location.search).get('fromGenerate') === 'true');
  const productFileIdNumber = Number(productFileId);
  const documentPanelRef = useRef<DocumentPanelHandle>(null);
  const chatSectionRef = useRef<DocumentChatSectionHandle>(null);
  const { isMobile } = useBreakPoints();

  const { data: statusData } = useQuery(
    getProductFileStatusPollingOptions(productFileIdNumber)
  );

  const isStatusCompleted = statusData?.data.status === 'COMPLETED';

  const handleActionStart = useCallback(() => {
    documentPanelRef.current?.startStreaming();
  }, []);

  const handleAction = useCallback((action: HwpxAction) => {
    documentPanelRef.current?.pushAction(action);
  }, []);

  const handleActionDone = useCallback(() => {
    documentPanelRef.current?.finishStreaming();
  }, []);

  const handleRollback = useCallback(() => {
    documentPanelRef.current?.rollback();
  }, []);

  const handleDiffFinish = useCallback(() => {
    chatSectionRef.current?.finishReview();
  }, []);

  if (!productFileIdNumber || isNaN(productFileIdNumber)) {
    return <Navigate to="/d" />;
  }

  const chatSection = (
    <Suspense
      fallback={
        <Flex
          direction="column"
          alignItems="center"
          style={{ height: '100%', justifyContent: 'center' }}
        >
          <Spinner size={32} />
        </Flex>
      }
    >
      <DocumentChatSection
        ref={chatSectionRef}
        productFileId={productFileId}
        productFileIdNumber={productFileIdNumber}
        isStatusCompleted={isStatusCompleted}
        onActionStart={handleActionStart}
        onAction={handleAction}
        onActionDone={handleActionDone}
        onRollback={handleRollback}
      />
    </Suspense>
  );

  if (isMobile) {
    return (
      <>
        <BetaNoticeDialog isOpen={betaNoticeOpen} onClose={() => setBetaNoticeOpen(false)} />
        <EditorMobile
          chatSection={chatSection}
          documentPanel={
            <DocumentPanel
              ref={documentPanelRef}
              productFileIdNumber={productFileIdNumber}
              hideToolbar
              onDiffFinish={handleDiffFinish}
            />
          }
        />
      </>
    );
  }

  return (
    <StyledEditorContainer>
      <BetaNoticeDialog isOpen={betaNoticeOpen} onClose={() => setBetaNoticeOpen(false)} />
      {fromGenerate && <FloatingSurvey productFileId={productFileIdNumber} />}
      <PanelGroup direction="horizontal">
        <Panel defaultSize={30} minSize={20} maxSize={50}>
          {chatSection}
        </Panel>
        <StyledPanelResizeHandle />
        <Panel defaultSize={70} minSize={50}>
          <DocumentPanel
            ref={documentPanelRef}
            productFileIdNumber={productFileIdNumber}
            onDiffFinish={handleDiffFinish}
          />
        </Panel>
      </PanelGroup>
    </StyledEditorContainer>
  );
}

function EditorMobile({
  chatSection,
  documentPanel
}: {
  chatSection: React.ReactNode;
  documentPanel: React.ReactNode;
}) {
  const [toggleValue, setToggleValue] = useState<'left' | 'right'>('left');

  return (
    <StyledEditorContainer style={{ flexDirection: 'column' }}>
      <StyledToggleContainer>
        <Toggle
          value={toggleValue}
          onValueChange={(val) => {
            if (val) setToggleValue(val as 'left' | 'right');
          }}
          leftContent={
            <Flex direction="row" gap={4} alignItems="center">
              <MessagesSquare size={16} strokeWidth={1.5} />
              <p>채팅</p>
            </Flex>
          }
          rightContent={
            <Flex direction="row" gap={4} alignItems="center">
              <ScrollText size={16} strokeWidth={1.5} />
              <p>문서</p>
            </Flex>
          }
        />
      </StyledToggleContainer>
      <StyledMobileSlideContainer>
        <StyledMobileSlideWrapper $toggleValue={toggleValue}>
          <StyledMobileSlideItem>{chatSection}</StyledMobileSlideItem>
          <StyledMobileSlideItem>{documentPanel}</StyledMobileSlideItem>
        </StyledMobileSlideWrapper>
      </StyledMobileSlideContainer>
    </StyledEditorContainer>
  );
}
