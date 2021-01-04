import { getTagMap } from '../_private/utils';
import { getTag } from '../getTag';
import { InlineLink } from '../types';

/**
 * Parse a jsdoc comment string against all potential jsdoc tags and optional custom tags
 * 
 * @since v1.0.0
 * @param {string} jsdoc - The entire jsdoc comment string
 * @param {string[]} [customTags=[]] - Optional array of custom tags parse
 * @param {(link: InlineLink) => string} [linkRenderer] - Optional function to override default rendering of inline link and tutorial tags
 * @returns {object} Object with keys of each parsed tag
 */
export const parse = (jsdoc: string, customTags: string[] = [], linkRenderer?: (link: InlineLink) => string) : Record<string, unknown> => {
  const tag = getTag(jsdoc, linkRenderer);
  const allTags =  [...Array.from(getTagMap().keys()), ...customTags];

  const output = allTags.reduce((accumulator, item) => {
    const data = tag(item);

    if (data && (!Array.isArray(data) || data.length > 0)) {
      return Object.assign(accumulator, {
        [item.replace('@', '')]: data,
      });
    }
    
    return accumulator;
  }, {});

  return output;
};