#!/usr/bin/env node
import { stringify, parse } from './src/dxid.js';

const argv = process.argv.slice(2);
if (argv.length !== 1) {
  console.error('error: usage ./index.js {id or dxid}');
  process.exit(1);
}
try {
  if (Number.isNaN(argv[0])) {
    const id = parse(argv[0]);
    console.log(id);
  } else {
    const dxid = stringify(+argv[0]);
    console.log(dxid);
  }
} catch (error) {
  console.error(error.toString());
  process.exit(1);
}
