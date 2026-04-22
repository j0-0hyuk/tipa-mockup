import styled from '@emotion/styled';

// ─── Page Layout ────────────────────────────────────────
export const PageLayout = styled.div`
  display: flex;
  gap: 24px;
  height: calc(100vh - 120px);
  position: relative;
`;

export const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  transition: all 0.3s ease;
  width: 100%;
`;

export const PageHeader = styled.div`
  margin-bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

export const PageTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: bold;
`;

export const PageDescription = styled.p`
  margin: 0;
  color: #64748b;
`;

// ─── Card / Section ─────────────────────────────────────
export const SectionCard = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
  padding: 24px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
`;

export const SectionDivider = styled.hr`
  border: none;
  height: 1px;
  background-color: #f1f5f9;
  margin: 20px 0;
`;

// ─── Account Profile Header ────────────────────────────
export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
`;

export const ProfileAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
`;

export const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const ProfileName = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
`;

export const ProfileEmail = styled.span`
  font-size: 13px;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ProfileBadges = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 2px;
`;

export const ProfileMeta = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8fafc;
  border-radius: 10px;
  margin-top: 16px;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const MetaLabel = styled.span`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
`;

export const MetaValue = styled.span`
  font-size: 13px;
  color: #334155;
  font-weight: 600;
`;

// ─── Stat Cards ─────────────────────────────────────────
export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

export const StatCard = styled.div<{ $variant?: 'default' | 'success' | 'error' | 'purple' }>`
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: ${(props) => {
    switch (props.$variant) {
      case 'success':
        return '#f0fdf4';
      case 'error':
        return '#fef2f2';
      case 'purple':
        return '#faf5ff';
      default:
        return '#f8fafc';
    }
  }};
  border: 1px solid ${(props) => {
    switch (props.$variant) {
      case 'success':
        return '#dcfce7';
      case 'error':
        return '#fee2e2';
      case 'purple':
        return '#f3e8ff';
      default:
        return '#f1f5f9';
    }
  }};
`;

export const StatLabel = styled.span`
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
`;

export const StatValue = styled.span`
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
`;

export const StatSub = styled.span`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
`;

// ─── Subscription Info ──────────────────────────────────
export const SubscriptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  padding: 16px 20px;
  background-color: #f8fafc;
  border-radius: 10px;
`;

export const SubscriptionItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SubscriptionLabel = styled.span`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

export const SubscriptionValue = styled.span`
  font-size: 14px;
  color: #1e293b;
  font-weight: 600;
`;

// ─── Badges ─────────────────────────────────────────────
export const SubscriptionTypeBadge = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  background-color: ${(props) => {
    switch (props.$type) {
      case 'MONTHLY_PASS':
        return '#d1fae5';
      case 'SEASON_PASS':
        return '#ede9fe';
      case 'SUBSCRIPTION_M':
        return '#dbeafe';
      case 'SUBSCRIPTION_Y':
        return '#fef3c7';
      default:
        return '#f1f5f9';
    }
  }};
  color: ${(props) => {
    switch (props.$type) {
      case 'MONTHLY_PASS':
        return '#059669';
      case 'SEASON_PASS':
        return '#7c3aed';
      case 'SUBSCRIPTION_M':
        return '#2563eb';
      case 'SUBSCRIPTION_Y':
        return '#d97706';
      default:
        return '#475569';
    }
  }};
`;

export const RoleBadge = styled.span<{ $role: string }>`
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  background-color: ${(props) => {
    switch (props.$role) {
      case 'ADMIN':
        return '#fee2e2';
      case 'SUB':
        return '#dbeafe';
      case 'MONTHLY_PASS':
        return '#d1fae5';
      case 'SEASON_PASS':
        return '#ede9fe';
      default:
        return '#f1f5f9';
    }
  }};
  color: ${(props) => {
    switch (props.$role) {
      case 'ADMIN':
        return '#dc2626';
      case 'SUB':
        return '#2563eb';
      case 'MONTHLY_PASS':
        return '#059669';
      case 'SEASON_PASS':
        return '#7c3aed';
      default:
        return '#475569';
    }
  }};
`;

export const ProBadge = styled.span<{ $active: boolean }>`
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${(props) => (props.$active ? '#dbeafe' : '#f1f5f9')};
  color: ${(props) => (props.$active ? '#1d4ed8' : '#94a3b8')};
`;

