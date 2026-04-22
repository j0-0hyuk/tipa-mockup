import styled from '@emotion/styled';
import * as Accordion from '@radix-ui/react-accordion';
import { keyframes } from '@emotion/react';

const slideDown = keyframes`
  from { height: 0; }
  to   { height: var(--radix-accordion-content-height); }
`;
const slideUp = keyframes`
  from { height: var(--radix-accordion-content-height); }
  to   { height: 0; }
`;

export const StyledAccordionHeader = styled(Accordion.Header)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin: 0 0 8px 0;
`;

export const StyledAccordionTrigger = styled(Accordion.Trigger)`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  border-radius: 999px;
  width: fit-content;
  height: fit-content;
  background-color: ${({ theme }) => theme.color.bgBlueGray};
  cursor: pointer;
  ${({ theme }) => theme.typo.Md_12}
`;

export const StyledAccordionContent = styled(Accordion.Content)`
  overflow: hidden;
  font-size: 14px;
  &[data-state='open'] {
    animation: ${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1);
  }
  &[data-state='closed'] {
    animation: ${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1);
  }
`;

export const StyledTipBox = styled.div`
  padding: 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.color.bgBlueGray};
  color: ${({ theme }) => theme.color.black};
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 0 0 8px 0;
`;

export const StyledTipLabel = styled.p`
  ${({ theme }) => theme.typo.Md_15}
  width: 100%;
`;
