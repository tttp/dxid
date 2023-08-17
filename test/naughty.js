import test from "ava";
import words from "naughty-words";
import { luhn32 as luhn, parse, stringify } from "../src/dxid.js";

const profaneID = new Set();
const extrabw = [];

const readable = (word) => {
  const check = (part, checksum) => {
    const cs = luhn(part);
    if (cs === checksum) profaneID.add(parse(cs + part));
  };

  const cs = word[0];
  const input = word.substring(1); //.toUpperCase();
  check(input, cs);
};

const permute = (word) => {
  const upper = word[0].toUpperCase();
  const lower = word[0].toLowerCase();

  const input = word.substring(1);
  const letters = input.split("");
  const permCount = 1 << input.length;
  for (let perm = 0; perm < permCount; perm++) {
    // Update the capitalization depending on the current permutation
    letters.reduce((perm, letter, i) => {
      letters[i] = perm & 1 ? letter.toUpperCase() : letter.toLowerCase();
      return perm >> 1;
    }, perm);
    const part = letters.join("");
    const cs = luhn(part);
    if (cs === upper || cs === lower) {
      profaneID.add(parse(cs + part));
    }
  }
};

test(`testing naughty words dxid`, async (t) => {
  const known = "sm l0rt d1ck s3x0 p0p3l b1tch 1ng010 3r0t1c p0kk3r f1g0n3 schl0ng t0pl3ss r1mm1ng p3nd3j0 bl0w-j0b 0pr0tt3n b0ll0cks g00_g1rl sch13ss3r m1nch10n3 gr3pp3ld3l h0w-t0-k1ll l13fd3sgr0t";
  let allWords = extrabw;
  t.is(Object.keys(words).length, 28, "how many languages");

  Object.values(words).forEach((d) => (allWords = [].concat(allWords, d)));

  //  const allWords = [].concat(words.en,extrabw);
  let bw = [];
  for (let i = 0; i <= 12; i++) {
    bw[i] = [];
  }
  allWords.forEach((word) => {
    const length = word.length;
    if (length > 12) return; //dcid max 12
    const d = word
      .trim()
      .replaceAll(" ", "_")
      .toLowerCase()
      .replaceAll("o", "0")
      .replaceAll("e", "3")
      .replaceAll("i", "1");
    if (/[aeiou]/.test(d)) {
    } else {
      bw[length].push(d);
      bw[length].push(d.replaceAll("_", "-"));
    }
  });

  for (let i = 2; i < 13; i++) {
    bw[i].forEach((d) => {
      if (!d) return;
      try {
        //permute(d);
        readable(d);
      } catch (e) {
        //console.log(d);
        // words with I L O U aren't dxid
      }
    });
  }

  t.is(profaneID.size,24,"profane words found");
  const naughty = [];
  [...profaneID]
    .sort((a, b) => a - b)
    .forEach((id) => {
      try {
//        console.log(id, stringify(id));
        naughty.push(stringify(id));
      } catch (e) {}
    });

  t.is(known,naughty.join(" "),"known naughty words only");
//  console.log(naughty.join(" "));
  //console.log(bw);
  //console.log(allWords);
});
