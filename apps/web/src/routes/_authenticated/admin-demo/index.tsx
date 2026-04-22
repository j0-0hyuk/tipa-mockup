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
} from 'recharts';
import { TrendingUp, Users, Activity, FileText } from 'lucide-react';
import {
  StyledAdminHeader,
  StyledAdminTitle,
  StyledAdminSubtitle,
  StyledOperatorBadge,
  StyledKpiGrid,
  StyledKpiCard,
  StyledKpiLabel,
  StyledKpiValue,
  StyledKpiSub,
  StyledLiveDot,
  StyledCard,
  StyledCardTitle,
  StyledSectionGrid,
  StyledBadge,
  colors,
} from './-admin.style';
import {
  KPI,
  DAILY_VISITS,
  DAILY_DOCS,
  CURRENT_ONLINE,
  TOP_ACTIVE_USERS,
} from './-components/mockData';

export const Route = createFileRoute('/_authenticated/admin-demo/')({
  component: DashboardPage,
});

function DashboardPage() {
  const topUsers = TOP_ACTIVE_USERS;
  const maxDocs = topUsers[0]?.totalDocs || 1;

  return (
    <>
      <StyledAdminHeader>
        <div>
          <StyledAdminTitle>운영 현황 대시보드</StyledAdminTitle>
          <StyledAdminSubtitle>TIPA R&D 계획서 작성 지원 서비스 · 실시간 활용 모니터링</StyledAdminSubtitle>
        </div>
        <StyledOperatorBadge>
          <Shield />
          <span>운영자 · 홍길동</span>
        </StyledOperatorBadge>
      </StyledAdminHeader>

      {/* KPI 4개 */}
      <StyledKpiGrid>
        <StyledKpiCard>
          <StyledKpiLabel>
            <Users size={14} strokeWidth={2} color={colors.textMuted} />
            누적 가입자
          </StyledKpiLabel>
          <StyledKpiValue>{KPI.totalUsers.toLocaleString()}<span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>명</span></StyledKpiValue>
          <StyledKpiSub $positive>지난주 대비 +{KPI.weeklyUserGrowth}명</StyledKpiSub>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>
            <StyledLiveDot />
            현재 접속 중
          </StyledKpiLabel>
          <StyledKpiValue>{KPI.onlineNow}<span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>명</span></StyledKpiValue>
          <StyledKpiSub>실시간 집계 · 5초 주기 갱신</StyledKpiSub>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>
            <Activity size={14} strokeWidth={2} color={colors.textMuted} />
            이번 달 MAU
          </StyledKpiLabel>
          <StyledKpiValue>{KPI.mau}<span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>명</span></StyledKpiValue>
          <StyledKpiSub>가입자 중 54.7% 활성</StyledKpiSub>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>
            <FileText size={14} strokeWidth={2} color={colors.textMuted} />
            누적 생성 계획서
          </StyledKpiLabel>
          <StyledKpiValue>{KPI.totalDocs.toLocaleString()}<span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>건</span></StyledKpiValue>
          <StyledKpiSub $positive>지난주 대비 +{KPI.weeklyDocsGrowth}%</StyledKpiSub>
        </StyledKpiCard>
      </StyledKpiGrid>

      {/* 차트 2개 */}
      <StyledSectionGrid $cols={2}>
        <StyledCard>
          <StyledCardTitle>
            <span>일별 접속자 수</span>
            <StyledBadge $variant="info">최근 30일</StyledBadge>
          </StyledCardTitle>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={DAILY_VISITS} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.borderLight} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: colors.textMuted }} tickLine={false} axisLine={{ stroke: colors.border }} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: colors.textMuted }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ border: `1px solid ${colors.border}`, borderRadius: 8, fontSize: 12, padding: '8px 12px' }}
                  labelStyle={{ color: colors.textMuted, marginBottom: 4 }}
                  formatter={(v: number) => [`${v}명`, '접속자']}
                />
                <Line type="monotone" dataKey="visitors" stroke={colors.main} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </StyledCard>

        <StyledCard>
          <StyledCardTitle>
            <span>일별 계획서 생성 수</span>
            <StyledBadge $variant="info">최근 30일</StyledBadge>
          </StyledCardTitle>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={DAILY_DOCS} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.borderLight} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: colors.textMuted }} tickLine={false} axisLine={{ stroke: colors.border }} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: colors.textMuted }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ border: `1px solid ${colors.border}`, borderRadius: 8, fontSize: 12, padding: '8px 12px' }}
                  labelStyle={{ color: colors.textMuted, marginBottom: 4 }}
                  formatter={(v: number) => [`${v}건`, '생성 수']}
                />
                <Bar dataKey="docs" fill={colors.main} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </StyledCard>
      </StyledSectionGrid>

      {/* 하단 2개 섹션 */}
      <StyledSectionGrid $cols={2}>
        <StyledCard>
          <StyledCardTitle>
            <Flex alignItems="center" gap="8px">
              <StyledLiveDot />
              <span>현재 접속자</span>
            </Flex>
            <StyledBadge $variant="success">LIVE</StyledBadge>
          </StyledCardTitle>
          <Flex direction="column" gap="10px">
            {CURRENT_ONLINE.map((u) => (
              <Flex
                key={u.userId}
                alignItems="center"
                gap="12px"
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: colors.bg,
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: '#E0EBFF', color: colors.main,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, letterSpacing: '-0.02em', flexShrink: 0,
                }}>
                  {u.name.slice(0, 1)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: colors.text, letterSpacing: '-0.02em' }}>
                    {u.name}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: colors.textLight, letterSpacing: '-0.02em' }}>
                  {u.minutesAgo}분 전 접속
                </div>
              </Flex>
            ))}
          </Flex>
        </StyledCard>

        <StyledCard>
          <StyledCardTitle>
            <Flex alignItems="center" gap="8px">
              <TrendingUp size={16} strokeWidth={2} color={colors.main} />
              <span>활발한 사용자 Top 5</span>
            </Flex>
            <StyledBadge $variant="info">누적</StyledBadge>
          </StyledCardTitle>
          <Flex direction="column" gap="14px">
            {topUsers.map((u, i) => {
              const pct = (u.totalDocs / maxDocs) * 100;
              return (
                <div key={u.id}>
                  <Flex alignItems="center" justify="space-between" style={{ marginBottom: 6 }}>
                    <Flex alignItems="center" gap="8px">
                      <span style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: i === 0 ? colors.main : colors.bgHighlight,
                        color: i === 0 ? '#FFFFFF' : colors.main,
                        fontSize: 10, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: colors.text, letterSpacing: '-0.02em' }}>
                        {u.name}
                      </span>
                      <span style={{ fontSize: 11, color: colors.textMuted, letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                        {u.email}
                      </span>
                    </Flex>
                    <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, letterSpacing: '-0.02em' }}>
                      {u.totalDocs}건
                    </span>
                  </Flex>
                  <div style={{
                    width: '100%', height: 6, background: colors.bg, borderRadius: 999, overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${pct}%`, height: '100%',
                      background: colors.main, transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </Flex>
        </StyledCard>
      </StyledSectionGrid>
    </>
  );
}

/* 상단 뱃지용 아이콘 */
function Shield() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2C81FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
