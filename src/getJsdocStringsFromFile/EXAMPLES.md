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

getJsdocStringsFromFile(file);

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