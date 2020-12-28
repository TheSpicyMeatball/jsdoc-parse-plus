import { getTagMap } from './../_private/utils';
import { getTag } from '../getTag';

/**
 * Parse a jsDoc string against all available jsDoc tags and optional custom tags
 * 
 * @since v1.0.0
 * @param {string} jsDoc - The entire jsDoc string
 * @param {string[]} [customTags=[]] - Optional array of custom tags parse
 * @returns {object} Object with keys of each parsed tag
 */
export const jsDocParse = (jsDoc: string, customTags: string[] = []) => {
  const tag = getTag(jsDoc);
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