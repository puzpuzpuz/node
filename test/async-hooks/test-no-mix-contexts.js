'use strict';
const common = require('../common');
const assert = require('assert');
const { AsyncContext } = require('async_hooks');

const asyncContext = new AsyncContext();

setTimeout(() => {
  asyncContext.enter((store) => {
    store.set('hello', 'world');
    setTimeout(() => {
      assert.strictEqual(asyncContext.getStore().get('hello'), 'world');
    }, 200);
  });
}, 100);

setTimeout(() => {
  asyncContext.enter((store) => {
    store.set('hello', 'earth');
    setTimeout(() => {
      assert.strictEqual(asyncContext.getStore().get('hello'), 'earth');
    }, 100);
  });
}, 100);

