'use strict';
require('../common');
const assert = require('assert');
const { AsyncLocalStorage } = require('async_hooks');
const http = require('http');

const asynclocal = new AsyncLocalStorage();
asynclocal.enable();
const server = http.createServer((req, res) => {
  res.end('ok');
});

server.listen(0, () => {
  asynclocal.run(() => {
    const store = asynclocal.getStore();
    store.set('hello', 'world');
    http.get({ host: 'localhost', port: server.address().port }, () => {
      assert.strictEqual(asynclocal.getStore().get('hello'), 'world');
      server.close();
    });
  });
});
