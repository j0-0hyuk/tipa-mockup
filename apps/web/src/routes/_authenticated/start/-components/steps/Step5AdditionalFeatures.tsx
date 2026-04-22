import styled from '@emotion/styled';
import { Flex } from '@docs-front/ui';
import { StyledStepTitle, StyledInfoBanner } from '../../-route.style';
import { GitCompareArrows, Calculator, Tag, Building2, ExternalLink, ChevronRight } from 'lucide-react';

// 더미 데이터
const SIMILAR_PROJECTS = [
  { name: 'AI 기반 지능형 문서 자동 생성 시스템 개발', org: '(주)테크솔루션', year: '2024', budget: '3.2억', similarity: 87 },
  { name: '자연어처리 기반 R&D 보고서 품질 분석 플랫폼', org: '(주)데이터사이언스', year: '2023', budget: '2.8억', similarity: 74 },
  { name: '생성형 AI 활용 기술문서 자동 작성 도구 개발', org: '(주)인텔리닷', year: '2024', budget: '4.1억', similarity: 71 },
];

const BUDGET_GUIDE = [
  { category: '직접비 - 인건비', ratio: '40~50%', amount: '1.6억 ~ 2.0억', status: 'ok', note: '현재 45% — 적정 범위' },
  { category: '직접비 - 연구장비/재료비', ratio: '15~25%', amount: '0.6억 ~ 1.0억', status: 'ok', note: '현재 20% — 적정 범위' },
  { category: '위탁연구개발비', ratio: '≤30%', amount: '≤1.2억', status: 'warn', note: '현재 35% — 상한 초과, 조정 필요' },
  { category: '간접비', ratio: '규정 비율', amount: '자동 산정', status: 'ok', note: '현재 적용 비율 적정' },
  { category: '외부 전문기술 활용비', ratio: '≤10%', amount: '≤0.4억', status: 'ok', note: '현재 8% — 적정 범위' },
];

const TECH_CATEGORIES = [
  { standard: '산업기술표준분류', code: 'IT-03-02', name: '자연어처리/텍스트마이닝', confidence: 94 },
  { standard: '전략기술로드맵', code: 'AI-2024-07', name: '생성형 AI 활용 문서 자동화', confidence: 89 },
  { standard: '국가전략품목', code: 'NST-AI-04', name: 'AI 기반 업무 자동화 솔루션', confidence: 82 },
];

const TEST_INSTITUTIONS = [
  { name: 'TTA (한국정보통신기술협회)', field: 'AI/SW 성능 시험', cert: 'GS인증, 성능시험', contact: '031-780-9114' },
  { name: 'KOLAS 인정 시험기관 (KTC)', field: 'SW 품질 인증', cert: 'ISO/IEC 25010', contact: '02-860-1114' },
  { name: 'NIA (한국지능정보사회진흥원)', field: 'AI 품질 검증', cert: 'AI 바우처, 품질평가', contact: '053-230-1114' },
];

const FeatureCard = styled.div`
  border: 1px solid #E3E4E8;
  border-radius: 12px;
  padding: 24px;
`;

const FeatureHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const IconCircle = styled.div<{ $bg: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MiniTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    text-align: left;
    padding: 10px 12px;
    font-weight: 500;
    color: #6E7687;
    border-bottom: 1px solid #E3E4E8;
    background: #FAFAFC;
  }

  td {
    padding: 10px 12px;
    border-bottom: 1px solid #F1F1F4;
    color: #25262C;
  }
`;

const SimilarityBar = styled.div<{ $value: number }>`
  width: 60px;
  height: 6px;
  background: #F1F1F4;
  border-radius: 3px;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ $value }) => $value}%;
    background: ${({ $value }) => $value > 80 ? '#F59E0B' : '#2C81FC'};
    border-radius: 3px;
  }
`;

const StatusDot = styled.span<{ $ok: boolean }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $ok }) => $ok ? '#22C55E' : '#F59E0B'};
  margin-right: 6px;
`;

const ConfidenceBadge = styled.span<{ $value: number }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $value }) => $value >= 90 ? '#F0FDF4' : $value >= 80 ? '#F0F6FF' : '#FAFAFC'};
  color: ${({ $value }) => $value >= 90 ? '#16A34A' : $value >= 80 ? '#2C81FC' : '#6E7687'};
`;

const LinkButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #2C81FC;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  &:hover { text-decoration: underline; }
`;

