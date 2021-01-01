import { ITag, IDescriptive, IParam, IType, InlineLink } from '../types';

export const first = <T=any, TDefault=any>(array: T[], defaultValue?: TDefault) : T | TDefault => array && array[0] || defaultValue;
export const last =  <T=any, TDefault=any>(array: T[], defaultValue?: TDefault) : T | TDefault => array && array[array.length - 1] || defaultValue;

export const isNotNullOrEmpty = <T=any>(value: T) : boolean => {
  if (value === null || value === undefined || (typeof value === 'string' && value === '')) return false;

  if (Array.isArray(value)) {
    return  value.length > 0;
  }

  if (typeof value === 'string' && value.length <= 0) return false;

  return true;
};
export const isNullOrEmpty =  <T=any>(value: T) : boolean => value === null || value === undefined || (typeof value === 'string' && value === '') || (Array.isArray(value) && value.length <= 0);

export const getTagRegExp = (tag: string) : RegExp => new RegExp(` ${tag}(?: |\\r\\n|\\r|\\n)(.*?)(\\r\\n|\\r|\\n)*((?:(?:(?! @).)(?:\\{@link|\\{@tutorial))*(?:(?!( @|\\*\\/)).)*(\\r\\n|\\r|\\n)?)*`, 'gm');
const removeJsDocCommentStars = (jsdoc: string) => jsdoc.replace(/(?: *?\*\/|^ *?\* ?|\/\*\* ?)/gm, '').replace(/ ?\*$/, '').trim();

