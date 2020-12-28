const { removeTags } = require('../../dist/lib/es5/index');

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
 * getTag('description')(jsdoc);
 * @customTag customTag value 1
 * @customTag customTag value 2
 * @see {@link MyClass} and [MyClass's foo property]{@link MyClass#foo}.
 * Also, check out {@link http://www.google.com|Google} and
 * {@link https://github.com GitHub}.
 */`;

describe('removeTags', () => {
  test('standard + custom + bogus', () => {
    expect(removeTags(jsdoc, ['@description', '@since', '@example', 'customTag', '@bogus'])).toStrictEqual(`
/**
 * @template T
 * @param {T} children - JSX children
 * @param {any[]} types - Types of children to match
 * @param {GetChildByTypeConfig} [{ customTypeKey: '__TYPE', prioritized: false }] - The configuration params
 * @param {string} [optionalParam='default text'] An optional param with a description without a dash
 * @returns {T} - The first matching child
 * @docgen_types
 * // Custom docgen tag
 * @see {@link MyClass} and [MyClass's foo property]{@link MyClass#foo}.
 * Also, check out {@link http://www.google.com|Google} and
 * {@link https://github.com GitHub}.
 */`);
  });

  test('description => variation 1', () => {
    const jsdoc = `
/**
 * The description goes here
 * 
 * @since v1.0.0 (modified v2.0.0)
 * @template T
 * @param {T} children - JSX children
 */`;

    expect(removeTags(jsdoc, ['@description'])).toStrictEqual(`
/**
 * @since v1.0.0 (modified v2.0.0)
 * @template T
 * @param {T} children - JSX children
 */`);
  });

  test('description => variation 2', () => {
    const jsdoc = `
/**
 * The description goes here
 * @since v1.0.0 (modified v2.0.0)
 * @template T
 * @param {T} children - JSX children
 */`;

    expect(removeTags(jsdoc, ['@description'])).toStrictEqual(`
/**
 * @since v1.0.0 (modified v2.0.0)
 * @template T
 * @param {T} children - JSX children
 */`);
  });

  test('description => variation 3', () => {
    const jsdoc = `
/** The description goes here 
 * @since v1.0.0 (modified v2.0.0)
 * @template T
 * @param {T} children - JSX children
 */`;

    expect(removeTags(jsdoc, ['@description'])).toStrictEqual(`
/**
 * @since v1.0.0 (modified v2.0.0)
 * @template T
 * @param {T} children - JSX children
 */`);
  });

  test('description => variation 4', () => {
    const jsdoc = `
/** The description goes here 
 * 
 * @since v1.0.0 (modified v2.0.0)
 * @template T
 * @param {T} children - JSX children
 */`;

    expect(removeTags(jsdoc, ['@description'])).toStrictEqual(`
/**
 * @since v1.0.0 (modified v2.0.0)
 * @template T
 * @param {T} children - JSX children
 */`);
  });

  test('description => variation 5', () => {
    const jsdoc = '/** The description goes here */';

    expect(removeTags(jsdoc, ['@description'])).toStrictEqual(`/** */`);
  });

  test('description => variation 6', () => {
    const jsdoc = `
/**
 * The description goes here
 * 
 * @description Explicit description
 * @since v1.0.0 (modified v2.0.0)
 * @template T
 * @param {T} children - JSX children
 */`;

    expect(removeTags(jsdoc, ['@description'])).toStrictEqual(`
/**
 * @since v1.0.0 (modified v2.0.0)
 * @template T
 * @param {T} children - JSX children
 */`);
  });

  test('remove first', () => {
    const jsdoc = `
/**
 * @since v1.0.0 (modified v2.0.0)
 * @template T
 * @param {T} children - JSX children
 */`;

    expect(removeTags(jsdoc, ['@since'])).toStrictEqual(`
/**
 * @template T
 * @param {T} children - JSX children
 */`);
  });

  test('remove last', () => {
    expect(removeTags(jsdoc, ['@see'])).toStrictEqual(`
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
 * getTag('description')(jsdoc);
 * @customTag customTag value 1
 * @customTag customTag value 2
 */`);
  });

  test('remove only', () => {
    const jsdoc = '/** @readonly */';

    expect(removeTags(jsdoc, ['@readonly'])).toStrictEqual('/** */');
  });

  test('remove only => multiline', () => {
    const jsdoc = `
/** 
 * @readonly
 */`;

    expect(removeTags(jsdoc, ['@readonly'])).toStrictEqual('/** */');
  });

  test('one left', () => {
    const jsdoc = `
/** 
 * This is the description
 * @readonly
 */`;

    expect(removeTags(jsdoc, ['@readonly'])).toStrictEqual(`
/** 
 * This is the description
 */`);
  });
});