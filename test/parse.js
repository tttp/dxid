import test from 'ava';
import { parse } from '../src/dxid.js';

test('parse properly some dxid', (t) => {
  t.is(parse('8C'), 1);
  t.is(parse('PCN'), 42);
  t.is(parse('BC8B'), 1984);
  t.is(parse('6K9999999999'), Number.MAX_SAFE_INTEGER);
});

test('parse invalid dxid(s) throw errors', (t) => {
  t.throws(() => parse('A'), { instanceOf: RangeError });
  t.throws(() => parse('AC'), { instanceOf: RangeError });
  t.throws(() => parse('AC', true), { instanceOf: RangeError });
  t.throws(() => parse('AC', 'whatever'), { instanceOf: RangeError });
  t.throws(() => parse('INVAL1D'), { instanceOf: RangeError });
});

test('parse invalid dxid(s) with throwError===false returns false', (t) => {
  t.false(parse('BCD', false));
  t.truthy(parse('BC8B', false));
  t.is(parse('PCN', false), 42);
});
