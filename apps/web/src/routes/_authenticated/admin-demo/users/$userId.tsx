import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { Flex } from '@docs-front/ui';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ChevronLeft, Mail, Phone, Calendar, Clock, FileText, Sparkles } from 'lucide-react';
import {
  StyledAdminHeader,
  StyledAdminTitle,
  StyledAdminSubtitle,
  StyledOperatorBadge,
  StyledBackLink,
  StyledCard,
  StyledCardTitle,
  StyledSectionGrid,
  StyledKpiGrid,
  StyledKpiCard,
  StyledKpiLabel,
  StyledKpiValue,
  StyledKpiSub,
  StyledProfileHeader,
  StyledAvatar,
  StyledProfileInfo,
  StyledProfileName,
  StyledProfileMeta,
  StyledTableWrapper,
  StyledTable,
  StyledBadge,
  StyledTimeline,
  StyledTimelineItem,
  StyledTimelineDot,
  StyledTimelineTime,
  colors,
} from '../-admin.style';
import {
  USERS,
  getUserDocuments,
  getUserMonthlyDocs,
  getUserActivityTimeline,
  formatDate,
  formatDateTime,
  timeAgo,
  avatarColor,
} from '../-components/mockData';

export const Route = createFileRoute('/_authenticated/admin-demo/users/$userId')({
  component: UserDetailPage,
});

