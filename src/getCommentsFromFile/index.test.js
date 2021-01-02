const { getCommentsFromFile } = require('../../dist/lib/es5/index');

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

describe('getCommentsFromFile', () => {
  test('nothing', () => {
    expect(getCommentsFromFile(null)).toStrictEqual([]);
    expect(getCommentsFromFile(undefined)).toStrictEqual([]);
    expect(getCommentsFromFile('')).toStrictEqual([]);
    expect(getCommentsFromFile('/**  */')).toStrictEqual(['/**  */']);    
    expect(getCommentsFromFile('/**\n *\n */')).toStrictEqual(['/**\n *\n */']);
  });

  test('basic', () => {
    expect(getCommentsFromFile(file)).toStrictEqual([
      '/**\n * The first group\n * \n * @since v1.0.0\n */',
      '/**\n * The second group\n * \n * @since v1.0.0\n */',
      '/** The third group */',
    ]);
  });

  test('indented', () => {
    const file = `        /**
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

    expect(getCommentsFromFile(file)).toStrictEqual([
      '/**\n * The first group\n * \n * @since v1.0.0\n */',
      '/**\n * The second group\n * \n * @since v1.0.0\n */',
      '/** The third group */',
    ]);
  });

  test('indented => keepIndent', () => {
    const file = `        /**
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

    expect(getCommentsFromFile(file, { keepIndent: true })).toStrictEqual([
      `        /**
         * The first group
         * 
         * @since v1.0.0
         */`,
      `        /**
         * The second group
         * 
         * @since v1.0.0
         */`,
      '        /** The third group */',
      ]);
  });
});