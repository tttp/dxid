import words from "naughty-words";
import { luhn32 as luhn, parse,stringify } from "./src/dxid.js";

const profaneID = new Set();
const extrabw = ["damn","tard"];


const readable = word => {
  const check = (part,checksum) => {
    const cs = luhn(part);
console.log(cs,part);
    if (cs === checksum)
      profaneID.add(parse(cs+part));
  }

  const upper = word[0].toUpperCase();
  const lower = word[0].toLowerCase();
  const input = word.substring(1);//.toUpperCase();
  check (input,lower);
  check (input,upper);
  check (input,upper);
}

const permute = word => {
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
      profaneID.add(parse(cs+part));
    }
  }
};

(async () => {
//  console.log(words);
  let allWords = extrabw;
  Object.values(words).forEach ( d => allWords = [].concat(allWords,d));
   
//  const allWords = [].concat(words.en,extrabw);
  let bw = [];
  for (let i = 0; i <= 12; i++) {
    bw[i] = [];
  }
  allWords.forEach((word) => {
    const d = word.trim().replaceAll(' ','-');
    const length = d.length;
    if (length > 12) return; //dcid max 12
    bw[length].push(d.toUpperCase());
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
    })
  }

  console.log(profaneID.size, "profane words found");
  [...(profaneID)].sort((a,b) => a-b).forEach (id => {
        console.log(id,stringify(id));
    try { 
    } catch (e) {}
  });
  
  //console.log(bw);
  //console.log(allWords);
})();
