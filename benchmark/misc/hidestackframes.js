'use strict';

const common = require('../common.js');

const bench = common.createBenchmark(main, {
  type: ['no-error', 'error'],
  n: [100000]
}, {
  flags: ['--expose-internals']
});

function main({ n, type }) {
  const {
    hideStackFrames,
    codes: {
      ERR_INVALID_ARG_TYPE,
    },
  } = require('internal/errors');

  const fn = hideStackFrames(
    (value) => {
      if (typeof value !== 'number') {
          throw new ERR_INVALID_ARG_TYPE('Benchmark', 'number', value);
      }
    }
  );

  let value = 'will-throw';
  if (type === 'no-error') {
    value = 42;
  }

  bench.start();

  for (let i = 0; i < n; i++) {
    try {
      fn(value);
    } catch (err) {
      // No-op
    }
  }

  bench.end(n);
}
