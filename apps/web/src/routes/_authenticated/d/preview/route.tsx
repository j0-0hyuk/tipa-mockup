import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@docs-front/ui';
import styled from '@emotion/styled';
import { ArrowLeft, FileText } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/d/preview')({
  component: PreviewPage,
});

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 32px;
`;

const DocCard = styled.div`
  border: 1px solid #E3E4E8;
  border-radius: 12px;
  padding: 32px;
  background: #FFFFFF;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #25262C;
  margin: 24px 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #F1F1F4;
`;

const SectionContent = styled.div`
  font-size: 14px;
  line-height: 1.8;
  color: #374151;
  white-space: pre-wrap;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6E7687;
`;

const StatusBadge = styled.span<{ $done: boolean }>`
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $done }) => $done ? '#F0FDF4' : '#F0F6FF'};
  color: ${({ $done }) => $done ? '#16A34A' : '#2C81FC'};
`;

function SourceTags({ sources }: { sources: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, paddingTop: 8 }}>
      <span style={{ fontSize: 11, color: '#9CA3AF', marginRight: 4 }}>AI 참조:</span>
      {sources.map((src, i) => (
        <span key={i} style={{ fontSize: 11, padding: '2px 8px', background: '#F1F5F9', color: '#64748B', borderRadius: 4 }}>{src}</span>
      ))}
    </div>
  );
}

function PreviewPage() {
  const navigate = useNavigate();
  const status = new URLSearchParams(window.location.search).get('status') || '초안 생성';

  return (
    <Container>
      <button
        onClick={() => navigate({ to: '/d' })}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6E7687', marginBottom: 24, fontFamily: 'inherit' }}
      >
        <ArrowLeft size={16} /> 내 문서함으로 돌아가기
      </button>

      <div style={{ fontSize: 24, fontWeight: 700, color: '#25262C', marginBottom: 8 }}>
        AI 기반 지능형 문서 자동 생성 시스템 개발
      </div>

      <MetaRow>
        <MetaItem><FileText size={14} /> 연구개발계획서</MetaItem>
        <MetaItem>작성일: 2026.04.07</MetaItem>
        <StatusBadge $done={status === '개선 완료'}>{status}</StatusBadge>
        <MetaItem>품질 점수: <strong style={{ color: status === '개선 완료' ? '#16A34A' : '#2C81FC' }}>{status === '개선 완료' ? 91 : 72}</strong>/100</MetaItem>
      </MetaRow>

      <DocCard>
        <SectionTitle>1. 과제 개요</SectionTitle>
        <SectionContent>
본 과제는 생성형 AI 기술을 활용하여 연구개발계획서 작성을 자동화하고 품질을 향상시키는 지능형 문서 작성 지원 시스템을 개발하는 것을 목표로 합니다.

기존 연구개발계획서 작성 과정에서 발생하는 반복적인 작업, 형식 오류, 논리적 비일관성 등의 문제를 해결하여 연구자의 업무 효율성을 50% 이상 향상시키는 것을 목표로 합니다.
        </SectionContent>
        <SourceTags sources={['SMTECH 표준 서식']} />

        <SectionTitle>2. 기술개발 목표</SectionTitle>
        <SectionContent>
핵심 성능지표(KPI):
1. 문서 초안 생성 정확도: 85% 이상
2. 항목별 완성도 자동 점검 정밀도: 90% 이상
3. 문서 작성 시간 단축률: 기존 대비 60% 이상

최종 목표: 연구개발계획서 전 항목에 대해 AI 기반 초안 생성 및 품질 검증이 가능한 통합 플랫폼 구축
        </SectionContent>
        <SourceTags sources={['SMTECH DB', '유사과제 성과지표']} />

        <SectionTitle>3. 연구 수행 방법</SectionTitle>
        <SectionContent>
1단계 (1~6개월): 데이터 수집 및 전처리
- 기존 연구개발계획서 5,000건 수집 및 구조화
- 항목별 분류 체계 구축

2단계 (4~10개월): AI 모델 개발
- Fine-tuned LLM 기반 초안 생성 모델 학습
- 품질 검증 모델 개발 (SMTECH DB, 공공 말뭉치 참조)

3단계 (8~12개월): 시스템 통합 및 검증
- 웹 플랫폼 구축 및 사용자 테스트
- 공인인증시험 및 성능 검증
        </SectionContent>
        <SourceTags sources={['NTIS 유사과제', '선행특허 분석 (KIPRIS)']} />

        <SectionTitle>4. 추진 일정</SectionTitle>
        <SectionContent>
M1~M3: 요구사항 분석 및 데이터 수집
M4~M6: 전처리 파이프라인 구축
M7~M9: AI 모델 학습 및 최적화
M10: UI/UX 통합 테스트 (산출물: 테스트 보고서)
M11: 공인인증시험 및 성능검증 (산출물: GS인증 결과서)
M12: 최종 검증 및 보고서 작성
        </SectionContent>
        <SourceTags sources={['SMTECH 표준 서식']} />

        <SectionTitle>5. 연구비 사용 계획</SectionTitle>
        <SectionContent>
총 연구비: 4억 원

- 인건비: 1.8억 (45%)
- 연구장비/재료비: 0.8억 (20%)
- 위탁연구개발비: 0.6억 (15%)
- 외부전문기술활용비: 0.3억 (7.5%)
- 연구활동비: 0.2억 (5%)
- 간접비: 0.3억 (7.5%)
        </SectionContent>
        <SourceTags sources={['연구비 편성 기준 가이드', '국가연구개발혁신법']} />

        <SectionTitle>6. 기대 효과</SectionTitle>
        <SectionContent>
정량적 기대효과:
- 연구개발계획서 작성 시간 60% 단축
- 서류 보완 요청률 30% 감소
- 연간 처리 건수 3배 증가

정성적 기대효과:
- 연구자 업무 부담 경감
- 계획서 품질 표준화
- 국가 R&D 생태계 효율성 향상
        </SectionContent>
        <SourceTags sources={['SMTECH DB', '공공 말뭉치']} />
      </DocCard>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
        <Button variant="outlined" size="medium" onClick={() => navigate({ to: '/d' })}>
          내 문서함
        </Button>
        <Button variant="filled" size="medium" onClick={() => navigate({ to: '/review' as any })}>
          {status === '개선 완료' ? 'AI 품질 검토 다시 받기' : 'AI 품질 검토 받기'}
        </Button>
      </div>

      <div style={{ fontSize: 13, color: '#6E7687', marginTop: 16, padding: '14px 18px', background: '#FAFAFC', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#6E7687', flexShrink: 0, fontSize: 14 }}>ⓘ</span>
        본 결과물은 AI 기반 참고용 초안이며, 사용자의 검토 및 보완이 필요합니다.
      </div>
    </Container>
  );
}
