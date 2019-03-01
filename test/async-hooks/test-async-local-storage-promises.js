'use strict';
require('../common');
const assert = require('assert');
const { AsyncLocalStorage } = require('async_hooks');

async function main() {

  const local = new AsyncLocalStorage();
  const err = new Error();
  const next = () => Promise.resolve()
    .then(() => {

      assert.strictEqual(local.getStore().get('a'), 1);
      throw err;
    });
  await new Promise((resolve, reject) => {
    local.run(() => {
      const store = local.getStore();
      store.set('a', 1);
      next().then(resolve, reject);
    });
  })
    .catch((e) => {
      assert.strictEqual(local.getStore(), undefined);
      assert.strictEqual(e, err);
    });
  assert.strictEqual(local.getStore(), undefined);
}

main();
