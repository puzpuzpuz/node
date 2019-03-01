'use strict';

const assert = require('assert');
const { AsyncStorage } = require('async_storage');

const asyncStorage1 = new AsyncStorage();
const asyncStorage2 = new AsyncStorage();
const asyncStorage3 = new AsyncStorage();

assert.strictEqual(asyncStorage1.getStore(), undefined);
asyncStorage1.enter((store1) => {
  store1.set('hello', 'world');
  asyncStorage3.enter((store3) => {
    store3.set('hello', 'you');
    setTimeout(() => {
      assert.strictEqual(asyncStorage1.getStore().get('hello'), 'world');
      assert.strictEqual(asyncStorage2.getStore(), undefined);
      assert.strictEqual(asyncStorage3.getStore().get('hello'), 'you');
      asyncStorage1.exit(() => {
        assert.strictEqual(asyncStorage1.getStore(), undefined);
        assert.strictEqual(asyncStorage2.getStore(), undefined);
        assert.strictEqual(asyncStorage3.getStore().get('hello'), 'you');
      });
    });
  });
  asyncStorage2.enter((store2) => {
    store2.set('hello', 'earth');
    setTimeout(() => {
      assert.strictEqual(asyncStorage1.getStore().get('hello'), 'world');
      assert.strictEqual(asyncStorage2.getStore().get('hello'), 'earth');
    });
  });
});


