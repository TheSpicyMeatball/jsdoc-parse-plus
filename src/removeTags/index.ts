import { first, getTagRegExp, isNullOrEmpty, isNotNullOrEmpty } from '../_private/utils';

/**
 * Removes a set of tags from jsDoc
 * 
 * @param {string} jsDoc - The entire jsDoc string
 * @param {string[]} tags - Array of string tags to remove
 * @returns {string} The jsDoc string the specified tags removed
 */
export const removeTags = (jsDoc: string, tags: string[]) : string => {
  for (const tag of tags) {
    const _tag = tag.startsWith('@') ? tag : '@' + tag;

    if (_tag === '@description') {
      jsDoc = removeTaglessDescription(jsDoc);
    }
    const matches = Array.from(jsDoc.matchAll(getTagRegExp(_tag)));

    for (const match of matches) {
      if (match[3]?.length > 0 && match[3].trim() === '*/') {
        jsDoc = jsDoc.replace(match[0], '/\n');
      } else {
        const end = new RegExp(/\*\/ *$/);
        jsDoc = jsDoc.replace(match[0], end.test(match[0]) ? '/' : '');
      }
    }
  }

  return /^\/\*\*( *)?\/|\/\*\*( *)?(?:\r\n|\r|\n)*(?: ?\*(?:\r\n|\r|\n)?\/?)*$/.test(jsDoc) ? '/** */' : jsDoc;
};

const removeTaglessDescription = (jsDoc: string) : string => {
  const regex = /\/\*\*( *)(.*)(\r\n|\r|\n)*((?:(?:(?! @).)(?:\{@link|\{@tutorial))*(?:(?!( @)).)*(\r\n|\r|\n)?)*/gm;
  const match = first(Array.from(jsDoc.matchAll(regex)));

  if (isNullOrEmpty(match)) return jsDoc;

  if (isNotNullOrEmpty(match[2])) {
    const end = new RegExp(/\*\/ *$/);
    return end.test(match[2]) ? jsDoc.replace(regex, '/** */') : jsDoc.replace(regex, '/**\n *');
  }

  return jsDoc.replace(regex, '/**\n *')
};