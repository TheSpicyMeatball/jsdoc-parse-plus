import { getTag } from '../getTag';

/**
 * Parse a jsDoc string against provided tags only; custom tags may be included
 * 
 * @since v1.0.0
 * @param {string} jsDoc - The entire jsDoc string
 * @param {string[]} tags - The tags to parse
 * @returns {object} Object with keys of each parsed tag
 */
export const jsDocParseTags = (jsDoc: string, tags: string[]) => {
  const tag = getTag(jsDoc);
  
  return tags.reduce((accumulator, x) => ({
    ...accumulator,
    [x.replace('@', '')]: tag(x),
  }), {});
};