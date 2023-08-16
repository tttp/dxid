# 🆔 A better and safer way to display your primary keys in urls or to the users

In your database, probably most of the tables have a primary key to give a unique number to each record and used to establish relationships between tables, enforce data integrity, and optimize query performance. Your computer loves it.

However, when we use that primary key as a (visible) identifier, like your customer number, your account id, your product key, your invoice number, your letter reference... and you end up with very long numbers in your document, app and url. Humans and developers don't love it: it's easy to mistype, its length changes every 10 and might break your layout, it makes long urls.

To prevent errors, long numbers like credit cards, social insurancea and security numbers, IBANs and many country ID numbers add an extra check digit (the checksum). It catches most typos, but makes a long number even longer.

**dxid** is a _display_ format that is more compact than displaying your id as number while containing a checksum to prevent any errors when as developers we type this id.

for instance (using the cli):

    $npx dxid 1984 -> je_
    $npx dxid 42 -> tp
    $npx dxid 1234567898765432 -> QEYtU9Dph3

It can be displayed where you would display the number, can be used in a url (without needing url encoding) or as as filename (eg. for a cache).

This repository contains an implementation in javascript with no dependency that can be used either as a library or as a cli, and you are encouraged to implement it in your favourite language.

## usage

    const { stringify, parse } = require("dxid");
    console.log(stringify(1984)); // ke_
    console.log(parse("je_")); // 1984
    console.log(parse("jk_")); // throw RangeError
    console.log(parse("jk_", false)); // return false (or the id if valid)

## implementation details

We have used two safe and common algorithms:

- the number is first encoded using [base64url](https://datatracker.ietf.org/doc/html/rfc4648#section-5)
- it's prefixed with a checksum, the [luhn mode 64](https://en.wikipedia.org/wiki/Luhn_mod_N_algorithm) of the encoded id
To keep the dxid short, we only base64 encode the significant bits, it's similar than writing 42 instead of 00000042.

luhn code is what is used on your credit card checksum for instance. It detect all single-digit errors, as well as almost all transpositions of adjacent digits, and is very simple to implement.

We chose to puts the checksum as the first digit (it's more common as the last one) as a way to prevent (mostly) sequential numbers, for no real reason except to prevent giving any too visible order to the ids (so a lower dxid isn't necessarily older).

## Pitfalls

This isn't a security measure, knowing one dxid, it's trivial to find the ids below or above, do not use it thinking it will prevent users to access other records, you should enforce it otherwise (either authentication an ACL or with a cryptographic secure hash).

## Longer rambling on why numbers aren't ideal as ids.

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