export const StatusBadge = styled.span<{ $status: string }>`
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.$status) {
      case 'ACTIVE':
        return '#d1fae5';
      case 'SCHEDULED':
        return '#fef3c7';
      case 'EXPIRED':
        return '#fee2e2';
      default:
        return '#f1f5f9';
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case 'ACTIVE':
        return '#059669';
      case 'SCHEDULED':
        return '#d97706';
      case 'EXPIRED':
        return '#dc2626';
      default:
        return '#475569';
    }
  }};
`;

export const ProviderBadge = styled.span<{ $provider: string }>`
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.$provider) {
      case 'GOOGLE':
        return '#fef3c7';
      case 'LOCAL':
        return '#e0e7ff';
      default:
        return '#f1f5f9';
    }
  }};
  color: ${(props) => {
    switch (props.$provider) {
      case 'GOOGLE':
        return '#b45309';
      case 'LOCAL':
        return '#4338ca';
      default:
        return '#475569';
    }
  }};
`;

// ─── Form Elements ──────────────────────────────────────
export const FormContainer = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
  padding: 24px;
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
`;

export const Input = styled.input`
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.15s;
  background-color: #ffffff;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
  }

  &:disabled {
    background-color: #f8fafc;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  background-color: #ffffff;
  transition: all 0.15s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
  }
`;

export const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 12px;
`;

export const QuickActionButtons = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const QuickActionButton = styled.button`
  padding: 6px 10px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background-color: #f1f5f9;
    border-color: #cbd5e1;
    color: #1e293b;
  }

  &:active {
    transform: scale(0.97);
  }
`;

// ─── Credit Display ─────────────────────────────────────
export const CreditValue = styled.span<{ $type: 'free' | 'paid' }>`
  font-weight: 600;
  color: ${(props) => (props.$type === 'free' ? '#059669' : '#7c3aed')};
`;

// ─── Table ──────────────────────────────────────────────
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

export const TableHeader = styled.thead`
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

export const TableHeaderCell = styled.th<{ $sortable?: boolean }>`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
  cursor: ${(props) => (props.$sortable ? 'pointer' : 'default')};
  user-select: none;

  &:hover {
    background-color: ${(props) => (props.$sortable ? '#f1f5f9' : 'transparent')};
  }
`;

export const SortIcon = styled.span<{ $active?: boolean; $direction?: 'asc' | 'desc' | 'ASC' | 'DESC' }>`
  margin-left: 4px;
  display: inline-block;
  opacity: ${(props) => (props.$active ? 1 : 0.3)};
  transform: ${(props) => (props.$direction?.toUpperCase() === 'DESC' ? 'rotate(180deg)' : 'none')};
  transition: all 0.2s;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr<{ $clickable?: boolean; $selected?: boolean }>`
  border-bottom: 1px solid #f1f5f9;
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};
  background-color: ${(props) => (props.$selected ? '#f5f3ff' : 'transparent')};
  transition: background-color 0.15s;

  &:hover {
    background-color: ${(props) => (props.$selected ? '#ede9fe' : '#f8fafc')};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 12px 16px;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

// ─── Pagination ─────────────────────────────────────────
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid ${(props) => (props.$active ? '#6366f1' : '#e2e8f0')};
  border-radius: 8px;
  background-color: ${(props) => (props.$active ? '#6366f1' : '#ffffff')};
  color: ${(props) => (props.$active ? '#ffffff' : '#475569')};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$active ? '#4f46e5' : '#f8fafc')};
    border-color: ${(props) => (props.$active ? '#4f46e5' : '#cbd5e1')};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const PaginationInfo = styled.span`
  font-size: 14px;
  color: #6b7280;
  margin: 0 8px;
`;

// ─── Empty / Loading States ─────────────────────────────
export const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`;

export const LoadingState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`;

// ─── Legacy (keep for compatibility) ────────────────────
export const AccountInfo = styled.div`
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`;

export const InfoValue = styled.span`
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
  word-break: break-word;
  overflow-wrap: break-word;
`;

export const InlineAccountInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  align-items: center;
  padding: 16px 20px;
  background-color: #f9fafb;
  border-radius: 8px;
`;

export const InlineInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;

export const InlineInfoLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;

  &::after {
    content: ':';
  }
`;

export const InlineInfoValue = styled.span`
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const InfoSectionTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
`;

export const TabToggle = styled.div`
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px 16px;
  border: none;
  background-color: ${(props) => (props.$active ? '#3b82f6' : '#ffffff')};
  color: ${(props) => (props.$active ? '#ffffff' : '#374151')};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.$active ? '#2563eb' : '#f9fafb')};
  }

  &:not(:last-of-type) {
    border-right: 1px solid #d1d5db;
  }
