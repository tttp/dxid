import test from 'ava';
import { stringify, parse } from '../src/dxid.js';

test('transform properly some ids', (t) => {
  t.is(stringify(1), 'y1');
  t.is(stringify(42), 'b1a');
  t.is(stringify(1984), '01y0');
  t.is(stringify(Number.MAX_SAFE_INTEGER), 'w7zzzzzzzzzz');
  // t.is(stringify(Number.MAX_SAFE_INTEGER + 1),'tf________');
});

test('stringify invalid id(s) throw errors', (t) => {
//  t.throws(() => stringify(-42), { instanceOf: RangeError });
//  t.throws(() => stringify(0), { instanceOf: RangeError });
  t.throws(() => stringify(Number.MAX_SAFE_INTEGER + 1), {
    instanceOf: RangeError,
  });
});

test('length of dxid is max 12', (t) => {
  const max = 999; // Number.MAX_SAFE_INTEGER;
  let longer = 0;
  t.is(stringify(1).length, 2);
  t.is(stringify(Number.MAX_SAFE_INTEGER).length, 12);
  for (let id = 1; id < max; id++) {
    const dxid = stringify(id);
    if (dxid.length > id.toString().length) {
      longer += 1;
    }
    t.is(id, parse(dxid));
  }
  t.is(longer, 77);
});
