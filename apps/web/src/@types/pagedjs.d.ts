/**
 * TypeScript Declaration file for 'pagedjs'
 *
 * This file provides minimal type definitions for pagedjs
 * to resolve the ts(7016) error and provide basic type-checking.
 */
declare module 'pagedjs' {
  /**
   * The main class for creating paged.js previews.
   */
  export class Previewer {
    /**
     * Renders the content into a paged preview.
     * @param content The HTML string or DOM Node to be paged.
     * @param css An array of CSS stylesheet URLs or style strings.
     * @param target The DOM element where the paged preview will be rendered.
     * @returns A Promise that resolves with a 'flow' object containing details about the rendered pages.
     */
    preview(
      content: string | Node,
      css: string[],
      target: HTMLElement
    ): Promise<Flow>; // The return type is a 'flow' object, but 'any' is safe here.

    // You can add other paged.js methods here if you use them.
  }

  // You can declare other exports from 'pagedjs' here if needed.
}
