var EventEmitter = require('events').EventEmitter,
    setImmediate = setImmediate || process.nextTick

function chain () {
    function run () {
        var args     = Array.prototype.slice.call(arguments, 0),
            cb       = typeof args[args.length - 1] === 'function' ? args.pop() : function () {},
            progress = new EventEmitter,
            step     = 0

        function done (err) {
            var args = Array.prototype.slice.call(arguments, 1)
            if (err) {
                progress.emit('fail', step, err, args)
                return cb(err)
            }
            progress.emit('step', step, args)
            if (++step >= run.steps.length) {
                progress.emit('complete', args)
                return cb.apply(undefined, [null].concat(args))
            }
            run.steps[step].apply(undefined, args.concat([done]))
        }
        if (run.steps.length) setImmediate(function () {
            run.steps[step].apply(undefined, args.concat([done]))
        })
        else setImmediate(function () {
            progress.emit('complete', args)
            cb.apply(undefined, [null].concat(args))
        })
        return progress
    }
    run.steps = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments, 0)
    return run
}
chain.to = function (fn, cb) {
    return function chainTo (err) {
        var args = Array.prototype.slice.call(arguments, 1)
        if (err) return cb.apply(undefined, [err].concat(args))
        fn.apply(undefined, args.concat([cb]))
    }
}
module.exports = chain
