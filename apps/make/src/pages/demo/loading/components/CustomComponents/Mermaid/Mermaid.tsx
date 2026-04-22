import { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { chartTheme } from '@/make/pages/demo/loading/chartTheme';
import { useTheme } from '@emotion/react';
import { useBreakPoints } from '@/make/hooks/useBreakPoints';
import type { MermaidProps } from '@/apps/make/src/pages/demo/loading/components/CustomComponents/Mermaid/Mermaid.schema';
import { Container } from '@/apps/make/src/pages/demo/loading/components/CustomComponents/Mermaid/Mermaid.style';

export function Mermaid({ mermaidProps }: { mermaidProps: MermaidProps }) {
  const [svgCode, setSvgCode] = useState<string>('');
  const colorKey = 'GRAY';
  const theme = useTheme();
  const { sm } = useBreakPoints();
  const { chart } = mermaidProps;
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
        lineColor: chartTheme[colorKey].primary1,
        arrowheadColor: chartTheme[colorKey].primary1,
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
