import styled from '@emotion/styled';
import { Flex } from '@docs-front/ui';
import { StyledStepTitle, StyledInfoBanner } from '../../-route.style';
import { CheckCircle, AlertTriangle, FileSearch, SpellCheck, ListChecks, ChevronDown, ChevronUp, Calculator, Tags, Award } from 'lucide-react';
import { useState } from 'react';

// 더미 검토 결과
const REVIEW_SECTIONS = [
  {
    id: 'completeness',
    icon: ListChecks,
    title: '항목별 완성도 점검',
    score: 85,
    color: '#2C81FC',
    sources: ['SMTECH 표준 서식', '국가연구개발혁신법 시행령'],
    items: [
      { name: '기술개발 목표', status: 'pass', detail: '핵심 성능지표(KPI) 3개 포함, 정량적 목표 명시됨' },
      { name: '연구 방법론', status: 'pass', detail: '단계별 연구 수행 방법 및 검증 계획 포함' },
      { name: '추진 일정', status: 'warn', detail: '마일스톤은 있으나 세부 일정이 부족합니다' },
      { name: '연구비 사용 계획', status: 'pass', detail: '항목별 비용 산정 및 근거 제시됨' },
      { name: '기대 효과', status: 'pass', detail: '정량적/정성적 기대효과 구분 작성됨' },
      { name: '참여 인력 현황', status: 'fail', detail: '핵심 연구인력의 유사 과제 수행 실적이 누락되었습니다' },
    ],
  },
  {
    id: 'duplication',
    icon: FileSearch,
    title: '중복성 검토',
    score: 92,
    color: '#2C81FC',
    sources: ['NTIS 과제 DB', 'KIPRIS 특허 DB', 'KCI 논문 DB'],
    items: [
      { name: 'NTIS 과제 DB 비교', status: 'pass', detail: '최근 5년 유사 과제 3건 확인, 차별점 충분' },
      { name: '특허 DB 비교', status: 'pass', detail: '유사 특허 2건 확인, 기술적 차별성 존재' },
      { name: '논문 DB 비교', status: 'warn', detail: '유사 연구 논문 5건 발견, 선행연구 인용 보완 권장' },
    ],
  },
  {
    id: 'grammar',
    icon: SpellCheck,
    title: '문장 교정 및 표현 개선',
    score: 78,
    color: '#2C81FC',
    sources: ['공공 말뭉치', '국립국어원 맞춤법 DB'],
    items: [
      { name: '맞춤법 검사', status: 'pass', detail: '오류 0건' },
      { name: '공공문서체 적합성', status: 'warn', detail: '구어체 표현 4건 발견 — 수정 제안 적용 가능' },
      { name: '문장 가독성', status: 'warn', detail: '평균 문장 길이 48자 — 35자 이하 권장' },
      { name: '논리 흐름', status: 'pass', detail: '단락 간 논리적 연결 양호' },
    ],
  },
  {
    id: 'budget',
    icon: Calculator,
    title: '연구비 편성 적합성 검토',
    score: 88,
    color: '#2C81FC',
    sources: ['국가연구개발혁신법 시행령', '연구비 편성 기준 가이드'],
    items: [
      { name: '인건비 비율 (45%)', status: 'pass', detail: '전체 연구비 대비 45% — 적정 범위 이내' },
      { name: '위탁연구개발비 비율 (15%)', status: 'pass', detail: '전체 연구비 대비 15% — 기준 충족' },
      { name: '간접비 비율 (7.5%)', status: 'warn', detail: '통상 10~15% 수준 대비 낮음 — 기관 간접비율 확인 권장' },
      { name: '연구활동비', status: 'pass', detail: '5% 이내 편성, 기준 충족' },
    ],
  },
];

