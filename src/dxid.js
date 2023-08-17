// for checksum peter gumm algo seems to be an option https://www.mathematik.uni-marburg.de/~gumm/Papers/ANewClassOfCheckDigitMethods.pdf ?
// current implementation luhn base64

// convert to and from base64 inspired by number-to-base64 (MIT)
const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

// binary to string lookup table
const b2s = base64Chars.split('');

// string to binary lookup table
// 123 == 'z'.charCodeAt(0) + 1
const s2b = new Array(123);
for (let i = 0; i < base64Chars.length; i++) {
  s2b[base64Chars.charCodeAt(i)] = i;
}

export const luhn64 = (base64url) => {
  let sum = 0;
  let isDouble = true; // Start with the rightmost digit being doubled

  for (let i = base64url.length - 1; i >= 0; i--) {
    const char = base64url.charAt(i);

    const charIndex = base64Chars.indexOf(char);
    if (charIndex === -1) {
      throw new Error(`Invalid base64 character: ${char}`);
    }

    let digit = charIndex;

    if (isDouble) {
      digit *= 2;
      if (digit > 63) {
        digit -= 63;
      }
    }

    sum += digit;
    isDouble = !isDouble;
  }

  const luhnDigit = (64 - (sum % 64)) % 64;

  return base64Chars[luhnDigit];
};

// number to base64
export const encode64 = (number) => {
  let lo = number >>> 0;
  let hi = (number / 4294967296) >>> 0; // 2^32
  let right = ''; // dealing with numbers > 2^32
  while (hi > 0) {
    right = b2s[0x3f & lo] + right;
    lo >>>= 6;
    lo |= (0x3f & hi) << 26;
    hi >>>= 6;
  }

  let left = '';
  do {
    left = b2s[0x3f & lo] + left;
    lo >>>= 6;
  } while (lo > 0);

  return left + right;
};

// base64 to number
export const decode64 = (base64) => {
  let number = 0;

  for (let i = 0; i < base64.length; i++) {
    number = number * 64 + s2b[base64.charCodeAt(i)];
  }
  return number;
};

export const stringify = (number) => {
  if (number < 1) {
    throw new RangeError('The id must be a positive number');
  }
  if (!Number.isSafeInteger(number)) {
    throw new RangeError(`The id must be smaller than safe integer <${Number.MAX_SAFE_INTEGER}`);
  }
  const payload = encode64 (number - 1);
  return luhn64(payload) + payload;
};

export const parse = (base64, throwError) => {
  const checksum = base64[0];
  const payload = base64.substring(1);

  if (luhn64(payload) !== checksum || base64.length < 2) {
    if (throwError === false) { return false; }
    throw new RangeError('invalid dxid');
  }
  return decode64(payload) + 1;
};

/* module.exports = {
  luhn64,
  stringify,
  parse,
};
*/

//const all = { luhn64, stringify, parse };

export default { luhn64, stringify, parse, encode64, decode64 };

//export {
//  luhn64, stringify, parse,
//};
