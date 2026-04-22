/**
 * @import {Html} from 'mdast'
 */
import { diffArrays } from 'diff';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { h } from 'hastscript';
import { removePosition } from 'unist-util-remove-position';
import { v4 as uuidv4 } from 'uuid';
import { type RootContent, type Element, type Root } from 'hast';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeFormat from 'rehype-format';
import rehypeRemark from 'rehype-remark';
import { toHtml } from 'hast-util-to-html';
import { format } from 'hast-util-format';
import { type State } from 'hast-util-to-mdast';
import { select } from 'hast-util-select';

const handler = (state: State, node: Element) => {
  /** @type {Html} **/
  const hast = h();
  hast.children.push(node);
  format(hast, { indent: 0, indentInitial: false });
  const result = {
    type: 'html' as const,
    value: toHtml(hast)
  };

  state.patch(node, result);
  return result;
};

class DocshuntMarkdown {
  private _markdown: string;

  constructor(markdown: string) {
    this._markdown = markdown;
  }

  get markdown() {
    return this._markdown;
  }

  static from(markdown: string) {
    return new DocshuntMarkdown(markdown);
  }

  static toMdast(markdown: string) {
    return unified().use(remarkParse).use(remarkGfm).parse(markdown);
  }

  static toMarkdown(hast: Root) {
    const mdast = unified()
      .use(rehypeRaw)
      .use(rehypeRemark, {
        handlers: {
          diffwrap: handler,
          mermaid: handler,
          positioningmap: handler,
          composedchartcomponent: handler,
          donutchartcomponent: handler,
          tamsamsom: handler,
          diffbefore: handler,
          diffafter: handler
        },
        newlines: true
      })
      .runSync(hast);

    return unified().use(remarkGfm).use(remarkStringify).stringify(mdast);
  }

  static toHast(markdown: string) {
    const mdast = DocshuntMarkdown.toMdast(markdown);
    const hast = unified()
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeFormat)
      .runSync(mdast);

    removePosition(hast);

    return hast;
  }

  private getDiffNodeId(node: Element) {
    if (
      node.tagName === 'diffwrap' &&
      node.properties.id &&
      typeof node.properties.id === 'string'
    ) {
      return node.properties.id;
    }

    return null;
  }

  getAllDiffNodeIds() {
    const tree = DocshuntMarkdown.toHast(this.markdown);

    const ids = tree.children
      .filter((node) => node.type === 'element')
      .map((node) => this.getDiffNodeId(node))
      .filter((id) => id !== null);
    return ids;
  }

  private getDiffNodeElements(node: Element, type: 'diffbefore' | 'diffafter') {
    if (node.tagName === 'diffwrap') {
      const diff = select(type, node);

      if (diff && diff.type === 'element' && diff.tagName === type) {
        return diff.children;
      }
    }

    return null;
  }

  private applyOrCancel(ids: string[], type: 'diffbefore' | 'diffafter') {
    const tree = DocshuntMarkdown.toHast(this.markdown);

    const newHast = h();

    const children = tree.children
      .map((node) => {
        if (node.type !== 'element' || node.tagName !== 'diffwrap') return node;

        const id = this.getDiffNodeId(node as Element);

        if (!id || !ids.includes(id)) return node;

        const elements = this.getDiffNodeElements(node as Element, type);

        if (!elements) return node;

        return elements;
      })
      .flat();

    newHast.children.push(...children);

    this._markdown = DocshuntMarkdown.toMarkdown(newHast);

    return this;
  }

  diff(markdown: string) {
    const prevTree = DocshuntMarkdown.toHast(this.markdown);
    const nextTree = DocshuntMarkdown.toHast(markdown);

    const result = diffArrays(prevTree.children, nextTree.children, {
      comparator: (a, b) => JSON.stringify(a) === JSON.stringify(b)
    });

    let added: RootContent[] | null = null;
    let removed: RootContent[] | null = null;
    const newHast = h();

    for (const diff of result) {
      if (
        (added && !diff.removed) ||
        (removed && !diff.added) ||
        (added && removed)
      ) {
        const diffNode = h('diffwrap', { id: uuidv4() }, [
          h('diffbefore', removed),
          h('diffafter', added)
        ]);
        newHast.children.push(diffNode);
        added = null;
        removed = null;
      }

      if (diff.added) {
        added = diff.value;
      } else if (diff.removed) {
        removed = diff.value;
      } else {
        for (const item of diff.value) {
          newHast.children.push(item);
        }
      }
    }

    if (added || removed) {
      const diffNode = h('diffwrap', { id: uuidv4() }, [
        h('diffbefore', removed),
        h('diffafter', added)
      ]);
      newHast.children.push(diffNode);
      added = null;
      removed = null;
    }

    this._markdown = DocshuntMarkdown.toMarkdown(newHast);
    return this;
  }

  apply(ids: string[]) {
    return this.applyOrCancel(ids, 'diffafter');
  }

  cancel(ids: string[]) {
    return this.applyOrCancel(ids, 'diffbefore');
  }

  applyAll() {
    const ids = this.getAllDiffNodeIds();
    return this.apply(ids);
  }

  cancelAll() {
    const ids = this.getAllDiffNodeIds();
    return this.cancel(ids);
  }
}

export default DocshuntMarkdown;
