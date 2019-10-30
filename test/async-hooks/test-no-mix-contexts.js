'use strict';
const assert = require('assert');
const { AsyncContext } = require('async_hooks');

const asyncContext = new AsyncContext();

asyncContext.run(() => {
  asyncContext.set('hello', 'world');
  setTimeout(() => {
    assert.strictEqual(asyncContext.get('hello'), 'world');
  }, 200);
});

asyncContext.run(() => {
  asyncContext.set('hello', 'earth');
  setTimeout(() => {
    assert.strictEqual(asyncContext.get('hello'), 'earth');
  }, 100);
});
