'use strict';
const common = require('../common');
const assert = require('assert');
const { AsyncContext } = require('async_hooks');

async function foo() {}

async function testAwait() {
  await foo();
  assert.notStrictEqual(asyncContext.getStore(), undefined);  // asserts
  assert.strictEqual(asyncContext.getStore().get("key"), "value");
}

const asyncContext = new AsyncContext();
asyncContext.enter((store) => {
  store.set("key", "value");
  assert.doesNotReject(testAwait());
});



