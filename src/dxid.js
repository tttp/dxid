// for checksum peter gumm algo seems to be an option https://www.mathematik.uni-marburg.de/~gumm/Papers/ANewClassOfCheckDigitMethods.pdf ?
// current implementation luhn base37

/*
 When decoding, upper and lower case letters are accepted, and i will
 be treated as 1 and o will be treated as 0. 
 When encoding, only upper case letters are used.


 underscores (_) can be inserted into symbol strings. This can partition a
 string into manageable pieces, improving readability by helping to prevent
 confusion. Hyphens are ignored during decoding. An application may look for
 hyphens to assure symbol string correctness.
*/

// convert to and from base32 inspired by number-to-base32 (MIT)
//const base32Chars = '0123456789abcdefghjkmnpqrstvwxyz'; // croford
//const base32Chars   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // rfc 4648
const base32Chars = "bcdfghjklmnpqrstvwxyz-0123456789"; //lowercase without the most common voyels

// binary to string lookup table
const b2s = base32Chars.split('');

// string to binary lookup table
// 123 == 'z'.charCodeAt(0) + 1
const s2b = new Array(123);
for (let i = 0; i < base32Chars.length; i++) {
  s2b[base32Chars.charCodeAt(i)] = i;
}

export const normalize = (string_dxid) => {
  // remove aeiou ?
  return string_dxid.replaceAll('_', '').toLowerCase();
}

export const luhn32 = (base32url) => {
// ALPHA  DIGIT  "-" / "." / "_" / "~"
// 32=i 33=l 34=o 35=u 36=- 37=_
  let sum = 0;
  let isDouble = true; // Start with the rightmost digit being doubled

  for (let i = base32url.length - 1; i >= 0; i--) {
    const char = base32url.charAt(i);
    const charIndex = base32Chars.indexOf(char);
    if (charIndex === -1) {
      throw new RangeError(`Invalid character: ${char}`);
    }

    let digit = charIndex;

    if (isDouble) {
      digit *= 2;
      if (digit > 31) {
        digit -= 31;
      }
    }

    sum += digit;
    isDouble = !isDouble;
  }

  const luhnDigit = (32 - (sum % 32)) % 32;

  return base32Chars[luhnDigit];
};

// number to base32
export const encode32 = (number) => {
  if (number === 0) {
    return '0';
  }

  let base32String = '';
  while (number > 0) {
    const digit = number % 32;
    base32String = base32Chars[digit] + base32String;
    number = Math.floor(number / 32);
  }

  return base32String;
};

// base32 to number
export const decode32 = (base32) => {
  let number = 0;

  for (let i = 0; i < base32.length; i++) {
    number = number * 32 + s2b[base32.charCodeAt(i)];
  }
  return number;
};

export const stringify = (number, addUnderscore) => {
  if (!Number.isSafeInteger(number)) {
    if (typeof number !== 'number') 
      throw new Error(`The id must be an integer, not a ${typeof number}`);

    throw new RangeError(`The id must be smaller than safe integer <${Number.MAX_SAFE_INTEGER}`);
  }
  if (number < 0) {
    throw new RangeError(`The id must be positive`);
  }
  const payload = encode32 (number);
  const dxid = luhn32(payload) + payload;
  if (addUnderscore !== false && /^\d+$/.test(dxid)) { // dxid looks like a number, let's add an undescore
    const half = dxid.length /2;
    return dxid.slice(0, half) + "_" + dxid.slice(half);
  }
  return dxid;
};

export const parse = (ubase32, throwError) => {
  try {
  const base32=normalize(ubase32);
  const checksum = base32[0];
  const payload = base32.substring(1);

  if (luhn32(payload) !== checksum || base32.length < 2) {
    if (throwError === false) { return false; }
    throw new RangeError('invalid dxid');
  }
  return decode32(payload);
  } catch (e) {
    throw e;
  }
};

export default { luhn32, stringify, parse, encode32, decode32 };
