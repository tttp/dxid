#!/usr/bin/env node
import {
  luhn32, stringify, parse, normalize,
} from './dxid.js';

const argv = process.argv.slice(2);
if (argv.length !== 1) {
  console.error('error: usage ./check.js payload');
  process.exit(1);
}
const payload = argv[0].toLowerCase();
if (payload.length > 1 && payload[0] === 'b') {
  console.error(
    "🛑 the payload can't start with b, it't the non significant digit, like 0 in base 10",
  );
  process.exit(1);
}
const dxid = luhn32(normalize(payload)) + payload;
try {
  const id = parse(dxid);
  console.log(dxid, id);
  const normie = normalize(dxid);

  if (normalize(stringify(id)) !== normie) {
    console.error('🛑 didx ', id, `=>${stringify(id)}`, '💣');
    console.error(`${normalize(stringify(id))}\n${normie}`);
  } else if (normie !== dxid) {
    console.log('=', normie);
  }
} catch (error) {
  console.error('🛑', error.toString(), '💣');
  process.exit(1);
}
