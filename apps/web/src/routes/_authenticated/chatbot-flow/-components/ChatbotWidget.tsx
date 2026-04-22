import { useEffect, useRef, useState } from 'react';
import { X, RotateCcw, Send } from 'lucide-react';
import {
  StyledWidget,
  StyledWidgetHeader,
  StyledWidgetAvatar,
  StyledWidgetLogoBadge,
  StyledWidgetHeaderText,
  StyledWidgetName,
  StyledWidgetNameSub,
  StyledWidgetStatus,
  StyledHeaderIconBtn,
  StyledMessageList,
  StyledWidgetInput,
  StyledFakeInput,
  StyledSendBtn,
} from './styles';
import { INTRO_SCRIPT, SCENARIOS, type Scenario, type ScriptStep } from './script';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { CtaCard } from './CtaCard';
import { ScenarioChips } from './ScenarioChips';
import { TipaLogo } from './TipaLogo';

export type ChatMode = 'first' | 'returning';

interface ChatbotWidgetProps {
  exiting: boolean;
  mode?: ChatMode;
  onClose: () => void;
  onCtaClick: () => void;
}

type RenderedItem =
  | {
      kind: 'ai' | 'user';
      text: string;
      typingMs: number;
      instant?: boolean;
      key: string;
    }
  | { kind: 'chips'; hideIds: string[]; disabled?: boolean; selectedId?: string; key: string }
  | { kind: 'cta'; key: string };

const INITIAL_SCENARIO_ID = 'recommend';

function withoutTrailingChips(steps: ScriptStep[]) {
  let end = steps.length;
  while (end > 0 && steps[end - 1].kind === 'chips') {
    end -= 1;
  }
  return steps.slice(0, end);
}

function getInitialSteps(mode: ChatMode = 'first') {
  if (mode === 'returning') {
    const revisitScenario = SCENARIOS.find((s) => s.id === 'revisit');
    if (revisitScenario) {
      return revisitScenario.steps;
    }
  }

  const initialScenario = SCENARIOS.find((scenario) => scenario.id === INITIAL_SCENARIO_ID);
  const introSteps = INTRO_SCRIPT.map((step) =>
    step.kind === 'chips' ? { ...step, disabled: true, selectedId: INITIAL_SCENARIO_ID, continueAfterMs: 600 } : step,
  );

  if (!initialScenario) {
    return introSteps;
  }

  return [...introSteps, ...withoutTrailingChips(initialScenario.steps)];
}

