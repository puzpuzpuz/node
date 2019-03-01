'use strict';

const assert = require('assert');
const { AsyncStorage } = require('async_storage');

const asyncStorage = new AsyncStorage();

asyncStorage.enter((store) => {
  store.set('hello', 'world');
  setTimeout(() => {
    assert.strictEqual(asyncStorage.getStore().get('hello'), 'world');
    setTimeout(() => {
      assert.strictEqual(asyncStorage.getStore().get('hello'), 'world');
      asyncStorage.exit(() => {
        assert.strictEqual(asyncStorage.getStore(), undefined);
      });
    }, 1000);
  }, 1000);
});

asyncStorage.enter((store) => {
  store.set('hello', 'hearth');
  setTimeout(() => {
    assert.strictEqual(asyncStorage.getStore().get('hello'), 'hearth');
    setTimeout(() => {
      assert.strictEqual(asyncStorage.getStore().get('hello'), 'hearth');
      setTimeout(() => {
        assert.strictEqual(asyncStorage.getStore().get('hello'), 'hearth');
        asyncStorage.exit(() => {
          assert.strictEqual(asyncStorage.getStore(), undefined);
        });
      }, 1000);
    }, 1000);
  }, 500);
});
