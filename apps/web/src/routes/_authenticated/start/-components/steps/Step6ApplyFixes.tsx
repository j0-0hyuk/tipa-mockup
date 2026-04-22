import styled from '@emotion/styled';
import { Flex } from '@docs-front/ui';
import { StyledStepTitle, StyledInfoBanner } from '../../-route.style';
import { Check, ChevronDown, ChevronUp, Sparkles, ArrowRight, Pencil } from 'lucide-react';
import { useState } from 'react';

const FIX_ITEMS = [
  {
    id: 'schedule',
    section: '추진 일정',
    severity: 'warn',
    title: '세부 일정 및 산출물 보완',
    before: 'M10~M11: 시스템 통합',
    after: 'M10: UI/UX 통합 테스트 (산출물: 테스트 보고서)\nM11: 공인인증시험 및 성능검증 (산출물: GS인증 결과서)',
    applied: false,
  },
  {
    id: 'team',
    section: '참여 인력 현황',
    severity: 'fail',
    title: '핵심 연구인력 수행 실적 추가',
    before: '책임연구원: 홍길동 (AI/NLP 전공, 박사)',
    after: '책임연구원: 홍길동 (AI/NLP 전공, 박사)\n- SCIE 논문 12편 (NLP 분야 5편)\n- 특허 3건 (자연어처리 기반 문서 자동화)\n- 2023 IITP AI 과제 PM 수행',
    applied: false,
  },
  {
    id: 'grammar1',
    section: '과제 개요',
    severity: 'warn',
    title: '구어체 표현 → 공공문서체 교정',
    before: '혁신적으로 개선하고자 합니다',
    after: '업무 효율성을 50% 이상 향상시키는 것을 목표로 합니다',
    applied: false,
  },
  {
    id: 'grammar2',
    section: '기술개발 목표',
    severity: 'info',
    title: '성능 측정 기준 명시',
    before: '문서 초안 생성 정확도: 85% 이상',
    after: '문서 초안 생성 정확도: ROUGE-L 기준 85% 이상',
    applied: false,
  },
  {
    id: 'dup',
    section: '연구 수행 방법',
    severity: 'info',
    title: '선행연구 인용 보완',
    before: '(선행연구 인용 없음)',
    after: '국내외 유사 연구 5건 분석 결과를 반영하여 차별화된 접근 방법을 설계하였음 (Kim et al., 2024; Park, 2023 등)',
    applied: false,
  },
];

const FixCard = styled.div<{ $applied: boolean }>`
  border: 1px solid ${({ $applied }) => $applied ? '#DBEAFE' : '#E3E4E8'};
  border-radius: 12px;
  overflow: hidden;
  background: ${({ $applied }) => $applied ? '#EFF6FF' : '#FFFFFF'};
  transition: all 0.2s;
`;

const FixHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  &:hover { background: #FAFAFC; }
`;

const SeverityBadge = styled.span<{ $sev: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $sev }) =>
    $sev === 'fail' ? '#FEF2F2' :
    $sev === 'warn' ? '#FFFBEB' : '#F0F6FF'};
  color: ${({ $sev }) =>
    $sev === 'fail' ? '#DC2626' :
    $sev === 'warn' ? '#D97706' : '#2C81FC'};
`;

const DiffBox = styled.div`
  padding: 0 20px 16px;
`;

const DiffRow = styled.div<{ $type: 'before' | 'after' }>`
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  background: ${({ $type }) => $type === 'before' ? '#FEF2F2' : '#EFF6FF'};
  color: ${({ $type }) => $type === 'before' ? '#991B1B' : '#1D4ED8'};
  text-decoration: ${({ $type }) => $type === 'before' ? 'line-through' : 'none'};
`;

const EditableAfter = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  font-family: inherit;
  background: #EFF6FF;
  color: #1D4ED8;
  border: 1.5px solid #93C5FD;
  resize: vertical;
  min-height: 60px;
  outline: none;
  &:focus { border-color: #2C81FC; box-shadow: 0 0 0 2px rgba(44,129,252,0.15); }
`;

const EditToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid #D1D5DB;
  background: #FFFFFF;
  color: #6E7687;
  &:hover { background: #F9FAFB; border-color: #9CA3AF; }
`;

const ApplyBtn = styled.button<{ $applied: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: ${({ $applied }) => $applied ? 'default' : 'pointer'};
  border: none;
  background: ${({ $applied }) => $applied ? '#DBEAFE' : '#2C81FC'};
  color: ${({ $applied }) => $applied ? '#1D4ED8' : '#FFFFFF'};
  &:hover { opacity: ${({ $applied }) => $applied ? 1 : 0.85}; }
`;

const ApplyAllBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: #2C81FC;
  color: #FFFFFF;
  &:hover { opacity: 0.9; }
`;

const SummaryCard = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #F0F6FF 0%, #F5F0FF 100%);
  border-radius: 12px;
  margin-bottom: 24px;
`;

interface Step6ApplyFixesProps {
  onAppliedChange?: (count: number) => void;
}

export function Step6ApplyFixes({ onAppliedChange }: Step6ApplyFixesProps) {
  const [fixes, setFixes] = useState(FIX_ITEMS.map(f => ({ ...f })));
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ schedule: true });
  const [editing, setEditing] = useState<Record<string, boolean>>({});

  const appliedCount = fixes.filter(f => f.applied).length;

  const toggleApply = (id: string) => {
    setFixes(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, applied: true } : f);
      onAppliedChange?.(updated.filter(f => f.applied).length);
      return updated;
    });
  };

  const updateAfter = (id: string, value: string) => {
    setFixes(prev => prev.map(f => f.id === id ? { ...f, after: value } : f));
  };

  const applyAll = () => {
    setFixes(prev => {
      const updated = prev.map(f => ({ ...f, applied: true }));
      onAppliedChange?.(updated.length);
      return updated;
    });
  };

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      <StyledStepTitle style={{ textAlign: 'left' }}>
        수정 및 반영
      </StyledStepTitle>

      <StyledInfoBanner>
        <span style={{ color: '#6E7687', flexShrink: 0, fontSize: 14 }}>&#9432;</span>
        품질 검토에서 발견된 개선 사항을 확인하고, 선택적으로 반영할 수 있습니다.
      </StyledInfoBanner>

      <SummaryCard>
        <div style={{ fontSize: 36, fontWeight: 800, color: '#2C81FC' }}>{appliedCount}/{fixes.length}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#25262C' }}>수정 항목</div>
          <div style={{ fontSize: 13, color: '#6E7687', marginTop: 2 }}>
            {fixes.filter(f => f.severity === 'fail').length}개 필수 · {fixes.filter(f => f.severity === 'warn').length}개 권장 · {fixes.filter(f => f.severity === 'info').length}개 선택
          </div>
        </div>
        <ApplyAllBtn onClick={applyAll}>
          <Sparkles size={16} /> 전체 반영
        </ApplyAllBtn>
      </SummaryCard>

      <Flex direction="column" gap={12}>
        {fixes.map((fix) => {
          const isOpen = expanded[fix.id];
          return (
            <FixCard key={fix.id} $applied={fix.applied}>
              <FixHeader onClick={() => setExpanded(prev => ({ ...prev, [fix.id]: !prev[fix.id] }))}>
                <Flex alignItems="center" gap="12px">
                  {fix.applied ? (
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#2C81FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  ) : (
                    <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #D1D5DB' }} />
                  )}
                  <div>
                    <Flex alignItems="center" gap="8px" style={{ marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: fix.applied ? '#6E7687' : '#25262C' }}>{fix.title}</span>
                      <SeverityBadge $sev={fix.severity}>
                        {fix.severity === 'fail' ? '필수' : fix.severity === 'warn' ? '권장' : '선택'}
                      </SeverityBadge>
                    </Flex>
                    <span style={{ fontSize: 12, color: '#B5B9C4' }}>{fix.section}</span>
                  </div>
                </Flex>
                <Flex alignItems="center" gap="8px">
                  {!fix.applied && (
                    <ApplyBtn $applied={false} onClick={(e) => { e.stopPropagation(); toggleApply(fix.id); }}>
                      반영
                    </ApplyBtn>
                  )}
                  {fix.applied && (
                    <ApplyBtn $applied={true}>
                      <Check size={12} /> 반영됨
                    </ApplyBtn>
                  )}
                  {isOpen ? <ChevronUp size={16} color="#B5B9C4" /> : <ChevronDown size={16} color="#B5B9C4" />}
                </Flex>
              </FixHeader>
              {isOpen && (
                <DiffBox>
                  <Flex direction="column" gap={8}>
                    <DiffRow $type="before">{fix.before}</DiffRow>
                    <Flex alignItems="center" justify="center">
                      <ArrowRight size={16} color="#B5B9C4" />
                    </Flex>
                    {editing[fix.id] ? (
                      <EditableAfter
                        value={fix.after}
                        onChange={(e) => updateAfter(fix.id, e.target.value)}
                        rows={fix.after.split('\n').length + 1}
                        autoFocus
                      />
                    ) : (
                      <DiffRow $type="after" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setEditing(prev => ({ ...prev, [fix.id]: true })); }}>
                        {fix.after}
                      </DiffRow>
                    )}
                    <Flex justify="flex-end">
                      <EditToggle onClick={(e) => { e.stopPropagation(); setEditing(prev => ({ ...prev, [fix.id]: !prev[fix.id] })); }}>
                        <Pencil size={11} /> {editing[fix.id] ? '편집 완료' : '직접 수정'}
                      </EditToggle>
                    </Flex>
                  </Flex>
                </DiffBox>
              )}
            </FixCard>
          );
        })}
      </Flex>
    </div>
  );
}
