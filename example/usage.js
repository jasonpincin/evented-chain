var chain = require('..')

function double (x, cb) {
    cb(null, x * 2)
}

function square (x, cb) {
    cb(null, x*x)
}

var doubleSquare = chain(double, square)

doubleSquare(2, function (err, result) { console.log('callback got ' + result) })
    .on('step', function (step, args) {
        console.log('step '+step, 'result: ' + args[0])
    })
    .on('complete', function (args) {
        console.log('final value: ' + args[0])
    })
