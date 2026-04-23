import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { StyledPageRoot } from '@/routes/_authenticated/chatbot-flow/-components/styles';
import { ChatbotLauncher } from '@/routes/_authenticated/chatbot-flow/-components/ChatbotLauncher';
import {
  ChatbotWidget,
  type ChatMode,
} from '@/routes/_authenticated/chatbot-flow/-components/ChatbotWidget';
import { ScenarioSelector } from '@/routes/_authenticated/chatbot-flow/-components/ScenarioSelector';

export const Route = createFileRoute('/_authenticated/chatbot-flow')({
  component: ChatbotFlowPage,
});

type Stage = 'launcher' | 'select' | 'widget';

function ChatbotFlowPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('launcher');
  const [chatMode, setChatMode] = useState<ChatMode>('first');

  useEffect(() => {
    window.ChannelIO?.('hideChannelButton');
    return () => {
      window.ChannelIO?.('showChannelButton');
    };
  }, []);
  const [launcherExiting, setLauncherExiting] = useState(false);
  const [selectExiting, setSelectExiting] = useState(false);
  const [widgetExiting, setWidgetExiting] = useState(false);

  const handleStart = () => {
    setLauncherExiting(true);
    window.setTimeout(() => {
      setStage('select');
      setLauncherExiting(false);
    }, 320);
  };

  const handleSelectMode = (mode: ChatMode) => {
    setChatMode(mode);
    setSelectExiting(true);
    window.setTimeout(() => {
      setStage('widget');
      setSelectExiting(false);
    }, 320);
  };

  const handleClose = () => {
    setWidgetExiting(true);
    window.setTimeout(() => {
      setStage('launcher');
      setLauncherExiting(false);
      setWidgetExiting(false);
    }, 360);
  };

  const handleCtaClick = () => {
    setWidgetExiting(true);
    window.setTimeout(() => {
      navigate({ to: '/start' });
    }, 360);
  };

  return (
    <StyledPageRoot>
      {stage === 'launcher' && (
        <ChatbotLauncher exiting={launcherExiting} onStart={handleStart} />
      )}
      {stage === 'select' && (
        <ScenarioSelector exiting={selectExiting} onSelect={handleSelectMode} />
      )}
      {stage === 'widget' && (
        <ChatbotWidget
          exiting={widgetExiting}
          mode={chatMode}
          onClose={handleClose}
          onCtaClick={handleCtaClick}
        />
      )}
    </StyledPageRoot>
  );
}
