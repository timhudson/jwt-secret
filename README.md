# jwt-secret [![Build Status](https://travis-ci.org/timhudson/jwt-secret.svg?branch=master)](https://travis-ci.org/timhudson/jwt-secret)

> Bruteforce a JWT against a list of passwords

![](screenshot.gif)

## Install

Ensure you have [Node.js](https://nodejs.org) version 4+ installed. Then run the following:

```
$ npm install --global jwt-secret
```

## Usage

```
$ jwt-secret --help

  Usage
    $ jwt-secret <token>

    --file   Read secrets from file path
    --stdin  Read secrets from stdin

  Examples
    $ jwt-secret --file ./passwords.txt eyJhbGciOiJIUzI1...
    $ curl -sL https://git.io/vP5n1 | jwt-secret --stdin eyJhbGciOiJIUzI1...
```


## License

MIT © Tim Hudson
