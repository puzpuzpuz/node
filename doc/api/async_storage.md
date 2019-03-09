# Async Storage

<!--introduced_in=REPLACEME-->

> Stability: 1 - Experimental

The `async_storage` module provides an API to use a unique context through
multiple asynchronous operations.

```js
const { AsyncStorage } = require('async_storage');
```

## Public API

### Class: AsyncStorage

### new AsyncStorage()

Creates a new instance of AsyncStorage. Until the `enter` method is called, it
does not provide any storage features.

### asyncStorage.enter(callback)

Calling `asyncStorage.enter(callback)` will create a new asynchronous resource
and call the provided callback into it.

A new instance of `Map` (the store) will be given as parameter to the callback.
This store will be persistent through the following asynchronous calls.

### asyncStorage.exit(callback)

Calling `asyncStorage.exit(callback)` will remove the following asynchronous
calls from the async storage. In the callback and further operations,
`asyncStorage.getStore()` will return `undefined`. 

### asyncStorage.getStore()

Calling this method outside of an asynchronous context initialized by calling
`asyncStorage.enter` or after a call to `asyncStorage.exit` will return
`undefined`.

Otherwise it will return the current context.

## Example

Let's build a logger that will always know the current HTTP request and use
it to display enhanced logs without needing to explicitly pass the current
HTTP request to it.

```js
const { AsyncStorage } = require('async_storage');
const http = require('http');

const K_REQ = 'CURRENT_REQUEST';
const ASYNC_STORAGE = new AsyncStorage();

function log(...args) {
  const store = ASYNC_STORAGE.getStore();
  // Let's make sure the store exists and it contains a request
  if (store && store.has(K_REQ)) {
    const req = store.get(K_REQ);
    // For instance, prints `GET /items ERR could not do something
    console.log(req.method, req.url, ...args);
  } else {
    console.log(...args);
  }
}

http.createServer((request, response) => {
  ASYNC_STORAGE.enter((store) => {
    store.set(K_REQ, request);
    // some code
    someAsyncOperation((err, result) => {
      if (err){
        log('ERR', err.message);
        // ... rest of the code
      }
    });
  });
})
.listen(8080);

```


