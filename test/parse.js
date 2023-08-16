'use strict';

import test from 'ava';
import {parse} from '../src/dxid.js';

test('parse properly some dxid', t => {
	t.is (parse('AA'),1);
	t.is (parse('tp'),42);
	t.is (parse('je_'),1984);
	t.is (parse('Mf_______-'),Number.MAX_SAFE_INTEGER);
	t.is (parse('Kf________'),Number.MAX_SAFE_INTEGER + 1);
});

test('parse invalid dxid(s) throw errors', t => {
	t.throws(() => parse('A'), {instanceOf: RangeError});
	t.throws(() => parse('AB'), {instanceOf: RangeError});
	t.throws(() => parse('AB', true), {instanceOf: RangeError});
	t.throws(() => parse('AB', 'whatever'), {instanceOf: RangeError});
	t.throws(() => parse('INVAL1D'), {instanceOf: RangeError});
});

test('parse invalid dxid(s) with throwError===false returns false', t => {
	t.false(parse('AB',false));
	t.truthy(parse('AA',false));
	t.is (parse('tp',false),42);
});

