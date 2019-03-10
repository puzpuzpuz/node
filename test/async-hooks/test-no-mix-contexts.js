'use strict';
const common = require('../common');
const assert = require('assert');
const { AsyncContext } = require('async_hooks');

const asyncContext = new AsyncContext();

setTimeout(() => {
  asyncContext.enter().set('hello', 'world');
  setTimeout(() => {
    assert.strictEqual(asyncContext.getStore().get('hello'), 'world');
    asyncContext.exit();
  }, 200);
}, 100);

setTimeout(() => {
  asyncContext.enter().set('hello', 'earth');
  setTimeout(() => {
    assert.strictEqual(asyncContext.getStore().get('hello'), 'earth');
    asyncContext.exit();
  }, 100);
}, 100);