`;

export const UsageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

export const UsageCard = styled.div`
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const UsageCardTitle = styled.span`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`;

export const UsageCardValue = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
`;

export const GenerationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

export const GenerationTableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  th,
  td {
    padding: 8px 12px;
    text-align: left;
  }

  th {
    font-weight: 600;
    color: #475569;
    background-color: #f8fafc;
  }

  td {
    color: #1f2937;
  }
`;

// ─── Confirm Modal ───────────────────────────────────
export const ConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ConfirmContent = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 90%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

export const ConfirmHeader = styled.div`
  padding: 20px 24px 0;
`;

export const ConfirmTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

export const ConfirmBody = styled.div`
  padding: 16px 24px;
`;

export const ConfirmFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
`;

// ─── Diff Table ──────────────────────────────────────
export const DiffTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DiffRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background-color: #f8fafc;
  border-radius: 8px;
`;

export const DiffLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  min-width: 80px;
`;

export const DiffOldValue = styled.span`
  font-size: 14px;
  color: #94a3b8;
  text-decoration: line-through;
`;

export const DiffArrow = styled.span`
  font-size: 14px;
  color: #94a3b8;
`;

export const DiffNewValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
`;

export const WarningText = styled.p`
  margin: 8px 0 0;
  padding: 10px 14px;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #dc2626;
`;

// ─── Tab Navigation ──────────────────────────────────
export const TabNav = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e2e8f0;
`;

export const TabNavItem = styled.button<{ $active: boolean }>`
  padding: 12px 20px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.$active ? '#6366f1' : '#64748b')};
  cursor: pointer;
  position: relative;
  transition: color 0.15s;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background-color: ${(props) => (props.$active ? '#6366f1' : 'transparent')};
    border-radius: 1px 1px 0 0;
    transition: background-color 0.15s;
  }

  &:hover {
    color: ${(props) => (props.$active ? '#6366f1' : '#334155')};
  }
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 0;
  border: none;
  background: none;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: #0f172a;
  }
`;

// ─── Progress Bar ────────────────────────────────────
export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
`;

export const ProgressFill = styled.div<{ $percent: number; $variant?: 'success' | 'error' | 'purple' }>`
  height: 100%;
  border-radius: 3px;
  width: ${(props) => Math.min(props.$percent, 100)}%;
  background-color: ${(props) => {
    switch (props.$variant) {
      case 'success':
        return '#22c55e';
      case 'error':
        return '#ef4444';
      case 'purple':
        return '#8b5cf6';
      default:
        return '#6366f1';
    }
  }};
  transition: width 0.3s ease;
`;

// ─── Payment Cancel ─────────────────────────────────
export const CancelStatusBadge = styled.span<{ $status: 'FULL' | 'PARTIAL' | null }>`
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.$status) {
      case 'FULL':
        return '#fee2e2';
      case 'PARTIAL':
        return '#fef3c7';
      default:
        return '#d1fae5';
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case 'FULL':
        return '#dc2626';
      case 'PARTIAL':
        return '#d97706';
      default:
        return '#059669';
    }
  }};
`;

export const TextArea = styled.textarea`
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.15s;
  background-color: #ffffff;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`;

export const RadioLabel = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid ${(props) => (props.$checked ? '#6366f1' : '#e2e8f0')};
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.$checked ? '#6366f1' : '#475569')};
  background-color: ${(props) => (props.$checked ? '#f5f3ff' : '#ffffff')};
  transition: all 0.15s;

  &:hover {
    border-color: ${(props) => (props.$checked ? '#6366f1' : '#cbd5e1')};
  }

  input[type='radio'] {
    accent-color: #6366f1;
  }
`;

export const DangerButton = styled.button`
  padding: 10px 20px;
  background-color: #dc2626;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background-color: #b91c1c;
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #ffffff;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
  }
`;

export const PaymentSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  background-color: #f8fafc;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
`;

export const PaymentSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`;

export const PaymentSummaryLabel = styled.span`
  color: #64748b;
  font-weight: 500;
`;

export const PaymentSummaryValue = styled.span`
  color: #0f172a;
  font-weight: 600;
`;

export const RefundButton = styled.button`
  padding: 4px 10px;
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fee2e2;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background-color: #fee2e2;
    border-color: #fecaca;
  }
`;

export const PaddleNote = styled.span`
  font-size: 12px;
  color: #9ca3af;
`;
