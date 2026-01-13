import test from "ava";
import { parse, stringify } from "../src/dxid.js";

test("dxid non significant digit is b", (t) => {
  t.is(parse("bb"), 0);
  t.is(parse("bbb"), 0);
  t.is(parse("bbbbbbbbbb"), 0);
});

test("id non significant digit is 0", (t) => {
  t.is(stringify(0), "bb");
  // t.is(stringify(00), "bb"); ava doesn't accept octal number (strict mode), but works otherwise
});
