import test from 'ava';
import { parse } from '../src/dxid.js';

test('parse properly some dxid', (t) => {
  t.is(parse('8c'), 1);
  t.is(parse('pcn'), 42);
  t.is(parse('bc8b'), 1984);
  t.is(parse('6k9999999999'), Number.MAX_SAFE_INTEGER);
});

test('parse properly some dxid in uppercase', (t) => {
  t.is(parse('8C'), 1);
  t.is(parse('PCN'), 42);
  t.is(parse('bC8B'), 1984);
});

test('parse properly some dxid with .', (t) => {
  t.is(parse('8.c'), 1);
  t.is(parse('.pcn'), 42);
  t.is(parse('bc8b.'), 1984);
  t.is(parse('6k99.9999.9999'), Number.MAX_SAFE_INTEGER);
});

test('parse invalid dxid(s) throw errors', (t) => {
  t.throws(() => parse('a'), { instanceOf: RangeError });
  t.throws(() => parse('ac'), { instanceOf: RangeError });
  t.throws(() => parse('ac', true), { instanceOf: RangeError });
  t.throws(() => parse('ac', 'whatever'), { instanceOf: RangeError });
  t.throws(() => parse('invalid'), { instanceOf: RangeError });
});

test('parse invalid dxid(s) with throwError===false returns false', (t) => {
  t.false(parse('bcd', false));
  t.truthy(parse('bc8b', false));
  t.is(parse('pcn', false), 42);
});
