const { parseTags } = require('../../dist/lib/es5/index');

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

describe('parseTags', () => {
  test('all except @template + @bogus', () => {
    expect(parseTags(jsdoc, ['@description', '@since', '@param', '@returns', '@docgen_types', '@example', 'customTag', '@see', '@bogus'])).toStrictEqual({ 
      bogus: undefined,
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
      param: [
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
      ],
      example: [{ 
        tag: '@example', 
        value: '// Examples...\ngetTag(\'@description\')(jsdoc);',
        raw: '@example\n// Examples...\ngetTag(\'@description\')(jsdoc);',
      }],
      returns: { 
        tag: '@returns', 
        type: 'T',
        description: 'The first matching child',
        raw: '@returns {T} - The first matching child',
      },
      see: [{ 
        tag: '@see', 
        value: '<a href="MyClass">MyClass</a> and <a href="MyClass#foo">MyClass\'s foo property</a>.\nAlso, check out <a href="http://www.google.com">Google</a> and\n<a href="https://github.com">GitHub</a>.',
        raw: '@see {@link MyClass} and [MyClass\'s foo property]{@link MyClass#foo}.\nAlso, check out {@link http://www.google.com|Google} and\n{@link https://github.com GitHub}.',
      }],
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
    });
  });
});