const TABLE_SECTIONS = [
  {
    id: 'prior',
    icon: FileSearch,
    color: '#2C81FC',
    title: '선행연구개발 이력 분석',
    subtitle: 'SMTECH DB 기반 유사 선행 과제 3건 매칭',
    count: 3,
    columns: [
      { label: '과제명', width: '35%' },
      { label: '수행기관', width: '25%' },
      { label: '수행연도', width: '15%' },
      { label: '주요 성과', width: '25%' },
    ],
    rows: [
      ['AI 기반 공공문서 자동 생성 기술 연구', '(주)테크솔루션', '2024', 'SCI 논문 2편, 특허 1건'],
      ['자연어처리 기반 연구보고서 품질 분석', '(주)데이터랩', '2023', '기술이전 1건'],
      ['LLM 활용 전문문서 요약 시스템 개발', '한국전자통신연구원', '2024', 'SW등록 2건, 논문 3편'],
    ],
    sources: ['SMTECH 과제 DB', 'NTIS 성과 DB'],
  },
  {
    id: 'classification',
    icon: Tags,
    color: '#2C81FC',
    title: '기술분류 자동 추천',
    subtitle: '연구 내용 기반 3개 분류체계 자동 매칭',
    count: 3,
    columns: [
      { label: '분류체계', width: '35%' },
      { label: '추천 분야', width: '25%' },
      { label: '설명', width: '15%' },
      { label: '', width: '25%' },
    ],
    rows: [
      ['산업기술표준분류', '정보통신 / AI', '자연어처리 기반 문서 자동화', ''],
      ['전략기술로드맵', 'AI·빅데이터', '생성형 AI 활용 문서 지능화', ''],
      ['국가전략품목', '디지털전환', '공공 R&D 디지털 혁신', ''],
    ],
    sources: ['산업기술표준분류표', '전략기술로드맵', '국가전략품목 DB'],
  },
  {
    id: 'certification',
    icon: Award,
    color: '#2C81FC',
    title: '시험·인증기관 매칭',
    subtitle: '성능지표 기반 공인시험기관 3건 추천',
    count: 3,
    columns: [
      { label: '성능지표', width: '35%' },
      { label: '추천 기관', width: '25%' },
      { label: '인증 유형', width: '15%' },
      { label: '', width: '25%' },
    ],
    rows: [
      ['문서 생성 정확도', 'TTA', 'GS인증', ''],
      ['보안성', 'KISA', '보안적합성', ''],
      ['SW 품질', 'KTL', '성능시험', ''],
    ],
    sources: ['e-나라표준인증', '공인시험기관 DB'],
  },
] as const;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $status }) =>
    $status === 'pass' ? '#F0FDF4' :
    $status === 'warn' ? '#FFFBEB' : '#FEF2F2'};
  color: ${({ $status }) =>
    $status === 'pass' ? '#16A34A' :
    $status === 'warn' ? '#D97706' : '#DC2626'};
