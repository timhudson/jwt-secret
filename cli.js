#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const meow = require('meow')
const ora = require('ora')
const numeral = require('numeral')
const logUpdate = require('log-update')
const isValid = require('jws').isValid
const through = require('through2')
const split = require('binary-split')
const jwtSecret = require('./')

const cli = meow(`
  Usage
    $ jwt-secret <token>

    --file   Read secrets from file path
    --stdin  Read secrets from stdin

  Examples
    $ jwt-secret --file ./passwords.txt eyJhbGciOiJIUzI1...
    $ curl -sL https://git.io/vP5n1 | jwt-secret --stdin eyJhbGciOiJIUzI1...
`, {
  boolean: ['stdin']
})

const opts = cli.flags
const token = cli.input[0]
let input

if (opts.stdin) {
  input = process.stdin
} else if (opts.file) {
  input = fs.createReadStream(path.resolve(opts.file))
}

if (!token || !input) {
  console.log(cli.help)
  process.exit(1)
}

if (!isValid(token)) {
  const message = chalk.red('Invalid JWT.') + chalk.dim(' It should look something like:')
  const exampleToken = chalk.dim('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ')
  logUpdate(`\n\n    ${message}\n    ${exampleToken}`)
  process.exit()
}

const data = {
  attempts: 0,
  secret: null
}
const spinner = ora()
const getAttempts = () => chalk.cyan(numeral(data.attempts).format('0,0')) + ' ' + chalk.dim('secrets checked') + '\n\n'

function exit() {
  let output

  if (data.secret) {
    output = chalk.dim('secret found: ') + chalk.bold(data.secret)
  } else {
    output = chalk.dim('no secret found')
  }

  logUpdate(`\n\n    ${output}\n\n`)
  process.exit()
}

setInterval(() => {
  const pre = `\n\n  ${chalk.gray.dim(spinner.frame())}`
  logUpdate(pre + getAttempts())
}, 50)

input
  .pipe(split())
  .pipe(through((chunk, enc, callback) => {
    data.attempts++
    callback(null, chunk)
  }))
  .pipe(jwtSecret(token))
  .on('data', secret => {
    data.secret = secret
    exit()
  })
  .on('finish', exit)
