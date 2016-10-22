const jws = require('jws')
const jwa = require('jwa')
const through = require('through2')

module.exports = token => {
  const decoded = jws.decode(token)

  if (!decoded) {
    throw new Error('Invalid token')
  }

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
