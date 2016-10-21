import test from 'ava'
import execa from 'execa'
import {sign} from 'jsonwebtoken'
import jwtSecret from './'

const createToken = sign.bind(null, {foo: 'bar'})

test.cb('stream', t => {
  const secret = 'super-secret'
  const token = createToken(secret)
  const stream = jwtSecret(token)

  stream.on('data', data => {
    t.is(data.toString(), secret)
    t.end()
  })

  stream.write('no')
  stream.write('nope')
  stream.write('super-secret')
  stream.write('no-way')
})

test('cli', async t => {
  const secret = 'so-secret'
  const token = createToken(secret)
  const result = await execa.stdout('./cli.js', ['--stdin', token], {
    input: ['one', 'two', secret, 'three', 'four'].join('\n')
  })
  t.regex(result, /so-secret/)
})
