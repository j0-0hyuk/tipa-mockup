import { Check } from 'lucide-react';
import {
  SCENARIOS,
  type Scenario,
} from '@/routes/_authenticated/chatbot-flow/-components/script';
import {
  StyledChipsCard,
  StyledChipsTitle,
  StyledChipsList,
  StyledChip,
  StyledChipIcon,
  StyledChipLabel,
  StyledChipsDivider,
  StyledCtaChip,
  StyledCtaChipIcon,
  StyledCtaChipLabel,
  StyledCtaChipArrow,
  colors,
} from '@/routes/_authenticated/chatbot-flow/-components/styles';

interface ScenarioChipsProps {
  onSelect: (scenario: Scenario) => void;
  onCtaClick?: () => void;
  hideIds?: string[];
  disabled?: boolean;
  selectedId?: string;
}

export function ScenarioChips({ onSelect, onCtaClick, hideIds = [], disabled = false, selectedId }: ScenarioChipsProps) {
  const items = SCENARIOS.filter((s) => s.id !== 'revisit' && !hideIds.includes(s.id));
  const handleSelect = (scenario: Scenario) => {
    if (disabled) return;
    onSelect(scenario);
  };

  const handleCtaClick = () => {
    if (disabled) return;
    onCtaClick?.();
  };

  return (
    <StyledChipsCard>
      <StyledChipsTitle>💬 어떤 도움이 필요하세요?</StyledChipsTitle>
      <StyledChipsList>
        {items.map((s) => (
          <StyledChip
            key={s.id}
            onClick={() => handleSelect(s)}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            $disabled={disabled}
            $dimmed={!!selectedId && selectedId !== s.id}
          >
            <StyledChipIcon>{s.icon}</StyledChipIcon>
            <StyledChipLabel>
              <strong>{s.label}</strong>
              <span>{s.chipText}</span>
            </StyledChipLabel>
            {selectedId === s.id && <Check size={18} color={colors.main} strokeWidth={2.5} />}
          </StyledChip>
        ))}
        {onCtaClick && (
          <>
            {items.length > 0 && <StyledChipsDivider />}
            <StyledCtaChip
              onClick={handleCtaClick}
              aria-label="R&D 초안 작성하기"
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : 0}
              $disabled={disabled}
              $dimmed={!!selectedId}
            >
              <StyledCtaChipIcon>💡</StyledCtaChipIcon>
              <StyledCtaChipLabel>
                <strong>R&D 초안 작성하기</strong>
                <span>계획서 초안 작성하러 가볼까요?</span>
              </StyledCtaChipLabel>
              <StyledCtaChipArrow>→</StyledCtaChipArrow>
            </StyledCtaChip>
          </>
        )}
      </StyledChipsList>
    </StyledChipsCard>
  );
}
