# event-listener-with-options

This module exports two functions:
* `addEventListener(target, type, handler, options)`
* `removeEventListener(target, type, handler, options)`

These work like `target.addEventListener(type, handler, options)`, except that
`options` is allowed to be an object even in browsers which don't yet support
that. In that case, only the options object's `capture` property is respected.

See https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md for
more information on the options parameter.

This module also includes an optional polyfill. Use the following to override
the addEventListener and removeEventListener methods on all EventTargets with
replacements that support an options object if necessary:

```js
require('add-event-listener-with-options/js/polyfill');
```

## Types

Full [Flow Type](http://flowtype.org/) declarations for this module are
included!
