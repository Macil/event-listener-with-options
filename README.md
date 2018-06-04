# event-listener-with-options

[![Circle CI](https://circleci.com/gh/AgentME/event-listener-with-options.svg?style=shield)](https://circleci.com/gh/AgentME/event-listener-with-options)
[![npm version](https://badge.fury.io/js/event-listener-with-options.svg)](https://badge.fury.io/js/event-listener-with-options) [![Greenkeeper badge](https://badges.greenkeeper.io/AgentME/event-listener-with-options.svg)](https://greenkeeper.io/)

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

[Flow](https://flowtype.org/) type declarations for this module are included!
If you are using Flow, they won't require any configuration to use.
