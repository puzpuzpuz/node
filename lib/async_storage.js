'use strict';
const { createHook, executionAsyncId } = require('async_hooks');
const { WeakReference } = internalBinding('util');
const { emitExperimentalWarning } = require('internal/util');

emitExperimentalWarning('async_storage');
// id => WeakReference<AsyncResource>
const idResourcePairing = new Map();
const storages = new Set();
createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    // save new resource
    idResourcePairing.set(asyncId, new WeakReference(resource));
    const triggerResourceWeak = idResourcePairing.get(triggerAsyncId);
    if (triggerResourceWeak) { // it has a parent, let it be known
      storages.forEach((storage) => {
        storage._propagate(resource, triggerResourceWeak.get());
      });
    }
  },
  destroy(asyncId) {
    idResourcePairing.delete(asyncId);
  },
  promiseResolve(asyncId) {
    idResourcePairing.delete(asyncId);
  }
})
  .enable();

class AsyncStorage {

  constructor() {
    // WeakMap resource -> store
    this._resource_store = new WeakMap();
    this.count = 0;
  }

  /**
   * propagate the context from a parent resource to a child one
   */
  _propagate(resource, triggerResource) {
    const store = this._resource_store.get(triggerResource);
    if (store) {
      this._resource_store.set(resource, store);
    }
  }

  /**
   * get the current store, i.e. the unique map associated with current
   * async resource and (maybe) inherited from the parent async resource
   * will return null if no map is currently associated
   */
  getStore() {
    const asyncId = executionAsyncId();
    const resourceWeak = idResourcePairing.get(asyncId);
    if (resourceWeak === undefined) {
      return ; // should this throw?
    }
    const resource = resourceWeak.get();
    return this._resource_store.get(resource);
  }

  /**
   * creates a parent async resource and associates a context with it
   * then the callback is called in that new async context
   * at this point calling getStore will return a map
   * if called within the callback chain of another start call a new map will
   * replace the previous one.
   */
  enter(cb) {
    storages.add(this);
    this.count++;
    return setImmediate(() => {
      const asyncId = executionAsyncId();
      const resource = idResourcePairing.get(asyncId).get();
      const store = new Map();
      this._resource_store.set(resource, store);
      return cb(store);
    });
  }

  /**
   * creates a parent async resource and un-associates any context from it
   * then the callback is called in that new async context
   * at this point calling getStore will return null
   */
  exit(cb) {
    return setImmediate(() => {
      const asyncId = executionAsyncId();
      const resource = idResourcePairing.get(asyncId).get();
      const hasDel = this._resource_store.delete(resource);
      if (hasDel) {
        this.count--;
        if (this.count === 0) {
          storages.delete(this);
        }
      }
      return cb();
    });
  }
}

module.exports = { AsyncStorage };
