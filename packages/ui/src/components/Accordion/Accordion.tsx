import {
  StyledAccordionContent,
  StyledAccordionHeader,
  StyledAccordionTrigger,
  StyledTipBox,
  StyledTipLabel
} from '#components/Accordion/Accordion.style.ts';
import { Flex } from '#components/Flex/Flex.tsx';
import * as RAccordion from '@radix-ui/react-accordion';
import { ChevronDown, Dot, Lightbulb } from 'lucide-react';

interface AccordionProps {
  children: React.ReactNode;
  tooltip: string[] | string;
  tipLabel?: string;
}

export const Accordion = ({ children, tooltip, tipLabel }: AccordionProps) => {
  return (
    <RAccordion.Root type="single" collapsible>
      <RAccordion.Item value="item-1">
        <StyledAccordionHeader>
          {children}
          {tooltip && tipLabel && (
            <StyledAccordionTrigger className="AccordionTrigger">
              <Lightbulb size={16} />
              {tipLabel}
              <ChevronDown className="AccordionChevron" aria-hidden />
            </StyledAccordionTrigger>
          )}
        </StyledAccordionHeader>
        <StyledAccordionContent className="AccordionContent">
          <StyledTipBox>
            {Array.isArray(tooltip) && (
              <Flex direction="column" gap={2}>
                {tooltip.map((item) => (
                  <Flex key={item} direction="row" alignItems="start" gap={2}>
                    <Flex padding={'2px 0 0 0'}>
                      <Dot size={16} />
                    </Flex>
                    <StyledTipLabel>{item}</StyledTipLabel>
                  </Flex>
                ))}
              </Flex>
            )}
          </StyledTipBox>
        </StyledAccordionContent>
      </RAccordion.Item>
    </RAccordion.Root>
  );
};