export function ChatbotWidget({ exiting, mode = 'first', onClose, onCtaClick }: ChatbotWidgetProps) {
  const [items, setItems] = useState<RenderedItem[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [runId, setRunId] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const seqRef = useRef(0);

  const scrollToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  };

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  };

  const playSteps = (steps: ScriptStep[], answeredSoFar: string[], onFinish?: () => void) => {
    let cursor = 0;

    const next = () => {
      if (cursor >= steps.length) {
        onFinish?.();
        return;
      }
      const step = steps[cursor];

      schedule(() => {
        if (step.kind === 'ai') {
          if (step.instant) {
            setItems((prev) => [
              ...prev,
              {
                kind: 'ai',
                text: step.text,
                typingMs: step.typingMs,
                instant: true,
                key: `ai-${runId}-${seqRef.current++}`,
              },
            ]);
            scrollToBottom();
            schedule(() => {
              cursor += 1;
              next();
              scrollToBottom();
            }, 400);
            return;
          }
          setShowTyping(true);
          scrollToBottom();
          schedule(() => {
            setShowTyping(false);
            setItems((prev) => [
              ...prev,
              {
                kind: 'ai',
                text: step.text,
                typingMs: step.typingMs,
                key: `ai-${runId}-${seqRef.current++}`,
              },
            ]);
            scrollToBottom();
            schedule(() => {
              cursor += 1;
              next();
              scrollToBottom();
            }, step.typingMs + 250);
          }, 700);
        } else if (step.kind === 'user') {
          setItems((prev) => [
            ...prev,
            {
              kind: 'user',
              text: step.text,
              typingMs: step.typingMs,
              key: `user-${runId}-${seqRef.current++}`,
            },
          ]);
          scrollToBottom();
          schedule(() => {
            cursor += 1;
            next();
            scrollToBottom();
          }, step.typingMs + 250);
        } else if (step.kind === 'chips') {
          setItems((prev) => [
            ...prev,
            {
              kind: 'chips',
              hideIds: answeredSoFar,
              disabled: step.disabled,
              selectedId: step.selectedId,
              key: `chips-${runId}-${seqRef.current++}`,
            },
          ]);
          scrollToBottom();
          cursor += 1;
          if (cursor < steps.length && step.continueAfterMs !== undefined) {
            schedule(() => {
              next();
              scrollToBottom();
            }, step.continueAfterMs);
          }
        } else {
          // cta
          setItems((prev) => [...prev, { kind: 'cta', key: `cta-${runId}-${seqRef.current++}` }]);
          scrollToBottom();
          cursor += 1;
        }
      }, step.delayBeforeMs);
    };

    next();
  };

  // 초기 인트로 재생
  useEffect(() => {
    clearTimers();
    setItems([]);
    setShowTyping(false);
    setAnsweredIds([]);
    seqRef.current = 0;

    playSteps(getInitialSteps(mode), []);

    return () => {
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  const handleSelectScenario = (scenario: Scenario) => {
    clearTimers();
    setItems((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        const item = copy[i];
        if (item.kind === 'chips' && !item.disabled) {
          copy[i] = { ...item, disabled: true, selectedId: scenario.id };
          break;
        }
      }
      return copy;
    });

    const nextAnswered = [...answeredIds, scenario.id];
    setAnsweredIds(nextAnswered);

    playSteps(withoutTrailingChips(scenario.steps), nextAnswered);
  };

  const handleRestart = () => {
    clearTimers();
    setRunId((r) => r + 1);
  };

  return (
    <StyledWidget $exiting={exiting}>
      <StyledWidgetHeader>
        <StyledWidgetAvatar>
          <StyledWidgetLogoBadge>
            <TipaLogo />
          </StyledWidgetLogoBadge>
        </StyledWidgetAvatar>
        <StyledWidgetHeaderText>
          <StyledWidgetName>
            <span>TIPA</span>
            <StyledWidgetNameSub>NI</StyledWidgetNameSub>
          </StyledWidgetName>
          <StyledWidgetStatus>온라인</StyledWidgetStatus>
        </StyledWidgetHeaderText>
        <StyledHeaderIconBtn onClick={handleRestart} aria-label="다시 보기">
          <RotateCcw size={16} />
        </StyledHeaderIconBtn>
        <StyledHeaderIconBtn onClick={onClose} aria-label="닫기">
          <X size={18} />
        </StyledHeaderIconBtn>
      </StyledWidgetHeader>

      <StyledMessageList ref={listRef}>
        {items.map((item, idx) => {
          if (item.kind === 'cta') {
            return <CtaCard key={item.key} onClick={onCtaClick} />;
          }
          if (item.kind === 'chips') {
            return (
              <ScenarioChips
                key={item.key}
                hideIds={item.hideIds}
                disabled={item.disabled}
                selectedId={item.selectedId}
                onSelect={handleSelectScenario}
                onCtaClick={onCtaClick}
              />
            );
          }
          const prev = items[idx - 1];
          const prevSide = prev && (prev.kind === 'ai' || prev.kind === 'user') ? prev.kind : null;
          const showSender = prevSide !== item.kind;
          return (
            <MessageBubble
              key={item.key}
              side={item.kind}
              text={item.text}
              typingMs={item.typingMs}
              instant={item.instant}
              showSender={showSender}
              onComplete={scrollToBottom}
            />
          );
        })}
        {showTyping && <TypingIndicator />}
      </StyledMessageList>

      <StyledWidgetInput>
        <StyledFakeInput>AI가 응답 중이에요...</StyledFakeInput>
        <StyledSendBtn disabled aria-label="전송">
          <Send size={16} />
        </StyledSendBtn>
      </StyledWidgetInput>
    </StyledWidget>
  );
}
