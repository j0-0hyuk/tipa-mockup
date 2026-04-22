import React from 'react';
import { Plus, Minus } from 'lucide-react';
import JSON5 from 'json5';
import { TamSamSom } from '@/markdown/components/CustomComponents/TamSamSom/TamSamSom';
import { Mermaid } from '@/markdown/components/CustomComponents/Mermaid/Mermaid';
import { tamSamSomPropsSchema } from '@/markdown/components/CustomComponents/TamSamSom/TamSamSom.schema';
import { ComposedChartComponent } from '@/markdown/components/CustomComponents/Rechart/ComposedChartBlock/ComposedChartBlock';
import { composedChartPropsSchema } from '@/markdown/components/CustomComponents/Rechart/ComposedChartBlock/ComposedChartBlock.schema';
import { donutChartPropsSchema } from '@/markdown/components/CustomComponents/Rechart/DonutChartBlock/DonutChartBlock.schema';
import { DonutChartComponent } from '@/markdown/components/CustomComponents/Rechart/DonutChartBlock/DonutChartBlock';
import { positioningMapPropsSchema } from '@/markdown/components/CustomComponents/PositioningMap/PositioningMap.schema';
import { PositioningMapComponent } from '@/markdown/components/CustomComponents/PositioningMap/PositioningMap';
import {
  StyledCustomComponentsWrapper,
  StyledDiffIcon,
  type CustomComponentMode
} from '@/markdown/components/CustomComponents/CustomComponents.style';
import { Flex } from '@docs-front/ui';
import { mermaidPropsSchema } from '@/markdown/components/CustomComponents/Mermaid/Mermaid.schema';
import { normalizeForJSON5 } from '@/markdown/components/CustomComponents/Mermaid/Mermaid.util';

export type { CustomComponentMode };

let __docxCaptureSeq = 0;
const withCapture = (
  name: string,
  node: React.ReactNode,
  mode: CustomComponentMode = 'normal',
  info?: string,
  noBorder = false
) => {
  const id = `docx-cap-${name}-${++__docxCaptureSeq}`;

  if (mode === 'normal') {
    return (
      <StyledCustomComponentsWrapper
        mode={mode}
        noBorder={noBorder}
        data-docx-capture={name}
        data-docx-id={id}
        data-docx-info={info}
        name={name}
      >
        {node}
      </StyledCustomComponentsWrapper>
    );
  }
  return (
    <Flex gap={8} width={'100%'}>
      <StyledDiffIcon mode={mode}>
        {mode === 'diff-before' ? (
          <Minus size={16} strokeWidth={2} />
        ) : (
          <Plus size={16} strokeWidth={2} />
        )}
      </StyledDiffIcon>
      <StyledCustomComponentsWrapper
        mode={mode}
        noBorder={noBorder}
        data-docx-capture={name}
        data-docx-id={id}
        data-docx-info={info}
        name={name}
      >
        {node}
      </StyledCustomComponentsWrapper>
    </Flex>
  );
};

export const createCustomComponents = (
  mode: CustomComponentMode = 'normal'
): Record<string, React.ElementType> => ({
  tamsamsom: ({ children }: { children?: React.ReactNode }) => {
    const raw = React.Children.toArray(children).join('').trim();
    try {
      const props = tamSamSomPropsSchema.parse(JSON5.parse(raw));
      return withCapture(
        'tamsamsom',
        <TamSamSom tamsamsomProps={props} />,
        mode,
        props.info ?? raw
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  mermaid: ({ children }: { children?: React.ReactNode }) => {
    const raw = React.Children.toArray(children).join('').trim();
    if (!raw) {
      return null;
    }

    const normalized = normalizeForJSON5(raw);

    let parsed: unknown;
    try {
      parsed = JSON5.parse(normalized);
    } catch {
      return withCapture(
        'mermaid',
        <Mermaid mermaidProps={{ mermaid: raw }} />,
        mode,
        raw,
        true
      );
    }

    try {
      const props = mermaidPropsSchema.parse(parsed);
      return withCapture(
        'mermaid',
        <Mermaid mermaidProps={props} />,
        mode,
        props.info ?? raw,
        true
      );
    } catch {
      return withCapture(
        'mermaid',
        <Mermaid mermaidProps={{ mermaid: raw }} />,
        mode,
        raw,
        true
      );
    }
  },

  composedchartcomponent: ({ children }: { children?: React.ReactNode }) => {
    const raw = React.Children.toArray(children).join('').trim();
    try {
      const props = composedChartPropsSchema.parse(JSON5.parse(raw));
      return withCapture(
        'composedchartcomponent',
        <ComposedChartComponent composedChartProps={props} />,
        mode,
        props.info ?? raw
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  donutchartcomponent: ({ children }: { children?: React.ReactNode }) => {
    const raw = React.Children.toArray(children).join('').trim();
    try {
      const props = donutChartPropsSchema.parse(JSON5.parse(raw));
      return withCapture(
        'donutchartcomponent',
        <DonutChartComponent donutChartProps={props} />,
        mode,
        props.info ?? raw
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  positioningmap: ({ children }: { children?: React.ReactNode }) => {
    const raw = React.Children.toArray(children).join('').trim();
    try {
      const props = positioningMapPropsSchema.parse(JSON5.parse(raw));
      return withCapture(
        'positioningmap',
        <PositioningMapComponent positioningMapProps={props} />,
        mode,
        props.info ?? raw,
        true
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  }
});

export const customComponents = createCustomComponents('normal');
