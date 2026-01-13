#!/usr/bin/env node
import { id, parse, stringify } from "./src/dxid.js";

const argv = process.argv.slice(2);
if (argv.length === 0 || argv.length > 2) {
  console.error(
    "invalid parameter: usage either \n$npx dxid [id or dxid]\n$npx dxid stringify id\n$npx parse dxid",
  );
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
        console.error(
          "unknown command '",
          argv[0],
          "' either stringify or parse",
        );
        process.exit(5);
    }
    process.exit(0);
  }

  if (argv.length === 1) {
    const d = argv[0];
    console.log(id(d));
    /*    try { // some dxid looks like number, 700,501,302,103...
      const id = parse(d);
      console.error ("🤔",d, "can be either an id or a dxid");
      console.log(d,"->id",parse(d));
      console.log(+d,"->dxid",dxid);
      console.warn("💡 use $npx dxid stringify "+d +" for ids");
      process.exit(1);
    } catch (e) {
      console.log(dxid);
    }
*/
  }
} catch (error) {
  // console.error(error);
  console.error("🛑", error.toString(), "💣");
  process.exit(5);
}
