import test from 'ava';
import { parse } from '../src/dxid.js';

test('parse properly some dxid', (t) => {
  t.is(parse('8c'), 1);
  t.is(parse('__'), 21);
  t.is(parse('pcn'), 42);
  t.is(parse('3-21'),791);
  t.is(parse('bc8b'), 1984);
  t.is(parse('6k9999999999'), Number.MAX_SAFE_INTEGER);
});

test ('parse all the symbols', (t) => {
  t.is(parse('p0123456789'), 800197332334559 );
  t.is(parse('fqrstvwxyz_'), 437003813998229);
  t.is(parse('sqrstvwxyzb'), 437003813998208);
  t.is(parse('4cdfghjklmnp'), 1199710202504523);
  
});

test('parse properly some dxid in uppercase', (t) => {
  t.is(parse('8C'), 1);
  t.is(parse('PCN'), 42);
  t.is(parse('bC8B'), 1984);
});

test('parse properly some dxid with - separator', (t) => {
  t.is(parse('3-21'),791);
  t.is(parse('8-c'), 1);
  t.is(parse('-pcn'), 42);
  t.is(parse('bc8b-'), 1984);
  t.is(parse('6k99-9999-9999'), Number.MAX_SAFE_INTEGER);
});

test('parse invalid dxid(s) throw errors', (t) => {
  t.throws(() => parse('a'), { instanceOf: RangeError });
  t.throws(() => parse('ac'), { instanceOf: RangeError });
  t.throws(() => parse('ac', true), { instanceOf: RangeError });
  t.throws(() => parse('ac', 'whatever'), { instanceOf: RangeError });
  t.throws(() => parse('inva/lid char'), { instanceOf: RangeError });
  t.throws(() => parse('invalid'), { instanceOf: RangeError });
  t.throws(() => parse(321), { instanceOf: Error });
});

test('parse invalid dxid(s) with throwError===false returns false', (t) => {
  t.false(parse('bcd', false));
  t.false(parse('inva/lid char',false));
  t.truthy(parse('bc8b', false));
  t.is(parse('pcn', false), 42);
  t.is(parse('42', false), 42);
  t.is(parse(42, false), 42);
});
