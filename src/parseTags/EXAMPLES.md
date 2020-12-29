<h4>Examples</h4>

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
 * @see {@link MyClass} and [MyClass's foo property]{@link MyClass#foo}.
 * Also, check out {@link http://www.google.com|Google} and
 * {@link https://github.com GitHub}.
 */`;

parseTags(jsdoc, ['@description', '@since', '@docgen_types', 'customTag', '@thisTagDoesntExist']);
// outputs =>
{ 
  description: {
    tag: '@description', 
    value: 'The description goes here',
    raw: 'The description goes here',
  },
  since: { 
    tag: '@since', 
    value: 'v1.0.0 (modified v2.0.0)',
    raw: '@since v1.0.0 (modified v2.0.0)',
  },
  docgen_types: { 
    tag: '@docgen_types', 
    value: '// Custom docgen tag',
    raw: '@docgen_types\n// Custom docgen tag',
  },
  customTag: [
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
  ],
}
```