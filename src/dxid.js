// for checksum peter gumm algo seems to be an option https://www.mathematik.uni-marburg.de/~gumm/Papers/ANewClassOfCheckDigitMethods.pdf ?
// current implementation luhn base37

/*
 encode a value with the encoding defined by _Douglas_ _Crockford_ in
 <http://www.crockford.com/wrmg/base32.html>

 this is *not* the same as the Base32 encoding defined in RFC 4328

 The Base32 symbol set is a superset of the Base16 symbol set.

 We chose a symbol set of 10 digits and 22 letters. We exclude 4 of the 26
 letters: I L O U.

 Excluded Letters

 I:: Can be confused with 1
 L:: Can be confused with 1
 O:: Can be confused with 0
 U:: Accidental obscenity

 When decoding, upper and lower case letters are accepted, and i and l will
 be treated as 1 and o will be treated as 0. When encoding, only upper case
 letters are used.

 If the bit-length of the number to be encoded is not a multiple of 5 bits,
 then zero-extend the number to make its bit-length a multiple of 5.

 Hyphens (-) can be inserted into symbol strings. This can partition a
 string into manageable pieces, improving readability by helping to prevent
 confusion. Hyphens are ignored during decoding. An application may look for
 hyphens to assure symbol string correctness.
*/

// convert to and from base32 inspired by number-to-base32 (MIT)
const base32Chars = '0123456789abcdefghjkmnpqrstvwxyz'
const alias = { o:0, i:1, l:1, s:5 }
const profane = [10634,10901,11021,344746,367080936657550];

// binary to string lookup table
const b2s = base32Chars.split('');

// string to binary lookup table
// 123 == 'z'.charCodeAt(0) + 1
const s2b = new Array(123);
for (let i = 0; i < base32Chars.length; i++) {
  s2b[base32Chars.charCodeAt(i)] = i;
}

export const normalize = (str) => {
  str = str.replace(new RegExp('-|_', 'g'), '').toLowerCase();
  for (const x in alias) {
    str = str.replace(new RegExp(x, 'g'), alias[x]);
  }
  return str;
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
      throw new Error(`Invalid base32 character: ${char}`);
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

export const stringify = (number) => {
  if (!Number.isSafeInteger(number)) {
    throw new RangeError(`The id must be smaller than safe integer <${Number.MAX_SAFE_INTEGER}`);
  }
  const payload = encode32 (number);
  return luhn32(payload) + payload;
};

export const parse = (ubase32, throwError) => {
  const base32=normalize(ubase32);
  const checksum = base32[0];
  const payload = base32.substring(1);

  if (luhn32(payload) !== checksum || base32.length < 2) {
    if (throwError === false) { return false; }
    throw new RangeError('invalid dxid');
  }
  return decode32(payload);
};

/* module.exports = {
  luhn32,
  stringify,
  parse,
};
*/

//const all = { luhn32, stringify, parse };

export default { luhn32, stringify, parse, encode32, decode32 };

//export {
//  luhn32, stringify, parse,
//};
