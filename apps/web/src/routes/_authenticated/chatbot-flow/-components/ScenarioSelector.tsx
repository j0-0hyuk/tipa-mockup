import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { MessageCircle, RotateCcw } from 'lucide-react';
import type { ChatMode } from '@/routes/_authenticated/chatbot-flow/-components/ChatbotWidget';
import { TipaLogo } from '@/routes/_authenticated/chatbot-flow/-components/TipaLogo';
import { colors } from '@/routes/_authenticated/chatbot-flow/-components/styles';

interface ScenarioSelectorProps {
  exiting: boolean;
  onSelect: (mode: ChatMode) => void;
}

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Wrap = styled.div<{ $exiting: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  opacity: ${(p) => (p.$exiting ? 0 : 1)};
  transform: ${(p) => (p.$exiting ? 'scale(0.95)' : 'scale(1)')};
  transition: opacity 320ms ease, transform 320ms ease;
  animation: ${fadeInUp} 420ms ease both;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const LogoBadge = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 120%;
    height: 120%;
    object-fit: contain;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.text};
  text-align: center;
  letter-spacing: -0.02em;
`;

const CardGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const Card = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 220px;
  padding: 28px 20px;
  border-radius: 16px;
  border: 1px solid ${colors.borderLight};
  background: ${colors.white};
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06);
  cursor: pointer;
  transition: all 180ms ease;
  text-align: center;

  &:hover {
    border-color: ${colors.main};
    background: ${colors.mainSoft};
    transform: translateY(-3px);
    box-shadow: 0 8px 24px -8px rgba(44, 129, 252, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${colors.mainSoft};
  color: ${colors.main};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.text};
  letter-spacing: -0.01em;
`;

const CardDesc = styled.div`
  font-size: 14px;
  color: ${colors.textMuted};
  line-height: 1.5;
  letter-spacing: -0.01em;
`;

export function ScenarioSelector({ exiting, onSelect }: ScenarioSelectorProps) {
  return (
    <Wrap $exiting={exiting}>
      <Header>
        <LogoBadge>
          <TipaLogo />
        </LogoBadge>
        <Title>어떤 시나리오로 시작할까요?</Title>
      </Header>

      <CardGroup>
        <Card onClick={() => onSelect('first')}>
          <CardIcon>
            <MessageCircle size={24} />
          </CardIcon>
          <CardTitle>처음 방문</CardTitle>
          <CardDesc>
            사용자가 처음으로
            <br />
            TIPANI와 대화하는 시나리오
          </CardDesc>
        </Card>

        <Card onClick={() => onSelect('returning')}>
          <CardIcon>
            <RotateCcw size={24} />
          </CardIcon>
          <CardTitle>재방문</CardTitle>
          <CardDesc>
            이전 대화 이력이 있는
            <br />
            사용자가 다시 방문한 시나리오
          </CardDesc>
        </Card>
      </CardGroup>
    </Wrap>
  );
}