function UserDetailPage() {
  const { userId } = useParams({ strict: false }) as { userId: string };
  const navigate = useNavigate();
  const user = USERS.find((u) => u.id === userId);

  if (!user) {
    return (
      <div>
        <StyledBackLink onClick={() => navigate({ to: '/admin-demo/users' as any })}>
          <ChevronLeft size={14} /> 사용자 목록으로
        </StyledBackLink>
        <StyledCard>
          <div style={{ padding: 40, textAlign: 'center', color: colors.textMuted }}>
            사용자를 찾을 수 없습니다.
          </div>
        </StyledCard>
      </div>
    );
  }

  const documents = getUserDocuments(userId);
  const monthly = getUserMonthlyDocs(userId);
  const timeline = getUserActivityTimeline(userId);

  const statusLabel = user.status === 'active' ? '활성' : user.status === 'new' ? '신규' : '휴면';
  const statusVariant = user.status === 'active' ? 'success' : user.status === 'new' ? 'info' : 'warn';

  return (
    <>
      <StyledBackLink onClick={() => navigate({ to: '/admin-demo/users' as any })}>
        <ChevronLeft size={14} /> 사용자 목록으로
      </StyledBackLink>

      <StyledAdminHeader>
        <div>
          <StyledAdminTitle>사용자 상세</StyledAdminTitle>
          <StyledAdminSubtitle>{user.email}</StyledAdminSubtitle>
        </div>
        <StyledOperatorBadge>운영자 · 홍길동</StyledOperatorBadge>
      </StyledAdminHeader>

      {/* 프로필 헤더 */}
      <StyledProfileHeader>
        <StyledAvatar $color={avatarColor(user.id)}>
          {user.name.slice(0, 1)}
        </StyledAvatar>
        <StyledProfileInfo>
          <Flex alignItems="center" gap="10px">
            <StyledProfileName>{user.name}</StyledProfileName>
            <StyledBadge $variant={statusVariant}>{statusLabel}</StyledBadge>
          </Flex>
          <StyledProfileMeta>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Mail size={13} /> {user.email}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Phone size={13} /> {user.phone}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={13} /> 가입 {formatDate(user.joinedAt)}
            </span>
          </StyledProfileMeta>
        </StyledProfileInfo>
      </StyledProfileHeader>

      {/* 사용량 KPI 4개 */}
      <StyledKpiGrid>
        <StyledKpiCard>
          <StyledKpiLabel>
            <FileText size={14} strokeWidth={2} color={colors.textMuted} />
            총 생성 문서
          </StyledKpiLabel>
          <StyledKpiValue>{user.totalDocs}<span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>건</span></StyledKpiValue>
          <StyledKpiSub>이번 달 {user.docsThisMonth}건</StyledKpiSub>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>
            <Clock size={14} strokeWidth={2} color={colors.textMuted} />
            총 접속 횟수
          </StyledKpiLabel>
          <StyledKpiValue>{user.totalSessions}<span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>회</span></StyledKpiValue>
          <StyledKpiSub>마지막 접속 {timeAgo(user.lastAccessAt)}</StyledKpiSub>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>
            <Clock size={14} strokeWidth={2} color={colors.textMuted} />
            평균 체류 시간
          </StyledKpiLabel>
          <StyledKpiValue>{user.avgSessionMinutes}<span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>분</span></StyledKpiValue>
          <StyledKpiSub>세션당 평균</StyledKpiSub>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>
            <Sparkles size={14} strokeWidth={2} color={colors.textMuted} />
            AI 검토 사용
          </StyledKpiLabel>
          <StyledKpiValue>{user.aiReviewCount}<span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>회</span></StyledKpiValue>
          <StyledKpiSub>문서당 평균 {(user.aiReviewCount / Math.max(1, user.totalDocs)).toFixed(1)}회</StyledKpiSub>
        </StyledKpiCard>
      </StyledKpiGrid>

      {/* 월별 차트 + 활동 타임라인 */}
      <StyledSectionGrid $cols={2}>
        <StyledCard>
          <StyledCardTitle>월별 문서 생성 추이</StyledCardTitle>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <LineChart data={monthly} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.borderLight} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: colors.textMuted }} tickLine={false} axisLine={{ stroke: colors.border }} />
                <YAxis tick={{ fontSize: 11, fill: colors.textMuted }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ border: `1px solid ${colors.border}`, borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${v}건`, '생성 수']}
                />
                <Line type="monotone" dataKey="docs" stroke={colors.main} strokeWidth={2} dot={{ r: 3, fill: colors.main }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </StyledCard>

        <StyledCard>
          <StyledCardTitle>활동 타임라인</StyledCardTitle>
          <StyledTimeline>
            {timeline.map((item, i) => (
              <StyledTimelineItem key={i}>
                <StyledTimelineDot />
                <Flex direction="column" style={{ flex: 1 }}>
                  <span>{item.label}</span>
                  <StyledTimelineTime>{item.time}</StyledTimelineTime>
                </Flex>
              </StyledTimelineItem>
            ))}
          </StyledTimeline>
        </StyledCard>
      </StyledSectionGrid>

      {/* 생성 문서 목록 */}
      <StyledCard style={{ marginTop: 24 }}>
        <StyledCardTitle>
          <span>생성한 계획서</span>
          <StyledBadge $variant="neutral">{documents.length}건</StyledBadge>
        </StyledCardTitle>
        <div style={{ marginLeft: -24, marginRight: -24, marginBottom: -24 }}>
          <StyledTable>
            <thead>
              <tr>
                <th style={{ width: '58%', paddingLeft: 24 }}>제목</th>
                <th style={{ width: '14%' }}>생성일</th>
                <th style={{ width: '14%', textAlign: 'right' }}>AI 품질 점수</th>
                <th style={{ width: '14%', textAlign: 'center', paddingRight: 24 }}>상태</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d) => (
                <tr key={d.id} style={{ cursor: 'default' }}>
                  <td style={{ paddingLeft: 24, fontSize: 13, fontWeight: 500, color: colors.text }}>{d.title}</td>
                  <td style={{ fontSize: 13, color: colors.textMuted }}>{formatDateTime(d.createdAt)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: 13, fontWeight: 700,
                      color: d.qualityScore >= 85 ? '#16A34A' : d.qualityScore >= 75 ? '#D97706' : '#DC2626',
                    }}>
                      {d.qualityScore}점
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', paddingRight: 24 }}>
                    {d.state === '완료' && <StyledBadge $variant="success">{d.state}</StyledBadge>}
                    {d.state === '검토중' && <StyledBadge $variant="info">{d.state}</StyledBadge>}
                    {d.state === '초안' && <StyledBadge $variant="neutral">{d.state}</StyledBadge>}
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: 40, textAlign: 'center', color: colors.textMuted }}>
                    생성된 문서가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </div>
      </StyledCard>

      {/* Wrapper for StyledTableWrapper (하단 여백 위해) */}
      <div style={{ height: 20 }} />
    </>
  );
}
