import styled from '@emotion/styled';
import { Flex } from '@bichon/ds';
import { Link } from '@tanstack/react-router';

export const SidebarContainer = styled(Flex)`
  width: 240px;
  min-height: 100vh;
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding: 24px 0;
`;

export const SidebarLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export const SidebarExternalLink = styled.a`
  text-decoration: none;
  color: inherit;
`;

interface SidebarItemProps {
  $isActive: boolean;
}

export const SidebarItem = styled(Flex)<SidebarItemProps>`
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${({ $isActive }) =>
    $isActive ? '#e0e7ff' : 'transparent'};
  color: ${({ $isActive }) => ($isActive ? '#4f46e5' : '#64748b')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? '#e0e7ff' : '#f1f5f9')};
  }
`;

export const SidebarIcon = styled.span`
  font-size: 20px;
`;

interface SidebarLabelProps {
  $isActive: boolean;
}

export const SidebarLabel = styled.span<SidebarLabelProps>`
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '500')};
  font-size: 14px;
`;
