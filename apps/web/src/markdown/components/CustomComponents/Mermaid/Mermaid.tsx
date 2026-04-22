import { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { useChartColorKey } from '@/hooks/useChartColorKey';
import { chartTheme } from '@/markdown/chartTheme';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import type { MermaidProps } from '@/markdown/components/CustomComponents/Mermaid/Mermaid.schema';

const Container = styled.div<{ $isMobile: boolean }>`
  min-width: ${({ $isMobile }) => ($isMobile ? '300px' : '600px')};
  width: 100%;
  svg {
    max-width: 100%;
    height: auto;
  }

  [data-docx-capture='mermaid'] & {
    padding: 10px;
    border-radius: 4px;

    svg {
      color: white !important;
      display: block;
      margin: 0 auto;
    }
  }
`;

export function Mermaid({ mermaidProps }: { mermaidProps: MermaidProps }) {
  const [svgCode, setSvgCode] = useState<string>('');
  const { colorKey } = useChartColorKey();
  const theme = useTheme();
  const { sm } = useBreakPoints();
  const { mermaid: chart } = mermaidProps;
  useEffect(() => {
    let isMounted = true;
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      flowchart: { useMaxWidth: true },
      themeVariables: {
        fontFamily: 'Pretendard',
        primaryColor: chartTheme[colorKey].primary1,
        secondaryColor: chartTheme[colorKey].primary2,
        tertiaryColor: chartTheme[colorKey].primary3,
        textColor: theme.color.black,
        primaryTextColor: theme.color.white,
        lineColor: theme.color.black,
        arrowheadColor: theme.color.black,
        edgeLabelBackground: chartTheme[colorKey].primary1,
        primaryBorderColor: 'transparent'
      },
      themeCSS: `.node rect { rx: 4; ry: 4; }`
    });

    async function renderMermaid() {
      try {
        const parseOk = await mermaid.parse(chart, { suppressErrors: true });
        if (!parseOk) {
          console.error('Mermaid parse failed:', chart);
          return;
        }
        const result = await mermaid.render(
          `mermaidChart_${Math.random().toString(36).substr(2, 9)}`,
          chart
        );
        if (isMounted) {
          setSvgCode(result.svg);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
      }
    }

    renderMermaid();

    return () => {
      isMounted = false;
    };
  }, [chart, colorKey, theme]);

  return (
    <Container $isMobile={sm} dangerouslySetInnerHTML={{ __html: svgCode }} />
  );
}
