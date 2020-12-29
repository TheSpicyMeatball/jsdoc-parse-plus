```
const jsdoc = `
/**
 * The description goes here
 * 
 * @since v1.0.0 (modified v2.0.0)
 * @template T
 * @param {T} children - JSX children
 * @param {any[]} types - Types of children to match
 * @param {GetChildByTypeConfig} [{ customTypeKey: '__TYPE', prioritized: false }] - The configuration params
 * @param {string} [optionalParam='default text'] An optional param with a description without a dash
 * @returns {T} - The first matching child
 * @docgen_types
 * // Custom docgen tag
 * @example
 * // Examples...
 * getTag('@description')(jsdoc);
 * @customTag customTag value 1
 * @customTag customTag value 2
 */`;

const tag = getTag(jsdoc);

tag('@description');
// outputs =>
{ 
  tag: '@description', 
  value: 'The description goes here',
  raw: 'The description goes here',
}

tag('@param');
// outputs =>
[
  { 
    tag: '@param', 
    type: 'T',
    name: 'children',
    description: 'JSX children',
    optional: false,
    defaultValue: undefined,
    raw: '@param {T} children - JSX children',
  },
  { 
    tag: '@param', 
    type: 'any[]',
    name: 'types',
    description: 'Types of children to match',
    optional: false,
    defaultValue: undefined,
    raw: '@param {any[]} types - Types of children to match',
  },
  { 
    tag: '@param', 
    type: 'GetChildByTypeConfig',
    name: '{ customTypeKey: \'__TYPE\', prioritized: false }',
    description: 'The configuration params',
    optional: true,
    defaultValue: undefined,
    raw: '@param {GetChildByTypeConfig} [{ customTypeKey: \'__TYPE\', prioritized: false }] - The configuration params',
  },
  { 
    tag: '@param', 
    type: 'string',
    name: 'optionalParam',
    description: 'An optional param with a description without a dash',
    optional: true,
    defaultValue: '\'default text\'',
    raw: '@param {string} [optionalParam=\'default text\'] An optional param with a description without a dash',
  },
]

tag('@docgen_types');
// custom tag used once outputs =>
{ 
  tag: '@docgen_types', 
  value: '// Custom docgen tag',
  raw: '@docgen_types\n// Custom docgen tag',
}

tag('@customTag');
// custom tag used multiple times outputs =>
[
  { 
    tag: '@customTag', 
    value: 'customTag value 1',
    raw: '@customTag customTag value 1',
  },
  { 
    tag: '@customTag', 
    value: 'customTag value 2',
    raw: '@customTag customTag value 2',
  },
]
```