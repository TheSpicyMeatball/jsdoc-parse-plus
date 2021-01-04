import { InlineLink, ITag } from '../types';

export type TagMapFunction = (jsdoc: string, linkRenderer?: (link: InlineLink) => string) => ITag | Array<ITag|ITag[]>;