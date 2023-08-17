import test from 'ava';
import { parse } from '../src/dxid.js';

test('parse properly some dxid', (t) => {
  t.is(parse('y1'), 1);
  t.is(parse('b1a'), 42);
  t.is(parse('01y0'), 1984);
  t.is(parse('w7zzzzzzzzzz'), Number.MAX_SAFE_INTEGER);
});

test('parse invalid dxid(s) throw errors', (t) => {
  t.throws(() => parse('A'), { instanceOf: RangeError });
  t.throws(() => parse('AC'), { instanceOf: RangeError });
  t.throws(() => parse('AC', true), { instanceOf: RangeError });
  t.throws(() => parse('AC', 'whatever'), { instanceOf: RangeError });
  t.throws(() => parse('INVAL1D'), { instanceOf: RangeError });
});

test('parse invalid dxid(s) with throwError===false returns false', (t) => {
  t.false(parse('AC', false));
  t.truthy(parse('y1', false));
  t.is(parse('b1a', false), 42);
});
