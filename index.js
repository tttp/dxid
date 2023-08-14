#!/usr/bin/env node
const {encode, decode} = require("./src/dxid.js");

  const argv = process.argv.slice(2);
  if (argv.length !== 1) {
    console.error ("error: usage ./index.js {id or dxid}");
    process.exit(1);
  }
  if (isNaN(argv[0])) {
    const id = decode(argv[0]);
    console.log(id);
  } else {
    const dxid = encode(+argv[0]);
    console.log(dxid);
  }
