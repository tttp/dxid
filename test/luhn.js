import test from "ava";
import { luhn32 as luhn, stringify } from "../src/dxid.js";

// from https://en.wikipedia.org/wiki/Luhn_mod_N_algorithm

// const codePoints = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
// const codePoints   = 'BCDFGHJKLMNPQRSTVWXZ_-0123456789'; //without voyels
const codePoints = "bcdfghjklmnpqrstvwxyz_0123456789"; // lowercase withyou voyel
// This can be any string of permitted characters

function numberOfValidInputCharacters() {
  return codePoints.length;
}

function codePointFromCharacter(character) {
  return codePoints.indexOf(character);
}

function characterFromCodePoint(codePoint) {
  return codePoints.charAt(codePoint);
}

// The function to generate a check character is:

function generateCheckCharacter(input) {
  let factor = 2;
  let sum = 0;
  const n = numberOfValidInputCharacters();

  // Starting from the right and working leftwards is easier since
  // the initial "factor" will always be "2".
  for (let i = input.length - 1; i >= 0; i--) {
    const codePoint = codePointFromCharacter(input.charAt(i));
    let addend = factor * codePoint;

    // Alternate the "factor" that each "codePoint" is multiplied by
    factor = factor === 2 ? 1 : 2;

    // Sum the digits of the "addend" as expressed in base "n"
    addend = Math.floor(addend / n) + (addend % n);
    sum += addend;
  }

  // Calculate the number that must be added to the "sum"
  // to make it divisible by "n".
  const remainder = sum % n;
  const checkCodePoint = (n - remainder) % n;
  return characterFromCodePoint(checkCodePoint);
}

function _validateCheckCharacter(input) {
  let factor = 1;
  let sum = 0;
  const n = numberOfValidInputCharacters();

  // Starting from the right, work leftwards
  // Now, the initial "factor" will always be "1"
  // since the last character is the check character.
  for (let i = input.length - 1; i >= 0; i--) {
    const codePoint = codePointFromCharacter(input.charAt(i));
    let addend = factor * codePoint;

    // Alternate the "factor" that each "codePoint" is multiplied by
    factor = factor === 2 ? 1 : 2;

    // Sum the digits of the "addend" as expressed in base "n"
    addend = Math.floor(addend / n) + (addend % n);
    sum += addend;
  }
  const remainder = sum % n;
  return remainder === 0;
}

test("compare with the naive wikipedia version", (t) => {
  //  t.true(validateCheckCharacter('BC8B'));
  t.is(luhn("1"), generateCheckCharacter("1"));
  t.is(luhn("0"), generateCheckCharacter("0"));
  t.is(luhn("0123456789"), generateCheckCharacter("0123456789"));
  t.is(luhn("bcd"), generateCheckCharacter("bcd"));
  t.is(luhn("x_z"), generateCheckCharacter("x_z"));
  t.is(
    generateCheckCharacter("k9999999999"),
    stringify(Number.MAX_SAFE_INTEGER)[0],
  );
  // t.is(stringify(1984),'ke_');
  // t.is(stringify(Number.MAX_SAFE_INTEGER),'uf_______-');
});
