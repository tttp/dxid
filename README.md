# 🆔 display primary keys the way humans and developers prefer

In your database, most of the tables have a primary key to give each record a unique id (sequence starting at 1). It's used to establish relationships between tables, enforce data integrity, and optimize query performance. Your computer loves it.

However, when we use this primary key as a (visible) identifier, eg. a customer number, an account id or product key... and encode it on base 10 (the normal way to write numbers), we end up with very long numbers in your pages, apps and urls. Humans and developers don't love it: it's prone to mistyping, it length changes every 10 and might break your layout and it makes urls long and hard to share.

To prevent errors, long numbers like credit cards, IBANs and many country ID numbers add an extra check digit (the checksum). It catches most typos, but makes a long number even longer.

**dxid** _/dik.sid/_ is a format to _display and communicate_ ids that is more compact than base 10 while containing a checksum to prevent any errors.

for instance (using the cli):

    $npx dxid 1984 -> bc8b
    $npx dxid 1234567898765432 -> 2cfd4z8v7jf2

It can be displayed instead of the number, can be used in a url (without needing url encoding) or as as filename (eg. for a cache). Of course, you shouldn't change how your key is stored in your db.

This repository contains an implementation in javascript with no dependency that can be used either as a library or as a cli, and you are encouraged to implement it in your favourite language.

## usage
add it to your project

    $npm install dxid

and use it to stringify or parse

    import { stringify, parse } from "dxid";
    // const { stringify, parse } = require('dxid'); // if cjs on node
    console.log(stringify(1984)); // bc8b
    console.log(parse("bc8b")); // 1984
    console.log(parse("cb8b")); // throw RangeError
    console.log(parse("cb8b", false)); // return false (or the id if valid)

as the code base is tiny, you can also import everything

    import dxid from "dxid";
    // const dxid = require('dxid'); // if cjs on node
    console.log(dxid.stringify(1984)); // bc8b
    console.log(dxid.parse("bc8b")); // 1984

If you want to maintain compatibility, you might need to handle ids that are either dxid (new) and parse or base10 ids (legacy) and simply do a string to number conversion, a convenience function "id" can be used

    import dxid from "dxid";
    console.log(dxid.id("bc8b")); // 1984
    console.log(dxid.id("1984")); // 1984

## implementation

We have used two safe and common algorithms:

- the number is first encoded using base32
- it's prefixed with a checksum, the [luhn mode 32](https://en.wikipedia.org/wiki/Luhn_mod_N_algorithm) of the encoded id

