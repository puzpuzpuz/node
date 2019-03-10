'use strict';
const common = require('../common');
const assert = require('assert');
const { AsyncStorage } = require('async_hooks');

const asyncStorage1 = new AsyncStorage();
const asyncStorage2 = new AsyncStorage();

assert.strictEqual(asyncStorage1.getStore(), undefined);
asyncStorage1.enter().set('hello', 'world');
asyncStorage2.enter().set('hello', 'earth');

setTimeout(() => {
  assert.strictEqual(asyncStorage1.getStore().get('hello'), 'world');
  assert.strictEqual(asyncStorage2.getStore().get('hello'), 'earth');
  asyncStorage1.exit();
  assert.strictEqual(asyncStorage1.getStore(), undefined);
  assert.strictEqual(asyncStorage2.getStore().get('hello'), 'earth');
});