/**
* Gets the 'description' tag
*
* @param {string} jsdoc The entire jsdoc string
* @returns {ITag}
*/
export const getDescription = (jsdoc: string) : ITag => {
  // from tag
  const description = getTag('@description')(jsdoc);

  if (isNotNullOrEmpty(description)) return description as ITag;

  // no tag - single line
  const text = first(jsdoc.match(/\/\*\*( *)(.*)( *)\*\//), '');
 
  if (isNotNullOrEmpty(text)) {
    const raw = removeJsDocCommentStars(text);

    return {
      tag: '@description',
      value: processInlineLinks(raw),
      raw,
    };
  }
 
  // no tag - multiline
  const raw = first(jsdoc.match(/\/\*\*( *)(.*)(\r\n|\r|\n)*((?:(?:(?! @).)(?:\{@link|\{@tutorial))*(?:(?!( @)).)*(\r\n|\r|\n)?)*/), '').replace(/^(?:\/\*\*| *\*\/? *)/gm, '').trim();
 
  if (isNotNullOrEmpty(raw)) {
    return {
      tag: '@description',
      value: processInlineLinks(raw),
      raw,
    };
  }
    
  return;
};

/**
 * Gets 'param' tags
 *
 * @param {string} jsdoc - The entire jsdoc string
 * @returns {IParam[]}
 */
export const getTemplate = () => (jsdoc: string) : IDescriptive[] => {
  const rawParams = getTags('@template')(jsdoc) as ITag[];

  if (isNullOrEmpty(rawParams)) return [];

  return rawParams.reduce((accumulator, param) => {
    const match = param.raw.match(/@template *(?:{(.*?)} *)?(?:- )?(.*)/);

    if (isNotNullOrEmpty(match[1])) {
      return [
        ...accumulator, 
        {
          tag: '@template',
          value: match[1].trim(),
          description: processInlineLinks(match[2].trim()),
          raw: match[0].trim(),
        }
      ];
    }

    if (isNullOrEmpty(match[2])) {
      return [
        ...accumulator, 
        {
          tag: '@template',
          raw: match[0].trim(),
        }
      ];
    }

    const value = match[2].trim();
    const description = isNotNullOrEmpty(match[3]) && processInlineLinks(match[3].trim()) || undefined;
    
    return [
      ...accumulator, 
      {
        tag: '@template',
        value,
        description,
        raw: match[0].trim(),
      }
    ];
  }, []);
};

/**
 * Gets 'param' tags
 *
 * @param {string} jsdoc - The entire jsdoc string
 * @returns {IParam[]}
 */
export const getParam = (tag: '@param' | '@property' | '@prop' | '@arg' | '@argument') => (jsdoc: string) : IParam[] => {
  const rawParams = getTags(tag)(jsdoc) as ITag[];

  if (isNullOrEmpty(rawParams)) return [];

  return rawParams.reduce((accumulator, param) => {
    const match = param.raw.match(/{(.*?)} (\[.*\]|.*?) (?:- )?(.*)/);

    if (isNullOrEmpty(match)) return accumulator;
    
    const type = match[1];
    const optional =  match[2].startsWith('[') && match[2].endsWith(']');
    let name = optional ? match[2].substring(1, match[2].length - 1) :  match[2];
    const description = processInlineLinks(match[3].trim());
    let defaultValue: string;

    if (optional && !name.startsWith('{')) {
      defaultValue = name.replace(first(name.split('=', 1)) + '=', '');
      name = name.replace('=' + defaultValue, '');
    }
    
    return [
      ...accumulator, 
      {
        tag,
        type,
        name,
        description,
        optional,
        defaultValue,
        raw: `${tag} ${match[0].trim()}`,
      }
    ];
  }, []);
};

/**
 * Gets tag shaped like TType
 *
 * @param {string} jsdoc - The entire jsdoc string
 * @returns {IType}
 */
export const getTyped = (tag: string) => (jsdoc: string) : IType => {
  const _tag = tag.startsWith('@') ? tag : '@' + tag;
  const regex = new RegExp(`${_tag} *(?:{(.*?)} *)?(?:- )?(.*)`, 'g');
  const match = first(Array.from(jsdoc.matchAll(regex)));

  if (isNullOrEmpty(match)) return;

  return {
    tag: _tag,
    type: match[1]?.trim(),
    description: isNotNullOrEmpty(match[2]) ? match[2].trim() : undefined,
    raw: match[0]?.trim(),
  };
};

/**
 * Gets the requested tag data
 * 
 * @param {string} tag - The tag to find
 * @param {string} jsdoc - The entire jsdoc string
 * @returns {(ITag | ITag[])}
 */
export const getTag = (tag: string) => (jsdoc: string) : ITag | ITag[] => {
  const _tag = tag.startsWith('@') ? tag : '@' + tag;
  const matches = jsdoc.match(getTagRegExp(_tag));
 
  if (isNullOrEmpty(matches)) {
    return;
  }

  const match = first(matches).match(/\*/g);

  if (isNotNullOrEmpty(match) && match.length <= 1) {
    const raw = removeJsDocCommentStars(first(matches, ''));
    return {
      tag: _tag,
      value: processInlineLinks(raw.replace(_tag, '').trim()),
      raw,
    };
  }
 
  const raw = removeJsDocCommentStars(first(matches, ''));

  return {
    tag: _tag,
    value: processInlineLinks(raw.replace(_tag, '').trim()),
    raw,
  };
};

/**
* Gets all matching jsdoc tags
*
* @param {string} tag - The name of the tag to get
* @param {string} jsdoc - The entire jsdoc string
* @returns {string[]} Array of string values for each matching tag
*/
export const getTags = (tag: string) => (jsdoc: string) : Array<ITag | ITag[]> => {
  const _tag = tag.startsWith('@') ? tag : '@' + tag;
  const regex = getTagRegExp(_tag);
  const matches = [...Array.from(jsdoc.matchAll(regex))];
 
  if (isNullOrEmpty(matches)) {
    return [];
  }
 
  if (matches.length > 1) {
    return matches.map(x => {
      const raw = removeJsDocCommentStars(first(x, ''));

      return {
        tag: _tag,
        value: processInlineLinks(raw.replace(_tag, '').trim()),
        raw,
      };
    });
  }
 
  return [getTag(_tag)(jsdoc)];
};

/**
 * Converts links and tutorial links to anchor tags
 * @param jsdoc - Any jsdoc string
 * @returns {string} The updated string with anchor tags
 */
const processInlineLinks = (jsdoc: string) : string => {
  if (isNullOrEmpty(jsdoc)) return jsdoc;

  const matches = Array.from(jsdoc.matchAll(/(?:\[(.*?)\])?{@(link|tutorial) (.*?)(?:(?:\|| +)(.*?))?}/gm));

  if (isNullOrEmpty(matches)) return jsdoc;

  for (const match of matches) {
    const tag = match[2].trim();
    const url = match[3].trim();
    let text = url;

    if (isNotNullOrEmpty(match[4])) {
      text = match[4].trim();
    } else if (isNotNullOrEmpty(match[1])) {
      text = match[1].trim();
    }

    jsdoc = jsdoc.replace(match[0], `<a href="${url}">${text}</a>`);
  }

  return jsdoc;
}

/** Gets a Map object with all possible jsdoc tags and their parsing function */
export const getTagMap = () => new Map<string, (jsdoc: string) => ITag | Array<ITag|ITag[]>>([
  ['@abstract', getTag('@abstract')],
  ['@access', getTag('@access')],
  ['@alias', getTag('@alias')],
  ['@arg', getParam('@arg')], // alias for @param
  ['@argument', getParam('@argument')], // alias for @param
  ['@async', getTag('@async')],
  ['@augments', getTag('@augments')],
  ['@author', getTag('@author')],
  ['@borrows', getTag('@borrows')],
  ['@category', getTag('@category')],
  ['@callback', getTag('@callback')],
  ['@class', getTag('@class')],
  ['@classdesc', getTag('@classdesc')],
  ['@cosnt', getTag('@const')], // alias for @constant
  ['@constant', getTag('@constant')],
  ['@constructor', getTag('@constructor')], // alias for @class
  ['@constructs', getTag('@constructs')],
  ['@copyright', getTag('@copyright')],
  ['@default', getTag('@default')],
  ['@defaultvalue', getTag('@defaultvalue')], // alias for @default
  ['@deprecated', getTag('@deprecated')],
  ['@desc', getDescription], // alias for @description
  ['@description', getDescription],
  ['@emits', getTag('@emits')], // alias for @fires
  ['@enum', getTyped('@enum')],
  ['@event', getTag('@event')],
  ['@example', getTags('@example')],
  ['@exception', getTags('@exception')], // alias for @throws
  ['@exports', getTag('@exports')],
  ['@extends', getTag('@extends')], // alias for @augments
  ['@external', getTag('@external')],
  ['@file', getTag('@file')],
  ['@fileoverview', getTag('@fileoverview')], // alias for @file
  ['@fires', getTag('@fires')],
  ['@func', getTag('@func')], // alias for @function
  ['@function', getTag('@function')],
  ['@generator', getTag('@generator')],
  ['@global', getTag('@global')],
  ['@hideconstructor', getTag('@hideconstructor')],
  ['@host', getTag('@host')], // alias for @external
  ['@ignore', getTag('@ignore')],
  ['@implements', getTyped('@implements')],
  ['@inheritdoc', getTag('@inheritdoc')],
  ['@inner', getTag('@inner')],
  ['@instance', getTag('@instance')],
  ['@interface', getTag('@interface')],
  ['@kind', getTag('@kind')],
  ['@lends', getTag('@lends')],
  ['@license', getTag('@license')],
  ['@listens', getTag('@listens')],
  ['@member', getTyped('@member')],
  ['@memberof', getTag('@memberof')],
  ['@method', getTag('@method')], // alias for @function
  ['@mixes', getTag('@mixes')],
  ['@mixin', getTag('@mixin')],
  ['@module', getTag('@module')],
  ['@name', getTag('@name')],
  ['@namespace', getTag('@namespace')],
  ['@override', getTag('@override')],
  ['@overview', getTag('@overview')], // alias for @file
  ['@package', getTag('@package')],
  ['@param', getParam('@param')],
  ['@private', getTag('@private')],
  ['@prop', getParam('@prop')], // alias for @property
  ['@property', getParam('@property')],
  ['@protected', getTag('@protected')],
  ['@public', getTag('@public')],
  ['@readonly', getTag('@readonly')],
  ['@requires', getTags('@requires')],
  ['@return', getTyped('@return')], // alias for @returns
  ['@returns', getTyped('@returns')],
  ['@see', getTags('@see')],
  ['@since', getTag('@since')],
  ['@static', getTag('@static')],
  ['@summary', getTag('@summary')],
  ['@template', getTemplate()],
  ['@this', getTag('@this')],
  ['@throws', getTags('@throws')],
  ['@todo', getTags('@todo')],
  ['@tutorial', getTags('@tutorial')],
  ['@type', getTyped('@type')],
  ['@typedef', getTyped('@typedef')],
  ['@var', getTyped('@var')], // alias for @member
  ['@variation', getTag('@variation')],
  ['@version', getTag('@version')],
  ['@virtual', getTag('@virtual')], // alias for @abstract
  ['@yield', getTyped('@yield')], // alias for @yields
  ['@yields', getTyped('@yields')]
]);