`;

const SectionCard = styled.div`
  border: 1px solid #E3E4E8;
  border-radius: 12px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  cursor: pointer;
  &:hover { background: #FAFAFC; }
`;

const SectionBody = styled.div`
  padding: 0 24px 20px;
  border-top: 1px solid #F1F1F4;
`;

const ScoreCircle = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

const ItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #F8F8FA;
  &:last-child { border-bottom: none; }
`;

const OverallScore = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 32px;
  background: linear-gradient(135deg, #F0F6FF 0%, #F5F0FF 100%);
  border-radius: 16px;
  margin-bottom: 24px;
`;

const BigScore = styled.div`
  font-size: 56px;
  font-weight: 800;
  color: #2C81FC;
  line-height: 1;
`;

function getScoreColor(score: number) {
  if (score >= 90) return '#2C81FC';
  if (score >= 80) return '#D97706';
  return '#DC2626';
}

export function Step4ReviewQuality() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    completeness: true,
    duplication: false,
    grammar: false,
    budget: false,
    prior: true,
    classification: false,
    certification: false,
  });

  const overallScore = Math.round(
    REVIEW_SECTIONS.reduce((sum, s) => sum + s.score, 0) / REVIEW_SECTIONS.length
  );

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      <StyledStepTitle style={{ textAlign: 'left' }}>
        AI 품질 검토 결과
      </StyledStepTitle>

      <StyledInfoBanner>
        <span style={{ color: '#6E7687', flexShrink: 0, fontSize: 14 }}>&#9432;</span>
        AI가 작성된 초안의 완성도, 중복성, 문장 품질을 자동으로 검토한 결과입니다.
      </StyledInfoBanner>

      <OverallScore>
        <BigScore>{overallScore}</BigScore>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#25262C', marginBottom: 4 }}>종합 점수</div>
          <div style={{ fontSize: 14, color: '#6E7687' }}>{REVIEW_SECTIONS.length}개 영역 자동 검토 완료</div>
        </div>
      </OverallScore>

      <Flex direction="column" gap={16}>
        {REVIEW_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isOpen = expanded[section.id];
          const scoreColor = getScoreColor(section.score);
          return (
            <SectionCard key={section.id}>
              <SectionHeader onClick={() => setExpanded(prev => ({ ...prev, [section.id]: !prev[section.id] }))}>
                <Flex alignItems="center" gap="16px">
                  <ScoreCircle $color={scoreColor}>{section.score}</ScoreCircle>
                  <div>
                    <Flex alignItems="center" gap="8px">
                      <Icon size={18} color="#6E7687" />
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#25262C' }}>{section.title}</span>
                    </Flex>
                    <div style={{ fontSize: 13, color: '#6E7687', marginTop: 4 }}>
                      {section.items.filter(i => i.status === 'pass').length}/{section.items.length} 항목 통과
                    </div>
                  </div>
                </Flex>
                {isOpen ? <ChevronUp size={20} color="#6E7687" /> : <ChevronDown size={20} color="#6E7687" />}
              </SectionHeader>
              {isOpen && (
                <SectionBody>
                  {section.items.map((item, idx) => (
                    <ItemRow key={idx}>
                      <div style={{ flexShrink: 0, marginTop: 2 }}>
                        {item.status === 'pass' ? (
                          <CheckCircle size={16} color="#16A34A" />
                        ) : item.status === 'warn' ? (
                          <AlertTriangle size={16} color="#D97706" />
                        ) : (
                          <AlertTriangle size={16} color="#DC2626" />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <Flex alignItems="center" gap="8px" style={{ marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 500, color: '#25262C' }}>{item.name}</span>
                          <StatusBadge $status={item.status}>
                            {item.status === 'pass' ? '통과' : item.status === 'warn' ? '보완 권장' : '미충족'}
                          </StatusBadge>
                        </Flex>
                        <div style={{ fontSize: 13, color: '#6E7687', lineHeight: 1.5 }}>{item.detail}</div>
                      </div>
                    </ItemRow>
                  ))}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 12, borderTop: '1px solid #F1F1F4', marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: '#9CA3AF', marginRight: 4 }}>📎 참조:</span>
                    {section.sources.map((src, i) => (
                      <span key={i} style={{ fontSize: 11, padding: '2px 8px', background: '#F1F5F9', color: '#64748B', borderRadius: 4 }}>{src}</span>
                    ))}
                  </div>
                </SectionBody>
              )}
            </SectionCard>
          );
        })}
      </Flex>

      {TABLE_SECTIONS.map((ts) => {
        const Icon = ts.icon;
        const isOpen = expanded[ts.id];
        return (
          <SectionCard key={ts.id} style={{ marginTop: 16 }}>
            <SectionHeader onClick={() => setExpanded(prev => ({ ...prev, [ts.id]: !prev[ts.id] }))}>
              <Flex alignItems="center" gap="16px">
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F0F6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} color="#2C81FC" />
                </div>
                <div>
                  <Flex alignItems="center" gap="8px">
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#25262C' }}>{ts.title}</span>
                  </Flex>
                  <div style={{ fontSize: 13, color: '#6E7687', marginTop: 4 }}>{ts.subtitle}</div>
                </div>
              </Flex>
              {isOpen ? <ChevronUp size={20} color="#6E7687" /> : <ChevronDown size={20} color="#6E7687" />}
            </SectionHeader>
            {isOpen && (
              <SectionBody>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E3E4E8' }}>
                      {ts.columns.map((col, ci) => (
                        <th key={ci} style={{ textAlign: 'left', padding: '8px 0', color: '#6E7687', fontWeight: 500, width: col.width }}>{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ts.rows.map((row, ri) => (
                      <tr key={ri} style={ri < ts.rows.length - 1 ? { borderBottom: '1px solid #F1F1F4' } : undefined}>
                        {row.map((cell, ci) => (
                          <td key={ci} style={{ padding: '10px 0', color: '#25262C' }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 12, borderTop: '1px solid #F1F1F4', marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: '#9CA3AF', marginRight: 4 }}>📎 참조:</span>
                  {ts.sources.map((src, i) => (
                    <span key={i} style={{ fontSize: 11, padding: '2px 8px', background: '#F1F5F9', color: '#64748B', borderRadius: 4 }}>{src}</span>
                  ))}
                </div>
              </SectionBody>
            )}
          </SectionCard>
        );
      })}
    </div>
  );
}
