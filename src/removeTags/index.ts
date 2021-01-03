import { first, getTagRegExp, isNotNullOrEmpty } from '../_private/utils';

/**
 * Removes a set of tags from jsdoc
 * 
 * @param {string} jsdoc - The entire jsdoc string
 * @param {string[]} tags - Array of string tags to remove
 * @returns {string} The jsdoc string the specified tags removed
 */
export const removeTags = (jsdoc: string, tags: string[]) : string => {
  for (const tag of tags) {
    const _tag = tag.startsWith('@') ? tag : '@' + tag;

    if (_tag === '@description') {
      jsdoc = removeTaglessDescription(jsdoc);
    }
    const matches = Array.from(jsdoc.matchAll(getTagRegExp(_tag)));

    for (const match of matches) {
      jsdoc = jsdoc.replace(match[0], '');
    }
  }

  return /^\/\*\*( *)?\/|\/\*\*( *)?(?:\r\n|\r|\n)*(?: ?\*(?:\r\n|\r|\n)?\/?)*$/.test(jsdoc) ? '/** */' : jsdoc.replace(/\*\*\//g, '*/');
};

const removeTaglessDescription = (jsdoc: string) : string => {
  const regex = /\/\*\*( *)(.*)(\r\n|\r|\n)*((?:(?:(?! @).)(?:\{@link|\{@tutorial))*(?:(?!( @)).)*(\r\n|\r|\n)?)*/gm;
  const match = first(Array.from(jsdoc.matchAll(regex)));

  if (isNotNullOrEmpty(match[2])) {
    const end = new RegExp(/\*\/ *$/);
    return end.test(match[2]) ? jsdoc.replace(regex, '/** */') : jsdoc.replace(regex, '/**\n *');
  }

  return jsdoc.replace(regex, '/**\n *');
};