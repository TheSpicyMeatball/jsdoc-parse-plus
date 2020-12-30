# jsdoc-parse-plus

> Parse, add, remove, or modify standard jsdoc tags or custom tags from comments; Generate jsdoc comments from JavaScript data.

<p>Hello friend. Have you ever had the need to:</p>

<ul>
  <li>...parse standard and/or custom jsdoc tags into usable JavaScript objects?</li>
  <li>...programmatically add, modify, or remove jsdoc tags?</li>
  <li>...programmatically generate jsdoc comments from JavaScript data?</li>
</ul>

<p>If you answered yes to any of those questions, then jsdoc-parse-plus is for you!</p>

<p><b>Version:</b> 1.0.1</p>

<h2>Installation</h2>

```
$ npm install jsdoc-parse-plus --save
```


<h2>Summary of Utils</h2>
<p>For detailed information on each util, see below this table.</p>
<table>
    <thead>
    <tr>
      <th>function</th>
      <th>Description</th>
    </tr>
    </thead>
    <tbody><tr><td>getCommentsFromFile</td><td>Extract all jsdoc comment strings from a file</td></tr><tr><td>getTag</td><td>Gets a jsdoc tag's data; if the tag type supports multiple entries, an array of the tags will be returned</td></tr><tr><td>parse</td><td>Parse a jsdoc comment string against all potential jsdoc tags and optional custom tags</td></tr><tr><td>parseTags</td><td>Parse a jsdoc comment string against specified tags only; custom tags may be included</td></tr><tr><td>removeTags</td><td>Removes a set of tags from jsdoc</td></tr><tr><td>toCommentString</td><td>Convert an object to a jsdoc comment string</td></tr></tbody>
  </table><hr />

<h2>Interfaces &amp; Types</h2>

```
// base tag type
export interface ITag {
  tag: string;
  value?: string;
  raw: string;
}

// for tags that can contain a description as part of their value (i.e. @param, @returns, etc)
export interface IDescriptive extends ITag {
  description?: string;
}

// additional keys for the @param tag type
export interface IParam extends IDescriptive {
  name: string;
  optional?: boolean;
  defaultValue?: string;
}

// for tags that contain a type (i.e. @param, @returns, etc)
export interface IType extends IDescriptive {
  type?: string;
}

// for inline link tags like {@link} and {@tutorial}
export type InlineLink = {
  tag: string,
  url: string,
  text: string,
  raw: string,
};

// util configuration types
export type GetCommentsFromFileConfig = { keepIndent?: boolean };
export type ToCommentStringConfig = { indentChars?: number };
```


  

<h2>getCommentsFromFile</h2>
<p>Extract all jsdoc comment strings from a file</p>
<p>Since v1.0.0</p>
<table>
      <thead>
      <tr>
        <th>Param</th>
        <th>Type</th><th>Default</th></tr>
      </thead>
      <tbody><tr><td><p><b>file</b></p>String contents of a file</td><td>string</td><td></td></tr><tr><td><p><b>config <span>(optional)</span></b></p>The configuration for output formatting</td><td>GetCommentsFromFileConfig</td><td>{ keepIndent = false }</td></tr></tbody>
    </table><p><b>Returns:</b> {string[]} Array of jsdoc strings</p><h4>Supporting Types</h4>

```
// The configuration type for the util:
//   keepIndent?: boolean = false - Whether or not to keep the indentation of the entire jsdoc comment block

export type GetCommentsFromFileConfig = { keepIndent?: boolean };
```
  <h4>Import</h4>

```
import { getCommentsFromFile, GetCommentsFromFileConfig } from 'jsdoc-parse-plus';
```

  <h4>Examples</h4>



```
const file = `
/**
 * The first group
 * 
 * @since v1.0.0
 */asdf
asdf
/**
 * The second group
 * 
 * @since v1.0.0
 */
asdf
/** The third group */`;

getCommentsFromFile(file);

// outputs =>
[
  `/**
 * The first group
 * 
 * @since v1.0.0
 */`,
  `/**
 * The second group
 * 
 * @since v1.0.0
 */`,
  '/** The third group */',
]
```



<hr />

  

<h2>getTag</h2>
<p>Gets a jsdoc tag's data; if the tag type supports multiple entries, an array of the tags will be returned</p>
<table>
      <thead>
      <tr>
        <th>Param</th>
        <th>Type</th></tr>
      </thead>
      <tbody><tr><td><p><b>jsdoc</b></p>The entire jsdoc string</td><td>string</td></tr></tbody>
    </table><p><b>Returns:</b> {(tag: string) =&gt; ITag | Array&lt;ITag | ITag[]&gt;} Function to get the tag or array of all tags that go by that name</p>
  <h4>Import</h4>

```
import { getTag } from 'jsdoc-parse-plus';
```

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



<hr />

  

<h2>parse</h2>
<p>Parse a jsdoc comment string against all potential jsdoc tags and optional custom tags</p>
<p>Since v1.0.0</p>
<table>
      <thead>
      <tr>
        <th>Param</th>
        <th>Type</th><th>Default</th></tr>
      </thead>
      <tbody><tr><td><p><b>jsdoc</b></p>The entire jsdoc comment string</td><td>string</td><td></td></tr><tr><td><p><b>customTags <span>(optional)</span></b></p>Optional array of custom tags parse</td><td>string[]</td><td>[]</td></tr></tbody>
    </table><p><b>Returns:</b> {object} Object with keys of each parsed tag</p>
  <h4>Import</h4>

```
import { parse } from 'jsdoc-parse-plus';
```

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

