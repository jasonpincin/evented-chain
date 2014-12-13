var test  = require('tape'),
    chain = require('..')
require('./polyfills')

test('chain.to', function (t) {
    t.equal(typeof chain.to, 'function', 'is a function')
    t.end()
})

test('chain.to executed without error', function (t) {
    chain.to(chain(), function (err, data) {
        t.notOk(err, 'provides no err to cb')
        t.equal(data, 'hi', 'provides data to cb')
    })(null, 'hi')

    t.end()
})

test('chain.to executed with error', function (t) {
    chain.to(chain(), function (err, data) {
        t.ok(err, 'provides err to cb')
        t.equal(data, 'hi', 'provides data to cb')
    })(new Error('boom'), 'hi')

    t.end()
})
