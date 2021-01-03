import { ITag } from '../types';

export type TagMapFunction = (jsdoc: string) => ITag | Array<ITag|ITag[]>;