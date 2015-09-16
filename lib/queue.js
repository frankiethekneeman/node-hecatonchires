var FileManager = require('./fileManager')
    , LinkedList = require('linkedlist')
    , util = require('util')
    , lastWrite = 0
    , estimate = 0
    /**
     *  Half of the range the weight needs to cover.  Since the weight goes
     *  from 0 to 1, this is always 0.5.  This should only change if the
     *  weight gets pegged at 1.
     */
    , weightAmplitude = .5//Never change this

    /**
     *  A measure of how far right to shift the curve.  Should roughly equal
     *  the time after which no responses drops the weight to .5.
     */
    , weightRshift = 10000

    /**
     *  A measure of how smooth the transition is. This is closely related to the Rshift.
     *  Please don't change this without using Wolfram Alpha to check its effect:
     *
     *  https://www.wolframalpha.com/input/?i=plot+-%28x-10000%29*.5%2F%285000%2Babs%28x-10000%29%29+%2B.5%2C+x%3D0..100000%2C+y%3D0..1
     */
    , weightTransitionSmoother = 5000
    , delayCutoffs = {
        'INFO': 10
        , 'WARNING': 100
        , 'ERROR': 1000
        , 'CRITICAL ERROR': 10000
    }
    , neverDrop = process.env.HECATONCHIRES_NEVER_DROP
    ;
if (neverDrop && (neverDrop.toLowerCase() === 'false' || +neverDrop === 0)) {
    neverDrop = false;
}

neverDrop = !!neverDrop; //coerceTo Boolean

function shouldWrite(entry) {
    if (neverDrop) return true;
    estimateWriteDelay(entry.entered.getTime());
    return estimate <= (delayCutoffs[entry.level] || 1);
}

function estimateWriteDelay(entered) {
    var now = new Date().getTime();
    var weight = calculateWeight(now);
    estimate = estimate * weight + ((1 - weight) * (now - entered))
}

function calculateWeight(time) {
    var x = time - lastWrite
       
    return (-(x - weightRshift) * weightAmplitude)
    /  //------------------------------------------------------------------------------------------------
        (weightTransitionSmoother + Math.abs(x - weightRshift))

        + weightAmplitude;
}

function Queue(filename) {
    this.filename = filename;
    this.fileManager = new FileManager(filename);
    this.waitingEntries = new LinkedList();
};

Queue.prototype = {
    enqueue: function(id, level, message) {
        message = message + ""; // Convert to string.
        var pieces = message.split(/[\r\n]+/);
        for (var i = 0; i < pieces.length; i++) {
            this.waitingEntries.push( {
                message: pieces[i]
                , entered: new Date()
                , id: id
                , level: level
            })
        }
    }
    , consume: function(callback) {
        if (this.waitingEntries.length === 0) {
            process.nextTick(callback);
         } else {
            var toWrite = this.waitingEntries.shift();
            if (shouldWrite(toWrite)) {
                this.fileManager.writeLine(
                    util.format("%s %s %s %s", toWrite.entered.toISOString(), toWrite.id, toWrite.level, toWrite.message)
                    , callback
                );
            } else {
                process.nextTick(callback);
            }
         }
        
    }
};
module.exports = exports = Queue;
