'use strict';
const common = require('../common');
const assert = require('assert');
const { AsyncStorage } = require('async_hooks');

const asyncStorage = new AsyncStorage();

setTimeout(() => {
  asyncStorage.enter().set('hello', 'world');
  setTimeout(() => {
    assert.strictEqual(asyncStorage.getStore().get('hello'), 'world');
    asyncStorage.exit();
  }, 200);
}, 100);

setTimeout(() => {
  asyncStorage.enter().set('hello', 'earth');
  setTimeout(() => {
    assert.strictEqual(asyncStorage.getStore().get('hello'), 'earth');
    asyncStorage.exit();
  }, 100);
}, 100);
