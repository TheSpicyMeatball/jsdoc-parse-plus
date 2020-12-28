import { ITag } from '../types';
import { getTagMap, getTags } from './../_private/utils';

/**
 * Gets a jsdoc tag's data; if the tag type supports multiple entries, an array of the tags will be returned
 *
 * @param {string} jsdoc - The entire jsdoc string
 * @returns {(tag: string) => ITag | Array<ITag|ITag[]>} Function to get the tag or array of all tags that go by that name
 */
export const getTag = (jsdoc: string) : (tag: string) => ITag | Array<ITag|ITag[]> => {
  const tagMap = getTagMap();
  return (tag: string) : ITag | Array<ITag|ITag[]> => {
    const _tag = tag.startsWith('@') ? tag : '@' + tag;
    const func = tagMap.get(_tag);

    if (func) return func(jsdoc);

    // Custom tag
    const tags = getTags(_tag)(jsdoc);

    if (tags.length === 0) return;
    if (tags.length === 1) return tags[0];

    return tags;
  };
};