import { getTag } from '../getTag';

/**
 * Parse a jsdoc comment string against specified tags only; custom tags may be included
 * 
 * @since v1.0.0
 * @param {string} jsdoc - The entire jsdoc comment string
 * @param {string[]} tags - The tags to parse
 * @returns {object} Object with keys of each parsed tag
 */
export const parseTags = (jsdoc: string, tags: string[]) => {
  const tag = getTag(jsdoc);
  
  return tags.reduce((accumulator, x) => Object.assign(accumulator, {
    [x.replace('@', '')]: tag(x),
  }), {});
};