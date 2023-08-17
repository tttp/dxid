# 🆔 display primary keys the way humans and developers prefer

In your database, most of the tables have a primary key to give each record a unique number (sequence starting at 1). It's used to establish relationships between tables, enforce data integrity, and optimize query performance. Your computer loves it.

However, when we use that primary key as a (visible) identifier, like your customer number, your account id, your product key... you end up with very long numbers in your documents, apps and urls. Humans and developers don't love it: it's easy to mistype, its length changes every 10 and might break your layout and it makes long and hard to share urls.

To prevent errors, long numbers like credit cards, social insurance numbers, IBANs and many country ID numbers add an extra check digit (the checksum). It catches most typos, but makes a long number even longer.

**dxid** is a _display_ format that is more compact than displaying your id as number while containing a checksum to prevent any errors when as developers we type this id.

for instance (using the cli):

    $npx dxid 1984 -> je_
    $npx dxid 42 -> tp
    $npx dxid 1234567898765432 -> QEYtU9Dph3

It can be displayed where you would display the number, can be used in a url (without needing url encoding) or as as filename (eg. for a cache).

This repository contains an implementation in javascript with no dependency that can be used either as a library or as a cli, and you are encouraged to implement it in your favourite language.

## usage

    import { stringify, parse } from "dxid";
    console.log(stringify(1984)); // ke_
    console.log(parse("je_")); // 1984
    console.log(parse("ej_")); // throw RangeError
    console.log(parse("ej_", false)); // return false (or the id if valid)

as the code base is tiny, you can also import everything

    import dxid from "dxid";
    console.log(dxid.stringify(1984)); // ke_
    console.log(dxid.parse("je_")); // 1984


## implementation

We have used two safe and common algorithms:

- the number is first encoded using [base64url](https://datatracker.ietf.org/doc/html/rfc4648#section-5)
- it's prefixed with a checksum, the [luhn mode 64](https://en.wikipedia.org/wiki/Luhn_mod_N_algorithm) of the encoded id
To keep the dxid short, we only base64 encode the significant bits, it's similar than writing 42 instead of 00000042.

luhn code is what is used on your credit card checksum for instance. It detect all single-digit errors, as well as almost all transpositions of adjacent digits.

We chose to puts the checksum as the first digit (it's more common as the last one) as a way to prevent sequential numbers, for no real reason except to hide a bit the orders of the ids (so lower dxid isn't necessarily older).

## Security

Using dxid instead of a number as the representation of the ID is **not increasing security**. knowing one dxid, it's trivial to find the ids below or above; do not use it thinking it will prevent users to access other records, you should enforce it otherwise (either authentication and ACL or with a cryptographic secure hash).

## Longer rambling on why numbers aren't ideal as IDs.

When you display your id, like:

- student 1984
- invoice 42

As humans, We expects numbers to mean something, to have a unit, to be. As software engineers, we probably all had to explain to a user that the id is not:
- a year
- an amount
- the total number of invoices
- the room number of the student
- the total number of [insert the name of your entity]
- ...

In the US, I've seen the number prefixed with #, but that is not a known convention in Europe, and I had to explain that #42 doesn't mean that it's not 42 usd and it's not a typo that I put # instead of $.

As frontend dev, you probably displayed a screen that worked great with a tiny id (because your dev database is mostly empty), and realised after a few months or years that id 39201737 isn't fitting anymore. 

As backend dev, you might have had to query directly the database with a "select ... where id = 3245082357", or update or delete and hoping you copy pasted the right id. 

As soon as you help me with writing a postgresl or mysql function, you'll be able to where id = dxid_parse ("cDBbAb0") and prevent the stupid mistake that I did 2 days ago and that sent me into the quest that led to dxid.

## word have meaning too, more rambling

Putting together a bunch of letters is likely to end up with existing words in english or another language, and so...

    $npx dxid 82117 -> NUDE
    $npx dxid 191342 -> butt

We can't deal with that in the same way car plate numbers do (we can't ban numbers), but [RFC 3986](http://www.ietf.org/rfc/rfc3986.txt) defines : ALPHA  DIGIT  "-" / "." / "\_" / "~" as safe characters, so in theory, we could ignore . and ~ in the dxid and springle them in the dxid if needed.

Testing a list of profane words (banned by google), we have 27 profane numbers that generate a name in lower, upper or with the first in upper and the rest in lower.

- 78275 PT.HC
- 81989 PU.BE
- 82117 NU.DE
- 124709 fe.ck
- 154542 sl.ut
- 165669 Ko.ck
- 190893 ku.ms
- 191342 bu.tt
- 2142415 DI.LDO
- 3727496 GO.OCH
- 7980710 Fe.cal
- 102269767 FGG.ING
- 449427996 Gay.bob
- 578946733 nig.gas
- 679610536 dog.gin
- 781338792 Fuk.kin
- 7586448069 SHE.MALE
- 8845570323 NIP.PLES
- 28466064094 fag.tard
- 2305021352494 shit-pot
- 2366181661228 Vib.rator
- 2367139776863 Dic.khole
- 2779459544869 coc.ksuck
- 2792207267489 doo.chbag
- 221790693418789 Cyb.erfuck
- 4003199668772947 BOO.OOOOOBS

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

I would love to have someone implementing it as a postgresql or mysql function, that would make it easier to use in pretty much every applications, but any implementation in any language is welcome.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
1. Create your Feature Branch (git checkout -b feature/AmazingFeature)
1. Commit your Changes (git commit -m 'Add some AmazingFeature')
1. Push to the Branch (git push origin feature/AmazingFeature)
1. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## Links

- js/ts implementation [https://github.com/tttp/dxid](https://github.com/tttp/dxid)
- [ your contribution soon ;) ]
