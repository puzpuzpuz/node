'use strict';
const common = require('../common');
const assert = require('assert');
const { AsyncContext } = require('async_hooks');

const asyncContext1 = new AsyncContext();
const asyncContext2 = new AsyncContext();

assert.strictEqual(asyncContext1.getStore(), undefined);
asyncContext1.enter().set('hello', 'world');
asyncContext2.enter().set('hello', 'earth');

setTimeout(() => {
  assert.strictEqual(asyncContext1.getStore().get('hello'), 'world');
  assert.strictEqual(asyncContext2.getStore().get('hello'), 'earth');
  asyncContext1.exit();
  assert.strictEqual(asyncContext1.getStore(), undefined);
  assert.strictEqual(asyncContext2.getStore().get('hello'), 'earth');
});

