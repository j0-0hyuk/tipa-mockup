import styled from '@emotion/styled';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const PageHeader = styled.div`
  margin-bottom: 0;
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

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

export const DashboardCard = styled.div`
  padding: 24px;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

export const CardTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1e293b;
`;

export const CardDescription = styled.p`
  margin: 0;
  color: #64748b;
`;