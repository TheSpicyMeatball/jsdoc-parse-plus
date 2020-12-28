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

toJsdocString(tags);
// outputs =>
/**
 * The description goes here
 * @since v1.0.0
 */
```