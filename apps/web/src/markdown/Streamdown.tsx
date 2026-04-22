import styled from '@emotion/styled';
import { customComponents } from '@/markdown/components/CustomComponents/CustomComponents';
import { basicComponents } from '@/markdown/components/BasigComponents/BasicComponents';
import { diffComponents } from '@/markdown/components/DiffComponents/DiffComponents';
import { normalizeEscapedEmphasis } from '@/markdown/utils/normalizeEscapedEmphasis';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Streamdown as StreamdownComponent } from 'streamdown';

const StyledStreamdownWrapper = styled.div`
  @media (max-width: 500px) {
    transform: scale(0.45);
    transform-origin: top left;
    width: 225%;
    height: 225%;
    display: inline-block;
  }
`;

export default function Streamdown({ children }: { children: string }) {
  const normalizedMarkdown = normalizeEscapedEmphasis(children);

  const streamdownComponent = (
    <StreamdownComponent
      remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
      rehypePlugins={[rehypeRaw]}
      components={{
        ...basicComponents,
        ...customComponents,
        ...diffComponents
      }}
      parseIncompleteMarkdown={false}
    >
      {normalizedMarkdown}
    </StreamdownComponent>
  );

  return (
    <StyledStreamdownWrapper>{streamdownComponent}</StyledStreamdownWrapper>
  );
}
