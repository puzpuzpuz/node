'use strict';
// Flags: --expose-internals

const common = require('../../common');
const assert = require('assert');
const async_hooks = require('async_hooks');
const { async_id_symbol,
        trigger_async_id_symbol } = require('internal/async_hooks').symbols;
const binding = require(`./build/${common.buildType}/binding`);

if (process.env.NODE_TEST_WITH_ASYNC_HOOKS) {
  common.skip('cannot test with env var NODE_TEST_WITH_ASYNC_HOOKS');
  return;
}

// Baseline to make sure both internal fields aren't set.
assert.strictEqual(
  binding.getPromiseField(Promise.resolve(1), 0),
  0);
assert.strictEqual(
  binding.getPromiseField(Promise.resolve(1), 1),
  0);

const emptyHook = async_hooks.createHook({}).enable();

// Check that no PromiseWrap is created when there are no hook callbacks.
assert.strictEqual(
  binding.getPromiseField(Promise.resolve(1), 1),
  0);

emptyHook.disable();

let lastResource;
let lastAsyncId;
let lastTriggerAsyncId;
const initOnlyHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    lastAsyncId = asyncId;
    lastTriggerAsyncId = triggerAsyncId;
    lastResource = resource;
  }
}).enable();

// Check that no PromiseWrap is created when only using an init hook.
{
  const promise = Promise.resolve(1);
  assert.strictEqual(typeof binding.getPromiseField(promise, 0), 'number');
  assert.strictEqual(typeof binding.getPromiseField(promise, 1), 'number');
  assert.strictEqual(lastResource, promise);
  assert.strictEqual(lastAsyncId, binding.getPromiseField(promise, 0));
  assert.strictEqual(lastTriggerAsyncId, binding.getPromiseField(promise, 1));
}

initOnlyHook.disable();

lastResource = null;
const hookWithDestroy = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    lastAsyncId = asyncId;
    lastTriggerAsyncId = triggerAsyncId;
    lastResource = resource;
  },

  destroy() {

  }
}).enable();

// Check that the internal field returns the same PromiseWrap passed to init().
{
  const promise = Promise.resolve(1);
  const promiseWrap = binding.getPromiseField(promise, 0);
  assert.strictEqual(binding.getPromiseField(promise, 1), 0);
  assert.strictEqual(lastResource, promiseWrap);
  assert.strictEqual(lastAsyncId, promiseWrap[async_id_symbol]);
  assert.strictEqual(lastTriggerAsyncId, promiseWrap[trigger_async_id_symbol]);
}

hookWithDestroy.disable();

// Check that internal fields are no longer being set. This needs to be delayed
// a bit because the `disable()` call only schedules disabling the hook in a
// future microtask.
setImmediate(() => {
  assert.strictEqual(
    binding.getPromiseField(Promise.resolve(1), 0),
    0);
  assert.strictEqual(
    binding.getPromiseField(Promise.resolve(1), 1),
    0);

  const noDestroyHook = async_hooks.createHook({
    init(asyncId, type, triggerAsyncId, resource) {
      lastAsyncId = asyncId;
      lastTriggerAsyncId = triggerAsyncId;
      lastResource = resource;
    },

    before() {},
    after() {},
    resolve() {}
  }).enable();

  // Check that no PromiseWrap is created when there is no destroy hook.
  const promise = Promise.resolve(1);
  assert.strictEqual(typeof binding.getPromiseField(promise, 0), 'number');
  assert.strictEqual(typeof binding.getPromiseField(promise, 1), 'number');
  assert.strictEqual(lastResource, promise);
  assert.strictEqual(lastAsyncId, binding.getPromiseField(promise, 0));
  assert.strictEqual(lastTriggerAsyncId, binding.getPromiseField(promise, 1));

  noDestroyHook.disable();
});
