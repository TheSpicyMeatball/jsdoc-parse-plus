const { getTag } = require('../../dist/lib/es5/index');

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
 * @customTagDifferent customTag value
 */`;

describe('getTag', () => {
  test('getTag => @description => no tag', () => {
    expect(getTag(jsdoc)('@description')).toStrictEqual({ 
      tag: '@description', 
      value: 'The description goes here',
      raw: 'The description goes here',
    });
  });

  test('getTag => @description => tag', () => {
    const jsdoc = `
     /**
      * The description goes here
      * 
      * @description Description override
      * @param {string} myParam - The param
      */`;
    expect(getTag(jsdoc)('@description')).toStrictEqual({ 
      tag: '@description', 
      value: 'Description override',
      raw: '@description Description override',
    });
  });

  test('getTag => @description => one line', () => {
    const jsdoc = `
     /** The description goes here */`;
    expect(getTag(jsdoc)('@description')).toStrictEqual({ 
      tag: '@description', 
      value: 'The description goes here',
      raw: 'The description goes here',
    });
  });

  test('getTag => @since', () => {
    expect(getTag(jsdoc)('@since')).toStrictEqual({ 
      tag: '@since', 
      value: 'v1.0.0 (modified v2.0.0)',
      raw: '@since v1.0.0 (modified v2.0.0)',
    });
  });

  test('getTag => @template', () => {
    const jsdoc = `
      /**
       * The description goes here
       * 
       * @template
       * @template T
       * @template T,U,V
       * @template {T} - Description
       */`;
    expect(getTag(jsdoc)('@template')).toStrictEqual([
      { 
        tag: '@template',
        raw: '@template',
      },
      { 
        tag: '@template',
        value: 'T',
        description: undefined,
        raw: '@template T',
      },
      { 
        tag: '@template',
        value: 'T,U,V',
        description: undefined,
        raw: '@template T,U,V',
      },
      { 
        tag: '@template',
        value: 'T',
        description: 'Description',
        raw: '@template {T} - Description',
      },
    ]);
  });
  
  test('getTag => @param', () => {
    expect(getTag(jsdoc)('@param')).toStrictEqual([
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
    ]);
  });

  test('getTag => @property', () => {
    expect(getTag(jsdoc.replace(/@param/g, '@property'))('@property')).toStrictEqual([
      { 
        tag: '@property', 
        type: 'T',
        name: 'children',
        description: 'JSX children',
        optional: false,
        defaultValue: undefined,
        raw: '@property {T} children - JSX children',
      },
      { 
        tag: '@property', 
        type: 'any[]',
        name: 'types',
        description: 'Types of children to match',
        optional: false,
        defaultValue: undefined,
        raw: '@property {any[]} types - Types of children to match',
      },
      { 
        tag: '@property', 
        type: 'GetChildByTypeConfig',
        name: '{ customTypeKey: \'__TYPE\', prioritized: false }',
        description: 'The configuration params',
        optional: true,
        defaultValue: undefined,
        raw: '@property {GetChildByTypeConfig} [{ customTypeKey: \'__TYPE\', prioritized: false }] - The configuration params',
      },
      { 
        tag: '@property', 
        type: 'string',
        name: 'optionalParam',
        description: 'An optional param with a description without a dash',
        optional: true,
        defaultValue: '\'default text\'',
        raw: '@property {string} [optionalParam=\'default text\'] An optional param with a description without a dash',
      },
    ]);
  });

  test('getTag => custom tag => @docgen_types', () => {
    expect(getTag(jsdoc)('@docgen_types')).toStrictEqual({ 
      tag: '@docgen_types', 
      value: '// Custom docgen tag',
      raw: '@docgen_types\n// Custom docgen tag',
    });
  });

  test('getTag => custom tag => @customTag', () => {
    expect(getTag(jsdoc)('@customTag')).toStrictEqual([
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
    ]);
  });

  test('getTag => custom tag => not found', () => {
    expect(getTag(jsdoc)('@bogus')).toBe(undefined);
  });
  
  test('getTag => @example', () => {
    expect(getTag(jsdoc)('@example')).toStrictEqual([{ 
      tag: '@example', 
      value: '// Examples...\ngetTag(\'@description\')(jsdoc);',
      raw: '@example\n// Examples...\ngetTag(\'@description\')(jsdoc);',
    }]);
  });

  test('getTag => @returns', () => {
    expect(getTag(jsdoc)('@returns')).toStrictEqual({ 
      tag: '@returns', 
      type: 'T',
      description: 'The first matching child',
      raw: '@returns {T} - The first matching child',
    });
  });

  test('getTag => @returns => type', () => {
    const jsdoc = `
      /**
       * The description goes here
       * 
       * @since v1.0.0 (modified v2.0.0)
       * @template T
       * @param {T} children - JSX children
       * @param {any[]} types - Types of children to match
       * @param {GetChildByTypeConfig} [{ customTypeKey: '__TYPE', prioritized: false }] - The configuration params
       * @returns {T}
       * @docgen_types
       * // Custom docgen tag
       * @example
       * // Examples...
       * getTag('@description')(jsdoc);
       */`;
    expect(getTag(jsdoc)('@returns')).toStrictEqual({ 
      tag: '@returns', 
      type: 'T',
      description: undefined,
      raw: '@returns {T}',
    });
  });

  test('getTag => @returns => description', () => {
    const jsdoc = `
      /**
       * The description goes here
       * 
       * @since v1.0.0 (modified v2.0.0)
       * @template T
       * @param {T} children - JSX children
       * @param {any[]} types - Types of children to match
       * @param {GetChildByTypeConfig} [{ customTypeKey: '__TYPE', prioritized: false }] - The configuration params
       * @returns The first matching child
       * @docgen_types
       * // Custom docgen tag
       * @example
       * // Examples...
       * getTag('@description')(jsdoc);
       */`;
    expect(getTag(jsdoc)('@returns')).toStrictEqual({ 
      tag: '@returns', 
      type: undefined,
      description: 'The first matching child',
      raw: '@returns The first matching child',
    });
  });

  test('getTag => inline => {@link}', () => {
    const jsdoc = `
      /**
       * See {@link MyClass} and [MyClass's foo property]{@link MyClass#foo}.
       * Also, check out {@link http://www.google.com|Google} and
       * {@link https://github.com GitHub}.
       * @see {@link MyClass} and [MyClass's foo property]{@link MyClass#foo}.
       * Also, check out {@link http://www.google.com|Google} and
       * {@link https://github.com GitHub}.
       */`;
    expect(getTag(jsdoc)('@description')).toStrictEqual({ 
      tag: '@description', 
      value: 'See <a href="MyClass">MyClass</a> and <a href="MyClass#foo">MyClass\'s foo property</a>.\nAlso, check out <a href="http://www.google.com">Google</a> and\n<a href="https://github.com">GitHub</a>.',
      raw: 'See {@link MyClass} and [MyClass\'s foo property]{@link MyClass#foo}.\nAlso, check out {@link http://www.google.com|Google} and\n{@link https://github.com GitHub}.',
    });
    expect(getTag(jsdoc)('@see')).toStrictEqual([{ 
      tag: '@see', 
      value: '<a href="MyClass">MyClass</a> and <a href="MyClass#foo">MyClass\'s foo property</a>.\nAlso, check out <a href="http://www.google.com">Google</a> and\n<a href="https://github.com">GitHub</a>.',
      raw: '@see {@link MyClass} and [MyClass\'s foo property]{@link MyClass#foo}.\nAlso, check out {@link http://www.google.com|Google} and\n{@link https://github.com GitHub}.',
    }]);
  });
  
  test('getTag => inline => {@tutorial}', () => {
    const jsdoc = `
      /**
       * See {@tutorial MyClass} and [MyClass's foo property]{@tutorial MyClass#foo}.
       * Also, check out {@tutorial http://www.google.com|Google} and
       * {@tutorial https://github.com GitHub}.
       * @see {@tutorial MyClass} and [MyClass's foo property]{@tutorial MyClass#foo}.
       * Also, check out {@tutorial http://www.google.com|Google} and
       * {@tutorial https://github.com GitHub}.
       */`;
    expect(getTag(jsdoc)('@description')).toStrictEqual({ 
      tag: '@description', 
      value: 'See <a href="MyClass">MyClass</a> and <a href="MyClass#foo">MyClass\'s foo property</a>.\nAlso, check out <a href="http://www.google.com">Google</a> and\n<a href="https://github.com">GitHub</a>.',
      raw: 'See {@tutorial MyClass} and [MyClass\'s foo property]{@tutorial MyClass#foo}.\nAlso, check out {@tutorial http://www.google.com|Google} and\n{@tutorial https://github.com GitHub}.',
    });
    expect(getTag(jsdoc)('@see')).toStrictEqual([{ 
      tag: '@see', 
      value: '<a href="MyClass">MyClass</a> and <a href="MyClass#foo">MyClass\'s foo property</a>.\nAlso, check out <a href="http://www.google.com">Google</a> and\n<a href="https://github.com">GitHub</a>.',
      raw: '@see {@tutorial MyClass} and [MyClass\'s foo property]{@tutorial MyClass#foo}.\nAlso, check out {@tutorial http://www.google.com|Google} and\n{@tutorial https://github.com GitHub}.',
    }]);
  });

  test('getTag => typed', () => {
    let jsdoc = `
      /**
       * Generate the Fibonacci sequence of numbers.
       *
       * @yields
       */`;

    expect(getTag(jsdoc)('@yields')).toStrictEqual({ 
      tag: '@yields', 
      type: undefined,
      description: undefined,
      raw: '@yields',
    });

    jsdoc = `
      /**
       * Generate the Fibonacci sequence of numbers.
       *
       * @yields {number}
       */`;

    expect(getTag(jsdoc)('@yields')).toStrictEqual({ 
      tag: '@yields', 
      type: 'number',
      description: undefined,
      raw: '@yields {number}',
    });

    jsdoc = `
      /**
       * Generate the Fibonacci sequence of numbers.
       *
       * @yields The next number in the Fibonacci sequence.
       */`;

    expect(getTag(jsdoc)('@yields')).toStrictEqual({ 
      tag: '@yields', 
      type: undefined,
      description: 'The next number in the Fibonacci sequence.',
      raw: '@yields The next number in the Fibonacci sequence.',
    });

    jsdoc = `
      /**
       * Generate the Fibonacci sequence of numbers.
       *
       * @yields {number} The next number in the Fibonacci sequence.
       */`;
    expect(getTag(jsdoc)('@yields')).toStrictEqual({ 
      tag: '@yields', 
      type: 'number',
      description: 'The next number in the Fibonacci sequence.',
      raw: '@yields {number} The next number in the Fibonacci sequence.',
    });
  });

  test('getTag => @returns => void', () => {
    const jsdoc = `
      /**
       * The description goes here
       * 
       * @since v1.0.0 (modified v2.0.0)
       * @template T
       * @param {T} children - JSX children
       * @param {any[]} types - Types of children to match
       * @param {GetChildByTypeConfig} [{ customTypeKey: '__TYPE', prioritized: false }] - The configuration params
       * @returns
       * @docgen_types
       * // Custom docgen tag
       * @example
       * // Examples...
       * getTag('@description')(jsdoc);
       */`;
    expect(getTag(jsdoc)('@returns')).toStrictEqual({ 
      tag: '@returns', 
      type: undefined,
      description: undefined,
      raw: '@returns',
    });
  });

  test('getTag => not found', () => {
    expect(getTag(jsdoc)('@extends')).toBe(undefined);
  });
});