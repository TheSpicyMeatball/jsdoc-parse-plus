const { parseTags } = require('../../dist/lib/es5/index');
const { isNotNullOrEmpty } = require('../../dist/lib/es5/_private/utils');

describe('isNullOrEmpty', () => {
  test('empty', () => {
    expect(isNotNullOrEmpty(null)).toBe(false);
    expect(isNotNullOrEmpty(undefined)).toBe(false);
    expect(isNotNullOrEmpty('')).toBe(false);
    expect(isNotNullOrEmpty([])).toBe(false);
    expect(isNotNullOrEmpty({})).toBe(false);
  });

  test('not empty', () => {
    expect(isNotNullOrEmpty('text')).toBe(true);
    expect(isNotNullOrEmpty(['text'])).toBe(true);
    expect(isNotNullOrEmpty({ a: 'text' })).toBe(true);
  });
});