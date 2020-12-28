import { ITag, ToJsdocStringConfig } from '../types';
import { isNullOrEmpty } from '../_private/utils';

/**
 * Convert object to a jsdoc string
 * 
 * @since v1.0.0
 * @param {{[tag: string]: ITag | Array<ITag | ITag[]>}} tags - Object containing keys of tags
 * @param {ToJsdocStringConfig} [config={ indentChars = 0 }] - The configuration for output formatting
 * @returns {string} The jsdoc string
 * @docgen_types
 * // The configuration type for the util:
 * //   indentChars?: number = 0 - The number of characters that the output string should be indented
 * 
 * export type ToJsdocStringConfig = { indentChars?: number };
 * @docgen_import { toJsdocString, ToJsdocStringConfig }
 */
export const toJsdocString = (tags: {[tag: string]: ITag | Array<ITag|ITag[]>}, { indentChars = 0 }: ToJsdocStringConfig = {}) : string => {
  if (isNullOrEmpty(tags)) return '';

  let output = `${' '.repeat(indentChars)}/**`;
  const indent = ' '.repeat(indentChars + 1);
  
  for (const key in tags) {
    if (Object.prototype.hasOwnProperty.call(tags, key)) {
      const tag = tags[key];

      if (Array.isArray(tag)) {
        output = output + tag.map(t => `\n${indent}* ${(t as ITag).raw.replace(/(\r\n|\r|\n)/g, `\n${indent}* `)}`).join('')
      } else {
        output = `${output}\n${indent}* ${(tags[key] as ITag).raw.replace(/(\r\n|\r|\n)/g, `\n${indent}* `)}`;
      }      
    }
  }

  return output + `\n${indent}*/`;
};