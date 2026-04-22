import { createFileRoute } from '@tanstack/react-router';
import { Flex } from '@docs-front/ui';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, Clock, RefreshCcw, Sparkles, AlertTriangle } from 'lucide-react';
import {
  StyledAdminHeader,
  StyledAdminTitle,
  StyledAdminSubtitle,
  StyledOperatorBadge,
  StyledCard,
  StyledCardTitle,
  StyledSectionGrid,
  StyledKpiGrid,
  StyledKpiCard,
  StyledKpiLabel,
  StyledKpiValue,
  StyledKpiSub,
  StyledBadge,
  colors,
} from '../-admin.style';
import {
  QUALITY_METRICS,
  QUALITY_TREND,
  CATEGORY_PASS_RATES,
  IMPROVEMENT_AREAS,
} from '../-components/mockData';

export const Route = createFileRoute('/_authenticated/admin-demo/quality')({
  component: QualityPage,
});

function QualityPage() {
  return (
    <>
      <StyledAdminHeader>
        <div>
          <StyledAdminTitle>서비스 품질 지표</StyledAdminTitle>
          <StyledAdminSubtitle>AI 품질 · 효율성 · 사용자 만족도 종합 모니터링</StyledAdminSubtitle>
        </div>
        <StyledOperatorBadge>운영자 · 홍길동</StyledOperatorBadge>
      </StyledAdminHeader>

      {/* 핵심 지표 4개 */}
      <StyledKpiGrid>
        <StyledKpiCard>
          <StyledKpiLabel>
            <TrendingUp size={14} strokeWidth={2} color={colors.textMuted} />
            평균 AI 품질 점수
          </StyledKpiLabel>
          <StyledKpiValue>
            {QUALITY_METRICS.avgScore}
            <span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>점</span>
          </StyledKpiValue>
          <StyledKpiSub $positive>지난 달 대비 +{QUALITY_METRICS.scoreDelta}</StyledKpiSub>
        </StyledKpiCard>

        <StyledKpiCard>
          <StyledKpiLabel>
            <Clock size={14} strokeWidth={2} color={colors.textMuted} />
            작성 시간 단축
          </StyledKpiLabel>
          <StyledKpiValue>
            {QUALITY_METRICS.avgTimeSaved}
            <span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>%</span>
          </StyledKpiValue>
          <StyledKpiSub>기존 수작업 대비 평균</StyledKpiSub>
        </StyledKpiCard>

        <StyledKpiCard>
          <StyledKpiLabel>
            <RefreshCcw size={14} strokeWidth={2} color={colors.textMuted} />
            재사용률
          </StyledKpiLabel>
          <StyledKpiValue>
            {QUALITY_METRICS.reuseRate}
            <span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>%</span>
          </StyledKpiValue>
          <StyledKpiSub>2회 이상 방문한 사용자 비율</StyledKpiSub>
        </StyledKpiCard>

        <StyledKpiCard>
          <StyledKpiLabel>
            <Sparkles size={14} strokeWidth={2} color={colors.textMuted} />
            AI 제안 반영률
          </StyledKpiLabel>
          <StyledKpiValue>
            {QUALITY_METRICS.aiAdoptionRate}
            <span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>%</span>
          </StyledKpiValue>
          <StyledKpiSub>사용자가 실제 반영한 비율</StyledKpiSub>
        </StyledKpiCard>
      </StyledKpiGrid>

      {/* 월별 추이 + 항목별 통과율 */}
      <StyledSectionGrid $cols={2}>
        <StyledCard>
          <StyledCardTitle>
            <span>월별 AI 품질 점수 추이</span>
            <StyledBadge $variant="info">최근 6개월</StyledBadge>
          </StyledCardTitle>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={QUALITY_TREND} margin={{ top: 16, right: 16, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.borderLight} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: colors.textMuted }} tickLine={false} axisLine={{ stroke: colors.border }} />
                <YAxis domain={[70, 95]} tick={{ fontSize: 11, fill: colors.textMuted }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ border: `1px solid ${colors.border}`, borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${v.toFixed(1)}점`, '평균 점수']}
                />
                <ReferenceLine y={85} stroke="#16A34A" strokeDasharray="4 4" label={{ value: '우수 기준', fontSize: 10, fill: '#16A34A', position: 'right' }} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={colors.main}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: colors.main, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </StyledCard>

        <StyledCard>
          <StyledCardTitle>
            <span>항목별 검토 통과율</span>
            <StyledBadge $variant="info">8개 항목</StyledBadge>
          </StyledCardTitle>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart
                data={CATEGORY_PASS_RATES}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 90, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.borderLight} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: colors.textMuted }} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 11, fill: colors.text }}
                  tickLine={false}
                  axisLine={{ stroke: colors.border }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{ border: `1px solid ${colors.border}`, borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${v}%`, '통과율']}
                  cursor={{ fill: colors.bg }}
                />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                  {CATEGORY_PASS_RATES.map((d, i) => (
                    <Cell key={i} fill={d.rate >= 85 ? '#22C55E' : d.rate >= 75 ? colors.main : '#F59E0B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </StyledCard>
      </StyledSectionGrid>

      {/* 개선 필요 영역 Top 5 */}
      <StyledCard>
        <StyledCardTitle>
          <Flex alignItems="center" gap="8px">
            <AlertTriangle size={16} strokeWidth={2} color="#F59E0B" />
            <span>개선 필요 영역 Top 5</span>
          </Flex>
          <StyledBadge $variant="warn">이번 달 집계</StyledBadge>
        </StyledCardTitle>
        <Flex direction="column" gap="12px">
          {IMPROVEMENT_AREAS.map((item, i) => {
            const max = IMPROVEMENT_AREAS[0].count;
            const pct = (item.count / max) * 100;
            const severityColor =
              item.severity === 'high' ? '#DC2626' : item.severity === 'medium' ? '#F59E0B' : '#6E7687';
            const severityBg =
              item.severity === 'high' ? '#FDECEC' : item.severity === 'medium' ? '#FEF4E6' : '#F3F4F6';
            const severityLabel =
              item.severity === 'high' ? '높음' : item.severity === 'medium' ? '보통' : '낮음';

            return (
              <div key={item.area}>
                <Flex alignItems="center" justify="space-between" style={{ marginBottom: 8 }}>
                  <Flex alignItems="center" gap="10px">
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: colors.bgHighlight, color: colors.main,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: colors.text, letterSpacing: '-0.02em' }}>
                      {item.area}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: '-0.01em',
                      padding: '3px 8px', borderRadius: 999,
                      background: severityBg, color: severityColor,
                    }}>
                      {severityLabel}
                    </span>
                  </Flex>
                  <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, letterSpacing: '-0.02em' }}>
                    {item.count}건
                  </span>
                </Flex>
                <div style={{ width: '100%', height: 6, background: colors.bg, borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`, height: '100%',
                    background: severityColor,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </Flex>
      </StyledCard>
    </>
  );
}
