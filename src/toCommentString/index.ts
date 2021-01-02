import { ITag, ToCommentStringConfig } from '../types';
import { isNullOrEmpty } from '../_private/utils';

/**
 * Convert an object to a jsdoc comment string
 * 
 * @since v1.0.0
 * @param {{[tag: string]: ITag | Array<ITag | ITag[]>}} tags - Object containing keys of tags
 * @param {ToCommentStringConfig} [config={ indentChars = 0 }] - The configuration for output formatting
 * @returns {string} The jsdoc string
 * @docgen_types
 * // The configuration type for the util:
 * //   indentChars?: number = 0 - The number of characters that the output string should be indented
 * 
 * export type ToCommentStringConfig = { indentChars?: number };
 * @docgen_import { toCommentString, ToCommentStringConfig }
 */
export const toCommentString = (tags: {[tag: string]: ITag | Array<ITag | ITag[]>}, { indentChars = 0 }: ToCommentStringConfig = {}) : string => {
  if (isNullOrEmpty(tags)) return '';

  let output = `${' '.repeat(indentChars)}/**`;
  const indent = ' '.repeat(indentChars + 1);
  
  for (const key in tags) {
    const tag = tags[key];

    if (Array.isArray(tag)) {
      output = output + tag.map(t => `\n${indent}* ${(t as ITag).raw.replace(/(\r\n|\r|\n)/g, `\n${indent}* `)}`).join('')
    } else {
      output = `${output}\n${indent}* ${(tags[key] as ITag).raw.replace(/(\r\n|\r|\n)/g, `\n${indent}* `)}`;
    }
  }

  return output + `\n${indent}*/`;
};