and a few tricks
- a dxid is always url safe, you can use it in your urls directly.
- to remove risks of generating a dxid that looks like a word, we removed the most common voyels (aeiou). the base 32 chars used are *bcdfghjklmnpqrstvwxyz_0123456789* with *-* as a separator.
- to prevent that a dxid looks like an id, stringify automatically adds a hyphen in the middle if the dxid is only digits (it's the only case it generates an hyphen).
- To keep the dxid short, we only base32 encode the significant bits, it's similar than writing 42 instead of 00000042
- to make it easier to write long names, you can put "-" as a separator anywhere and it is ignored when parsing
- to make it easier to type, dxid is case insensitive, but always generated as lowercase

The luhn code is what is used on your credit card checksum for instance. It detect all single-digit errors, as well as almost all transpositions of adjacent digits.

We chose to puts the checksum as the first digit (it's more common as the last one), so if you use it to generate filenames, it's going to be better distributed and as a way to prevent sequential numbers, for no real reason except to hide a bit the orders of the ids (so lower dxid isn't necessarily older).

dxid length:
- 3 up to id 1023
- 4 up to id 32'767
- 5 up to id 1'048'575
- max 12 (if you are encoding the id as number in javascript, up to nine quadrillion ids)
- there are 97 dxid that are 1 char longer than the id they represent, the rest is similar or smaller

## Security and pitfalls

Using dxid instead of a number as the representation of the ID is **not increasing security**. knowing one dxid, it's trivial to find the ids below or above; do not use it thinking it will prevent users to access other records, you should enforce it otherwise (either authentication and ACL or with a cryptographic secure hash).

it might be unexpected that some dxid do look like a number, either positive: _700,501,302,321, 103_ 

To prevent that, we add an undescore to any dxid that could be ambigous.
    $npx dxid parse 791 -> 3-21

These are 10 "ambigous" in the first 1k: _1-03 1-22 1-41 1-60 2-12 2-31 2-50 3-02 3-21 3-40_ that could either be an id or an dxidwithout -. There are 3265 in the first 10 million.

Any dxid generated by the library will never look like an id (never base 10), however, if you want to use the cli to parse or generate automatically dxid(s), put explicitely the command you want:

    $npx dxid parse 321 -> 791
    $npx dxid stringify 321 -> znc

otherwise it does assume that only digit is an id and will return the dxid

    $npx dxid 321 -> znc
    $npx dxid 3-21 -> 791
    $npx dxid 791 -> 3-21


## Rambling (and the itch dxid scratches) 
### ...on why numbers aren't ideal as IDs

When you display your id in base 10, like

- student 1984
- invoice 42

As humans, We expects numbers to mean something, to have a unit, to tell a story. As software engineers, we probably all had to explain to a user that the id is not:
- a year
- an amount
- the total number of invoices
- the room number of the student
- the total number of [insert the name of your entity]
- ...

In the US, I've seen ids prefixed with #, but that is not a used convention in Europe... I had to explain that #42 doesn't mean that it's $42 and no, # instead of $ isn't a typo.

Another issue with ids as base 10 is when you use is with a spreadsheet, it might very kindly format them, sum them, add a total and whatever it can think of to mess up your list.

so base 10 is well known, but it produces strings that are very long and might be confusing, because a primary key isn't a number that you are supposed to sum, multiply or any other math.
 
### ...words have meaning too

Putting together a bunch of letters is likely to end up with existing words. To prevent that, we removed most voyels from our base of acceptable digits.

We kept "-" as a char you can put anywhere in the dxid to make it easier to read/type: they are ignored while converting dxid to a number and you can springle them in the dxid if you want to. 

using a [list with 28 languages](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words), we have 448 words that contains only letters and numbers from our base32 (replacing space by \_). None of these are a dxid.

If we try all the common substitutions (eg i replaced by 1, e->3 o->0), there are 24 "words" that are dxid:  _l0rt d1ck s3x0 p0p3l k1nky b1tch 1ng010 3r0t1c p0kk3r f1g0n3 schl0ng t0pl3ss r1mm1ng p3nd3j0 bl0w\_j0b 0pr0tt3n kyrv1tys d0gstyl3 b0ll0cks sch13ss3r m1nch10n3 gr3pp3ld3l h0w\_t0\_k1ll l13fd3sgr0t_

I'd say that finding [k1nky](https://www.merriam-webster.com/dictionary/kinky) offensive is [b0ll0cks](https://www.merriam-webster.com/dictionary/bollocks), but you can always write 769061 as b1t-ch and 23899866350 as b0ll-0cks if you prefer.

## html display tip

to make it easier for users to copy the full id, you can add a user-select: all property to the dom element containing the id, eg:

    .dxid { user-select: all }


## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

I would love to have someone implementing it as a postgresql or mysql function, that would make it easier to use in pretty much every applications, but any implementation in any language is welcome.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
1. Create your Feature Branch (git checkout -b feature/AmazingFeature)
1. Commit your Changes (git commit -m 'Add some AmazingFeature')
1. Test -and write new if needed-  (npm test)
1. Push to the Branch (git push origin feature/AmazingFeature)
1. Open a Pull Request

## Prior art, inspirations and license

The first (unreleased) version of dxid used base64url, that made the ids a bit smaller (10 instead of 12 digits) but created a lot of words in the banned list, so we switched to base32, but instead of using [RFC 4648](https://datatracker.ietf.org/doc/html/rfc4648) we used an alphabet without any voyel.

[Douglas Crockford used base 32 in a 2019 proposal](https://www.crockford.com/base32.html), we made 4 changes: it's almost impossible a dxid is a english (or any language) word, less chars/symbols (he uses 37 on the checksum, we keep 32), a checksum that catches more transpositions (luhn instead of mod 37) and a less linear sequence of dxids.

[Bech32](https://en.bitcoin.it/wiki/Bech32) has an alphabet that is scrambling the symbols _qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4_, for simplicity sake, we didn't go that path.

[Geohash](https://en.wikipedia.org/wiki/Geohash) is using a base32 for geo coordinate (lat long).

[ulid](https://github.com/ulid/spec), if you want a better UUID.

There are slightly better checksum than luhn, for instance [Gumm](https://www.mathematik.uni-marburg.de/~gumm/Papers/ANewClassOfCheckDigitMethods.pdf) that catch all transpositions, but less common/more complex.

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## Links

- js/ts implementation [https://github.com/tttp/dxid](https://github.com/tttp/dxid)
- [ your contribution soon ;) ]
