import { getTag } from '../getTag';

/**
 * Parse a jsdoc string against provided tags only; custom tags may be included
 * 
 * @since v1.0.0
 * @param {string} jsdoc - The entire jsdoc string
 * @param {string[]} tags - The tags to parse
 * @returns {object} Object with keys of each parsed tag
 */
export const parseJsdocTags = (jsdoc: string, tags: string[]) => {
  const tag = getTag(jsdoc);
  
  return tags.reduce((accumulator, x) => ({
    ...accumulator,
    [x.replace('@', '')]: tag(x),
  }), {});
};