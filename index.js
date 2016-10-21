const jwt = require('jsonwebtoken')
const jwa = require('jwa')
const through = require('through2')

module.exports = token => {
  const decoded = jwt.decode(token, {complete: true})
  const content = token.replace(/\.[^.]+$/, '')
  const sign = jwa(decoded.header.alg).sign

  return through(function (chunk, encoding, callback) {
    const signature = sign(content, chunk)
    if (signature === decoded.signature) {
      this.push(chunk)
      this.push(null)
    }

    callback()
  })
}
