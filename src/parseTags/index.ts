import { getTag } from '../getTag';
import { InlineLink } from '../types';

/**
 * Parse a jsdoc comment string against specified tags only; custom tags may be included
 * 
 * @since v1.0.0
 * @param {string} jsdoc - The entire jsdoc comment string
 * @param {string[]} tags - The tags to parse
 * @param {(link: InlineLink) => string} [linkRenderer] - Optional function to override default rendering of inline link and tutorial tags
 * @returns {object} Object with keys of each parsed tag
 * @docgen_note
 * For more information on <code>linkRenderer</code>, please see {@link #using-linkRenderer|Using a custom linkRenderer}.
 */
export const parseTags = (jsdoc: string, tags: string[], linkRenderer?: (link: InlineLink) => string) : Record<string, unknown> => {
  const tag = getTag(jsdoc, linkRenderer);
  
  return tags.reduce((accumulator, x) => Object.assign(accumulator, {
    [x.replace('@', '')]: tag(x),
  }), {});
};