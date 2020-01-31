'use strict';

const common = require('../common');
const assert = require('assert');
const {
  executionAsyncResource,
  executionAsyncId,
  createHook,
} = require('async_hooks');
const http = require('http');

const hooked = {};
const types = {};
createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    hooked[asyncId] = resource;
    types[asyncId] = type;
  }
}).enable();

const server = http.createServer((req, res) => {
  res.end('ok');
});

server.listen(common.PORT, () => {
  // so far, so good
  assert.strictEqual(executionAsyncResource(), hooked[executionAsyncId()]);

  http.get({ port: common.PORT }, () => {
    console.log('1: executionAsyncId()', executionAsyncId());
    console.log('1: executionAsyncResource()', executionAsyncResource());
    // this one fails
    assert.strictEqual(executionAsyncResource(), hooked[executionAsyncId()]);
    server.close();
  });
});
