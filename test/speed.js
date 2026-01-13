import test from "ava";
import { stringify } from "../src/dxid.js";

const max = 1000000;
test(`how long to generate ${max.toLocaleString()} dxid`, (t) => {
  // const base10dxid = new Set ("00002 013 00021 032 00040 051 070 0089 00101 103 00120 122 141 160 0169 0188 00200 212 231 0249 250 0268 0287 302 321 0329 340".split(" "));
  const base10dxid = new Set();

  for (let id = 1; id < max; id++) {
    const dxid = stringify(id);
    if (dxid[1] === "b")
      t.false(dxid[1], "b", "a dxid payload should not start with b");

    if (!Number.isNaN(dxid) && dxid[0] !== "-" && dxid[1] !== "x") {
      base10dxid.add(dxid);
    }
    //      t.true(isNaN(dxid),id + " dxid looks like a number: " +dxid); // very slow
  }
  let _nok = "";
  _nok = Array.from(base10dxid)
    .sort((a, b) => +a - +b)
    .join(" ");
  // t.is(base10dxid.size,3602,base10dxid.size +" dxid that looks like numbers below "+max + ":"+ Array.from(base10dxid).sort((a, b) => a - b).join(","));
  t.is(
    base10dxid.size,
    966174,
    `${base10dxid.size} dxid that looks like ids below ${max}`,
  );
});