parse(jsdoc, ['customTag', 'docgen_types']);
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
  template: [{ 
    tag: '@template',
    value: 'T',
    description: undefined,
    raw: '@template T',
  }],
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
}
```



<hr />

  

<h2>parseTags</h2>
<p>Parse a jsdoc comment string against specified tags only; custom tags may be included</p>
<p>Since v1.0.0</p>
<table>
      <thead>
      <tr>
        <th>Param</th>
        <th>Type</th></tr>
      </thead>
      <tbody><tr><td><p><b>jsdoc</b></p>The entire jsdoc comment string</td><td>string</td></tr><tr><td><p><b>tags</b></p>The tags to parse</td><td>string[]</td></tr></tbody>
    </table><p><b>Returns:</b> {object} Object with keys of each parsed tag</p>
  <h4>Import</h4>

```
import { parseTags } from 'jsdoc-parse-plus';
```

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



<hr />

  

<h2>removeTags</h2>
<p>Removes a set of tags from jsdoc</p>
<table>
      <thead>
      <tr>
        <th>Param</th>
        <th>Type</th></tr>
      </thead>
      <tbody><tr><td><p><b>jsdoc</b></p>The entire jsdoc string</td><td>string</td></tr><tr><td><p><b>tags</b></p>Array of string tags to remove</td><td>string[]</td></tr></tbody>
    </table><p><b>Returns:</b> {string} The jsdoc string the specified tags removed</p>
  <h4>Import</h4>

```
import { removeTags } from 'jsdoc-parse-plus';
```

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
 * getTag('description')(jsdoc);
 * @customTag customTag value 1
 * @customTag customTag value 2
 * @see {@link MyClass} and [MyClass's foo property]{@link MyClass#foo}.
 * Also, check out {@link http://www.google.com|Google} and
 * {@link https://github.com GitHub}.
 */`;

removeTags(jsdoc, ['@description', '@since', '@example', 'customTag', '@thisTagDoesntExist']);
// outputs =>
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
 */
```



<hr />

  

<h2>toCommentString</h2>
<p>Convert an object to a jsdoc comment string</p>
<p>Since v1.0.0</p>
<table>
      <thead>
      <tr>
        <th>Param</th>
        <th>Type</th><th>Default</th></tr>
      </thead>
      <tbody><tr><td><p><b>tags</b></p>Object containing keys of tags</td><td>{[tag: string]: ITag | Array&lt;ITag | ITag[]&gt;}</td><td></td></tr><tr><td><p><b>config <span>(optional)</span></b></p>The configuration for output formatting</td><td>ToCommentStringConfig</td><td>{ indentChars = 0 }</td></tr></tbody>
    </table><p><b>Returns:</b> {string} The jsdoc string</p><h4>Supporting Types</h4>

```
// The configuration type for the util:
//   indentChars?: number = 0 - The number of characters that the output string should be indented

export type ToCommentStringConfig = { indentChars?: number };
```
  <h4>Import</h4>

```
import { toCommentString, ToCommentStringConfig } from 'jsdoc-parse-plus';
```

  <h4>Examples</h4>



```
const tags = {
  description: { 
    tag: '@description', 
    value: 'The description goes here',
    raw: 'The description goes here',
  },
  since: { 
    tag: '@since', 
    value: 'v1.0.0',
    raw: '@since v1.0.0',
  },
};

toCommentString(tags);
// outputs =>
/**
 * The description goes here
 * @since v1.0.0
 */
```



<hr />


<a href="#package-contents"></a>
<h2>Package Contents</h2>

Within the module you'll find the following directories and files:

```html
package.json
CHANGELOG.md -- history of changes to the module
README.md -- this file
/lib
  └───/es5
    └───/getCommentsFromFile
      └───index.d.ts - 784 Bytes
      └───index.js - 2.35 KB
    └───/getTag
      └───index.d.ts - 431 Bytes
      └───index.js - 951 Bytes
      └───index.d.ts - 388 Bytes
      └───index.js - 1.22 KB
    └───/parse
      └───index.d.ts - 392 Bytes
      └───index.js - 1.8 KB
    └───/parseTags
      └───index.d.ts - 359 Bytes
      └───index.js - 1.1 KB
    └───/removeTags
      └───index.d.ts - 306 Bytes
      └───index.js - 1.95 KB
    └───/toCommentString
      └───index.d.ts - 825 Bytes
      └───index.js - 1.64 KB
    └───/types
      └───index.d.ts - 627 Bytes
      └───index.js - 79 Bytes
    └───/_private
      └───utils.d.ts - 1.93 KB
      └───utils.js - 12.54 KB
  └───/es6
    └───/getCommentsFromFile
      └───index.d.ts - 784 Bytes
      └───index.js - 2.19 KB
    └───/getTag
      └───index.d.ts - 431 Bytes
      └───index.js - 823 Bytes
      └───index.d.ts - 388 Bytes
      └───index.js - 272 Bytes
    └───/parse
      └───index.d.ts - 392 Bytes
      └───index.js - 1.67 KB
    └───/parseTags
      └───index.d.ts - 359 Bytes
      └───index.js - 986 Bytes
    └───/removeTags
      └───index.d.ts - 306 Bytes
      └───index.js - 1.83 KB
    └───/toCommentString
      └───index.d.ts - 825 Bytes
      └───index.js - 1.49 KB
    └───/types
      └───index.d.ts - 627 Bytes
      └───index.js - 12 Bytes
    └───/_private
      └───utils.d.ts - 1.93 KB
      └───utils.js - 11.13 KB
```

<a href="#license"></a>
<h2>License</h2>

MIT


<a href="#author"></a>
<h2>Author</h2>
Michael Paravano




<a href="#dependencies"></a>
<h2>Dependencies</h2>



None
