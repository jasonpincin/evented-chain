# evented-chain

Chain async callbacks together; monitor progress with events

## example

```
var chain = require('evented-chain')

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
```

## api

```
var chain = require('evented-chain')
```

### fn = chain(fn1, fn2, fn3, ...)

`chain` returns a function (fn), that when called will execute the chained functions (fn1, fn2, ...) in a waterfall 
manner, where the result of previous functions are fed as arguments to the next function, until all functions have 
executed. Each function in the chain (fn1, fn2, etc) must accept an error-first style callback as it's last argument, and 
supply it's result to that callback. 

Once the chain has completed executing, the final result will be passed to the (optional) callback provided to the 
generated function, fn. 

If an error is passed to any callback, the final callback (fn) will be executed with the error immediately.

### fn = chain([fn1, fn2, fn3, ...])

Same as above, but chain functions may be supplied to `chain` in an array instead of as arguments.

### events

```
var progress = fn()
```

When the generated function is executed, an event emitter is returned. This emitter can be listened to for insight into 
the progress of the chain. Events emitted are:

* `step` - For each chain function execited succesfully, this event is emitted with `step`, and `args` where `step` is the 
index of the function executed, and `args` is an array of arguments passed to that function.
* `fail` - Emitted when a function executes it's callback with an error. This event is emitetd with `step`, `err`, and `args` 
where `err` contains the error passed to the callback, and `args` contains any other args passed.
* `complete` - Emitted once the chain has finished executing. This event is emitted with `args` which contains an array 
of arguments passed to the final callback, minus the first (non-existant error) argument.

## testing

`npm test [--dot | --spec] [--coverage]`

### options

* `--dot` - output test results as dots instead of tap
* `--spec` - output test results as spec instead of tap
* `--coverage` - display text cover report
* `--testling` - run tests in browser via testling 
  

### patterns

Only run test files matching a certain pattern by prefixing the 
test command with `grep=pattern`. Example:

```
grep=connect npm test --dot
```

### html coverage report

Open it with `npm run view-cover` or `npm run vc`
