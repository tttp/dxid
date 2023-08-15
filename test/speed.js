'use strict';

import test from 'ava';
import {parse, stringify} from '../src/dxid.js';

const max = 9999999;
test('how long to generate ' +max.toLocaleString() +' dxid', t=> {
  for (let id = 1; id < max; id++) {
    const dxid = stringify (id);
  }
  t.pass();
});

