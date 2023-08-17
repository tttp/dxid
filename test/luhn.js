import test from 'ava';
import { stringify, luhn64 } from '../src/dxid.js';
// from https://en.wikipedia.org/wiki/Luhn_mod_N_algorithm

const codePoints = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
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

function validateCheckCharacter(input) {
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

test('compare with the naive wikipedia version', (t) => {
  t.is(luhn64('A'), generateCheckCharacter('A'));
  t.true(validateCheckCharacter('A', 'A'));
  t.is(luhn64('e_'), generateCheckCharacter('e_'));
  t.is(luhn64('B'), generateCheckCharacter('B'));
  t.is(luhn64('Z'), generateCheckCharacter('Z'));
  t.is(luhn64('a'), generateCheckCharacter('a'));
  t.is(luhn64('z'), generateCheckCharacter('z'));
  t.is(luhn64('-'), generateCheckCharacter('-'));
  t.is(luhn64('_'), generateCheckCharacter('_'));
  t.is(luhn64('f_______-'), generateCheckCharacter('f_______-'));
  t.is(luhn64('f________'), 'K');
  t.is(
    generateCheckCharacter('f_______-'),
    stringify(Number.MAX_SAFE_INTEGER)[0],
  );
  // t.is(stringify(1984),'ke_');
  // t.is(stringify(Number.MAX_SAFE_INTEGER),'uf_______-');
});

export { generateCheckCharacter, validateCheckCharacter };
