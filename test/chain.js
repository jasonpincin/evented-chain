var test  = require('tape'),
    chain = require('..')
require('./polyfills')

test('chain', function (t) {
    t.equal(typeof chain, 'function', 'chain is a function')

    test('with no error', function (t) {
        chain(good10, good0, good10)('hi', function (err, msg) {
            t.equal(err, null, 'completes with no error')
            t.equal(msg, 'hi', 'completes with proper msg')
            t.end()
        })
    })

    test('with array', function (t) {
        chain([good10, good0, good10])('hi', function (err, msg) {
            t.equal(err, null, 'completes with no error')
            t.equal(msg, 'hi', 'completes with proper msg')
            t.end()
        })
    })

    test('with single func', function (t) {
        chain([good10])('hi', function (err, msg) {
            t.equal(err, null, 'completes with no error')
            t.equal(msg, 'hi', 'completes with proper msg')
            t.end()
        })
    })

    test('with no func', function (t) {
        chain()('hi', function (err, msg) {
            t.equal(err, null, 'completes with no error')
            t.equal(msg, 'hi', 'completes with proper msg')
            t.end()
        })
    })

    test('with no functions and no cb', function (t) {
        t.plan(1)
        chain()('hi').on('complete', function (args) {
            t.deepEqual(args, ['hi'], 'emits complete with proper args')
        })
    })

    test('with functions and no cb', function (t) {
        t.plan(5)
        var step = 0
        chain(good10, good10)('hi')
            .on('step', function (step, args) {
                t.equal(step, step++, 'emits step with proper index')
                t.deepEqual(args, ['hi'], 'emits step with proper args')
            })
            .on('complete', function (args) {
                t.deepEqual(args, ['hi'], 'emits complete with proper args')
            })
    })

    test('with error', function (t) {
        t.plan(5)
        chain(good10, bad10, good10)('hi', function (err, msg) {
            t.ok(err, 'executes cb with err')
            t.notOk(msg, 'does not include data')
        }).on('fail', function (step, err, args) {
            t.equal(step, 1, 'emits fail at step 1')
            t.equal(err.message, 'boom', 'emits fail with expected error object')
            t.deepEqual(args, ['hi'], 'emits fail with proper args')
        })
    })

    t.end()
})

function good10 (data, cb) {
    setTimeout(cb.bind(undefined, null, data), 10)
}
function good0 (data, cb) {
    cb(null, data)
}
function bad10 (data, cb) {
    setTimeout(cb.bind(undefined, new Error('boom'), data), 10)
}
