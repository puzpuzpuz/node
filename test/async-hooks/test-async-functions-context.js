'use strict';
const assert = require('assert');
const { AsyncContext } = require('async_hooks');

async function foo() {}

async function testAwait() {
  await foo();
  assert.strictEqual(asyncContext.get('key'), 'value');
}

const asyncContext = new AsyncContext();
asyncContext.run(() => {
  asyncContext.set('key', 'value');
  assert.doesNotReject(testAwait());
});
