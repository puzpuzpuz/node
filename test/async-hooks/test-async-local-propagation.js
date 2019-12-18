'use strict';

require('../common');
const assert = require('assert');
const async_hooks = require('async_hooks');
const { AsyncLocal } = async_hooks;

const asyncLocal = new AsyncLocal();

setTimeout(() => {
  assert.strictEqual(asyncLocal.get(), undefined);

  asyncLocal.set('A');
  setTimeout(() => {
    assert.strictEqual(asyncLocal.get(), 'A');

    asyncLocal.set('B');
    setTimeout(() => {
      assert.strictEqual(asyncLocal.get(), 'B');
    }, 0);

    assert.strictEqual(asyncLocal.get(), 'B');
  }, 0);

  assert.strictEqual(asyncLocal.get(), 'A');
}, 0);
