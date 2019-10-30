'use strict';
const assert = require('assert');
const { AsyncContext } = require('async_hooks');

const asyncContext = new AsyncContext();

// TODO make this test more deterministic
asyncContext.run(() => {
  asyncContext.set('root', 'value0');
  
  setTimeout(() => {
    asyncContext.set('nested', 'value1');
    setTimeout(() => {
      assert.strictEqual(asyncContext.get('root'), 'value0');
      assert.strictEqual(asyncContext.get('nested'), 'value1');
    }, 200);
  }, 200);

  setTimeout(() => {
    asyncContext.set('nested', 'value2');
    setTimeout(() => {
      assert.strictEqual(asyncContext.get('root'), 'value0');
      assert.strictEqual(asyncContext.get('nested'), 'value2');
    }, 200);
  }, 200);
});
