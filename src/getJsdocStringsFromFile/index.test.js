const { getJsdocStringsFromFile } = require('../../dist/lib/es5/index');

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

describe('getJsdocStringsFromFile', () => {
  test('nothing', () => {
    expect(getJsdocStringsFromFile(null)).toStrictEqual([]);
    expect(getJsdocStringsFromFile(undefined)).toStrictEqual([]);
    expect(getJsdocStringsFromFile('')).toStrictEqual([]);
  });

  test('basic', () => {
    expect(getJsdocStringsFromFile(file)).toStrictEqual([
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

    expect(getJsdocStringsFromFile(file)).toStrictEqual([
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

    expect(getJsdocStringsFromFile(file, { keepIndent: true })).toStrictEqual([
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