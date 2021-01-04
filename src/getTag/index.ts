import { InlineLink, ITag } from '../types';
import { getTagMap, getTags } from './../_private/utils';

/**
 * Gets a jsdoc tag's data; if the tag type supports multiple entries, an array of the tags will be returned
 *
 * @param {string} jsdoc - The entire jsdoc string
 * @param {(link: InlineLink) => string} [linkRenderer] - Optional function to override default rendering of inline link and tutorial tags
 * @returns {(tag: string) => ITag | Array<ITag | ITag[]>} Function to get the tag or array of all tags that go by that name
 * @docgen_note
 * For more information on <code>linkRenderer</code>, please see {@link #using-linkRenderer|Using a custom linkRenderer}.
 */
export const getTag = (jsdoc: string, linkRenderer?: (link: InlineLink) => string) : (tag: string) => ITag | Array<ITag|ITag[]> => {
  const tagMap = getTagMap();
  return (tag: string) : ITag | Array<ITag|ITag[]> => {
    const _tag = tag.startsWith('@') ? tag : '@' + tag;
    const func = tagMap.get(_tag);

    if (func) return func(jsdoc, linkRenderer);

    // Custom tag
    const tags = getTags(_tag)(jsdoc, linkRenderer);

    if (tags.length === 0) return;
    if (tags.length === 1) return tags[0];

    return tags;
  };
};