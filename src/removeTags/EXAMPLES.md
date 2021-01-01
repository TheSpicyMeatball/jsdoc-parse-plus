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
 */`;

removeTags(jsdoc, ['@description', '@template', '@param']);
// outputs =>
/**
 * @since v1.0.0 (modified v2.0.0)
 * @returns {T} - The first matching child
 */
```