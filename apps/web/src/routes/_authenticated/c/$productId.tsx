import { createFileRoute } from '@tanstack/react-router';

import { ErrorComponent } from '@/routes/_authenticated/c/-components/ErrorComponent/ErrorComponent';
import { useEffect } from 'react';
import {
  StyledCanvasContainer,
  StyledMobileSlideContainer,
  StyledMobileSlideItem,
  StyledMobileSlideWrapper,
  StyledPanelResizeHandle,
  StyledProductIdContainer,
  StyledToggleContainer
} from '@/routes/_authenticated/c/-$productId.style';
import ChatSection from '@/routes/_authenticated/c/-components/ChatSection/ChatSection';
import Toolbar from '@/routes/_authenticated/c/-components/Toolbar/Toolbar';
import { CanvasSection } from '@/routes/_authenticated/c/-components/CanvasSection/CanvasSection';
import {
  getDocumentOptions,
  getProductChatMessagesOptions
} from '@/query/options/products';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { Toggle } from '@docs-front/ui';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { useState } from 'react';
import { Flex } from '@docs-front/ui';
import { MessagesSquare, ScrollText } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { ChartColorKeyContext } from '@/hooks/useChartColorKey';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/_authenticated/c/$productId')({
  component: Product,
  errorComponent: ErrorComponent,
  loader: async ({ params, context }) => {
    const productId = Number(params.productId);
    const { queryClient } = context;

    await Promise.all([
      queryClient.ensureQueryData(getProductChatMessagesOptions(productId)),
      queryClient.ensureQueryData(getDocumentOptions(productId))
    ]);
  }
});

function Product() {
  const { isMobile } = useBreakPoints();

  const { productId } = Route.useParams();

  const { data: productMeta } = useQuery({
    ...getDocumentOptions(Number(productId)),
    enabled: !!productId
  });

  const themeColor = productMeta?.themeColor ?? 'GRAY';

  if (isMobile)
    return (
      <ChartColorKeyContext.Provider value={{ colorKey: themeColor }}>
        <ProductMobile />
      </ChartColorKeyContext.Provider>
    );

  return (
    <StyledProductIdContainer>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={40}>
          <ChatSection />
        </Panel>
        <StyledPanelResizeHandle />
        <Panel defaultSize={60}>
          <StyledCanvasContainer>
            <Toolbar />
            <ChartColorKeyContext.Provider value={{ colorKey: themeColor }}>
              <CanvasSection />
            </ChartColorKeyContext.Provider>
          </StyledCanvasContainer>
        </Panel>
      </PanelGroup>
    </StyledProductIdContainer>
  );
}

function ProductMobile() {
  const { t } = useI18n('common');
  const [toggleValue, setToggleValue] = useState<'left' | 'right'>('left');

  useEffect(() => {
    setToggleValue('left');
    requestIdleCallback(() => {
      window.ChannelIO?.('hideMessenger');
      window.ChannelIO?.('hideChannelButton');
      return () => {
        window.ChannelIO?.('showChannelButton');
      };
    });
  }, []);

  return (
    <StyledProductIdContainer>
      <Toolbar />
      <StyledToggleContainer>
        <Toggle
          value={toggleValue}
          onValueChange={(val) => {
            if (val) {
              setToggleValue(val as 'left' | 'right');
            }
          }}
          leftContent={
            <Flex direction="row" gap={4} alignItems="center">
              <MessagesSquare size={16} strokeWidth={1.5} />
              <p>{t('toggle.chat')}</p>
            </Flex>
          }
          rightContent={
            <Flex direction="row" gap={4} alignItems="center">
              <ScrollText size={16} strokeWidth={1.5} />
              <p>{t('toggle.document')}</p>
            </Flex>
          }
        />
      </StyledToggleContainer>
      <StyledMobileSlideContainer $toggleValue={toggleValue}>
        <StyledMobileSlideWrapper $toggleValue={toggleValue}>
          <StyledMobileSlideItem>
            <ChatSection />
          </StyledMobileSlideItem>
          <StyledMobileSlideItem>
            <StyledCanvasContainer $isMobile>
              <CanvasSection />
            </StyledCanvasContainer>
          </StyledMobileSlideItem>
        </StyledMobileSlideWrapper>
      </StyledMobileSlideContainer>
    </StyledProductIdContainer>
  );
}
