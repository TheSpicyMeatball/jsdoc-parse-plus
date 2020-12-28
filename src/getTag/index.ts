import { getTagMap, getTags } from './../_private/utils';

/**
* Gets a jsDoc tag's data; if the tag type supports multiple entries, an array of the tags will be returned
*
* @param {string} jsDoc - The entire jsDoc string
*/
export const getTag = (jsDoc: string) => {
  const tagMap = getTagMap();
  return tag => {
    const _tag = tag.startsWith('@') ? tag : '@' + tag;
    const func = tagMap.get(_tag);

    if (func) return func(jsDoc);

    // Custom tag
    const tags = getTags(_tag)(jsDoc);

    if (tags.length === 0) return;
    if (tags.length === 1) return tags[0];

    return tags;
  };
};