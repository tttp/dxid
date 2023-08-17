#!/usr/bin/env node
import { stringify, parse } from './src/dxid.js';

const argv = process.argv.slice(2);
if (argv.length === 0 || argv.length > 2) {
  console.error("invalid parameter: usage either \n$npx dxid [id or dxid]\n$npx dxid stringify id\n$npx parse dxid");
  process.exit(5);
}
try {
  if (argv.length === 2) {
    const d = argv[1];
    switch (argv[0].toLowerCase()) {
      case "stringify": 
        console.log(stringify(+d)); 
        break;
      case "parse": 
        console.log(parse(d)); 
        break;
      default:
        console.error("unknown command '",argv[0],"' either stringify or parse");
        process.exit(5);
    }
    process.exit(0);
  }

  const d = argv[0];
  if (isNaN(d) || d[0] ==='-') {
    const id = parse(d);
    console.log(id);
  } else {
    const dxid = stringify(+d);
    try { // some dxid looks like number, 700,501,302,103...
      const id = parse(d);
      console.warn (d, "can be either an id or a dxid");
      console.log(d,"->id",parse(d));
      console.log(+d,"->dxid",dxid);
      process.exit(1);
    } catch (e) {
      console.log(dxid);
    }
  }

} catch (error) {
  console.error(error.toString());
  process.exit(5);
}
