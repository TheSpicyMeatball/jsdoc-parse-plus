import { getTagMap } from '../_private/utils';
import { getTag } from '../getTag';

/**
 * Parse a jsdoc string against all available jsdoc tags and optional custom tags
 * 
 * @since v1.0.0
 * @param {string} jsdoc - The entire jsdoc string
 * @param {string[]} [customTags=[]] - Optional array of custom tags parse
 * @returns {object} Object with keys of each parsed tag
 */
export const parseJsdoc = (jsdoc: string, customTags: string[] = []) => {
  const tag = getTag(jsdoc);
  const allTags =  [...Array.from(getTagMap().keys()), ...customTags];

  const output = allTags.reduce((accumulator, item) => {
    const data = tag(item);

    if (data && (!Array.isArray(data) || data.length > 0)) {
      return {
        ...accumulator,
        [item.replace('@', '')]: data,
      };
    }
    
    return accumulator;
  }, {});

  return output;
};