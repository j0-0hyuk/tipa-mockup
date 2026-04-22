import React from 'react';
import type { Components } from 'react-markdown';
import {
  H1,
  P,
  Ul,
  Ol,
  Table,
  Hr,
  Blockquote,
  H3,
  TdHighlight,
  Link
} from '@/markdown/components/BasigComponents/BasicComponents.style';
import {
  HasCustomComponent,
  H2WithSources,
  CreateH2WithoutSources
} from '@/markdown/components/BasigComponents/BasicComponents.utils';
import {
  H1DiffBefore,
  H2DiffBefore,
  H3DiffBefore,
  PDiffBefore,
  UlDiffBefore,
  OlDiffBefore,
  HrDiffBefore,
  BlockquoteDiffBefore,
  TableDiffBefore
} from '@/markdown/components/BasigComponents/BasicComponents.diff.before.style';
import {
  H1DiffAfter,
  H2DiffAfter,
  H3DiffAfter,
  PDiffAfter,
  UlDiffAfter,
  OlDiffAfter,
  HrDiffAfter,
  BlockquoteDiffAfter,
  TableDiffAfter,
  TableCellInnerDiffAfter
} from '@/markdown/components/BasigComponents/BasicComponents.diff.after.style';

export const basicComponents: Components = {
  h1: (props) => <H1 {...props} />,
  h2: (props) => <H2WithSources {...props} />,
  h3: (props) => <H3 {...props} />,
  p: (props) => {
    if (HasCustomComponent(props.children)) {
      return <div style={{ display: 'contents' }}>{props.children}</div>;
    }
    return <P {...props} />;
  },
  ul: (props) => <Ul {...props} />,
  ol: (props) => <Ol {...props} />,
  hr: (props) => <Hr {...props} />,
  blockquote: (props) => <Blockquote {...props} />,
  table: (props) => <Table {...props} />,
  th: (props) => <th {...props} />,
  td: (props) => {
    const text = React.Children.toArray(props.children).join('');
    const isMyItem = text.includes('[MI]');

    if (isMyItem) {
      const content = text.replace('[MI]', '');
      return <TdHighlight {...props}>{content}</TdHighlight>;
    }

    return <td {...props} />;
  },
  strong: (props) => <strong {...props} style={{ fontWeight: 'semibold' }} />,
  code: () => {
    return null;
  },
  a: (props) => {
    return <Link {...props} />;
  }
};

export const diffBeforeBasicComponents: Components = {
  h1: (props) => <H1DiffBefore {...props} />,
  h2: CreateH2WithoutSources(H2DiffBefore),
  h3: (props) => <H3DiffBefore {...props} />,
  p: (props) => {
    if (HasCustomComponent(props.children)) {
      return <div style={{ display: 'contents' }}>{props.children}</div>;
    }
    return <PDiffBefore {...props} />;
  },
  ul: (props) => <UlDiffBefore {...props} />,
  ol: (props) => <OlDiffBefore {...props} />,
  hr: (props) => <HrDiffBefore {...props} />,
  blockquote: (props) => <BlockquoteDiffBefore {...props} />,
  table: (props) => <TableDiffBefore {...props} />,
  th: (props) => <th {...props} />,
  td: (props) => {
    const text = React.Children.toArray(props.children).join('');
    const content = text.replace('[MI]', '');
    return <td {...props}>{content}</td>;
  },
  strong: (props) => (
    <strong
      {...props}
      style={{ fontWeight: 'semibold', textDecoration: 'line-through' }}
    />
  ),
  code: () => {
    return null;
  }
};

export const diffAfterBasicComponents: Components = {
  h1: (props) => <H1DiffAfter {...props} />,
  h2: CreateH2WithoutSources(H2DiffAfter),
  h3: (props) => <H3DiffAfter {...props} />,
  p: (props) => {
    if (HasCustomComponent(props.children)) {
      return <div style={{ display: 'contents' }}>{props.children}</div>;
    }
    return <PDiffAfter {...props} />;
  },
  ul: (props) => <UlDiffAfter {...props} />,
  ol: (props) => <OlDiffAfter {...props} />,
  hr: (props) => <HrDiffAfter {...props} />,
  blockquote: (props) => <BlockquoteDiffAfter {...props} />,
  table: (props) => <TableDiffAfter {...props} />,
  td: (props) => {
    const text = React.Children.toArray(props.children).join('');
    const content = text.replace('[MI]', '');
    return (
      <td>
        <TableCellInnerDiffAfter>{content}</TableCellInnerDiffAfter>
      </td>
    );
  },
  th: (props) => <th {...props} />,
  strong: (props) => (
    <strong
      {...props}
      style={{
        fontWeight: 'semibold',
        color: '#0853c0',
        backgroundColor: 'var(--bg-main)'
      }}
    />
  ),
  code: () => {
    return null;
  }
};
