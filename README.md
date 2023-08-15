# dxid A better and safer way to display your primary keys in urls or to the users

In a relational database, the "ID column" is used to uniquely identify each row in a table. This column is often referred to as a primary key column and it's used to establish relationships between tables, enforce data integrity, and optimize query performance. 

dxid is a display format that is usually more compact and includes a checksum to prevent any errors when as developers we type it.

for instance (using the cli):

    $npx xdid 1984 -> ke_
    $npx xdid 42 -> Xp

it is filename and url safe so you can use it either to display to the end user, in a url or as as filename (eg cache).

This repository contains an implementation in javascript with no dependency that can be used either as a library or as a cli, and you are encouraged to implement it on your favourite language.

## usage

## problems we are trying to solve

ids are machine-friendly, but they have some issues when used in an url or as a reference and become exposed to users, like

- student 1984
- invoice 42

### Numbers without meanings

As humans, We expects numbers to mean something, to have a unit and some meaning. As software engineers, we probably all had to explain to a user that the id is not:
- a year
- an amount
- the total number of invoices
- the room number of the student
- the total number of [insert the name of your entity]
- ...

but that it's just a meaningless number to identify a unique object.

In the US, I've seen the number prefixed with #, but that is not a known convention in Europe, and I had to explain that #42 doesn't mean that it's not 42 usd and it's not a typo that I put # instead of $.

### easy to make mistakes

As soon as the id becomes a slightly big and that we need to type it, we are going to make mistake. it's the reason a credit card number has a checksum to prevent typos.

dxid includes a checksum too, but because each character contains more information (64 instead of 10 for a number), we usually end up with the same length or shorter.

## implementation details

We have used two safe and common algorithms:

- the number is encoded using base64url (so xdid can be used without encoding in your url)
- it's prefixed with a checksum, the [luhn mode 64](https://en.wikipedia.org/wiki/Luhn_mod_N_algorithm) of the encoded id

luhn code is what is used on your credit card checksum for instance. It detect all single-digit errors, as well as almost all transpositions of adjacent digits, and is very simple to implement.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

I would love to have someone implementing it as a postgresql or mysql function, that would make it easier to use in pretty much all applications, but any implementation in any language is welcome.

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
