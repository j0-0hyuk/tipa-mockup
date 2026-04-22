import React from 'react';
import { TamSamSom } from '@/make/pages/demo/loading/components/CustomComponents/TamSamSom/TamSamSom';
import { Mermaid } from '@/make/pages/demo/loading/components/CustomComponents/Mermaid/Mermaid';
import { tamSamSomPropsSchema } from '@/make/pages/demo/loading/components/CustomComponents/TamSamSom/TamSamSom.schema';
import { ComposedChartComponent } from '@/make/pages/demo/loading/components/CustomComponents/Rechart/ComposedChartBlock/ComposedChartBlock';
import { composedChartPropsSchema } from '@/make/pages/demo/loading/components/CustomComponents/Rechart/ComposedChartBlock/ComposedChartBlock.schema';
import { donutChartPropsSchema } from '@/make/pages/demo/loading/components/CustomComponents/Rechart/DonutChartBlock/DonutChartBlock.schema';
import { DonutChartComponent } from '@/make/pages/demo/loading/components/CustomComponents/Rechart/DonutChartBlock/DonutChartBlock';
import { positioningMapPropsSchema } from '@/make/pages/demo/loading/components/CustomComponents/PositioningMap/PositioningMap.schema';
import { PositioningMapComponent } from '@/make/pages/demo/loading/components/CustomComponents/PositioningMap/PositioningMap';
import { CaptureWrapper } from '@/make/pages/demo/loading/components/CustomComponents/CustomComponents.style';
import { mermaidPropsSchema } from '@/make/pages/demo/loading/components/CustomComponents/Mermaid/Mermaid.schema';
import { normalizeJsonString } from '@/make/pages/demo/loading/components/CustomComponents/Mermaid/Mermaid.util';

let __docxCaptureSeq = 0;
const withCapture = (name: string, node: React.ReactNode, info?: string) => {
  const id = `docx-cap-${name}-${++__docxCaptureSeq}`;
  return (
    <CaptureWrapper
      name={name}
      data-docx-capture={name}
      data-docx-id={id}
      data-docx-info={info}
    >
      {node}
    </CaptureWrapper>
  );
};

export const customComponents: Record<string, React.ElementType> = {
  tamsamsom: ({ children }: { children?: React.ReactNode }) => {
    const raw = React.Children.toArray(children).join('').trim();
    try {
      const props = tamSamSomPropsSchema.parse(JSON.parse(raw));
      return withCapture(
        'tamsamsom',
        <TamSamSom tamsamsomProps={props} />,
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

    const normalized = normalizeJsonString(raw);

    let parsed: unknown;
    try {
      parsed = JSON.parse(normalized);
    } catch {
      return withCapture(
        'mermaid',
        <Mermaid mermaidProps={{ chart: raw }} />,
        raw
      );
    }

    try {
      const props = mermaidPropsSchema.parse(parsed);
      return withCapture(
        'mermaid',
        <Mermaid mermaidProps={props} />,
        props.info ?? raw
      );
    } catch {
      return withCapture(
        'mermaid',
        <Mermaid mermaidProps={{ chart: raw }} />,
        raw
      );
    }
  },

  composedchartcomponent: ({ children }: { children?: React.ReactNode }) => {
    const raw = React.Children.toArray(children).join('').trim();
    try {
      const props = composedChartPropsSchema.parse(JSON.parse(raw));
      return withCapture(
        'composedchartcomponent',
        <ComposedChartComponent composedChartProps={props} />,
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
      const props = donutChartPropsSchema.parse(JSON.parse(raw));
      return withCapture(
        'donutchartcomponent',
        <DonutChartComponent donutChartProps={props} />,
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
      const props = positioningMapPropsSchema.parse(JSON.parse(raw));
      return withCapture(
        'positioningmap',
        <PositioningMapComponent positioningMapProps={props} />,
        props.info ?? raw
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  }
};
