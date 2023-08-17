# 🆔 display primary keys the way humans and developers prefer

In your database, most of the tables have a primary key to give each record a unique number (sequence starting at 1). It's used to establish relationships between tables, enforce data integrity, and optimize query performance. Your computer loves it.

However, when we use that primary key as a (visible) identifier, like your customer number, your account id, your product key... on base 10 (the normal way to write numbers) we end up with very long numbers in your documents, apps and urls. Humans and developers don't love it: it's easy to mistype, its length changes every 10 and might break your layout and it makes long and hard to share urls.

To prevent errors, long numbers like credit cards, social insurance numbers, IBANs and many country ID numbers add an extra check digit (the checksum). It catches most typos, but makes a long number even longer.

**dxid** is a _display_ format that is more compact than displaying your id as number while containing a checksum to prevent any errors when as developers we type this id.

for instance (using the cli):

    $npx dxid 1984 -> bc8b
    $npx dxid 1234567898765432 -> 2cfd4z8v7jf2

It can be displayed where you would display the number, can be used in a url (without needing url encoding) or as as filename (eg. for a cache).

This repository contains an implementation in javascript with no dependency that can be used either as a library or as a cli, and you are encouraged to implement it in your favourite language.

## usage

    import { stringify, parse } from "dxid";
    console.log(stringify(1984)); // bc8b
    console.log(parse("bc8b")); // 1984
    console.log(parse("cb8b")); // throw RangeError
    console.log(parse("cb8b", false)); // return false (or the id if valid)

as the code base is tiny, you can also import everything

    import dxid from "dxid";
    console.log(stringify(1984)); // bc8b
    console.log(parse("bc8b")); // 1984


## implementation

We have used two safe and common algorithms:

- the number is first encoded using base32
- it's prefixed with a checksum, the [luhn mode 32](https://en.wikipedia.org/wiki/Luhn_mod_N_algorithm) of the encoded id

and a few tricks
- a dxid is always url safe, you can use it in your urls or query param directly.
- to remove risks of generating a dxid that looks like a word, we removed the most common voyels (aeiou). the base 32 chars used are *bcdfghjklmnpqrstvwxyz-0123456789_*
- to prevent that a dxid looks like an id, stringify automatically adds an underscore in the middle if the dxid contains only digits (it's the only tie it uses underscore).
- To keep the dxid short, we only base32 encode the significant bits, it's similar than writing 42 instead of 00000042
- to make it easier to write long names, you can put "\_" as a separator anywhere and it is ignored when parsing
- to make it easier to type, dxid is case insensitive, but always generated as lowercase

The luhn code is what is used on your credit card checksum for instance. It detect all single-digit errors, as well as almost all transpositions of adjacent digits.

We chose to puts the checksum as the first digit (it's more common as the last one), so if you use it to generate filenames, it's going to be better distributed and as a way to prevent sequential numbers, for no real reason except to hide a bit the orders of the ids (so lower dxid isn't necessarily older).

dxid length:
- 3 up to id 1023
- 4 up to id 32'767
- 5 up to id 1'048'575
- max 12 (if you are encoding the id as number in javascript, up to nine quadrillion ids)
- there are 97 dxid that are 1 char longer than the id they represent.

## Security and pitfalls

Using dxid instead of a number as the representation of the ID is **not increasing security**. knowing one dxid, it's trivial to find the ids below or above; do not use it thinking it will prevent users to access other records, you should enforce it otherwise (either authentication and ACL or with a cryptographic secure hash).

it might be unexpected that some dxid do look like a number, either positive: _700,501,302,103_ negatives: _-04,-23,-42_ or hex: _0xcd,0xfc,0x01_.

These are 10 "ambigous" in the first 1k: _103 122 141 160 212 231 250 302 321 340_ that could either be an id or an dxid. There are 3265 in the first 10 million.

To prevent that, we add an undescore to any dxid that could be ambigous:



If you want to use the cli to parse or generate automatically dxid(s), put explicitely the command you want:

    $npx dxid parse 321 -> 791
    $npx dxid stringify 321 -> znc

otherwise it exits in error:

    $npx dxid 321 
    321 can be either an id or a dxid
    321 ->id 791
    321 ->dxid znc


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

Another issue with ids as base 10 is when you use is with a spreadsheet, that might very kindly format it, create a total and whatever it can think of to mess up your list.

so base 10 is well known, but it produces strings that are very long and might be confusing, because a primary key isn't a number that you are supposed to sum, multiply or any other math.
 
### ...words have meaning too

Putting together a bunch of letters is likely to end up with existing words. To prevent that, we removed most voyels from our base of acceptable digits.

We kept "\_" as a char you can put anywhere in the dxid to make it easier to read/type: they are ignored while converting dxid to a number and you can springle them in the dxid if you want to. 

Testing a list of profane words (banned by google), we have 0 profane numbers.

using a [list with 28 languages](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words), we still have 0.

When removing &, replacing space by "-" or "\_" and doing common substibutions i->1 e->3 o->0, we finally managed to generate 24 words in that list: _sm l0rt d1ck s3x0 p0p3l k1nky b1tch 1ng010 3r0t1c p0kk3r f1g0n3 schl0ng t0pl3ss r1mm1ng p3nd3j0 bl0w-j0b 0pr0tt3n kyrv1tys b0ll0cks sch13ss3r m1nch10n3 gr3pp3ld3l h0w-t0-k1ll l13fd3sgr0_

I'd say that finding [k1nky](https://www.merriam-webster.com/dictionary/k1nky) offensive is [b0ll0cks](https://www.merriam-webster.com/dictionary/bollocks), but you can always write 769061 as b1t_ch and 23899866350 as b0ll_0cks if you prefer.

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

## License and credit

The first (unreleased) version of dxid used base64url, that made the ids a bit smaller (10 instead of 12 digits) but created a lot of words in the banned list, so we switched to base32, but instead of using [RFC 4648](https://datatracker.ietf.org/doc/html/rfc4648) we used an alphabet without any voyel.

[Douglas Crockford used base 32 in a 2019 proposal](https://www.crockford.com/base32.html), with 4 changes that we think improved his work: we make it almost impossible that dxid is a english word (or any language), less chars/symbols (he uses 37 we use 32), a checksum that catches more permutations (luhn instead of modulo) and a less linear sequence of dxids.

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## Links

- js/ts implementation [https://github.com/tttp/dxid](https://github.com/tttp/dxid)
- [ your contribution soon ;) ]
