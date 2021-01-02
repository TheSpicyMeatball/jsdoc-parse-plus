import { isNullOrEmpty } from '../_private/utils';
import { GetCommentsFromFileConfig } from '../types';

/**
 * Extract all jsdoc comment strings from a file
 * 
 * @since v1.0.0
 * @param {string} file - String contents of a file
 * @param {GetCommentsFromFileConfig} [config={ keepIndent = false }] - The configuration for output formatting
 * @returns {string[]} Array of jsdoc strings
 * @docgen_types
 * // The configuration type for the util:
 * //   keepIndent?: boolean = false - Whether or not to keep the indentation of the entire jsdoc comment block
 * 
 * export type GetCommentsFromFileConfig = { keepIndent?: boolean };
 * @docgen_import { getCommentsFromFile, GetCommentsFromFileConfig }
 */
export const getCommentsFromFile = (file: string, { keepIndent = false } : GetCommentsFromFileConfig = {}) : string[] => {
  if (isNullOrEmpty(file)) return [];

  const regex = /^( *\/\*\*.*| *\*\/| *\* * *.*)/gm;
  const matches = Array.from(file.matchAll(regex));

  let output = [];
  let current = '';

  for (const match of matches) {
    if (match[0].indexOf('/**') >= 0 && match[0].indexOf('*/') >= 0) {
      output = [...output, current + (keepIndent ? match[0] : match[0].trimStart())];
      current = '';
    } else if (match[0].indexOf('*/') >= 0) {
      output = [...output, current + '\n' + (keepIndent ? match[0] : ' ' + match[0].trimStart())];
      current = '';
    } else if (match[0].indexOf('/**') >= 0) {
      current = (keepIndent ? match[0] : match[0].trimStart());
    } else {
      current = current + '\n' + (keepIndent ? match[0] : ' ' + match[0].trimStart());
    }
  }

  return output;
};