export function Step5AdditionalFeatures() {
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      <StyledStepTitle style={{ textAlign: 'left' }}>
        AI 분석 부가 정보
      </StyledStepTitle>

      <StyledInfoBanner>
        <span style={{ color: '#6E7687', flexShrink: 0, fontSize: 14 }}>&#9432;</span>
        입력하신 정보를 기반으로 유사 과제, 연구비 기준, 기술 분류, 시험기관 정보를 자동으로 분석했습니다.
      </StyledInfoBanner>

      <Flex direction="column" gap={20}>
        {/* 유사과제 매핑 */}
        <FeatureCard>
          <FeatureHeader>
            <IconCircle $bg="#F0F6FF"><GitCompareArrows size={20} color="#2C81FC" /></IconCircle>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#25262C' }}>유사 과제 매핑</div>
              <div style={{ fontSize: 13, color: '#6E7687', marginTop: 2 }}>기존 R&D 과제 데이터와 자동 비교하여 참고 정보를 제공합니다</div>
            </div>
          </FeatureHeader>
          <MiniTable>
            <thead>
              <tr><th>과제명</th><th>수행기관</th><th>연도</th><th>연구비</th><th>유사도</th></tr>
            </thead>
            <tbody>
              {SIMILAR_PROJECTS.map((p, i) => (
                <tr key={i}>
                  <td>
                    <LinkButton>{p.name} <ExternalLink size={12} /></LinkButton>
                  </td>
                  <td>{p.org}</td>
                  <td>{p.year}</td>
                  <td>{p.budget}</td>
                  <td>
                    <Flex alignItems="center" gap="8px">
                      <SimilarityBar $value={p.similarity} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: p.similarity > 80 ? '#D97706' : '#2C81FC' }}>{p.similarity}%</span>
                    </Flex>
                  </td>
                </tr>
              ))}
            </tbody>
          </MiniTable>
        </FeatureCard>

        {/* 연구비 편성 가이드 */}
        <FeatureCard>
          <FeatureHeader>
            <IconCircle $bg="#F0FDF4"><Calculator size={20} color="#16A34A" /></IconCircle>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#25262C' }}>연구비 편성 가이드</div>
              <div style={{ fontSize: 13, color: '#6E7687', marginTop: 2 }}>총 연구비 4.0억 원 기준 항목별 적정성을 자동 검토합니다</div>
            </div>
          </FeatureHeader>
          <MiniTable>
            <thead>
              <tr><th>비목</th><th>기준 비율</th><th>적정 금액</th><th>상태</th><th>비고</th></tr>
            </thead>
            <tbody>
              {BUDGET_GUIDE.map((b, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{b.category}</td>
                  <td>{b.ratio}</td>
                  <td>{b.amount}</td>
                  <td><StatusDot $ok={b.status === 'ok'} />{b.status === 'ok' ? '적정' : '조정 필요'}</td>
                  <td style={{ fontSize: 12, color: '#6E7687' }}>{b.note}</td>
                </tr>
              ))}
            </tbody>
          </MiniTable>
        </FeatureCard>

        {/* 기술분류 추천 */}
        <FeatureCard>
          <FeatureHeader>
            <IconCircle $bg="#FFF7ED"><Tag size={20} color="#F59E0B" /></IconCircle>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#25262C' }}>기술 분류 추천</div>
              <div style={{ fontSize: 13, color: '#6E7687', marginTop: 2 }}>산업기술표준분류, 전략기술로드맵, 국가전략품목과 연계한 자동 분류</div>
            </div>
          </FeatureHeader>
          <MiniTable>
            <thead>
              <tr><th>분류 체계</th><th>코드</th><th>분류명</th><th>신뢰도</th></tr>
            </thead>
            <tbody>
              {TECH_CATEGORIES.map((t, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{t.standard}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{t.code}</td>
                  <td>{t.name}</td>
                  <td><ConfidenceBadge $value={t.confidence}>{t.confidence}%</ConfidenceBadge></td>
                </tr>
              ))}
            </tbody>
          </MiniTable>
        </FeatureCard>

        {/* 시험/인증기관 탐색 */}
        <FeatureCard>
          <FeatureHeader>
            <IconCircle $bg="#F5F0FF"><Building2 size={20} color="#8B5CF6" /></IconCircle>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#25262C' }}>시험/인증 기관 탐색</div>
              <div style={{ fontSize: 13, color: '#6E7687', marginTop: 2 }}>성능지표에 적합한 공인 시험 및 인증 기관 정보</div>
            </div>
          </FeatureHeader>
          <MiniTable>
            <thead>
              <tr><th>기관명</th><th>시험 분야</th><th>인증 종류</th><th>연락처</th></tr>
            </thead>
            <tbody>
              {TEST_INSTITUTIONS.map((t, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{t.name}</td>
                  <td>{t.field}</td>
                  <td>{t.cert}</td>
                  <td style={{ fontSize: 12, color: '#6E7687' }}>{t.contact}</td>
                </tr>
              ))}
            </tbody>
          </MiniTable>
        </FeatureCard>
      </Flex>
    </div>
  );
}
