import { useState, useEffect } from 'react';
import { Flex, useToast } from '@docs-front/ui';
import {
  StyledPageTitle,
} from '../../-route.style';
import { FlaskConical, Clock, Trash2 } from 'lucide-react';
import styled from '@emotion/styled';

export interface SavedDraft {
  id: string;
  title: string;
  currentStep: number;
  savedAt: string;
  prompt: string;
}

interface Step1Props {
  selectedTemplateFileId: number | null;
  onSelectTemplate: (fileId: number | null) => void;
  onDraftSelect?: (label: string) => void;
  onUploadComplete?: () => void;
  onLoadDraft?: (draft: SavedDraft) => void;
  /** localStorage key for "이어서 작성하기" drafts. 예시 1 = 'rnd_saved_drafts', 예시 2 = 'rnd2_saved_drafts' */
  draftStorageKey?: string;
}

const DRAFT_ITEMS = [
  { id: 'rnd', name: 'R&D 계획서', desc: '연구개발계획서 구조에 맞춰\nAI와 함께 초안을 작성합니다', icon: FlaskConical, badge: '전문가용', accentHue: 'green' },
] as const;

const DraftCardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-top: 24px;
`;

const DraftCard = styled('div', {
  shouldForwardProp: (p) => p !== '$selected',
})<{ $selected?: boolean }>`
  border: 1px solid ${({ $selected }) =>
    $selected ? '#2C81FC' : '#EEF1F5'};
  border-radius: 16px;
  padding: 32px 28px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 200px;
  justify-content: center;
  position: relative;
  background: ${({ $selected }) =>
    $selected ? '#E7F0FF' : '#FFFFFF'};
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);

  &:hover {
    border-color: #2C81FC;
    background: #E7F0FF;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px -4px rgba(44, 129, 252, 0.2);
  }
`;

const DraftCardIcon = styled('div', {
  shouldForwardProp: (p) => !['$selected', '$hue'].includes(p as string),
})<{ $selected?: boolean; $hue?: 'blue' | 'green' }>`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: all 0.2s;
  background: ${({ theme, $selected, $hue }) =>
    $selected
      ? ($hue === 'green' ? '#16a34a' : theme.color.main)
      : ($hue === 'green' ? '#f0fdf4' : theme.color.bgLightGray)};
  color: ${({ theme, $selected, $hue }) =>
    $selected
      ? theme.color.white
      : ($hue === 'green' ? '#16a34a' : theme.color.main)};
`;

const DraftCardName = styled.div`
  ${({ theme }) => theme.typo.Sb_20}
  color: ${({ theme }) => theme.color.black};
  margin-bottom: 12px;
`;

const DraftCardDesc = styled.div`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textGray};
  line-height: 1.7;
  white-space: pre-line;
`;

const SavedSection = styled.div`
  margin-top: 40px;
  border-top: 1px solid #E3E4E8;
  padding-top: 24px;
`;

const SavedCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border: 1px solid #EEF1F5;
  border-radius: 12px;
  background: #FFFFFF;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    border-color: #2C81FC;
    background: #E7F0FF;
    box-shadow: 0 4px 12px -4px rgba(44, 129, 252, 0.2);
  }
`;

const SavedDeleteBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  background: none;
  color: #B5B9C4;
  cursor: pointer;
  border-radius: 6px;
  &:hover { color: #EF4444; background: #FEF2F2; }
`;

const StepBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  background: #F0F6FF;
  color: #2C81FC;
`;

const STEP_LABELS: Record<number, string> = { 1: '양식 선택', 2: '자유 입력', 3: '자세한 입력', 4: '생성' };

// 첫 방문 시 "이어서 작성하기" 기능을 발견할 수 있도록 기본 예시 초안 하나 제공
const buildExampleDraft = (): SavedDraft => ({
  id: 'example_draft_seed',
  title: 'AI 기반 R&D 계획서 자동화 (예시)',
  currentStep: 3,
  savedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  prompt:
    'AI 기반 지능형 문서 자동 생성 시스템 개발\n\n' +
    '자연어 처리(NLP)와 대규모 언어 모델(LLM)을 활용하여 R&D 계획서의 주요 항목(연구 배경, 목표, 내용, 방법, 기대효과)을 자동으로 초안 작성하는 서비스입니다. ' +
    '사용자가 연구 주제를 자유롭게 입력하면 AI가 구조화된 계획서 초안을 생성하고, 검토 및 수정 후 원하는 지원사업 양식에 맞춰 내보낼 수 있습니다.',
});

export function Step1SelectTemplate({ onSelectTemplate, onDraftSelect, onUploadComplete, onLoadDraft, draftStorageKey = 'rnd_saved_drafts' }: Step1Props) {
  const toast = useToast();
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftStorageKey);
      if (raw) {
        setSavedDrafts(JSON.parse(raw));
      } else {
        // 첫 방문: 예시 초안 1개 주입 (발견성 목적)
        const example = [buildExampleDraft()];
        localStorage.setItem(draftStorageKey, JSON.stringify(example));
        setSavedDrafts(example);
      }
    } catch { /* ignore */ }
  }, [draftStorageKey]);

  const deleteDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedDrafts.filter(d => d.id !== id);
    setSavedDrafts(updated);
    localStorage.setItem(draftStorageKey, JSON.stringify(updated));
    toast.open({ content: '삭제되었습니다.', duration: 2000 });
  };

  return (
    <>
      <StyledPageTitle style={{ marginBottom: 24 }}>연구개발계획서 작성 지원 서비스</StyledPageTitle>

      <Flex direction="column" width="100%" gap="10px">
        <DraftCardGrid>
          {DRAFT_ITEMS.map((item) => {
            const selected = selectedDraftId === item.id;
            return (
              <DraftCard
                key={item.id}
                $selected={selected}
                onClick={() => {
                  setSelectedDraftId(item.id);
                  onSelectTemplate(-1);
                  onDraftSelect?.(item.name);
                  onUploadComplete?.();
                }}
              >
                <DraftCardIcon $selected={selected} $hue={item.accentHue}>
                  <item.icon size={28} strokeWidth={1.5} />
                </DraftCardIcon>
                <DraftCardName>{item.name}</DraftCardName>
                <DraftCardDesc>{item.desc}</DraftCardDesc>
              </DraftCard>
            );
          })}
        </DraftCardGrid>
      </Flex>

      {savedDrafts.length > 0 && (
        <SavedSection>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#25262C', marginBottom: 16 }}>이어서 작성하기</div>
          <Flex direction="column" gap={10}>
            {savedDrafts.map((draft) => (
              <SavedCard key={draft.id} onClick={() => onLoadDraft?.(draft)}>
                <Clock size={18} color="#B5B9C4" />
                <div style={{ flex: 1 }}>
                  <Flex alignItems="center" gap="8px" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 500, color: '#25262C' }}>{draft.title}</span>
                    <StepBadge>Step {draft.currentStep}/4 · {STEP_LABELS[draft.currentStep]}</StepBadge>
                  </Flex>
                  <span style={{ fontSize: 14, color: '#B5B9C4' }}>
                    {new Date(draft.savedAt).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })} 저장
                  </span>
                </div>
                <SavedDeleteBtn onClick={(e) => deleteDraft(draft.id, e)}>
                  <Trash2 size={14} />
                </SavedDeleteBtn>
              </SavedCard>
            ))}
          </Flex>
        </SavedSection>
      )}
    </>
  );
}
