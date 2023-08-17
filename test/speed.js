import test from 'ava';
import { stringify } from '../src/dxid.js';

const max = 1000000;
test(`how long to generate ${max.toLocaleString()} dxid`, (t) => {
  const base10dxid = new Set ("700,501,302,103,-04,610,411,212,013,520,321,122,-23,430,231,032,340,141,-42,250,051,160,-61,070,-80,0xcd".split(","));

  for (let id = 1; id < max; id++) {
    const dxid = stringify(id);
    if (!base10dxid.has (dxid)) {
      if (!isNaN(dxid)) {
        base10dxid.add(dxid);
      }
//      t.true(isNaN(dxid),id + " dxid looks like a number: " +dxid); // very slow
    }
    
  }
//  console.log(Array.from(base10dxid).join(','));
  t.is(base10dxid.size,3602,base10dxid.size +" dxid that looks like numbers below "+max);
  t.pass();
});
