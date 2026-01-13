import test from "ava";
import { parse, stringify } from "../src/dxid.js";

test("transform properly some ids", (t) => {
  t.is(stringify(1), "8c");
  t.is(stringify(21), "__");
  t.is(stringify(42), "pcn");
  t.is(stringify(321), "znc");
  t.is(stringify(791), "3-21");
  t.is(stringify(1984), "bc8b");
  t.is(stringify(Number.MAX_SAFE_INTEGER), "6k9999999999");
  // t.is(stringify(Number.MAX_SAFE_INTEGER + 1),'tf________');
});

test("transform all the 32 symbols + separator", (t) => {
  // p0123456789 800197332334559
  // fqrstvwxyz_ 437003813998229
  // 4cdfghjklmnp 1199710202504523
  // sqrstvwxyzb 437003813998208

  t.is(stringify(800197332334559), "p0123456789");
  t.is(stringify(437003813998229), "fqrstvwxyz_");
  t.is(stringify(1199710202504523), "4cdfghjklmnp");
  t.is(stringify(437003813998208), "sqrstvwxyzb");
});

test("stringify invalid id(s) throw errors", (t) => {
  t.throws(() => stringify(-42), { instanceOf: RangeError });
  //  t.throws(() => stringify(0), { instanceOf: RangeError });
  t.throws(() => stringify(Number.MAX_SAFE_INTEGER + 1), {
    instanceOf: RangeError,
  });
  t.throws(() => stringify("321"), { instanceOf: Error });
});

test("max length of dxid is 12", (t) => {
  const max = 9999; // Number.MAX_SAFE_INTEGER;
  let longer = 0;
  t.is(stringify(1).length, 2);
  t.is(stringify(32767).length, 4);
  t.is(stringify(1048575).length, 5);
  t.is(stringify(Number.MAX_SAFE_INTEGER).length, 12);
  for (let id = 1; id < max; id++) {
    const dxid = stringify(id);
    if (dxid.length > id.toString().length) {
      longer += 1;
    }
    t.is(id, parse(dxid));
  }
  t.is(longer, 97);
});
