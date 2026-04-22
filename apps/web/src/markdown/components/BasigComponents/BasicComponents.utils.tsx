import React from 'react';
import JSON5 from 'json5';
import { H2 } from '@/markdown/components/BasigComponents/BasicComponents.style';
import SourcePopover from '@/markdown/components/CustomComponents/SourcePopover/SourcePopover';
import { Flex } from '@docs-front/ui';

export function HasCustomComponent(children: React.ReactNode): boolean {
  const childArray = React.Children.toArray(children);
  return childArray.some((child) => {
    if (React.isValidElement(child)) {
      const childType = child.type;
      let typeName = '';

      if (typeof childType === 'function') {
        typeName = childType.name || '';
      } else if (typeof childType === 'string') {
        typeName = childType;
      }

      const customTags = [
        'tamsamsom',
        'mermaid',
        'composedchartcomponent',
        'donutchartcomponent',
        'positioningmap'
      ];
      return customTags.some((tag) => typeName.toLowerCase().includes(tag));
    }
    return false;
  });
}

export function ParseSourcesFromText(text: string): {
  title: string;
  sources: string[] | null;
} {
  const bracketIndex = text.lastIndexOf('[');
  if (bracketIndex === -1) {
    return { title: text, sources: null };
  }

  const closingBracketIndex = text.indexOf(']', bracketIndex);
  if (closingBracketIndex === -1) {
    return { title: text, sources: null };
  }

  try {
    const arrayPart = text.slice(bracketIndex, closingBracketIndex + 1);
    const sources = JSON5.parse(arrayPart);

    if (Array.isArray(sources) && sources.every((s) => typeof s === 'string')) {
      const title = text.slice(0, bracketIndex).trim();
      return { title, sources };
    }
  } catch {
    // JSON 파싱 실패하면 출처 없는 것으로 처리
  }

  return { title: text, sources: null };
}

export function ExtractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string') {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(ExtractTextFromChildren).join('');
  }

  if (React.isValidElement(children)) {
    return ExtractTextFromChildren(children.props.children);
  }

  return '';
}
export function H2WithSources(props: React.ComponentPropsWithoutRef<'h2'>) {
  const { children, ...restProps } = props;
  const textContent = ExtractTextFromChildren(children);
  const { title, sources } = ParseSourcesFromText(textContent);

  if (sources && sources.length > 0) {
    return (
      <Flex
        margin="1rem 0px 0px 0px"
        direction="row"
        alignItems="center"
        gap={8}
      >
        <H2 withSources {...restProps}>
          {title}
        </H2>
        <SourcePopover sourceUrls={sources} />
      </Flex>
    );
  }

  return <H2 {...restProps}>{children}</H2>;
}

export function CreateH2WithoutSources(
  StyledH2: React.ComponentType<React.ComponentPropsWithoutRef<'h2'>>
) {
  return function H2WithoutSources(
    props: React.ComponentPropsWithoutRef<'h2'>
  ) {
    const { children, ...restProps } = props;
    const textContent = ExtractTextFromChildren(children);
    const { title } = ParseSourcesFromText(textContent);

    return <StyledH2 {...restProps}>{title}</StyledH2>;
  };
}
